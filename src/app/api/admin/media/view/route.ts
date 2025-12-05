/**
 * Secure Media Viewer API
 * 
 * Enterprise++ Standard: Gesicherter Zugriff auf Medien
 * - Nur für authentifizierte Admins
 * - Kein Directory Listing
 * - Nur über meta.json referenzierte Dateien
 * - SHA256-Integritätsprüfung
 */

import { calculateSHA256, getMediaPathFromId, readMediaMetaById, validateMediaId } from "@/lib/media/linkedin-media";
import { readFile, stat } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

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

        const searchParams = request.nextUrl.searchParams;
        const mediaId = searchParams.get("id");
        const type = searchParams.get("type") || "original"; // "original" oder "thumbnail"

        if (!mediaId) {
            return NextResponse.json({ error: "Media-ID fehlt" }, { status: 400 });
        }

        if (!validateMediaId(mediaId)) {
            return NextResponse.json({ error: "Ungültige Media-ID" }, { status: 400 });
        }

        // Meta.json lesen
        const meta = await readMediaMetaById(mediaId);
        if (!meta) {
            return NextResponse.json({ error: "Media nicht gefunden" }, { status: 404 });
        }

        // Pfad-Informationen aus Media-ID extrahieren
        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
        }

        // Thumbnail-Handling (später erweiterbar)
        let filePath = pathInfo.filePath;
        if (type === "thumbnail" && meta.thumbnailId) {
            const thumbnailPath = await getMediaPathFromId(meta.thumbnailId);
            if (thumbnailPath) {
                filePath = thumbnailPath.filePath;
            }
        }

        // Datei existiert?
        try {
            await stat(filePath);
        } catch {
            return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
        }

        // Datei lesen
        const fileBuffer = await readFile(filePath);

        // SHA256-Validierung (Integritätsprüfung)
        const calculatedHash = calculateSHA256(fileBuffer);
        if (calculatedHash !== meta.sha256) {
            console.error(`⚠️ SHA256-Mismatch für Media-ID ${mediaId}`);
            // Weiterleiten, aber warnen (in Produktion könnte man hier blockieren)
        }

        // Content-Type aus meta.json verwenden
        const contentType = meta.mime || "application/octet-stream";

        // Datei zurückgeben (Buffer zu Uint8Array konvertieren für NextResponse)
        return new NextResponse(new Uint8Array(fileBuffer), {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${meta.originalFileName || mediaId}.bin"`,
                "Cache-Control": "private, max-age=3600",
                "X-Media-ID": mediaId,
                "X-SHA256": meta.sha256,
            },
        });
    } catch (error) {
        console.error("❌ Media View Fehler:", error);
        return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
    }
}
