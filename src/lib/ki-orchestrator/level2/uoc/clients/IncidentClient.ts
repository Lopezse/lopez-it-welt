/**
 * Incident Client - Enterprise++ Standard P9
 * 
 * Client für P8-C Incident-APIs
 */

import type { Incident, IncidentFilters } from "../../types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class IncidentClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole alle Incidents mit optionalen Filtern
   */
  async getIncidents(filters?: IncidentFilters): Promise<Incident[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.severity) {
        params.append("severity", filters.severity);
      }
      if (filters?.assigned_to) {
        params.append("assigned_to", filters.assigned_to);
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters?.offset) {
        params.append("offset", filters.offset.toString());
      }

      const url = `${this.baseUrl}/api/orchestrator/incidents${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch incidents: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.incidents || data.data || [];
    } catch (error) {
      logger.error("IncidentClient.getIncidents failed", { error, filters });
      throw error;
    }
  }

  /**
   * Hole einen einzelnen Incident
   */
  async getIncident(incidentId: string): Promise<Incident> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/incidents/${incidentId}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch incident: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.incident || data.data;
    } catch (error) {
      logger.error("IncidentClient.getIncident failed", { error, incidentId });
      throw error;
    }
  }

  /**
   * Löse einen Incident auf
   */
  async resolveIncident(incidentId: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/incidents/${incidentId}/resolve`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to resolve incident: ${error.message || response.statusText}`);
      }
    } catch (error) {
      logger.error("IncidentClient.resolveIncident failed", { error, incidentId });
      throw error;
    }
  }
}

export const incidentClient = new IncidentClient();




