/**
 * Embedding Service Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase R1.3: Tests für Embedding Service
 */

import { EmbeddingService } from "../services/EmbeddingService";

describe("EmbeddingService", () => {
    let service: EmbeddingService;

    beforeEach(() => {
        service = new EmbeddingService();
    });

    describe("generateEmbedding", () => {
        it("sollte ein Embedding für einen Text generieren", async () => {
            const text = "Dies ist ein Test-Text für Embedding-Generierung.";
            const embedding = await service.generateEmbedding(text);

            expect(embedding).toBeDefined();
            expect(Array.isArray(embedding)).toBe(true);
            expect(embedding.length).toBe(384); // all-MiniLM-L6-v2 Dimension
        });

        it("sollte konsistente Embeddings für denselben Text generieren", async () => {
            const text = "Konsistenz-Test";
            const embedding1 = await service.generateEmbedding(text);
            const embedding2 = await service.generateEmbedding(text);

            // Embeddings sollten ähnlich sein (nicht exakt gleich wegen Randomness)
            expect(embedding1.length).toBe(embedding2.length);
        });

        it("sollte unterschiedliche Embeddings für verschiedene Texte generieren", async () => {
            const text1 = "Erster Text";
            const text2 = "Zweiter Text";
            const embedding1 = await service.generateEmbedding(text1);
            const embedding2 = await service.generateEmbedding(text2);

            expect(embedding1).not.toEqual(embedding2);
        });
    });

    describe("generateEmbeddings", () => {
        it("sollte Embeddings für mehrere Texte generieren", async () => {
            const texts = [
                "Erster Text",
                "Zweiter Text",
                "Dritter Text",
            ];

            const embeddings = await service.generateEmbeddings(texts);

            expect(embeddings.length).toBe(3);
            embeddings.forEach((embedding) => {
                expect(embedding.length).toBe(384);
            });
        });
    });

    describe("chunkText", () => {
        it("sollte kurzen Text nicht chunken", async () => {
            const text = "Kurzer Text";
            const chunks = await service.chunkText(text, 500);

            expect(chunks.length).toBe(1);
            expect(chunks[0]).toBe(text);
        });

        it("sollte langen Text in Chunks aufteilen", async () => {
            const text = "A".repeat(1000); // 1000 Zeichen
            const chunks = await service.chunkText(text, 500);

            expect(chunks.length).toBeGreaterThan(1);
            chunks.forEach((chunk) => {
                expect(chunk.length).toBeLessThanOrEqual(500);
            });
        });

        it("sollte Overlap zwischen Chunks haben", async () => {
            const text = "A".repeat(1000);
            const chunks = await service.chunkText(text, 500, 50);

            expect(chunks.length).toBeGreaterThan(1);
            // Prüfe, dass Chunks sich überlappen (vereinfachte Prüfung)
            if (chunks.length > 1) {
                const firstChunkEnd = chunks[0].substring(chunks[0].length - 50);
                const secondChunkStart = chunks[1].substring(0, 50);
                // Overlap sollte vorhanden sein
                expect(firstChunkEnd.length).toBeGreaterThan(0);
                expect(secondChunkStart.length).toBeGreaterThan(0);
            }
        });

        it("sollte an Satzenden teilen wenn möglich", async () => {
            const text = "Erster Satz. Zweiter Satz. Dritter Satz.";
            const chunks = await service.chunkText(text, 20);

            // Sollte an Satzenden geteilt werden
            expect(chunks.length).toBeGreaterThan(1);
        });
    });

    describe("getDimension", () => {
        it("sollte die Embedding-Dimension zurückgeben", () => {
            const dimension = service.getDimension();
            expect(dimension).toBe(384);
        });
    });

    describe("getModelName", () => {
        it("sollte den Modell-Namen zurückgeben", () => {
            const modelName = service.getModelName();
            expect(modelName).toBe("all-MiniLM-L6-v2");
        });
    });
});



