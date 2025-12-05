/**
 * DSGVO Audit Logger - Enterprise++ Standard
 * 
 * Erweiterte Audit-Log-Funktionen für KI-Verarbeitung
 * Neue Ereignisse:
 * - AI_BLOCKED_NO_CONSENT
 * - AI_BLOCKED_DSGVO_RISK_TOO_HIGH
 * - AI_BLOCKED_PERSON_DETECTED
 * - AI_BLOCKED_CONSENT_REVOKED
 * - AI_BLOCKED_VERSION_MISMATCH
 * - AI_ALLOWED
 * - AI_PROCESSED
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

export type DSGVOAuditEventType =
    | "AI_BLOCKED_NO_CONSENT"
    | "AI_BLOCKED_DSGVO_RISK_TOO_HIGH"
    | "AI_BLOCKED_PERSON_DETECTED"
    | "AI_BLOCKED_CONSENT_REVOKED"
    | "AI_BLOCKED_VERSION_MISMATCH"
    | "AI_ALLOWED"
    | "AI_PROCESSED"
    | "CONSENT_CHECK_FAILED"
    | "RBAC_CHECK_FAILED"
    | "DSGVO_BOUNDARY_VIOLATION"
    | "APPROVAL_CREATED"
    | "APPROVAL_GRANTED"
    | "APPROVAL_REJECTED"
    | "APPROVAL_UPDATED";

export interface DSGVOAuditLogEntry {
    userId: string;
    eventType: DSGVOAuditEventType;
    action: string;
    resourceType: string;
    resourceId?: string;
    dataCategory?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    result: "success" | "failure" | "pending";
}

class DSGVOAuditLogger {
    /**
     * Loggt ein DSGVO-Audit-Event
     */
    async logEvent(entry: DSGVOAuditLogEntry): Promise<void> {
        try {
            const connection = await getConnection();
            await connection.execute(
                `INSERT INTO dsgvo_audit_events 
                 (user_id, event_type, action, resource_type, resource_id, data_category, details, ip_address, user_agent, result)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    entry.userId,
                    entry.eventType,
                    entry.action,
                    entry.resourceType,
                    entry.resourceId || null,
                    entry.dataCategory || null,
                    entry.details ? JSON.stringify(entry.details) : null,
                    entry.ipAddress || null,
                    entry.userAgent || null,
                    entry.result
                ]
            );
            logger.info(`DSGVO Audit Event geloggt: ${entry.eventType} für User ${entry.userId}`);
        } catch (error) {
            logger.error("Fehler beim Schreiben des DSGVO-Audit-Logs", error);
            // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
        }
    }

    /**
     * Loggt AI-Blockierung (kein Consent)
     */
    async logAIBlockedNoConsent(
        userId: string,
        purpose: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_BLOCKED_NO_CONSENT",
            action: `KI-Verarbeitung blockiert: Kein Consent für ${purpose}`,
            resourceType: "ai_processing",
            dataCategory: purpose,
            details: { purpose },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt AI-Blockierung (Risiko zu hoch)
     */
    async logAIBlockedRiskTooHigh(
        userId: string,
        risk: number,
        purpose: string,
        mediaId?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_BLOCKED_DSGVO_RISK_TOO_HIGH",
            action: `KI-Verarbeitung blockiert: Risiko zu hoch (${risk}/100)`,
            resourceType: "ai_processing",
            resourceId: mediaId,
            dataCategory: purpose,
            details: { risk, purpose },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt AI-Blockierung (Person erkannt)
     */
    async logAIBlockedPersonDetected(
        userId: string,
        mediaId: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_BLOCKED_PERSON_DETECTED",
            action: "KI-Verarbeitung blockiert: Person erkannt, nicht freigegeben",
            resourceType: "media",
            resourceId: mediaId,
            dataCategory: "media_ki",
            details: { mediaId },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt AI-Blockierung (Consent widerrufen)
     */
    async logAIBlockedConsentRevoked(
        userId: string,
        purpose: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_BLOCKED_CONSENT_REVOKED",
            action: `KI-Verarbeitung blockiert: Consent widerrufen für ${purpose}`,
            resourceType: "ai_processing",
            dataCategory: purpose,
            details: { purpose },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt AI-Blockierung (Version-Mismatch)
     */
    async logAIBlockedVersionMismatch(
        userId: string,
        currentVersion: string,
        requiredVersion: string,
        purpose: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_BLOCKED_VERSION_MISMATCH",
            action: `KI-Verarbeitung blockiert: Consent-Version veraltet (${currentVersion} vs. ${requiredVersion})`,
            resourceType: "ai_processing",
            dataCategory: purpose,
            details: { currentVersion, requiredVersion, purpose },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt AI-Erlaubnis
     */
    async logAIAllowed(
        userId: string,
        purpose: string,
        mediaId?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_ALLOWED",
            action: `KI-Verarbeitung erlaubt für ${purpose}`,
            resourceType: "ai_processing",
            resourceId: mediaId,
            dataCategory: purpose,
            details: { purpose },
            ipAddress,
            userAgent,
            result: "success"
        });
    }

    /**
     * Loggt AI-Verarbeitung abgeschlossen
     */
    async logAIProcessed(
        userId: string,
        purpose: string,
        mediaId?: string,
        result?: Record<string, unknown>,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "AI_PROCESSED",
            action: `KI-Verarbeitung abgeschlossen für ${purpose}`,
            resourceType: "ai_processing",
            resourceId: mediaId,
            dataCategory: purpose,
            details: { purpose, result },
            ipAddress,
            userAgent,
            result: "success"
        });
    }

    /**
     * Loggt und blockiert (Helper für Decision Engine)
     */
    async logAndBlock(
        userId: string,
        reason: string,
        eventType: DSGVOAuditEventType,
        purpose: string,
        mediaId?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType,
            action: `KI-Verarbeitung blockiert: ${reason}`,
            resourceType: "ai_processing",
            resourceId: mediaId,
            dataCategory: purpose,
            details: { reason, purpose },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt Approval-Erstellung
     */
    async logApprovalCreated(
        userId: string,
        approvalId: string,
        useCaseName: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "APPROVAL_CREATED",
            action: `Freigabe erstellt für Use-Case: ${useCaseName}`,
            resourceType: "approval",
            resourceId: approvalId,
            details: { approvalId, useCaseName },
            ipAddress,
            userAgent,
            result: "success"
        });
    }

    /**
     * Loggt Approval-Freigabe
     */
    async logApprovalGranted(
        userId: string,
        approvalId: string,
        useCaseName: string,
        reason?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "APPROVAL_GRANTED",
            action: `Freigabe erteilt für Use-Case: ${useCaseName}`,
            resourceType: "approval",
            resourceId: approvalId,
            details: { approvalId, useCaseName, reason },
            ipAddress,
            userAgent,
            result: "success"
        });
    }

    /**
     * Loggt Approval-Ablehnung
     */
    async logApprovalRejected(
        userId: string,
        approvalId: string,
        useCaseName: string,
        reason?: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "APPROVAL_REJECTED",
            action: `Freigabe abgelehnt für Use-Case: ${useCaseName}`,
            resourceType: "approval",
            resourceId: approvalId,
            details: { approvalId, useCaseName, reason },
            ipAddress,
            userAgent,
            result: "failure"
        });
    }

    /**
     * Loggt Approval-Aktualisierung
     */
    async logApprovalUpdated(
        userId: string,
        approvalId: string,
        useCaseName: string,
        changes?: Record<string, unknown>,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        await this.logEvent({
            userId,
            eventType: "APPROVAL_UPDATED",
            action: `Freigabe aktualisiert für Use-Case: ${useCaseName}`,
            resourceType: "approval",
            resourceId: approvalId,
            details: { approvalId, useCaseName, changes },
            ipAddress,
            userAgent,
            result: "success"
        });
    }
}

export const dsgvoAuditLogger = new DSGVOAuditLogger();



