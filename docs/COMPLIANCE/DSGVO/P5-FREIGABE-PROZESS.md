# P5-FREIGABE-PROZESS

## Manuelle Freigabe kritischer KI-Funktionen (Enterprise++ / Ultra-Premium)

### Lopez IT Welt – DSGVO Phase P5

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument beschreibt den vollständigen **Freigabeprozess für kritische KI-Funktionen** im Rahmen der Datenschutz-Folgenabschätzung (DSFA, Phase P5) gemäß:

- **DSGVO Art. 35** (DSFA)
- **ISO 27001 / ISO 27701** (Human Oversight)
- **EU AI Act** (High-Risk KI – Human Supervision)
- **SAP / IBM / Siemens Governance Standards**
- **Lopez IT Welt Enterprise++ Richtlinien**

Es stellt sicher, dass **kritische Funktionen niemals automatisch aktiviert werden**, sondern **zwingend** eine dokumentierte, manuelle Freigabe benötigen.

**Zweck:**
- Sicherstellung, dass keine kritischen Funktionen ohne Freigabe aktiviert werden
- Transparente und nachvollziehbare Entscheidungsprozesse
- Vollständige Dokumentation für Compliance
- Enterprise++ Standard (SAP/IBM/Siemens-Niveau)

**WICHTIG:** Keine kritische KI-Funktion wird ohne **Manual Approval** aktiviert.

---

## 2. Geltungsbereich

Der Freigabeprozess gilt für:

- **High-Risk KI-Use-Cases**
- **Critical-Risk Use-Cases**
- Alle Funktionen, die personenbezogene Daten verarbeiten
- Alle KI-Module, die Personen erkennen (Media-KI)
- Alle automatisierten Entscheidungen (Decision Engine)
- Alle Prozessveränderungen im Orchestrator
- Jede Änderung an DSGVO-Firewall oder QualityGate
- Alle neuen Provider (OpenAI-Modelle etc.)

---

## 3. Rollenmodell (Enterprise++)

| Rolle | Beschreibung | Verantwortlichkeiten |
|-------|--------------|----------------------|
| **DSFA-Verantwortlicher** | Führt Risikoanalyse durch, gibt kritische Funktionen frei | Risikoanalyse, Freigabe-Entscheidung |
| **Datenschutzbeauftragter** | Prüft DSGVO-Konformität | DSGVO-Konformitäts-Prüfung, Freigabe bei High-Risk |
| **Systemarchitekt** | Prüft technische Risiken | Technische Prüfung, API-Flow, Datenfluss |
| **Admin** | Dokumentiert Entscheidungen, führt Freigaben aus | Administrative Freigabe in UI, Dokumentation |
| **Entwickler** | Dürfen **keine** kritischen Funktionen freischalten | Technische Umsetzung, keine Freigaben |

**WICHTIG:** Nur DSFA-Verantwortlicher und Datenschutzbeauftragter können kritische Funktionen freigeben.

---

## 4. Kategorien mit Freigabepflicht

Die folgenden Kategorien erfordern zwingend manuelle Freigabe:

### **4.1 High-Risk KI**

- **Media-KI** (Gesichter, sensible Inhalte)
- **DSGVO-Firewall** (Sensitive Data Analyzer)
- **QualityGate / Decision Engine**
- **Rechnungsmodul KI** (PD + Finanzdaten)

### **4.2 Critical Governance**

- **Admin-UI Freigabeprozesse selbst**
- **RBAC/ABAC Änderungen**
- **Neue Rollen oder Berechtigungen**
- **Änderungen an Kostenkontrolle**
- **Änderungen am Audit-Log-System**

### **4.3 KI-Modelle / Provider**

- **Nutzung neuer OpenAI-Modelle**
- **Änderungen an API-Parametern**
- **Neue Provider / Infrastruktur**

---

## 5. 6-Stufen Freigabeprozess (Ultra-Premium)

---

### **Stufe 1 – Risiko-Trigger**

Eine Funktion wird als „kritisch" markiert, wenn:

- Risikoscore > 10
- Personen sichtbar in Bildern
- Sensible Daten verarbeitet werden
- Funktionen automatisiert Entscheidungen treffen
- Provider externer Datenverarbeitung involviert ist
- Kategorie = High oder Critical

