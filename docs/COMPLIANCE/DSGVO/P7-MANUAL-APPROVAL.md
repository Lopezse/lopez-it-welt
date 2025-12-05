# P7-MANUAL-APPROVAL

## Offizielles DSFA-Freigabedokument – Phase P7

### Lopez IT Welt – Enterprise++ KI-Governance

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **VORLAGE**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument stellt das **offizielle DSFA-Freigabedokument** für alle High- und Critical-Risk Use-Cases dar.

Es basiert auf:

- **DSGVO Art. 35** (DSFA)
- **ISO 27001 / ISO 27701** (Human Oversight)
- **EU AI Act** (High-Risk KI – Human Supervision)
- **SAP / IBM / Siemens Governance Standards**
- **Lopez IT Welt Enterprise++ Richtlinien**

**Zweck:**
- Zentrale Freigabe-Entscheidung für alle kritischen KI-Funktionen
- Dokumentation aller Freigaben und Ablehnungen
- Audit-Sicherheit und Compliance-Nachweis
- Governance-Regeln und Sicherheitsauflagen

---

## 2. Übersicht aller High- & Critical-Risk Use-Cases

### **2.1 High-Risk Use-Cases**

| Use-Case | Risikokategorie | Gesamtrisiko | Höchstes Einzelrisiko | Status |
|----------|-----------------|--------------|----------------------|--------|
| **Media-KI (Bildanalyse)** | High-Risk KI | High (16) | Personenbezogene Daten (Gesichter) – Score: 16 (Critical) | ⏳ Ausstehend |
| **ContentAgent (Textgenerierung)** | Medium-Risk KI | Medium (12) | Datenabfluss an OpenAI – Score: 12 (Medium) | ⏳ Ausstehend |
| **Rechnungsmodul KI-Unterstützung** | Medium-Risk KI | Medium (12) | PD-Verarbeitung – Score: 12 (Medium) | ⏳ Ausstehend |
| **DSGVO-Firewall (Sensitive Data Analyzer)** | Medium-Risk KI | Medium (12) | Falschklassifikation sensibler Daten – Score: 12 (Medium) | ⏳ Ausstehend |

### **2.2 Critical-Risk Use-Cases**

| Use-Case | Risikokategorie | Gesamtrisiko | Höchstes Einzelrisiko | Status |
|----------|-----------------|--------------|----------------------|--------|
| **Admin-UI Freigabeprozesse (High-Risk Control)** | Critical-Risk Control | High/Critical (15) | Frontend-Fehler bei Freigaben – Score: 15 (High) | ⏳ Ausstehend |

### **2.3 Medium-Risk Use-Cases (Referenz)**

| Use-Case | Risikokategorie | Gesamtrisiko | Status |
|----------|-----------------|--------------|--------|
| **KI-Orchestrator Core** | Medium-Risk KI | Medium (8) | ✅ Implementiert |
| **ContextManager** | Medium-Risk KI | Medium (8) | ✅ Implementiert |
| **QualityGate & Decision Engine** | Medium-Risk KI | Medium (10) | ✅ Implementiert |
| **Async Queue** | Low-Risk KI | Low (6) | ✅ Implementiert |
| **ComplianceAgent** | Low-Risk KI | Low (3) | ✅ Implementiert |

---

## 3. Risiko-Zusammenfassung

### **3.1 Gesamtrisiko-Übersicht**

| Risikokategorie | Anzahl Use-Cases | Höchstes Risiko | Durchschnittliches Risiko |
|-----------------|------------------|-----------------|---------------------------|
| **Critical** | 1 | 15 (High) | 15.0 |
| **High** | 1 | 16 (Critical) | 16.0 |
| **Medium** | 4 | 12 (Medium) | 11.0 |
| **Low** | 2 | 6 (Medium) | 4.5 |

### **3.2 Top 5 Kritische Risiken (nach Score)**

| Rang | Use-Case | Risiko | Score | Kategorie |
|------|----------|--------|-------|------------|
| **1** | Media-KI | Personenbezogene Daten (Gesichter) | 16 | Critical |
| **2** | Media-KI | DSGVO-Fehler ohne Rechtsgrundlage | 15 | High |
| **3** | Admin-UI Freigabe | Frontend-Fehler bei Freigaben | 15 | High |
| **4** | Media-KI | Datenabfluss an OpenAI | 12 | Medium |
| **5** | ContentAgent | Datenabfluss an OpenAI | 12 | Medium |

