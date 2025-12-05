# P5-RISK-MATRIX

## Risikoidentifikation & Risikobewertung (Ultra-Premium Hybrid)

### Lopez IT Welt – DSGVO Phase P5

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Diese Risikomatrix bildet die vollständige Risikoidentifikation und Risikobewertung für die Datenschutz-Folgenabschätzung (DSFA, Phase P5) der Lopez-IT-Welt KI-Systeme ab.

Sie nutzt ein kombiniertes Framework aus:

- **ISO 27005** (klassisches Sicherheits-Risikomanagement)
- **ISO 27701** (Privacy Risk Management)
- **DSGVO Art. 35** (DSFA)
- **EU AI Act – High-Risk Assessment**
- **SAP / IBM / Siemens Risk Engineering**
- **Enterprise++ KI-Governance**

Die Matrix ist sowohl **quantitativ (5×5)** als auch **qualitativ (narrative Risikoanalyse)** aufgebaut.

---

## 2. Risikomodell (Hybrid)

Die Risiken werden in **5 Kategorien** identifiziert:

### **R1 – Technische Risiken**

- Modellfehler
- Falschklassifikationen
- Systemausfälle
- Fehler im Async-Processing
- Verlust von Zwischenergebnissen
- Provider-Induzierte Fehler (OpenAI)

### **R2 – Datenschutzrisiken**

- Verarbeitung personenbezogener Daten
- Datenabfluss an Drittanbieter
- Personen auf Bildern
- Sensible Daten (health, religion)
- Falsche Verarbeitung
- Fehlerhafte Löschfristen

### **R3 – Organisatorische Risiken**

- Fehler bei Freigaben
- Fehlende RBAC/ABAC-Kontrolle
- Falsch konfigurierte Admin-Rollen
- Unzureichende Schulungen

### **R4 – Operative Risiken**

- Kostenüberschreitungen
- Queue-Fehler
- Überlastung des Providers
- Mangelnde Skalierung
- Fehlgeschlagene KI-Analysen

### **R5 – Compliance Risiken**

- DSGVO-Verstöße
- AI-Act-Verstöße
- GoBD-Verstöße
- Fehlende Auditierung
- Fehlerhafte DSFA

---

## 3. ISO/DSGVO Risikoidentifikation pro Use-Case

### **Bewertungsmaßstab**

#### **Eintrittswahrscheinlichkeit (EW)**

| Stufe | Beschreibung | Definition |
|-------|--------------|------------|
| **1** | Sehr gering | < 1% pro Jahr |
| **2** | Gering | 1-10% pro Jahr |
| **3** | Mittel | 10-30% pro Jahr |
| **4** | Hoch | 30-70% pro Jahr |
| **5** | Sehr hoch | > 70% pro Jahr |

#### **Schadensausmaß (SA)**

| Stufe | Beschreibung | Definition |
|-------|--------------|------------|
| **1** | Gering | Keine oder minimale Auswirkungen |
| **2** | Moderat | Geringfügige Auswirkungen, leicht behebbar |
| **3** | Bedeutsam | Erhebliche Auswirkungen, behebbar |
| **4** | Hoch | Schwere Auswirkungen, schwer behebbar |
| **5** | Kritisch / irreversibel | Katastrophale Auswirkungen, irreversibel |

#### **Formel:**

**RISIKO = EW × SA**

#### **Klassifikation:**

- **0–5 → Low**
- **6–10 → Medium**
- **11–15 → High**
- **16–25 → Critical**

---

## 4. Risikoanalyse pro Use-Case (Ultra-Premium Analyse)

---

### **4.1 Use-Case: Media-KI (Bildanalyse)**

**Kategorie:** High-Risk KI  
**Grund:** Personenerkennung, externer Provider

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Falschklassifizierung von Personen | 3 | 3 | 9 | Quality-Gate, Admin-Freigabe |
| **R2** | Personenbezogene Daten (Gesichter) | 4 | 4 | 16 | DSGVO Decision Engine, Consent-Prüfung |
| **R2** | Datenabfluss an OpenAI (Provider) | 3 | 4 | 12 | Enterprise-Vertrag, Verschlüsselung |
| **R4** | Provider nicht erreichbar | 2 | 3 | 6 | Fallback-Mechanismus, Retry-Logic |
| **R5** | DSGVO-Fehler → Personenanalyse ohne Rechtsgrundlage | 3 | 5 | 15 | Decision Engine, Audit-Logs |

