/**
 * Incident Manager - Orchestrator Level 2 P8-C
 * Enterprise++ Standard
 * 
 * Manages incident lifecycle
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { auditManager } from "../index";
import type {
  Incident,
  IncidentData,
  IncidentEvent,
  IncidentEventType,
  ResolutionData,
  Alert,
  IncidentSeverity,
} from "../types";
import { createHash } from "crypto";
import type { RowDataPacket } from "mysql2";

class IncidentManager {
  /**
   * Creates a new incident
   */
  async createIncident(incidentData: IncidentData, openedBy: string): Promise<string> {
    try {
      const connection = await getConnection();
      const incidentId = this.generateId();
      const openedAt = new Date().toISOString();
      const slaMinutes = incidentData.sla_minutes || this.getSLAMinutes(incidentData.severity);
      const slaStartedAt = openedAt;

      // Calculate SLA warning and breach times
      const slaWarningAt = new Date(Date.now() + (slaMinutes * 0.8 * 60 * 1000)).toISOString();

      // Generate audit hash
      const auditHash = this.generateHash({
        title: incidentData.title,
        severity: incidentData.severity,
        opened_at: openedAt,
        opened_by: openedBy,
      });

      await connection.execute(
        `INSERT INTO orchestrator_incidents 
         (id, title, description, severity, status, sla_minutes, sla_started_at, 
          sla_warning_at, opened_at, opened_by, escalation_level, audit_hash)
         VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, 1, ?)`,
        [
          incidentId,
          incidentData.title,
          incidentData.description || null,
          incidentData.severity,
          slaMinutes,
          slaStartedAt,
          slaWarningAt,
          openedAt,
          openedBy,
          auditHash,
        ]
      );

      // Link alerts if provided
      if (incidentData.alert_ids && incidentData.alert_ids.length > 0) {
        await connection.execute(
          `UPDATE orchestrator_alerts SET incident_id = ? WHERE id IN (${incidentData.alert_ids.map(() => "?").join(",")})`,
          [incidentId, ...incidentData.alert_ids]
        );
      }

      // Create incident event
      await this.createIncidentEvent(incidentId, "INCIDENT_OPENED", openedBy, {
        alert_ids: incidentData.alert_ids || [],
        severity: incidentData.severity,
      });

      await auditManager.logEvent({
        event_type: "INCIDENT_CREATED",
        resource_type: "incident",
        resource_id: incidentId,
        details: {
          severity: incidentData.severity,
          opened_by: openedBy,
        },
      });

      logger.info(`Incident erstellt: ${incidentId}`);

      return incidentId;
    } catch (error) {
      logger.error("Fehler beim Erstellen des Incidents", error);
      throw error;
    }
  }

  /**
   * Creates incident from alert (escalation)
   */
  async createIncidentFromAlert(alert: Alert, reason: string): Promise<string> {
    const incidentData: IncidentData = {
      title: `Eskaliert: ${alert.title}`,
      description: `${alert.description || ""}\n\nGrund: ${reason}`,
      severity: alert.severity as IncidentSeverity,
      alert_ids: [alert.id],
      sla_minutes: this.getSLAMinutes(alert.severity as IncidentSeverity),
    };

    return this.createIncident(incidentData, alert.escalated_by || "system");
  }

  /**
   * Gets incident by ID
   */
  async getIncident(incidentId: string): Promise<Incident | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM orchestrator_incidents WHERE id = ?`,
        [incidentId]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as Incident;
      }

      return null;
    } catch (error) {
      logger.error("Fehler beim Abrufen des Incidents", error);
      return null;
    }
  }

  /**
   * Updates incident status
   */
  async updateStatus(
    incidentId: string,
    status: "investigating" | "resolved" | "closed",
    updatedBy: string
  ): Promise<void> {
    try {
      const connection = await getConnection();
      const now = new Date().toISOString();

      let updateQuery = `UPDATE orchestrator_incidents SET status = ?, updated_at = ?`;
      const params: unknown[] = [status, now];

      if (status === "resolved") {
        updateQuery += `, resolved_at = ?, resolved_by = ?`;
        params.push(now, updatedBy);
      } else if (status === "closed") {
        updateQuery += `, closed_at = ?, closed_by = ?`;
        params.push(now, updatedBy);
      }

      updateQuery += ` WHERE id = ?`;
      params.push(incidentId);

      await connection.execute(updateQuery, params);

      // Create incident event
      const eventType: IncidentEventType =
        status === "investigating"
          ? "INCIDENT_INVESTIGATING"
          : status === "resolved"
          ? "INCIDENT_RESOLVED"
          : "INCIDENT_CLOSED";

      await this.createIncidentEvent(incidentId, eventType, updatedBy, { status });

      logger.info(`Incident Status aktualisiert: ${incidentId} -> ${status}`);
    } catch (error) {
      logger.error("Fehler beim Aktualisieren des Incident-Status", error);
      throw error;
    }
  }

  /**
   * Resolves an incident
   */
  async resolve(incidentId: string, resolutionData: ResolutionData, resolvedBy: string): Promise<void> {
    try {
      const connection = await getConnection();
      const resolvedAt = new Date().toISOString();

      await connection.execute(
        `UPDATE orchestrator_incidents 
         SET status = 'resolved', resolved_at = ?, resolved_by = ?, 
             resolution = ?, root_cause = ?
         WHERE id = ?`,
        [
          resolvedAt,
          resolvedBy,
          resolutionData.resolution,
          resolutionData.root_cause || null,
          incidentId,
        ]
      );

      // Create incident event
      await this.createIncidentEvent(incidentId, "INCIDENT_RESOLVED", resolvedBy, {
        resolution: resolutionData.resolution,
        root_cause: resolutionData.root_cause,
      });

      await auditManager.logEvent({
        event_type: "INCIDENT_RESOLVED",
        resource_type: "incident",
        resource_id: incidentId,
        details: {
          resolved_by: resolvedBy,
          resolution: resolutionData.resolution,
        },
      });

      logger.info(`Incident aufgelöst: ${incidentId}`);
    } catch (error) {
      logger.error("Fehler beim Auflösen des Incidents", error);
      throw error;
    }
  }

  /**
   * Escalates an incident
   */
  async escalate(incidentId: string, escalationLevel: number, escalatedBy: string): Promise<void> {
    try {
      const connection = await getConnection();

      if (escalationLevel < 1 || escalationLevel > 3) {
        throw new Error("Escalation level must be between 1 and 3");
      }

      await connection.execute(
        `UPDATE orchestrator_incidents SET escalation_level = ? WHERE id = ?`,
        [escalationLevel, incidentId]
      );

      // Create incident event
      await this.createIncidentEvent(incidentId, "INCIDENT_ESCALATED", escalatedBy, {
        escalation_level: escalationLevel,
      });

      await auditManager.logEvent({
        event_type: "INCIDENT_ESCALATED",
        resource_type: "incident",
        resource_id: incidentId,
        details: {
          escalation_level: escalationLevel,
          escalated_by: escalatedBy,
        },
      });

      logger.info(`Incident eskaliert: ${incidentId} -> Level ${escalationLevel}`);
    } catch (error) {
      logger.error("Fehler beim Eskalieren des Incidents", error);
      throw error;
    }
  }

  /**
   * Creates an incident event
   */
  async createIncidentEvent(
    incidentId: string,
    eventType: IncidentEventType,
    performedBy: string,
    eventData?: Record<string, unknown>
  ): Promise<string> {
    try {
      const connection = await getConnection();
      const eventId = this.generateId();
      const performedAt = new Date().toISOString();

      // Generate audit hash
      const auditHash = this.generateHash({
        incident_id: incidentId,
        event_type: eventType,
        performed_by: performedBy,
        performed_at: performedAt,
        event_data: eventData,
      });

      await connection.execute(
        `INSERT INTO orchestrator_incident_events 
         (id, incident_id, event_type, event_data, performed_by, performed_at, audit_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          eventId,
          incidentId,
          eventType,
          JSON.stringify(eventData || {}),
          performedBy,
          performedAt,
          auditHash,
        ]
      );

      return eventId;
    } catch (error) {
      logger.error("Fehler beim Erstellen des Incident-Events", error);
      throw error;
    }
  }

  /**
   * Gets incident events (timeline)
   */
  async getIncidentEvents(incidentId: string): Promise<IncidentEvent[]> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM orchestrator_incident_events 
         WHERE incident_id = ? 
         ORDER BY performed_at ASC`,
        [incidentId]
      );

      const events = Array.isArray(rows)
        ? rows.map((row) => {
            const event = row as IncidentEvent;
            if (typeof event.event_data === "string") {
              event.event_data = JSON.parse(event.event_data);
            }
            return event;
          })
        : [];

      return events;
    } catch (error) {
      logger.error("Fehler beim Abrufen der Incident-Events", error);
      return [];
    }
  }

  /**
   * Lists incidents with filters
   */
  async listIncidents(filters: {
    status?: string;
    severity?: string;
    assigned_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ incidents: Incident[]; total: number }> {
    try {
      const connection = await getConnection();
      let query = `SELECT * FROM orchestrator_incidents WHERE 1=1`;
      const params: unknown[] = [];

      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      if (filters.severity) {
        query += ` AND severity = ?`;
        params.push(filters.severity);
      }

      if (filters.assigned_to) {
        query += ` AND assigned_to = ?`;
        params.push(filters.assigned_to);
      }

      // Get total count
      const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
      const [countRows] = await connection.execute<RowDataPacket[]>(countQuery, params);
      const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as { total: number }).total : 0;

      // Apply pagination
      query += ` ORDER BY opened_at DESC`;
      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(filters.limit);
        if (filters.offset) {
          query += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }

      const [rows] = await connection.execute<RowDataPacket[]>(query, params);

      return {
        incidents: Array.isArray(rows) ? (rows as Incident[]) : [],
        total,
      };
    } catch (error) {
      logger.error("Fehler beim Abrufen der Incidents", error);
      throw error;
    }
  }

  /**
   * Tracks SLA status
   */
  async trackSLA(incidentId: string): Promise<{
    sla_minutes: number;
    sla_started_at: string;
    sla_warning_at: string | null;
    sla_breached_at: string | null;
    time_remaining_minutes: number;
    status: "ok" | "warning" | "breached";
  }> {
    try {
      const incident = await this.getIncident(incidentId);
      if (!incident) {
        throw new Error("Incident not found");
      }

      const now = new Date();
      const startedAt = new Date(incident.sla_started_at);
      const elapsedMinutes = (now.getTime() - startedAt.getTime()) / (1000 * 60);
      const remainingMinutes = incident.sla_minutes - elapsedMinutes;

      let status: "ok" | "warning" | "breached" = "ok";
      let slaBreachedAt: string | null = null;

      if (remainingMinutes <= 0) {
        status = "breached";
        slaBreachedAt = now.toISOString();

        // Update incident if not already breached
        if (!incident.sla_breached_at) {
          const connection = await getConnection();
          await connection.execute(
            `UPDATE orchestrator_incidents SET sla_breached_at = ? WHERE id = ?`,
            [slaBreachedAt, incidentId]
          );
        }
      } else if (remainingMinutes <= incident.sla_minutes * 0.2) {
        status = "warning";
      }

      return {
        sla_minutes: incident.sla_minutes,
        sla_started_at: incident.sla_started_at,
        sla_warning_at: incident.sla_warning_at ?? null,
        sla_breached_at: slaBreachedAt || (incident.sla_breached_at ?? null),
        time_remaining_minutes: Math.max(0, remainingMinutes),
        status,
      };
    } catch (error) {
      logger.error("Fehler beim SLA-Tracking", error);
      throw error;
    }
  }

  /**
   * Gets SLA minutes based on severity
   */
  private getSLAMinutes(severity: IncidentSeverity): number {
    switch (severity) {
      case "critical":
        return 15; // 15 minutes for critical
      case "warning":
        return 60; // 1 hour for warning
      case "info":
        return 240; // 4 hours for info
      default:
        return 60;
    }
  }

  /**
   * Generates unique ID
   */
  private generateId(): string {
    return `incident-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generates audit hash
   */
  private generateHash(data: Record<string, unknown>): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return createHash("sha256").update(dataString).digest("hex");
  }
}

export const incidentManager = new IncidentManager();