### **3.3 Risikoverteilung nach Risikoart (R1–R5)**

| Risikoart | Anzahl Risiken | Durchschnittlicher Score | Höchstes Risiko |
|-----------|----------------|--------------------------|-----------------|
| **R1 – Technische Risiken** | 8 | 8.5 | 15 (Admin-UI) |
| **R2 – Datenschutzrisiken** | 6 | 12.3 | 16 (Media-KI) |
| **R3 – Organisatorische Risiken** | 4 | 8.5 | 10 (Admin-UI) |
| **R4 – Operative Risiken** | 3 | 5.3 | 6 (Async Queue) |
| **R5 – Compliance-Risiken** | 6 | 9.2 | 15 (Media-KI) |

---

## 4. Entscheidungsmatrix (Freigabe / Nicht-Freigabe)

### **4.1 Freigabekriterien**

Eine kritische Funktion darf **erst freigeschaltet werden**, wenn:

| Kriterium | Beschreibung | Status |
|-----------|--------------|--------|
| ✅ **Maßnahmen erfüllt** | Alle Maßnahmen (P5-MEASURES) ≥ 80% implementiert | ☐ Geprüft |
| ✅ **Risiko ≤ High** | Keine Critical ohne Gegenmaßnahmen | ☐ Geprüft |
| ✅ **DSFA dokumentiert** | Vollständige DSFA-Dokumentation vorhanden | ☐ Geprüft |
| ✅ **Data Minimization** | Datensparsamkeit gewährleistet | ☐ Geprüft |
| ✅ **DSGVO-Firewall aktiv** | Decision Engine aktiv und konfiguriert | ☐ Geprüft |
| ✅ **QualityGate aktiv** | QualityGate aktiv und konfiguriert | ☐ Geprüft |
| ✅ **Audit-Log aktiv** | Vollständige Audit-Logs aktiviert | ☐ Geprüft |
| ✅ **Freigabe dokumentiert** | Manuelle Freigabe dokumentiert | ☐ Geprüft |

### **4.2 Ablehnungskriterien**

Freigabe wird **verweigert**, wenn:

| Kriterium | Beschreibung | Status |
|-----------|--------------|--------|
| ❌ **Risiko = Critical** | Critical-Risk ohne vollständige Maßnahmen | ☐ Geprüft |
| ❌ **PD nicht geschützt** | Personenbezogene Daten nicht geschützt | ☐ Geprüft |
| ❌ **Datenfluss zu weit** | Datenfluss zu Provider zu weit | ☐ Geprüft |
| ❌ **Fehlende Protokollierung** | Audit-Logs nicht aktiv | ☐ Geprüft |
| ❌ **Rechtliche Grundlage unklar** | Rechtsgrundlage nicht eindeutig | ☐ Geprüft |
| ❌ **Fehlendes Testprotokoll** | Technisches Testprotokoll fehlt | ☐ Geprüft |

### **4.3 Entscheidungsmatrix pro Use-Case**

#### **4.3.1 Media-KI (Bildanalyse)**

| Kriterium | Status | Begründung |
|-----------|--------|------------|
| Maßnahmen erfüllt | ☐ | 7/8 implementiert (87.5%) |
| Risiko ≤ High | ☐ | Höchstes Risiko: 16 (Critical) |
| DSFA dokumentiert | ☐ | Vollständig dokumentiert |
| Data Minimization | ☐ | Provider-Minimaldatenprinzip |
| DSGVO-Firewall aktiv | ☐ | Decision Engine integriert |
| QualityGate aktiv | ☐ | QualityGate aktiviert |
| Audit-Log aktiv | ☐ | Vollständige Audit-Logs |
| **Entscheidung:** | ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung | |

#### **4.3.2 Admin-UI Freigabeprozesse (High-Risk Control)**

