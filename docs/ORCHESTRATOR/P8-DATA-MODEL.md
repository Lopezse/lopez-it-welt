# P8-DATA-MODEL

## Orchestrator Level 2 – Datenmodell (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert das **vollständige Datenmodell** für Orchestrator Level 2, einschließlich JSON-Modelle, Tabellenstruktur, Event-Historie und Logs.

**Basis:**
- **Orchestrator Level 1** (bestehend)
- **Enterprise++ Standards**
- **DSGVO/DSFA Anforderungen** (P5–P7)

---

## 2. Datenbank-Tabellen

### **2.1 Tabelle: orchestrator_triggers**

**Beschreibung:** Speichert alle Trigger-Definitionen

```sql
CREATE TABLE orchestrator_triggers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('event-based', 'time-based', 'data-based', 'condition-based') NOT NULL,
    event_type VARCHAR(100),
    conditions JSON,
    actions JSON NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    approval_required BOOLEAN DEFAULT FALSE,
    approval_status ENUM('not_required', 'pending', 'approved', 'rejected', 'expired', 'locked') DEFAULT 'not_required',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    INDEX idx_type (type),
    INDEX idx_enabled (enabled),
    INDEX idx_approval_status (approval_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Trigger-ID
- `name` – Trigger-Name
- `type` – Trigger-Typ
- `event_type` – Event-Typ (bei event-based)
- `conditions` – Trigger-Bedingungen (JSON)
- `actions` – Auszuführende Aktionen (JSON)
- `enabled` – Trigger aktiviert
- `approval_required` – Freigabe erforderlich
- `approval_status` – Approval-Status (P7-Integration)
- `created_at` – Erstellungsdatum
- `updated_at` – Aktualisierungsdatum
- `created_by` – Erstellt von

---

### **2.2 Tabelle: orchestrator_workflows**

**Beschreibung:** Speichert alle Workflow-Definitionen

```sql
CREATE TABLE orchestrator_workflows (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSON NOT NULL,
    status ENUM('draft', 'active', 'paused', 'completed', 'failed', 'cancelled', 'archived') DEFAULT 'draft',
    approval_required BOOLEAN DEFAULT FALSE,
    approval_status ENUM('not_required', 'pending', 'approved', 'rejected', 'expired', 'locked') DEFAULT 'not_required',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    INDEX idx_status (status),
    INDEX idx_approval_status (approval_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Workflow-ID
- `name` – Workflow-Name
- `description` – Workflow-Beschreibung
- `steps` – Workflow-Schritte (JSON)
- `status` – Workflow-Status
- `approval_required` – Freigabe erforderlich
- `approval_status` – Approval-Status (P7-Integration)
- `created_at` – Erstellungsdatum
- `updated_at` – Aktualisierungsdatum
- `created_by` – Erstellt von

---

### **2.3 Tabelle: orchestrator_workflow_executions**

**Beschreibung:** Speichert alle Workflow-Ausführungen

```sql
CREATE TABLE orchestrator_workflow_executions (
    id VARCHAR(255) PRIMARY KEY,
    workflow_id VARCHAR(255) NOT NULL,
    execution_id VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('pending', 'active', 'paused', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    current_step VARCHAR(255),
    payload JSON,
    result JSON,
    error TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_workflow_id (workflow_id),
    INDEX idx_execution_id (execution_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at),
    FOREIGN KEY (workflow_id) REFERENCES orchestrator_workflows(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Execution-ID
- `workflow_id` – Workflow-ID (FK)
- `execution_id` – Eindeutige Execution-ID
- `status` – Execution-Status
- `current_step` – Aktueller Schritt
- `payload` – Eingabe-Daten (JSON)
- `result` – Ergebnis-Daten (JSON)
- `error` – Fehler-Meldung
- `started_at` – Start-Zeitpunkt
- `completed_at` – Abschluss-Zeitpunkt
- `created_at` – Erstellungsdatum
- `updated_at` – Aktualisierungsdatum

---

### **2.4 Tabelle: orchestrator_events**

**Beschreibung:** Speichert alle Orchestrator-Events

```sql
CREATE TABLE orchestrator_events (
    id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSON,
    audit_hash VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Event-ID
- `event_type` – Event-Typ
- `resource_type` – Resource-Typ
- `resource_id` – Resource-ID
- `details` – Event-Details (JSON)
- `audit_hash` – Audit-Hash (SHA-256)
- `timestamp` – Zeitstempel

---

### **2.5 Tabelle: orchestrator_automation_status**

**Beschreibung:** Speichert Automation-Status pro Use-Case

```sql
CREATE TABLE orchestrator_automation_status (
    id VARCHAR(255) PRIMARY KEY,
    use_case VARCHAR(100) NOT NULL UNIQUE,
    automation_enabled BOOLEAN DEFAULT FALSE,
    triggers_count INT DEFAULT 0,
    workflows_count INT DEFAULT 0,
    last_trigger_fired_at TIMESTAMP,
    last_workflow_started_at TIMESTAMP,
    enabled_at TIMESTAMP,
    disabled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_use_case (use_case),
    INDEX idx_automation_enabled (automation_enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Status-ID
- `use_case` – Use-Case-Name
- `automation_enabled` – Automation aktiviert
- `triggers_count` – Anzahl aktiver Trigger
- `workflows_count` – Anzahl aktiver Workflows
- `last_trigger_fired_at` – Letzter Trigger-Auslösung
- `last_workflow_started_at` – Letzter Workflow-Start
- `enabled_at` – Aktivierungs-Zeitpunkt
- `disabled_at` – Deaktivierungs-Zeitpunkt
- `created_at` – Erstellungsdatum
- `updated_at` – Aktualisierungsdatum

---

### **2.6 Tabelle: orchestrator_approval_requests**

**Beschreibung:** Speichert Approval-Requests (P7-Integration)

```sql
CREATE TABLE orchestrator_approval_requests (
    id VARCHAR(255) PRIMARY KEY,
    use_case VARCHAR(100) NOT NULL,
    request_type ENUM('initial', 're_approval') DEFAULT 'initial',
    reason TEXT,
    change_type VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    requested_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_use_case (use_case),
    INDEX idx_status (status),
    INDEX idx_requested_by (requested_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Felder:**
- `id` – Eindeutige Request-ID
- `use_case` – Use-Case-Name
- `request_type` – Request-Typ
- `reason` – Begründung
- `change_type` – Änderungs-Typ
- `status` – Request-Status
- `requested_by` – Angefragt von
- `approved_by` – Freigegeben von
- `approved_at` – Freigabe-Zeitpunkt
- `expires_at` – Ablauf-Zeitpunkt
- `created_at` – Erstellungsdatum
- `updated_at` – Aktualisierungsdatum

---

## 3. JSON-Modelle

### **3.1 Trigger-Modell (JSON)**

```json
{
  "id": "trigger-001",
  "name": "Media-Upload-Automation",
  "type": "event-based",
  "event_type": "TASK_COMPLETED",
  "conditions": {
    "agent": "media-ai-agent",
    "status": "completed",
    "has_person": true
  },
  "actions": [
    {
      "type": "create_task",
      "agent": "compliance-agent",
      "purpose": "audit-review",
      "priority": "high"
    }
  ],
  "enabled": true,
  "approval_required": true,
  "approval_status": "approved",
  "created_at": "2025-11-27T12:00:00Z",
  "updated_at": "2025-11-27T12:00:00Z",
  "created_by": "admin-user"
}
```

---

### **3.2 Workflow-Modell (JSON)**

```json
{
  "id": "workflow-001",
  "name": "Media-KI-Automation-Workflow",
  "description": "Vollständiger Media-KI-Automation-Workflow",
  "steps": [
    {
      "id": "step-1",
      "name": "DSGVO-Prüfung",
      "agent": "dsgvo-decision-engine",
      "purpose": "consent-check",
      "on_success": "step-2",
      "on_failure": "step-error",
      "timeout": 30,
      "retry_count": 3
    },
    {
      "id": "step-2",
      "name": "Media-Analyse",
      "agent": "media-ai-agent",
      "purpose": "image-analysis",
      "on_success": "step-3",
      "on_failure": "step-error",
      "timeout": 60,
      "retry_count": 2
    },
    {
      "id": "step-3",
      "name": "Quality-Check",
      "agent": "quality-gate",
      "purpose": "output-validation",
      "on_success": "step-4",
      "on_failure": "step-error",
      "timeout": 10,
      "retry_count": 1
    },
    {
      "id": "step-4",
      "name": "Audit-Log",
      "agent": "audit-manager",
      "purpose": "log-completion",
      "on_success": "workflow-completed",
      "on_failure": "step-error",
      "timeout": 5,
      "retry_count": 1
    }
  ],
  "status": "active",
  "approval_required": true,
  "approval_status": "approved",
  "created_at": "2025-11-27T12:00:00Z",
  "updated_at": "2025-11-27T12:00:00Z",
  "created_by": "admin-user"
}
```

---

### **3.3 Workflow-Execution-Modell (JSON)**

```json
{
  "id": "exec-001",
  "workflow_id": "workflow-001",
  "execution_id": "exec-2025-11-27-001",
  "status": "active",
  "current_step": "step-2",
  "payload": {
    "mediaId": "media-123",
    "userId": "user-456"
  },
  "result": {
    "step-1": {
      "status": "completed",
      "result": { "dsgvo_allowed": true }
    },
    "step-2": {
      "status": "processing",
      "result": null
    }
  },
  "error": null,
  "started_at": "2025-11-27T13:00:00Z",
  "completed_at": null,
  "created_at": "2025-11-27T13:00:00Z",
  "updated_at": "2025-11-27T13:05:00Z"
}
```

---

### **3.4 Event-Modell (JSON)**

```json
{
  "id": "event-001",
  "event_type": "TASK_COMPLETED",
  "resource_type": "task",
  "resource_id": "task-123",
  "details": {
    "agent": "media-ai-agent",
    "status": "completed",
    "quality_score": 85,
    "has_person": false,
    "execution_time_ms": 1250
  },
  "audit_hash": "sha256:abc123...",
  "timestamp": "2025-11-27T13:00:00Z"
}
```

---

### **3.5 Automation-Status-Modell (JSON)**

```json
{
  "id": "status-001",
  "use_case": "media-ki",
  "automation_enabled": true,
  "triggers_count": 3,
  "workflows_count": 2,
  "last_trigger_fired_at": "2025-11-27T13:00:00Z",
  "last_workflow_started_at": "2025-11-27T12:55:00Z",
  "enabled_at": "2025-11-27T10:00:00Z",
  "disabled_at": null,
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T13:00:00Z"
}
```

---

### **3.6 Approval-Request-Modell (JSON)**

```json
{
  "id": "approval-request-001",
  "use_case": "media-ki",
  "request_type": "re_approval",
  "reason": "System-Änderung erkannt: OpenAI-Modell aktualisiert",
  "change_type": "model_update",
  "status": "pending",
  "requested_by": "system",
  "approved_by": null,
  "approved_at": null,
  "expires_at": "2025-12-04T13:00:00Z",
  "created_at": "2025-11-27T13:00:00Z",
  "updated_at": "2025-11-27T13:00:00Z"
}
```

---

## 4. Event-Historie

### **4.1 Event-Typen (Erweitert)**

| Event-Typ | Beschreibung | Resource-Typ |
|-----------|--------------|--------------|
| **TRIGGER_FIRED** | Trigger ausgelöst | trigger |
| **TRIGGER_VALIDATED** | Trigger validiert | trigger |
| **TRIGGER_BLOCKED** | Trigger blockiert | trigger |
| **WORKFLOW_STARTED** | Workflow gestartet | workflow |
| **WORKFLOW_STEP_COMPLETED** | Workflow-Schritt abgeschlossen | workflow |
| **WORKFLOW_STEP_FAILED** | Workflow-Schritt fehlgeschlagen | workflow |
| **WORKFLOW_COMPLETED** | Workflow abgeschlossen | workflow |
| **WORKFLOW_FAILED** | Workflow fehlgeschlagen | workflow |
| **WORKFLOW_PAUSED** | Workflow pausiert | workflow |
| **WORKFLOW_RESUMED** | Workflow fortgesetzt | workflow |
| **AUTOMATION_ENABLED** | Automation aktiviert | automation |
| **AUTOMATION_DISABLED** | Automation deaktiviert | automation |
| **APPROVAL_REQUESTED** | Approval-Request erstellt | approval |
| **APPROVAL_GRANTED** | Approval erteilt | approval |
| **APPROVAL_REJECTED** | Approval abgelehnt | approval |

---

### **4.2 Event-Historie-Abfrage**

**Beispiel-Abfrage:**
```sql
SELECT 
    event_type,
    resource_type,
    resource_id,
    details,
    timestamp
FROM orchestrator_events
WHERE 
    event_type = 'WORKFLOW_STARTED'
    AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY timestamp DESC
LIMIT 100;
```

---

## 5. Logs & Audit

### **5.1 Audit-Log-Integration**

**Integration mit bestehendem Audit-System:**
- Tabelle: `dsgvo_audit_events` (bestehend)
- Event-Präfix: `ORCH_*`
- Vollständige Hash-Generierung (SHA-256)

**Beispiel-Audit-Events:**
- `ORCH_TRIGGER_FIRED`
- `ORCH_WORKFLOW_STARTED`
- `ORCH_AUTOMATION_ENABLED`
- `ORCH_APPROVAL_REQUESTED`

---

### **5.2 Log-Retention**

| Log-Typ | Retention |
|---------|-----------|
| **Events** | 90 Tage |
| **Workflow-Executions** | 180 Tage |
| **Audit-Logs** | Unbegrenzt (DSGVO) |
| **Approval-Requests** | Unbegrenzt (DSGVO) |

---

## 6. Datenmodell-Erweiterungen

### **6.1 Erweiterte Task-Modelle (Level 2)**

**Task-Modell (erweitert):**
```typescript
interface OrchestratorTaskLevel2 extends OrchestratorTask {
  workflow_id?: string;
  execution_id?: string;
  step_id?: string;
  priority_score?: number;
  deadline?: string;
  retry_count?: number;
  max_retries?: number;
}
```

---

### **6.2 Priority-Score-Modell**

**Priority-Score-Berechnung:**
```json
{
  "base_priority": 50,
  "context_bonus": 10,
  "risk_penalty": -5,
  "time_bonus": 5,
  "final_priority": 60
}
```

---

## 7. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiges Datenmodell

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





