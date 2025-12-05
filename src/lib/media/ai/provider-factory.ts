/**
 * Provider Factory - Enterprise++ Standard
 * 
 * Erstellt den richtigen Provider basierend auf Konfiguration
 * 
 * @created 2025-01-27
 * @purpose Phase 3.2: Provider-Auswahl
 */

import { MediaAIProvider } from "./providers/types";
import { MEDIA_AI_PROVIDER } from "./config";
import { createOpenAIProvider } from "./providers/OpenAIMediaAIProvider";
import { createMockProvider } from "./providers/MockMediaAIProvider";

/**
 * Erstellt den konfigurierten Provider
 * 
 * @returns MediaAIProvider-Instanz
 */
export function createProvider(): MediaAIProvider {
    switch (MEDIA_AI_PROVIDER) {
        case "openai":
            return createOpenAIProvider();
        
        case "mock":
        default:
            return createMockProvider();
    }
}

/**
 * Singleton-Instanz des Providers
 */
let providerInstance: MediaAIProvider | null = null;

/**
 * Gibt die Singleton-Instanz des Providers zurück
 * 
 * @returns MediaAIProvider-Instanz
 */
export function getProvider(): MediaAIProvider {
    if (!providerInstance) {
        providerInstance = createProvider();
    }
    return providerInstance;
}





