# P8-D-UI-SPEC

## UI-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-D

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige UI-Spezifikation** für das Telemetrie & Monitoring-System (P8-D).

**Anforderungen:**
- **Design & Layout** nach Enterprise++ Standard
- **Komponenten** vollständig spezifiziert
- **Seiten** mit Layout-Diagrammen
- **Live-Auto-Refresh** (5 Sekunden)
- **Dark Mode** vollständig unterstützt
- **Zero-Trust UI** (keine personenbezogenen Daten)

---

## 2. Design-Standards

### **2.1 Framework & Technologie**

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Shadcn/ui (falls vorhanden)
- **Icons:** Lucide React
- **Charts:** Recharts (für Grafiken)
- **Streaming:** Server-Sent Events (SSE) für Live-Updates

---

### **2.2 Enterprise++ Design**

- **Design-System:** SAP/IBM/Siemens-Niveau
- **Dark Mode:** Vollständig unterstützt
- **Mobile:** Responsive Design
- **Accessibility:** WCAG 2.1 AA
- **Performance:** Optimiert (Lazy Loading, Code Splitting)

---

### **2.3 Farben & Typografie**

**Farben:**
- Primary: Enterprise-Blau
- Success: Grün
- Warning: Gelb
- Error: Rot
- Info: Blau

**Health-Farben:**
- `healthy`: Grün
- `degraded`: Gelb
- `unhealthy`: Orange
- `critical`: Rot

**Typografie:**
- Font: System Font Stack
- Headings: Bold, größere Schriftgrößen
- Body: Regular, normale Schriftgröße

---

## 3. Komponenten

### **3.1 SystemHealthCard**

**Pfad:** `components/orchestrator/monitoring/SystemHealthCard.tsx`

**Props:**
```typescript
interface SystemHealthCardProps {
  component: string;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
  healthScore: number;
  metrics?: Record<string, number>;
}
```

**Funktionen:**
- System-Health-Status anzeigen
- Health-Score anzeigen
- Metriken-Zusammenfassung anzeigen
- Auto-Refresh (5 Sekunden)

**UI-Elemente:**
- Health-Status-Badge
- Health-Score (0-100)
- Metriken-Zusammenfassung (Karten)
- Issues-Liste (falls vorhanden)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.2 CPUGraph**

**Pfad:** `components/orchestrator/monitoring/CPUGraph.tsx`

**Props:**
```typescript
interface CPUGraphProps {
  data: Metric[];
  timeRange: '1h' | '6h' | '24h' | '7d';
  live?: boolean;
}
```

**Funktionen:**
- CPU-Usage-Grafik anzeigen
- Live-Updates (5 Sekunden)
- Zeitbereich wählen
- Zoom-Funktion

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- CPU-Usage-Werte
- Schwellwerte (Warning, Critical)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.3 RAMGraph**

**Pfad:** `components/orchestrator/monitoring/RAMGraph.tsx`

**Props:**
```typescript
interface RAMGraphProps {
  data: Metric[];
  timeRange: '1h' | '6h' | '24h' | '7d';
  live?: boolean;
}
```

**Funktionen:**
- RAM-Usage-Grafik anzeigen
- Live-Updates (5 Sekunden)
- Zeitbereich wählen
- Zoom-Funktion

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- RAM-Usage-Werte
- Schwellwerte (Warning, Critical)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.4 DiskGraph**

**Pfad:** `components/orchestrator/monitoring/DiskGraph.tsx`

**Props:**
```typescript
interface DiskGraphProps {
  data: Metric[];
  timeRange: '1h' | '6h' | '24h' | '7d';
  live?: boolean;
}
```

**Funktionen:**
- Disk-Usage-Grafik anzeigen
- Live-Updates (5 Sekunden)
- Zeitbereich wählen
- Zoom-Funktion

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- Disk-Usage-Werte
- Schwellwerte (Warning, Critical)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.5 APILatencyChart**

**Pfad:** `components/orchestrator/monitoring/APILatencyChart.tsx`

**Props:**
```typescript
interface APILatencyChartProps {
  data: Metric[];
  percentile: 'P50' | 'P95' | 'P99';
  timeRange: '1h' | '6h' | '24h' | '7d';
  live?: boolean;
}
```

**Funktionen:**
- API-Latenz-Grafik anzeigen
- Perzentil wählen (P50, P95, P99)
- Live-Updates (5 Sekunden)
- Zeitbereich wählen

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- Latenz-Werte
- Schwellwerte (Warning, Critical)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.6 ErrorRateChart**

**Pfad:** `components/orchestrator/monitoring/ErrorRateChart.tsx`

**Props:**
```typescript
interface ErrorRateChartProps {
  data: Metric[];
  errorType?: 'all' | '4xx' | '5xx' | 'timeout';
  timeRange: '1h' | '6h' | '24h' | '7d';
  live?: boolean;
}
```

