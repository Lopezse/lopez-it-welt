/**
 * Retention Manager - Enterprise++ Standard P8-E
 * 
 * Retention-Policy-Management
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { Log } from "./types";

class RetentionManager {
  /**
   * Prüft, ob ein Log archiviert werden muss
   */
  async checkRetention(log: Log): Promise<boolean> {
    try {
      const now = new Date();
      const logAge = now.getTime() - log.timestamp.getTime();
      const daysOld = logAge / (1000 * 60 * 60 * 24);

      // Retention-Regeln gemäß P8-E-DATA-MODEL.md:
      // - Raw-Logs: 7 Tage
      // - Indexed-Logs: 30 Tage
      // - Archive-Logs: 365 Tage

      // Für Raw-Logs: nach 7 Tagen archivieren
      if (daysOld > 7) {
        return true;
      }

      return false;
    } catch (error) {
      logger.error("Fehler bei Retention-Prüfung", error);
      return false;
    }
  }

  /**
   * Archiviert ein Log
   */
  async archiveLog(log: Log): Promise<void> {
    try {
      // Importiere ArchiveManager dynamisch
      const { archiveManager } = await import("./ArchiveManager");
      await archiveManager.archiveLog(log);
    } catch (error) {
      logger.error("Fehler beim Archivieren des Logs", error);
      throw error;
    }
  }

  /**
   * Löscht ein Log (nach Retention-Policy)
   */
  async purgeLog(log: Log): Promise<void> {
    try {
      const connection = await getConnection();

      // Lösche Log aus allen Tabellen
      await connection.execute(`DELETE FROM orchestrator_logs WHERE id = ?`, [log.id]);
      await connection.execute(`DELETE FROM orchestrator_logs_indexed WHERE log_id = ?`, [log.id]);
      await connection.execute(`DELETE FROM orchestrator_logs_archive WHERE log_id = ?`, [log.id]);
      await connection.execute(`DELETE FROM orchestrator_logs_events WHERE log_id = ?`, [log.id]);

      logger.debug(`Log gelöscht: ${log.id}`);
    } catch (error) {
      logger.error("Fehler beim Löschen des Logs", error);
      throw error;
    }
  }

  /**
   * Führt Retention-Policy aus
   */
  async runRetentionPolicy(): Promise<void> {
    try {
      logger.info("Retention-Policy gestartet");

      const connection = await getConnection();

      // Hole Logs, die älter als 7 Tage sind (Raw-Logs)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [rows] = await connection.execute(
        `SELECT id, log_rule_id, log_level, category, severity, message, 
                context, metadata, timestamp, created_at
         FROM orchestrator_logs
         WHERE timestamp < ? AND id NOT IN (
           SELECT log_id FROM orchestrator_logs_archive
         )
         LIMIT 1000`,
        [sevenDaysAgo]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        logger.info(`${rows.length} Logs zur Archivierung gefunden`);

        // Importiere ArchiveManager dynamisch
        const { archiveManager } = await import("./ArchiveManager");

        for (const row of rows as any[]) {
          try {
            const log: Log = {
              id: row.id,
              log_rule_id: row.log_rule_id,
              log_level: row.log_level,
              category: row.category,
              severity: row.severity,
              message: row.message,
              context: row.context ? JSON.parse(row.context) : {},
              metadata: row.metadata ? JSON.parse(row.metadata) : {},
              timestamp: new Date(row.timestamp),
              created_at: new Date(row.created_at || row.timestamp),
            };

            await archiveManager.archiveLog(log);
          } catch (err) {
            logger.error(`Fehler beim Archivieren von Log ${row.id}`, err);
          }
        }
      }

      // Hole Indexed-Logs, die älter als 30 Tage sind
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [indexedRows] = await connection.execute(
        `SELECT id FROM orchestrator_logs_indexed
         WHERE timestamp < ?
         LIMIT 1000`,
        [thirtyDaysAgo]
      );

      if (Array.isArray(indexedRows) && indexedRows.length > 0) {
        logger.info(`${indexedRows.length} Indexed-Logs zur Archivierung gefunden`);
        // Indexed-Logs werden automatisch archiviert, wenn das zugehörige Raw-Log archiviert wird
      }

      logger.info("Retention-Policy abgeschlossen");
    } catch (error) {
      logger.error("Fehler bei Retention-Policy", error);
      throw error;
    }
  }
}

export const retentionManager = new RetentionManager();





