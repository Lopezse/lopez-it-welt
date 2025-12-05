/**
 * Unified Operations Center Types - Enterprise++ Standard P9
 * 
 * TypeScript-Typen für das Unified Operations Center
 */

import type { Alert, AlertFilters, Incident, IncidentFilters } from "../types";
import type { BaseMetric, SystemHealth, APIPerformance, QueuePerformance, DBHealth, MetricFilter } from "@/lib/telemetry/types";
import type { Log, LogFilters, Trend, Pattern, Anomaly } from "../logs/types";
import type { AgentDefinition, OrchestratorEventType } from "../../types";

// =====================================================
// TIME RANGE & FILTERS
// =====================================================

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface UOCFilters {
  timeRange?: TimeRange;
  categories?: string[];
  severities?: string[];
  sources?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CorrelationFilters extends UOCFilters {
  correlationId?: string;
  resourceId?: string;
  resourceType?: string;
}

export interface TimelineFilters extends UOCFilters {
  eventTypes?: string[];
  minScore?: number;
}

// =====================================================
// CORRELATION TYPES
// =====================================================

export interface CorrelationResult {
  source1: Event;
  source2: Event;
  score: number; // 0.0 - 1.0
  reasons: string[];
  timestamp: Date;
}

export interface MultiSourceCorrelation {
  correlations: CorrelationResult[];
  summary: {
    totalEvents: number;
    correlatedEvents: number;
    avgScore: number;
  };
}

export interface Event {
  id: string;
  type: "alert" | "metric" | "log" | "incident";
  category: string;
  severity: string;
  resourceType?: string;
  resourceId?: string;
  correlationId?: string;
  timestamp: Date;
  data: unknown;
}

// =====================================================
// DATA AGGREGATION TYPES
// =====================================================

export interface AggregatedData {
  alerts: Alert[];
  incidents: Incident[];
  metrics: BaseMetric[];
  logs: Log[];
  systemHealth: SystemHealth;
  timestamp: Date;
}

export interface NormalizedData {
  events: Event[];
  timeline: TimelineEvent[];
  summary: DataSummary;
}

export interface DataSummary {
  totalAlerts: number;
  totalIncidents: number;
  totalMetrics: number;
  totalLogs: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

// =====================================================
// VIEW TYPES
// =====================================================

export interface CorrelationView {
  correlations: CorrelationResult[];
  events: Event[];
  summary: {
    totalCorrelations: number;
    highScoreCorrelations: number;
    avgScore: number;
  };
}

export interface RootCauseAnalysisView {
  incident: Incident;
  rootCause: Event;
  timeline: Timeline;
  impact: ImpactAnalysis;
  solutions: Solution[];
  causalRelationships: CausalRelationship[];
}

export interface TimelineView {
  events: TimelineEvent[];
  correlations: CorrelationResult[];
  summary: {
    totalEvents: number;
    timeSpan: number; // in seconds
  };
}

export interface Timeline {
  events: TimelineEvent[];
  rootCause: Event;
  impact: ImpactAnalysis;
}

export interface TimelineEvent {
  id: string;
  type: "alert" | "metric" | "log" | "incident";
  timestamp: Date;
  category: string;
  severity: string;
  message: string;
  data: unknown;
}

export interface ImpactAnalysis {
  affectedResources: string[];
  affectedServices: string[];
  userImpact: number; // 0-100
  businessImpact: number; // 0-100
  estimatedDowntime: number; // in minutes
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number; // in minutes
  steps: string[];
}

export interface CausalRelationship {
  from: Event;
  to: Event;
  confidence: number; // 0.0 - 1.0
  type: "direct" | "indirect" | "correlated";
}

// =====================================================
// SORTING & PAGINATION
// =====================================================

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

// =====================================================
// LIVE STREAMING TYPES
// =====================================================

export interface SSEConnection {
  id: string;
  clientId: string;
  filters?: StreamFilters;
  lastHeartbeat: Date;
  createdAt: Date;
}

export interface WebSocketConnection {
  id: string;
  clientId: string;
  filters?: StreamFilters;
  lastHeartbeat: Date;
  createdAt: Date;
}

export interface StreamFilters {
  eventTypes?: ("alert" | "metric" | "log" | "health" | "incident")[];
  categories?: string[];
  severities?: string[];
  sources?: string[];
}

export interface LiveUpdate {
  eventType: "alert" | "metric" | "log" | "health" | "incident";
  data: unknown;
  timestamp: Date;
}

// =====================================================
// CLIENT TYPES
// =====================================================

export interface SystemMetrics {
  system: BaseMetric[];
  api: APIPerformance;
  queue: QueuePerformance;
  db: DBHealth;
  orchestrator: BaseMetric[];
}

export interface QueueStatus {
  depth: number;
  throughput: number;
  avgWaitTime: number;
  avgProcessingTime: number;
  failedTasks: number;
  blocked: boolean;
}

export interface OrchestratorEvent {
  id: string;
  event_type: OrchestratorEventType;
  agent?: string;
  task_id?: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export interface EventFilters {
  eventTypes?: OrchestratorEventType[];
  agent?: string;
  startTime?: Date;
  endTime?: Date;
  limit?: number;
  offset?: number;
}

export interface TrendFilters {
  category?: string;
  startTime?: Date;
  endTime?: Date;
  period?: "hour" | "day" | "week" | "month";
}

export interface PatternFilters {
  category?: string;
  startTime?: Date;
  endTime?: Date;
  minOccurrences?: number;
}

export interface AnomalyFilters {
  category?: string;
  startTime?: Date;
  endTime?: Date;
  severity?: "info" | "warning" | "critical";
}




