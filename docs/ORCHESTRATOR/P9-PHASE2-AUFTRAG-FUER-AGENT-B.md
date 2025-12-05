# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P9 Phase 2: API-Endpoints

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P9 Phase 2 (API-Endpoints) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Phasen:**
- ✅ P9 Phase 1 (Backend-Komponenten) – Vollständig implementiert
  - ✅ CorrelationEngine.ts
  - ✅ DataAggregator.ts
  - ✅ ViewManager.ts
  - ✅ LiveStreamingManager.ts
  - ✅ RootCauseAnalyzer.ts
  - ✅ Alle 7 Clients (AlertClient, IncidentClient, MetricClient, HealthClient, LogClient, AnalyticsClient, OrchestratorClient)

**Bereits produktionsreif:**
- ✅ P8-C (Alerts & Incidents) – APIs verfügbar
- ✅ P8-D (Telemetrie & Monitoring) – APIs verfügbar
- ✅ P8-E (Log Processing & Analytics) – APIs verfügbar
- ✅ Orchestrator Level 2 – APIs verfügbar

---

## 🎯 ZU IMPLEMENTIEREN

### **1. REST-API-Endpoints**

**Ordner:** `src/app/api/orchestrator/uoc/`

#### **1.1 GET /api/orchestrator/uoc/dashboard**

**Pfad:** `src/app/api/orchestrator/uoc/dashboard/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view ODER logs.view ODER security.view)
  // 3. Query-Parameter auslesen (timeRange, category, severity, source)
  // 4. DataAggregator.aggregateAllSources() aufrufen
  // 5. KPIs berechnen (alerts_count, incidents_count, logs_count, health_score)
  // 6. Top 10 Critical/Warning Alerts
  // 7. Top 5 Open Incidents
  // 8. System-Health (HealthClient.getHealthStatus())
  // 9. API-Performance (MetricClient.getAPIPerformance())
  // 10. Queue-Status (MetricClient.getQueueStatus())
  // 11. Top 10 Recent Logs
  // 12. Trends (AnalyticsClient.getTrends())
  // 13. Response zurückgeben
}
```

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view` (mindestens eine Berechtigung erforderlich)

**Query-Parameter:**
- `timeRange` (optional): `1h`, `6h`, `24h`, `7d` (Standard: `24h`)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter (`alerts`, `incidents`, `logs`, `metrics`)

**Response-Format:**
```typescript
{
  success: true,
  data: {
    kpis: {
      alerts_count: number,
      incidents_count: number,
      logs_count: number,
      health_score: number
    },
    alerts: Alert[], // Top 10 Critical/Warning
    incidents: Incident[], // Top 5 Open
    system_health: SystemHealth,
    api_performance: APIPerformanceMetrics,
    queue_status: QueueStatus,
    recent_logs: Log[], // Top 10
    trends: {
      logs: Trend[],
      metrics: Trend[],
      alerts: Trend[]
    }
  }
}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 3.1
- `src/lib/ki-orchestrator/level2/uoc/DataAggregator.ts`
- `src/lib/ki-orchestrator/level2/uoc/clients/`

---

#### **1.2 GET /api/orchestrator/uoc/correlations**

**Pfad:** `src/app/api/orchestrator/uoc/correlations/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view ODER logs.view ODER security.view)
  // 3. Query-Parameter auslesen (timeRange, category, severity, source, minScore, limit, offset)
  // 4. ViewManager.createCorrelationView() aufrufen
  // 5. Response zurückgeben
}
```

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view`

**Query-Parameter:**
- `timeRange` (optional): `1h`, `6h`, `24h`, `7d` (Standard: `24h`)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter
- `minScore` (optional): Minimale Korrelations-Score (Standard: `0.5`)
- `limit` (optional): Anzahl (Standard: `100`, Max: `1000`)
- `offset` (optional): Offset (Standard: `0`)

**Response-Format:**
```typescript
{
  success: true,
  data: {
    correlations: Correlation[],
    total: number,
    limit: number,
    offset: number
  }
}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 3.2
- `src/lib/ki-orchestrator/level2/uoc/ViewManager.ts`

---

#### **1.3 GET /api/orchestrator/uoc/root-cause/[incidentId]**

**Pfad:** `src/app/api/orchestrator/uoc/root-cause/[incidentId]/route.ts`

**Funktionen:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { incidentId: string } }
) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (security.view ODER monitoring.view ODER logs.view)
  // 3. incidentId aus params extrahieren
  // 4. RootCauseAnalyzer.identifyRootCause(incidentId) aufrufen
  // 5. Response zurückgeben
}
```

**RBAC:** `security.view` ODER `monitoring.view` ODER `logs.view`

**Response-Format:**
```typescript
{
  success: true,
  data: {
    incident_id: string,
    root_cause: {
      event_id: string,
      event_type: "log" | "alert" | "metric",
      log_rule_id?: string,
      timestamp: string,
      message: string
    },
    impact: {
      score: number,
      affected_components: string[],
      affected_metrics: string[],
      affected_alerts: string[]
    },
    timeline: TimelineEvent[],
    solutions: Solution[]
  }
}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 3.3
- `src/lib/ki-orchestrator/level2/uoc/RootCauseAnalyzer.ts`

