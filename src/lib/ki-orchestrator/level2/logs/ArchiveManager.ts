/**
 * Archive Manager - Enterprise++ Standard P8-E
 * 
 * Archive-Management (Kompression, Langzeit-Speicherung)
 */

import { gzip } from "zlib";
import { promisify } from "util";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { Log, ArchivedLog, CompressedLog, ArchiveStats } from "./types";

const gzipAsync = promisify(gzip);

class ArchiveManager {
  /**
   * Archiviert ein Log
   */
  async archiveLog(log: Log): Promise<void> {
    try {
      const connection = await getConnection();

      // Komprimiere Log
      const compressed = await this.compressLog(log);

      // Speichere in Archive-Tabelle
      const archiveId = `archive-${log.id}`;
      const compressionRatio = (compressed.compressed_size / compressed.original_size) * 100;

      await connection.execute(
        `INSERT INTO orchestrator_logs_archive 
         (id, log_id, log_rule_id, log_level, category, severity, message, 
          context, metadata, compressed_data, compression_ratio, archived_at, original_timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          archiveId,
          log.id,
          log.log_rule_id,
          log.log_level,
          log.category,
          log.severity,
          log.message,
          JSON.stringify(log.context || {}),
          JSON.stringify(log.metadata || {}),
          compressed.compressed_data,
          compressionRatio.toFixed(2),
          new Date(),
          log.timestamp,
          log.created_at,
        ]
      );

      logger.debug(`Log archiviert: ${log.id} (Kompression: ${compressionRatio.toFixed(2)}%)`);
    } catch (error) {
      logger.error("Fehler beim Archivieren des Logs", error);
      throw error;
    }
  }

  /**
   * Komprimiert ein Log
   */
  async compressLog(log: Log): Promise<CompressedLog> {
    try {
      // Erstelle JSON-String aus Log
      const logJson = JSON.stringify({
        id: log.id,
        log_rule_id: log.log_rule_id,
        log_level: log.log_level,
        category: log.category,
        severity: log.severity,
        message: log.message,
        context: log.context,
        metadata: log.metadata,
        timestamp: log.timestamp.toISOString(),
      });

      const originalSize = Buffer.byteLength(logJson, "utf8");

      // Komprimiere mit GZIP
      const compressedData = await gzipAsync(Buffer.from(logJson, "utf8"));
      const compressedSize = compressedData.length;

      const compressionRatio = (compressedSize / originalSize) * 100;

      return {
        log_id: log.id,
        compressed_data: compressedData,
        compression_ratio: compressionRatio,
        original_size: originalSize,
        compressed_size: compressedSize,
      };
    } catch (error) {
      logger.error("Fehler beim Komprimieren des Logs", error);
      throw error;
    }
  }

  /**
   * Stellt ein Log aus dem Archiv wieder her
   */
  async restoreLog(logId: string): Promise<Log | null> {
    try {
      const connection = await getConnection();

      const [rows] = await connection.execute(
        `SELECT 
          id, log_id, log_rule_id, log_level, category, severity, message,
          context, metadata, original_timestamp, created_at
         FROM orchestrator_logs_archive
         WHERE log_id = ?
         ORDER BY archived_at DESC
         LIMIT 1`,
        [logId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return null;
      }

      const row = rows[0] as any;

      // Dekomprimiere Log (vereinfacht, da wir bereits die Felder haben)
      const log: Log = {
        id: row.log_id,
        log_rule_id: row.log_rule_id,
        log_level: row.log_level,
        category: row.category,
        severity: row.severity,
        message: row.message,
        context: row.context ? JSON.parse(row.context) : {},
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        timestamp: new Date(row.original_timestamp),
        created_at: new Date(row.created_at),
      };

      return log;
    } catch (error) {
      logger.error("Fehler beim Wiederherstellen des Logs", error);
      return null;
    }
  }

  /**
   * Ruft Archive-Statistiken ab
   */
  async getArchiveStats(): Promise<ArchiveStats> {
    try {
      const connection = await getConnection();

      const [rows] = await connection.execute(
        `SELECT 
          COUNT(*) as total_logs,
          SUM(LENGTH(compressed_data)) as total_compressed_size,
          AVG(compression_ratio) as avg_compression_ratio,
          MIN(original_timestamp) as oldest_log,
          MAX(original_timestamp) as newest_log
         FROM orchestrator_logs_archive`
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return {
          total_logs: 0,
          total_size: 0,
          compressed_size: 0,
          compression_ratio: 0,
          oldest_log: new Date(),
          newest_log: new Date(),
        };
      }

      const row = rows[0] as any;

      // Geschätzte Original-Größe (vereinfacht)
      const totalSize = row.total_compressed_size / (row.avg_compression_ratio / 100);

      return {
        total_logs: parseInt(row.total_logs) || 0,
        total_size: totalSize || 0,
        compressed_size: parseInt(row.total_compressed_size) || 0,
        compression_ratio: parseFloat(row.avg_compression_ratio) || 0,
        oldest_log: row.oldest_log ? new Date(row.oldest_log) : new Date(),
        newest_log: row.newest_log ? new Date(row.newest_log) : new Date(),
      };
    } catch (error) {
      logger.error("Fehler beim Abrufen der Archive-Statistiken", error);
      return {
        total_logs: 0,
        total_size: 0,
        compressed_size: 0,
        compression_ratio: 0,
        oldest_log: new Date(),
        newest_log: new Date(),
      };
    }
  }
}

export const archiveManager = new ArchiveManager();





