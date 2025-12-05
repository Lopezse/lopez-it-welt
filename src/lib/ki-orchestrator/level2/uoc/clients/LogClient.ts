/**
 * Log Client - Enterprise++ Standard P9
 * 
 * Client für P8-E Log-APIs
 */

import type { Log, LogFilters, SearchQuery } from "../../logs/types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class LogClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole alle Logs mit optionalen Filtern
   */
  async getLogs(filters?: LogFilters): Promise<Log[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.log_level) {
        params.append("log_level", filters.log_level);
      }
      if (filters?.severity) {
        params.append("severity", filters.severity);
      }
      if (filters?.log_rule_id) {
        params.append("log_rule_id", filters.log_rule_id);
      }
      if (filters?.start_time) {
        params.append("start_time", filters.start_time.toISOString());
      }
      if (filters?.end_time) {
        params.append("end_time", filters.end_time.toISOString());
      }
      if (filters?.correlation_id) {
        params.append("correlation_id", filters.correlation_id);
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters?.offset) {
        params.append("offset", filters.offset.toString());
      }
      if (filters?.sort) {
        params.append("sort", filters.sort);
      }

      const url = `${this.baseUrl}/api/orchestrator/logs${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch logs: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.logs || data.data || [];
    } catch (error) {
      logger.error("LogClient.getLogs failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole einen einzelnen Log
   */
  async getLog(logId: string): Promise<Log> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/logs/${logId}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch log: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.log || data.data;
    } catch (error) {
      logger.error("LogClient.getLog failed", { error, logId });
      throw error;
    }
  }

  /**
   * Suche Logs mit Volltext-Suche
   */
  async searchLogs(query: SearchQuery): Promise<Log[]> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/logs/search`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to search logs: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.logs || data.data || [];
    } catch (error) {
      logger.error("LogClient.searchLogs failed", { error, query });
      throw error;
    }
  }
}

export const logClient = new LogClient();




