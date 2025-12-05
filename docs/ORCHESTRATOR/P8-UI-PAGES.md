# P8-UI-PAGES

## Orchestrator Level 2 Admin-UI – Seiten-Spezifikation (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8-UI

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert alle **Admin-UI-Seiten** für Orchestrator Level 2 im Detail.

**Basis:**
- `P8-UI-OVERVIEW.md` – UI-Übersicht
- `P8-UI-COMPONENTS.md` – Komponenten-Spezifikationen
- `P8-API-SPEC.md` – API-Spezifikationen

---

## 2. Seiten-Übersicht

### **2.1 Bestehende Seiten (erweitern)**

| Seite | Pfad | Status | Aktion |
|-------|------|--------|--------|
| **Orchestrator Overview** | `/admin/orchestrator` | ✅ Bestehend | Erweitern |
| **Agents** | `/admin/orchestrator/agents` | ✅ Bestehend | Unverändert |
| **Events** | `/admin/orchestrator/events` | ✅ Bestehend | Erweitern |

---

### **2.2 Neue Seiten**

| Seite | Pfad | Status | Beschreibung |
|-------|------|--------|--------------|
| **Automation Dashboard** | `/admin/orchestrator/automation` | ⏳ Neu | Haupt-Dashboard |
| **Trigger-Liste** | `/admin/orchestrator/automation/triggers` | ⏳ Neu | Trigger-Liste |
| **Trigger-Detail** | `/admin/orchestrator/automation/triggers/[id]` | ⏳ Neu | Trigger-Detail |
| **Trigger erstellen** | `/admin/orchestrator/automation/triggers/new` | ⏳ Neu | Trigger-Formular |
| **Workflow-Liste** | `/admin/orchestrator/automation/workflows` | ⏳ Neu | Workflow-Liste |
| **Workflow-Detail** | `/admin/orchestrator/automation/workflows/[id]` | ⏳ Neu | Workflow-Detail |
| **Workflow-Executions** | `/admin/orchestrator/automation/workflows/[id]/executions` | ⏳ Neu | Execution-Liste |
| **Workflow erstellen** | `/admin/orchestrator/automation/workflows/new` | ⏳ Neu | Workflow-Formular |
| **Status Dashboard** | `/admin/orchestrator/status` | ⏳ Neu | Gesamt-Status |

---

## 3. Detaillierte Seiten-Spezifikationen

### **3.1 Automation Dashboard**

**Pfad:** `/admin/orchestrator/automation`  
**Datei:** `src/app/admin/orchestrator/automation/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Automation                  │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Automation-Status (pro Use-Case)                │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │  │
│  │  │Media │ │Content│ │Comply│ │...  │            │  │
│  │  │ ✅   │ │ ✅    │ │ ✅   │ │      │            │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Automation-Statistiken (Grafiken)              │  │
│  │  [Chart: Trigger-Firings pro Tag]                │  │
│  │  [Chart: Workflow-Ausführungen pro Tag]         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Letzte Trigger-Auslösungen                     │  │
│  │  [Tabelle: Trigger, Zeit, Status]                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Letzte Workflow-Ausführungen                    │  │
│  │  [Tabelle: Workflow, Zeit, Status]               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Approval-Status-Übersicht                       │  │
│  │  [Badges: Approved, Pending, Expired]           │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `AutomationDashboard`
- `AutomationStatusCard` (pro Use-Case)
- `AutomationStats` (Grafiken)

**API-Calls:**
- `GET /api/orchestrator/automation/status`
- `GET /api/orchestrator/automation/stats`
- `GET /api/orchestrator/triggers?limit=10`
- `GET /api/orchestrator/workflows?limit=10`

**Funktionen:**
- Automation-Status anzeigen (pro Use-Case)
- Automation aktivieren/deaktivieren (Toggle pro Use-Case)
- Statistiken anzeigen (Grafiken)
- Letzte Trigger-Auslösungen anzeigen
- Letzte Workflow-Ausführungen anzeigen
- Approval-Status-Übersicht anzeigen

---

### **3.2 Trigger-Liste**

**Pfad:** `/admin/orchestrator/automation/triggers`  
**Datei:** `src/app/admin/orchestrator/automation/triggers/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Automation > Triggers      │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Neuer Trigger]  [Filter]  [Suche]            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trigger-Liste                                  │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ ☑ Name │ Typ │ Status │ Use-Case │ Aktionen│ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ ☑ Media-Upload │ Event │ ✅ │ media-ki │ ...│ │  │
│  │  │ ☑ Content-Req │ Event │ ✅ │ content │ ...│ │  │
│  │  │ ☑ ... │ ... │ ... │ ... │ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Bulk-Aktionen: Aktivieren, Deaktivieren]     │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `TriggerList`
- `TriggerCard` (oder Tabelle)
- `TriggerFilters`
- `TriggerActions`

