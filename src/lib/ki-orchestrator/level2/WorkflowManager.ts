/**
 * Workflow Manager - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * Multi-Step-Workflow-Management
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { UUIDService } from "@/lib/uuid-service";
import { orchestratorCore } from "../OrchestratorCore";
import { approvalManager } from "./ApprovalManager";
import { auditManager } from "./AuditManager";
import type { 
    WorkflowDefinition, 
    Workflow, 
    WorkflowFilters, 
    WorkflowExecution,
    ExecutionStatus,
    StepResult 
} from "./types";

class WorkflowManager {
    /**
     * Erstellt einen neuen Workflow
     */
    async createWorkflow(workflow: WorkflowDefinition): Promise<string> {
        try {
            const connection = await getConnection();
            const workflowId = workflow.id || `workflow-${UUIDService.generateV4()}`;
            const now = new Date().toISOString();

            await connection.execute(
                `INSERT INTO orchestrator_workflows 
                 (id, name, description, steps, status, approval_required, approval_status, created_at, updated_at, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    workflowId,
                    workflow.name,
                    workflow.description || null,
                    JSON.stringify(workflow.steps),
                    workflow.status || 'draft',
                    workflow.approval_required || false,
                    workflow.approval_status || (workflow.approval_required ? 'pending' : 'not_required'),
                    now,
                    now,
                    workflow.created_by || null
                ]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_WORKFLOW_CREATED",
                resource_type: "workflow",
                resource_id: workflowId,
                details: {
                    name: workflow.name,
                    steps_count: workflow.steps.length
                }
            });

            logger.info(`Workflow erstellt: ${workflowId} (${workflow.name})`);
            return workflowId;
        } catch (error) {
            logger.error("Fehler beim Erstellen des Workflows", error);
            throw error;
        }
    }

    /**
     * Startet einen Workflow
     */
    async startWorkflow(workflowId: string, payload?: Record<string, unknown>): Promise<string> {
        try {
            const connection = await getConnection();
            
            // Workflow abrufen
            const [rows] = await connection.execute(
                `SELECT * FROM orchestrator_workflows WHERE id = ?`,
                [workflowId]
            );

            const workflows = Array.isArray(rows) ? rows : [];
            if (workflows.length === 0) {
                throw new Error(`Workflow nicht gefunden: ${workflowId}`);
            }

            const workflow = workflows[0] as any;

            // Status prüfen
            if (workflow.status !== 'active' && workflow.status !== 'draft') {
                throw new Error(`Workflow kann nicht gestartet werden: Status ist ${workflow.status}`);
            }

            // Approval-Status prüfen
            if (workflow.approval_required && workflow.approval_status !== 'approved') {
                throw new Error(`Workflow erfordert Approval: ${workflowId}`);
            }

            // Execution erstellen
            const executionId = `exec-${UUIDService.generateV4()}`;
            const now = new Date().toISOString();

            await connection.execute(
                `INSERT INTO orchestrator_workflow_executions 
                 (id, workflow_id, execution_id, status, payload, started_at, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    `exec-${UUIDService.generateV4()}`,
                    workflowId,
                    executionId,
                    'active',
                    JSON.stringify(payload || {}),
                    now,
                    now,
                    now
                ]
            );

            // Ersten Schritt ausführen
            const steps = typeof workflow.steps === 'string' 
                ? JSON.parse(workflow.steps) 
                : workflow.steps;

            if (steps.length > 0) {
                await this.executeStep(executionId, steps[0].id);
            }

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_WORKFLOW_STARTED",
                resource_type: "workflow",
                resource_id: workflowId,
                details: {
                    execution_id: executionId
                }
            });

            logger.info(`Workflow gestartet: ${workflowId} (Execution: ${executionId})`);
            return executionId;
        } catch (error) {
            logger.error("Fehler beim Starten des Workflows", error);
            throw error;
        }
    }

    /**
     * Pausiert einen Workflow
     */
    async pauseWorkflow(executionId: string): Promise<void> {
        try {
            const connection = await getConnection();
            
            await connection.execute(
                `UPDATE orchestrator_workflow_executions 
                 SET status = 'paused', updated_at = NOW()
                 WHERE execution_id = ?`,
                [executionId]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_WORKFLOW_PAUSED",
                resource_type: "workflow_execution",
                resource_id: executionId
            });

            logger.info(`Workflow pausiert: ${executionId}`);
        } catch (error) {
            logger.error("Fehler beim Pausieren des Workflows", error);
            throw error;
        }
    }

    /**
     * Setzt einen Workflow fort
     */
    async resumeWorkflow(executionId: string): Promise<void> {
        try {
            const connection = await getConnection();
            
            await connection.execute(
                `UPDATE orchestrator_workflow_executions 
                 SET status = 'active', updated_at = NOW()
                 WHERE execution_id = ? AND status = 'paused'`,
                [executionId]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_WORKFLOW_RESUMED",
                resource_type: "workflow_execution",
                resource_id: executionId
            });

            logger.info(`Workflow fortgesetzt: ${executionId}`);
        } catch (error) {
            logger.error("Fehler beim Fortsetzen des Workflows", error);
            throw error;
        }
    }

    /**
     * Ruft Workflow-Status ab
     */
    async getWorkflowStatus(executionId: string): Promise<WorkflowExecution> {
        try {
            const connection = await getConnection();
            
            const [rows] = await connection.execute(
                `SELECT * FROM orchestrator_workflow_executions WHERE execution_id = ?`,
                [executionId]
            );

            const executions = Array.isArray(rows) ? rows : [];
            if (executions.length === 0) {
                throw new Error(`Workflow-Execution nicht gefunden: ${executionId}`);
            }

            const exec = executions[0] as any;

            return {
                id: exec.id,
                workflow_id: exec.workflow_id,
                execution_id: exec.execution_id,
                status: exec.status as ExecutionStatus,
                current_step: exec.current_step || undefined,
                payload: typeof exec.payload === 'string' ? JSON.parse(exec.payload) : exec.payload,
                result: typeof exec.result === 'string' ? JSON.parse(exec.result) : exec.result,
                error: exec.error || undefined,
                started_at: exec.started_at?.toISOString(),
                completed_at: exec.completed_at?.toISOString(),
                created_at: exec.created_at,
                updated_at: exec.updated_at
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen des Workflow-Status", error);
            throw error;
        }
    }

    /**
     * Ruft Workflow-Liste ab
     */
    async getWorkflows(filters: WorkflowFilters = {}): Promise<Workflow[]> {
        try {
            const connection = await getConnection();
            
            let query = `SELECT id, name, status, approval_status, created_at, updated_at
                         FROM orchestrator_workflows
                         WHERE 1=1`;
            const params: unknown[] = [];

            if (filters.status) {
                query += ` AND status = ?`;
                params.push(filters.status);
            }

            if (filters.approval_status) {
                query += ` AND approval_status = ?`;
                params.push(filters.approval_status);
            }

            query += ` ORDER BY created_at DESC`;

            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            } else {
                query += ` LIMIT 100`; // Default limit
            }

            const [rows] = await connection.execute(query, params);
            const workflows = Array.isArray(rows) ? rows : [];

            return workflows.map((row: any) => ({
                id: row.id,
                name: row.name,
                status: row.status,
                approval_status: row.approval_status,
                created_at: row.created_at,
                updated_at: row.updated_at
            }));
        } catch (error) {
            logger.error("Fehler beim Abrufen der Workflows", error);
            throw error;
        }
    }

    /**
     * Führt einen Workflow-Schritt aus
     */
    async executeStep(executionId: string, stepId: string): Promise<StepResult> {
        try {
            const connection = await getConnection();
            
            // Execution abrufen
            const [execRows] = await connection.execute(
                `SELECT * FROM orchestrator_workflow_executions WHERE execution_id = ?`,
                [executionId]
            );

            const executions = Array.isArray(execRows) ? execRows : [];
            if (executions.length === 0) {
                throw new Error(`Workflow-Execution nicht gefunden: ${executionId}`);
            }

            const exec = executions[0] as any;

            // Workflow abrufen
            const [workflowRows] = await connection.execute(
                `SELECT * FROM orchestrator_workflows WHERE id = ?`,
                [exec.workflow_id]
            );

            const workflows = Array.isArray(workflowRows) ? workflowRows : [];
            if (workflows.length === 0) {
                throw new Error(`Workflow nicht gefunden: ${exec.workflow_id}`);
            }

            const workflow = workflows[0] as any;
            const steps = typeof workflow.steps === 'string' 
                ? JSON.parse(workflow.steps) 
                : workflow.steps;

            // Schritt finden
            const step = steps.find((s: any) => s.id === stepId);
            if (!step) {
                throw new Error(`Workflow-Schritt nicht gefunden: ${stepId}`);
            }

            // Schritt ausführen
            const startTime = Date.now();
            
            try {
                // Task an Orchestrator senden
                const taskResult = await orchestratorCore.dispatchTaskAsync({
                    agent: step.agent,
                    purpose: step.purpose,
                    userId: 'system',
                    payload: {
                        ...(typeof exec.payload === 'string' ? JSON.parse(exec.payload) : exec.payload),
                        step_id: stepId,
                        execution_id: executionId
                    },
                    priority: 'medium'
                });

                const executionTime = Date.now() - startTime;

                // Ergebnis speichern
                const result = typeof exec.result === 'string' ? JSON.parse(exec.result) : (exec.result || {});
                result[stepId] = {
                    status: 'completed',
                    result: taskResult,
                    execution_time_ms: executionTime
                };

                await connection.execute(
                    `UPDATE orchestrator_workflow_executions 
                     SET current_step = ?, result = ?, updated_at = NOW()
                     WHERE execution_id = ?`,
                    [stepId, JSON.stringify(result), executionId]
                );

                // Audit-Log
                await auditManager.logEvent({
                    event_type: "ORCH_WORKFLOW_STEP_COMPLETED",
                    resource_type: "workflow_execution",
                    resource_id: executionId,
                    details: {
                        step_id: stepId,
                        execution_time_ms: executionTime
                    }
                });

                // Nächsten Schritt prüfen
                if (step.on_success && step.on_success !== 'workflow-completed') {
                    // Nächsten Schritt ausführen
                    await this.executeStep(executionId, step.on_success);
                } else {
                    // Workflow abgeschlossen
                    await connection.execute(
                        `UPDATE orchestrator_workflow_executions 
                         SET status = 'completed', completed_at = NOW(), updated_at = NOW()
                         WHERE execution_id = ?`,
                        [executionId]
                    );

                    await auditManager.logEvent({
                        event_type: "ORCH_WORKFLOW_COMPLETED",
                        resource_type: "workflow",
                        resource_id: exec.workflow_id,
                        details: {
                            execution_id: executionId
                        }
                    });
                }

                return {
                    step_id: stepId,
                    status: 'completed',
                    result: taskResult,
                    execution_time_ms: executionTime
                };
            } catch (error) {
                const executionTime = Date.now() - startTime;
                const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';

                // Fehler speichern
                await connection.execute(
                    `UPDATE orchestrator_workflow_executions 
                     SET status = 'failed', error = ?, updated_at = NOW()
                     WHERE execution_id = ?`,
                    [errorMessage, executionId]
                );

                // Audit-Log
                await auditManager.logEvent({
                    event_type: "ORCH_WORKFLOW_STEP_FAILED",
                    resource_type: "workflow_execution",
                    resource_id: executionId,
                    details: {
                        step_id: stepId,
                        error: errorMessage,
                        execution_time_ms: executionTime
                    }
                });

                return {
                    step_id: stepId,
                    status: 'failed',
                    error: errorMessage,
                    execution_time_ms: executionTime
                };
            }
        } catch (error) {
            logger.error("Fehler beim Ausführen des Workflow-Schritts", error);
            throw error;
        }
    }
}

export const workflowManager = new WorkflowManager();






