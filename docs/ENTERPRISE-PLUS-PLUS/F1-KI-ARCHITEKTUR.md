# F1-KI-ARCHITEKTUR

## Vollständige modulare Architektur für zukünftige KI-Integration

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **PLANUNG** (Keine Implementierung)  
**Methode:** ABC-Methode (Analyse → Bauplanung → Kontrolle)  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert die **vollständige, modulare KI-Architektur** für Lopez IT Welt Enterprise++. Die Architektur ist darauf ausgelegt, **ohne Neubau** in Produktion übertragbar zu sein und langfristig skalierbar zu bleiben.

**Kernprinzipien:**
- ✅ **Modular:** Jede KI-Komponente ist isoliert und austauschbar
- ✅ **Erweiterbar:** Neue Provider, Modelle und Agenten können einfach hinzugefügt werden
- ✅ **DSGVO-konform:** DSGVO Decision Engine ist zentral integriert
- ✅ **Enterprise++:** IBM/SAP/Siemens-Standards eingehalten
- ✅ **Keine harte Kopplung:** Bestehendes System bleibt unverändert

---

## 1. ARCHITEKTUR-ÜBERSICHT

### **1.1 Schichtenmodell**

```
┌─────────────────────────────────────────────────────────┐
│              PRÄSENTATIONSSCHICHT (UI)                  │
│  ─────────────────────────────────────────────────────  │
│  • Admin-UI (KI-Monitoring, Agenten-Verwaltung)         │
│  • Media-UI (KI-Analyse, Bulk-Actions)                  │
│  • Orchestrator-UI (Task-Management, Events)            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            ANWENDUNGSSCHICHT (API/Orchestrator)          │
│  ─────────────────────────────────────────────────────  │
│  • OrchestratorCore (Zentrale Orchestrierung)           │
│  • MediaAIService (Media-spezifische KI)                │
│  • API-Endpoints (/api/orchestrator/*, /api/admin/media/ai/*)│
│  • DSGVO Decision Engine (KI-Firewall)                  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            PROVIDER-SCHICHT (Abstraktion)                │
│  ─────────────────────────────────────────────────────  │
│  • ProviderFactory (Provider-Erstellung)                 │
│  • MediaAIProvider Interface (Abstraktion)              │
│  • Provider-Implementierungen:                          │
│    - OpenAIProvider (GPT-4 Vision)                       │
│    - GoogleCloudVisionProvider                          │
│    - AzureComputerVisionProvider                        │
│    - MockProvider (Entwicklung)                         │
│    - LLaMAProvider (Self-Hosted, zukünftig)             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         EXTERNE KI-SERVICES (Cloud/Self-Hosted)         │
│  ─────────────────────────────────────────────────────  │
│  • OpenAI API (GPT-4 Vision, Embeddings)                 │
│  • Google Cloud Vision API                               │
│  • Azure Computer Vision                                 │
│  • LLaMA Server (Self-Hosted, zukünftig)                 │
│  • Vector-DB (Pinecone/Weaviate/Self-Hosted, zukünftig) │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            DATENZUGRIFFS-SCHICHT (Database)              │
│  ─────────────────────────────────────────────────────  │
│  • MySQL 8.0+ (Hauptdatenbank)                          │
│  • Orchestrator-Tabellen (orchestrator_events, etc.)    │
│  • Media-Tabellen (media_meta, ai_analysis_results)     │
│  • DSGVO-Tabellen (dsgvo_audit_events, consent)          │
│  • Agent-Registry (in-memory + DB-Persistierung)         │
└─────────────────────────────────────────────────────────┘
```

### **1.2 Modulare Komponenten**

#### **A. Orchestrator-Core**

**Zweck:** Zentrale Orchestrierung aller KI-Agenten und Tasks

**Komponenten:**
- `OrchestratorCore.ts` - Haupt-Klasse für Task-Dispatch
- `AgentRegistry.ts` - Agenten-Registrierung und -Verwaltung
- `ContextManager.ts` - Kontext-Management (User, DSGVO, System)
- `QualityGate.ts` - Quality-Gate-Prüfung (Input/Output-Validierung)
- `OrchestratorAudit.ts` - Audit-Logging (ORCH_* Events)
- `QueueManager.ts` - Async-Task-Queue (für Batch-Processing)

