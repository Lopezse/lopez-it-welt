# AI-PROVIDER-DESIGN

## Design-Vorschlag: Allgemeines AIProvider-Interface

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **DESIGN-VORSCHLAG** (Noch nicht aktiv genutzt)  
**Zweck:** Saubere, modulare AI-Provider-Schicht für alle KI-Aufgaben

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert einen **Design-Vorschlag für ein allgemeines AIProvider-Interface**, das später alle KI-Provider (OpenAI, LLaMA lokal, Mistral, Fine-Tune) unterstützen kann. Das Interface ist **noch nicht aktiv genutzt** und dient als Planungsgrundlage für Phase F.2/L1.

**Kernprinzipien:**
- ✅ **Allgemein:** Nicht nur für Media, sondern für alle KI-Aufgaben
- ✅ **Task-basiert:** `requestText()`, `requestJson()` statt spezifische Methoden
- ✅ **Erweiterbar:** Neue Provider können einfach hinzugefügt werden
- ✅ **Sauber getrennt:** Business-Logik nicht im Provider

---

## 1. INTERFACE-DEFINITION

### **1.1 Basis-Interface**

```typescript
// lib/ai/core/ai-provider.ts (NEU - Design-Vorschlag)

/**
 * Optionen für KI-Requests
 */
export interface AiOptions {
    /**
     * Task-ID für Tracking und Logging
     * z.B. "media-tagging", "dsgvo-helper", "content-generation"
     */
    taskId?: string;

    /**
     * Maximale Anzahl Tokens in der Response
     */
    maxTokens?: number;

    /**
     * Temperatur (0.0 = deterministisch, 1.0 = kreativ)
     */
    temperature?: number;

    /**
     * System-Prompt (für Kontext, Verhalten, etc.)
     */
    systemPrompt?: string;

    /**
     * Zusätzliche Metadaten für Tracking/Logging
     */
    metadata?: Record<string, unknown>;
}

/**
 * Basis-Interface für alle KI-Provider
 * 
 * Jeder Provider (OpenAI, LLaMA, Mistral, etc.) muss dieses Interface implementieren.
 */
export interface AiProvider {
    /**
     * Interne Bezeichnung des Providers
     * z.B. "openai:gpt-4.1", "llama:local-1b", "mistral:7b"
     */
    name: string;

    /**
     * Version des Providers
     * z.B. "1.0.0"
     */
    version: string;

    /**
     * Unterstützt dieses Modell strukturiertes JSON?
     * 
     * Wenn true, kann requestJson() verwendet werden.
     * Wenn false, muss requestText() verwendet werden und JSON manuell geparst werden.
     */
    supportsJson: boolean;

    /**
     * Einfacher Text-Completion-Call
     * 
     * @param input Eingabe-Text (Prompt)
     * @param options Optionale Parameter
     * @returns Generierter Text
     * @throws ProviderError bei Fehlern
     */
    requestText(input: string, options?: AiOptions): Promise<string>;

    /**
     * Strukturiertes Ergebnis nach Schema
     * 
     * @param input Eingabe-Text (Prompt)
     * @param schema JSON-Schema für erwartete Struktur
     * @param options Optionale Parameter
     * @returns Strukturiertes Ergebnis (typisiert)
     * @throws ProviderError bei Fehlern oder wenn supportsJson === false
     */
    requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T>;

    /**
     * Prüft, ob der Provider verfügbar ist
     * 
     * @returns true wenn verfügbar, false sonst
     */
    isAvailable(): Promise<boolean>;

    /**
     * Schätzt die Kosten für einen Request
     * 
     * @param inputLength Länge des Input-Texts (in Zeichen)
     * @param estimatedOutputLength Geschätzte Länge der Response (in Zeichen)
     * @param options Optionale Parameter
     * @returns Geschätzte Kosten in USD
     */
    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number;
}
```

---

### **1.2 Erweiterte Interfaces (Optional)**

