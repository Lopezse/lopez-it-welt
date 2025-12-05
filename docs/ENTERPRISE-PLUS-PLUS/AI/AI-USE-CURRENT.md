# AI-USE-CURRENT

## Analyse: Aktuelle KI/OpenAI-Nutzung im Projekt

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **ANALYSE** (Keine Änderungen)  
**Zweck:** Bestandsaufnahme aller KI-Nutzungen für zukünftige Provider-Schicht

---

## 📋 EXECUTIVE SUMMARY

Diese Analyse dokumentiert **alle Stellen im Projekt, an denen aktuell OpenAI oder andere KI-Services genutzt werden**. Ziel ist es, eine vollständige Übersicht zu erstellen, um später eine saubere, modulare AI-Provider-Schicht aufzubauen.

**Wichtig:** Diese Analyse **ändert nichts** am bestehenden Code. Sie dient nur der Dokumentation und Planung.

---

## 1. MEDIA AI (Bildanalyse)

### **1.1 Provider-Implementierung**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` | `OpenAIMediaAIProvider` Klasse | **Bildanalyse** (GPT-4 Vision) | ⚠️ **JA** - Prompt-Building, JSON-Parsing, Fehlerbehandlung |
| `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` | `analyzeImage()` | **Bildanalyse** (GPT-4 Vision) | ⚠️ **JA** - Vollständige Analyse-Logik (Tags, Alt-Text, Quality, Category, Person, CI) |
| `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` | `buildAnalysisPrompt()` | **Prompt-Engineering** | ⚠️ **JA** - Business-Logik für Prompt-Struktur |
| `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` | `parseOpenAIResponse()` | **JSON-Parsing** | ⚠️ **JA** - Business-Logik für Response-Parsing |
| `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` | `estimateCost()` | **Kosten-Schätzung** | ✅ **NEIN** - Reine Berechnung |

**Details:**
- **OpenAI SDK:** `import OpenAI from "openai"`
- **API-Call:** `client.chat.completions.create()` mit GPT-4 Vision
- **Daten:** Bilder werden als Base64 an OpenAI gesendet
- **Response:** JSON-Response wird geparst und in `FullAIAnalysisResult` umgewandelt
- **Business-Logik:** Prompt-Building, Response-Parsing, Fehlerbehandlung sind im Provider

**Environment-Variablen:**
- `OPENAI_API_KEY` (via `SecretManager.loadSecret("ENV:OPENAI_API_KEY")`)
- `OPENAI_MODEL` (Default: "gpt-4-vision-preview")
- `MEDIA_AI_PROVIDER` (Default: "mock")

---

### **1.2 Service-Layer**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/media/ai/MediaAIService.ts` | `MediaAIService` Klasse | **Orchestrator** | ✅ **NEIN** - Delegiert an Provider |
| `src/lib/media/ai/MediaAIService.ts` | `analyzeMedia()` | **Bildanalyse** | ✅ **NEIN** - Ruft Provider auf, keine direkte OpenAI-Nutzung |
| `src/lib/media/ai/MediaAIService.ts` | `analyzeBatch()` | **Batch-Analyse** | ✅ **NEIN** - Ruft `analyzeMedia()` mehrfach auf |
| `src/lib/media/ai/MediaAIService.ts` | `smartSearch()` | **Semantische Suche** | ⚠️ **MOCK** - Aktuell Mock, TODO: "OpenAI Embeddings, Vector-DB" |

**Details:**
- **Provider-Abstraktion:** Nutzt `getProvider()` aus `provider-factory.ts`
- **DSGVO-Integration:** Prüft `dsgvoDecisionEngine.getAIProcessingPermission()` vor Provider-Aufruf
- **Keine direkte OpenAI-Nutzung:** Service nutzt nur Provider-Interface

---

### **1.3 Provider-Factory**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/media/ai/provider-factory.ts` | `createProvider()` | **Provider-Erstellung** | ✅ **NEIN** - Reine Factory-Logik |
| `src/lib/media/ai/provider-factory.ts` | `getProvider()` | **Singleton-Provider** | ✅ **NEIN** - Reine Singleton-Logik |