**Schnittstellen:**
```typescript
interface OrchestratorCore {
    registerAgent(agentDef: AgentDefinition): Promise<void>;
    unregisterAgent(agentName: string): Promise<void>;
    dispatchTask(task: OrchestratorTask): Promise<OrchestratorResult>;
    dispatchTaskAsync(task: OrchestratorTask, options?: QueueOptions): Promise<string | null>;
}
```

**DSGVO-Integration:**
- Jeder Task wird durch DSGVO Decision Engine geprüft
- Automatische Blockierung bei Verletzungen
- Vollständige Audit-Logs

---

#### **B. Provider-Layer**

**Zweck:** Abstraktion über verschiedene KI-Provider (OpenAI, Google, Azure, LLaMA)

**Komponenten:**
- `ProviderFactory.ts` - Factory für Provider-Erstellung
- `MediaAIProvider` Interface - Abstrakte Schnittstelle
- `OpenAIMediaAIProvider.ts` - OpenAI-Implementierung
- `GoogleCloudVisionProvider.ts` - Google-Implementierung (zukünftig)
- `AzureComputerVisionProvider.ts` - Azure-Implementierung (zukünftig)
- `LLaMAProvider.ts` - Self-Hosted LLaMA (zukünftig)
- `MockProvider.ts` - Mock für Entwicklung

**Schnittstellen:**
```typescript
interface MediaAIProvider {
    getName(): string;
    getVersion(): string;
    isAvailable(): Promise<ProviderStatus>;
    analyzeImage(imageBuffer: Buffer, mimeType: string, options?: AnalysisOptions): Promise<FullAIAnalysisResult>;
    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate;
    findSimilar?(mediaId: string, limit: number): Promise<SimilarMedia[]>;
    search?(params: SmartSearchParams): Promise<SmartSearchResult[]>;
}
```

**Provider-Auswahl:**
- Konfigurierbar über Environment-Variablen (`MEDIA_AI_PROVIDER=openai`)
- Fallback-Mechanismus (bei Ausfall automatisch wechseln)
- Kosten-Tracking pro Provider

---

#### **C. Agenten-System**

**Zweck:** Spezialisierte Agenten für verschiedene Aufgaben

**Bestehende Agenten:**
- `media-ai-agent` - Media-Analyse (Tagging, Alt-Text, Person-Detection)
- `dev-assistant-agent` - Entwickler-Assistenz (Code-Analyse, Dokumentation)
- `doc-assistant-agent` - Dokumentations-Assistenz (Summarization, Translation)
- `compliance-agent` - Compliance-Prüfung (DSGVO, Enterprise++)
- `quality-agent` - Qualitätskontrolle (Code-Qualität, Performance)

**Zukünftige Agenten:**
- `content-generation-agent` - Content-Generierung (Texte, Bilder)
- `translation-agent` - Automatische Übersetzung
- `analytics-agent` - Analytics und Reporting
- `automation-agent` - Workflow-Automatisierung

**Agent-Struktur:**
```typescript
interface AgentDefinition {
    name: string;
    type: "media" | "dev" | "doc" | "support" | "business" | "monitoring" | "admin" | "orchestrator";
    capabilities: string[];
    dsgvoScope: string[];
    riskProfile: "low" | "medium" | "high";
    enabled: boolean;
}
```

---

#### **D. DSGVO-Integration**

**Zweck:** Rechtssichere KI-Verarbeitung

**Komponenten:**
- `DSGVODecisionEngine` - Zentrale KI-Firewall
- `ConsentService` - Consent-Management
- `DSGVOEnforceMiddleware` - Middleware für API-Routen
- `DSGVOAuditLogger` - Audit-Logging

**Prüfungen vor jeder KI-Aktion:**
1. Consent-Prüfung (`checkConsentForAI()`)
2. DSGVO-Blocker-Prüfung (`checkDSGVOBlockers()`)
3. Risiko-Bewertung (`evaluateRisk()`)
4. Entscheidung (`getAIProcessingPermission()`)

