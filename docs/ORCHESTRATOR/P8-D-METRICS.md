# P8-D-METRICS

## Enterprise++ Metriken-Definition – 42 Metriken

### Lopez IT Welt – Orchestrator Level 2 Phase P8-D

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **42 Enterprise++-Metriken** für das Telemetrie & Monitoring-System (P8-D).

**Anforderungen:**
- **42 Metriken** nach Enterprise++ Standard
- **Kategorien:** System, CPU, RAM, Disk, API-Runtimes, Queue-Tiefe, Media-KI, Orchestrator-Load, DB-SlowQuery, Error-Rates, Cache-Hitrates
- **Prioritätsleveln** definiert
- **DSFA-Relevanz** für alle Metriken

---

## 2. Metrik-Struktur

### **2.1 Standard-Struktur**

Jede Metrik enthält:

| Feld | Beschreibung | Beispiel |
|------|-------------|----------|
| **ID** | Eindeutige Metrik-ID | `SYS-CPU-001` |
| **Name** | Metrik-Name | `CPU Usage` |
| **Kategorie** | Metrik-Kategorie | `System` |
| **Typ** | Metrik-Typ | `gauge`, `counter`, `histogram` |
| **Einheit** | Metrik-Einheit | `percent`, `bytes`, `milliseconds` |
| **Sammlung-Intervall** | Sammlung-Intervall | `5s`, `1s`, `on-demand` |
| **Priorität** | Prioritätslevel | `P1`, `P2`, `P3`, `P4` |
| **DSFA-Relevanz** | DSFA-Bezug | `High`, `Medium`, `Low`, `None` |
| **Schwellwerte** | Alert-Schwellwerte | `warning: 80%`, `critical: 90%` |

---

## 3. System-Metriken (10 Metriken)

### **3.1 SYS-001: CPU Usage**

**ID:** `SYS-001`  
**Name:** `CPU Usage`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 80%`, `critical: 90%`

**Beschreibung:**  
CPU-Auslastung in Prozent. Wird alle 5 Sekunden gesammelt.

---

### **3.2 SYS-002: CPU Load Average (1 Min)**

**ID:** `SYS-002`  
**Name:** `CPU Load Average (1 Min)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `load`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 2.0`, `critical: 4.0`

**Beschreibung:**  
CPU-Load-Average für 1 Minute. Wird alle 5 Sekunden gesammelt.

---

### **3.3 SYS-003: CPU Load Average (5 Min)**

**ID:** `SYS-003`  
**Name:** `CPU Load Average (5 Min)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `load`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 2.0`, `critical: 4.0`

**Beschreibung:**  
CPU-Load-Average für 5 Minuten. Wird alle 5 Sekunden gesammelt.

---

### **3.4 SYS-004: RAM Usage**

**ID:** `SYS-004`  
**Name:** `RAM Usage`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 85%`, `critical: 95%`

**Beschreibung:**  
RAM-Auslastung in Prozent. Wird alle 5 Sekunden gesammelt.

---

### **3.5 SYS-005: RAM Used (Bytes)**

**ID:** `SYS-005`  
**Name:** `RAM Used (Bytes)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `bytes`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 8GB`, `critical: 12GB`

**Beschreibung:**  
Verwendeter RAM in Bytes. Wird alle 5 Sekunden gesammelt.

---

### **3.6 SYS-006: RAM Available (Bytes)**

**ID:** `SYS-006`  
**Name:** `RAM Available (Bytes)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `bytes`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: <2GB`, `critical: <1GB`

**Beschreibung:**  
Verfügbarer RAM in Bytes. Wird alle 5 Sekunden gesammelt.

---

### **3.7 SYS-007: Disk Usage**

