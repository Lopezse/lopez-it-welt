/**
 * AI Provider Core Interface - Enterprise++ Standard
 * 
 * Allgemeines AIProvider-Interface für alle KI-Aufgaben
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Allgemeine AI-Provider-Schicht
 * @status ✅ PRODUKTIONSREIF (Phase F.2.1)
 */

/**
 * Request-Kontext für DSGVO und Tracking
 */
export interface AiRequestContext {
    /**
     * User-ID für DSGVO-Tracking und Consent-Prüfung
     */
    userId?: string;

    /**
     * Zusätzlicher Kontext (z.B. "Seite: Startseite Hero", "Media-ID: abc123")
     */
    context?: string;

    /**
     * Locale/Sprache (z.B. "de", "en", "es")
     * Standard: "de"
     */
    locale?: string;
}

/**
 * Optionen für KI-Requests
 */
export interface AiOptions {
    /**
     * Task-ID für Tracking und Logging
     * z.B. "media-tagging", "dsgvo-helper", "content-generation"
     */
    taskId?: string;

    /**
     * Maximale Anzahl Tokens in der Response
     */
    maxTokens?: number;

    /**
     * Temperatur (0.0 = deterministisch, 1.0 = kreativ)
     * Standard: 0.7
     */
    temperature?: number;

    /**
     * System-Prompt (für Kontext, Verhalten, etc.)
     */
    systemPrompt?: string;

    /**
     * Request-Kontext für DSGVO und Tracking
     */
    requestContext?: AiRequestContext;

    /**
     * Zusätzliche Metadaten für Tracking/Logging
     */
    metadata?: Record<string, unknown>;
}

/**
 * Basis-Interface für alle KI-Provider
 * 
 * Jeder Provider (OpenAI, LLaMA, Mistral, etc.) muss dieses Interface implementieren.
 * 
 * @example
 * ```typescript
 * const provider = getProvider();
 * const text = await provider.requestText("Erstelle eine Produktbeschreibung...");
 * ```
 */
export interface AiProvider {
    /**
     * Interne Bezeichnung des Providers
     * z.B. "openai:gpt-4.1", "llama:local-1b", "mistral:7b"
     */
    name: string;

    /**
     * Version des Providers
     * z.B. "1.0.0"
     */
    version: string;

    /**
     * Unterstützt dieses Modell strukturiertes JSON?
     * 
     * Wenn true, kann requestJson() verwendet werden.
     * Wenn false, muss requestText() verwendet werden und JSON manuell geparst werden.
     */
    supportsJson: boolean;

    /**
     * Einfacher Text-Completion-Call
     * 
     * @param input Eingabe-Text (Prompt)
     * @param options Optionale Parameter
     * @returns Generierter Text
     * @throws ProviderError bei Fehlern
     * 
     * @example
     * ```typescript
     * const text = await provider.requestText("Erstelle eine Produktbeschreibung...", {
     *   taskId: "content-generation",
     *   maxTokens: 200,
     *   temperature: 0.7
     * });
     * ```
     */
    requestText(input: string, options?: AiOptions): Promise<string>;

    /**
     * Strukturiertes Ergebnis nach Schema
     * 
     * @param input Eingabe-Text (Prompt)
     * @param schema JSON-Schema für erwartete Struktur
     * @param options Optionale Parameter
     * @returns Strukturiertes Ergebnis (typisiert)
     * @throws ProviderError bei Fehlern oder wenn supportsJson === false
     * 
     * @example
     * ```typescript
     * const result = await provider.requestJson<{tags: string[]}>(prompt, {
     *   type: "object",
     *   properties: {
     *     tags: { type: "array", items: { type: "string" } }
     *   }
     * }, {
     *   taskId: "media-tagging"
     * });
     * ```
     */
    requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T>;

    /**
     * Prüft, ob der Provider verfügbar ist
     * 
     * @returns true wenn verfügbar, false sonst
     */
    isAvailable(): Promise<boolean>;

    /**
     * Schätzt die Kosten für einen Request
     * 
     * @param inputLength Länge des Input-Texts (in Zeichen)
     * @param estimatedOutputLength Geschätzte Länge der Response (in Zeichen)
     * @param options Optionale Parameter
     * @returns Geschätzte Kosten in USD
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number;
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
 * Interface für Provider mit Bildanalyse-Unterstützung
 * 
 * Optional: Erweitert AiProvider um Vision-Funktionen
 */
export interface VisionAiProvider extends AiProvider {
    /**
     * Analysiert ein Bild
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type (z.B. "image/png")
     * @param prompt Text-Prompt für Analyse
     * @param options Optionale Parameter
     * @returns Analyse-Ergebnis als Text
     */
    analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        options?: AiOptions
    ): Promise<string>;

    /**
     * Analysiert ein Bild mit strukturiertem Ergebnis
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type
     * @param prompt Text-Prompt für Analyse
     * @param schema JSON-Schema für erwartete Struktur
     * @param options Optionale Parameter
     * @returns Strukturiertes Analyse-Ergebnis
     */
    analyzeImageJson<T>(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        schema: unknown,
        options?: AiOptions
    ): Promise<T>;
}

/**
 * Interface für Provider mit Embedding-Unterstützung
 * 
 * Optional: Erweitert AiProvider um Embedding-Funktionen
 */
export interface EmbeddingAiProvider extends AiProvider {
    /**
     * Generiert Embeddings für einen Text
     * 
     * @param text Eingabe-Text
     * @param options Optionale Parameter
     * @returns Embedding-Vektor (Array von Zahlen)
     */
    generateEmbedding(text: string, options?: AiOptions): Promise<number[]>;
}


