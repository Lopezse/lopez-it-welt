# P9-API-SPEC

## API-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Unified Operations Center (UOC) Phase P9

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige REST-API und Streaming-API** für das Unified Operations Center (P9).

**Anforderungen:**
- **REST-API** Definition für alle Endpoints
- **Streaming-API** (SSE) für Live-Updates
- **RBAC** Integration (`monitoring.view`, `logs.view`, `security.view`, `security.manage`, `orchestrator.manage`)
- **DSGVO-Konformität** bei allen Endpoints
- **Rate-Limiting** Regeln

---

## 2. API-Standards

### **2.1 Authentifizierung**

**Methode:** JWT-Token (Bearer Token)  
**Header:** `Authorization: Bearer <token>`  
**Cookie:** `adm_session` (Alternative)

---

### **2.2 RBAC**

**Berechtigungen:**
- `monitoring.view` – Monitoring-Daten anzeigen
- `logs.view` – Logs anzeigen
- `security.view` – Alerts/Incidents anzeigen
- `security.manage` – Alerts/Incidents verwalten
- `orchestrator.manage` – Orchestrator verwalten

---

### **2.3 Rate-Limiting**

**Standard:** 100 Requests/Minute  
**Admin:** 1000 Requests/Minute  
**UOC Manager:** 500 Requests/Minute

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
- `429` – Too Many Requests
- `500` – Internal Server Error

---

## 3. REST-API-Endpoints

### **3.1 GET /api/orchestrator/uoc/dashboard**

**Beschreibung:** UOC Dashboard-Daten abrufen

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Query-Parameter:**
- `timeRange` (optional): Zeitraum (1h, 6h, 24h, 7d)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter (alerts, incidents, logs, metrics)

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "alerts_count": 15,
      "incidents_count": 3,
      "logs_count": 1234,
      "health_score": 95
    },
    "alerts": [...], // Top 10 Critical/Warning
    "incidents": [...], // Top 5 Open
    "system_health": {
      "status": "healthy",
      "score": 95,
      "components": {...}
    },
    "api_performance": {
      "latency": 45,
      "error_rate": 0.02,
      "metrics": [...]
    },
    "queue_status": {
      "depth": 12,
      "rate": 5,
      "failed": 0
    },
    "recent_logs": [...], // Top 10
    "trends": {
      "logs": [...],
      "metrics": [...],
      "alerts": [...]
    }
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.2 GET /api/orchestrator/uoc/correlations**

