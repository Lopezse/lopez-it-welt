# 🚀 Phase 3: Echte KI-Integration - Technische Voranalyse

**Datum:** 2025-11-25  
**Status:** 📋 Planung  
**Ziel:** Integration echter KI-Provider für Media AI Services

---

## 📊 Provider-Strategie

### Option 1: OpenAI Vision API (Empfohlen)

**Vorteile:**
- ✅ Sehr gute Bildanalyse-Qualität
- ✅ GPT-4 Vision für Alt-Text-Generierung
- ✅ Einfache API-Integration
- ✅ Gute Dokumentation

**Nachteile:**
- ❌ Kosten: ~$0.01-0.03 pro Bild
- ❌ Rate-Limits (abhängig vom Plan)
- ❌ Daten werden an OpenAI gesendet (DSGVO beachten!)

**Verwendung:**
- **Tagging:** GPT-4 Vision mit Prompt-Engineering
- **Alt-Text:** GPT-4 Vision mit strukturiertem Prompt
- **Quality:** Eigene Logik + OpenAI für Schärfe-Analyse
- **Category:** GPT-4 Vision mit Klassifikations-Prompt
- **CI-Check:** Eigene Logik + OpenAI für Logo-Erkennung
- **Person-Detection:** Azure Face API (besser für DSGVO)

**Kosten-Schätzung:**
- 1000 Bilder/Monat: ~$20-30
- 10000 Bilder/Monat: ~$200-300

---

### Option 2: Google Cloud Vision API

**Vorteile:**
- ✅ Sehr gute Objekterkennung
- ✅ Label-Detection (automatische Tags)
- ✅ Text-Detection (OCR)
- ✅ Face-Detection
- ✅ Gute Performance

**Nachteile:**
- ❌ Alt-Text muss selbst generiert werden
- ❌ Komplexere Integration
- ❌ Google Cloud Setup erforderlich

**Verwendung:**
- **Tagging:** Label Detection API
- **Alt-Text:** Eigene Generierung basierend auf Labels
- **Quality:** Eigene Logik
- **Category:** Label Detection + Klassifikation
- **CI-Check:** Eigene Logik
- **Person-Detection:** Face Detection API

**Kosten-Schätzung:**
- 1000 Bilder/Monat: ~$15-25
- 10000 Bilder/Monat: ~$150-250

---

### Option 3: Azure Computer Vision

**Vorteile:**
- ✅ Sehr gute Objekterkennung
- ✅ Beschreibungs-Generierung (Caption)
- ✅ Tags automatisch
- ✅ Face-Detection
- ✅ DSGVO-konform (EU-Regionen)

**Nachteile:**
- ❌ Alt-Text-Qualität variabel
- ❌ Komplexere Integration
- ❌ Azure-Setup erforderlich

**Verwendung:**
- **Tagging:** Tags API
- **Alt-Text:** Describe API (Caption)
- **Quality:** Eigene Logik
- **Category:** Tags + Klassifikation
- **CI-Check:** Eigene Logik
- **Person-Detection:** Face API

**Kosten-Schätzung:**
- 1000 Bilder/Monat: ~$10-20
- 10000 Bilder/Monat: ~$100-200

---

### Option 4: Hybrid-Ansatz (Empfohlen für Enterprise++)

**Strategie:**
- **Tagging:** Google Cloud Vision (beste Labels)
- **Alt-Text:** OpenAI GPT-4 Vision (beste Qualität)
- **Quality:** Eigene Logik (keine API-Kosten)
- **Category:** Google Cloud Vision + eigene Klassifikation
- **Similarity:** Eigene Perceptual Hash (pHash/dHash)
- **CI-Check:** Eigene Logik
- **Person-Detection:** Azure Face API (DSGVO-konform)

**Vorteile:**
- ✅ Beste Qualität pro Service
- ✅ Kostenoptimiert
- ✅ DSGVO-konform (Azure für Personen)

**Nachteile:**
- ❌ Mehrere Provider verwalten
- ❌ Komplexere Integration

---

## 🏗️ Architektur-Erweiterung

### 1. Provider-Abstraktion

**Neue Dateien:**
```
src/lib/media/ai/providers/
├── BaseProvider.ts          # Basis-Interface
├── OpenAIProvider.ts        # OpenAI-Implementierung
├── GoogleVisionProvider.ts  # Google-Implementierung
├── AzureVisionProvider.ts   # Azure-Implementierung
└── MockProvider.ts          # Mock (aktuell)
```

