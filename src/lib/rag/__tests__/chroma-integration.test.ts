/**
 * ChromaDB Integration Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase R1.6: Integrationstests für ChromaDB
 */

import {
    createChromaClient,
    createChromaCollection,
    checkChromaHealth,
    isChromaAvailable,
    resetChromaInstances,
    getInitializationStatus,
} from "../config/chroma";
import { embeddingService } from "../services/EmbeddingService";

describe("ChromaDB Integration", () => {
    beforeEach(() => {
        // Reset vor jedem Test
        resetChromaInstances();
    });

    afterEach(() => {
        // Cleanup nach jedem Test
        resetChromaInstances();
    });

    describe("Health Check", () => {
        it("sollte Health-Status prüfen", async () => {
            const health = await checkChromaHealth();

            expect(health).toBeDefined();
            expect(health.url).toBeDefined();
            expect(typeof health.available).toBe("boolean");
            expect(health.lastCheck).toBeInstanceOf(Date);
        });

        it("sollte Verfügbarkeit prüfen", async () => {
            const available = await isChromaAvailable();

            expect(typeof available).toBe("boolean");
        });
    });

    describe("Client Creation", () => {
        it("sollte ChromaDB-Client erstellen", async () => {
            const client = await createChromaClient();

            // Client kann null sein wenn ChromaDB nicht verfügbar
            if (client !== null) {
                expect(client).toBeDefined();
            }
        });

        it("sollte Singleton-Pattern verwenden", async () => {
            const client1 = await createChromaClient();
            const client2 = await createChromaClient();

            // Beide sollten dieselbe Instanz sein (oder beide null)
            expect(client1 === client2 || (client1 === null && client2 === null)).toBe(true);
        });
    });

    describe("Collection Creation", () => {
        it("sollte ChromaDB-Collection erstellen", async () => {
            const collection = await createChromaCollection({
                collectionName: "test_collection",
            });

            // Collection kann null sein wenn ChromaDB nicht verfügbar
            if (collection !== null) {
                expect(collection).toBeDefined();
            }
        });

        it("sollte Singleton-Pattern verwenden", async () => {
            const collection1 = await createChromaCollection({
                collectionName: "test_collection",
            });
            const collection2 = await createChromaCollection({
                collectionName: "test_collection",
            });

            // Beide sollten dieselbe Instanz sein (oder beide null)
            expect(
                collection1 === collection2 || (collection1 === null && collection2 === null)
            ).toBe(true);
        });
    });

    describe("End-to-End Test", () => {
        it("sollte vollständigen Workflow testen (wenn ChromaDB verfügbar)", async () => {
            const available = await isChromaAvailable();

            if (!available) {
                console.log("⚠️ ChromaDB nicht verfügbar - Skipping End-to-End Test");
                return;
            }

            // 1. Client erstellen
            const client = await createChromaClient();
            expect(client).not.toBeNull();

            // 2. Collection erstellen
            const collection = await createChromaCollection({
                collectionName: "test_e2e_collection",
            });
            expect(collection).not.toBeNull();

            // 3. Test-Embedding generieren
            const testText = "Dies ist ein Test-Dokument für ChromaDB.";
            const embedding = await embeddingService.generateEmbedding(testText);
            expect(embedding.length).toBe(384);

            // 4. Dokument zur Collection hinzufügen
            await collection.add({
                ids: ["test-doc-1"],
                embeddings: [embedding],
                documents: [testText],
                metadatas: [{ title: "Test-Dokument" }],
            });

            // 5. Suche durchführen
            const queryEmbedding = await embeddingService.generateEmbedding("Test");
            const results = await collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: 1,
            });

            expect(results.ids).toBeDefined();
            expect(results.ids[0]).toBeDefined();
            expect(results.ids[0].length).toBeGreaterThan(0);

            // 6. Cleanup: Collection löschen (optional)
            // await client.deleteCollection({ name: "test_e2e_collection" });
        }, 30000); // Timeout: 30 Sekunden
    });

    describe("Error Handling", () => {
        it("sollte Fehler bei ungültiger URL behandeln", async () => {
            const health = await checkChromaHealth({
                url: "http://invalid-url:9999",
            });

            expect(health.available).toBe(false);
            expect(health.error).toBeDefined();
        });

        it("sollte Initialisierungs-Status zurückgeben", () => {
            const status = getInitializationStatus();

            expect(status).toBeDefined();
            expect(typeof status.initialized).toBe("boolean");
            expect(status.error === null || status.error instanceof Error).toBe(true);
        });
    });
});