```typescript
/**
 * Interface für Provider mit Bildanalyse-Unterstützung
 */
export interface VisionAiProvider extends AiProvider {
    /**
     * Analysiert ein Bild
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type (z.B. "image/png")
     * @param prompt Text-Prompt für Analyse
     * @param options Optionale Parameter
     * @returns Analyse-Ergebnis als Text
     */
    analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        options?: AiOptions
    ): Promise<string>;

    /**
     * Analysiert ein Bild mit strukturiertem Ergebnis
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type
     * @param prompt Text-Prompt für Analyse
     * @param schema JSON-Schema für erwartete Struktur
     * @param options Optionale Parameter
     * @returns Strukturiertes Analyse-Ergebnis
     */
    analyzeImageJson<T>(
        imageBuffer: Buffer,
        mimeType: string,
        prompt: string,
        schema: unknown,
        options?: AiOptions
    ): Promise<T>;
}

/**
 * Interface für Provider mit Embedding-Unterstützung
 */
export interface EmbeddingAiProvider extends AiProvider {
    /**
     * Generiert Embeddings für einen Text
     * 
     * @param text Eingabe-Text
     * @param options Optionale Parameter
     * @returns Embedding-Vektor (Array von Zahlen)
     */
    generateEmbedding(text: string, options?: AiOptions): Promise<number[]>;
}
```

---

## 2. PROVIDER-IMPLEMENTIERUNGEN

### **2.1 OpenAI Provider (Beispiel)**

```typescript
// lib/ai/providers/openai-provider.ts (NEU - Design-Vorschlag)

import { AiProvider, AiOptions, ProviderError } from "../core/ai-provider";
import OpenAI from "openai";

export class OpenAIProvider implements AiProvider {
    private client: OpenAI;
    private model: string;

    constructor(config: { apiKey: string; model?: string }) {
        this.client = new OpenAI({ apiKey: config.apiKey });
        this.model = config.model || "gpt-4";
    }

    get name(): string {
        return `openai:${this.model}`;
    }

    get version(): string {
        return "1.0.0";
    }

    get supportsJson(): boolean {
        return true; // GPT-4 unterstützt JSON-Mode
    }

    async requestText(input: string, options?: AiOptions): Promise<string> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
                    { role: "user", content: input },
                ],
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature || 0.7,
            });

            return response.choices[0]?.message?.content || "";
        } catch (error) {
            throw new ProviderError(
                `OpenAI request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
                    { role: "user", content: input },
                ],
                response_format: { type: "json_object" }, // JSON-Mode
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature || 0.7,
            });

            const content = response.choices[0]?.message?.content || "{}";
            return JSON.parse(content) as T;
        } catch (error) {
            throw new ProviderError(
                `OpenAI JSON request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            // Einfacher Health-Check
            await this.client.models.list();
            return true;
        } catch {
            return false;
        }
    }

    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        // OpenAI Pricing (Beispiel)
        const inputTokens = Math.ceil(inputLength / 4); // ~4 Zeichen pro Token
        const outputTokens = Math.ceil(estimatedOutputLength / 4);

        const inputCost = (inputTokens / 1000) * 0.01; // $0.01 pro 1K Tokens
        const outputCost = (outputTokens / 1000) * 0.03; // $0.03 pro 1K Tokens

        return inputCost + outputCost;
    }
}
```

---

### **2.2 LLaMA Provider (Beispiel)**

```typescript
// lib/ai/providers/llama-provider.ts (NEU - Design-Vorschlag)

import { AiProvider, AiOptions, ProviderError } from "../core/ai-provider";

export class LLaMAProvider implements AiProvider {
    private serverUrl: string;
    private model: string;

    constructor(config: { serverUrl: string; model?: string }) {
        this.serverUrl = config.serverUrl || "http://localhost:11434";
        this.model = config.model || "llama3.2:1b";
    }

    get name(): string {
        return `llama:${this.model}`;
    }

    get version(): string {
        return "1.0.0";
    }

    get supportsJson(): boolean {
        return false; // LLaMA unterstützt keinen nativen JSON-Mode
        // JSON muss manuell aus Text extrahiert werden
    }

    async requestText(input: string, options?: AiOptions): Promise<string> {
        try {
            const response = await fetch(`${this.serverUrl}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: this.model,
                    prompt: input,
                    stream: false,
                    options: {
                        temperature: options?.temperature || 0.7,
                        num_predict: options?.maxTokens || 1000,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`LLaMA API error: ${response.statusText}`);
            }

            const result = await response.json();
            return result.response || "";
        } catch (error) {
            throw new ProviderError(
                `LLaMA request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                this.name,
                "API_ERROR",
                true
            );
        }
    }

    async requestJson<T>(input: string, schema: unknown, options?: AiOptions): Promise<T> {
        // LLaMA unterstützt keinen nativen JSON-Mode
        // Wir müssen JSON aus Text extrahieren
        const prompt = `${input}\n\nAntworte NUR mit gültigem JSON, kein zusätzlicher Text!`;
        const text = await this.requestText(prompt, options);

        // Versuche JSON aus Response zu extrahieren
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new ProviderError(
                "LLaMA response does not contain valid JSON",
                this.name,
                "API_ERROR",
                false
            );
        }

        return JSON.parse(jsonMatch[0]) as T;
    }

    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.serverUrl}/api/tags`);
            return response.ok;
        } catch {
            return false;
        }
    }

    estimateCost(inputLength: number, estimatedOutputLength: number, options?: AiOptions): number {
        // Self-Hosted: Keine API-Kosten, nur Server-Kosten
        // Kosten pro Request = Server-Kosten / erwartete Requests pro Monat
        const monthlyServerCost = 300; // Beispiel: 300 USD/Monat
        const expectedRequestsPerMonth = 10000;
        const costPerRequest = monthlyServerCost / expectedRequestsPerMonth;

        return costPerRequest; // Sehr gering, da Self-Hosted
    }
}
```

---

## 3. PROVIDER-FACTORY

### **3.1 Factory-Implementierung**

```typescript
// lib/ai/core/ai-provider-factory.ts (NEU - Design-Vorschlag)

