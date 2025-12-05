# P8-API-SPEC

## Orchestrator Level 2 – API-Spezifikation (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **API-Endpoints** für Orchestrator Level 2 (Automation, Trigger, Workflow-Status, Events).

**Basis:**
- **Orchestrator Level 1 APIs** (bestehend)
- **Enterprise++ Standards**
- **DSGVO/DSFA Anforderungen** (P5–P7)

---

## 2. API-Übersicht

### **2.1 API-Kategorien**

| Kategorie | Beschreibung | Anzahl Endpoints |
|-----------|--------------|------------------|
| **Trigger-APIs** | Trigger-Management | 5 |
| **Workflow-APIs** | Workflow-Management | 6 |
| **Automation-APIs** | Automation-Steuerung | 4 |
| **Event-APIs** | Event-Management | 3 |
| **Status-APIs** | Status-Abfragen | 4 |
| **Approval-APIs** | P7-Integration | 3 |

---

## 3. Trigger-APIs

### **3.1 POST /api/orchestrator/triggers**

**Beschreibung:** Neuen Trigger erstellen

**Request Body:**
```json
{
  "name": "Media-Upload-Automation",
  "type": "event-based",
  "event_type": "TASK_COMPLETED",
  "conditions": {
    "agent": "media-ai-agent",
    "status": "completed"
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
  "approval_required": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "trigger-001",
    "name": "Media-Upload-Automation",
    "status": "active",
    "created_at": "2025-11-27T12:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

### **3.2 GET /api/orchestrator/triggers**

**Beschreibung:** Liste aller Trigger abrufen

**Query Parameters:**
- `enabled` (boolean, optional) – Nur aktive Trigger
- `type` (string, optional) – Trigger-Typ filtern
- `limit` (number, optional) – Anzahl limitieren
- `offset` (number, optional) – Offset für Pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "triggers": [
      {
        "id": "trigger-001",
        "name": "Media-Upload-Automation",
        "type": "event-based",
        "enabled": true,
        "created_at": "2025-11-27T12:00:00Z"
      }
    ],
    "total": 10,
    "limit": 20,
    "offset": 0
  }
}
```

**RBAC:** `orchestrator.view`

---

### **3.3 GET /api/orchestrator/triggers/[id]**

