/**
 * DSGVO Approval Service - Enterprise++ Standard
 * 
 * Service-Layer für Manual Approval (P7-MANUAL-APPROVAL)
 * Implementiert gemäß Spezifikation in docs/COMPLIANCE/DSGVO/P7-MANUAL-APPROVAL.md
 */

import { getConnection } from "@/lib/database";
import { dsgvoAuditLogger } from "./audit-logger";
import { logger } from "@/lib/logger";
import { createHash } from "crypto";
import { UUIDService } from "@/lib/uuid-service";
import { orchestratorCore } from "@/lib/ki-orchestrator/OrchestratorCore";

export type RiskCategory = "low" | "medium" | "high" | "critical";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "needs_improvement";

export interface ApprovalData {
    use_case_id?: string;
    use_case_name: string;
    risk_category: RiskCategory;
    risk_score: number;
    approval_status?: ApprovalStatus;
    approval_reason?: string;
    approval_conditions?: string;
    measures_package?: string;
    review_date?: string;
}

export interface Approval extends ApprovalData {
    id: string;
    approved_by_dsfa?: string;
    approved_by_dsb?: string;
    approved_by_architect?: string;
    approval_date?: Date;
    audit_hash?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ApprovalFilters {
    risk_category?: RiskCategory;
    approval_status?: ApprovalStatus;
    use_case_id?: string;
    limit?: number;
    offset?: number;
}

class ApprovalService {
    /**
     * Validiert Risk-Score vs. Risk-Category
     * Gemäß Review: critical = 80-100, high = 60-79, medium = 40-59, low = 0-39
     */
    validateRiskScore(riskCategory: RiskCategory, riskScore: number): { valid: boolean; error?: string } {
        if (riskScore < 0 || riskScore > 100) {
            return { valid: false, error: "Risk-Score muss zwischen 0 und 100 liegen" };
        }

        switch (riskCategory) {
            case "critical":
                if (riskScore < 80) {
                    return { valid: false, error: "Risk-Score für 'critical' muss zwischen 80 und 100 liegen" };
                }
                break;
            case "high":
                if (riskScore < 60 || riskScore >= 80) {
                    return { valid: false, error: "Risk-Score für 'high' muss zwischen 60 und 79 liegen" };
                }
                break;
            case "medium":
                if (riskScore < 40 || riskScore >= 60) {
                    return { valid: false, error: "Risk-Score für 'medium' muss zwischen 40 und 59 liegen" };
                }
                break;
            case "low":
                if (riskScore >= 40) {
                    return { valid: false, error: "Risk-Score für 'low' muss zwischen 0 und 39 liegen" };
                }
                break;
        }

        return { valid: true };
    }

    /**
     * Generiert vollständigen Audit-Hash für Approval
     * Gemäß Review: Alle relevanten Felder müssen enthalten sein
     */
    generateFullApprovalHash(approval: Approval): string {
        const hashData = {
            id: approval.id,
            use_case_id: approval.use_case_id,
            use_case_name: approval.use_case_name,
            risk_category: approval.risk_category,
            risk_score: approval.risk_score,
            approval_status: approval.approval_status,
            approved_by_dsfa: approval.approved_by_dsfa,
            approved_by_dsb: approval.approved_by_dsb,
            approved_by_architect: approval.approved_by_architect,
            approval_date: approval.approval_date?.toISOString(),
            approval_reason: approval.approval_reason,
            approval_conditions: approval.approval_conditions,
            measures_package: approval.measures_package,
            review_date: approval.review_date,
            created_at: approval.created_at.toISOString(),
            updated_at: approval.updated_at.toISOString()
        };
        return this.generateApprovalHash(hashData);
    }

