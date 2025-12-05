# P6-MONITORING-PLAN

## DSGVO Phase P6 – Monitoring & Re-Review

### Lopez IT Welt – Enterprise++ KI-Governance

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **AKTIV**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieser Monitoring-Plan definiert das vollständige Vorgehen für die **laufende Überwachung aller KI- und DSGVO-relevanten Prozesse**.

Er basiert auf:

- **DSGVO Art. 35** (Laufende Überprüfung)
- **DSGVO Art. 32** (Überwachung der Maßnahmen)
- **ISO/IEC 27001** (Operational Controls)
- **ISO/IEC 27701** (Privacy Information Management)
- **EU AI Act** (Continuous Monitoring / High-Risk KI)
- **SAP / IBM / Siemens Enterprise AI Monitoring Standards**
- **Lopez IT Welt Enterprise++ KI-Framework**

**Zweck:**
- Kontinuierliche Überwachung aller KI- und DSGVO-Prozesse
- Früherkennung von Risiken und Anomalien
- Automatische Re-Reviews bei Änderungen
- Audit-Sicherheit und Compliance-Nachweis

---

## 2. Zielsetzung

Das Monitoring gewährleistet:

- **Frühzeitige Erkennung von Risiken** (proaktiv, nicht reaktiv)
- **Automatische Re-Reviews bei Änderungen** (keine manuellen Trigger erforderlich)
- **Audit-Sicherheit** (vollständige Nachvollziehbarkeit)
- **Preventives Erkennen von KI-Fehlverhalten** (vor Schäden)
- **Schutz personenbezogener Daten** (PD-Exposure Detection)
- **Provider-Monitoring** (OpenAI etc.)
- **Systemstabilität** (Infrastruktur-Überwachung)
- **Kostenkontrolle** (Budget-Überwachung)
- **Zentrale Transparenz in Admin-UI** (Zero-CMD, UI-only)

---

## 3. Monitoring-Bereiche (Option 3 – MAXIMAL)

### **3.1 Datenschutz-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **PD-Exposure Detection** | Erkennung unzulässiger PD-Verarbeitung | > 0 | Sofortige Sperre |
| **Sensitive-Data-Heatmap** | Visualisierung sensibler Datenflüsse | Kontinuierlich | Dashboard-Anzeige |
| **DSGVO-Firewall Drift Detection** | Abweichungen in Firewall-Entscheidungen | > 10% | Alarm |
| **Unzulässige PD-Verarbeitung** | Verarbeitung ohne Rechtsgrundlage | > 0 | Sofortige Sperre |
| **Personen in Bildern ohne Freigabe** | Personenerkennung ohne Admin-Freigabe | > 0 | High-Risk Flow |
| **PD-Löschroutinen Monitoring** | Überwachung von Löschfristen | Täglich | Compliance-Check |

### **3.2 KI-Modell-Monitoring (Provider & intern)**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **Modell-Drift Detection** | Abweichungen in Modell-Verhalten | > 20% | Alarm & Prüfung |
| **Qualitätsdrift** | QualityGate Deviation | > 20% | Alarm & Prüfung |
| **Output-Anomalien** | Ungewöhnliche KI-Outputs | Kontinuierlich | Anomalie-Erkennung |
| **Prompt-Stability Monitoring** | Änderungen in Prompt-Verhalten | Jede Änderung | Lock & Re-Approval |
| **Kontextfehler** | ContextManager Deviations | > 10% | Alarm |
| **Provider-Change-Events** | OpenAI Model Updates | Jedes Update | Lock & Re-Approval |
| **Parameter-Veränderungen** | Änderungen an API-Parametern | Jede Änderung | Lock & Re-Approval |
| **Response-Latency Monitoring** | Latenz-Überwachung | > 5s | Alarm |

### **3.3 Risiko-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **DSFA-Score Drift** | Änderungen im Risiko-Score | > 2 Punkte | Re-Review Trigger |
| **High-Risk Trigger** | Neue High-Risk Faktoren | > 0 | Sofortige Prüfung |
| **Critical-Use-Case Trigger** | Critical-Risk Erkennung | > 0 | Sofortige Sperre |
| **Maßnahmenverfall** | Abgelaufene Maßnahmen | Ablaufdatum | Re-Review Trigger |
| **Neue Risikoquellen** | Neue Bilder, neue Inhalte | Kontinuierlich | Risiko-Assessment |

### **3.4 Prozess-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **Admin-Freigaben** | Überwachung aller Freigaben | Kontinuierlich | Audit-Log |
| **Re-Approval Required** | Erneute Freigabe erforderlich | > 0 | Benachrichtigung |
| **Unvollständige Freigaben** | Fehlende Freigabe-Schritte | > 0 | Alarm |
| **Fehlerhafte Rollenwechsel** | Unberechtigte Zugriffe | > 0 | Incident Response |
| **Fehlende Audit-Einträge** | Audit-Log-Lücken | > 0 | Incident Response |
| **Queue-Fehler / Timeouts** | Async-Queue-Probleme | > 3 | Auto-Alert |

