/**
 * Telemetry Types - Enterprise++ Standard P8-D
 * 
 * TypeScript-Typen für Telemetrie & Monitoring
 */

export type TelemetryCategory = "system" | "api" | "queue" | "db" | "orchestrator" | "media_ki" | "cache";

export type MetricPriority = "P1" | "P2" | "P3";

export type MetricSeverity = "info" | "warning" | "critical";

export type HealthStatus = "healthy" | "degraded" | "unhealthy" | "critical";

export type MetricType = "gauge" | "counter" | "histogram";

export interface BaseMetric {
  id?: string;
  metric_id: string; // Stabile Kennung lt. P8-D-METRICS (z.B. "SYS-001")
  metric_name: string;
  category: TelemetryCategory;
  value: number;
  unit: string; // "ms", "%", "count", "bytes", "load", "tasks", "queries", "euros", "requests/second", "tasks/second", "workflows/second", "triggers/second"
  priority: MetricPriority;
  severity: MetricSeverity;
  source: string; // "system", "api-gateway", "worker", "orchestrator", "media-ki", "database", "cache"
  metric_timestamp: Date;
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface SystemHealth {
  status: HealthStatus;
  score: number; // 0-100
  issues: string[];
  metrics_summary: Record<string, number>; // z.B. { "cpu.usage": 71.2, "ram.usage": 60.0 }
  updated_at: Date;
}

export interface ComponentHealth {
  component: string;
  status: HealthStatus;
  score: number;
  issues: string[];
  metrics_summary: Record<string, number>;
  checked_at: Date;
}

export interface APIPerformance {
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  requestRate: number;
  timeoutRate: number;
}

export interface QueuePerformance {
  depth: number;
  throughput: number;
  avgWaitTime: number;
  avgProcessingTime: number;
  failedTasks: number;
  blocked: boolean;
}

export interface DBHealth {
  connectionPoolUsage: number;
  slowQueryCount: number;
  avgSlowQueryTime: number;
  queryRate: number;
  replicationLag?: number;
}

export interface CrashEvent {
  id: string;
  service: string;
  crash_type: string;
  crash_message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SlowQueryEvent {
  id: string;
  query: string;
  execution_time_ms: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface MetricFilter {
  metric_ids?: string[];
  categories?: TelemetryCategory[];
  start_time?: Date;
  end_time?: Date;
  limit?: number;
  offset?: number;
}

export interface MetricRollup {
  metric_id: string;
  rollup_interval: "1min" | "5min" | "1hour" | "1day";
  value_min: number;
  value_max: number;
  value_avg: number;
  value_sum: number;
  value_count: number;
  timestamp_start: Date;
  timestamp_end: Date;
}




