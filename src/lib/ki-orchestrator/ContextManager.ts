/**
 * Context Manager - Enterprise++ Standard
 * 
 * Verwaltet den KI-Kontext für Orchestrator-Tasks
 * Stellt sicher, dass nur DSGVO/Scope-konforme Daten weitergegeben werden
 */

import type { OrchestratorTask, OrchestratorContext } from "./types";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import { logger } from "@/lib/logger";

class ContextManager {
    /**
     * Baut Kontext für einen Task
     */
    async buildContextForTask(task: OrchestratorTask): Promise<OrchestratorContext> {
        const context: OrchestratorContext = {
            userId: task.userId,
            sanitized: false
        };

        // 1. User-Context anhängen
        context.userContext = await this.attachUserContext(task.userId);

        // 2. DSGVO-Context anhängen
        context.dsgvoContext = await this.attachDSGVOContext(task);

        // 3. System-Context anhängen
        context.systemContext = await this.attachSystemContext();

        // 4. Task-Context anhängen (falls vorhanden)
        if (task.context) {
            context.userContext = {
                ...context.userContext,
                ...task.context
            };
        }

        // 5. Kontext für DSGVO bereinigen
        const sanitizedContext = await this.sanitizeContextForDSGVO(context, task);

        return sanitizedContext;
    }

    /**
     * User-Context anhängen
     */
    private async attachUserContext(userId: string): Promise<Record<string, unknown>> {
        // In Produktion: Echte User-Daten aus DB laden
        // Hier: Minimaler Context
        return {
            userId,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * DSGVO-Context anhängen
     */
    private async attachDSGVOContext(task: OrchestratorTask): Promise<{
        hasConsent: boolean;
        consentVersion: string;
        riskScore: number;
    }> {
        try {
            // DSGVO Decision Engine prüfen
            const decision = await dsgvoDecisionEngine.getAIProcessingPermission({
                userId: task.userId,
                purpose: this.mapPurposeToDSGVOPurpose(task.purpose),
                mediaId: task.payload.mediaId as string | undefined,
                context: task.context || {}
            });

            return {
                hasConsent: decision.allowed,
                consentVersion: decision.requiredConsentVersion,
                riskScore: decision.risk
            };
        } catch (error) {
            logger.error("Fehler beim Aufbauen des DSGVO-Contexts", error);
            // Bei Fehler: Sicherheitshalber blockieren
            return {
                hasConsent: false,
                consentVersion: "v1",
                riskScore: 100
            };
        }
    }

    /**
     * System-Context anhängen
     */
    private async attachSystemContext(): Promise<Record<string, unknown>> {
        return {
            systemVersion: "1.0",
            environment: process.env.NODE_ENV || "development",
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Kontext für DSGVO bereinigen
     */
    private async sanitizeContextForDSGVO(
        context: OrchestratorContext,
        task: OrchestratorTask
    ): Promise<OrchestratorContext> {
        // Entferne sensible Daten aus User-Context
        const sanitizedUserContext: Record<string, unknown> = {};

        // Nur erlaubte Felder behalten
        const allowedFields = ["userId", "timestamp", "language", "preferences"];
        
        if (context.userContext) {
            Object.keys(context.userContext).forEach(key => {
                if (allowedFields.includes(key)) {
                    sanitizedUserContext[key] = context.userContext![key];
                }
            });
        }

        // Entferne sensible Daten aus Payload (falls im Context)
        const sanitizedPayload: Record<string, unknown> = {};
        if (task.payload) {
            // Nur nicht-sensible Felder behalten
            Object.keys(task.payload).forEach(key => {
                if (!this.isSensitiveField(key)) {
                    sanitizedPayload[key] = task.payload[key];
                }
            });
        }

        return {
            ...context,
            userContext: sanitizedUserContext,
            sanitized: true
        };
    }

    /**
     * Prüft, ob Feld sensibel ist
     */
    private isSensitiveField(fieldName: string): boolean {
        const sensitiveFields = [
            "password",
            "token",
            "secret",
            "apiKey",
            "creditCard",
            "ssn",
            "personalData"
        ];

        return sensitiveFields.some(sensitive => 
            fieldName.toLowerCase().includes(sensitive.toLowerCase())
        );
    }

    /**
     * Mappt Purpose zu DSGVO-Purpose
     */
    private mapPurposeToDSGVOPurpose(purpose: string): 
        "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics" {
        
        if (purpose.includes("media") || purpose.includes("image") || purpose.includes("tagging")) {
            return "media_ki";
        }
        if (purpose.includes("person") || purpose.includes("detection")) {
            return "person_detection";
        }
        if (purpose.includes("profile") || purpose.includes("building")) {
            return "profile_building";
        }
        if (purpose.includes("analytics") || purpose.includes("analysis")) {
            return "analytics";
        }

        // Default: orchestrator_ki
        return "orchestrator_ki";
    }
}

export const contextManager = new ContextManager();



