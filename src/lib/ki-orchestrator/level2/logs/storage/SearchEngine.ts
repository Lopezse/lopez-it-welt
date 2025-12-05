/**
 * Search Engine - Enterprise++ Standard P8-E
 * 
 * Volltext-Suche für Logs
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { Log, SearchQuery, FacetedQuery } from "../types";

class SearchEngine {
  /**
   * Sucht Logs mit Query
   */
  async searchLogs(query: SearchQuery): Promise<Log[]> {
    try {
      // Wenn Volltext-Suche gewünscht, nutze fullTextSearch
      if (query.q) {
        return await this.fullTextSearch(query.q, query);
      }

      // Sonst: Normale Suche über LogStorage
      const { logStorage } = await import("./LogStorage");
      return await logStorage.getLogs(query);
    } catch (error) {
      logger.error("Fehler bei Log-Suche", error);
      return [];
    }
  }

  /**
   * Volltext-Suche (MySQL FULLTEXT)
   */
  async fullTextSearch(query: string, filters?: SearchQuery): Promise<Log[]> {
    try {
      const connection = await getConnection();

      // Escape für SQL (vereinfacht)
      const escapedQuery = query.replace(/[%_]/g, "\\$&");

      let sql = `SELECT DISTINCT
        l.id, l.log_rule_id, l.log_level, l.category, l.severity, l.message, 
        l.context, l.metadata, l.correlation_id, l.user_id, l.session_id, 
        l.ip_address, l.user_agent, l.request_id, l.resource_type, l.resource_id,
        l.timestamp, l.created_at
       FROM orchestrator_logs l
       INNER JOIN orchestrator_logs_indexed li ON l.id = li.log_id
       WHERE (
         MATCH(li.message) AGAINST(? IN BOOLEAN MODE)
         OR MATCH(li.search_vector) AGAINST(? IN BOOLEAN MODE)
         OR li.message LIKE ?
       )`;

      const params: any[] = [escapedQuery, escapedQuery, `%${escapedQuery}%`];

      // Filter hinzufügen
      if (filters?.category) {
        sql += " AND l.category = ?";
        params.push(filters.category);
      }

      if (filters?.log_level) {
        sql += " AND l.log_level = ?";
        params.push(filters.log_level);
      }

      if (filters?.severity) {
        sql += " AND l.severity = ?";
        params.push(filters.severity);
      }

      if (filters?.start_time) {
        sql += " AND l.timestamp >= ?";
        params.push(filters.start_time);
      }

      if (filters?.end_time) {
        sql += " AND l.timestamp <= ?";
        params.push(filters.end_time);
      }

      // Sortierung
      const sortBy = filters?.sort_by || "timestamp";
      const sort = filters?.sort || "desc";
      sql += ` ORDER BY l.${sortBy} ${sort}`;

      // Limit & Offset
      const limit = filters?.limit || 100;
      const offset = filters?.offset || 0;
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
      logger.error("Fehler bei Volltext-Suche", error);
      return [];
    }
  }

  /**
   * Faceted Search (mit Facets)
   */
  async facetedSearch(query: FacetedQuery): Promise<Log[]> {
    try {
      // Führe normale Suche durch
      const logs = await this.searchLogs(query);

      // Facets werden später im UI berechnet (optional)
      // Hier nur die Logs zurückgeben

      return logs;
    } catch (error) {
      logger.error("Fehler bei Faceted-Search", error);
      return [];
    }
  }

  /**
   * Highlighting für Suchergebnisse
   */
  async highlightResults(logs: Log[], query: string): Promise<Log[]> {
    try {
      // Vereinfachtes Highlighting: Markiere Query-Text in Message
      const queryLower = query.toLowerCase();
      const highlightedLogs = logs.map((log) => {
        if (!log.message) {
          return log;
        }

        // Ersetze Query-Text mit Highlight-Marker (vereinfacht)
        const messageLower = log.message.toLowerCase();
        if (messageLower.includes(queryLower)) {
          // In einer echten Implementierung würde man hier HTML/React-Komponenten verwenden
          // Für jetzt: nur Log zurückgeben (Highlighting im UI)
          return log;
        }

        return log;
      });

      return highlightedLogs;
    } catch (error) {
      logger.error("Fehler beim Highlighting", error);
      return logs;
    }
  }
}

export const searchEngine = new SearchEngine();

