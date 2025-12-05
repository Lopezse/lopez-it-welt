/**
 * RAG Knowledge Management API - Enterprise++ Standard
 * 
 * POST /api/rag/knowledge - Neuen Wissens-Eintrag anlegen
 * 
 * @created 2025-11-30
 * @purpose Phase R1.7: RAG-API-Endpoints
 * @status ✅ PRODUKTIONSREIF
 */

import { NextRequest, NextResponse } from "next/server";
import { knowledgeBaseService } from "@/lib/rag/services/KnowledgeBaseService";
import { logger } from "@/lib/logger";
import type { KnowledgeEntryInput } from "@/lib/rag/types";

/**
 * POST /api/rag/knowledge
 * 
 * Erstellt einen neuen Wissens-Eintrag
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, title, content, metadata } = body as KnowledgeEntryInput;

        // Validierung
        if (!category || !title || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: "category, title und content sind erforderlich",
                },
                { status: 400 }
            );
        }

        // Wissens-Eintrag erstellen
        const id = await knowledgeBaseService.create({
            category,
            title,
            content,
            metadata,
        });

        logger.info("Wissens-Eintrag erstellt", { id, category, title });

        return NextResponse.json(
            {
                success: true,
                data: {
                    id,
                    category,
                    title,
                    content,
                    metadata,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Fehler beim Erstellen des Wissens-Eintrags", {
            error: errorMessage,
        });

        return NextResponse.json(
            {
                success: false,
                error: "Fehler beim Erstellen des Wissens-Eintrags",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

