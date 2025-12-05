# P8-HANDBOOK-FOR-BUILDER

## Orchestrator Level 2 – Implementierungsauftrag für Agent B (Builder)

### Lopez IT Welt – KI-Orchestrierung Phase P8

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** 📋 **PLANUNG ABGESCHLOSSEN**  
**Freigabe:** ✅ **BEREIT FÜR IMPLEMENTIERUNG**

---

## 1. Einleitung

Dieses Dokument ist der **exakte Implementierungsauftrag** für **Agent B (Builder)** zur Umsetzung von **Orchestrator Level 2 & Automation (Phase P8)**.

**Basis-Dokumente:**
- `P8-OVERVIEW.md` – Ziele, Architektur, Scope
- `P8-MODEL-DEFINITION.md` – Modell-Definitionen
- `P8-WORKFLOWS.md` – Workflow-Definitionen
- `P8-API-SPEC.md` – API-Spezifikationen
- `P8-DATA-MODEL.md` – Datenmodell
- `P8-GOVERNANCE.md` – Governance & Compliance

---

## 2. Implementierungs-Übersicht

### **2.1 Was muss implementiert werden?**

| Komponente | Beschreibung | Status |
|-----------|--------------|--------|
| **TriggerEngine** | Event-basierte Trigger-Erkennung | ⏳ Neu |
| **WorkflowManager** | Multi-Step-Workflow-Management | ⏳ Neu |
| **PriorityEngine** | Intelligente Task-Priorisierung | ⏳ Neu |
| **AutomationEngine** | Automatische Task-Ausführung | ⏳ Neu |
| **ApprovalManager** | P7 Manual Approval Integration | ⏳ Neu |
| **AuditManager** | Erweiterte Audit-Funktionen | ⏳ Neu |
| **API-Endpoints** | Alle P8-APIs | ⏳ Neu |
| **Admin-UI** | Automation-Dashboard | ⏳ Neu |
| **Datenbank-Tabellen** | Alle P8-Tabellen | ⏳ Neu |

---

## 3. Dateien-Struktur

### **3.1 Neue Dateien erstellen**

```
src/lib/ki-orchestrator/
  ├── level2/
  │   ├── TriggerEngine.ts          ⏳ NEU
  │   ├── WorkflowManager.ts        ⏳ NEU
  │   ├── PriorityEngine.ts         ⏳ NEU
  │   ├── AutomationEngine.ts       ⏳ NEU
  │   ├── ApprovalManager.ts        ⏳ NEU
  │   ├── AuditManager.ts           ⏳ NEU
  │   ├── types.ts                  ⏳ NEU (Level 2 Types)
  │   └── index.ts                  ⏳ NEU (Exports)
  │
  ├── OrchestratorCore.ts           ✅ BESTEHEND (erweitern)
  ├── AgentRegistry.ts              ✅ BESTEHEND
  ├── ContextManager.ts             ✅ BESTEHEND
  ├── QualityGate.ts                ✅ BESTEHEND
  ├── OrchestratorAudit.ts          ✅ BESTEHEND (erweitern)
  └── QueueManager.ts               ✅ BESTEHEND
```

---

### **3.2 API-Routen erstellen**

