# AI Provider System - Enterprise++ Standard

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** ✅ **PRODUKTIONSREIF** (Phase F.2)

---

## 📋 ÜBERSICHT

Das AI Provider System bietet eine **einheitliche Schnittstelle** für alle KI-Aufgaben in Lopez IT Welt Enterprise++. Es abstrahiert über verschiedene KI-Provider (OpenAI, LLaMA, Mock) und ermöglicht eine einfache Erweiterung.

**Kernprinzipien:**
- ✅ **Allgemein:** Nicht nur für Media, sondern für alle KI-Aufgaben
- ✅ **Task-basiert:** `requestText()`, `requestJson()` statt spezifische Methoden
- ✅ **Erweiterbar:** Neue Provider können einfach hinzugefügt werden
- ✅ **DSGVO-konform:** `AiRequestContext` für Tracking und Consent-Prüfung

---

## 🏗️ ARCHITEKTUR

```
src/lib/ai/
├── core/
│   ├── ai-provider.ts              # Basis-Interface
│   └── ai-provider-factory.ts       # Factory für Provider-Erstellung
├── providers/
│   ├── mock-ai-provider.ts          # Mock-Provider (Tests)
│   ├── openai-provider.ts           # OpenAI-Provider (Cloud)
│   └── llama-provider.ts            # LLaMA-Provider (Self-Hosted)
├── adapters/
│   └── openai-media-to-ai-provider.draft.ts  # Adapter (Migration)
└── __tests__/
    ├── mock-ai-provider.test.ts
    ├── openai-provider.test.ts
    └── llama-provider.test.ts
```

---

## 🚀 VERWENDUNG

### **Basis-Verwendung**

```typescript
import { getProvider } from "@/lib/ai/core/ai-provider-factory";

// Provider holen (Singleton)
const provider = getProvider();

// Text-Generierung
const text = await provider.requestText("Erstelle eine Produktbeschreibung...", {
    taskId: "content-generation",
    maxTokens: 200,
    temperature: 0.7,
});

// JSON-Generierung
const result = await provider.requestJson<{tags: string[]}>(
    "Erstelle 5 Tags für ein Admin-Dashboard.",
    {
        type: "object",
        properties: {
            tags: { type: "array", items: { type: "string" } }
        }
    },
    {
        taskId: "media-tagging",
        temperature: 0.3
    }
);
```

### **Mit DSGVO-Kontext**

```typescript
const provider = getProvider();

const result = await provider.requestText("Analysiere diesen Text...", {
    taskId: "dsgvo-helper",
    requestContext: {
        userId: "user123",
        locale: "de",
        context: "Media-ID: abc123"
    }
});
```

---

## 🔧 KONFIGURATION

### **Environment-Variablen**

```bash
# Provider-Auswahl
AI_PROVIDER=mock        # oder "openai" oder "llama"

# OpenAI (wenn AI_PROVIDER=openai)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# LLaMA (wenn AI_PROVIDER=llama)
LLAMA_SERVER_URL=http://localhost:11434
LLAMA_MODEL=llama3.2:1b
```

### **Provider-Auswahl**

Der Provider wird automatisch basierend auf `AI_PROVIDER` ausgewählt:

- **`mock`** (Default): Mock-Provider für Tests
- **`openai`**: OpenAI GPT-4 (Cloud)
- **`llama`**: LLaMA (Self-Hosted, Ollama)

---

## 📊 PROVIDER-VERGLEICH

| Provider | Kosten | DSGVO | Geschwindigkeit | Qualität | Einsatz |
|----------|--------|-------|-----------------|----------|---------|
| **Mock** | 0 € | ✅ | Sofort | Mock-Daten | Tests |
| **OpenAI** | ~$0.01-0.03/Request | ⚠️ Cloud | ~1-2s | 9/10 | Produktion |
| **LLaMA** | 0 € (lokal) | ✅ Lokal | ~2-3s | 7-8/10 | Self-Hosted |

---

## 🧪 TESTS

### **Unit-Tests**

```bash
npm test -- ai-provider
```

### **Mock-Provider für Tests**

```typescript
import { createMockAiProvider } from "@/lib/ai/providers/mock-ai-provider";

const mockProvider = createMockAiProvider();
const text = await mockProvider.requestText("Test");
// Ergebnis: "MOCK_RESPONSE: Test"
```

---

## 📚 DOKUMENTATION

- **Design:** `docs/ENTERPRISE-PLUS-PLUS/AI/AI-PROVIDER-DESIGN.md`
- **Aktuelle Nutzung:** `docs/ENTERPRISE-PLUS-PLUS/AI/AI-USE-CURRENT.md`
- **Implementierungsplan:** `docs/ENTERPRISE-PLUS-PLUS/F1-KI-IMPLEMENTIERUNGSPLAN-F2-L0-L1.md`
- **RAG-Plan:** `docs/ENTERPRISE-PLUS-PLUS/F1-KI-RAG-PLAN.md`

---

## 🔄 MIGRATION

### **Von MediaAIProvider zu AiProvider**

Die Migration erfolgt schrittweise über Adapter-Pattern:

1. ✅ **AiProvider-System** erstellt (F.2)
2. ⏳ **Adapter** für bestehenden Media-Provider (F.2.5)
3. ⏳ **Schrittweise Migration** (später)

**Wichtig:** Bestehender Code bleibt unverändert während der Migration.

---

## ✅ STATUS

- ✅ **F.2.1:** Basis-Interface finalisiert
- ✅ **F.2.2:** Mock-Provider aktiviert
- ✅ **F.2.3:** OpenAI-Provider implementiert
- ✅ **F.2.4:** LLaMA-Provider implementiert
- ⏳ **F.2.5:** Adapter-Pattern (optional)
- ⏳ **F.2.6:** Integration & Tests

---

**Enterprise++ KI-Architekt-Agent**  
*Stand: 2025-11-29*