**API-Calls:**
- `GET /api/orchestrator/triggers?enabled={enabled}&type={type}&limit={limit}&offset={offset}`

**Funktionen:**
- Trigger-Liste anzeigen
- Filter (Typ, Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen (Aktivieren/Deaktivieren)
- Pagination
- Zu Trigger-Detail navigieren
- Neuen Trigger erstellen

---

### **3.3 Trigger-Detail**

**Pfad:** `/admin/orchestrator/automation/triggers/[id]`  
**Datei:** `src/app/admin/orchestrator/automation/triggers/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Triggers > [Trigger-Name]            │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Bearbeiten] [Button: Löschen] [Button: Fire]   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trigger-Informationen                         │  │
│  │  Name: Media-Upload-Automation                  │  │
│  │  Typ: event-based                               │  │
│  │  Status: ✅ Aktiv                               │  │
│  │  Approval: ✅ Approved                         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Bedingungen (JSON)                             │  │
│  │  {                                               │  │
│  │    "agent": "media-ai-agent",                    │  │
│  │    "status": "completed"                        │  │
│  │  }                                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Aktionen (JSON)                                │  │
│  │  [                                               │  │
│  │    {                                             │  │
│  │      "type": "create_task",                      │  │
│  │      "agent": "compliance-agent"                 │  │
│  │    }                                             │  │
│  │  ]                                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Event-Historie                                 │  │
│  │  [Tabelle: Event, Zeit, Details]                │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `TriggerDetail`
- `JSONViewer` (für Bedingungen/Aktionen)
- `EventList` (für Event-Historie)

**API-Calls:**
- `GET /api/orchestrator/triggers/[id]`
- `GET /api/orchestrator/events?resource_type=trigger&resource_id=[id]`
- `POST /api/orchestrator/triggers/[id]/fire` (manuell auslösen)

**Funktionen:**
- Trigger-Detail anzeigen
- Trigger bearbeiten
- Trigger löschen
- Trigger aktivieren/deaktivieren
- Trigger manuell auslösen (Testing)
- Event-Historie anzeigen

---

### **3.4 Trigger erstellen**

**Pfad:** `/admin/orchestrator/automation/triggers/new`  
**Datei:** `src/app/admin/orchestrator/automation/triggers/new/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Triggers > Neu                      │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trigger-Formular                                │  │
│  │  Name: [________________]                        │  │
│  │  Typ: [Dropdown: event-based, time-based, ...]  │  │
│  │  Event-Typ: [Dropdown: TASK_COMPLETED, ...]     │  │
│  │                                                 │  │
│  │  Bedingungen (JSON):                            │  │
│  │  [JSON-Editor]                                  │  │
│  │                                                 │  │
│  │  Aktionen (JSON):                               │  │
│  │  [JSON-Editor]                                  │  │
│  │                                                 │  │
│  │  ☑ Approval erforderlich                        │  │
│  │                                                 │  │
│  │  [Button: Speichern] [Button: Abbrechen]        │  │
│  │  [Button: Preview]                              │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `TriggerForm`
- `JSONEditor` (für Bedingungen/Aktionen)

**API-Calls:**
- `POST /api/orchestrator/triggers`

**Funktionen:**
- Trigger erstellen
- Validierung (Client + Server)
- Preview vor Speichern
- JSON-Editor für Bedingungen/Aktionen

---

### **3.5 Workflow-Liste**

**Pfad:** `/admin/orchestrator/automation/workflows`  
**Datei:** `src/app/admin/orchestrator/automation/workflows/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Automation > Workflows     │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Neuer Workflow]  [Filter]  [Suche]            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workflow-Liste                                  │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ ☑ Name │ Status │ Schritte │ Aktionen    │ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ ☑ Media-KI │ ✅ Active │ 4 │ Start/Pause│ │  │
│  │  │ ☑ Content │ ✅ Active │ 3 │ Start/Pause│ │  │
│  │  │ ☑ ... │ ... │ ... │ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Bulk-Aktionen]                                │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `WorkflowList`
- `WorkflowCard` (oder Tabelle)
- `WorkflowFilters`
- `WorkflowActions`

**API-Calls:**
- `GET /api/orchestrator/workflows?status={status}&limit={limit}&offset={offset}`

**Funktionen:**
- Workflow-Liste anzeigen
- Filter (Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen
- Pagination
- Zu Workflow-Detail navigieren
- Neuen Workflow erstellen

---

### **3.6 Workflow-Detail**

**Pfad:** `/admin/orchestrator/automation/workflows/[id]`  
**Datei:** `src/app/admin/orchestrator/automation/workflows/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Workflows > [Workflow-Name]         │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Button: Bearbeiten] [Button: Löschen] [Button: Start] │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workflow-Informationen                         │  │
│  │  Name: Media-KI-Automation-Workflow             │  │
│  │  Status: ✅ Active                               │  │
│  │  Approval: ✅ Approved                          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workflow-Schritte (Visualisierung)             │  │
│  │  [Step 1] → [Step 2] → [Step 3] → [Step 4]     │  │
│  │    ✅         ✅         ⏳         ⏸️          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Execution-Historie                              │  │
│  │  [Tabelle: Execution, Zeit, Status]             │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `WorkflowDetail`
- `WorkflowStepVisualization` (Flowchart)
- `WorkflowExecutionList` (für Execution-Historie)

