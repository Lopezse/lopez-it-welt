# P5-DSFA-PLAN

## Datenschutz-Folgenabschätzung (DSFA) – Enterprise++

### Lopez IT Welt – KI- und Datenverarbeitungssysteme

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Diese Datenschutz-Folgenabschätzung (DSFA) bildet Phase **P5** des Lopez-IT-Welt-DSGVO-Programms ab.

Das Dokument definiert den vollständigen Rahmen für Risikoanalyse, Maßnahmen, Bewertung und Freigabe sämtlicher KI-gestützter Funktionen im System.

Es entspricht den Vorgaben aus:

- **DSGVO (Art. 35 – DSFA)**
- **ISO 27001 / 27002**
- **ISO 27701 (Privacy)**
- **EU AI Act – High-Risk Framework**
- **SAP / IBM / Siemens AI Governance Standards**
- **Lopez-IT-Welt Enterprise++ Regelwerk**

Dieses Dokument dient als zentrale Leitlinie für alle KI-Prozesse, Agenten, Datenflüsse und Admin-Entscheidungen.

---

## 2. Ziel & Zweck der DSFA

Die DSFA hat die Aufgabe:

- Risiken für betroffene Personen zu identifizieren
- technische, organisatorische und rechtliche Schutzmaßnahmen festzulegen
- KI-Prozesse transparent und dokumentiert zu steuern
- kritische Funktionen nur manuell freizugeben
- eine zertifizierungsfähige Governance-Struktur zu schaffen
- Compliance mit DSGVO, ISO und Unternehmensrichtlinien sicherzustellen

**Ziel:**  
Ein sicheres, transparentes, auditierbares und hochqualitatives KI-System – konform zu Enterprise++ Standards.

---

## 3. Begriffe & Definitionen

**KI-Agent:**  
Softwaremodul innerhalb des Orchestrators, das Eingaben verarbeitet und Entscheidungen vorschlägt.

**Automatisierte Entscheidung:**  
Ein Prozess, der ohne menschliches Zutun Auswirkungen auf eine Person haben kann.

**Personenbezogene Daten (PD):**  
Alle Daten, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.

**Media-KI:**  
Bildanalyse-System zur Erkennung von Personen, Objekten oder Strukturen – ohne biometrische Identifikation.

**Critical Feature:**  
Funktion mit hoher oder kritischer Risikobewertung. Aktivierung nur per **Manual Approval** möglich.

**Zero-CMD:**  
Alle Datenschutz- und KI-relevanten Entscheidungen werden ausschließlich über die Admin-UI vorgenommen.

**DSFA-Verantwortlicher:**  
Person, die für die Bewertung und Freigabe kritischer Risiken verantwortlich ist.

**Risikomatrix:**  
ISO-konforme Matrix zur Bewertung von Eintrittswahrscheinlichkeit und Schadensausmaß.

**Maßnahmenkatalog:**  
Liste aller technischen und organisatorischen Maßnahmen zur Risikominimierung.

**Freigabeprozess:**  
Strukturierter Prozess zur manuellen Freigabe kritischer KI-Funktionen.

---

## 4. Rahmenwerke & Normen

Diese DSFA basiert auf folgenden Standards:

| Standard | Relevanz |
|---------|-----------|
| **DSGVO Art. 35** | Pflicht für High-Risk Verarbeitungen |
| **ISO 27001** | Sicherheit der Informationssysteme |
| **ISO 27701** | Datenschutz-Management |
| **EU AI Act** | Umgang mit KI-Risiken |
| **IBM Responsible AI** | Governance & Ethik |
| **SAP AI Ethics Policy** | Transparenz & Kontrolle |
| **Siemens Trustworthy AI** | Integrität & Sicherheit |

---

## 5. Systemüberblick

Das System umfasst:

- **KI-Orchestrator** mit Registry, ContextManager und QualityGate
- **Media-KI** (Bildanalyse, DSGVO-konform)
- **Rechnungsmodul** (GoBD + DSGVO)
- **Admin-Dashboard** (Zero-CMD)
- **DSGVO-KI-Firewall** (Decision Engine)
- **Audit-Log-System** (vollständige Protokollierung)
- **Kostenkontrolle** (KI-API-Kostenüberwachung)
- **Async-Processing** (Hintergrundverarbeitung)

Alle kritischen Operationen sind auditierbar und rollenbasiert.

