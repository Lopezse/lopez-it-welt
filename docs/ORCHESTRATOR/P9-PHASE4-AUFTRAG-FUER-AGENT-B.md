# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P9 Phase 4: Admin-Seiten

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P9 Phase 4 (Admin-Seiten) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Phasen:**
- ✅ P9 Phase 1 (Backend-Komponenten) – Vollständig implementiert
- ✅ P9 Phase 2 (API-Endpoints) – Vollständig implementiert
- ✅ P9 Phase 3 (UI-Komponenten) – Vollständig implementiert (20 Komponenten)

**Bereits vorhanden:**
- ✅ Alle UOC-Komponenten (UOCDashboard, KPICard, UnifiedAlertList, etc.)
- ✅ Admin-Seiten-Patterns (z.B. `src/app/admin/orchestrator/alerts/page.tsx`)
- ✅ RBAC-Hooks (`useSecurityPermissions`, `useLogsPermissions`, etc.)
- ✅ ErrorBanner, WarningBanner, StatusBadge, SeverityBadge
- ✅ Dark Mode Support

---

## 🎯 ZU IMPLEMENTIEREN

### **1. /admin/uoc (UOC Dashboard)**

**Pfad:** `src/app/admin/uoc/page.tsx`

**Funktionen:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { UOCDashboard } from "@/components/orchestrator/uoc/UOCDashboard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions"; // Falls vorhanden

export default function UOCDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UOCFilters>({});
  
  const { canView: canViewSecurity } = useSecurityPermissions();
  const { canView: canViewLogs } = useLogsPermissions();
  // const { canView: canViewMonitoring } = useMonitoringPermissions(); // Falls vorhanden
  
  // RBAC: Mindestens eine Berechtigung erforderlich
  const canView = canViewSecurity() || canViewLogs(); // || canViewMonitoring();
  
  useEffect(() => {
    if (canView) {
      // Initial load
    }
  }, [canView, filters]);
  
  // ... Rest der Implementierung
}
```

**Komponenten:**
- `UOCDashboard` – Haupt-Dashboard-Komponente
- `ErrorBanner` – Fehlerbehandlung
- `LiveStreamIndicator` – Live-Stream-Status (optional)

**API-Calls:**
- `GET /api/orchestrator/uoc/dashboard` – Dashboard-Daten (mit Query-Parametern: timeRange, category, severity, source)
- `GET /api/orchestrator/uoc/stream/events` – Live-Streaming (SSE, optional)

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view` (mindestens eine Berechtigung erforderlich)

**Layout:**
- Breadcrumbs: "Admin > Unified Operations Center"
- Header: Titel "Unified Operations Center", Filter, Refresh-Button, Live-Stream-Toggle
- UOCDashboard-Komponente (enthält alle Sub-Komponenten)

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Buttons/Aktionen abhängig von Berechtigungen

**Referenzen:**
- `P9-PAGES.md` Abschnitt 2.1
- `src/app/admin/orchestrator/alerts/page.tsx` (Pattern)
- `src/components/orchestrator/uoc/UOCDashboard.tsx`

---

### **2. /admin/uoc/correlation (Correlation View)**

**Pfad:** `src/app/admin/uoc/correlation/page.tsx`

