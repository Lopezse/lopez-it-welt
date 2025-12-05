# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P9 Phase 5: Live-Streaming-Integration

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P9 Phase 5 (Live-Streaming-Integration) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Phasen:**
- ✅ P9 Phase 1 (Backend-Komponenten) – Vollständig implementiert
- ✅ P9 Phase 2 (API-Endpoints) – Vollständig implementiert (SSE-Endpoints vorhanden)
- ✅ P9 Phase 3 (UI-Komponenten) – Vollständig implementiert (LiveStreamIndicator, LiveUpdateCard vorhanden)
- ✅ P9 Phase 4 (Admin-Seiten) – Vollständig implementiert

**Bereits vorhanden:**
- ✅ SSE-Endpoints (Phase 2): `/api/orchestrator/uoc/stream/*`
- ✅ LiveStreamIndicator-Komponente (Phase 3)
- ✅ LiveUpdateCard-Komponente (Phase 3)
- ✅ Grundlegende SSE-Integration in UOCDashboard (noch ohne Auto-Reconnect)

---

## 🎯 ZU IMPLEMENTIEREN

### **1. Wiederverwendbarer SSE-Client-Hook**

**Pfad:** `src/lib/hooks/useSSEStream.ts`

**Funktionen:**
```typescript
interface UseSSEStreamOptions {
  url: string;
  enabled?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number; // Standard: 5000ms
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  queryParams?: Record<string, string>;
}

interface UseSSEStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useSSEStream(options: UseSSEStreamOptions): UseSSEStreamReturn {
  // Implementierung:
  // 1. EventSource erstellen
  // 2. Auto-Reconnect bei Verbindungsabbruch
  // 3. Heartbeat-Handling (alle 30 Sekunden)
  // 4. Event-Handler (onMessage, onError, onOpen, onClose)
  // 5. Cleanup bei Unmount
  // 6. Reconnect-Funktion
  // 7. Disconnect-Funktion
}
```

**Features:**
- Auto-Reconnect bei Verbindungsabbruch (konfigurierbar, Standard: 5 Sekunden)
- Heartbeat-Handling (alle 30 Sekunden, aktualisiert `lastUpdate`)
- Event-Handler für verschiedene Event-Typen (alert, metric, log, health, heartbeat)
- Cleanup bei Unmount
- Manuelles Reconnect/Disconnect

**Referenzen:**
- Browser EventSource API
- React Hooks Pattern

---

### **2. Spezifische SSE-Hooks**

**Ordner:** `src/lib/hooks/`

#### **2.1 useUOCEventsStream.ts**

**Pfad:** `src/lib/hooks/useUOCEventsStream.ts`

**Funktionen:**
```typescript
interface UseUOCEventsStreamOptions {
  enabled?: boolean;
  filters?: {
    source?: "alerts" | "incidents" | "logs" | "metrics";
    severity?: string;
  };
  onAlert?: (alert: Alert) => void;
  onMetric?: (metric: Metric) => void;
  onLog?: (log: Log) => void;
  onHealth?: (health: SystemHealth) => void;
  onIncident?: (incident: Incident) => void;
}

export function useUOCEventsStream(options: UseUOCEventsStreamOptions) {
  // Verwendet useSSEStream mit URL: /api/orchestrator/uoc/stream/events
  // Mapped Events zu Callbacks (onAlert, onMetric, onLog, onHealth, onIncident)
}
```

**Verwendung:**
- Für UOCDashboard (alle Event-Typen)
- Filter: source, severity

---

#### **2.2 useUOCAlertsStream.ts**

**Pfad:** `src/lib/hooks/useUOCAlertsStream.ts`

**Funktionen:**
```typescript
interface UseUOCAlertsStreamOptions {
  enabled?: boolean;
  filters?: {
    severity?: string;
    category?: string;
  };
  onAlert?: (alert: Alert) => void;
}

export function useUOCAlertsStream(options: UseUOCAlertsStreamOptions) {
  // Verwendet useSSEStream mit URL: /api/orchestrator/uoc/stream/alerts
  // Mapped Events zu onAlert-Callback
}
```

**Verwendung:**
- Für Alert-Listen (nur Alerts)

---

#### **2.3 useUOCMetricsStream.ts**

**Pfad:** `src/lib/hooks/useUOCMetricsStream.ts`

**Funktionen:**
```typescript
interface UseUOCMetricsStreamOptions {
  enabled?: boolean;
  filters?: {
    category?: string;
    metric_id?: string;
  };
  onMetric?: (metric: Metric) => void;
}

export function useUOCMetricsStream(options: UseUOCMetricsStreamOptions) {
  // Verwendet useSSEStream mit URL: /api/orchestrator/uoc/stream/metrics
  // Mapped Events zu onMetric-Callback
}
```

