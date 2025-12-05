# Phase 3.2 - OpenAI-Integration Summary

**Erstellt:** 2025-01-27  
**Status:** ✅ Implementiert  
**Zweck:** OpenAI GPT-4 Vision Integration für Media-AI

---

## 📋 Executive Summary

Phase 3.2 integriert die OpenAI GPT-4 Vision API für echte KI-Bildanalyse. Das System nutzt die bereits implementierte Provider-Abstraktion und Secret-Handling-Infrastruktur aus Phase 3.1.

**Kernprinzipien:**
- ✅ Keine API-Keys im Code/Repo/DB
- ✅ Kosten-Tracking und Limits
- ✅ Async-Processing
- ✅ DSGVO-Compliance (Person-Detection)

---

## 🏗️ Architektur

### **Provider-System:**

```
┌─────────────────────────────────────┐
│  Provider Factory                    │
│  • createProvider()                  │
│  • getProvider() (Singleton)         │
└─────────────────────────────────────┘
           │
           ├─→ MockProvider (Entwicklung)
           └─→ OpenAIProvider (Production)
                    │
                    ├─→ SecretManager
                    │   • loadSecret("ENV:OPENAI_API_KEY")
                    │
                    └─→ OpenAI SDK
                        • GPT-4 Vision
                        • Bildanalyse
```

### **Datenfluss:**

```
1. Admin/API → queueAnalysis(mediaId)
2. AsyncProcessor → processPendingAnalyses()
3. Provider → analyzeImage(imageBuffer, mimeType)
4. OpenAI API → GPT-4 Vision
5. Response → FullAIAnalysisResult
6. saveAnalysisResults() → meta.json + DB
7. costTracker.recordCost() → Kosten-Tracking
```

---

## 🔧 Implementierte Komponenten

### **1. OpenAIMediaAIProvider** (`src/lib/media/ai/providers/OpenAIMediaAIProvider.ts`)

**Funktionen:**
- ✅ `analyzeImage()` - Vollständige Bildanalyse über GPT-4 Vision
- ✅ `estimateCost()` - Kosten-Schätzung basierend auf OpenAI-Pricing
- ✅ `isAvailable()` - Verfügbarkeitsprüfung
- ✅ Fehlerbehandlung (Rate-Limit, Auth, Timeout)

**Analyse-Features:**
- ✅ Tags (mit Confidence-Scores)
- ✅ Alt-Text (Barrierefreiheit)
- ✅ Quality-Score (0-100)
- ✅ Category-Detection
- ✅ Person-Detection (DSGVO)
- ✅ CI-Compliance (Logo, Farben)
- ✅ Similarity-Hash (für Dubletten)

### **2. MockMediaAIProvider** (`src/lib/media/ai/providers/MockMediaAIProvider.ts`)

**Funktionen:**
- ✅ Mock-Implementierung für Entwicklung
- ✅ Simuliert alle Analyse-Features
- ✅ Keine echten API-Calls
- ✅ Schnelle Antworten (500ms)

### **3. Provider Factory** (`src/lib/media/ai/provider-factory.ts`)

**Funktionen:**
- ✅ `createProvider()` - Erstellt Provider basierend auf `MEDIA_AI_PROVIDER`
- ✅ `getProvider()` - Singleton-Instanz
- ✅ Automatische Provider-Auswahl (mock/openai)

### **4. MediaAIService Integration**

**Änderungen:**
- ✅ Verwendet jetzt Provider statt einzelne Services
- ✅ `analyzeMedia()` delegiert an Provider
- ✅ Kompatibel mit Mock und OpenAI

### **5. AsyncProcessor Integration**

**Änderungen:**
- ✅ Verwendet Provider für Kosten-Schätzung
- ✅ Kosten-Tracking mit Provider-Informationen
- ✅ Fehlerbehandlung ohne Secrets in Logs

---

## 💰 Kosten-Tracking

### **OpenAI Pricing (Stand: 2025-01-27):**

- **Input:** $0.01 pro 1K Tokens
- **Output:** $0.03 pro 1K Tokens
- **Bilder:** ~85 Tokens pro Bild (1024x1024)

### **Geschätzte Kosten pro Analyse:**

- **Input-Tokens:** ~1000 (Prompt + Bild)
- **Output-Tokens:** ~500 (Response)
- **Gesamt:** ~$0.025 USD pro Bild

### **Kosten-Limits:**

- **Täglich:** `MEDIA_AI_DAILY_LIMIT_USD` (Default: $10.00)
- **Monatlich:** `MEDIA_AI_MONTHLY_LIMIT_USD` (Default: $200.00)
- **Warnung:** Bei 80% des Limits

---

## 🔒 Sicherheit

### **Secret-Handling:**

- ✅ API-Key nur über `SecretManager.loadSecret("ENV:OPENAI_API_KEY")`
- ✅ Keine Keys im Code/Repo/DB
- ✅ Keys werden maskiert in Logs (`sk-***masked***`)

### **Logging:**

