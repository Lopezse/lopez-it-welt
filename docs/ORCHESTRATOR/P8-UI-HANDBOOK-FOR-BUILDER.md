# P8-UI-HANDBOOK-FOR-BUILDER

## Orchestrator Level 2 Admin-UI – Implementierungsauftrag für Agent B (Builder)

### Lopez IT Welt – KI-Orchestrierung Phase P8-UI

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG ABGESCHLOSSEN**  
**Freigabe:** ✅ **BEREIT FÜR IMPLEMENTIERUNG**

---

## 1. Einleitung

Dieses Dokument ist der **exakte Implementierungsauftrag** für **Agent B (Builder)** zur Umsetzung der **Orchestrator Level 2 Admin-UI (Phase P8-UI)**.

**Basis-Dokumente:**
- `P8-UI-OVERVIEW.md` – UI-Übersicht
- `P8-UI-COMPONENTS.md` – Komponenten-Spezifikationen
- `P8-UI-PAGES.md` – Seiten-Spezifikationen
- `P8-API-SPEC.md` – API-Spezifikationen (Backend bereits implementiert)

**Backend-Status:**
- ✅ Alle APIs vollständig implementiert
- ✅ P7-Approval-Prüfungen aktiv
- ✅ Auto-Trigger an P7 gebunden
- ✅ "unknown" Use-Cases werden blockiert
- ✅ DSGVO/DSFA-Konformität bestätigt
- ✅ Produktionsreife durch Agent C bestätigt

---

## 2. Implementierungs-Übersicht

### **2.1 Was muss implementiert werden?**

| Komponente | Beschreibung | Status |
|-----------|--------------|--------|
| **Automation Dashboard** | Haupt-Dashboard für Automation | ⏳ Neu |
| **Trigger-Komponenten** | Trigger-Liste, Detail, Formular | ⏳ Neu |
| **Workflow-Komponenten** | Workflow-Liste, Detail, Formular | ⏳ Neu |
| **Status-Komponenten** | Status-Dashboard, Karten | ⏳ Neu |
| **Event-Komponenten** | Event-Liste (erweitert) | ⏳ Neu |
| **Admin-Seiten** | Alle neuen Seiten | ⏳ Neu |
| **Navigation** | Admin-Menü erweitern | ⏳ Neu |

---

## 3. Dateien-Struktur

### **3.1 Neue Komponenten erstellen**

```
src/components/orchestrator/
  ├── automation/
  │   ├── AutomationDashboard.tsx      ⏳ NEU
  │   ├── AutomationStatusCard.tsx     ⏳ NEU
  │   ├── AutomationStats.tsx          ⏳ NEU
  │   │
  │   ├── triggers/
  │   │   ├── TriggerList.tsx          ⏳ NEU
  │   │   ├── TriggerCard.tsx          ⏳ NEU
  │   │   ├── TriggerDetail.tsx        ⏳ NEU
  │   │   ├── TriggerForm.tsx          ⏳ NEU
  │   │   ├── TriggerFilters.tsx       ⏳ NEU
  │   │   └── TriggerActions.tsx       ⏳ NEU
  │   │
  │   └── workflows/
  │       ├── WorkflowList.tsx          ⏳ NEU
  │       ├── WorkflowCard.tsx          ⏳ NEU
  │       ├── WorkflowDetail.tsx        ⏳ NEU
  │       ├── WorkflowForm.tsx          ⏳ NEU
  │       ├── WorkflowStepEditor.tsx    ⏳ NEU
  │       ├── WorkflowExecution.tsx      ⏳ NEU
  │       ├── WorkflowFilters.tsx       ⏳ NEU
  │       └── WorkflowActions.tsx       ⏳ NEU
  │
  ├── status/
  │   ├── StatusDashboard.tsx           ⏳ NEU
  │   ├── StatusCard.tsx                 ⏳ NEU
  │   ├── QueueStatus.tsx                ⏳ NEU
  │   └── ApprovalStatus.tsx             ⏳ NEU
  │
  └── events/
      ├── EventList.tsx                 ⏳ NEU (erweitert)
      ├── EventCard.tsx                  ⏳ NEU
      ├── EventFilters.tsx                ⏳ NEU
      └── EventDetail.tsx                ⏳ NEU
```

---

### **3.2 Gemeinsame UI-Komponenten**

