# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## E.1.4: Media-KI erweitern

**Version:** 1.0  
**Stand:** 29.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere E.1.4 (Media-KI erweitern) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Bereits vorhanden:**
- ✅ `/admin/media` (Medienliste)
- ✅ `/admin/media/[id]` (Detailansicht)
- ✅ Bulk-Aktionen (teilweise)
- ✅ DSGVO-Freigaben (teilweise)
- ✅ KI-Analyse-Funktionen (API vorhanden)

**Fehlt noch:**
- ❌ Monitoring-Panel pro Bild
- ❌ Audit-Logs-Viewer
- ❌ KI-Kosten-Dashboard
- ❌ Performance-Metriken-Charts

---

## 🎯 ZU IMPLEMENTIEREN

### **1. Monitoring-Panel pro Bild (`MediaAIMonitoringPanel.tsx`)**

**Pfad:** `src/components/admin/media/ai/MediaAIMonitoringPanel.tsx`

**Props:**
```typescript
interface MediaAIMonitoringPanelProps {
  mediaId: string;
}
```

**Funktionen:**
- KI-Analyse-Status pro Bild anzeigen
- KI-Kosten pro Bild anzeigen
- KI-Performance-Metriken anzeigen
- KI-Fehler-Logs anzeigen

**UI-Elemente:**
- Status-Card (KI-Analyse-Status)
- Kosten-Card (KI-Kosten pro Bild)
- Performance-Metriken (Analyse-Zeit, Erfolgsrate)
- Fehler-Logs (Liste)

**API:**
- `GET /api/media/[id]/ai-status` (neu zu erstellen oder vorhanden prüfen)
- Oder: `GET /api/orchestrator/metrics/ai-costs?media_id=[mediaId]` (P8-D API nutzen)

**Integration:**
- Integration in `/admin/media/[id]/page.tsx` (Detail-Seite)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **2. Audit-Logs-Viewer (`MediaAIAuditLogs.tsx`)**

**Pfad:** `src/components/admin/media/ai/MediaAIAuditLogs.tsx`

**Props:**
```typescript
interface MediaAIAuditLogsProps {
  mediaId: string;
}
```

**Funktionen:**
- Audit-Logs pro Bild anzeigen
- Filter (Zeitraum, Aktion, Benutzer)
- Export (CSV, PDF)

**UI-Elemente:**
- Audit-Logs-Liste (Tabelle)
- Filter-Bar (Zeitraum, Aktion, Benutzer)
- Export-Buttons (CSV, PDF)
- Spalten: Zeitstempel, Aktion, Benutzer, Details

**API:**
- `GET /api/audit-logs?resource_type=media&resource_id=[mediaId]` (falls vorhanden)
- Oder: `GET /api/media/[id]/audit-logs` (neu zu erstellen)

**Integration:**
- Integration in `/admin/media/[id]/page.tsx` (Detail-Seite, Tab "Audit-Logs")

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3. KI-Kosten-Dashboard (`MediaAICostDashboard.tsx`)**

**Pfad:** `src/components/admin/media/ai/MediaAICostDashboard.tsx`

**Props:**
```typescript
interface MediaAICostDashboardProps {
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
}
```

**Funktionen:**
- KI-Kosten-Übersicht (Dashboard)
- Kosten pro Bild
- Kosten-Trend (Chart)
- Kosten-Limit-Warnung

**UI-Elemente:**
- Kosten-Card (Gesamtkosten, Zeitraum)
- Kosten pro Bild (Liste oder Tabelle)
- Kosten-Trend (Line-Chart)
- Limit-Warnung (WarningBanner, wenn Limit überschritten)
- Zeitraum wählen (Dropdown: 1h, 6h, 24h, 7d, 30d)

**API:**
- `GET /api/orchestrator/metrics/ai-costs?time_range=[timeRange]&category=media` (P8-D API nutzen)

**Integration:**
- Neue Seite: `/admin/media/ai/dashboard/page.tsx` (neu zu erstellen)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **4. Performance-Metriken-Charts (`MediaAIPerformanceCharts.tsx`)**

**Pfad:** `src/components/admin/media/ai/MediaAIPerformanceCharts.tsx`

**Props:**
```typescript
interface MediaAIPerformanceChartsProps {
  timeRange?: "1h" | "6h" | "24h" | "7d";
}
```

**Funktionen:**
- KI-Analyse-Zeit (Chart)
- KI-Erfolgsrate (Chart)
- KI-Fehlerrate (Chart)
- Zeitraum wählen (1h, 6h, 24h, 7d)

**UI-Elemente:**
- Tabs oder Toggle: "Analyse-Zeit", "Erfolgsrate", "Fehlerrate"
- Line-Chart oder Bar-Chart (je nach Metrik)
- Zeitraum wählen (Dropdown: 1h, 6h, 24h, 7d)

**API:**
- `GET /api/orchestrator/metrics?category=ai&metric_id=AI-*&time_range=[timeRange]` (P8-D API nutzen)

**Integration:**
- Integration in `/admin/media/ai/dashboard/page.tsx` (KI-Kosten-Dashboard)

**Dark Mode:** ✅ Vollständig unterstützt

---

## ✅ ERFOLGSKRITERIEN

**E.1.4 ist produktionsreif, wenn:**
- ✅ Monitoring-Panel pro Bild funktioniert (Status, Kosten, Performance, Fehler-Logs)
- ✅ Audit-Logs-Viewer funktioniert (Logs anzeigen, Filter, Export)
- ✅ KI-Kosten-Dashboard funktioniert (Kosten-Übersicht, Trend-Chart, Limit-Warnung)
- ✅ Performance-Metriken-Charts funktionieren (Analyse-Zeit, Erfolgsrate, Fehlerrate, Zeitraum wählen)
- ✅ RBAC korrekt implementiert (`media.view`, `media.manage`)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, WarningBanner)
- ✅ Dark Mode vollständig unterstützt
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `E.1-HANDBOOK-FOR-BUILDER.md` E.1.4 – Vollständiger Implementierungsauftrag
- `E.1-OVERVIEW.md` – Gesamtübersicht
- `E.1-STATUS-ANALYSE.md` – Status-Analyse

**Bestehende Seiten:**
- `src/app/admin/media/page.tsx` (Medienliste)
- `src/app/admin/media/[id]/page.tsx` (Detailansicht)

**Bestehende APIs:**
- `GET /api/orchestrator/metrics/*` (P8-D Telemetrie APIs)
- `GET /api/audit-logs/*` (Audit-Logs APIs)

**Bestehende Komponenten:**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen
- `src/components/admin/monitoring/AICostStatus.tsx` (Pattern für KI-Kosten)

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von E.1.4 (Media-KI erweitern).**

**Reihenfolge:**
1. Monitoring-Panel pro Bild implementieren (`MediaAIMonitoringPanel.tsx`, Integration in `/admin/media/[id]/page.tsx`)
2. Audit-Logs-Viewer implementieren (`MediaAIAuditLogs.tsx`, Integration in `/admin/media/[id]/page.tsx`)
3. KI-Kosten-Dashboard implementieren (`MediaAICostDashboard.tsx`, neue Seite `/admin/media/ai/dashboard/page.tsx`)
4. Performance-Metriken-Charts implementieren (`MediaAIPerformanceCharts.tsx`, Integration in Dashboard)

**Nach Abschluss:**
- Agent A prüft E.1.4 (Enterprise++ Quality Assurance)
- Agent A aktualisiert Status und bereitet E.1.5 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, E.1.4 bereit für Implementierung*



