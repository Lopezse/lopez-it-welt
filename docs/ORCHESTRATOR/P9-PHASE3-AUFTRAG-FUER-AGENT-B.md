# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P9 Phase 3: UI-Komponenten

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P9 Phase 3 (UI-Komponenten) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Phasen:**
- ✅ P9 Phase 1 (Backend-Komponenten) – Vollständig implementiert
- ✅ P9 Phase 2 (API-Endpoints) – Vollständig implementiert
  - ✅ REST-API-Endpoints (dashboard, correlations, root-cause/[incidentId], timeline)
  - ✅ SSE-Streaming-Endpoints (alerts, metrics, logs, health, events)

**Bereits vorhanden:**
- ✅ UI-Komponenten-Patterns (ErrorBanner, WarningBanner, StatusBadge, SeverityBadge)
- ✅ Dark Mode Support (Tailwind CSS `dark:` Klassen)
- ✅ Zero-Trust UI Patterns (RBAC-basierte Button-Sichtbarkeit)
- ✅ Recharts für Charts
- ✅ Shadcn/ui Komponenten

---

## 🎯 ZU IMPLEMENTIEREN

### **1. Dashboard-Komponenten**

**Ordner:** `src/components/orchestrator/uoc/`

#### **1.1 UOCDashboard.tsx**

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
- Auto-Refresh (alle 5 Sekunden) via `GET /api/orchestrator/uoc/dashboard`
- Live-Streaming (SSE) via `/api/orchestrator/uoc/stream/events`
- Filter (Zeitraum, Kategorie, Severity, Source)
- Quick-Actions (Acknowledge Alert, Escalate Incident) – nur bei `security.manage`

**UI-Elemente:**
- Header (Titel "Unified Operations Center", Filter, Refresh-Button)
- KPI-Cards (4x KPICard: Alerts Count, Incidents Count, Logs Count, System Health)
- Alert-Liste (UnifiedAlertList, Top 10 Critical/Warning)
- Incident-Liste (UnifiedIncidentList, Top 5 Open)
- System-Health-Card (SystemHealthCard)
- API-Performance-Chart (APIPerformanceChart)
- Queue-Status-Card (QueueStatusCard)
- Recent-Logs-Liste (UnifiedLogList, Top 10)
- Trend-Charts (UnifiedChart für Logs, Metrics, Alerts)

**Dark Mode:** ✅ Vollständig unterstützt (Tailwind `dark:` Klassen)

**Zero-Trust UI:** ✅ Buttons/Aktionen abhängig von `security.manage` Berechtigung

**API-Integration:**
- `GET /api/orchestrator/uoc/dashboard` für initiale Daten
- `GET /api/orchestrator/uoc/stream/events` für Live-Updates (SSE)

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.1
- `src/components/ui/ErrorBanner.tsx` (Fehlerbehandlung)
- `src/components/ui/WarningBanner.tsx` (Warnungen)

---

#### **1.2 KPICard.tsx**

**Pfad:** `src/components/orchestrator/uoc/KPICard.tsx`

**Props:**
```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number; // Prozent
  icon?: React.ComponentType;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  onClick?: () => void;
}
```

**Funktionen:**
- KPI-Wert anzeigen (groß, prominent)
- Trend anzeigen (up/down/stable mit Pfeil-Icon)
- Trend-Wert anzeigen (Prozent)
- Icon anzeigen (optional, Lucide React)
- Klick-Handler (Navigation zu Detail-Seite)

**UI-Elemente:**
- KPI-Titel (klein, oben)
- KPI-Wert (groß, prominent, mit Farbe)
- Trend-Indikator (Pfeil-Icon, Farbe: grün=up, rot=down, grau=stable)
- Trend-Wert (Prozent, z.B. "+5.2%")
- Icon (optional, links oben)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.2
- `src/components/ui/StatusBadge.tsx` (Badge-Pattern)

---

