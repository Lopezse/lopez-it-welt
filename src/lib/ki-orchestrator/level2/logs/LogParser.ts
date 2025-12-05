/**
 * Log Parser - Enterprise++ Standard P8-E
 * 
 * Log-Parsing & Normalisierung
 */

import { logger } from "@/lib/logger";
import type { RawLog, Log, ExtractedFields } from "./types";

class LogParser {
  /**
   * Parst ein Raw-Log zu einem Log
   */
  async parseLog(rawLog: RawLog): Promise<Log> {
    try {
      // Normalisiere Message
      const messageNormalized = await this.normalizeMessage(rawLog.message);

      // Extrahiere Felder
      const extractedFields = await this.extractFields(rawLog);

      // Erstelle Log
      const log: Log = {
        id: rawLog.id || this.generateId(),
        log_rule_id: rawLog.log_rule_id,
        log_level: rawLog.log_level,
        category: rawLog.category,
        severity: rawLog.severity,
        message: rawLog.message,
        message_normalized: messageNormalized,
        context: rawLog.context,
        metadata: rawLog.metadata,
        tags: [],
        extracted_fields: extractedFields,
        correlation_id: rawLog.correlation_id,
        user_id: rawLog.user_id,
        session_id: rawLog.session_id,
        ip_address: rawLog.ip_address,
        user_agent: rawLog.user_agent,
        request_id: rawLog.request_id,
        resource_type: rawLog.resource_type,
        resource_id: rawLog.resource_id,
        timestamp: rawLog.timestamp,
        created_at: rawLog.created_at || new Date(),
      };

      // Validiere Log
      const isValid = await this.validateLog(log);
      if (!isValid) {
        throw new Error("Log-Validierung fehlgeschlagen");
      }

      return log;
    } catch (error) {
      logger.error("Fehler beim Parsen des Logs", error);
      throw error;
    }
  }

  /**
   * Normalisiert eine Log-Message
   */
  async normalizeMessage(message: string): Promise<string> {
    if (!message) {
      return "";
    }

    // Normalisiere: Kleinbuchstaben, entferne Sonderzeichen
    let normalized = message.toLowerCase();

    // Entferne überflüssige Leerzeichen
    normalized = normalized.replace(/\s+/g, " ").trim();

    // Entferne Sonderzeichen (behalte nur Buchstaben, Zahlen, Leerzeichen)
    normalized = normalized.replace(/[^a-z0-9\s]/g, "");

    return normalized;
  }

  /**
   * Extrahiert Felder aus einem Log
   */
  async extractFields(log: RawLog): Promise<ExtractedFields> {
    const fields: ExtractedFields = {};

    // Extrahiere Felder aus Context
    if (log.context) {
      for (const [key, value] of Object.entries(log.context)) {
        fields[key] = value;
      }
    }

    // Extrahiere Felder aus Metadata
    if (log.metadata) {
      for (const [key, value] of Object.entries(log.metadata)) {
        fields[`meta_${key}`] = value;
      }
    }

    // Extrahiere Felder aus Message (vereinfacht)
    if (log.message) {
      // Beispiel: Extrahiere IP-Adressen
      const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
      const ips = log.message.match(ipRegex);
      if (ips && ips.length > 0) {
        fields.extracted_ips = ips;
      }

      // Beispiel: Extrahiere URLs
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = log.message.match(urlRegex);
      if (urls && urls.length > 0) {
        fields.extracted_urls = urls;
      }
    }

    return fields;
  }

  /**
   * Validiert ein Log
   */
  async validateLog(log: Log): Promise<boolean> {
    // Prüfe Pflichtfelder
    if (!log.log_rule_id) {
      logger.warn("Log ohne log_rule_id");
      return false;
    }

    if (!log.message || log.message.trim().length === 0) {
      logger.warn("Log ohne Message");
      return false;
    }

    if (!log.timestamp) {
      logger.warn("Log ohne Timestamp");
      return false;
    }

    // Prüfe Log-Level
    const validLogLevels: Log["log_level"][] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
    if (!validLogLevels.includes(log.log_level)) {
      logger.warn(`Ungültiges Log-Level: ${log.log_level}`);
      return false;
    }

    // Prüfe Severity
    const validSeverities: Log["severity"][] = ["info", "warning", "critical"];
    if (!validSeverities.includes(log.severity)) {
      logger.warn(`Ungültige Severity: ${log.severity}`);
      return false;
    }

    return true;
  }

  /**
   * Generiert eine eindeutige ID
   */
  private generateId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const logParser = new LogParser();