---

## 6. Rollenmodell (Enterprise++)

| Rolle | Verantwortlichkeiten |
|-------|-----------------------|
| **DSFA-Verantwortlicher** | Bewertung, Freigabe kritischer Risiken |
| **Systemarchitekt** | technische Risikoanalyse |
| **Datenschutzbeauftragter** | Prüfung DSGVO-Konformität |
| **Admin** | Pflege der DSFA-Daten |
| **Entwickler** | technische Umsetzung, keine Freigaben |

**WICHTIG:** Nur DSFA-Verantwortlicher und Datenschutzbeauftragter können kritische Funktionen freigeben.

---

## 7. P5-Prozessbeschreibung (Stufe 1–10)

Die gesamte P5-Phase besteht aus 10 klar definierten Schritten.

### **P5.1 – Use-Case-Inventar**

**Ziel:** Erfassung aller KI-Funktionen

**Aktivitäten:**
- Liste aller KI-Agenten erstellen
- Datenarten pro Agent identifizieren
- Klassifikation (low/mid/high risk)
- Dokumentation in DSFA-Register

**Output:** Use-Case-Inventar (siehe `P5-USE-CASES.md`)

**Verantwortlich:** Systemarchitekt

**Zeitaufwand:** 1-2 Wochen

**Status:** ✅ **ABGESCHLOSSEN** (27.11.2025)

---

### **P5.2 – Risikoidentifikation**

**Ziel:** Alle Risiken identifizieren

**Aktivitäten:**
- KI-Risiken (Bias, Fehler, Transparenz)
- Datenrisiken (Verlust, Zugriff, Verarbeitung)
- Modellrisiken (Qualität, Aktualität, Validierung)
- Provider-Risiken (OpenAI, externe APIs)

**Output:** Risikoliste (kategorisiert, siehe `P5-RISK-MATRIX.md`)

**Verantwortlich:** Systemarchitekt + DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Wochen

**Status:** ✅ **ABGESCHLOSSEN** (27.11.2025)

---

### **P5.3 – Risikobewertung**

**Ziel:** ISO-konforme Bewertung

**Aktivitäten:**
- Risikomatrix anwenden (siehe `P5-RISK-MATRIX.md`)
- Eintrittswahrscheinlichkeit bewerten
- Schadensausmaß bewerten
- Gesamtrisiko berechnen

**Output:** Risikobewertungsmatrix (siehe `P5-RISK-MATRIX.md`)

**Verantwortlich:** DSFA-Verantwortlicher

**Zeitaufwand:** 1 Woche

**Status:** ✅ **ABGESCHLOSSEN** (27.11.2025)

---

### **P5.4 – Maßnahmenkatalog**

**Ziel:** Automatisch generiert + manuell bestätigt

**Aktivitäten:**
- Maßnahmen aus Risikomatrix ableiten
- Technische Maßnahmen definieren
- Organisatorische Maßnahmen definieren
- Rechtliche Maßnahmen definieren
- Manuelle Bestätigung durch DSFA-Verantwortlicher

**Output:** Maßnahmenkatalog (siehe `P5-MEASURES.md`)

**Verantwortlich:** Systemarchitekt + DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Wochen

**Status:** ✅ **ABGESCHLOSSEN** (27.11.2025)

---

### **P5.5 – Manuelle Freigabe kritischer Funktionen (Pflicht!)**

**Ziel:** Kein kritisches Feature wird ohne **Manual Approval** aktiv

**Aktivitäten:**
- Freigabeprozess durchführen (siehe `P5-FREIGABE-PROZESS.md`)
- DSFA-Verantwortlicher prüft
- Datenschutzbeauftragter prüft (bei High-Risk)
- Freigabe in System eintragen
- Audit-Log erstellen

**Output:** Freigabedokument (PDF + Hash, siehe `P7-MANUAL-APPROVAL.md`)

**Verantwortlich:** DSFA-Verantwortlicher + Datenschutzbeauftragter

**Zeitaufwand:** 1-2 Tage pro Feature

**Status:** ✅ **DOKUMENTIERT** (27.11.2025) – Prozess definiert, Freigabedokument erstellt, Freigaben ausstehend

---

### **P5.6 – DSFA-Dokumentation**

**Ziel:** System erzeugt PDF + Audit-Hash