**Beschreibung:** Korrelations-Daten abrufen

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Query-Parameter:**
- `timeRange` (optional): Zeitraum (1h, 6h, 24h, 7d)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter
- `minScore` (optional): Minimale Korrelations-Score (Standard: 0.5)
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)
- `offset` (optional): Offset (Standard: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "correlations": [
      {
        "log_id": "log-123",
        "metric_id": "metric-45",
        "alert_id": "alert-78",
        "correlation_score": 0.95,
        "category": "Security",
        "timestamp": "2025-11-28T10:00:00Z"
      }
    ],
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.3 GET /api/orchestrator/uoc/root-cause/[incidentId]**

**Beschreibung:** Root-Cause-Analysis für Incident abrufen

**RBAC:** `security.view`, `monitoring.view`, `logs.view`

**Response:**
```json
{
  "success": true,
  "data": {
    "incident_id": "incident-123",
    "root_cause": {
      "event_id": "log-123",
      "event_type": "log",
      "log_rule_id": "SEC-LOG-001",
      "timestamp": "2025-11-28T10:00:00Z",
      "message": "Unauthorized access attempt detected"
    },
    "impact": {
      "score": 85,
      "affected_components": ["API", "Queue", "DB"],
      "affected_metrics": ["API-005", "QUEUE-005"],
      "affected_alerts": ["alert-78", "alert-79"]
    },
    "timeline": [
      {
        "event_id": "log-123",
        "event_type": "log",
        "timestamp": "2025-11-28T10:00:00Z",
        "is_root_cause": true
      },
      {
        "event_id": "alert-78",
        "event_type": "alert",
        "timestamp": "2025-11-28T10:00:01Z",
        "is_root_cause": false
      }
    ],
    "solutions": [
      {
        "id": "solution-1",
        "title": "Restart API Service",
        "description": "Restart the API service to resolve the issue",
        "priority": "high",
        "estimated_time": "5 minutes"
      }
    ]
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.4 GET /api/orchestrator/uoc/timeline**

**Beschreibung:** Timeline-Daten abrufen

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Query-Parameter:**
- `startTime` (optional): Start-Zeit (ISO 8601)
- `endTime` (optional): End-Zeit (ISO 8601)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter (alerts, incidents, logs, metrics)
- `zoom` (optional): Zoom-Level (hour, day, week, month)
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)
- `offset` (optional): Offset (Standard: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "log-123",
        "type": "log",
        "category": "Security",
        "severity": "critical",
        "timestamp": "2025-11-28T10:00:00Z",
        "message": "Unauthorized access attempt detected"
      },
      {
        "id": "alert-78",
        "type": "alert",
        "category": "Security",
        "severity": "critical",
        "timestamp": "2025-11-28T10:00:01Z",
        "title": "Security Alert"
      }
    ],
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

## 4. Streaming-API (SSE)

### **4.1 GET /api/orchestrator/uoc/stream/alerts**

**Beschreibung:** Live-Alerts streamen (Server-Sent Events)

**RBAC:** `security.view`

**Query-Parameter:**
- `severity` (optional): Severity-Filter
- `category` (optional): Kategorie-Filter

**Response (SSE):**
```
event: alert
data: {"id": "alert-123", "severity": "critical", "title": "...", "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}

event: alert
data: {"id": "alert-124", "severity": "warning", "title": "...", "timestamp": "2025-11-28T10:00:35Z"}
```

**Heartbeat:** Alle 30 Sekunden

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.2 GET /api/orchestrator/uoc/stream/metrics**

**Beschreibung:** Live-Metrics streamen (Server-Sent Events)

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `category` (optional): Kategorie-Filter
- `metric_id` (optional): Metrik-ID-Filter

**Response (SSE):**
```
event: metric
data: {"metric_id": "API-005", "value": 0.95, "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}

event: metric
data: {"metric_id": "QUEUE-005", "value": 12, "timestamp": "2025-11-28T10:00:35Z"}
```

**Heartbeat:** Alle 30 Sekunden

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.3 GET /api/orchestrator/uoc/stream/logs**

**Beschreibung:** Live-Logs streamen (Server-Sent Events)

**RBAC:** `logs.view`

**Query-Parameter:**
- `log_level` (optional): Log-Level-Filter
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter

**Response (SSE):**
```
event: log
data: {"id": "log-123", "log_level": "ERROR", "category": "Security", "message": "...", "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}

event: log
data: {"id": "log-124", "log_level": "WARN", "category": "API", "message": "...", "timestamp": "2025-11-28T10:00:35Z"}
```

**Heartbeat:** Alle 30 Sekunden

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.4 GET /api/orchestrator/uoc/stream/health**

**Beschreibung:** Live-Health-Status streamen (Server-Sent Events)

**RBAC:** `monitoring.view`

**Response (SSE):**
```
event: health
data: {"status": "healthy", "score": 95, "components": {...}, "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}

event: health
data: {"status": "healthy", "score": 94, "components": {...}, "timestamp": "2025-11-28T10:00:35Z"}
```

**Heartbeat:** Alle 30 Sekunden

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.5 GET /api/orchestrator/uoc/stream/events**

**Beschreibung:** Live-Events streamen (alle Event-Typen)

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Query-Parameter:**
- `source` (optional): Source-Filter (alerts, incidents, logs, metrics)
- `severity` (optional): Severity-Filter

**Response (SSE):**
```
event: alert
data: {"id": "alert-123", "type": "alert", "severity": "critical", "timestamp": "2025-11-28T10:00:00Z"}

event: log
data: {"id": "log-123", "type": "log", "log_level": "ERROR", "timestamp": "2025-11-28T10:00:01Z"}

event: metric
data: {"id": "metric-45", "type": "metric", "metric_id": "API-005", "timestamp": "2025-11-28T10:00:02Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Heartbeat:** Alle 30 Sekunden

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

## 5. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – P9-API-SPEC erstellt

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG*




