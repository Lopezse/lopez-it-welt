# P8-C-API-SPEC

## API-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-C

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige REST-API-Spezifikation** für das Alert & Incident-Handling-System (P8-C).

**Anforderungen:**
- **REST-API** Definition für alle Endpoints
- **DSFA-Check** pro Endpoint
- **Rate-Limiting** Regeln
- **RBAC** Integration (`security.manage` / `security.view`)
- **DSGVO-Konformität** bei allen Endpoints

---

## 2. API-Standards

### **2.1 Authentifizierung**

**Methode:** JWT-Token (Bearer Token)  
**Header:** `Authorization: Bearer <token>`  
**Cookie:** `adm_session` (Alternative)

---

### **2.2 RBAC**

**Berechtigungen:**
- `security.manage` – Vollzugriff (Alerts/Incidents verwalten)
- `security.view` – Nur Lese-Zugriff (Alerts/Incidents anzeigen)

---

### **2.3 Rate-Limiting**

**Standard:** 100 Requests/Minute  
**Admin:** 1000 Requests/Minute  
**Security Officer:** 500 Requests/Minute

---

### **2.4 Fehlerbehandlung**

**Standard-Error-Response:**
```json
{
  "success": false,
  "error": "Error message",
  "error_code": "ERROR_CODE",
  "details": {}
}
```

**HTTP-Status-Codes:**
- `200` – Erfolg
- `400` – Bad Request
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not Found
- `500` – Internal Server Error

---

## 3. Alert-Endpoints

### **3.1 GET /api/orchestrator/alerts**

**Beschreibung:** Liste aller Alerts abrufen

**RBAC:** `security.view`

**Query-Parameter:**
- `status` (optional): `open`, `acknowledged`, `escalated`, `closed`, `ignored`
- `severity` (optional): `info`, `warning`, `critical`
- `category` (optional): `Security`, `Compliance`, `Performance`, etc.
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)
- `offset` (optional): Offset (Standard: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert-123",
        "alert_rule_id": "SEC-001",
        "category": "Security",
        "severity": "critical",
        "status": "open",
        "title": "Unberechtigter Zugriff erkannt",
        "triggered_at": "2025-11-28T10:00:00Z",
        "incident_id": null
      }
    ],
    "total": 100,
    "limit": 100,
    "offset": 0
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.2 POST /api/orchestrator/alerts**

**Beschreibung:** Neuen Alert erstellen (nur System)

**RBAC:** `system.*` (nur intern)

**Request-Body:**
```json
{
  "alert_rule_id": "SEC-001",
  "category": "Security",
  "severity": "critical",
  "title": "Unberechtigter Zugriff erkannt",
  "description": "Versuchter Zugriff ohne Berechtigung",
  "payload": {
    "user_id": "user-123",
    "resource": "orchestrator.trigger"
  },
  "event_type": "SECURITY_UNAUTHORIZED_ACCESS",
  "resource_type": "orchestrator",
  "resource_id": "trigger-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "alert-123",
    "status": "open",
    "triggered_at": "2025-11-28T10:00:00Z"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk)

---

### **3.3 GET /api/orchestrator/alerts/[id]**

**Beschreibung:** Alert-Detail abrufen

**RBAC:** `security.view`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "alert-123",
    "alert_rule_id": "SEC-001",
    "category": "Security",
    "severity": "critical",
    "status": "open",
    "title": "Unberechtigter Zugriff erkannt",
    "description": "Versuchter Zugriff ohne Berechtigung",
    "payload": {},
    "triggered_at": "2025-11-28T10:00:00Z",
    "incident_id": null
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.4 PATCH /api/orchestrator/alerts/[id]/ack**

**Beschreibung:** Alert bestätigen (Acknowledge)

**RBAC:** `security.manage`

**Request-Body:**
```json
{
  "comment": "Alert bestätigt, wird untersucht"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "alert-123",
    "status": "acknowledged",
    "acknowledged_at": "2025-11-28T10:05:00Z",
    "acknowledged_by": "security-officer-123"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk)

---

### **3.5 POST /api/orchestrator/alerts/[id]/escalate**

**Beschreibung:** Alert eskaliert (Incident eröffnen)

**RBAC:** `security.manage`

