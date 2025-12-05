/**
 * Secure Media Storage & Access Layer - Enterprise++ Standard
 * 
 * Vollständig sichere Medien-Verwaltung:
 * - Keine Klartext-Dateinamen → ausschließlich Hash-IDs
 * - Dateien als .bin gespeichert
 * - SHA256-Hash für Integrität
 * - Meta.json mit vollständigen Metadaten
 * - Kategorie-basierte Struktur
 */

import { createHash } from "node:crypto";

export type MediaCategory = "linkedin" | "gallery" | "document" | "other";

export interface MediaUploadOptions {
    category: MediaCategory;
    mimeType: string;
    originalFileName?: string;
    alt?: string;
    postReference?: {
        date: string;
        title: string;
        type: string;
    };
}

export interface MediaFileResult {
    id: string; // Hash-ID (z.B. "a7be3f4d9df55b21")
    fileName: string; // Hash-ID.bin (z.B. "a7be3f4d9df55b21.bin")
    folderPath: string; // storage/media/{category}/{year}/{month}/
    fullPath: string; // Vollständiger Pfad zur Datei
    relativePath: string; // Für API-Zugriff
    sha256: string; // SHA256-Hash der Datei
}

/**
 * CI-Compliance-Informationen (KI-generiert)
 */
export interface MediaCICompliance {
    logo_detected?: boolean;
    color_deviation?: number; // 0-100 (wie stark weicht ab)
    warnings?: string[];
}

/**
 * KI-Metadaten (flexible JSON-Struktur)
 */
export interface MediaAIMetadata {
    analyzed_at?: string; // ISO 8601 UTC
    model_version?: string;
    confidence_scores?: Record<string, number>; // z.B. { "laptop": 0.95, "dashboard": 0.87 }
    [key: string]: unknown; // Flexible Erweiterung
}

/**
 * KI-Analyse-Ergebnisse
 */
export interface MediaAI {
    tags?: string[]; // z.B. ["laptop", "dashboard", "team"]
    description_ai?: string; // KI-generierter Alt-Text
    quality_score?: number; // 0-100
    quality_warnings?: string[]; // z.B. ["Auflösung zu niedrig für Hero"]
    category_suggestion?: string; // "screenshot" | "profilbild" | "produktfoto" | "illustration"
    has_person?: boolean; // DSGVO-Flag
    has_text_in_image?: boolean; // Text erkannt
    ci_compliance?: MediaCICompliance;
    similarity_hash?: string; // Für Dublettenerkennung
    ai_metadata?: MediaAIMetadata;
}

export interface MediaMeta {
    id: string; // Hash-ID
    mime: string; // MIME-Type (z.B. "image/png")
    category: MediaCategory;
    size: number; // Dateigröße in Bytes
    createdAt: string; // ISO 8601 UTC
    sha256: string; // SHA256-Hash
    originalFileName?: string; // Optional: Original-Name (nur für Referenz)
    alt?: string; // Alt-Text für Bilder
    postReference?: {
        date: string;
        title: string;
        type: string;
    };
    thumbnailId?: string; // Optional: ID des Thumbnails
    
    // KI-Felder (neu)
    ai?: MediaAI;
    
    // Admin-Freigaben (KI-Vorschläge können überschrieben werden)
    tags_approved?: boolean; // Admin hat Tags geprüft
    alt_approved?: boolean; // Admin hat Alt-Text geprüft
    category_approved?: boolean; // Admin hat Kategorie bestätigt
    
    // DSGVO-Freigabe (wichtig für Personenerkennung)
    dsgvo_approved_by_admin?: boolean;
    dsgvo_approved_at?: string; // ISO 8601 UTC
    dsgvo_approved_by?: string; // User-ID
}

/**
 * Generiert eine sichere Hash-ID für Medien
 * Format: 16-stelliger Hex-Hash (aus Dateiinhalt + Timestamp)
 */
export function generateMediaId(buffer: Buffer): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString();
    const hashInput = buffer.toString("base64").substring(0, 1000) + timestamp + random;

    return createHash("sha256")
        .update(hashInput)
        .digest("hex")
        .substring(0, 16);
}

/**
 * Berechnet SHA256-Hash einer Datei
 */
export function calculateSHA256(buffer: Buffer): string {
    return createHash("sha256")
        .update(buffer)
        .digest("hex");
}

/**
 * Generiert sichere Datei-Informationen für Medien
 * - Nur Hash-ID als Dateiname
 * - Dateien als .bin gespeichert
 * - Kategorie-basierte Struktur
 */