### **3.5 Infrastruktur-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **API-Latenzen** | Response-Zeiten | > 5s | Alarm |
| **Serverlast** | CPU/Memory-Auslastung | > 80% | Alarm |
| **Speicherprobleme** | Disk-Space | > 90% | Alarm |
| **Queue-Stau** | Queue-Backlog | > 100 Tasks | Alarm |
| **Fehlgeschlagene Cron-Jobs** | Scheduled Tasks | > 0 | Auto-Alert |

### **3.6 Kosten-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **Kostenanomalien** | Ungewöhnliche Kosten | > 30% | Alarm & Limit |
| **Kostenexplosion** | Tägliche Kostensteigerung | > 30% / Tag | Alarm & Limit |
| **Provider-Fehler → Retries** | Kostenpflichtige Retries | > 10 | Alarm |

### **3.7 Audit-Monitoring**

| Monitoring-Aspekt | Beschreibung | Schwellwert | Aktion |
|-------------------|--------------|-------------|--------|
| **Audit-Anomalie-Erkennung** | Ungewöhnliche Audit-Events | Kontinuierlich | Anomalie-Erkennung |
| **Fehlende Logs** | Audit-Log-Lücken | > 0 | Incident Response |
| **Hash-Mismatch** | Audit-Hash-Verletzung | Jedes | Incident Response |
| **Log-Manipulationsversuche** | Manipulationsversuche | > 0 | Incident Response |
| **Compliance-Register Sync** | Synchronisation | Täglich | Auto-Sync |

---

## 4. Monitoring-Methoden

### **4.1 Automatisches Monitoring (System)**

| Methode | Beschreibung | Frequenz | Verantwortlich |
|---------|--------------|----------|----------------|
| **Event-Driven Monitoring** | Echtzeit-Überwachung bei Events | Real-Time | System |
| **Cron-Based Monitoring** | Geplante Überprüfungen | Nächtlich + Stündlich | System |
| **Real-Time Provider-Change Listener** | Provider-Update-Erkennung | Real-Time | System |
| **DSGVO-Firewall Event Listener** | Firewall-Event-Überwachung | Real-Time | System |
| **Queue-Anomalie-Scanner** | Queue-Problem-Erkennung | Stündlich | System |
| **Risk Drift Calculator** | Risiko-Drift-Berechnung | Täglich | System |

### **4.2 Manueller Review (DSFA + Datenschutz)**

| Risikokategorie | Review-Frequenz | Verantwortlich |
|----------------|-----------------|----------------|
| **High-Risk** | Monatlich | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **Medium-Risk** | Halbjährlich | DSFA-Verantwortlicher |
| **Low-Risk** | Jährlich | DSFA-Verantwortlicher |

### **4.3 KI-gestützte Monitoring-Agenten**

| Agent | Beschreibung | Frequenz | Status |
|-------|--------------|----------|--------|
| **ComplianceAgent** | Audit-Anomalien erkennen | Täglich | ✅ Aktiv |
| **RiskAgent** | Risiko-Drift erkennen | Täglich | ⏳ Geplant |
| **CostAgent** | Kostenüberwachung | Stündlich | ✅ Aktiv |
| **PrivacyAgent** | PD-Exposure erkennen | Real-Time | ⏳ Geplant |

---

## 5. Automatische Trigger für Re-Review (DSFA Re-Run)

Ein erneutes DSFA-Review wird automatisch ausgelöst, wenn:

### **5.1 Datengetriebene Trigger**

- ✅ **Neue Datenarten** erkannt
- ✅ **Neue personenbezogene Daten** verarbeitet
- ✅ **Personen in Medien** erkannt
- ✅ **Sensitive Daten** erkannt
- ✅ **Mehr als 10% Änderung** im Datenfluss

**Status:** `locked – data change detected, re-review required`

### **5.2 Modellgetriebene Trigger**

- ✅ **Neuer Provider** hinzugefügt
- ✅ **Neues OpenAI-Modell** verwendet
- ✅ **Modellparameter verändert**
- ✅ **Qualitätsdrift > 20%** erkannt

**Status:** `locked – model change detected, re-review required`

### **5.3 Risiko-Trigger**

- ✅ **DSFA-Score steigt > 2 Punkte**
- ✅ **Maßnahmen laufen ab** (Ablaufdatum erreicht)
- ✅ **Neue High-Risk Faktoren** identifiziert

**Status:** `locked – risk change detected, re-review required`

### **5.4 Governance-Trigger**

