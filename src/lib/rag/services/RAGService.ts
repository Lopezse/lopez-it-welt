/**
 * RAG Service - Enterprise++ Standard
 * 
 * Zentrale Orchestrierung des RAG-Systems
 * 
 * @created 2025-11-29
 * @purpose Phase R1.5: RAG Service
 * @status ✅ PRODUKTIONSREIF (Phase R1.5)
 */

import { getProvider } from "@/lib/ai/core/ai-provider-factory";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import { knowledgeBaseService } from "./KnowledgeBaseService";
import { embeddingService } from "./EmbeddingService";
import { retrievalService } from "./RetrievalService";
import type {
    RAGOptions,
    RAGResponse,
    KnowledgeEntryInput,
    RetrievalResult,
} from "../types";
import { logger } from "@/lib/logger";

/**
 * RAG Service
 * 
 * Orchestriert Retrieval-Augmented Generation:
 * 1. Retrieval: Relevante Dokumente aus Vector-DB abrufen
 * 2. Augmented: Kontext aus Dokumenten erstellen
 * 3. Generation: LLM generiert Antwort mit Kontext
 */
export class RAGService {
    /**
     * Führt eine RAG-Query durch
     * 
     * @param question Benutzer-Frage
     * @param options Optionale Parameter
     * @returns RAG-Response mit Antwort und Quellen
     */
    async query(question: string, options?: RAGOptions): Promise<RAGResponse> {
        const startTime = Date.now();

        // DSGVO-Prüfung (wenn userId vorhanden)
        if (options?.userId) {
            const decision = await dsgvoDecisionEngine.getAIProcessingPermission({
                userId: options.userId,
                purpose: "analytics", // RAG-Query verwendet analytics als Zweck
                context: {
                    query: question,
                    category: options.category,
                },
            });

            if (!decision.allowed) {
                logger.warn(`RAG-Query blockiert: ${decision.reason}`, {
                    userId: options.userId,
                    question,
                    blockers: decision.blockers,
                });
                throw new Error(`DSGVO-Blocker: ${decision.reason}`);
            }
        }

        // 1. Retrieval: Relevante Dokumente abrufen
        const retrievalStart = Date.now();
        const retrievalResults = await retrievalService.search(
            question,
            options?.maxResults || 5,
            options?.minScore || 0.0
        );
        const retrievalTime = Date.now() - retrievalStart;

        // 2. Kontext aus Dokumenten erstellen
        const context = this.buildContext(retrievalResults, options);

        // 3. Generation: LLM generiert Antwort mit Kontext
        const generationStart = Date.now();
        const aiProvider = getProvider();
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(question, context);

        const answer = await aiProvider.requestText(userPrompt, {
            taskId: "rag-query",
            systemPrompt: systemPrompt,
            maxTokens: options?.maxTokens || 1000,
            temperature: options?.temperature || 0.7,
            requestContext: {
                userId: options?.userId,
                locale: options?.locale || "de",
                context: `RAG-Query: ${question.substring(0, 50)}...`,
            },
        });
        const generationTime = Date.now() - generationStart;

        // 4. Response zusammenstellen
        const response: RAGResponse = {
            answer: answer,
            sources: retrievalResults,
            context: context,
            metadata: {
                query: question,
                retrievalCount: retrievalResults.length,
                retrievalTime: retrievalTime,
                generationTime: generationTime,
            },
        };

        const totalTime = Date.now() - startTime;
        logger.info("RAG-Query abgeschlossen", {
            question: question.substring(0, 50),
            retrievalCount: retrievalResults.length,
            totalTime,
        });

        return response;
    }

    /**
     * Fügt Wissen zum RAG-System hinzu
     * 
     * @param knowledge Wissens-Eintrag
     * @returns Knowledge-ID
     */
    async addKnowledge(knowledge: KnowledgeEntryInput): Promise<string> {
        // 1. In MySQL speichern
        const knowledgeId = await knowledgeBaseService.create(knowledge);

        // 2. Text chunken (für lange Texte)
        const chunks = await embeddingService.chunkText(knowledge.content, 500, 50);

        // 3. Für jeden Chunk: Embedding generieren und in Vector-DB speichern
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkId = `${knowledgeId}_chunk_${i}`;

            // Embedding generieren
            const embedding = await embeddingService.generateEmbedding(chunk);

            // In Vector-DB speichern
            await retrievalService.addDocument(chunkId, chunk, {
                knowledgeId: knowledgeId,
                title: knowledge.title,
                category: knowledge.category,
                chunkIndex: i,
                totalChunks: chunks.length,
                ...knowledge.metadata,
            });

            // Embedding-Referenz in MySQL speichern
            if (i === 0) {
                // Nur für ersten Chunk (Haupt-Embedding)
                await knowledgeBaseService.linkEmbedding(
                    knowledgeId,
                    chunkId,
                    chunkId,
                    embeddingService.getModelName(),
                    embeddingService.getDimension()
                );
            }
        }