**Funktionen:**
- Error-Rate-Grafik anzeigen
- Fehlertyp wählen (All, 4xx, 5xx, Timeout)
- Live-Updates (5 Sekunden)
- Zeitbereich wählen

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- Error-Rate-Werte
- Schwellwerte (Warning, Critical)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.7 QueueDepthCard**

**Pfad:** `components/orchestrator/monitoring/QueueDepthCard.tsx`

**Props:**
```typescript
interface QueueDepthCardProps {
  currentDepth: number;
  maxDepth: number;
  throughput: number;
  waitTime: number;
  live?: boolean;
}
```

**Funktionen:**
- Queue-Tiefe anzeigen
- Queue-Durchsatz anzeigen
- Queue-Wartezeit anzeigen
- Live-Updates (5 Sekunden)

**UI-Elemente:**
- Progress-Bar (Queue-Tiefe)
- Metriken-Karten (Durchsatz, Wartezeit)
- Status-Badge

**Dark Mode:** ✅ Vollständig unterstützt

---

## 4. Seiten

### **4.1 /admin/monitoring**

**Pfad:** `src/app/admin/monitoring/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring                        │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  System-Health (Übersicht)                      │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │  │
│  │  │System│ │API   │ │Queue │ │DB   │            │  │
│  │  │ ✅   │ │ ✅   │ │ ⚠️   │ │ ✅   │            │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  System-Metriken (Live)                         │  │
│  │  [CPU-Graph] [RAM-Graph] [Disk-Graph]          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API-Performance (Live)                        │  │
│  │  [Latenz-Graph] [Error-Rate-Graph]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue-Status (Live)                            │  │
│  │  [Queue-Depth-Card] [Throughput-Card]          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  [Auto-Refresh: ✅ Aktiv (5 Sekunden)]                 │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `SystemHealthCard` (mehrere)
- `CPUGraph`
- `RAMGraph`
- `DiskGraph`
- `APILatencyChart`
- `ErrorRateChart`
- `QueueDepthCard`

**API-Calls:**
- `GET /api/orchestrator/metrics/live` (Streaming)
- `GET /api/orchestrator/metrics/health`

**Live-Auto-Refresh:** ✅ 5 Sekunden

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.2 /admin/monitoring/system**

**Pfad:** `src/app/admin/monitoring/system/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > System               │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Zeitbereich: 1h | 6h | 24h | 7d]  [Live: ✅]         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  CPU-Usage                                      │  │
│  │  [Line-Chart: CPU-Usage über Zeit]              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  RAM-Usage                                      │  │
│  │  [Line-Chart: RAM-Usage über Zeit]              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Disk-Usage                                     │  │
│  │  [Line-Chart: Disk-Usage über Zeit]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Network-Usage                                  │  │
│  │  [Line-Chart: Network-Usage über Zeit]          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `CPUGraph`
- `RAMGraph`
- `DiskGraph`
- `NetworkGraph` (ähnlich wie CPUGraph)

**API-Calls:**
- `GET /api/orchestrator/metrics/system?rollup_interval=1min`

**Live-Auto-Refresh:** ✅ 5 Sekunden

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.3 /admin/monitoring/api**

**Pfad:** `src/app/admin/monitoring/api/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > API                  │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Zeitbereich: 1h | 6h | 24h | 7d]  [Live: ✅]         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API Response Time                              │  │
│  │  [Perzentil: P50 | P95 | P99]                   │  │
│  │  [Line-Chart: Latenz über Zeit]                  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API Error Rate                                 │  │
│  │  [Fehlertyp: All | 4xx | 5xx | Timeout]        │  │
│  │  [Line-Chart: Error-Rate über Zeit]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  API Request Rate                                │  │
│  │  [Line-Chart: Request-Rate über Zeit]           │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `APILatencyChart`
- `ErrorRateChart`
- `RequestRateChart` (ähnlich wie APILatencyChart)

**API-Calls:**
- `GET /api/orchestrator/metrics/api-performance?rollup_interval=1min`

**Live-Auto-Refresh:** ✅ 5 Sekunden

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.4 /admin/monitoring/queue**

**Pfad:** `src/app/admin/monitoring/queue/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > Queue                 │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Live: ✅]                                              │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue-Status (Live)                            │  │
│  │  Tiefe: 500 / 1000 (50%)                        │  │
│  │  [Progress-Bar]                                 │  │
│  │  Durchsatz: 10 tasks/s                          │  │
│  │  Wartezeit: 5s (Avg)                            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue-Tiefe über Zeit                          │  │
│  │  [Line-Chart: Queue-Depth über Zeit]            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue-Durchsatz über Zeit                      │  │
│  │  [Line-Chart: Throughput über Zeit]             │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `QueueDepthCard`
- `QueueDepthChart` (Line-Chart)
- `QueueThroughputChart` (Line-Chart)

