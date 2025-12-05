/**
 * Provider-Interface für KI-Services - Enterprise++ Standard
 * 
 * Definiert die Schnittstelle für alle KI-Provider (OpenAI, Google, Azure, Mock, etc.)
 * 
 * @created 2025-01-27
 * @purpose Phase 3.1: Provider-Abstraktion
 */

import type {
    FullAIAnalysisResult,
    TaggingResult,
    AltTextResult,
    QualityCheckResult,
    CategoryResult,
    PersonDetectionResult,
    CICheckResult,
    SmartSearchParams,
    SmartSearchResult,
} from "../types";

/**
 * Optionen für Bildanalyse
 */
export interface AnalysisOptions {
    intendedUse?: "hero" | "thumbnail" | "card";
    context?: string; // Zusätzlicher Kontext (z.B. "Seite: Startseite Hero")
    language?: string; // "de" | "en" | "es"
    maxTags?: number; // Maximale Anzahl Tags
    minConfidence?: number; // Minimale Konfidenz (0-1)
}

/**
 * Rate-Limit-Informationen
 */
export interface RateLimitInfo {
    remaining: number; // Verbleibende Requests
    resetAt: Date; // Wann wird das Limit zurückgesetzt
    limit: number; // Maximales Limit
}

/**
 * Kosten-Informationen für eine Operation
 */
export interface CostEstimate {
    provider: string;
    operation: "analyze" | "batch" | "search" | "similar";
    costUsd: number; // Geschätzte Kosten in USD
    tokensUsed?: number; // Anzahl verwendeter Tokens (falls verfügbar)
    imagesProcessed?: number; // Anzahl verarbeiteter Bilder
}

/**
 * Provider-Status
 */
export interface ProviderStatus {
    available: boolean; // Ist der Provider verfügbar?
    rateLimit?: RateLimitInfo; // Aktuelle Rate-Limit-Info
    error?: string; // Fehlermeldung falls nicht verfügbar
}

/**
 * Basis-Interface für alle KI-Provider
 * 
 * Jeder Provider (OpenAI, Google, Azure, Mock) muss dieses Interface implementieren.
 */
export interface MediaAIProvider {
    /**
     * Name des Providers (z.B. "openai", "google", "mock")
     */
    getName(): string;

    /**
     * Version des Providers (z.B. "1.0.0")
     */
    getVersion(): string;

    /**
     * Prüft, ob der Provider verfügbar ist
     * 
     * @returns Provider-Status mit Verfügbarkeit und Rate-Limits
     */
    isAvailable(): Promise<ProviderStatus>;

    /**
     * Führt eine vollständige Bildanalyse durch
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type des Bildes (z.B. "image/png")
     * @param options Optionale Analyse-Parameter
     * @returns Vollständiges Analyse-Ergebnis
     * @throws ProviderError bei Fehlern (Rate-Limit, API-Fehler, etc.)
     */
    analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult>;

    /**
     * Schätzt die Kosten für eine Bildanalyse
     * 
     * @param imageSize Größe des Bildes in Bytes
     * @param options Optionale Analyse-Parameter
     * @returns Geschätzte Kosten in USD
     */
    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate;

    /**
     * Findet ähnliche Medien (optional)
     * 
     * @param mediaId Media-ID des Referenz-Mediums
     * @param limit Maximale Anzahl ähnlicher Medien
     * @returns Array von ähnlichen Medien
     */
    findSimilar?(mediaId: string, limit: number): Promise<Array<{
        media_id: string;
        similarity_score: number;
        reason?: string;
    }>>;

    /**
     * Semantische Suche nach Medien (optional)
     * 
     * @param params Such-Parameter
     * @returns Array von relevanten Medien
     */
    search?(params: SmartSearchParams): Promise<SmartSearchResult[]>;
}

/**
 * Provider-Fehler-Klasse
 */
export class ProviderError extends Error {
    constructor(
        message: string,
        public readonly provider: string,
        public readonly code: "RATE_LIMIT" | "API_ERROR" | "TIMEOUT" | "AUTH_ERROR" | "UNKNOWN",
        public readonly retryable: boolean = false,
        public readonly retryAfter?: Date
    ) {
        super(message);
        this.name = "ProviderError";
    }
}

/**
 * Retry-Konfiguration für Provider
 */
export interface RetryConfig {
    maxRetries: number; // Maximale Anzahl Retry-Versuche
    initialDelayMs: number; // Initiale Verzögerung in Millisekunden
    maxDelayMs: number; // Maximale Verzögerung in Millisekunden
    backoffMultiplier: number; // Multiplikator für Exponential Backoff (z.B. 2.0)
}

/**
 * Standard-Retry-Konfiguration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 1000, // 1 Sekunde
    maxDelayMs: 30000, // 30 Sekunden
    backoffMultiplier: 2.0,
};

/**
 * Führt eine Operation mit Retry-Logik aus
 * 
 * @param fn Funktion, die ausgeführt werden soll
 * @param config Retry-Konfiguration
 * @returns Ergebnis der Funktion
 * @throws ProviderError wenn alle Retries fehlgeschlagen sind
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
    let lastError: Error | null = null;
    let delay = config.initialDelayMs;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Wenn es kein ProviderError ist oder nicht retryable, sofort werfen
            if (!(error instanceof ProviderError) || !error.retryable) {
                throw error;
            }

            // Wenn Retry-After-Datum vorhanden ist, warten
            if (error.retryAfter && error.retryAfter > new Date()) {
                const waitTime = error.retryAfter.getTime() - Date.now();
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                continue;
            }

            // Wenn letzter Versuch, Fehler werfen
            if (attempt === config.maxRetries) {
                throw error;
            }

            // Exponential Backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
        }
    }

    throw lastError || new Error("Unbekannter Fehler");
}





