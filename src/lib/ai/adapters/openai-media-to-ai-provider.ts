/**
 * OpenAI Media AI to AI Provider Adapter - Enterprise++ Standard
 * 
 * Adapter: Wrappt OpenAIMediaAIProvider und stellt AiProvider-Interface bereit
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.5: Adapter-Pattern für Migration
 * @status ✅ PRODUKTIONSREIF (Phase F.2.5)
 */

import { AiProvider, AiOptions, ProviderError, VisionAiProvider } from "../core/ai-provider";
import type { MediaAIProvider, AnalysisOptions } from "@/lib/media/ai/providers/types";
import type { FullAIAnalysisResult } from "@/lib/media/ai/types";

/**
 * Adapter: OpenAIMediaAIProvider → AiProvider
 * 
 * Dieser Adapter ermöglicht die schrittweise Migration von MediaAIProvider zu AiProvider.
 * 
 * Ziel:
 * - Bestehender Code (MediaAIService) bleibt unverändert
 * - Intern kann AiProvider verwendet werden
 * - Schrittweise Migration möglich
 * 
 * WICHTIG: Dieser Adapter ist für Migration gedacht, nicht für produktive Nutzung.
 * Langfristig sollte MediaAIService direkt AiProvider nutzen.
 */
export class OpenAIMediaToAiProviderAdapter implements AiProvider, VisionAiProvider {
    private mediaProvider: MediaAIProvider;

    constructor(mediaProvider: MediaAIProvider) {
        this.mediaProvider = mediaProvider;
    }

    get name(): string {
        return `${this.mediaProvider.getName()}:adapter`;
    }

    get version(): string {
        return this.mediaProvider.getVersion();
    }

    get supportsJson(): boolean {
        // OpenAIMediaAIProvider gibt bereits strukturierte JSON-Responses zurück
        // Aber requestJson() ist nicht direkt unterstützt, da Media-Provider
        // nur analyzeImage() hat, nicht requestText()/requestJson()
        return false; // Adapter unterstützt requestJson() nicht direkt
    }

    /**
     * Text-Request über Media-Provider
     * 
     * HINWEIS: OpenAIMediaAIProvider unterstützt keine reinen Text-Requests.
     * Diese Methode wirft einen Fehler, da der Media-Provider nur Bildanalyse kann.
     */
    async requestText(input: string, options?: AiOptions): Promise<string> {
        throw new ProviderError(
            "OpenAI Media Provider does not support text-only requests. Use analyzeImage() instead.",
            this.name,
            "API_ERROR",
            false
        );
    }

    /**
     * JSON-Request über Media-Provider
     * 
     * HINWEIS: OpenAIMediaAIProvider unterstützt keine reinen JSON-Requests.
     * Diese Methode wirft einen Fehler, da der Media-Provider nur Bildanalyse kann.
     */
    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        throw new ProviderError(
            "OpenAI Media Provider does not support JSON-only requests. Use analyzeImageJson() instead.",
            this.name,
            "API_ERROR",
            false
        );
    }

    /**
     * Bildanalyse über Media-Provider
     * 
     * Delegiert an die bestehende analyzeImage()-Methode.
     */
    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        options?: AiOptions
    ): Promise<string> {
        // Konvertiere AiOptions zu AnalysisOptions
        const analysisOptions: AnalysisOptions = {
            language: options?.requestContext?.locale || "de",
            context: options?.requestContext?.context,
            // intendedUse wird nicht aus AiOptions übernommen (Media-spezifisch)
        };

        // Rufe bestehende analyzeImage()-Methode auf
        const result: FullAIAnalysisResult = await this.mediaProvider.analyzeImage(
            imageBuffer,
            mimeType,
            analysisOptions
        );

        // Konvertiere FullAIAnalysisResult zu Text
        // (für einfache Text-Returns, z.B. für Debugging)
        return JSON.stringify(result, null, 2);
    }

    /**
     * Bildanalyse mit strukturiertem Ergebnis
     * 
     * Delegiert an die bestehende analyzeImage()-Methode und gibt
     * das strukturierte Ergebnis direkt zurück.
     */
    async analyzeImageJson<T>(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        schema: unknown,
        options?: AiOptions
    ): Promise<T> {
        // Konvertiere AiOptions zu AnalysisOptions
        const analysisOptions: AnalysisOptions = {
            language: options?.requestContext?.locale || "de",
            context: options?.requestContext?.context,
        };

        // Rufe bestehende analyzeImage()-Methode auf
        const result: FullAIAnalysisResult = await this.mediaProvider.analyzeImage(
            imageBuffer,
            mimeType,
            analysisOptions
        );

        // Konvertiere FullAIAnalysisResult zu generischem Typ
        // (Schema wird ignoriert, da Media-Provider bereits strukturiertes Ergebnis liefert)
        return result as unknown as T;
    }

    /**
     * Verfügbarkeitsprüfung
     */
    async isAvailable(): Promise<boolean> {
        const status = await this.mediaProvider.isAvailable();
        return status.available;
    }

    /**
     * Kosten-Schätzung
     * 
     * Konvertiert Media-Provider's estimateCost() zu AiProvider's estimateCost()
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        // Media-Provider hat estimateCost() mit anderen Parametern
        // Wir schätzen basierend auf typischer Bildgröße
        const typicalImageSize = 500000; // 500 KB
        const costEstimate = this.mediaProvider.estimateCost(typicalImageSize, {
            language: options?.requestContext?.locale || "de",
        });

        return costEstimate.costUsd;
    }
}

/**
 * Factory-Funktion: Erstellt Adapter aus bestehendem Media-Provider
 * 
 * @param mediaProvider Bestehender MediaAIProvider
 * @returns Adapter, der AiProvider-Interface implementiert
 */
export function createOpenAIMediaToAiProviderAdapter(
    mediaProvider: MediaAIProvider
): OpenAIMediaToAiProviderAdapter {
    return new OpenAIMediaToAiProviderAdapter(mediaProvider);
}



