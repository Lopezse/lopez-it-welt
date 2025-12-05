/**
 * Async-Processor für KI-Analysen - Enterprise++ Standard
 * 
 * Verarbeitet Medien mit ai_status = 'pending' im Hintergrund
 * 
 * @created 2025-01-27
 * @purpose Phase 3.1: Async-Processing
 */

import { executeQueryPool } from "@/lib/db";
import { mediaAIService } from "./MediaAIService";
import { costTracker } from "./cost-tracker";
import type { AnalysisOptions } from "./providers/types";
import { readMediaMetaById, writeMediaMeta, getMediaPathFromId } from "@/lib/media/linkedin-media";
import type { FullAIAnalysisResult } from "./types";
import { getProvider } from "./provider-factory";

/**
 * Konfiguration für Async-Processing
 */
export interface AsyncProcessorConfig {
    maxBatchSize: number; // Maximale Anzahl Medien pro Batch
    maxRetries: number; // Maximale Anzahl Retry-Versuche
    retryDelayMs: number; // Verzögerung zwischen Retries in Millisekunden
}

/**
 * Standard-Konfiguration
 */
const DEFAULT_CONFIG: AsyncProcessorConfig = {
    maxBatchSize: parseInt(process.env.MEDIA_AI_ASYNC_BATCH_SIZE || "10"),
    maxRetries: parseInt(process.env.MEDIA_AI_MAX_RETRIES || "3"),
    retryDelayMs: parseInt(process.env.MEDIA_AI_RETRY_DELAY_MS || "5000"),
};

/**
 * Async-Processor-Service
 */
export class AsyncProcessor {
    private config: AsyncProcessorConfig;

    constructor(config: AsyncProcessorConfig = DEFAULT_CONFIG) {
        this.config = config;
    }

    /**
     * Holt Medien mit ai_status = 'pending' und verarbeitet sie
     * 
     * @param options Optionale Analyse-Parameter
     * @returns Anzahl verarbeiteter Medien
     */
    async processPendingAnalyses(options?: AnalysisOptions): Promise<number> {
        // Hole pending Medien
        const pendingMedia = await this.getPendingMedia();

        if (pendingMedia.length === 0) {
            return 0;
        }

        let processed = 0;

        // Verarbeite Medien (max. maxBatchSize)
        const batch = pendingMedia.slice(0, this.config.maxBatchSize);

        // Hole Provider für Kosten-Schätzung
        const provider = getProvider();

        for (const media of batch) {
            try {
                // Setze Status auf 'running'
                await this.setAIStatus(media.media_hash_id, "running", null);

                // Lade Medium für Kosten-Schätzung
                const meta = await readMediaMetaById(media.media_hash_id);
                if (!meta) {
                    throw new Error(`Medium ${media.media_hash_id} nicht gefunden`);
                }

                // Schätze Kosten über Provider
                const costEstimate = provider.estimateCost(meta.size, options);
                const estimatedCost = costEstimate.costUsd;

                // Prüfe Kosten-Limit
                const costStatus = await costTracker.checkLimit(estimatedCost);

                if (!costStatus.allowed) {
                    throw new Error(`Kosten-Limit überschritten: ${costStatus.reason}`);
                }

                // Führe Analyse durch
                const result = await mediaAIService.analyzeMedia(media.media_hash_id, options);

                // Ergebnisse in meta.json speichern
                await this.saveAnalysisResults(media.media_hash_id, result);

                // Kosten aufzeichnen
                await costTracker.recordCost({
                    provider: provider.getName(),
                    operation: "analyze",
                    costUsd: estimatedCost,
                    tokensUsed: costEstimate.tokensUsed,
                    mediaId: media.media_hash_id,
                    imagesProcessed: 1,
                });

                // Setze Status auf 'done'
                await this.setAIStatus(media.media_hash_id, "done", null);

                processed++;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
                
                // WICHTIG: Keine Secrets oder sensible Daten loggen!
                // Nur Fehlermeldung ohne interne Details
                const safeErrorMessage = errorMessage
                    .replace(/sk-[a-zA-Z0-9]+/g, "sk-***masked***")
                    .replace(/api[_-]?key/gi, "***masked***");
                
                console.error(`❌ Fehler bei Analyse von ${media.media_hash_id}:`, safeErrorMessage);

                // Prüfe Retry-Count
                const retryCount = (media.ai_retry_count || 0) + 1;

                if (retryCount < this.config.maxRetries) {
                    // Retry möglich - setze zurück auf 'pending' mit erhöhtem Retry-Count
                    await this.setAIStatus(
                        media.media_hash_id,
                        "pending",
                        safeErrorMessage,
                        retryCount
                    );
                } else {
                    // Max. Retries erreicht - setze auf 'error'
                    await this.setAIStatus(media.media_hash_id, "error", safeErrorMessage, retryCount);
                }
            }
        }

        return processed;
    }

