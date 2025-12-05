/**
 * DSGVO Monitoring Service - Enterprise++ Standard
 * 
 * Überwacht DSGVO-Compliance, Consents, KI-Verarbeitung und Privacy-Requests
 * Vollständige Audit-Logs und Risikobewertung
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

export interface DSGVOStatus {
    overall_status: "compliant" | "warning" | "critical";
    consent_coverage: number; // Prozent
    ki_processing_compliant: boolean;
    privacy_requests_pending: number;
    audit_logs_count: number;
    risk_score: number; // 0-100
    last_updated: string;
}

export interface ConsentStatistics {
    total_consents: number;
    active_consents: number;
    revoked_consents: number;
    by_type: Record<string, {
        total: number;
        granted: number;
        revoked: number;
        denied: number;
    }>;
    by_version: Record<string, number>;
    recent_changes: Array<{
        user_id: string;
        consent_type: string;
        action: string;
        timestamp: string;
    }>;
}

export interface KIProcessingOverview {
    total_analyses: number;
    with_consent: number;
    without_consent: number;
    person_detected: number;
    dsgvo_approved: number;
    pending_approval: number;
    by_category: Record<string, number>;
    recent_analyses: Array<{
        media_id: string;
        has_person: boolean;
        dsgvo_approved: boolean;
        timestamp: string;
    }>;
}

export interface PrivacyRequestStats {
    total_requests: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    pending: number;
    completed: number;
    rejected: number;
    average_processing_time_hours: number;
    recent_requests: Array<{
        id: number;
        user_id: string;
        request_type: string;
        status: string;
        created_at: string;
    }>;
}

export interface AuditLogOverview {
    total_events: number;
    by_event_type: Record<string, number>;
    by_result: Record<string, number>;
    recent_events: Array<{
        id: number;
        event_type: string;
        action: string;
        user_id: string;
        timestamp: string;
        result: string;
    }>;
    critical_events: Array<{
        id: number;
        event_type: string;
        action: string;
        timestamp: string;
        details: Record<string, unknown>;
    }>;
}

class DSGVOMonitoringService {
    /**
     * Gesamtstatus der DSGVO-Compliance
     */
    async getDSGVOStatus(): Promise<DSGVOStatus> {
        const connection = await getConnection();
        
        try {
            // Consent-Coverage berechnen
            const [consentRows] = await connection.execute(
                `SELECT COUNT(DISTINCT user_id) as total_users,
                        COUNT(DISTINCT CASE WHEN consent_status = 'granted' THEN user_id END) as users_with_consent
                 FROM dsgvo_consents`
            );
            const consentData = (consentRows as any[])[0];
            const consentCoverage = consentData.total_users > 0 
                ? (consentData.users_with_consent / consentData.total_users) * 100 
                : 0;

            // KI-Verarbeitung prüfen
            const [kiRows] = await connection.execute(
                `SELECT COUNT(*) as total,
                        COUNT(CASE WHEN event_type IN ('KI_ANALYSIS_STARTED', 'KI_ANALYSIS_COMPLETED') THEN 1 END) as with_consent
                 FROM dsgvo_audit_events
                 WHERE event_type LIKE 'KI_%'`
            );
            const kiData = (kiRows as any[])[0];
            const kiProcessingCompliant = kiData.total === 0 || kiData.with_consent > 0;

            // Pending Privacy-Requests
            const [privacyRows] = await connection.execute(
                `SELECT COUNT(*) as pending
                 FROM dsgvo_privacy_requests
                 WHERE request_status = 'pending'`
            );
            const privacyData = (privacyRows as any[])[0];
            const privacyRequestsPending = privacyData.pending || 0;

            // Audit-Logs Count
            const [auditRows] = await connection.execute(
                `SELECT COUNT(*) as total
                 FROM dsgvo_audit_events`
            );
            const auditData = (auditRows as any[])[0];
            const auditLogsCount = auditData.total || 0;

            // Risk-Score berechnen
            const riskScore = await this.calculateRiskScore(
                consentCoverage,
                kiProcessingCompliant,
                privacyRequestsPending
            );

            // Overall Status
            let overallStatus: "compliant" | "warning" | "critical" = "compliant";
            if (riskScore >= 70) {
                overallStatus = "critical";
            } else if (riskScore >= 40) {
                overallStatus = "warning";
            }

            return {
                overall_status: overallStatus,
                consent_coverage: Math.round(consentCoverage * 100) / 100,
                ki_processing_compliant: kiProcessingCompliant,
                privacy_requests_pending: privacyRequestsPending,
                audit_logs_count: auditLogsCount,
                risk_score: riskScore,
                last_updated: new Date().toISOString()
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen des DSGVO-Status", error);
            throw error;
        }
    }

    /**
     * Consent-Statistiken
     */
    async getConsentStatistics(): Promise<ConsentStatistics> {
        const connection = await getConnection();
        
        try {
            // Gesamtstatistik
            const [totalRows] = await connection.execute(
                `SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN consent_status = 'granted' THEN 1 END) as active,
                    COUNT(CASE WHEN consent_status = 'revoked' THEN 1 END) as revoked,
                    COUNT(CASE WHEN consent_status = 'denied' THEN 1 END) as denied
                 FROM dsgvo_consents`
            );
            const totalData = (totalRows as any[])[0];

            // Nach Typ
            const [typeRows] = await connection.execute(
                `SELECT 
                    consent_type,
                    COUNT(*) as total,
                    COUNT(CASE WHEN consent_status = 'granted' THEN 1 END) as granted,
                    COUNT(CASE WHEN consent_status = 'revoked' THEN 1 END) as revoked,
                    COUNT(CASE WHEN consent_status = 'denied' THEN 1 END) as denied
                 FROM dsgvo_consents
                 GROUP BY consent_type`
            );
            const byType: Record<string, any> = {};
            (typeRows as any[]).forEach(row => {
                byType[row.consent_type] = {
                    total: row.total,
                    granted: row.granted,
                    revoked: row.revoked,
                    denied: row.denied
                };
            });

            // Nach Version
            const [versionRows] = await connection.execute(
                `SELECT consent_version, COUNT(*) as count
                 FROM dsgvo_consents
                 GROUP BY consent_version`
            );
            const byVersion: Record<string, number> = {};
            (versionRows as any[]).forEach(row => {
                byVersion[row.consent_version] = row.count;
            });

            // Recent Changes
            const [recentRows] = await connection.execute(
                `SELECT user_id, consent_type, consent_status, updated_at
                 FROM dsgvo_consents
                 ORDER BY updated_at DESC
                 LIMIT 10`
            );
            const recentChanges = (recentRows as any[]).map(row => ({
                user_id: row.user_id,
                consent_type: row.consent_type,
                action: row.consent_status,
                timestamp: row.updated_at
            }));

            return {
                total_consents: totalData.total || 0,
                active_consents: totalData.active || 0,
                revoked_consents: totalData.revoked || 0,
                by_type: byType,
                by_version: byVersion,
                recent_changes: recentChanges
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen der Consent-Statistiken", error);
            throw error;
        }
    }

    /**
     * KI-Verarbeitung-Übersicht
     */
    async getKIProcessingOverview(): Promise<KIProcessingOverview> {
        const connection = await getConnection();
        
        try {
            // Gesamtstatistik
            const [totalRows] = await connection.execute(
                `SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN event_type = 'KI_ANALYSIS_COMPLETED' THEN 1 END) as completed
                 FROM dsgvo_audit_events
                 WHERE event_type LIKE 'KI_%'`
            );
            const totalData = (totalRows as any[])[0];

            // Person Detection
            const [personRows] = await connection.execute(
                `SELECT COUNT(*) as detected
                 FROM dsgvo_audit_events
                 WHERE event_type = 'PERSON_DETECTED'`
            );
            const personData = (personRows as any[])[0];

            // DSGVO Approved
            const [approvedRows] = await connection.execute(
                `SELECT COUNT(*) as approved
                 FROM dsgvo_audit_events
                 WHERE event_type = 'DSGVO_APPROVED'`
            );
            const approvedData = (approvedRows as any[])[0];

            // Pending Approval (Person detected but not approved)
            const [pendingRows] = await connection.execute(
                `SELECT COUNT(DISTINCT resource_id) as pending
                 FROM dsgvo_audit_events
                 WHERE event_type = 'PERSON_DETECTED'
                 AND resource_id NOT IN (
                     SELECT resource_id FROM dsgvo_audit_events
                     WHERE event_type = 'DSGVO_APPROVED'
                 )`
            );
            const pendingData = (pendingRows as any[])[0];

            // Nach Kategorie
            const [categoryRows] = await connection.execute(
                `SELECT data_category, COUNT(*) as count
                 FROM dsgvo_audit_events
                 WHERE event_type LIKE 'KI_%'
                 GROUP BY data_category`
            );
            const byCategory: Record<string, number> = {};
            (categoryRows as any[]).forEach(row => {
                byCategory[row.data_category || "unknown"] = row.count;
            });

            // Recent Analyses
            const [recentRows] = await connection.execute(
                `SELECT resource_id as media_id, 
                        event_type,
                        created_at
                 FROM dsgvo_audit_events
                 WHERE event_type IN ('KI_ANALYSIS_COMPLETED', 'PERSON_DETECTED', 'DSGVO_APPROVED')
                 ORDER BY created_at DESC
                 LIMIT 20`
            );
            const recentAnalyses = (recentRows as any[]).map(row => ({
                media_id: row.media_id || "",
                has_person: row.event_type === "PERSON_DETECTED",
                dsgvo_approved: row.event_type === "DSGVO_APPROVED",
                timestamp: row.created_at
            }));

            return {
                total_analyses: totalData.total || 0,
                with_consent: totalData.completed || 0, // Simplified
                without_consent: 0, // Would need additional tracking
                person_detected: personData.detected || 0,
                dsgvo_approved: approvedData.approved || 0,
                pending_approval: pendingData.pending || 0,
                by_category: byCategory,
                recent_analyses: recentAnalyses
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen der KI-Verarbeitung-Übersicht", error);
            throw error;
        }
    }

    /**
     * Privacy-Request-Statistiken
     */
    async getPrivacyRequestStats(): Promise<PrivacyRequestStats> {
        const connection = await getConnection();
        
        try {
            // Gesamtstatistik
            const [totalRows] = await connection.execute(
                `SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN request_status = 'pending' THEN 1 END) as pending,
                    COUNT(CASE WHEN request_status = 'completed' THEN 1 END) as completed,
                    COUNT(CASE WHEN request_status = 'rejected' THEN 1 END) as rejected
                 FROM dsgvo_privacy_requests`
            );
            const totalData = (totalRows as any[])[0];

            // Nach Typ
            const [typeRows] = await connection.execute(
                `SELECT request_type, COUNT(*) as count
                 FROM dsgvo_privacy_requests
                 GROUP BY request_type`
            );
            const byType: Record<string, number> = {};
            (typeRows as any[]).forEach(row => {
                byType[row.request_type] = row.count;
            });

            // Nach Status
            const [statusRows] = await connection.execute(
                `SELECT request_status, COUNT(*) as count
                 FROM dsgvo_privacy_requests
                 GROUP BY request_status`
            );
            const byStatus: Record<string, number> = {};
            (statusRows as any[]).forEach(row => {
                byStatus[row.request_status] = row.count;
            });

            // Average Processing Time
            const [timeRows] = await connection.execute(
                `SELECT 
                    AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours
                 FROM dsgvo_privacy_requests
                 WHERE request_status = 'completed' AND completed_at IS NOT NULL`
            );
            const timeData = (timeRows as any[])[0];
            const avgProcessingTime = timeData.avg_hours || 0;

            // Recent Requests
            const [recentRows] = await connection.execute(
                `SELECT id, user_id, request_type, request_status, created_at
                 FROM dsgvo_privacy_requests
                 ORDER BY created_at DESC
                 LIMIT 20`
            );
            const recentRequests = (recentRows as any[]).map(row => ({
                id: row.id,
                user_id: row.user_id,
                request_type: row.request_type,
                status: row.request_status,
                created_at: row.created_at
            }));

            return {
                total_requests: totalData.total || 0,
                by_type: byType,
                by_status: byStatus,
                pending: totalData.pending || 0,
                completed: totalData.completed || 0,
                rejected: totalData.rejected || 0,
                average_processing_time_hours: Math.round(avgProcessingTime * 100) / 100,
                recent_requests: recentRequests
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen der Privacy-Request-Statistiken", error);
            throw error;
        }
    }

    /**
     * Audit-Log-Übersicht
     */
    async getAuditLogOverview(limit: number = 50): Promise<AuditLogOverview> {
        const connection = await getConnection();
        
        try {
            // Gesamtstatistik
            const [totalRows] = await connection.execute(
                `SELECT COUNT(*) as total
                 FROM dsgvo_audit_events`
            );
            const totalData = (totalRows as any[])[0];

            // Nach Event-Type
            const [typeRows] = await connection.execute(
                `SELECT event_type, COUNT(*) as count
                 FROM dsgvo_audit_events
                 GROUP BY event_type`
            );
            const byEventType: Record<string, number> = {};
            (typeRows as any[]).forEach(row => {
                byEventType[row.event_type] = row.count;
            });

            // Nach Result
            const [resultRows] = await connection.execute(
                `SELECT result, COUNT(*) as count
                 FROM dsgvo_audit_events
                 GROUP BY result`
            );
            const byResult: Record<string, number> = {};
            (resultRows as any[]).forEach(row => {
                byResult[row.result] = row.count;
            });

            // Recent Events
            const [recentRows] = await connection.execute(
                `SELECT id, event_type, action, user_id, created_at, result
                 FROM dsgvo_audit_events
                 ORDER BY created_at DESC
                 LIMIT ?`,
                [limit]
            );
            const recentEvents = (recentRows as any[]).map(row => ({
                id: row.id,
                event_type: row.event_type,
                action: row.action,
                user_id: row.user_id || "",
                timestamp: row.created_at,
                result: row.result
            }));

            // Critical Events (failures, person detected, etc.)
            const [criticalRows] = await connection.execute(
                `SELECT id, event_type, action, created_at, details
                 FROM dsgvo_audit_events
                 WHERE result = 'failure' OR event_type IN ('PERSON_DETECTED', 'CONSENT_DENIED')
                 ORDER BY created_at DESC
                 LIMIT 20`
            );
            const criticalEvents = (criticalRows as any[]).map(row => ({
                id: row.id,
                event_type: row.event_type,
                action: row.action,
                timestamp: row.created_at,
                details: row.details ? JSON.parse(row.details) : {}
            }));

            return {
                total_events: totalData.total || 0,
                by_event_type: byEventType,
                by_result: byResult,
                recent_events: recentEvents,
                critical_events: criticalEvents
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen der Audit-Log-Übersicht", error);
            throw error;
        }
    }

    /**
     * Risiko-Score berechnen (0-100)
     */
    private async calculateRiskScore(
        consentCoverage: number,
        kiProcessingCompliant: boolean,
        privacyRequestsPending: number
    ): Promise<number> {
        let score = 0;

        // Consent-Coverage (0-40 Punkte)
        if (consentCoverage < 50) {
            score += 40;
        } else if (consentCoverage < 80) {
            score += 20;
        } else if (consentCoverage < 95) {
            score += 10;
        }

        // KI-Verarbeitung (0-30 Punkte)
        if (!kiProcessingCompliant) {
            score += 30;
        }

        // Pending Privacy-Requests (0-30 Punkte)
        if (privacyRequestsPending > 10) {
            score += 30;
        } else if (privacyRequestsPending > 5) {
            score += 15;
        } else if (privacyRequestsPending > 0) {
            score += 5;
        }

        return Math.min(100, score);
    }

    /**
     * Risiko-Score abrufen
     */
    async getRiskScore(): Promise<number> {
        const status = await this.getDSGVOStatus();
        return status.risk_score;
    }
}

export const dsgvoMonitoringService = new DSGVOMonitoringService();



