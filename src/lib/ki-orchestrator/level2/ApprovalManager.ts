/**
 * Approval Manager - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * P7 Manual Approval Integration
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { UUIDService } from "@/lib/uuid-service";
import { approvalService } from "@/lib/dsgvo/approval-service";
import { auditManager } from "./AuditManager";
import type { ApprovalStatus, ApprovalRequest, ApprovalStatusResponse } from "./types";

class ApprovalManager {
    /**
     * Prüft Approval-Status für einen Use-Case
     */
    async checkApprovalStatus(useCase: string): Promise<ApprovalStatusResponse> {
        try {
            const connection = await getConnection();
            
            // P7 Approval prüfen
            const approvals = await approvalService.listApprovals({
                use_case_id: useCase,
                limit: 1
            });

            if (approvals.length === 0) {
                return {
                    use_case: useCase,
                    approval_status: 'not_required',
                    can_execute: false,
                    reason: "Kein Approval gefunden"
                };
            }

            const approval = approvals[0];
            const now = new Date();
            const approvalDate = approval.approval_date ? new Date(approval.approval_date) : null;
            const reviewDate = approval.review_date ? new Date(approval.review_date) : null;

            // Prüfe ob Approval abgelaufen ist (expired)
            let isExpired = false;
            let expiredReason = "";

            // Prüfe Ablaufdatum (6 Monate)
            if (approvalDate) {
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                
                if (approvalDate < sixMonthsAgo) {
                    isExpired = true;
                    expiredReason = "Approval abgelaufen (älter als 6 Monate)";
                }
            }

            // Prüfe Review-Datum
            if (reviewDate && reviewDate < now) {
                isExpired = true;
                expiredReason = "Review-Datum überschritten";
            }

            // Prüfe Approval-Status
            let canExecute = approval.approval_status === 'approved' && !isExpired;
            let reason = "Approval vorhanden";
            let mappedStatus: ApprovalStatus;

            // Prüfe ob Status rejected oder needs_improvement ist
            if (approval.approval_status === 'rejected' || approval.approval_status === 'needs_improvement') {
                canExecute = false;
                reason = `Approval-Status ist '${approval.approval_status}'`;
                mappedStatus = 'rejected';
            } else if (isExpired) {
                // Expired hat Priorität
                canExecute = false;
                reason = expiredReason;
                mappedStatus = 'expired';
            } else if (approval.approval_status === 'approved') {
                mappedStatus = 'approved';
            } else if (approval.approval_status === 'pending') {
                mappedStatus = 'pending';
                canExecute = false;
                reason = "Approval ist noch ausstehend";
            } else {
                mappedStatus = 'not_required';
                canExecute = false;
                reason = `Unbekannter Approval-Status: ${approval.approval_status}`;
            }

            const approvedBy: string[] = [];
            if (approval.approved_by_dsfa) approvedBy.push(approval.approved_by_dsfa);
            if (approval.approved_by_dsb) approvedBy.push(approval.approved_by_dsb);
            if (approval.approved_by_architect) approvedBy.push(approval.approved_by_architect);

            return {
                use_case: useCase,
                approval_status: mappedStatus,
                approval_date: approval.approval_date?.toISOString(),
                approved_by: approvedBy,
                expires_at: approvalDate ? new Date(approvalDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
                can_execute: canExecute,
                reason
            };
        } catch (error) {
            logger.error("Fehler beim Prüfen des Approval-Status", error);
            return {
                use_case: useCase,
                approval_status: 'not_required',
                can_execute: false,
                reason: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
            };
        }
    }

    /**
     * Erstellt einen Approval-Request
     */
    async createApprovalRequest(request: ApprovalRequest): Promise<string> {
        try {
            const connection = await getConnection();
            const requestId = request.id || `approval-request-${UUIDService.generateV4()}`;
            const now = new Date().toISOString();

            // Ablaufdatum: 7 Tage
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await connection.execute(
                `INSERT INTO orchestrator_approval_requests 
                 (id, use_case, request_type, reason, change_type, status, requested_by, expires_at, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    requestId,
                    request.use_case,
                    request.request_type || 'initial',
                    request.reason,
                    request.change_type || null,
                    'pending',
                    request.requested_by || 'system',
                    expiresAt.toISOString(),
                    now,
                    now
                ]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_APPROVAL_REQUESTED",
                resource_type: "approval_request",
                resource_id: requestId,
                details: {
                    use_case: request.use_case,
                    request_type: request.request_type,
                    reason: request.reason
                }
            });

            logger.info(`Approval-Request erstellt: ${requestId} für Use-Case ${request.use_case}`);
            return requestId;
        } catch (error) {
            logger.error("Fehler beim Erstellen des Approval-Requests", error);
            throw error;
        }
    }

    /**
     * Sperrt System für einen Use-Case
     */
    async lockSystem(useCase: string, reason: string): Promise<void> {
        try {
            const connection = await getConnection();
            
            // Automation-Status auf locked setzen
            await connection.execute(
                `UPDATE orchestrator_automation_status 
                 SET automation_enabled = FALSE, updated_at = NOW()
                 WHERE use_case = ?`,
                [useCase]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_SYSTEM_LOCKED",
                resource_type: "automation",
                resource_id: useCase,
                details: {
                    use_case: useCase,
                    reason
                }
            });

            logger.info(`System gesperrt für Use-Case: ${useCase} (Grund: ${reason})`);
        } catch (error) {
            logger.error("Fehler beim Sperren des Systems", error);
            throw error;
        }
    }

    /**
     * Entsperrt System für einen Use-Case
     */
    async unlockSystem(useCase: string): Promise<void> {
        try {
            const connection = await getConnection();
            
            // Prüfe ob Approval vorhanden
            const approvalStatus = await this.checkApprovalStatus(useCase);
            
            if (!approvalStatus.can_execute) {
                throw new Error(`System kann nicht entsperrt werden: ${approvalStatus.reason}`);
            }

            // Automation-Status auf enabled setzen
            await connection.execute(
                `UPDATE orchestrator_automation_status 
                 SET automation_enabled = TRUE, updated_at = NOW()
                 WHERE use_case = ?`,
                [useCase]
            );

            // Audit-Log
            await auditManager.logEvent({
                event_type: "ORCH_SYSTEM_UNLOCKED",
                resource_type: "automation",
                resource_id: useCase,
                details: {
                    use_case: useCase
                }
            });

            logger.info(`System entsperrt für Use-Case: ${useCase}`);
        } catch (error) {
            logger.error("Fehler beim Entsperren des Systems", error);
            throw error;
        }
    }

    /**
     * Prüft ob Re-Approval erforderlich ist
     */
    async checkReApprovalRequired(useCase: string, changeType: string): Promise<boolean> {
        // Re-Approval erforderlich bei:
        // - Model-Update
        // - Provider-Wechsel
        // - Parameter-Änderungen
        // - Risk-Score-Änderung > 10 Punkte

        const reApprovalChangeTypes = ['model_update', 'provider_change', 'parameter_change', 'risk_score_change'];
        
        return reApprovalChangeTypes.includes(changeType);
    }

    /**
     * Mappt P7 Approval-Status zu Level 2 Approval-Status
     * 
     * WICHTIG: Diese Methode wird nicht mehr direkt verwendet.
     * Die expired-Prüfung erfolgt jetzt in checkApprovalStatus() basierend auf Datum/Zeit.
     * Diese Methode bleibt für Rückwärtskompatibilität erhalten.
     */
    private mapApprovalStatus(status: string): ApprovalStatus {
        switch (status) {
            case 'approved': return 'approved';
            case 'pending': return 'pending';
            case 'rejected': return 'rejected';
            case 'needs_improvement': return 'rejected';
            case 'expired': return 'expired';
            default: return 'not_required';
        }
    }
}

export const approvalManager = new ApprovalManager();

