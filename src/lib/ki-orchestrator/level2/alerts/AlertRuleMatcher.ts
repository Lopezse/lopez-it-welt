/**
 * Alert Rule Matcher - Orchestrator Level 2 P8-C
 * Enterprise++ Standard
 * 
 * Matches events against alert rules
 */

import type { OrchestratorEvent, AlertRule, AlertSeverity, AlertCategory } from "../types";

/**
 * All 29 Alert Rules as defined in P8-C-ALERT-RULES.md
 */
export const ALERT_RULES: AlertRule[] = [
  // Security Rules (6)
  {
    id: "SEC-001",
    category: "Security",
    severity: "critical",
    trigger: "SECURITY_UNAUTHORIZED_ACCESS",
    dsfa_relevance: "High",
    description: "Unberechtigter Zugriff erkannt",
  },
  {
    id: "SEC-002",
    category: "Security",
    severity: "critical",
    trigger: "RBAC_VIOLATION",
    dsfa_relevance: "High",
    description: "RBAC-Verletzung",
  },
  {
    id: "SEC-003",
    category: "Security",
    severity: "critical",
    trigger: "SESSION_HIJACKING_ATTEMPT",
    dsfa_relevance: "High",
    description: "Session-Hijacking-Versuch",
  },
  {
    id: "SEC-004",
    category: "Security",
    severity: "warning",
    trigger: "BRUTE_FORCE_ATTEMPT",
    dsfa_relevance: "Medium",
    description: "Brute-Force-Angriff",
  },
  {
    id: "SEC-005",
    category: "Security",
    severity: "critical",
    trigger: "SQL_INJECTION_ATTEMPT",
    dsfa_relevance: "High",
    description: "SQL-Injection-Versuch",
  },
  {
    id: "SEC-006",
    category: "Security",
    severity: "critical",
    trigger: "XSS_ATTEMPT",
    dsfa_relevance: "High",
    description: "XSS-Angriff",
  },
  // Compliance Rules (5)
  {
    id: "COMP-001",
    category: "Compliance",
    severity: "critical",
    trigger: "DSGVO_VIOLATION",
    dsfa_relevance: "High",
    description: "DSGVO-Verstoß",
  },
  {
    id: "COMP-002",
    category: "Compliance",
    severity: "critical",
    trigger: "PD_DETECTED_IN_ALERT",
    dsfa_relevance: "High",
    description: "Personenbezogene Daten in Alert",
  },
  {
    id: "COMP-003",
    category: "Compliance",
    severity: "critical",
    trigger: "P7_APPROVAL_MISSING",
    dsfa_relevance: "High",
    description: "Fehlende P7-Approval",
  },
  {
    id: "COMP-004",
    category: "Compliance",
    severity: "warning",
    trigger: "P7_APPROVAL_EXPIRED",
    dsfa_relevance: "Medium",
    description: "Abgelaufene P7-Approval",
  },
  {
    id: "COMP-005",
    category: "Compliance",
    severity: "critical",
    trigger: "GOBD_VIOLATION",
    dsfa_relevance: "High",
    description: "GoBD-Verstoß",
  },
  // Performance Rules (4)
  {
    id: "PERF-001",
    category: "Performance",
    severity: "warning",
    trigger: "API_LATENCY_HIGH",
    dsfa_relevance: "Low",
    description: "Hohe API-Latenz",
  },
  {
    id: "PERF-002",
    category: "Performance",
    severity: "warning",
    trigger: "QUEUE_OVERLOAD",
    dsfa_relevance: "Low",
    description: "Queue-Überlastung",
  },
  {
    id: "PERF-003",
    category: "Performance",
    severity: "warning",
    trigger: "MEMORY_HIGH",
    dsfa_relevance: "Low",
    description: "Speicher-Überlastung",
  },
  {
    id: "PERF-004",
    category: "Performance",
    severity: "warning",
    trigger: "CPU_HIGH",
    dsfa_relevance: "Low",
    description: "CPU-Überlastung",
  },
  // Systemintegrität Rules (4)
  {
    id: "SYS-001",
    category: "Systemintegrität",
    severity: "critical",
    trigger: "DATABASE_CONNECTION_ERROR",
    dsfa_relevance: "High",
    description: "Datenbank-Verbindungsfehler",
  },
  {
    id: "SYS-002",
    category: "Systemintegrität",
    severity: "warning",
    trigger: "REDIS_CONNECTION_ERROR",
    dsfa_relevance: "Low",
    description: "Redis-Verbindungsfehler",
  },
  {
    id: "SYS-003",
    category: "Systemintegrität",
    severity: "critical",
    trigger: "FILESYSTEM_ERROR",
    dsfa_relevance: "High",
    description: "Dateisystem-Fehler",
  },
  {
    id: "SYS-004",
    category: "Systemintegrität",
    severity: "critical",
    trigger: "SERVICE_DOWN",
    dsfa_relevance: "High",
    description: "Service-Ausfall",
  },
  // Orchestrator Rules (5)
  {
    id: "ORCH-001",
    category: "Orchestrator",
    severity: "warning",
    trigger: "ORCH_TRIGGER_FIRE_BLOCKED",
    dsfa_relevance: "Medium",
    description: "Trigger-Fire-Blockiert",
  },
  {
    id: "ORCH-002",
    category: "Orchestrator",
    severity: "warning",
    trigger: "ORCH_WORKFLOW_ERROR",
    dsfa_relevance: "Medium",
    description: "Workflow-Fehler",
  },
  {
    id: "ORCH-003",
    category: "Orchestrator",
    severity: "warning",
    trigger: "ORCH_QUEUE_TIMEOUT",
    dsfa_relevance: "Low",
    description: "Queue-Timeout",
  },
  {
    id: "ORCH-004",
    category: "Orchestrator",
    severity: "warning",
    trigger: "ORCH_AGENT_ERROR",
    dsfa_relevance: "Medium",
    description: "Agent-Fehler",
  },
  {
    id: "ORCH-005",
    category: "Orchestrator",
    severity: "critical",
    trigger: "ORCH_USE_CASE_UNKNOWN",
    dsfa_relevance: "High",
    description: "Unknown Use-Case",
  },
  // KI-Risiken Rules (5)
  {
    id: "AI-001",
    category: "KI-Risiken",
    severity: "warning",
    trigger: "AI_MODEL_ERROR",
    dsfa_relevance: "Medium",
    description: "KI-Modell-Fehler",
  },
  {
    id: "AI-002",
    category: "KI-Risiken",
    severity: "warning",
    trigger: "QUALITY_GATE_FAILED",
    dsfa_relevance: "Medium",
    description: "QualityGate-Fehler",
  },
  {
    id: "AI-003",
    category: "KI-Risiken",
    severity: "warning",
    trigger: "AI_PROVIDER_ERROR",
    dsfa_relevance: "Medium",
    description: "Provider-Fehler",
  },
  {
    id: "AI-004",
    category: "KI-Risiken",
    severity: "critical",
    trigger: "AI_PERSON_DETECTED_NO_APPROVAL",
    dsfa_relevance: "High",
    description: "Personen-Erkennung ohne Freigabe",
  },
  {
    id: "AI-005",
    category: "KI-Risiken",
    severity: "warning",
    trigger: "AI_COST_EXCEEDED",
    dsfa_relevance: "Low",
    description: "Kosten-Überschreitung",
  },
];