**Gesamtrisiko:**  
➡️ **High (Total Score: 16)** – Höchstes Risiko: Personenbezogene Daten (R2, Score: 16)

**Kritische Risiken:**
- Personenbezogene Daten (Gesichter) – Score: 16 (Critical)
- DSGVO-Fehler ohne Rechtsgrundlage – Score: 15 (High)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "Media-KI")

---

### **4.2 Use-Case: KI-Orchestrator Core**

**Kategorie:** Medium-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Routing-Fehler (falscher Agent) | 2 | 3 | 6 | Agent-Registry, Validierung |
| **R1** | Task-Verlust im Async-Processing | 2 | 3 | 6 | Queue-Manager, Retry-Mechanismus |
| **R3** | Freigabe-Fehler (falsche Task-Freigabe) | 2 | 4 | 8 | RBAC/ABAC, Audit-Logs |
| **R5** | DSGVO-Umgehung durch Orchestrator | 1 | 5 | 5 | Decision Engine Integration |

**Gesamtrisiko:**  
➡️ **Medium (Score: 8)** – Höchstes Risiko: Freigabe-Fehler (R3, Score: 8)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "KI-Orchestrator")

---

### **4.3 Use-Case: ContextManager / Semantic Processing**

**Kategorie:** Medium-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Fehldeutung von Kontexten | 3 | 2 | 6 | Context-Validierung, Sanitization |
| **R2** | PD in Eingaben (Context-Leakage) | 2 | 3 | 6 | SanitizeContextForDSGVO() |
| **R2** | Unbeabsichtigte Datenweitergabe | 2 | 4 | 8 | Datenbereinigung, Scope-Prüfung |

**Gesamtrisiko:**  
➡️ **Medium (Score: 8)** – Höchstes Risiko: Unbeabsichtigte Datenweitergabe (R2, Score: 8)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "KI-Orchestrator")

---

### **4.4 Use-Case: QualityGate & Decision Engine**

**Kategorie:** Medium-Risk KI (High-Risk-Komponente)

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Falsche Blockierung (False Positive) | 3 | 3 | 9 | Quality-Gate-Tuning, Monitoring |
| **R1** | Falsche Freigabe (False Negative) | 2 | 4 | 8 | Mehrschichtige Prüfung |
| **R5** | Falsche Freigabe kritischer Inhalte | 2 | 5 | 10 | Decision Engine, Admin-Freigabe |
| **R5** | Umgehung der DSGVO-Firewall | 1 | 5 | 5 | Middleware-Integration, Audit-Logs |

**Gesamtrisiko:**  
➡️ **Medium (Score: 10)** – Höchstes Risiko: Falsche Freigabe kritischer Inhalte (R5, Score: 10)

**Kritische Risiken:**
- Falsche Freigabe kritischer Inhalte – Score: 10 (Medium, aber kritisch)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "DSGVO Decision Engine")

---

### **4.5 Use-Case: Audit-Analyse-Agent (ComplianceAgent)**

**Kategorie:** Low-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R5** | Audit falsch negativ/positiv (False Positives) | 1 | 3 | 3 | Pattern-Matching-Tuning |

**Gesamtrisiko:**  
➡️ **Low (Score: 3)**

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "ComplianceAgent")

---

### **4.6 Use-Case: ContentAgent (Textgenerierung)**

**Kategorie:** Medium-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R2** | PD-Analyse Fehler (Personenbezogene Daten im Prompt) | 3 | 3 | 9 | Prompt-Sanitization, DSGVO-Prüfung |
| **R2** | Datenabfluss an OpenAI (Provider) | 3 | 4 | 12 | Enterprise-Vertrag, Verschlüsselung |
| **R4** | Kostenüberschreitungen (API-Kosten) | 3 | 2 | 6 | Kostenkontrolle, Budget-Limits |

**Gesamtrisiko:**  
➡️ **Medium (Score: 12)** – Höchstes Risiko: Datenabfluss an Provider (R2, Score: 12)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "ContentAgent")

---

### **4.7 Use-Case: Async KI-Processing Queue**

**Kategorie:** Low-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Queue-Timeout (Task-Verlust) | 2 | 2 | 4 | Retry-Mechanismus, Monitoring |
| **R1** | Redis-Ausfall (Queue-Verlust) | 2 | 3 | 6 | Fallback: Synchron, Backup |

