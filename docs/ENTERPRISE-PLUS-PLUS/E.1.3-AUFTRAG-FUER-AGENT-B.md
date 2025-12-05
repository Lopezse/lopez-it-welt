# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## E.1.3: Monitoring erweitern

**Version:** 1.0  
**Stand:** 29.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere E.1.3 (Monitoring erweitern) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Bereits vorhanden:**
- ✅ `/admin/monitoring` (Hauptseite)
- ✅ `/admin/monitoring/system` (System-Metriken: CPU, RAM, Disk)
- ✅ `/admin/monitoring/api` (API-Performance: Latenz, Error-Rate)
- ✅ `/admin/monitoring/db` (DB-Status)
- ✅ `/admin/monitoring/queue` (Queue-Status)
- ✅ P8-D Integration (Telemetrie & Monitoring APIs)
- ✅ P9 UOC Integration (Unified Operations Center)

**Fehlt noch:**
- ❌ KI-Kostenstatus-Widget
- ❌ API-Frequenz-Charts (erweitern)
- ❌ Fehlerüberwachung-Panel
- ❌ Integration mit P9 UOC (KI-Kostenstatus, API-Frequenz, Fehlerüberwachung)

---

## 🎯 ZU IMPLEMENTIEREN

### **1. KI-Kostenstatus-Widget (`AICostStatus.tsx`)**

**Pfad:** `src/components/admin/monitoring/AICostStatus.tsx`

**Props:**
```typescript
interface AICostStatusProps {
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
  showChart?: boolean;
}
```

**Funktionen:**
- KI-Kosten-Übersicht (Dashboard)
- Kosten pro KI-Service (OpenAI, Google, etc.)
- Kosten-Trend (Chart)
- Kosten-Limit-Warnung (wenn Limit überschritten)
- Auto-Refresh (optional)

**UI-Elemente:**
- Kosten-Card (Gesamtkosten, Zeitraum)
- Kosten pro Service (Liste oder Tabelle)
- Kosten-Trend (Line-Chart)
- Limit-Warnung (WarningBanner, wenn Limit überschritten)
- Zeitraum wählen (Dropdown: 1h, 6h, 24h, 7d, 30d)

**API:**
- `GET /api/orchestrator/metrics/ai-costs?time_range=[timeRange]` (neu zu erstellen oder vorhanden prüfen)
- Oder: `GET /api/orchestrator/metrics?category=ai&metric_id=AI-*` (P8-D API nutzen)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/app/admin/monitoring/page.tsx` (Pattern für Monitoring-Widgets)
- `src/components/orchestrator/uoc/KPICard.tsx` (Pattern für KPI-Cards)

---

### **2. API-Frequenz-Charts (`APIFrequencyChart.tsx`)**

**Pfad:** `src/components/admin/monitoring/APIFrequencyChart.tsx`

**Props:**
```typescript
interface APIFrequencyChartProps {
  timeRange?: "1h" | "6h" | "24h" | "7d";
  showLatency?: boolean;
  showErrorRate?: boolean;
}
```

**Funktionen:**
- API-Aufrufe pro Endpoint (Chart)
- API-Latenz (Chart)
- API-Fehlerrate (Chart)
- Zeitraum wählen (1h, 6h, 24h, 7d)

**UI-Elemente:**
- Tabs oder Toggle: "Aufrufe", "Latenz", "Fehlerrate"
- Line-Chart oder Bar-Chart (je nach Metrik)
- Zeitraum wählen (Dropdown: 1h, 6h, 24h, 7d)
- Top 10 Endpoints (Liste)

**API:**
- `GET /api/orchestrator/metrics/api?time_range=[timeRange]` (P8-D API nutzen)
- Oder: `GET /api/orchestrator/metrics?category=api&metric_id=API-*` (P8-D API nutzen)

**Integration:**
- Erweitert `/admin/monitoring/api/page.tsx` (bestehende Seite)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/app/admin/monitoring/api/page.tsx` (bestehende API-Performance-Seite)
- `src/components/orchestrator/uoc/APIPerformanceChart.tsx` (Pattern für API-Charts)

---

### **3. Fehlerüberwachung-Panel (`ErrorMonitoringPanel.tsx`)**

**Pfad:** `src/components/admin/monitoring/ErrorMonitoringPanel.tsx`

**Props:**
```typescript
interface ErrorMonitoringPanelProps {
  limit?: number; // Anzahl Fehler (Default: 10)
  showTrend?: boolean;
}
```

**Funktionen:**
- Fehler-Liste (Top 10)
- Fehler-Trend (Chart)
- Fehler-Details (Modal)
- Link zu Logs (P8-E Integration)

