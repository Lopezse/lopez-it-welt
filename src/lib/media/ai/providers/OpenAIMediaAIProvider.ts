/**
 * OpenAI Media AI Provider - Enterprise++ Standard
 * 
 * Implementierung des MediaAIProvider-Interfaces für OpenAI GPT-4 Vision
 * 
 * @created 2025-01-27
 * @purpose Phase 3.2: OpenAI-Integration
 */

import OpenAI from "openai";
import { MediaAIProvider, ProviderError, ProviderStatus, AnalysisOptions, CostEstimate } from "./types";
import type { FullAIAnalysisResult, TaggingResult, AltTextResult, QualityCheckResult, CategoryResult, PersonDetectionResult, CICheckResult } from "../types";
import { getOpenAIApiKey, MEDIA_AI_PROVIDER, OPENAI_SECRET_REF } from "../config";
import { SecretManager } from "../secret-manager";

/**
 * OpenAI Media AI Provider
 * 
 * Nutzt GPT-4 Vision für Bildanalyse
 */
export class OpenAIMediaAIProvider implements MediaAIProvider {
    private client: OpenAI | null = null;
    private model: string;
    private version: string = "1.0.0";

    constructor() {
        // Model aus ENV lesen (z.B. "gpt-4-vision-preview" oder "gpt-4.1-mini")
        this.model = process.env.OPENAI_MODEL || "gpt-4-vision-preview";
        
        // Client initialisieren (nur wenn Provider aktiv ist)
        if (MEDIA_AI_PROVIDER === "openai") {
            try {
                const apiKey = getOpenAIApiKey();
                if (!apiKey || apiKey.length === 0) {
                    throw new Error("OpenAI API Key not found");
                }
                
                this.client = new OpenAI({
                    apiKey: apiKey,
                    // WICHTIG: Keine API-Keys in Logs!
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                console.error("❌ Fehler beim Initialisieren des OpenAI-Clients:", errorMessage);
                // Client bleibt null - isAvailable() wird false zurückgeben
            }
        }
    }

    getName(): string {
        return "openai";
    }

    getVersion(): string {
        return this.version;
    }

    async isAvailable(): Promise<ProviderStatus> {
        if (!this.client) {
            return {
                available: false,
                error: "OpenAI client not initialized",
            };
        }

        try {
            // Test-Request (minimal) um Verfügbarkeit zu prüfen
            // Alternativ: Nur prüfen, ob API-Key vorhanden ist
            const apiKey = getOpenAIApiKey();
            if (!apiKey || apiKey.length === 0) {
                return {
                    available: false,
                    error: "OpenAI API Key not configured",
                };
            }

            return {
                available: true,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            // WICHTIG: Keine API-Keys oder sensible Daten loggen!
            return {
                available: false,
                error: `OpenAI not available: ${errorMessage}`,
            };
        }
    }

    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult> {
        if (!this.client) {
            throw new ProviderError(
                "OpenAI client not initialized",
                "openai",
                "API_ERROR",
                false
            );
        }

        try {
            // Bild als Base64 kodieren
            const base64Image = imageBuffer.toString("base64");
            const imageUrl = `data:${mimeType};base64,${base64Image}`;

            // Prompt für umfassende Bildanalyse
            const prompt = this.buildAnalysisPrompt(options);

            // OpenAI API-Call
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageUrl,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 2000,
                temperature: 0.3, // Niedrige Temperatur für konsistente Ergebnisse
            });

            // Parse Response
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new ProviderError(
                    "No response from OpenAI",
                    "openai",
                    "API_ERROR",
                    true
                );
            }

            // Parse JSON aus Response
            const analysisResult = this.parseOpenAIResponse(content);

            // Vollständiges Ergebnis zusammenstellen
            const result: FullAIAnalysisResult = {
                analyzed_at: new Date().toISOString(),
                model_version: `${this.model}-${this.version}`,
            };

            // Tags
            if (analysisResult.tags) {
                result.tags = {
                    tags: analysisResult.tags.tags || [],
                    confidence_scores: analysisResult.tags.confidence_scores || {},
                };
            }

            // Alt-Text
            if (analysisResult.alt_text) {
                result.alt_text = {
                    description: analysisResult.alt_text.description || "",
                    language: options?.language || "de",
                    confidence: analysisResult.alt_text.confidence || 0.8,
                };
            }

            // Quality
            if (analysisResult.quality) {
                result.quality = {
                    score: analysisResult.quality.score || 70,
                    warnings: analysisResult.quality.warnings || [],
                    recommendations: analysisResult.quality.recommendations || [],
                    isSuitableFor: analysisResult.quality.isSuitableFor || {
                        hero: false,
                        thumbnail: true,
                        card: true,
                    },
                };
            }

            // Category
            if (analysisResult.category) {
                result.category = {
                    category: analysisResult.category.category || "other",
                    confidence: analysisResult.category.confidence || 0.7,
                    alternatives: analysisResult.category.alternatives || [],
                };
            }

            // Person Detection (DSGVO)
            if (analysisResult.person_detection) {
                result.person_detection = {
                    has_person: analysisResult.person_detection.has_person || false,
                    person_count: analysisResult.person_detection.person_count,
                    faces_detected: analysisResult.person_detection.faces_detected,
                    requires_dsgvo_review: analysisResult.person_detection.has_person || false,
                };
            }

            // CI Compliance
            if (analysisResult.ci_compliance) {
                result.ci_compliance = {
                    logo_detected: analysisResult.ci_compliance.logo_detected || false,
                    color_deviation: analysisResult.ci_compliance.color_deviation || 0,
                    warnings: analysisResult.ci_compliance.warnings || [],
                    recommendations: analysisResult.ci_compliance.recommendations || [],
                };
            }

            return result;
        } catch (error) {
            // Fehlerbehandlung
            if (error instanceof ProviderError) {
                throw error;
            }

            // OpenAI-spezifische Fehler
            if (error instanceof Error) {
                // Rate Limit
                if (error.message.includes("rate_limit") || error.message.includes("429")) {
                    throw new ProviderError(
                        "OpenAI rate limit exceeded",
                        "openai",
                        "RATE_LIMIT",
                        true,
                        new Date(Date.now() + 60000) // Retry nach 1 Minute
                    );
                }

                // Auth Error
                if (error.message.includes("401") || error.message.includes("unauthorized")) {
                    throw new ProviderError(
                        "OpenAI authentication failed",
                        "openai",
                        "AUTH_ERROR",
                        false
                    );
                }

                // Timeout
                if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
                    throw new ProviderError(
                        "OpenAI request timeout",
                        "openai",
                        "TIMEOUT",
                        true
                    );
                }
            }

            // Generischer Fehler
            throw new ProviderError(
                `OpenAI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                "openai",
                "API_ERROR",
                true
            );
        }
    }

    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate {
        // OpenAI GPT-4 Vision Pricing (Stand: 2025-01-27)
        // Input: $0.01 per 1K tokens
        // Output: $0.03 per 1K tokens
        // Bilder: ~85 tokens pro Bild (1024x1024)
        
        // Geschätzte Tokens für Request
        const estimatedInputTokens = 1000; // Prompt + Bild-Tokens
        const estimatedOutputTokens = 500; // Response
        
        // Kosten pro 1K Tokens
        const inputCostPer1K = 0.01; // USD
        const outputCostPer1K = 0.03; // USD
        
        // Geschätzte Kosten
        const inputCost = (estimatedInputTokens / 1000) * inputCostPer1K;
        const outputCost = (estimatedOutputTokens / 1000) * outputCostPer1K;
        const totalCost = inputCost + outputCost;
        
        return {
            provider: "openai",
            operation: "analyze",
            costUsd: totalCost,
            tokensUsed: estimatedInputTokens + estimatedOutputTokens,
            imagesProcessed: 1,
        };
    }

    /**
     * Baut den Prompt für die Bildanalyse
     */
    private buildAnalysisPrompt(options?: AnalysisOptions): string {
        const language = options?.language || "de";
        const context = options?.context || "";
        const intendedUse = options?.intendedUse || "";

        return `Analysiere dieses Bild umfassend und gib die Ergebnisse als JSON zurück.

WICHTIG: Antworte NUR mit gültigem JSON, kein zusätzlicher Text!

Ergebnis-Struktur:
{
  "tags": {
    "tags": ["tag1", "tag2", ...],
    "confidence_scores": {"tag1": 0.95, "tag2": 0.87, ...}
  },
  "alt_text": {
    "description": "Detaillierte Bildbeschreibung für Barrierefreiheit",
    "confidence": 0.9
  },
  "quality": {
    "score": 85,
    "warnings": ["Warnung 1", "Warnung 2"],
    "recommendations": ["Empfehlung 1"],
    "isSuitableFor": {
      "hero": true,
      "thumbnail": true,
      "card": true
    }
  },
  "category": {
    "category": "screenshot|profilbild|produktfoto|illustration|diagramm|other",
    "confidence": 0.9,
    "alternatives": ["alternative1", "alternative2"]
  },
  "person_detection": {
    "has_person": true/false,
    "person_count": 0,
    "faces_detected": 0
  },
  "ci_compliance": {
    "logo_detected": true/false,
    "color_deviation": 0-100,
    "warnings": ["Warnung 1"],
    "recommendations": ["Empfehlung 1"]
  }
}

Kontext: ${context || "Kein spezifischer Kontext"}
Verwendungszweck: ${intendedUse || "Allgemein"}
Sprache: ${language}

Analysiere das Bild gründlich und gib alle Informationen zurück.`;
    }

    /**
     * Parst die OpenAI-Response (JSON)
     */
    private parseOpenAIResponse(content: string): any {
        try {
            // Versuche JSON zu extrahieren (kann in Code-Blöcken sein)
            let jsonStr = content.trim();
            
            // Entferne Markdown-Code-Blöcke falls vorhanden
            if (jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            } else if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }
            
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (error) {
            console.error("❌ Fehler beim Parsen der OpenAI-Response:", error instanceof Error ? error.message : String(error));
            // Fallback: Versuche strukturierte Daten zu extrahieren
            return this.fallbackParse(content);
        }
    }

    /**
     * Fallback-Parse wenn JSON-Parsing fehlschlägt
     */
    private fallbackParse(content: string): any {
        // Einfacher Fallback - gibt minimale Struktur zurück
        return {
            tags: {
                tags: [],
                confidence_scores: {},
            },
            alt_text: {
                description: content.substring(0, 200), // Erste 200 Zeichen als Beschreibung
                confidence: 0.5,
            },
            quality: {
                score: 70,
                warnings: [],
                recommendations: [],
                isSuitableFor: {
                    hero: false,
                    thumbnail: true,
                    card: true,
                },
            },
            category: {
                category: "other",
                confidence: 0.5,
                alternatives: [],
            },
            person_detection: {
                has_person: false,
            },
            ci_compliance: {
                logo_detected: false,
                color_deviation: 0,
                warnings: [],
                recommendations: [],
            },
        };
    }
}

/**
 * Factory-Funktion für Provider-Erstellung
 */
export function createOpenAIProvider(): OpenAIMediaAIProvider {
    return new OpenAIMediaAIProvider();
}





