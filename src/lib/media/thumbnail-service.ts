/**
 * Thumbnail Service - Enterprise++ Standard
 * 
 * Generiert Thumbnails für Bilder mit sharp
 * - Standardgrößen: 300x300, 600x600
 * - Automatische Hash-ID-Generierung
 * - Sichere Speicherung als .bin
 */

import sharp from "sharp";
import {
    createMediaMeta,
    generateMediaFileInfo,
    writeMediaMeta,
    type MediaCategory
} from "./linkedin-media";

export interface ThumbnailSize {
    width: number;
    height: number;
    suffix: string;
}

export const THUMBNAIL_SIZES: ThumbnailSize[] = [
    { width: 300, height: 300, suffix: "thumb_300" },
    { width: 600, height: 600, suffix: "thumb_600" },
];

export interface ThumbnailResult {
    mediaId: string;
    fileName: string;
    folderPath: string;
    fullPath: string;
    size: ThumbnailSize;
    sha256: string;
}

/**
 * Generiert Thumbnails für ein Bild
 * @param originalBuffer - Original-Bild-Buffer
 * @param category - Media-Kategorie
 * @param mimeType - MIME-Type des Originals
 * @returns Array von Thumbnail-Resultaten
 */
export async function generateThumbnails(
    originalBuffer: Buffer,
    category: MediaCategory,
    mimeType: string
): Promise<ThumbnailResult[]> {
    const results: ThumbnailResult[] = [];

    // Nur für Bilder
    if (!mimeType.startsWith("image/")) {
        return results;
    }

    try {
        // Sharp-Image erstellen
        const image = sharp(originalBuffer);

        // Metadaten extrahieren
        const metadata = await image.metadata();

        // Für jede Thumbnail-Größe
        for (const size of THUMBNAIL_SIZES) {
            try {
                // Thumbnail generieren
                const thumbnailBuffer = await image
                    .resize(size.width, size.height, {
                        fit: "inside",
                        withoutEnlargement: true,
                    })
                    .webp({ quality: 85 })
                    .toBuffer();

                // Hash-ID für Thumbnail generieren
                const thumbnailInfo = generateMediaFileInfo(thumbnailBuffer, {
                    category,
                    mimeType: "image/webp",
                });

                // Thumbnail-Info speichern
                results.push({
                    mediaId: thumbnailInfo.id,
                    fileName: thumbnailInfo.fileName,
                    folderPath: thumbnailInfo.folderPath,
                    fullPath: thumbnailInfo.fullPath,
                    size,
                    sha256: thumbnailInfo.sha256,
                });
            } catch (error) {
                console.error(`❌ Fehler beim Generieren von Thumbnail ${size.suffix}:`, error);
                // Weiter mit nächster Größe
            }
        }
    } catch (error) {
        console.error("❌ Thumbnail-Generierung fehlgeschlagen:", error);
    }

    return results;
}

/**
 * Speichert Thumbnails und erstellt Meta.json
 */
export async function saveThumbnails(
    thumbnails: ThumbnailResult[],
    originalMediaId: string,
    category: MediaCategory
): Promise<string[]> {
    const { mkdir, writeFile } = await import("fs/promises");
    const { join } = await import("path");

    const thumbnailIds: string[] = [];

    for (const thumbnail of thumbnails) {
        try {
            // Ordner erstellen
            const folderPath = join(process.cwd(), thumbnail.folderPath);
            await mkdir(folderPath, { recursive: true });

            // Thumbnail-Buffer laden (wird später aus originalBuffer generiert)
            // Für jetzt: Thumbnail wird in generateThumbnails bereits als Buffer zurückgegeben
            // Wir müssen den Buffer hier nochmal generieren - das sollte optimiert werden
            // TODO: Buffer direkt übergeben statt neu zu generieren

            // Meta.json für Thumbnail erstellen
            // ThumbnailResult zu MediaFileResult konvertieren
            const thumbnailFileResult = {
                id: thumbnail.mediaId,
                fileName: thumbnail.fileName,
                folderPath: thumbnail.folderPath,
                fullPath: thumbnail.fullPath,
                relativePath: thumbnail.folderPath,
                sha256: thumbnail.sha256,
            };

            const thumbnailMeta = createMediaMeta(thumbnailFileResult, {
                category,
                mimeType: "image/webp",
            });

            // Original-Referenz hinzufügen
            thumbnailMeta.postReference = {
                date: new Date().toISOString().split("T")[0],
                title: `Thumbnail für ${originalMediaId}`,
                type: "thumbnail",
            };

            // Meta.json speichern (Dateigröße wird später aktualisiert)
            await writeMediaMeta(folderPath, thumbnailMeta, 0);

            thumbnailIds.push(thumbnail.mediaId);
        } catch (error) {
            console.error(`❌ Fehler beim Speichern von Thumbnail ${thumbnail.mediaId}:`, error);
        }
    }

    return thumbnailIds;
}

/**
 * Optimierte Version: Generiert und speichert Thumbnails in einem Schritt
 */
export async function generateAndSaveThumbnails(
    originalBuffer: Buffer,
    originalMediaId: string,
    category: MediaCategory,
    mimeType: string
): Promise<{ thumbnailIds: string[]; thumbnailBuffers: Map<string, Buffer> }> {
    const { mkdir, writeFile } = await import("fs/promises");
    const { join } = await import("path");

    const thumbnailIds: string[] = [];
    const thumbnailBuffers = new Map<string, Buffer>();

    // Nur für Bilder
    if (!mimeType.startsWith("image/")) {
        return { thumbnailIds, thumbnailBuffers };
    }

    try {
        const image = sharp(originalBuffer);

        for (const size of THUMBNAIL_SIZES) {
            try {
                // Thumbnail generieren
                const thumbnailBuffer = await image
                    .clone()
                    .resize(size.width, size.height, {
                        fit: "inside",
                        withoutEnlargement: true,
                    })
                    .webp({ quality: 85 })
                    .toBuffer();

                // Hash-ID für Thumbnail generieren
                const thumbnailInfo = generateMediaFileInfo(thumbnailBuffer, {
                    category,
                    mimeType: "image/webp",
                });

                // Ordner erstellen
                const folderPath = join(process.cwd(), thumbnailInfo.folderPath);
                await mkdir(folderPath, { recursive: true });

                // Thumbnail als .bin speichern
                const filePath = join(folderPath, thumbnailInfo.fileName);
                await writeFile(filePath, thumbnailBuffer);

                // Meta.json erstellen
                const thumbnailMeta = createMediaMeta(thumbnailInfo, {
                    category,
                    mimeType: "image/webp",
                });

                await writeMediaMeta(folderPath, thumbnailMeta, thumbnailBuffer.length);

                thumbnailIds.push(thumbnailInfo.id);
                thumbnailBuffers.set(thumbnailInfo.id, thumbnailBuffer);
            } catch (error) {
                console.error(`❌ Fehler bei Thumbnail ${size.suffix}:`, error);
            }
        }
    } catch (error) {
        console.error("❌ Thumbnail-Generierung fehlgeschlagen:", error);
    }

    return { thumbnailIds, thumbnailBuffers };
}

