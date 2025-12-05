# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P9 Phase 1: Backend-Komponenten

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P9 Phase 1 (Backend-Komponenten) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Planung:**
- ✅ P9-OVERVIEW.md – Gesamtübersicht
- ✅ P9-ARCHITECTURE.md – Architektur
- ✅ P9-COMPONENTS.md – Komponenten-Spezifikation
- ✅ P9-PAGES.md – Seiten-Spezifikation
- ✅ P9-API-SPEC.md – API-Spezifikation
- ✅ P9-INTEGRATION.md – Integration-Details
- ✅ P9-HANDBOOK-FOR-BUILDER.md – Implementierungs-Handbuch

**Bereits produktionsreif:**
- ✅ P8-C (Alerts & Incidents) – APIs verfügbar
- ✅ P8-D (Telemetrie & Monitoring) – APIs verfügbar
- ✅ P8-E (Log Processing & Analytics) – APIs verfügbar
- ✅ Orchestrator Level 2 – APIs verfügbar

---

## 🎯 ZU IMPLEMENTIEREN

### **1. CorrelationEngine.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/CorrelationEngine.ts`

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
    timeWindow: number // Standard: 5 Sekunden
  ): number
}
```

**Korrelations-Kriterien:**
- **Zeitraum:** Events innerhalb von ±5 Sekunden (konfigurierbar)
- **Kategorie:** Gleiche Kategorie (Security, API, Queue, etc.)
- **Resource:** Gleiche Resource-ID (falls vorhanden)
- **Correlation-ID:** Gleiche Correlation-ID (falls vorhanden)

**Korrelations-Score-Berechnung:**
- Zeitraum: max 1.0 (1.0 - (timeDiff / timeWindow))
- Kategorie: max 0.5 (wenn gleich)
- Resource: max 0.3 (wenn gleich)
- Correlation-ID: max 0.2 (wenn gleich)
- **Schwellwert:** Score ≥ 0.5 → Korrelation wird angezeigt

**Referenzen:**
- `P9-ARCHITECTURE.md` Abschnitt 3.1
- `P9-INTEGRATION.md` Abschnitt 6

---

### **2. DataAggregator.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/DataAggregator.ts`

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

**Integration:**
- Verwendet `AlertClient`, `IncidentClient`, `MetricClient`, `HealthClient`, `LogClient`
- Parallele API-Calls (Promise.all) für Performance
- Fehlerbehandlung: Einzelne Fehler blockieren nicht alle Datenquellen

**Referenzen:**
- `P9-ARCHITECTURE.md` Abschnitt 3.2
- `P9-INTEGRATION.md` Abschnitt 2-5

---

### **3. ViewManager.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/ViewManager.ts`

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

**Integration:**
- Verwendet `DataAggregator` für Daten
- Verwendet `CorrelationEngine` für Korrelation
- Verwendet `RootCauseAnalyzer` für Root-Cause-Analyse

**Referenzen:**
- `P9-ARCHITECTURE.md` Abschnitt 3.3

---

### **4. LiveStreamingManager.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

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

**Implementierung:**
- Verwaltet aktive SSE-Verbindungen (Map<clientId, SSEConnection>)
- Heartbeat alle 30 Sekunden pro Verbindung
- Auto-Cleanup bei Verbindungsabbruch

**Referenzen:**
- `P9-ARCHITECTURE.md` Abschnitt 3.4
- `P9-API-SPEC.md` Abschnitt 4

---

### **5. RootCauseAnalyzer.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/uoc/RootCauseAnalyzer.ts`

**Funktionen:**
```typescript
class RootCauseAnalyzer {
  // Root-Cause identifizieren
  async identifyRootCause(incidentId: string): Promise<RootCauseAnalysis>
  
  // Impact-Analyse
  async analyzeImpact(
    rootCause: Event,
    events: Event[]
  ): Promise<ImpactAnalysis>
  
  // Timeline erstellen
  async createTimeline(events: Event[]): Promise<Timeline>
  
  // Lösung-Vorschläge
  async suggestSolutions(
    rootCause: Event,
    impact: ImpactAnalysis
  ): Promise<Solution[]>
  
  // Kausale Zusammenhänge identifizieren
  identifyCausalRelationships(events: Event[]): CausalRelationship[]
}
```

**Algorithmus:**
1. Incident abrufen (über `IncidentClient`)
2. Timeline erstellen (alle Events im Zeitraum)
3. Kausale Zusammenhänge identifizieren (Event A → Event B)
4. Root-Cause identifizieren (frühestes kritisches Event)
5. Impact-Analyse (Auswirkungen auf System)
6. Lösung-Vorschläge (basierend auf Patterns)

**Referenzen:**
- `P9-ARCHITECTURE.md` Abschnitt 3.5
- `P9-INTEGRATION.md` Abschnitt 7

---

### **6. Clients (Unterordner)**

**Ordner:** `src/lib/ki-orchestrator/level2/uoc/clients/`

**Zu implementieren:**

1. **AlertClient.ts**
   - `getAlerts(filters?: AlertFilters): Promise<Alert[]>`
   - `getAlert(alertId: string): Promise<Alert>`
   - `acknowledgeAlert(alertId: string): Promise<void>`
   - `escalateAlert(alertId: string): Promise<string>` // Returns incident ID
   - **API:** `GET /api/orchestrator/alerts`, `GET /api/orchestrator/alerts/[id]`, `PATCH /api/orchestrator/alerts/[id]/ack`, `POST /api/orchestrator/alerts/[id]/escalate`

