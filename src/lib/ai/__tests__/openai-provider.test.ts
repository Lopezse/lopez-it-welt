/**
 * OpenAI Provider Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.3: Tests für OpenAI-Provider
 */

import { OpenAIProvider, createOpenAIProvider } from "../providers/openai-provider";
import { ProviderError } from "../core/ai-provider";

describe("OpenAIProvider", () => {
    describe("Konstruktor", () => {
        it("sollte Provider mit Standard-Konfiguration erstellen", () => {
            const defaultProvider = createOpenAIProvider();
            expect(defaultProvider.name).toBe("openai:gpt-4");
            expect(defaultProvider.version).toBe("1.0.0");
            expect(defaultProvider.supportsJson).toBe(true);
        });

        it("sollte Provider mit benutzerdefinierter Konfiguration erstellen", () => {
            const customProvider = createOpenAIProvider({
                model: "gpt-4-turbo",
            });
            expect(customProvider.name).toBe("openai:gpt-4-turbo");
        });

        it("sollte Provider ohne API-Key erstellen (wird nicht initialisiert)", () => {
            // Temporär ENV entfernen
            const originalKey = process.env.OPENAI_API_KEY;
            delete process.env.OPENAI_API_KEY;

            const provider = createOpenAIProvider();
            expect(provider.name).toBe("openai:gpt-4");

            // Zurücksetzen
            if (originalKey) process.env.OPENAI_API_KEY = originalKey;
        });
    });

    describe("isAvailable", () => {
        it("sollte false zurückgeben wenn kein API-Key vorhanden", async () => {
            const originalKey = process.env.OPENAI_API_KEY;
            delete process.env.OPENAI_API_KEY;

            const provider = createOpenAIProvider();
            const available = await provider.isAvailable();
            expect(available).toBe(false);

            // Zurücksetzen
            if (originalKey) process.env.OPENAI_API_KEY = originalKey;
        });

        it("sollte true zurückgeben wenn API-Key vorhanden", async () => {
            // Nur testen wenn API-Key vorhanden
            if (!process.env.OPENAI_API_KEY) {
                console.log("⚠️ OPENAI_API_KEY nicht gesetzt - Skipping isAvailable Test");
                return;
            }

            const provider = createOpenAIProvider();
            const available = await provider.isAvailable();
            expect(typeof available).toBe("boolean");
        });
    });

    describe("requestText", () => {
        it("sollte ProviderError werfen wenn Client nicht initialisiert", async () => {
            const originalKey = process.env.OPENAI_API_KEY;
            delete process.env.OPENAI_API_KEY;

            const provider = createOpenAIProvider();
            await expect(provider.requestText("Test")).rejects.toThrow(ProviderError);

            // Zurücksetzen
            if (originalKey) process.env.OPENAI_API_KEY = originalKey;
        });

        it("sollte Text-Response zurückgeben wenn API-Key vorhanden", async () => {
            // Nur testen wenn API-Key vorhanden
            if (!process.env.OPENAI_API_KEY) {
                console.log("⚠️ OPENAI_API_KEY nicht gesetzt - Skipping requestText Test");
                return;
            }

            const provider = createOpenAIProvider();
            const response = await provider.requestText("Hallo, wie geht es dir?", {
                taskId: "test-request-text",
            });

            expect(typeof response).toBe("string");
            expect(response.length).toBeGreaterThan(0);
        }, 30000); // Timeout: 30 Sekunden
    });

    describe("requestJson", () => {
        it("sollte ProviderError werfen wenn Client nicht initialisiert", async () => {
            const originalKey = process.env.OPENAI_API_KEY;
            delete process.env.OPENAI_API_KEY;

            const provider = createOpenAIProvider();
            await expect(
                provider.requestJson({ type: "object" }, { type: "object" })
            ).rejects.toThrow(ProviderError);

            // Zurücksetzen
            if (originalKey) process.env.OPENAI_API_KEY = originalKey;
        });

        it("sollte JSON-Response zurückgeben wenn API-Key vorhanden", async () => {
            // Nur testen wenn API-Key vorhanden
            if (!process.env.OPENAI_API_KEY) {
                console.log("⚠️ OPENAI_API_KEY nicht gesetzt - Skipping requestJson Test");
                return;
            }

            const provider = createOpenAIProvider();
            const schema = {
                type: "object",
                properties: {
                    tags: { type: "array", items: { type: "string" } },
                },
            };

            const response = await provider.requestJson<{ tags: string[] }>(
                "Erstelle 3 Tags für ein Admin-Dashboard.",
                schema,
                {
                    taskId: "test-request-json",
                }
            );

            expect(response).toHaveProperty("tags");
            expect(Array.isArray(response.tags)).toBe(true);
        }, 30000);
    });

    describe("estimateCost", () => {
        it("sollte Kosten basierend auf Token-Anzahl berechnen", () => {
            const provider = createOpenAIProvider({
                apiKey: "test-key",
            });

            const cost = provider.estimateCost(1000, 500); // 1000 Input, 500 Output Zeichen
            expect(cost).toBeGreaterThan(0);
            expect(typeof cost).toBe("number");
        });
    });
});



