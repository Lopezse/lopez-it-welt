# P9-COMPONENTS

## Komponenten-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Unified Operations Center (UOC) Phase P9

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **UI-Komponenten** für das Unified Operations Center (P9).

**Anforderungen:**
- **Design & Layout** nach Enterprise++ Standard
- **Komponenten** vollständig spezifiziert
- **Props & Funktionen** definiert
- **Dark Mode** vollständig unterstützt
- **Zero-Trust UI** (keine personenbezogenen Daten)

---

## 2. Dashboard-Komponenten

### **2.1 UOCDashboard**

**Pfad:** `src/components/orchestrator/uoc/UOCDashboard.tsx`

**Props:**
```typescript
interface UOCDashboardProps {
  initialData?: AggregatedData;
  autoRefresh?: boolean;
  refreshInterval?: number; // Standard: 5 Sekunden
  filters?: UOCFilters;
  onFilterChange?: (filters: UOCFilters) => void;
}
```

**Funktionen:**
- Unified Dashboard anzeigen (Alerts, Incidents, Logs, Metrics, System-Health)
- Auto-Refresh (alle 5 Sekunden)
- Live-Streaming (SSE)
- Filter (Zeitraum, Kategorie, Severity, Source)
- Quick-Actions (Acknowledge Alert, Escalate Incident, etc.)

**UI-Elemente:**
- Header (Titel, Filter, Refresh-Button)
- KPI-Cards (Alerts Count, Incidents Count, Logs Count, System Health)
- Alert-Liste (Top 10 Critical/Warning)
- Incident-Liste (Top 5 Open)
- System-Health-Card
- API-Performance-Chart
- Queue-Status-Card
- Recent-Logs-Liste (Top 10)
- Trend-Charts (Logs, Metrics, Alerts)

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Buttons/Aktionen abhängig von Berechtigungen

---

### **2.2 KPICard**

**Pfad:** `src/components/orchestrator/uoc/KPICard.tsx`

**Props:**
```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon?: React.ComponentType;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  onClick?: () => void;
}
```

**Funktionen:**
- KPI-Wert anzeigen
- Trend anzeigen (up/down/stable)
- Icon anzeigen
- Klick-Handler (Navigation zu Detail-Seite)

**UI-Elemente:**
- KPI-Titel
- KPI-Wert (groß, prominent)
- Trend-Indikator (Pfeil, Farbe)
- Trend-Wert (Prozent)
- Icon (optional)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **2.3 UnifiedAlertList**

**Pfad:** `src/components/orchestrator/uoc/UnifiedAlertList.tsx`

**Props:**
```typescript
interface UnifiedAlertListProps {
  alerts: Alert[];
  filters?: AlertFilters;
  onFilterChange?: (filters: AlertFilters) => void;
  onAlertClick?: (alertId: string) => void;
  showActions?: boolean; // Abhängig von security.manage
  maxItems?: number; // Standard: 10
}
```

**Funktionen:**
- Alert-Liste anzeigen (kompakt)
- Filter (Status, Severity, Kategorie)
- Quick-Actions (Acknowledge, Escalate) – nur bei Berechtigung
- Link zu Alert-Detail

**UI-Elemente:**
- Alert-Liste (Tabelle/Karten)
- Severity-Badge
- Status-Badge
- Kategorie-Badge
- Zeitstempel
- Quick-Actions (Buttons) – nur bei `security.manage`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Actions nur bei Berechtigung

---

### **2.4 UnifiedIncidentList**

**Pfad:** `src/components/orchestrator/uoc/UnifiedIncidentList.tsx`

**Props:**
```typescript
interface UnifiedIncidentListProps {
  incidents: Incident[];
  filters?: IncidentFilters;
  onFilterChange?: (filters: IncidentFilters) => void;
  onIncidentClick?: (incidentId: string) => void;
  showActions?: boolean; // Abhängig von security.manage
  maxItems?: number; // Standard: 5
}
```

**Funktionen:**
- Incident-Liste anzeigen (kompakt)
- Filter (Status, Severity)
- Quick-Actions (Resolve) – nur bei Berechtigung
- Link zu Incident-Detail

**UI-Elemente:**
- Incident-Liste (Tabelle/Karten)
- Severity-Badge
- Status-Badge
- SLA-Badge (falls vorhanden)
- Zeitstempel
- Quick-Actions (Buttons) – nur bei `security.manage`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Actions nur bei Berechtigung

---

### **2.5 UnifiedLogList**

**Pfad:** `src/components/orchestrator/uoc/UnifiedLogList.tsx`

