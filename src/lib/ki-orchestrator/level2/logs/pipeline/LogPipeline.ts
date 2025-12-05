/**
 * Log Pipeline - Enterprise++ Standard P8-E
 * 
 * Log-Pipeline (Level 1 → Level 3)
 * Collection → Processing → Storage
 */

import { logger } from "@/lib/logger";
import { logParser } from "../LogParser";
import { logEnricher } from "../LogEnricher";
import { logIndexer } from "../LogIndexer";
import { logFilter } from "../LogFilter";
import { retentionManager } from "../RetentionManager";
import { logStorage } from "../storage/LogStorage";
import { getLogRule, matchesLogRule } from "../LogRuleRegistry";
import type { RawLog, Log } from "../types";

class LogPipeline {
  /**
   * Verarbeitet ein Raw-Log durch die Pipeline
   */
  async processLog(rawLog: RawLog): Promise<Log> {
    try {
      // Level 2: Processing
      // 1. Parse Log
      let log = await logParser.parseLog(rawLog);

      // 2. Enrich Log
      log = await logEnricher.enrichLog(log);

      // 3. Index Log
      const indexedLog = await logIndexer.indexLog(log);

      // 4. Filter PD (DSGVO-Compliance)
      log = await logFilter.filterPD(log);
      log = await logFilter.removeSensitiveData(log);

      // Level 3: Storage
      // 5. Save Log
      await logStorage.saveLog(log);

      // 6. Save Indexed-Log
      await logStorage.saveIndexedLog(indexedLog);

      // 7. Check Retention
      const shouldArchive = await retentionManager.checkRetention(log);
      if (shouldArchive) {
        await retentionManager.archiveLog(log);
      }

      // Integration mit P8-C (AlertEngine)
      await this.triggerAlerts(log);

      // Integration mit P8-D (TelemetryCollector)
      await this.correlateWithMetrics(log);

      logger.debug(`Log verarbeitet: ${log.id}`);
      return log;
    } catch (error) {
      logger.error(`Fehler bei der Verarbeitung des Logs ${rawLog.id}`, error);
      throw error;
    }
  }

  /**
   * Verarbeitet einen Batch von Raw-Logs
   */
  async processBatch(rawLogs: RawLog[]): Promise<Log[]> {
    const processedLogs: Log[] = [];

    for (const rawLog of rawLogs) {
      try {
        const log = await this.processLog(rawLog);
        processedLogs.push(log);
      } catch (error) {
        logger.error(`Fehler bei der Verarbeitung des Logs ${rawLog.id}`, error);
        // Weiter mit nächstem Log
      }
    }

    return processedLogs;
  }

  /**
   * Löst Alerts aus (Integration mit P8-C)
   */
  private async triggerAlerts(log: Log): Promise<void> {
    try {
      // Prüfe Log-Regel
      const logRule = getLogRule(log.log_rule_id);
      if (!logRule) {
        return; // Unbekannte Log-Regel
      }

      // Prüfe, ob Log der Regel entspricht
      if (!matchesLogRule(log, logRule)) {
        return; // Log entspricht nicht der Regel
      }

      // Prüfe Severity
      if (log.severity !== "critical" && log.severity !== "warning") {
        return; // Nur critical/warning Logs lösen Alerts aus
      }

      // Prüfe, ob Alert-Integration aktiviert ist
      if (!logRule.alert_rule_id) {
        return; // Keine Alert-Regel für diese Log-Regel
      }

      // Importiere AlertEngine dynamisch
      const { alertEngine } = await import("@/lib/ki-orchestrator/level2");

      // Verwende Alert-Rule-ID aus Log-Regel
      const alertRuleId = logRule.alert_rule_id;

      // Erstelle Alert
      await alertEngine.createAlert({
        alert_rule_id: alertRuleId,
        category: this.mapCategoryToAlertCategory(log.category),
        severity: log.severity === "critical" ? "critical" : "warning",
        title: `${logRule.name}: ${log.message.substring(0, 100)}`,
        description: `${logRule.description} (Log-Regel: ${log.log_rule_id})`,
        payload: {
          log_id: log.id,
          log_rule_id: log.log_rule_id,
          category: log.category,
          severity: log.severity,
          message: log.message,
          // Keine PD im Payload
        },
        event_type: `LOG_${log.log_rule_id}`,
        resource_type: log.resource_type,
        resource_id: log.resource_id,
      });

      logger.debug(`Alert erstellt für Log: ${log.id}`);
    } catch (error) {
      logger.error("Fehler beim Erstellen des Alerts", error);
      // Nicht werfen, da Alert-Erstellung nicht kritisch sein sollte
    }
  }

