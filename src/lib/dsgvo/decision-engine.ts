/**
 * DSGVO Decision Engine - Enterprise++ Standard
 * 
 * Zentrale KI-Firewall für rechtssichere KI-Verarbeitung
 * Prüft alle DSGVO-Bedingungen vor jeder KI-Aktion
 * 
 * WICHTIG: KI darf nur arbeiten, wenn alle Bedingungen erfüllt sind
 */

import { consentService, type ConsentType } from "@/lib/dsgvo/consent-service";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

export interface DSGVODecision {
    allowed: boolean;
    reason: string;
    risk: number; // 0-100
    requiredConsentVersion: string;
    blockers?: string[];
    warnings?: string[];
}

export interface AIPermissionParams {
    userId: string;
    purpose: "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics";
    mediaId?: string;
    context?: Record<string, unknown>;
}

export interface MediaMeta {
    id?: string;
    has_person?: boolean;
    dsgvo_approved_by_admin?: boolean;
    ai?: {
        has_person?: boolean;
        dsgvo_approved_by_admin?: boolean;
    };
}

class DSGVODecisionEngine {
    private readonly CURRENT_CONSENT_VERSION = "v1";
    private readonly CONSENT_EXPIRY_DAYS = 365; // 1 Jahr

    /**
     * Prüft Consent für KI-Verarbeitung
     */
    async checkConsentForAI(userId: string, purpose: string): Promise<{
        hasConsent: boolean;
        consentVersion: string | null;
        isRevoked: boolean;
        isExpired: boolean;
        timestamp: string | null;
    }> {
        try {
            // Consent-Typ basierend auf Purpose
            let consentType: ConsentType = "ki_processing";
            if (purpose === "media_ki" || purpose === "person_detection") {
                consentType = "media_ki";
            }

            // Prüfe Consent über hasConsent
            const hasConsent = await consentService.hasConsent(userId, consentType);
            
            // Wenn kein Consent, hole Details für Version-Prüfung
            if (!hasConsent) {
                return {
                    hasConsent: false,
                    consentVersion: null,
                    isRevoked: false,
                    isExpired: false,
                    timestamp: null
                };
            }

            // Hole Consent-Details für Version-Prüfung
            const userConsents = await consentService.getUserConsents(userId);
            const consent = userConsents.find(c => c.consent_type === consentType);
            
            if (!consent) {
                return {
                    hasConsent: false,
                    consentVersion: null,
                    isRevoked: false,
                    isExpired: false,
                    timestamp: null
                };
            }

            if (!consent) {
                return {
                    hasConsent: false,
                    consentVersion: null,
                    isRevoked: false,
                    isExpired: false,
                    timestamp: null
                };
            }

            // Prüfe Status
            const isRevoked = consent.consent_status === "revoked";
            const isGranted = consent.consent_status === "granted";

            // Prüfe Ablauf
            const consentDate = new Date(consent.created_at);
            const expiryDate = new Date(consentDate);
            expiryDate.setDate(expiryDate.getDate() + this.CONSENT_EXPIRY_DAYS);
            const isExpired = new Date() > expiryDate;

            return {
                hasConsent: isGranted && !isRevoked && !isExpired,
                consentVersion: consent.consent_version,
                isRevoked,
                isExpired,
                timestamp: consent.created_at
            };
        } catch (error) {
            logger.error("Fehler beim Prüfen des Consents für KI", error);
            return {
                hasConsent: false,
                consentVersion: null,
                isRevoked: false,
                isExpired: false,
                timestamp: null
            };
        }
    }

    /**
     * Prüft DSGVO-Blocker für ein Medium
     */
    async checkDSGVOBlockers(mediaId: string): Promise<string[]> {
        const blockers: string[] = [];

        try {
            // Medium-Metadaten laden (vereinfacht - in Produktion: echte DB-Abfrage)
            // Hier würde man die MediaMeta aus der Datenbank laden
            // Für jetzt: Mock-Prüfung

            // Prüfe Personenerkennung
            // In Produktion: echte DB-Abfrage
            const connection = await getConnection();
            const [rows] = await connection.execute(
                `SELECT has_person, dsgvo_approved_by_admin 
                 FROM media_meta 
                 WHERE id = ?`,
                [mediaId]
            );

            const mediaData = (rows as any[])[0];
            if (mediaData) {
                if (mediaData.has_person === true && !mediaData.dsgvo_approved_by_admin) {
                    blockers.push("PERSON_DETECTED_NOT_APPROVED");
                }
            }

            return blockers;
        } catch (error) {
            logger.error("Fehler beim Prüfen der DSGVO-Blocker", error);
            // Bei Fehler: Sicherheitshalber blockieren
            blockers.push("ERROR_CHECKING_BLOCKERS");
            return blockers;
        }
    }

    /**
     * Bewertet Risiko für KI-Verarbeitung
     */
    async evaluateRisk(mediaMeta: MediaMeta | null, context: Record<string, unknown> = {}): Promise<number> {
        let risk = 0;

        // Person erkannt, aber nicht freigegeben
        if (mediaMeta?.has_person === true && !mediaMeta.dsgvo_approved_by_admin) {
            risk += 50;
        }

        // Person erkannt in KI-Metadaten
        if (mediaMeta?.ai?.has_person === true && !mediaMeta.ai.dsgvo_approved_by_admin) {
            risk += 50;
        }

        // Profilbildung (wenn im Kontext)
        if (context.profile_building === true) {
            risk += 30;
        }

        // Sensible Daten (wenn im Kontext)
        if (context.sensitive_data === true) {
            risk += 20;
        }

        return Math.min(100, risk);
    }