**Props:**
```typescript
interface UnifiedLogListProps {
  logs: Log[];
  filters?: LogFilters;
  onFilterChange?: (filters: LogFilters) => void;
  onLogClick?: (logId: string) => void;
  maxItems?: number; // Standard: 10
  showSearch?: boolean;
}
```

**Funktionen:**
- Log-Liste anzeigen (kompakt)
- Filter (Kategorie, Log-Level, Severity)
- Volltext-Suche (optional)
- Link zu Log-Detail

**UI-Elemente:**
- Log-Liste (Tabelle/Karten)
- Log-Level-Badge
- Severity-Badge
- Kategorie-Badge
- Zeitstempel
- Message (gekürzt)

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Keine PD-Anzeige

---

### **2.6 SystemHealthCard**

**Pfad:** `src/components/orchestrator/uoc/SystemHealthCard.tsx`

**Props:**
```typescript
interface SystemHealthCardProps {
  health: SystemHealth;
  autoRefresh?: boolean;
  refreshInterval?: number; // Standard: 5 Sekunden
}
```

**Funktionen:**
- System-Health-Status anzeigen
- Health-Score anzeigen (0-100)
- Komponenten-Status anzeigen (CPU, RAM, Disk, Network, DB, Queue)
- Auto-Refresh (alle 5 Sekunden)

**UI-Elemente:**
- Health-Status-Badge (healthy, degraded, unhealthy, critical)
- Health-Score (0-100, mit Farbe)
- Komponenten-Liste (CPU, RAM, Disk, Network, DB, Queue)
- Komponenten-Status (Badge pro Komponente)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/metrics/health`

---

### **2.7 APIPerformanceChart**

**Pfad:** `src/components/orchestrator/uoc/APIPerformanceChart.tsx`

**Props:**
```typescript
interface APIPerformanceChartProps {
  metrics: Metric[];
  timeRange?: '1h' | '6h' | '24h' | '7d';
  autoRefresh?: boolean;
  refreshInterval?: number; // Standard: 5 Sekunden
}
```

**Funktionen:**
- API-Performance-Chart anzeigen (Latenz, Error-Rate)
- Zeitraum wählen (1h, 6h, 24h, 7d)
- Auto-Refresh (alle 5 Sekunden)
- Tooltip mit Details

**UI-Elemente:**
- Liniendiagramm (Recharts)
- Zeitachse (X-Achse)
- Latenz (Y-Achse, ms)
- Error-Rate (Y-Achse, %)
- Tooltip (bei Hover)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/metrics/api-performance`

---

### **2.8 QueueStatusCard**

**Pfad:** `src/components/orchestrator/uoc/QueueStatusCard.tsx`

**Props:**
```typescript
interface QueueStatusCardProps {
  queueStatus: QueueStatus;
  autoRefresh?: boolean;
  refreshInterval?: number; // Standard: 5 Sekunden
}
```

**Funktionen:**
- Queue-Status anzeigen (Tiefe, Rate, Failed Tasks)
- Auto-Refresh (alle 5 Sekunden)
- Link zu Queue-Detail

**UI-Elemente:**
- Queue-Tiefe (Anzahl wartender Tasks)
- Queue-Rate (Tasks/Sekunde)
- Failed-Tasks-Count
- Queue-Status-Badge (healthy, degraded, unhealthy, critical)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/metrics/queue`

---

## 3. Correlation-View-Komponenten

### **3.1 CorrelationView**

**Pfad:** `src/components/orchestrator/uoc/CorrelationView.tsx`

**Props:**
```typescript
interface CorrelationViewProps {
  correlations: Correlation[];
  filters?: CorrelationFilters;
  onFilterChange?: (filters: CorrelationFilters) => void;
  onCorrelationClick?: (correlation: Correlation) => void;
}
```

**Funktionen:**
- Correlation-View anzeigen (Sankey-Diagramm)
- Filter (Zeitraum, Kategorie, Severity, Source)
- Korrelations-Details anzeigen (Tooltip)
- Korrelations-Tabelle anzeigen (optional)

**UI-Elemente:**
- Sankey-Diagramm (Log ↔ Metric ↔ Alert)
- Korrelations-Tabelle (Log-ID, Metric-ID, Alert-ID, Korrelations-Score)
- Filter-Bar
- Zeitraum-Picker

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/correlations`

---

### **3.2 CorrelationTable**

**Pfad:** `src/components/orchestrator/uoc/CorrelationTable.tsx`

**Props:**
```typescript
interface CorrelationTableProps {
  correlations: Correlation[];
  onCorrelationClick?: (correlation: Correlation) => void;
  sortable?: boolean;
}
```

