# P5-USE-CASES

## Datenschutz-Folgenabschätzung – Use-Case-Inventar (Enterprise++)

### Lopez IT Welt – KI-gestützte Systeme

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert das vollständige **Use-Case-Inventar** für die Datenschutz-Folgenabschätzung (DSFA, Phase P5) innerhalb der Lopez-IT-Welt KI-Infrastruktur.

Es beinhaltet alle KI-Prozesse, datenverarbeitenden Module und automatisierten Entscheidungswege.

Damit erfüllt es die Anforderungen aus:

- **DSGVO Art. 35**
- **ISO 27001 / ISO 27701**
- **EU AI Act (Risk Classification)**
- **Enterprise++ Architektur**
- **SAP / IBM / Siemens Governance Standards**

Dieses Dokument dient als Grundlage für P5.2 (Risikoanalyse) und P5.3 (Bewertung).

---

## 2. Struktur des Use-Case-Inventars

Jeder Use-Case wird einheitlich beschrieben nach:

- **Name & Kategorie**
- **Beschreibung**
- **Datenarten**
- **Personenbezogene Daten**
- **Personenerkennung (Media-KI)**
- **Datenfluss (Textdiagramm)**
- **Provider / Externe Verarbeitung**
- **Risikoflags**
- **Vorläufige Risikoklasse**
- **Review-Zyklus**
- **Verantwortlichkeiten**
- **Bezug zu Maßnahmen & Freigabeprozess**

---

## 3. Übersicht aller KI-Use-Cases

Aktuell identifizierte Use-Cases:

1. **Media-KI (Bildanalyse)**
2. **KI-Orchestrator Core**
3. **ContextManager / Semantic Processing**
4. **QualityGate & Decision Engine**
5. **Audit-Analyse-Agent (ComplianceAgent)**
6. **ContentAgent (Textgenerierung)**
7. **Async KI-Processing Queue**
8. **Rechnungsmodul KI-Unterstützung**
9. **DSGVO-Firewall (Sensitive Data Analyzer)**
10. **Admin-UI Freigabeprozesse (High-Risk Control)**

Jede dieser Funktionen wird einzeln dokumentiert.

---

## 4. Use-Case Detailbeschreibungen

---

### **4.1 Use-Case: Media-KI (Bildanalyse)**

**Kategorie:** High-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/media/ai/MediaAIService.ts`

**Beschreibung:**  
Analyse hochgeladener Medien (Bilder) zur Erkennung von Personen, Objekten und relevanten Inhalten. Keine biometrische Identifikation.

**Datenarten:**
- Bilddaten (binär)
- Metadaten (Auflösung, MIME-Type)
- KI-Analyse-Ergebnisse (Tags, Kategorien, Beschreibungen)
- Quality-Score
- Category-Suggestion

**Personenbezogene Daten:**
- ✔ **Möglich** – Personen im Bild (nur Erkennung, keine Identifikation)

**Personenerkennung:**
- ✔ **Ja** – Person "vorhanden?" (boolean), aber **keine Identifikation**
- Flag: `has_person = true` → Admin-Freigabe erforderlich

**Datenfluss:**
```
User upload → Storage → MediaAIService.analyzeMedia()
  ↓
DSGVO Decision Engine (Consent-Prüfung)
  ↓
Provider (OpenAI Vision API)
  ↓
Ergebnis: Tags, Description, Quality-Score, has_person
  ↓
Meta.json speichern
  ↓
Audit-Log (AI_PROCESSED)
```

**Provider / Externe Verarbeitung:**
- **OpenAI Vision API** (GPT-4 Vision)
- Datenübertragung: HTTPS verschlüsselt
- Datenaufbewahrung: OpenAI speichert Daten temporär (30 Tage)
- Vertrag: OpenAI Enterprise-Vertrag (DSGVO-konform)

**Risikoflags:**
- ⚠️ **Personenerkennung** (High-Risk)
- ⚠️ **Externe API** (Provider-Risiko)
- ⚠️ **Kostenkontrolle** (API-Kosten)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 12)

**Review-Zyklus:** 12 Monate (Medium-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "Media-KI")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4-5)

---

### **4.2 Use-Case: KI-Orchestrator Core**

**Kategorie:** Medium-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/ki-orchestrator/OrchestratorCore.ts`

**Beschreibung:**  
Zentrale Orchestrierung aller KI-Agenten. Koordiniert Task-Dispatch, Context-Management, Quality-Gates und Audit-Logging.

