/**
 * Media AI Service - Enterprise++ Standard
 * 
 * Orchestrator für alle KI-Services
 * Koordiniert die Analyse und kombiniert Ergebnisse
 */

import type {
    FullAIAnalysisResult,
    SmartSearchParams,
    SmartSearchResult,
} from "./types";
import { readMediaMetaById, getMediaPathFromId } from "@/lib/media/linkedin-media";
import { readFile } from "fs/promises";
import { asyncProcessor } from "./async-processor";
import { getProvider } from "./provider-factory";
import type { AnalysisOptions as ProviderAnalysisOptions } from "./providers/types";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import { logger } from "@/lib/logger";

/**
 * Haupt-Service für KI-Analysen
 */
export class MediaAIService {
    /**
     * Führt eine vollständige KI-Analyse durch
     * 
     * @param mediaId Media-ID des zu analysierenden Mediums
     * @param options Optionale Parameter (intendedUse, context, etc.)
     * @returns Vollständiges Analyse-Ergebnis
     */
    async analyzeMedia(
        mediaId: string,
        options?: {
            intendedUse?: "hero" | "thumbnail" | "card";
            context?: string;
            language?: string;
            userId?: string; // DSGVO: User-ID für Consent-Prüfung
        }
    ): Promise<FullAIAnalysisResult> {
        // DSGVO: Prüfe KI-Verarbeitungsberechtigung
        if (options?.userId) {
            const decision = await dsgvoDecisionEngine.getAIProcessingPermission({
                userId: options.userId,
                purpose: "media_ki",
                mediaId,
                context: {
                    has_person: options.context?.includes("person") || false,
                    intendedUse: options.intendedUse
                }
            });

            if (!decision.allowed) {
                logger.warn(`KI-Verarbeitung blockiert für Media ${mediaId}: ${decision.reason}`, {
                    userId: options.userId,
                    blockers: decision.blockers,
                    risk: decision.risk
                });
                throw new Error(`DSGVO-Blocker: ${decision.reason}`);
            }
        }

        // Lade Medium
        const meta = await readMediaMetaById(mediaId);
        if (!meta) {
            throw new Error(`Medium ${mediaId} nicht gefunden`);
        }

        // Lade Bild-Daten
        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            throw new Error(`Datei für Medium ${mediaId} nicht gefunden`);
        }

        const imageBuffer = await readFile(pathInfo.filePath);

        // Hole Provider
        const provider = getProvider();

        // Konvertiere Options
        const providerOptions: ProviderAnalysisOptions = {
            intendedUse: options?.intendedUse,
            context: options?.context,
            language: options?.language || "de",
        };

        // Führe Analyse über Provider durch
        const result = await provider.analyzeImage(imageBuffer, meta.mime, providerOptions);

        // Berechne Similarity-Hash (für Dublettenerkennung)
        // TODO: Später durch echten Perceptual Hash-Algorithmus ersetzen
        const { similarityService } = await import("./services/SimilarityService");
        const similarityHash = await similarityService.calculateSimilarityHash(imageBuffer);
        
        // Similarity-Hash zum Result hinzufügen (wird in saveAnalysisResults gespeichert)
        // Aktuell wird Similarity-Hash separat berechnet und gespeichert

        return result;
    }

    /**
     * Batch-Analyse für mehrere Medien
     * 
     * @param mediaIds Array von Media-IDs
     * @param options Optionale Parameter
     * @returns Array von Analyse-Ergebnissen
     */
    async analyzeBatch(
        mediaIds: string[],
        options?: {
            intendedUse?: "hero" | "thumbnail" | "card";
            context?: string;
            language?: string;
        }
    ): Promise<Array<{ media_id: string; result: FullAIAnalysisResult | null; error?: string }>> {
        const results = await Promise.allSettled(
            mediaIds.map(async (mediaId) => {
                try {
                    const result = await this.analyzeMedia(mediaId, options);
                    return { media_id: mediaId, result };
                } catch (error) {
                    return {
                        media_id: mediaId,
                        result: null,
                        error: error instanceof Error ? error.message : "Unbekannter Fehler",
                    };
                }
            })
        );

        return results.map((r) => {
            if (r.status === "fulfilled") {
                return r.value;
            } else {
                return {
                    media_id: "unknown",
                    result: null,
                    error: r.reason?.message || "Unbekannter Fehler",
                };
            }
        });
    }

    /**
     * Smart Search - semantische Suche nach Medien
     * 
     * @param params Such-Parameter
     * @returns Array von relevanten Medien
     */
    async smartSearch(params: SmartSearchParams): Promise<SmartSearchResult[]> {
        // Mock-Implementierung (später durch echte semantische Suche ersetzt)
        // In der echten Implementierung: z.B. OpenAI Embeddings, Vector-DB, etc.

        // TODO: Implementiere echte semantische Suche
        // Aktuell: Mock-Rückgabe
        return [
            {
                media_id: "mock1234567890abcd",
                relevance_score: 0.85,
                matched_tags: ["laptop", "dashboard"],
                matched_description: "Screenshot mit Dashboard",
            },
        ];
    }

    /**
     * Findet ähnliche Medien
     * 
     * @param mediaId Media-ID
     * @param limit Maximale Anzahl
     * @returns Array von ähnlichen Medien
     */
    async findSimilar(mediaId: string, limit: number = 5) {
        const { similarityService } = await import("./services/SimilarityService");
        return similarityService.findSimilar(mediaId, limit);
    }

    /**
     * Fügt ein Medium zur Async-Processing-Queue hinzu
     * 
     * @param mediaId Media-ID
     */
    async queueAnalysis(mediaId: string): Promise<void> {
        await asyncProcessor.queueAnalysis(mediaId);
    }
}

// Singleton-Instanz
export const mediaAIService = new MediaAIService();


