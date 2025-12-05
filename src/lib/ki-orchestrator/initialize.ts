/**
 * Orchestrator Initialization - Enterprise++ Standard
 * 
 * Initialisiert den KI-Orchestrator mit Basis-Agenten
 * Wird beim System-Start aufgerufen
 */

import { orchestratorCore } from "./OrchestratorCore";
import { logger } from "@/lib/logger";

/**
 * Initialisiert den Orchestrator mit Basis-Agenten
 */
export async function initializeOrchestrator(): Promise<void> {
    try {
        logger.info("Initialisiere KI-Orchestrator...");

        // Basis-Agenten registrieren
        await orchestratorCore.registerAgent({
            name: "media-ai-agent",
            type: "media",
            capabilities: [
                "image-tagging",
                "alt-text-generation",
                "person-detection",
                "quality-check",
                "category-suggestion"
            ],
            dsgvoScope: ["media_ki", "person_detection"],
            riskProfile: "medium",
            enabled: true
        });

        await orchestratorCore.registerAgent({
            name: "dev-assistant-agent",
            type: "dev",
            capabilities: [
                "code-analysis",
                "code-suggestions",
                "documentation-generation",
                "refactoring-assistance"
            ],
            dsgvoScope: ["orchestrator_ki"],
            riskProfile: "low",
            enabled: true
        });

        await orchestratorCore.registerAgent({
            name: "doc-assistant-agent",
            type: "doc",
            capabilities: [
                "document-summarization",
                "document-analysis",
                "content-extraction",
                "translation"
            ],
            dsgvoScope: ["orchestrator_ki"],
            riskProfile: "low",
            enabled: true
        });

        await orchestratorCore.registerAgent({
            name: "monitoring-agent",
            type: "monitoring",
            capabilities: [
                "system-health-check",
                "performance-analysis",
                "error-detection",
                "alert-generation"
            ],
            dsgvoScope: ["analytics"],
            riskProfile: "low",
            enabled: true
        });

        await orchestratorCore.registerAgent({
            name: "business-analytics-agent",
            type: "business",
            capabilities: [
                "data-analysis",
                "report-generation",
                "trend-detection",
                "forecasting"
            ],
            dsgvoScope: ["analytics", "profile_building"],
            riskProfile: "medium",
            enabled: true
        });

        logger.info("KI-Orchestrator erfolgreich initialisiert mit 5 Basis-Agenten");
    } catch (error) {
        logger.error("Fehler bei der Orchestrator-Initialisierung", error);
        throw error;
    }
}