**Interface:**
```typescript
interface AIProvider {
    analyzeImage(buffer: Buffer, mimeType: string): Promise<AIAnalysisResult>;
    generateTags(buffer: Buffer): Promise<TaggingResult>;
    generateAltText(buffer: Buffer, context?: string): Promise<AltTextResult>;
    detectPersons(buffer: Buffer): Promise<PersonDetectionResult>;
    // ...
}
```

---

### 2. Config-System erweitern

**Erweiterte `config.ts`:**
```typescript
export interface AIServiceConfig {
    enabled: boolean;
    provider: "openai" | "google" | "azure" | "local" | "mock";
    api_key?: string;
    api_endpoint?: string;
    model_version?: string;
    timeout_ms?: number;
    retry_attempts?: number;
    rate_limit?: {
        requests_per_minute: number;
        requests_per_day: number;
    };
    cost_tracking?: boolean;
    cache_enabled?: boolean;
    cache_ttl_seconds?: number;
}
```

**Umgebungsvariablen:**
```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-vision-preview

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_KEY_FILE=path/to/key.json

# Azure
AZURE_VISION_KEY=...
AZURE_VISION_ENDPOINT=https://...
AZURE_VISION_REGION=westeurope
```

---

### 3. Asynchrones Processing

**Background-Job-System:**
```
src/lib/media/ai/jobs/
├── AnalyzeMediaJob.ts       # Einzelne Analyse
├── BatchAnalyzeJob.ts       # Batch-Analyse
└── ReanalyzeJob.ts          # Neu-Analyse
```

**Queue-System (z.B. BullMQ):**
- Upload → Queue → Background-Analyse
- Admin kann Status sehen
- Retry bei Fehlern
- Rate-Limiting

---

### 4. Caching-Strategie

**Cache-Layer:**
```typescript
interface AICache {
    get(mediaId: string): Promise<AIAnalysisResult | null>;
    set(mediaId: string, result: AIAnalysisResult, ttl: number): Promise<void>;
    invalidate(mediaId: string): Promise<void>;
}
```

**Implementierung:**
- Redis für Production
- In-Memory für Development
- TTL: 7 Tage (KI-Ergebnisse ändern sich nicht)

---

## ⚠️ Risiken & Mitigation

### 1. DSGVO-Compliance

**Risiko:**
- Bilder werden an externe Provider gesendet
- Personen könnten erkannt werden
- Daten könnten gespeichert werden

**Mitigation:**
- ✅ Azure Face API in EU-Region (DSGVO-konform)
- ✅ OpenAI: Daten nicht für Training verwenden (opt-out)
- ✅ Google: Daten nicht für Training verwenden
- ✅ Personenerkennung: Immer Admin-Freigabe erforderlich
- ✅ Audit-Log: Alle API-Calls protokollieren

---

### 2. Performance

**Risiko:**
- API-Calls dauern 1-5 Sekunden pro Bild
- Upload könnte langsam werden
- Batch-Analysen könnten lange dauern

**Mitigation:**
- ✅ Asynchrones Processing (Background-Jobs)
- ✅ Caching (keine doppelten Analysen)
- ✅ Rate-Limiting (nicht zu viele Requests)
- ✅ Progress-Tracking für Batch-Jobs

---

### 3. Kosten

**Risiko:**
- Hohe API-Kosten bei vielen Bildern
- Unerwartete Kosten durch Fehler/Retries

**Mitigation:**
- ✅ Kosten-Tracking (jeder API-Call wird geloggt)
- ✅ Budget-Limits (max. Kosten pro Monat)
- ✅ Caching (reduziert API-Calls)
- ✅ Batch-Optimierung (mehrere Bilder pro Request wenn möglich)
- ✅ Monitoring-Dashboard

---

### 4. Verfügbarkeit

**Risiko:**
- Externe APIs könnten ausfallen
- Rate-Limits könnten erreicht werden

**Mitigation:**
- ✅ Fallback auf Mock-Provider
- ✅ Retry-Logik mit Exponential Backoff
- ✅ Queue-System (wiederholt bei Fehlern)
- ✅ Health-Checks (Provider-Status prüfen)

---

