# P8-WORKFLOWS

## Orchestrator Level 2 – Workflow-Definitionen (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **Automations-Workflows** für Orchestrator Level 2 als ASCII-Diagramme.

**Format:** Freigabe → Trigger → Event → Action → Audit

**Basis:**
- **Orchestrator Level 1** (bestehend)
- **P5–P7 DSGVO/DSFA Systeme**
- **Enterprise++ Standards**

---

## 2. Workflow-Kategorien

### **2.1 Kategorien**

| Kategorie | Beschreibung | Anzahl Workflows |
|-----------|--------------|------------------|
| **Media-KI Automation** | Automatische Media-KI-Verarbeitung | 3 |
| **Content-Automation** | Automatische Content-Generierung | 2 |
| **Compliance-Automation** | Automatische Compliance-Prüfungen | 2 |
| **Approval-Automation** | Automatische Approval-Requests | 2 |
| **Monitoring-Automation** | Automatische Monitoring-Reaktionen | 2 |
| **Maintenance-Automation** | Automatische Wartungs-Tasks | 1 |

---

## 3. Media-KI Automation Workflows

### **3.1 Workflow: Media-Upload-Automation**

**Beschreibung:** Automatische Media-KI-Verarbeitung bei Upload

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER: MEDIA UPLOADED                   │
│  Event: media.uploaded                                      │
│  Condition: mediaId exists                                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: APPROVAL-STATUS PRÜFEN                   │
│  ApprovalManager.checkApprovalStatus(mediaId)                │
│  Status: approved / pending / rejected / locked              │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Approval-Status │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   approved                                  pending/rejected/locked
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 2:          │              │ BLOCK & NOTIFY              │
│ DSGVO-PRÜFUNG    │              │ Status: blocked             │
│ Decision Engine  │              │ Notification: Admin         │
│ checkConsent()   │              │ Audit: APPROVAL_BLOCKED     │
└────────┬─────────┘              └──────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: MEDIA-KI ANALYSE                        │
│  Agent: media-ai-agent                                       │
│  Purpose: image-analysis                                     │
│  Priority: medium                                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: QUALITY-GATE PRÜFUNG                    │
│  QualityGate.evaluateOutputQuality()                         │
│  Score ≥ 70?                                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Quality-Score?   │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   Score ≥ 70                                Score < 70
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 5:          │              │ STEP 5:                     │
│ HAS_PERSON?     │              │ FLAG AS LOW-QUALITY          │
│ Check Flag      │              │ Status: completed (low-quality)│
└────────┬────────┘              │ Audit: QUALITY_BELOW_THRESHOLD│
         │                       └──────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 6: PERSONEN-ERKENNUNG?                     │
│  has_person == true?                                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ has_person?     │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
      true                                      false
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 7:          │              │ STEP 7:                      │
│ ADMIN-FREIGABE   │              │ COMPLETED                    │
│ Status: pending  │              │ Status: completed            │
│ Notification     │              │ Audit: TASK_COMPLETED        │
│ Audit:           │              └──────────────────────────────┘
│ PERSON_DETECTED  │
└──────────────────┘
```

**Audit-Events:**
- `MEDIA_UPLOADED`
- `APPROVAL_CHECKED`
- `DSGVO_CHECKED`
- `MEDIA_KI_ANALYSIS_STARTED`
- `QUALITY_GATE_CHECKED`
- `PERSON_DETECTED` (wenn `has_person == true`)
- `TASK_COMPLETED`

---

### **3.2 Workflow: Person-Detection-Automation**

**Beschreibung:** Automatische Reaktion bei Personenerkennung

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: PERSON DETECTED                       │
│  Event: person.detected                                     │
│  Condition: has_person == true AND approval_status == "pending"│
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: HIGH-RISK FLOW AKTIVIEREN              │
│  Status: locked                                             │
│  Priority: high                                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: ADMIN-BENACHRICHTIGUNG                  │
│  Notification: E-Mail + Dashboard-Alert                      │
│  Message: "Person erkannt, Freigabe erforderlich"           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: APPROVAL-REQUEST ERSTELLEN              │
│  ApprovalManager.createApprovalRequest()                     │
│  Type: manual_approval                                       │
│  Status: pending                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: AUDIT-LOG                               │
│  Event: PERSON_DETECTED_AWAITING_APPROVAL                   │
│  Hash: SHA-256                                               │
└─────────────────────────────────────────────────────────────┘
```

**Audit-Events:**
- `PERSON_DETECTED`
- `HIGH_RISK_FLOW_ACTIVATED`
- `ADMIN_NOTIFICATION_SENT`
- `APPROVAL_REQUEST_CREATED`
- `AUDIT_LOG_CREATED`

---

### **3.3 Workflow: Media-Quality-Automation**