**Details:**
- **Provider-Auswahl:** Basierend auf `MEDIA_AI_PROVIDER` (mock/openai)
- **Keine direkte OpenAI-Nutzung:** Factory erstellt nur Provider-Instanzen

---

### **1.4 Config & Secret-Management**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/media/ai/config.ts` | `getOpenAIApiKey()` | **Secret-Loading** | ✅ **NEIN** - Nutzt `SecretManager` |
| `src/lib/media/ai/config.ts` | `OPENAI_SECRET_REF` | **Secret-Referenz** | ✅ **NEIN** - Nur Referenz ("ENV:OPENAI_API_KEY") |
| `src/lib/media/ai/config.ts` | `MEDIA_AI_PROVIDER` | **Provider-Konfiguration** | ✅ **NEIN** - Reine Config |

**Details:**
- **Secret-Handling:** Nutzt `SecretManager.loadSecret("ENV:OPENAI_API_KEY")`
- **Keine API-Keys im Code:** Nur Referenzen
- **Config:** Environment-Variablen-basiert

---

### **1.5 API-Routen**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/app/api/admin/media/ai/analyze/route.ts` | `POST /api/admin/media/ai/analyze` | **Bildanalyse-API** | ✅ **NEIN** - Ruft `MediaAIService.analyzeMedia()` auf |
| `src/app/api/admin/media/ai/analyze-batch/route.ts` | `POST /api/admin/media/ai/analyze-batch` | **Batch-Analyse-API** | ✅ **NEIN** - Ruft `MediaAIService.analyzeBatch()` auf |
| `src/app/api/admin/media/ai/search/route.ts` | `POST /api/admin/media/ai/search` | **Semantische Suche-API** | ⚠️ **MOCK** - Ruft `MediaAIService.smartSearch()` (Mock) |
| `src/app/api/admin/media/ai/similar/route.ts` | `GET /api/admin/media/ai/similar` | **Ähnlichkeitssuche-API** | ✅ **NEIN** - Nutzt `SimilarityService` (keine KI) |
| `src/app/api/admin/media/ai/approve/route.ts` | `POST /api/admin/media/ai/approve` | **Admin-Freigabe-API** | ✅ **NEIN** - Keine KI-Nutzung, nur Freigabe |

**Details:**
- **DSGVO-Integration:** Alle Routen nutzen `dsgvoEnforceMiddleware`
- **Keine direkte OpenAI-Nutzung:** Routen nutzen nur Services
- **Business-Logik:** In Services/Provider, nicht in Routen

---

### **1.6 Service-Module (Veraltet?)**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/media/ai/services/TaggingService.ts` | `TaggingService` | **Tagging** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/AltTextService.ts` | `AltTextService` | **Alt-Text** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/QualityCheckService.ts` | `QualityCheckService` | **Quality-Check** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/CategoryService.ts` | `CategoryService` | **Category** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/PersonDetectionService.ts` | `PersonDetectionService` | **Person-Detection** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/CICheckService.ts` | `CICheckService` | **CI-Check** | ⚠️ **UNKLAR** - Möglicherweise veraltet, da Provider verwendet wird |
| `src/lib/media/ai/services/SimilarityService.ts` | `SimilarityService` | **Similarity** | ✅ **NEIN** - Nutzt Perceptual Hash (keine KI) |

**Details:**
- **Status unklar:** Diese Services existieren, aber werden möglicherweise nicht mehr verwendet, da `MediaAIService` direkt den Provider nutzt
- **Empfehlung:** Prüfen, ob diese Services noch verwendet werden oder ob sie durch Provider ersetzt wurden

---

## 2. ANDERE KI-NUTZUNGEN

### **2.1 Orchestrator (KI-Agenten)**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/ki-orchestrator/OrchestratorCore.ts` | `OrchestratorCore` | **Agenten-Orchestrierung** | ✅ **NEIN** - Keine direkte KI-Nutzung, nur Orchestrierung |
| `src/lib/ki-orchestrator/initialize.ts` | `initializeOrchestrator()` | **Agenten-Registrierung** | ✅ **NEIN** - Keine direkte KI-Nutzung |

**Details:**
- **Keine direkte OpenAI-Nutzung:** Orchestrator orchestriert nur Agenten, nutzt keine KI direkt
- **DSGVO-Integration:** Prüft `dsgvoDecisionEngine.getAIProcessingPermission()` vor Task-Dispatch