import { AiProvider } from "./ai-provider";
import { OpenAIProvider } from "../providers/openai-provider";
import { LLaMAProvider } from "../providers/llama-provider";

export type ProviderType = "openai" | "llama" | "mistral" | "mock";

export interface ProviderConfig {
    type: ProviderType;
    apiKey?: string; // Für Cloud-Provider
    serverUrl?: string; // Für Self-Hosted Provider
    model?: string;
}

/**
 * Erstellt einen Provider basierend auf Konfiguration
 */
export function createProvider(config: ProviderConfig): AiProvider {
    switch (config.type) {
        case "openai":
            if (!config.apiKey) {
                throw new Error("OpenAI API Key required");
            }
            return new OpenAIProvider({
                apiKey: config.apiKey,
                model: config.model || "gpt-4",
            });

        case "llama":
            return new LLaMAProvider({
                serverUrl: config.serverUrl || "http://localhost:11434",
                model: config.model || "llama3.2:1b",
            });

        case "mock":
            return new MockProvider(); // Mock-Implementierung

        default:
            throw new Error(`Unknown provider type: ${config.type}`);
    }
}

/**
 * Lädt Provider-Konfiguration aus Environment-Variablen
 */
export function loadProviderConfig(): ProviderConfig {
    const providerType = (process.env.AI_PROVIDER || "mock") as ProviderType;

    return {
        type: providerType,
        apiKey: process.env.OPENAI_API_KEY, // Für OpenAI
        serverUrl: process.env.LLAMA_SERVER_URL, // Für LLaMA
        model: process.env.AI_MODEL, // Optional, Provider-spezifisch
    };
}

/**
 * Singleton-Instanz des Providers
 */
let providerInstance: AiProvider | null = null;

/**
 * Gibt die Singleton-Instanz des Providers zurück
 */
export function getProvider(): AiProvider {
    if (!providerInstance) {
        const config = loadProviderConfig();
        providerInstance = createProvider(config);
    }
    return providerInstance;
}
```

---

## 4. VERWENDUNGSBEISPIELE

### **4.1 Text-Generierung**

```typescript
// Beispiel: DSGVO-Helfer

import { getProvider } from "@/lib/ai/core/ai-provider-factory";

