/**
 * Automation Engine - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * Automatische Task-Ausführung
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { UUIDService } from "@/lib/uuid-service";
import { approvalManager } from "./ApprovalManager";
import { auditManager } from "./AuditManager";
import type { AutomationStatus, UseCaseAutomationStatus, AutomationStats } from "./types";

class AutomationEngine {
    /**
     * Aktiviert Automation für einen Use-Case
     */
    async enableAutomation(useCase: string, automationType: string = 'full'): Promise<void> {
        try {
            const connection = await getConnection();
            
            // Approval-Status prüfen
            const approvalStatus = await approvalManager.checkApprovalStatus(useCase);
            
            if (!approvalStatus.can_execute) {
                throw new Error(`Automation kann nicht aktiviert werden: ${approvalStatus.reason}`);
            }

            // Automation-Status erstellen oder aktualisieren
            const now = new Date().toISOString();
            
            await connection.execute(
                `INSERT INTO orchestrator_automation_status 
                 (id, use_case, automation_enabled, enabled_at, created_at, updated_at)
                 VALUES (?, ?, TRUE, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 automation_enabled = TRUE, 
                 enabled_at = ?,
                 updated_at = ?`,
                [
                    `automation-${UUIDService.generateV4()}`,
                    useCase,
                    now,
                    now,
                    now,
                    now,
                    now
                ]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_AUTOMATION_ENABLED",
                resource_type: "automation",
                resource_id: useCase,
                details: {
                    use_case: useCase,
                    automation_type: automationType
                }
            });

            logger.info(`Automation aktiviert für Use-Case: ${useCase}`);
        } catch (error) {
            logger.error("Fehler beim Aktivieren der Automation", error);
            throw error;
        }
    }

    /**
     * Deaktiviert Automation für einen Use-Case
     */
    async disableAutomation(useCase: string): Promise<void> {
        try {
            const connection = await getConnection();
            const now = new Date().toISOString();
            
            await connection.execute(
                `UPDATE orchestrator_automation_status 
                 SET automation_enabled = FALSE, 
                     disabled_at = ?,
                     updated_at = ?
                 WHERE use_case = ?`,
                [now, now, useCase]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_AUTOMATION_DISABLED",
                resource_type: "automation",
                resource_id: useCase,
                details: {
                    use_case: useCase
                }
            });

            logger.info(`Automation deaktiviert für Use-Case: ${useCase}`);
        } catch (error) {
            logger.error("Fehler beim Deaktivieren der Automation", error);
            throw error;
        }
    }

    /**
     * Ruft Automation-Status ab
     */
    async getAutomationStatus(useCase?: string): Promise<AutomationStatus> {
        try {
            const connection = await getConnection();
            
            let query = `SELECT * FROM orchestrator_automation_status`;
            const params: unknown[] = [];

            if (useCase) {
                query += ` WHERE use_case = ?`;
                params.push(useCase);
            }

            const [rows] = await connection.execute(query, params);
            const statuses = Array.isArray(rows) ? rows : [];

            if (useCase && statuses.length === 0) {
                // Status nicht vorhanden = nicht aktiviert
                return {
                    automation_enabled: false,
                    use_cases: []
                };
            }

            const useCases: UseCaseAutomationStatus[] = statuses.map((row: any) => ({
                use_case: row.use_case,
                automation_enabled: row.automation_enabled === 1 || row.automation_enabled === true,
                triggers_count: row.triggers_count || 0,
                workflows_count: row.workflows_count || 0,
                last_trigger_fired_at: row.last_trigger_fired_at?.toISOString(),
                last_workflow_started_at: row.last_workflow_started_at?.toISOString()
            }));

            return {
                automation_enabled: useCases.some(uc => uc.automation_enabled),
                use_cases: useCases,
                last_updated: new Date().toISOString()
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen des Automation-Status", error);
            throw error;
        }
    }

    /**
     * Ruft Automation-Statistiken ab
     */
    async getAutomationStats(period: string = 'day'): Promise<AutomationStats> {
        try {
            const connection = await getConnection();
            
            // Zeitraum berechnen
            const now = new Date();
            let startDate: Date;
            
            switch (period) {
                case 'day':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }

            // Trigger-Firings zählen
            const [triggerRows] = await connection.execute(
                `SELECT COUNT(*) as count FROM orchestrator_events 
                 WHERE event_type = 'ORCH_TRIGGER_FIRED' 
                 AND timestamp >= ?`,
                [startDate.toISOString()]
            );
            const triggersFired = (triggerRows as any[])[0]?.count || 0;

            // Workflow-Starts zählen
            const [workflowStartRows] = await connection.execute(
                `SELECT COUNT(*) as count FROM orchestrator_events 
                 WHERE event_type = 'ORCH_WORKFLOW_STARTED' 
                 AND timestamp >= ?`,
                [startDate.toISOString()]
            );
            const workflowsStarted = (workflowStartRows as any[])[0]?.count || 0;

            // Workflow-Completions zählen
            const [workflowCompleteRows] = await connection.execute(
                `SELECT COUNT(*) as count FROM orchestrator_events 
                 WHERE event_type = 'ORCH_WORKFLOW_COMPLETED' 
                 AND timestamp >= ?`,
                [startDate.toISOString()]
            );
            const workflowsCompleted = (workflowCompleteRows as any[])[0]?.count || 0;

            // Workflow-Failures zählen
            const [workflowFailRows] = await connection.execute(
                `SELECT COUNT(*) as count FROM orchestrator_events 
                 WHERE event_type = 'ORCH_WORKFLOW_FAILED' 
                 AND timestamp >= ?`,
                [startDate.toISOString()]
            );
            const workflowsFailed = (workflowFailRows as any[])[0]?.count || 0;

            // Success Rate berechnen
            const totalWorkflows = workflowsStarted;
            const automationSuccessRate = totalWorkflows > 0 
                ? (workflowsCompleted / totalWorkflows) * 100 
                : 0;

            return {
                period,
                triggers_fired: triggersFired,
                workflows_started: workflowsStarted,
                workflows_completed: workflowsCompleted,
                workflows_failed: workflowsFailed,
                automation_success_rate: Math.round(automationSuccessRate * 10) / 10,
                last_updated: new Date().toISOString()
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen der Automation-Statistiken", error);
            throw error;
        }
    }
}

export const automationEngine = new AutomationEngine();






