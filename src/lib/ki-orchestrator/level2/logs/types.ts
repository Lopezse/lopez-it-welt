/**
 * Log Processing & Analytics Types - Enterprise++ Standard P8-E
 * 
 * TypeScript-Typen für Log Processing & Analytics
 */

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export type LogSeverity = "info" | "warning" | "critical";

export type LogCategory = "System" | "Security" | "API" | "Orchestrator" | "Queue" | "Workflow" | "DSGVO" | "Audit" | "Media-KI" | "Database" | "Cache";

export type DSFARelevance = "High" | "Medium" | "Low" | "None";

export type MetricPriority = "critical" | "high" | "medium" | "low";

export type AnalysisType = "trend" | "pattern" | "anomaly" | "correlation";

export type AnalysisPeriod = "hour" | "day" | "week" | "month";

export type LogRuleID = string; // z.B. "SEC-LOG-001", "API-LOG-001", etc.

/**
 * Raw Log (Level 1) - Direkt aus Quelle
 */
export interface RawLog {
  id?: string;
  log_rule_id: LogRuleID;
  log_level: LogLevel;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  correlation_id?: string;
  user_id?: string; // DSGVO: Wird gefiltert
  session_id?: string; // DSGVO: Wird gefiltert
  ip_address?: string; // DSGVO: Wird gefiltert
  user_agent?: string;
  request_id?: string;
  resource_type?: string;
  resource_id?: string;
  timestamp: Date;
  created_at?: Date;
}

/**
 * Log (Level 2) - Verarbeitet und angereichert
 */
export interface Log {
  id: string;
  log_rule_id: LogRuleID;
  log_level: LogLevel;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  message_normalized?: string;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  tags?: string[];
  extracted_fields?: Record<string, unknown>;
  correlation_id?: string;
  user_id?: string; // DSGVO: Wird gefiltert
  session_id?: string; // DSGVO: Wird gefiltert
  ip_address?: string; // DSGVO: Wird gefiltert
  user_agent?: string;
  request_id?: string;
  resource_type?: string;
  resource_id?: string;
  timestamp: Date;
  created_at: Date;
}

/**
 * Indexed Log (Level 2) - Für Volltext-Suche
 */
export interface IndexedLog {
  id: string;
  log_id: string;
  log_rule_id: LogRuleID;
  log_level: LogLevel;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  message_normalized: string;
  tags: string[];
  extracted_fields: Record<string, unknown>;
  search_vector: string;
  timestamp: Date;
  created_at: Date;
}

/**
 * Archived Log (Level 2) - Komprimiert für Langzeit-Speicherung
 */
export interface ArchivedLog {
  id: string;
  log_id: string;
  log_rule_id: LogRuleID;
  log_level: LogLevel;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  compressed_data: Buffer;
  compression_ratio: number;
  archived_at: Date;
  original_timestamp: Date;
  created_at: Date;
}

/**
 * Log Rule Definition
 */
export interface LogRule {
  id: LogRuleID;
  name: string;
  description: string;
  category: LogCategory;
  log_level: LogLevel;
  severity: LogSeverity;
  dsfa_relevance: DSFARelevance;
  pattern?: string; // Regex-Pattern für Matching
  conditions?: Record<string, unknown>;
  alert_rule_id?: string; // P8-C Alert-Rule-ID
  enabled: boolean;
}

/**
 * Search Query
 */
export interface SearchQuery {
  q?: string; // Volltext-Suche
  category?: LogCategory;
  log_level?: LogLevel;
  severity?: LogSeverity;
  log_rule_id?: LogRuleID;
  start_time?: Date;
  end_time?: Date;
  correlation_id?: string;
  request_id?: string;
  resource_type?: string;
  resource_id?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  sort_by?: "timestamp" | "log_level" | "severity" | string;
  sort_order?: "ASC" | "DESC";
}

/**
 * Faceted Query (Erweiterte Suche)
 */
export interface FacetedQuery extends SearchQuery {
  facets?: {
    category?: boolean;
    log_level?: boolean;
    severity?: boolean;
    log_rule_id?: boolean;
  };
  highlight?: boolean;
}

/**
 * Trend Analysis Result
 */
export interface Trend {
  id: string;
  metric: string; // z.B. "error_rate", "api_latency"
  category: LogCategory;
  trend: "increasing" | "decreasing" | "stable";
  slope: number;
  r_squared: number;
  confidence: number;
  forecast?: Array<{
    timestamp: Date;
    value: number;
  }>;
  timestamp_start: Date;
  timestamp_end: Date;
}

/**
 * Pattern Detection Result
 */
export interface Pattern {
  id: string;
  pattern_type: "frequent" | "sequence" | "correlated";
  pattern: string;
  frequency: number;
  confidence: number;
  category: LogCategory;
  log_rule_ids: LogRuleID[];
  timestamp_start: Date;
  timestamp_end: Date;
}

/**
 * Anomaly Detection Result
 */
export interface Anomaly {
  id: string;
  anomaly_type: "statistical" | "ml" | "rule_based";
  metric: string;
  value: number;
  expected_value: number;
  z_score?: number;
  confidence: number;
  category: LogCategory;
  log_ids: string[];
  timestamp: Date;
}

/**
 * Extracted Fields (aus Log-Parsing)
 */
export interface ExtractedFields {
  [key: string]: unknown;
}

/**
 * Compressed Log (für Archive)
 */
export interface CompressedLog {
  log_id: string;
  compressed_data: Buffer;
  compression_ratio: number;
  original_size: number;
  compressed_size: number;
}

/**
 * Archive Statistics
 */
export interface ArchiveStats {
  total_logs: number;
  total_size: number;
  compressed_size: number;
  compression_ratio: number;
  oldest_log: Date;
  newest_log: Date;
}

/**
 * Log Filters - Filter für Log-Abfragen
 */
export interface LogFilters {
  log_level?: LogLevel;
  category?: LogCategory;
  severity?: LogSeverity;
  log_rule_id?: LogRuleID;
  start_time?: Date;
  end_time?: Date;
  correlation_id?: string;
  resource_type?: string;
  resource_id?: string;
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
}