**Aktivitäten:**
- Vollständige DSFA-Dokumentation erstellen
- PDF generieren
- Audit-Hash berechnen (SHA-256)
- In Repository ablegen
- Versionierung

**Output:** DSFA-Dokument (PDF + Hash, siehe `P5-DSFA-REPORT-TEMPLATE.md`)

**Verantwortlich:** Systemarchitekt

**Zeitaufwand:** 1 Woche

**Status:** ✅ **VORLAGE ERSTELLT** (27.11.2025)

---

### **P5.7 – Compliance-Register**

**Ziel:** Automatische Eintragung aller Entscheidungen

**Aktivitäten:**
- Alle Freigaben in Register eintragen
- Risikobewertungen dokumentieren
- Maßnahmen dokumentieren
- Review-Zyklen planen

**Output:** Compliance-Register (Datenbank + PDF)

**Verantwortlich:** Admin

**Zeitaufwand:** Kontinuierlich

---

### **P5.8 – Re-Review / Aktualisierung**

**Ziel:** Jährlich oder bei Systemänderungen

**Aktivitäten:**
- Review-Zyklen einhalten (Standard: 12 Monate, High-Risk: 6 Monate, Kritisch: 3 Monate)
- Systemänderungen prüfen
- Neue Risiken identifizieren
- Maßnahmen aktualisieren

**Output:** Re-Review-Dokument (PDF, siehe `P6-RISK-REVIEW-PROZESS.md`)

**Verantwortlich:** DSFA-Verantwortlicher

**Zeitaufwand:** 1-2 Wochen pro Review

**Status:** ✅ **DOKUMENTIERT** (27.11.2025, siehe `P6-RISK-REVIEW-PROZESS.md`)

---

### **P5.9 – Liveschaltung**

**Ziel:** Nur nach Freigabe

**Aktivitäten:**
- Freigabe prüfen
- System aktivieren
- Monitoring aktivieren
- Audit-Log erstellen

**Output:** Aktivierungsbestätigung

**Verantwortlich:** Admin (nach Freigabe)

**Zeitaufwand:** 1 Tag

---

### **P5.10 – Monitoring**

**Ziel:** Überwachung im Weekly-Report

**Aktivitäten:**
- Weekly-Report generieren
- Risiken überwachen
- Maßnahmen prüfen
- Abweichungen melden

**Output:** Weekly-Report (JSON/PDF)

**Verantwortlich:** Monitoring-System (automatisch)

**Zeitaufwand:** Automatisch

**Status:** ✅ **ERWEITERT** (siehe `P6-MONITORING-PLAN.md`)

---

## 8. Risikomethode (ISO-konform)

Siehe `P5-RISK-MATRIX.md`.

**Kurzbeschreibung:**
- Eintrittswahrscheinlichkeit: 1-5 (selten bis sehr wahrscheinlich)
- Schadensausmaß: 1-5 (gering bis kritisch)
- Gesamtrisiko: Eintrittswahrscheinlichkeit × Schadensausmaß (1-25)
- Risikokategorien: Low (1-5), Medium (6-12), High (13-20), Critical (21-25)

---

## 9. Maßnahmenkatalog (technisch/organisatorisch)

Siehe `P5-MEASURES.md`.

**Kurzbeschreibung:**
- Technische Maßnahmen: Verschlüsselung, Zugriffskontrolle, Audit-Logs
- Organisatorische Maßnahmen: Schulungen, Prozesse, Verantwortlichkeiten
- Rechtliche Maßnahmen: Verträge, Consents, Datenschutzerklärungen

---

## 10. Freigabeprozess (kritische KI)

Siehe `P5-FREIGABE-PROZESS.md`.

**Kurzbeschreibung:**
- Schritt 1: Antrag stellen
- Schritt 2: Risikobewertung
- Schritt 3: Maßnahmen prüfen
- Schritt 4: Freigabe durch DSFA-Verantwortlicher
- Schritt 5: Freigabe durch Datenschutzbeauftragter (bei High-Risk)
- Schritt 6: Aktivierung

---

## 11. Dokumentationspflicht

Jede Entscheidung erzeugt:

- **Audit-Log** (in `dsgvo_audit_events`)
- **Compliance-Eintrag** (in DSFA-Register)
- **TimeStamp** (ISO 8601)
- **Verantwortlichen** (User-ID)
- **Version + Hash** (SHA-256)