**Datenarten:**
- Task-Definitionen (JSON)
- Context-Daten (User-Context, DSGVO-Context, System-Context)
- Agent-Definitionen (Registry)
- Task-Ergebnisse (JSON)

**Personenbezogene Daten:**
- ✔ **Möglich** – User-ID, Context-Daten (DSGVO-konform bereinigt)

**Personenerkennung:**
- ❌ **Nein** – Keine direkte Personenerkennung

**Datenfluss:**
```
API Request → OrchestratorCore.dispatchTask()
  ↓
AgentRegistry (Agent prüfen)
  ↓
DSGVO Decision Engine (Consent-Prüfung)
  ↓
ContextManager (Kontext bauen & bereinigen)
  ↓
QualityGate (Input prüfen)
  ↓
Agent ausführen
  ↓
QualityGate (Output prüfen)
  ↓
Ergebnis zurückgeben
  ↓
Audit-Log (ORCH_TASK_COMPLETED)
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet

**Risikoflags:**
- ⚠️ **Context-Management** (Datenbereinigung erforderlich)
- ⚠️ **Task-Routing** (Fehlerhafte Weiterleitung möglich)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 6)

**Review-Zyklus:** 12 Monate (Medium-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "KI-Orchestrator")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.3 Use-Case: ContextManager / Semantic Processing**

**Kategorie:** Medium-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/ki-orchestrator/ContextManager.ts`

**Beschreibung:**  
Verwaltet den KI-Kontext für Orchestrator-Tasks. Stellt sicher, dass nur DSGVO/Scope-konforme Daten weitergegeben werden.

**Datenarten:**
- User-Context (User-ID, Timestamp)
- DSGVO-Context (Consent-Status, Risk-Score)
- System-Context (Version, Environment)
- Task-Context (Payload-Daten)

**Personenbezogene Daten:**
- ✔ **Möglich** – User-ID, Context-Daten (bereinigt)

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Task → ContextManager.buildContextForTask()
  ↓
attachUserContext() (User-ID, Timestamp)
  ↓
attachDSGVOContext() (Consent, Risk-Score)
  ↓
attachSystemContext() (Version, Environment)
  ↓
sanitizeContextForDSGVO() (Datenbereinigung)
  ↓
Bereinigter Kontext zurückgeben
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet

**Risikoflags:**
- ⚠️ **Datenbereinigung** (Fehlerhafte Bereinigung möglich)
- ⚠️ **Context-Leakage** (Unbeabsichtigte Datenweitergabe)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 6)

**Review-Zyklus:** 12 Monate (Medium-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "KI-Orchestrator")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.4 Use-Case: QualityGate & Decision Engine**

**Kategorie:** Medium-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/ki-orchestrator/QualityGate.ts`, `src/lib/dsgvo/decision-engine.ts`

**Beschreibung:**  
Zentrale Quality-Gate-Logik für Input/Output-Prüfung und DSGVO-Entscheidungslogik (KI-Firewall).

**Datenarten:**
- Task-Definitionen (Input)
- Task-Ergebnisse (Output)
- DSGVO-Entscheidungen (Allowed/Blocked, Reason, Risk)
- Quality-Scores (0-100)

**Personenbezogene Daten:**
- ✔ **Möglich** – User-ID, Media-ID (für Consent-Prüfung)

**Personenerkennung:**
- ❌ **Nein** – Keine direkte Personenerkennung (prüft nur Flags)

**Datenfluss:**
```
Task → QualityGate.evaluateInputQuality()
  ↓
DSGVO Decision Engine.getAIProcessingPermission()
  ↓
Consent-Prüfung, Risk-Bewertung, Blocker-Prüfung
  ↓
Entscheidung: Allowed/Blocked
  ↓
Audit-Log (AI_ALLOWED / AI_BLOCKED_*)
  ↓
Task-Ergebnis → QualityGate.evaluateOutputQuality()
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet

**Risikoflags:**
- ⚠️ **Fehlerhafte Consent-Prüfung** (High-Risk)
- ⚠️ **Umgehung der Firewall** (Critical-Risk)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 10)

**Review-Zyklus:** 6 Monate (High-Risk-Komponente)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher + Datenschutzbeauftragter (bei High-Risk)
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "DSGVO Decision Engine")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4-5)

---

### **4.5 Use-Case: Audit-Analyse-Agent (ComplianceAgent)**

**Kategorie:** Low-Risk KI  
**Status:** ⚠️ **DEFINIERT** (Agent vorhanden, Orchestrator-Integration geplant)  
**Datei:** `agents/compliance-checker/checker.ts`