| Kriterium | Status | Begründung |
|-----------|--------|------------|
| Maßnahmen erfüllt | ☐ | 6/7 implementiert (86%) |
| Risiko ≤ High | ☐ | Höchstes Risiko: 15 (High) |
| DSFA dokumentiert | ☐ | Vollständig dokumentiert |
| Data Minimization | ☐ | UI-only, keine PD-Verarbeitung |
| DSGVO-Firewall aktiv | ☐ | RBAC/ABAC enforced |
| QualityGate aktiv | ☐ | UI-Validation aktiv |
| Audit-Log aktiv | ☐ | Vollständige Audit-Logs |
| **Entscheidung:** | ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung | |

#### **4.3.3 ContentAgent (Textgenerierung)**

| Kriterium | Status | Begründung |
|-----------|--------|------------|
| Maßnahmen erfüllt | ☐ | 0/4 implementiert (0%) – Agent noch nicht implementiert |
| Risiko ≤ High | ☐ | Höchstes Risiko: 12 (Medium) |
| DSFA dokumentiert | ☐ | Vollständig dokumentiert |
| Data Minimization | ☐ | Input-Sanitizing geplant |
| DSGVO-Firewall aktiv | ☐ | Decision Engine geplant |
| QualityGate aktiv | ☐ | QualityGate geplant |
| Audit-Log aktiv | ☐ | Audit-Logs geplant |
| **Entscheidung:** | ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung | |

#### **4.3.4 Rechnungsmodul KI-Unterstützung**

| Kriterium | Status | Begründung |
|-----------|--------|------------|
| Maßnahmen erfüllt | ☐ | 4/4 implementiert (100%) |
| Risiko ≤ High | ☐ | Höchstes Risiko: 12 (Medium) |
| DSFA dokumentiert | ☐ | Vollständig dokumentiert |
| Data Minimization | ☐ | GoBD-konform |
| DSGVO-Firewall aktiv | ☐ | Decision Engine integriert |
| QualityGate aktiv | ☐ | QualityGate aktiviert |
| Audit-Log aktiv | ☐ | Vollständige Audit-Logs |
| **Entscheidung:** | ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung | |

#### **4.3.5 DSGVO-Firewall (Sensitive Data Analyzer)**

| Kriterium | Status | Begründung |
|-----------|--------|------------|
| Maßnahmen erfüllt | ☐ | 3/3 implementiert (100%) |
| Risiko ≤ High | ☐ | Höchstes Risiko: 12 (Medium) |
| DSFA dokumentiert | ☐ | Vollständig dokumentiert |
| Data Minimization | ☐ | Zentrale Firewall |
| DSGVO-Firewall aktiv | ☐ | Decision Engine aktiv |
| QualityGate aktiv | ☐ | QualityGate aktiviert |
| Audit-Log aktiv | ☐ | Vollständige Audit-Logs |
| **Entscheidung:** | ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung | |

---

## 5. Begründungen

### **5.1 Freigabe-Begründungen**

**Use-Case:** {{USE_CASE_NAME}}

**Freigabe-Entscheidung:** ☐ Freigabe ☐ Ablehnung ☐ Nachbesserung

**Begründung:**

{{APPROVAL_REASON}}

**Bedingungen:**

{{APPROVAL_CONDITIONS}}

**Maßnahmenpaket:**

Siehe `P5-MEASURES.md` (Abschnitt: {{USE_CASE_SECTION}})

**Risikobewertung:**

Siehe `P5-RISK-MATRIX.md` (Abschnitt: {{USE_CASE_SECTION}})

---

### **5.2 Ablehnungs-Begründungen**

**Use-Case:** {{USE_CASE_NAME}}

**Freigabe-Entscheidung:** ☐ Ablehnung

**Begründung:**

{{REJECTION_REASON}}

**Nachbesserungsanforderungen:**

{{IMPROVEMENT_REQUIREMENTS}}

**Nächster Review-Termin:**

{{NEXT_REVIEW_DATE}}

---

## 6. Sicherheitsauflagen