**API-Calls:**
- `GET /api/orchestrator/workflows/[id]`
- `GET /api/orchestrator/workflows/[id]/executions`
- `POST /api/orchestrator/workflows/[id]/start`
- `POST /api/orchestrator/workflows/[id]/pause`
- `POST /api/orchestrator/workflows/[id]/resume`

**Funktionen:**
- Workflow-Detail anzeigen
- Workflow bearbeiten
- Workflow löschen
- Workflow starten/pausieren/fortsetzen
- Execution-Historie anzeigen

---

### **3.7 Workflow-Executions**

**Pfad:** `/admin/orchestrator/automation/workflows/[id]/executions`  
**Datei:** `src/app/admin/orchestrator/automation/workflows/[id]/executions/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Workflows > [Name] > Executions    │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  [Filter: Status, Zeitraum]  [Suche]                     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Execution-Liste                                 │  │
│  │  ┌───────────────────────────────────────────┐ │  │
│  │  │ Execution-ID │ Zeit │ Status │ Details   │ │  │
│  │  ├───────────────────────────────────────────┤ │  │
│  │  │ exec-001 │ 10:00 │ ✅ Completed │ ... │ │  │
│  │  │ exec-002 │ 11:00 │ ⏳ Active │ ... │ │  │
│  │  │ exec-003 │ 12:00 │ ❌ Failed │ ... │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  │                                                 │  │
│  │  [Pagination]                                   │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `WorkflowExecutionList`
- `WorkflowExecutionDetail` (Modal)

**API-Calls:**
- `GET /api/orchestrator/workflows/[id]/executions?status={status}&limit={limit}&offset={offset}`

**Funktionen:**
- Execution-Liste anzeigen
- Filter (Status, Zeitraum)
- Execution-Detail anzeigen (Modal)
- Execution-Status verfolgen

---

### **3.8 Workflow erstellen**

**Pfad:** `/admin/orchestrator/automation/workflows/new`  
**Datei:** `src/app/admin/orchestrator/automation/workflows/new/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: ... > Workflows > Neu                     │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workflow-Formular                               │  │
│  │  Name: [________________]                       │  │
│  │  Beschreibung: [________________]               │  │
│  │                                                 │  │
│  │  Schritte (Drag & Drop):                        │  │
│  │  [Step 1] [Step 2] [Step 3]                     │  │
│  │  [+ Schritt hinzufügen]                         │  │
│  │                                                 │  │
│  │  Schritt-Editor:                                │  │
│  │  Name: [________________]                       │  │
│  │  Agent: [Dropdown]                             │  │
│  │  Purpose: [________________]                   │  │
│  │  On Success: [Dropdown]                         │  │
│  │  On Failure: [Dropdown]                         │  │
│  │                                                 │  │
│  │  ☑ Approval erforderlich                        │  │
│  │                                                 │  │
│  │  [Button: Speichern] [Button: Abbrechen]        │  │
│  │  [Button: Preview]                              │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `WorkflowForm`
- `WorkflowStepEditor`
- `WorkflowStepVisualization` (Drag & Drop)