async function analyzeDSGVOText(text: string): Promise<{
    hasProblems: boolean;
    problems: string[];
    suggestions: string[];
}> {
    const provider = getProvider();

    const prompt = `Analysiere diesen Text auf DSGVO-Probleme: "${text}"
    
    Gib die Ergebnisse als JSON zurück:
    {
        "hasProblems": true/false,
        "problems": ["Problem 1", "Problem 2"],
        "suggestions": ["Vorschlag 1", "Vorschlag 2"]
    }`;

    if (provider.supportsJson) {
        // Strukturiertes JSON
        return await provider.requestJson<{
            hasProblems: boolean;
            problems: string[];
            suggestions: string[];
        }>(prompt, {
            type: "object",
            properties: {
                hasProblems: { type: "boolean" },
                problems: { type: "array", items: { type: "string" } },
                suggestions: { type: "array", items: { type: "string" } },
            },
        }, {
            taskId: "dsgvo-helper",
            temperature: 0.3, // Niedrige Temperatur für konsistente Ergebnisse
        });
    } else {
        // Text und manuell parsen
        const text = await provider.requestText(prompt, {
            taskId: "dsgvo-helper",
            temperature: 0.3,
        });
        return JSON.parse(text);
    }
}
```

---

### **4.2 Media-Analyse (mit Vision)**

```typescript
// Beispiel: Media-Tagging (nutzt VisionAiProvider)

import { getProvider } from "@/lib/ai/core/ai-provider-factory";
import { VisionAiProvider } from "@/lib/ai/core/ai-provider";

async function analyzeMedia(imageBuffer: Buffer, mimeType: string): Promise<{
    tags: string[];
    altText: string;
    category: string;
}> {
    const provider = getProvider();

    if (!("analyzeImageJson" in provider)) {
        throw new Error("Provider does not support image analysis");
    }

    const visionProvider = provider as VisionAiProvider;

    const prompt = `Analysiere dieses Bild und erstelle:
    1. 5 relevante Tags
    2. Einen barrierefreien Alt-Text
    3. Eine Kategorie`;

    return await visionProvider.analyzeImageJson<{
        tags: string[];
        altText: string;
        category: string;
    }>(imageBuffer, mimeType, prompt, {
        type: "object",
        properties: {
            tags: { type: "array", items: { type: "string" } },
            altText: { type: "string" },
            category: { type: "string" },
        },
    }, {
        taskId: "media-tagging",
        temperature: 0.3,
    });
}
```

---

### **4.3 Content-Generierung**

```typescript
// Beispiel: Produktbeschreibung generieren

import { getProvider } from "@/lib/ai/core/ai-provider-factory";

async function generateProductDescription(productName: string, features: string[]): Promise<string> {
    const provider = getProvider();

    const prompt = `Erstelle eine kurze Produktbeschreibung (100 Wörter) für:
    Produkt: ${productName}
    Features: ${features.join(", ")}
    
    Fokus: DSGVO-Compliance, Enterprise-Features`;

    return await provider.requestText(prompt, {
        taskId: "content-generation",
        maxTokens: 200,
        temperature: 0.7, // Höhere Temperatur für kreativere Texte
        systemPrompt: "Du bist ein Experte für Enterprise-Software und DSGVO-Compliance.",
    });
}
```

---

## 5. MIGRATION VON MediaAIProvider

### **5.1 Bestehende Implementierung**

**Aktuell:**
- `MediaAIProvider` Interface (nur für Bildanalyse)
- `OpenAIMediaAIProvider` Implementierung
- `MediaAIService` nutzt Provider

**Problem:**
- Interface ist zu spezifisch (nur `analyzeImage()`)
- Nicht erweiterbar für andere KI-Aufgaben
- Business-Logik im Provider (Prompt-Building, Parsing)

---

### **5.2 Migrations-Strategie**

**Phase 1: Parallel-Betrieb**
- ✅ Neues `AiProvider`-Interface erstellen
- ✅ `OpenAIProvider` implementieren (allgemein)
- ✅ `MediaAIProvider` bleibt bestehen (keine Änderungen)
- ✅ Beide Interfaces parallel nutzbar

**Phase 2: Adapter-Pattern**
- ✅ `MediaAIProviderAdapter` erstellen
- ✅ Adapter nutzt `AiProvider` intern
- ✅ `MediaAIService` nutzt weiterhin `MediaAIProvider`
- ✅ Keine Breaking Changes

**Phase 3: Migration**
- ✅ `MediaAIService` migriert zu `AiProvider`
- ✅ Business-Logik aus Provider in Service
- ✅ `MediaAIProvider` wird deprecated

---

### **5.3 Adapter-Beispiel**

```typescript
// lib/ai/adapters/media-ai-provider-adapter.ts (NEU - Design-Vorschlag)