---

#### **1.4 GET /api/orchestrator/uoc/timeline**

**Pfad:** `src/app/api/orchestrator/uoc/timeline/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view ODER logs.view ODER security.view)
  // 3. Query-Parameter auslesen (startTime, endTime, category, severity, source, zoom, limit, offset)
  // 4. ViewManager.createTimelineView() aufrufen
  // 5. Response zurückgeben
}
```

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view`

**Query-Parameter:**
- `startTime` (optional): Start-Zeit (ISO 8601)
- `endTime` (optional): End-Zeit (ISO 8601)
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter
- `source` (optional): Source-Filter (`alerts`, `incidents`, `logs`, `metrics`)
- `zoom` (optional): Zoom-Level (`hour`, `day`, `week`, `month`)
- `limit` (optional): Anzahl (Standard: `100`, Max: `1000`)
- `offset` (optional): Offset (Standard: `0`)

**Response-Format:**
```typescript
{
  success: true,
  data: {
    events: TimelineEvent[],
    total: number,
    limit: number,
    offset: number
  }
}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 3.4
- `src/lib/ki-orchestrator/level2/uoc/ViewManager.ts`

---

### **2. Streaming-API-Endpoints (SSE)**

**Ordner:** `src/app/api/orchestrator/uoc/stream/`

**Wichtig:** SSE-Endpoints verwenden `text/event-stream` Content-Type und müssen Streaming-Response zurückgeben.

