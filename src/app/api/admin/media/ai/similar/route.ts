/**
 * Media AI Similar API - Enterprise++ Standard
 * 
 * Findet ähnliche Medien (Dublettenerkennung)
 * GET /api/admin/media/ai/similar?id={mediaId}
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { mediaAIService } from "@/lib/media/ai/MediaAIService";
import { validateMediaId } from "@/lib/media/linkedin-media";

export async function GET(request: NextRequest) {
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
                { success: false, message: "Keine Berechtigung für Media-View" },
                { status: 403 }
            );
        }

        // Query-Parameter
        const { searchParams } = new URL(request.url);
        const mediaId = searchParams.get("id");
        const limit = parseInt(searchParams.get("limit") || "5");

        if (!mediaId) {
            return NextResponse.json(
                { success: false, message: "Media-ID fehlt" },
                { status: 400 }
            );
        }

        // Media-ID validieren
        if (!validateMediaId(mediaId)) {
            return NextResponse.json(
                { success: false, message: "Ungültige Media-ID" },
                { status: 400 }
            );
        }

        // Ähnliche Medien finden
        const result = await mediaAIService.findSimilar(mediaId, limit);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.error || "Fehler beim Finden ähnlicher Medien" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            media_id: mediaId,
            similar_media: result.data?.similar_media || [],
            total: result.data?.similar_media?.length || 0,
        });
    } catch (error) {
        console.error("❌ Media AI Similar Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler beim Finden ähnlicher Medien",
            },
            { status: 500 }
        );
    }
}






