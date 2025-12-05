# P8-C-UI-SPEC

## UI-Spezifikation – Enterprise++ Standard

### Lopez IT Welt – Orchestrator Level 2 Phase P8-C

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige UI-Spezifikation** für das Alert & Incident-Handling-System (P8-C).

**Anforderungen:**
- **Design & Layout** nach Enterprise++ Standard
- **Komponenten** vollständig spezifiziert
- **Seiten** mit Layout-Diagrammen
- **Dark Mode** vollständig unterstützt
- **DSFA-Hinweise** integriert
- **Zero-Trust UI** (keine personenbezogenen Daten)
- **Fehleranzeigen, Warnbanner, Statusbadges**

---

## 2. Design-Standards

### **2.1 Framework & Technologie**

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Shadcn/ui (falls vorhanden)
- **Icons:** Lucide React
- **Charts:** Recharts (für Statistiken)

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

**Severity-Farben:**
- `info`: Blau
- `warning`: Gelb
- `critical`: Rot

**Typografie:**
- Font: System Font Stack
- Headings: Bold, größere Schriftgrößen
- Body: Regular, normale Schriftgröße

---

## 3. Komponenten

### **3.1 AlertList**

**Pfad:** `components/orchestrator/alerts/AlertList.tsx`

**Props:**
```typescript
interface AlertListProps {
  filters?: AlertFilters;
  onFilterChange?: (filters: AlertFilters) => void;
  onAlertClick?: (alertId: string) => void;
}
```

**Funktionen:**
- Alert-Liste anzeigen (Tabelle/Karten)
- Filter (Status, Severity, Kategorie)
- Suchfunktion
- Pagination
- Bulk-Aktionen (Acknowledge, Escalate)

**UI-Elemente:**
- Alert-Liste (Tabelle)
- Filter-Bar
- Suchfeld
- Severity-Badges
- Status-Badges
- Aktionen (Buttons)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.2 AlertDetail**

**Pfad:** `components/orchestrator/alerts/AlertDetail.tsx`

**Props:**
```typescript
interface AlertDetailProps {
  alertId: string;
  onAcknowledge?: () => void;
  onEscalate?: () => void;
  onClose?: () => void;
}
```

**Funktionen:**
- Alert-Detail anzeigen
- Acknowledge-Button
- Escalate-Button
- Close-Button
- Timeline anzeigen

**UI-Elemente:**
- Alert-Informationen (Card)
- Severity-Badge
- Status-Badge
- Payload (JSON-Viewer, ohne PD)
- Timeline
- Aktionen (Buttons)

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **3.3 IncidentTimeline**

**Pfad:** `components/orchestrator/incidents/IncidentTimeline.tsx`

**Props:**
```typescript
interface IncidentTimelineProps {
  incidentId: string;
}
```

**Funktionen:**
- Incident-Timeline anzeigen
- Events chronologisch sortiert
- Event-Details anzeigen
- Auto-Refresh (bei aktiven Incidents)

**UI-Elemente:**
- Timeline (vertikal)
- Event-Karten
- Zeitstempel
- Event-Typ-Badges
- Event-Details (Modal)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.4 SeverityBadge**

**Pfad:** `components/ui/SeverityBadge.tsx`

**Props:**
```typescript
interface SeverityBadgeProps {
  severity: 'info' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}
```

**Funktionen:**
- Severity-Badge anzeigen
- Farbcodierung (info=Blau, warning=Gelb, critical=Rot)
- Größen-Varianten

**UI-Elemente:**
- Badge (farbcodiert)
- Text (Severity-Name)
- Icon (optional)

**Dark Mode:** ✅ Vollständig unterstützt

---

### **3.5 EscalationDialog**

**Pfad:** `components/orchestrator/alerts/EscalationDialog.tsx`

**Props:**
```typescript
interface EscalationDialogProps {
  alertId: string;
  onEscalate?: (reason: string, severity: string) => void;
  onCancel?: () => void;
}
```

**Funktionen:**
- Eskalations-Dialog anzeigen
- Grund eingeben
- Severity wählen
- Bestätigung erforderlich

**UI-Elemente:**
- Dialog (Modal)
- Eingabefeld (Grund)
- Dropdown (Severity)
- Buttons (Eskalieren, Abbrechen)
- Warnung (bei Critical)

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk

---

## 4. Seiten

### **4.1 /admin/orchestrator/alerts**

**Pfad:** `src/app/admin/orchestrator/alerts/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Alerts                     │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Filter]  [Suche]  [Bulk-Aktionen]            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Alert-Liste                                    │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ ☑ Severity │ Status │ Kategorie │ Aktionen│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ ☑ 🔴 Critical │ Open │ Security │ ... │ │  │
│  │  │ ☑ 🟡 Warning │ Ack │ Compliance│ ... │ │  │
│  │  │ ☑ 🔵 Info │ Closed │ Performance│ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Statistiken                                    │  │
│  │  [Chart: Alerts pro Tag]                        │  │
│  │  [Chart: Alerts nach Kategorie]                 │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `AlertList`
- `SeverityBadge`
- `StatusBadge`
- Statistiken (Grafiken)

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk Alerts

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.2 /admin/orchestrator/alerts/[id]**

**Pfad:** `src/app/admin/orchestrator/alerts/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Alerts > [Alert-ID]                 │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Acknowledge] [Button: Escalate] [Button: Close]│
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Alert-Informationen                            │  │
│  │  Titel: Unberechtigter Zugriff erkannt          │  │
│  │  Severity: 🔴 Critical                          │  │
│  │  Status: ⏳ Open                                │  │
│  │  Kategorie: Security                            │  │
│  │  Triggered: 2025-11-28 10:00:00                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Beschreibung                                    │  │
│  │  Versuchter Zugriff auf Orchestrator-Ressource  │  │
│  │  ohne Berechtigung.                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Payload (ohne PD)                              │  │
│  │  {                                               │  │
│  │    "resource": "orchestrator.trigger",          │  │
│  │    "action": "create"                           │  │
│  │  }                                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Timeline                                        │  │
│  │  [Event 1] → [Event 2] → [Event 3]              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DSFA-Hinweise (bei High/Critical-Risk)         │  │
│  │  ⚠️ Dieser Alert erfordert P7-Approval          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `AlertDetail`
- `SeverityBadge`
- `StatusBadge`
- `JSONViewer` (ohne PD)
- Timeline
- DSFA-Hinweise

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.3 /admin/orchestrator/incidents**