**Beschreibung:**  
Automatische Analyse von Audit-Logs zur Erkennung von Compliance-Verstößen, Anomalien und Risiken.

**Datenarten:**
- Audit-Log-Daten (Events, Actions, Results)
- Compliance-Metriken (Scores, Trends)
- Anomalie-Erkennung (Pattern-Matching)

**Personenbezogene Daten:**
- ✔ **Möglich** – User-ID, IP-Adresse (aus Audit-Logs)

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Audit-Logs → ComplianceAgent.analyze()
  ↓
Pattern-Matching (Anomalien erkennen)
  ↓
Compliance-Score berechnen
  ↓
Report generieren
  ↓
Audit-Log (COMPLIANCE_ANALYSIS_COMPLETED)
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet (Pattern-Matching)

**Risikoflags:**
- ⚠️ **Fehlerhafte Anomalie-Erkennung** (False Positives)

**Vorläufige Risikoklasse:** **Low** (Risikowert: 3)

**Review-Zyklus:** 12 Monate (Low-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "ComplianceAgent")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.6 Use-Case: ContentAgent (Textgenerierung)**

**Kategorie:** Medium-Risk KI  
**Status:** ⚠️ **DEFINIERT** (Agent geplant, noch nicht implementiert)

**Beschreibung:**  
Automatische Textgenerierung für Dokumente, E-Mails, Beschreibungen. Verwendet LLM (Large Language Model).

**Datenarten:**
- Eingabetext (Prompts, Templates)
- Generierter Text (Output)
- Metadaten (Language, Style, Tone)

**Personenbezogene Daten:**
- ✔ **Möglich** – Namen, Adressen (aus Eingabetext)

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Eingabetext → ContentAgent.generate()
  ↓
DSGVO Decision Engine (Consent-Prüfung)
  ↓
Provider (OpenAI GPT-4)
  ↓
Generierter Text
  ↓
Audit-Log (CONTENT_GENERATED)
```

**Provider / Externe Verarbeitung:**
- **OpenAI GPT-4 API**
- Datenübertragung: HTTPS verschlüsselt
- Datenaufbewahrung: OpenAI speichert Daten temporär (30 Tage)
- Vertrag: OpenAI Enterprise-Vertrag (DSGVO-konform)

**Risikoflags:**
- ⚠️ **Externe API** (Provider-Risiko)
- ⚠️ **Personenbezogene Daten im Prompt** (High-Risk)
- ⚠️ **Kostenkontrolle** (API-Kosten)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 9)

**Review-Zyklus:** 12 Monate (Medium-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "ContentAgent")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.7 Use-Case: Async KI-Processing Queue**

**Kategorie:** Low-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/ki-orchestrator/QueueManager.ts`

**Beschreibung:**  
Asynchrone Verarbeitung von KI-Tasks über Redis-Queue (BullMQ). Ermöglicht Hintergrundverarbeitung ohne Blockierung.

**Datenarten:**
- Task-Definitionen (JSON)
- Queue-Metadaten (Priority, Delay, Retry)
- Task-Status (Waiting, Active, Completed, Failed)

**Personenbezogene Daten:**
- ✔ **Möglich** – User-ID, Task-Payload (DSGVO-konform bereinigt)

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Task → QueueManager.enqueueTask()
  ↓
Redis Queue (BullMQ)
  ↓
Worker verarbeitet Task
  ↓
OrchestratorCore.dispatchTask()
  ↓
Ergebnis in Queue speichern
  ↓
Audit-Log (ORCH_TASK_COMPLETED)
```

**Provider / Externe Verarbeitung:**
- **Redis** (lokal oder extern)
- Datenaufbewahrung: Redis speichert Tasks temporär (1 Stunde Completed, 24 Stunden Failed)

**Risikoflags:**
- ⚠️ **Queue-Verlust** (Redis-Ausfall)
- ⚠️ **Task-Duplikation** (Retry-Mechanismus)

**Vorläufige Risikoklasse:** **Low** (Risikowert: 4)

**Review-Zyklus:** 12 Monate (Low-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "Async Queue")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.8 Use-Case: Rechnungsmodul KI-Unterstützung**

**Kategorie:** Low-Risk KI  
**Status:** ⚠️ **GEPLANT** (Rechnungsmodul vorhanden, KI-Unterstützung geplant)

**Beschreibung:**  
KI-gestützte Unterstützung bei Rechnungsgenerierung (z.B. automatische Positionen-Vorschläge, Kategorisierung).

**Datenarten:**
- Rechnungsdaten (Kunde, Positionen, Beträge)
- KI-Vorschläge (Kategorien, Positionen)
- Metadaten (Language, Format)

**Personenbezogene Daten:**
- ✔ **Ja** – Kundenname, Adresse, Rechnungsdaten

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Rechnungsdaten → KI-Unterstützung
  ↓
DSGVO Decision Engine (Consent-Prüfung)
  ↓
Provider (OpenAI GPT-4) - Optional
  ↓
KI-Vorschläge (Kategorien, Positionen)
  ↓
Admin prüft und übernimmt
  ↓
Rechnung generieren
  ↓
Audit-Log (INVOICE_KI_SUPPORT_COMPLETED)
```

