/**
 * KI-Services Konfiguration - Enterprise++ Standard
 * 
 * Zentrale Konfiguration für alle KI-Services
 * 
 * WICHTIG: Secrets werden niemals gespeichert, nur referenziert!
 */

import { SecretManager } from "./secret-manager";

/**
 * Secret-Referenz-Format
 * 
 * Unterstützte Formate:
 * - "ENV:VARIABLE_NAME" - Umgebungsvariable
 * - "MOCK" - Mock-Provider (kein Key nötig)
 */
export type SecretRef = string;

/**
 * KI-Service-Konfiguration
 * 
 * WICHTIG: api_key wird NICHT mehr verwendet!
 * Stattdessen: secretRef für Secret-Referenz
 */
export interface AIServiceConfig {
    enabled: boolean;
    provider?: "openai" | "google" | "azure" | "local" | "mock";
    secretRef?: SecretRef; // Statt api_key: Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
    api_key?: string; // @deprecated - Verwende secretRef stattdessen
    model_version?: string;
    timeout_ms?: number;
    retry_attempts?: number;
}

/**
 * Haupt-Provider-Konfiguration
 * 
 * Bestimmt, welcher Provider für die gesamte KI-Analyse verwendet wird
 * 
 * Default: "mock" (für Entwicklung ohne echte API-Keys)
 */
export const MEDIA_AI_PROVIDER: "mock" | "openai" | "google" | "azure" | "local" =
    (process.env.MEDIA_AI_PROVIDER as any) || "mock";

/**
 * OpenAI Secret-Referenz
 * 
 * WICHTIG: Nur Referenz, kein Key-Wert!
 * Format: "ENV:OPENAI_API_KEY"
 */
export const OPENAI_SECRET_REF: SecretRef = "ENV:OPENAI_API_KEY";

/**
 * Prüft, ob OpenAI-Key verfügbar ist
 * 
 * @returns true wenn Key vorhanden, false sonst
 */
export function isOpenAIKeyAvailable(): boolean {
    if (MEDIA_AI_PROVIDER === "mock") {
        return true; // Mock benötigt keinen Key
    }
    
    if (MEDIA_AI_PROVIDER === "openai") {
        return SecretManager.hasSecret(OPENAI_SECRET_REF);
    }
    
    return false;
}

/**
 * Lädt OpenAI-API-Key (zur Laufzeit)
 * 
 * @returns API-Key oder leeren String (für Mock)
 * @throws Error wenn Key für echten Provider fehlt
 */
export function getOpenAIApiKey(): string {
    if (MEDIA_AI_PROVIDER === "mock") {
        return ""; // Mock benötigt keinen Key
    }
    
    if (MEDIA_AI_PROVIDER === "openai") {
        try {
            return SecretManager.loadSecret(OPENAI_SECRET_REF);
        } catch (error) {
            const envVar = SecretManager.extractEnvVarName(OPENAI_SECRET_REF);
            throw new Error(
                `OpenAI API Key not found. ` +
                `Please set ${envVar} in your .env file. ` +
                `Current provider: ${MEDIA_AI_PROVIDER}`
            );
        }
    }
    
    return "";
}

/**
 * Kosten-Limits
 */
export const MEDIA_AI_LIMITS = {
    dailyLimitUsd: parseFloat(process.env.MEDIA_AI_DAILY_LIMIT_USD || "10.00"),
    monthlyLimitUsd: parseFloat(process.env.MEDIA_AI_MONTHLY_LIMIT_USD || "200.00"),
    warningThreshold: parseFloat(process.env.MEDIA_AI_WARNING_THRESHOLD || "0.8"),
};

/**
 * Async-Processing-Konfiguration
 */
export const MEDIA_AI_ASYNC_CONFIG = {
    maxBatchSize: parseInt(process.env.MEDIA_AI_ASYNC_BATCH_SIZE || "10"),
    maxRetries: parseInt(process.env.MEDIA_AI_MAX_RETRIES || "3"),
    retryDelayMs: parseInt(process.env.MEDIA_AI_RETRY_DELAY_MS || "5000"),
};

/**
 * Standard-Konfiguration (Mock-Modus für Entwicklung)
 */
export const AI_CONFIG: Record<string, AIServiceConfig> = {
    tagging: {
        enabled: true,
        provider: "mock",
        timeout_ms: 5000,
        retry_attempts: 2,
    },
    alt_text: {
        enabled: true,
        provider: "mock",
        timeout_ms: 5000,
        retry_attempts: 2,
    },
    quality_check: {
        enabled: true,
        provider: "mock",
        timeout_ms: 3000,
        retry_attempts: 1,
    },
    category: {
        enabled: true,
        provider: "mock",
        timeout_ms: 3000,
        retry_attempts: 1,
    },
    similarity: {
        enabled: true,
        provider: "mock",
        timeout_ms: 10000,
        retry_attempts: 1,
    },
    ci_check: {
        enabled: true,
        provider: "mock",
        timeout_ms: 5000,
        retry_attempts: 1,
    },
    person_detection: {
        enabled: true,
        provider: "mock",
        timeout_ms: 5000,
        retry_attempts: 1,
    },
};

/**
 * Lädt Konfiguration aus Umgebungsvariablen
 */
export function loadAIConfig(): Record<string, AIServiceConfig> {
    // TODO: Später aus .env oder Config-Datei laden
    return AI_CONFIG;
}


