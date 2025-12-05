/**
 * Media AI Smart Search API - Enterprise++ Standard
 * 
 * Semantische Suche nach Medien
 * POST /api/admin/media/ai/search
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { mediaAIService } from "@/lib/media/ai/MediaAIService";
import type { SmartSearchParams } from "@/lib/media/ai/types";

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

        // Permission prüfen (View)
        if (!hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.VIEW)) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-Suche" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const { query, category, limit, min_confidence } = body;

        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: "Such-Query fehlt oder ist leer" },
                { status: 400 }
            );
        }

        // Smart-Search-Parameter
        const searchParams: SmartSearchParams = {
            query: query.trim(),
            category,
            limit: limit || 20,
            min_confidence: min_confidence || 0.5,
        };

        // Smart Search durchführen
        const results = await mediaAIService.smartSearch(searchParams);

        return NextResponse.json({
            success: true,
            query: searchParams.query,
            results,
            total: results.length,
        });
    } catch (error) {
        console.error("❌ Media AI Smart Search Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler bei der Suche",
            },
            { status: 500 }
        );
    }
}