### **6.1 Allgemeine Sicherheitsauflagen (für alle Use-Cases)**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **DSGVO-Firewall aktiv** | Decision Engine muss aktiv sein | ☐ Erfüllt |
| **QualityGate aktiv** | QualityGate muss aktiv sein | ☐ Erfüllt |
| **Audit-Logs aktiv** | Vollständige Audit-Logs erforderlich | ☐ Erfüllt |
| **RBAC/ABAC enforced** | Rollenbasierte Zugriffskontrolle | ☐ Erfüllt |
| **Verschlüsselung** | AES-256 / TLS 1.3 | ☐ Erfüllt |
| **Data Minimization** | Nur erforderliche Daten verarbeiten | ☐ Erfüllt |
| **Pseudonymisierung** | PD pseudonymisieren | ☐ Erfüllt |

### **6.2 Spezifische Sicherheitsauflagen pro Use-Case**

#### **6.2.1 Media-KI (Bildanalyse)**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **Personenmarkierung** | `has_person = true` Flag setzen | ☐ Erfüllt |
| **Admin-Approval Pflicht** | Manuelle Freigabe bei `has_person = true` | ☐ Erfüllt |
| **Provider-Minimaldatenprinzip** | Nur erforderliche Daten zu OpenAI | ☐ Erfüllt |
| **3-Monats Review** | Review-Zyklus für High-Risk | ☐ Erfüllt |
| **Audit-Hash pro Analyse** | SHA-256 Hash pro Analyse | ☐ Erfüllt |

#### **6.2.2 Admin-UI Freigabeprozesse**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **4-Augen-Prinzip** | Kritische Freigaben | ☐ Erfüllt |
| **RBAC/ABAC enforced** | Rollen & Kontextbedingungen | ☐ Erfüllt |
| **Logging mit Hash** | Audit-Hash pro Freigabe | ☐ Erfüllt |
| **UI-only Freigaben** | Zero-CMD Standard | ☐ Erfüllt |
| **Review alle 3 Monate** | Review-Zyklus für Critical | ☐ Erfüllt |

#### **6.2.3 ContentAgent (Textgenerierung)**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **PD-Firewall** | Ausgänge prüfen | ☐ Erfüllt |
| **Provider-Limits** | Token-Limits, Rate-Limits | ☐ Erfüllt |
| **Keine sensiblen PD** | Input-Sanitizing | ☐ Erfüllt |
| **Input-Sanitizing** | Prompt-Bereinigung | ☐ Erfüllt |

#### **6.2.4 Rechnungsmodul KI-Unterstützung**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **GoBD-Felder Prüfung** | Pflichtfelder validieren | ☐ Erfüllt |
| **PD-Markierung** | Personenbezogene Finanzdaten markieren | ☐ Erfüllt |
| **Pseudonymisierte Testläufe** | Test-Daten pseudonymisiert | ☐ Erfüllt |
| **Admin-Freigabe** | KI-Validierungen manuell freigeben | ☐ Erfüllt |

#### **6.2.5 DSGVO-Firewall (Sensitive Data Analyzer)**

| Auflage | Beschreibung | Status |
|---------|--------------|--------|
| **Sensibler Content Filter** | Automatische Blockierung | ☐ Erfüllt |
| **Priorität-Level 1** | Höchste Stufe | ☐ Erfüllt |
| **Zugriff nur für Admin + DSFA-Verantwortlichen** | RBAC/ABAC enforced | ☐ Erfüllt |

---

## 7. Governance-Regeln

### **7.1 Freigabeprozess-Regeln**

| Regel | Beschreibung | Verantwortlich |
|-------|--------------|----------------|
| **4-Augen-Prinzip** | Kritische Freigaben erfordern 2 Personen | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **Dokumentationspflicht** | Jede Freigabe muss dokumentiert werden | DSFA-Verantwortlicher |
| **Audit-Hash** | SHA-256 Hash pro Freigabe | System (automatisch) |
| **Review-Zyklen** | Regelmäßige Reviews erforderlich | DSFA-Verantwortlicher |
| **Re-Approval bei Änderungen** | Änderungen erfordern neue Freigabe | DSFA-Verantwortlicher |

### **7.2 Rollenmodell-Regeln**

| Rolle | Verantwortlichkeiten | Freigabe-Berechtigung |
|-------|----------------------|----------------------|
| **DSFA-Verantwortlicher** | Risikoanalyse, Maßnahmenprüfung | Low/Medium: Ja, High/Critical: Ja (mit DSB) |
| **Datenschutzbeauftragter** | DSGVO-Konformität prüfen | High/Critical: Ja (mit DSFA-Verantwortlicher) |
| **Systemarchitekt** | Technische Risiken prüfen | Nein (nur Prüfung) |
| **Admin** | Umsetzung dokumentieren | Nein (nur nach Freigabe) |
| **Entwickler** | Technische Umsetzung | Nein (keine Freigaben) |