**Gesamtrisiko:**  
➡️ **Low (Score: 6)** – Höchstes Risiko: Redis-Ausfall (R1, Score: 6)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "Async Queue")

---

### **4.8 Use-Case: Rechnungsmodul KI-Unterstützung**

**Kategorie:** Medium-Risk KI

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Finanzdaten falsch verarbeitet | 3 | 3 | 9 | Quality-Gate, Admin-Prüfung |
| **R2** | PD-Verarbeitung (Kundenname, Adresse) | 3 | 4 | 12 | DSGVO-Prüfung, Consent |
| **R5** | GoBD-Verstoß (Rechnungsdaten falsch) | 1 | 5 | 5 | GoBD-Compliance, Audit-Logs |

**Gesamtrisiko:**  
➡️ **Medium (Score: 12)** – Höchstes Risiko: PD-Verarbeitung (R2, Score: 12)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "Rechnungsmodul")

---

### **4.9 Use-Case: DSGVO-Firewall (Sensitive Data Analyzer)**

**Kategorie:** Medium-Risk KI (High-Risk-Komponente)

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Falschklassifikation sensibler Daten | 3 | 4 | 12 | Decision Engine Tuning, Monitoring |
| **R5** | Fehlerhafte Consent-Prüfung | 2 | 5 | 10 | Consent-Service, Audit-Logs |
| **R5** | Umgehung der Firewall | 1 | 5 | 5 | Middleware-Integration, Enforcement |

**Gesamtrisiko:**  
➡️ **Medium (Score: 12)** – Höchstes Risiko: Falschklassifikation sensibler Daten (R1, Score: 12)

**Kritische Risiken:**
- Fehlerhafte Consent-Prüfung – Score: 10 (Medium, aber kritisch)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "DSGVO Decision Engine")

---

### **4.10 Use-Case: Admin-UI Freigabeprozesse (High-Risk Control)**

**Kategorie:** Critical-Risk Control  
**Grund:** Manual Approval, High-Risk Governance

| Risikoart | Beschreibung | EW | SA | Score | Maßnahme |
|-----------|--------------|----|----|-------|----------|
| **R1** | Frontend-Fehler bei Freigaben | 3 | 5 | 15 | UI-Testing, Validation |
| **R3** | Unberechtigte Zugriffe (RBAC/ABAC) | 2 | 5 | 10 | RBAC/ABAC, Audit-Logs |
| **R3** | Falsch konfigurierte Admin-Rollen | 2 | 4 | 8 | Rollen-Management, Review |
| **R5** | Fehlerhafte Freigabe kritischer Funktionen | 2 | 5 | 10 | Freigabeprozess, DSFA-Verantwortlicher |

**Gesamtrisiko:**  
➡️ **High/Critical (Score: 15)** – Höchstes Risiko: Frontend-Fehler bei Freigaben (R1, Score: 15)

**Kritische Risiken:**
- Frontend-Fehler bei Freigaben – Score: 15 (High)
- Unberechtigte Zugriffe – Score: 10 (Medium, aber kritisch)
- Fehlerhafte Freigabe kritischer Funktionen – Score: 10 (Medium, aber kritisch)

**Maßnahmen:** Siehe `P5-MEASURES.md` (Abschnitt "Admin-UI")

---

## 5. Gesamtübersicht Risikobewertung (Heatmap)

| Risiko-Level | Use-Cases | Anzahl |
|--------------|-----------|--------|
| **Low** | ComplianceAgent, AsyncQueue | 2 |
| **Medium** | Orchestrator, ContextManager, QualityGate, ContentAgent, Rechnungs-KI, DSGVO-Firewall | 6 |
| **High** | Media-KI | 1 |
| **Critical** | Admin-UI Freigabeprozesse | 1 |

### **Risikoverteilung:**

- **Low-Risk:** 20% (2 Use-Cases)
- **Medium-Risk:** 60% (6 Use-Cases)
- **High-Risk:** 10% (1 Use-Case)
- **Critical-Risk:** 10% (1 Use-Case)

### **Top 5 Kritische Risiken (nach Score):**

1. **Media-KI:** Personenbezogene Daten (Gesichter) – Score: 16 (Critical)
2. **Media-KI:** DSGVO-Fehler ohne Rechtsgrundlage – Score: 15 (High)
3. **Admin-UI:** Frontend-Fehler bei Freigaben – Score: 15 (High)
4. **Media-KI:** Datenabfluss an OpenAI – Score: 12 (Medium)
5. **ContentAgent:** Datenabfluss an OpenAI – Score: 12 (Medium)