export function generateMediaFileInfo(
    buffer: Buffer,
    options: MediaUploadOptions
): MediaFileResult {
    // Hash-ID generieren
    const id = generateMediaId(buffer);

    // SHA256-Hash berechnen
    const sha256 = calculateSHA256(buffer);

    // Dateiname: nur Hash-ID.bin
    const fileName = `${id}.bin`;

    // Aktuelle Zeit für Ordnerstruktur
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Ordner-Pfad: storage/media/{category}/{year}/{month}/
    const folderPath = `storage/media/${options.category}/${year}/${month}`;
    const fullPath = `${folderPath}/${fileName}`;
    const relativePath = `/media/${options.category}/${year}/${month}/${fileName}`;

    return {
        id,
        fileName,
        folderPath,
        fullPath,
        relativePath,
        sha256,
    };
}

/**
 * Erstellt eine vollständige Meta.json-Struktur
 */
export function createMediaMeta(
    fileInfo: MediaFileResult,
    options: MediaUploadOptions
): MediaMeta {
    const now = new Date();
    const createdAt = now.toISOString();

    const meta: MediaMeta = {
        id: fileInfo.id,
        mime: options.mimeType,
        category: options.category,
        size: 0, // Wird beim Speichern aktualisiert
        createdAt,
        sha256: fileInfo.sha256,
    };

    if (options.originalFileName) {
        meta.originalFileName = options.originalFileName;
    }

    if (options.alt) {
        meta.alt = options.alt;
    }

    if (options.postReference) {
        meta.postReference = options.postReference;
    }

    return meta;
}

/**
 * Liest eine meta.json-Datei anhand der Media-ID
 */
export async function readMediaMetaById(mediaId: string): Promise<MediaMeta | null> {
    try {
        if (!validateMediaId(mediaId)) {
            return null;
        }

        const pathInfo = await getMediaPathFromId(mediaId);
        if (!pathInfo) {
            return null;
        }

        const fs = await import("fs/promises");
        const content = await fs.readFile(pathInfo.metaPath, "utf-8");
        return JSON.parse(content) as MediaMeta;
    } catch (error) {
        return null;
    }
}

/**
 * Schreibt eine meta.json-Datei
 * Format: {mediaId}.meta.json im selben Ordner wie die .bin-Datei
 */
export async function writeMediaMeta(
    folderPath: string,
    meta: MediaMeta,
    fileSize: number
): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");

    // Ordner erstellen, falls nicht vorhanden
    await fs.mkdir(folderPath, { recursive: true });

    // Dateigröße aktualisieren
    meta.size = fileSize;

    // Meta-Datei: {mediaId}.meta.json
    const metaPath = path.join(folderPath, `${meta.id}.meta.json`);
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
}

/**
 * Validiert eine Media-ID (16-stelliger Hex-Hash)
 */
export function validateMediaId(mediaId: string): boolean {
    const pattern = /^[a-f0-9]{16}$/i;
    return pattern.test(mediaId);
}

/**
 * Extrahiert Pfad-Informationen aus einer Media-ID
 * Sucht in allen Kategorien nach der Datei
 */
export async function getMediaPathFromId(mediaId: string): Promise<{
    folderPath: string;
    filePath: string;
    metaPath: string;
    category: MediaCategory;
} | null> {
    if (!validateMediaId(mediaId)) {
        return null;
    }

    const fs = await import("fs/promises");
    const path = await import("path");
    const categories: MediaCategory[] = ["linkedin", "gallery", "document", "other"];

    // Durch alle Kategorien suchen
    for (const category of categories) {
        const basePath = path.join(process.cwd(), "storage", "media", category);

        try {
            // Alle Jahr-Ordner durchsuchen
            const years = await fs.readdir(basePath);
            for (const year of years) {
                const yearPath = path.join(basePath, year);
                const months = await fs.readdir(yearPath);

                for (const month of months) {
                    const monthPath = path.join(yearPath, month);
                    const fileName = `${mediaId}.bin`;
                    const filePath = path.join(monthPath, fileName);

                    try {
                        await fs.access(filePath);
                        // Datei gefunden!
                        return {
                            folderPath: monthPath,
                            filePath,
                            metaPath: path.join(monthPath, `${mediaId}.meta.json`),
                            category,
                        };
                    } catch {
                        // Datei nicht in diesem Ordner
                        continue;
                    }
                }
            }
        } catch {
            // Kategorie-Ordner existiert nicht
            continue;
        }
    }

    return null;
}

/**
 * MIME-Type-Validierung
 */
export function validateMimeType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
}

/**
 * Erlaubte MIME-Types für Bilder
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
];

/**
 * Erlaubte MIME-Types für Dokumente
 */
export const ALLOWED_DOCUMENT_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

