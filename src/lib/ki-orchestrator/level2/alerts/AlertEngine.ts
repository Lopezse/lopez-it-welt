/**
 * Alert Engine - Orchestrator Level 2 P8-C
 * Enterprise++ Standard
 * 
 * Core alert processing engine
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { auditManager } from "../index";
import { matchRules, determineSeverity } from "./AlertRuleMatcher";
import type { OrchestratorEvent, Alert, AlertData, AlertSeverity, AlertCategory } from "../types";
import { createHash } from "crypto";

class AlertEngine {
  /**
   * Processes an event and creates alerts if rules match
   */
  async ingest(event: OrchestratorEvent): Promise<string[]> {
    const alertIds: string[] = [];

    try {
      // Match rules
      const matchedRules = matchRules(event);

      if (matchedRules.length === 0) {
        return alertIds;
      }

      // Create alerts for each matched rule
      for (const rule of matchedRules) {
        const severity = determineSeverity(rule, event);
        const alertData: AlertData = {
          alert_rule_id: rule.id,
          category: rule.category as AlertCategory,
          severity,
          title: this.generateTitle(rule, event),
          description: rule.description || `Alert triggered by ${event.event_type}`,
          payload: this.sanitizePayload(event.details || {}),
          event_type: event.event_type,
          resource_type: event.resource_type,
          resource_id: event.resource_id,
        };

        const alertId = await this.createAlert(alertData);
        alertIds.push(alertId);

        // Log audit event
        await auditManager.logEvent({
          event_type: "ALERT_CREATED",
          resource_type: "alert",
          resource_id: alertId,
          details: {
            alert_rule_id: rule.id,
            severity,
            category: rule.category,
          },
        });
      }

      return alertIds;
    } catch (error) {
      logger.error("Fehler beim Verarbeiten von Alert-Event", error);
      throw error;
    }
  }

  /**
   * Creates a new alert
   */
  async createAlert(alertData: AlertData): Promise<string> {
    try {
      const connection = await getConnection();
      const alertId = this.generateId();
      const triggeredAt = new Date().toISOString();

      // Generate audit hash
      const auditHash = this.generateHash({
        alert_rule_id: alertData.alert_rule_id,
        category: alertData.category,
        severity: alertData.severity,
        title: alertData.title,
        triggered_at: triggeredAt,
      });

      await connection.execute(
        `INSERT INTO orchestrator_alerts 
         (id, alert_rule_id, category, severity, status, title, description, payload, 
          event_type, resource_type, resource_id, triggered_at, audit_hash)
         VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alertId,
          alertData.alert_rule_id,
          alertData.category,
          alertData.severity,
          alertData.title,
          alertData.description || null,
          JSON.stringify(alertData.payload || {}),
          alertData.event_type || null,
          alertData.resource_type || null,
          alertData.resource_id || null,
          triggeredAt,
          auditHash,
        ]
      );

      logger.info(`Alert erstellt: ${alertId} (Rule: ${alertData.alert_rule_id})`);

      return alertId;
    } catch (error) {
      logger.error("Fehler beim Erstellen des Alerts", error);
      throw error;
    }
  }

  /**
   * Evaluates alert and determines if escalation is needed
   */
  async evaluate(alertId: string): Promise<boolean> {
    try {
      const alert = await this.getAlert(alertId);
      if (!alert) {
        return false;
      }

      // Critical alerts should be escalated automatically
      if (alert.severity === "critical" && alert.status === "open") {
        return true;
      }

      // Warning alerts after 15 minutes
      if (alert.severity === "warning" && alert.status === "open") {
        const triggeredAt = new Date(alert.triggered_at);
        const now = new Date();
        const minutesSinceTrigger = (now.getTime() - triggeredAt.getTime()) / (1000 * 60);
        return minutesSinceTrigger >= 15;
      }

      return false;
    } catch (error) {
      logger.error("Fehler beim Evaluieren des Alerts", error);
      return false;
    }
  }

  /**
   * Routes alert to appropriate handler
   */
  async route(alertId: string): Promise<void> {
    try {
      const shouldEscalate = await this.evaluate(alertId);
      if (shouldEscalate) {
        // Auto-escalate critical alerts
        await this.escalate(alertId, "system", "Automatische Eskalation aufgrund von Severity");
      }
    } catch (error) {
      logger.error("Fehler beim Routen des Alerts", error);
    }
  }

  /**
   * Gets alert by ID
   */
  async getAlert(alertId: string): Promise<Alert | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute<Alert[]>(
        `SELECT * FROM orchestrator_alerts WHERE id = ?`,
        [alertId]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const alert = rows[0];
        // Parse JSON fields
        if (typeof alert.payload === "string") {
          alert.payload = JSON.parse(alert.payload);
        }
        return alert;
      }

      return null;
    } catch (error) {
      logger.error("Fehler beim Abrufen des Alerts", error);
      return null;
    }
  }

  /**
   * Acknowledges an alert
   */
  async acknowledge(alertId: string, acknowledgedBy: string): Promise<void> {
    try {
      const connection = await getConnection();
      const acknowledgedAt = new Date().toISOString();

      await connection.execute(
        `UPDATE orchestrator_alerts 
         SET status = 'acknowledged', acknowledged_at = ?, acknowledged_by = ?
         WHERE id = ?`,
        [acknowledgedAt, acknowledgedBy, alertId]
      );

      await auditManager.logEvent({
        event_type: "ALERT_ACKNOWLEDGED",
        resource_type: "alert",
        resource_id: alertId,
        details: { acknowledged_by: acknowledgedBy },
      });

      logger.info(`Alert bestätigt: ${alertId}`);
    } catch (error) {
      logger.error("Fehler beim Bestätigen des Alerts", error);
      throw error;
    }
  }

  /**
   * Escalates an alert (creates incident)
   */
  async escalate(alertId: string, escalatedBy: string, reason: string): Promise<string | null> {
    try {
      const connection = await getConnection();
      const escalatedAt = new Date().toISOString();

      // Update alert status
      await connection.execute(
        `UPDATE orchestrator_alerts 
         SET status = 'escalated', escalated_at = ?, escalated_by = ?
         WHERE id = ?`,
        [escalatedAt, escalatedBy, alertId]
      );

      // Get alert to determine severity
      const alert = await this.getAlert(alertId);
      if (!alert) {
        return null;
      }

      // Import incident manager dynamically to avoid circular dependency
      const { incidentManager } = await import("../incidents/IncidentManager");

      // Create incident from alert
      const incidentId = await incidentManager.createIncidentFromAlert(alert, reason);

      // Link alert to incident
      await connection.execute(
        `UPDATE orchestrator_alerts SET incident_id = ? WHERE id = ?`,
        [incidentId, alertId]
      );

      await auditManager.logEvent({
        event_type: "ALERT_ESCALATED",
        resource_type: "alert",
        resource_id: alertId,
        details: {
          incident_id: incidentId,
          reason,
          escalated_by: escalatedBy,
        },
      });

      logger.info(`Alert eskaliert: ${alertId} -> Incident: ${incidentId}`);

      return incidentId;
    } catch (error) {
      logger.error("Fehler beim Eskalieren des Alerts", error);
      throw error;
    }
  }

  /**
   * Closes an alert
   */
  async close(alertId: string, closedBy: string): Promise<void> {
    try {
      const connection = await getConnection();
      const closedAt = new Date().toISOString();

      await connection.execute(
        `UPDATE orchestrator_alerts 
         SET status = 'closed', closed_at = ?, closed_by = ?
         WHERE id = ?`,
        [closedAt, closedBy, alertId]
      );

      await auditManager.logEvent({
        event_type: "ALERT_CLOSED",
        resource_type: "alert",
        resource_id: alertId,
        details: { closed_by: closedBy },
      });

      logger.info(`Alert geschlossen: ${alertId}`);
    } catch (error) {
      logger.error("Fehler beim Schließen des Alerts", error);
      throw error;
    }
  }

  /**
   * Lists alerts with filters
   */
  async listAlerts(filters: {
    status?: string;
    severity?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ alerts: Alert[]; total: number }> {
    try {
      const connection = await getConnection();
      let query = `SELECT * FROM orchestrator_alerts WHERE 1=1`;
      const params: unknown[] = [];

      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      if (filters.severity) {
        query += ` AND severity = ?`;
        params.push(filters.severity);
      }

      if (filters.category) {
        query += ` AND category = ?`;
        params.push(filters.category);
      }

      // Get total count
      const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
      const [countRows] = await connection.execute<{ total: number }[]>(countQuery, params);
      const total = Array.isArray(countRows) && countRows.length > 0 ? countRows[0].total : 0;

      // Apply pagination
      query += ` ORDER BY triggered_at DESC`;
      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(filters.limit);
        if (filters.offset) {
          query += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }

      const [rows] = await connection.execute<Alert[]>(query, params);

      const alerts = Array.isArray(rows) ? rows.map((alert) => {
        if (typeof alert.payload === "string") {
          alert.payload = JSON.parse(alert.payload);
        }
        return alert;
      }) : [];

      return { alerts, total };
    } catch (error) {
      logger.error("Fehler beim Abrufen der Alerts", error);
      throw error;
    }
  }

  /**
   * Sanitizes payload to remove personal data (DSGVO compliance)
   */
  private sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const pdFields = ["user_id", "email", "phone", "name", "address", "ip_address", "session_id"];

    for (const [key, value] of Object.entries(payload)) {
      if (pdFields.includes(key.toLowerCase())) {
        // Pseudonymize instead of removing
        sanitized[key] = `[REDACTED]`;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Generates alert title
   */
  private generateTitle(rule: { id: string; description?: string }, event: OrchestratorEvent): string {
    return rule.description || `${rule.id}: ${event.event_type}`;
  }

  /**
   * Generates unique ID
   */
  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generates audit hash
   */
  private generateHash(data: Record<string, unknown>): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return createHash("sha256").update(dataString).digest("hex");
  }
}

export const alertEngine = new AlertEngine();