```
src/components/ui/
  ├── JSONViewer.tsx                    ⏳ NEU (falls nicht vorhanden)
  ├── JSONEditor.tsx                    ⏳ NEU (falls nicht vorhanden)
  ├── StatusBadge.tsx                  ⏳ NEU (falls nicht vorhanden)
  └── FilterBar.tsx                     ⏳ NEU (falls nicht vorhanden)
```

---

### **3.3 Neue Admin-Seiten erstellen**

```
src/app/admin/orchestrator/
  ├── automation/                       ⏳ NEU
  │   ├── page.tsx                     ⏳ Automation Dashboard
  │   │
  │   ├── triggers/
  │   │   ├── page.tsx                 ⏳ Trigger-Liste
  │   │   ├── [id]/
  │   │   │   └── page.tsx             ⏳ Trigger-Detail
  │   │   └── new/
  │   │       └── page.tsx              ⏳ Trigger erstellen
  │   │
  │   └── workflows/
  │       ├── page.tsx                 ⏳ Workflow-Liste
  │       ├── [id]/
  │       │   ├── page.tsx              ⏳ Workflow-Detail
  │       │   └── executions/
  │       │       └── page.tsx         ⏳ Execution-Liste
  │       └── new/
  │           └── page.tsx              ⏳ Workflow erstellen
  │
  └── status/                          ⏳ NEU
      ├── page.tsx                     ⏳ Status Dashboard
      ├── triggers/
      │   └── page.tsx                 ⏳ Trigger-Status
      └── workflows/
          └── page.tsx                 ⏳ Workflow-Status
```

---

### **3.4 Bestehende Seiten erweitern**

```
src/app/admin/orchestrator/
  ├── page.tsx                         ✅ BESTEHEND (erweitern)
  └── events/
      └── page.tsx                     ✅ BESTEHEND (erweitern)
```

---

## 4. Implementierungs-Details

### **4.1 Automation Dashboard**

**Pfad:** `src/app/admin/orchestrator/automation/page.tsx`

**Komponenten:**
- `AutomationDashboard`
- `AutomationStatusCard` (pro Use-Case)
- `AutomationStats` (Grafiken mit Recharts)

**API-Calls:**
- `GET /api/orchestrator/automation/status`
- `GET /api/orchestrator/automation/stats`
- `GET /api/orchestrator/triggers?limit=10`
- `GET /api/orchestrator/workflows?limit=10`

**Funktionen:**
- Automation-Status anzeigen (pro Use-Case)
- Automation aktivieren/deaktivieren (Toggle)
- Statistiken anzeigen (Grafiken)
- Letzte Trigger-Auslösungen anzeigen
- Letzte Workflow-Ausführungen anzeigen
- Approval-Status-Übersicht anzeigen

---

### **4.2 Trigger-Liste**

**Pfad:** `src/app/admin/orchestrator/automation/triggers/page.tsx`

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

### **4.3 Trigger-Detail**

**Pfad:** `src/app/admin/orchestrator/automation/triggers/[id]/page.tsx`

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

### **4.4 Trigger erstellen**

**Pfad:** `src/app/admin/orchestrator/automation/triggers/new/page.tsx`

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

### **4.5 Workflow-Liste**

**Pfad:** `src/app/admin/orchestrator/automation/workflows/page.tsx`

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

### **4.6 Workflow-Detail**

**Pfad:** `src/app/admin/orchestrator/automation/workflows/[id]/page.tsx`

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

### **4.7 Workflow-Executions**

**Pfad:** `src/app/admin/orchestrator/automation/workflows/[id]/executions/page.tsx`

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

### **4.8 Workflow erstellen**

**Pfad:** `src/app/admin/orchestrator/automation/workflows/new/page.tsx`

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

### **4.9 Status Dashboard**

**Pfad:** `src/app/admin/orchestrator/status/page.tsx`

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

## 6. API-Integration

### **6.1 API-Calls**

**Alle API-Endpoints sind bereits implementiert:**
- `/api/orchestrator/triggers/*`
- `/api/orchestrator/workflows/*`
- `/api/orchestrator/automation/*`
- `/api/orchestrator/status/*`
- `/api/orchestrator/events/*`
- `/api/orchestrator/approvals/*`

**Siehe:** `P8-API-SPEC.md` für vollständige API-Spezifikationen