import { MediaAIProvider, FullAIAnalysisResult, AnalysisOptions } from "@/lib/media/ai/providers/types";
import { AiProvider, VisionAiProvider } from "@/lib/ai/core/ai-provider";

/**
 * Adapter: MediaAIProvider → AiProvider
 * 
 * Ermöglicht Migration ohne Breaking Changes
 */
export class MediaAIProviderAdapter implements MediaAIProvider {
    private aiProvider: VisionAiProvider;

    constructor(aiProvider: VisionAiProvider) {
        this.aiProvider = aiProvider;
    }

    getName(): string {
        return this.aiProvider.name;
    }

    getVersion(): string {
        return this.aiProvider.version;
    }

    async isAvailable(): Promise<ProviderStatus> {
        const available = await this.aiProvider.isAvailable();
        return {
            available,
            error: available ? undefined : "Provider not available",
        };
    }

    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult> {
        // Business-Logik: Prompt-Building (aus Provider herausgenommen)
        const prompt = this.buildAnalysisPrompt(options);

        // Nutze AiProvider für Analyse
        const resultText = await this.aiProvider.analyzeImage(
            imageBuffer,
            mimeType,
            prompt,
            {
                taskId: "media-analysis",
                temperature: 0.3,
            }
        );

        // Business-Logik: Response-Parsing (aus Provider herausgenommen)
        return this.parseAnalysisResult(resultText, options);
    }

    // Business-Logik-Methoden (aus Provider herausgenommen)
    private buildAnalysisPrompt(options?: AnalysisOptions): string {
        // Prompt-Building-Logik
    }

    private parseAnalysisResult(text: string, options?: AnalysisOptions): FullAIAnalysisResult {
        // Response-Parsing-Logik
    }

    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate {
        // Kosten-Schätzung
    }
}
```

---

## 6. VERZEICHNISSTRUKTUR

### **6.1 Vorgeschlagene Struktur**

```
src/lib/ai/
├── core/
│   ├── ai-provider.ts              # Basis-Interface (NEU)
│   ├── ai-provider-factory.ts      # Factory (NEU)
│   └── types.ts                    # Gemeinsame Typen (NEU)
├── providers/
│   ├── openai-provider.ts          # OpenAI-Implementierung (NEU)
│   ├── llama-provider.ts           # LLaMA-Implementierung (NEU)
│   ├── mistral-provider.ts         # Mistral-Implementierung (NEU, zukünftig)
│   └── mock-provider.ts            # Mock-Implementierung (NEU)
├── adapters/
│   └── media-ai-provider-adapter.ts # Adapter für Migration (NEU)
└── services/
    ├── dsgvo-helper.ts             # DSGVO-Helfer-Service (NEU, zukünftig)
    ├── content-generator.ts        # Content-Generierung (NEU, zukünftig)
    └── text-analyzer.ts            # Text-Analyse (NEU, zukünftig)
