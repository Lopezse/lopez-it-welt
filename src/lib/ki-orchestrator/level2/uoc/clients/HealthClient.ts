/**
 * Health Client - Enterprise++ Standard P9
 * 
 * Client für P8-D Health-APIs
 */

import type { SystemHealth } from "@/lib/telemetry/types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class HealthClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole System-Health-Status
   */
  async getHealthStatus(): Promise<SystemHealth> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/metrics/health`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch health status: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      logger.error("HealthClient.getHealthStatus failed", { error });
      throw error;
    }
  }
}

export const healthClient = new HealthClient();




