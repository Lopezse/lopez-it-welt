# P6-RISK-REVIEW-PROZESS

## DSGVO Phase P6 – Re-Review & Risikoüberprüfung

### Lopez IT Welt – Enterprise++ KI-Governance

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieser Prozess definiert den vollständigen **Re-Review-Prozess** für KI- und DSGVO-bezogene Risiken innerhalb der Lopez IT Welt Architektur.

Er basiert auf:

- **DSGVO Art. 35 Abs. 11** (regelmäßige Überprüfung)
- **ISO 27001 A.8.16** (Review of information security controls)
- **ISO 27701** (Privacy Information Review)
- **EU AI Act** (Human Oversight & Continuous Monitoring)
- **SAP, IBM, Siemens Enterprise KI Review Standards**
- **Lopez IT Welt Enterprise++ Richtlinien**

**Zweck:**
- Fortlaufende Risikobewertung
- Erkennung neuer Risiken
- Neubewertung bestehender Risiken
- Aktualisierung des Maßnahmenkatalogs
- Compliance mit DSGVO, ISO und AI Act

---

## 2. Zielsetzung

Der Re-Review-Prozess garantiert:

- **Fortlaufende Risikobewertung** (kontinuierlich, nicht einmalig)
- **Erkennung neuer Risiken** (proaktiv, nicht reaktiv)
- **Neubewertung bestehender Risiken** (Score-Updates)
- **Aktualisierung des Maßnahmenkatalogs** (Maßnahmen anpassen)
- **Compliance mit DSGVO, ISO und AI Act** (rechtssicher)
- **Entscheidung, ob Freigaben erneuert werden müssen** (Re-Approval)
- **Vollständige Auditierbarkeit** (nachvollziehbar)

---

## 3. Auslöser für Re-Review

Ein DSFA-Re-Review wird durch die Trigger aus dem Monitoring-Plan ausgelöst:

### **3.1 Datenbasierte Trigger**

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **Neue Datenarten** | Neue Datenkategorien erkannt | `re-review-required` |
| **Neue personenbezogene Daten** | PD-Verarbeitung erkannt | `re-review-required` |
| **Personen in Bildern** | Personenerkennung in Medien | `re-review-required` |
| **PD-Exposure Events** | Unzulässige PD-Verarbeitung | `re-review-required` (Critical) |
| **Änderung der Datensensitivität** | Sensibilität erhöht | `re-review-required` |

### **3.2 KI/Modell-Trigger**

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **Provider-Modellwechsel** | OpenAI Model Update | `re-review-required` |
| **Qualitätsdrift > 20%** | QualityGate Deviation | `re-review-required` |
| **Prompt-Änderungen** | Änderungen am Prompt-Verhalten | `re-review-required` |
| **Kontextfehler** | ContextManager Deviations | `re-review-required` |
| **Parameter-Veränderungen** | API-Parameter geändert | `re-review-required` |

### **3.3 Risiko-Trigger**

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **Maßnahmenverfall** | Maßnahmen abgelaufen | `re-review-required` |
| **DSFA-Score steigt** | Score > 2 Punkte | `re-review-required` |
| **Neue High-Risk Use-Cases** | High-Risk erkannt | `re-review-required` (Critical) |
| **Maßnahmen unvollständig** | Maßnahmen-Status < 80% | `re-review-required` |

### **3.4 Governance-Trigger**

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **RBAC/ABAC Änderung** | Rollenmodell geändert | `re-review-required` |
| **Neue Rollen** | Neue Berechtigungen | `re-review-required` |
| **Neue Admin- oder DSFA-Funktion** | Governance-Änderung | `re-review-required` |
| **Freigabeprozess geändert** | P5-FREIGABE-PROZESS geändert | `re-review-required` |

### **3.5 Infrastruktur-Trigger**

| Trigger | Beschreibung | Status-Set |
|---------|--------------|------------|
| **Queue-Fehler** | > 3 Fehler | `re-review-required` |
| **API-Latenz > Schwellwert** | > 5s | `re-review-required` |
| **Serverfehler > 5%** | Error-Rate erhöht | `re-review-required` |
| **Infrastruktur-Änderung** | Neue Server, neue Services | `re-review-required` |

### **3.6 Zeitbasierte Trigger**

| Risikokategorie | Review-Zyklus | Status-Set |
|----------------|---------------|------------|
| **Critical** | Alle 3 Monate | `re-review-required` |
| **High** | Alle 6 Monate | `re-review-required` |
| **Medium** | Alle 12 Monate | `re-review-required` |
| **Low** | Alle 24 Monate | `re-review-required` |

