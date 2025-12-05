/**
 * Mock Media AI Provider - Enterprise++ Standard
 * 
 * Mock-Implementierung für Entwicklung ohne echte API-Keys
 * 
 * @created 2025-01-27
 * @purpose Phase 3.1: Mock-Provider für Entwicklung
 */

import { MediaAIProvider, ProviderStatus, AnalysisOptions, CostEstimate } from "./types";
import type { FullAIAnalysisResult, TaggingResult, AltTextResult, QualityCheckResult, CategoryResult, PersonDetectionResult, CICheckResult } from "../types";

/**
 * Mock Media AI Provider
 * 
 * Simuliert KI-Analysen für Entwicklung
 */
export class MockMediaAIProvider implements MediaAIProvider {
    private version: string = "1.0.0-mock";

    getName(): string {
        return "mock";
    }

    getVersion(): string {
        return this.version;
    }

    async isAvailable(): Promise<ProviderStatus> {
        // Mock ist immer verfügbar
        return {
            available: true,
        };
    }

    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult> {
        // Simuliere Verarbeitungszeit
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock-Ergebnisse
        const result: FullAIAnalysisResult = {
            analyzed_at: new Date().toISOString(),
            model_version: this.version,
        };

        // Tags
        result.tags = {
            tags: ["mock-tag-1", "mock-tag-2", "mock-tag-3"],
            confidence_scores: {
                "mock-tag-1": 0.95,
                "mock-tag-2": 0.87,
                "mock-tag-3": 0.75,
            },
        };

        // Alt-Text
        result.alt_text = {
            description: `Mock-Bildbeschreibung für ${mimeType} Bild`,
            language: options?.language || "de",
            confidence: 0.9,
        };

        // Quality
        result.quality = {
            score: 85,
            warnings: [],
            recommendations: ["Mock-Empfehlung: Bild ist für alle Verwendungszwecke geeignet"],
            isSuitableFor: {
                hero: true,
                thumbnail: true,
                card: true,
            },
        };

        // Category
        result.category = {
            category: "other",
            confidence: 0.8,
            alternatives: ["mock-alternative-1", "mock-alternative-2"],
        };

        // Person Detection (DSGVO)
        result.person_detection = {
            has_person: false, // Mock: Keine Personen
            person_count: 0,
            faces_detected: 0,
            requires_dsgvo_review: false,
        };

        // CI Compliance
        result.ci_compliance = {
            logo_detected: false,
            color_deviation: 0,
            warnings: [],
            recommendations: [],
        };

        return result;
    }

    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate {
        // Mock-Kosten: 0.02 USD pro Bild
        return {
            provider: "mock",
            operation: "analyze",
            costUsd: 0.02,
            imagesProcessed: 1,
        };
    }
}

/**
 * Factory-Funktion für Mock-Provider
 */
export function createMockProvider(): MockMediaAIProvider {
    return new MockMediaAIProvider();
}