**ID:** `SYS-007`  
**Name:** `Disk Usage`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 85%`, `critical: 95%`

**Beschreibung:**  
Disk-Auslastung in Prozent. Wird alle 10 Sekunden gesammelt.

---

### **3.8 SYS-008: Disk Used (Bytes)**

**ID:** `SYS-008`  
**Name:** `Disk Used (Bytes)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `bytes`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 200GB`, `critical: 250GB`

**Beschreibung:**  
Verwendeter Disk-Speicher in Bytes. Wird alle 10 Sekunden gesammelt.

---

### **3.9 SYS-009: Disk Available (Bytes)**

**ID:** `SYS-009`  
**Name:** `Disk Available (Bytes)`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `bytes`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: <50GB`, `critical: <20GB`

**Beschreibung:**  
Verfügbarer Disk-Speicher in Bytes. Wird alle 10 Sekunden gesammelt.

---

### **3.10 SYS-010: Network Usage**

**ID:** `SYS-010`  
**Name:** `Network Usage`  
**Kategorie:** `System`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P3`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 80%`, `critical: 95%`

**Beschreibung:**  
Netzwerk-Auslastung in Prozent. Wird alle 5 Sekunden gesammelt.

---

## 4. API-Performance-Metriken (8 Metriken)

### **4.1 API-001: API Request Rate**

**ID:** `API-001`  
**Name:** `API Request Rate`  
**Kategorie:** `API-Performance`  
**Typ:** `counter`  
**Einheit:** `requests/second`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 1000 req/s`, `critical: 2000 req/s`

**Beschreibung:**  
API-Request-Rate pro Sekunde. Wird bei jedem Request gesammelt.

---

### **4.2 API-002: API Response Time (P50)**

**ID:** `API-002`  
**Name:** `API Response Time (P50)`  
**Kategorie:** `API-Performance`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 500ms`, `critical: 2000ms`

**Beschreibung:**  
API-Response-Time (50. Perzentil). Wird bei jedem Request gesammelt.

---

### **4.3 API-003: API Response Time (P95)**

**ID:** `API-003`  
**Name:** `API Response Time (P95)`  
**Kategorie:** `API-Performance`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 1000ms`, `critical: 5000ms`

**Beschreibung:**  
API-Response-Time (95. Perzentil). Wird bei jedem Request gesammelt.

---

### **4.4 API-004: API Response Time (P99)**

**ID:** `API-004`  
**Name:** `API Response Time (P99)`  
**Kategorie:** `API-Performance`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 2000ms`, `critical: 10000ms`

**Beschreibung:**  
API-Response-Time (99. Perzentil). Wird bei jedem Request gesammelt.

---

### **4.5 API-005: API Error Rate**

**ID:** `API-005`  
**Name:** `API Error Rate`  
**Kategorie:** `API-Performance`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 1%`, `critical: 5%`

**Beschreibung:**  
API-Fehlerrate in Prozent. Wird bei jedem Request gesammelt.

---

### **4.6 API-006: API 4xx Error Rate**

**ID:** `API-006`  
**Name:** `API 4xx Error Rate`  
**Kategorie:** `API-Performance`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 2%`, `critical: 5%`

**Beschreibung:**  
API-4xx-Fehlerrate in Prozent. Wird bei jedem Request gesammelt.

---

### **4.7 API-007: API 5xx Error Rate**

**ID:** `API-007`  
**Name:** `API 5xx Error Rate`  
**Kategorie:** `API-Performance`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 0.5%`, `critical: 2%`

**Beschreibung:**  
API-5xx-Fehlerrate in Prozent. Wird bei jedem Request gesammelt.

---

### **4.8 API-008: API Timeout Rate**

**ID:** `API-008`  
**Name:** `API Timeout Rate`  
**Kategorie:** `API-Performance`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `1s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 0.1%`, `critical: 1%`

**Beschreibung:**  
API-Timeout-Rate in Prozent. Wird bei jedem Request gesammelt.

---

## 5. Queue-Metriken (5 Metriken)

### **5.1 QUEUE-001: Queue Depth**

**ID:** `QUEUE-001`  
**Name:** `Queue Depth`  
**Kategorie:** `Queue`  
**Typ:** `gauge`  
**Einheit:** `tasks`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 500`, `critical: 1000`