**Funktionen:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { CorrelationView } from "@/components/orchestrator/uoc/CorrelationView";
import { CorrelationTable } from "@/components/orchestrator/uoc/CorrelationTable";
import { UOCFilterBar } from "@/components/orchestrator/uoc/UOCFilterBar";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { Correlation, CorrelationFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function CorrelationViewPage() {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CorrelationFilters>({
    timeRange: "24h",
    minScore: 0.5,
    limit: 100,
    offset: 0,
  });
  
  const { canView: canViewSecurity } = useSecurityPermissions();
  const { canView: canViewLogs } = useLogsPermissions();
  const canView = canViewSecurity() || canViewLogs();
  
  useEffect(() => {
    if (canView) {
      loadCorrelations();
    }
  }, [canView, filters]);
  
  const loadCorrelations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.timeRange) params.append("timeRange", filters.timeRange);
      if (filters.category) params.append("category", filters.category);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.source) params.append("source", filters.source);
      if (filters.minScore !== undefined) params.append("minScore", filters.minScore.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());
      
      const response = await fetch(`/api/orchestrator/uoc/correlations?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden der Korrelationen");
      }
      
      setCorrelations(data.data.correlations || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Korrelationen");
    } finally {
      setLoading(false);
    }
  };
  
  // ... Rest der Implementierung
}
```

**Komponenten:**
- `CorrelationView` – Correlation-View (Sankey-Diagramm)
- `CorrelationTable` – Korrelations-Tabelle
- `UOCFilterBar` – Filter-Bar
- `ErrorBanner` – Fehlerbehandlung

**API-Calls:**
- `GET /api/orchestrator/uoc/correlations` – Korrelations-Daten (mit Query-Parametern: timeRange, category, severity, source, minScore, limit, offset)

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view`

**Layout:**
- Breadcrumbs: "Admin > UOC > Correlation"
- Header: Titel "Correlation View", Filter-Bar
- CorrelationView-Komponente (Sankey-Diagramm)
- CorrelationTable-Komponente (Tabelle mit Sortierung, Pagination)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-PAGES.md` Abschnitt 2.2
- `src/components/orchestrator/uoc/CorrelationView.tsx`
- `src/components/orchestrator/uoc/CorrelationTable.tsx`

---

### **3. /admin/uoc/root-cause/[incidentId] (Root-Cause-Analysis View)**

**Pfad:** `src/app/admin/uoc/root-cause/[incidentId]/page.tsx`

**Funktionen:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RootCauseAnalysisView } from "@/components/orchestrator/uoc/RootCauseAnalysisView";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { RootCauseAnalysis } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function RootCauseAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.incidentId as string;
  
  const [rootCause, setRootCause] = useState<RootCauseAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { canView: canViewSecurity } = useSecurityPermissions();
  const { canView: canViewLogs } = useLogsPermissions();
  const canView = canViewSecurity() || canViewLogs();
  
  useEffect(() => {
    if (canView && incidentId) {
      loadRootCause();
    }
  }, [canView, incidentId]);
  
  const loadRootCause = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orchestrator/uoc/root-cause/${incidentId}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden der Root-Cause-Analyse");
      }
      
      setRootCause(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Root-Cause-Analyse");
    } finally {
      setLoading(false);
    }
  };
  
  // ... Rest der Implementierung
}
```

**Komponenten:**
- `RootCauseAnalysisView` – Root-Cause-Analysis-View (enthält TimelineChart, ImpactVisualization, SolutionList)
- `ErrorBanner` – Fehlerbehandlung

**API-Calls:**
- `GET /api/orchestrator/uoc/root-cause/[incidentId]` – Root-Cause-Analysis

**RBAC:** `security.view` ODER `monitoring.view` ODER `logs.view`

**Layout:**
- Breadcrumbs: "Admin > UOC > Root-Cause-Analysis"
- Header: Titel "Root-Cause-Analysis", Incident-ID, Severity, Status
- RootCauseAnalysisView-Komponente (Timeline, Impact, Solutions)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-PAGES.md` Abschnitt 2.3
- `src/components/orchestrator/uoc/RootCauseAnalysisView.tsx`

---

### **4. /admin/uoc/timeline (Timeline View)**

**Pfad:** `src/app/admin/uoc/timeline/page.tsx`