    /**
     * Hauptfunktion: Prüft, ob KI-Verarbeitung erlaubt ist
     */
    async getAIProcessingPermission(params: AIPermissionParams): Promise<DSGVODecision> {
        const { userId, purpose, mediaId, context = {} } = params;
        const blockers: string[] = [];
        const warnings: string[] = [];
        let risk = 0;

        // 1. Consent-Prüfung
        const consentCheck = await this.checkConsentForAI(userId, purpose);
        
        if (!consentCheck.hasConsent) {
            if (consentCheck.isRevoked) {
                blockers.push("CONSENT_REVOKED");
            } else if (consentCheck.isExpired) {
                blockers.push("CONSENT_EXPIRED");
            } else {
                blockers.push("NO_CONSENT");
            }
        }

        // 2. Consent-Version prüfen
        if (consentCheck.consentVersion && consentCheck.consentVersion !== this.CURRENT_CONSENT_VERSION) {
            blockers.push("CONSENT_VERSION_MISMATCH");
        }

        // 3. DSGVO-Blocker prüfen (wenn Media-ID vorhanden)
        if (mediaId) {
            const mediaBlockers = await this.checkDSGVOBlockers(mediaId);
            blockers.push(...mediaBlockers);
        }

        // 4. Risiko bewerten
        const mediaMeta: MediaMeta | null = mediaId ? {
            id: mediaId,
            has_person: context.has_person as boolean,
            dsgvo_approved_by_admin: context.dsgvo_approved_by_admin as boolean
        } : null;

        risk = await this.evaluateRisk(mediaMeta, context);

        // 5. Risiko-Blocker
        if (risk >= 70) {
            blockers.push("RISK_TOO_HIGH");
        } else if (risk >= 40) {
            warnings.push("RISK_ELEVATED");
        }

        // 6. Entscheidung treffen
        const allowed = blockers.length === 0;
        const reason = allowed 
            ? "KI-Verarbeitung erlaubt - alle DSGVO-Bedingungen erfüllt"
            : `KI-Verarbeitung blockiert: ${blockers.join(", ")}`;

        // 7. Audit-Log schreiben
        await this.logDecision(params, allowed, blockers, risk);

        return {
            allowed,
            reason,
            risk,
            requiredConsentVersion: this.CURRENT_CONSENT_VERSION,
            blockers: blockers.length > 0 ? blockers : undefined,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Audit-Log für Decision schreiben
     */
    private async logDecision(
        params: AIPermissionParams,
        allowed: boolean,
        blockers: string[],
        risk: number
    ): Promise<void> {
        try {
            const connection = await getConnection();
            
            let eventType: string;
            if (!allowed) {
                if (blockers.includes("NO_CONSENT") || blockers.includes("CONSENT_REVOKED")) {
                    eventType = "AI_BLOCKED_NO_CONSENT";
                } else if (blockers.includes("RISK_TOO_HIGH")) {
                    eventType = "AI_BLOCKED_DSGVO_RISK_TOO_HIGH";
                } else if (blockers.includes("PERSON_DETECTED_NOT_APPROVED")) {
                    eventType = "AI_BLOCKED_PERSON_DETECTED";
                } else if (blockers.includes("CONSENT_REVOKED")) {
                    eventType = "AI_BLOCKED_CONSENT_REVOKED";
                } else if (blockers.includes("CONSENT_VERSION_MISMATCH")) {
                    eventType = "AI_BLOCKED_VERSION_MISMATCH";
                } else {
                    eventType = "AI_BLOCKED";
                }
            } else {
                eventType = "AI_ALLOWED";
            }

            await connection.execute(
                `INSERT INTO dsgvo_audit_events 
                 (user_id, event_type, action, resource_type, resource_id, data_category, details, result)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    params.userId,
                    eventType,
                    `AI Processing Decision: ${params.purpose}`,
                    "ai_processing",
                    params.mediaId || null,
                    params.purpose,
                    JSON.stringify({
                        allowed,
                        blockers,
                        risk,
                        purpose: params.purpose
                    }),
                    allowed ? "success" : "failure"
                ]
            );
        } catch (error) {
            logger.error("Fehler beim Schreiben des Decision-Audit-Logs", error);
            // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
        }
    }

    /**
     * Prüft, ob Personenerkennung erlaubt ist
     */
    async checkPersonDetectionPermission(userId: string, mediaId: string): Promise<DSGVODecision> {
        return this.getAIProcessingPermission({
            userId,
            purpose: "person_detection",
            mediaId
        });
    }

    /**
     * Prüft, ob Profilbildung erlaubt ist
     */
    async checkProfileBuildingPermission(userId: string): Promise<DSGVODecision> {
        return this.getAIProcessingPermission({
            userId,
            purpose: "profile_building"
        });
    }
}

export const dsgvoDecisionEngine = new DSGVODecisionEngine();