**Beschreibung:** Trigger-Detail abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "trigger-001",
    "name": "Media-Upload-Automation",
    "type": "event-based",
    "event_type": "TASK_COMPLETED",
    "conditions": { ... },
    "actions": [ ... ],
    "enabled": true,
    "approval_required": true,
    "created_at": "2025-11-27T12:00:00Z",
    "updated_at": "2025-11-27T12:00:00Z"
  }
}
```

**RBAC:** `orchestrator.view`

---

### **3.4 PUT /api/orchestrator/triggers/[id]**

**Beschreibung:** Trigger aktualisieren

**Request Body:**
```json
{
  "name": "Media-Upload-Automation (Updated)",
  "enabled": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "trigger-001",
    "updated_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

**Hinweis:** Änderungen erfordern Re-Approval (P7), wenn `approval_required == true`

---

### **3.5 DELETE /api/orchestrator/triggers/[id]**

**Beschreibung:** Trigger löschen

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "trigger-001",
    "deleted_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

**Hinweis:** Löschung erfordert Re-Approval (P7), wenn Trigger aktiv war

---

## 4. Workflow-APIs

### **4.1 POST /api/orchestrator/workflows**

**Beschreibung:** Neuen Workflow erstellen

**Request Body:**
```json
{
  "name": "Media-KI-Automation-Workflow",
  "description": "Vollständiger Media-KI-Automation-Workflow",
  "steps": [
    {
      "id": "step-1",
      "name": "DSGVO-Prüfung",
      "agent": "dsgvo-decision-engine",
      "purpose": "consent-check",
      "on_success": "step-2",
      "on_failure": "step-error"
    },
    {
      "id": "step-2",
      "name": "Media-Analyse",
      "agent": "media-ai-agent",
      "purpose": "image-analysis",
      "on_success": "step-3",
      "on_failure": "step-error"
    }
  ],
  "approval_required": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "workflow-001",
    "name": "Media-KI-Automation-Workflow",
    "status": "draft",
    "created_at": "2025-11-27T12:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

### **4.2 GET /api/orchestrator/workflows**

**Beschreibung:** Liste aller Workflows abrufen

**Query Parameters:**
- `status` (string, optional) – Status filtern
- `limit` (number, optional) – Anzahl limitieren
- `offset` (number, optional) – Offset für Pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "workflows": [
      {
        "id": "workflow-001",
        "name": "Media-KI-Automation-Workflow",
        "status": "active",
        "created_at": "2025-11-27T12:00:00Z"
      }
    ],
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

**RBAC:** `orchestrator.view`

---

### **4.3 GET /api/orchestrator/workflows/[id]**

**Beschreibung:** Workflow-Detail abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "workflow-001",
    "name": "Media-KI-Automation-Workflow",
    "description": "...",
    "steps": [ ... ],
    "status": "active",
    "current_step": "step-2",
    "created_at": "2025-11-27T12:00:00Z",
    "updated_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.view`

---

### **4.4 POST /api/orchestrator/workflows/[id]/start**

**Beschreibung:** Workflow starten

**Request Body:**
```json
{
  "payload": {
    "mediaId": "media-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow_id": "workflow-001",
    "execution_id": "exec-001",
    "status": "active",
    "started_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

### **4.5 POST /api/orchestrator/workflows/[id]/pause**

**Beschreibung:** Workflow pausieren

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow_id": "workflow-001",
    "execution_id": "exec-001",
    "status": "paused",
    "paused_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

### **4.6 POST /api/orchestrator/workflows/[id]/resume**

**Beschreibung:** Workflow fortsetzen

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow_id": "workflow-001",
    "execution_id": "exec-001",
    "status": "active",
    "resumed_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

## 5. Automation-APIs

### **5.1 POST /api/orchestrator/automation/enable**

**Beschreibung:** Automation aktivieren

**Request Body:**
```json
{
  "use_case": "media-ki",
  "automation_type": "full"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "use_case": "media-ki",
    "automation_enabled": true,
    "enabled_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

**Hinweis:** Erfordert Approval (P7), wenn Use-Case High/Critical-Risk ist

---

### **5.2 POST /api/orchestrator/automation/disable**

**Beschreibung:** Automation deaktivieren

**Request Body:**
```json
{
  "use_case": "media-ki"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "use_case": "media-ki",
    "automation_enabled": false,
    "disabled_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

---

### **5.3 GET /api/orchestrator/automation/status**

**Beschreibung:** Automation-Status abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "automation_enabled": true,
    "use_cases": [
      {
        "use_case": "media-ki",
        "automation_enabled": true,
        "triggers_count": 3,
        "workflows_count": 2
      }
    ],
    "last_updated": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.view`

---

### **5.4 GET /api/orchestrator/automation/stats**

**Beschreibung:** Automation-Statistiken abrufen

**Query Parameters:**
- `period` (string, optional) – Zeitraum (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "day",
    "triggers_fired": 150,
    "workflows_started": 45,
    "workflows_completed": 42,
    "workflows_failed": 3,
    "automation_success_rate": 93.3,
    "last_updated": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.view`

---

## 6. Event-APIs

### **6.1 GET /api/orchestrator/events**

**Beschreibung:** Liste aller Events abrufen

**Query Parameters:**
- `event_type` (string, optional) – Event-Typ filtern
- `start_date` (datetime, optional) – Start-Datum
- `end_date` (datetime, optional) – End-Datum
- `limit` (number, optional) – Anzahl limitieren
- `offset` (number, optional) – Offset für Pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event-001",
        "type": "TASK_COMPLETED",
        "resource_type": "task",
        "resource_id": "task-123",
        "timestamp": "2025-11-27T13:00:00Z",
        "details": { ... }
      }
    ],
    "total": 1000,
    "limit": 20,
    "offset": 0
  }
}
```

**RBAC:** `orchestrator.view`

---

### **6.2 GET /api/orchestrator/events/[id]**

**Beschreibung:** Event-Detail abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event-001",
    "type": "TASK_COMPLETED",
    "resource_type": "task",
    "resource_id": "task-123",
    "timestamp": "2025-11-27T13:00:00Z",
    "details": {
      "agent": "media-ai-agent",
      "status": "completed",
      "quality_score": 85
    },
    "audit_hash": "sha256:..."
  }
}
```

**RBAC:** `orchestrator.view`

---

### **6.3 POST /api/orchestrator/events**

**Beschreibung:** Event manuell erstellen (für Testing)

**Request Body:**
```json
{
  "type": "TASK_COMPLETED",
  "resource_type": "task",
  "resource_id": "task-123",
  "details": {
    "agent": "media-ai-agent",
    "status": "completed"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event-001",
    "type": "TASK_COMPLETED",
    "created_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

**Hinweis:** Nur für Testing, nicht für Produktion

---

## 7. Status-APIs

### **7.1 GET /api/orchestrator/status**

**Beschreibung:** Gesamt-Status abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "orchestrator_level": 2,
    "automation_enabled": true,
    "triggers_active": 10,
    "workflows_active": 5,
    "queue_status": {
      "waiting": 5,
      "active": 3,
      "completed": 100,
      "failed": 2
    },
    "last_updated": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.view`

---

### **7.2 GET /api/orchestrator/status/triggers**

**Beschreibung:** Trigger-Status abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "total_triggers": 10,
    "active_triggers": 8,
    "disabled_triggers": 2,
    "triggers_fired_today": 150,
    "triggers_by_type": {
      "event-based": 6,
      "time-based": 3,
      "data-based": 1
    }
  }
}
```

**RBAC:** `orchestrator.view`

---

### **7.3 GET /api/orchestrator/status/workflows**

**Beschreibung:** Workflow-Status abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "total_workflows": 5,
    "active_workflows": 3,
    "paused_workflows": 1,
    "completed_workflows": 1,
    "workflows_started_today": 45,
    "workflows_completed_today": 42,
    "workflows_failed_today": 3
  }
}
```

**RBAC:** `orchestrator.view`

---

### **7.4 GET /api/orchestrator/status/queue**

**Beschreibung:** Queue-Status abrufen (erweitert)

**Response:**
```json
{
  "success": true,
  "data": {
    "queue_enabled": true,
    "queues": {
      "critical": { "waiting": 0, "active": 1, "completed": 10 },
      "high": { "waiting": 2, "active": 1, "completed": 50 },
      "medium": { "waiting": 3, "active": 1, "completed": 30 },
      "low": { "waiting": 0, "active": 0, "completed": 10 },
      "background": { "waiting": 0, "active": 0, "completed": 0 }
    },
    "total_waiting": 5,
    "total_active": 3,
    "total_completed": 100,
    "total_failed": 2
  }
}
```

**RBAC:** `orchestrator.view`

---

## 8. Approval-APIs (P7-Integration)

### **8.1 GET /api/orchestrator/approvals/status**

**Beschreibung:** Approval-Status für Use-Cases abrufen

**Response:**
```json
{
  "success": true,
  "data": {
    "use_cases": [
      {
        "use_case": "media-ki",
        "approval_status": "approved",
        "approval_date": "2025-11-27T12:00:00Z",
        "approved_by": ["dsfa-verantwortlicher", "datenschutzbeauftragter"],
        "expires_at": "2026-05-27T12:00:00Z"
      }
    ]
  }
}
```

**RBAC:** `orchestrator.view`

---

### **8.2 POST /api/orchestrator/approvals/check**

**Beschreibung:** Approval-Status für Use-Case prüfen

**Request Body:**
```json
{
  "use_case": "media-ki"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "use_case": "media-ki",
    "approval_status": "approved",
    "can_execute": true,
    "reason": "Approval vorhanden und gültig"
  }
}
```

**RBAC:** `orchestrator.view`

---

### **8.3 POST /api/orchestrator/approvals/request**

**Beschreibung:** Approval-Request erstellen (automatisch)

**Request Body:**
```json
{
  "use_case": "media-ki",
  "reason": "System-Änderung erkannt",
  "change_type": "model_update"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "approval_request_id": "approval-request-001",
    "use_case": "media-ki",
    "status": "pending",
    "created_at": "2025-11-27T13:00:00Z"
  }
}
```

**RBAC:** `orchestrator.manage`

**Hinweis:** Automatisch bei System-Änderungen

---

## 9. API-Standards

### **9.1 Authentifizierung**

- **Header:** `Authorization: Bearer <token>`
- **RBAC:** Rollenbasierte Zugriffskontrolle erforderlich

### **9.2 Fehlerbehandlung**

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ORCH_ERROR_CODE",
    "message": "Fehlerbeschreibung",
    "details": { ... }
  }
}
```

**Error Codes:**
- `ORCH_UNAUTHORIZED` (401) – Nicht authentifiziert
- `ORCH_FORBIDDEN` (403) – Keine Berechtigung
- `ORCH_NOT_FOUND` (404) – Resource nicht gefunden
- `ORCH_VALIDATION_ERROR` (400) – Validierungsfehler
- `ORCH_APPROVAL_REQUIRED` (403) – Approval erforderlich
- `ORCH_DSGVO_BLOCKED` (403) – DSGVO-Blocker
- `ORCH_INTERNAL_ERROR` (500) – Interner Fehler

### **9.3 Rate Limiting**

- **Standard:** 100 Requests pro Minute
- **Admin:** 1000 Requests pro Minute
- **Header:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### **9.4 Pagination**

- **Standard:** `limit=20`, `offset=0`
- **Max Limit:** 100
- **Response:** `total`, `limit`, `offset`

---

## 10. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige API-Spezifikation

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