---

### **6.2 Authentifizierung & RBAC**

- **Authentifizierung:** Session-Token (Cookie `adm_session`)
- **RBAC:** Rollenbasierte Zugriffskontrolle
- **Prüfung:** Client + Server (API)

---

### **6.3 Fehlerbehandlung**

- **Loading States:** Spinner/Skeletons während API-Calls
- **Success Messages:** Toast-Notifications bei Erfolg
- **Error Messages:** Klare Fehlermeldungen
- **Confirmations:** Bestätigungs-Dialoge bei kritischen Aktionen

---

## 7. Navigation

### **7.1 Admin-Menü erweitern**

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

### **7.2 Breadcrumbs**

**Komponente:** `components/ui/Breadcrumbs.tsx`

**Beispiele:**
- `Orchestrator > Automation`
- `Orchestrator > Automation > Triggers`
- `Orchestrator > Automation > Triggers > [Trigger-Name]`

---

## 8. Testing-Anforderungen

### **8.1 Unit-Tests**

**Pfad:** `src/components/orchestrator/__tests__/`

**Tests:**
- Komponenten-Tests (React Testing Library)
- API-Integration-Tests (Mock)

---

### **8.2 E2E-Tests**

**Pfad:** `e2e/orchestrator/`

**Tests:**
- Automation-Dashboard Tests
- Trigger-Management Tests
- Workflow-Management Tests

---

## 9. Abschlusskriterien

### **9.1 Funktionale Kriterien**

- ✅ Automation Dashboard vollständig
- ✅ Trigger-Management vollständig
- ✅ Workflow-Management vollständig
- ✅ Status Dashboard vollständig
- ✅ Event-Liste erweitert
- ✅ Navigation erweitert

---

### **9.2 Qualitätskriterien**

- ✅ 0 TypeScript-Fehler
- ✅ 0 Linter-Fehler
- ✅ Vollständige Test-Abdeckung (>80%)
- ✅ Enterprise++ Standards eingehalten
- ✅ Dark Mode vollständig unterstützt
- ✅ Mobile Responsive

---

### **9.3 Performance-Kriterien**

- ✅ Lazy Loading implementiert
- ✅ Code Splitting implementiert
- ✅ API-Responses gecacht (React Query/SWR)
- ✅ Optimistic Updates implementiert

---

## 10. Nächste Schritte

### **10.1 Implementierungs-Reihenfolge**

1. **Phase 1:** Gemeinsame UI-Komponenten (JSONViewer, JSONEditor, etc.)
2. **Phase 2:** Automation Dashboard
3. **Phase 3:** Trigger-Komponenten
4. **Phase 4:** Workflow-Komponenten
5. **Phase 5:** Status-Komponenten
6. **Phase 6:** Event-Komponenten (erweitert)
7. **Phase 7:** Navigation erweitern
8. **Phase 8:** Testing & Dokumentation

---

### **10.2 Handover an Agent C (Reviewer)**

Nach Abschluss der Implementierung:
- Code-Review durch Agent C
- Quality-Assurance durch Agent C
- Testing durch Agent C

---

## 11. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiger Implementierungsauftrag

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: ✅ BEREIT FÜR IMPLEMENTIERUNG*

---

## 🎯 HANDOVER AN AGENT B (BUILDER)

**Agent B, bitte implementiere die Orchestrator Level 2 Admin-UI (Phase P8-UI) gemäß diesem Handbuch.**

**Alle Details sind in den folgenden Dokumenten:**
- `P8-UI-OVERVIEW.md` – UI-Übersicht
- `P8-UI-COMPONENTS.md` – Komponenten-Spezifikationen
- `P8-UI-PAGES.md` – Seiten-Spezifikationen
- `P8-UI-HANDBOOK-FOR-BUILDER.md` – Dieses Dokument
- `P8-API-SPEC.md` – API-Spezifikationen (Backend bereits implementiert)

**Backend-Status:**
- ✅ Alle APIs vollständig implementiert
- ✅ P7-Approval-Prüfungen aktiv
- ✅ Auto-Trigger an P7 gebunden
- ✅ "unknown" Use-Cases werden blockiert
- ✅ DSGVO/DSFA-Konformität bestätigt
- ✅ Produktionsreife durch Agent C bestätigt

**Viel Erfolg! 🚀**





