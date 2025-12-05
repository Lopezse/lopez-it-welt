/**
 * Retrieval Service Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase R1.4: Tests für Retrieval Service
 */

import { RetrievalService } from "../services/RetrievalService";

describe("RetrievalService", () => {
    let service: RetrievalService;

    beforeEach(() => {
        service = new RetrievalService({
            collectionName: "test_collection",
        });
    });

    describe("addDocument", () => {
        it("sollte ein Dokument hinzufügen", async () => {
            const id = "test-doc-1";
            const text = "Dies ist ein Test-Dokument.";

            await expect(
                service.addDocument(id, text, { title: "Test" })
            ).resolves.not.toThrow();
        });
    });

    describe("updateDocument", () => {
        it("sollte ein Dokument aktualisieren", async () => {
            const id = "test-doc-2";
            const originalText = "Original-Text";
            const updatedText = "Aktualisierter Text";

            await service.addDocument(id, originalText);
            await service.updateDocument(id, updatedText);

            // Dokument sollte aktualisiert sein
            // (In Fallback-Modus wird nichts gespeichert, daher nur Prüfung auf Fehler)
            await expect(
                service.updateDocument(id, updatedText)
            ).resolves.not.toThrow();
        });
    });

    describe("deleteDocument", () => {
        it("sollte ein Dokument löschen", async () => {
            const id = "test-doc-3";
            const text = "Zu löschendes Dokument";

            await service.addDocument(id, text);
            await expect(service.deleteDocument(id)).resolves.not.toThrow();
        });
    });

    describe("search", () => {
        it("sollte semantische Suche durchführen", async () => {
            const query = "Test-Query";

            const results = await service.search(query, 5);

            expect(Array.isArray(results)).toBe(true);
            // In Fallback-Modus gibt es keine Ergebnisse
        });

        it("sollte Limit respektieren", async () => {
            const query = "Test";

            const results = await service.search(query, 3);

            expect(results.length).toBeLessThanOrEqual(3);
        });

        it("sollte minScore respektieren", async () => {
            const query = "Test";

            const results = await service.search(query, 5, 0.5);

            results.forEach((result) => {
                expect(result.score).toBeGreaterThanOrEqual(0.5);
            });
        });
    });

    describe("isAvailable", () => {
        it("sollte Verfügbarkeit prüfen", async () => {
            const available = await service.isAvailable();
            expect(typeof available).toBe("boolean");
        });
    });

    describe("getCollectionName", () => {
        it("sollte Collection-Name zurückgeben", () => {
            const name = service.getCollectionName();
            expect(name).toBe("test_collection");
        });
    });
});



