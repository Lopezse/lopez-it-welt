/**
 * LinkedIn Media Upload API
 * 
 * Enterprise++ Standard: Sichere Upload-Route für LinkedIn-Bilder
 * - Authentifizierung erforderlich
 * - Sichere Dateinamen-Generierung
 * - Automatische Ordnerstruktur
 * - Meta.json-Erstellung
 */

import {
    ALLOWED_DOCUMENT_MIME_TYPES,
    ALLOWED_IMAGE_MIME_TYPES,
    createMediaMeta,
    generateMediaFileInfo,
    validateMimeType,
    writeMediaMeta,
    type MediaCategory,
} from "@/lib/media/linkedin-media";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
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

        // Permission prüfen (Upload)
        if (!hasMediaPermission(authResult.session.permissions, MEDIA_PERMISSIONS.UPLOAD)) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für Media-Upload" },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const category = (formData.get("category") as MediaCategory) || "linkedin";
        const alt = formData.get("alt") as string | null;
        const postDate = formData.get("postDate") as string | null;
        const postTitle = formData.get("postTitle") as string | null;
        const postType = formData.get("postType") as string | null;

        if (!file) {
            return NextResponse.json({ error: "Keine Datei übermittelt" }, { status: 400 });
        }

        // MIME-Type validieren
        const allowedTypes = category === "linkedin"
            ? ALLOWED_IMAGE_MIME_TYPES
            : [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_DOCUMENT_MIME_TYPES];

        if (!validateMimeType(file.type, allowedTypes)) {
            return NextResponse.json(
                { error: `Ungültiger Dateityp: ${file.type}` },
                { status: 400 }
            );
        }

        // Dateigröße validieren (max. 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `Datei zu groß (max. ${maxSize / 1024 / 1024}MB)` },
                { status: 400 }
            );
        }

        // Datei in Buffer laden
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sichere Datei-Informationen generieren (Hash-ID, SHA256)
        const fileInfo = generateMediaFileInfo(buffer, {
            category,
            mimeType: file.type,
            originalFileName: file.name,
            alt: alt || undefined,
            postReference: postDate && postTitle && postType
                ? {
                    date: postDate,
                    title: postTitle,
                    type: postType,
                }
                : undefined,
        });

        // Ordner erstellen
        const folderPath = join(process.cwd(), fileInfo.folderPath);
        await mkdir(folderPath, { recursive: true });

        // Datei als .bin speichern
        const filePath = join(folderPath, fileInfo.fileName);
        await writeFile(filePath, buffer);

        // Thumbnails generieren (nur für Bilder)
        let thumbnailId: string | undefined;
        if (file.type.startsWith("image/")) {
            try {
                const { generateAndSaveThumbnails } = await import("@/lib/media/thumbnail-service");
                const { thumbnailIds } = await generateAndSaveThumbnails(
                    buffer,
                    fileInfo.id,
                    category,
                    file.type
                );

                // Erste Thumbnail-ID verwenden (300x300)
                if (thumbnailIds.length > 0) {
                    thumbnailId = thumbnailIds[0];
                }
            } catch (error) {
                console.error("❌ Thumbnail-Generierung fehlgeschlagen:", error);
                // Upload trotzdem erfolgreich, nur ohne Thumbnail
            }
        }

        // Meta.json erstellen
        const meta = createMediaMeta(fileInfo, {
            category,
            mimeType: file.type,
            originalFileName: file.name,
            alt: alt || undefined,
            postReference: postDate && postTitle && postType
                ? {
                    date: postDate,
                    title: postTitle,
                    type: postType,
                }
                : undefined,
        });

        // Thumbnail-ID hinzufügen
        if (thumbnailId) {
            meta.thumbnailId = thumbnailId;
        }

        await writeMediaMeta(folderPath, meta, buffer.length);

        return NextResponse.json({
            success: true,
            mediaId: fileInfo.id,
            sha256: fileInfo.sha256,
            size: buffer.length,
            mime: file.type,
            category,
            thumbnailId: thumbnailId || null,
        });
    } catch (error) {
        console.error("❌ LinkedIn Media Upload Fehler:", error);
        return NextResponse.json(
            { error: "Fehler beim Upload" },
            { status: 500 }
        );
    }
}