**Provider / Externe Verarbeitung:**
- **OpenAI GPT-4 API** (optional, geplant)
- Datenübertragung: HTTPS verschlüsselt
- Datenaufbewahrung: OpenAI speichert Daten temporär (30 Tage)

**Risikoflags:**
- ⚠️ **Personenbezogene Daten im Prompt** (High-Risk)
- ⚠️ **GoBD-Compliance** (Rechnungsdaten müssen korrekt sein)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 8)

**Review-Zyklus:** 12 Monate (Medium-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "Rechnungsmodul")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4)

---

### **4.9 Use-Case: DSGVO-Firewall (Sensitive Data Analyzer)**

**Kategorie:** High-Risk KI  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/lib/dsgvo/decision-engine.ts`

**Beschreibung:**  
Zentrale KI-Firewall für rechtssichere KI-Verarbeitung. Prüft alle DSGVO-Bedingungen vor jeder KI-Aktion.

**Datenarten:**
- Consent-Daten (User-ID, Consent-Type, Version, Status)
- Media-Metadaten (has_person, dsgvo_approved_by_admin)
- Risk-Scores (0-100)
- Entscheidungen (Allowed/Blocked, Reason, Blockers)

**Personenbezogene Daten:**
- ✔ **Ja** – User-ID, Consent-Daten, Media-Metadaten

**Personenerkennung:**
- ❌ **Nein** – Keine direkte Personenerkennung (prüft nur Flags)

**Datenfluss:**
```
KI-Aktion → DSGVO Decision Engine.getAIProcessingPermission()
  ↓
checkConsentForAI() (Consent, Version, Revocation, Expiry)
  ↓
checkDSGVOBlockers() (Person, Consent, Version)
  ↓
evaluateRisk() (Risk-Score 0-100)
  ↓
Entscheidung: Allowed/Blocked
  ↓
Audit-Log (AI_ALLOWED / AI_BLOCKED_*)
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet

**Risikoflags:**
- ⚠️ **Fehlerhafte Consent-Prüfung** (Critical-Risk)
- ⚠️ **Umgehung der Firewall** (Critical-Risk)
- ⚠️ **Fehlerhafte Risikobewertung** (High-Risk)

**Vorläufige Risikoklasse:** **Medium** (Risikowert: 10)

**Review-Zyklus:** 6 Monate (High-Risk-Komponente)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher + Datenschutzbeauftragter (bei High-Risk)
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "DSGVO Decision Engine")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4-5)

---

### **4.10 Use-Case: Admin-UI Freigabeprozesse (High-Risk Control)**

**Kategorie:** High-Risk Control  
**Status:** ✅ **IMPLEMENTIERT**  
**Datei:** `src/app/admin/compliance/dsgvo/*`, `src/app/admin/orchestrator/*`

**Beschreibung:**  
Admin-UI für manuelle Freigabe kritischer KI-Funktionen. Ermöglicht Zero-CMD-Freigabeprozesse über Web-Interface.

**Datenarten:**
- Freigabe-Entscheidungen (Approved/Rejected, Reason, Timestamp)
- Admin-Aktionen (Toggle, Approve, Reject)
- Audit-Logs (UI-Actions)

**Personenbezogene Daten:**
- ✔ **Ja** – Admin-User-ID, IP-Adresse, User-Agent

**Personenerkennung:**
- ❌ **Nein** – Keine Personenerkennung

**Datenfluss:**
```
Admin-UI → Freigabe-Request
  ↓
RBAC-Prüfung (orchestrator.manage / compliance.manage)
  ↓
Freigabe-Entscheidung speichern
  ↓
System aktiviert/deaktiviert Feature
  ↓
Audit-Log (FEATURE_APPROVED / FEATURE_REJECTED)
```

**Provider / Externe Verarbeitung:**
- ❌ **Keine** – Intern verarbeitet