**Request-Body:**
```json
{
  "reason": "Kritische Sicherheitsverletzung erkannt",
  "severity": "critical"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alert_id": "alert-123",
    "incident_id": "incident-456",
    "status": "escalated",
    "escalated_at": "2025-11-28T10:10:00Z"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk)

---

## 4. Incident-Endpoints

### **4.1 POST /api/orchestrator/incidents**

**Beschreibung:** Neuen Incident erstellen

**RBAC:** `security.manage`

**Request-Body:**
```json
{
  "title": "Sicherheitsverletzung: Unberechtigter Zugriff",
  "description": "Mehrfache Versuche auf Orchestrator-Ressourcen ohne Berechtigung",
  "severity": "critical",
  "alert_ids": ["alert-123", "alert-124"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "incident-456",
    "status": "open",
    "sla_minutes": 15,
    "sla_started_at": "2025-11-28T10:10:00Z",
    "opened_at": "2025-11-28T10:10:00Z"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk)

---

### **4.2 GET /api/orchestrator/incidents/[id]**

**Beschreibung:** Incident-Detail abrufen

**RBAC:** `security.view`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "incident-456",
    "title": "Sicherheitsverletzung: Unberechtigter Zugriff",
    "severity": "critical",
    "status": "investigating",
    "assigned_to": "security-officer-123",
    "sla_minutes": 15,
    "sla_started_at": "2025-11-28T10:10:00Z",
    "escalation_level": 1,
    "alerts": [
      {
        "id": "alert-123",
        "title": "Unberechtigter Zugriff erkannt"
      }
    ],
    "events": [
      {
        "id": "event-789",
        "event_type": "INCIDENT_OPENED",
        "performed_at": "2025-11-28T10:10:00Z"
      }
    ]
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.3 POST /api/orchestrator/incidents/[id]/resolve**

**Beschreibung:** Incident auflösen

**RBAC:** `security.manage`

**Request-Body:**
```json
{
  "resolution": "Root Cause identifiziert und behoben",
  "root_cause": "Fehlerhafte RBAC-Konfiguration",
  "verification": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "incident-456",
    "status": "resolved",
    "resolved_at": "2025-11-28T10:25:00Z",
    "resolved_by": "security-officer-123"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk)

---

## 5. DSFA-Check-Implementierung

### **5.1 DSFA-Check-Logik**

**Prüfung bei:**
- POST `/api/orchestrator/alerts` (bei High/Critical-Risk)
- PATCH `/api/orchestrator/alerts/[id]/ack` (bei High/Critical-Risk)
- POST `/api/orchestrator/alerts/[id]/escalate` (bei High/Critical-Risk)
- POST `/api/orchestrator/incidents` (bei High/Critical-Risk)
- POST `/api/orchestrator/incidents/[id]/resolve` (bei High/Critical-Risk)

**Prüfung:**
```typescript
// Pseudocode
if (severity === 'critical' || severity === 'warning') {
  const dsfaCheck = await checkDSFACompliance({
    use_case: alert.use_case,
    risk_level: alert.severity,
    action: 'alert_management'
  });
  
  if (!dsfaCheck.allowed) {
    return 403 Forbidden;
  }
}
```

---

## 6. Rate-Limiting-Regeln

### **6.1 Standard-Rate-Limiting**

| Endpoint | Rate-Limit | Window |
|----------|-----------|--------|
| `GET /api/orchestrator/alerts` | 100/Min | 1 Minute |
| `POST /api/orchestrator/alerts` | 50/Min | 1 Minute |
| `PATCH /api/orchestrator/alerts/[id]/ack` | 100/Min | 1 Minute |
| `POST /api/orchestrator/alerts/[id]/escalate` | 50/Min | 1 Minute |
| `POST /api/orchestrator/incidents` | 50/Min | 1 Minute |
| `GET /api/orchestrator/incidents/[id]` | 100/Min | 1 Minute |
| `POST /api/orchestrator/incidents/[id]/resolve` | 50/Min | 1 Minute |

---

### **6.2 Rollenbasierte Rate-Limiting**

| Rolle | Rate-Limit | Window |
|-------|-----------|--------|
| **Admin** | 1000/Min | 1 Minute |
| **Security Officer** | 500/Min | 1 Minute |
| **Security Viewer** | 100/Min | 1 Minute |
| **System** | Unlimited | - |

---

## 7. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – API-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