**Audit-Events:**
- `AI_BLOCKED_NO_CONSENT`
- `AI_BLOCKED_DSGVO_RISK_TOO_HIGH`
- `AI_BLOCKED_PERSON_DETECTED`
- `AI_ALLOWED`
- `AI_PROCESSED`

---

#### **E. Media-AI-Service**

**Zweck:** Media-spezifische KI-Funktionen

**Komponenten:**
- `MediaAIService.ts` - Haupt-Service
- `services/TaggingService.ts` - Automatisches Tagging
- `services/AltTextService.ts` - Alt-Text-Generierung
- `services/QualityCheckService.ts` - Qualitätsprüfung
- `services/CategoryService.ts` - Kategorisierung
- `services/PersonDetectionService.ts` - Personenerkennung
- `services/SimilarityService.ts` - Ähnlichkeitssuche
- `services/CICheckService.ts` - CI-Branding-Prüfung

**Funktionen:**
- `analyzeMedia()` - Vollständige Bildanalyse
- `analyzeBatch()` - Batch-Analyse für mehrere Medien
- `smartSearch()` - Semantische Suche (zukünftig mit Vector-DB)
- `findSimilar()` - Ähnliche Medien finden

---

## 2. DATENFLUSS

### **2.1 Media-Analyse (Beispiel)**

```
1. Admin/UI → POST /api/admin/media/ai/analyze
   └─ mediaId: "abc123", userId: "user456"

2. API-Route → DSGVOEnforceMiddleware
   └─ Prüft Consent, User-Rolle, DSGVO-Boundaries

3. MediaAIService.analyzeMedia()
   └─ DSGVO Decision Engine prüft Berechtigung
   └─ Lädt Medium aus Datenbank
   └─ Lädt Bild-Daten vom Dateisystem

4. ProviderFactory.getProvider()
   └─ Lädt Provider aus Config (z.B. "openai")
   └─ Erstellt Provider-Instanz (Singleton)

5. OpenAIProvider.analyzeImage()
   └─ Konvertiert Bild zu Base64
   └─ API-Call zu OpenAI GPT-4 Vision
   └─ Verarbeitet Response

6. MediaAIService speichert Ergebnisse
   └─ meta.json aktualisiert
   └─ Datenbank aktualisiert
   └─ Kosten-Tracking

7. Response an Admin/UI
   └─ Vollständiges Analyse-Ergebnis
   └─ DSGVO-Status
   └─ Kosten-Information
```

### **2.2 Orchestrator-Task (Beispiel)**

```
1. Admin/UI → POST /api/orchestrator/task
   └─ task: { agent: "media-ai-agent", payload: {...} }

2. OrchestratorCore.dispatchTask()
   └─ Prüft Agent-Registry (Agent vorhanden? aktiviert?)
   └─ DSGVO Decision Engine prüft Berechtigung
   └─ ContextManager lädt Kontext (User, DSGVO, System)

3. QualityGate prüft Input
   └─ Validierung der Task-Parameter
   └─ Konsistenz-Prüfung

4. Agent führt Task aus
   └─ Agent-spezifische Logik
   └─ Provider-Aufruf (falls nötig)

5. QualityGate prüft Output
   └─ Validierung der Ergebnisse
   └─ Qualitätsprüfung

6. OrchestratorAudit loggt Event
   └─ ORCH_TASK_COMPLETED / ORCH_TASK_FAILED

7. Response an Admin/UI
   └─ OrchestratorResult mit Erfolg/Fehler
```

---

## 3. ERWEITERBARKEIT

### **3.1 Neuen Provider hinzufügen**

**Schritte:**
1. `MediaAIProvider` Interface implementieren
2. Provider-Klasse erstellen (`src/lib/media/ai/providers/NewProvider.ts`)
3. Provider in `ProviderFactory` registrieren
4. Environment-Variable hinzufügen (`NEW_PROVIDER_API_KEY`)
5. Config erweitern (`src/lib/media/ai/config.ts`)