#### **1.3 UnifiedAlertList.tsx**

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
- Alert-Liste anzeigen (kompakt, Tabelle oder Karten)
- Filter (Status, Severity, Kategorie)
- Quick-Actions (Acknowledge, Escalate) – nur bei `showActions === true`
- Link zu Alert-Detail (`/admin/alerts/[id]`)

**UI-Elemente:**
- Alert-Liste (Tabelle mit Spalten: Severity, Status, Kategorie, Titel, Zeitstempel, Actions)
- Severity-Badge (SeverityBadge-Komponente)
- Status-Badge (StatusBadge-Komponente)
- Kategorie-Badge (StatusBadge-Komponente)
- Zeitstempel (relativ, z.B. "vor 5 Minuten")
- Quick-Actions (Buttons: "Acknowledge", "Escalate") – nur bei `showActions === true`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Actions nur bei `showActions === true` (RBAC: `security.manage`)

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.3
- `src/components/ui/SeverityBadge.tsx`
- `src/components/ui/StatusBadge.tsx`
- `src/components/orchestrator/alerts/AlertList.tsx` (Pattern)

---

#### **1.4 UnifiedIncidentList.tsx**

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
- Incident-Liste anzeigen (kompakt, Tabelle oder Karten)
- Filter (Status, Severity)
- Quick-Actions (Resolve) – nur bei `showActions === true`
- Link zu Incident-Detail (`/admin/incidents/[id]`)

**UI-Elemente:**
- Incident-Liste (Tabelle mit Spalten: Severity, Status, Titel, SLA, Zeitstempel, Actions)
- Severity-Badge (SeverityBadge-Komponente)
- Status-Badge (StatusBadge-Komponente)
- SLA-Badge (falls vorhanden, z.B. "SLA: 2h")
- Zeitstempel (relativ)
- Quick-Actions (Button: "Resolve") – nur bei `showActions === true`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Actions nur bei `showActions === true` (RBAC: `security.manage`)

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.4
- `src/components/ui/SeverityBadge.tsx`
- `src/components/ui/StatusBadge.tsx`

---

#### **1.5 UnifiedLogList.tsx**

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
- Log-Liste anzeigen (kompakt, Tabelle oder Karten)
- Filter (Kategorie, Log-Level, Severity)
- Volltext-Suche (optional)
- Link zu Log-Detail (`/admin/logs/[id]`)

**UI-Elemente:**
- Log-Liste (Tabelle mit Spalten: Log-Level, Severity, Kategorie, Message, Zeitstempel)
- Log-Level-Badge (LogLevelBadge-Komponente)
- Severity-Badge (SeverityBadge-Komponente)
- Kategorie-Badge (StatusBadge-Komponente)
- Message (gekürzt, max 100 Zeichen)
- Zeitstempel (relativ)

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Keine PD-Anzeige (Message wird gefiltert)

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.5
- `src/components/orchestrator/logs/LogList.tsx` (Pattern)
- `src/components/orchestrator/logs/LogLevelBadge.tsx`

---

#### **1.6 SystemHealthCard.tsx**

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
- Health-Score anzeigen (0-100, mit Farbe)
- Komponenten-Status anzeigen (CPU, RAM, Disk, Network, DB, Queue)
- Auto-Refresh (alle 5 Sekunden) via `GET /api/orchestrator/metrics/health`

