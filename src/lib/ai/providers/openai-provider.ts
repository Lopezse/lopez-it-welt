/**
 * OpenAI Provider - Enterprise++ Standard
 * 
 * Allgemeine Implementierung des AiProvider-Interfaces für OpenAI
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.3: Allgemeiner OpenAI-Provider
 * @status ✅ PRODUKTIONSREIF (Phase F.2.3)
 */

import { AiProvider, AiOptions, ProviderError } from "../core/ai-provider";
import { SecretManager } from "@/lib/media/ai/secret-manager";
import OpenAI from "openai";

/**
 * OpenAI Provider
 * 
 * Nutzt OpenAI SDK für Text-Generierung und JSON-Responses
 * 
 * Konfiguration:
 * - OPENAI_API_KEY: API-Key (via SecretManager)
 * - OPENAI_MODEL: Modell-Name (Default: gpt-4)
 */
export class OpenAIProvider implements AiProvider {
    private client: any | null = null;
    private model: string;
    readonly name: string;
    readonly version: string = "1.0.0";
    readonly supportsJson: boolean = true; // GPT-4 unterstützt JSON-Mode

    constructor(config?: { apiKey?: string; model?: string }) {
        this.model = config?.model || process.env.OPENAI_MODEL || "gpt-4";

        // API-Key laden
        try {
            const apiKey = config?.apiKey || this.loadApiKey();
            if (!apiKey || apiKey.length === 0) {
                console.warn("⚠️ OpenAI API Key nicht gefunden. Provider wird nicht initialisiert.");
                return;
            }

            this.client = new OpenAI({
                apiKey: apiKey,
                // WICHTIG: Keine API-Keys in Logs!
            });

            this.name = `openai:${this.model}`;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("❌ Fehler beim Initialisieren des OpenAI-Clients:", errorMessage);
            // Client bleibt null - isAvailable() wird false zurückgeben
        }
    }

    /**
     * Lädt API-Key über SecretManager
     */
    private loadApiKey(): string {
        try {
            return SecretManager.loadSecret("ENV:OPENAI_API_KEY");
        } catch (error) {
            return "";
        }
    }

    /**
     * Text-Request über OpenAI API
     */
    async requestText(input: string, options?: AiOptions): Promise<string> {
        if (!this.client) {
            throw new ProviderError(
                "OpenAI client not initialized. Please check API key and OpenAI SDK installation.",
                this.name,
                "API_ERROR",
                false
            );
        }

        try {
            const messages: Array<{ role: string; content: string }> = [];

            // System-Prompt hinzufügen, falls vorhanden
            if (options?.systemPrompt) {
                messages.push({
                    role: "system",
                    content: options.systemPrompt,
                });
            }

            // User-Prompt hinzufügen
            messages.push({
                role: "user",
                content: input,
            });

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature ?? 0.7,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new ProviderError(
                    "No response from OpenAI",
                    this.name,
                    "API_ERROR",
                    true
                );
            }

            return content;
        } catch (error) {
            if (error instanceof ProviderError) {
                throw error;
            }

            // OpenAI-spezifische Fehler
            if (error instanceof Error) {
                // Rate Limit
                if (error.message.includes("rate_limit") || error.message.includes("429")) {
                    throw new ProviderError(
                        "OpenAI rate limit exceeded",
                        this.name,
                        "RATE_LIMIT",
                        true,
                        new Date(Date.now() + 60000) // Retry nach 1 Minute
                    );
                }

                // Auth Error
                if (error.message.includes("401") || error.message.includes("unauthorized")) {
                    throw new ProviderError(
                        "OpenAI authentication failed",
                        this.name,
                        "AUTH_ERROR",
                        false
                    );
                }

                // Timeout
                if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
                    throw new ProviderError(
                        "OpenAI request timeout",
                        this.name,
                        "TIMEOUT",
                        true
                    );
                }
            }

            throw new ProviderError(
                `OpenAI request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    /**
     * JSON-Request über OpenAI API
     * 
     * Nutzt OpenAI's JSON-Mode für strukturierte Responses
     */
    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        if (!this.client) {
            throw new ProviderError(
                "OpenAI client not initialized. Please check API key and OpenAI SDK installation.",
                this.name,
                "API_ERROR",
                false
            );
        }

        try {
            const messages: Array<{ role: string; content: string }> = [];

            // System-Prompt hinzufügen, falls vorhanden
            if (options?.systemPrompt) {
                messages.push({
                    role: "system",
                    content: options.systemPrompt,
                });
            }

            // User-Prompt mit Schema-Anweisung
            const jsonPrompt = `${input}

WICHTIG: Antworte NUR mit gültigem JSON, das diesem Schema entspricht:
${JSON.stringify(schema, null, 2)}`;

            messages.push({
                role: "user",
                content: jsonPrompt,
            });

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                response_format: { type: "json_object" }, // JSON-Mode
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature ?? 0.7,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new ProviderError(
                    "No response from OpenAI",
                    this.name,
                    "API_ERROR",
                    true
                );
            }

            try {
                return JSON.parse(content) as T;
            } catch (parseError) {
                throw new ProviderError(
                    `Failed to parse JSON from OpenAI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
                    this.name,
                    "API_ERROR",
                    false
                );
            }
        } catch (error) {
            if (error instanceof ProviderError) {
                throw error;
            }

            // Gleiche Fehlerbehandlung wie requestText
            if (error instanceof Error) {
                if (error.message.includes("rate_limit") || error.message.includes("429")) {
                    throw new ProviderError(
                        "OpenAI rate limit exceeded",
                        this.name,
                        "RATE_LIMIT",
                        true,
                        new Date(Date.now() + 60000)
                    );
                }

                if (error.message.includes("401") || error.message.includes("unauthorized")) {
                    throw new ProviderError(
                        "OpenAI authentication failed",
                        this.name,
                        "AUTH_ERROR",
                        false
                    );
                }

                if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
                    throw new ProviderError(
                        "OpenAI request timeout",
                        this.name,
                        "TIMEOUT",
                        true
                    );
                }
            }

            throw new ProviderError(
                `OpenAI JSON request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    /**
     * Verfügbarkeitsprüfung
     * 
     * Prüft, ob OpenAI-Client initialisiert ist und API-Key vorhanden
     */
    async isAvailable(): Promise<boolean> {
        if (!this.client) {
            return false; // Client nicht initialisiert
        }

        try {
            // Einfacher Health-Check: Prüfe ob API-Key vorhanden ist
            const apiKey = this.loadApiKey();
            return apiKey.length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Kosten-Schätzung
     * 
     * Basierend auf OpenAI Pricing (Stand: 2025-11-29)
     * - Input: $0.01 pro 1K Tokens (GPT-4)
     * - Output: $0.03 pro 1K Tokens (GPT-4)
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        // Geschätzte Tokens (ca. 4 Zeichen pro Token)
        const inputTokens = Math.ceil(inputLength / 4);
        const outputTokens = Math.ceil(estimatedOutputLength / 4);

        // OpenAI Pricing (GPT-4)
        const inputCostPer1K = 0.01; // USD
        const outputCostPer1K = 0.03; // USD

        const inputCost = (inputTokens / 1000) * inputCostPer1K;
        const outputCost = (outputTokens / 1000) * outputCostPer1K;

        return inputCost + outputCost;
    }
}

/**
 * Factory-Funktion für OpenAI-Provider
 */
export function createOpenAIProvider(config?: { apiKey?: string; model?: string }): OpenAIProvider {
    return new OpenAIProvider(config);
}

