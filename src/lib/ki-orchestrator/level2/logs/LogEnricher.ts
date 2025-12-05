/**
 * Log Enricher - Enterprise++ Standard P8-E
 * 
 * Log-Anreicherung (Metadata, Tags, Correlation-ID)
 */

import { logger } from "@/lib/logger";
import type { Log } from "./types";

class LogEnricher {
  /**
   * Reichert ein Log an
   */
  async enrichLog(log: Log): Promise<Log> {
    try {
      let enrichedLog = { ...log };

      // Füge Metadata hinzu
      enrichedLog = await this.addMetadata(enrichedLog);

      // Füge Tags hinzu
      enrichedLog = await this.addTags(enrichedLog);

      // Füge Correlation-ID hinzu (falls nicht vorhanden)
      enrichedLog = await this.addCorrelationID(enrichedLog);

      return enrichedLog;
    } catch (error) {
      logger.error("Fehler beim Anreichern des Logs", error);
      return log;
    }
  }

  /**
   * Fügt Metadata zu einem Log hinzu
   */
  async addMetadata(log: Log): Promise<Log> {
    const metadata = {
      ...log.metadata,
      enriched_at: new Date().toISOString(),
      enrichment_version: "1.0",
    };

    // Füge zusätzliche Metadata basierend auf Category hinzu
    if (log.category === "Security") {
      metadata.security_relevant = true;
    }
    if (log.category === "DSGVO") {
      metadata.dsgvo_relevant = true;
    }
    if (log.severity === "critical") {
      metadata.critical = true;
    }

    return {
      ...log,
      metadata,
    };
  }

  /**
   * Fügt Tags zu einem Log hinzu
   */
  async addTags(log: Log): Promise<Log> {
    const tags = new Set<string>(log.tags || []);

    // Füge Category als Tag hinzu
    tags.add(log.category.toLowerCase());

    // Füge Log-Level als Tag hinzu
    tags.add(log.log_level.toLowerCase());

    // Füge Severity als Tag hinzu
    tags.add(log.severity);

    // Füge Tags basierend auf Message-Inhalt hinzu
    if (log.message_normalized) {
      const messageLower = log.message_normalized.toLowerCase();

      // Security-Tags
      if (messageLower.includes("unauthorized") || messageLower.includes("access denied")) {
        tags.add("unauthorized");
        tags.add("security");
      }
      if (messageLower.includes("failed") && messageLower.includes("login")) {
        tags.add("authentication");
        tags.add("security");
      }

      // Error-Tags
      if (messageLower.includes("error") || messageLower.includes("exception")) {
        tags.add("error");
      }
      if (messageLower.includes("timeout")) {
        tags.add("timeout");
      }

      // Performance-Tags
      if (messageLower.includes("slow") || messageLower.includes("performance")) {
        tags.add("performance");
      }
    }

    return {
      ...log,
      tags: Array.from(tags),
    };
  }

  /**
   * Fügt Correlation-ID hinzu (falls nicht vorhanden)
   */
  async addCorrelationID(log: Log): Promise<Log> {
    if (log.correlation_id) {
      return log;
    }

    // Generiere Correlation-ID aus Request-ID oder Log-ID
    const correlationId = log.request_id || log.id || this.generateCorrelationID();

    return {
      ...log,
      correlation_id: correlationId,
    };
  }

  /**
   * Generiert eine Correlation-ID
   */
  private generateCorrelationID(): string {
    return `corr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const logEnricher = new LogEnricher();





