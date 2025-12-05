/**
 * Orchestrator Client - Enterprise++ Standard P9
 * 
 * Client für Orchestrator-APIs
 */

import type { AgentDefinition } from "../../../types";
import type { QueueStatus, OrchestratorEvent, EventFilters } from "../types";
import { logger } from "@/lib/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class OrchestratorClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Hole alle Agenten
   */
  async getAgents(): Promise<AgentDefinition[]> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/agents`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch agents: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.agents || data.data || [];
    } catch (error) {
      logger.error("OrchestratorClient.getAgents failed", { error });
      throw error;
    }
  }

  /**
   * Hole Queue-Status
   */
  async getQueueStatus(): Promise<QueueStatus> {
    try {
      const url = `${this.baseUrl}/api/orchestrator/queue/status`;
      
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
      logger.error("OrchestratorClient.getQueueStatus failed", { error });
      throw error;
    }
  }

  /**
   * Hole Orchestrator-Events
   */
  async getEvents(filters?: EventFilters): Promise<OrchestratorEvent[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.eventTypes && filters.eventTypes.length > 0) {
        params.append("event_types", filters.eventTypes.join(","));
      }
      if (filters?.agent) {
        params.append("agent", filters.agent);
      }
      if (filters?.startTime) {
        params.append("start_time", filters.startTime.toISOString());
      }
      if (filters?.endTime) {
        params.append("end_time", filters.endTime.toISOString());
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters?.offset) {
        params.append("offset", filters.offset.toString());
      }

      const url = `${this.baseUrl}/api/orchestrator/events${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch events: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.events || data.data || [];
    } catch (error) {
      logger.error("OrchestratorClient.getEvents failed", { error, filters });
      throw error;
    }
  }
}

export const orchestratorClient = new OrchestratorClient();