    /**
     * Holt Medien mit ai_status = 'pending'
     * 
     * @returns Array von pending Medien
     */
    private async getPendingMedia(): Promise<Array<{
        id: string;
        media_hash_id: string;
        ai_retry_count: number | null;
    }>> {
        try {
            const sql = `
                SELECT id, media_hash_id, ai_retry_count
                FROM lopez_business_media
                WHERE ai_status = 'pending'
                AND (ai_retry_count IS NULL OR ai_retry_count < ?)
                ORDER BY created_at ASC
                LIMIT ?
            `;

            const result = await executeQueryPool<Array<{
                id: string;
                media_hash_id: string;
                ai_retry_count: number | null;
            }>>(sql, [this.config.maxRetries, this.config.maxBatchSize]);

            return result;
        } catch (error) {
            console.error("❌ Fehler beim Abrufen von pending Medien:", error);
            return [];
        }
    }

    /**
     * Setzt den AI-Status eines Mediums
     * 
     * @param mediaHashId Media-Hash-ID
     * @param status Neuer Status
     * @param errorMessage Fehlermeldung (optional)
     * @param retryCount Retry-Count (optional)
     */
    private async setAIStatus(
        mediaHashId: string,
        status: "pending" | "running" | "done" | "error",
        errorMessage: string | null,
        retryCount?: number
    ): Promise<void> {
        try {
            const updates: string[] = ["ai_status = ?"];
            const params: any[] = [status];

            if (errorMessage !== null) {
                updates.push("ai_error_message = ?");
                params.push(errorMessage);
            }

            if (retryCount !== undefined) {
                updates.push("ai_retry_count = ?");
                updates.push("ai_last_retry_at = NOW()");
                params.push(retryCount);
            }

            if (status === "done") {
                updates.push("ai_analyzed_at = NOW()");
            }

            const sql = `
                UPDATE lopez_business_media
                SET ${updates.join(", ")}
                WHERE media_hash_id = ?
            `;

            params.push(mediaHashId);

            await executeQueryPool(sql, params);
        } catch (error) {
            console.error(`❌ Fehler beim Setzen des AI-Status für ${mediaHashId}:`, error);
            throw error;
        }
    }

    /**
     * Setzt ein Medium auf 'pending' (für manuelle Neu-Analyse)
     * 
     * @param mediaHashId Media-Hash-ID
     */
    async queueAnalysis(mediaHashId: string): Promise<void> {
        await this.setAIStatus(mediaHashId, "pending", null, 0);
    }

    /**
     * Speichert Analyse-Ergebnisse in meta.json
     * 
     * @param mediaHashId Media-Hash-ID
     * @param result Analyse-Ergebnis
     */
    private async saveAnalysisResults(
        mediaHashId: string,
        result: FullAIAnalysisResult
    ): Promise<void> {
        try {
            const meta = await readMediaMetaById(mediaHashId);
            if (!meta) {
                throw new Error(`Medium ${mediaHashId} nicht gefunden`);
            }

            const pathInfo = await getMediaPathFromId(mediaHashId);
            if (!pathInfo) {
                throw new Error(`Datei-Pfad für ${mediaHashId} nicht gefunden`);
            }

            // AI-Felder aktualisieren
            if (!meta.ai) {
                meta.ai = {};
            }

            // Tags
            if (result.tags) {
                meta.ai.tags = result.tags.tags;
                meta.ai.ai_metadata = {
                    ...meta.ai.ai_metadata,
                    analyzed_at: result.analyzed_at,
                    model_version: result.model_version,
                    confidence_scores: result.tags.confidence_scores,
                };
            }

            // Alt-Text
            if (result.alt_text) {
                meta.ai.description_ai = result.alt_text.description;
            }

            // Quality
            if (result.quality) {
                meta.ai.quality_score = result.quality.score;
                meta.ai.quality_warnings = result.quality.warnings;
            }

            // Category
            if (result.category) {
                meta.ai.category_suggestion = result.category.category;
            }

            // CI-Compliance
            if (result.ci_compliance) {
                meta.ai.ci_compliance = {
                    logo_detected: result.ci_compliance.logo_detected,
                    color_deviation: result.ci_compliance.color_deviation,
                    warnings: result.ci_compliance.warnings,
                };
            }

            // Person-Detection (DSGVO)
            if (result.person_detection) {
                meta.ai.has_person = result.person_detection.has_person;
                // WICHTIG: dsgvo_approved_by_admin bleibt false - Admin muss explizit freigeben
            }

            // Similarity-Hash berechnen und speichern (für Dublettenerkennung)
            const { similarityService } = await import("./services/SimilarityService");
            const imageBuffer = await (await import("fs/promises")).readFile(pathInfo.filePath);
            const similarityHash = await similarityService.calculateSimilarityHash(imageBuffer);
            meta.ai.similarity_hash = similarityHash;

            // Meta.json speichern
            const fs = await import("fs/promises");
            const fileSize = (await fs.stat(pathInfo.filePath)).size;
            await writeMediaMeta(pathInfo.folderPath, meta, fileSize);
        } catch (error) {
            console.error(`❌ Fehler beim Speichern der Analyse-Ergebnisse für ${mediaHashId}:`, error);
            throw error;
        }
    }
}

/**
 * Singleton-Instanz
 */
export const asyncProcessor = new AsyncProcessor();

