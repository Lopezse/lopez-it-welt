/**
 * Media Update API - Enterprise++ Standard
 * 
 * Aktualisiert Stammdaten eines Mediums (alt, category, tags)
 * PUT /api/admin/media/update
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { readMediaMetaById, writeMediaMeta, getMediaPathFromId, validateMediaId } from "@/lib/media/linkedin-media";
import { stat } from "fs/promises";

export async function PUT(request: NextRequest) {
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

        // Permission prüfen (Upload für Update)
        if (!hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.UPLOAD)) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-Update" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const { mediaId, alt, category, tags } = body;

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

        // Medium laden
        const meta = await readMediaMetaById(mediaId);
        if (!meta) {
            return NextResponse.json(
                { success: false, message: "Medium nicht gefunden" },
                { status: 404 }
            );
        }

        // Pfad-Informationen
        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            return NextResponse.json(
                { success: false, message: "Datei-Pfad nicht gefunden" },
                { status: 404 }
            );
        }

        // Datei-Statistik für writeMediaMeta
        const binPath = pathInfo.filePath;
        const fileStat = await stat(binPath);

        // Stammdaten aktualisieren
        if (alt !== undefined) {
            meta.alt = alt || undefined;
        }

        if (category !== undefined && typeof category === "string") {
            meta.category = category as any;
        }

        // Tags werden aktuell nicht in MediaMeta gespeichert, nur in ai.tags
        // Falls später ein tags-Feld in MediaMeta kommt, hier ergänzen

        // Meta speichern
        await writeMediaMeta(pathInfo.folderPath, meta, fileStat.size);

        return NextResponse.json({
            success: true,
            message: "Media-Stammdaten erfolgreich aktualisiert",
            data: {
                id: meta.id,
                alt: meta.alt,
                category: meta.category,
            },
        });
    } catch (error) {
        console.error("❌ Media Update Fehler:", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Aktualisieren der Media-Stammdaten" },
            { status: 500 }
        );
    }
}