## 📋 Entwicklungsplan

### Phase 3.1: Provider-Abstraktion (1-2 Wochen)

**Aufgaben:**
1. `BaseProvider` Interface definieren
2. `OpenAIProvider` implementieren
3. `MockProvider` auf Basis-Interface umstellen
4. Config-System erweitern
5. Unit-Tests für Provider

**Dateien:**
- `src/lib/media/ai/providers/BaseProvider.ts`
- `src/lib/media/ai/providers/OpenAIProvider.ts`
- `src/lib/media/ai/providers/MockProvider.ts`
- `src/lib/media/ai/config.ts` (erweitert)

---

### Phase 3.2: OpenAI-Integration (1-2 Wochen)

**Aufgaben:**
1. OpenAI API-Client einrichten
2. Tagging-Service mit GPT-4 Vision
3. Alt-Text-Service mit GPT-4 Vision
4. Quality-Check (eigene Logik + OpenAI)
5. Category-Service mit GPT-4 Vision
6. Integration-Tests

**Dateien:**
- `src/lib/media/ai/providers/OpenAIProvider.ts` (vollständig)
- `src/lib/media/ai/services/*` (Provider-Integration)
- `.env.example` (OpenAI-Keys)

---

### Phase 3.3: Caching & Performance (1 Woche)

**Aufgaben:**
1. Redis-Integration (oder In-Memory)
2. Cache-Layer in Services
3. TTL-Management
4. Cache-Invalidation
5. Performance-Tests

**Dateien:**
- `src/lib/media/ai/cache/AICache.ts`
- `src/lib/media/ai/cache/RedisCache.ts`
- `src/lib/media/ai/cache/MemoryCache.ts`

---

### Phase 3.4: Background-Jobs (1-2 Wochen)

**Aufgaben:**
1. Queue-System einrichten (BullMQ)
2. AnalyzeMediaJob implementieren
3. BatchAnalyzeJob implementieren
4. Progress-Tracking
5. Admin-UI für Job-Status

**Dateien:**
- `src/lib/media/ai/jobs/AnalyzeMediaJob.ts`
- `src/lib/media/ai/jobs/BatchAnalyzeJob.ts`
- `src/app/api/admin/media/ai/jobs/` (Job-Management)

---

### Phase 3.5: Monitoring & Kosten-Tracking (1 Woche)

**Aufgaben:**
1. API-Call-Logging
2. Kosten-Berechnung pro Provider
3. Budget-Limits
4. Monitoring-Dashboard
5. Alerts bei Budget-Überschreitung

**Dateien:**
- `src/lib/media/ai/monitoring/CostTracker.ts`
- `src/lib/media/ai/monitoring/UsageLogger.ts`
- `src/app/admin/media/ai/monitoring/page.tsx`

---

### Phase 3.6: Weitere Provider (Optional, 2-3 Wochen)

**Aufgaben:**
1. Google Cloud Vision Provider
2. Azure Computer Vision Provider
3. Provider-Switching (Admin kann wählen)
4. A/B-Testing (Qualität vergleichen)

**Dateien:**
- `src/lib/media/ai/providers/GoogleVisionProvider.ts`
- `src/lib/media/ai/providers/AzureVisionProvider.ts`

---

## 🎯 Empfehlung

**Start mit:** OpenAI Vision API (Phase 3.1 + 3.2)

**Gründe:**
- ✅ Einfachste Integration
- ✅ Beste Alt-Text-Qualität
- ✅ Gute Dokumentation
- ✅ Schneller Start

**Später erweitern:**
- Google Cloud Vision für Tagging (bessere Labels)
- Azure Face API für Person-Detection (DSGVO)

**Timeline:**
- Phase 3.1-3.2: 2-4 Wochen
- Phase 3.3-3.4: 2-3 Wochen
- Phase 3.5: 1 Woche
- **Gesamt: 5-8 Wochen**

---

## 📝 Nächste Schritte

1. ✅ **Provider auswählen** (OpenAI empfohlen)
2. ✅ **API-Keys beschaffen** (OpenAI Account)
3. ✅ **Provider-Abstraktion implementieren** (Phase 3.1)
4. ✅ **OpenAI-Integration** (Phase 3.2)
5. ✅ **Testing & Monitoring** (Phase 3.3-3.5)

**Status:** Bereit für Phase 3.1