---

## 4. Verantwortlichkeiten

| Rolle | Aufgabe | Verantwortlich für |
|-------|---------|-------------------|
| **DSFA-Verantwortlicher** | Risikoanalyse, Maßnahmenprüfung | Stufe 2, 3, 5 |
| **Datenschutzbeauftragter** | DSGVO-Konformität prüfen | Stufe 4 (bei High/Critical) |
| **Systemarchitekt** | Technische Risiken prüfen | Stufe 4 |
| **Admin** | Umsetzung dokumentieren | Stufe 6 |
| **Auditor (intern/extern)** | Validierung | Optional, bei Critical |

---

## 5. Re-Review Prozess (6 Stufen)

---

### **Stufe 1 – Trigger-Identifikation**

**Aktivitäten:**
- System erkennt automatisch Trigger (siehe Abschnitt 3)
- Status setzen: `re-review-required`
- Re-Review Ticket erstellen

**Re-Review Ticket enthält:**
- **Trigger-Art** (Daten, KI/Modell, Risiko, Governance, Infrastruktur, Zeitbasiert)
- **Zeitstempel** (ISO 8601)
- **Betroffener Use-Case** (Use-Case-ID, Name)
- **Bisherige Freigabe** (Freigabedatum, Verantwortliche, Hash)
- **Trigger-Details** (JSON mit Details)

**Output:** Re-Review Ticket (JSON + PDF)

**Verantwortlich:** System (automatisch)

**Zeitaufwand:** Automatisch (< 1 Minute)

---

### **Stufe 2 – Datenanalyse (DSFA-Verantwortlicher)**

**Aktivitäten:**
- Neue Datenarten prüfen
- PD-Veränderungen analysieren
- Exposure-Events auswerten
- Änderungen im Datenfluss identifizieren
- Sensible-Data-Heatmap Events prüfen

**Prüfung:**
- Welche neuen Datenarten wurden verarbeitet?
- Gibt es neue personenbezogene Daten?
- Wurden Personen in Bildern erkannt?
- Gab es PD-Exposure Events?
- Hat sich die Datensensitivität geändert?

**Output:** Datenanalysebericht (PDF)

**Verantwortlich:** DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Tage

---

### **Stufe 3 – Risikoanalyse (System + DSFA-Verantwortlicher)**

**Bestandteile:**

#### **3.1 Score Drift Analyse**

- Vergleich: Risiko-Score vorher vs. jetzt
- Berechnung: Score-Änderung (Delta)
- Bewertung: Ist Score-Änderung signifikant? (> 2 Punkte)

#### **3.2 Risikovergleich: vorher vs. jetzt**

| Risikoart | Vorher (Score) | Jetzt (Score) | Delta | Bewertung |
|-----------|----------------|---------------|-------|-----------|
| **R1 – Technische Risiken** | {{R1_BEFORE}} | {{R1_NOW}} | {{R1_DELTA}} | {{R1_ASSESSMENT}} |
| **R2 – Datenschutzrisiken** | {{R2_BEFORE}} | {{R2_NOW}} | {{R2_DELTA}} | {{R2_ASSESSMENT}} |
| **R3 – Organisatorische Risiken** | {{R3_BEFORE}} | {{R3_NOW}} | {{R3_DELTA}} | {{R3_ASSESSMENT}} |
| **R4 – Operative Risiken** | {{R4_BEFORE}} | {{R4_NOW}} | {{R4_DELTA}} | {{R4_ASSESSMENT}} |
| **R5 – Compliance-Risiken** | {{R5_BEFORE}} | {{R5_NOW}} | {{R5_DELTA}} | {{R5_ASSESSMENT}} |

#### **3.3 Neue Risiken**

- Identifikation neuer Risiken (nicht in P5-RISK-MATRIX)
- Bewertung neuer Risiken (EW × SA)
- Zuordnung zu Risikokategorien (R1-R5)

#### **3.4 Bewertung pro Risikoart**

- R1 – Technische Risiken: {{R1_ASSESSMENT}}
- R2 – Datenschutzrisiken: {{R2_ASSESSMENT}}
- R3 – Organisatorische Risiken: {{R3_ASSESSMENT}}
- R4 – Operative Risiken: {{R4_ASSESSMENT}}
- R5 – Compliance-Risiken: {{R5_ASSESSMENT}}

