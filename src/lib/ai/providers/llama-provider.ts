/**
 * LLaMA Provider - Enterprise++ Standard
 * 
 * Implementierung des AiProvider-Interfaces für Self-Hosted LLaMA (Ollama)
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.4: LLaMA-Provider für Self-Hosted KI
 * @status ✅ PRODUKTIONSREIF (Phase F.2.4)
 */

import { AiProvider, AiOptions, ProviderError } from "../core/ai-provider";

/**
 * LLaMA Provider
 * 
 * Nutzt Ollama API für Self-Hosted LLaMA-Modelle
 * 
 * Konfiguration:
 * - LLAMA_SERVER_URL: Ollama Server URL (Default: http://localhost:11434)
 * - LLAMA_MODEL: Modell-Name (Default: llama3.2:1b)
 */
export class LLaMAProvider implements AiProvider {
    private serverUrl: string;
    private model: string;
    readonly name: string;
    readonly version: string = "1.0.0";
    readonly supportsJson: boolean = false; // LLaMA unterstützt keinen nativen JSON-Mode

    constructor(config?: { serverUrl?: string; model?: string }) {
        this.serverUrl = config?.serverUrl || process.env.LLAMA_SERVER_URL || "http://localhost:11434";
        this.model = config?.model || process.env.LLAMA_MODEL || "llama3.2:1b";
        this.name = `llama:${this.model}`;
    }

    /**
     * Text-Request über Ollama API
     */
    async requestText(input: string, options?: AiOptions): Promise<string> {
        try {
            // System-Prompt hinzufügen, falls vorhanden
            const fullPrompt = options?.systemPrompt
                ? `${options.systemPrompt}\n\n${input}`
                : input;

            const response = await fetch(`${this.serverUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: fullPrompt,
                    stream: false,
                    options: {
                        temperature: options?.temperature ?? 0.7,
                        num_predict: options?.maxTokens ?? 1000,
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`LLaMA API error (${response.status}): ${errorText}`);
            }

            const result = await response.json();
            return result.response || "";
        } catch (error) {
            if (error instanceof ProviderError) {
                throw error;
            }

            // Netzwerk-Fehler
            if (error instanceof Error) {
                if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
                    throw new ProviderError(
                        `LLaMA server not reachable at ${this.serverUrl}. Is Ollama running?`,
                        this.name,
                        "API_ERROR",
                        true
                    );
                }

                if (error.message.includes("timeout")) {
                    throw new ProviderError(
                        "LLaMA request timeout",
                        this.name,
                        "TIMEOUT",
                        true
                    );
                }
            }

            throw new ProviderError(
                `LLaMA request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    /**
     * JSON-Request über Ollama API
     * 
     * LLaMA unterstützt keinen nativen JSON-Mode, daher:
     * 1. Prompt erweitern mit JSON-Anweisung
     * 2. JSON aus Text extrahieren
     */
    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        // Erweitere Prompt mit JSON-Anweisung
        const jsonPrompt = `${input}

WICHTIG: Antworte NUR mit gültigem JSON, kein zusätzlicher Text!
Das JSON muss diesem Schema entsprechen: ${JSON.stringify(schema)}`;

        const text = await this.requestText(jsonPrompt, options);

        // Versuche JSON aus Response zu extrahieren
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new ProviderError(
                "LLaMA response does not contain valid JSON",
                this.name,
                "API_ERROR",
                false
            );
        }

        try {
            return JSON.parse(jsonMatch[0]) as T;
        } catch (error) {
            throw new ProviderError(
                `Failed to parse JSON from LLaMA response: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                false
            );
        }
    }

    /**
     * Verfügbarkeitsprüfung
     * 
     * Prüft, ob Ollama-Server erreichbar ist
     */
    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.serverUrl}/api/tags`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Kosten-Schätzung
     * 
     * Self-Hosted: Keine API-Kosten, nur Server-Kosten
     * Für Einzelunternehmen: Sehr geringe Kosten pro Request
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        // Self-Hosted: Keine API-Kosten
        // Kosten pro Request = Server-Kosten / erwartete Requests pro Monat
        // Beispiel: 300 €/Monat Server / 10.000 Requests = 0.03 € pro Request
        // Für Phase L0/L1 (lokal): 0 €
        
        const monthlyServerCost = parseFloat(process.env.LLAMA_MONTHLY_COST || "0");
        const expectedRequestsPerMonth = parseFloat(process.env.LLAMA_EXPECTED_REQUESTS || "1000");
        
        if (monthlyServerCost === 0 || expectedRequestsPerMonth === 0) {
            return 0; // Lokal = kostenlos
        }

        return monthlyServerCost / expectedRequestsPerMonth;
    }
}

/**
 * Factory-Funktion für LLaMA-Provider
 */
export function createLLaMAProvider(config?: { serverUrl?: string; model?: string }): LLaMAProvider {
    return new LLaMAProvider(config);
}