**Beispiel:**
```typescript
// src/lib/media/ai/providers/LLaMAProvider.ts
export class LLaMAProvider implements MediaAIProvider {
    getName(): string { return "llama"; }
    async analyzeImage(imageBuffer: Buffer, mimeType: string, options?: AnalysisOptions): Promise<FullAIAnalysisResult> {
        // LLaMA-API-Call
    }
}
```

---

### **3.2 Neuen Agenten hinzufügen**

**Schritte:**
1. Agent-Definition erstellen
2. Agent in `initializeOrchestrator()` registrieren
3. Agent-Logik implementieren (falls nötig)
4. API-Endpoint erstellen (falls nötig)
5. UI-Komponente erstellen (falls nötig)

**Beispiel:**
```typescript
// src/lib/ki-orchestrator/initialize.ts
await orchestratorCore.registerAgent({
    name: "content-generation-agent",
    type: "business",
    capabilities: ["text-generation", "image-generation"],
    dsgvoScope: ["orchestrator_ki"],
    riskProfile: "medium",
    enabled: true
});
```

---

### **3.3 Neues KI-Modell hinzufügen**

**Schritte:**
1. Modell in Provider-Klasse unterstützen
2. Config erweitern (Modell-Auswahl)
3. Kosten-Tracking erweitern (neue Preise)
4. Tests erweitern

**Beispiel:**
```typescript
// src/lib/media/ai/providers/OpenAIMediaAIProvider.ts
const MODEL = process.env.OPENAI_MODEL || "gpt-4-vision-preview";
// Später: "gpt-4o", "gpt-4-turbo", etc.
```

---

## 4. SKALIERBARKEIT

### **4.1 Horizontal (mehrere Server)**

**Strategie:**
- Load Balancer vor API-Server
- Shared Database (MySQL)
- Shared File Storage (Media-Dateien)
- Redis für Session-Management (optional)
- Queue-System für Async-Tasks (optional)

**Architektur:**
```
┌─────────────┐
│ Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│API 1│ │API 2│
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
┌──────▼──────┐
│   MySQL     │
│ (Shared DB) │
└─────────────┘
```

---

### **4.2 Vertical (größere Server)**

**Strategie:**
- Mehr CPU/RAM für KI-Processing
- GPU-Support für Self-Hosted Modelle (LLaMA)
- Optimierte Datenbank-Indizes
- Caching (Redis) für häufige Abfragen

---

### **4.3 Self-Hosted KI (LLaMA)**

**Strategie:**
- LLaMA-Server auf separater Maschine
- GPU-Support (NVIDIA CUDA)
- Model-Versionierung
- Fallback zu Cloud-Providern

**Architektur:**
```
┌─────────────────┐
│  Main Server     │
│  (Next.js API)   │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│  LLaMA Server   │
│  (GPU-Server)   │
│  • LLaMA 2/3    │
│  • CUDA         │
└─────────────────┘
```

---

## 5. SICHERHEIT

### **5.1 API-Keys**

**Strategie:**
- Keine API-Keys im Code/Repo/DB
- Environment-Variablen oder Secret-Manager
- Rotation-Mechanismus

**Implementierung:**
- `SecretManager` (bereits vorhanden)
- Environment-Variablen: `ENV:OPENAI_API_KEY`
- Später: Vault/Secret-Manager-Integration

---

### **5.2 Rate-Limiting**

**Strategie:**
- Provider-spezifische Rate-Limits
- Retry-Logik mit Exponential Backoff
- Queue-System für Batch-Processing

**Implementierung:**
- `RateLimitInfo` Interface (bereits vorhanden)
- Retry-Logik in Provider-Klassen
- Queue-Manager für Async-Tasks

---

### **5.3 Kosten-Kontrolle**

**Strategie:**
- Kosten-Tracking pro Request
- Tägliche/Monatliche Limits
- Alerts bei Überschreitung

**Implementierung:**
- `CostTracker` (bereits vorhanden)
- Kosten-Tabellen in Datenbank
- Admin-UI für Kosten-Monitoring

---

## 6. MONITORING & LOGGING

### **6.1 Audit-Logs**

**Komponenten:**
- `OrchestratorAudit` - Orchestrator-Events
- `DSGVOAuditLogger` - DSGVO-Events
- `SystemLogs` - System-Logs