    /**
     * Erstellt eine neue Freigabe
     */
    async createApproval(
        approvalData: ApprovalData,
        userId: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<Approval> {
        const connection = await getConnection();
        
        // Transaktionsbehandlung: BEGIN
        await connection.beginTransaction();

        try {
            // Risk-Score-Validierung
            const riskValidation = this.validateRiskScore(approvalData.risk_category, approvalData.risk_score);
            if (!riskValidation.valid) {
                await connection.rollback();
                throw new Error(riskValidation.error || "Ungültiger Risk-Score");
            }

            const id = UUIDService.generateV4();
            const now = new Date();

            // Freigabe in Datenbank speichern (ohne Hash, wird nach INSERT generiert)
            await connection.execute(
                `INSERT INTO dsgvo_approvals 
                 (id, use_case_id, use_case_name, risk_category, risk_score, approval_status, 
                  approval_reason, approval_conditions, measures_package, review_date, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    approvalData.use_case_id || null,
                    approvalData.use_case_name,
                    approvalData.risk_category,
                    approvalData.risk_score,
                    approvalData.approval_status || "pending",
                    approvalData.approval_reason || null,
                    approvalData.approval_conditions || null,
                    approvalData.measures_package || null,
                    approvalData.review_date || null,
                    now,
                    now
                ]
            );

            // Freigabe abrufen und Hash generieren
            const approval = await this.getApproval(id);
            if (!approval) {
                await connection.rollback();
                throw new Error("Freigabe konnte nicht erstellt werden");
            }

            // Vollständigen Audit-Hash generieren
            const auditHash = this.generateFullApprovalHash(approval);
            await connection.execute(
                `UPDATE dsgvo_approvals SET audit_hash = ? WHERE id = ?`,
                [auditHash, id]
            );
            approval.audit_hash = auditHash;

            // Audit-Log
            await dsgvoAuditLogger.logApprovalCreated(
                userId,
                id,
                approvalData.use_case_name,
                ipAddress,
                userAgent
            );

            // Transaktionsbehandlung: COMMIT
            await connection.commit();

            logger.info(`Freigabe erstellt: ${id} für Use-Case: ${approvalData.use_case_name}`);
            return approval;
        } catch (error) {
            // Transaktionsbehandlung: ROLLBACK
            await connection.rollback();
            logger.error("Fehler beim Erstellen der Freigabe", error);
            throw error;
        }
    }

    /**
     * Erteilt eine Freigabe
     * Gemäß Review: Transaktionsbehandlung, OrchestratorCore-Integration, vollständiger Hash
     */
    async approveApproval(
        approvalId: string,
        userId: string,
        role: "dsfa" | "dsb" | "architect",
        reason: string,
        conditions?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<Approval> {
        const connection = await getConnection();
        
        // Transaktionsbehandlung: BEGIN
        await connection.beginTransaction();

        try {
            const approval = await this.getApproval(approvalId);

            if (!approval) {
                await connection.rollback();
                throw new Error("Freigabe nicht gefunden");
            }

            if (approval.approval_status === "approved") {
                await connection.rollback();
                throw new Error("Freigabe wurde bereits erteilt");
            }

            // Rollenbasierte Signatur setzen
            const updateFields: string[] = [];
            const updateValues: any[] = [];

            if (role === "dsfa") {
                updateFields.push("approved_by_dsfa = ?");
                updateValues.push(userId);
            } else if (role === "dsb") {
                updateFields.push("approved_by_dsb = ?");
                updateValues.push(userId);
            } else if (role === "architect") {
                updateFields.push("approved_by_architect = ?");
                updateValues.push(userId);
            }

            // Prüfe ob alle erforderlichen Signaturen vorhanden sind
            const needsDSB = approval.risk_category === "high" || approval.risk_category === "critical";
            const hasDSFA = approval.approved_by_dsfa || (role === "dsfa" ? userId : null);
            const hasDSB = approval.approved_by_dsb || (role === "dsb" ? userId : null);

            let wasApproved = false;

            // Status aktualisieren
            if (needsDSB && hasDSFA && hasDSB) {
                // High/Critical: Beide Signaturen erforderlich
                updateFields.push("approval_status = ?", "approval_date = ?");
                updateValues.push("approved", new Date());
                wasApproved = true;
            } else if (!needsDSB && hasDSFA) {
                // Low/Medium: Nur DSFA erforderlich
                updateFields.push("approval_status = ?", "approval_date = ?");
                updateValues.push("approved", new Date());
                wasApproved = true;
            }

            // Grund und Bedingungen aktualisieren
            if (reason) {
                updateFields.push("approval_reason = ?");
                updateValues.push(reason);
            }
            if (conditions) {
                updateFields.push("approval_conditions = ?");
                updateValues.push(conditions);
            }

            updateFields.push("updated_at = ?");
            updateValues.push(new Date());
            updateValues.push(approvalId);

            // Update durchführen
            await connection.execute(
                `UPDATE dsgvo_approvals SET ${updateFields.join(", ")} WHERE id = ?`,
                updateValues
            );

            // Audit-Hash neu generieren (vollständig)
            const updatedApproval = await this.getApproval(approvalId);
            if (updatedApproval) {
                const newHash = this.generateFullApprovalHash(updatedApproval);

                await connection.execute(
                    `UPDATE dsgvo_approvals SET audit_hash = ? WHERE id = ?`,
                    [newHash, approvalId]
                );

                updatedApproval.audit_hash = newHash;
            }

            // Audit-Log
            if (wasApproved && updatedApproval?.approval_status === "approved") {
                await dsgvoAuditLogger.logApprovalGranted(
                    userId,
                    approvalId,
                    approval.use_case_name,
                    reason,
                    ipAddress,
                    userAgent
                );

                // OrchestratorCore-Integration: Use-Case-Status aktualisieren
                if (approval.use_case_id) {
                    try {
                        // OrchestratorCore hat keine updateUseCaseStatus-Methode, daher loggen wir es
                        // In Produktion sollte hier die Orchestrator-API aufgerufen werden
                        await orchestratorCore.logOrchestrationEvent(
                            "ORCH_TASK_COMPLETED",
                            null,
                            {
                                success: true,
                                taskId: approval.use_case_id,
                                agent: "approval-system",
                                result: {
                                    message: `Use-Case ${approval.use_case_name} wurde freigegeben`,
                                    approval_status: "approved"
                                },
                                timestamp: new Date().toISOString()
                            } as any,
                            {
                                approval_id: approvalId,
                                use_case_id: approval.use_case_id,
                                approval_status: "approved"
                            }
                        );
                        logger.info(`Orchestrator-Event geloggt für Use-Case: ${approval.use_case_id}`);
                    } catch (orchestratorError) {
                        // Orchestrator-Fehler nicht kritisch, nur loggen
                        logger.warn("Fehler bei OrchestratorCore-Integration", orchestratorError);
                    }
                }
            } else {
                await dsgvoAuditLogger.logApprovalUpdated(
                    userId,
                    approvalId,
                    approval.use_case_name,
                    { role, reason },
                    ipAddress,
                    userAgent
                );
            }

            // Transaktionsbehandlung: COMMIT
            await connection.commit();

            logger.info(`Freigabe signiert: ${approvalId} von ${role} (${userId})`);
            return updatedApproval || approval;
        } catch (error) {
            // Transaktionsbehandlung: ROLLBACK
            await connection.rollback();
            logger.error("Fehler beim Erteilen der Freigabe", error);
            throw error;
        }
    }

    /**
     * Lehnt eine Freigabe ab
     * Gemäß Review: Transaktionsbehandlung, OrchestratorCore-Integration, vollständiger Hash
     */
    async rejectApproval(
        approvalId: string,
        userId: string,
        reason: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<Approval> {
        const connection = await getConnection();
        
        // Transaktionsbehandlung: BEGIN
        await connection.beginTransaction();

        try {
            const approval = await this.getApproval(approvalId);

            if (!approval) {
                await connection.rollback();
                throw new Error("Freigabe nicht gefunden");
            }

            if (approval.approval_status === "approved") {
                await connection.rollback();
                throw new Error("Freigabe wurde bereits erteilt und kann nicht abgelehnt werden");
            }

            // Status auf rejected setzen
            await connection.execute(
                `UPDATE dsgvo_approvals 
                 SET approval_status = ?, approval_reason = ?, updated_at = ? 
                 WHERE id = ?`,
                ["rejected", reason, new Date(), approvalId]
            );

            // Audit-Hash neu generieren (vollständig)
            const updatedApproval = await this.getApproval(approvalId);
            if (updatedApproval) {
                const newHash = this.generateFullApprovalHash(updatedApproval);

                await connection.execute(
                    `UPDATE dsgvo_approvals SET audit_hash = ? WHERE id = ?`,
                    [newHash, approvalId]
                );

                updatedApproval.audit_hash = newHash;
            }

            // Audit-Log
            await dsgvoAuditLogger.logApprovalRejected(
                userId,
                approvalId,
                approval.use_case_name,
                reason,
                ipAddress,
                userAgent
            );

            // OrchestratorCore-Integration: Use-Case-Status aktualisieren
            if (approval.use_case_id) {
                try {
                    await orchestratorCore.logOrchestrationEvent(
                        "ORCH_TASK_FAILED",
                        null,
                        {
                            success: false,
                            taskId: approval.use_case_id,
                            agent: "approval-system",
                            error: `Use-Case ${approval.use_case_name} wurde abgelehnt: ${reason}`,
                            timestamp: new Date().toISOString()
                        } as any,
                        {
                            approval_id: approvalId,
                            use_case_id: approval.use_case_id,
                            approval_status: "rejected"
                        }
                    );
                    logger.info(`Orchestrator-Event geloggt für Use-Case: ${approval.use_case_id}`);
                } catch (orchestratorError) {
                    // Orchestrator-Fehler nicht kritisch, nur loggen
                    logger.warn("Fehler bei OrchestratorCore-Integration", orchestratorError);
                }
            }

            // Transaktionsbehandlung: COMMIT
            await connection.commit();

            logger.info(`Freigabe abgelehnt: ${approvalId} von ${userId}`);
            return updatedApproval || approval;
        } catch (error) {
            // Transaktionsbehandlung: ROLLBACK
            await connection.rollback();
            logger.error("Fehler beim Ablehnen der Freigabe", error);
            throw error;
        }
    }

    /**
     * Ruft eine Freigabe ab
     */
    async getApproval(approvalId: string): Promise<Approval | null> {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute(
                `SELECT * FROM dsgvo_approvals WHERE id = ?`,
                [approvalId]
            );

            const approvals = rows as any[];
            if (approvals.length === 0) {
                return null;
            }

            return this.mapRowToApproval(approvals[0]);
        } catch (error) {
            logger.error("Fehler beim Abrufen der Freigabe", error);
            throw error;
        }
    }

    /**
     * Listet alle Freigaben mit Filtern
     */
    async listApprovals(filters: ApprovalFilters = {}): Promise<Approval[]> {
        try {
            const connection = await getConnection();
            const conditions: string[] = [];
            const values: any[] = [];

            if (filters.risk_category) {
                conditions.push("risk_category = ?");
                values.push(filters.risk_category);
            }

            if (filters.approval_status) {
                conditions.push("approval_status = ?");
                values.push(filters.approval_status);
            }

            if (filters.use_case_id) {
                conditions.push("use_case_id = ?");
                values.push(filters.use_case_id);
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
            const limitClause = filters.limit ? `LIMIT ${filters.limit}` : "";
            const offsetClause = filters.offset ? `OFFSET ${filters.offset}` : "";

            const [rows] = await connection.execute(
                `SELECT * FROM dsgvo_approvals ${whereClause} ORDER BY created_at DESC ${limitClause} ${offsetClause}`,
                values
            );

            const approvals = rows as any[];
            return approvals.map(row => this.mapRowToApproval(row));
        } catch (error) {
            logger.error("Fehler beim Abrufen der Freigaben-Liste", error);
            throw error;
        }
    }

    /**
     * Generiert SHA-256 Hash für Audit-Zwecke
     */
    generateApprovalHash(data: Record<string, any>): string {
        const dataString = JSON.stringify(data, Object.keys(data).sort());
        return createHash("sha256").update(dataString).digest("hex");
    }

    /**
     * Mappt Datenbank-Zeile zu Approval-Objekt
     */
    private mapRowToApproval(row: any): Approval {
        return {
            id: row.id,
            use_case_id: row.use_case_id,
            use_case_name: row.use_case_name,
            risk_category: row.risk_category,
            risk_score: row.risk_score,
            approval_status: row.approval_status,
            approved_by_dsfa: row.approved_by_dsfa,
            approved_by_dsb: row.approved_by_dsb,
            approved_by_architect: row.approved_by_architect,
            approval_date: row.approval_date ? new Date(row.approval_date) : undefined,
            approval_reason: row.approval_reason,
            approval_conditions: row.approval_conditions,
            measures_package: row.measures_package,
            audit_hash: row.audit_hash,
            review_date: row.review_date,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at)
        };
    }
}

export const approvalService = new ApprovalService();