**Beschreibung:**  
Anzahl der Tasks in der Queue. Wird alle 5 Sekunden gesammelt.

---

### **5.2 QUEUE-002: Queue Throughput**

**ID:** `QUEUE-002`  
**Name:** `Queue Throughput`  
**Kategorie:** `Queue`  
**Typ:** `counter`  
**Einheit:** `tasks/second`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: <10 tasks/s`, `critical: <5 tasks/s`

**Beschreibung:**  
Queue-Durchsatz (Tasks pro Sekunde). Wird alle 5 Sekunden gesammelt.

---

### **5.3 QUEUE-003: Queue Wait Time (Avg)**

**ID:** `QUEUE-003`  
**Name:** `Queue Wait Time (Avg)`  
**Kategorie:** `Queue`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 5000ms`, `critical: 30000ms`

**Beschreibung:**  
Durchschnittliche Wartezeit in der Queue. Wird alle 5 Sekunden gesammelt.

---

### **5.4 QUEUE-004: Queue Processing Time (Avg)**

**ID:** `QUEUE-004`  
**Name:** `Queue Processing Time (Avg)`  
**Kategorie:** `Queue`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 10000ms`, `critical: 60000ms`

**Beschreibung:**  
Durchschnittliche Verarbeitungszeit in der Queue. Wird alle 5 Sekunden gesammelt.

---

### **5.5 QUEUE-005: Queue Failed Tasks**

**ID:** `QUEUE-005`  
**Name:** `Queue Failed Tasks`  
**Kategorie:** `Queue`  
**Typ:** `counter`  
**Einheit:** `tasks`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: >10 tasks/h`, `critical: >50 tasks/h`

**Beschreibung:**  
Anzahl fehlgeschlagener Tasks in der Queue. Wird alle 5 Sekunden gesammelt.

---

## 6. Media-KI-Metriken (5 Metriken)

### **6.1 MEDIA-001: Media-KI Processing Time (Avg)**

**ID:** `MEDIA-001`  
**Name:** `Media-KI Processing Time (Avg)`  
**Kategorie:** `Media-KI`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `on-demand`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 5000ms`, `critical: 30000ms`

**Beschreibung:**  
Durchschnittliche Verarbeitungszeit für Media-KI-Tasks. Wird bei jedem Request gesammelt.

---

### **6.2 MEDIA-002: Media-KI Success Rate**

**ID:** `MEDIA-002`  
**Name:** `Media-KI Success Rate`  
**Kategorie:** `Media-KI`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `on-demand`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: <95%`, `critical: <90%`

**Beschreibung:**  
Erfolgsrate für Media-KI-Tasks. Wird bei jedem Request gesammelt.

---

### **6.3 MEDIA-003: Media-KI Person Detection Rate**

**ID:** `MEDIA-003`  
**Name:** `Media-KI Person Detection Rate`  
**Kategorie:** `Media-KI`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `on-demand`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: >10%`, `critical: >20%`

**Beschreibung:**  
Rate der Personen-Erkennung in Media-KI-Tasks. Wird bei jedem Request gesammelt.

---

### **6.4 MEDIA-004: Media-KI Provider Latency**

**ID:** `MEDIA-004`  
**Name:** `Media-KI Provider Latency`  
**Kategorie:** `Media-KI`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `on-demand`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 3000ms`, `critical: 10000ms`

**Beschreibung:**  
Latenz zum Media-KI-Provider (OpenAI). Wird bei jedem Request gesammelt.

---

### **6.5 MEDIA-005: Media-KI Cost per Request**

