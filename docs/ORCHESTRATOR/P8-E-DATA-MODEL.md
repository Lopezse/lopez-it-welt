# P8-E-DATA-MODEL

## Datenmodell – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-E

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert das **vollständige Datenmodell** für das Log Processing & Analytics-System (P8-E).

**Anforderungen:**
- **Tabellen-Schema** für Logs & Analytics
- **JSON-Modelle** für alle Datenstrukturen
- **Beziehungen** zwischen Tabellen
- **Integritätsregeln** definiert
- **Index-Strategie** optimiert
- **Retention-Regeln** (DSGVO-konform)
- **Kompressionsregeln** für langfristige Speicherung

---

## 2. Tabellen-Schema

### **2.1 orchestrator_logs**

**Beschreibung:** Speichert alle Raw-Logs (Level 1)

**Schema:**
```sql
CREATE TABLE orchestrator_logs (
    id VARCHAR(255) PRIMARY KEY,
    log_rule_id VARCHAR(50) NOT NULL,
    log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    metadata JSON,
    correlation_id VARCHAR(255),
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_rule_id (log_rule_id),
    INDEX idx_log_level (log_level),
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp),
    INDEX idx_correlation_id (correlation_id),
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_request_id (request_id),
    INDEX idx_resource_type (resource_type),
    INDEX idx_resource_id (resource_id),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_message_fulltext (message)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    PARTITION p_current VALUES LESS THAN (UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 1 DAY))),
    PARTITION p_archive VALUES LESS THAN MAXVALUE
);
```

---

### **2.2 orchestrator_logs_indexed**

**Beschreibung:** Speichert indexierte Logs für schnelle Suche (Level 2)

**Schema:**
```sql
CREATE TABLE orchestrator_logs_indexed (
    id VARCHAR(255) PRIMARY KEY,
    log_id VARCHAR(255) NOT NULL,
    log_rule_id VARCHAR(50) NOT NULL,
    log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    message TEXT NOT NULL,
    message_normalized TEXT,
    tags JSON,
    extracted_fields JSON,
    search_vector TEXT,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_id (log_id),
    INDEX idx_log_rule_id (log_rule_id),
    INDEX idx_log_level (log_level),
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_message_fulltext (message),
    FULLTEXT INDEX idx_search_vector_fulltext (search_vector),
    
    FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(timestamp)) (
    PARTITION p_current VALUES LESS THAN (UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 7 DAY))),
    PARTITION p_archive VALUES LESS THAN MAXVALUE
);
```

---

### **2.3 orchestrator_logs_archive**

**Beschreibung:** Speichert archivierte Logs für langfristige Speicherung (Level 2)

**Schema:**
```sql
CREATE TABLE orchestrator_logs_archive (
    id VARCHAR(255) PRIMARY KEY,
    log_id VARCHAR(255) NOT NULL,
    log_rule_id VARCHAR(50) NOT NULL,
    log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    metadata JSON,
    compressed_data LONGBLOB,
    compression_ratio DECIMAL(5,2),
    archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    original_timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_id (log_id),
    INDEX idx_log_rule_id (log_rule_id),
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_archived_at (archived_at),
    INDEX idx_original_timestamp (original_timestamp),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(archived_at)) (
    PARTITION p_current VALUES LESS THAN (UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 30 DAY))),
    PARTITION p_archive VALUES LESS THAN MAXVALUE
);
```

---

### **2.4 orchestrator_logs_analytics**

**Beschreibung:** Speichert Analytics-Ergebnisse (Level 3)