**UI-Elemente:**
- Fehler-Liste (Tabelle: Zeitstempel, Endpoint, Fehlertyp, Nachricht)
- Fehler-Trend (Line-Chart: Fehler pro Stunde/Tag)
- Fehler-Details (Modal: Vollständige Fehler-Informationen)
- Link zu Logs (Button: "Zu Logs" → `/admin/logs?filter=error`)

**API:**
- `GET /api/orchestrator/logs?level=error&limit=[limit]` (P8-E API nutzen)
- Oder: `GET /api/orchestrator/metrics?category=api&metric_id=API-005` (Error-Rate, P8-D API)

**Integration:**
- Neue Seite: `/admin/monitoring/errors/page.tsx` (neu zu erstellen)
- Oder: Integration in `/admin/monitoring/page.tsx` (Overview-Seite)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/app/admin/logs/page.tsx` (P8-E Logs-Seite)
- `src/components/orchestrator/logs/LogList.tsx` (Pattern für Logs-Liste)

---

### **4. Integration mit P9 UOC**

**Pfad:** `src/components/orchestrator/uoc/UOCDashboard.tsx`

**Funktionen:**
- KI-Kostenstatus in UOC Dashboard anzeigen
- API-Frequenz in UOC Dashboard anzeigen
- Fehlerüberwachung in UOC Dashboard anzeigen

**Integration:**
- `AICostStatus` in UOC Dashboard einbinden
- `APIFrequencyChart` in UOC Dashboard einbinden
- `ErrorMonitoringPanel` in UOC Dashboard einbinden

**UI-Elemente:**
- Widgets im UOC Dashboard (neue Spalte oder erweitern)
- Klick auf Widget → Detail-Seite (`/admin/monitoring/*`)

**Referenzen:**
- `src/components/orchestrator/uoc/UOCDashboard.tsx` (UOC Dashboard)
- `src/components/orchestrator/uoc/KPICard.tsx` (Pattern für KPI-Cards)

---

## ✅ ERFOLGSKRITERIEN

**E.1.3 ist produktionsreif, wenn:**
- ✅ KI-Kostenstatus-Widget funktioniert (Kosten anzeigen, Trend-Chart, Limit-Warnung)
- ✅ API-Frequenz-Charts funktionieren (Aufrufe, Latenz, Fehlerrate, Zeitraum wählen)
- ✅ Fehlerüberwachung-Panel funktioniert (Fehler-Liste, Trend-Chart, Details-Modal, Link zu Logs)
- ✅ Integration mit P9 UOC funktioniert (Widgets im UOC Dashboard)
- ✅ RBAC korrekt implementiert (`monitoring.view` für alle Komponenten)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, WarningBanner)
- ✅ Dark Mode vollständig unterstützt
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `E.1-HANDBOOK-FOR-BUILDER.md` E.1.3 – Vollständiger Implementierungsauftrag
- `E.1-OVERVIEW.md` – Gesamtübersicht
- `E.1-STATUS-ANALYSE.md` – Status-Analyse

**Bestehende Seiten:**
- `src/app/admin/monitoring/page.tsx` (Overview)
- `src/app/admin/monitoring/api/page.tsx` (API-Performance)
- `src/app/admin/monitoring/system/page.tsx` (System-Metriken)

**Bestehende APIs:**
- `GET /api/orchestrator/metrics/*` (P8-D Telemetrie APIs)
- `GET /api/orchestrator/logs/*` (P8-E Logs APIs)

**Bestehende Komponenten:**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen
- `src/components/orchestrator/uoc/KPICard.tsx` – KPI-Cards
- `src/components/orchestrator/uoc/APIPerformanceChart.tsx` – API-Charts

**Bestehende Systeme:**
- P8-D (Telemetrie & Monitoring) – APIs verfügbar
- P8-E (Log Processing & Analytics) – APIs verfügbar
- P9 (Unified Operations Center) – Dashboard verfügbar

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von E.1.3 (Monitoring erweitern).**

**Reihenfolge:**
1. KI-Kostenstatus-Widget implementieren (`AICostStatus.tsx`)
2. API-Frequenz-Charts implementieren (`APIFrequencyChart.tsx`, erweitert `/admin/monitoring/api/page.tsx`)
3. Fehlerüberwachung-Panel implementieren (`ErrorMonitoringPanel.tsx`, neue Seite `/admin/monitoring/errors/page.tsx`)
4. Integration mit P9 UOC (Widgets im UOC Dashboard)

**Nach Abschluss:**
- Agent C prüft E.1.3 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet E.1.4 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, E.1.3 bereit für Implementierung*



