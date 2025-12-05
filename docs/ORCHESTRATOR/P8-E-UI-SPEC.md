# P8-E-UI-SPEC

## UI-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-E

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige UI-Spezifikation** für das Log Processing & Analytics-System (P8-E).

**Anforderungen:**
- **Design & Layout** nach Enterprise++ Standard
- **Komponenten** vollständig spezifiziert
- **Seiten** mit Layout-Diagrammen
- **Volltext-Suche** & erweiterte Filter
- **Dark Mode** vollständig unterstützt
- **Zero-Trust UI** (keine personenbezogenen Daten)

---

## 2. Design-Standards

### **2.1 Framework & Technologie**

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Shadcn/ui (falls vorhanden)
- **Icons:** Lucide React
- **Charts:** Recharts (für Analytics-Grafiken)
- **Search:** Volltext-Suche mit Highlighting

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

**Log-Level-Farben:**
- `TRACE`: Grau
- `DEBUG`: Blau
- `INFO`: Grün
- `WARN`: Gelb
- `ERROR`: Orange
- `FATAL`: Rot

**Typografie:**
- Font: System Font Stack
- Headings: Bold, größere Schriftgrößen
- Body: Regular, normale Schriftgröße
- Monospace: Für Log-Messages

---

## 3. Komponenten

### **3.1 LogList**

**Pfad:** `components/orchestrator/logs/LogList.tsx`

**Props:**
```typescript
interface LogListProps {
  logs: Log[];
  filters?: LogFilters;
  onFilterChange?: (filters: LogFilters) => void;
  onLogClick?: (logId: string) => void;
  searchQuery?: string;
}
```

**Funktionen:**
- Log-Liste anzeigen (Tabelle/Karten)
- Filter (Kategorie, Log-Level, Severity, Zeitraum)
- Volltext-Suche
- Pagination
- Highlighting (bei Suche)

**UI-Elemente:**
- Log-Liste (Tabelle)
- Filter-Bar
- Suchfeld
- Log-Level-Badges
- Severity-Badges
- Kategorie-Badges
- Aktionen (Buttons)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.2 LogDetail**

**Pfad:** `components/orchestrator/logs/LogDetail.tsx`

**Props:**
```typescript
interface LogDetailProps {
  logId: string;
  onClose?: () => void;
}
```

**Funktionen:**
- Log-Detail anzeigen
- Context anzeigen
- Metadata anzeigen
- Correlation-IDs anzeigen
- Related-Logs anzeigen

**UI-Elemente:**
- Log-Informationen (Card)
- Log-Level-Badge
- Severity-Badge
- Kategorie-Badge
- Message (formatiert)
- Context (JSON-Viewer)
- Metadata (JSON-Viewer)
- Related-Logs (Liste)

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk-Logs

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **3.3 LogSearch**

**Pfad:** `components/orchestrator/logs/LogSearch.tsx`

**Props:**
```typescript
interface LogSearchProps {
  onSearch?: (query: SearchQuery) => void;
  initialQuery?: SearchQuery;
}
```

**Funktionen:**
- Volltext-Suche
- Erweiterte Filter
- Zeitraum-Auswahl
- Kategorie-Filter
- Log-Level-Filter
- Severity-Filter

**UI-Elemente:**
- Suchfeld (Volltext)
- Filter-Panel
- Zeitraum-Picker
- Dropdowns (Kategorie, Log-Level, Severity)
- Buttons (Suchen, Zurücksetzen)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.4 LogTrendChart**

**Pfad:** `components/orchestrator/logs/LogTrendChart.tsx`

**Props:**
```typescript
interface LogTrendChartProps {
  data: TrendData[];
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  category?: string;
}
```

**Funktionen:**
- Log-Trend-Grafik anzeigen
- Zeitbereich wählen
- Kategorie-Filter
- Zoom-Funktion

**UI-Elemente:**
- Line-Chart (Recharts)
- Zeitachse
- Log-Count-Werte
- Error-Count-Werte
- Warning-Count-Werte

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.5 LogPatternList**

**Pfad:** `components/orchestrator/logs/LogPatternList.tsx`

**Props:**
```typescript
interface LogPatternListProps {
  patterns: Pattern[];
  onPatternClick?: (pattern: Pattern) => void;
}
```

**Funktionen:**
- Pattern-Liste anzeigen
- Pattern-Details anzeigen
- Pattern-Frequenz anzeigen

**UI-Elemente:**
- Pattern-Liste (Tabelle/Karten)
- Pattern-Text
- Frequenz-Anzeige
- Zeitraum-Anzeige
- Kategorie-Badge

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.6 LogAnomalyList**

**Pfad:** `components/orchestrator/logs/LogAnomalyList.tsx`

**Props:**
```typescript
interface LogAnomalyListProps {
  anomalies: Anomaly[];
  onAnomalyClick?: (anomaly: Anomaly) => void;
}
```

**Funktionen:**
- Anomalie-Liste anzeigen
- Anomalie-Details anzeigen
- Anomalie-Severity anzeigen

**UI-Elemente:**
- Anomalie-Liste (Tabelle/Karten)
- Anomalie-Typ
- Severity-Badge
- Z-Score-Anzeige
- Zeitstempel

**Dark Mode:** ✅ Vollständig unterstützt

---

## 4. Seiten

### **4.1 /admin/logs**