**API-Calls:**
- `GET /api/orchestrator/metrics/queue?rollup_interval=1min`

**Live-Auto-Refresh:** ✅ 5 Sekunden

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.5 /admin/monitoring/db**

**Pfad:** `src/app/admin/monitoring/db/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > Database             │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Zeitbereich: 1h | 6h | 24h | 7d]  [Live: ✅]         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Connection Pool Usage                         │  │
│  │  [Progress-Bar: 60%]                           │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Slow Query Count                              │  │
│  │  [Line-Chart: Slow-Queries über Zeit]          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Query Rate                                     │  │
│  │  [Line-Chart: Query-Rate über Zeit]             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Replication Lag                                │  │
│  │  [Line-Chart: Replication-Lag über Zeit]       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `ConnectionPoolCard` (Progress-Bar)
- `SlowQueryChart` (Line-Chart)
- `QueryRateChart` (Line-Chart)
- `ReplicationLagChart` (Line-Chart)

**API-Calls:**
- `GET /api/orchestrator/metrics/db?rollup_interval=1min`

**Live-Auto-Refresh:** ✅ 5 Sekunden

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.6 /admin/monitoring/logs**

**Pfad:** `src/app/admin/monitoring/logs/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > Logs                  │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Filter: Level | Component | Zeitraum]  [Suche]         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Metriken-Events                                │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Level │ Komponente │ Event │ Details│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 10:00│ ⚠️   │ System     │ ... │ ... │ │  │
│  │  │ 10:05│ 🔴   │ API        │ ... │ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `MetricsEventList` (Tabelle)
- `MetricsEventFilters`
- `SeverityBadge`

**API-Calls:**
- `GET /api/orchestrator/metrics/events?level={level}&component={component}`

**Live-Auto-Refresh:** ✅ 5 Sekunden (optional)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4.7 /admin/monitoring/charts**

**Pfad:** `src/app/admin/monitoring/charts/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Monitoring > Charts                │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Metriken wählen]  [Zeitbereich: 1h | 6h | 24h | 7d]   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Custom Chart 1                                 │  │
│  │  [Line-Chart: Metriken über Zeit]               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Custom Chart 2                                 │  │
│  │  [Line-Chart: Metriken über Zeit]               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  [Button: Neuen Chart erstellen]                         │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `CustomChart` (konfigurierbar)
- `ChartConfigurator` (Metriken wählen, Zeitbereich)

**API-Calls:**
- `GET /api/orchestrator/metrics/system?metric_ids={ids}&rollup_interval={interval}`

**Live-Auto-Refresh:** ✅ 5 Sekunden (optional)

**Dark Mode:** ✅ Vollständig unterstützt

---

## 5. Live-Auto-Refresh

### **5.1 Implementierung**

**Methode:** Server-Sent Events (SSE) oder Polling

**Intervall:** 5 Sekunden

**Komponenten:**
- Alle Grafiken unterstützen Live-Updates
- Auto-Refresh kann ein/ausgeschaltet werden
- Verbindungsstatus anzeigen

---

### **5.2 Performance-Optimierung**

**Strategien:**
- Lazy Loading für nicht sichtbare Grafiken
- Code Splitting für große Komponenten
- Memoization für teure Berechnungen
- Debouncing für Filter-Änderungen

---

## 6. Anforderungen

### **6.1 Dark Mode**

**Vollständige Unterstützung:**
- Alle Komponenten unterstützen Dark Mode
- Farben angepasst (Light/Dark)
- Kontraste gewährleistet (WCAG 2.1 AA)

---

### **6.2 Zero-Trust UI**

**Anforderungen:**
- Keine personenbezogenen Daten in Metriken
- PD-Filter aktiviert
- Pseudonymisierung bei notwendigen Daten
- Warnung bei PD-Erkennung

---

### **6.3 Fehleranzeigen**

**Anzeige bei:**
- API-Fehlern
- Streaming-Verbindungsfehlern
- Datenlücken

**Format:**
```
❌ Fehler: [Fehlermeldung]
```

---

### **6.4 Warnbanner**

**Anzeige bei:**
- Metriken-Schwellwert-Überschreitungen
- System-Health-Problemen
- Verbindungsproblemen

**Format:**
```
⚠️ Warnung: [Warnmeldung]
```

---

### **6.5 Statusbadges**

**Badges für:**
- Health-Status (healthy, degraded, unhealthy, critical)
- Metriken-Status (ok, warning, critical)
- Verbindungsstatus (connected, disconnected)

**Farbcodierung:**
- `healthy` / `ok` / `connected`: Grün
- `degraded` / `warning`: Gelb
- `unhealthy` / `critical` / `disconnected`: Rot

---

## 7. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – UI-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