**UI-Elemente:**
- Health-Status-Badge (healthy, degraded, unhealthy, critical)
- Health-Score (0-100, groß, mit Farbe: grün=90+, gelb=70-89, rot=<70)
- Komponenten-Liste (CPU, RAM, Disk, Network, DB, Queue)
- Komponenten-Status (Badge pro Komponente: healthy, degraded, unhealthy, critical)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/metrics/health`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.6
- `src/components/ui/StatusBadge.tsx`

---

#### **1.7 APIPerformanceChart.tsx**

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
- Auto-Refresh (alle 5 Sekunden) via `GET /api/orchestrator/metrics/api-performance`
- Tooltip mit Details

**UI-Elemente:**
- Liniendiagramm (Recharts: LineChart)
- Zeitachse (X-Achse, Timestamps)
- Latenz (Y-Achse, ms, linke Y-Achse)
- Error-Rate (Y-Achse, %, rechte Y-Achse)
- Tooltip (bei Hover, zeigt Latenz und Error-Rate)
- Zeitraum-Picker (Dropdown: 1h, 6h, 24h, 7d)

**Dark Mode:** ✅ Vollständig unterstützt (Recharts Dark Mode Theme)

**API:** `GET /api/orchestrator/metrics/api-performance`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.7
- `src/components/orchestrator/metrics/APILatencyChart.tsx` (Pattern, falls vorhanden)
- Recharts Dokumentation

---

#### **1.8 QueueStatusCard.tsx**

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
- Auto-Refresh (alle 5 Sekunden) via `GET /api/orchestrator/metrics/queue`
- Link zu Queue-Detail

**UI-Elemente:**
- Queue-Tiefe (Anzahl wartender Tasks, groß, prominent)
- Queue-Rate (Tasks/Sekunde, klein)
- Failed-Tasks-Count (Anzahl fehlgeschlagener Tasks, mit Badge)
- Queue-Status-Badge (healthy, degraded, unhealthy, critical)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/metrics/queue`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 2.8
- `src/components/ui/StatusBadge.tsx`

---

### **2. Correlation-View-Komponenten**

#### **2.1 CorrelationView.tsx**

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
- Correlation-View anzeigen (Sankey-Diagramm oder Tabelle)
- Filter (Zeitraum, Kategorie, Severity, Source)
- Korrelations-Details anzeigen (Tooltip)
- Korrelations-Tabelle anzeigen (optional, CorrelationTable-Komponente)

**UI-Elemente:**
- Sankey-Diagramm (Recharts: Sankey, Log ↔ Metric ↔ Alert)
- Korrelations-Tabelle (CorrelationTable-Komponente)
- Filter-Bar (UOCFilterBar-Komponente)
- Zeitraum-Picker (Dropdown: 1h, 6h, 24h, 7d)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/correlations`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 3.1
- Recharts Sankey-Diagramm Dokumentation

---

#### **2.2 CorrelationTable.tsx**

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
- Sortierbare Spalten (Klick auf Spalten-Header)
- Link zu Event-Details (Klick auf Log-ID, Metric-ID, Alert-ID)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 3.2

---

### **3. Root-Cause-Analysis-View-Komponenten**

#### **3.1 RootCauseAnalysisView.tsx**

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
- Timeline anzeigen (TimelineChart-Komponente)
- Root-Cause hervorheben
- Impact-Analyse anzeigen (ImpactVisualization-Komponente)
- Lösung-Vorschläge anzeigen (SolutionList-Komponente)

**UI-Elemente:**
- Timeline-Grafik (TimelineChart-Komponente)
- Root-Cause-Highlighting (kritische Events)
- Impact-Visualisierung (ImpactVisualization-Komponente)
- Lösung-Vorschläge (SolutionList-Komponente)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/root-cause/[incidentId]`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 4.1

---

#### **3.2 TimelineChart.tsx**

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
- Timeline-Grafik (vertikal, chronologisch, Recharts oder Custom)
- Event-Marker (EventMarker-Komponente, verschiedene Farben für Log/Alert/Metric/Incident)
- Root-Cause-Highlighting (kritische Events, rot)
- Zoom-Controls (Dropdown: hour, day, week, month)
- Event-Details (Tooltip bei Hover)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 4.2

---

#### **3.3 ImpactVisualization.tsx**

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
- Impact-Grafik (Sankey-Diagramm: Root-Cause → Auswirkungen, Recharts)
- Betroffene Komponenten (Liste: API, Queue, DB, etc.)
- Impact-Score (0-100, groß, mit Farbe)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 4.3

---

#### **3.4 SolutionList.tsx**

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
- Lösung-Liste (Karten, sortiert nach Priorität)
- Lösung-Titel (groß, prominent)
- Lösung-Beschreibung (klein)
- Lösung-Priorität (Badge: high, medium, low)
- Anwenden-Button (nur bei `security.manage` Berechtigung)

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Anwenden-Button nur bei `security.manage` Berechtigung

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 4.4

