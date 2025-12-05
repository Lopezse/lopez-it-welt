# P8-UI-OVERVIEW

## Orchestrator Level 2 Admin-UI – Übersicht (Enterprise++)

### Lopez IT Welt – KI-Orchestrierung Phase P8-UI

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG**  
**Freigabe:** ⏳ **AUSSTEHEND** (Manual Approval erforderlich)

---

## 1. Einleitung

Dieses Dokument definiert die **vollständige Admin-UI für Orchestrator Level 2 & Automation (Phase P8-UI)**.

**Basis:**
- **Backend/API:** ✅ Vollständig implementiert (P8 Backend)
- **P7-Approval:** ✅ Aktiv in allen Ausführungspfaden
- **Auto-Trigger:** ✅ An P7 gebunden
- **DSGVO/DSFA:** ✅ Konformität bestätigt
- **Produktionsreife:** ✅ Durch Agent C bestätigt

**Ziel:**
Vollständige, benutzerfreundliche Admin-UI für die Verwaltung von Triggern, Workflows, Automation und Events – Enterprise++ Standard, Zero-CMD, vollständig UI-basiert.

---

## 2. UI-Architektur

### **2.1 Struktur-Übersicht**

```
/admin/orchestrator/
  ├── page.tsx                      ✅ BESTEHEND (erweitern)
  ├── agents/
  │   └── page.tsx                  ✅ BESTEHEND
  ├── events/
  │   └── page.tsx                  ✅ BESTEHEND (erweitern)
  │
  ├── automation/                    ⏳ NEU
  │   ├── page.tsx                  ⏳ Automation-Übersicht
  │   ├── triggers/
  │   │   ├── page.tsx              ⏳ Trigger-Liste
  │   │   ├── [id]/
  │   │   │   └── page.tsx          ⏳ Trigger-Detail
  │   │   └── new/
  │   │       └── page.tsx           ⏳ Trigger erstellen
  │   └── workflows/
  │       ├── page.tsx              ⏳ Workflow-Liste
  │       ├── [id]/
  │       │   ├── page.tsx           ⏳ Workflow-Detail
  │       │   └── executions/
  │       │       └── page.tsx      ⏳ Execution-Liste
  │       └── new/
  │           └── page.tsx           ⏳ Workflow erstellen
  │
  └── status/                        ⏳ NEU
      ├── page.tsx                  ⏳ Gesamt-Status
      ├── triggers/
      │   └── page.tsx              ⏳ Trigger-Status
      └── workflows/
          └── page.tsx              ⏳ Workflow-Status
```

---

## 3. UI-Komponenten

### **3.1 Hauptkomponenten**

| Komponente | Beschreibung | Pfad |
|------------|-------------|------|
| **AutomationDashboard** | Haupt-Dashboard für Automation | `/admin/orchestrator/automation` |
| **TriggerList** | Liste aller Trigger | `/admin/orchestrator/automation/triggers` |
| **TriggerDetail** | Trigger-Detail-Ansicht | `/admin/orchestrator/automation/triggers/[id]` |
| **TriggerForm** | Trigger erstellen/bearbeiten | `/admin/orchestrator/automation/triggers/new` |
| **WorkflowList** | Liste aller Workflows | `/admin/orchestrator/automation/workflows` |
| **WorkflowDetail** | Workflow-Detail-Ansicht | `/admin/orchestrator/automation/workflows/[id]` |
| **WorkflowForm** | Workflow erstellen/bearbeiten | `/admin/orchestrator/automation/workflows/new` |
| **WorkflowExecution** | Workflow-Execution-Ansicht | `/admin/orchestrator/automation/workflows/[id]/executions` |
| **StatusDashboard** | Gesamt-Status-Dashboard | `/admin/orchestrator/status` |
| **EventList** | Event-Liste (erweitert) | `/admin/orchestrator/events` |

---

### **3.2 UI-Komponenten-Struktur**