- ✅ **Neue Rollen** erstellt
- ✅ **Änderungen am Admin-System** vorgenommen
- ✅ **Geänderte Freigabeprozesse** implementiert

**Status:** `locked – governance change detected, re-review required`

### **5.5 Infrastruktur-Trigger**

- ✅ **Queue-Fehler wiederholt** (> 3 Fehler)
- ✅ **Latenzen > Schwellwert** (> 5s)
- ✅ **Serverfehler > 5%** (Error-Rate)

**Status:** `locked – infrastructure issue detected, re-review required`

---

## 6. Schwellwerte & Grenzwerte (Enterprise++)

| Bereich | Grenzwert | Aktion | Priorität |
|---------|-----------|--------|-----------|
| **QualityGate Drift** | > 20% | Alarm & Prüfung | P1 |
| **Media-KI PD Exposure** | > 0 | Sofortige Sperre | P1 (Critical) |
| **Kostenanstieg** | +30% / Tag | Alarm & Limit | P1 |
| **Personen erkannt** | 1+ | High-Risk Flow | P1 (Critical) |
| **Modellwechsel Provider** | Jedes | Lock & Re-Approval | P1 |
| **Queue Fehler** | > 3 | Auto-Alert | P1 |
| **Audit Hash Mismatch** | Jedes | Incident Response | P1 (Critical) |
| **DSFA-Score Drift** | > 2 Punkte | Re-Review Trigger | P1 |
| **API-Latenz** | > 5s | Alarm | P2 |
| **Serverlast** | > 80% | Alarm | P2 |
| **Speicherprobleme** | > 90% | Alarm | P2 |
| **Queue-Stau** | > 100 Tasks | Alarm | P2 |
| **Prompt-Änderung** | Jede | Lock & Re-Approval | P1 |
| **Parameter-Änderung** | Jede | Lock & Re-Approval | P1 |
| **Kontextfehler** | > 10% | Alarm | P2 |

---

## 7. Monitoring-Dashboard (Admin-UI)

### **7.1 Anzeigen**

| Dashboard-Panel | Beschreibung | Frequenz | Route |
|----------------|--------------|----------|-------|
| **Risk Heatmap** | Visualisierung aller Risiken | Real-Time | `/admin/compliance/dsgvo/monitoring/risk` |
| **Sensitive-Data-Heatmap** | PD-Exposure Visualisierung | Real-Time | `/admin/compliance/dsgvo/monitoring/privacy` |
| **Freigabe-Status** | Status aller Freigaben | Real-Time | `/admin/compliance/dsgvo/approvals` |
| **Maßnahmen-Status** | Implementierungsstatus | Täglich | `/admin/compliance/dsgvo/measures` |
| **Audit-Log Timeline** | Chronologische Audit-Events | Real-Time | `/admin/compliance/dsgvo/audit` |
| **Provider-Monitoring** | OpenAI, externe APIs | Real-Time | `/admin/compliance/dsgvo/monitoring/providers` |
| **Queue Status** | Async-Queue-Überwachung | Real-Time | `/admin/orchestrator/queue` |
| **Kosten-Grafik** | Kostenentwicklung | Täglich | `/admin/compliance/dsgvo/monitoring/costs` |
| **PD-Exposure Events** | Personenbezogene Daten-Events | Real-Time | `/admin/compliance/dsgvo/monitoring/pd-events` |

### **7.2 Alerts**

| Alert-Typ | Beschreibung | Priorität | Route |
|-----------|--------------|-----------|-------|
| **High-Risk** | High-Risk Events erkannt | P1 | `/admin/compliance/dsgvo/alerts` |
| **Critical** | Critical Events erkannt | P1 (Critical) | `/admin/compliance/dsgvo/alerts` |
| **DSFA Re-Review fällig** | Re-Review erforderlich | P1 | `/admin/compliance/dsgvo/reviews` |
| **Provider Update** | Provider-Modell-Update | P1 | `/admin/compliance/dsgvo/alerts` |
| **Audit Mismatch** | Audit-Hash-Verletzung | P1 (Critical) | `/admin/compliance/dsgvo/alerts` |
| **Unzulässige Datenverarbeitung** | PD-Verarbeitung ohne Rechtsgrundlage | P1 (Critical) | `/admin/compliance/dsgvo/alerts` |

---

## 8. Incident Response (Security & DSGVO)

Bei kritischen Events wird folgender Prozess automatisch ausgelöst:

### **8.1 Incident Response Prozess**

1. **Sofortige Sperre des Use-Cases**
   - Status: `locked – incident response required`
   - Automatische Blockierung aller betroffenen Funktionen

2. **Benachrichtigungen**
   - DSFA-Verantwortlicher wird informiert (E-Mail + Dashboard-Alert)
   - Datenschutzbeauftragter wird informiert (E-Mail + Dashboard-Alert)
   - Systemarchitekt wird informiert (E-Mail + Dashboard-Alert)