```

---

### **6.2 Bestehende Struktur (unverändert)**

```
src/lib/media/ai/
├── MediaAIService.ts               # Bestehend (unverändert)
├── provider-factory.ts             # Bestehend (unverändert)
├── providers/
│   ├── OpenAIMediaAIProvider.ts    # Bestehend (unverändert)
│   └── MockMediaAIProvider.ts      # Bestehend (unverändert)
└── services/                        # Bestehend (Status unklar)
```

---

## 7. VORTEILE DES NEUEN DESIGNS

### **7.1 Allgemeinheit**

**Aktuell:**
- ❌ `MediaAIProvider` nur für Bildanalyse
- ❌ Nicht erweiterbar für andere KI-Aufgaben

**Neu:**
- ✅ `AiProvider` für alle KI-Aufgaben
- ✅ Erweiterbar durch spezialisierte Interfaces (`VisionAiProvider`, `EmbeddingAiProvider`)

---

### **7.2 Saubere Trennung**

**Aktuell:**
- ⚠️ Business-Logik im Provider (Prompt-Building, Parsing)

**Neu:**
- ✅ Business-Logik in Services
- ✅ Provider nur für API-Calls

---

### **7.3 Einfache Erweiterung**

**Aktuell:**
- ⚠️ Neuer Provider = neue `analyzeImage()`-Implementierung

**Neu:**
- ✅ Neuer Provider = `requestText()` + `requestJson()` implementieren
- ✅ Einfacher zu testen und zu warten

---

## 8. REVIEW & FEINSCHLIFF

### **8.1 Design-Review (2025-11-29)**

**Geprüft anhand der aktuellen Nutzung:**
- ✅ Media-KI: `analyzeImage()` → kann über `VisionAiProvider.analyzeImageJson()` abgedeckt werden
- ✅ DSGVO-Helfer: Text-Analyse → `requestText()` / `requestJson()` ausreichend
- ✅ Zukünftige Admin-/System-KI: Text-Generierung → `requestText()` / `requestJson()` ausreichend

**Erweiterungen:**
- ✅ `AiRequestContext` hinzugefügt: `userId`, `context`, `locale` für DSGVO-Tracking
- ✅ `AiOptions.requestContext` hinzugefügt: Optionaler Kontext für alle Requests
- ✅ Kommentare präzisiert (Deutsch, kurz, technisch)

**Interface-Aufteilung:**
- ✅ Basis-Interface (`AiProvider`) für alle KI-Aufgaben
- ✅ Optionale Erweiterungen (`VisionAiProvider`, `EmbeddingAiProvider`) für spezialisierte Funktionen
- ✅ Passt zur tatsächlichen Nutzung (Media-KI nutzt Vision, andere nutzen Basis)

---

### **8.2 Optimierungen**

**AiOptions erweitert:**
```typescript
export interface AiRequestContext {
    userId?: string;      // Für DSGVO-Tracking
    context?: string;     // Zusätzlicher Kontext
    locale?: string;       // Sprache (statt "language")
}

export interface AiOptions {
    taskId?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    requestContext?: AiRequestContext;  // NEU
    metadata?: Record<string, unknown>;
}
```

**Vorteile:**
- ✅ DSGVO-Tracking: `userId` kann für Consent-Prüfung verwendet werden
- ✅ Kontext-Informationen: `context` für zusätzliche Metadaten
- ✅ Lokalisierung: `locale` für Sprachauswahl (konsistent mit bestehendem Code)

---

## 9. MOCK-IMPLEMENTIERUNG

### **9.1 MockAiProvider**

**Datei:** `src/lib/ai/providers/mock-ai-provider.draft.ts`

**Zweck:**
- ✅ Unit-Tests ohne echte API-Calls
- ✅ UI-Tests ohne externe Abhängigkeiten
- ✅ Offline-Entwicklung

**Funktionen:**
- ✅ `requestText()`: Gibt "MOCK_RESPONSE: " + erste 80 Zeichen zurück
- ✅ `requestJson()`: Generiert Mock-JSON basierend auf Schema
- ✅ `isAvailable()`: Immer `true`
- ✅ `estimateCost()`: Immer `0` (kostenlos)

**Schema-Erkennung:**
- ✅ Erkennt häufige Schemas (Media-Tagging, DSGVO-Helfer)
- ✅ Generiert passende Mock-Daten
- ✅ Fallback für unbekannte Schemas

**Verwendung:**
```typescript
// In Tests
const mockProvider = createMockAiProvider();
const text = await mockProvider.requestText("Test-Prompt", {
    taskId: "test-task"
});
// Ergebnis: "MOCK_RESPONSE: Test-Prompt"
```

---

## 10. ADAPTER-PATTERN FÜR MIGRATION

### **10.1 Adapter-Entwurf**

**Datei:** `src/lib/ai/adapters/openai-media-to-ai-provider.draft.ts`

**Zweck:**
- ✅ Zeigt, wie `OpenAIMediaAIProvider` in `AiProvider` integriert werden kann
- ✅ Ermöglicht schrittweise Migration ohne Breaking Changes
- ✅ Bestehender Code bleibt unverändert

**Implementierung:**
- ✅ `OpenAIMediaToAiProviderAdapter` implementiert `VisionAiProvider`
- ✅ Delegiert `analyzeImage()` / `analyzeImageJson()` an bestehenden `MediaAIProvider`
- ✅ Konvertiert `AiOptions` zu `AnalysisOptions`
- ✅ `requestText()` / `requestJson()` werfen Fehler (Media-Provider unterstützt keine Text-Requests)

**Einschränkungen:**
- ⚠️ `requestText()` / `requestJson()` nicht unterstützt (Media-Provider nur für Bilder)
- ⚠️ `supportsJson` = `false` (Adapter-Ebene, nicht Provider-Ebene)

**Verwendung (Beispiel):**
```typescript
// Bestehender Code (unverändert)
const mediaProvider = getProvider(); // MediaAIProvider

