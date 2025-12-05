# P8-D-API-SPEC

## API-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-D

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige REST-API und Streaming-API-Spezifikation** für das Telemetrie & Monitoring-System (P8-D).

**Anforderungen:**
- **REST-API** Definition für alle Endpoints
- **Streaming-API** für Live-Metriken
- **RBAC** Integration (`monitoring.view` / `monitoring.manage`)
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
- `monitoring.manage` – Vollzugriff (Metriken verwalten, Konfiguration)
- `monitoring.view` – Nur Lese-Zugriff (Metriken anzeigen, Dashboards)

---

### **2.3 Rate-Limiting**

**Standard:** 100 Requests/Minute  
**Admin:** 1000 Requests/Minute  
**Monitoring Admin:** 500 Requests/Minute  
**Streaming:** 10 Connections gleichzeitig

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

### **3.1 GET /api/orchestrator/metrics/live**

**Beschreibung:** Live-Metriken abrufen (letzte 5 Sekunden)

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `metric_ids` (optional): Komma-getrennte Liste von Metrik-IDs
- `categories` (optional): Komma-getrennte Liste von Kategorien
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "metric-123",
        "metric_id": "SYS-001",
        "metric_name": "CPU Usage",
        "category": "System",
        "value": 75.5,
        "unit": "percent",
        "timestamp": "2025-11-28T10:00:00Z"
      }
    ],
    "total": 100,
    "timestamp": "2025-11-28T10:00:05Z"
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.2 GET /api/orchestrator/metrics/system**

**Beschreibung:** System-Metriken abrufen

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `rollup_interval` (optional): `1min`, `5min`, `1hour`, `1day`
- `limit` (optional): Anzahl (Standard: 100, Max: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "rollup-123",
        "metric_id": "SYS-001",
        "metric_name": "CPU Usage",
        "category": "System",
        "rollup_interval": "1min",
        "value_avg": 75.5,
        "value_min": 70.0,
        "value_max": 80.0,
        "timestamp_start": "2025-11-28T10:00:00Z",
        "timestamp_end": "2025-11-28T10:01:00Z"
      }
    ],
    "total": 100
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.3 GET /api/orchestrator/metrics/api-performance**

**Beschreibung:** API-Performance-Metriken abrufen

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `endpoint` (optional): API-Endpoint-Filter
- `rollup_interval` (optional): `1min`, `5min`, `1hour`, `1day`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "rollup-123",
        "metric_id": "API-002",
        "metric_name": "API Response Time (P50)",
        "category": "API-Performance",
        "rollup_interval": "1min",
        "value_avg": 150.5,
        "value_min": 100.0,
        "value_max": 200.0,
        "timestamp_start": "2025-11-28T10:00:00Z",
        "timestamp_end": "2025-11-28T10:01:00Z"
      }
    ],
    "total": 50
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.4 GET /api/orchestrator/metrics/queue**

**Beschreibung:** Queue-Metriken abrufen

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `rollup_interval` (optional): `1min`, `5min`, `1hour`, `1day`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "rollup-123",
        "metric_id": "QUEUE-001",
        "metric_name": "Queue Depth",
        "category": "Queue",
        "rollup_interval": "1min",
        "value_avg": 500.0,
        "value_min": 400.0,
        "value_max": 600.0,
        "timestamp_start": "2025-11-28T10:00:00Z",
        "timestamp_end": "2025-11-28T10:01:00Z"
      }
    ],
    "total": 10
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.5 GET /api/orchestrator/metrics/db**

**Beschreibung:** Datenbank-Metriken abrufen

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `start_time` (optional): Start-Zeit (ISO 8601)
- `end_time` (optional): End-Zeit (ISO 8601)
- `rollup_interval` (optional): `1min`, `5min`, `1hour`, `1day`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "rollup-123",
        "metric_id": "DB-002",
        "metric_name": "DB Slow Query Count",
        "category": "Database",
        "rollup_interval": "1min",
        "value_sum": 5.0,
        "value_count": 1,
        "timestamp_start": "2025-11-28T10:00:00Z",
        "timestamp_end": "2025-11-28T10:01:00Z"
      }
    ],
    "total": 5
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.6 GET /api/orchestrator/metrics/health**

