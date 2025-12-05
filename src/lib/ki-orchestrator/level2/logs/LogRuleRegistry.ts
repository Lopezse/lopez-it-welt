/**
 * Log Rule Registry - Enterprise++ Standard P8-E
 * 
 * Alle 35 Enterprise++ Log-Regeln aus P8-E-LOG-RULES.md
 */

import type { LogRule, LogCategory, LogLevel, LogSeverity, DSFARelevance, MetricPriority } from "./types";

/**
 * Alle 35 Log-Regeln
 */
export const LOG_RULES: LogRule[] = [
  // Security-Log-Regeln (10 Regeln)
  {
    id: "SEC-LOG-001",
    name: "Unauthorized Access Attempt",
    description: "Protokolliert alle Versuche, auf Ressourcen ohne Berechtigung zuzugreifen.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "action.*unauthorized_access|status_code.*401",
    conditions: { action: "unauthorized_access", status_code: 401 },
    alert_rule_id: "SEC-001",
    enabled: true,
  },
  {
    id: "SEC-LOG-002",
    name: "Failed Authentication",
    description: "Protokolliert alle fehlgeschlagenen Authentifizierungsversuche.",
    category: "Security",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "High",
    pattern: "action.*login_failed|status_code.*401",
    conditions: { action: "login_failed", status_code: 401 },
    alert_rule_id: "SEC-002",
    enabled: true,
  },
  {
    id: "SEC-LOG-003",
    name: "Privilege Escalation Attempt",
    description: "Protokolliert alle Versuche, Berechtigungen unberechtigt zu erhöhen.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "action.*privilege_escalation|role_change.*unauthorized",
    conditions: { action: "privilege_escalation", role_change: "unauthorized" },
    alert_rule_id: "SEC-003",
    enabled: true,
  },
  {
    id: "SEC-LOG-004",
    name: "Suspicious IP Address",
    description: "Protokolliert alle Zugriffe von verdächtigen IP-Adressen.",
    category: "Security",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Medium",
    pattern: "ip_address.*blacklist|geolocation.*suspicious",
    conditions: { ip_address: "blacklist", geolocation: "suspicious" },
    alert_rule_id: "SEC-004",
    enabled: true,
  },
  {
    id: "SEC-LOG-005",
    name: "Session Hijacking Attempt",
    description: "Protokolliert alle Versuche, Sessions zu übernehmen.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "action.*session_hijacking|session_id_mismatch.*true",
    conditions: { action: "session_hijacking", session_id_mismatch: true },
    alert_rule_id: "SEC-005",
    enabled: true,
  },
  {
    id: "SEC-LOG-006",
    name: "Data Breach Attempt",
    description: "Protokolliert alle Versuche, auf sensible Daten unberechtigt zuzugreifen.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "action.*data_breach|sensitive_data_access.*unauthorized",
    conditions: { action: "data_breach", sensitive_data_access: "unauthorized" },
    alert_rule_id: "SEC-006",
    enabled: true,
  },
  {
    id: "SEC-LOG-007",
    name: "Brute Force Attack",
    description: "Protokolliert alle Brute-Force-Angriffe (mehr als 5 fehlgeschlagene Logins in 5 Minuten).",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "failed_login_count.*>.*5",
    conditions: { failed_login_count: { $gt: 5 }, time_window: "5_minutes" },
    alert_rule_id: "SEC-007",
    enabled: true,
  },
  {
    id: "SEC-LOG-008",
    name: "SQL Injection Attempt",
    description: "Protokolliert alle SQL-Injection-Versuche.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "query_contains_sql_injection.*true",
    conditions: { query_contains_sql_injection: true },
    alert_rule_id: "SEC-008",
    enabled: true,
  },
  {
    id: "SEC-LOG-009",
    name: "XSS Attack Attempt",
    description: "Protokolliert alle XSS-Angriffsversuche.",
    category: "Security",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "input_contains_xss.*true",
    conditions: { input_contains_xss: true },
    alert_rule_id: "SEC-009",
    enabled: true,
  },
  {
    id: "SEC-LOG-010",
    name: "Security Policy Violation",
    description: "Protokolliert alle Verstöße gegen Sicherheitsrichtlinien.",
    category: "Security",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Medium",
    pattern: "security_policy_violation.*true",
    conditions: { security_policy_violation: true },
    alert_rule_id: "SEC-010",
    enabled: true,
  },
  // API-Log-Regeln (8 Regeln)
  {
    id: "API-LOG-001",
    name: "API Error (5xx)",
    description: "Protokolliert alle 5xx-Fehler in API-Requests.",
    category: "API",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Medium",
    pattern: "status_code.*>=.*500.*<.*600",
    conditions: { status_code: { $gte: 500, $lt: 600 } },
    alert_rule_id: "PERF-001",
    enabled: true,
  },
  {
    id: "API-LOG-002",
    name: "API Error (4xx)",
    description: "Protokolliert alle 4xx-Fehler in API-Requests.",
    category: "API",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "status_code.*>=.*400.*<.*500",
    conditions: { status_code: { $gte: 400, $lt: 500 } },
    alert_rule_id: "PERF-002",
    enabled: true,
  },
  {
    id: "API-LOG-003",
    name: "API Timeout",
    description: "Protokolliert alle API-Timeouts.",
    category: "API",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Medium",
    pattern: "response_time.*>.*timeout_threshold|status_code.*504",
    conditions: { response_time: { $gt: "timeout_threshold" }, status_code: 504 },
    alert_rule_id: "PERF-003",
    enabled: true,
  },
  {
    id: "API-LOG-004",
    name: "API Rate Limit Exceeded",
    description: "Protokolliert alle Rate-Limit-Überschreitungen.",
    category: "API",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "status_code.*429|rate_limit_exceeded.*true",
    conditions: { status_code: 429, rate_limit_exceeded: true },
    alert_rule_id: "PERF-004",
    enabled: true,
  },
  {
    id: "API-LOG-005",
    name: "API Slow Request",
    description: "Protokolliert alle langsamen API-Requests (>2 Sekunden).",
    category: "API",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "response_time.*>.*2000",
    conditions: { response_time: { $gt: 2000 } },
    alert_rule_id: "PERF-005",
    enabled: true,
  },
  {
    id: "API-LOG-006",
    name: "API High Volume",
    description: "Protokolliert hohe API-Request-Volumen (>1000 Requests/Minute).",
    category: "API",
    log_level: "INFO",
    severity: "info",
    dsfa_relevance: "Low",
    pattern: "request_count.*>.*1000",
    conditions: { request_count: { $gt: 1000 }, time_window: "1_minute" },
    alert_rule_id: undefined,
    enabled: true,
  },
  {
    id: "API-LOG-007",
    name: "API Invalid Request",
    description: "Protokolliert alle ungültigen API-Requests.",
    category: "API",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "status_code.*400|validation_error.*true",
    conditions: { status_code: 400, validation_error: true },
    alert_rule_id: "PERF-006",
    enabled: true,
  },
  {
    id: "API-LOG-008",
    name: "API Authentication Failure",
    description: "Protokolliert alle fehlgeschlagenen API-Authentifizierungen.",
    category: "API",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Medium",
    pattern: "status_code.*401|auth_failed.*true",
    conditions: { status_code: 401, auth_failed: true },
    alert_rule_id: "SEC-011",
    enabled: true,
  },
  // Queue-Log-Regeln (5 Regeln)
  {
    id: "QUEUE-LOG-001",
    name: "Queue Task Failed",
    description: "Protokolliert alle fehlgeschlagenen Queue-Tasks.",
    category: "Queue",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Medium",
    pattern: "task_status.*failed|task_error.*!=.*null",
    conditions: { task_status: "failed", task_error: { $ne: null } },
    alert_rule_id: "PERF-007",
    enabled: true,
  },
  {
    id: "QUEUE-LOG-002",
    name: "Queue Task Timeout",
    description: "Protokolliert alle Queue-Task-Timeouts.",
    category: "Queue",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Medium",
    pattern: "task_status.*timeout|task_duration.*>.*timeout_threshold",
    conditions: { task_status: "timeout", task_duration: { $gt: "timeout_threshold" } },
    alert_rule_id: "PERF-008",
    enabled: true,
  },
  {
    id: "QUEUE-LOG-003",
    name: "Queue Depth High",
    description: "Protokolliert hohe Queue-Tiefen (>500 Tasks).",
    category: "Queue",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "queue_depth.*>.*500",
    conditions: { queue_depth: { $gt: 500 } },
    alert_rule_id: "PERF-009",
    enabled: true,
  },
  {
    id: "QUEUE-LOG-004",
    name: "Queue Processing Slow",
    description: "Protokolliert langsame Queue-Verarbeitung (>30 Sekunden).",
    category: "Queue",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "queue_processing_time.*>.*30000",
    conditions: { queue_processing_time: { $gt: 30000 } },
    alert_rule_id: "PERF-010",
    enabled: true,
  },
  {
    id: "QUEUE-LOG-005",
    name: "Queue Worker Down",
    description: "Protokolliert alle Queue-Worker-Ausfälle.",
    category: "Queue",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Low",
    pattern: "worker_status.*down|worker_heartbeat_missing.*true",
    conditions: { worker_status: "down", worker_heartbeat_missing: true },
    alert_rule_id: "PERF-011",
    enabled: true,
  },
  // Workflow-Log-Regeln (5 Regeln)
  {
    id: "WORKFLOW-LOG-001",
    name: "Workflow Execution Failed",
    description: "Protokolliert alle fehlgeschlagenen Workflow-Ausführungen.",
    category: "Workflow",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "workflow_status.*failed|workflow_error.*!=.*null",
    conditions: { workflow_status: "failed", workflow_error: { $ne: null } },
    alert_rule_id: "ORCH-001",
    enabled: true,
  },
  {
    id: "WORKFLOW-LOG-002",
    name: "Workflow Step Failed",
    description: "Protokolliert alle fehlgeschlagenen Workflow-Schritte.",
    category: "Workflow",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Medium",
    pattern: "workflow_step_status.*failed|step_error.*!=.*null",
    conditions: { workflow_step_status: "failed", step_error: { $ne: null } },
    alert_rule_id: "ORCH-002",
    enabled: true,
  },
  {
    id: "WORKFLOW-LOG-003",
    name: "Workflow Timeout",
    description: "Protokolliert alle Workflow-Timeouts.",
    category: "Workflow",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "High",
    pattern: "workflow_status.*timeout|workflow_duration.*>.*timeout_threshold",
    conditions: { workflow_status: "timeout", workflow_duration: { $gt: "timeout_threshold" } },
    alert_rule_id: "ORCH-003",
    enabled: true,
  },
  {
    id: "WORKFLOW-LOG-004",
    name: "Workflow P7-Approval Blocked",
    description: "Protokolliert alle Workflow-Blockierungen durch P7-Approval.",
    category: "Workflow",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "High",
    pattern: "p7_approval_status.*blocked|approval_required.*true",
    conditions: { p7_approval_status: "blocked", approval_required: true },
    alert_rule_id: "ORCH-004",
    enabled: true,
  },
  {
    id: "WORKFLOW-LOG-005",
    name: "Workflow State Change",
    description: "Protokolliert alle Workflow-Zustandsänderungen.",
    category: "Workflow",
    log_level: "INFO",
    severity: "info",
    dsfa_relevance: "Low",
    pattern: "workflow_state_changed.*true",
    conditions: { workflow_state_changed: true },
    alert_rule_id: undefined,
    enabled: true,
  },
  // System-Log-Regeln (4 Regeln)
  {
    id: "SYS-LOG-001",
    name: "System Error",
    description: "Protokolliert alle System-Fehler.",
    category: "System",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Low",
    pattern: "error_level.*system|system_error.*true",
    conditions: { error_level: "system", system_error: true },
    alert_rule_id: "SYS-001",
    enabled: true,
  },
  {
    id: "SYS-LOG-002",
    name: "Database Connection Error",
    description: "Protokolliert alle Datenbank-Verbindungsfehler.",
    category: "System",
    log_level: "ERROR",
    severity: "critical",
    dsfa_relevance: "Low",
    pattern: "db_connection_error.*true|db_pool_exhausted.*true",
    conditions: { db_connection_error: true, db_pool_exhausted: true },
    alert_rule_id: "SYS-002",
    enabled: true,
  },
  {
    id: "SYS-LOG-003",
    name: "Memory Leak Detected",
    description: "Protokolliert alle erkannten Memory-Leaks.",
    category: "System",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "Low",
    pattern: "memory_usage.*>.*90.*memory_trend.*increasing",
    conditions: { memory_usage: { $gt: 90 }, memory_trend: "increasing" },
    alert_rule_id: "SYS-003",
    enabled: true,
  },
  {
    id: "SYS-LOG-004",
    name: "Service Restart",
    description: "Protokolliert alle Service-Neustarts.",
    category: "System",
    log_level: "INFO",
    severity: "info",
    dsfa_relevance: "Low",
    pattern: "service_restarted.*true|service_status.*restarting",
    conditions: { service_restarted: true, service_status: "restarting" },
    alert_rule_id: undefined,
    enabled: true,
  },
  // DSGVO-Log-Regeln (3 Regeln)
  {
    id: "DSGVO-LOG-001",
    name: "DSGVO Consent Change",
    description: "Protokolliert alle DSGVO-Consent-Änderungen.",
    category: "DSGVO",
    log_level: "INFO",
    severity: "info",
    dsfa_relevance: "High",
    pattern: "action.*consent_changed|consent_status_changed.*true",
    conditions: { action: "consent_changed", consent_status_changed: true },
    alert_rule_id: "COMP-001",
    enabled: true,
  },
  {
    id: "DSGVO-LOG-002",
    name: "Privacy Request",
    description: "Protokolliert alle DSGVO-Privacy-Requests.",
    category: "DSGVO",
    log_level: "INFO",
    severity: "info",
    dsfa_relevance: "High",
    pattern: "action.*privacy_request|privacy_request_type.*!=.*null",
    conditions: { action: "privacy_request", privacy_request_type: { $ne: null } },
    alert_rule_id: "COMP-002",
    enabled: true,
  },
  {
    id: "DSGVO-LOG-003",
    name: "AI Processing Blocked",
    description: "Protokolliert alle DSGVO-bedingten KI-Verarbeitungsblockierungen.",
    category: "DSGVO",
    log_level: "WARN",
    severity: "warning",
    dsfa_relevance: "High",
    pattern: "ai_processing_blocked.*true|dsgvo_decision.*blocked",
    conditions: { ai_processing_blocked: true, dsgvo_decision: "blocked" },
    alert_rule_id: "COMP-003",
    enabled: true,
  },
];

