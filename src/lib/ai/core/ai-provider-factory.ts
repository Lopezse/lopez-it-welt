/**
 * AI Provider Factory - Enterprise++ Standard
 * 
 * Factory für Erstellung und Verwaltung von AI-Providern
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Provider-Factory
 * @status ✅ PRODUKTIONSREIF (Phase F.2.2)
 */

import { AiProvider } from "./ai-provider";
import { MockAiProvider, createMockAiProvider } from "../providers/mock-ai-provider";
import { LLaMAProvider, createLLaMAProvider } from "../providers/llama-provider";
import { OpenAIProvider, createOpenAIProvider } from "../providers/openai-provider";

export type ProviderType = "openai" | "llama" | "mistral" | "mock";

export interface ProviderConfig {
    type: ProviderType;
    apiKey?: string; // Für Cloud-Provider (OpenAI)
    serverUrl?: string; // Für Self-Hosted Provider (LLaMA)
    model?: string; // Optional, Provider-spezifisch
}

/**
 * Erstellt einen Provider basierend auf Konfiguration
 * 
 * @param config Provider-Konfiguration
 * @returns AiProvider-Instanz
 * @throws Error wenn Provider-Typ unbekannt oder Konfiguration ungültig
 */
export function createProvider(config: ProviderConfig): AiProvider {
    switch (config.type) {
        case "mock":
            return createMockAiProvider();

        case "openai":
            return createOpenAIProvider({
                apiKey: config.apiKey,
                model: config.model,
            });

        case "llama":
            return createLLaMAProvider({
                serverUrl: config.serverUrl,
                model: config.model,
            });

        case "mistral":
            // Wird später implementiert
            throw new Error("Mistral Provider wird später implementiert");

        default:
            throw new Error(`Unknown provider type: ${config.type}`);
    }
}

/**
 * Lädt Provider-Konfiguration aus Environment-Variablen
 * 
 * @returns ProviderConfig
 */
export function loadProviderConfig(): ProviderConfig {
    const providerType = (process.env.AI_PROVIDER || "mock") as ProviderType;

    return {
        type: providerType,
        apiKey: process.env.OPENAI_API_KEY, // Für OpenAI
        serverUrl: process.env.LLAMA_SERVER_URL || "http://localhost:11434", // Für LLaMA
        model: process.env.AI_MODEL, // Optional, Provider-spezifisch
    };
}

/**
 * Singleton-Instanz des Providers
 */
let providerInstance: AiProvider | null = null;

/**
 * Gibt die Singleton-Instanz des Providers zurück
 * 
 * Lädt die Konfiguration aus Environment-Variablen und erstellt den Provider.
 * 
 * @returns AiProvider-Instanz
 */
export function getProvider(): AiProvider {
    if (!providerInstance) {
        const config = loadProviderConfig();
        providerInstance = createProvider(config);
    }
    return providerInstance;
}

/**
 * Setzt die Provider-Instanz (für Tests)
 * 
 * @param provider Provider-Instanz oder null zum Zurücksetzen
 */
export function setProvider(provider: AiProvider | null): void {
    providerInstance = provider;
}

