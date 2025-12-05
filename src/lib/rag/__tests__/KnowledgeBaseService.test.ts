/**
 * Knowledge Base Service Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase R1.2: Tests für Knowledge Base Service
 */

import { KnowledgeBaseService } from "../services/KnowledgeBaseService";
import type { KnowledgeEntryInput, KnowledgeCategoryInput } from "../types";

describe("KnowledgeBaseService", () => {
    let service: KnowledgeBaseService;

    beforeEach(() => {
        service = new KnowledgeBaseService();
    });

    describe("create", () => {
        it("sollte einen neuen Wissens-Eintrag erstellen", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Test-Titel",
                content: "Test-Inhalt",
            };

            const id = await service.create(knowledge);
            expect(id).toBeDefined();
            expect(typeof id).toBe("string");
        });

        it("sollte Metadaten speichern", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Test mit Metadaten",
                content: "Inhalt",
                metadata: { key: "value", number: 123 },
            };

            const id = await service.create(knowledge);
            const entry = await service.read(id);

            expect(entry).not.toBeNull();
            expect(entry?.metadata).toEqual({ key: "value", number: 123 });
        });
    });

    describe("read", () => {
        it("sollte einen Wissens-Eintrag lesen", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Test-Titel",
                content: "Test-Inhalt",
            };

            const id = await service.create(knowledge);
            const entry = await service.read(id);

            expect(entry).not.toBeNull();
            expect(entry?.id).toBe(id);
            expect(entry?.title).toBe("Test-Titel");
            expect(entry?.content).toBe("Test-Inhalt");
            expect(entry?.category).toBe("test");
        });

        it("sollte null zurückgeben wenn Eintrag nicht existiert", async () => {
            const entry = await service.read("non-existent-id");
            expect(entry).toBeNull();
        });
    });

    describe("update", () => {
        it("sollte einen Wissens-Eintrag aktualisieren", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Original-Titel",
                content: "Original-Inhalt",
            };

            const id = await service.create(knowledge);
            await service.update(id, { title: "Neuer Titel" });

            const updated = await service.read(id);
            expect(updated?.title).toBe("Neuer Titel");
            expect(updated?.content).toBe("Original-Inhalt"); // Unverändert
        });
    });

    describe("delete", () => {
        it("sollte einen Wissens-Eintrag löschen", async () => {
            const knowledge: KnowledgeEntryInput = {
                category: "test",
                title: "Zu löschender Eintrag",
                content: "Inhalt",
            };

            const id = await service.create(knowledge);
            await service.delete(id);

            const deleted = await service.read(id);
            expect(deleted).toBeNull();
        });
    });

    describe("list", () => {
        it("sollte alle Wissens-Einträge auflisten", async () => {
            await service.create({
                category: "test",
                title: "Eintrag 1",
                content: "Inhalt 1",
            });
            await service.create({
                category: "test",
                title: "Eintrag 2",
                content: "Inhalt 2",
            });

            const entries = await service.list();
            expect(entries.length).toBeGreaterThanOrEqual(2);
        });

        it("sollte nach Kategorie filtern", async () => {
            await service.create({
                category: "category1",
                title: "Eintrag 1",
                content: "Inhalt",
            });
            await service.create({
                category: "category2",
                title: "Eintrag 2",
                content: "Inhalt",
            });

            const entries = await service.list("category1");
            expect(entries.every((e) => e.category === "category1")).toBe(true);
        });
    });

    describe("search", () => {
        it("sollte nach Text suchen", async () => {
            await service.create({
                category: "test",
                title: "Suchbarer Titel",
                content: "Inhalt mit Suchbegriff",
            });

            const results = await service.search("Suchbegriff");
            expect(results.length).toBeGreaterThan(0);
            expect(results.some((r) => r.content.includes("Suchbegriff"))).toBe(true);
        });
    });

    describe("createCategory", () => {
        it("sollte eine neue Kategorie erstellen", async () => {
            const category: KnowledgeCategoryInput = {
                name: "test-category",
                description: "Test-Beschreibung",
            };

            const id = await service.createCategory(category);
            expect(id).toBeDefined();
        });
    });

    describe("listCategories", () => {
        it("sollte alle Kategorien auflisten", async () => {
            await service.createCategory({
                name: "category1",
                description: "Beschreibung 1",
            });
            await service.createCategory({
                name: "category2",
                description: "Beschreibung 2",
            });

            const categories = await service.listCategories();
            expect(categories.length).toBeGreaterThanOrEqual(2);
        });
    });
});