**Verwendung:**
- Für Metrics-Charts (nur Metrics)

---

#### **2.4 useUOCLogsStream.ts**

**Pfad:** `src/lib/hooks/useUOCLogsStream.ts`

**Funktionen:**
```typescript
interface UseUOCLogsStreamOptions {
  enabled?: boolean;
  filters?: {
    log_level?: string;
    category?: string;
    severity?: string;
  };
  onLog?: (log: Log) => void;
}

export function useUOCLogsStream(options: UseUOCLogsStreamOptions) {
  // Verwendet useSSEStream mit URL: /api/orchestrator/uoc/stream/logs
  // Mapped Events zu onLog-Callback
}
```

**Verwendung:**
- Für Log-Listen (nur Logs)

---

#### **2.5 useUOCHealthStream.ts**

**Pfad:** `src/lib/hooks/useUOCHealthStream.ts`

**Funktionen:**
```typescript
interface UseUOCHealthStreamOptions {
  enabled?: boolean;
  onHealth?: (health: SystemHealth) => void;
}

export function useUOCHealthStream(options: UseUOCHealthStreamOptions) {
  // Verwendet useSSEStream mit URL: /api/orchestrator/uoc/stream/health
  // Mapped Events zu onHealth-Callback
}
```

**Verwendung:**
- Für SystemHealthCard (nur Health-Updates)

---

### **3. UOCDashboard SSE-Integration verbessern**

**Pfad:** `src/components/orchestrator/uoc/UOCDashboard.tsx`

**Zu verbessern:**
- Aktuelle SSE-Integration durch `useUOCEventsStream` ersetzen
- Auto-Reconnect implementieren
- Heartbeat-Handling verbessern
- LiveStreamIndicator integrieren
- LiveUpdateCard für neue Events anzeigen

**Vorher (aktuell):**
```typescript
useEffect(() => {
  if (!autoRefresh) return;
  
  const eventSource = new EventSource("/api/orchestrator/uoc/stream/events");
  // ... einfache Implementierung ohne Auto-Reconnect
}, [autoRefresh]);
```

**Nachher (verbessert):**
```typescript
const {
  isConnected,
  lastUpdate,
  error,
} = useUOCEventsStream({
  enabled: autoRefresh,
  filters: filters,
  onAlert: (alert) => {
    // Update alerts in data
    setData((prev) => ({
      ...prev,
      alerts: [alert, ...(prev?.alerts || [])].slice(0, 10),
    }));
    // Zeige LiveUpdateCard an (optional)
  },
  onMetric: (metric) => {
    // Update metrics in data
  },
  onLog: (log) => {
    // Update logs in data
  },
  onHealth: (health) => {
    // Update system health in data
  },
});
```

**UI-Integration:**
- LiveStreamIndicator anzeigen (oben rechts)
- LiveUpdateCard für neue Events anzeigen (Toast-ähnlich, optional)

---

### **4. SystemHealthCard SSE-Integration**

**Pfad:** `src/components/orchestrator/uoc/SystemHealthCard.tsx`

**Zu implementieren:**
- `useUOCHealthStream` verwenden
- Auto-Refresh via SSE (statt Polling)
- LiveStreamIndicator integrieren

**Vorher (aktuell):**
```typescript
useEffect(() => {
  if (!autoRefresh) return;
  
  const interval = setInterval(() => {
    loadHealth();
  }, refreshInterval);
  
  return () => clearInterval(interval);
}, [autoRefresh, refreshInterval]);
```

**Nachher (verbessert):**
```typescript
const {
  isConnected,
  lastUpdate,
} = useUOCHealthStream({
  enabled: autoRefresh,
  onHealth: (health) => {
    setHealth(health);
  },
});
```

---

### **5. APIPerformanceChart SSE-Integration**

**Pfad:** `src/components/orchestrator/uoc/APIPerformanceChart.tsx`

**Zu implementieren:**
- `useUOCMetricsStream` verwenden
- Auto-Refresh via SSE (statt Polling)
- Live-Updates für Metrics

**Vorher (aktuell):**
```typescript
useEffect(() => {
  if (!autoRefresh) return;
  
  const interval = setInterval(() => {
    loadMetrics();
  }, refreshInterval);
  
  return () => clearInterval(interval);
}, [autoRefresh, refreshInterval]);
```

**Nachher (verbessert):**
```typescript
const {
  isConnected,
  lastUpdate,
} = useUOCMetricsStream({
  enabled: autoRefresh,
  filters: {
    category: "API",
  },
  onMetric: (metric) => {
    // Update metrics in chart data
    setMetrics((prev) => [...prev, metric].slice(-100)); // Keep last 100
  },
});
```

