# P8-UI-COMPONENTS

## Orchestrator Level 2 Admin-UI – Komponenten-Spezifikation (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8-UI

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **UI-Komponenten** für Orchestrator Level 2 Admin-UI im Detail.

**Basis:**
- `P8-UI-OVERVIEW.md` – UI-Übersicht
- `P8-API-SPEC.md` – API-Spezifikationen
- Bestehende Admin-UI-Struktur

---

## 2. Komponenten-Übersicht

### **2.1 Automation-Komponenten**

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| **AutomationDashboard** | `components/orchestrator/automation/AutomationDashboard.tsx` | Haupt-Dashboard |
| **AutomationStatusCard** | `components/orchestrator/automation/AutomationStatusCard.tsx` | Status-Karte pro Use-Case |
| **AutomationStats** | `components/orchestrator/automation/AutomationStats.tsx` | Statistiken (Grafiken) |

---

### **2.2 Trigger-Komponenten**

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| **TriggerList** | `components/orchestrator/automation/triggers/TriggerList.tsx` | Trigger-Liste |
| **TriggerCard** | `components/orchestrator/automation/triggers/TriggerCard.tsx` | Trigger-Karte |
| **TriggerDetail** | `components/orchestrator/automation/triggers/TriggerDetail.tsx` | Trigger-Detail |
| **TriggerForm** | `components/orchestrator/automation/triggers/TriggerForm.tsx` | Trigger-Formular |
| **TriggerFilters** | `components/orchestrator/automation/triggers/TriggerFilters.tsx` | Filter-Komponente |
| **TriggerActions** | `components/orchestrator/automation/triggers/TriggerActions.tsx` | Aktionen (Buttons) |

---

### **2.3 Workflow-Komponenten**

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| **WorkflowList** | `components/orchestrator/automation/workflows/WorkflowList.tsx` | Workflow-Liste |
| **WorkflowCard** | `components/orchestrator/automation/workflows/WorkflowCard.tsx` | Workflow-Karte |
| **WorkflowDetail** | `components/orchestrator/automation/workflows/WorkflowDetail.tsx` | Workflow-Detail |
| **WorkflowForm** | `components/orchestrator/automation/workflows/WorkflowForm.tsx` | Workflow-Formular |
| **WorkflowStepEditor** | `components/orchestrator/automation/workflows/WorkflowStepEditor.tsx` | Schritt-Editor |
| **WorkflowExecution** | `components/orchestrator/automation/workflows/WorkflowExecution.tsx` | Execution-Ansicht |
| **WorkflowFilters** | `components/orchestrator/automation/workflows/WorkflowFilters.tsx` | Filter-Komponente |
| **WorkflowActions** | `components/orchestrator/automation/workflows/WorkflowActions.tsx` | Aktionen (Buttons) |

---

### **2.4 Status-Komponenten**

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| **StatusDashboard** | `components/orchestrator/status/StatusDashboard.tsx` | Gesamt-Status |
| **StatusCard** | `components/orchestrator/status/StatusCard.tsx` | Status-Karte |
| **QueueStatus** | `components/orchestrator/status/QueueStatus.tsx` | Queue-Status |
| **ApprovalStatus** | `components/orchestrator/status/ApprovalStatus.tsx` | Approval-Status |

---

### **2.5 Event-Komponenten**

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| **EventList** | `components/orchestrator/events/EventList.tsx` | Event-Liste |
| **EventCard** | `components/orchestrator/events/EventCard.tsx` | Event-Karte |
| **EventFilters** | `components/orchestrator/events/EventFilters.tsx` | Filter-Komponente |
| **EventDetail** | `components/orchestrator/events/EventDetail.tsx` | Event-Detail |

---

## 3. Detaillierte Komponenten-Spezifikationen

### **3.1 AutomationDashboard**

**Pfad:** `components/orchestrator/automation/AutomationDashboard.tsx`

**Props:**
```typescript
interface AutomationDashboardProps {
  // Keine Props (lädt Daten selbst)
}
```

**Funktionen:**
- Lädt Automation-Status pro Use-Case
- Lädt Automation-Statistiken
- Zeigt Status-Karten pro Use-Case
- Zeigt Statistiken (Grafiken)
- Zeigt letzte Trigger-Auslösungen
- Zeigt letzte Workflow-Ausführungen
- Zeigt Approval-Status-Übersicht

**API-Calls:**
- `GET /api/orchestrator/automation/status`
- `GET /api/orchestrator/automation/stats`
- `GET /api/orchestrator/triggers?limit=10`
- `GET /api/orchestrator/workflows?limit=10`

**UI-Elemente:**
- Status-Karten (pro Use-Case)
- Statistiken-Grafiken (Recharts)
- Letzte Trigger-Auslösungen (Tabelle)
- Letzte Workflow-Ausführungen (Tabelle)
- Approval-Status-Übersicht (Badges)

---

### **3.2 TriggerList**

**Pfad:** `components/orchestrator/automation/triggers/TriggerList.tsx`