**Speicherung:**
- Datenbank: `dsgvo_audit_events`
- Dateisystem: `docs/COMPLIANCE/DSGVO/P5-*.md`
- PDF-Archiv: `docs/COMPLIANCE/DSGVO/PDF/`

---

## 12. Review-Zyklen

| Risikokategorie | Review-Zyklus |
|----------------|---------------|
| **Low** | 12 Monate |
| **Medium** | 12 Monate |
| **High** | 6 Monate |
| **Critical** | 3 Monate |

**Auslöser für außerplanmäßige Reviews:**
- Systemänderungen
- Neue Risiken
- Vorfälle
- Gesetzesänderungen

---

## 13. Versionskontrolle

Dieses Dokument wird versioniert und im Repository abgelegt.

**Versionierung:**
- Format: `v1.0`, `v1.1`, `v2.0`
- Änderungen: Changelog in Dokument
- Hash: SHA-256 pro Version
- Archivierung: Alle Versionen werden archiviert

**Aktuelle Version:** v1.0 (27.11.2025)

---

## 14. Appendix

### **14.1 Glossar**

Siehe `docs/COMPLIANCE/DSGVO/00-DSGVO-MASTER-DOKUMENTATION.md` (Abschnitt "Begriffe & Definitionen").

### **14.2 Diagrammbeschreibungen**

- **System-Architektur:** Siehe `docs/02-ARCHITEKTUR/02-01-system-architektur.md`
- **KI-Orchestrator:** Siehe `docs/ENTERPRISE-PLUS-PLUS/LOPEZ-IT-WELT-2.0-ORCHESTRIERUNGSPLAN.md`
- **DSGVO-Flows:** Siehe `docs/COMPLIANCE/DSGVO/00-DSGVO-MASTER-DOKUMENTATION.md`

### **14.3 Matrixen**

- **Risikomatrix:** Siehe `P5-RISK-MATRIX.md`
- **Maßnahmenkatalog:** Siehe `P5-MEASURES.md`
- **Freigabeprozess:** Siehe `P5-FREIGABE-PROZESS.md`
- **Use-Case-Inventar:** Siehe `P5-USE-CASES.md`
- **DSFA-Report-Template:** Siehe `P5-DSFA-REPORT-TEMPLATE.md`

---

## 15. Referenzen

- `docs/COMPLIANCE/DSGVO/00-DSGVO-MASTER-DOKUMENTATION.md`
- `docs/COMPLIANCE/DSGVO/DSGVO-CHECKLISTE.md`
- `docs/COMPLIANCE/DSGVO/P5-USE-CASES.md` - Use-Case-Inventar
- `docs/COMPLIANCE/DSGVO/P5-RISK-MATRIX.md` - Risikobewertungsmatrix
- `docs/COMPLIANCE/DSGVO/P5-MEASURES.md` - Maßnahmenkatalog
- `docs/COMPLIANCE/DSGVO/P5-FREIGABE-PROZESS.md` - Freigabeprozess
- `docs/COMPLIANCE/DSGVO/P5-DSFA-REPORT-TEMPLATE.md` - DSFA-Report-Template
- `docs/COMPLIANCE/DSGVO/P6-MONITORING-PLAN.md` - Monitoring & Re-Review (Phase P6)
- `docs/COMPLIANCE/DSGVO/P6-RISK-REVIEW-PROZESS.md` - Re-Review-Prozess (6 Stufen)
- `docs/COMPLIANCE/DSGVO/P7-MANUAL-APPROVAL.md` - Offizielles DSFA-Freigabedokument (Phase P7)
- `docs/ENTERPRISE-PLUS-PLUS/LOPEZ-IT-WELT-2.0-ORCHESTRIERUNGSPLAN.md`
- `docs/STATUS.md` (DSGVO Phase P1-P4)

---

## 16. Audit-Hash

**Wird nach Freigabe automatisch generiert.**

**Aktueller Status:** ⏳ **AUSSTEHEND** (Dokument noch nicht freigegeben)

**Hash-Generierung:**
- Algorithmus: SHA-256
- Inhalt: Vollständiges Dokument (Markdown)
- Timestamp: ISO 8601
- Verantwortlicher: DSFA-Verantwortlicher

**Hash wird hier eingetragen, sobald Dokument freigegeben wurde.**

---

*Generated by Enterprise++ DSFA System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*