2. **IncidentClient.ts**
   - `getIncidents(filters?: IncidentFilters): Promise<Incident[]>`
   - `getIncident(incidentId: string): Promise<Incident>`
   - `resolveIncident(incidentId: string): Promise<void>`
   - **API:** `GET /api/orchestrator/incidents`, `GET /api/orchestrator/incidents/[id]`, `POST /api/orchestrator/incidents/[id]/resolve`

3. **MetricClient.ts**
   - `getLiveMetrics(): Promise<Metric[]>`
   - `getSystemMetrics(): Promise<SystemMetrics>`
   - `getAPIPerformance(): Promise<APIPerformanceMetrics>`
   - `getQueueStatus(): Promise<QueueStatus>`
   - `getDBMetrics(): Promise<DBMetrics>`
   - **API:** `GET /api/orchestrator/metrics/live`, `GET /api/orchestrator/metrics/system`, `GET /api/orchestrator/metrics/api-performance`, `GET /api/orchestrator/metrics/queue`, `GET /api/orchestrator/metrics/db`

4. **HealthClient.ts**
   - `getHealthStatus(): Promise<SystemHealth>`
   - **API:** `GET /api/orchestrator/metrics/health`

5. **LogClient.ts**
   - `getLogs(filters?: LogFilters): Promise<Log[]>`
   - `getLog(logId: string): Promise<Log>`
   - `searchLogs(query: SearchQuery): Promise<Log[]>`
   - **API:** `GET /api/orchestrator/logs`, `GET /api/orchestrator/logs/[id]`, `POST /api/orchestrator/logs/search`

6. **AnalyticsClient.ts**
   - `getTrends(filters?: TrendFilters): Promise<Trend[]>`
   - `getPatterns(filters?: PatternFilters): Promise<Pattern[]>`
   - `getAnomalies(filters?: AnomalyFilters): Promise<Anomaly[]>`
   - **API:** `GET /api/orchestrator/logs/analytics/trends`, `GET /api/orchestrator/logs/analytics/patterns`, `GET /api/orchestrator/logs/analytics/anomalies`

7. **OrchestratorClient.ts**
   - `getAgents(): Promise<Agent[]>`
   - `getQueueStatus(): Promise<QueueStatus>`
   - `getEvents(filters?: EventFilters): Promise<OrchestratorEvent[]>`
   - **API:** `GET /api/orchestrator/agents`, `GET /api/orchestrator/queue/status`, `GET /api/orchestrator/events`

**Implementierung:**
- Verwenden `fetch()` für API-Calls
- Fehlerbehandlung: Try-Catch, Error-Logging
- TypeScript-Typen aus bestehenden Systemen verwenden

**Referenzen:**
- `P9-INTEGRATION.md` Abschnitt 2-5
- Bestehende API-Implementierungen (P8-C, P8-D, P8-E)

---

## ✅ ERFOLGSKRITERIEN

**Phase 1 ist produktionsreif, wenn:**
- ✅ Alle 5 Haupt-Komponenten implementiert (CorrelationEngine, DataAggregator, ViewManager, LiveStreamingManager, RootCauseAnalyzer)
- ✅ Alle 7 Clients implementiert (AlertClient, IncidentClient, MetricClient, HealthClient, LogClient, AnalyticsClient, OrchestratorClient)
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Integration mit P8-C, P8-D, P8-E APIs funktioniert
- ✅ Fehlerbehandlung korrekt (Try-Catch in allen Methoden)
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P9-HANDBOOK-FOR-BUILDER.md` – Vollständiger Implementierungsauftrag
- `P9-ARCHITECTURE.md` – Architektur-Details
- `P9-INTEGRATION.md` – Integration-Details

**Bestehende APIs:**
- P8-C: `src/app/api/orchestrator/alerts/`, `src/app/api/orchestrator/incidents/`
- P8-D: `src/app/api/orchestrator/metrics/`
- P8-E: `src/app/api/orchestrator/logs/`
- Orchestrator: `src/app/api/orchestrator/agents/`, `src/app/api/orchestrator/queue/status/`

**Bestehende Typen:**
- P8-C: `src/lib/ki-orchestrator/level2/alerts/types.ts`
- P8-D: `src/lib/telemetry/types.ts`
- P8-E: `src/lib/ki-orchestrator/level2/logs/types.ts`
- Orchestrator: `src/lib/ki-orchestrator/types.ts`

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 1 (Backend-Komponenten).**

**Reihenfolge:**
1. Clients implementieren (AlertClient, IncidentClient, MetricClient, HealthClient, LogClient, AnalyticsClient, OrchestratorClient)
2. DataAggregator implementieren (verwendet Clients)
3. CorrelationEngine implementieren (verwendet DataAggregator)
4. ViewManager implementieren (verwendet DataAggregator, CorrelationEngine)
5. RootCauseAnalyzer implementieren (verwendet Clients, CorrelationEngine)
6. LiveStreamingManager implementieren (unabhängig)

**Nach Abschluss:**
- Agent C prüft Phase 1 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet Phase 2 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 1 bereit für Implementierung*