**Beschreibung:** Automatische Quality-Check-Automation

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: MEDIA ANALYSIS COMPLETED               │
│  Event: media.analysis.completed                             │
│  Condition: qualityScore < 70                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: QUALITY-FLAG SETZEN                    │
│  Flag: quality_issue = true                                  │
│  Status: completed (low-quality)                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: ADMIN-BENACHRICHTIGUNG                 │
│  Notification: "Media-Qualität unter Schwellwert"           │
│  Priority: medium                                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: AUDIT-LOG                               │
│  Event: QUALITY_BELOW_THRESHOLD                              │
│  Details: qualityScore, mediaId                              │
└─────────────────────────────────────────────────────────────┘
```

**Audit-Events:**
- `MEDIA_ANALYSIS_COMPLETED`
- `QUALITY_ISSUE_DETECTED`
- `ADMIN_NOTIFICATION_SENT`
- `AUDIT_LOG_CREATED`

---

## 4. Content-Automation Workflows

### **4.1 Workflow: Content-Generation-Automation**

**Beschreibung:** Automatische Content-Generierung

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: CONTENT REQUEST                        │
│  Event: content.requested                                   │
│  Condition: contentType, language, context                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: APPROVAL-STATUS PRÜFEN                   │
│  ApprovalManager.checkApprovalStatus("content-agent")        │
│  Status: approved / pending / rejected                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Approval-Status │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   approved                                  pending/rejected
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 2:          │              │ BLOCK & NOTIFY               │
│ DSGVO-PRÜFUNG    │              │ Status: blocked               │
│ Decision Engine  │              │ Audit: APPROVAL_BLOCKED     │
│ checkConsent()   │              └──────────────────────────────┘
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: INPUT-SANITIZATION                     │
│  Sanitize: Remove PD, Sensitive Data                          │
│  Context: Sanitized Context                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: CONTENT-GENERIERUNG                    │
│  Agent: content-agent                                       │
│  Purpose: text-generation                                   │
│  Provider: OpenAI GPT-4                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 5: OUTPUT-VALIDIERUNG                     │
│  QualityGate.evaluateOutputQuality()                         │
│  PD-Check: Keine PD im Output?                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Output-Valid?   │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
      valid                                    invalid
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 6:          │              │ STEP 6:                      │
│ COMPLETED        │              │ FLAG AS INVALID              │
│ Status: completed│              │ Status: failed               │
│ Audit:           │              │ Audit: OUTPUT_INVALID        │
│ CONTENT_GENERATED│              └──────────────────────────────┘
└──────────────────┘
```

**Audit-Events:**
- `CONTENT_REQUESTED`
- `APPROVAL_CHECKED`
- `DSGVO_CHECKED`
- `INPUT_SANITIZED`
- `CONTENT_GENERATION_STARTED`
- `OUTPUT_VALIDATED`
- `CONTENT_GENERATED`

---

## 5. Compliance-Automation Workflows

### **5.1 Workflow: Compliance-Check-Automation**

**Beschreibung:** Automatische Compliance-Prüfungen

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: SCHEDULED COMPLIANCE CHECK             │
│  Event: cron.daily                                           │
│  Condition: time == "00:00"                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: COMPLIANCE-AGENT AUSFÜHREN             │
│  Agent: compliance-agent                                    │
│  Purpose: compliance-check                                  │
│  Priority: medium                                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: ERGEBNISSE AUSWERTEN                    │
│  Pattern-Matching: Anomalien erkennen                        │
│  Compliance-Score: Berechnen                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: ANOMALIEN ERKANNT?                     │
│  Anomalies.length > 0?                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Anomalien?      │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
      yes                                       no
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 4:          │              │ STEP 4:                      │
│ ALERT SENDEN     │              │ COMPLETED                     │
│ Notification     │              │ Status: completed            │
│ Priority: high   │              │ Audit: COMPLIANCE_CHECK_OK    │
│ Audit:           │              └──────────────────────────────┘
│ ANOMALY_DETECTED │
└──────────────────┘
```

**Audit-Events:**
- `COMPLIANCE_CHECK_SCHEDULED`
- `COMPLIANCE_AGENT_STARTED`
- `COMPLIANCE_RESULTS_EVALUATED`
- `ANOMALY_DETECTED` (wenn Anomalien)
- `COMPLIANCE_CHECK_COMPLETED`

---

## 6. Approval-Automation Workflows

### **6.1 Workflow: Auto-Approval-Request**

**Beschreibung:** Automatische Approval-Requests bei Änderungen

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: SYSTEM CHANGE DETECTED                 │
│  Event: system.change.detected                              │
│  Condition: changeType IN [model, provider, parameter]       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: RE-APPROVAL ERFORDERLICH?              │
│  ApprovalManager.checkReApprovalRequired()                   │
│  Result: required / not_required                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Re-Approval?    │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
    required                                  not_required
        │                                         │
        ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────────┐
│ STEP 2:          │              │ STEP 2:                       │
│ LOCK SYSTEM      │              │ NO ACTION                     │
│ Status: locked   │              │ Status: unchanged             │
│ Audit:           │              │ Audit: NO_REAPPROVAL_NEEDED  │
│ SYSTEM_LOCKED    │              └──────────────────────────────┘
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: APPROVAL-REQUEST ERSTELLEN             │
│  ApprovalManager.createApprovalRequest()                     │
│  Type: re_approval                                            │
│  Status: pending                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: BENACHRICHTIGUNGEN                     │
│  DSFA-Verantwortlicher: E-Mail + Dashboard                   │
│  Datenschutzbeauftragter: E-Mail + Dashboard (bei High/Critical)│
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 5: AUDIT-LOG                               │
│  Event: REAPPROVAL_REQUESTED                                 │
│  Details: changeType, affectedUseCases                       │
└─────────────────────────────────────────────────────────────┘
```

