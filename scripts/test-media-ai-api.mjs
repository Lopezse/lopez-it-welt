/**
 * Media AI API Test Script - Enterprise++ Standard
 * 
 * Testet alle KI-Endpunkte der Medienverwaltung
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const API_BASE = "http://localhost:3000";
const TEST_MEDIA_ID = "test1234567890ab"; // 16-stelliger Hash

// Test-Ergebnisse
const testResults = {
    setup: { success: false, message: "" },
    tests: [],
    summary: {},
};

/**
 * Erstellt ein Test-Medium im File-System
 */
async function createTestMediaFile() {
    try {
        // Test-Bild erstellen (1x1 PNG)
        const pngHeader = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
            0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
            0x42, 0x60, 0x82,
        ]);

        // Ordner erstellen
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const folderPath = join(projectRoot, "storage", "media", "linkedin", String(year), month);
        await mkdir(folderPath, { recursive: true });

        // .bin-Datei speichern
        const binPath = join(folderPath, `${TEST_MEDIA_ID}.bin`);
        await writeFile(binPath, pngHeader);

        // SHA256 berechnen
        const sha256 = createHash("sha256").update(pngHeader).digest("hex");

        // Meta.json erstellen
        const meta = {
            id: TEST_MEDIA_ID,
            mime: "image/png",
            category: "linkedin",
            size: pngHeader.length,
            createdAt: now.toISOString(),
            sha256,
            originalFileName: "test-image.png",
            alt: "Test-Bild für KI-Analyse",
        };

        const metaPath = join(folderPath, `${TEST_MEDIA_ID}.meta.json`);
        await writeFile(metaPath, JSON.stringify(meta, null, 2));

        console.log("✅ Test-Medium erstellt:");
        console.log(`   - ID: ${TEST_MEDIA_ID}`);
        console.log(`   - Pfad: ${folderPath}`);
        console.log(`   - SHA256: ${sha256}`);

        return { success: true, mediaId: TEST_MEDIA_ID };
    } catch (error) {
        console.error("❌ Fehler beim Erstellen des Test-Mediums:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Testet einen API-Endpunkt
 */
async function testEndpoint(name, method, path, body = null, headers = {}) {
    try {
        const url = `${API_BASE}${path}`;
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        return {
            name,
            success: response.status === 200 || response.status === 201,
            status: response.status,
            data,
            error: response.status !== 200 && response.status !== 201 ? data.message || "Unbekannter Fehler" : null,
        };
    } catch (error) {
        return {
            name,
            success: false,
            status: 0,
            data: null,
            error: error.message,
        };
    }
}

/**
 * Hauptfunktion
 */
async function main() {
    console.log("🚀 Starte Media AI API Tests...\n");

    // 1. Test-Medium erstellen
    console.log("📦 Erstelle Test-Medium...");
    const setupResult = await createTestMediaFile();
    testResults.setup = setupResult;

    if (!setupResult.success) {
        console.error("❌ Setup fehlgeschlagen - Tests abgebrochen");
        process.exit(1);
    }

    // 2. Warte auf Server
    console.log("\n⏳ Warte auf Server...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. API-Tests (ohne Auth - wird 401 geben, aber das ist erwartet)
    console.log("\n🧪 Führe API-Tests aus...\n");

    // Test 1: POST /api/admin/media/ai/analyze
    console.log("Test 1: POST /api/admin/media/ai/analyze");
    const test1 = await testEndpoint(
        "POST /api/admin/media/ai/analyze",
        "POST",
        "/api/admin/media/ai/analyze",
        {
            mediaId: TEST_MEDIA_ID,
            intendedUse: "hero",
            context: "Test-Kontext",
            language: "de",
        }
    );
    testResults.tests.push(test1);
    console.log(`   Status: ${test1.status}`);
    console.log(`   Erfolg: ${test1.success ? "✅" : "❌"}`);
    if (test1.error) console.log(`   Fehler: ${test1.error}`);

    // Test 2: POST /api/admin/media/ai/analyze-batch
    console.log("\nTest 2: POST /api/admin/media/ai/analyze-batch");
    const test2 = await testEndpoint(
        "POST /api/admin/media/ai/analyze-batch",
        "POST",
        "/api/admin/media/ai/analyze-batch",
        {
            mediaIds: [TEST_MEDIA_ID],
            intendedUse: "thumbnail",
            language: "de",
        }
    );
    testResults.tests.push(test2);
    console.log(`   Status: ${test2.status}`);
    console.log(`   Erfolg: ${test2.success ? "✅" : "❌"}`);
    if (test2.error) console.log(`   Fehler: ${test2.error}`);

    // Test 3: POST /api/admin/media/ai/search
    console.log("\nTest 3: POST /api/admin/media/ai/search");
    const test3 = await testEndpoint(
        "POST /api/admin/media/ai/search",
        "POST",
        "/api/admin/media/ai/search",
        {
            query: "test bild dashboard",
            category: "linkedin",
            limit: 10,
        }
    );
    testResults.tests.push(test3);
    console.log(`   Status: ${test3.status}`);
    console.log(`   Erfolg: ${test3.success ? "✅" : "❌"}`);
    if (test3.error) console.log(`   Fehler: ${test3.error}`);

    // Test 4: GET /api/admin/media/ai/similar
    console.log("\nTest 4: GET /api/admin/media/ai/similar");
    const test4 = await testEndpoint(
        "GET /api/admin/media/ai/similar",
        "GET",
        `/api/admin/media/ai/similar?id=${TEST_MEDIA_ID}&limit=5`
    );
    testResults.tests.push(test4);
    console.log(`   Status: ${test4.status}`);
    console.log(`   Erfolg: ${test4.success ? "✅" : "❌"}`);
    if (test4.error) console.log(`   Fehler: ${test4.error}`);

    // Test 5: POST /api/admin/media/ai/approve
    console.log("\nTest 5: POST /api/admin/media/ai/approve");
    const test5 = await testEndpoint(
        "POST /api/admin/media/ai/approve",
        "POST",
        "/api/admin/media/ai/approve",
        {
            mediaId: TEST_MEDIA_ID,
            approveTags: true,
            approveAlt: true,
            approveCategory: true,
            approveDSGVO: false, // Wichtig: Keine automatische DSGVO-Freigabe
        }
    );
    testResults.tests.push(test5);
    console.log(`   Status: ${test5.status}`);
    console.log(`   Erfolg: ${test5.success ? "✅" : "❌"}`);
    if (test5.error) console.log(`   Fehler: ${test5.error}`);

    // Zusammenfassung
    console.log("\n📊 Test-Zusammenfassung:");
    const successCount = testResults.tests.filter((t) => t.success).length;
    const totalCount = testResults.tests.length;
    console.log(`   Erfolgreich: ${successCount}/${totalCount}`);
    console.log(`   Fehlgeschlagen: ${totalCount - successCount}/${totalCount}`);

    // Ergebnisse speichern
    const resultsPath = join(projectRoot, "test-results-media-ai.json");
    await writeFile(resultsPath, JSON.stringify(testResults, null, 2));
    console.log(`\n💾 Ergebnisse gespeichert: ${resultsPath}`);

    // Hinweis zu Auth
    console.log("\n⚠️  HINWEIS: Tests ohne Authentifizierung durchgeführt.");
    console.log("   Für vollständige Tests ist eine gültige Admin-Session erforderlich.");
    console.log("   Erwartete Status-Codes: 401 (Nicht authentifiziert)");
}

main().catch(console.error);