**Funktionen:**
- Korrelations-Tabelle anzeigen
- Sortierung (nach Korrelations-Score, Zeit, Kategorie)
- Link zu Event-Details (Log, Metric, Alert)

**UI-Elemente:**
- Tabelle mit Spalten: Log-ID, Metric-ID, Alert-ID, Korrelations-Score, Zeitstempel, Kategorie
- Sortierbare Spalten
- Link zu Event-Details

**Dark Mode:** ✅ Vollständig unterstützt

---

## 4. Root-Cause-Analysis-View-Komponenten

### **4.1 RootCauseAnalysisView**

**Pfad:** `src/components/orchestrator/uoc/RootCauseAnalysisView.tsx`

**Props:**
```typescript
interface RootCauseAnalysisViewProps {
  incidentId: string;
  rootCause?: RootCauseAnalysis;
  onSolutionClick?: (solution: Solution) => void;
}
```

**Funktionen:**
- Root-Cause-Analysis-View anzeigen
- Timeline anzeigen (chronologische Ereignis-Übersicht)
- Root-Cause hervorheben
- Impact-Analyse anzeigen
- Lösung-Vorschläge anzeigen

**UI-Elemente:**
- Timeline-Grafik (vertikal, chronologisch)
- Event-Karten (Log, Alert, Metric, Incident)
- Root-Cause-Highlighting (kritische Events)
- Impact-Visualisierung (Auswirkungen)
- Lösung-Vorschläge (Liste)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/root-cause/[incidentId]`

---

### **4.2 TimelineChart**

**Pfad:** `src/components/orchestrator/uoc/TimelineChart.tsx`

**Props:**
```typescript
interface TimelineChartProps {
  events: Event[];
  rootCause?: Event;
  onEventClick?: (event: Event) => void;
  zoom?: 'hour' | 'day' | 'week' | 'month';
}
```

**Funktionen:**
- Timeline-Grafik anzeigen (vertikal, chronologisch)
- Events anzeigen (Log, Alert, Metric, Incident)
- Root-Cause hervorheben
- Zoom (Stunde, Tag, Woche, Monat)
- Event-Details anzeigen (Tooltip)

**UI-Elemente:**
- Timeline-Grafik (vertikal, chronologisch)
- Event-Marker (Log, Alert, Metric, Incident)
- Root-Cause-Highlighting (kritische Events)
- Zoom-Controls
- Event-Details (Tooltip bei Hover)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.3 ImpactVisualization**

**Pfad:** `src/components/orchestrator/uoc/ImpactVisualization.tsx`

**Props:**
```typescript
interface ImpactVisualizationProps {
  impact: ImpactAnalysis;
  rootCause: Event;
}
```

**Funktionen:**
- Impact-Analyse visualisieren
- Auswirkungen auf System anzeigen
- Betroffene Komponenten anzeigen

**UI-Elemente:**
- Impact-Grafik (Sankey-Diagramm: Root-Cause → Auswirkungen)
- Betroffene Komponenten (Liste)
- Impact-Score (0-100)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.4 SolutionList**

**Pfad:** `src/components/orchestrator/uoc/SolutionList.tsx`

**Props:**
```typescript
interface SolutionListProps {
  solutions: Solution[];
  onSolutionClick?: (solution: Solution) => void;
}
```

**Funktionen:**
- Lösung-Vorschläge anzeigen
- Lösung-Details anzeigen
- Lösung anwenden (Button)

**UI-Elemente:**
- Lösung-Liste (Karten)
- Lösung-Titel
- Lösung-Beschreibung
- Lösung-Priorität (Badge)
- Anwenden-Button

**Dark Mode:** ✅ Vollständig unterstützt

---

## 5. Timeline-View-Komponenten

### **5.1 TimelineView**

**Pfad:** `src/components/orchestrator/uoc/TimelineView.tsx`

**Props:**
```typescript
interface TimelineViewProps {
  events: Event[];
  filters?: TimelineFilters;
  onFilterChange?: (filters: TimelineFilters) => void;
  onEventClick?: (event: Event) => void;
  zoom?: 'hour' | 'day' | 'week' | 'month';
}
```

**Funktionen:**
- Timeline-View anzeigen (horizontal, chronologisch)
- Multi-Source-Events anzeigen (Logs, Alerts, Metrics, Incidents)
- Filter (Zeitraum, Kategorie, Severity, Source)
- Zoom (Stunde, Tag, Woche, Monat)
- Navigation (Vor/Zurück)

**UI-Elemente:**
- Timeline-Grafik (horizontal, chronologisch)
- Event-Marker (Log, Alert, Metric, Incident)
- Event-Details (Tooltip bei Hover)
- Filter-Bar
- Zoom-Controls
- Navigation-Buttons (Vor/Zurück)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/timeline`