/**
 * Gibt eine Log-Regel anhand ihrer ID zurück
 */
export function getLogRule(ruleId: string): LogRule | undefined {
  return LOG_RULES.find((rule) => rule.id === ruleId);
}

/**
 * Gibt alle Log-Regeln für eine Kategorie zurück
 */
export function getLogRulesByCategory(category: LogCategory): LogRule[] {
  return LOG_RULES.filter((rule) => rule.category === category && rule.enabled);
}

/**
 * Gibt alle aktivierten Log-Regeln zurück
 */
export function getEnabledLogRules(): LogRule[] {
  return LOG_RULES.filter((rule) => rule.enabled);
}

/**
 * Prüft, ob ein Log einer Regel entspricht
 */
export function matchesLogRule(log: { message: string; context?: Record<string, unknown> }, rule: LogRule): boolean {
  if (!rule.enabled) {
    return false;
  }

  // Pattern-Matching (vereinfacht)
  if (rule.pattern) {
    const regex = new RegExp(rule.pattern, "i");
    if (regex.test(log.message)) {
      return true;
    }
  }

  // Condition-Matching (vereinfacht)
  if (rule.conditions && log.context) {
    for (const [key, value] of Object.entries(rule.conditions)) {
      if (log.context[key] !== value) {
        // Unterstützung für $gt, $lt, $ne, etc. (vereinfacht)
        if (typeof value === "object" && value !== null) {
          // Skip komplexe Bedingungen für jetzt
          continue;
        }
        return false;
      }
    }
    return true;
  }

  return false;
}