```
src/app/api/orchestrator/
  ├── triggers/
  │   ├── route.ts                  ⏳ NEU (GET, POST)
  │   └── [id]/
  │       ├── route.ts              ⏳ NEU (GET, PUT, DELETE)
  │       └── fire/
  │           └── route.ts           ⏳ NEU (POST - Trigger manuell auslösen)
  │
  ├── workflows/
  │   ├── route.ts                   ⏳ NEU (GET, POST)
  │   └── [id]/
  │       ├── route.ts              ⏳ NEU (GET, PUT, DELETE)
  │       ├── start/
  │       │   └── route.ts          ⏳ NEU (POST)
  │       ├── pause/
  │       │   └── route.ts          ⏳ NEU (POST)
  │       ├── resume/
  │       │   └── route.ts           ⏳ NEU (POST)
  │       └── executions/
  │           └── route.ts           ⏳ NEU (GET - Execution-Liste)
  │
  ├── automation/
  │   ├── enable/
  │   │   └── route.ts              ⏳ NEU (POST)
  │   ├── disable/
  │   │   └── route.ts              ⏳ NEU (POST)
  │   ├── status/
  │   │   └── route.ts              ⏳ NEU (GET)
  │   └── stats/
  │       └── route.ts              ⏳ NEU (GET)
  │
  ├── events/
  │   ├── route.ts                  ⏳ NEU (GET, POST)
  │   └── [id]/
  │       └── route.ts              ⏳ NEU (GET)
  │
  ├── status/
  │   ├── route.ts                  ⏳ NEU (GET - Gesamt-Status)
  │   ├── triggers/
  │   │   └── route.ts              ⏳ NEU (GET)
  │   ├── workflows/
  │   │   └── route.ts              ⏳ NEU (GET)
  │   └── queue/
  │       └── route.ts              ⏳ NEU (GET - Erweitert)
  │
  └── approvals/
      ├── status/
      │   └── route.ts              ⏳ NEU (GET)
      ├── check/
      │   └── route.ts              ⏳ NEU (POST)
      └── request/
          └── route.ts              ⏳ NEU (POST)
```

---

### **3.3 Admin-UI-Seiten erstellen**

```
src/app/admin/orchestrator/
  ├── automation/
  │   ├── page.tsx                  ⏳ NEU (Automation-Übersicht)
  │   ├── triggers/
  │   │   ├── page.tsx              ⏳ NEU (Trigger-Liste)
  │   │   ├── [id]/
  │   │   │   └── page.tsx           ⏳ NEU (Trigger-Detail)
  │   │   └── new/
  │   │       └── page.tsx           ⏳ NEU (Trigger erstellen)
  │   └── workflows/
  │       ├── page.tsx              ⏳ NEU (Workflow-Liste)
  │       ├── [id]/
  │       │   ├── page.tsx           ⏳ NEU (Workflow-Detail)
  │       │   └── executions/
  │       │       └── page.tsx      ⏳ NEU (Execution-Liste)
  │       └── new/
  │           └── page.tsx           ⏳ NEU (Workflow erstellen)
  │
  └── events/
      └── page.tsx                  ⏳ NEU (Event-Liste, erweitert)
```

---

### **3.4 Datenbank-Migrationen erstellen**

```
prisma/migrations/
  └── YYYYMMDDHHMMSS_add_orchestrator_level2/
      └── migration.sql             ⏳ NEU
```

**Tabellen:**
- `orchestrator_triggers`
- `orchestrator_workflows`
- `orchestrator_workflow_executions`
- `orchestrator_events`
- `orchestrator_automation_status`
- `orchestrator_approval_requests`

**Siehe:** `P8-DATA-MODEL.md` für vollständige SQL-Schemas

---

## 4. Implementierungs-Details

### **4.1 TriggerEngine.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/TriggerEngine.ts`

**Funktionen:**
```typescript
class TriggerEngine {
  // Trigger registrieren
  async registerTrigger(trigger: TriggerDefinition): Promise<string>
  
  // Trigger aktivieren/deaktivieren
  async enableTrigger(triggerId: string): Promise<void>
  async disableTrigger(triggerId: string): Promise<void>
  
  // Trigger auslösen (manuell)
  async fireTrigger(triggerId: string, context?: Record<string, unknown>): Promise<void>
  
  // Event-Listener (automatisch)
  async onEvent(event: OrchestratorEvent): Promise<void>
  
  // Trigger validieren
  async validateTrigger(trigger: TriggerDefinition): Promise<ValidationResult>
  
  // Trigger-Liste abrufen
  async getTriggers(filters?: TriggerFilters): Promise<Trigger[]>
}
```

**Integration:**
- Event-System (automatisch)
- ApprovalManager (P7-Integration)
- AuditManager (Audit-Logging)

---

### **4.2 WorkflowManager.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/WorkflowManager.ts`