---

### **5.2 EventMarker**

**Pfad:** `src/components/orchestrator/uoc/EventMarker.tsx`

**Props:**
```typescript
interface EventMarkerProps {
  event: Event;
  eventType: 'log' | 'alert' | 'metric' | 'incident';
  onClick?: () => void;
  highlighted?: boolean; // Für Root-Cause
}
```

**Funktionen:**
- Event-Marker anzeigen
- Event-Typ visualisieren (Farbe, Icon)
- Event-Details anzeigen (Tooltip)
- Highlighting (für Root-Cause)

**UI-Elemente:**
- Event-Marker (Kreis, Farbe je nach Typ)
- Event-Icon (Log, Alert, Metric, Incident)
- Event-Details (Tooltip bei Hover)
- Highlighting (für Root-Cause)

**Dark Mode:** ✅ Vollständig unterstützt

---

## 6. Live-Streaming-Komponenten

### **6.1 LiveStreamIndicator**

**Pfad:** `src/components/orchestrator/uoc/LiveStreamIndicator.tsx`

**Props:**
```typescript
interface LiveStreamIndicatorProps {
  connected: boolean;
  lastUpdate?: Date;
  eventCount?: number;
}
```

**Funktionen:**
- Live-Stream-Status anzeigen
- Verbindungs-Status anzeigen (connected/disconnected)
- Letzte Aktualisierung anzeigen
- Event-Count anzeigen

**UI-Elemente:**
- Status-Badge (connected/disconnected)
- Pulsierender Indikator (bei connected)
- Letzte Aktualisierung (Zeitstempel)
- Event-Count (Anzahl Events seit Verbindung)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **6.2 LiveUpdateCard**

**Pfad:** `src/components/orchestrator/uoc/LiveUpdateCard.tsx`

**Props:**
```typescript
interface LiveUpdateCardProps {
  update: LiveUpdate;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number; // Standard: 5 Sekunden
}
```

**Funktionen:**
- Live-Update anzeigen (Toast-ähnlich)
- Auto-Dismiss (nach 5 Sekunden)
- Manuelles Dismiss (Button)
- Link zu Event-Detail

**UI-Elemente:**
- Update-Karte (Toast)
- Event-Typ (Badge)
- Event-Details (Titel, Beschreibung)
- Zeitstempel
- Dismiss-Button
- Link zu Event-Detail

**Dark Mode:** ✅ Vollständig unterstützt

---

## 7. Filter-Komponenten

### **7.1 UOCFilterBar**

**Pfad:** `src/components/orchestrator/uoc/UOCFilterBar.tsx`

**Props:**
```typescript
interface UOCFilterBarProps {
  filters: UOCFilters;
  onFilterChange: (filters: UOCFilters) => void;
  sources?: ('alerts' | 'incidents' | 'logs' | 'metrics')[];
}
```

**Funktionen:**
- Filter-Bar anzeigen
- Filter setzen (Zeitraum, Kategorie, Severity, Source)
- Filter zurücksetzen
- Filter speichern (optional)

**UI-Elemente:**
- Zeitraum-Picker (Von ... bis ...)
- Kategorie-Dropdown (Security, API, Queue, etc.)
- Severity-Dropdown (info, warning, critical)
- Source-Checkboxen (Alerts, Incidents, Logs, Metrics)
- Zurücksetzen-Button
- Speichern-Button (optional)

**Dark Mode:** ✅ Vollständig unterstützt

---

## 8. Chart-Komponenten

### **8.1 UnifiedChart**

**Pfad:** `src/components/orchestrator/uoc/UnifiedChart.tsx`

**Props:**
```typescript
interface UnifiedChartProps {
  data: ChartData[];
  chartType: 'line' | 'bar' | 'area' | 'sankey';
  xAxis: string;
  yAxis: string[];
  timeRange?: '1h' | '6h' | '24h' | '7d';
  autoRefresh?: boolean;
  refreshInterval?: number; // Standard: 5 Sekunden
}
```

**Funktionen:**
- Unified Chart anzeigen (Recharts)
- Verschiedene Chart-Typen (Line, Bar, Area, Sankey)
- Auto-Refresh (alle 5 Sekunden)
- Tooltip mit Details

**UI-Elemente:**
- Chart (Recharts)
- Zeitachse (X-Achse)
- Wert-Achse (Y-Achse)
- Tooltip (bei Hover)
- Legend

**Dark Mode:** ✅ Vollständig unterstützt

---

## 9. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – P9-Components erstellt

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG*




