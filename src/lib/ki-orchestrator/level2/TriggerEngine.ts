/**
 * Trigger Engine - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * Event-basierte Trigger-Erkennung und -Auslösung
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { UUIDService } from "@/lib/uuid-service";
import { orchestratorCore } from "../OrchestratorCore";
import { approvalManager } from "./ApprovalManager";
import { auditManager } from "./AuditManager";
import type {
    OrchestratorEvent,
    Trigger,
    TriggerDefinition,
    TriggerFilters,
    ValidationResult
} from "./types";

class TriggerEngine {
    /**
     * Registriert einen neuen Trigger
     */
    async registerTrigger(trigger: TriggerDefinition): Promise<string> {
        try {
            const connection = await getConnection();
            const triggerId = trigger.id || `trigger-${UUIDService.generateV4()}`;
            const now = new Date().toISOString();

            // Validierung
            const validation = await this.validateTrigger(trigger);
            if (!validation.valid) {
                throw new Error(`Trigger-Validierung fehlgeschlagen: ${validation.errors?.join(", ")}`);
            }

            await connection.execute(
                `INSERT INTO orchestrator_triggers 
                 (id, name, type, event_type, conditions, actions, enabled, approval_required, approval_status, created_at, updated_at, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    triggerId,
                    trigger.name,
                    trigger.type,
                    trigger.event_type || null,
                    JSON.stringify(trigger.conditions || {}),
                    JSON.stringify(trigger.actions),
                    trigger.enabled !== false,
                    trigger.approval_required || false,
                    trigger.approval_status || (trigger.approval_required ? 'pending' : 'not_required'),
                    now,
                    now,
                    trigger.created_by || null
                ]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_TRIGGER_CREATED",
                resource_type: "trigger",
                resource_id: triggerId,
                details: {
                    name: trigger.name,
                    type: trigger.type,
                    enabled: trigger.enabled !== false
                }
            });

            logger.info(`Trigger registriert: ${triggerId} (${trigger.name})`);
            return triggerId;
        } catch (error) {
            logger.error("Fehler beim Registrieren des Triggers", error);
            throw error;
        }
    }

    /**
     * Aktiviert einen Trigger
     */
    async enableTrigger(triggerId: string): Promise<void> {
        try {
            const connection = await getConnection();

            await connection.execute(
                `UPDATE orchestrator_triggers 
                 SET enabled = TRUE, updated_at = NOW()
                 WHERE id = ?`,
                [triggerId]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_TRIGGER_ENABLED",
                resource_type: "trigger",
                resource_id: triggerId
            });

            logger.info(`Trigger aktiviert: ${triggerId}`);
        } catch (error) {
            logger.error("Fehler beim Aktivieren des Triggers", error);
            throw error;
        }
    }

    /**
     * Deaktiviert einen Trigger
     */
    async disableTrigger(triggerId: string): Promise<void> {
        try {
            const connection = await getConnection();

            await connection.execute(
                `UPDATE orchestrator_triggers 
                 SET enabled = FALSE, updated_at = NOW()
                 WHERE id = ?`,
                [triggerId]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_TRIGGER_DISABLED",
                resource_type: "trigger",
                resource_id: triggerId
            });

            logger.info(`Trigger deaktiviert: ${triggerId}`);
        } catch (error) {
            logger.error("Fehler beim Deaktivieren des Triggers", error);
            throw error;
        }
    }

    /**
     * Löst einen Trigger manuell aus
     */
    async fireTrigger(triggerId: string, context?: Record<string, unknown>): Promise<void> {
        try {
            const connection = await getConnection();

            const [rows] = await connection.execute(
                `SELECT * FROM orchestrator_triggers WHERE id = ?`,
                [triggerId]
            );

            const triggers = Array.isArray(rows) ? rows : [];
            if (triggers.length === 0) {
                throw new Error(`Trigger nicht gefunden: ${triggerId}`);
            }

            const trigger = triggers[0] as any;

            if (!trigger.enabled) {
                throw new Error(`Trigger ist deaktiviert: ${triggerId}`);
            }

            // Approval-Status prüfen
            if (trigger.approval_required && trigger.approval_status !== 'approved') {
                await auditManager.logEvent({
                    event_type: "ORCH_TRIGGER_BLOCKED",
                    resource_type: "trigger",
                    resource_id: triggerId,
                    details: {
                        reason: "Approval erforderlich",
                        approval_status: trigger.approval_status
                    }
                });
                throw new Error(`Trigger erfordert Approval: ${triggerId}`);
            }

            // Trigger auslösen
            await this.executeTriggerActions(trigger, context);

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_TRIGGER_FIRED",
                resource_type: "trigger",
                resource_id: triggerId,
                details: {
                    context: context || {}
                }
            });

            logger.info(`Trigger ausgelöst: ${triggerId}`);
        } catch (error) {
            logger.error("Fehler beim Auslösen des Triggers", error);
            throw error;
        }
    }

    /**
     * Event-Listener (automatisch)
     * 
     * WICHTIG: Prüft P7-Approval-Status für jeden Trigger vor Ausführung
     */
    async onEvent(event: OrchestratorEvent): Promise<void> {
        try {
            const connection = await getConnection();

            // Alle aktiven Trigger für diesen Event-Typ finden
            const [rows] = await connection.execute(
                `SELECT * FROM orchestrator_triggers 
                 WHERE enabled = TRUE 
                 AND type = 'event-based'
                 AND event_type = ?
                 AND (approval_required = FALSE OR approval_status = 'approved')`,
                [event.event_type]
            );

            const triggers = Array.isArray(rows) ? rows : [];

            for (const triggerRow of triggers) {
                const trigger = triggerRow as any;

                // Bedingungen prüfen
                const conditions = typeof trigger.conditions === 'string'
                    ? JSON.parse(trigger.conditions)
                    : trigger.conditions;

                if (!this.checkConditions(conditions, event)) {
                    continue; // Bedingungen nicht erfüllt
                }

                // Use-Case extrahieren
                const useCase = this.extractUseCaseFromTrigger(trigger, {
                    event: event.event_type,
                    resource_type: event.resource_type,
                    resource_id: event.resource_id,
                    details: event.details
                });

                // Use-Case-Validierung: "unknown" nicht zulassen
                if (!useCase || useCase === 'unknown') {
                    await auditManager.logEvent({
                        event_type: "ORCH_USE_CASE_UNKNOWN",
                        resource_type: "trigger",
                        resource_id: trigger.id,
                        details: {
                            trigger_name: trigger.name,
                            reason: "Use-Case konnte nicht ermittelt werden",
                            event_type: event.event_type
                        }
                    });
                    logger.warn(`Trigger ${trigger.id} blockiert: Use-Case unbekannt`);
                    continue; // Trigger nicht ausführen
                }

                // P7-Approval-Status prüfen
                const approvalStatus = await approvalManager.checkApprovalStatus(useCase);

                // Prüfe ob Approval-Status gültig ist
                if (!approvalStatus.can_execute ||
                    approvalStatus.approval_status === 'rejected' ||
                    approvalStatus.approval_status === 'expired') {

                    // Audit-Log: AUTO_BLOCKED
                    await auditManager.logEvent({
                        event_type: "ORCH_TRIGGER_AUTO_BLOCKED",
                        resource_type: "trigger",
                        resource_id: trigger.id,
                        details: {
                            use_case: useCase,
                            approval_status: approvalStatus.approval_status,
                            reason: approvalStatus.reason || "Keine gültige P7-Freigabe",
                            trigger_name: trigger.name,
                            event_type: event.event_type
                        }
                    });

                    logger.warn(`Trigger ${trigger.id} automatisch blockiert: ${approvalStatus.reason}`);
                    continue; // Trigger nicht ausführen
                }

                // Trigger ausführen
                await this.executeTriggerActions(trigger, {
                    event: event.event_type,
                    resource_type: event.resource_type,
                    resource_id: event.resource_id,
                    details: event.details,
                    use_case: useCase
                });
            }
        } catch (error) {
            logger.error("Fehler beim Verarbeiten des Events", error);
            // Nicht werfen, da Event-Verarbeitung nicht kritisch sein sollte
        }
    }

    /**
     * Validiert einen Trigger
     */
    async validateTrigger(trigger: TriggerDefinition): Promise<ValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Name prüfen
        if (!trigger.name || trigger.name.trim().length === 0) {
            errors.push("Trigger-Name ist erforderlich");
        }

        // Typ prüfen
        if (!trigger.type) {
            errors.push("Trigger-Typ ist erforderlich");
        }

        // Event-basierte Trigger benötigen event_type
        if (trigger.type === 'event-based' && !trigger.event_type) {
            errors.push("Event-basierte Trigger benötigen event_type");
        }

        // Actions prüfen
        if (!trigger.actions || trigger.actions.length === 0) {
            errors.push("Mindestens eine Action ist erforderlich");
        }

        // Actions validieren
        for (const action of trigger.actions || []) {
            if (action.type === 'create_task' && !action.agent) {
                errors.push("Action 'create_task' benötigt 'agent'");
            }
            if (action.type === 'start_workflow' && !action.workflow_id) {
                errors.push("Action 'start_workflow' benötigt 'workflow_id'");
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Ruft Trigger-Liste ab
     */
    async getTriggers(filters: TriggerFilters = {}): Promise<Trigger[]> {
        try {
            const connection = await getConnection();

            let query = `SELECT id, name, type, enabled, approval_status, created_at, updated_at
                         FROM orchestrator_triggers
                         WHERE 1=1`;
            const params: unknown[] = [];

            if (filters.enabled !== undefined) {
                query += ` AND enabled = ?`;
                params.push(filters.enabled);
            }

            if (filters.type) {
                query += ` AND type = ?`;
                params.push(filters.type);
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
            const triggers = Array.isArray(rows) ? rows : [];

            return triggers.map((row: any) => ({
                id: row.id,
                name: row.name,
                type: row.type,
                enabled: row.enabled === 1 || row.enabled === true,
                approval_status: row.approval_status,
                created_at: row.created_at,
                updated_at: row.updated_at
            }));
        } catch (error) {
            logger.error("Fehler beim Abrufen der Trigger", error);
            throw error;
        }
    }

    /**
     * Prüft Bedingungen
     */
    private checkConditions(conditions: Record<string, unknown>, event: OrchestratorEvent): boolean {
        if (!conditions || Object.keys(conditions).length === 0) {
            return true; // Keine Bedingungen = immer erfüllt
        }

        const eventDetails = event.details || {};

        for (const [key, value] of Object.entries(conditions)) {
            if (eventDetails[key] !== value) {
                return false;
            }
        }

        return true;
    }

    /**
     * Extrahiert Use-Case aus einem Trigger
     * 
     * Reihenfolge:
     * 1. Explizites use_case Feld im Trigger (falls vorhanden)
     * 2. Context.use_case
     * 3. Actions[0].use_case oder Actions[0].agent
     * 4. Trigger-Name (Pattern-Matching)
     * 
     * Gibt null zurück wenn kein Use-Case gefunden werden kann (nicht "unknown"!)
     */
    private extractUseCaseFromTrigger(trigger: any, context?: Record<string, unknown>): string | null {
        // 1. Explizites use_case Feld (falls in Zukunft hinzugefügt)
        if (trigger.use_case && trigger.use_case !== 'unknown') {
            return trigger.use_case;
        }

        // 2. Context.use_case
        if (context?.use_case && context.use_case !== 'unknown') {
            return context.use_case as string;
        }

        // 3. Actions[0].use_case oder Actions[0].agent
        const actions = typeof trigger.actions === 'string'
            ? JSON.parse(trigger.actions)
            : trigger.actions;

        if (Array.isArray(actions) && actions.length > 0) {
            const firstAction = actions[0];
            if (firstAction.use_case && firstAction.use_case !== 'unknown') {
                return firstAction.use_case;
            }
            if (firstAction.agent && firstAction.agent !== 'unknown') {
                // Agent-Name zu Use-Case mappen
                const agent = firstAction.agent.toLowerCase();
                if (agent.includes('media')) return 'media-ki';
                if (agent.includes('content')) return 'content-agent';
                if (agent.includes('compliance')) return 'compliance-agent';
                // Weitere Mappings können hier hinzugefügt werden
            }
        }

        // 4. Trigger-Name (Pattern-Matching)
        const triggerName = (trigger.name || '').toLowerCase();
        if (triggerName.includes('media')) return 'media-ki';
        if (triggerName.includes('content')) return 'content-agent';
        if (triggerName.includes('compliance')) return 'compliance-agent';

        // Kein Use-Case gefunden
        return null;
    }

    /**
     * Führt Trigger-Actions aus
     */
    private async executeTriggerActions(trigger: any, context?: Record<string, unknown>): Promise<void> {
        const actions = typeof trigger.actions === 'string'
            ? JSON.parse(trigger.actions)
            : trigger.actions;

        for (const action of actions) {
            try {
                if (action.type === 'create_task') {
                    await orchestratorCore.dispatchTaskAsync({
                        agent: action.agent,
                        purpose: action.purpose || 'automated',
                        userId: context?.userId as string || 'system',
                        payload: {
                            ...context,
                            trigger_id: trigger.id,
                            trigger_name: trigger.name
                        },
                        priority: action.priority || 'medium'
                    });
                } else if (action.type === 'start_workflow') {
                    // Workflow wird später implementiert
                    logger.info(`Workflow starten: ${action.workflow_id} (noch nicht implementiert)`);
                } else if (action.type === 'send_notification') {
                    // Notification wird später implementiert
                    logger.info(`Notification senden (noch nicht implementiert)`);
                } else if (action.type === 'lock_system') {
                    // Lock wird später implementiert
                    logger.info(`System sperren (noch nicht implementiert)`);
                }
            } catch (error) {
                logger.error(`Fehler beim Ausführen der Action: ${action.type}`, error);
            }
        }
    }
}

export const triggerEngine = new TriggerEngine();