**Pfad:** `src/app/admin/logs/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Logs                              │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Suche]  [Filter]  [Zeitraum]  [Export]                │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Log-Liste                                     │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Zeit │ Level │ Kategorie │ Severity │ Message│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 10:00│ ERROR │ Security │ Critical │ ... │ │  │
│  │  │ 10:05│ WARN  │ API      │ Warning  │ ... │ │  │
│  │  │ 10:10│ INFO  │ System   │ Info     │ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Statistiken                                    │  │
│  │  [Chart: Logs pro Tag]                          │  │
│  │  [Chart: Logs nach Kategorie]                    │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `LogList`
- `LogSearch`
- `LogTrendChart`
- Statistiken (Grafiken)

**API-Calls:**
- `GET /api/orchestrator/logs?q={query}&category={category}&log_level={level}`

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk-Logs

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.2 /admin/logs/search**

**Pfad:** `src/app/admin/logs/search/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Logs > Search                    │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Erweiterte Suche                               │  │
│  │  [Volltext-Suche]                               │  │
│  │  [Kategorie] [Log-Level] [Severity]            │  │
│  │  [Zeitraum: Von ... bis ...]                   │  │
│  │  [User-ID] [Correlation-ID] [Request-ID]       │  │
│  │  [Button: Suchen] [Button: Zurücksetzen]       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Suchergebnisse                                 │  │
│  │  [Log-Liste mit Highlighting]                  │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `LogSearch`
- `LogList` (mit Highlighting)

**API-Calls:**
- `POST /api/orchestrator/logs/search`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.3 /admin/logs/[id]**

**Pfad:** `src/app/admin/logs/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Logs > [Log-ID]                  │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Zurück] [Button: Export] [Button: Alert]      │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Log-Informationen                            │  │
│  │  Log-ID: log-123                               │  │
│  │  Log-Regel: SEC-LOG-001                        │  │
│  │  Log-Level: 🔴 ERROR                          │  │
│  │  Kategorie: Security                           │  │
│  │  Severity: 🔴 Critical                        │  │
│  │  Zeitstempel: 2025-11-28 10:00:00             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Message                                        │  │
│  │  Unauthorized access attempt detected          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Context                                        │  │
│  │  {                                              │  │
│  │    "user_id": "user-123",                      │  │
│  │    "ip_address": "192.168.1.100",              │  │
│  │    "resource": "orchestrator.trigger"           │  │
│  │  }                                              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Metadata                                        │  │
│  │  {                                              │  │
│  │    "correlation_id": "corr-123",                │  │
│  │    "request_id": "req-456"                     │  │
│  │  }                                              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Related Logs                                   │  │
│  │  [Log 1] [Log 2] [Log 3]                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DSFA-Hinweise (bei High/Critical-Risk)        │  │
│  │  ⚠️ Dieser Log erfordert P7-Approval          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `LogDetail`
- `LogLevelBadge`
- `SeverityBadge`
- `CategoryBadge`
- `JSONViewer` (ohne PD)
- Related-Logs-Liste
- DSFA-Hinweise

**API-Calls:**
- `GET /api/orchestrator/logs/[id]`

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.4 /admin/logs/analytics**

**Pfad:** `src/app/admin/logs/analytics/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Admin > Logs > Analytics                  │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Zeitbereich: 1h | 6h | 24h | 7d | 30d]                │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trends                                         │  │
│  │  [Line-Chart: Log-Trends über Zeit]            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Patterns                                       │  │
│  │  [Pattern-Liste]                                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Anomalien                                      │  │
│  │  [Anomalie-Liste]                               │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `LogTrendChart`
- `LogPatternList`
- `LogAnomalyList`

**API-Calls:**
- `GET /api/orchestrator/logs/analytics/trends`
- `GET /api/orchestrator/logs/analytics/patterns`
- `GET /api/orchestrator/logs/analytics/anomalies`

**Dark Mode:** ✅ Vollständig unterstützt

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

## 5. Anforderungen

### **5.1 Dark Mode**

**Vollständige Unterstützung:**
- Alle Komponenten unterstützen Dark Mode
- Farben angepasst (Light/Dark)
- Kontraste gewährleistet (WCAG 2.1 AA)

---

### **5.2 Zero-Trust UI**

**Anforderungen:**
- Keine personenbezogenen Daten in Logs
- PD-Filter aktiviert
- Pseudonymisierung bei notwendigen Daten
- Warnung bei PD-Erkennung

---

### **5.3 Volltext-Suche**

**Anforderungen:**
- Highlighting von Suchergebnissen
- Fuzzy-Search (Tippfehler-tolerante Suche)
- Faceted-Search (Filterung nach Facetten)
- Auto-Complete (Vorschläge während der Eingabe)

---

### **5.4 Fehleranzeigen**

**Anzeige bei:**
- API-Fehlern
- Suchfehlern
- Netzwerkfehlern

**Format:**
```
❌ Fehler: [Fehlermeldung]
```

---

### **5.5 Warnbanner**

**Anzeige bei:**
- High/Critical-Risk-Logs
- Anomalien
- Pattern-Detection

**Format:**
```
⚠️ Warnung: [Warnmeldung]
```

---

### **5.6 Statusbadges**

**Badges für:**
- Log-Level (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
- Severity (info, warning, critical)
- Kategorie (Security, API, Queue, Workflow, System, DSGVO)

**Farbcodierung:**
- `TRACE` / `DEBUG`: Grau
- `INFO`: Grün
- `WARN`: Gelb
- `ERROR`: Orange
- `FATAL`: Rot

---

## 6. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – UI-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