**Funktionen:**
```typescript
class WorkflowManager {
  // Workflow erstellen
  async createWorkflow(workflow: WorkflowDefinition): Promise<string>
  
  // Workflow starten
  async startWorkflow(workflowId: string, payload?: Record<string, unknown>): Promise<string>
  
  // Workflow pausieren/fortsetzen
  async pauseWorkflow(executionId: string): Promise<void>
  async resumeWorkflow(executionId: string): Promise<void>
  
  // Workflow-Status abrufen
  async getWorkflowStatus(executionId: string): Promise<WorkflowExecution>
  
  // Workflow-Liste abrufen
  async getWorkflows(filters?: WorkflowFilters): Promise<Workflow[]>
  
  // Workflow-Schritt ausführen
  async executeStep(executionId: string, stepId: string): Promise<StepResult>
}
```

**Integration:**
- OrchestratorCore (Level 1)
- ApprovalManager (P7-Integration)
- AuditManager (Audit-Logging)

---

### **4.3 PriorityEngine.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/PriorityEngine.ts`

**Funktionen:**
```typescript
class PriorityEngine {
  // Priorität berechnen
  async calculatePriority(task: OrchestratorTask): Promise<number>
  
  // Queue-Reihenfolge bestimmen
  async getQueueOrder(tasks: OrchestratorTask[]): Promise<OrchestratorTask[]>
  
  // Prioritäts-Level bestimmen
  async getPriorityLevel(priority: number): Promise<PriorityLevel>
}
```

**Formel:**
```
Priority = BasePriority + ContextBonus + RiskPenalty + TimeBonus
```

**Integration:**
- QueueManager (Queue-Reihenfolge)
- ContextManager (Kontext-Daten)

---

### **4.4 AutomationEngine.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/AutomationEngine.ts`

**Funktionen:**
```typescript
class AutomationEngine {
  // Automation aktivieren
  async enableAutomation(useCase: string, automationType: string): Promise<void>
  
  // Automation deaktivieren
  async disableAutomation(useCase: string): Promise<void>
  
  // Automation-Status abrufen
  async getAutomationStatus(useCase?: string): Promise<AutomationStatus>
  
  // Automation-Statistiken abrufen
  async getAutomationStats(period?: string): Promise<AutomationStats>
}
```

**Integration:**
- TriggerEngine (Trigger-Auslösung)
- WorkflowManager (Workflow-Ausführung)
- ApprovalManager (P7-Integration)

---

### **4.5 ApprovalManager.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/ApprovalManager.ts`

**Funktionen:**
```typescript
class ApprovalManager {
  // Approval-Status prüfen
  async checkApprovalStatus(useCase: string): Promise<ApprovalStatus>
  
  // Approval-Request erstellen
  async createApprovalRequest(request: ApprovalRequest): Promise<string>
  
  // System sperren/entsperren
  async lockSystem(useCase: string, reason: string): Promise<void>
  async unlockSystem(useCase: string): Promise<void>
  
  // Re-Approval prüfen
  async checkReApprovalRequired(useCase: string, changeType: string): Promise<boolean>
}
```

**Integration:**
- P7 Manual Approval System
- AutomationEngine (Auto-Lock bei Änderungen)
- AuditManager (Audit-Logging)

---

### **4.6 AuditManager.ts**

**Pfad:** `src/lib/ki-orchestrator/level2/AuditManager.ts`

**Funktionen:**
```typescript
class AuditManager {
  // Event loggen
  async logEvent(event: OrchestratorEvent): Promise<void>
  
  // Hash generieren
  async generateHash(data: Record<string, unknown>): Promise<string>
  
  // Audit-Log abrufen
  async getAuditLog(filters?: AuditFilters): Promise<AuditLog[]>
}
```

**Integration:**
- Bestehendes Audit-System (`dsgvo_audit_events`)
- Event-Präfix: `ORCH_*`

---

## 5. API-Implementierung

### **5.1 API-Standards**

**Authentifizierung:**
- JWT-Token (Bearer Token)
- Header: `Authorization: Bearer <token>`

**RBAC:**
- `orchestrator.manage` – Vollzugriff
- `orchestrator.view` – Nur Lese-Zugriff

**Fehlerbehandlung:**
- Standard-Error-Response (siehe `P8-API-SPEC.md`)
- HTTP-Status-Codes (400, 401, 403, 404, 500)

**Rate Limiting:**
- Standard: 100 Requests/Minute
- Admin: 1000 Requests/Minute

---

### **5.2 API-Endpoints (Vollständige Liste)**