```
src/components/orchestrator/
  ├── automation/
  │   ├── AutomationDashboard.tsx   ⏳ NEU
  │   ├── AutomationStatusCard.tsx  ⏳ NEU
  │   ├── AutomationStats.tsx       ⏳ NEU
  │   │
  │   ├── triggers/
  │   │   ├── TriggerList.tsx      ⏳ NEU
  │   │   ├── TriggerCard.tsx      ⏳ NEU
  │   │   ├── TriggerDetail.tsx    ⏳ NEU
  │   │   ├── TriggerForm.tsx      ⏳ NEU
  │   │   ├── TriggerFilters.tsx    ⏳ NEU
  │   │   └── TriggerActions.tsx   ⏳ NEU
  │   │
  │   └── workflows/
  │       ├── WorkflowList.tsx      ⏳ NEU
  │       ├── WorkflowCard.tsx      ⏳ NEU
  │       ├── WorkflowDetail.tsx   ⏳ NEU
  │       ├── WorkflowForm.tsx     ⏳ NEU
  │       ├── WorkflowStepEditor.tsx ⏳ NEU
  │       ├── WorkflowExecution.tsx ⏳ NEU
  │       ├── WorkflowFilters.tsx  ⏳ NEU
  │       └── WorkflowActions.tsx  ⏳ NEU
  │
  ├── status/
  │   ├── StatusDashboard.tsx       ⏳ NEU
  │   ├── StatusCard.tsx            ⏳ NEU
  │   ├── QueueStatus.tsx           ⏳ NEU
  │   └── ApprovalStatus.tsx        ⏳ NEU
  │
  └── events/
      ├── EventList.tsx             ⏳ NEU (erweitert)
      ├── EventCard.tsx             ⏳ NEU
      ├── EventFilters.tsx          ⏳ NEU
      └── EventDetail.tsx           ⏳ NEU
```

---

## 4. Seiten-Definitionen

### **4.1 Automation-Dashboard**

**Pfad:** `/admin/orchestrator/automation`

**Beschreibung:** Haupt-Dashboard für Automation-Verwaltung

**Komponenten:**
- Automation-Status-Karten (pro Use-Case)
- Automation-Statistiken (Grafiken)
- Letzte Trigger-Auslösungen
- Letzte Workflow-Ausführungen
- Approval-Status-Übersicht

**Funktionen:**
- Automation aktivieren/deaktivieren (pro Use-Case)
- Schnellzugriff auf Trigger/Workflows
- Status-Übersicht

---

### **4.2 Trigger-Liste**

**Pfad:** `/admin/orchestrator/automation/triggers`

**Beschreibung:** Liste aller Trigger mit Filter und Aktionen

