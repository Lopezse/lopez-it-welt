/**
 * RAG Knowledge Management API - Enterprise++ Standard
 * 
 * GET /api/rag/knowledge/[id] - Eintrag abrufen
 * PUT /api/rag/knowledge/[id] - Eintrag aktualisieren
 * DELETE /api/rag/knowledge/[id] - Eintrag löschen
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
 * GET /api/rag/knowledge/[id]
 * 
 * Ruft einen Wissens-Eintrag ab
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ID ist erforderlich",
                },
                { status: 400 }
            );
        }

        // Wissens-Eintrag abrufen
        const entry = await knowledgeBaseService.read(id);

        if (!entry) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Wissens-Eintrag nicht gefunden",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: entry,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Fehler beim Abrufen des Wissens-Eintrags", {
            error: errorMessage,
            id: params.id,
        });

        return NextResponse.json(
            {
                success: false,
                error: "Fehler beim Abrufen des Wissens-Eintrags",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/rag/knowledge/[id]
 * 
 * Aktualisiert einen Wissens-Eintrag
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { category, title, content, metadata } = body as Partial<KnowledgeEntryInput>;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ID ist erforderlich",
                },
                { status: 400 }
            );
        }

        // Prüfen ob Eintrag existiert
        const existingEntry = await knowledgeBaseService.read(id);
        if (!existingEntry) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Wissens-Eintrag nicht gefunden",
                },
                { status: 404 }
            );
        }

        // Wissens-Eintrag aktualisieren
        await knowledgeBaseService.update(id, {
            category,
            title,
            content,
            metadata,
        });

        logger.info("Wissens-Eintrag aktualisiert", { id });

        // Aktualisierten Eintrag abrufen
        const updatedEntry = await knowledgeBaseService.read(id);

        return NextResponse.json({
            success: true,
            data: updatedEntry,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Fehler beim Aktualisieren des Wissens-Eintrags", {
            error: errorMessage,
            id: params.id,
        });

        return NextResponse.json(
            {
                success: false,
                error: "Fehler beim Aktualisieren des Wissens-Eintrags",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/rag/knowledge/[id]
 * 
 * Löscht einen Wissens-Eintrag
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ID ist erforderlich",
                },
                { status: 400 }
            );
        }

        // Prüfen ob Eintrag existiert
        const existingEntry = await knowledgeBaseService.read(id);
        if (!existingEntry) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Wissens-Eintrag nicht gefunden",
                },
                { status: 404 }
            );
        }

        // Wissens-Eintrag löschen
        await knowledgeBaseService.delete(id);

        logger.info("Wissens-Eintrag gelöscht", { id });

        return NextResponse.json({
            success: true,
            message: "Wissens-Eintrag erfolgreich gelöscht",
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Fehler beim Löschen des Wissens-Eintrags", {
            error: errorMessage,
            id: params.id,
        });

        return NextResponse.json(
            {
                success: false,
                error: "Fehler beim Löschen des Wissens-Eintrags",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}



