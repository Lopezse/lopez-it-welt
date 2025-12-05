/**
 * Media AI Analyze API - Enterprise++ Standard
 * 
 * Analysiert ein Medium vollständig mit KI
 * POST /api/admin/media/ai/analyze
 */

import { NextRequest, NextResponse } from "next/server";
import { validateMediaAuth, hasMediaPermission, MEDIA_PERMISSIONS } from "@/lib/media/media-auth";
import { mediaAIService } from "@/lib/media/ai/MediaAIService";
import { readMediaMetaById, writeMediaMeta, getMediaPathFromId } from "@/lib/media/linkedin-media";
import { dsgvoEnforceMiddleware } from "@/middleware/dsgvo-enforce";

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

        // Permission prüfen (View + Upload für Analyse)
        if (
            !hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.VIEW) ||
            !hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.UPLOAD)
        ) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-AI-Analyse" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const { mediaId, intendedUse, context, language } = body;

        if (!mediaId) {
            return NextResponse.json(
                { success: false, message: "Media-ID fehlt" },
                { status: 400 }
            );
        }

        // DSGVO: Middleware-Prüfung
        const dsgvoCheck = await dsgvoEnforceMiddleware(
            request,
            authResult.session.user_id,
            "media_ki",
            "media.ai.manage",
            mediaId
        );

        if (dsgvoCheck) {
            // Middleware hat Request blockiert (403)
            return dsgvoCheck;
        }

        // Medium existiert?
        const meta = await readMediaMetaById(mediaId);
        if (!meta) {
            return NextResponse.json(
                { success: false, message: "Medium nicht gefunden" },
                { status: 404 }
            );
        }

        // KI-Analyse durchführen (mit DSGVO-Prüfung im Service)
        const analysisResult = await mediaAIService.analyzeMedia(mediaId, {
            intendedUse,
            context,
            language: language || "de",
            userId: authResult.session.user_id, // DSGVO: User-ID für Consent-Prüfung
        });

        // Ergebnisse in MediaMeta speichern
        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            return NextResponse.json(
                { success: false, message: "Datei-Pfad nicht gefunden" },
                { status: 404 }
            );
        }

        // AI-Felder aktualisieren
        if (!meta.ai) {
            meta.ai = {};
        }

        // Tags
        if (analysisResult.tags) {
            meta.ai.tags = analysisResult.tags.tags;
            meta.ai.ai_metadata = {
                ...meta.ai.ai_metadata,
                analyzed_at: analysisResult.analyzed_at,
                model_version: analysisResult.model_version,
                confidence_scores: analysisResult.tags.confidence_scores,
            };
        }

        // Alt-Text
        if (analysisResult.alt_text) {
            meta.ai.description_ai = analysisResult.alt_text.description;
        }

        // Quality
        if (analysisResult.quality) {
            meta.ai.quality_score = analysisResult.quality.score;
            meta.ai.quality_warnings = analysisResult.quality.warnings;
        }

        // Category
        if (analysisResult.category) {
            meta.ai.category_suggestion = analysisResult.category.category;
        }

        // CI-Compliance
        if (analysisResult.ci_compliance) {
            meta.ai.ci_compliance = {
                logo_detected: analysisResult.ci_compliance.logo_detected,
                color_deviation: analysisResult.ci_compliance.color_deviation,
                warnings: analysisResult.ci_compliance.warnings,
            };
        }

        // Person-Detection (DSGVO)
        if (analysisResult.person_detection) {
            meta.ai.has_person = analysisResult.person_detection.has_person;
            meta.ai.has_text_in_image = false; // Wird später erweitert

            // WICHTIG: Person erkannt → DSGVO-Flag setzen, aber NICHT automatisch freigeben
            if (analysisResult.person_detection.has_person) {
                // Flag setzen, aber dsgvo_approved_by_admin bleibt false
                // Admin muss explizit freigeben
                
                // Audit-Log schreiben
                const { getConnection } = await import("@/lib/database");
                const connection = await getConnection();
                await connection.execute(
                    `INSERT INTO dsgvo_audit_events 
                     (user_id, event_type, action, resource_type, resource_id, data_category, ip_address, user_agent, result)
                     VALUES (?, 'PERSON_DETECTED', 'Person Detection', 'media', ?, 'media_ki', ?, ?, 'success')`,
                    [
                        authResult.session.user_id,
                        mediaId,
                        request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
                        request.headers.get("user-agent") || null
                    ]
                );
            }
        }

        // Similarity-Hash berechnen und speichern
        const similarityHash = await (
            await import("@/lib/media/ai/services/SimilarityService")
        ).similarityService.calculateSimilarityHash(
            await (await import("fs/promises")).readFile(pathInfo.filePath)
        );
        meta.ai.similarity_hash = similarityHash;

        // Meta.json aktualisieren
        await writeMediaMeta(pathInfo.folderPath, meta, meta.size);

        return NextResponse.json({
            success: true,
            media_id: mediaId,
            analysis: analysisResult,
            meta_updated: true,
        });
    } catch (error) {
        console.error("❌ Media AI Analyze Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler bei der KI-Analyse",
            },
            { status: 500 }
        );
    }
}




