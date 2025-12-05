# P8-C-DATA-MODEL

## Datenmodell – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-C

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert das **vollständige Datenmodell** für das Alert & Incident-Handling-System (P8-C).

**Anforderungen:**
- **Tabellen-Schema** für Alerts & Incidents
- **JSON-Modelle** für alle Datenstrukturen
- **Beziehungen** zwischen Tabellen
- **Integritätsregeln** definiert
- **Index-Strategie** optimiert
- **Purge-&-Retention-Policy** (DSGVO-konform)

---

## 2. Tabellen-Schema

### **2.1 orchestrator_alerts**

**Beschreibung:** Speichert alle Alerts im System

**Schema:**
```sql
CREATE TABLE orchestrator_alerts (
    id VARCHAR(255) PRIMARY KEY,
    alert_rule_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    status ENUM('open', 'acknowledged', 'escalated', 'closed', 'ignored') NOT NULL DEFAULT 'open',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    payload JSON,
    event_type VARCHAR(100),
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    acknowledged_by VARCHAR(255) NULL,
    escalated_at TIMESTAMP NULL,
    escalated_by VARCHAR(255) NULL,
    closed_at TIMESTAMP NULL,
    closed_by VARCHAR(255) NULL,
    incident_id VARCHAR(255) NULL,
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_alert_rule_id (alert_rule_id),
    INDEX idx_category (category),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_triggered_at (triggered_at),
    INDEX idx_incident_id (incident_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### **2.2 orchestrator_incidents**

**Beschreibung:** Speichert alle Incidents im System

**Schema:**
```sql
CREATE TABLE orchestrator_incidents (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity ENUM('info', 'warning', 'critical') NOT NULL,
    status ENUM('open', 'investigating', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    assigned_to VARCHAR(255) NULL,
    sla_minutes INT NOT NULL,
    sla_started_at TIMESTAMP NOT NULL,
    sla_warning_at TIMESTAMP NULL,
    sla_breached_at TIMESTAMP NULL,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    opened_by VARCHAR(255) NOT NULL,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(255) NULL,
    closed_at TIMESTAMP NULL,
    closed_by VARCHAR(255) NULL,
    escalation_level INT NOT NULL DEFAULT 1,
    root_cause TEXT,
    resolution TEXT,
    post_mortem TEXT,
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_opened_at (opened_at),
    INDEX idx_sla_started_at (sla_started_at),
    INDEX idx_escalation_level (escalation_level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### **2.3 orchestrator_incident_events**

**Beschreibung:** Speichert alle Events innerhalb eines Incidents (Timeline)

**Schema:**
```sql
CREATE TABLE orchestrator_incident_events (
    id VARCHAR(255) PRIMARY KEY,
    incident_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    performed_by VARCHAR(255) NOT NULL,
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_incident_id (incident_id),
    INDEX idx_event_type (event_type),
    INDEX idx_performed_at (performed_at),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. JSON-Modelle

### **3.1 Alert-Modell**

```json
{
  "id": "alert-1234567890",
  "alert_rule_id": "SEC-001",
  "category": "Security",
  "severity": "critical",
  "status": "open",
  "title": "Unberechtigter Zugriff erkannt",
  "description": "Versuchter Zugriff auf Orchestrator-Ressource ohne Berechtigung",
  "payload": {
    "user_id": "user-123",
    "resource": "orchestrator.trigger",
    "action": "create",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
  },
  "event_type": "SECURITY_UNAUTHORIZED_ACCESS",
  "resource_type": "orchestrator",
  "resource_id": "trigger-123",
  "triggered_at": "2025-11-28T10:00:00Z",
  "acknowledged_at": null,
  "acknowledged_by": null,
  "escalated_at": null,
  "escalated_by": null,
  "closed_at": null,
  "closed_by": null,
  "incident_id": null,
  "audit_hash": "abc123...",
  "created_at": "2025-11-28T10:00:00Z",
  "updated_at": "2025-11-28T10:00:00Z"
}
```

---

### **3.2 Incident-Modell**

```json
{
  "id": "incident-1234567890",
  "title": "Sicherheitsverletzung: Unberechtigter Zugriff",
  "description": "Mehrfache Versuche auf Orchestrator-Ressourcen ohne Berechtigung",
  "severity": "critical",
  "status": "investigating",
  "assigned_to": "security-officer-123",
  "sla_minutes": 15,
  "sla_started_at": "2025-11-28T10:00:00Z",
  "sla_warning_at": "2025-11-28T10:12:00Z",
  "sla_breached_at": null,
  "opened_at": "2025-11-28T10:00:00Z",
  "opened_by": "security-officer-123",
  "resolved_at": null,
  "resolved_by": null,
  "closed_at": null,
  "closed_by": null,
  "escalation_level": 1,
  "root_cause": null,
  "resolution": null,
  "post_mortem": null,
  "audit_hash": "def456...",
  "created_at": "2025-11-28T10:00:00Z",
  "updated_at": "2025-11-28T10:00:00Z"
}
```

---

### **3.3 Incident-Event-Modell**

```json
{
  "id": "event-1234567890",
  "incident_id": "incident-1234567890",
  "event_type": "INCIDENT_OPENED",
  "event_data": {
    "alert_id": "alert-1234567890",
    "severity": "critical",
    "reason": "Automatische Eskalation"
  },
  "performed_by": "system",
  "performed_at": "2025-11-28T10:00:00Z",
  "audit_hash": "ghi789...",
  "created_at": "2025-11-28T10:00:00Z"
}
```

---

## 4. Beziehungen

### **4.1 Alert ↔ Incident**

**Beziehung:** 1:N (Ein Incident kann mehrere Alerts haben)

**Foreign Key:**
- `orchestrator_alerts.incident_id` → `orchestrator_incidents.id`

**Cascade:**
- `ON DELETE SET NULL` (Alert bleibt erhalten, wenn Incident gelöscht wird)

---

### **4.2 Incident ↔ Incident-Event**

**Beziehung:** 1:N (Ein Incident hat mehrere Events)

**Foreign Key:**
- `orchestrator_incident_events.incident_id` → `orchestrator_incidents.id`

**Cascade:**
- `ON DELETE CASCADE` (Events werden gelöscht, wenn Incident gelöscht wird)

---

## 5. Integritätsregeln

### **5.1 Alert-Integrität**

**Regeln:**
- `alert_rule_id` muss existieren (Referenz auf Alert-Rule)
- `severity` muss einer der Werte sein: `info`, `warning`, `critical`
- `status` muss einer der Werte sein: `open`, `acknowledged`, `escalated`, `closed`, `ignored`
- `incident_id` muss existieren, wenn `status = 'escalated'`
- `acknowledged_at` muss gesetzt sein, wenn `status = 'acknowledged'`
- `escalated_at` muss gesetzt sein, wenn `status = 'escalated'`
- `closed_at` muss gesetzt sein, wenn `status = 'closed'`

---

### **5.2 Incident-Integrität**

**Regeln:**
- `severity` muss einer der Werte sein: `info`, `warning`, `critical`
- `status` muss einer der Werte sein: `open`, `investigating`, `resolved`, `closed`
- `escalation_level` muss zwischen 1 und 3 sein
- `sla_minutes` muss > 0 sein
- `resolved_at` muss gesetzt sein, wenn `status = 'resolved'`
- `closed_at` muss gesetzt sein, wenn `status = 'closed'`
- `resolved_at` muss vor `closed_at` sein (wenn beide gesetzt)

---

### **5.3 Incident-Event-Integrität**

**Regeln:**
- `incident_id` muss existieren
- `event_type` muss einer der definierten Event-Typen sein
- `performed_by` muss nicht leer sein

---

## 6. Index-Strategie

### **6.1 Alert-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_alert_rule_id` | `alert_rule_id` | Schnelle Suche nach Alert-Rule |
| `idx_category` | `category` | Filterung nach Kategorie |
| `idx_severity` | `severity` | Filterung nach Schweregrad |
| `idx_status` | `status` | Filterung nach Status |
| `idx_triggered_at` | `triggered_at` | Zeitbasierte Abfragen |
| `idx_incident_id` | `incident_id` | Join mit Incidents |
| `idx_created_at` | `created_at` | Purge-Strategie |

---

### **6.2 Incident-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_severity` | `severity` | Filterung nach Schweregrad |
| `idx_status` | `status` | Filterung nach Status |
| `idx_assigned_to` | `assigned_to` | Suche nach Assignee |
| `idx_opened_at` | `opened_at` | Zeitbasierte Abfragen |
| `idx_sla_started_at` | `sla_started_at` | SLA-Monitoring |
| `idx_escalation_level` | `escalation_level` | Filterung nach Eskalations-Level |
| `idx_created_at` | `created_at` | Purge-Strategie |

---

### **6.3 Incident-Event-Indizes**

| Index | Spalten | Zweck |
|-------|---------|-------|
| `idx_incident_id` | `incident_id` | Join mit Incidents |
| `idx_event_type` | `event_type` | Filterung nach Event-Typ |
| `idx_performed_at` | `performed_at` | Timeline-Sortierung |
| `idx_created_at` | `created_at` | Purge-Strategie |

---

## 7. Purge-&-Retention-Policy (DSGVO)

### **7.1 Retention-Zeiten**

| Tabelle | Retention-Zeit | Grund |
|---------|---------------|-------|
| `orchestrator_alerts` | 90 Tage | DSGVO-konform, Audit-Anforderungen |
| `orchestrator_incidents` | 365 Tage | Compliance-Anforderungen, Post-Mortem |
| `orchestrator_incident_events` | 365 Tage | Timeline-Erhaltung, Audit-Anforderungen |

---

### **7.2 Purge-Strategie**

**Automatische Purge:**
- **Täglich:** Alerts älter als 90 Tage werden gelöscht
- **Wöchentlich:** Incidents älter als 365 Tage werden archiviert (nicht gelöscht)
- **Monatlich:** Incident-Events älter als 365 Tage werden archiviert

**Archivierung:**
- Daten werden in separate Archiv-Tabellen verschoben
- Audit-Hash bleibt erhalten
- Vollständige Nachvollziehbarkeit gewährleistet

---

### **7.3 DSGVO-Anforderungen**

**Anforderungen:**
- Keine personenbezogenen Daten in Alerts/Incidents
- Pseudonymisierung bei notwendigen Daten
- Automatische Löschung nach Retention-Zeit
- Audit-Hash für alle Löschungen
- Vollständige Protokollierung

---

## 8. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – Datenmodell definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




