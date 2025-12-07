/**
 * RAG Query API - Enterprise++ Standard
 * 
 * POST /api/rag/query - RAG-Anfrage (Frage rein, Antwort + Quellen raus)
 * 
 * @created 2025-11-30
 * @purpose Phase R1.7: RAG-API-Endpoints
 * @status ✅ PRODUKTIONSREIF
 */

import { NextRequest, NextResponse } from "next/server";
import { ragService } from "@/lib/rag/services/RAGService";
import { logger } from "@/lib/logger";
import type { RAGOptions } from "@/lib/rag/types";

/**
 * Request Body für RAG-Query
 */
interface RAGQueryRequest {
    question: string;
    options?: RAGOptions;
}

/**
 * POST /api/rag/query
 * 
 * Führt eine RAG-Anfrage durch
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as RAGQueryRequest;
        const { question, options } = body;

        // Validierung
        if (!question || typeof question !== "string" || question.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "question ist erforderlich und muss ein nicht-leerer String sein",
                },
                { status: 400 }
            );
        }

        // RAG-Query durchführen
        const response = await ragService.query(question.trim(), options);

        logger.info("RAG-Query erfolgreich", {
            question: question.substring(0, 50),
            sourcesCount: response.sources.length,
            processingTime: (response.metadata as Record<string, unknown>)?.processingTime,
        });

        return NextResponse.json({
            success: true,
            data: response,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // DSGVO-Blocker erkennen
        if (errorMessage.includes("DSGVO-Blocker")) {
            logger.warn("RAG-Query blockiert (DSGVO)", {
                error: errorMessage,
            });

            return NextResponse.json(
                {
                    success: false,
                    error: "RAG-Query wurde aus DSGVO-Gründen blockiert",
                    details: errorMessage,
                },
                { status: 403 }
            );
        }

        logger.error("Fehler bei RAG-Query", {
            error: errorMessage,
        });

        return NextResponse.json(
            {
                success: false,
                error: "Fehler bei RAG-Query",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