**Beschreibung:** System-Health-Status abrufen

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `component` (optional): Komponenten-Filter
- `limit` (optional): Anzahl (Standard: 10, Max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "health": [
      {
        "id": "health-123",
        "component": "orchestrator",
        "health_status": "healthy",
        "health_score": 95.5,
        "metrics_summary": {
          "cpu_usage": 75.5,
          "ram_usage": 60.0,
          "queue_depth": 100
        },
        "checked_at": "2025-11-28T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **3.7 POST /api/orchestrator/metrics**

**Beschreibung:** Metrik manuell erstellen (nur System)

**RBAC:** `system.*` (nur intern)

**Request-Body:**
```json
{
  "metric_id": "SYS-001",
  "metric_name": "CPU Usage",
  "category": "System",
  "value": 75.5,
  "unit": "percent",
  "tags": {
    "host": "server-01"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "metric-123",
    "timestamp": "2025-11-28T10:00:00Z"
  }
}
```

**DSFA-Check:** ✅ DSFA-Prüfung erforderlich (bei High/Critical-Risk-Metriken)

---

## 4. Streaming-API

### **4.1 GET /api/orchestrator/metrics/stream**

**Beschreibung:** Live-Metriken über Server-Sent Events (SSE)

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `metric_ids` (optional): Komma-getrennte Liste von Metrik-IDs
- `categories` (optional): Komma-getrennte Liste von Kategorien
- `interval` (optional): Update-Intervall in Sekunden (Standard: 5, Min: 1, Max: 60)

**Response-Format (SSE):**
```
data: {"id":"metric-123","metric_id":"SYS-001","value":75.5,"timestamp":"2025-11-28T10:00:00Z"}

data: {"id":"metric-124","metric_id":"SYS-004","value":60.0,"timestamp":"2025-11-28T10:00:05Z"}

...
```

**Verbindungs-Limit:** 10 gleichzeitige Verbindungen pro Benutzer

**DSFA-Check:** ✅ Keine DSFA-Prüfung erforderlich (nur Lese-Zugriff)

---

### **4.2 WebSocket-Alternative (Optional)**

**Endpoint:** `ws://api/orchestrator/metrics/stream`

**Beschreibung:** Live-Metriken über WebSocket (für erweiterte Funktionalität)

**RBAC:** `monitoring.view`

**Message-Format:**
```json
{
  "type": "metric",
  "data": {
    "id": "metric-123",
    "metric_id": "SYS-001",
    "value": 75.5,
    "timestamp": "2025-11-28T10:00:00Z"
  }
}
```

---

## 5. Rate-Limiting-Regeln

### **5.1 REST-API Rate-Limiting**

| Endpoint | Rate-Limit | Window |
|----------|-----------|--------|
| `GET /api/orchestrator/metrics/live` | 100/Min | 1 Minute |
| `GET /api/orchestrator/metrics/system` | 100/Min | 1 Minute |
| `GET /api/orchestrator/metrics/api-performance` | 100/Min | 1 Minute |
| `GET /api/orchestrator/metrics/queue` | 100/Min | 1 Minute |
| `GET /api/orchestrator/metrics/db` | 100/Min | 1 Minute |
| `GET /api/orchestrator/metrics/health` | 100/Min | 1 Minute |
| `POST /api/orchestrator/metrics` | 1000/Min | 1 Minute (nur System) |

---

### **5.2 Streaming-API Rate-Limiting**

| Endpoint | Limit | Beschreibung |
|----------|-------|-------------|
| `GET /api/orchestrator/metrics/stream` | 10 Connections | Gleichzeitige Verbindungen pro Benutzer |
| `ws://api/orchestrator/metrics/stream` | 10 Connections | Gleichzeitige Verbindungen pro Benutzer |

---

### **5.3 Rollenbasierte Rate-Limiting**

| Rolle | Rate-Limit | Window |
|-------|-----------|--------|
| **Admin** | 1000/Min | 1 Minute |
| **Monitoring Admin** | 500/Min | 1 Minute |
| **Monitoring Viewer** | 100/Min | 1 Minute |
| **System** | Unlimited | - |

---

## 6. DSFA-Check-Implementierung

### **6.1 DSFA-Check-Logik**

**Prüfung bei:**
- POST `/api/orchestrator/metrics` (bei High/Critical-Risk-Metriken)

**Prüfung:**
```typescript
// Pseudocode
if (metric.dsfa_relevance === 'High' || metric.dsfa_relevance === 'Medium') {
  const dsfaCheck = await checkDSFACompliance({
    use_case: metric.use_case,
    risk_level: metric.priority,
    action: 'metric_collection'
  });
  
  if (!dsfaCheck.allowed) {
    return 403 Forbidden;
  }
}
```

---

## 7. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – API-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