**System setzt Status:**  
`locked – Manual Approval Required`

**Aktivitäten:**
- Automatische Erkennung kritischer Funktionen
- Status setzen: `locked`
- Benachrichtigung an DSFA-Verantwortlichen
- Audit-Log: `APPROVAL_REQUIRED`

**Verantwortlich:** System (automatisch)

---

### **Stufe 2 – DSFA-Review (DSFA-Verantwortlicher)**

Der DSFA-Verantwortliche prüft:

- **P5-RISK-MATRIX Einträge** (Risikobewertung)
- **Maßnahmenkatalog** (P5-MEASURES)
- **Neue Abhängigkeiten** (Provider, APIs)
- **Erwartete Datenflüsse** (Datenarten, PD)
- **Provider-Risiken** (OpenAI, externe APIs)
- **DSGVO-Firewall-Status** (Aktiv, konfiguriert)

**Ergebnis:** Risikoanerkennung oder Ablehnung

**Aktivitäten:**
- Risikoanalyse durchführen
- Maßnahmen prüfen
- Entscheidung dokumentieren
- Audit-Log: `DSFA_REVIEW_COMPLETED`

**Verantwortlich:** DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Tage

---

### **Stufe 3 – Datenschutzprüfung**

Datenschutzbeauftragter prüft:

- **PD-Kategorien** (Art. 9, besondere Kategorien)
- **Löschroutinen** (Art. 17, Recht auf Vergessenwerden)
- **Minimierung** (Art. 5, Data Minimization)
- **DSFA-Konformität** (Art. 35)
- **Rechtsgrundlagen** (Art. 6, Verarbeitungsgrundlagen)

**Ergebnis:** **Freigabe** oder **Nachbesserungsanforderung**

**Aktivitäten:**
- DSGVO-Konformität prüfen
- Rechtsgrundlagen validieren
- Entscheidung dokumentieren
- Audit-Log: `DSB_REVIEW_COMPLETED`

**Verantwortlich:** Datenschutzbeauftragter

**Zeitaufwand:** 1-2 Tage

**Bedingung:** Nur bei High/Critical-Risk erforderlich

---

### **Stufe 4 – Technische Prüfung (Systemarchitekt)**

Prüfung von:

- **API-Flow** (Request/Response, Fehlerbehandlung)
- **Datenfluss** (Input/Output, Transformationen)
- **Logging** (Audit-Logs, Error-Logs)
- **Sandbox-Tests** (Test-Umgebung, Validierung)
- **QualityGate-Output** (Quality-Score, Issues)
- **Provider-Limits** (Token-Limits, Rate-Limits)
- **Sicherheitsmaßnahmen** (Verschlüsselung, Zugriffskontrolle)

**Aktivitäten:**
- Technische Prüfung durchführen
- Sandbox-Tests ausführen
- QualityGate-Output prüfen
- Entscheidung dokumentieren
- Audit-Log: `TECHNICAL_REVIEW_COMPLETED`

**Verantwortlich:** Systemarchitekt

**Zeitaufwand:** 1-2 Tage

---

### **Stufe 5 – Administrative Freigabe**

Admin führt die Freigabe **in der Admin-UI** aus.

#### **Freigabeparameter:**

- **Verantwortlicher** (DSFA-Verantwortlicher, Datenschutzbeauftragter)
- **Datum** (ISO 8601)
- **Maßnahmenpaket** (Referenz zu P5-MEASURES)
- **Risikostatus** (Low/Medium/High/Critical)
- **Kommentar** (Freigabegrund)
- **Audit-Hash** (SHA-256)

**Status nach Freigabe:**  
`released – active`

**Aktivitäten:**
- Freigabe in Admin-UI durchführen
- Parameter dokumentieren
- Audit-Hash generieren
- Audit-Log: `APPROVAL_GRANTED`

**Verantwortlich:** Admin (nach Freigabe durch DSFA-Verantwortlicher/Datenschutzbeauftragter)

**Zeitaufwand:** 1 Tag

---

### **Stufe 6 – Compliance & Audit**

Automatisch erzeugt:

- **Freigabeprotokoll** (PDF + JSON)
- **Audit-Log-Eintrag** (`dsgvo_audit_events`)
- **Compliance-Register-Eintrag** (Datenbank)
- **Hash der Entscheidung** (SHA-256)
- **Review-Datum** (Nächstes Review)
- **DSFA-Report-Update** (P5-DSFA-PLAN)

**Aktivitäten:**
- Freigabeprotokoll generieren
- Audit-Log erstellen
- Compliance-Register aktualisieren
- Hash berechnen
- Review-Datum setzen
- Audit-Log: `APPROVAL_COMPLETED`

**Verantwortlich:** System (automatisch)

**Zeitaufwand:** Automatisch

---

## 6. Freigabeprozess-Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│              STUFE 1: RISIKO-TRIGGER                        │
│  System erkennt kritische Funktion                          │
│  Status: locked – Manual Approval Required                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│         STUFE 2: DSFA-REVIEW (DSFA-VERANTWORTLICHER)        │
│  Risikoanalyse, Maßnahmen prüfen                            │
│  Ergebnis: Risikoanerkennung oder Ablehnung                │
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
│ STUFE 4:        │              │ STUFE 3:                    │
│ TECHNISCHE      │              │ DATENSCHUTZPRÜFUNG          │
│ PRÜFUNG         │              │ (Datenschutzbeauftragter)   │
│ (Systemarchitekt)│              │ DSGVO-Konformität prüfen    │
└────────┬─────────┘              └──────────────┬───────────────┘
         │                                       │
         │                                       ▼
         │                              ┌──────────────────┐
         │                              │ STUFE 4:        │
         │                              │ TECHNISCHE      │
         │                              │ PRÜFUNG         │
         │                              │ (Systemarchitekt)│
         │                              └────────┬─────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│         STUFE 5: ADMINISTRATIVE FREIGABE (ADMIN)            │
│  Freigabe in Admin-UI durchführen                           │
│  Status: released – active                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│         STUFE 6: COMPLIANCE & AUDIT (SYSTEM)                 │
│  Freigabeprotokoll, Audit-Log, Compliance-Register          │
│  Hash generieren, Review-Datum setzen                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Freigabekriterien

Eine kritische Funktion darf **erst freigeschaltet werden**, wenn:

- ✅ Alle Maßnahmen (P5-MEASURES) erfüllt sind
- ✅ Risiko ≤ „High" (keine Critical ohne Gegenmaßnahmen)
- ✅ DSFA vollständig dokumentiert ist
- ✅ Datensparsamkeit gewährleistet ist
- ✅ DSGVO-Firewall aktiv ist
- ✅ QualityGate aktiv ist
- ✅ Audit-Log aktiviert ist
- ✅ Manuelle Freigabe dokumentiert wurde

**Checkliste:**

| Kriterium | Status | Verantwortlich |
|-----------|--------|----------------|
| Maßnahmen erfüllt | ☐ | DSFA-Verantwortlicher |
| Risiko ≤ High | ☐ | DSFA-Verantwortlicher |
| DSFA dokumentiert | ☐ | Systemarchitekt |
| Data Minimization | ☐ | Datenschutzbeauftragter |
| DSGVO-Firewall aktiv | ☐ | Systemarchitekt |
| QualityGate aktiv | ☐ | Systemarchitekt |
| Audit-Log aktiv | ☐ | Systemarchitekt |
| Freigabe dokumentiert | ☐ | Admin |

---

## 8. Ablehnungskriterien

Freigabe wird **verweigert**, wenn:

- ❌ Risikobewertung = Critical und Maßnahmen unvollständig
- ❌ Personenbezogene Daten nicht geschützt werden
- ❌ Datenfluss zu Provider zu weit ist
- ❌ Fehlende Protokollierung
- ❌ Rechtliche Grundlage unklar
- ❌ Fehlendes technisches Testprotokoll

**Ablehnungsprozess:**

1. Ablehnung dokumentieren
2. Gründe auflisten
3. Nachbesserungsanforderungen definieren
4. Audit-Log: `APPROVAL_REJECTED`
5. Status: `rejected – improvements required`

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

## 10. Automatische Sperre bei Änderungen

Folgende Änderungen sperren kritische KI automatisch:

- **Änderung am Prompt-Verhalten** (ContentAgent, Media-KI)
- **Neue Modelle** (OpenAI GPT-4 → GPT-5)
- **Neue Provider** (OpenAI → Anthropic)
- **Änderung an Datenschutz-Regeln** (DSGVO-Firewall)
- **Änderung am Rollenmodell** (RBAC/ABAC)

**Status:**  
`locked – new manual approval required`

**Aktivitäten:**
- Automatische Erkennung von Änderungen
- Status setzen: `locked`
- Benachrichtigung an DSFA-Verantwortlichen
- Audit-Log: `REAPPROVAL_REQUIRED`

---

## 11. Freigabedokument-Vorlage

### **11.1 Freigabedokument (PDF)**

**Use-Case:** _________________________

**Risikokategorie:** ☐ Low ☐ Medium ☐ High ☐ Critical

**Risikowert:** _________________________

**Freigegeben von:**
- DSFA-Verantwortlicher: _________________________ (Datum: ___________)
- Datenschutzbeauftragter: _________________________ (Datum: ___________) [nur bei High/Critical]

**Maßnahmenpaket:** Siehe `P5-MEASURES.md` (Abschnitt: ___________)

**Freigabegrund:** _________________________

**Bedingungen:** _________________________

**Hash (SHA-256):** _________________________

**Review-Datum:** _________________________

---

### **11.2 Audit-Log-Eintrag**

```json
{
  "event_type": "APPROVAL_GRANTED",
  "user_id": "dsfa-verantwortlicher-id",
  "resource_type": "dsfa",
  "resource_id": "use-case-id",
  "details": {
    "use_case": "Media-KI",
    "risk_category": "High",
    "risk_score": 16,
    "approved_by": ["dsfa-verantwortlicher", "datenschutzbeauftragter"],
    "approval_date": "2025-11-27T12:00:00Z",
    "measures_package": "P5-MEASURES.md#4.1",
    "approval_reason": "Alle Maßnahmen erfüllt, DSGVO-konform",
    "conditions": ["DSGVO-Firewall aktiv", "QualityGate aktiv", "Audit-Log aktiv"],
    "hash": "sha256:...",
    "review_date": "2026-02-27"
  },
  "timestamp": "2025-11-27T12:00:00Z"
}
```

---

## 12. Compliance-Register

Alle Freigaben werden im Compliance-Register dokumentiert:

- Use-Case
- Risikokategorie
- Freigabedatum
- Verantwortliche
- Maßnahmenpaket
- Review-Zyklus
- Nächstes Review-Datum

**Speicherung:** Datenbank + PDF-Export

---

## 13. Auditierbarkeit

Jede Freigabe erzeugt automatisch:

- **Unveränderbares Audit-Log** (`dsgvo_audit_events`)
- **Compliance-Register-Eintrag** (Datenbank)
- **Hash (SHA-256)** (Freigabedokument)
- **Review-Termin** (Nächstes Review-Datum)
- **Änderungsreferenz** (Version, Changelog)

**Audit-Events:**
- `APPROVAL_REQUIRED` – Freigabe erforderlich
- `DSFA_REVIEW_COMPLETED` – DSFA-Review abgeschlossen
- `DSB_REVIEW_COMPLETED` – Datenschutzprüfung abgeschlossen
- `TECHNICAL_REVIEW_COMPLETED` – Technische Prüfung abgeschlossen
- `APPROVAL_GRANTED` – Freigabe erteilt
- `APPROVAL_REJECTED` – Freigabe abgelehnt
- `APPROVAL_COMPLETED` – Freigabe vollständig
- `REAPPROVAL_REQUIRED` – Neue Freigabe erforderlich

---

## 14. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiger Freigabeprozess

---

## 15. Audit-Hash

**Wird nach Freigabe automatisch generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

**Hash-Generierung:**
- Algorithmus: SHA-256
- Inhalt: Vollständiges Dokument (Markdown)
- Timestamp: ISO 8601
- Verantwortlicher: DSFA-Verantwortlicher

**Hash wird hier eingetragen, sobald Dokument freigegeben wurde.**

---

*Generated by Enterprise++ DSFA Approval Process System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*
