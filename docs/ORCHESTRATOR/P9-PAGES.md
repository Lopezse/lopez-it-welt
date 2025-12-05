# P9-PAGES

## Seiten-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Unified Operations Center (UOC) Phase P9

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **Admin-Seiten** für das Unified Operations Center (P9).

**Anforderungen:**
- **Layout & Design** nach Enterprise++ Standard
- **Komponenten** vollständig spezifiziert
- **Funktionen** definiert
- **Dark Mode** vollständig unterstützt
- **Zero-Trust UI** (keine personenbezogenen Daten)

---

## 2. Hauptseiten

### **2.1 /admin/uoc (UOC Dashboard)**

**Pfad:** `src/app/admin/uoc/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Unified Operations Center         │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Filter] [Refresh] [Live-Stream: ON/OFF]               │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Alerts   │  │ Incidents│  │ Logs     │  │ Health   │  │
│  │ Count    │  │ Count    │  │ Count    │  │ Score    │  │
│  │ 15       │  │ 3        │  │ 1,234    │  │ 95       │  │
│  │ [View]   │  │ [View]   │  │ [View]   │  │ [View]   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Critical Alerts (Top 10)                       │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Severity │ Kategorie │ Message │ [Ack]│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 10:00│ Critical │ Security  │ ... │ [Ack]│ │  │
│  │  │ 10:05│ Warning  │ API       │ ... │ [Ack]│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │  [View All Alerts]                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Open Incidents (Top 5)                         │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Severity │ Status │ SLA │ [Resolve]│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 09:00│ Critical │ Open    │ 45m │ [Resolve]│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │  [View All Incidents]                           │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  System Health                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │ CPU: 45% │  │ RAM: 60% │  │ Disk: 30%│     │  │
│  │  │ [Healthy]│  │ [Healthy]│  │ [Healthy]│     │  │
│  │  └──────────┘  └──────────┘  └──────────┘     │  │
│  │  Health Score: 95/100 [Healthy]                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API Performance                                │  │
│  │  [Chart: Latenz & Error-Rate über Zeit]        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue Status                                  │  │
│  │  Queue Depth: 12 | Rate: 5 tasks/s | Failed: 0│  │
│  │  [View Queue Detail]                            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Recent Logs (Top 10)                           │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Level │ Kategorie │ Message │ [View]│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 10:10│ ERROR │ Security  │ ... │ [View]│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │  [View All Logs]                                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trend Analysis                                 │  │
│  │  [Chart: Logs, Metrics, Alerts über Zeit]       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `UOCDashboard` – Haupt-Dashboard
- `KPICard` – KPI-Karten (Alerts, Incidents, Logs, Health)
- `UnifiedAlertList` – Alert-Liste (Top 10)
- `UnifiedIncidentList` – Incident-Liste (Top 5)
- `SystemHealthCard` – System-Health
- `APIPerformanceChart` – API-Performance-Chart
- `QueueStatusCard` – Queue-Status
- `UnifiedLogList` – Log-Liste (Top 10)
- `UnifiedChart` – Trend-Charts

**API-Calls:**
- `GET /api/orchestrator/uoc/dashboard` – Dashboard-Daten
- `GET /api/orchestrator/uoc/stream/*` – Live-Streaming (SSE)

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Buttons/Aktionen abhängig von Berechtigungen

---

### **2.2 /admin/uoc/correlation (Correlation View)**

**Pfad:** `src/app/admin/uoc/correlation/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > UOC > Correlation                 │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Filter] [Zeitraum] [Kategorie] [Severity] [Source]   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Correlation View (Sankey-Diagramm)            │  │
│  │  [Sankey: Log ↔ Metric ↔ Alert]                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Correlation Table                             │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Log-ID │ Metric-ID │ Alert-ID │ Score │ Zeit│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ log-123│ metric-45│ alert-78 │ 0.95 │ 10:00│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │  [Sort] [Pagination]                            │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `CorrelationView` – Correlation-View
- `CorrelationTable` – Korrelations-Tabelle
- `UOCFilterBar` – Filter-Bar

**API-Calls:**
- `GET /api/orchestrator/uoc/correlations` – Korrelations-Daten

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Dark Mode:** ✅ Vollständig unterstützt

---

### **2.3 /admin/uoc/root-cause/[incidentId] (Root-Cause-Analysis View)**

**Pfad:** `src/app/admin/uoc/root-cause/[incidentId]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > UOC > Root-Cause-Analysis        │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  Incident: INC-123 | Severity: Critical | Status: Open   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Timeline (Chronological Events)                │  │
│  │  [Timeline-Chart: Vertikal, chronologisch]      │  │
│  │  [Root-Cause: Highlighted]                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Root-Cause Analysis                            │  │
│  │  Root-Cause: Log SEC-LOG-001 (10:00:00)         │  │
│  │  Impact Score: 85/100                            │  │
│  │  Betroffene Komponenten: API, Queue, DB         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Impact Visualization                           │  │
│  │  [Sankey: Root-Cause → Auswirkungen]            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Suggested Solutions                            │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ 1. Restart API Service (Priority: High)  │ │  │
│  │  │ 2. Clear Queue (Priority: Medium)          │ │  │
│  │  │ 3. Check Database Connection (Priority: Low)│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `RootCauseAnalysisView` – Root-Cause-Analysis-View
- `TimelineChart` – Timeline-Grafik
- `ImpactVisualization` – Impact-Visualisierung
- `SolutionList` – Lösung-Vorschläge

**API-Calls:**
- `GET /api/orchestrator/uoc/root-cause/[incidentId]` – Root-Cause-Analysis

**RBAC:** `security.view`, `monitoring.view`, `logs.view`

**Dark Mode:** ✅ Vollständig unterstützt

---

### **2.4 /admin/uoc/timeline (Timeline View)**

**Pfad:** `src/app/admin/uoc/timeline/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > UOC > Timeline                    │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Filter] [Zeitraum] [Kategorie] [Severity] [Source]     │
│  [Zoom: Hour/Day/Week/Month] [Navigation: ← →]         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Timeline (Chronological Events)                │  │
│  │  [Timeline-Chart: Horizontal, chronologisch]    │  │
│  │  [Event-Marker: Log, Alert, Metric, Incident]  │  │
│  │  [Event-Details: Tooltip bei Hover]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Event List (Chronological)                    │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Type │ Kategorie │ Severity │ [View]│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 10:00│ Log  │ Security  │ Critical │ [View]│ │  │
│  │  │ 10:01│ Alert│ Security  │ Critical │ [View]│ │  │
│  │  │ 10:02│ Metric│ API     │ Warning  │ [View]│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `TimelineView` – Timeline-View
- `EventMarker` – Event-Marker
- `UOCFilterBar` – Filter-Bar

**API-Calls:**
- `GET /api/orchestrator/uoc/timeline` – Timeline-Daten

**RBAC:** `monitoring.view`, `logs.view`, `security.view`

**Dark Mode:** ✅ Vollständig unterstützt

---

## 3. Navigation-Integration

### **3.1 AdminNavigation erweitern**

**Datei:** `src/components/admin/AdminNavigation.tsx`

**Hinzufügen:**
```typescript
{
  name: "Unified Operations Center",
  icon: FaTachometerAlt,
  description: "Zentrale Operations-Übersicht",
  subItems: [
    {
      name: "Dashboard",
      href: "/admin/uoc",
      icon: FaHome,
    },
    {
      name: "Correlation View",
      href: "/admin/uoc/correlation",
      icon: FaProjectDiagram,
    },
    {
      name: "Timeline View",
      href: "/admin/uoc/timeline",
      icon: FaClock,
    },
  ],
}
```

**Position:** Nach "Orchestrator", vor "Monitoring"

---

## 4. Live-Streaming-Integration

### **4.1 SSE-Endpoints**

**Endpoints:**
- `GET /api/orchestrator/uoc/stream/alerts` – Live-Alerts
- `GET /api/orchestrator/uoc/stream/metrics` – Live-Metrics
- `GET /api/orchestrator/uoc/stream/logs` – Live-Logs
- `GET /api/orchestrator/uoc/stream/health` – Live-Health
- `GET /api/orchestrator/uoc/stream/events` – Live-Events

**Client-Integration:**
- EventSource API (Browser)
- Auto-Reconnect bei Verbindungsabbruch
- Heartbeat (alle 30 Sekunden)

---

## 5. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – P9-Pages erstellt

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG*