**Output:** Risikoanalysebericht (PDF)

**Verantwortlich:** System (automatisch) + DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Tage

---

### **Stufe 4 – Maßnahmenprüfung (DSFA-Verantwortlicher + Systemarchitekt)**

**Aktivitäten:**
- Maßnahmen-Status prüfen (siehe `P5-MEASURES.md`)
- Implementierungsstatus bewerten
- Abgelaufene Maßnahmen identifizieren
- Neue Maßnahmen ableiten (falls erforderlich)
- Maßnahmen-Priorisierung prüfen

**Prüfung:**
- Sind alle Maßnahmen implementiert? (Status ≥ 80%)
- Gibt es abgelaufene Maßnahmen?
- Sind neue Maßnahmen erforderlich?
- Ist die Priorisierung korrekt?

**Output:** Maßnahmen-Prüfbericht (PDF)

**Verantwortlich:** DSFA-Verantwortlicher + Systemarchitekt

**Zeitaufwand:** 1-2 Tage

---

### **Stufe 5 – DSGVO-Konformitäts-Prüfung (Datenschutzbeauftragter)**

**Aktivitäten:**
- DSGVO-Konformität prüfen (Art. 6, Art. 9, Art. 32, Art. 35)
- Rechtsgrundlagen validieren
- PD-Kategorien prüfen
- Löschroutinen prüfen
- Data Minimization prüfen

**Prüfung:**
- Ist die Rechtsgrundlage noch gültig?
- Werden PD korrekt verarbeitet?
- Sind Löschroutinen aktiv?
- Wird Data Minimization eingehalten?

**Output:** DSGVO-Konformitäts-Bericht (PDF)

**Verantwortlich:** Datenschutzbeauftragter

**Zeitaufwand:** 1-2 Tage

**Bedingung:** Nur bei High/Critical-Risk erforderlich

---

### **Stufe 6 – Entscheidung & Dokumentation (DSFA-Verantwortlicher + Admin)**

**Aktivitäten:**
- Entscheidung treffen: Re-Approval erforderlich?
- Dokumentation aktualisieren
- Compliance-Register aktualisieren
- Audit-Log erstellen
- Hash generieren (SHA-256)

**Entscheidung:**
- ☐ **Re-Approval erforderlich** → P5-FREIGABE-PROZESS durchführen
- ☐ **Kein Re-Approval erforderlich** → Status: `reviewed – no changes`
- ☐ **Maßnahmen erforderlich** → Maßnahmen implementieren, dann Re-Approval

**Output:** Re-Review-Bericht (PDF + Hash)

**Verantwortlich:** DSFA-Verantwortlicher + Admin

**Zeitaufwand:** 1 Tag

---