### **7.3 Compliance-Regeln**

| Regel | Beschreibung | Konformität |
|-------|--------------|-------------|
| **DSGVO Art. 35** | DSFA durchgeführt | ☐ Konform |
| **DSGVO Art. 32** | TOM implementiert | ☐ Konform |
| **DSGVO Art. 30** | Verarbeitungsverzeichnis | ☐ Konform |
| **ISO 27001** | Security Controls | ☐ Konform |
| **ISO 27701** | Privacy Controls | ☐ Konform |
| **EU AI Act** | High-Risk Assessment | ☐ Konform |

---

## 8. Re-Approval Hinweise

### **8.1 Automatische Re-Approval Trigger**

Ein Re-Approval wird automatisch ausgelöst, wenn:

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **Datenänderung** | Neue Datenarten, PD-Verarbeitung | `re-review-required` |
| **Modellwechsel** | Provider-Modell geändert | `re-review-required` |
| **Risiko-Änderung** | DSFA-Score steigt > 2 Punkte | `re-review-required` |
| **Governance-Änderung** | RBAC/ABAC geändert | `re-review-required` |
| **Infrastruktur-Änderung** | Queue-Fehler, Latenzen | `re-review-required` |

Siehe `P6-MONITORING-PLAN.md` (Abschnitt 5) für vollständige Trigger-Liste.

### **8.2 Re-Review-Prozess**

Bei automatischen Triggern:

1. **Re-Review-Prozess starten** (siehe `P6-RISK-REVIEW-PROZESS.md`)
2. **Risikoanalyse durchführen** (Stufe 3)
3. **Maßnahmenprüfung** (Stufe 4)
4. **DSGVO-Konformität prüfen** (Stufe 5, bei High/Critical)
5. **Entscheidung treffen** (Stufe 6)
6. **Re-Approval erforderlich?** → P5-FREIGABE-PROZESS durchführen

### **8.3 Review-Zyklen**

| Risikokategorie | Review-Zyklus | Nächstes Review |
|----------------|---------------|-----------------|
| **Critical** | Alle 3 Monate | 27.02.2026 |
| **High** | Alle 6 Monate | 27.05.2026 |
| **Medium** | Alle 12 Monate | 27.11.2026 |
| **Low** | Alle 24 Monate | 27.11.2027 |

---

## 9. Freigabe-Entscheidungen

### **9.1 Freigabe-Formular**

**Use-Case:** _________________________

**Risikokategorie:** ☐ Low ☐ Medium ☐ High ☐ Critical

**Risikowert:** _________________________

**Freigegeben:** ☐ Ja ☐ Nein ☐ Nachbesserung

**Freigegeben von:**
- **DSFA-Verantwortlicher:** _________________________ (Datum: ___________)
- **Datenschutzbeauftragter:** _________________________ (Datum: ___________) [nur bei High/Critical]

**Freigabegrund:** _________________________

**Bedingungen:** _________________________

**Maßnahmenpaket:** Siehe `P5-MEASURES.md` (Abschnitt: ___________)

**Hash (SHA-256):** _________________________

**Review-Datum:** _________________________

---

### **9.2 Freigabe-Status pro Use-Case**

| Use-Case | Risikokategorie | Freigabe-Status | Freigegeben von | Datum | Hash |
|----------|-----------------|----------------|-----------------|-------|------|
| **Media-KI** | High | ⏳ Ausstehend | – | – | – |
| **Admin-UI Freigabe** | Critical | ⏳ Ausstehend | – | – | – |
| **ContentAgent** | Medium | ⏳ Ausstehend | – | – | – |
| **Rechnungsmodul KI** | Medium | ⏳ Ausstehend | – | – | – |
| **DSGVO-Firewall** | Medium | ⏳ Ausstehend | – | – | – |

---

## 10. Signaturfelder

### **10.1 DSFA-Verantwortlicher**