// Neuer Code (Adapter)
const aiProvider = createOpenAIMediaToAiProviderAdapter(mediaProvider);

// Nutzung als VisionAiProvider
const result = await aiProvider.analyzeImageJson<FullAIAnalysisResult>(
    imageBuffer,
    "image/png",
    "Analysiere dieses Bild...",
    schema,
    {
        taskId: "media-analysis",
        requestContext: {
            userId: "user123",
            locale: "de",
            context: "Seite: Startseite Hero"
        }
    }
);
```

---

### **10.2 Migrations-Strategie (konkretisiert)**

**Phase 1: Parallel-Betrieb** ✅
- ✅ `AiProvider`-Interface erstellt
- ✅ `MockAiProvider` erstellt (für Tests)
- ✅ `OpenAIMediaToAiProviderAdapter` erstellt (Entwurf)
- ✅ Bestehender Code bleibt unverändert

**Phase 2: Adapter-Integration** ⏳
- ⏳ Adapter in `provider-factory.ts` integrieren (optional)
- ⏳ Tests mit Adapter schreiben
- ⏳ `MediaAIService` kann optional Adapter nutzen

**Phase 3: Vollständige Migration** ⏳
- ⏳ `MediaAIService` migriert zu `AiProvider`
- ⏳ Business-Logik aus Provider in Service
- ⏳ `MediaAIProvider` wird deprecated

---

## 11. NÄCHSTE SCHRITTE

### **11.1 Phase F.2/L1 (Planung)**

1. ✅ **Design-Vorschlag erstellt** (dieses Dokument)
2. ✅ **Review & Feinschliff** (abgeschlossen)
3. ✅ **Mock-Implementierung** (erstellt)
4. ✅ **Adapter-Pattern** (erstellt)

---

### **11.2 Phase F.2/L1 (Implementierung)**

1. ⏳ `AiProvider`-Interface finalisieren (bereits erstellt)
2. ⏳ `OpenAIProvider` implementieren (allgemein, nicht nur Media)
3. ⏳ `LLaMAProvider` implementieren
4. ⏳ Adapter in Tests integrieren
5. ⏳ Tests schreiben

---

## 12. ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **Allgemeines Interface:** `AiProvider` für alle KI-Aufgaben
- ✅ **Task-basiert:** `requestText()`, `requestJson()` statt spezifische Methoden
- ✅ **Sauber getrennt:** Business-Logik nicht im Provider
- ✅ **Erweiterbar:** Neue Provider können einfach hinzugefügt werden
- ✅ **Migration:** Adapter-Pattern für schrittweise Migration

**Status:**
- ✅ **Design-Vorschlag** (erstellt und reviewt)
- ✅ **Review & Feinschliff** (abgeschlossen)
- ✅ **Mock-Implementierung** (erstellt)
- ✅ **Adapter-Pattern** (erstellt)
- ⏳ **Bereit für Implementierung in Phase F.2/L1**

**Erstellte Dateien:**
- ✅ `src/lib/ai/core/ai-provider.ts` - Basis-Interface (optimiert)
- ✅ `src/lib/ai/providers/mock-ai-provider.draft.ts` - Mock-Provider
- ✅ `src/lib/ai/adapters/openai-media-to-ai-provider.draft.ts` - Adapter-Entwurf

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29 (Review & Feinschliff abgeschlossen)*


