/**
 * KI-Orchestrator Types - Enterprise++ Standard
 * 
 * Zentrale Type-Definitionen für den KI-Orchestrator
 */

export type AgentType = 
    | "media" 
    | "dev" 
    | "doc" 
    | "support" 
    | "business" 
    | "monitoring" 
    | "admin" 
    | "orchestrator";

export type RiskProfile = "low" | "medium" | "high";

export interface AgentDefinition {
    name: string;
    type: AgentType;
    capabilities: string[];
    dsgvoScope: string[];
    riskProfile: RiskProfile;
    enabled?: boolean;
}

export interface OrchestratorTask {
    id?: string;
    agent: string;
    purpose: string;
    userId: string;
    payload: Record<string, unknown>;
    context?: Record<string, unknown>;
    priority?: "low" | "medium" | "high";
    timestamp?: string;
}

export interface OrchestratorResult {
    success: boolean;
    taskId: string;
    agent: string;
    result?: unknown;
    error?: string;
    qualityScore?: number;
    dsgvoDecision?: {
        allowed: boolean;
        reason: string;
        risk: number;
    };
    timestamp: string;
}

export interface QualityGateResult {
    passed: boolean;
    score: number;
    issues: string[];
    warnings?: string[];
}

export interface OrchestratorContext {
    userId: string;
    userContext?: Record<string, unknown>;
    dsgvoContext?: {
        hasConsent: boolean;
        consentVersion: string;
        riskScore: number;
    };
    systemContext?: Record<string, unknown>;
    sanitized: boolean;
}

export type OrchestratorEventType =
    | "ORCH_TASK_RECEIVED"
    | "ORCH_TASK_BLOCKED_DSGVO"
    | "ORCH_TASK_DISPATCHED"
    | "ORCH_TASK_COMPLETED"
    | "ORCH_TASK_FAILED"
    | "ORCH_AGENT_REGISTERED"
    | "ORCH_AGENT_UNREGISTERED";