**Next.js SSE-Pattern:**
```typescript
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // SSE-Format: "event: <event-type>\ndata: <json-data>\n\n"
      const sendEvent = (eventType: string, data: unknown) => {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };
      
      // Heartbeat alle 30 Sekunden
      const heartbeatInterval = setInterval(() => {
        sendEvent("heartbeat", { timestamp: new Date().toISOString() });
      }, 30000);
      
      // Cleanup bei Verbindungsabbruch
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

**Integration mit LiveStreamingManager:**
- Verwende `LiveStreamingManager.createSSEConnection()` für Verbindungs-Management
- Verwende `LiveStreamingManager.sendLiveUpdate()` für Live-Updates

---

#### **2.1 GET /api/orchestrator/uoc/stream/alerts**

**Pfad:** `src/app/api/orchestrator/uoc/stream/alerts/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (security.view)
  // 3. Query-Parameter auslesen (severity, category)
  // 4. LiveStreamingManager.createSSEConnection() aufrufen
  // 5. SSE-Stream erstellen
  // 6. Heartbeat alle 30 Sekunden senden
  // 7. Live-Alerts über LiveStreamingManager empfangen und weiterleiten
  // 8. Cleanup bei Verbindungsabbruch
}
```

**RBAC:** `security.view`

**Query-Parameter:**
- `severity` (optional): Severity-Filter
- `category` (optional): Kategorie-Filter

**SSE-Format:**
```
event: alert
data: {"id": "alert-123", "severity": "critical", "title": "...", "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 4.1
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

---

#### **2.2 GET /api/orchestrator/uoc/stream/metrics**

**Pfad:** `src/app/api/orchestrator/uoc/stream/metrics/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view)
  // 3. Query-Parameter auslesen (category, metric_id)
  // 4. LiveStreamingManager.createSSEConnection() aufrufen
  // 5. SSE-Stream erstellen
  // 6. Heartbeat alle 30 Sekunden senden
  // 7. Live-Metrics über LiveStreamingManager empfangen und weiterleiten
  // 8. Cleanup bei Verbindungsabbruch
}
```

**RBAC:** `monitoring.view`

**Query-Parameter:**
- `category` (optional): Kategorie-Filter
- `metric_id` (optional): Metrik-ID-Filter

**SSE-Format:**
```
event: metric
data: {"metric_id": "API-005", "value": 0.95, "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 4.2
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

---

#### **2.3 GET /api/orchestrator/uoc/stream/logs**

**Pfad:** `src/app/api/orchestrator/uoc/stream/logs/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (logs.view)
  // 3. Query-Parameter auslesen (log_level, category, severity)
  // 4. LiveStreamingManager.createSSEConnection() aufrufen
  // 5. SSE-Stream erstellen
  // 6. Heartbeat alle 30 Sekunden senden
  // 7. Live-Logs über LiveStreamingManager empfangen und weiterleiten
  // 8. Cleanup bei Verbindungsabbruch
}
```

**RBAC:** `logs.view`

**Query-Parameter:**
- `log_level` (optional): Log-Level-Filter
- `category` (optional): Kategorie-Filter
- `severity` (optional): Severity-Filter

**SSE-Format:**
```
event: log
data: {"id": "log-123", "log_level": "ERROR", "category": "Security", "message": "...", "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 4.3
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

---

#### **2.4 GET /api/orchestrator/uoc/stream/health**

**Pfad:** `src/app/api/orchestrator/uoc/stream/health/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view)
  // 3. LiveStreamingManager.createSSEConnection() aufrufen
  // 4. SSE-Stream erstellen
  // 5. Heartbeat alle 30 Sekunden senden
  // 6. Live-Health-Status über LiveStreamingManager empfangen und weiterleiten
  // 7. Cleanup bei Verbindungsabbruch
}
```

**RBAC:** `monitoring.view`

**SSE-Format:**
```
event: health
data: {"status": "healthy", "score": 95, "components": {...}, "timestamp": "2025-11-28T10:00:00Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 4.4
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

---

#### **2.5 GET /api/orchestrator/uoc/stream/events**

**Pfad:** `src/app/api/orchestrator/uoc/stream/events/route.ts`

**Funktionen:**
```typescript
export async function GET(request: NextRequest) {
  // 1. Authentifizierung (AdminAuthService.validateSession)
  // 2. RBAC-Prüfung (monitoring.view ODER logs.view ODER security.view)
  // 3. Query-Parameter auslesen (source, severity)
  // 4. LiveStreamingManager.createSSEConnection() aufrufen
  // 5. SSE-Stream erstellen
  // 6. Heartbeat alle 30 Sekunden senden
  // 7. Live-Events (alle Typen) über LiveStreamingManager empfangen und weiterleiten
  // 8. Cleanup bei Verbindungsabbruch
}
```

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view`

**Query-Parameter:**
- `source` (optional): Source-Filter (`alerts`, `incidents`, `logs`, `metrics`)
- `severity` (optional): Severity-Filter

**SSE-Format:**
```
event: alert
data: {"id": "alert-123", "type": "alert", "severity": "critical", "timestamp": "2025-11-28T10:00:00Z"}

event: metric
data: {"id": "metric-45", "type": "metric", "metric_id": "API-005", "value": 0.95, "timestamp": "2025-11-28T10:00:01Z"}

event: log
data: {"id": "log-123", "type": "log", "log_level": "ERROR", "message": "...", "timestamp": "2025-11-28T10:00:02Z"}

event: heartbeat
data: {"timestamp": "2025-11-28T10:00:30Z"}
```

**Referenzen:**
- `P9-API-SPEC.md` Abschnitt 4.5
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`

---

## ✅ ERFOLGSKRITERIEN

**Phase 2 ist produktionsreif, wenn:**
- ✅ Alle 4 REST-API-Endpoints implementiert (dashboard, correlations, root-cause/[incidentId], timeline)
- ✅ Alle 5 SSE-Streaming-Endpoints implementiert (alerts, metrics, logs, health, events)
- ✅ RBAC korrekt implementiert (AdminAuthService + RBACService)
- ✅ SSE-Streaming funktioniert (text/event-stream, Heartbeat alle 30 Sekunden)
- ✅ Integration mit Phase 1 Komponenten funktioniert (DataAggregator, ViewManager, RootCauseAnalyzer, LiveStreamingManager)
- ✅ Fehlerbehandlung korrekt (Try-Catch, Error-Logging, HTTP-Status-Codes)
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P9-HANDBOOK-FOR-BUILDER.md` Phase 2 – Vollständiger Implementierungsauftrag
- `P9-API-SPEC.md` – API-Spezifikation (alle Endpoints)
- `P9-INTEGRATION.md` – Integration-Details

**Bestehende APIs (Patterns):**
- P8-C: `src/app/api/orchestrator/alerts/route.ts` (RBAC-Pattern)
- P8-D: `src/app/api/orchestrator/metrics/live/route.ts` (API-Pattern)
- P8-E: `src/app/api/orchestrator/logs/route.ts` (RBAC-Pattern)

**Bestehende Komponenten (Phase 1):**
- `src/lib/ki-orchestrator/level2/uoc/DataAggregator.ts`
- `src/lib/ki-orchestrator/level2/uoc/ViewManager.ts`
- `src/lib/ki-orchestrator/level2/uoc/RootCauseAnalyzer.ts`
- `src/lib/ki-orchestrator/level2/uoc/LiveStreamingManager.ts`
- `src/lib/ki-orchestrator/level2/uoc/clients/`

**RBAC-Services:**
- `src/lib/admin-auth-service.ts` – `AdminAuthService.validateSession()`
- `src/lib/rbac-system.ts` – `RBACService.checkPermission()`

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 2 (API-Endpoints).**

**Reihenfolge:**
1. REST-API-Endpoints implementieren (dashboard, correlations, root-cause/[incidentId], timeline)
2. SSE-Streaming-Endpoints implementieren (alerts, metrics, logs, health, events)
3. RBAC-Integration testen
4. SSE-Streaming testen (Heartbeat, Live-Updates)
5. Integration mit Phase 1 Komponenten testen

**Nach Abschluss:**
- Agent C prüft Phase 2 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet Phase 3 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 2 bereit für Implementierung*