**Funktionen:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { TimelineView } from "@/components/orchestrator/uoc/TimelineView";
import { UOCFilterBar } from "@/components/orchestrator/uoc/UOCFilterBar";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { TimelineEvent, TimelineFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function TimelineViewPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TimelineFilters>({
    startTime: new Date(Date.now() - 3600000).toISOString(), // Letzte Stunde
    endTime: new Date().toISOString(),
    zoom: "hour",
    limit: 100,
    offset: 0,
  });
  
  const { canView: canViewSecurity } = useSecurityPermissions();
  const { canView: canViewLogs } = useLogsPermissions();
  const canView = canViewSecurity() || canViewLogs();
  
  useEffect(() => {
    if (canView) {
      loadTimeline();
    }
  }, [canView, filters]);
  
  const loadTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.startTime) params.append("startTime", filters.startTime);
      if (filters.endTime) params.append("endTime", filters.endTime);
      if (filters.category) params.append("category", filters.category);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.source) params.append("source", filters.source);
      if (filters.zoom) params.append("zoom", filters.zoom);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());
      
      const response = await fetch(`/api/orchestrator/uoc/timeline?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden der Timeline");
      }
      
      setEvents(data.data.events || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Timeline");
    } finally {
      setLoading(false);
    }
  };
  
  // ... Rest der Implementierung
}
```

**Komponenten:**
- `TimelineView` – Timeline-View (enthält TimelineChart, EventMarker)
- `UOCFilterBar` – Filter-Bar
- `ErrorBanner` – Fehlerbehandlung

**API-Calls:**
- `GET /api/orchestrator/uoc/timeline` – Timeline-Daten (mit Query-Parametern: startTime, endTime, category, severity, source, zoom, limit, offset)

**RBAC:** `monitoring.view` ODER `logs.view` ODER `security.view`

**Layout:**
- Breadcrumbs: "Admin > UOC > Timeline"
- Header: Titel "Timeline View", Filter-Bar, Zoom-Controls, Navigation (← →)
- TimelineView-Komponente (Timeline-Chart, Event-Liste)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `P9-PAGES.md` Abschnitt 2.4
- `src/components/orchestrator/uoc/TimelineView.tsx`

---

### **5. Navigation-Integration**

**Pfad:** `src/components/admin/AdminNavigation.tsx`

**Zu erweitern:** Navigation-Array

**Hinzufügen (nach "Orchestrator", vor "Monitoring"):**
```typescript
{
  name: "Unified Operations Center",
  icon: FaTachometerAlt, // Oder passendes Icon
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

**Icons prüfen:**
- Falls `FaTachometerAlt` nicht verfügbar, verwende `FaChartLine` oder `FaCogs`
- Falls `FaProjectDiagram` nicht verfügbar, verwende `FaSitemap` oder `FaNetworkWired`
- Falls `FaClock` nicht verfügbar, verwende `FaHistory` oder `FaCalendarAlt`

**Position:** Nach "Orchestrator", vor "Monitoring" (falls vorhanden)

**Referenzen:**
- `P9-PAGES.md` Abschnitt 3.1
- `src/components/admin/AdminNavigation.tsx` (bestehende Navigation)

---

## ✅ ERFOLGSKRITERIEN

**Phase 4 ist produktionsreif, wenn:**
- ✅ Alle 4 Admin-Seiten implementiert (`/admin/uoc`, `/admin/uoc/correlation`, `/admin/uoc/root-cause/[incidentId]`, `/admin/uoc/timeline`)
- ✅ Navigation-Integration funktioniert (AdminNavigation erweitert)
- ✅ RBAC korrekt implementiert (mindestens eine Berechtigung erforderlich)
- ✅ Integration mit Phase 2 APIs funktioniert (REST-API)
- ✅ Integration mit Phase 3 Komponenten funktioniert (alle UOC-Komponenten)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, Loading-States)
- ✅ Dark Mode vollständig unterstützt
- ✅ Zero-Trust UI implementiert (Buttons/Aktionen abhängig von RBAC)
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P9-HANDBOOK-FOR-BUILDER.md` Phase 4 – Vollständiger Implementierungsauftrag
- `P9-PAGES.md` – Seiten-Spezifikation (alle 4 Seiten)

**Bestehende Admin-Seiten (Patterns):**
- `src/app/admin/orchestrator/alerts/page.tsx` – Admin-Seiten-Pattern
- `src/app/admin/orchestrator/incidents/page.tsx` – Admin-Seiten-Pattern (falls vorhanden)
- `src/app/admin/logs/page.tsx` – Admin-Seiten-Pattern (falls vorhanden)

**Bestehende Komponenten (Phase 3):**
- `src/components/orchestrator/uoc/UOCDashboard.tsx`
- `src/components/orchestrator/uoc/CorrelationView.tsx`
- `src/components/orchestrator/uoc/CorrelationTable.tsx`
- `src/components/orchestrator/uoc/RootCauseAnalysisView.tsx`
- `src/components/orchestrator/uoc/TimelineView.tsx`
- `src/components/orchestrator/uoc/UOCFilterBar.tsx`

**Bestehende APIs (Phase 2):**
- `GET /api/orchestrator/uoc/dashboard` – Dashboard-Daten
- `GET /api/orchestrator/uoc/correlations` – Korrelations-Daten
- `GET /api/orchestrator/uoc/root-cause/[incidentId]` – Root-Cause-Analysis
- `GET /api/orchestrator/uoc/timeline` – Timeline-Daten

**RBAC-Hooks:**
- `src/lib/hooks/useSecurityPermissions.ts` – `useSecurityPermissions()`
- `src/lib/hooks/useLogsPermissions.ts` – `useLogsPermissions()`
- `src/lib/hooks/useMonitoringPermissions.ts` – `useMonitoringPermissions()` (falls vorhanden)

**UI-Komponenten:**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 4 (Admin-Seiten).**

**Reihenfolge:**
1. `/admin/uoc` Seite implementieren (UOC Dashboard)
2. `/admin/uoc/correlation` Seite implementieren (Correlation View)
3. `/admin/uoc/root-cause/[incidentId]` Seite implementieren (Root-Cause-Analysis View)
4. `/admin/uoc/timeline` Seite implementieren (Timeline View)
5. Navigation-Integration (AdminNavigation erweitern)

**Nach Abschluss:**
- Agent C prüft Phase 4 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet Phase 5 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 4 bereit für Implementierung*