**Risikoflags:**
- ⚠️ **Fehlerhafte Freigabe** (High-Risk)
- ⚠️ **Unbefugter Zugriff** (High-Risk)
- ⚠️ **Fehlerhafte RBAC-Prüfung** (Critical-Risk)

**Vorläufige Risikoklasse:** **High** (Risikowert: 15)

**Review-Zyklus:** 6 Monate (High-Risk)

**Verantwortlichkeiten:**
- **Entwicklung:** Systemarchitekt
- **Freigabe:** DSFA-Verantwortlicher + Datenschutzbeauftragter
- **Monitoring:** Admin

**Bezug zu Maßnahmen & Freigabeprozess:**
- Siehe `P5-MEASURES.md` (Abschnitt "Admin-UI")
- Siehe `P5-FREIGABE-PROZESS.md` (Schritt 4-5)

---

## 5. Use-Case-Matrix (Übersicht)

| Use-Case | Kategorie | Risikoklasse | Personenbezogene Daten | Personenerkennung | Provider | Review-Zyklus |
|----------|-----------|--------------|------------------------|-------------------|----------|---------------|
| **Media-KI** | High-Risk KI | Medium (12) | ✔ Möglich | ✔ Ja | OpenAI | 12 Monate |
| **KI-Orchestrator Core** | Medium-Risk KI | Medium (6) | ✔ Möglich | ❌ Nein | Keine | 12 Monate |
| **ContextManager** | Medium-Risk KI | Medium (6) | ✔ Möglich | ❌ Nein | Keine | 12 Monate |
| **QualityGate & Decision Engine** | Medium-Risk KI | Medium (10) | ✔ Möglich | ❌ Nein | Keine | 6 Monate |
| **ComplianceAgent** | Low-Risk KI | Low (3) | ✔ Möglich | ❌ Nein | Keine | 12 Monate |
| **ContentAgent** | Medium-Risk KI | Medium (9) | ✔ Möglich | ❌ Nein | OpenAI | 12 Monate |
| **Async Queue** | Low-Risk KI | Low (4) | ✔ Möglich | ❌ Nein | Redis | 12 Monate |
| **Rechnungsmodul KI** | Low-Risk KI | Medium (8) | ✔ Ja | ❌ Nein | OpenAI (geplant) | 12 Monate |
| **DSGVO-Firewall** | High-Risk KI | Medium (10) | ✔ Ja | ❌ Nein | Keine | 6 Monate |
| **Admin-UI Freigabe** | High-Risk Control | High (15) | ✔ Ja | ❌ Nein | Keine | 6 Monate |

---

## 6. Risiko-Zusammenfassung

### **6.1 Risikoverteilung**

- **Low-Risk:** 2 Use-Cases (ComplianceAgent, Async Queue)
- **Medium-Risk:** 7 Use-Cases (Media-KI, Orchestrator, ContextManager, QualityGate, ContentAgent, Rechnungsmodul, DSGVO-Firewall)
- **High-Risk:** 1 Use-Case (Admin-UI Freigabe)

### **6.2 Personenbezogene Daten**

- **10 Use-Cases** verarbeiten möglicherweise personenbezogene Daten
- **3 Use-Cases** verarbeiten definitiv personenbezogene Daten (Rechnungsmodul, DSGVO-Firewall, Admin-UI)

### **6.3 Personenerkennung**

- **1 Use-Case** führt Personenerkennung durch (Media-KI)
- **Keine biometrische Identifikation** in allen Use-Cases

### **6.4 Externe Provider**

- **3 Use-Cases** verwenden externe APIs (Media-KI, ContentAgent, Rechnungsmodul KI)
- **Provider:** OpenAI (GPT-4 Vision, GPT-4)
- **Verträge:** OpenAI Enterprise-Vertrag (DSGVO-konform)

---

## 7. Nächste Schritte (P5.2 – Risikoidentifikation)

Basierend auf diesem Use-Case-Inventar:

1. **Detaillierte Risikoidentifikation** pro Use-Case
2. **Risikobewertung** mit Risikomatrix (siehe `P5-RISK-MATRIX.md`)
3. **Maßnahmenableitung** (siehe `P5-MEASURES.md`)
4. **Freigabeprozess** für kritische Use-Cases (siehe `P5-FREIGABE-PROZESS.md`)

---

## 8. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Use-Case-Inventar erstellt

---

## 9. Audit-Hash

**Wird nach Freigabe automatisch generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

---

*Generated by Enterprise++ DSFA Use-Case Inventory System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*