**Audit-Events:**
- `SYSTEM_CHANGE_DETECTED`
- `REAPPROVAL_REQUIRED`
- `SYSTEM_LOCKED`
- `APPROVAL_REQUEST_CREATED`
- `NOTIFICATIONS_SENT`
- `AUDIT_LOG_CREATED`

---

## 7. Monitoring-Automation Workflows

### **7.1 Workflow: Risk-Drift-Automation**

**Beschreibung:** Automatische Reaktion bei Risiko-Drift

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: RISK DRIFT DETECTED                    │
│  Event: monitoring.risk_drift_detected                     │
│  Condition: dsfaScoreDelta > 2                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: RISIKO-ANALYSE                         │
│  RiskAnalyzer.analyzeRiskDrift()                             │
│  Result: riskIncrease, affectedUseCases                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: RE-REVIEW TRIGGER                      │
│  ReviewManager.triggerReReview()                             │
│  Type: automatic                                             │
│  Status: pending                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: LOCK BETROFFENE USE-CASES              │
│  ApprovalManager.lockUseCases(affectedUseCases)             │
│  Status: locked                                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: BENACHRICHTIGUNGEN                     │
│  DSFA-Verantwortlicher: E-Mail + Dashboard                   │
│  Message: "Risiko-Drift erkannt, Re-Review erforderlich"    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 5: AUDIT-LOG                               │
│  Event: RISK_DRIFT_DETECTED                                  │
│  Details: dsfaScoreDelta, affectedUseCases                  │
└─────────────────────────────────────────────────────────────┘
```

**Audit-Events:**
- `RISK_DRIFT_DETECTED`
- `RISK_ANALYSIS_COMPLETED`
- `REVIEW_TRIGGERED`
- `USE_CASES_LOCKED`
- `NOTIFICATIONS_SENT`
- `AUDIT_LOG_CREATED`

---

## 8. Maintenance-Automation Workflows

### **8.1 Workflow: Queue-Maintenance-Automation**

**Beschreibung:** Automatische Queue-Wartung

```
┌─────────────────────────────────────────────────────────────┐
│              TRIGGER: SCHEDULED MAINTENANCE                  │
│  Event: cron.nightly                                         │
│  Condition: time == "02:00"                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: QUEUE-STATUS PRÜFEN                    │
│  QueueManager.getQueueStatus()                               │
│  Metrics: waiting, active, completed, failed                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: FAILED TASKS PRÜFEN                     │
│  FailedTasks = QueueManager.getFailedTasks()                 │
│  Count: failedTasks.length                                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: CLEANUP                                 │
│  QueueManager.cleanupCompletedTasks(age > 7 days)           │
│  QueueManager.cleanupFailedTasks(age > 30 days)              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: AUDIT-LOG                               │
│  Event: QUEUE_MAINTENANCE_COMPLETED                          │
│  Details: cleanedTasks, failedTasks                         │
└─────────────────────────────────────────────────────────────┘
```

**Audit-Events:**
- `MAINTENANCE_SCHEDULED`
- `QUEUE_STATUS_CHECKED`
- `FAILED_TASKS_CHECKED`
- `QUEUE_CLEANUP_COMPLETED`
- `AUDIT_LOG_CREATED`

---

## 9. Workflow-Status-Übergänge

### **9.1 Workflow-State-Machine**

```
┌─────────┐
│  draft  │
└────┬────┘
     │ activate
     ▼
┌─────────┐
│ active  │◄──┐
└────┬────┘   │ resume
     │        │
     │ pause  │
     ▼        │
┌─────────┐   │
│ paused  │───┘
└────┬────┘
     │
     │ complete / fail / cancel
     ▼
┌─────────┐
│completed│ / │ failed │ / │ cancelled │
└─────────┘   └────────┘   └───────────┘
     │
     │ archive
     ▼
┌──────────┐
│ archived │
└──────────┘
```

---

## 10. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige Workflow-Definitionen

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