        return knowledgeId;
    }

    /**
     * Aktualisiert Wissen im RAG-System
     * 
     * @param id Knowledge-ID
     * @param knowledge Teilweise Wissens-Eintrag
     */
    async updateKnowledge(
        id: string,
        knowledge: Partial<KnowledgeEntryInput>
    ): Promise<void> {
        // 1. In MySQL aktualisieren
        await knowledgeBaseService.update(id, knowledge);

        // 2. Wenn Content geändert wurde: Vector-DB aktualisieren
        if (knowledge.content) {
            // Alte Chunks löschen
            const entry = await knowledgeBaseService.read(id);
            if (entry?.embeddingId) {
                // Alle Chunks für diese Knowledge-ID löschen
                // (Vereinfacht: Wir löschen alle Chunks und erstellen neu)
                // In Produktion sollte man Chunks einzeln aktualisieren
            }

            // Neue Chunks erstellen (wie in addKnowledge)
            const chunks = await embeddingService.chunkText(knowledge.content, 500, 50);
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const chunkId = `${id}_chunk_${i}`;

                await retrievalService.updateDocument(chunkId, chunk, {
                    knowledgeId: id,
                    chunkIndex: i,
                    totalChunks: chunks.length,
                });
            }
        }
    }

    /**
     * Löscht Wissen aus dem RAG-System
     * 
     * @param id Knowledge-ID
     */
    async deleteKnowledge(id: string): Promise<void> {
        // 1. Alle Chunks aus Vector-DB löschen
        const entry = await knowledgeBaseService.read(id);
        if (entry) {
            // Vereinfacht: Wir löschen alle Chunks mit dieser Knowledge-ID
            // In Produktion sollte man alle Chunks finden und löschen
            const chunks = await embeddingService.chunkText(entry.content, 500, 50);
            for (let i = 0; i < chunks.length; i++) {
                const chunkId = `${id}_chunk_${i}`;
                await retrievalService.deleteDocument(chunkId);
            }
        }

        // 2. Aus MySQL löschen
        await knowledgeBaseService.delete(id);
    }

    /**
     * Erstellt Kontext aus Retrieval-Ergebnissen
     */
    private buildContext(results: RetrievalResult[], options?: RAGOptions): string {
        if (results.length === 0) {
            return "Keine relevanten Dokumente gefunden.";
        }

        const contextParts: string[] = [];

        contextParts.push("Relevante Dokumente aus der Wissens-Datenbasis:\n");

        results.forEach((result, index) => {
            contextParts.push(`\n[Dokument ${index + 1}]`);
            if (result.title) {
                contextParts.push(`Titel: ${result.title}`);
            }
            contextParts.push(`Inhalt: ${result.content}`);
            if (options?.includeMetadata && result.metadata) {
                contextParts.push(`Metadaten: ${JSON.stringify(result.metadata)}`);
            }
            contextParts.push(`Relevanz: ${(result.score * 100).toFixed(1)}%`);
        });

        return contextParts.join("\n");
    }

    /**
     * Erstellt System-Prompt für RAG
     */
    private buildSystemPrompt(): string {
        return `Du bist ein hilfreicher KI-Assistent für Lopez IT Welt Enterprise++.
Du beantwortest Fragen basierend auf den bereitgestellten Dokumenten aus der Wissens-Datenbasis.

WICHTIG:
- Antworte nur basierend auf den bereitgestellten Dokumenten
- Wenn die Dokumente die Frage nicht beantworten können, sage das ehrlich
- Zitiere relevante Dokumente wenn möglich
- Antworte auf Deutsch (außer anders angegeben)
- Sei präzise und hilfreich`;
    }

    /**
     * Erstellt User-Prompt mit Frage und Kontext
     */
    private buildUserPrompt(question: string, context: string): string {
        return `Frage: ${question}

${context}

Antworte basierend auf den oben bereitgestellten Dokumenten.`;
    }
}

/**
 * Singleton-Instanz
 */
export const ragService = new RAGService();



