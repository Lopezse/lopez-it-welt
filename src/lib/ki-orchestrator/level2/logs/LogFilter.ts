/**
 * Log Filter - Enterprise++ Standard P8-E
 * 
 * PD-Filter, DSGVO-Compliance
 */

import { logger } from "@/lib/logger";
import type { Log } from "./types";

class LogFilter {
  /**
   * Filtert personenbezogene Daten aus einem Log
   */
  async filterPD(log: Log): Promise<Log> {
    try {
      let filteredLog = { ...log };

      // Entferne PD-Felder
      filteredLog.user_id = undefined;
      filteredLog.session_id = undefined;
      filteredLog.ip_address = undefined;

      // Pseudonymisiere Context
      if (filteredLog.context) {
        filteredLog.context = await this.pseudonymizeData(filteredLog.context);
      }

      // Pseudonymisiere Metadata
      if (filteredLog.metadata) {
        filteredLog.metadata = await this.pseudonymizeData(filteredLog.metadata);
      }

      // Pseudonymisiere extracted_fields
      if (filteredLog.extracted_fields) {
        filteredLog.extracted_fields = await this.pseudonymizeData(filteredLog.extracted_fields);
      }

      return filteredLog;
    } catch (error) {
      logger.error("Fehler beim Filtern von PD", error);
      return log;
    }
  }

  /**
   * Pseudonymisiert Daten
   */
  async pseudonymizeData(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const pdFields = ["user_id", "email", "phone", "name", "address", "ip_address", "session_id"];
    const pseudonymized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (pdFields.includes(key.toLowerCase())) {
        // Pseudonymisiere: Ersetze durch Hash oder [REDACTED]
        pseudonymized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Rekursiv für verschachtelte Objekte
        pseudonymized[key] = await this.pseudonymizeData(value as Record<string, unknown>);
      } else {
        pseudonymized[key] = value;
      }
    }

    return pseudonymized;
  }

  /**
   * Validiert DSGVO-Compliance
   */
  async validateDSGVO(log: Log): Promise<boolean> {
    try {
      // Prüfe, ob PD-Felder vorhanden sind
      if (log.user_id || log.session_id || log.ip_address) {
        logger.warn("Log enthält PD-Felder, sollte gefiltert werden");
        return false;
      }

      // Prüfe Context auf PD
      if (log.context) {
        const hasPD = this.hasPersonalData(log.context);
        if (hasPD) {
          logger.warn("Log-Context enthält PD, sollte gefiltert werden");
          return false;
        }
      }

      // Prüfe Metadata auf PD
      if (log.metadata) {
        const hasPD = this.hasPersonalData(log.metadata);
        if (hasPD) {
          logger.warn("Log-Metadata enthält PD, sollte gefiltert werden");
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error("Fehler bei DSGVO-Validierung", error);
      return false;
    }
  }

  /**
   * Entfernt sensible Daten aus einem Log
   */
  async removeSensitiveData(log: Log): Promise<Log> {
    try {
      let cleanedLog = { ...log };

      // Entferne PD-Felder
      cleanedLog.user_id = undefined;
      cleanedLog.session_id = undefined;
      cleanedLog.ip_address = undefined;
      cleanedLog.user_agent = undefined; // Kann auch sensibel sein

      // Entferne sensible Daten aus Context
      if (cleanedLog.context) {
        cleanedLog.context = await this.removeSensitiveFromObject(cleanedLog.context);
      }

      // Entferne sensible Daten aus Metadata
      if (cleanedLog.metadata) {
        cleanedLog.metadata = await this.removeSensitiveFromObject(cleanedLog.metadata);
      }

      return cleanedLog;
    } catch (error) {
      logger.error("Fehler beim Entfernen sensibler Daten", error);
      return log;
    }
  }

  /**
   * Prüft, ob ein Objekt personenbezogene Daten enthält
   */
  private hasPersonalData(data: Record<string, unknown>): boolean {
    const pdFields = ["user_id", "email", "phone", "name", "address", "ip_address", "session_id"];

    for (const [key, value] of Object.entries(data)) {
      if (pdFields.includes(key.toLowerCase())) {
        return true;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (this.hasPersonalData(value as Record<string, unknown>)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Entfernt sensible Daten aus einem Objekt
   */
  private async removeSensitiveFromObject(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const sensitiveFields = ["user_id", "email", "phone", "name", "address", "ip_address", "session_id", "password", "token", "secret"];
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (!sensitiveFields.includes(key.toLowerCase())) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          cleaned[key] = await this.removeSensitiveFromObject(value as Record<string, unknown>);
        } else {
          cleaned[key] = value;
        }
      }
    }

    return cleaned;
  }
}

export const logFilter = new LogFilter();





