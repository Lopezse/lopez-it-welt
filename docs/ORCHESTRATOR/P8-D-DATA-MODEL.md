# P8-D-DATA-MODEL

## Datenmodell – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-D

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert das **vollständige Datenmodell** für das Telemetrie & Monitoring-System (P8-D).

**Anforderungen:**
- **Tabellen-Schema** für Metriken & Health
- **JSON-Modelle** für alle Datenstrukturen
- **Beziehungen** zwischen Tabellen
- **Integritätsregeln** definiert
- **Index-Strategie** optimiert
- **Retention-Regeln** (DSGVO-konform)
- **Kompressionsregeln** für langfristige Speicherung

---

## 2. Tabellen-Schema

### **2.1 orchestrator_metrics**

**Beschreibung:** Speichert alle Raw-Metriken (Level 1)

**Schema:**
```sql
CREATE TABLE orchestrator_metrics (
    id VARCHAR(255) PRIMARY KEY,
    metric_id VARCHAR(50) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    value DECIMAL(20,6) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metric_id (metric_id),
    INDEX idx_category (category),
    INDEX idx_timestamp (timestamp),
    INDEX idx_created_at (created_at),
    INDEX idx_metric_timestamp (metric_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    PARTITION p_current VALUES LESS THAN (UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 1 DAY))),
    PARTITION p_archive VALUES LESS THAN MAXVALUE
);
```

---

### **2.2 orchestrator_metrics_rollup**

**Beschreibung:** Speichert aggregierte Metriken (Level 3)

**Schema:**
```sql
CREATE TABLE orchestrator_metrics_rollup (
    id VARCHAR(255) PRIMARY KEY,
    metric_id VARCHAR(50) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rollup_interval ENUM('1min', '5min', '1hour', '1day') NOT NULL,
    value_min DECIMAL(20,6) NOT NULL,
    value_max DECIMAL(20,6) NOT NULL,
    value_avg DECIMAL(20,6) NOT NULL,
    value_sum DECIMAL(20,6) NOT NULL,
    value_count INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    timestamp_start TIMESTAMP NOT NULL,
    timestamp_end TIMESTAMP NOT NULL,
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metric_id (metric_id),
    INDEX idx_category (category),
    INDEX idx_rollup_interval (rollup_interval),
    INDEX idx_timestamp_start (timestamp_start),
    INDEX idx_timestamp_end (timestamp_end),
    INDEX idx_metric_rollup_timestamp (metric_id, rollup_interval, timestamp_start),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp_start)) (
    PARTITION p_current VALUES LESS THAN (UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 7 DAY))),
    PARTITION p_archive VALUES LESS THAN MAXVALUE
);
```

---

### **2.3 orchestrator_metrics_events**

**Beschreibung:** Speichert Metriken-Events (Anomalien, Schwellwert-Überschreitungen)

