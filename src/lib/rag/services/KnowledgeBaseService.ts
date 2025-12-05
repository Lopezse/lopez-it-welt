/**
 * Knowledge Base Service - Enterprise++ Standard
 * 
 * Wissens-Verwaltung für RAG-System
 * 
 * @created 2025-11-29
 * @purpose Phase R1.2: Knowledge Base Service
 * @status ✅ PRODUKTIONSREIF (Phase R1.2)
 */

import { getConnection } from "@/lib/database";
import { UUIDService } from "@/lib/uuid-service";
import type {
    KnowledgeEntry,
    KnowledgeEntryInput,
    KnowledgeCategory,
    KnowledgeCategoryInput,
    KnowledgeEmbedding,
} from "../types";

/**
 * Knowledge Base Service
 * 
 * Verwaltet Wissens-Einträge, Kategorien und Metadaten
 */
export class KnowledgeBaseService {
    /**
     * Erstellt einen neuen Wissens-Eintrag
     */
    async create(knowledge: KnowledgeEntryInput): Promise<string> {
        const id = UUIDService.generate();
        const connection = await getConnection();

        await connection.execute(
            `INSERT INTO knowledge_base (id, category, title, content, metadata)
             VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                knowledge.category,
                knowledge.title,
                knowledge.content,
                knowledge.metadata ? JSON.stringify(knowledge.metadata) : null,
            ]
        );

        return id;
    }

    /**
     * Liest einen Wissens-Eintrag
     */
    async read(id: string): Promise<KnowledgeEntry | null> {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, category, title, content, metadata, embedding_id, created_at, updated_at
             FROM knowledge_base
             WHERE id = ?`,
            [id]
        ) as any[];

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return {
            id: row.id,
            category: row.category,
            title: row.title,
            content: row.content,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            embeddingId: row.embedding_id || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    /**
     * Aktualisiert einen Wissens-Eintrag
     */
    async update(id: string, knowledge: Partial<KnowledgeEntryInput>): Promise<void> {
        const connection = await getConnection();
        const updates: string[] = [];
        const values: any[] = [];

        if (knowledge.category !== undefined) {
            updates.push("category = ?");
            values.push(knowledge.category);
        }
        if (knowledge.title !== undefined) {
            updates.push("title = ?");
            values.push(knowledge.title);
        }
        if (knowledge.content !== undefined) {
            updates.push("content = ?");
            values.push(knowledge.content);
        }
        if (knowledge.metadata !== undefined) {
            updates.push("metadata = ?");
            values.push(JSON.stringify(knowledge.metadata));
        }

        if (updates.length === 0) {
            return; // Keine Updates
        }

        values.push(id);
        await connection.execute(
            `UPDATE knowledge_base
             SET ${updates.join(", ")}
             WHERE id = ?`,
            values
        );
    }

    /**
     * Löscht einen Wissens-Eintrag
     */
    async delete(id: string): Promise<void> {
        const connection = await getConnection();
        await connection.execute(
            `DELETE FROM knowledge_base WHERE id = ?`,
            [id]
        );
    }

    /**
     * Listet alle Wissens-Einträge (optional gefiltert nach Kategorie)
     */
    async list(category?: string): Promise<KnowledgeEntry[]> {
        const connection = await getConnection();
        let query = `SELECT id, category, title, content, metadata, embedding_id, created_at, updated_at
                     FROM knowledge_base`;
        const params: any[] = [];

        if (category) {
            query += " WHERE category = ?";
            params.push(category);
        }

        query += " ORDER BY created_at DESC";

        const [rows] = await connection.execute(query, params) as any[];

        return rows.map((row: any) => ({
            id: row.id,
            category: row.category,
            title: row.title,
            content: row.content,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            embeddingId: row.embedding_id || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    }

    /**
     * Sucht nach Wissens-Einträgen (einfache Text-Suche)
     */
    async search(query: string, limit: number = 10): Promise<KnowledgeEntry[]> {
        const connection = await getConnection();
        const searchTerm = `%${query}%`;

        const [rows] = await connection.execute(
            `SELECT id, category, title, content, metadata, embedding_id, created_at, updated_at
             FROM knowledge_base
             WHERE title LIKE ? OR content LIKE ?
             ORDER BY created_at DESC
             LIMIT ?`,
            [searchTerm, searchTerm, limit]
        ) as any[];

        return rows.map((row: any) => ({
            id: row.id,
            category: row.category,
            title: row.title,
            content: row.content,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            embeddingId: row.embedding_id || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    }

    /**
     * Erstellt eine neue Kategorie
     */
    async createCategory(category: KnowledgeCategoryInput): Promise<string> {
        const id = UUIDService.generate();
        const connection = await getConnection();

        await connection.execute(
            `INSERT INTO knowledge_categories (id, name, description, parent_id)
             VALUES (?, ?, ?, ?)`,
            [id, category.name, category.description || null, category.parentId || null]
        );

        return id;
    }

    /**
     * Liest eine Kategorie
     */
    async readCategory(id: string): Promise<KnowledgeCategory | null> {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, name, description, parent_id, created_at, updated_at
             FROM knowledge_categories
             WHERE id = ?`,
            [id]
        ) as any[];

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            parentId: row.parent_id || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    /**
     * Listet alle Kategorien
     */
    async listCategories(): Promise<KnowledgeCategory[]> {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, name, description, parent_id, created_at, updated_at
             FROM knowledge_categories
             ORDER BY name ASC`
        ) as any[];

        return rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            parentId: row.parent_id || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    }

    /**
     * Verknüpft einen Embedding mit einem Wissens-Eintrag
     */
    async linkEmbedding(
        knowledgeId: string,
        embeddingId: string,
        vectorDbId: string,
        embeddingModel: string = "all-MiniLM-L6-v2",
        embeddingDimension: number = 384
    ): Promise<string> {
        const id = UUIDService.generate();
        const connection = await getConnection();

        // Embedding-Eintrag erstellen
        await connection.execute(
            `INSERT INTO knowledge_embeddings (id, knowledge_id, vector_db_id, embedding_model, embedding_dimension)
             VALUES (?, ?, ?, ?, ?)`,
            [id, knowledgeId, vectorDbId, embeddingModel, embeddingDimension]
        );

        // Embedding-ID in knowledge_base aktualisieren
        await connection.execute(
            `UPDATE knowledge_base SET embedding_id = ? WHERE id = ?`,
            [id, knowledgeId]
        );

        return id;
    }

    /**
     * Liest Embedding-Informationen
     */
    async readEmbedding(knowledgeId: string): Promise<KnowledgeEmbedding | null> {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, knowledge_id, vector_db_id, embedding_model, embedding_dimension, created_at
             FROM knowledge_embeddings
             WHERE knowledge_id = ?`,
            [knowledgeId]
        ) as any[];

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return {
            id: row.id,
            knowledgeId: row.knowledge_id,
            vectorDbId: row.vector_db_id || undefined,
            embeddingModel: row.embedding_model,
            embeddingDimension: row.embedding_dimension,
            createdAt: row.created_at,
        };
    }
}

/**
 * Singleton-Instanz
 */
export const knowledgeBaseService = new KnowledgeBaseService();

