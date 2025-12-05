/**
 * Media List API - Enterprise++ Standard
 * 
 * Gibt Liste aller Medien zurück (nach Kategorie, Datum)
 * - Authentifizierung erforderlich
 * - Filterung nach Kategorie
 * - Sortierung nach createdAt
 */

import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
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

        // Query-Parameter
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || null;
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const basePath = join(process.cwd(), "storage/media");
        const mediaList: any[] = [];

        // Kategorien durchsuchen
        const categories = category ? [category] : ["linkedin", "gallery", "document", "other"];

        for (const cat of categories) {
            const categoryPath = join(basePath, cat);

            try {
                // Jahre durchsuchen
                const years = await readdir(categoryPath, { withFileTypes: true });
                for (const year of years) {
                    if (!year.isDirectory()) continue;

                    const yearPath = join(categoryPath, year.name);
                    const months = await readdir(yearPath, { withFileTypes: true });

                    for (const month of months) {
                        if (!month.isDirectory()) continue;

                        const monthPath = join(yearPath, month.name);
                        const files = await readdir(monthPath);

                        // Meta.json-Dateien finden
                        for (const file of files) {
                            if (file.endsWith(".meta.json")) {
                                try {
                                    const metaPath = join(monthPath, file);
                                    const metaContent = await readFile(metaPath, "utf-8");
                                    const meta = JSON.parse(metaContent);

                                    // Datei-Statistik
                                    const binFile = join(monthPath, `${meta.id}.bin`);
                                    let fileStat;
                                    try {
                                        fileStat = await stat(binFile);
                                    } catch {
                                        // Datei existiert nicht
                                        continue;
                                    }

                                    // KI-Felder extrahieren
                                    const aiStatus = (meta as any).ai_status || null;
                                    const aiErrorMessage = (meta as any).ai_error_message || null;
                                    const aiAnalyzedAt = meta.ai?.ai_metadata?.analyzed_at || null;
                                    const hasPerson = meta.ai?.has_person || false;
                                    const dsgvoApproved = meta.dsgvo_approved_by_admin || false;
                                    const aiTags = meta.ai?.tags || null;
                                    const aiQualityScore = meta.ai?.quality_score || null;

                                    mediaList.push({
                                        ...meta,
                                        folderPath: `storage/media/${cat}/${year.name}/${month.name}`,
                                        fileExists: true,
                                        fileSize: fileStat.size,
                                        lastModified: fileStat.mtime.toISOString(),
                                        // KI-Felder
                                        ai_status: aiStatus,
                                        ai_error_message: aiErrorMessage,
                                        ai_analyzed_at: aiAnalyzedAt,
                                        has_person: hasPerson,
                                        dsgvo_approved_by_admin: dsgvoApproved,
                                        ai_tags: aiTags,
                                        ai_quality_score: aiQualityScore,
                                    });
                                } catch (error) {
                                    console.error(`❌ Fehler beim Lesen von ${file}:`, error);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                // Kategorie existiert nicht
                continue;
            }
        }

        // Sortierung nach createdAt (neueste zuerst)
        mediaList.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        // Pagination
        const total = mediaList.length;
        const paginated = mediaList.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: {
                media: paginated,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total,
                },
            },
        });
    } catch (error) {
        console.error("❌ Media List Fehler:", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Laden der Medienliste" },
            { status: 500 }
        );
    }
}




