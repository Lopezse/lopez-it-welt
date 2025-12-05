/**
 * Media Migration Script - Enterprise++ Standard
 * 
 * Migriert bestehende Klartext-Dateinamen zu Hash-basierten Media-Dateien
 * - Findet alte Dateien (z.B. in public/linkedin-posts/)
 * - Generiert Hash-ID
 * - Erstellt .bin + .meta.json
 * - Generiert Report
 */

import { createHash } from "crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises";
import { basename, dirname, dirname as dirnameESM, extname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirnameESM(__filename);
const projectRoot = join(__dirname, "..");

// Konfiguration
const MIGRATION_CONFIG = {
    sourceDirs: [
        "public/linkedin-posts",
        "public/uploads/images",
        "storage/media/legacy", // Falls vorhanden
    ],
    targetBase: "storage/media",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    reportFile: "storage/media/migration-report.json",
};

/**
 * Generiert Hash-ID aus Datei-Buffer
 */
function generateHashId(buffer) {
    const hash = createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex").substring(0, 16);
}

/**
 * Berechnet SHA256-Hash
 */
function calculateSHA256(buffer) {
    const hash = createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex");
}

/**
 * Bestimmt MIME-Type aus Dateiendung
 */
function getMimeType(extension) {
    const mimeTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

/**
 * Bestimmt Kategorie aus Pfad
 */
function determineCategory(filePath) {
    if (filePath.includes("linkedin")) return "linkedin";
    if (filePath.includes("gallery")) return "gallery";
    if (filePath.includes("document")) return "document";
    return "other";
}

/**
 * Erstellt Meta.json-Objekt
 */
function createMetaJson(
    mediaId,
    originalFileName,
    mimeType,
    category,
    size,
    sha256,
    originalPath
) {
    const now = new Date();
    return {
        id: mediaId,
        mime: mimeType,
        category,
        size,
        createdAt: now.toISOString(),
        sha256,
        originalFileName,
        alt: basename(originalFileName, extname(originalFileName)),
        postReference: null,
        thumbnailId: null,
        migration: {
            migratedAt: now.toISOString(),
            originalPath,
        },
    };
}

/**
 * Findet alle Dateien in einem Verzeichnis rekursiv
 */
async function findFiles(dir, extensions) {
    const files = [];

    try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                // Rekursiv durchsuchen
                const subFiles = await findFiles(fullPath, extensions);
                files.push(...subFiles);
            } else if (entry.isFile()) {
                const ext = extname(entry.name).toLowerCase();
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    } catch (error) {
        // Verzeichnis existiert nicht oder kein Zugriff
        console.warn(`⚠️  Verzeichnis nicht gefunden oder kein Zugriff: ${dir}`);
    }

    return files;
}

/**
 * Migriert eine einzelne Datei
 */
async function migrateFile(sourcePath, category) {
    try {
        // Datei lesen
        const buffer = await readFile(sourcePath);
        const extension = extname(sourcePath);
        const mimeType = getMimeType(extension);

        // Hash-ID generieren
        const mediaId = generateHashId(buffer);
        const sha256 = calculateSHA256(buffer);

        // Datum aus Datei-Metadaten oder aktuelles Datum
        const fileStat = await stat(sourcePath);
        const fileDate = fileStat.mtime || new Date();
        const year = fileDate.getFullYear();
        const month = String(fileDate.getMonth() + 1).padStart(2, "0");

        // Ziel-Ordner erstellen
        const targetFolder = join(
            projectRoot,
            MIGRATION_CONFIG.targetBase,
            category,
            String(year),
            month
        );
        await mkdir(targetFolder, { recursive: true });

        // Dateiname: {hashId}.bin
        const fileName = `${mediaId}.bin`;
        const targetPath = join(targetFolder, fileName);

        // Datei als .bin speichern
        await writeFile(targetPath, buffer);

        // Meta.json erstellen
        const meta = createMetaJson(
            mediaId,
            basename(sourcePath),
            mimeType,
            category,
            buffer.length,
            sha256,
            sourcePath
        );

        const metaPath = join(targetFolder, `${mediaId}.meta.json`);
        await writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");

        return {
            success: true,
            mediaId,
            originalPath: sourcePath,
            newPath: targetPath,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            originalPath: sourcePath,
        };
    }
}

/**
 * Hauptfunktion
 */
async function main() {
    console.log("🚀 Media-Migration gestartet...\n");

    const results = {
        total: 0,
        successful: 0,
        failed: 0,
        migrated: [],
        errors: [],
        startTime: new Date().toISOString(),
    };

    // Alle Dateien finden
    const allFiles = [];
    for (const sourceDir of MIGRATION_CONFIG.sourceDirs) {
        const fullPath = join(projectRoot, sourceDir);
        const files = await findFiles(fullPath, MIGRATION_CONFIG.allowedExtensions);
        allFiles.push(...files);
    }

    results.total = allFiles.length;
    console.log(`📁 ${results.total} Dateien gefunden\n`);

    // Dateien migrieren
    for (const filePath of allFiles) {
        const category = determineCategory(filePath);
        const result = await migrateFile(filePath, category);

        if (result.success) {
            results.successful++;
            results.migrated.push({
                mediaId: result.mediaId,
                originalPath: result.originalPath,
                newPath: result.newPath,
            });
            console.log(`✅ ${basename(filePath)} → ${result.mediaId}`);
        } else {
            results.failed++;
            results.errors.push({
                originalPath: result.originalPath,
                error: result.error,
            });
            console.error(`❌ ${basename(filePath)}: ${result.error}`);
        }
    }

    results.endTime = new Date().toISOString();

    // Report speichern
    const reportPath = join(projectRoot, MIGRATION_CONFIG.reportFile);
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, JSON.stringify(results, null, 2), "utf-8");

    // Zusammenfassung
    console.log("\n" + "=".repeat(50));
    console.log("📊 Migrations-Report");
    console.log("=".repeat(50));
    console.log(`Gesamt: ${results.total}`);
    console.log(`✅ Erfolgreich: ${results.successful}`);
    console.log(`❌ Fehlgeschlagen: ${results.failed}`);
    console.log(`\n📄 Report gespeichert: ${MIGRATION_CONFIG.reportFile}`);
    console.log("=".repeat(50));
}

// Script ausführen
main().catch((error) => {
    console.error("❌ Migration fehlgeschlagen:", error);
    process.exit(1);
});

