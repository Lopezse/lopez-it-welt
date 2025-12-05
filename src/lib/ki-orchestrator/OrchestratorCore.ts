/**
 * Orchestrator Core - Enterprise++ Standard
 * 
 * Zentrale Klasse für KI-Orchestrierung
 * Koordiniert alle KI-Agenten mit DSGVO-Integration
 */

import type { OrchestratorTask, OrchestratorResult } from "./types";
import { agentRegistry } from "./AgentRegistry";
import { contextManager } from "./ContextManager";
import { qualityGate } from "./QualityGate";
import { orchestratorAudit } from "./OrchestratorAudit";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import { logger } from "@/lib/logger";
// UUID-Generierung (Fallback, wenn uuid-Package nicht verfügbar)
function generateUUID(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

class OrchestratorCore {
    /**
     * Registriert einen Agenten
     */
    async registerAgent(agentDef: {
        name: string;
        type: "media" | "dev" | "doc" | "support" | "business" | "monitoring" | "admin" | "orchestrator";
        capabilities: string[];
        dsgvoScope: string[];
        riskProfile: "low" | "medium" | "high";
        enabled?: boolean;
    }): Promise<void> {
        agentRegistry.addAgent(agentDef);
        await orchestratorAudit.logAgentRegistered(agentDef.name, agentDef.type);
        logger.info(`Agent registriert im Orchestrator: ${agentDef.name}`);
    }

    /**
     * Entfernt einen Agenten
     */
    async unregisterAgent(agentName: string): Promise<void> {
        const success = agentRegistry.removeAgent(agentName);
        if (success) {
            await orchestratorAudit.logAgentUnregistered(agentName);
            logger.info(`Agent entfernt aus Orchestrator: ${agentName}`);
        }
    }

    /**
     * Dispatcht einen Task asynchron (Queue)
     */
    async dispatchTaskAsync(
        task: OrchestratorTask,
        options?: {
            priority?: number;
            delay?: number;
        }
    ): Promise<string | null> {
        const { enqueueTask } = await import("./QueueManager");
        return await enqueueTask(task, options);
    }

    /**
     * Dispatcht einen Task an einen Agenten
     */
    async dispatchTask(task: OrchestratorTask): Promise<OrchestratorResult> {
        const taskId = task.id || generateUUID();
        const timestamp = new Date().toISOString();

        try {
            // 1. Task-Empfang loggen
            await orchestratorAudit.logTaskReceived({ ...task, id: taskId });

            // 2. Agent prüfen
            if (!agentRegistry.hasAgent(task.agent)) {
                const error = `Agent ${task.agent} nicht gefunden`;
                await orchestratorAudit.logTaskFailed({ ...task, id: taskId }, error);
                return {
                    success: false,
                    taskId,
                    agent: task.agent,
                    error,
                    timestamp
                };
            }

            // 3. Agent aktiviert?
            if (!agentRegistry.isAgentEnabled(task.agent)) {
                const error = `Agent ${task.agent} ist deaktiviert`;
                await orchestratorAudit.logTaskFailed({ ...task, id: taskId }, error);
                return {
                    success: false,
                    taskId,
                    agent: task.agent,
                    error,
                    timestamp
                };
            }

            // 4. DSGVO Decision Engine prüfen
            const dsgvoDecision = await dsgvoDecisionEngine.getAIProcessingPermission({
                userId: task.userId,
                purpose: this.mapPurposeToDSGVOPurpose(task.purpose),
                mediaId: task.payload.mediaId as string | undefined,
                context: task.context || {}
            });

            if (!dsgvoDecision.allowed) {
                await orchestratorAudit.logTaskBlockedDSGVO(
                    { ...task, id: taskId },
                    dsgvoDecision.reason
                );
                return {
                    success: false,
                    taskId,
                    agent: task.agent,
                    error: `DSGVO-Blocker: ${dsgvoDecision.reason}`,
                    dsgvoDecision: {
                        allowed: false,
                        reason: dsgvoDecision.reason,
                        risk: dsgvoDecision.risk
                    },
                    timestamp
                };
            }

            // 5. Input Quality Gate prüfen
            const inputQuality = await qualityGate.evaluateInputQuality({ ...task, id: taskId });
            if (!inputQuality.passed) {
                const error = `Input Quality Gate fehlgeschlagen: ${inputQuality.issues.join(", ")}`;
                await orchestratorAudit.logTaskFailed({ ...task, id: taskId }, error);
                return {
                    success: false,
                    taskId,
                    agent: task.agent,
                    error,
                    qualityScore: inputQuality.score,
                    timestamp
                };
            }

            // 6. Kontext bauen
            const context = await contextManager.buildContextForTask({ ...task, id: taskId });

            // 7. Task an Agent routen
            await orchestratorAudit.logTaskDispatched({ ...task, id: taskId }, task.agent);
            const agentResult = await this.routeToAgent({ ...task, id: taskId }, context);

            // 8. Output Quality Gate prüfen
            const outputQuality = await qualityGate.evaluateOutputQuality(agentResult);
            const policyCompliance = await qualityGate.checkPolicyCompliance(
                { ...task, id: taskId },
                agentResult
            );

            // 9. Quality Gates durchsetzen
            const qualityResult = await this.enforceQualityGates(
                { ...task, id: taskId },
                agentResult,
                inputQuality,
                outputQuality,
                policyCompliance
            );

            // 10. Ergebnis zusammenstellen
            const finalResult: OrchestratorResult = {
                ...agentResult,
                qualityScore: qualityResult.score,
                dsgvoDecision: {
                    allowed: dsgvoDecision.allowed,
                    reason: dsgvoDecision.reason,
                    risk: dsgvoDecision.risk
                }
            };

            // 11. Task-Abschluss loggen
            if (finalResult.success) {
                await orchestratorAudit.logTaskCompleted({ ...task, id: taskId }, finalResult);
            } else {
                await orchestratorAudit.logTaskFailed(
                    { ...task, id: taskId },
                    finalResult.error || "Unbekannter Fehler"
                );
            }

            return finalResult;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
            logger.error("Fehler beim Dispatch eines Orchestrator-Tasks", error);
            
            await orchestratorAudit.logTaskFailed(
                { ...task, id: taskId },
                errorMessage
            );

            return {
                success: false,
                taskId,
                agent: task.agent,
                error: errorMessage,
                timestamp
            };
        }
    }

    /**
     * Routet Task an Agenten (Mock-Implementierung)
     * In Produktion: Echte Agent-Aufrufe
     */
    private async routeToAgent(
        task: OrchestratorTask,
        context: Awaited<ReturnType<typeof contextManager.buildContextForTask>>
    ): Promise<OrchestratorResult> {
        // Mock-Implementierung
        // In Produktion: Echte Agent-Aufrufe basierend auf Agent-Typ
        
        logger.info(`Routing Task ${task.id} an Agent ${task.agent}`);

        // Simuliere Agent-Ausführung
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            success: true,
            taskId: task.id!,
            agent: task.agent,
            result: {
                message: `Task erfolgreich an ${task.agent} geroutet`,
                context: context.dsgvoContext?.hasConsent ? "DSGVO-konform" : "DSGVO-Blocker"
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Durchsetzt Quality Gates
     */
    private async enforceQualityGates(
        task: OrchestratorTask,
        result: OrchestratorResult,
        inputQuality: Awaited<ReturnType<typeof qualityGate.evaluateInputQuality>>,
        outputQuality: Awaited<ReturnType<typeof qualityGate.evaluateOutputQuality>>,
        policyCompliance: Awaited<ReturnType<typeof qualityGate.checkPolicyCompliance>>
    ): Promise<{ passed: boolean; score: number; issues: string[] }> {
        const allIssues = [
            ...inputQuality.issues,
            ...outputQuality.issues,
            ...policyCompliance.issues
        ];

        const avgScore = (
            inputQuality.score + 
            outputQuality.score + 
            policyCompliance.score
        ) / 3;

        const passed = allIssues.length === 0 && avgScore >= 70;

        if (!passed) {
            logger.warn(`Quality Gates nicht bestanden für Task ${task.id}: ${allIssues.join(", ")}`);
        }

        return {
            passed,
            score: Math.round(avgScore),
            issues: allIssues
        };
    }

    /**
     * Loggt Orchestrator-Event
     */
    async logOrchestrationEvent(
        eventType: "ORCH_TASK_RECEIVED" | "ORCH_TASK_BLOCKED_DSGVO" | "ORCH_TASK_DISPATCHED" | "ORCH_TASK_COMPLETED" | "ORCH_TASK_FAILED",
        task: OrchestratorTask | null,
        result: OrchestratorResult | null,
        details?: Record<string, unknown>
    ): Promise<void> {
        await orchestratorAudit.logEvent(eventType, task, result, details);
    }

    /**
     * Mappt Purpose zu DSGVO-Purpose
     */
    private mapPurposeToDSGVOPurpose(purpose: string): 
        "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics" {
        
        if (purpose.includes("media") || purpose.includes("image") || purpose.includes("tagging")) {
            return "media_ki";
        }
        if (purpose.includes("person") || purpose.includes("detection")) {
            return "person_detection";
        }
        if (purpose.includes("profile") || purpose.includes("building")) {
            return "profile_building";
        }
        if (purpose.includes("analytics") || purpose.includes("analysis")) {
            return "analytics";
        }

        return "orchestrator_ki";
    }
}

export const orchestratorCore = new OrchestratorCore();