**Name:** _________________________

**Rolle:** DSFA-Verantwortlicher

**Datum:** _________________________

**Unterschrift:** _________________________

**Bemerkungen:** _________________________

---

### **10.2 Datenschutzbeauftragter**

**Name:** _________________________

**Rolle:** Datenschutzbeauftragter

**Datum:** _________________________

**Unterschrift:** _________________________

**Bemerkungen:** _________________________

**Hinweis:** Nur bei High/Critical-Risk Use-Cases erforderlich.

---

### **10.3 Systemarchitekt**

**Name:** _________________________

**Rolle:** Systemarchitekt

**Datum:** _________________________

**Unterschrift:** _________________________

**Bemerkungen:** _________________________

**Hinweis:** Technische Prüfung durchgeführt.

---

## 11. Audit-Hash

**Dokument-Hash (SHA-256):** {{AUDIT_HASH}}

**Generiert am:** {{GENERATION_DATE}}

**Generiert von:** {{GENERATED_BY}}

**Version:** {{VERSION}}

**Hash wird nach Freigabe automatisch generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

---

## 12. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Offizielles DSFA-Freigabedokument

---

## 13. Referenzen

- `P5-DSFA-PLAN.md` – Hauptdokument (10-Schritte-Prozess)
- `P5-USE-CASES.md` – Use-Case-Inventar
- `P5-RISK-MATRIX.md` – Risikobewertungsmatrix
- `P5-MEASURES.md` – Maßnahmenkatalog
- `P5-FREIGABE-PROZESS.md` – Freigabeprozess
- `P6-MONITORING-PLAN.md` – Monitoring & Re-Review
- `P6-RISK-REVIEW-PROZESS.md` – Re-Review-Prozess

---

## 14. Übergabe an Agent B (Builder)

### **14.1 Implementierungsauftrag**

**Agent B (Builder)** soll folgende Komponenten implementieren:

#### **14.1.1 Admin-UI für Manual Approval**

**Dateien zu erstellen:**
- `src/app/admin/compliance/dsgvo/approvals/page.tsx` – Übersicht aller Freigaben
- `src/app/admin/compliance/dsgvo/approvals/[id]/page.tsx` – Detail-Ansicht einer Freigabe
- `src/app/admin/compliance/dsgvo/approvals/new/page.tsx` – Neue Freigabe erstellen

**Funktionalitäten:**
- Liste aller High/Critical-Risk Use-Cases anzeigen
- Entscheidungsmatrix pro Use-Case anzeigen
- Freigabe-Formular (Checkboxen für Kriterien)
- Signaturfelder (DSFA-Verantwortlicher, Datenschutzbeauftragter, Systemarchitekt)
- Audit-Hash-Generierung (SHA-256)
- PDF-Export der Freigabedokumente

#### **14.1.2 API-Endpoints für Manual Approval**

**Dateien zu erstellen:**
- `src/app/api/dsgvo/approvals/route.ts` – Liste aller Freigaben (GET), Neue Freigabe (POST)
- `src/app/api/dsgvo/approvals/[id]/route.ts` – Freigabe-Detail (GET), Freigabe aktualisieren (PUT)
- `src/app/api/dsgvo/approvals/[id]/approve/route.ts` – Freigabe erteilen (POST)
- `src/app/api/dsgvo/approvals/[id]/reject/route.ts` – Freigabe ablehnen (POST)
- `src/app/api/dsgvo/approvals/[id]/pdf/route.ts` – PDF-Export (GET)

**Funktionalitäten:**
- Freigabe-Entscheidungen speichern
- Audit-Logs erstellen (`APPROVAL_GRANTED`, `APPROVAL_REJECTED`)
- Hash-Generierung (SHA-256)
- Compliance-Register aktualisieren
- PDF-Generierung (mit Signaturfeldern)

#### **14.1.3 Datenbank-Schema**

**Tabelle:** `dsgvo_approvals`