**API-Calls:**
- `POST /api/orchestrator/workflows`

**Funktionen:**
- Workflow erstellen
- Schritte hinzufügen/bearbeiten/löschen
- Drag & Drop für Schritt-Reihenfolge
- Validierung (Client + Server)
- Preview vor Speichern

---

### **3.9 Status Dashboard**

**Pfad:** `/admin/orchestrator/status`  
**Datei:** `src/app/admin/orchestrator/status/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs: Orchestrator > Status                     │
│  ─────────────────────────────────────────────────────  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Gesamt-Status                                  │  │
│  │  Orchestrator Level: 2                          │  │
│  │  Automation: ✅ Aktiv                           │  │
│  │  Trigger: 10 aktiv                              │  │
│  │  Workflows: 5 aktiv                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Trigger-Status                                 │  │
│  │  [Tabelle: Trigger, Status, Letzte Auslösung] │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workflow-Status                                │  │
│  │  [Tabelle: Workflow, Status, Letzte Ausführung]│  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Queue-Status                                   │  │
│  │  [Tabelle: Queue, Waiting, Active, Completed]  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Approval-Status                                │  │
│  │  [Tabelle: Use-Case, Status, Ablaufdatum]      │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponenten:**
- `StatusDashboard`
- `StatusCard`
- `QueueStatus`
- `ApprovalStatus`

**API-Calls:**
- `GET /api/orchestrator/status`
- `GET /api/orchestrator/status/triggers`
- `GET /api/orchestrator/status/workflows`
- `GET /api/orchestrator/status/queue`
- `GET /api/orchestrator/approvals/status`

**Funktionen:**
- Gesamt-Status anzeigen
- Trigger-Status anzeigen
- Workflow-Status anzeigen
- Queue-Status anzeigen
- Approval-Status anzeigen

---

## 4. Navigation

### **4.1 Admin-Menü erweitern**

**Pfad:** `src/components/admin/AdminNavigation.tsx` (oder ähnlich)

**Neue Menüpunkte:**
```
Orchestrator
  ├── Übersicht
  ├── Agents
  ├── Automation
  │   ├── Dashboard
  │   ├── Triggers
  │   └── Workflows
  ├── Status
  └── Events
```

---

### **4.2 Breadcrumbs**

**Komponente:** `components/ui/Breadcrumbs.tsx`

**Beispiele:**
- `Orchestrator > Automation`
- `Orchestrator > Automation > Triggers`
- `Orchestrator > Automation > Triggers > [Trigger-Name]`

---

## 5. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige Seiten-Spezifikation

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