- ✅ Keine API-Keys in Logs
- ✅ Keine vollständigen OpenAI-Responses
- ✅ Nur Metadaten (Dauer, Erfolg/Fehler, Kosten)

### **Fehlerbehandlung:**

- ✅ `ProviderError` für strukturierte Fehler
- ✅ Retry-Logik (max. 3 Versuche)
- ✅ Fehlermeldungen ohne interne Details

---

## 📊 DSGVO-Compliance

### **Person-Detection:**

- ✅ `has_person` Flag wird gesetzt
- ✅ `dsgvo_approved_by_admin` bleibt `false` (Admin muss freigeben)
- ✅ Keine automatische Löschung
- ✅ Admin-UI zeigt Warnung bei Personen

### **Workflow:**

1. OpenAI erkennt Person → `has_person = true`
2. `dsgvo_approved_by_admin = false` (automatisch)
3. Admin wird benachrichtigt
4. Admin prüft und gibt frei
5. Erst dann wird Bild verwendet

---

## 🧪 Tests

### **Unit-Tests:**

- ✅ `OpenAIMediaAIProvider` Tests (mit gemocktem OpenAI-Client)
- ✅ `MockMediaAIProvider` Tests
- ✅ `ProviderFactory` Tests
- ✅ Kosten-Schätzung Tests

### **Integration-Tests:**

- ✅ AsyncProcessor mit Provider
- ✅ Status-Wechsel (pending → running → done/error)
- ✅ Kosten-Tracking
- ✅ DB & meta.json Updates

---

## 📝 Environment-Variablen

### **Erforderlich:**

```env
# Provider-Auswahl
MEDIA_AI_PROVIDER=openai  # oder "mock" für Entwicklung

# OpenAI-Konfiguration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-vision-preview  # oder gpt-4.1-mini

# Kosten-Limits
MEDIA_AI_DAILY_LIMIT_USD=10.00
MEDIA_AI_MONTHLY_LIMIT_USD=200.00

# Async-Processing
MEDIA_AI_ASYNC_BATCH_SIZE=10
MEDIA_AI_MAX_RETRIES=3
MEDIA_AI_RETRY_DELAY_MS=5000
```

---

## 🚀 Verwendung

### **1. Provider aktivieren:**

```env
MEDIA_AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

### **2. Analyse starten:**

```typescript
import { mediaAIService } from "@/lib/media/ai/MediaAIService";

// Einzelne Analyse
await mediaAIService.queueAnalysis(mediaId);

// Batch-Analyse
await mediaAIService.analyzeBatch([mediaId1, mediaId2]);
```

### **3. Ergebnisse abrufen:**

```typescript
const meta = await readMediaMetaById(mediaId);
console.log(meta.ai?.tags); // ["tag1", "tag2"]
console.log(meta.ai?.description_ai); // "Bildbeschreibung"
console.log(meta.ai?.has_person); // true/false
```

---

## 📈 Monitoring

### **Kosten-Tracking:**

```typescript
import { costTracker } from "@/lib/media/ai/cost-tracker";

const stats = await costTracker.getCostStats();
console.log(`Heute: $${stats.today}`);
console.log(`Dieser Monat: $${stats.thisMonth}`);
```

### **Status-Abfrage:**

```sql
SELECT 
    ai_status,
    COUNT(*) as count
FROM lopez_business_media
GROUP BY ai_status;
```

---

## ⚠️ Risiken & Mitigation

### **Risiko 1: Hohe Kosten**

**Mitigation:**
- ✅ Tägliche/Monatliche Limits
- ✅ Kosten-Tracking vor jedem Request
- ✅ Warnung bei 80% des Limits

### **Risiko 2: Rate-Limits**

**Mitigation:**
- ✅ Retry-Logik mit Exponential Backoff
- ✅ Batch-Processing begrenzt
- ✅ Fehlerbehandlung für Rate-Limits

### **Risiko 3: DSGVO-Verstöße**

**Mitigation:**
- ✅ Person-Detection aktiv
- ✅ Admin-Freigabe erforderlich
- ✅ Keine automatische Löschung

---

## 🔄 Migration von Mock zu OpenAI

### **Schritt 1: .env anpassen**

```env
MEDIA_AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

### **Schritt 2: System testen**

```bash
# Test mit einem Bild
curl -X POST /api/admin/media/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"mediaId": "test123"}'
```

### **Schritt 3: Monitoring**

- ✅ Kosten-Tracking prüfen
- ✅ Fehlerrate überwachen
- ✅ Response-Zeiten messen

---

## 📚 Weiterführende Dokumentation

- **Secret-Handling:** `docs/SICHERHEIT/secret-handling-policy.md`
- **Phase 3.1:** `docs/PHASE-3-IMPLEMENTATION/phase-3-1-foundation-summary.md`
- **Abnahme:** `docs/ABNAHME/phase-3-2-openai-technical-acceptance.md`

---

**Status:** ✅ Implementiert  
**Bereit für:** Production-Testing