**Felder:**
- `id` (VARCHAR, PRIMARY KEY)
- `use_case_id` (VARCHAR, FOREIGN KEY)
- `use_case_name` (VARCHAR)
- `risk_category` (ENUM: 'low', 'medium', 'high', 'critical')
- `risk_score` (INT)
- `approval_status` (ENUM: 'pending', 'approved', 'rejected', 'needs_improvement')
- `approved_by_dsfa` (VARCHAR, User-ID)
- `approved_by_dsb` (VARCHAR, User-ID, nullable)
- `approved_by_architect` (VARCHAR, User-ID, nullable)
- `approval_date` (DATETIME)
- `approval_reason` (TEXT)
- `approval_conditions` (TEXT)
- `measures_package` (VARCHAR, Referenz zu P5-MEASURES.md)
- `audit_hash` (VARCHAR, SHA-256)
- `review_date` (DATE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### **14.1.4 Service-Layer**

**Dateien zu erstellen:**
- `src/lib/dsgvo/approval-service.ts` – Approval-Service

**Funktionalitäten:**
- `createApproval(useCaseId, approvalData)` – Neue Freigabe erstellen
- `approveApproval(approvalId, userId, reason)` – Freigabe erteilen
- `rejectApproval(approvalId, userId, reason)` – Freigabe ablehnen
- `getApproval(approvalId)` – Freigabe abrufen
- `listApprovals(filters)` – Liste aller Freigaben
- `generateApprovalHash(approvalData)` – SHA-256 Hash generieren
- `generateApprovalPDF(approvalId)` – PDF generieren

#### **14.1.5 Integration mit bestehenden Systemen**

**Integrationen:**
- `src/lib/dsgvo/audit-logger.ts` – Audit-Logs für Freigaben
- `src/lib/dsgvo/monitoring-service.ts` – Monitoring-Integration
- `src/lib/ki-orchestrator/OrchestratorCore.ts` – Use-Case-Status aktualisieren

**Audit-Events:**
- `APPROVAL_CREATED` – Neue Freigabe erstellt
- `APPROVAL_GRANTED` – Freigabe erteilt
- `APPROVAL_REJECTED` – Freigabe abgelehnt
- `APPROVAL_UPDATED` – Freigabe aktualisiert

---

### **14.2 Technische Spezifikationen**

#### **14.2.1 UI-Komponenten**

- **ApprovalList** – Liste aller Freigaben (Tabelle mit Filtern)
- **ApprovalDetail** – Detail-Ansicht einer Freigabe
- **ApprovalForm** – Freigabe-Formular (Checkboxen, Textfelder, Signaturfelder)
- **ApprovalDecisionMatrix** – Entscheidungsmatrix pro Use-Case
- **ApprovalSignatures** – Signaturfelder (DSFA, DSB, Systemarchitekt)

#### **14.2.2 PDF-Generierung**

- **Bibliothek:** `pdfkit` oder `puppeteer`
- **Template:** Basierend auf `P7-MANUAL-APPROVAL.md`
- **Inhalt:** Vollständiges Freigabedokument mit Signaturfeldern
- **Hash:** SHA-256 Hash des PDF-Inhalts

#### **14.2.3 RBAC/ABAC**

- **Rolle:** `compliance.approve` – Freigaben erteilen
- **Rolle:** `compliance.view` – Freigaben anzeigen
- **Rolle:** `compliance.manage` – Freigaben verwalten

---

### **14.3 Abhängigkeiten**

- **Bestehende Systeme:**
  - DSGVO Audit-Logger (`src/lib/dsgvo/audit-logger.ts`)
  - DSGVO Monitoring-Service (`src/lib/dsgvo/monitoring-service.ts`)
  - KI-Orchestrator (`src/lib/ki-orchestrator/OrchestratorCore.ts`)
  - Datenbank-Schema (`src/lib/database.ts`)

- **Neue Abhängigkeiten:**
  - PDF-Generierung (z.B. `pdfkit` oder `puppeteer`)
  - Hash-Generierung (SHA-256, bereits vorhanden)

---

### **14.4 Test-Anforderungen**

- **Unit Tests:** Approval-Service, Hash-Generierung
- **Integration Tests:** API-Endpoints, Datenbank-Integration
- **E2E Tests:** Admin-UI Freigabeprozess

---

*Generated by Enterprise++ DSGVO Manual Approval System*  
*Last updated: 2025-11-27*  
*Status: 📋 VORLAGE – AUSSTEHEND (Manual Approval erforderlich)*