**Events:**
- `ORCH_TASK_RECEIVED`
- `ORCH_TASK_COMPLETED`
- `ORCH_TASK_FAILED`
- `AI_BLOCKED_*`
- `AI_ALLOWED`
- `AI_PROCESSED`

---

### **6.2 Metriken**

**Komponenten:**
- Task-Durchsatz (Tasks/Sekunde)
- Erfolgsrate (Success/Failure)
- Durchschnittliche Latenz
- Kosten pro Tag/Monat
- Provider-Auslastung

**UI:**
- `/admin/orchestrator/` - Übersicht
- `/admin/orchestrator/events` - Events-Liste
- `/admin/monitoring` - System-Metriken

---

## 7. TESTING

### **7.1 Unit-Tests**

**Komponenten:**
- Provider-Tests (Mock-Provider)
- Orchestrator-Tests
- DSGVO-Tests
- Service-Tests

---

### **7.2 Integration-Tests**

**Komponenten:**
- API-Endpoint-Tests
- End-to-End-Tests (UI → API → Provider)
- DSGVO-Integration-Tests

---

### **7.3 Performance-Tests**

**Komponenten:**
- Load-Tests (viele gleichzeitige Requests)
- Stress-Tests (Rate-Limits)
- Kosten-Tests (Kosten-Optimierung)

---

## 8. MIGRATIONSPFAD

### **8.1 Bestehendes System**

**Aktueller Stand:**
- ✅ MediaAIService vorhanden
- ✅ OpenAIProvider vorhanden
- ✅ DSGVO Decision Engine vorhanden
- ✅ OrchestratorCore vorhanden (Sprint 1)

**Keine Änderungen nötig:**
- Bestehende Implementierung bleibt unverändert
- Neue Architektur wird parallel aufgebaut
- Schrittweise Migration möglich

---

### **8.2 Zukünftige Erweiterungen**

**Phase F.1 (2025 Q1):**
- Provider-Layer erweitern (Google, Azure)
- Vector-DB für Smart Search
- Batch-Processing optimieren

**Phase F.2 (2025 Q2):**
- Self-Hosted LLaMA
- Fine-Tuning-Support
- Erweiterte Agenten

**Phase F.3 (2025 Q3-Q4):**
- Multi-Model-Support
- A/B-Testing für Modelle
- Kosten-Optimierung

---

## 9. DOKUMENTATION

### **9.1 Code-Dokumentation**

**Standards:**
- JSDoc für alle öffentlichen Funktionen
- TypeScript-Interfaces für alle Schnittstellen
- README.md für jedes Modul

---

### **9.2 Architektur-Dokumentation**

**Dokumente:**
- `F1-KI-ARCHITEKTUR.md` (dieses Dokument)
- `F1-KI-PROVIDER-LAYER-PLAN.md` (Provider-Layer-Details)
- `F1-KI-SKALIERUNGSPLAN.md` (Skalierungs-Strategie)
- `F1-KI-RISIKOPRÜFUNG.md` (Risiko-Bewertung)

---

## 10. ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **Modulare Architektur:** Jede Komponente ist isoliert und austauschbar
- ✅ **Erweiterbar:** Neue Provider, Modelle und Agenten können einfach hinzugefügt werden
- ✅ **DSGVO-konform:** DSGVO Decision Engine ist zentral integriert
- ✅ **Enterprise++:** IBM/SAP/Siemens-Standards eingehalten
- ✅ **Keine harte Kopplung:** Bestehendes System bleibt unverändert
- ✅ **Skalierbar:** Horizontal (mehrere Server) und Vertical (größere Server)
- ✅ **Self-Hosted:** LLaMA-Support für zukünftige Self-Hosted-Strategie

**Nächste Schritte:**
1. Provider-Layer-Details ausarbeiten (F1-KI-PROVIDER-LAYER-PLAN.md)
2. Skalierungsplan erstellen (F1-KI-SKALIERUNGSPLAN.md)
3. Risikoprüfung durchführen (F1-KI-RISIKOPRÜFUNG.md)
4. Implementierungsphase F.1 vorbereiten

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*