**Pfad:** `src/app/admin/orchestrator/incidents/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Incidents                   │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Filter]  [Suche]  [Neuer Incident]            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Incident-Liste                                 │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Severity │ Status │ SLA │ Assignee │ Aktionen│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ 🔴 Critical │ Investigating │ 5/15 │ SO-123│ ...│ │  │
│  │  │ 🟡 Warning │ Open │ 10/60 │ SO-456│ ...│ │  │
│  │  │ 🔵 Info │ Resolved │ 30/240 │ SO-789│ ...│ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Statistiken                                    │  │
│  │  [Chart: Incidents pro Tag]                     │  │
│  │  [Chart: SLA-Überschreitungen]                  │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `IncidentList`
- `SeverityBadge`
- `StatusBadge`
- SLA-Anzeige
- Statistiken (Grafiken)

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk Incidents

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

### **4.4 /admin/orchestrator/incidents/[id]**

**Pfad:** `src/app/admin/orchestrator/incidents/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Incidents > [Incident-ID]            │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Resolve] [Button: Escalate] [Button: Close]     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Incident-Informationen                        │  │
│  │  Titel: Sicherheitsverletzung                  │  │
│  │  Severity: 🔴 Critical                         │  │
│  │  Status: ⏳ Investigating                       │  │
│  │  SLA: 5/15 Min (⏰ 10 Min verbleibend)         │  │
│  │  Escalation Level: 1                           │  │
│  │  Assignee: Security Officer 123               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Beschreibung                                    │  │
│  │  Mehrfache Versuche auf Orchestrator-Ressourcen  │  │
│  │  ohne Berechtigung.                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Zugehörige Alerts                               │  │
│  │  [Alert 1] [Alert 2] [Alert 3]                  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Timeline                                        │  │
│  │  [Event 1] → [Event 2] → [Event 3]              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Resolution (wenn resolved)                       │  │
│  │  Root Cause: Fehlerhafte RBAC-Konfiguration     │  │
│  │  Resolution: Konfiguration korrigiert            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DSFA-Hinweise (bei High/Critical-Risk)         │  │
│  │  ⚠️ Dieser Incident erfordert P7-Approval       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `IncidentDetail`
- `SeverityBadge`
- `StatusBadge`
- `IncidentTimeline`
- SLA-Anzeige
- Resolution-Formular
- DSFA-Hinweise

**Dark Mode:** ✅ Vollständig unterstützt

**DSFA-Hinweise:** ✅ Bei High/Critical-Risk

**Zero-Trust UI:** ✅ Keine personenbezogenen Daten

---

## 5. Anforderungen

### **5.1 Dark Mode**

**Vollständige Unterstützung:**
- Alle Komponenten unterstützen Dark Mode
- Farben angepasst (Light/Dark)
- Kontraste gewährleistet (WCAG 2.1 AA)

---

### **5.2 DSFA-Hinweise**

**Anzeige bei:**
- High/Critical-Risk Alerts
- High/Critical-Risk Incidents
- Eskalations-Dialog
- Resolution-Dialog

**Hinweis-Format:**
```
⚠️ Dieser Alert/Incident erfordert P7-Approval
```

---

### **5.3 Zero-Trust UI**

**Anforderungen:**
- Keine personenbezogenen Daten in Alerts/Incidents
- PD-Filter aktiviert
- Pseudonymisierung bei notwendigen Daten
- Warnung bei PD-Erkennung

---

### **5.4 Fehleranzeigen**

**Anzeige bei:**
- API-Fehlern
- Validierungsfehlern
- Netzwerkfehlern

**Format:**
```
❌ Fehler: [Fehlermeldung]
```

---

### **5.5 Warnbanner**

**Anzeige bei:**
- SLA-Überschreitungen
- Kritischen Alerts
- Eskalationen

**Format:**
```
⚠️ Warnung: [Warnmeldung]
```

---

### **5.6 Statusbadges**

**Badges für:**
- Alert-Status (open, acknowledged, escalated, closed, ignored)
- Incident-Status (open, investigating, resolved, closed)
- Severity (info, warning, critical)
- SLA-Status (ok, warning, breached)

**Farbcodierung:**
- `open`: Rot
- `acknowledged`: Gelb
- `escalated`: Orange
- `closed`: Grün
- `resolved`: Blau

---

## 6. Versionskontrolle

**Aktuelle Version:** v1.0 (28.11.2025)

**Änderungshistorie:**
- v1.0 (28.11.2025): Erste Version – UI-Spezifikation definiert

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-28*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*