**Siehe:** `P8-API-SPEC.md` für vollständige API-Spezifikationen

**Wichtig:**
- Alle Endpoints müssen RBAC-Prüfung haben
- Alle Endpoints müssen Audit-Logging haben
- Alle Endpoints müssen DSGVO-Prüfung haben (bei KI-Aktionen)

---

## 6. Admin-UI-Implementierung

### **6.1 Design-Standards**

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Dark Mode:** Vollständig unterstützt
- **Mobile:** Responsive Design
- **Enterprise++ Design:** SAP/IBM/Siemens-Niveau

---

### **6.2 UI-Komponenten**

**Neue Komponenten:**
- `TriggerList` – Trigger-Liste
- `TriggerDetail` – Trigger-Detail
- `TriggerForm` – Trigger erstellen/bearbeiten
- `WorkflowList` – Workflow-Liste
- `WorkflowDetail` – Workflow-Detail
- `WorkflowForm` – Workflow erstellen/bearbeiten
- `WorkflowExecution` – Workflow-Ausführung
- `AutomationStatus` – Automation-Status
- `EventList` – Event-Liste (erweitert)

---

### **6.3 UI-Funktionen**

**Trigger-Management:**
- Trigger-Liste (mit Filter)
- Trigger erstellen/bearbeiten
- Trigger aktivieren/deaktivieren
- Trigger manuell auslösen (Testing)

**Workflow-Management:**
- Workflow-Liste (mit Filter)
- Workflow erstellen/bearbeiten
- Workflow starten/pausieren/fortsetzen
- Workflow-Execution-Übersicht

**Automation-Übersicht:**
- Automation-Status pro Use-Case
- Automation aktivieren/deaktivieren
- Automation-Statistiken

**Event-Übersicht:**
- Event-Liste (mit Filter)
- Event-Detail
- Event-Suche

---

## 7. Datenbank-Implementierung

### **7.1 Migration erstellen**

**Pfad:** `prisma/migrations/YYYYMMDDHHMMSS_add_orchestrator_level2/migration.sql`

**Tabellen:**
- Siehe `P8-DATA-MODEL.md` für vollständige SQL-Schemas

**Wichtig:**
- Alle Tabellen müssen Indizes haben
- Alle Tabellen müssen Foreign Keys haben (wo sinnvoll)
- Alle Tabellen müssen `created_at` und `updated_at` haben

---

### **7.2 Prisma-Schema aktualisieren**

**Pfad:** `prisma/schema.prisma`

**Modelle hinzufügen:**
- `OrchestratorTrigger`
- `OrchestratorWorkflow`
- `OrchestratorWorkflowExecution`
- `OrchestratorEvent`
- `OrchestratorAutomationStatus`
- `OrchestratorApprovalRequest`

---

## 8. Integration mit bestehenden Systemen

### **8.1 OrchestratorCore erweitern**

**Pfad:** `src/lib/ki-orchestrator/OrchestratorCore.ts`

**Erweiterungen:**
- `dispatchTaskAsync()` – Bereits vorhanden (QueueManager)
- Integration mit TriggerEngine
- Integration mit WorkflowManager
- Integration mit PriorityEngine

---

### **8.2 OrchestratorAudit erweitern**

**Pfad:** `src/lib/ki-orchestrator/OrchestratorAudit.ts`

**Neue Events:**
- `ORCH_TRIGGER_FIRED`
- `ORCH_TRIGGER_VALIDATED`
- `ORCH_TRIGGER_BLOCKED`
- `ORCH_WORKFLOW_STARTED`
- `ORCH_WORKFLOW_STEP_COMPLETED`
- `ORCH_WORKFLOW_STEP_FAILED`
- `ORCH_WORKFLOW_COMPLETED`
- `ORCH_WORKFLOW_FAILED`
- `ORCH_AUTOMATION_ENABLED`
- `ORCH_AUTOMATION_DISABLED`
- `ORCH_APPROVAL_REQUESTED`
- `ORCH_APPROVAL_GRANTED`
- `ORCH_APPROVAL_REJECTED`

---

### **8.3 P7-Integration**

**Pfad:** `src/lib/ki-orchestrator/level2/ApprovalManager.ts`