---

### **6. UnifiedAlertList SSE-Integration (Optional)**

**Pfad:** `src/components/orchestrator/uoc/UnifiedAlertList.tsx`

**Zu implementieren:**
- `useUOCAlertsStream` verwenden (optional, falls Live-Updates gewünscht)
- Neue Alerts automatisch hinzufügen

**Hinweis:** Optional, da UOCDashboard bereits alle Alerts streamt.

---

### **7. LiveUpdateCard Toast-System**

**Pfad:** `src/components/orchestrator/uoc/LiveUpdateCard.tsx` (bereits vorhanden)

**Zu erweitern:**
- Toast-Container für mehrere LiveUpdateCards
- Auto-Dismiss nach 5 Sekunden
- Position: oben rechts (oder konfigurierbar)

**Neue Komponente:** `LiveUpdateToastContainer.tsx`

**Pfad:** `src/components/orchestrator/uoc/LiveUpdateToastContainer.tsx`

**Funktionen:**
```typescript
interface LiveUpdateToastContainerProps {
  maxToasts?: number; // Standard: 5
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function LiveUpdateToastContainer({
  maxToasts = 5,
  position = "top-right",
}: LiveUpdateToastContainerProps) {
  // Verwaltet mehrere LiveUpdateCards
  // Auto-Dismiss nach 5 Sekunden
  // Position konfigurierbar
}
```

**Integration:**
- In UOCDashboard verwenden
- Zeigt neue Events als Toast an

---

## ✅ ERFOLGSKRITERIEN

**Phase 5 ist produktionsreif, wenn:**
- ✅ Wiederverwendbarer SSE-Client-Hook implementiert (`useSSEStream`)
- ✅ Spezifische SSE-Hooks implementiert (useUOCEventsStream, useUOCAlertsStream, useUOCMetricsStream, useUOCLogsStream, useUOCHealthStream)
- ✅ Auto-Reconnect funktioniert (bei Verbindungsabbruch, konfigurierbar)
- ✅ Heartbeat-Handling funktioniert (alle 30 Sekunden, aktualisiert `lastUpdate`)
- ✅ UOCDashboard SSE-Integration verbessert (Auto-Reconnect, LiveStreamIndicator, LiveUpdateCard)
- ✅ SystemHealthCard SSE-Integration (statt Polling)
- ✅ APIPerformanceChart SSE-Integration (statt Polling)
- ✅ LiveUpdateToastContainer implementiert (optional)
- ✅ Fehlerbehandlung korrekt (Error-Handling, Reconnect-Logik)
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P9-HANDBOOK-FOR-BUILDER.md` Phase 5 – Vollständiger Implementierungsauftrag
- `P9-API-SPEC.md` Abschnitt 4 – Streaming-API-Spezifikation

**Bestehende SSE-Endpoints (Phase 2):**
- `GET /api/orchestrator/uoc/stream/alerts` – Alerts-Stream
- `GET /api/orchestrator/uoc/stream/metrics` – Metrics-Stream
- `GET /api/orchestrator/uoc/stream/logs` – Logs-Stream
- `GET /api/orchestrator/uoc/stream/health` – Health-Stream
- `GET /api/orchestrator/uoc/stream/events` – Events-Stream (alle Typen)

**Bestehende Komponenten (Phase 3):**
- `src/components/orchestrator/uoc/LiveStreamIndicator.tsx`
- `src/components/orchestrator/uoc/LiveUpdateCard.tsx`
- `src/components/orchestrator/uoc/UOCDashboard.tsx` (bestehende SSE-Integration)
- `src/components/orchestrator/uoc/SystemHealthCard.tsx`
- `src/components/orchestrator/uoc/APIPerformanceChart.tsx`

**Browser APIs:**
- EventSource API (MDN Dokumentation)
- React Hooks Pattern

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 5 (Live-Streaming-Integration).**

**Reihenfolge:**
1. Wiederverwendbarer SSE-Client-Hook implementieren (`useSSEStream`)
2. Spezifische SSE-Hooks implementieren (useUOCEventsStream, useUOCAlertsStream, useUOCMetricsStream, useUOCLogsStream, useUOCHealthStream)
3. UOCDashboard SSE-Integration verbessern (Auto-Reconnect, LiveStreamIndicator, LiveUpdateCard)
4. SystemHealthCard SSE-Integration (statt Polling)
5. APIPerformanceChart SSE-Integration (statt Polling)
6. LiveUpdateToastContainer implementieren (optional)

**Nach Abschluss:**
- Agent C prüft Phase 5 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet Phase 6 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 5 bereit für Implementierung*



