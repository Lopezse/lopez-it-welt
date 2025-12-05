/**
 * Analytics Client - Enterprise++ Standard P9
 * 
 * Client für P8-E Analytics-APIs
 */

import type { Trend, Pattern, Anomaly } from "../../logs/types";
import type { TrendFilters, PatternFilters, AnomalyFilters } from "../types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class AnalyticsClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole Trends
   */
  async getTrends(filters?: TrendFilters): Promise<Trend[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.startTime) {
        params.append("start_time", filters.startTime.toISOString());
      }
      if (filters?.endTime) {
        params.append("end_time", filters.endTime.toISOString());
      }
      if (filters?.period) {
        params.append("period", filters.period);
      }

      const url = `${this.baseUrl}/api/orchestrator/logs/analytics/trends${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch trends: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.trends || data.data || [];
    } catch (error) {
      logger.error("AnalyticsClient.getTrends failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole Patterns
   */
  async getPatterns(filters?: PatternFilters): Promise<Pattern[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.startTime) {
        params.append("start_time", filters.startTime.toISOString());
      }
      if (filters?.endTime) {
        params.append("end_time", filters.endTime.toISOString());
      }
      if (filters?.minOccurrences) {
        params.append("min_occurrences", filters.minOccurrences.toString());
      }

      const url = `${this.baseUrl}/api/orchestrator/logs/analytics/patterns${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch patterns: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.patterns || data.data || [];
    } catch (error) {
      logger.error("AnalyticsClient.getPatterns failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole Anomalien
   */
  async getAnomalies(filters?: AnomalyFilters): Promise<Anomaly[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.startTime) {
        params.append("start_time", filters.startTime.toISOString());
      }
      if (filters?.endTime) {
        params.append("end_time", filters.endTime.toISOString());
      }
      if (filters?.severity) {
        params.append("severity", filters.severity);
      }

      const url = `${this.baseUrl}/api/orchestrator/logs/analytics/anomalies${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch anomalies: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.anomalies || data.data || [];
    } catch (error) {
      logger.error("AnalyticsClient.getAnomalies failed", { error, filters });
      throw error;
    }
  }
}

export const analyticsClient = new AnalyticsClient();




