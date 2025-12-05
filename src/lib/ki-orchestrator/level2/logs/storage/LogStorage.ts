/**
 * Log Storage - Enterprise++ Standard P8-E
 * 
 * Log-Speicherung in Datenbank
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { Log, IndexedLog, ArchivedLog, SearchQuery } from "../types";

class LogStorage {
  /**
   * Speichert ein Log in orchestrator_logs
   */
  async saveLog(log: Log): Promise<void> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `INSERT INTO orchestrator_logs 
         (id, log_rule_id, log_level, category, severity, message, context, metadata,
          correlation_id, user_id, session_id, ip_address, user_agent, request_id,
          resource_type, resource_id, timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id,
          log.log_rule_id,
          log.log_level,
          log.category,
          log.severity,
          log.message,
          JSON.stringify(log.context || {}),
          JSON.stringify(log.metadata || {}),
          log.correlation_id || null,
          null, // DSGVO: user_id wird NICHT gespeichert
          null, // DSGVO: session_id wird NICHT gespeichert
          null, // DSGVO: ip_address wird NICHT gespeichert
          log.user_agent || null,
          log.request_id || null,
          log.resource_type || null,
          log.resource_id || null,
          log.timestamp,
          log.created_at,
        ]
      );

      logger.debug(`Log gespeichert: ${log.id}`);
    } catch (error) {
      logger.error(`Fehler beim Speichern des Logs ${log.id}`, error);
      throw error;
    }
  }

  /**
   * Speichert ein Indexed-Log in orchestrator_logs_indexed
   */
  async saveIndexedLog(indexedLog: IndexedLog): Promise<void> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `INSERT INTO orchestrator_logs_indexed 
         (id, log_id, log_rule_id, log_level, category, severity, message, message_normalized,
          tags, extracted_fields, search_vector, timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          indexedLog.id,
          indexedLog.log_id,
          indexedLog.log_rule_id,
          indexedLog.log_level,
          indexedLog.category,
          indexedLog.severity,
          indexedLog.message,
          indexedLog.message_normalized,
          JSON.stringify(indexedLog.tags || []),
          JSON.stringify(indexedLog.extracted_fields || {}),
          indexedLog.search_vector,
          indexedLog.timestamp,
          indexedLog.created_at,
        ]
      );

      logger.debug(`Indexed-Log gespeichert: ${indexedLog.id}`);
    } catch (error) {
      logger.error(`Fehler beim Speichern des Indexed-Logs ${indexedLog.id}`, error);
      throw error;
    }
  }

  /**
   * Speichert ein Archived-Log in orchestrator_logs_archive
   */
  async saveArchivedLog(archivedLog: ArchivedLog): Promise<void> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `INSERT INTO orchestrator_logs_archive 
         (id, log_id, log_rule_id, log_level, category, severity, message, context, metadata,
          compressed_data, compression_ratio, archived_at, original_timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          archivedLog.id,
          archivedLog.log_id,
          archivedLog.log_rule_id,
          archivedLog.log_level,
          archivedLog.category,
          archivedLog.severity,
          archivedLog.message,
          JSON.stringify(archivedLog.context || {}),
          JSON.stringify(archivedLog.metadata || {}),
          archivedLog.compressed_data,
          archivedLog.compression_ratio,
          archivedLog.archived_at,
          archivedLog.original_timestamp,
          archivedLog.created_at,
        ]
      );

      logger.debug(`Archived-Log gespeichert: ${archivedLog.id}`);
    } catch (error) {
      logger.error(`Fehler beim Speichern des Archived-Logs ${archivedLog.id}`, error);
      throw error;
    }
  }

  /**
   * Ruft ein Log anhand der ID ab
   */
  async getLog(logId: string): Promise<Log | null> {
    try {
      const connection = await getConnection();

      const [rows] = await connection.execute(
        `SELECT 
          id, log_rule_id, log_level, category, severity, message, context, metadata,
          correlation_id, user_id, session_id, ip_address, user_agent, request_id,
          resource_type, resource_id, timestamp, created_at
         FROM orchestrator_logs
         WHERE id = ?`,
        [logId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return null;
      }

      const row = rows[0] as any;

      return {
        id: row.id,
        log_rule_id: row.log_rule_id,
        log_level: row.log_level,
        category: row.category,
        severity: row.severity,
        message: row.message,
        context: row.context ? JSON.parse(row.context) : {},
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        correlation_id: row.correlation_id,
        user_id: undefined, // DSGVO: Wird NICHT zurückgegeben
        session_id: undefined, // DSGVO: Wird NICHT zurückgegeben
        ip_address: undefined, // DSGVO: Wird NICHT zurückgegeben
        user_agent: row.user_agent,
        request_id: row.request_id,
        resource_type: row.resource_type,
        resource_id: row.resource_id,
        timestamp: new Date(row.timestamp),
        created_at: new Date(row.created_at),
      };
    } catch (error) {
      logger.error(`Fehler beim Abrufen des Logs ${logId}`, error);
      return null;
    }
  }

  /**
   * Ruft Logs mit Filter ab
   */
  async getLogs(query: SearchQuery): Promise<Log[]> {
    try {
      const connection = await getConnection();

      let sql = `SELECT 
        id, log_rule_id, log_level, category, severity, message, context, metadata,
        correlation_id, user_id, session_id, ip_address, user_agent, request_id,
        resource_type, resource_id, timestamp, created_at
       FROM orchestrator_logs
       WHERE 1=1`;

      const params: any[] = [];

      if (query.category) {
        sql += " AND category = ?";
        params.push(query.category);
      }

      if (query.log_level) {
        sql += " AND log_level = ?";
        params.push(query.log_level);
      }

      if (query.severity) {
        sql += " AND severity = ?";
        params.push(query.severity);
      }

      if (query.log_rule_id) {
        sql += " AND log_rule_id = ?";
        params.push(query.log_rule_id);
      }

      if (query.start_time) {
        sql += " AND timestamp >= ?";
        params.push(query.start_time);
      }

      if (query.end_time) {
        sql += " AND timestamp <= ?";
        params.push(query.end_time);
      }

      if (query.correlation_id) {
        sql += " AND correlation_id = ?";
        params.push(query.correlation_id);
      }

      if (query.request_id) {
        sql += " AND request_id = ?";
        params.push(query.request_id);
      }

      if (query.resource_type) {
        sql += " AND resource_type = ?";
        params.push(query.resource_type);
      }

      if (query.resource_id) {
        sql += " AND resource_id = ?";
        params.push(query.resource_id);
      }

      // Sortierung
      const sortBy = query.sort_by || "timestamp";
      const sort = query.sort || "desc";
      sql += ` ORDER BY ${sortBy} ${sort}`;

      // Limit & Offset
      const limit = query.limit || 100;
      const offset = query.offset || 0;
      sql += " LIMIT ? OFFSET ?";
      params.push(limit, offset);

      const [rows] = await connection.execute(sql, params);

      if (!Array.isArray(rows)) {
        return [];
      }

      return rows.map((row: any) => ({
        id: row.id,
        log_rule_id: row.log_rule_id,
        log_level: row.log_level,
        category: row.category,
        severity: row.severity,
        message: row.message,
        context: row.context ? JSON.parse(row.context) : {},
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        correlation_id: row.correlation_id,
        user_id: undefined, // DSGVO: Wird NICHT zurückgegeben
        session_id: undefined, // DSGVO: Wird NICHT zurückgegeben
        ip_address: undefined, // DSGVO: Wird NICHT zurückgegeben
        user_agent: row.user_agent,
        request_id: row.request_id,
        resource_type: row.resource_type,
        resource_id: row.resource_id,
        timestamp: new Date(row.timestamp),
        created_at: new Date(row.created_at),
      }));
    } catch (error) {
      logger.error("Fehler beim Abrufen der Logs", error);
      return [];
    }
  }
}

export const logStorage = new LogStorage();

