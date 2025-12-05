/**
 * DSGVO Consent Service - Enterprise++ Standard
 * 
 * Verwaltet Einwilligungen (Consents) für DSGVO-Compliance
 * - Consent speichern/abrufen
 * - Consent widerrufen
 * - Consent-Versionierung
 * - Audit-Logging
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

export type ConsentType = 'necessary' | 'functional' | 'analytics' | 'marketing' | 'ki_processing' | 'media_ki';
export type ConsentStatus = 'granted' | 'revoked' | 'denied' | 'pending';

export interface Consent {
    id: number;
    user_id: string;
    consent_type: ConsentType;
    consent_version: string;
    consent_status: ConsentStatus;
    consent_data?: Record<string, unknown>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
    revoked_at?: string | null;
}

export interface ConsentInput {
    user_id: string;
    consent_type: ConsentType;
    consent_version?: string;
    consent_status: ConsentStatus;
    consent_data?: Record<string, unknown>;
    ip_address?: string;
    user_agent?: string;
}

class ConsentService {
    /**
     * Consent speichern
     */
    async saveConsent(input: ConsentInput): Promise<number> {
        const connection = await getConnection();
        const consentVersion = input.consent_version || 'v1';
        
        try {
            const [result] = await connection.execute(
                `INSERT INTO dsgvo_consents 
                 (user_id, consent_type, consent_version, consent_status, consent_data, ip_address, user_agent)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    input.user_id,
                    input.consent_type,
                    consentVersion,
                    input.consent_status,
                    input.consent_data ? JSON.stringify(input.consent_data) : null,
                    input.ip_address,
                    input.user_agent
                ]
            );

            const insertId = (result as any).insertId;
            
            // Audit-Log schreiben
            await this.logConsentEvent(input.user_id, 'CONSENT_GIVEN', input.consent_type, input.ip_address, input.user_agent);
            
            logger.info(`Consent gespeichert: ${input.user_id} - ${input.consent_type} - ${input.consent_status}`);
            
            return insertId;
        } catch (error) {
            logger.error("Fehler beim Speichern des Consents", error);
            throw error;
        }
    }

    /**
     * Consent abrufen
     */
    async getConsent(userId: string, consentType: ConsentType): Promise<Consent | null> {
        const connection = await getConnection();
        
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM dsgvo_consents 
                 WHERE user_id = ? AND consent_type = ? 
                 ORDER BY created_at DESC 
                 LIMIT 1`,
                [userId, consentType]
            );

            const consent = (rows as any[])[0];
            if (!consent) {
                return null;
            }

            return {
                ...consent,
                consent_data: consent.consent_data ? JSON.parse(consent.consent_data) : undefined
            };
        } catch (error) {
            logger.error("Fehler beim Abrufen des Consents", error);
            throw error;
        }
    }

    /**
     * Alle Consents eines Benutzers abrufen
     */
    async getUserConsents(userId: string): Promise<Consent[]> {
        const connection = await getConnection();
        
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM dsgvo_consents 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC`,
                [userId]
            );

            return (rows as any[]).map(consent => ({
                ...consent,
                consent_data: consent.consent_data ? JSON.parse(consent.consent_data) : undefined
            }));
        } catch (error) {
            logger.error("Fehler beim Abrufen der Consents", error);
            throw error;
        }
    }

    /**
     * Consent widerrufen
     */
    async revokeConsent(userId: string, consentType: ConsentType, ipAddress?: string, userAgent?: string): Promise<void> {
        const connection = await getConnection();
        
        try {
            await connection.execute(
                `UPDATE dsgvo_consents 
                 SET consent_status = 'revoked', revoked_at = NOW(), updated_at = NOW()
                 WHERE user_id = ? AND consent_type = ? AND consent_status = 'granted'`,
                [userId, consentType]
            );

            // Audit-Log schreiben
            await this.logConsentEvent(userId, 'CONSENT_REVOKED', consentType, ipAddress, userAgent);
            
            logger.info(`Consent widerrufen: ${userId} - ${consentType}`);
        } catch (error) {
            logger.error("Fehler beim Widerrufen des Consents", error);
            throw error;
        }
    }

    /**
     * Consent aktualisieren
     */
    async updateConsent(userId: string, consentType: ConsentType, consentStatus: ConsentStatus, ipAddress?: string, userAgent?: string): Promise<void> {
        const connection = await getConnection();
        
        try {
            await connection.execute(
                `UPDATE dsgvo_consents 
                 SET consent_status = ?, updated_at = NOW()
                 WHERE user_id = ? AND consent_type = ?`,
                [consentStatus, userId, consentType]
            );

            // Audit-Log schreiben
            await this.logConsentEvent(userId, 'CONSENT_UPDATED', consentType, ipAddress, userAgent);
            
            logger.info(`Consent aktualisiert: ${userId} - ${consentType} - ${consentStatus}`);
        } catch (error) {
            logger.error("Fehler beim Aktualisieren des Consents", error);
            throw error;
        }
    }

    /**
     * Prüft, ob Consent vorhanden und aktiv ist
     */
    async hasConsent(userId: string, consentType: ConsentType): Promise<boolean> {
        const consent = await this.getConsent(userId, consentType);
        return consent !== null && consent.consent_status === 'granted';
    }

    /**
     * Audit-Log für Consent-Events
     */
    private async logConsentEvent(
        userId: string,
        eventType: string,
        consentType: ConsentType,
        ipAddress?: string,
        userAgent?: string
    ): Promise<void> {
        const connection = await getConnection();
        
        try {
            await connection.execute(
                `INSERT INTO dsgvo_audit_events 
                 (user_id, event_type, action, resource_type, data_category, ip_address, user_agent, result)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    eventType,
                    `Consent ${eventType}`,
                    'dsgvo_consents',
                    consentType,
                    ipAddress,
                    userAgent,
                    'success'
                ]
            );
        } catch (error) {
            logger.error("Fehler beim Schreiben des Audit-Logs", error);
            // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
        }
    }
}

export const consentService = new ConsentService();