  /**
   * Korreliert Logs mit Metriken (Integration mit P8-D)
   */
  private async correlateWithMetrics(log: Log): Promise<void> {
    try {
      // Importiere TelemetryCollector dynamisch
      const { telemetryCollector } = await import("@/lib/telemetry/TelemetryCollector");
      const { getMetricDefinition } = await import("@/lib/telemetry/TelemetryRegistry");

      // Korreliere basierend auf Category
      if (log.category === "API") {
        // API-Logs korrelieren mit API-Metriken
        // Beispiel: Error-Log → API Error Rate Metrik
        if (log.severity === "critical" || log.severity === "warning") {
          const metricDef = getMetricDefinition("API-005"); // API Error Rate
          if (metricDef) {
            await telemetryCollector.recordMetric({
              metric_id: "API-005",
              metric_name: metricDef.name,
              category: "api",
              value: 1, // Increment Error Count
              unit: "count",
              priority: metricDef.priority,
              severity: log.severity,
              source: "log-pipeline",
              metric_timestamp: log.timestamp,
              tags: {
                log_id: log.id,
                log_rule_id: log.log_rule_id,
              },
            });
          }
        }
      } else if (log.category === "Queue") {
        // Queue-Logs korrelieren mit Queue-Metriken
        // Beispiel: Failed Task Log → Queue Failed Tasks Metrik
        if (log.severity === "critical" || log.severity === "warning") {
          const metricDef = getMetricDefinition("QUEUE-005"); // Queue Failed Tasks
          if (metricDef) {
            await telemetryCollector.recordMetric({
              metric_id: "QUEUE-005",
              metric_name: metricDef.name,
              category: "queue",
              value: 1, // Increment Failed Tasks Count
              unit: "tasks",
              priority: metricDef.priority,
              severity: log.severity,
              source: "log-pipeline",
              metric_timestamp: log.timestamp,
              tags: {
                log_id: log.id,
                log_rule_id: log.log_rule_id,
              },
            });
          }
        }
      } else if (log.category === "Orchestrator") {
        // Orchestrator-Logs korrelieren mit Orchestrator-Metriken
        // Beispiel: P7-Approval Block Log → P7-Approval Block Rate Metrik
        if (log.log_rule_id.includes("P7") || log.log_rule_id.includes("APPROVAL")) {
          const metricDef = getMetricDefinition("ORCH-006"); // P7-Approval Block Rate
          if (metricDef) {
            await telemetryCollector.recordMetric({
              metric_id: "ORCH-006",
              metric_name: metricDef.name,
              category: "orchestrator",
              value: 1, // Increment Block Count
              unit: "percent",
              priority: metricDef.priority,
              severity: log.severity,
              source: "log-pipeline",
              metric_timestamp: log.timestamp,
              tags: {
                log_id: log.id,
                log_rule_id: log.log_rule_id,
              },
            });
          }
        }
      }

      logger.debug(`Log korreliert mit Metriken: ${log.id}`);
    } catch (error) {
      logger.error("Fehler bei Metriken-Korrelation", error);
      // Nicht werfen, da Metriken-Korrelation nicht kritisch sein sollte
    }
  }

  /**
   * Mappt Log-Rule-ID zu Alert-Rule-ID
   */
  private mapLogRuleToAlertRule(logRuleId: string): string | null {
    // Vereinfachtes Mapping
    // In einer echten Implementierung würde man eine Mapping-Tabelle verwenden
    if (logRuleId.startsWith("SEC-LOG-")) {
      return logRuleId.replace("SEC-LOG-", "SEC-");
    }
    if (logRuleId.startsWith("API-LOG-")) {
      return logRuleId.replace("API-LOG-", "API-");
    }
    if (logRuleId.startsWith("QUEUE-LOG-")) {
      return logRuleId.replace("QUEUE-LOG-", "QUEUE-");
    }
    // Fallback: Keine Alert-Rule
    return null;
  }

  /**
   * Mappt Log-Category zu Alert-Category
   */
  private mapCategoryToAlertCategory(category: Log["category"]): "Systemintegrität" | "Performance" | "Sicherheit" | "Compliance" | "Datenqualität" {
    const categoryMap: Record<Log["category"], "Systemintegrität" | "Performance" | "Sicherheit" | "Compliance" | "Datenqualität"> = {
      Security: "Sicherheit",
      API: "Performance",
      Queue: "Performance",
      Orchestrator: "Systemintegrität",
      Workflow: "Systemintegrität",
      DSGVO: "Compliance",
      Audit: "Compliance",
      System: "Systemintegrität",
      "Media-KI": "Datenqualität",
      Database: "Performance",
      Cache: "Performance",
    };

    return categoryMap[category] || "Systemintegrität";
  }
}

export const logPipeline = new LogPipeline();