3. **Incident dokumentieren**
   - Incident-Report erstellen
   - Audit-Log: `INCIDENT_DETECTED`
   - Hash generieren (SHA-256)

4. **Maßnahmen anwenden**
   - Sofortmaßnahmen (automatisch)
   - Korrekturmaßnahmen (manuell)
   - Präventivmaßnahmen (manuell)

5. **Re-Approval nach P5-Prozess**
   - Vollständiger Freigabeprozess (P5.5)
   - Neue DSFA-Dokumentation erforderlich

### **8.2 Kritische Events**

| Event | Beschreibung | Response-Zeit |
|-------|--------------|---------------|
| **PD-Exposure** | Unzulässige PD-Verarbeitung | Sofort (< 1 Minute) |
| **Audit Hash Mismatch** | Audit-Hash-Verletzung | Sofort (< 1 Minute) |
| **Personen ohne Freigabe** | Personenerkennung ohne Admin-Freigabe | Sofort (< 1 Minute) |
| **Unberechtigter Zugriff** | RBAC/ABAC-Verletzung | Sofort (< 1 Minute) |
| **Provider-Sicherheitsvorfall** | OpenAI Security Incident | Innerhalb 1 Stunde |
| **Kostenexplosion** | > 30% Kostenanstieg | Innerhalb 1 Stunde |

---

## 9. Review-Zyklen

| Risk Level | Review-Frequenz | Nächstes Review | Verantwortlich |
|------------|-----------------|-----------------|----------------|
| **Critical** | Alle 3 Monate | 27.02.2026 | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **High** | Alle 6 Monate | 27.05.2026 | DSFA-Verantwortlicher + Datenschutzbeauftragter |
| **Medium** | Alle 12 Monate | 27.11.2026 | DSFA-Verantwortlicher |
| **Low** | Alle 24 Monate | 27.11.2027 | DSFA-Verantwortlicher |

**Auslöser für außerplanmäßige Reviews:**
- Automatische Trigger (siehe Abschnitt 5)
- Systemänderungen
- Vorfälle
- Gesetzesänderungen

---

## 10. Reports

System generiert automatisch:

### **10.1 DSFA-Re-Review Report**

- **Frequenz:** Bei automatischen Triggern
- **Inhalt:** Risikobewertung, Maßnahmen-Status, Freigabe-Status
- **Format:** PDF + JSON
- **Speicherung:** `docs/COMPLIANCE/DSGVO/PDF/reviews/`

### **10.2 Monthly Privacy Compliance Report**

- **Frequenz:** Monatlich
- **Inhalt:** PD-Exposure, Consent-Statistiken, Audit-Events
- **Format:** PDF + JSON
- **Speicherung:** `data/reports/dsgvo/monthly/YYYY-MM.json`

### **10.3 Quarterly Audit Report**

- **Frequenz:** Quartalsweise
- **Inhalt:** Vollständige Audit-Übersicht, Anomalien, Compliance-Status
- **Format:** PDF + JSON
- **Speicherung:** `data/reports/dsgvo/quarterly/YYYY-QX.json`

### **10.4 Annual Risk Assessment Report**

- **Frequenz:** Jährlich
- **Inhalt:** Vollständige Risikobewertung, Maßnahmen-Status, Review-Zyklen
- **Format:** PDF + JSON
- **Speicherung:** `data/reports/dsgvo/annual/YYYY.json`

---

## 11. Integration mit bestehenden Systemen

### **11.1 DSGVO Monitoring-Service**

- Integration mit `src/lib/dsgvo/monitoring-service.ts`
- Erweiterung um P6-Monitoring-Funktionen
- API-Endpoints: `/api/dsgvo/monitoring/p6/*`

### **11.2 KI-Orchestrator**

- Integration mit `src/lib/ki-orchestrator/OrchestratorCore.ts`
- Monitoring-Events: `ORCH_MONITORING_*`
- Dashboard-Integration: `/admin/orchestrator/monitoring`

### **11.3 Audit-Log-System**

- Integration mit `src/lib/dsgvo/audit-logger.ts`
- Neue Events: `MONITORING_*`, `INCIDENT_*`, `REVIEW_*`
- Dashboard-Integration: `/admin/compliance/dsgvo/audit`

### **11.4 Re-Review-Prozess**

- Integration mit `P6-RISK-REVIEW-PROZESS.md`
- Automatische Trigger → Re-Review-Prozess
- Re-Review-Berichte → Compliance-Register

---

## 12. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiger Monitoring-Plan

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

*Generated by Enterprise++ DSGVO Monitoring Plan System*  
*Last updated: 2025-11-27*  
*Status: 📋 AKTIV – AUSSTEHEND (Manual Approval erforderlich)*

