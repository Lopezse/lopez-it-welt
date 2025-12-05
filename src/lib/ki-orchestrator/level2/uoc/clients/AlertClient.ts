/**
 * Alert Client - Enterprise++ Standard P9
 * 
 * Client für P8-C Alert-APIs
 */

import type { Alert, AlertFilters } from "../../types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class AlertClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole alle Alerts mit optionalen Filtern
   */
  async getAlerts(filters?: AlertFilters): Promise<Alert[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.severity) {
        params.append("severity", filters.severity);
      }
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters?.offset) {
        params.append("offset", filters.offset.toString());
      }

      const url = `${this.baseUrl}/api/orchestrator/alerts${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch alerts: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.alerts || data.data || [];
    } catch (error) {
      logger.error("AlertClient.getAlerts failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole einen einzelnen Alert
   */
  async getAlert(alertId: string): Promise<Alert> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/alerts/${alertId}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch alert: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.alert || data.data;
    } catch (error) {
      logger.error("AlertClient.getAlert failed", { error, alertId });
      throw error;
    }
  }

  /**
   * Bestätige einen Alert
   */
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/alerts/${alertId}/ack`;
      
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to acknowledge alert: ${error.message || response.statusText}`);
      }
    } catch (error) {
      logger.error("AlertClient.acknowledgeAlert failed", { error, alertId });
      throw error;
    }
  }

  /**
   * Eskaliere einen Alert zu einem Incident
   * @returns Incident-ID
   */
  async escalateAlert(alertId: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/alerts/${alertId}/escalate`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to escalate alert: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.incident_id || data.data?.incident_id || "";
    } catch (error) {
      logger.error("AlertClient.escalateAlert failed", { error, alertId });
      throw error;
    }
  }
}

export const alertClient = new AlertClient();