**Integration:**
- P7 Manual Approval System
- Approval-Status prüfen
- Approval-Requests erstellen
- System sperren/entsperren

---

## 9. Testing-Anforderungen

### **9.1 Unit-Tests**

**Pfad:** `src/lib/ki-orchestrator/level2/__tests__/`

**Tests:**
- TriggerEngine Tests
- WorkflowManager Tests
- PriorityEngine Tests
- AutomationEngine Tests
- ApprovalManager Tests
- AuditManager Tests

---

### **9.2 Integration-Tests**

**Pfad:** `src/app/api/orchestrator/__tests__/`

**Tests:**
- API-Endpoint Tests
- RBAC-Tests
- DSGVO-Integration-Tests
- P7-Integration-Tests

---

### **9.3 E2E-Tests**

**Pfad:** `e2e/orchestrator/`

**Tests:**
- Automation-Workflow Tests
- Trigger-Auslösung Tests
- Approval-Prozess Tests

---

## 10. Dokumentation

### **10.1 Code-Dokumentation**

- **JSDoc:** Alle Funktionen dokumentieren
- **TypeScript:** Vollständige Typisierung
- **Comments:** Komplexe Logik kommentieren

---

### **10.2 API-Dokumentation**

- **OpenAPI/Swagger:** API-Dokumentation erstellen
- **Beispiele:** Request/Response-Beispiele

---

## 11. Abschlusskriterien

### **11.1 Funktionale Kriterien**

- ✅ TriggerEngine funktionsfähig
- ✅ WorkflowManager funktionsfähig
- ✅ PriorityEngine funktionsfähig
- ✅ AutomationEngine funktionsfähig
- ✅ ApprovalManager funktionsfähig
- ✅ AuditManager funktionsfähig
- ✅ Alle API-Endpoints funktionsfähig
- ✅ Admin-UI vollständig
- ✅ Datenbank-Tabellen erstellt

---

### **11.2 Qualitätskriterien**

- ✅ 0 TypeScript-Fehler
- ✅ 0 Linter-Fehler
- ✅ Vollständige Test-Abdeckung (>80%)
- ✅ Enterprise++ Standards eingehalten
- ✅ DSGVO/DSFA-Konformität gewährleistet

---

### **11.3 Integration-Kriterien**

- ✅ OrchestratorCore erweitert
- ✅ OrchestratorAudit erweitert
- ✅ P7-Integration vollständig
- ✅ P6-Integration vollständig
- ✅ DSGVO Decision Engine Integration vollständig

---

## 12. Nächste Schritte

### **12.1 Implementierungs-Reihenfolge**

1. **Phase 1:** Datenbank-Migrationen
2. **Phase 2:** Core-Komponenten (TriggerEngine, WorkflowManager, etc.)
3. **Phase 3:** API-Endpoints
4. **Phase 4:** Admin-UI
5. **Phase 5:** Integration & Testing
6. **Phase 6:** Dokumentation

---

### **12.2 Handover an Agent C (Reviewer)**

Nach Abschluss der Implementierung:
- Code-Review durch Agent C
- Quality-Assurance durch Agent C
- Testing durch Agent C

---

## 13. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – Vollständiger Implementierungsauftrag

---

*Generated by Enterprise++ Orchestrator Level 2 Planning System*  
*Last updated: 2025-11-27*  
*Status: ✅ BEREIT FÜR IMPLEMENTIERUNG*

---

## 🎯 HANDOVER AN AGENT B (BUILDER)

**Agent B, bitte implementiere Orchestrator Level 2 & Automation (Phase P8) gemäß diesem Handbuch.**

**Alle Details sind in den folgenden Dokumenten:**
- `P8-OVERVIEW.md` – Ziele, Architektur, Scope
- `P8-MODEL-DEFINITION.md` – Modell-Definitionen
- `P8-WORKFLOWS.md` – Workflow-Definitionen
- `P8-API-SPEC.md` – API-Spezifikationen
- `P8-DATA-MODEL.md` – Datenmodell
- `P8-GOVERNANCE.md` – Governance & Compliance
- `P8-HANDBOOK-FOR-BUILDER.md` – Dieses Dokument

**Viel Erfolg! 🚀**





