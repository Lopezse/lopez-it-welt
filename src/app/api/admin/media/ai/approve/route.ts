/**
 * Media AI Approve API - Enterprise++ Standard
 * 
 * Admin bestätigt KI-Vorschläge (Tags, Alt-Text, Kategorie, DSGVO)
 * POST /api/admin/media/ai/approve
 * 
 * WICHTIG: Nur Admin kann KI-Vorschläge freigeben
 * Keine automatische Freigabe - Enterprise++ Standard
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { readMediaMetaById, writeMediaMeta, getMediaPathFromId, validateMediaId } from "@/lib/media/linkedin-media";

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

        // Permission prüfen (Upload für Approve)
        if (!hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.UPLOAD)) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-Approve" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const {
            mediaId,
            approveTags,
            approveAlt,
            approveCategory,
            approveDSGVO,
            customAltText,
            customCategory,
        } = body;

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

        // Admin-User-ID
        const adminUserId = authResult.session.userId;

        // Approve-Flags setzen
        if (approveTags === true) {
            meta.tags_approved = true;
        }

        if (approveAlt === true) {
            meta.alt_approved = true;
            // Optional: Custom Alt-Text überschreiben
            if (customAltText && typeof customAltText === "string") {
                meta.alt = customAltText;
            } else if (meta.ai?.description_ai) {
                // KI-Alt-Text übernehmen
                meta.alt = meta.ai.description_ai;
            }
        }

        if (approveCategory === true) {
            meta.category_approved = true;
            // Optional: Custom Category überschreiben
            if (customCategory && typeof customCategory === "string") {
                meta.category = customCategory as any;
            } else if (meta.ai?.category_suggestion) {
                // KI-Kategorie übernehmen
                meta.category = meta.ai.category_suggestion as any;
            }
        }

        // DSGVO-Freigabe (wichtig für Personenerkennung)
        if (approveDSGVO === true) {
            // ENTERPRISE++ REGEL: Nur wenn Person erkannt wurde
            if (meta.ai?.has_person === true) {
                meta.dsgvo_approved_by_admin = true;
                meta.dsgvo_approved_at = new Date().toISOString();
                meta.dsgvo_approved_by = adminUserId.toString();
            } else {
                // Warnung: DSGVO-Freigabe nicht nötig, wenn keine Person erkannt
                return NextResponse.json({
                    success: false,
                    message: "DSGVO-Freigabe nicht erforderlich - keine Person erkannt",
                });
            }
        }

        // Meta.json aktualisieren
        await writeMediaMeta(pathInfo.folderPath, meta, meta.size);

        return NextResponse.json({
            success: true,
            media_id: mediaId,
            approved: {
                tags: meta.tags_approved || false,
                alt: meta.alt_approved || false,
                category: meta.category_approved || false,
                dsgvo: meta.dsgvo_approved_by_admin || false,
            },
            approved_by: adminUserId,
            approved_at: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Media AI Approve Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler beim Approve",
            },
            { status: 500 }
        );
    }
}