---

### **2.2 DSGVO Decision Engine**

| Datei | Funktion/Name | Art der Nutzung | Business-Logik vermischt? |
|-------|---------------|-----------------|---------------------------|
| `src/lib/dsgvo/decision-engine.ts` | `DSGVODecisionEngine` | **KI-Firewall** | ✅ **NEIN** - Keine direkte KI-Nutzung, nur Prüfung |

**Details:**
- **Keine direkte OpenAI-Nutzung:** Decision Engine prüft nur Berechtigungen, nutzt keine KI

---

## 3. ZUSAMMENFASSUNG

### **3.1 Direkte OpenAI-Nutzung**

**Nur eine Stelle:**
- ✅ `src/lib/media/ai/providers/OpenAIMediaAIProvider.ts` - Einzige direkte OpenAI-Nutzung

**Alle anderen Stellen:**
- ✅ Nutzen Provider-Abstraktion (`MediaAIProvider` Interface)
- ✅ Keine direkte OpenAI-Nutzung

---

### **3.2 Business-Logik-Vermischung**

**Vermischt (im Provider):**
- ⚠️ `OpenAIMediaAIProvider.buildAnalysisPrompt()` - Prompt-Building
- ⚠️ `OpenAIMediaAIProvider.parseOpenAIResponse()` - JSON-Parsing
- ⚠️ `OpenAIMediaAIProvider.analyzeImage()` - Vollständige Analyse-Logik

**Sauber getrennt:**
- ✅ `MediaAIService` - Nutzt nur Provider-Interface
- ✅ API-Routen - Nutzen nur Services
- ✅ Provider-Factory - Reine Factory-Logik

---

### **3.3 Environment-Variablen**

**OpenAI-spezifisch:**
- `OPENAI_API_KEY` - API-Key (via SecretManager)
- `OPENAI_MODEL` - Modell-Auswahl (Default: "gpt-4-vision-preview")
- `MEDIA_AI_PROVIDER` - Provider-Auswahl (mock/openai)

---

### **3.4 Secret-Handling**

**Sauber implementiert:**
- ✅ `SecretManager.loadSecret("ENV:OPENAI_API_KEY")` - Keine Keys im Code
- ✅ `OPENAI_SECRET_REF` - Nur Referenz, kein Key-Wert

---

## 4. ERKENNTNISSE

### **4.1 Stärken**

1. ✅ **Gute Abstraktion:** Provider-Pattern bereits vorhanden
2. ✅ **Saubere Trennung:** Services nutzen Provider-Interface, keine direkte OpenAI-Nutzung
3. ✅ **Secret-Handling:** Keine API-Keys im Code
4. ✅ **DSGVO-Integration:** Decision Engine prüft vor jeder KI-Aktion

---

### **4.2 Verbesserungspotenzial**

1. ⚠️ **Business-Logik im Provider:** Prompt-Building und Response-Parsing sind im Provider
2. ⚠️ **Veraltete Services:** `services/`-Ordner existiert, aber möglicherweise nicht mehr verwendet
3. ⚠️ **Eingeschränktes Interface:** `MediaAIProvider` ist nur für Bildanalyse, nicht für allgemeine KI-Aufgaben

---

### **4.3 Empfehlungen für zukünftige Provider-Schicht**

1. ✅ **Allgemeines AIProvider-Interface:** Nicht nur für Media, sondern für alle KI-Aufgaben
2. ✅ **Business-Logik aus Provider:** Prompt-Building und Response-Parsing in separate Layer
3. ✅ **Task-basierte Abstraktion:** `requestText()`, `requestJson()` statt `analyzeImage()`
4. ✅ **Service-Module prüfen:** Klären, ob `services/`-Ordner noch verwendet wird

---

## 5. NÄCHSTE SCHRITTE

1. ✅ **Design-Vorschlag erstellen:** Allgemeines `AiProvider`-Interface
2. ✅ **Migration-Plan:** Wie von `MediaAIProvider` zu allgemeinem `AiProvider`
3. ✅ **Service-Module prüfen:** Status der `services/`-Module klären

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*




