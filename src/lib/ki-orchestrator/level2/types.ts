/**
 * Orchestrator Level 2 - Type Definitions
 * Enterprise++ Standard
 * 
 * Vollständige TypeScript-Typen für Orchestrator Level 2
 */

// =====================================================
// TRIGGER TYPES
// =====================================================

export type TriggerType = 'event-based' | 'time-based' | 'data-based' | 'condition-based';

export type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired' | 'locked';

export interface TriggerDefinition {
  id?: string;
  name: string;
  type: TriggerType;
  event_type?: string;
  conditions?: Record<string, unknown>;
  actions: TriggerAction[];
  enabled?: boolean;
  approval_required?: boolean;
  approval_status?: ApprovalStatus;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface TriggerAction {
  type: 'create_task' | 'start_workflow' | 'send_notification' | 'lock_system';
  agent?: string;
  workflow_id?: string;
  purpose?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  [key: string]: unknown;
}

export interface TriggerFilters {
  enabled?: boolean;
  type?: TriggerType;
  approval_status?: ApprovalStatus;
  limit?: number;
  offset?: number;
}

export interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  enabled: boolean;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

// =====================================================
// WORKFLOW TYPES
// =====================================================

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'archived';

export interface WorkflowDefinition {
  id?: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  status?: WorkflowStatus;
  approval_required?: boolean;
  approval_status?: ApprovalStatus;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  purpose: string;
  on_success: string;
  on_failure: string;
  timeout?: number;
  retry_count?: number;
  conditions?: Record<string, unknown>;
}

export interface WorkflowFilters {
  status?: WorkflowStatus;
  approval_status?: ApprovalStatus;
  limit?: number;
  offset?: number;
}

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

// =====================================================
// WORKFLOW EXECUTION TYPES
// =====================================================

export type ExecutionStatus = 'pending' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  execution_id: string;
  status: ExecutionStatus;
  current_step?: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StepResult {
  step_id: string;
  status: 'completed' | 'failed' | 'skipped';
  result?: unknown;
  error?: string;
  execution_time_ms?: number;
}

// =====================================================
// EVENT TYPES
// =====================================================

export interface OrchestratorEvent {
  id?: string;
  event_type: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  audit_hash?: string;
  timestamp?: string;
}

export interface EventFilters {
  event_type?: string;
  resource_type?: string;
  resource_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

// =====================================================
// PRIORITY TYPES
// =====================================================

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'background';

export interface PriorityCalculation {
  base_priority: number;
  context_bonus: number;
  risk_penalty: number;
  time_bonus: number;
  final_priority: number;
}

// =====================================================
// AUTOMATION TYPES
// =====================================================

export interface AutomationStatus {
  automation_enabled: boolean;
  use_cases?: UseCaseAutomationStatus[];
  last_updated?: string;
}

export interface UseCaseAutomationStatus {
  use_case: string;
  automation_enabled: boolean;
  triggers_count: number;
  workflows_count: number;
  last_trigger_fired_at?: string;
  last_workflow_started_at?: string;
}

export interface AutomationStats {
  period: string;
  triggers_fired: number;
  workflows_started: number;
  workflows_completed: number;
  workflows_failed: number;
  automation_success_rate: number;
  last_updated: string;
}

// =====================================================
// APPROVAL TYPES (P7 Integration)
// =====================================================

export type RequestType = 'initial' | 're_approval';

export interface ApprovalRequest {
  id?: string;
  use_case: string;
  request_type: RequestType;
  reason: string;
  change_type?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'expired';
  requested_by?: string;
  approved_by?: string;
  approved_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApprovalStatusResponse {
  use_case: string;
  approval_status: ApprovalStatus;
  approval_date?: string;
  approved_by?: string[];
  expires_at?: string;
  can_execute: boolean;
  reason?: string;
}

// =====================================================
// VALIDATION TYPES
// =====================================================

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// =====================================================
// AUDIT TYPES
// =====================================================

export interface AuditLog {
  id: string;
  event_type: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, unknown>;
  audit_hash: string;
  timestamp: string;
}

export interface AuditFilters {
  event_type?: string;
  resource_type?: string;
  resource_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

// =====================================================
// ALERT TYPES (P8-C)
// =====================================================

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'open' | 'acknowledged' | 'escalated' | 'closed' | 'ignored';
export type AlertCategory = 'Security' | 'Compliance' | 'Performance' | 'Systemintegrität' | 'Orchestrator' | 'KI-Risiken' | 'Sicherheit' | 'Datenqualität';

export interface Alert {
  id: string;
  alert_rule_id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description?: string;
  payload?: Record<string, unknown>;
  event_type?: string;
  resource_type?: string;
  resource_id?: string;
  triggered_at: string;
  acknowledged_at?: string | null;
  acknowledged_by?: string | null;
  escalated_at?: string | null;
  escalated_by?: string | null;
  closed_at?: string | null;
  closed_by?: string | null;
  incident_id?: string | null;
  audit_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AlertRule {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  trigger: string; // Event type or condition
  payload?: Record<string, unknown>;
  notification?: string[];
  required_action?: string[];
  dsfa_relevance: 'High' | 'Medium' | 'Low';
  description?: string;
}

export interface AlertData {
  alert_rule_id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description?: string;
  payload?: Record<string, unknown>;
  event_type?: string;
  resource_type?: string;
  resource_id?: string;
}

export interface AlertFilters {
  status?: AlertStatus;
  severity?: AlertSeverity;
  category?: AlertCategory;
  limit?: number;
  offset?: number;
}

// =====================================================
// INCIDENT TYPES (P8-C)
// =====================================================

export type IncidentSeverity = 'info' | 'warning' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentEventType = 
  | 'INCIDENT_OPENED'
  | 'INCIDENT_ACKNOWLEDGED'
  | 'INCIDENT_ESCALATED'
  | 'INCIDENT_INVESTIGATING'
  | 'INCIDENT_RESOLVED'
  | 'INCIDENT_CLOSED'
  | 'INCIDENT_COMMENT'
  | 'INCIDENT_ASSIGNED';

export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assigned_to?: string | null;
  sla_minutes: number;
  sla_started_at: string;
  sla_warning_at?: string | null;
  sla_breached_at?: string | null;
  opened_at: string;
  opened_by: string;
  resolved_at?: string | null;
  resolved_by?: string | null;
  closed_at?: string | null;
  closed_by?: string | null;
  escalation_level: number;
  root_cause?: string | null;
  resolution?: string | null;
  post_mortem?: string | null;
  audit_hash: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentEvent {
  id: string;
  incident_id: string;
  event_type: IncidentEventType;
  event_data?: Record<string, unknown>;
  performed_by: string;
  performed_at: string;
  audit_hash: string;
  created_at: string;
}

export interface IncidentData {
  title: string;
  description?: string;
  severity: IncidentSeverity;
  alert_ids?: string[];
  sla_minutes?: number;
}

export interface IncidentFilters {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assigned_to?: string;
  limit?: number;
  offset?: number;
}

export interface ResolutionData {
  resolution: string;
  root_cause?: string;
  verification?: boolean;
}

export interface EscalationData {
  reason: string;
  severity?: IncidentSeverity;
  escalation_level?: number;
}