---

### **4. Timeline-View-Komponenten**

#### **4.1 TimelineView.tsx**

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
- Timeline-View anzeigen (chronologische Ereignis-Übersicht)
- Filter (Zeitraum, Kategorie, Severity, Source)
- Zoom (Stunde, Tag, Woche, Monat)
- Event-Details anzeigen (Tooltip)

**UI-Elemente:**
- Timeline-Grafik (TimelineChart-Komponente)
- Filter-Bar (UOCFilterBar-Komponente)
- Zoom-Controls (Dropdown: hour, day, week, month)
- Event-Details (Tooltip bei Hover)

**Dark Mode:** ✅ Vollständig unterstützt

**API:** `GET /api/orchestrator/uoc/timeline`

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 5.1

---

#### **4.2 EventMarker.tsx**

**Pfad:** `src/components/orchestrator/uoc/EventMarker.tsx`

**Props:**
```typescript
interface EventMarkerProps {
  event: Event;
  isRootCause?: boolean;
  onClick?: () => void;
}
```

**Funktionen:**
- Event-Marker anzeigen (verschiedene Farben für Log/Alert/Metric/Incident)
- Root-Cause hervorheben (rot, größer)
- Klick-Handler (Event-Details anzeigen)

**UI-Elemente:**
- Event-Marker (Kreis, verschiedene Farben: Log=blau, Alert=rot, Metric=grün, Incident=orange)
- Root-Cause-Highlighting (rot, größer, Glow-Effekt)
- Tooltip (bei Hover, zeigt Event-Details)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 5.2

---

### **5. Live-Streaming-Komponenten**

#### **5.1 LiveStreamIndicator.tsx**

**Pfad:** `src/components/orchestrator/uoc/LiveStreamIndicator.tsx`

**Props:**
```typescript
interface LiveStreamIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
  className?: string;
}
```

**Funktionen:**
- Live-Stream-Status anzeigen (verbunden/getrennt)
- Letzte Aktualisierung anzeigen
- Verbindungs-Status (grün=verbunden, rot=getrennt)

**UI-Elemente:**
- Status-Indikator (Kreis, grün=verbunden, rot=getrennt)
- Status-Text ("Live" oder "Getrennt")
- Letzte Aktualisierung (relativ, z.B. "vor 5 Sekunden")

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 6.1

---

#### **5.2 LiveUpdateCard.tsx**

**Pfad:** `src/components/orchestrator/uoc/LiveUpdateCard.tsx`

**Props:**
```typescript
interface LiveUpdateCardProps {
  eventType: 'alert' | 'metric' | 'log' | 'health' | 'incident';
  data: unknown;
  timestamp: Date;
  onDismiss?: () => void;
}
```

**Funktionen:**
- Live-Update-Karte anzeigen (Toast-ähnlich)
- Event-Typ anzeigen (Alert, Metric, Log, Health, Incident)
- Event-Daten anzeigen (kompakt)
- Auto-Dismiss (nach 5 Sekunden)

**UI-Elemente:**
- Event-Typ-Badge (Alert, Metric, Log, Health, Incident)
- Event-Daten (kompakt, z.B. "Alert: Security Alert")
- Zeitstempel (relativ)
- Dismiss-Button (X)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 6.2

---

### **6. Utility-Komponenten**

#### **6.1 UOCFilterBar.tsx**

**Pfad:** `src/components/orchestrator/uoc/UOCFilterBar.tsx`

**Props:**
```typescript
interface UOCFilterBarProps {
  filters: UOCFilters;
  onFilterChange: (filters: UOCFilters) => void;
  availableCategories?: string[];
  availableSeverities?: string[];
  availableSources?: string[];
}
```

**Funktionen:**
- Filter-Bar anzeigen (Zeitraum, Kategorie, Severity, Source)
- Filter ändern (Dropdowns, Checkboxes)
- Filter zurücksetzen (Button)

