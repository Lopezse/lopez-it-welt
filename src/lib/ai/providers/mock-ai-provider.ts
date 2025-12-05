/**
 * Mock AI Provider - Enterprise++ Standard
 * 
 * Mock-Implementierung des AiProvider-Interfaces für Tests und Entwicklung
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Mock-Provider für Tests
 * @status ✅ PRODUKTIONSREIF (Phase F.2.2)
 */

import { AiProvider, AiOptions, ProviderError } from "../core/ai-provider";

/**
 * Mock AI Provider
 * 
 * Gibt deterministische, einfache Antworten zurück ohne echte KI-Nutzung.
 * Verwendbar für:
 * - Unit-Tests
 * - UI-Tests
 * - Offline-Entwicklung
 */
export class MockAiProvider implements AiProvider {
    readonly name: string = "mock:test";
    readonly version: string = "1.0.0";
    readonly supportsJson: boolean = true;

    /**
     * Gibt eine Mock-Text-Response zurück
     * 
     * Format: "MOCK_RESPONSE: " + erste 80 Zeichen des Inputs
     */
    async requestText(input: string, options?: AiOptions): Promise<string> {
        // Simuliere kleine Verzögerung (wie echte API)
        await new Promise((resolve) => setTimeout(resolve, 100));

        const prefix = "MOCK_RESPONSE: ";
        const truncatedInput = input.slice(0, 80);
        const response = `${prefix}${truncatedInput}${input.length > 80 ? "..." : ""}`;

        // Log für Tests
        if (options?.taskId) {
            console.log(`[MockAiProvider] Task: ${options.taskId}, Input: ${truncatedInput}...`);
        }

        return response;
    }

    /**
     * Gibt eine Mock-JSON-Response zurück
     * 
     * Versucht, ein statisches JSON zurückzugeben, das zum Schema passt.
     * Für einfache Schemas gibt es vordefinierte Mock-Daten.
     */
    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        // Simuliere kleine Verzögerung (wie echte API)
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Versuche Schema zu analysieren und passende Mock-Daten zu generieren
        const mockData = this.generateMockJson(schema, input);

        // Log für Tests
        if (options?.taskId) {
            console.log(`[MockAiProvider] Task: ${options.taskId}, Schema: ${JSON.stringify(schema)}`);
        }

        return mockData as T;
    }

    /**
     * Generiert Mock-JSON basierend auf Schema
     */
    private generateMockJson(schema: unknown, input: string): unknown {
        // Einfache Schema-Analyse für häufige Fälle
        if (typeof schema === "object" && schema !== null) {
            const schemaObj = schema as Record<string, unknown>;

            // Beispiel: Media-Tagging-Schema
            if (input.toLowerCase().includes("tag") || input.toLowerCase().includes("bild")) {
                return {
                    tags: ["mock-tag-1", "mock-tag-2", "mock-tag-3"],
                    alt_text: {
                        description: "Mock-Bildbeschreibung für Barrierefreiheit",
                        confidence: 0.9,
                    },
                    category: {
                        category: "other",
                        confidence: 0.8,
                    },
                };
            }

            // Beispiel: DSGVO-Helfer-Schema
            if (input.toLowerCase().includes("dsgvo") || input.toLowerCase().includes("datenschutz")) {
                return {
                    hasProblems: true,
                    problems: ["Mock-Problem: Fehlende Datenschutzerklärung"],
                    suggestions: ["Mock-Vorschlag: Datenschutzerklärung hinzufügen"],
                };
            }

            // Generisches Schema: Versuche Properties zu extrahieren
            if (schemaObj.type === "object" && schemaObj.properties) {
                const properties = schemaObj.properties as Record<string, unknown>;
                const result: Record<string, unknown> = {};

                for (const [key, propSchema] of Object.entries(properties)) {
                    const prop = propSchema as Record<string, unknown>;

                    if (prop.type === "string") {
                        result[key] = `mock-${key}`;
                    } else if (prop.type === "number") {
                        result[key] = 0;
                    } else if (prop.type === "boolean") {
                        result[key] = false;
                    } else if (prop.type === "array") {
                        result[key] = [];
                    } else if (prop.type === "object") {
                        result[key] = {};
                    }
                }

                return result;
            }
        }

        // Fallback: Einfaches Objekt
        return {
            result: "mock-result",
            input: input.slice(0, 50),
        };
    }

    /**
     * Mock ist immer verfügbar
     */
    async isAvailable(): Promise<boolean> {
        return true;
    }

    /**
     * Mock hat keine Kosten
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        return 0; // Mock ist kostenlos
    }
}

/**
 * Factory-Funktion für Mock-Provider
 */
export function createMockAiProvider(): MockAiProvider {
    return new MockAiProvider();
}