**Schema:**
```sql
CREATE TABLE orchestrator_metrics_events (
    id VARCHAR(255) PRIMARY KEY,
    metric_id VARCHAR(50) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_severity ENUM('info', 'warning', 'critical') NOT NULL,
    value DECIMAL(20,6) NOT NULL,
    threshold DECIMAL(20,6) NOT NULL,
    message TEXT,
    metadata JSON,
    triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    alert_id VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metric_id (metric_id),
    INDEX idx_event_type (event_type),
    INDEX idx_event_severity (event_severity),
    INDEX idx_triggered_at (triggered_at),
    INDEX idx_resolved_at (resolved_at),
    INDEX idx_alert_id (alert_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (alert_id) REFERENCES orchestrator_alerts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### **2.4 orchestrator_metrics_health**

**Beschreibung:** Speichert System-Health-Status

**Schema:**
```sql
CREATE TABLE orchestrator_metrics_health (
    id VARCHAR(255) PRIMARY KEY,
    component VARCHAR(100) NOT NULL,
    health_status ENUM('healthy', 'degraded', 'unhealthy', 'critical') NOT NULL,
    health_score DECIMAL(5,2) NOT NULL,
    metrics_summary JSON,
    issues JSON,
    checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_component (component),
    INDEX idx_health_status (health_status),
    INDEX idx_checked_at (checked_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. JSON-Modelle

### **3.1 Metric-Modell**

```json
{
  "id": "metric-1234567890",
  "metric_id": "SYS-001",
  "metric_name": "CPU Usage",
  "category": "System",
  "value": 75.5,
  "unit": "percent",
  "timestamp": "2025-11-28T10:00:00Z",
  "tags": {
    "host": "server-01",
    "environment": "production"
  },
  "metadata": {
    "collection_interval": "5s",
    "priority": "P1",
    "dsfa_relevance": "Low"
  },
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

### **3.2 Metric-Rollup-Modell**

```json
{
  "id": "rollup-1234567890",
  "metric_id": "SYS-001",
  "metric_name": "CPU Usage",
  "category": "System",
  "rollup_interval": "1min",
  "value_min": 70.0,
  "value_max": 80.0,
  "value_avg": 75.5,
  "value_sum": 4530.0,
  "value_count": 60,
  "unit": "percent",
  "timestamp_start": "2025-11-28T10:00:00Z",
  "timestamp_end": "2025-11-28T10:01:00Z",
  "tags": {
    "host": "server-01",
    "environment": "production"
  },
  "metadata": {
    "collection_interval": "5s",
    "priority": "P1"
  },
  "created_at": "2025-11-28T10:01:00Z"
}
```

---

### **3.3 Metric-Event-Modell**

```json
{
  "id": "event-1234567890",
  "metric_id": "SYS-001",
  "metric_name": "CPU Usage",
  "event_type": "THRESHOLD_EXCEEDED",
  "event_severity": "warning",
  "value": 85.0,
  "threshold": 80.0,
  "message": "CPU Usage exceeded warning threshold",
  "metadata": {
    "component": "system",
    "alert_rule": "PERF-001"
  },
  "triggered_at": "2025-11-28T10:05:00Z",
  "resolved_at": null,
  "alert_id": "alert-123",
  "created_at": "2025-11-28T10:05:00Z"
}
```

---

### **3.4 Health-Modell**

```json
{
  "id": "health-1234567890",
  "component": "orchestrator",
  "health_status": "healthy",
  "health_score": 95.5,
  "metrics_summary": {
    "cpu_usage": 75.5,
    "ram_usage": 60.0,
    "queue_depth": 100,
    "error_rate": 0.5
  },
  "issues": [],
  "checked_at": "2025-11-28T10:00:00Z",
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

## 4. Beziehungen

### **4.1 Metric ↔ Metric-Rollup**

**Beziehung:** 1:N (Eine Metrik hat mehrere Rollups)

**Aggregation:**
- Raw-Metriken werden zu Rollups aggregiert
- Rollup-Intervalle: 1 Min, 5 Min, 1 Stunde, 1 Tag

---

### **4.2 Metric ↔ Metric-Event**

**Beziehung:** 1:N (Eine Metrik kann mehrere Events haben)

**Foreign Key:**
- `orchestrator_metrics_events.metric_id` → `orchestrator_metrics.metric_id` (logisch)

---

### **4.3 Metric-Event ↔ Alert**

**Beziehung:** N:1 (Mehrere Events können einen Alert haben)

**Foreign Key:**
- `orchestrator_metrics_events.alert_id` → `orchestrator_alerts.id`

**Cascade:**
- `ON DELETE SET NULL` (Event bleibt erhalten, wenn Alert gelöscht wird)

---

## 5. Integritätsregeln

### **5.1 Metric-Integrität**

**Regeln:**
- `metric_id` muss existieren (Referenz auf Metrik-Definition)
- `value` muss >= 0 sein (für Gauge/Counter)
- `timestamp` muss nicht in der Zukunft sein
- `unit` muss einer der definierten Einheiten sein

---

### **5.2 Metric-Rollup-Integrität**

**Regeln:**
- `rollup_interval` muss einer der Werte sein: `1min`, `5min`, `1hour`, `1day`
- `value_min` <= `value_avg` <= `value_max`
- `value_count` > 0
- `timestamp_start` < `timestamp_end`

---

### **5.3 Metric-Event-Integrität**

**Regeln:**
- `event_type` muss einer der definierten Event-Typen sein
- `event_severity` muss einer der Werte sein: `info`, `warning`, `critical`
- `resolved_at` muss nach `triggered_at` sein (wenn gesetzt)

---

### **5.4 Health-Integrität**

**Regeln:**
- `health_status` muss einer der Werte sein: `healthy`, `degraded`, `unhealthy`, `critical`
- `health_score` muss zwischen 0 und 100 sein
- `component` muss nicht leer sein

---

## 6. Index-Strategie

### **6.1 Metric-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_metric_id` | `metric_id` | Schnelle Suche nach Metrik-ID |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_timestamp` | `timestamp` | Zeitbasierte Abfragen |
| `idx_created_at` | `created_at` | Purge-Strategie |
| `idx_metric_timestamp` | `metric_id`, `timestamp` | Kombinierte Suche (Metrik + Zeit) |

---

### **6.2 Metric-Rollup-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_metric_id` | `metric_id` | Schnelle Suche nach Metrik-ID |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_rollup_interval` | `rollup_interval` | Filterung nach Rollup-Intervall |
| `idx_timestamp_start` | `timestamp_start` | Zeitbasierte Abfragen |
| `idx_metric_rollup_timestamp` | `metric_id`, `rollup_interval`, `timestamp_start` | Optimierte Dashboard-Abfragen |

---

### **6.3 Metric-Event-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_metric_id` | `metric_id` | Schnelle Suche nach Metrik-ID |
| `idx_event_type` | `event_type` | Filterung nach Event-Typ |
| `idx_event_severity` | `event_severity` | Filterung nach Severity |
| `idx_triggered_at` | `triggered_at` | Zeitbasierte Abfragen |
| `idx_alert_id` | `alert_id` | Join mit Alerts |

---

## 7. Retention-Regeln (DSGVO)

### **7.1 Retention-Zeiten**

| Tabelle | Retention-Zeit | Grund |
|---------|---------------|-------|
| `orchestrator_metrics` (Raw) | 7 Tage | DSGVO-konform, Performance |
| `orchestrator_metrics_rollup` (1 Min) | 30 Tage | Kurzfristige Trends |
| `orchestrator_metrics_rollup` (5 Min) | 90 Tage | Mittelfristige Trends |
| `orchestrator_metrics_rollup` (1 Hour) | 365 Tage | Langfristige Trends |
| `orchestrator_metrics_rollup` (1 Day) | 2555 Tage (7 Jahre) | Langfristige Archivierung |
| `orchestrator_metrics_events` | 365 Tage | Compliance-Anforderungen |
| `orchestrator_metrics_health` | 90 Tage | Health-Historie |

---

### **7.2 Purge-Strategie**

**Automatische Purge:**
- **Täglich:** Raw-Metriken älter als 7 Tage werden gelöscht
- **Wöchentlich:** 1-Min-Rollups älter als 30 Tage werden gelöscht
- **Monatlich:** 5-Min-Rollups älter als 90 Tage werden komprimiert
- **Jährlich:** 1-Hour-Rollups älter als 365 Tage werden komprimiert
- **Nie:** 1-Day-Rollups werden nie gelöscht (Archivierung)

**Archivierung:**
- Daten werden in separate Archiv-Tabellen verschoben
- Kompression für langfristige Speicherung
- Vollständige Nachvollziehbarkeit gewährleistet

---

## 8. Kompressionsregeln

### **8.1 Kompressions-Strategie**

**Komprimierung:**
- **5-Min-Rollups:** Nach 90 Tagen komprimieren (50% Reduktion)
- **1-Hour-Rollups:** Nach 365 Tagen komprimieren (75% Reduktion)
- **1-Day-Rollups:** Nach 1 Jahr komprimieren (90% Reduktion)

**Kompressions-Methode:**
- Aggregation auf Min/Max/Avg (statt alle Werte)
- JSON-Kompression für Tags/Metadata
- Partitionierung für bessere Performance

---

### **8.2 Partitionierung**

**Partitionierung-Strategie:**
- **Raw-Metriken:** Tages-Partitionen (automatische Archivierung)
- **Rollups:** Wochens-Partitionen (automatische Kompression)
- **Events:** Monats-Partitionen (automatische Archivierung)

---

## 9. DSGVO-Anforderungen

### **9.1 Datenminimierung**

**Anforderungen:**
- Nur notwendige Metriken sammeln
- Aggregation zur Datenminimierung
- Kompression für langfristige Speicherung
- Automatische Löschung nach Retention-Zeit

---

### **9.2 Pseudonymisierung**

**Anforderungen:**
- Keine personenbezogenen Daten in Metriken
- Pseudonymisierung bei notwendigen Daten (z.B. User-IDs)
- Zero-Trust UI (keine PD-Anzeige)

---

### **9.3 Audit-Trail**

**Anforderungen:**
- Audit-Hash für alle Metriken (optional)
- Vollständige Protokollierung von Purge-Operationen
- Nachvollziehbarkeit aller Metriken-Änderungen

---

## 10. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – Datenmodell definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