**ID:** `MEDIA-005`  
**Name:** `Media-KI Cost per Request`  
**Kategorie:** `Media-KI`  
**Typ:** `gauge`  
**Einheit:** `euros`  
**Sammlung-Intervall:** `on-demand`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: >0.10€`, `critical: >0.50€`

**Beschreibung:**  
Kosten pro Media-KI-Request. Wird bei jedem Request gesammelt.

---

## 7. Orchestrator-Metriken (6 Metriken)

### **7.1 ORCH-001: Orchestrator Load**

**ID:** `ORCH-001`  
**Name:** `Orchestrator Load`  
**Kategorie:** `Orchestrator`  
**Typ:** `gauge`  
**Einheit:** `tasks/active`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 50`, `critical: 100`

**Beschreibung:**  
Anzahl aktiver Tasks im Orchestrator. Wird alle 5 Sekunden gesammelt.

---

### **7.2 ORCH-002: Orchestrator Task Rate**

**ID:** `ORCH-002`  
**Name:** `Orchestrator Task Rate`  
**Kategorie:** `Orchestrator`  
**Typ:** `counter`  
**Einheit:** `tasks/second`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: >100 tasks/s`, `critical: >200 tasks/s`

**Beschreibung:**  
Task-Rate im Orchestrator (Tasks pro Sekunde). Wird alle 5 Sekunden gesammelt.

---

### **7.3 ORCH-003: Orchestrator Agent Performance (Avg)**

**ID:** `ORCH-003`  
**Name:** `Orchestrator Agent Performance (Avg)`  
**Kategorie:** `Orchestrator`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 2000ms`, `critical: 10000ms`

**Beschreibung:**  
Durchschnittliche Agent-Performance im Orchestrator. Wird alle 5 Sekunden gesammelt.

---

### **7.4 ORCH-004: Orchestrator Trigger Fire Rate**

**ID:** `ORCH-004`  
**Name:** `Orchestrator Trigger Fire Rate`  
**Kategorie:** `Orchestrator`  
**Typ:** `counter`  
**Einheit:** `triggers/second`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: >50 triggers/s`, `critical: >100 triggers/s`

**Beschreibung:**  
Trigger-Fire-Rate im Orchestrator. Wird alle 5 Sekunden gesammelt.

---

### **7.5 ORCH-005: Orchestrator Workflow Execution Rate**

**ID:** `ORCH-005`  
**Name:** `Orchestrator Workflow Execution Rate`  
**Kategorie:** `Orchestrator`  
**Typ:** `counter`  
**Einheit:** `workflows/second`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: >10 workflows/s`, `critical: >20 workflows/s`

**Beschreibung:**  
Workflow-Execution-Rate im Orchestrator. Wird alle 5 Sekunden gesammelt.

---

### **7.6 ORCH-006: Orchestrator P7-Approval Block Rate**

**ID:** `ORCH-006`  
**Name:** `Orchestrator P7-Approval Block Rate`  
**Kategorie:** `Orchestrator`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: >5%`, `critical: >10%`

**Beschreibung:**  
Rate der P7-Approval-Blockierungen im Orchestrator. Wird alle 5 Sekunden gesammelt.

---

## 8. Datenbank-Metriken (5 Metriken)

### **8.1 DB-001: DB Connection Pool Usage**

**ID:** `DB-001`  
**Name:** `DB Connection Pool Usage`  
**Kategorie:** `Database`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: 80%`, `critical: 95%`

**Beschreibung:**  
Auslastung des DB-Connection-Pools. Wird alle 10 Sekunden gesammelt.

---

### **8.2 DB-002: DB Slow Query Count**

**ID:** `DB-002`  
**Name:** `DB Slow Query Count`  
**Kategorie:** `Database`  
**Typ:** `counter`  
**Einheit:** `queries`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: >10 queries/h`, `critical: >50 queries/h`

**Beschreibung:**  
Anzahl langsamer Queries (>1 Sekunde). Wird alle 10 Sekunden gesammelt.

---

### **8.3 DB-003: DB Slow Query Time (Avg)**

**ID:** `DB-003`  
**Name:** `DB Slow Query Time (Avg)`  
**Kategorie:** `Database`  
**Typ:** `histogram`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P1`  
**DSFA-Relevanz:** `High`  
**Schwellwerte:** `warning: 2000ms`, `critical: 10000ms`

