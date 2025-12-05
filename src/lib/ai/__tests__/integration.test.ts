/**
 * AI Provider Integration Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.6: Integrationstests für AI Provider System
 */

import { getProvider, createProvider, setProvider, ProviderConfig } from "../core/ai-provider-factory";
import { createMockAiProvider } from "../providers/mock-ai-provider";
import { AiProvider } from "../core/ai-provider";

describe("AI Provider Integration", () => {
    beforeEach(() => {
        // Reset Singleton für jeden Test
        setProvider(null);
    });

    describe("Factory", () => {
        it("sollte Mock-Provider erstellen", () => {
            const provider = createProvider({ type: "mock" });
            expect(provider.name).toBe("mock:test");
            expect(provider.supportsJson).toBe(true);
        });

        it("sollte LLaMA-Provider erstellen", () => {
            const provider = createProvider({
                type: "llama",
                serverUrl: "http://localhost:11434",
                model: "llama3.2:1b",
            });
            expect(provider.name).toBe("llama:llama3.2:1b");
            expect(provider.supportsJson).toBe(false);
        });

        it("sollte OpenAI-Provider erstellen", () => {
            const provider = createProvider({
                type: "openai",
                apiKey: "test-key",
                model: "gpt-4",
            });
            expect(provider.name).toBe("openai:gpt-4");
            expect(provider.supportsJson).toBe(true);
        });

        it("sollte Fehler werfen bei unbekanntem Provider", () => {
            expect(() => {
                createProvider({ type: "unknown" as any });
            }).toThrow("Unknown provider type");
        });
    });

    describe("Singleton getProvider()", () => {
        it("sollte immer dieselbe Instanz zurückgeben", () => {
            // Setze Mock-Provider
            const mockProvider = createMockAiProvider();
            setProvider(mockProvider);

            const provider1 = getProvider();
            const provider2 = getProvider();

            expect(provider1).toBe(provider2);
            expect(provider1).toBe(mockProvider);
        });

        it("sollte Provider aus ENV erstellen wenn keine Instanz gesetzt", () => {
            // ENV setzen
            const originalEnv = process.env.AI_PROVIDER;
            process.env.AI_PROVIDER = "mock";

            const provider = getProvider();
            expect(provider.name).toBe("mock:test");

            // Zurücksetzen
            if (originalEnv) process.env.AI_PROVIDER = originalEnv;
            else delete process.env.AI_PROVIDER;
        });
    });

    describe("Provider-Funktionalität", () => {
        it("sollte requestText() mit Mock-Provider funktionieren", async () => {
            const provider = createProvider({ type: "mock" });
            const response = await provider.requestText("Test-Prompt", {
                taskId: "test",
            });

            expect(response).toContain("MOCK_RESPONSE");
            expect(response).toContain("Test-Prompt");
        });

        it("sollte requestJson() mit Mock-Provider funktionieren", async () => {
            const provider = createProvider({ type: "mock" });
            const response = await provider.requestJson<{ tags: string[] }>(
                "Erstelle Tags",
                {
                    type: "object",
                    properties: {
                        tags: { type: "array", items: { type: "string" } },
                    },
                },
                {
                    taskId: "test",
                }
            );

            expect(response).toHaveProperty("tags");
            expect(Array.isArray(response.tags)).toBe(true);
        });

        it("sollte isAvailable() mit Mock-Provider funktionieren", async () => {
            const provider = createProvider({ type: "mock" });
            const available = await provider.isAvailable();
            expect(available).toBe(true);
        });

        it("sollte estimateCost() mit Mock-Provider funktionieren", () => {
            const provider = createProvider({ type: "mock" });
            const cost = provider.estimateCost(100, 50);
            expect(cost).toBe(0); // Mock ist kostenlos
        });
    });

    describe("Provider-Wechsel", () => {
        it("sollte zwischen Providern wechseln können", () => {
            const mockProvider = createProvider({ type: "mock" });
            setProvider(mockProvider);
            expect(getProvider().name).toBe("mock:test");

            const llamaProvider = createProvider({
                type: "llama",
                serverUrl: "http://localhost:11434",
            });
            setProvider(llamaProvider);
            expect(getProvider().name).toBe("llama:llama3.2:1b");
        });
    });
});