**Komponenten:**
- Trigger-Liste (Tabelle/Karten)
- Filter (Typ, Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen (Aktivieren/Deaktivieren)

**Funktionen:**
- Trigger anzeigen
- Trigger aktivieren/deaktivieren
- Trigger löschen
- Trigger manuell auslösen (Testing)
- Zu Trigger-Detail navigieren

---

### **4.3 Trigger-Detail**

**Pfad:** `/admin/orchestrator/automation/triggers/[id]`

**Beschreibung:** Detail-Ansicht eines Triggers

**Komponenten:**
- Trigger-Informationen
- Bedingungen (JSON-Viewer)
- Aktionen (JSON-Viewer)
- Approval-Status
- Event-Historie
- Aktionen (Bearbeiten, Löschen, Aktivieren/Deaktivieren, Manuell auslösen)

**Funktionen:**
- Trigger bearbeiten
- Trigger löschen
- Trigger aktivieren/deaktivieren
- Trigger manuell auslösen
- Event-Historie anzeigen

---

### **4.4 Trigger erstellen**

**Pfad:** `/admin/orchestrator/automation/triggers/new`

**Beschreibung:** Formular zum Erstellen eines neuen Triggers

**Komponenten:**
- Trigger-Formular
- Bedingungen-Editor (JSON-Editor)
- Aktionen-Editor (JSON-Editor)
- Validierung
- Preview

**Funktionen:**
- Trigger erstellen
- Validierung (Client + Server)
- Preview vor Speichern

---

### **4.5 Workflow-Liste**

**Pfad:** `/admin/orchestrator/automation/workflows`

**Beschreibung:** Liste aller Workflows mit Filter und Aktionen

**Komponenten:**
- Workflow-Liste (Tabelle/Karten)
- Filter (Status, Use-Case)
- Suchfunktion
- Bulk-Aktionen

**Funktionen:**
- Workflow anzeigen
- Workflow starten/pausieren/fortsetzen
- Workflow löschen
- Zu Workflow-Detail navigieren

---

### **4.6 Workflow-Detail**

**Pfad:** `/admin/orchestrator/automation/workflows/[id]`

**Beschreibung:** Detail-Ansicht eines Workflows

**Komponenten:**
- Workflow-Informationen
- Workflow-Schritte (Visualisierung)
- Approval-Status
- Execution-Historie
- Aktionen (Bearbeiten, Löschen, Starten, Pausieren, Fortsetzen)

**Funktionen:**
- Workflow bearbeiten
- Workflow löschen
- Workflow starten/pausieren/fortsetzen
- Execution-Historie anzeigen

---

### **4.7 Workflow erstellen**

**Pfad:** `/admin/orchestrator/automation/workflows/new`

**Beschreibung:** Formular zum Erstellen eines neuen Workflows

**Komponenten:**
- Workflow-Formular
- Schritt-Editor (Drag & Drop)
- Validierung
- Preview

**Funktionen:**
- Workflow erstellen
- Schritte hinzufügen/bearbeiten/löschen
- Validierung (Client + Server)
- Preview vor Speichern

---

### **4.8 Workflow-Executions**

**Pfad:** `/admin/orchestrator/automation/workflows/[id]/executions`

**Beschreibung:** Liste aller Workflow-Ausführungen

**Komponenten:**
- Execution-Liste (Tabelle)
- Filter (Status, Zeitraum)
- Execution-Detail (Modal/Seite)
- Execution-Visualisierung (Schritt-Status)

**Funktionen:**
- Execution-Liste anzeigen
- Execution-Detail anzeigen
- Execution-Status verfolgen

---

### **4.9 Status-Dashboard**

**Pfad:** `/admin/orchestrator/status`

**Beschreibung:** Gesamt-Status-Dashboard

**Komponenten:**
- Gesamt-Status-Karten
- Trigger-Status
- Workflow-Status
- Queue-Status
- Approval-Status
- Statistiken (Grafiken)

**Funktionen:**
- Gesamt-Status anzeigen
- Detaillierte Status-Informationen
- Statistiken anzeigen

---

### **4.10 Event-Liste (erweitert)**

**Pfad:** `/admin/orchestrator/events`

**Beschreibung:** Event-Liste mit erweiterten Filtern

**Komponenten:**
- Event-Liste (Tabelle)
- Filter (Event-Typ, Resource-Typ, Zeitraum)
- Suchfunktion
- Event-Detail (Modal)

**Funktionen:**
- Event-Liste anzeigen
- Event-Detail anzeigen
- Event-Suche

---

## 5. Design-Standards

### **5.1 Framework & Technologie**

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Shadcn/ui (falls vorhanden)
- **Icons:** Lucide React
- **Charts:** Recharts (für Statistiken)

---

### **5.2 Enterprise++ Design**

- **Design-System:** SAP/IBM/Siemens-Niveau
- **Dark Mode:** Vollständig unterstützt
- **Mobile:** Responsive Design
- **Accessibility:** WCAG 2.1 AA
- **Performance:** Optimiert (Lazy Loading, Code Splitting)

---

### **5.3 Farben & Typografie**

**Farben:**
- Primary: Enterprise-Blau
- Success: Grün
- Warning: Gelb
- Error: Rot
- Info: Blau

**Typografie:**
- Font: System Font Stack
- Headings: Bold, größere Schriftgrößen
- Body: Regular, normale Schriftgröße

---

## 6. Funktionalitäten

### **6.1 Trigger-Management**

| Funktion | Beschreibung | RBAC |
|----------|-------------|------|
| **Trigger anzeigen** | Liste aller Trigger | `orchestrator.view` |
| **Trigger erstellen** | Neuen Trigger erstellen | `orchestrator.manage` |
| **Trigger bearbeiten** | Trigger aktualisieren | `orchestrator.manage` |
| **Trigger löschen** | Trigger entfernen | `orchestrator.manage` |
| **Trigger aktivieren** | Trigger aktivieren | `orchestrator.manage` |
| **Trigger deaktivieren** | Trigger deaktivieren | `orchestrator.manage` |
| **Trigger manuell auslösen** | Trigger testen | `orchestrator.manage` |

---

### **6.2 Workflow-Management**

| Funktion | Beschreibung | RBAC |
|----------|-------------|------|
| **Workflow anzeigen** | Liste aller Workflows | `orchestrator.view` |
| **Workflow erstellen** | Neuen Workflow erstellen | `orchestrator.manage` |
| **Workflow bearbeiten** | Workflow aktualisieren | `orchestrator.manage` |
| **Workflow löschen** | Workflow entfernen | `orchestrator.manage` |
| **Workflow starten** | Workflow ausführen | `orchestrator.manage` |
| **Workflow pausieren** | Workflow pausieren | `orchestrator.manage` |
| **Workflow fortsetzen** | Workflow fortsetzen | `orchestrator.manage` |

---

### **6.3 Automation-Management**

| Funktion | Beschreibung | RBAC |
|----------|-------------|------|
| **Automation-Status anzeigen** | Status pro Use-Case | `orchestrator.view` |
| **Automation aktivieren** | Automation aktivieren | `orchestrator.manage` |
| **Automation deaktivieren** | Automation deaktivieren | `orchestrator.manage` |
| **Automation-Statistiken** | Statistiken anzeigen | `orchestrator.view` |

---

### **6.4 Status & Monitoring**

| Funktion | Beschreibung | RBAC |
|----------|-------------|------|
| **Gesamt-Status** | Gesamt-Status anzeigen | `orchestrator.view` |
| **Trigger-Status** | Trigger-Status anzeigen | `orchestrator.view` |
| **Workflow-Status** | Workflow-Status anzeigen | `orchestrator.view` |
| **Queue-Status** | Queue-Status anzeigen | `orchestrator.view` |
| **Approval-Status** | Approval-Status anzeigen | `orchestrator.view` |

---

## 7. Integration mit Backend

### **7.1 API-Endpoints**

**Alle API-Endpoints sind bereits implementiert:**
- `/api/orchestrator/triggers/*`
- `/api/orchestrator/workflows/*`
- `/api/orchestrator/automation/*`
- `/api/orchestrator/status/*`
- `/api/orchestrator/events/*`
- `/api/orchestrator/approvals/*`

**Siehe:** `P8-API-SPEC.md` für vollständige API-Spezifikationen

---

### **7.2 Authentifizierung & RBAC**

- **Authentifizierung:** Session-Token (Cookie `adm_session`)
- **RBAC:** Rollenbasierte Zugriffskontrolle
- **Prüfung:** Client + Server (API)

---

## 8. User Experience (UX)

### **8.1 Navigation**

- **Hauptnavigation:** Admin-Menü erweitern
- **Breadcrumbs:** Für tiefe Hierarchien
- **Schnellzugriff:** Wichtige Aktionen prominent

---

### **8.2 Feedback**

- **Loading States:** Spinner/Skeletons während API-Calls
- **Success Messages:** Toast-Notifications bei Erfolg
- **Error Messages:** Klare Fehlermeldungen
- **Confirmations:** Bestätigungs-Dialoge bei kritischen Aktionen

---

### **8.3 Performance**

- **Lazy Loading:** Komponenten nach Bedarf laden
- **Code Splitting:** Route-basiertes Code Splitting
- **Caching:** API-Responses cachen (React Query/SWR)
- **Optimistic Updates:** UI sofort aktualisieren

---

## 9. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständige UI-Übersicht

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: 📋 PLANUNG – AUSSTEHEND (Manual Approval erforderlich)*





