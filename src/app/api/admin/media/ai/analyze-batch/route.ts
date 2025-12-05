/**
 * Media AI Batch Analyze API - Enterprise++ Standard
 * 
 * Batch-Analyse für mehrere Medien
 * POST /api/admin/media/ai/analyze-batch
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { mediaAIService } from "@/lib/media/ai/MediaAIService";

export async function POST(request: NextRequest) {
    try {
        // Admin-Authentifizierung prüfen
        const authResult = await validateMediaAuth(request);

        if (!authResult.success || !authResult.session) {
            return (
                authResult.error ||
                NextResponse.json(
                    { success: false, message: "Nicht authentifiziert" },
                    { status: 401 }
                )
            );
        }

        // Permission prüfen
        if (
            !hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.VIEW) ||
            !hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.UPLOAD)
        ) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-AI-Batch-Analyse" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const { mediaIds, intendedUse, context, language } = body;

        if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
            return NextResponse.json(
                { success: false, message: "Media-IDs Array fehlt oder ist leer" },
                { status: 400 }
            );
        }

        // Max. 50 Medien pro Batch (Performance)
        if (mediaIds.length > 50) {
            return NextResponse.json(
                { success: false, message: "Max. 50 Medien pro Batch erlaubt" },
                { status: 400 }
            );
        }

        // Batch-Analyse durchführen
        const results = await mediaAIService.analyzeBatch(mediaIds, {
            intendedUse,
            context,
            language: language || "de",
        });

        return NextResponse.json({
            success: true,
            total: mediaIds.length,
            results,
        });
    } catch (error) {
        console.error("❌ Media AI Batch Analyze Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler bei der Batch-Analyse",
            },
            { status: 500 }
        );
    }
}






