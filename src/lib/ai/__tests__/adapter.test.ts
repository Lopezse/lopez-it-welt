/**
 * Adapter Tests - Enterprise++ Standard
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.5: Tests für Adapter-Pattern
 */

import { createOpenAIMediaToAiProviderAdapter } from "../adapters/openai-media-to-ai-provider";
import { createMockAiProvider } from "../providers/mock-ai-provider";
import { ProviderError } from "../core/ai-provider";
import type { MediaAIProvider } from "@/lib/media/ai/providers/types";
import type { FullAIAnalysisResult } from "@/lib/media/ai/types";

// Mock MediaAIProvider für Tests
class MockMediaAIProvider implements MediaAIProvider {
    getName(): string {
        return "mock-media";
    }

    getVersion(): string {
        return "1.0.0";
    }

    async isAvailable(): Promise<{ available: boolean; error?: string }> {
        return { available: true };
    }

    async analyzeImage(): Promise<FullAIAnalysisResult> {
        return {
            analyzed_at: new Date().toISOString(),
            model_version: "mock:1.0.0",
            tags: {
                tags: ["mock-tag-1", "mock-tag-2"],
                confidence_scores: {},
            },
        };
    }

    estimateCost(): { provider: string; operation: string; costUsd: number } {
        return {
            provider: "mock-media",
            operation: "analyze",
            costUsd: 0.01,
        };
    }
}

describe("OpenAIMediaToAiProviderAdapter", () => {
    let mediaProvider: MediaAIProvider;
    let adapter: ReturnType<typeof createOpenAIMediaToAiProviderAdapter>;

    beforeEach(() => {
        mediaProvider = new MockMediaAIProvider();
        adapter = createOpenAIMediaToAiProviderAdapter(mediaProvider);
    });

    describe("Konstruktor", () => {
        it("sollte Adapter mit Media-Provider erstellen", () => {
            expect(adapter.name).toBe("mock-media:adapter");
            expect(adapter.version).toBe("1.0.0");
            expect(adapter.supportsJson).toBe(false);
        });
    });

    describe("requestText", () => {
        it("sollte ProviderError werfen (Media-Provider unterstützt keine Text-Requests)", async () => {
            await expect(adapter.requestText("Test")).rejects.toThrow(ProviderError);
            await expect(adapter.requestText("Test")).rejects.toThrow(
                "does not support text-only requests"
            );
        });
    });

    describe("requestJson", () => {
        it("sollte ProviderError werfen (Media-Provider unterstützt keine JSON-Requests)", async () => {
            await expect(adapter.requestJson({}, {})).rejects.toThrow(ProviderError);
            await expect(adapter.requestJson({}, {})).rejects.toThrow(
                "does not support JSON-only requests"
            );
        });
    });

    describe("analyzeImage", () => {
        it("sollte Bildanalyse durchführen", async () => {
            const imageBuffer = Buffer.from("fake-image-data");
            const result = await adapter.analyzeImage(imageBuffer, "image/png", "Analysiere Bild", {
                taskId: "test",
                requestContext: {
                    locale: "de",
                },
            });

            expect(typeof result).toBe("string");
            expect(result).toContain("analyzed_at");
            expect(result).toContain("tags");
        });
    });

    describe("analyzeImageJson", () => {
        it("sollte strukturiertes Ergebnis zurückgeben", async () => {
            const imageBuffer = Buffer.from("fake-image-data");
            const result = await adapter.analyzeImageJson<FullAIAnalysisResult>(
                imageBuffer,
                "image/png",
                "Analysiere Bild",
                {},
                {
                    taskId: "test",
                }
            );

            expect(result).toHaveProperty("analyzed_at");
            expect(result).toHaveProperty("tags");
        });
    });

    describe("isAvailable", () => {
        it("sollte Verfügbarkeit vom Media-Provider delegieren", async () => {
            const available = await adapter.isAvailable();
            expect(available).toBe(true);
        });
    });

    describe("estimateCost", () => {
        it("sollte Kosten vom Media-Provider konvertieren", () => {
            const cost = adapter.estimateCost(100, 50);
            expect(cost).toBe(0.01); // Mock-Provider gibt 0.01 zurück
        });
    });
});



