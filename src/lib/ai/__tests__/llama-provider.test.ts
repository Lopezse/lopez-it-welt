/**
 * LLaMA Provider Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.4: Tests für LLaMA-Provider
 */

import { LLaMAProvider, createLLaMAProvider } from "../providers/llama-provider";
import { ProviderError } from "../core/ai-provider";

describe("LLaMAProvider", () => {
    let provider: LLaMAProvider;

    beforeEach(() => {
        provider = createLLaMAProvider({
            serverUrl: "http://localhost:11434",
            model: "llama3.2:1b",
        });
    });

    describe("Konstruktor", () => {
        it("sollte Provider mit Standard-Konfiguration erstellen", () => {
            const defaultProvider = createLLaMAProvider();
            expect(defaultProvider.name).toBe("llama:llama3.2:1b");
            expect(defaultProvider.version).toBe("1.0.0");
            expect(defaultProvider.supportsJson).toBe(false);
        });

        it("sollte Provider mit benutzerdefinierter Konfiguration erstellen", () => {
            const customProvider = createLLaMAProvider({
                serverUrl: "http://custom-server:11434",
                model: "mistral:7b",
            });
            expect(customProvider.name).toBe("llama:mistral:7b");
        });
    });

    describe("isAvailable", () => {
        it("sollte true zurückgeben wenn Ollama läuft", async () => {
            // Nur testen wenn Ollama tatsächlich läuft
            const available = await provider.isAvailable();
            // Kann true oder false sein, je nachdem ob Ollama läuft
            expect(typeof available).toBe("boolean");
        });
    });

    describe("requestText", () => {
        it("sollte Text-Response zurückgeben", async () => {
            // Nur testen wenn Ollama läuft
            const available = await provider.isAvailable();
            if (!available) {
                console.log("⚠️ Ollama läuft nicht - Skipping requestText Test");
                return;
            }

            const response = await provider.requestText("Hallo, wie geht es dir?");
            expect(typeof response).toBe("string");
            expect(response.length).toBeGreaterThan(0);
        }, 30000); // Timeout: 30 Sekunden

        it("sollte ProviderError werfen wenn Server nicht erreichbar", async () => {
            const offlineProvider = createLLaMAProvider({
                serverUrl: "http://localhost:9999", // Nicht existierender Port
                model: "llama3.2:1b",
            });

            await expect(offlineProvider.requestText("Test")).rejects.toThrow(ProviderError);
        }, 10000);
    });

    describe("requestJson", () => {
        it("sollte JSON aus Text extrahieren", async () => {
            // Nur testen wenn Ollama läuft
            const available = await provider.isAvailable();
            if (!available) {
                console.log("⚠️ Ollama läuft nicht - Skipping requestJson Test");
                return;
            }

            const schema = {
                type: "object",
                properties: {
                    tags: { type: "array", items: { type: "string" } },
                },
            };

            const response = await provider.requestJson<{ tags: string[] }>(
                "Erstelle 3 Tags für ein Admin-Dashboard. Antworte nur mit JSON: {tags: [\"tag1\", \"tag2\", \"tag3\"]}",
                schema
            );

            expect(response).toHaveProperty("tags");
            expect(Array.isArray(response.tags)).toBe(true);
        }, 30000);
    });

    describe("estimateCost", () => {
        it("sollte 0 zurückgeben für lokale Installation", () => {
            const cost = provider.estimateCost(100, 50);
            expect(cost).toBe(0);
        });

        it("sollte berechnete Kosten zurückgeben wenn Server-Kosten gesetzt", () => {
            // Temporär ENV setzen (nur für Test)
            const originalCost = process.env.LLAMA_MONTHLY_COST;
            const originalRequests = process.env.LLAMA_EXPECTED_REQUESTS;

            process.env.LLAMA_MONTHLY_COST = "300";
            process.env.LLAMA_EXPECTED_REQUESTS = "10000";

            const cost = provider.estimateCost(100, 50);
            expect(cost).toBe(0.03); // 300 / 10000

            // Zurücksetzen
            if (originalCost) process.env.LLAMA_MONTHLY_COST = originalCost;
            else delete process.env.LLAMA_MONTHLY_COST;
            if (originalRequests) process.env.LLAMA_EXPECTED_REQUESTS = originalRequests;
            else delete process.env.LLAMA_EXPECTED_REQUESTS;
        });
    });
});



