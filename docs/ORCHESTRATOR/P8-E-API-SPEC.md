# P8-E-API-SPEC

## API-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-E

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige REST-API-Spezifikation** für das Log Processing & Analytics-System (P8-E).

**Anforderungen:**
- **REST-API** Definition für alle Endpoints
- **Log-Suche & Filter** – Volltext-Suche, erweiterte Filter
- **RBAC** Integration (`logs.view` / `logs.manage`)
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
- `logs.manage` – Vollzugriff (Logs verwalten, Konfiguration)
- `logs.view` – Nur Lese-Zugriff (Logs anzeigen, Suchen, Filtern)

---

### **2.3 Rate-Limiting**

**Standard:** 100 Requests/Minute  
**Admin:** 1000 Requests/Minute  
**Log Admin:** 500 Requests/Minute

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

## 3. REST-API-Endpoints

### **3.1 GET /api/orchestrator/logs**

**Beschreibung:** Logs abrufen mit Suche & Filter

**RBAC:** `logs.view`

**Query-Parameter:**
- `q` (optional): Volltext-Suche
- `category` (optional): Kategorie-Filter (Security, API, Queue, Workflow, System, DSGVO)
- `log_level` (optional): Log-Level-Filter (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
- `severity` (optional): Severity-Filter (info, warning, critical)
- `log_rule_id` (optional): Log-Regel-ID-Filter
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `user_id` (optional): Benutzer-ID-Filter
- `correlation_id` (optional): Korrelations-ID-Filter
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)
- `offset` (optional): Offset (Standard: 0)
- `sort` (optional): Sortierung (Standard: `timestamp DESC`)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-123",
        "log_rule_id": "SEC-LOG-001",
        "log_level": "ERROR",
        "category": "Security",
        "severity": "critical",
        "message": "Unauthorized access attempt detected",
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

### **3.2 GET /api/orchestrator/logs/[id]**

**Beschreibung:** Log-Detail abrufen

**RBAC:** `logs.view`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "log_rule_id": "SEC-LOG-001",
    "log_level": "ERROR",
    "category": "Security",
    "severity": "critical",
    "message": "Unauthorized access attempt detected",
    "context": {
      "user_id": "user-123",
      "ip_address": "192.168.1.100",
      "resource": "orchestrator.trigger"
    },
    "metadata": {
      "correlation_id": "corr-123",
      "request_id": "req-456"
    },
    "timestamp": "2025-11-28T10:00:00Z"
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.3 GET /api/orchestrator/logs/search**

**Beschreibung:** Erweiterte Log-Suche

**RBAC:** `logs.view`

**Request-Body:**
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "message": "unauthorized access"
          }
        },
        {
          "range": {
            "timestamp": {
              "gte": "2025-11-28T00:00:00Z",
              "lte": "2025-11-28T23:59:59Z"
            }
          }
        }
      ],
      "filter": [
        {
          "term": {
            "category": "Security"
          }
        },
        {
          "term": {
            "severity": "critical"
          }
        }
      ]
    }
  },
  "sort": [
    {
      "timestamp": "desc"
    }
  ],
  "size": 100,
  "from": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-123",
        "log_rule_id": "SEC-LOG-001",
        "message": "Unauthorized access attempt detected",
        "timestamp": "2025-11-28T10:00:00Z"
      }
    ],
    "total": 50,
    "took": 15
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.4 GET /api/orchestrator/logs/analytics/trends**

**Beschreibung:** Log-Trends abrufen

**RBAC:** `logs.view`

**Query-Parameter:**
- `category` (optional): Kategorie-Filter
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `period` (optional): Zeitraum (hour, day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "timestamp": "2025-11-28T10:00:00Z",
        "log_count": 100,
        "error_count": 10,
        "warning_count": 20,
        "info_count": 70
      }
    ],
    "summary": {
      "total_logs": 1000,
      "total_errors": 100,
      "total_warnings": 200,
      "trend": "increasing",
      "slope": 0.15
    }
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.5 GET /api/orchestrator/logs/analytics/patterns**

**Beschreibung:** Log-Patterns abrufen

**RBAC:** `logs.view`

**Query-Parameter:**
- `category` (optional): Kategorie-Filter
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `min_frequency` (optional): Minimale Häufigkeit (Standard: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "pattern": "unauthorized access attempt",
        "frequency": 50,
        "first_seen": "2025-11-28T00:00:00Z",
        "last_seen": "2025-11-28T23:59:59Z",
        "category": "Security"
      }
    ],
    "total": 10
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.6 GET /api/orchestrator/logs/analytics/anomalies**

**Beschreibung:** Log-Anomalien abrufen

**RBAC:** `logs.view`

**Query-Parameter:**
- `category` (optional): Kategorie-Filter
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `severity` (optional): Severity-Filter (info, warning, critical)

**Response:**
```json
{
  "success": true,
  "data": {
    "anomalies": [
      {
        "id": "anomaly-123",
        "log_id": "log-123",
        "anomaly_type": "statistical",
        "severity": "critical",
        "z_score": 3.5,
        "threshold": 3.0,
        "timestamp": "2025-11-28T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.7 POST /api/orchestrator/logs**

**Beschreibung:** Log manuell erstellen (nur System)

**RBAC:** `system.*` (nur intern)

**Request-Body:**
```json
{
  "log_rule_id": "SEC-LOG-001",
  "log_level": "ERROR",
  "category": "Security",
  "severity": "critical",
  "message": "Unauthorized access attempt detected",
  "context": {
    "user_id": "user-123",
    "ip_address": "192.168.1.100"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "timestamp": "2025-11-28T10:00:00Z"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk-Logs)

---

## 4. Rate-Limiting-Regeln

### **4.1 REST-API Rate-Limiting**

| Endpoint | Rate-Limit | Window |
|----------|-----------|--------|
| `GET /api/orchestrator/logs` | 100/Min | 1 Minute |
| `GET /api/orchestrator/logs/[id]` | 100/Min | 1 Minute |
| `GET /api/orchestrator/logs/search` | 50/Min | 1 Minute |
| `GET /api/orchestrator/logs/analytics/trends` | 100/Min | 1 Minute |
| `GET /api/orchestrator/logs/analytics/patterns` | 50/Min | 1 Minute |
| `GET /api/orchestrator/logs/analytics/anomalies` | 50/Min | 1 Minute |
| `POST /api/orchestrator/logs` | 1000/Min | 1 Minute (nur System) |

---

### **4.2 Rollenbasierte Rate-Limiting**

| Rolle | Rate-Limit | Window |
|-------|-----------|--------|
| **Admin** | 1000/Min | 1 Minute |
| **Log Admin** | 500/Min | 1 Minute |
| **Log Viewer** | 100/Min | 1 Minute |
| **System** | Unlimited | - |

---

## 5. DSFA-Check-Implementierung

### **5.1 DSFA-Check-Logik**

**Prüfung bei:**
- POST `/api/orchestrator/logs` (bei High/Critical-Risk-Logs)

**Prüfung:**
```typescript
// Pseudocode
if (log.severity === 'critical' || log.severity === 'warning') {
  const dsfaCheck = await checkDSFACompliance({
    use_case: log.use_case,
    risk_level: log.severity,
    action: 'log_creation'
  });
  
  if (!dsfaCheck.allowed) {
    return 403 Forbidden;
  }
}
```

---

## 6. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – API-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