---

## 6. Narrative Risikoanalyse (DSGVO Art. 35)

**Die kritischsten Risiken liegen in folgenden Bereichen:**

### **1. Media-KI – Bilder mit Personen**

**Risiko:** Personenbezogene Daten (Gesichter) – Score: 16 (Critical)

**Beschreibung:**
- Erhöhte Gefahr von Datenschutzverstößen
- Externe Provider (OpenAI) involviert
- Hoher Impact bei Fehlklassifikation
- Personen auf Bildern ohne Consent

**Auswirkungen:**
- DSGVO-Verstoß (Art. 6, Art. 9)
- Rechtliche Konsequenzen
- Reputationsschaden
- Bußgelder möglich

**Maßnahmen:**
- DSGVO Decision Engine (Consent-Prüfung)
- Admin-Freigabe erforderlich
- Audit-Logs vollständig
- Enterprise-Vertrag mit OpenAI

---

### **2. Admin-Freigabeprozesse – Kritische Governance**

**Risiko:** Frontend-Fehler bei Freigaben – Score: 15 (High)

**Beschreibung:**
- Falsche Freigabe = hohe rechtliche Auswirkungen
- Zentraler Governance-Punkt
- Muss besonders geschützt werden
- Unberechtigte Zugriffe möglich

**Auswirkungen:**
- Kritische Funktionen ohne Freigabe aktiviert
- DSGVO-Verstöße
- Compliance-Verstöße
- Rechtliche Konsequenzen

**Maßnahmen:**
- RBAC/ABAC strikt
- Freigabeprozess dokumentiert
- DSFA-Verantwortlicher + Datenschutzbeauftragter
- Audit-Logs vollständig

---

### **3. DSGVO Decision Engine – Zentrale Firewall**

**Risiko:** Fehlerhafte Consent-Prüfung – Score: 10 (Medium, aber kritisch)

**Beschreibung:**
- Zentrale KI-Firewall für rechtssichere KI-Verarbeitung
- Fehlerhafte Prüfung = Systemweite Auswirkungen
- Umgehung der Firewall möglich

**Auswirkungen:**
- KI-Verarbeitung ohne Consent
- DSGVO-Verstöße
- Rechtliche Konsequenzen

**Maßnahmen:**
- Mehrschichtige Prüfung
- Middleware-Integration
- Audit-Logs vollständig
- Monitoring aktiv

---

## 7. Risikominderung (Verweis)

Alle Maßnahmen siehe:  
`P5-MEASURES.md`

**Priorisierung:**
1. **Hoch:** Media-KI (Personenbezogene Daten)
2. **Hoch:** Admin-UI Freigabeprozesse
3. **Mittel:** DSGVO Decision Engine
4. **Mittel:** ContentAgent, Rechnungsmodul KI

---

## 8. Freigabeprozess (Verweis)

Alle Prozesse siehe:  
`P5-FREIGABE-PROZESS.md`

**Freigabekriterien:**
- **Low/Medium-Risk:** DSFA-Verantwortlicher
- **High/Critical-Risk:** DSFA-Verantwortlicher + Datenschutzbeauftragter

---

## 9. Review-Zyklen

| Risikokategorie | Review-Zyklus | Nächster Review |
|----------------|---------------|-----------------|
| **Critical** | 3 Monate | 27.02.2026 |
| **High** | 6 Monate | 27.05.2026 |
| **Medium** | 12 Monate | 27.11.2026 |
| **Low** | 24 Monate | 27.11.2027 |

**Auslöser für außerplanmäßige Reviews:**
- Systemänderungen
- Neue Risiken identifiziert
- Vorfälle
- Gesetzesänderungen

---

## 10. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige Risikoidentifikation und -bewertung

---

## 11. Audit-Hash

**Wird nach Freigabe automatisch generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

**Hash-Generierung:**
- Algorithmus: SHA-256
- Inhalt: Vollständiges Dokument (Markdown)
- Timestamp: ISO 8601
- Verantwortlicher: DSFA-Verantwortlicher

**Hash wird hier eingetragen, sobald Dokument freigegeben wurde.**

---

*Generated by Enterprise++ DSFA Risk Matrix System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*
