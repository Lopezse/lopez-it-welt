/**
 * Telemetry Registry - Enterprise++ Standard P8-D
 * 
 * Zentrale Definition ALLER 42 Metriken aus P8-D-METRICS.md
 */

import type { TelemetryCategory, MetricPriority } from "./types";

export interface TelemetryMetricDefinition {
  id: string; // metric_id (z.B. "SYS-001")
  name: string; // Metrik-Name
  category: TelemetryCategory;
  description: string;
  priority: MetricPriority;
  unit: string;
  warning_threshold?: number;
  critical_threshold?: number;
  collection_interval: string; // "5s", "10s", "30s", "1s", "on-demand"
  dsfa_relevance: "High" | "Medium" | "Low" | "None";
}

/**
 * Alle 42 Enterprise++-Metriken gemäß P8-D-METRICS.md
 */
export const TELEMETRY_METRICS: TelemetryMetricDefinition[] = [
  // System-Metriken (10 Metriken)
  {
    id: "SYS-001",
    name: "CPU Usage",
    category: "system",
    description: "CPU-Auslastung in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 80,
    critical_threshold: 90,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-002",
    name: "CPU Load Average (1 Min)",
    category: "system",
    description: "CPU-Load-Average für 1 Minute",
    priority: "P1",
    unit: "load",
    warning_threshold: 2.0,
    critical_threshold: 4.0,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-003",
    name: "CPU Load Average (5 Min)",
    category: "system",
    description: "CPU-Load-Average für 5 Minuten",
    priority: "P2",
    unit: "load",
    warning_threshold: 2.0,
    critical_threshold: 4.0,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-004",
    name: "RAM Usage",
    category: "system",
    description: "RAM-Auslastung in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 85,
    critical_threshold: 95,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-005",
    name: "RAM Used (Bytes)",
    category: "system",
    description: "Verwendeter RAM in Bytes",
    priority: "P2",
    unit: "bytes",
    warning_threshold: 8 * 1024 * 1024 * 1024, // 8GB
    critical_threshold: 12 * 1024 * 1024 * 1024, // 12GB
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-006",
    name: "RAM Available (Bytes)",
    category: "system",
    description: "Verfügbarer RAM in Bytes",
    priority: "P2",
    unit: "bytes",
    warning_threshold: 2 * 1024 * 1024 * 1024, // 2GB
    critical_threshold: 1 * 1024 * 1024 * 1024, // 1GB
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-007",
    name: "Disk Usage",
    category: "system",
    description: "Disk-Auslastung in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 85,
    critical_threshold: 95,
    collection_interval: "10s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-008",
    name: "Disk Used (Bytes)",
    category: "system",
    description: "Verwendeter Disk-Speicher in Bytes",
    priority: "P2",
    unit: "bytes",
    warning_threshold: 200 * 1024 * 1024 * 1024, // 200GB
    critical_threshold: 250 * 1024 * 1024 * 1024, // 250GB
    collection_interval: "10s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-009",
    name: "Disk Available (Bytes)",
    category: "system",
    description: "Verfügbarer Disk-Speicher in Bytes",
    priority: "P2",
    unit: "bytes",
    warning_threshold: 50 * 1024 * 1024 * 1024, // 50GB
    critical_threshold: 20 * 1024 * 1024 * 1024, // 20GB
    collection_interval: "10s",
    dsfa_relevance: "Low",
  },
  {
    id: "SYS-010",
    name: "Network Usage",
    category: "system",
    description: "Netzwerk-Auslastung in Prozent",
    priority: "P3",
    unit: "percent",
    warning_threshold: 80,
    critical_threshold: 95,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  // API-Performance-Metriken (8 Metriken)
  {
    id: "API-001",
    name: "API Request Rate",
    category: "api",
    description: "API-Request-Rate pro Sekunde",
    priority: "P1",
    unit: "requests/second",
    warning_threshold: 1000,
    critical_threshold: 2000,
    collection_interval: "1s",
    dsfa_relevance: "Medium",
  },
  {
    id: "API-002",
    name: "API Response Time (P50)",
    category: "api",
    description: "API-Response-Time (50. Perzentil)",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 500,
    critical_threshold: 2000,
    collection_interval: "1s",
    dsfa_relevance: "Medium",
  },
  {
    id: "API-003",
    name: "API Response Time (P95)",
    category: "api",
    description: "API-Response-Time (95. Perzentil)",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 1000,
    critical_threshold: 5000,
    collection_interval: "1s",
    dsfa_relevance: "Medium",
  },
  {
    id: "API-004",
    name: "API Response Time (P99)",
    category: "api",
    description: "API-Response-Time (99. Perzentil)",
    priority: "P2",
    unit: "milliseconds",
    warning_threshold: 2000,
    critical_threshold: 10000,
    collection_interval: "1s",
    dsfa_relevance: "Medium",
  },
  {
    id: "API-005",
    name: "API Error Rate",
    category: "api",
    description: "API-Fehlerrate in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 1,
    critical_threshold: 5,
    collection_interval: "1s",
    dsfa_relevance: "High",
  },
  {
    id: "API-006",
    name: "API 4xx Error Rate",
    category: "api",
    description: "API-4xx-Fehlerrate in Prozent",
    priority: "P2",
    unit: "percent",
    warning_threshold: 2,
    critical_threshold: 5,
    collection_interval: "1s",
    dsfa_relevance: "Medium",
  },
  {
    id: "API-007",
    name: "API 5xx Error Rate",
    category: "api",
    description: "API-5xx-Fehlerrate in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 0.5,
    critical_threshold: 2,
    collection_interval: "1s",
    dsfa_relevance: "High",
  },
  {
    id: "API-008",
    name: "API Timeout Rate",
    category: "api",
    description: "API-Timeout-Rate in Prozent",
    priority: "P1",
    unit: "percent",
    warning_threshold: 0.1,
    critical_threshold: 1,
    collection_interval: "1s",
    dsfa_relevance: "High",
  },
  // Queue-Metriken (5 Metriken)
  {
    id: "QUEUE-001",
    name: "Queue Depth",
    category: "queue",
    description: "Anzahl der Tasks in der Queue",
    priority: "P1",
    unit: "tasks",
    warning_threshold: 500,
    critical_threshold: 1000,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "QUEUE-002",
    name: "Queue Throughput",
    category: "queue",
    description: "Queue-Durchsatz (Tasks pro Sekunde)",
    priority: "P1",
    unit: "tasks/second",
    warning_threshold: 10,
    critical_threshold: 5,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "QUEUE-003",
    name: "Queue Wait Time (Avg)",
    category: "queue",
    description: "Durchschnittliche Wartezeit in der Queue",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 5000,
    critical_threshold: 30000,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "QUEUE-004",
    name: "Queue Processing Time (Avg)",
    category: "queue",
    description: "Durchschnittliche Verarbeitungszeit in der Queue",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 10000,
    critical_threshold: 60000,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "QUEUE-005",
    name: "Queue Failed Tasks",
    category: "queue",
    description: "Anzahl fehlgeschlagener Tasks in der Queue",
    priority: "P1",
    unit: "tasks",
    warning_threshold: 10, // pro Stunde
    critical_threshold: 50, // pro Stunde
    collection_interval: "5s",
    dsfa_relevance: "High",
  },
  // Media-KI-Metriken (5 Metriken)
  {
    id: "MEDIA-001",
    name: "Media-KI Processing Time (Avg)",
    category: "media_ki",
    description: "Durchschnittliche Verarbeitungszeit für Media-KI-Tasks",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 5000,
    critical_threshold: 30000,
    collection_interval: "on-demand",
    dsfa_relevance: "High",
  },
  {
    id: "MEDIA-002",
    name: "Media-KI Success Rate",
    category: "media_ki",
    description: "Erfolgsrate für Media-KI-Tasks",
    priority: "P1",
    unit: "percent",
    warning_threshold: 95,
    critical_threshold: 90,
    collection_interval: "on-demand",
    dsfa_relevance: "High",
  },
  {
    id: "MEDIA-003",
    name: "Media-KI Person Detection Rate",
    category: "media_ki",
    description: "Rate der Personen-Erkennung in Media-KI-Tasks",
    priority: "P1",
    unit: "percent",
    warning_threshold: 10,
    critical_threshold: 20,
    collection_interval: "on-demand",
    dsfa_relevance: "High",
  },
  {
    id: "MEDIA-004",
    name: "Media-KI Provider Latency",
    category: "media_ki",
    description: "Latenz zum Media-KI-Provider (OpenAI)",
    priority: "P2",
    unit: "milliseconds",
    warning_threshold: 3000,
    critical_threshold: 10000,
    collection_interval: "on-demand",
    dsfa_relevance: "Medium",
  },
  {
    id: "MEDIA-005",
    name: "Media-KI Cost per Request",
    category: "media_ki",
    description: "Kosten pro Media-KI-Request",
    priority: "P2",
    unit: "euros",
    warning_threshold: 0.1,
    critical_threshold: 0.5,
    collection_interval: "on-demand",
    dsfa_relevance: "Low",
  },
  // Orchestrator-Metriken (6 Metriken)
  {
    id: "ORCH-001",
    name: "Orchestrator Load",
    category: "orchestrator",
    description: "Anzahl aktiver Tasks im Orchestrator",
    priority: "P1",
    unit: "tasks/active",
    warning_threshold: 50,
    critical_threshold: 100,
    collection_interval: "5s",
    dsfa_relevance: "High",
  },
  {
    id: "ORCH-002",
    name: "Orchestrator Task Rate",
    category: "orchestrator",
    description: "Task-Rate im Orchestrator (Tasks pro Sekunde)",
    priority: "P1",
    unit: "tasks/second",
    warning_threshold: 100,
    critical_threshold: 200,
    collection_interval: "5s",
    dsfa_relevance: "High",
  },
  {
    id: "ORCH-003",
    name: "Orchestrator Agent Performance (Avg)",
    category: "orchestrator",
    description: "Durchschnittliche Agent-Performance im Orchestrator",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 2000,
    critical_threshold: 10000,
    collection_interval: "5s",
    dsfa_relevance: "High",
  },
  {
    id: "ORCH-004",
    name: "Orchestrator Trigger Fire Rate",
    category: "orchestrator",
    description: "Trigger-Fire-Rate im Orchestrator",
    priority: "P2",
    unit: "triggers/second",
    warning_threshold: 50,
    critical_threshold: 100,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "ORCH-005",
    name: "Orchestrator Workflow Execution Rate",
    category: "orchestrator",
    description: "Workflow-Execution-Rate im Orchestrator",
    priority: "P2",
    unit: "workflows/second",
    warning_threshold: 10,
    critical_threshold: 20,
    collection_interval: "5s",
    dsfa_relevance: "Medium",
  },
  {
    id: "ORCH-006",
    name: "Orchestrator P7-Approval Block Rate",
    category: "orchestrator",
    description: "Rate der P7-Approval-Blockierungen im Orchestrator",
    priority: "P1",
    unit: "percent",
    warning_threshold: 5,
    critical_threshold: 10,
    collection_interval: "5s",
    dsfa_relevance: "High",
  },
  // Datenbank-Metriken (5 Metriken)
  {
    id: "DB-001",
    name: "DB Connection Pool Usage",
    category: "db",
    description: "Auslastung des DB-Connection-Pools",
    priority: "P1",
    unit: "percent",
    warning_threshold: 80,
    critical_threshold: 95,
    collection_interval: "10s",
    dsfa_relevance: "Medium",
  },
  {
    id: "DB-002",
    name: "DB Slow Query Count",
    category: "db",
    description: "Anzahl langsamer Queries (>1 Sekunde)",
    priority: "P1",
    unit: "queries",
    warning_threshold: 10, // pro Stunde
    critical_threshold: 50, // pro Stunde
    collection_interval: "10s",
    dsfa_relevance: "High",
  },
  {
    id: "DB-003",
    name: "DB Slow Query Time (Avg)",
    category: "db",
    description: "Durchschnittliche Ausführungszeit langsamer Queries",
    priority: "P1",
    unit: "milliseconds",
    warning_threshold: 2000,
    critical_threshold: 10000,
    collection_interval: "10s",
    dsfa_relevance: "High",
  },
  {
    id: "DB-004",
    name: "DB Query Rate",
    category: "db",
    description: "DB-Query-Rate (Queries pro Sekunde)",
    priority: "P2",
    unit: "queries/second",
    warning_threshold: 500,
    critical_threshold: 1000,
    collection_interval: "10s",
    dsfa_relevance: "Medium",
  },
  {
    id: "DB-005",
    name: "DB Replication Lag",
    category: "db",
    description: "Replication-Lag zwischen Master und Slave",
    priority: "P2",
    unit: "milliseconds",
    warning_threshold: 1000,
    critical_threshold: 5000,
    collection_interval: "10s",
    dsfa_relevance: "Low",
  },
  // Cache-Metriken (3 Metriken)
  {
    id: "CACHE-001",
    name: "Cache Hit Rate",
    category: "cache",
    description: "Cache-Hit-Rate in Prozent",
    priority: "P2",
    unit: "percent",
    warning_threshold: 80,
    critical_threshold: 60,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "CACHE-002",
    name: "Cache Miss Rate",
    category: "cache",
    description: "Cache-Miss-Rate in Prozent",
    priority: "P2",
    unit: "percent",
    warning_threshold: 20,
    critical_threshold: 40,
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
  {
    id: "CACHE-003",
    name: "Cache Memory Usage",
    category: "cache",
    description: "Cache-Speicherverbrauch in Bytes",
    priority: "P3",
    unit: "bytes",
    warning_threshold: 1 * 1024 * 1024 * 1024, // 1GB
    critical_threshold: 2 * 1024 * 1024 * 1024, // 2GB
    collection_interval: "5s",
    dsfa_relevance: "Low",
  },
];

/**
 * Helfer: Metrik-Definition nach ID abrufen
 */
export function getMetricDefinition(metricId: string): TelemetryMetricDefinition | undefined {
  return TELEMETRY_METRICS.find((m) => m.id === metricId);
}

/**
 * Helfer: Alle Metriken einer Kategorie abrufen
 */
export function getMetricsByCategory(category: TelemetryCategory): TelemetryMetricDefinition[] {
  return TELEMETRY_METRICS.filter((m) => m.category === category);
}

/**
 * Helfer: Alle Metriken einer Priorität abrufen
 */
export function getMetricsByPriority(priority: MetricPriority): TelemetryMetricDefinition[] {
  return TELEMETRY_METRICS.filter((m) => m.priority === priority);
}





