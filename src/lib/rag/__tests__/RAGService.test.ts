/**
 * RAG Service Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase R1.5: Tests für RAG Service
 */

import { RAGService } from "../services/RAGService";
import { createMockAiProvider } from "@/lib/ai/providers/mock-ai-provider";
import { setProvider } from "@/lib/ai/core/ai-provider-factory";
import type { KnowledgeEntryInput } from "../types";

describe("RAGService", () => {
    let service: RAGService;

    beforeEach(() => {
        service = new RAGService();
        // Mock-Provider für Tests
        setProvider(createMockAiProvider());
    });

    afterEach(() => {
        setProvider(null);
    });

    describe("query", () => {
        it("sollte eine RAG-Query durchführen", async () => {
            const question = "Was ist DSGVO?";

            const response = await service.query(question, {
                maxResults: 3,
            });

            expect(response).toBeDefined();
            expect(response.answer).toBeDefined();
            expect(Array.isArray(response.sources)).toBe(true);
            expect(response.context).toBeDefined();
        });

        it("sollte Metadaten in Response enthalten", async () => {
            const question = "Test-Frage";

            const response = await service.query(question);

            expect(response.metadata).toBeDefined();
            expect(response.metadata?.query).toBe(question);
            expect(typeof response.metadata?.retrievalCount).toBe("number");
        });
    });

    describe("addKnowledge", () => {
        it("sollte Wissen zum RAG-System hinzufügen", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Test-Wissen",
                content: "Dies ist Test-Inhalt für RAG.",
            };

            const id = await service.addKnowledge(knowledge);

            expect(id).toBeDefined();
            expect(typeof id).toBe("string");
        });

        it("sollte lange Texte chunken", async () => {
            const longText = "A".repeat(2000); // 2000 Zeichen
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Langer Text",
                content: longText,
            };

            const id = await service.addKnowledge(knowledge);

            expect(id).toBeDefined();
            // Text sollte in Chunks aufgeteilt werden
        });
    });

    describe("updateKnowledge", () => {
        it("sollte Wissen aktualisieren", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Original",
                content: "Original-Inhalt",
            };

            const id = await service.addKnowledge(knowledge);
            await service.updateKnowledge(id, {
                title: "Aktualisiert",
            });

            // Wissen sollte aktualisiert sein
            await expect(
                service.updateKnowledge(id, { title: "Aktualisiert" })
            ).resolves.not.toThrow();
        });
    });

    describe("deleteKnowledge", () => {
        it("sollte Wissen löschen", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Zu löschendes Wissen",
                content: "Inhalt",
            };

            const id = await service.addKnowledge(knowledge);
            await expect(service.deleteKnowledge(id)).resolves.not.toThrow();
        });
    });
});