/**
 * Matches an event against alert rules
 */
export function matchRules(event: OrchestratorEvent): AlertRule[] {
  const matchedRules: AlertRule[] = [];

  for (const rule of ALERT_RULES) {
    if (matchesRule(event, rule)) {
      matchedRules.push(rule);
    }
  }

  return matchedRules;
}

/**
 * Checks if an event matches a specific rule
 */
function matchesRule(event: OrchestratorEvent, rule: AlertRule): boolean {
  // Simple event_type matching
  if (event.event_type === rule.trigger) {
    return true;
  }

  // Additional condition checks based on payload
  if (rule.trigger.includes("AND")) {
    const conditions = rule.trigger.split(" AND ");
    for (const condition of conditions) {
      if (condition.includes(">=")) {
        const [key, value] = condition.split(">=").map((s) => s.trim());
        const eventValue = (event.details as Record<string, unknown>)?.[key];
        if (typeof eventValue === "number" && eventValue < Number(value)) {
          return false;
        }
      } else if (condition.includes(">")) {
        const [key, value] = condition.split(">").map((s) => s.trim());
        const eventValue = (event.details as Record<string, unknown>)?.[key];
        if (typeof eventValue === "number" && eventValue <= Number(value)) {
          return false;
        }
      } else if (condition.includes("=")) {
        const [key, value] = condition.split("=").map((s) => s.trim().replace(/['"]/g, ""));
        const eventValue = (event.details as Record<string, unknown>)?.[key];
        if (String(eventValue) !== value) {
          return false;
        }
      }
    }
    return true;
  }

  return false;
}

/**
 * Determines severity based on rule and event
 */
export function determineSeverity(rule: AlertRule, event: OrchestratorEvent): AlertSeverity {
  // Rule severity is leading
  return rule.severity;
}





