/**
 * Orchestrator Audit Logger - Enterprise++ Standard
 * 
 * Wrapper um Audit-Logger für Orchestrator-Events
 * Schreibt in bestehendes Audit-Log-System
 */

import type { OrchestratorEventType, OrchestratorTask, OrchestratorResult } from "./types";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

class OrchestratorAudit {
    /**
     * Loggt Orchestrator-Event
     */
    async logEvent(
        eventType: OrchestratorEventType,
        task: OrchestratorTask | null,
        result: OrchestratorResult | null,
        details?: Record<string, unknown>
    ): Promise<void> {
        try {
            const connection = await getConnection();
            
            const action = this.getActionDescription(eventType, task, result);
            const resourceType = "orchestrator";
            const resourceId = task?.id || result?.taskId || null;
            const dataCategory = task?.purpose || "orchestrator";
            
            const eventDetails: Record<string, unknown> = {
                eventType,
                agent: task?.agent || result?.agent || null,
                purpose: task?.purpose || null,
                ...details
            };

            if (result) {
                eventDetails.success = result.success;
                eventDetails.qualityScore = result.qualityScore;
                if (result.dsgvoDecision) {
                    eventDetails.dsgvoDecision = result.dsgvoDecision;
                }
            }

            await connection.execute(
                `INSERT INTO dsgvo_audit_events 
                 (user_id, event_type, action, resource_type, resource_id, data_category, details, result)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    task?.userId || result?.taskId || null,
                    eventType,
                    action,
                    resourceType,
                    resourceId,
                    dataCategory,
                    JSON.stringify(eventDetails),
                    result?.success ? "success" : (result ? "failure" : "pending")
                ]
            );

            logger.info(`Orchestrator Event geloggt: ${eventType} für Task ${resourceId || "unknown"}`);
        } catch (error) {
            logger.error("Fehler beim Schreiben des Orchestrator-Audit-Logs", error);
            // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
        }
    }

    /**
     * Loggt Task-Empfang
     */
    async logTaskReceived(task: OrchestratorTask): Promise<void> {
        await this.logEvent("ORCH_TASK_RECEIVED", task, null, {
            priority: task.priority || "medium"
        });
    }

    /**
     * Loggt DSGVO-Blockierung
     */
    async logTaskBlockedDSGVO(task: OrchestratorTask, reason: string): Promise<void> {
        await this.logEvent("ORCH_TASK_BLOCKED_DSGVO", task, null, {
            reason
        });
    }

    /**
     * Loggt Task-Dispatch
     */
    async logTaskDispatched(task: OrchestratorTask, agentName: string): Promise<void> {
        await this.logEvent("ORCH_TASK_DISPATCHED", task, null, {
            agentName
        });
    }

    /**
     * Loggt Task-Abschluss
     */
    async logTaskCompleted(task: OrchestratorTask, result: OrchestratorResult): Promise<void> {
        await this.logEvent("ORCH_TASK_COMPLETED", task, result);
    }

    /**
     * Loggt Task-Fehler
     */
    async logTaskFailed(task: OrchestratorTask, error: string): Promise<void> {
        const failedResult: OrchestratorResult = {
            success: false,
            taskId: task.id || "unknown",
            agent: task.agent,
            error,
            timestamp: new Date().toISOString()
        };
        await this.logEvent("ORCH_TASK_FAILED", task, failedResult);
    }

    /**
     * Loggt Agent-Registrierung
     */
    async logAgentRegistered(agentName: string, agentType: string): Promise<void> {
        await this.logEvent("ORCH_AGENT_REGISTERED", null, null, {
            agentName,
            agentType
        });
    }

    /**
     * Loggt Agent-Entfernung
     */
    async logAgentUnregistered(agentName: string): Promise<void> {
        await this.logEvent("ORCH_AGENT_UNREGISTERED", null, null, {
            agentName
        });
    }

    /**
     * Gibt Action-Beschreibung zurück
     */
    private getActionDescription(
        eventType: OrchestratorEventType,
        task: OrchestratorTask | null,
        result: OrchestratorResult | null
    ): string {
        switch (eventType) {
            case "ORCH_TASK_RECEIVED":
                return `Orchestrator Task empfangen: ${task?.agent || "unknown"}`;
            case "ORCH_TASK_BLOCKED_DSGVO":
                return `Orchestrator Task blockiert (DSGVO): ${task?.agent || "unknown"}`;
            case "ORCH_TASK_DISPATCHED":
                return `Orchestrator Task dispatched: ${task?.agent || "unknown"}`;
            case "ORCH_TASK_COMPLETED":
                return `Orchestrator Task abgeschlossen: ${result?.agent || "unknown"}`;
            case "ORCH_TASK_FAILED":
                return `Orchestrator Task fehlgeschlagen: ${task?.agent || "unknown"}`;
            case "ORCH_AGENT_REGISTERED":
                return "Agent registriert";
            case "ORCH_AGENT_UNREGISTERED":
                return "Agent entfernt";
            default:
                return `Orchestrator Event: ${eventType}`;
        }
    }
}

export const orchestratorAudit = new OrchestratorAudit();



