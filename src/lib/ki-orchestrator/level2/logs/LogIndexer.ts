/**
 * Log Indexer - Enterprise++ Standard P8-E
 * 
 * Log-Indexierung für Volltext-Suche
 */

import { logger } from "@/lib/logger";
import type { Log, IndexedLog } from "./types";
import { getConnection } from "@/lib/database";

class LogIndexer {
  /**
   * Indexiert ein Log
   */
  async indexLog(log: Log): Promise<IndexedLog> {
    try {
      // Erstelle Search-Vector
      const searchVector = await this.createSearchVector(log);

      // Extrahiere Tags
      const tags = await this.extractTags(log);

      // Erstelle Indexed-Log
      const indexedLog: IndexedLog = {
        id: `indexed-${log.id}`,
        log_id: log.id,
        log_rule_id: log.log_rule_id,
        log_level: log.log_level,
        category: log.category,
        severity: log.severity,
        message: log.message,
        message_normalized: log.message_normalized || log.message.toLowerCase(),
        tags: tags,
        extracted_fields: log.extracted_fields || {},
        search_vector: searchVector,
        timestamp: log.timestamp,
        created_at: log.created_at,
      };

      return indexedLog;
    } catch (error) {
      logger.error("Fehler beim Indexieren des Logs", error);
      throw error;
    }
  }

  /**
   * Erstellt einen Search-Vector für Volltext-Suche
   */
  async createSearchVector(log: Log): Promise<string> {
    const vectorParts: string[] = [];

    // Füge Message hinzu
    if (log.message_normalized) {
      vectorParts.push(log.message_normalized);
    } else if (log.message) {
      vectorParts.push(log.message.toLowerCase());
    }

    // Füge Tags hinzu
    if (log.tags && log.tags.length > 0) {
      vectorParts.push(...log.tags);
    }

    // Füge Category hinzu
    vectorParts.push(log.category.toLowerCase());

    // Füge Log-Level hinzu
    vectorParts.push(log.log_level.toLowerCase());

    // Füge Resource-Type hinzu (falls vorhanden)
    if (log.resource_type) {
      vectorParts.push(log.resource_type.toLowerCase());
    }

    // Füge Resource-ID hinzu (falls vorhanden)
    if (log.resource_id) {
      vectorParts.push(log.resource_id.toLowerCase());
    }

    // Füge extracted_fields hinzu (vereinfacht)
    if (log.extracted_fields) {
      for (const [key, value] of Object.entries(log.extracted_fields)) {
        if (typeof value === "string") {
          vectorParts.push(value.toLowerCase());
        }
      }
    }

    return vectorParts.join(" ");
  }

  /**
   * Extrahiert Tags aus einem Log
   */
  async extractTags(log: Log): Promise<string[]> {
    const tags = new Set<string>(log.tags || []);

    // Füge Category als Tag hinzu
    tags.add(log.category.toLowerCase());

    // Füge Log-Level als Tag hinzu
    tags.add(log.log_level.toLowerCase());

    // Füge Severity als Tag hinzu
    tags.add(log.severity);

    // Füge Log-Rule-ID als Tag hinzu
    tags.add(log.log_rule_id);

    return Array.from(tags);
  }

  /**
   * Baut Index auf (für Batch-Indexierung)
   * 
   * Indexiert alle nicht-indexierten Logs in orchestrator_logs
   */
  async buildIndex(): Promise<void> {
    try {
      logger.info("Index-Aufbau gestartet");

      // Importiere LogStorage dynamisch
      const { logStorage } = await import("./storage/LogStorage");

      // Hole alle Logs, die noch nicht indexiert sind
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `SELECT l.*
         FROM orchestrator_logs l
         LEFT JOIN orchestrator_logs_indexed li ON l.id = li.log_id
         WHERE li.id IS NULL
         ORDER BY l.timestamp DESC
         LIMIT 1000`
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        logger.info("Keine Logs zur Indexierung gefunden");
        return;
      }

      logger.info(`${rows.length} Logs zur Indexierung gefunden`);

      let indexedCount = 0;
      for (const row of rows as any[]) {
        try {
          // Erstelle Log-Objekt
          const log: Log = {
            id: row.id,
            log_rule_id: row.log_rule_id,
            log_level: row.log_level,
            category: row.category,
            severity: row.severity,
            message: row.message,
            context: row.context ? JSON.parse(row.context) : {},
            metadata: row.metadata ? JSON.parse(row.metadata) : {},
            correlation_id: row.correlation_id,
            user_id: row.user_id,
            session_id: row.session_id,
            ip_address: row.ip_address,
            user_agent: row.user_agent,
            request_id: row.request_id,
            resource_type: row.resource_type,
            resource_id: row.resource_id,
            timestamp: new Date(row.timestamp),
            created_at: new Date(row.created_at),
          };

          // Indexiere Log
          const indexedLog = await this.indexLog(log);

          // Speichere Indexed-Log
          await logStorage.saveIndexedLog(indexedLog);

          indexedCount++;
        } catch (err) {
          logger.error(`Fehler beim Indexieren von Log ${row.id}`, err);
        }
      }

      logger.info(`Index-Aufbau abgeschlossen: ${indexedCount} Logs indexiert`);
    } catch (error) {
      logger.error("Fehler beim Aufbau des Index", error);
      throw error;
    }
  }
}

export const logIndexer = new LogIndexer();

