/**
 * DSGVO Weekly Report Scheduler - Enterprise++ Standard
 * 
 * Generiert wöchentliche DSGVO-Compliance-Berichte
 * Speichert unter /var/data/reports/dsgvo/YYYY-WW.json
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { dsgvoMonitoringService } from "@/lib/dsgvo/monitoring-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

export interface DSGVOWeeklyReport {
    report_period: {
        year: number;
        week: number;
        start_date: string;
        end_date: string;
    };
    consent_changes: {
        new_consents: number;
        revoked_consents: number;
        updated_consents: number;
        by_type: Record<string, number>;
    };
    ki_processing: {
        total_analyses: number;
        person_detected: number;
        dsgvo_approved: number;
        pending_approval: number;
        compliance_rate: number;
    };
    privacy_requests: {
        total: number;
        completed: number;
        pending: number;
        average_processing_time_hours: number;
        by_type: Record<string, number>;
    };
    audit_events: {
        total: number;
        by_type: Record<string, number>;
        critical_events: number;
    };
    risk_assessment: {
        risk_score: number;
        status: "compliant" | "warning" | "critical";
        factors: Array<{
            factor: string;
            impact: number;
            recommendation: string;
        }>;
    };
    action_items: Array<{
        priority: "high" | "medium" | "low";
        item: string;
        description: string;
        due_date?: string;
    }>;
    generated_at: string;
}

class DSGVOWeeklyReportScheduler {
    private reportDir: string;

    constructor() {
        // In Produktion: /var/data/reports/dsgvo/
        // In Entwicklung: ./data/reports/dsgvo/
        this.reportDir = process.env.NODE_ENV === "production"
            ? "/var/data/reports/dsgvo"
            : join(process.cwd(), "data", "reports", "dsgvo");
    }

    /**
     * Generiert wöchentlichen DSGVO-Report
     */
    async generateWeeklyReport(): Promise<DSGVOWeeklyReport> {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const week = this.getWeekNumber(now);
            const startDate = this.getWeekStart(now);
            const endDate = this.getWeekEnd(now);

            // Consent-Änderungen
            const consentChanges = await this.getConsentChanges(startDate, endDate);

            // KI-Verarbeitung
            const kiProcessing = await this.getKIProcessing(startDate, endDate);

            // Privacy-Requests
            const privacyRequests = await this.getPrivacyRequests(startDate, endDate);

            // Audit-Events
            const auditEvents = await this.getAuditEvents(startDate, endDate);

            // Risk-Assessment
            const riskAssessment = await this.getRiskAssessment();

            // Action Items
            const actionItems = await this.getActionItems(riskAssessment);

            const report: DSGVOWeeklyReport = {
                report_period: {
                    year,
                    week,
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString()
                },
                consent_changes: consentChanges,
                ki_processing: kiProcessing,
                privacy_requests: privacyRequests,
                audit_events: auditEvents,
                risk_assessment: riskAssessment,
                action_items: actionItems,
                generated_at: now.toISOString()
            };

            // Report speichern
            await this.saveReport(report, year, week);

            logger.info(`DSGVO Weekly Report generiert: ${year}-W${week}`);

            return report;
        } catch (error) {
            logger.error("Fehler beim Generieren des DSGVO-Weekly-Reports", error);
            throw error;
        }
    }

    /**
     * Consent-Änderungen für die Woche
     */
    private async getConsentChanges(startDate: Date, endDate: Date) {
        const connection = await getConnection();
        
        const [rows] = await connection.execute(
            `SELECT 
                consent_type,
                COUNT(CASE WHEN created_at >= ? AND created_at <= ? THEN 1 END) as new_consents,
                COUNT(CASE WHEN revoked_at >= ? AND revoked_at <= ? THEN 1 END) as revoked_consents,
                COUNT(CASE WHEN updated_at >= ? AND updated_at <= ? AND revoked_at IS NULL THEN 1 END) as updated_consents
             FROM dsgvo_consents
             WHERE created_at >= ? OR revoked_at >= ? OR updated_at >= ?
             GROUP BY consent_type`,
            [
                startDate, endDate,
                startDate, endDate,
                startDate, endDate,
                startDate, startDate, startDate
            ]
        );

        const byType: Record<string, number> = {};
        let totalNew = 0;
        let totalRevoked = 0;
        let totalUpdated = 0;

        (rows as any[]).forEach(row => {
            byType[row.consent_type] = (row.new_consents || 0) + (row.revoked_consents || 0) + (row.updated_consents || 0);
            totalNew += row.new_consents || 0;
            totalRevoked += row.revoked_consents || 0;
            totalUpdated += row.updated_consents || 0;
        });

        return {
            new_consents: totalNew,
            revoked_consents: totalRevoked,
            updated_consents: totalUpdated,
            by_type: byType
        };
    }

    /**
     * KI-Verarbeitung für die Woche
     */
    private async getKIProcessing(startDate: Date, endDate: Date) {
        const connection = await getConnection();
        
        const [rows] = await connection.execute(
            `SELECT 
                COUNT(CASE WHEN event_type = 'KI_ANALYSIS_COMPLETED' THEN 1 END) as total_analyses,
                COUNT(CASE WHEN event_type = 'PERSON_DETECTED' THEN 1 END) as person_detected,
                COUNT(CASE WHEN event_type = 'DSGVO_APPROVED' THEN 1 END) as dsgvo_approved
             FROM dsgvo_audit_events
             WHERE created_at >= ? AND created_at <= ?
             AND event_type LIKE 'KI_%' OR event_type IN ('PERSON_DETECTED', 'DSGVO_APPROVED')`,
            [startDate, endDate]
        );

        const data = (rows as any[])[0] || {};
        const totalAnalyses = data.total_analyses || 0;
        const personDetected = data.person_detected || 0;
        const dsgvoApproved = data.dsgvo_approved || 0;
        const pendingApproval = personDetected - dsgvoApproved;

        // Compliance-Rate: Analysen mit Consent / Gesamt
        const complianceRate = totalAnalyses > 0 ? (dsgvoApproved / totalAnalyses) * 100 : 100;

        return {
            total_analyses: totalAnalyses,
            person_detected: personDetected,
            dsgvo_approved: dsgvoApproved,
            pending_approval: Math.max(0, pendingApproval),
            compliance_rate: Math.round(complianceRate * 100) / 100
        };
    }

    /**
     * Privacy-Requests für die Woche
     */
    private async getPrivacyRequests(startDate: Date, endDate: Date) {
        const connection = await getConnection();
        
        const [rows] = await connection.execute(
            `SELECT 
                request_type,
                COUNT(*) as total,
                COUNT(CASE WHEN request_status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN request_status = 'pending' THEN 1 END) as pending,
                AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours
             FROM dsgvo_privacy_requests
             WHERE created_at >= ? AND created_at <= ?
             GROUP BY request_type`,
            [startDate, endDate]
        );

        const byType: Record<string, number> = {};
        let total = 0;
        let completed = 0;
        let pending = 0;
        let avgTime = 0;

        (rows as any[]).forEach(row => {
            byType[row.request_type] = row.total || 0;
            total += row.total || 0;
            completed += row.completed || 0;
            pending += row.pending || 0;
            avgTime = row.avg_hours || 0;
        });

        return {
            total,
            completed,
            pending,
            average_processing_time_hours: Math.round(avgTime * 100) / 100,
            by_type: byType
        };
    }

    /**
     * Audit-Events für die Woche
     */
    private async getAuditEvents(startDate: Date, endDate: Date) {
        const connection = await getConnection();
        
        const [rows] = await connection.execute(
            `SELECT 
                event_type,
                COUNT(*) as count,
                COUNT(CASE WHEN result = 'failure' OR event_type IN ('PERSON_DETECTED', 'CONSENT_DENIED') THEN 1 END) as critical
             FROM dsgvo_audit_events
             WHERE created_at >= ? AND created_at <= ?
             GROUP BY event_type`,
            [startDate, endDate]
        );

        const byType: Record<string, number> = {};
        let total = 0;
        let critical = 0;

        (rows as any[]).forEach(row => {
            byType[row.event_type] = row.count || 0;
            total += row.count || 0;
            critical += row.critical || 0;
        });

        return {
            total,
            by_type: byType,
            critical_events: critical
        };
    }

    /**
     * Risk-Assessment
     */
    private async getRiskAssessment() {
        const status = await dsgvoMonitoringService.getDSGVOStatus();
        
        const factors: Array<{ factor: string; impact: number; recommendation: string }> = [];

        if (status.consent_coverage < 80) {
            factors.push({
                factor: "Niedrige Consent-Coverage",
                impact: 40,
                recommendation: "Consent-Management verbessern, mehr Benutzer informieren"
            });
        }

        if (!status.ki_processing_compliant) {
            factors.push({
                factor: "KI-Verarbeitung nicht vollständig compliant",
                impact: 30,
                recommendation: "Consent-Prüfung vor jeder KI-Verarbeitung sicherstellen"
            });
        }

        if (status.privacy_requests_pending > 5) {
            factors.push({
                factor: "Viele ausstehende Privacy-Requests",
                impact: 20,
                recommendation: "Privacy-Requests schneller bearbeiten"
            });
        }

        return {
            risk_score: status.risk_score,
            status: status.overall_status,
            factors
        };
    }

    /**
     * Action Items generieren
     */
    private async getActionItems(riskAssessment: any): Promise<Array<{ priority: "high" | "medium" | "low"; item: string; description: string; due_date?: string }>> {
        const items: Array<{ priority: "high" | "medium" | "low"; item: string; description: string; due_date?: string }> = [];

        if (riskAssessment.risk_score >= 70) {
            items.push({
                priority: "high",
                item: "Kritisches Risiko reduzieren",
                description: "Sofortige Maßnahmen erforderlich",
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 Tage
            });
        }

        riskAssessment.factors.forEach((factor: any) => {
            if (factor.impact >= 30) {
                items.push({
                    priority: "high",
                    item: factor.factor,
                    description: factor.recommendation,
                    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 Tage
                });
            } else if (factor.impact >= 15) {
                items.push({
                    priority: "medium",
                    item: factor.factor,
                    description: factor.recommendation,
                    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 Tage
                });
            }
        });

        return items;
    }

    /**
     * Report speichern
     */
    private async saveReport(report: DSGVOWeeklyReport, year: number, week: number): Promise<void> {
        try {
            await mkdir(this.reportDir, { recursive: true });
            const filename = `${year}-W${String(week).padStart(2, "0")}.json`;
            const filepath = join(this.reportDir, filename);
            await writeFile(filepath, JSON.stringify(report, null, 2), "utf-8");
            logger.info(`DSGVO Weekly Report gespeichert: ${filepath}`);
        } catch (error) {
            logger.error("Fehler beim Speichern des DSGVO-Weekly-Reports", error);
            throw error;
        }
    }

    /**
     * Wochennummer berechnen
     */
    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    /**
     * Wochenstart berechnen
     */
    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Montag
        return new Date(d.setDate(diff));
    }

    /**
     * Wochenende berechnen
     */
    private getWeekEnd(date: Date): Date {
        const start = this.getWeekStart(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Sonntag
        end.setHours(23, 59, 59, 999);
        return end;
    }
}

export const dsgvoWeeklyReportScheduler = new DSGVOWeeklyReportScheduler();