**Props:**
```typescript
interface TriggerListProps {
  filters?: TriggerFilters;
  onFilterChange?: (filters: TriggerFilters) => void;
}
```

**Funktionen:**
- Lädt Trigger-Liste
- Filter (Typ, Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen (Aktivieren/Deaktivieren)
- Pagination

**API-Calls:**
- `GET /api/orchestrator/triggers?enabled={enabled}&type={type}&limit={limit}&offset={offset}`

**UI-Elemente:**
- Trigger-Liste (Tabelle/Karten)
- Filter-Bar
- Suchfeld
- Bulk-Aktionen (Checkboxen + Buttons)
- Pagination

---

### **3.3 TriggerDetail**

**Pfad:** `components/orchestrator/automation/triggers/TriggerDetail.tsx`

**Props:**
```typescript
interface TriggerDetailProps {
  triggerId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Funktionen:**
- Lädt Trigger-Detail
- Zeigt Trigger-Informationen
- Zeigt Bedingungen (JSON-Viewer)
- Zeigt Aktionen (JSON-Viewer)
- Zeigt Approval-Status
- Zeigt Event-Historie
- Aktionen (Bearbeiten, Löschen, Aktivieren/Deaktivieren, Manuell auslösen)

**API-Calls:**
- `GET /api/orchestrator/triggers/[id]`
- `GET /api/orchestrator/events?resource_type=trigger&resource_id=[id]`
- `POST /api/orchestrator/triggers/[id]/fire` (manuell auslösen)

**UI-Elemente:**
- Trigger-Informationen (Card)
- Bedingungen (JSON-Viewer)
- Aktionen (JSON-Viewer)
- Approval-Status (Badge)
- Event-Historie (Tabelle)
- Aktionen (Buttons)

---

### **3.4 TriggerForm**

**Pfad:** `components/orchestrator/automation/triggers/TriggerForm.tsx`

**Props:**
```typescript
interface TriggerFormProps {
  triggerId?: string; // Wenn vorhanden: Bearbeitung
  onSave?: (trigger: TriggerDefinition) => void;
  onCancel?: () => void;
}
```

**Funktionen:**
- Trigger erstellen/bearbeiten
- Validierung (Client + Server)
- Preview vor Speichern
- JSON-Editor für Bedingungen/Aktionen

**API-Calls:**
- `GET /api/orchestrator/triggers/[id]` (bei Bearbeitung)
- `POST /api/orchestrator/triggers` (erstellen)
- `PUT /api/orchestrator/triggers/[id]` (bearbeiten)

**UI-Elemente:**
- Formular-Felder (Name, Typ, Event-Typ)
- Bedingungen-Editor (JSON-Editor)
- Aktionen-Editor (JSON-Editor)
- Validierung (Fehlermeldungen)
- Preview (Modal)
- Buttons (Speichern, Abbrechen)

---

### **3.5 WorkflowList**

**Pfad:** `components/orchestrator/automation/workflows/WorkflowList.tsx`

**Props:**
```typescript
interface WorkflowListProps {
  filters?: WorkflowFilters;
  onFilterChange?: (filters: WorkflowFilters) => void;
}
```

**Funktionen:**
- Lädt Workflow-Liste
- Filter (Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen
- Pagination

**API-Calls:**
- `GET /api/orchestrator/workflows?status={status}&limit={limit}&offset={offset}`

**UI-Elemente:**
- Workflow-Liste (Tabelle/Karten)
- Filter-Bar
- Suchfeld
- Bulk-Aktionen (Checkboxen + Buttons)
- Pagination

---

### **3.6 WorkflowDetail**

**Pfad:** `components/orchestrator/automation/workflows/WorkflowDetail.tsx`

**Props:**
```typescript
interface WorkflowDetailProps {
  workflowId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Funktionen:**
- Lädt Workflow-Detail
- Zeigt Workflow-Informationen
- Zeigt Workflow-Schritte (Visualisierung)
- Zeigt Approval-Status
- Zeigt Execution-Historie
- Aktionen (Bearbeiten, Löschen, Starten, Pausieren, Fortsetzen)

**API-Calls:**
- `GET /api/orchestrator/workflows/[id]`
- `GET /api/orchestrator/workflows/[id]/executions`
- `POST /api/orchestrator/workflows/[id]/start`
- `POST /api/orchestrator/workflows/[id]/pause`
- `POST /api/orchestrator/workflows/[id]/resume`

**UI-Elemente:**
- Workflow-Informationen (Card)
- Workflow-Schritte (Visualisierung, Flowchart)
- Approval-Status (Badge)
- Execution-Historie (Tabelle)
- Aktionen (Buttons)

---

### **3.7 WorkflowForm**

**Pfad:** `components/orchestrator/automation/workflows/WorkflowForm.tsx`

**Props:**
```typescript
interface WorkflowFormProps {
  workflowId?: string; // Wenn vorhanden: Bearbeitung
  onSave?: (workflow: WorkflowDefinition) => void;
  onCancel?: () => void;
}
```

**Funktionen:**
- Workflow erstellen/bearbeiten
- Schritte hinzufügen/bearbeiten/löschen
- Validierung (Client + Server)
- Preview vor Speichern

**API-Calls:**
- `GET /api/orchestrator/workflows/[id]` (bei Bearbeitung)
- `POST /api/orchestrator/workflows` (erstellen)
- `PUT /api/orchestrator/workflows/[id]` (bearbeiten)

**UI-Elemente:**
- Formular-Felder (Name, Beschreibung)
- Schritt-Editor (Drag & Drop)
- Validierung (Fehlermeldungen)
- Preview (Modal)
- Buttons (Speichern, Abbrechen)

---

### **3.8 WorkflowExecution**

**Pfad:** `components/orchestrator/automation/workflows/WorkflowExecution.tsx`

**Props:**
```typescript
interface WorkflowExecutionProps {
  executionId: string;
}
```

**Funktionen:**
- Lädt Execution-Detail
- Zeigt Execution-Status
- Zeigt Schritt-Status (Visualisierung)
- Zeigt Execution-Ergebnis
- Auto-Refresh (bei aktiven Executions)

**API-Calls:**
- `GET /api/orchestrator/workflows/[id]/executions/[executionId]`

**UI-Elemente:**
- Execution-Informationen (Card)
- Schritt-Status (Visualisierung, Flowchart)
- Execution-Ergebnis (JSON-Viewer)
- Auto-Refresh (Toggle)

---

### **3.9 StatusDashboard**

**Pfad:** `components/orchestrator/status/StatusDashboard.tsx`

**Props:**
```typescript
interface StatusDashboardProps {
  // Keine Props (lädt Daten selbst)
}
```

**Funktionen:**
- Lädt Gesamt-Status
- Lädt Trigger-Status
- Lädt Workflow-Status
- Lädt Queue-Status
- Lädt Approval-Status
- Zeigt Statistiken (Grafiken)

**API-Calls:**
- `GET /api/orchestrator/status`
- `GET /api/orchestrator/status/triggers`
- `GET /api/orchestrator/status/workflows`
- `GET /api/orchestrator/status/queue`
- `GET /api/orchestrator/approvals/status`

**UI-Elemente:**
- Gesamt-Status-Karten
- Trigger-Status (Tabelle)
- Workflow-Status (Tabelle)
- Queue-Status (Tabelle)
- Approval-Status (Tabelle)
- Statistiken (Grafiken)

---

### **3.10 EventList**

**Pfad:** `components/orchestrator/events/EventList.tsx`

**Props:**
```typescript
interface EventListProps {
  filters?: EventFilters;
  onFilterChange?: (filters: EventFilters) => void;
}
```

**Funktionen:**
- Lädt Event-Liste
- Filter (Event-Typ, Resource-Typ, Zeitraum)
- Suchfunktion
- Pagination
- Event-Detail (Modal)

**API-Calls:**
- `GET /api/orchestrator/events?event_type={type}&resource_type={type}&start_date={date}&end_date={date}&limit={limit}&offset={offset}`

**UI-Elemente:**
- Event-Liste (Tabelle)
- Filter-Bar
- Suchfeld
- Pagination
- Event-Detail (Modal)

---

## 4. Gemeinsame Komponenten

### **4.1 JSON-Viewer**

**Pfad:** `components/ui/JSONViewer.tsx`

**Beschreibung:** Zeigt JSON-Daten formatiert an

**Props:**
```typescript
interface JSONViewerProps {
  data: Record<string, unknown> | unknown[];
  collapsed?: boolean;
}
```

---

### **4.2 JSON-Editor**

**Pfad:** `components/ui/JSONEditor.tsx`

**Beschreibung:** Editor für JSON-Daten

**Props:**
```typescript
interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

---

### **4.3 Status-Badge**

**Pfad:** `components/ui/StatusBadge.tsx`

**Beschreibung:** Badge für Status-Anzeige

**Props:**
```typescript
interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info";
}
```

---

### **4.4 Filter-Bar**

**Pfad:** `components/ui/FilterBar.tsx`

**Beschreibung:** Filter-Bar für Listen

**Props:**
```typescript
interface FilterBarProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
  filterOptions: FilterOption[];
}
```

---

## 5. Design-Standards

### **5.1 Styling**

- **Framework:** Tailwind CSS
- **Dark Mode:** Vollständig unterstützt
- **Responsive:** Mobile-first

---

### **5.2 Icons**

- **Library:** Lucide React
- **Größe:** 16px (Standard), 20px (Buttons), 24px (Headings)

---

### **5.3 Farben**

| Status | Farbe (Light) | Farbe (Dark) |
|--------|---------------|--------------|
| **Success** | Green-500 | Green-400 |
| **Warning** | Yellow-500 | Yellow-400 |
| **Error** | Red-500 | Red-400 |
| **Info** | Blue-500 | Blue-400 |

---

## 6. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige Komponenten-Spezifikation

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