## 6. Re-Review-Prozess-Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│         STUFE 1: TRIGGER-IDENTIFIKATION (SYSTEM)            │
│  Automatische Erkennung von Triggern                        │
│  Status: re-review-required                                │
│  Re-Review Ticket erstellen                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│      STUFE 2: DATENANALYSE (DSFA-VERANTWORTLICHER)          │
│  Neue Datenarten, PD-Veränderungen, Exposure-Events        │
│  Datenanalysebericht erstellen                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│    STUFE 3: RISIKOANALYSE (SYSTEM + DSFA-VERANTWORTLICHER)  │
│  Score Drift, Risikovergleich, neue Risiken                │
│  Risikoanalysebericht erstellen                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│   STUFE 4: MAßNAHMENPRÜFUNG (DSFA + SYSTEMARCHITEKT)        │
│  Maßnahmen-Status, abgelaufene Maßnahmen, neue Maßnahmen   │
│  Maßnahmen-Prüfbericht erstellen                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │ Risikokategorie?│
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   Low/Medium                                High/Critical
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STUFE 6:         │              │ STUFE 5:                    │
│ ENTSCHEIDUNG     │              │ DSGVO-KONFORMITÄTS-PRÜFUNG   │
│ & DOKUMENTATION  │              │ (Datenschutzbeauftragter)   │
│ Re-Approval?     │              │ DSGVO-Konformität prüfen    │
└────────┬─────────┘              └──────────────┬───────────────┘
         │                                       │
         │                                       ▼
         │                              ┌──────────────────┐
         │                              │ STUFE 6:         │
         │                              │ ENTSCHEIDUNG     │
         │                              │ & DOKUMENTATION  │
         │                              │ Re-Approval?     │
         │                              └────────┬─────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │ Re-Approval?    │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        Ja                                        Nein
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ P5-FREIGABE-     │              │ Status: reviewed –           │
│ PROZESS         │              │ no changes                    │
│ durchführen      │              │ Dokumentation aktualisieren  │
└──────────────────┘              └──────────────────────────────┘
```

---

## 7. Re-Review-Bericht

### **7.1 Inhalt**

- Re-Review Ticket (Stufe 1)
- Datenanalysebericht (Stufe 2)
- Risikoanalysebericht (Stufe 3)
- Maßnahmen-Prüfbericht (Stufe 4)
- DSGVO-Konformitäts-Bericht (Stufe 5, bei High/Critical)
- Entscheidung (Stufe 6)
- Audit-Hash (SHA-256)

### **7.2 Format**

- PDF (für Archivierung)
- JSON (für System)
- Markdown (für Dokumentation)

### **7.3 Speicherung**

- Datenbank: `dsgvo_audit_events`
- Dateisystem: `docs/COMPLIANCE/DSGVO/PDF/reviews/`
- Repository: Versioniert

---

## 8. Entscheidungskriterien

### **8.1 Re-Approval erforderlich**

Re-Approval ist erforderlich, wenn:

- ✅ Risiko-Score gestiegen ist (> 2 Punkte)
- ✅ Neue High-Risk Faktoren identifiziert wurden
- ✅ Maßnahmen unvollständig sind (< 80%)
- ✅ DSGVO-Konformität nicht mehr gegeben ist
- ✅ Neue Datenarten verarbeitet werden
- ✅ Provider-Modell gewechselt wurde
- ✅ Governance-Änderungen vorgenommen wurden

**Aktion:** P5-FREIGABE-PROZESS durchführen (Stufe 1-6)

---

### **8.2 Kein Re-Approval erforderlich**

Kein Re-Approval ist erforderlich, wenn:

- ✅ Risiko-Score unverändert oder gesunken ist
- ✅ Alle Maßnahmen implementiert sind (≥ 80%)
- ✅ DSGVO-Konformität gegeben ist
- ✅ Keine signifikanten Änderungen erkannt wurden

**Aktion:** Status: `reviewed – no changes`, Dokumentation aktualisieren

---

## 9. Review-Zyklen

| Risikokategorie | Review-Zyklus | Nächstes Review | Verantwortlich |
|----------------|---------------|-----------------|----------------|
| **Critical** | Alle 3 Monate | 27.02.2026 | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **High** | Alle 6 Monate | 27.05.2026 | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **Medium** | Alle 12 Monate | 27.11.2026 | DSFA-Verantwortlicher |
| **Low** | Alle 24 Monate | 27.11.2027 | DSFA-Verantwortlicher |

**Auslöser für außerplanmäßige Reviews:**
- Automatische Trigger (siehe Abschnitt 3)
- Systemänderungen
- Vorfälle
- Gesetzesänderungen

---

## 10. Audit-Log

Jeder Re-Review erzeugt einen Audit-Log-Eintrag:

- **Event-Type:** `REVIEW_TRIGGERED`, `REVIEW_COMPLETED`, `REVIEW_REAPPROVAL_REQUIRED`, `REVIEW_NO_CHANGES`
- **User-ID:** Verantwortlicher
- **Resource-Type:** `dsfa-review`
- **Resource-ID:** Use-Case-ID
- **Details:** Vollständige Re-Review-Daten (JSON)
- **Timestamp:** ISO 8601
- **Hash:** SHA-256

**Speicherung:** `dsgvo_audit_events` Tabelle

---

## 11. Integration mit Monitoring-Plan

Der Re-Review-Prozess ist vollständig integriert mit:

- **P6-MONITORING-PLAN.md** – Trigger-Identifikation
- **P5-RISK-MATRIX.md** – Risikobewertung
- **P5-MEASURES.md** – Maßnahmenprüfung
- **P5-FREIGABE-PROZESS.md** – Re-Approval-Prozess

---

## 12. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiger Re-Review-Prozess

---

## 13. Audit-Hash

**Wird bei jeder Änderung neu generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

**Hash-Generierung:**
- Algorithmus: SHA-256
- Inhalt: Vollständiges Dokument (Markdown)
- Timestamp: ISO 8601
- Verantwortlicher: DSFA-Verantwortlicher

**Hash wird hier eingetragen, sobald Dokument freigegeben wurde.**

---

*Generated by Enterprise++ DSGVO Risk Review Process System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*





