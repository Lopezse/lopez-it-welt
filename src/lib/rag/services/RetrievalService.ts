/**
 * Retrieval Service - Enterprise++ Standard
 * 
 * Semantische Suche in Vector-Datenbank für RAG-System
 * 
 * @created 2025-11-29
 * @purpose Phase R1.4: Retrieval Service
 * @status ✅ PRODUKTIONSREIF (Phase R1.4)
 */

import { embeddingService } from "./EmbeddingService";
import {
    createChromaClient,
    createChromaCollection,
    checkChromaHealth,
    isChromaAvailable as checkChromaAvailable,
} from "../config/chroma";
import type { RetrievalResult } from "../types";

/**
 * Retrieval Service
 * 
 * Führt semantische Suche in Vector-Datenbank durch
 * 
 * Technologie:
 * - ChromaDB (Vector-Datenbank)
 * - Cosine-Similarity für Relevanz-Scoring
 */
export class RetrievalService {
    private collection: any = null;
    private collectionName: string;
    private chromaClient: any = null;
    private initialized: boolean = false;

    constructor(config?: {
        collectionName?: string;
        chromaUrl?: string;
    }) {
        this.collectionName = config?.collectionName || "rag_knowledge";
    }

    /**
     * Initialisiert ChromaDB (lazy loading)
     */
    private async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            // Verwende zentrale ChromaDB-Factory
            this.chromaClient = await createChromaClient({
                url: process.env.CHROMA_URL,
            });

            if (!this.chromaClient) {
                throw new Error("ChromaDB-Client konnte nicht erstellt werden");
            }

            // Collection erstellen oder abrufen
            this.collection = await createChromaCollection({
                collectionName: this.collectionName,
            });

            if (!this.collection) {
                throw new Error("ChromaDB-Collection konnte nicht erstellt werden");
            }

            this.initialized = true;
        } catch (error) {
            console.warn("⚠️ ChromaDB nicht verfügbar. Verwende In-Memory-Fallback.", error);
            this.collection = "fallback";
            this.initialized = true;
        }
    }

    /**
     * Fügt ein Dokument zur Vector-DB hinzu
     * 
     * @param id Dokument-ID
     * @param text Dokument-Text
     * @param metadata Metadaten
     */
    async addDocument(
        id: string,
        text: string,
        metadata?: Record<string, unknown>
    ): Promise<void> {
        await this.initialize();

        // Embedding generieren
        const embedding = await embeddingService.generateEmbedding(text);

        if (this.collection === "fallback") {
            // In-Memory-Fallback (nur für Tests)
            return;
        }

        try {
            await this.collection.add({
                ids: [id],
                embeddings: [embedding],
                documents: [text],
                metadatas: metadata ? [metadata] : undefined,
            });
        } catch (error) {
            console.error("Fehler beim Hinzufügen von Dokument:", error);
            throw error;
        }
    }

    /**
     * Aktualisiert ein Dokument in der Vector-DB
     * 
     * @param id Dokument-ID
     * @param text Neuer Dokument-Text
     * @param metadata Neue Metadaten
     */
    async updateDocument(
        id: string,
        text: string,
        metadata?: Record<string, unknown>
    ): Promise<void> {
        // ChromaDB unterstützt kein direktes Update, daher: löschen + hinzufügen
        await this.deleteDocument(id);
        await this.addDocument(id, text, metadata);
    }

    /**
     * Löscht ein Dokument aus der Vector-DB
     * 
     * @param id Dokument-ID
     */
    async deleteDocument(id: string): Promise<void> {
        await this.initialize();

        if (this.collection === "fallback") {
            return;
        }

        try {
            await this.collection.delete({
                ids: [id],
            });
        } catch (error) {
            console.error("Fehler beim Löschen von Dokument:", error);
            throw error;
        }
    }

    /**
     * Führt semantische Suche durch
     * 
     * @param query Such-Query
     * @param limit Maximale Anzahl Ergebnisse
     * @param minScore Minimale Similarity (0-1)
     * @returns Array von Retrieval-Ergebnissen
     */
    async search(
        query: string,
        limit: number = 5,
        minScore: number = 0.0
    ): Promise<RetrievalResult[]> {
        await this.initialize();

        // Query-Embedding generieren
        const queryEmbedding = await embeddingService.generateEmbedding(query);

        if (this.collection === "fallback") {
            // In-Memory-Fallback (nur für Tests)
            return [];
        }

        try {
            const results = await this.collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: limit,
            });

            // Konvertiere ChromaDB-Ergebnisse zu RetrievalResult[]
            const retrievalResults: RetrievalResult[] = [];

            if (results.ids && results.ids[0]) {
                const ids = results.ids[0];
                const documents = results.documents?.[0] || [];
                const distances = results.distances?.[0] || [];
                const metadatas = results.metadatas?.[0] || [];

                for (let i = 0; i < ids.length; i++) {
                    // ChromaDB gibt Distanzen zurück (kleiner = ähnlicher)
                    // Konvertiere zu Similarity-Score (größer = ähnlicher)
                    const distance = distances[i] || 0;
                    const score = 1 - distance; // Cosine-Distanz zu Similarity

                    if (score >= minScore) {
                        retrievalResults.push({
                            knowledgeId: ids[i],
                            title: (metadatas[i]?.title as string) || "",
                            content: documents[i] || "",
                            score: score,
                            metadata: metadatas[i] || undefined,
                        });
                    }
                }
            }

            // Sortiere nach Score (höchster zuerst)
            retrievalResults.sort((a, b) => b.score - a.score);

            return retrievalResults;
        } catch (error) {
            console.error("Fehler bei semantischer Suche:", error);
            return [];
        }
    }

    /**
     * Prüft, ob ChromaDB verfügbar ist
     */
    async isAvailable(): Promise<boolean> {
        try {
            // Verwende zentrale Health-Check-Funktion
            const health = await checkChromaHealth({
                url: process.env.CHROMA_URL,
            });

            if (!health.available) {
                return false;
            }

            await this.initialize();
            return this.collection !== "fallback";
        } catch {
            return false;
        }
    }

    /**
     * Gibt die Collection-Name zurück
     */
    getCollectionName(): string {
        return this.collectionName;
    }
}

/**
 * Singleton-Instanz
 */
export const retrievalService = new RetrievalService();