**Schema:**
```sql
CREATE TABLE orchestrator_logs_analytics (
    id VARCHAR(255) PRIMARY KEY,
    analysis_type ENUM('trend', 'pattern', 'anomaly', 'correlation') NOT NULL,
    analysis_period ENUM('hour', 'day', 'week', 'month') NOT NULL,
    category VARCHAR(50),
    result JSON NOT NULL,
    confidence DECIMAL(5,2),
    timestamp_start TIMESTAMP NOT NULL,
    timestamp_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_analysis_type (analysis_type),
    INDEX idx_analysis_period (analysis_period),
    INDEX idx_category (category),
    INDEX idx_timestamp_start (timestamp_start),
    INDEX idx_timestamp_end (timestamp_end),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### **2.5 orchestrator_logs_events**

**Beschreibung:** Speichert Log-Events (Anomalien, Alerts)

**Schema:**
```sql
CREATE TABLE orchestrator_logs_events (
    id VARCHAR(255) PRIMARY KEY,
    log_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_severity ENUM('info', 'warning', 'critical') NOT NULL,
    event_data JSON,
    alert_id VARCHAR(255) NULL,
    incident_id VARCHAR(255) NULL,
    triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_id (log_id),
    INDEX idx_event_type (event_type),
    INDEX idx_event_severity (event_severity),
    INDEX idx_triggered_at (triggered_at),
    INDEX idx_resolved_at (resolved_at),
    INDEX idx_alert_id (alert_id),
    INDEX idx_incident_id (incident_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (alert_id) REFERENCES orchestrator_alerts(id) ON DELETE SET NULL,
    FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. JSON-Modelle

### **3.1 Log-Modell**

```json
{
  "id": "log-1234567890",
  "log_rule_id": "SEC-LOG-001",
  "log_level": "ERROR",
  "category": "Security",
  "severity": "critical",
  "message": "Unauthorized access attempt detected",
  "context": {
    "user_id": "user-123",
    "ip_address": "192.168.1.100",
    "resource": "orchestrator.trigger",
    "action": "create"
  },
  "metadata": {
    "correlation_id": "corr-123",
    "request_id": "req-456",
    "session_id": "sess-789"
  },
  "correlation_id": "corr-123",
  "user_id": "user-123",
  "session_id": "sess-789",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "request_id": "req-456",
  "resource_type": "orchestrator",
  "resource_id": "trigger-123",
  "timestamp": "2025-11-28T10:00:00Z",
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

### **3.2 Indexed-Log-Modell**

```json
{
  "id": "indexed-1234567890",
  "log_id": "log-1234567890",
  "log_rule_id": "SEC-LOG-001",
  "log_level": "ERROR",
  "category": "Security",
  "severity": "critical",
  "message": "Unauthorized access attempt detected",
  "message_normalized": "unauthorized access attempt detected",
  "tags": ["security", "unauthorized", "access"],
  "extracted_fields": {
    "user_id": "user-123",
    "ip_address": "192.168.1.100",
    "resource": "orchestrator.trigger"
  },
  "search_vector": "unauthorized access attempt detected user-123 orchestrator trigger",
  "timestamp": "2025-11-28T10:00:00Z",
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

### **3.3 Analytics-Modell**

```json
{
  "id": "analytics-1234567890",
  "analysis_type": "trend",
  "analysis_period": "day",
  "category": "Security",
  "result": {
    "trend": "increasing",
    "slope": 0.15,
    "r_squared": 0.85,
    "forecast": [
      {
        "timestamp": "2025-11-29T00:00:00Z",
        "value": 120
      }
    ]
  },
  "confidence": 0.85,
  "timestamp_start": "2025-11-28T00:00:00Z",
  "timestamp_end": "2025-11-28T23:59:59Z",
  "created_at": "2025-11-29T00:00:00Z"
}
```

---

### **3.4 Log-Event-Modell**

```json
{
  "id": "event-1234567890",
  "log_id": "log-1234567890",
  "event_type": "ANOMALY_DETECTED",
  "event_severity": "critical",
  "event_data": {
    "anomaly_type": "statistical",
    "z_score": 3.5,
    "threshold": 3.0
  },
  "alert_id": "alert-123",
  "incident_id": null,
  "triggered_at": "2025-11-28T10:00:00Z",
  "resolved_at": null,
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

## 4. Beziehungen

### **4.1 Log ↔ Indexed-Log**

**Beziehung:** 1:1 (Ein Log hat einen Indexed-Log)

**Foreign Key:**
- `orchestrator_logs_indexed.log_id` → `orchestrator_logs.id`

**Cascade:**
- `ON DELETE CASCADE` (Indexed-Log wird gelöscht, wenn Log gelöscht wird)

---

### **4.2 Log ↔ Archive-Log**

**Beziehung:** 1:1 (Ein Log hat einen Archive-Log)

**Foreign Key:**
- `orchestrator_logs_archive.log_id` → `orchestrator_logs.id`

**Cascade:**
- `ON DELETE CASCADE` (Archive-Log wird gelöscht, wenn Log gelöscht wird)

---

### **4.3 Log ↔ Log-Event**

**Beziehung:** 1:N (Ein Log kann mehrere Events haben)

**Foreign Key:**
- `orchestrator_logs_events.log_id` → `orchestrator_logs.id`

**Cascade:**
- `ON DELETE CASCADE` (Events werden gelöscht, wenn Log gelöscht wird)

---

### **4.4 Log-Event ↔ Alert**

**Beziehung:** N:1 (Mehrere Events können einen Alert haben)

**Foreign Key:**
- `orchestrator_logs_events.alert_id` → `orchestrator_alerts.id`

**Cascade:**
- `ON DELETE SET NULL` (Event bleibt erhalten, wenn Alert gelöscht wird)

---

### **4.5 Log-Event ↔ Incident**

**Beziehung:** N:1 (Mehrere Events können einen Incident haben)

**Foreign Key:**
- `orchestrator_logs_events.incident_id` → `orchestrator_incidents.id`

**Cascade:**
- `ON DELETE SET NULL` (Event bleibt erhalten, wenn Incident gelöscht wird)

---

## 5. Integritätsregeln

### **5.1 Log-Integrität**

**Regeln:**
- `log_rule_id` muss existieren (Referenz auf Log-Regel)
- `log_level` muss einer der Werte sein: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`
- `severity` muss einer der Werte sein: `info`, `warning`, `critical`
- `timestamp` muss nicht in der Zukunft sein
- `message` muss nicht leer sein

---

### **5.2 Indexed-Log-Integrität**

**Regeln:**
- `log_id` muss existieren
- `message_normalized` muss nicht leer sein (für Suche)
- `search_vector` muss nicht leer sein (für Volltext-Suche)

---

### **5.3 Archive-Log-Integrität**

**Regeln:**
- `log_id` muss existieren
- `compressed_data` muss nicht leer sein
- `compression_ratio` muss > 0 sein
- `original_timestamp` muss nicht in der Zukunft sein

---

### **5.4 Analytics-Integrität**

**Regeln:**
- `analysis_type` muss einer der Werte sein: `trend`, `pattern`, `anomaly`, `correlation`
- `analysis_period` muss einer der Werte sein: `hour`, `day`, `week`, `month`
- `confidence` muss zwischen 0 und 1 sein
- `timestamp_start` < `timestamp_end`

---

### **5.5 Log-Event-Integrität**

**Regeln:**
- `log_id` muss existieren
- `event_type` muss einer der definierten Event-Typen sein
- `event_severity` muss einer der Werte sein: `info`, `warning`, `critical`
- `resolved_at` muss nach `triggered_at` sein (wenn gesetzt)

---

## 6. Index-Strategie

### **6.1 Log-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_log_rule_id` | `log_rule_id` | Schnelle Suche nach Log-Regel |
| `idx_log_level` | `log_level` | Filterung nach Log-Level |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_severity` | `severity` | Filterung nach Severity |
| `idx_timestamp` | `timestamp` | Zeitbasierte Abfragen |
| `idx_correlation_id` | `correlation_id` | Korrelations-Suche |
| `idx_user_id` | `user_id` | Benutzer-basierte Suche |
| `idx_request_id` | `request_id` | Request-basierte Suche |
| `idx_message_fulltext` | `message` | Volltext-Suche |

---

### **6.2 Indexed-Log-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_log_id` | `log_id` | Join mit Raw-Logs |
| `idx_log_rule_id` | `log_rule_id` | Schnelle Suche nach Log-Regel |
| `idx_log_level` | `log_level` | Filterung nach Log-Level |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_timestamp` | `timestamp` | Zeitbasierte Abfragen |
| `idx_message_fulltext` | `message` | Volltext-Suche |
| `idx_search_vector_fulltext` | `search_vector` | Erweiterte Volltext-Suche |

---

### **6.3 Archive-Log-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_log_id` | `log_id` | Join mit Raw-Logs |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_archived_at` | `archived_at` | Zeitbasierte Abfragen |
| `idx_original_timestamp` | `original_timestamp` | Original-Zeitstempel-Suche |

---

## 7. Retention-Regeln (DSGVO)

### **7.1 Retention-Zeiten**

| Tabelle | Retention-Zeit | Grund |
|---------|---------------|-------|
| `orchestrator_logs` (Raw) | 7 Tage | DSGVO-konform, Performance |
| `orchestrator_logs_indexed` (Indexed) | 30 Tage | Kurzfristige Suche |
| `orchestrator_logs_archive` (Archive) | 365 Tage | Langfristige Archivierung |
| `orchestrator_logs_analytics` (Analytics) | 2555 Tage (7 Jahre) | Langfristige Analytics |
| `orchestrator_logs_events` (Events) | 365 Tage | Compliance-Anforderungen |

---

### **7.2 Purge-Strategie**

**Automatische Purge:**
- **Täglich:** Raw-Logs älter als 7 Tage werden gelöscht
- **Wöchentlich:** Indexed-Logs älter als 30 Tage werden archiviert
- **Monatlich:** Archive-Logs älter als 365 Tage werden komprimiert
- **Nie:** Analytics werden nie gelöscht (Archivierung)

**Archivierung:**
- Daten werden in separate Archiv-Tabellen verschoben
- Kompression für langfristige Speicherung
- Vollständige Nachvollziehbarkeit gewährleistet

---

## 8. Kompressionsregeln

### **8.1 Kompressions-Strategie**

**Komprimierung:**
- **Archive-Logs:** Nach 30 Tagen komprimieren (70% Reduktion)
- **Analytics:** Nach 1 Jahr komprimieren (50% Reduktion)

**Kompressions-Methode:**
- GZIP-Kompression für Text-Daten
- JSON-Kompression für strukturierte Daten
- Partitionierung für bessere Performance

---

### **8.2 Partitionierung**

**Partitionierung-Strategie:**
- **Raw-Logs:** Tages-Partitionen (automatische Archivierung)
- **Indexed-Logs:** Wochens-Partitionen (automatische Archivierung)
- **Archive-Logs:** Monats-Partitionen (automatische Kompression)

---

## 9. DSGVO-Anforderungen

### **9.1 Datenminimierung**

**Anforderungen:**
- Nur notwendige Logs sammeln
- Filterung zur Datenminimierung
- Kompression für langfristige Speicherung
- Automatische Löschung nach Retention-Zeit

---

### **9.2 Pseudonymisierung**

**Anforderungen:**
- Keine personenbezogenen Daten in Logs
- Pseudonymisierung bei notwendigen Daten (z.B. User-IDs)
- Zero-Trust UI (keine PD-Anzeige)

---

### **9.3 Audit-Trail**

**Anforderungen:**
- Audit-Hash für alle Logs (optional)
- Vollständige Protokollierung von Purge-Operationen
- Nachvollziehbarkeit aller Log-Änderungen

---

## 10. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – Datenmodell definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