**UI-Elemente:**
- Zeitraum-Picker (Dropdown: 1h, 6h, 24h, 7d)
- Kategorie-Filter (Multi-Select, Checkboxes)
- Severity-Filter (Multi-Select, Checkboxes)
- Source-Filter (Multi-Select, Checkboxes: alerts, incidents, logs, metrics)
- Reset-Button (Filter zurücksetzen)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 7.1

---

#### **6.2 UnifiedChart.tsx**

**Pfad:** `src/components/orchestrator/uoc/UnifiedChart.tsx`

**Props:**
```typescript
interface UnifiedChartProps {
  data: unknown[];
  type: 'line' | 'bar' | 'area';
  xKey: string;
  yKey: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}
```

**Funktionen:**
- Unified Chart anzeigen (Line, Bar, Area)
- Daten visualisieren (Recharts)
- Tooltip mit Details

**UI-Elemente:**
- Chart (Recharts: LineChart, BarChart, AreaChart)
- Zeitachse (X-Achse)
- Wert-Achse (Y-Achse)
- Tooltip (bei Hover)
- Legende (optional)

**Dark Mode:** ✅ Vollständig unterstützt (Recharts Dark Mode Theme)

**Referenzen:**
- `P9-COMPONENTS.md` Abschnitt 7.2
- Recharts Dokumentation

---

## ✅ ERFOLGSKRITERIEN

**Phase 3 ist produktionsreif, wenn:**
- ✅ Alle 20 UI-Komponenten implementiert
- ✅ Dark Mode vollständig unterstützt (alle Komponenten)
- ✅ Zero-Trust UI implementiert (Buttons/Aktionen abhängig von RBAC)
- ✅ Integration mit Phase 2 APIs funktioniert (REST-API, SSE-Streaming)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, WarningBanner)
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P9-HANDBOOK-FOR-BUILDER.md` Phase 3 – Vollständiger Implementierungsauftrag
- `P9-COMPONENTS.md` – Komponenten-Spezifikation (alle 20 Komponenten)

**Bestehende UI-Komponenten (Patterns):**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen
- `src/components/ui/StatusBadge.tsx` – Status-Badges
- `src/components/ui/SeverityBadge.tsx` – Severity-Badges
- `src/components/orchestrator/logs/LogLevelBadge.tsx` – Log-Level-Badges

**Bestehende APIs (Phase 2):**
- `GET /api/orchestrator/uoc/dashboard` – Dashboard-Daten
- `GET /api/orchestrator/uoc/correlations` – Korrelations-Daten
- `GET /api/orchestrator/uoc/root-cause/[incidentId]` – Root-Cause-Analysis
- `GET /api/orchestrator/uoc/timeline` – Timeline-Daten
- SSE-Endpoints: `/api/orchestrator/uoc/stream/*`

**UI-Bibliotheken:**
- Recharts (Charts)
- Shadcn/ui (UI-Komponenten)
- Lucide React (Icons)
- Tailwind CSS (Styling, Dark Mode)

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 3 (UI-Komponenten).**

**Reihenfolge:**
1. Dashboard-Komponenten implementieren (UOCDashboard, KPICard, UnifiedAlertList, UnifiedIncidentList, UnifiedLogList, SystemHealthCard, APIPerformanceChart, QueueStatusCard)
2. Correlation-View-Komponenten implementieren (CorrelationView, CorrelationTable)
3. Root-Cause-Analysis-View-Komponenten implementieren (RootCauseAnalysisView, TimelineChart, ImpactVisualization, SolutionList)
4. Timeline-View-Komponenten implementieren (TimelineView, EventMarker)
5. Live-Streaming-Komponenten implementieren (LiveStreamIndicator, LiveUpdateCard)
6. Utility-Komponenten implementieren (UOCFilterBar, UnifiedChart)

**Nach Abschluss:**
- Agent C prüft Phase 3 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet Phase 4 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 3 bereit für Implementierung*



