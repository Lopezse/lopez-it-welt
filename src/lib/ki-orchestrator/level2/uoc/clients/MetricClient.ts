/**
 * Metric Client - Enterprise++ Standard P9
 * 
 * Client für P8-D Metric-APIs
 */

import type { BaseMetric, SystemHealth, APIPerformance, QueuePerformance, DBHealth, MetricFilter } from "@/lib/telemetry/types";
import type { SystemMetrics } from "../types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class MetricClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole Live-Metriken (letzte 5 Sekunden)
   */
  async getLiveMetrics(filters?: MetricFilter): Promise<BaseMetric[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.metric_ids && filters.metric_ids.length > 0) {
        params.append("metric_ids", filters.metric_ids.join(","));
      }
      if (filters?.categories && filters.categories.length > 0) {
        params.append("categories", filters.categories.join(","));
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }

      const url = `${this.baseUrl}/api/orchestrator/metrics/live${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch live metrics: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.metrics || data.data || [];
    } catch (error) {
      logger.error("MetricClient.getLiveMetrics failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole System-Metriken
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const [systemResponse, apiResponse, queueResponse, dbResponse] = await Promise.all([
        fetch(`${this.baseUrl}/api/orchestrator/metrics/system`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(`${this.baseUrl}/api/orchestrator/metrics/api-performance`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(`${this.baseUrl}/api/orchestrator/metrics/queue`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(`${this.baseUrl}/api/orchestrator/metrics/db`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
      ]);

      const systemData = systemResponse.ok ? await systemResponse.json() : { metrics: [] };
      const apiData = apiResponse.ok ? await apiResponse.json() : { data: {} };
      const queueData = queueResponse.ok ? await queueResponse.json() : { data: {} };
      const dbData = dbResponse.ok ? await dbResponse.json() : { data: {} };

      // Hole Orchestrator-Metriken (aus Live-Metriken gefiltert)
      const orchestratorMetrics = await this.getLiveMetrics({
        categories: ["orchestrator"],
        limit: 100,
      });

      return {
        system: systemData.metrics || systemData.data || [],
        api: apiData.data || apiData as APIPerformance,
        queue: queueData.data || queueData as QueuePerformance,
        db: dbData.data || dbData as DBHealth,
        orchestrator: orchestratorMetrics,
      };
    } catch (error) {
      logger.error("MetricClient.getSystemMetrics failed", { error });
      throw error;
    }
  }

  /**
   * Hole API-Performance-Metriken
   */
  async getAPIPerformance(): Promise<APIPerformance> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/metrics/api-performance`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch API performance: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      logger.error("MetricClient.getAPIPerformance failed", { error });
      throw error;
    }
  }

  /**
   * Hole Queue-Status
   */
  async getQueueStatus(): Promise<QueuePerformance> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/metrics/queue`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch queue status: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      logger.error("MetricClient.getQueueStatus failed", { error });
      throw error;
    }
  }

  /**
   * Hole DB-Metriken
   */
  async getDBMetrics(): Promise<DBHealth> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/metrics/db`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch DB metrics: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      logger.error("MetricClient.getDBMetrics failed", { error });
      throw error;
    }
  }
}

export const metricClient = new MetricClient();




