/**
 * Media Detail API - Enterprise++ Standard
 * 
 * Gibt Details zu einem spezifischen Medium zurück
 * - Authentifizierung erforderlich
 * - Media-ID-Validierung
 */

import { NextRequest, NextResponse } from "next/server";
import { readMediaMetaById, validateMediaId } from "@/lib/media/linkedin-media";
import { readFile, stat } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
    try {
        // Admin-Authentifizierung prüfen
        const { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } = await import("@/lib/media/media-auth");
        const authResult = await validateMediaAuth(request);

        if (!authResult.success || !authResult.session) {
            return authResult.error || NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        // Permission prüfen (View)
        if (!hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.VIEW)) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-View" },
                { status: 403 }
            );
        }

        // Media-ID aus Query-Parameter
        const { searchParams } = new URL(request.url);
        const mediaId = searchParams.get("id");

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

        // Meta-Daten laden
        const meta = await readMediaMetaById(mediaId);
        if (!meta) {
            return NextResponse.json(
                { success: false, message: "Medium nicht gefunden" },
                { status: 404 }
            );
        }

        // Datei-Statistik
        const { getMediaPathFromId } = await import("@/lib/media/linkedin-media");
        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            return NextResponse.json(
                { success: false, message: "Media-Pfad nicht gefunden" },
                { status: 404 }
            );
        }
        const binPath = join(process.cwd(), pathInfo.folderPath, `${mediaId}.bin`);

        let fileStat;
        try {
            fileStat = await stat(binPath);
        } catch {
            return NextResponse.json(
                { success: false, message: "Datei nicht gefunden" },
                { status: 404 }
            );
        }

        // Thumbnail-Info (falls vorhanden)
        let thumbnailMeta = null;
        if (meta.thumbnailId) {
            try {
                thumbnailMeta = await readMediaMetaById(meta.thumbnailId);
            } catch {
                // Thumbnail existiert nicht
            }
        }

        // KI-Felder extrahieren (sicherstellen, dass alle AI-Felder zurückgegeben werden)
        const aiStatus = (meta as any).ai_status || null;
        const aiErrorMessage = (meta as any).ai_error_message || null;
        const aiRetryCount = (meta as any).ai_retry_count || 0;
        const aiAnalyzedAt = meta.ai?.ai_metadata?.analyzed_at || null;

        return NextResponse.json({
            success: true,
            data: {
                ...meta,
                fileExists: true,
                fileSize: fileStat.size,
                lastModified: fileStat.mtime.toISOString(),
                thumbnail: thumbnailMeta
                    ? {
                        id: thumbnailMeta.id,
                        mime: thumbnailMeta.mime,
                        size: thumbnailMeta.size,
                    }
                    : null,
                // KI-Felder explizit zurückgeben
                ai_status: aiStatus,
                ai_error_message: aiErrorMessage,
                ai_retry_count: aiRetryCount,
                ai_analyzed_at: aiAnalyzedAt,
                // meta.ai Objekt vollständig inkludieren
                ai: meta.ai || null,
            },
        });
    } catch (error) {
        console.error("❌ Media Detail Fehler:", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Laden der Media-Details" },
            { status: 500 }
        );
    }
}




