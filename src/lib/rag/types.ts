/**
 * RAG Types - Enterprise++ Standard
 * 
 * TypeScript Interfaces für RAG-System
 * 
 * @created 2025-11-29
 * @purpose Phase R1: RAG-System Types
 */

/**
 * Wissens-Eintrag
 */
export interface KnowledgeEntry {
    id: string;
    category: string;
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
    embeddingId?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Knowledge Entry Input (für Create/Update)
 */
export interface KnowledgeEntryInput {
    category: string;
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
}

/**
 * Knowledge Category
 */
export interface KnowledgeCategory {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Knowledge Category Input
 */
export interface KnowledgeCategoryInput {
    name: string;
    description?: string;
    parentId?: string;
}

/**
 * Knowledge Embedding
 */
export interface KnowledgeEmbedding {
    id: string;
    knowledgeId: string;
    vectorDbId?: string;
    embeddingModel: string;
    embeddingDimension: number;
    createdAt: Date;
}

/**
 * Retrieval Result
 */
export interface RetrievalResult {
    knowledgeId: string;
    title: string;
    content: string;
    score: number; // Similarity-Score (0-1)
    metadata?: Record<string, unknown>;
}

/**
 * RAG Options
 */
export interface RAGOptions {
    maxResults?: number; // Maximale Anzahl Retrieval-Ergebnisse
    minScore?: number; // Minimale Similarity (0-1)
    category?: string; // Filter nach Kategorie
    includeMetadata?: boolean; // Metadaten inkludieren
    userId?: string; // User-ID für DSGVO-Prüfung
    locale?: string; // Sprache (de, en, es)
    maxTokens?: number; // Maximale Tokens für Generation
    temperature?: number; // Temperatur für Generation
}

/**
 * RAG Response
 */
export interface RAGResponse {
    answer: string;
    sources: RetrievalResult[];
    context: string; // Vollständiger Kontext für Generation
    metadata?: {
        query: string;
        retrievalCount: number;
        generationTime?: number;
        retrievalTime?: number;
    };
}

/**
 * Generation Options
 */
export interface GenerationOptions {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
}