**Beschreibung:**  
Durchschnittliche Ausführungszeit langsamer Queries. Wird alle 10 Sekunden gesammelt.

---

### **8.4 DB-004: DB Query Rate**

**ID:** `DB-004`  
**Name:** `DB Query Rate`  
**Kategorie:** `Database`  
**Typ:** `counter`  
**Einheit:** `queries/second`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Medium`  
**Schwellwerte:** `warning: >500 queries/s`, `critical: >1000 queries/s`

**Beschreibung:**  
DB-Query-Rate (Queries pro Sekunde). Wird alle 10 Sekunden gesammelt.

---

### **8.5 DB-005: DB Replication Lag**

**ID:** `DB-005`  
**Name:** `DB Replication Lag`  
**Kategorie:** `Database`  
**Typ:** `gauge`  
**Einheit:** `milliseconds`  
**Sammlung-Intervall:** `10s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 1000ms`, `critical: 5000ms`

**Beschreibung:**  
Replication-Lag zwischen Master und Slave (falls vorhanden). Wird alle 10 Sekunden gesammelt.

---

## 9. Cache-Metriken (3 Metriken)

### **9.1 CACHE-001: Cache Hit Rate**

**ID:** `CACHE-001`  
**Name:** `Cache Hit Rate`  
**Kategorie:** `Cache`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: <80%`, `critical: <60%`

**Beschreibung:**  
Cache-Hit-Rate in Prozent. Wird alle 5 Sekunden gesammelt.

---

### **9.2 CACHE-002: Cache Miss Rate**

**ID:** `CACHE-002`  
**Name:** `Cache Miss Rate`  
**Kategorie:** `Cache`  
**Typ:** `gauge`  
**Einheit:** `percent`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P2`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: >20%`, `critical: >40%`

**Beschreibung:**  
Cache-Miss-Rate in Prozent. Wird alle 5 Sekunden gesammelt.

---

### **9.3 CACHE-003: Cache Memory Usage**

**ID:** `CACHE-003`  
**Name:** `Cache Memory Usage`  
**Kategorie:** `Cache`  
**Typ:** `gauge`  
**Einheit:** `bytes`  
**Sammlung-Intervall:** `5s`  
**Priorität:** `P3`  
**DSFA-Relevanz:** `Low`  
**Schwellwerte:** `warning: 1GB`, `critical: 2GB`

**Beschreibung:**  
Cache-Speicherverbrauch in Bytes. Wird alle 5 Sekunden gesammelt.

---

## 10. Metriken-Übersicht

### **10.1 Nach Kategorie**

| Kategorie | Anzahl | P1 | P2 | P3 | P4 |
|-----------|--------|----|----|----|----|
| **System** | 10 | 6 | 4 | 0 | 0 |
| **API-Performance** | 8 | 5 | 3 | 0 | 0 |
| **Queue** | 5 | 5 | 0 | 0 | 0 |
| **Media-KI** | 5 | 3 | 2 | 0 | 0 |
| **Orchestrator** | 6 | 3 | 3 | 0 | 0 |
| **Database** | 5 | 3 | 2 | 0 | 0 |
| **Cache** | 3 | 0 | 2 | 1 | 0 |
| **Gesamt** | **42** | **25** | **16** | **1** | **0** |

---

### **10.2 Nach DSFA-Relevanz**

| DSFA-Relevanz | Anzahl | P1 | P2 | P3 |
|---------------|--------|----|----|----|
| **High** | 12 | 10 | 2 | 0 |
| **Medium** | 18 | 12 | 6 | 0 |
| **Low** | 12 | 3 | 8 | 1 |
| **None** | 0 | 0 | 0 | 0 |

---

## 11. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – 42 Metriken definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




