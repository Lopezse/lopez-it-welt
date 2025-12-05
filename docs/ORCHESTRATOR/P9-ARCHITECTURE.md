# P9-ARCHITECTURE

## Architektur-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Unified Operations Center (UOC) Phase P9

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige Architektur** für das Unified Operations Center (P9).

**Anforderungen:**
- **Multi-Source-Integration** – P8-C, P8-D, P8-E, Orchestrator
- **Echtzeit-Daten** – SSE/WebSockets für Live-Updates
- **Korrelation** – Logs ↔ Metrics ↔ Alerts
- **Enterprise++ Views** – Correlation, Root-Cause-Analysis, Timeline
- **Zero-Trust** – RBAC für alle Datenquellen

---

## 2. System-Architektur

### **2.1 Gesamt-Architektur**

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIFIED OPERATIONS CENTER (P9)                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PRESENTATION LAYER (UI)                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ UOC Dashboard│  │ Correlation  │  │ Root-Cause   │  │  │
│  │  │              │  │ View         │  │ Analysis View│  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐                      │  │
│  │  │ Timeline View│  │ Live-Streams │                      │  │
│  │  │              │  │ (SSE/WS)     │                      │  │
│  │  └──────────────┘  └──────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BUSINESS LAYER (Backend)                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Correlation  │  │ Data-        │  │ View-        │  │  │
│  │  │ Engine       │  │ Aggregator   │  │ Manager      │  │  │
│  │  │              │  │              │  │              │  │  │
│  │  │ - Log ↔ Metric│  │ - Multi-     │  │ - Views      │  │  │
│  │  │ - Log ↔ Alert│  │   Source     │  │ - Filters    │  │  │
│  │  │ - Metric ↔   │  │ - Correlation│  │ - Sorting    │  │  │
│  │  │   Alert      │  │ - Aggregation│  │ - Pagination │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐                      │  │
│  │  │ Live-        │  │ Root-Cause   │                      │  │
│  │  │ Streaming    │  │ Analyzer     │                      │  │
│  │  │ Manager      │  │              │                      │  │
│  │  │              │  │ - Timeline   │                      │  │
│  │  │ - SSE        │  │ - Causality  │                      │  │
│  │  │ - WebSocket  │  │ - Impact     │                      │  │
│  │  └──────────────┘  └──────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INTEGRATION LAYER                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ P8-C Client  │  │ P8-D Client  │  │ P8-E Client  │  │  │
│  │  │              │  │              │  │              │  │  │
│  │  │ - Alerts     │  │ - Metrics    │  │ - Logs       │  │  │
│  │  │ - Incidents  │  │ - Health     │  │ - Analytics  │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐                                        │  │
│  │  │ Orchestrator │                                        │  │
│  │  │ Client       │                                        │  │
│  │  │              │                                        │  │
│  │  │ - Agents     │                                        │  │
│  │  │ - Queue     │                                        │  │
│  │  │ - Events    │                                        │  │
│  │  └──────────────┘                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (P8-C, P8-D, P8-E)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ P8-C APIs    │  │ P8-D APIs    │  │ P8-E APIs    │        │
│  │              │  │              │  │              │        │
│  │ /alerts      │  │ /metrics/*   │  │ /logs        │        │
│  │ /incidents   │  │ /health      │  │ /analytics/* │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponenten-Architektur

### **3.1 Correlation Engine**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/CorrelationEngine.ts`

**Verantwortlichkeiten:**
- Log ↔ Metric Korrelation (gleiche Kategorie, Zeitraum)
- Log ↔ Alert Korrelation (Log-Regel-ID → Alert-Rule-ID)
- Metric ↔ Alert Korrelation (Metrik-Schwellwert → Alert-Regel)
- Multi-Source-Korrelation (Log + Metric + Alert)

**Funktionen:**
```typescript
class CorrelationEngine {
  // Korreliere Log mit Metric
  async correlateLogWithMetric(logId: string, metricId: string): Promise<CorrelationResult>
  
  // Korreliere Log mit Alert
  async correlateLogWithAlert(logId: string, alertId: string): Promise<CorrelationResult>
  
  // Korreliere Metric mit Alert
  async correlateMetricWithAlert(metricId: string, alertId: string): Promise<CorrelationResult>
  
  // Multi-Source-Korrelation
  async correlateMultiSource(
    logIds: string[],
    metricIds: string[],
    alertIds: string[]
  ): Promise<MultiSourceCorrelation>
  
  // Korrelations-Score berechnen
  calculateCorrelationScore(
    source1: Event,
    source2: Event,
    timeWindow: number
  ): number
}
```

**Korrelations-Kriterien:**
- **Zeitraum:** Events innerhalb von ±5 Sekunden
- **Kategorie:** Gleiche Kategorie (Security, API, Queue, etc.)
- **Resource:** Gleiche Resource-ID (falls vorhanden)
- **Correlation-ID:** Gleiche Correlation-ID (falls vorhanden)

---

### **3.2 Data Aggregator**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/DataAggregator.ts`

**Verantwortlichkeiten:**
- Multi-Source-Daten sammeln (P8-C, P8-D, P8-E, Orchestrator)
- Daten aggregieren (Zeitraum, Kategorie, Severity)
- Daten normalisieren (einheitliches Format)
- Daten cachen (Performance-Optimierung)

**Funktionen:**
```typescript
class DataAggregator {
  // Alle Datenquellen abrufen
  async aggregateAllSources(
    timeRange: TimeRange,
    filters?: UOCFilters
  ): Promise<AggregatedData>
  
  // Alerts aggregieren
  async aggregateAlerts(filters?: AlertFilters): Promise<Alert[]>
  
  // Metrics aggregieren
  async aggregateMetrics(filters?: MetricFilters): Promise<Metric[]>
  
  // Logs aggregieren
  async aggregateLogs(filters?: LogFilters): Promise<Log[]>
  
  // Incidents aggregieren
  async aggregateIncidents(filters?: IncidentFilters): Promise<Incident[]>
  
  // System-Health aggregieren
  async aggregateSystemHealth(): Promise<SystemHealth>
  
  // Daten normalisieren
  normalizeData(
    alerts: Alert[],
    metrics: Metric[],
    logs: Log[]
  ): NormalizedData
}
```

---

### **3.3 View Manager**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/ViewManager.ts`

**Verantwortlichkeiten:**
- Views verwalten (Correlation, Root-Cause-Analysis, Timeline)
- Filter verwalten (Zeitraum, Kategorie, Severity, Source)
- Sortierung verwalten (nach Zeit, Severity, Kategorie)
- Pagination verwalten (limit, offset)

**Funktionen:**
```typescript
class ViewManager {
  // Correlation View erstellen
  async createCorrelationView(
    filters: CorrelationFilters
  ): Promise<CorrelationView>
  
  // Root-Cause-Analysis View erstellen
  async createRootCauseAnalysisView(
    incidentId: string
  ): Promise<RootCauseAnalysisView>
  
  // Timeline View erstellen
  async createTimelineView(
    filters: TimelineFilters
  ): Promise<TimelineView>
  
  // Filter anwenden
  applyFilters(data: AggregatedData, filters: UOCFilters): AggregatedData
  
  // Sortierung anwenden
  applySorting(data: AggregatedData, sort: SortOptions): AggregatedData
  
  // Pagination anwenden
  applyPagination(data: AggregatedData, pagination: PaginationOptions): AggregatedData
}
```

---

### **3.4 Live Streaming Manager**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

**Verantwortlichkeiten:**
- SSE-Verbindungen verwalten
- WebSocket-Verbindungen verwalten (optional)
- Live-Updates senden (Alerts, Metrics, Logs, Health)
- Heartbeat senden (alle 30 Sekunden)

**Funktionen:**
```typescript
class LiveStreamingManager {
  // SSE-Verbindung erstellen
  createSSEConnection(
    clientId: string,
    filters?: StreamFilters
  ): SSEConnection
  
  // WebSocket-Verbindung erstellen (optional)
  createWebSocketConnection(
    clientId: string,
    filters?: StreamFilters
  ): WebSocketConnection
  
  // Live-Update senden
  sendLiveUpdate(
    connectionId: string,
    eventType: 'alert' | 'metric' | 'log' | 'health' | 'incident',
    data: unknown
  ): void
  
  // Heartbeat senden
  sendHeartbeat(connectionId: string): void
  
  // Verbindung schließen
  closeConnection(connectionId: string): void
}
```

---

### **3.5 Root-Cause Analyzer**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/RootCauseAnalyzer.ts`

**Verantwortlichkeiten:**
- Root-Cause identifizieren (kausale Zusammenhänge)
- Impact-Analyse (Auswirkungen auf System)
- Timeline erstellen (chronologische Ereignis-Übersicht)
- Lösung-Vorschläge (basierend auf Patterns)

**Funktionen:**
```typescript
class RootCauseAnalyzer {
  // Root-Cause identifizieren
  async identifyRootCause(
    incidentId: string
  ): Promise<RootCauseAnalysis>
  
  // Impact-Analyse
  async analyzeImpact(
    rootCause: Event,
    events: Event[]
  ): Promise<ImpactAnalysis>
  
  // Timeline erstellen
  async createTimeline(
    events: Event[]
  ): Promise<Timeline>
  
  // Lösung-Vorschläge
  async suggestSolutions(
    rootCause: Event,
    impact: ImpactAnalysis
  ): Promise<Solution[]>
  
  // Kausale Zusammenhänge identifizieren
  identifyCausalRelationships(
    events: Event[]
  ): CausalRelationship[]
}
```

---

## 4. Datenfluss

### **4.1 Dashboard-Datenfluss**

```
User öffnet UOC Dashboard
    │
    ▼
DataAggregator.aggregateAllSources()
    │
    ├─→ P8-C API: GET /api/orchestrator/alerts
    ├─→ P8-C API: GET /api/orchestrator/incidents
    ├─→ P8-D API: GET /api/orchestrator/metrics/live
    ├─→ P8-D API: GET /api/orchestrator/metrics/health
    ├─→ P8-E API: GET /api/orchestrator/logs
    └─→ Orchestrator API: GET /api/orchestrator/queue/status
    │
    ▼
ViewManager.createDashboardView()
    │
    ├─→ Filter anwenden
    ├─→ Sortierung anwenden
    └─→ Pagination anwenden
    │
    ▼
UI rendert Dashboard
```

---

### **4.2 Live-Streaming-Datenfluss**

```
User öffnet Live-Stream
    │
    ▼
LiveStreamingManager.createSSEConnection()
    │
    ▼
SSE-Endpoint: GET /api/orchestrator/uoc/stream/alerts
    │
    ├─→ P8-C Event: Neuer Alert
    ├─→ P8-D Event: Neue Metrik
    ├─→ P8-E Event: Neuer Log
    └─→ Orchestrator Event: Neuer Task
    │
    ▼
LiveStreamingManager.sendLiveUpdate()
    │
    ▼
Client empfängt Live-Update (EventSource API)
    │
    ▼
UI aktualisiert automatisch
```

---

### **4.3 Correlation-Datenfluss**

```
User öffnet Correlation View
    │
    ▼
DataAggregator.aggregateAllSources()
    │
    ├─→ Alerts abrufen
    ├─→ Metrics abrufen
    └─→ Logs abrufen
    │
    ▼
CorrelationEngine.correlateMultiSource()
    │
    ├─→ Log ↔ Metric Korrelation
    ├─→ Log ↔ Alert Korrelation
    └─→ Metric ↔ Alert Korrelation
    │
    ▼
ViewManager.createCorrelationView()
    │
    ▼
UI rendert Correlation View (Sankey-Diagramm)
```

---

## 5. Integration mit bestehenden Systemen

### **5.1 P8-C Integration**

**APIs:**
- `GET /api/orchestrator/alerts` – Alerts abrufen
- `GET /api/orchestrator/incidents` – Incidents abrufen
- `GET /api/orchestrator/alerts/[id]` – Alert-Detail
- `GET /api/orchestrator/incidents/[id]` – Incident-Detail

**Client:**
- `src/lib/ki-orchestrator/level2/uoc/clients/AlertClient.ts`
- `src/lib/ki-orchestrator/level2/uoc/clients/IncidentClient.ts`

**Korrelation:**
- Alert ↔ Log (Alert-Rule-ID → Log-Regel-ID)
- Alert ↔ Metric (Alert-Kategorie → Metrik-Kategorie)
- Incident ↔ Alert (Incident enthält Alerts)

---

### **5.2 P8-D Integration**

**APIs:**
- `GET /api/orchestrator/metrics/live` – Live-Metriken
- `GET /api/orchestrator/metrics/system` – System-Metriken
- `GET /api/orchestrator/metrics/api-performance` – API-Performance
- `GET /api/orchestrator/metrics/queue` – Queue-Status
- `GET /api/orchestrator/metrics/db` – DB-Metriken
- `GET /api/orchestrator/metrics/health` – Health-Status

**Client:**
- `src/lib/ki-orchestrator/level2/uoc/clients/MetricClient.ts`
- `src/lib/ki-orchestrator/level2/uoc/clients/HealthClient.ts`

**Korrelation:**
- Metric ↔ Log (Metrik-Kategorie → Log-Kategorie)
- Metric ↔ Alert (Metrik-Schwellwert → Alert-Regel)

---

### **5.3 P8-E Integration**

**APIs:**
- `GET /api/orchestrator/logs` – Logs abrufen
- `GET /api/orchestrator/logs/[id]` – Log-Detail
- `POST /api/orchestrator/logs/search` – Erweiterte Suche
- `GET /api/orchestrator/logs/analytics/trends` – Trends
- `GET /api/orchestrator/logs/analytics/patterns` – Patterns
- `GET /api/orchestrator/logs/analytics/anomalies` – Anomalies

**Client:**
- `src/lib/ki-orchestrator/level2/uoc/clients/LogClient.ts`
- `src/lib/ki-orchestrator/level2/uoc/clients/AnalyticsClient.ts`

**Korrelation:**
- Log ↔ Alert (Log-Regel-ID → Alert-Rule-ID)
- Log ↔ Metric (Log-Kategorie → Metrik-Kategorie)

---

### **5.4 Orchestrator Integration**

**APIs:**
- `GET /api/orchestrator/agents` – Agenten-Liste
- `GET /api/orchestrator/queue/status` – Queue-Status
- `GET /api/orchestrator/events` – Events-Liste

**Client:**
- `src/lib/ki-orchestrator/level2/uoc/clients/OrchestratorClient.ts`

**Korrelation:**
- Orchestrator-Events ↔ Logs (Event → Log)
- Orchestrator-Events ↔ Alerts (Event → Alert)

---

## 6. RBAC-Integration

### **6.1 Berechtigungen**

**monitoring.view:**
- System-Health anzeigen
- Metrics anzeigen
- Performance-Daten anzeigen

**logs.view:**
- Logs anzeigen
- Log-Analytics anzeigen
- Log-Suche verwenden

**security.view:**
- Alerts anzeigen
- Incidents anzeigen
- Security-Events anzeigen

**security.manage:**
- Alerts verwalten (Acknowledge, Escalate)
- Incidents verwalten (Öffnen, Schließen)

**orchestrator.manage:**
- Orchestrator-Status verwalten
- Queue verwalten
- Agents verwalten

---

### **6.2 Zero-Trust UI**

**Implementierung:**
- Alle Datenquellen prüfen Berechtigungen vor dem Laden
- Buttons/Aktionen abhängig von Berechtigungen
- Keine Daten ohne Berechtigung anzeigen
- ErrorBanner bei fehlender Berechtigung

---

## 7. DSGVO/DSFA-Konformität

### **7.1 DSGVO-Anforderungen**

- ✅ **Keine PD in UOC** – Alle Daten sind bereits PD-frei (P8-C, P8-D, P8-E)
- ✅ **PD-Filter aktiv** – Automatisch durch P8-E LogFilter
- ✅ **Zero-Trust UI** – Keine PD-Anzeige, Buttons/Aktionen abhängig von Berechtigungen
- ✅ **Retention-Policy** – Automatisch durch P8-E RetentionManager

### **7.2 DSFA-Anforderungen**

- ✅ **DSFA-Hinweise** – Bei High/Critical-Risk-Logs/Alerts
- ✅ **Compliance-Monitoring** – Automatische Prüfung auf DSGVO/DSFA-Verstöße
- ✅ **Audit-Trail** – Vollständige Protokollierung aller UOC-Aktionen

---

## 8. Performance-Optimierung

### **8.1 Caching**

- **Data-Aggregation:** Cache für 5 Sekunden (Live-Daten)
- **Correlation:** Cache für 30 Sekunden (Korrelations-Ergebnisse)
- **Views:** Cache für 10 Sekunden (View-Daten)

### **8.2 Lazy Loading**

- **Komponenten:** Lazy Loading für große Komponenten
- **Daten:** Lazy Loading für historische Daten
- **Charts:** Lazy Loading für Grafiken

### **8.3 Code Splitting**

- **Routes:** Code Splitting pro Route
- **Komponenten:** Code Splitting für große Komponenten
- **Charts:** Code Splitting für Chart-Bibliotheken

---

## 9. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – P9-Architecture erstellt

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG*




