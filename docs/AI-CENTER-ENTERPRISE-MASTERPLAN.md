# AI CENTER ENTERPRISE++ MASTERPLAN

**Version:** 1.1.0  
**Erstellt:** 2024-12-05  
**Aktualisiert:** 2024-12-05  
**Standard:** Enterprise++ (SAP/IBM/Siemens-Niveau)  
**Status:** FREIGEGEBEN FÜR UMSETZUNG  
**Compliance:** DSGVO, GoBD, EU AI Act (2026+)

---

## EXECUTIVE SUMMARY

Dieses Dokument definiert den vollständigen Ausbauplan für das Lopez IT Welt AI Center auf Enterprise++-Niveau. Der Plan orientiert sich an den Architektur- und Governance-Standards von SAP, IBM und Siemens und umfasst vier Haupt-Sprints plus einen Production-Hardening-Sprint.

**Ziel:** Ein vollständiges, DSGVO-konformes, selbstverwaltetes AI Center mit:
- Zentraler KI-Orchestrierung
- Agent-basierter Entwicklungsautomatisierung
- Enterprise-Monitoring und Audit-Trail
- Zero-CMD-Administration
- EU AI Act Compliance (2026+)
- Multi-Mandanten-Fähigkeit (SaaS-ready)
- Vollständiger Backup & Recovery
- Simulation & Dry-Run-Modus
- Ausbildungstaugliche Dokumentation (AEVO/IHK)

---

## AKTUELLER IST-ZUSTAND

### Bereits implementiert (Stand KW 49/2024)

| Komponente | Status | Vollständigkeit |
|------------|--------|-----------------|
| KI-Orchestrator Core | ✅ Produktiv | 100% |
| Agent Registry | ✅ Produktiv | 100% |
| DSGVO Decision Engine | ✅ Produktiv | 100% |
| Quality Gates | ✅ Produktiv | 100% |
| OrchestratorAudit | ✅ Produktiv | 100% |
| QueueManager | ✅ Produktiv | 100% |
| ContextManager | ✅ Produktiv | 100% |
| Agent-A (Planner) | ✅ Produktiv | 100% |
| Agent-B (Builder) | ✅ Produktiv | 100% |
| Agent-C (Reviewer) | ✅ Produktiv | 100% |
| Projekt-Analyzer | ✅ Produktiv | 100% |
| AI Center UI (Basis) | ✅ Produktiv | 60% |
| Dev-Tasks UI | ✅ Produktiv | 70% |
| UOC (Unified Operations Center) | ✅ Produktiv | 100% |

### Noch ausstehend

| Komponente | Priorität | Sprint |
|------------|-----------|--------|
| Agent-Registry UI (vollständig) | HOCH | Sprint 2 |
| Monitoring-Dashboard (vollständig) | HOCH | Sprint 2 |
| Task-Queue-Übersicht | HOCH | Sprint 2 |
| Kosten-Dashboard (detailliert) | MITTEL | Sprint 2 |
| Auto-Workflows | MITTEL | Sprint 3 |
| Standard-Playbooks | MITTEL | Sprint 3 |
| Production-Hardening | KRITISCH | Sprint 4 |

---

## ENTERPRISE++ ARCHITEKTUR-REFERENZ

### SAP-Orientierung
- **Fiori-Style UI**: Konsistente, saubere Oberflächen
- **Launchpad-Konzept**: Zentrale Einstiegsseite mit Kacheln
- **Approval Workflows**: Mehrstufige Freigaben
- **Audit Trail**: Lückenlose Protokollierung

### IBM-Orientierung
- **Carbon Design System**: Klare Typografie, dunkles Theme
- **AI Governance**: Explainable AI, Bias Detection
- **Event-Driven Architecture**: Lose Kopplung
- **Enterprise Service Bus**: Zentrale Message-Queue

### Siemens-Orientierung
- **Industrial-Grade**: Robustheit vor Features
- **Zero-Downtime**: Graceful Degradation
- **Compliance-First**: DSGVO, GoBD, ISO 27001
- **Dokumentation**: Vollständige technische Doku

---

## SPRINT-PLANUNG

---

## SPRINT 2: KI-ORCHESTRATOR & AI CENTER AUSBAU

**Zeitraum:** KW 50-51 (2 Wochen)  
**Fokus:** Feature-Entwicklung, UI-Erweiterung

### 2.1 Agent-Registry UI (Vollausbau)

**Ziel:** Vollständige visuelle Verwaltung aller KI-Agenten

**Seiten:**
```
/admin/ai/agents                 → Agent-Übersicht (Liste + Grid)
/admin/ai/agents/[id]            → Agent-Detail
/admin/ai/agents/new             → Agent registrieren
/admin/ai/agents/[id]/settings   → Agent-Konfiguration
```

**Komponenten:**
| Komponente | Beschreibung | Priorität |
|------------|--------------|-----------|
| `AgentCard` | Kachel für einzelnen Agent | KRITISCH |
| `AgentList` | Tabellenansicht | KRITISCH |
| `AgentStatusBadge` | Status-Anzeige (aktiv/inaktiv/fehler) | KRITISCH |
| `AgentCapabilitiesChart` | Capabilities-Visualisierung | HOCH |
| `AgentRiskIndicator` | DSGVO-Risikostufe | KRITISCH |
| `AgentToggleSwitch` | Aktivieren/Deaktivieren | KRITISCH |
| `AgentMetrics` | Nutzungsstatistiken | HOCH |

**Datenmodell-Erweiterung:**
```sql
-- Neue Tabelle: agent_metrics
CREATE TABLE agent_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  metric_date DATE NOT NULL,
  tasks_total INT DEFAULT 0,
  tasks_success INT DEFAULT 0,
  tasks_failed INT DEFAULT 0,
  avg_duration_ms INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  cost_estimated DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (agent_name, metric_date)
);

-- Neue Tabelle: agent_capabilities
CREATE TABLE agent_capabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  capability VARCHAR(100) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**API-Endpoints:**
```
GET    /api/admin/ai/agents              → Liste aller Agenten
GET    /api/admin/ai/agents/[name]       → Agent-Details
POST   /api/admin/ai/agents              → Agent registrieren
PATCH  /api/admin/ai/agents/[name]       → Agent aktualisieren
DELETE /api/admin/ai/agents/[name]       → Agent entfernen
POST   /api/admin/ai/agents/[name]/toggle → Agent aktivieren/deaktivieren
GET    /api/admin/ai/agents/[name]/metrics → Agent-Metriken
```

### 2.2 Monitoring-Dashboard (Vollausbau)

**Ziel:** Zentrale Übersicht aller KI-Aktivitäten in Echtzeit

**Seiten:**
```
/admin/ai/monitoring              → Haupt-Dashboard
/admin/ai/monitoring/tasks        → Task-Übersicht
/admin/ai/monitoring/queue        → Queue-Status
/admin/ai/monitoring/costs        → Kosten-Dashboard
/admin/ai/monitoring/errors       → Fehler-Übersicht
```

**Haupt-Dashboard Komponenten:**
| Komponente | Beschreibung | Echtzeit |
|------------|--------------|----------|
| `SystemHealthCard` | System-Gesundheit | ✅ SSE |
| `ActiveTasksCounter` | Laufende Tasks | ✅ SSE |
| `QueueDepthIndicator` | Warteschlangen-Tiefe | ✅ SSE |
| `CostMeter` | Aktuelle Kosten (heute/Monat) | 1min Refresh |
| `AgentStatusGrid` | Agent-Status-Übersicht | ✅ SSE |
| `RecentErrorsList` | Letzte Fehler | ✅ SSE |
| `ThroughputChart` | Tasks/Minute Graph | ✅ SSE |
| `LatencyHistogram` | Antwortzeit-Verteilung | 5min Refresh |

**API-Endpoints:**
```
GET  /api/admin/ai/monitoring/health      → System-Health
GET  /api/admin/ai/monitoring/tasks       → Aktive Tasks
GET  /api/admin/ai/monitoring/queue       → Queue-Status
GET  /api/admin/ai/monitoring/costs       → Kosten-Übersicht
GET  /api/admin/ai/monitoring/errors      → Fehler-Liste
SSE  /api/admin/ai/monitoring/stream      → Echtzeit-Updates
```

### 2.3 Projekt-Analyzer Integration

**Ziel:** Projekt-Analyzer mit Entwicklungsaufträgen verbinden

**Workflow:**
```
1. Projekt-Analyzer findet Risiko (z.B. SEC-HIGH)
2. System zeigt "Dev-Task erstellen"-Button
3. Klick → Auto-generierter Task mit:
   - Titel aus Risiko-Beschreibung
   - Typ: SECURITY / BUG / REFACTOR (automatisch)
   - Priorität: Aus Risiko-Level
   - Modul-Zuordnung: Aus Analyzer-Kontext
4. Task erscheint in Dev-Tasks-Liste
5. Agent-A kann sofort planen
```

**Neue Komponente:**
```tsx
// src/components/admin/RiskToTaskButton.tsx
interface RiskToTaskButtonProps {
  risk: ProjectRiskItem;
  projectCode: string;
  onTaskCreated: (taskId: number) => void;
}
```

**API-Endpoint:**
```
POST /api/admin/ai/risk-to-task
Body: { riskId, projectCode, autoAssign?: boolean }
Response: { success: true, taskId: number }
```

### 2.4 Dev-Tasks Erweiterung

**Ziel:** Vollständiger Lifecycle-View für Entwicklungsaufträge

**Neue Ansichten:**
```
/admin/ai/dev-tasks                    → Task-Liste (erweitert)
/admin/ai/dev-tasks/[id]               → Task-Detail (mit Timeline)
/admin/ai/dev-tasks/[id]/plan          → Agent-A Plan-Ansicht
/admin/ai/dev-tasks/[id]/code          → Agent-B Code-Änderungen
/admin/ai/dev-tasks/[id]/review        → Agent-C Review-Ergebnisse
/admin/ai/dev-tasks/kanban             → Kanban-Board
```

**Kanban-Board Spalten:**
| Status | Beschreibung |
|--------|--------------|
| OPEN | Neue Tasks |
| PLANNING | Agent-A arbeitet |
| PLANNED | Plan fertig, wartet auf Build |
| CODING | Agent-B arbeitet |
| REVIEW | Agent-C prüft |
| DONE | Abgeschlossen |
| BLOCKED | Manuell blockiert |

**Komponenten:**
| Komponente | Beschreibung |
|------------|--------------|
| `TaskKanbanBoard` | Drag-Drop Kanban |
| `TaskTimeline` | Status-Historie |
| `PlanStepList` | Agent-A Schritte |
| `CodeChangeViewer` | Diff-Ansicht |
| `ReviewFeedbackCard` | Agent-C Feedback |
| `QualityScoreGauge` | Quality-Score Anzeige |

---

## SPRINT 3: AUTOMATION & KOMFORT

**Zeitraum:** KW 52 - KW 1 (2 Wochen)  
**Fokus:** Workflow-Automatisierung, Benutzerkomfort

### 3.1 Auto-Workflows

**Ziel:** Automatische Reaktionen auf Ereignisse

**Workflow-Engine:**
```typescript
// src/lib/ai/workflows/workflow-engine.ts
interface WorkflowDefinition {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

interface WorkflowTrigger {
  type: "risk_detected" | "task_completed" | "review_failed" | "cost_threshold" | "schedule";
  config: Record<string, unknown>;
}

interface WorkflowAction {
  type: "create_task" | "notify" | "escalate" | "auto_approve" | "run_playbook";
  config: Record<string, unknown>;
}
```

**Standard-Workflows:**
| Workflow | Trigger | Aktion |
|----------|---------|--------|
| SEC-Critical-Alert | Risiko severity=CRITICAL, type=SECURITY | Task erstellen + E-Mail an Admin |
| Auto-Review-Reminder | Task im REVIEW-Status > 24h | Benachrichtigung |
| Cost-Alert | Tageskosten > Schwellenwert | E-Mail-Alert |
| Quality-Gate-Escalation | Review 2x REJECTED | Eskalation an Admin |
| Weekly-Digest | Jeden Freitag 16:00 | Report generieren |

**UI:**
```
/admin/ai/workflows              → Workflow-Übersicht
/admin/ai/workflows/[id]         → Workflow-Detail
/admin/ai/workflows/new          → Workflow erstellen
/admin/ai/workflows/[id]/history → Ausführungs-Historie
```

### 3.2 Standard-Playbooks

**Ziel:** Wiederverwendbare Lösungs-Templates

**Playbook-Struktur:**
```typescript
// src/lib/ai/playbooks/types.ts
interface Playbook {
  id: string;
  code: string;          // z.B. "SEC-01"
  name: string;
  category: "security" | "performance" | "accessibility" | "refactoring" | "documentation";
  description: string;
  steps: PlaybookStep[];
  estimatedEffort: string;
  tags: string[];
  version: string;
}

interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  checklistItems: string[];
  codeTemplates?: CodeTemplate[];
}
```

**Initial-Playbooks:**
| Code | Name | Kategorie |
|------|------|-----------|
| SEC-01 | SQL Injection Fix | Security |
| SEC-02 | XSS Prevention | Security |
| SEC-03 | Auth Hardening | Security |
| PERF-01 | Database Query Optimization | Performance |
| PERF-02 | React Rendering Optimization | Performance |
| A11Y-01 | WCAG 2.1 Compliance | Accessibility |
| REF-01 | TypeScript Strict Mode Migration | Refactoring |
| DOC-01 | API Documentation Template | Documentation |

**UI:**
```
/admin/ai/playbooks              → Playbook-Bibliothek
/admin/ai/playbooks/[id]         → Playbook-Detail
/admin/ai/playbooks/[id]/apply   → Playbook auf Task anwenden
```

### 3.3 Verbesserte Filter & Suche

**Ziel:** Enterprise-Suche über alle AI-Daten

**Suchbereiche:**
- Tasks (Titel, Beschreibung, Code-Changes)
- Agents (Name, Capabilities)
- Risiken (aus Projekt-Analyzer)
- Workflows (Name, Trigger)
- Audit-Events (Event-Typ, Agent, User)

**Komponenten:**
```tsx
// src/components/admin/GlobalAISearch.tsx
// Zentrale Suchkomponente mit Autocomplete

// src/components/admin/AdvancedFilterPanel.tsx
// Erweiterte Filteroptionen pro Bereich
```

**API:**
```
GET /api/admin/ai/search?q=...&scope=tasks,agents&limit=50
```

### 3.4 Historie & Audit-Viewer

**Ziel:** Vollständige Nachvollziehbarkeit

**Seiten:**
```
/admin/ai/audit                  → Audit-Log-Übersicht
/admin/ai/audit/[eventId]        → Event-Detail
/admin/ai/audit/export           → Export-Funktion
```

**Filter:**
| Filter | Beschreibung |
|--------|--------------|
| Zeitraum | Von/Bis Datum |
| Event-Typ | TASK_*, AGENT_*, DSGVO_* |
| Agent | Auswahl registrierter Agenten |
| User | Admin-User |
| Status | Success/Failed/Blocked |

---

## SPRINT 4: PRODUCTION-HARDENING

**Zeitraum:** KW 2-3 (2 Wochen)  
**Fokus:** Sicherheit, Stabilität, Go-Live-Readiness

### 4.1 RBAC für alle AI-Routen

**Ziel:** Granulare Berechtigungssteuerung

**Neue Permissions:**
```typescript
// src/lib/rbac-system.ts - Erweiterung
const AI_PERMISSIONS = {
  // Basis
  "admin.ai.view": "AI Center anzeigen",
  "admin.ai.manage": "AI Center verwalten",
  
  // Agents
  "admin.ai.agents.view": "Agenten anzeigen",
  "admin.ai.agents.manage": "Agenten verwalten",
  "admin.ai.agents.toggle": "Agenten aktivieren/deaktivieren",
  
  // Tasks
  "admin.ai.tasks.view": "Tasks anzeigen",
  "admin.ai.tasks.create": "Tasks erstellen",
  "admin.ai.tasks.approve": "Tasks freigeben",
  "admin.ai.tasks.delete": "Tasks löschen",
  
  // Workflows
  "admin.ai.workflows.view": "Workflows anzeigen",
  "admin.ai.workflows.manage": "Workflows verwalten",
  "admin.ai.workflows.execute": "Workflows ausführen",
  
  // Playbooks
  "admin.ai.playbooks.view": "Playbooks anzeigen",
  "admin.ai.playbooks.manage": "Playbooks verwalten",
  "admin.ai.playbooks.apply": "Playbooks anwenden",
  
  // Monitoring
  "admin.ai.monitoring.view": "Monitoring anzeigen",
  "admin.ai.monitoring.configure": "Monitoring konfigurieren",
  
  // Audit
  "admin.ai.audit.view": "Audit-Logs anzeigen",
  "admin.ai.audit.export": "Audit-Logs exportieren",
  
  // Kosten
  "admin.ai.costs.view": "Kosten anzeigen",
  "admin.ai.costs.limits.manage": "Kostenlimits verwalten"
};
```

**Rollen-Erweiterung:**
| Rolle | Permissions |
|-------|-------------|
| AI_VIEWER | *.view |
| AI_OPERATOR | *.view, tasks.create, playbooks.apply |
| AI_ADMIN | alle |

### 4.2 Rate Limits & Timeouts

**Ziel:** Schutz vor Überlastung und Kostenexplosion

**Konfiguration:**
```typescript
// src/lib/ai/limits/rate-limiter.ts
const AI_LIMITS = {
  // Pro Minute
  requests_per_minute_per_user: 60,
  requests_per_minute_global: 300,
  
  // Pro Tag
  tasks_per_day_per_user: 100,
  tasks_per_day_global: 1000,
  
  // Kosten
  daily_cost_limit_warning: 5.00,    // EUR - Warnung
  daily_cost_limit_hard: 10.00,      // EUR - Blockierung
  monthly_cost_limit: 100.00,        // EUR - Blockierung
  
  // Timeouts
  task_timeout_ms: 300000,           // 5 Minuten
  agent_timeout_ms: 60000,           // 1 Minute
  api_timeout_ms: 30000              // 30 Sekunden
};
```

**API-Middleware:**
```typescript
// src/middleware/ai-rate-limiter.ts
// Prüft Limits vor jeder AI-API-Route
```

### 4.3 Logging & Audit-Erweiterung

**Ziel:** Compliance-konforme Protokollierung

**Log-Levels:**
| Level | Verwendung |
|-------|------------|
| DEBUG | Entwicklung (nur DEV) |
| INFO | Normale Operationen |
| WARN | Potenzielle Probleme |
| ERROR | Fehler (kein Abbruch) |
| CRITICAL | Systemkritische Fehler |

**Audit-Events (Erweiterung):**
```typescript
const AUDIT_EVENTS = {
  // Task-Lifecycle
  "AI_TASK_CREATED": "Task wurde erstellt",
  "AI_TASK_ASSIGNED": "Task wurde zugewiesen",
  "AI_TASK_STARTED": "Task-Verarbeitung gestartet",
  "AI_TASK_COMPLETED": "Task abgeschlossen",
  "AI_TASK_FAILED": "Task fehlgeschlagen",
  "AI_TASK_CANCELLED": "Task abgebrochen",
  
  // Agent-Events
  "AI_AGENT_REGISTERED": "Agent registriert",
  "AI_AGENT_UNREGISTERED": "Agent entfernt",
  "AI_AGENT_ENABLED": "Agent aktiviert",
  "AI_AGENT_DISABLED": "Agent deaktiviert",
  "AI_AGENT_ERROR": "Agent-Fehler",
  
  // DSGVO-Events
  "AI_DSGVO_BLOCKED": "DSGVO-Blockierung",
  "AI_DSGVO_ALLOWED": "DSGVO-Freigabe",
  "AI_DSGVO_CONSENT_CHECKED": "Consent geprüft",
  
  // Quality-Events
  "AI_QUALITY_GATE_PASSED": "Quality Gate bestanden",
  "AI_QUALITY_GATE_FAILED": "Quality Gate nicht bestanden",
  
  // Kosten-Events
  "AI_COST_WARNING": "Kosten-Warnung",
  "AI_COST_LIMIT_REACHED": "Kostenlimit erreicht",
  
  // Admin-Events
  "AI_CONFIG_CHANGED": "Konfiguration geändert",
  "AI_WORKFLOW_EXECUTED": "Workflow ausgeführt",
  "AI_PLAYBOOK_APPLIED": "Playbook angewendet"
};
```

### 4.4 Test-Suite (Basis)

**Ziel:** Mindestens 60% Test-Coverage für AI-Kernfunktionen

**Test-Bereiche:**
| Bereich | Test-Typ | Coverage-Ziel |
|---------|----------|---------------|
| OrchestratorCore | Unit | 80% |
| AgentRegistry | Unit | 90% |
| QualityGate | Unit | 80% |
| DevTasksService | Unit | 70% |
| Agent-A/B/C | Integration | 60% |
| API-Routes | Integration | 70% |

**Test-Dateien:**
```
src/__tests__/lib/ki-orchestrator/
  - OrchestratorCore.test.ts
  - AgentRegistry.test.ts
  - QualityGate.test.ts
  - QueueManager.test.ts

src/__tests__/lib/dev-orchestrator/
  - agent-a-planner.test.ts
  - agent-b-builder.test.ts
  - agent-c-reviewer.test.ts

src/__tests__/api/admin/ai/
  - agents.test.ts
  - tasks.test.ts
  - monitoring.test.ts
```

### 4.5 Go-Live-Checklist

**Vor Go-Live zu prüfen:**

#### Sicherheit
- [ ] RBAC für alle AI-Routen aktiviert
- [ ] Rate Limits konfiguriert
- [ ] Kostenlimits gesetzt
- [ ] API-Keys sicher gespeichert (.env, nicht in Code)
- [ ] DSGVO Decision Engine produktiv
- [ ] Audit-Logging aktiviert

#### Performance
- [ ] Timeouts konfiguriert
- [ ] Queue-Limits gesetzt
- [ ] Database-Indizes für AI-Tabellen
- [ ] Caching für häufige Abfragen

#### Monitoring
- [ ] Health-Checks aktiv
- [ ] Error-Alerting konfiguriert
- [ ] Kosten-Alerting konfiguriert
- [ ] Dashboard funktionsfähig

#### Backup
- [ ] Backup-Strategie für AI-Daten
- [ ] Recovery-Plan dokumentiert
- [ ] Audit-Log-Archivierung

#### Dokumentation
- [ ] Admin-Handbuch aktuell
- [ ] API-Dokumentation vollständig
- [ ] Troubleshooting-Guide erstellt

---

## ENTERPRISE++ ERWEITERUNGEN (2026+ Ready)

Die folgenden Abschnitte definieren Features für **Enterprise-Reifegrad** auf SAP/IBM/Siemens-Niveau, **EU AI Act Compliance** und **SaaS-Readiness**.

---

## E1: AI MODEL & PROVIDER REGISTRY (EU AI Act)

**Ziel:** Vollständige Nachvollziehbarkeit aller KI-Modelle und Provider

### E1.1 Model Registry

**Seite:** `/admin/ai/models`

**Datenmodell:**
```sql
CREATE TABLE ai_model_registry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,           -- 'openai', 'anthropic', 'local', 'azure'
  model_name VARCHAR(100) NOT NULL,        -- 'gpt-4', 'claude-3', 'llama-3'
  model_version VARCHAR(50),               -- 'gpt-4-turbo-2024-04-09'
  
  -- Freigabestatus
  status ENUM('testing', 'approved', 'deprecated', 'blocked') DEFAULT 'testing',
  approved_by INT,
  approved_at TIMESTAMP NULL,
  
  -- EU AI Act Klassifizierung
  risk_category ENUM('minimal', 'limited', 'high', 'unacceptable') DEFAULT 'limited',
  dsfa_required BOOLEAN DEFAULT FALSE,
  dsfa_document_url VARCHAR(500),
  
  -- Kosten
  cost_per_1k_input DECIMAL(10,6),
  cost_per_1k_output DECIMAL(10,6),
  
  -- Limits
  max_tokens INT,
  rate_limit_rpm INT,
  
  -- Metadaten
  description TEXT,
  capabilities JSON,                       -- ['text', 'code', 'vision', 'audio']
  restrictions JSON,                       -- ['no_pii', 'no_medical', ...]
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_provider_model (provider, model_name),
  INDEX idx_status (status),
  INDEX idx_risk (risk_category)
);
```

**Status-Workflow:**
```
TESTING → (Prüfung) → APPROVED → (Veraltet) → DEPRECATED
                   ↘ (Blockiert) → BLOCKED
```

**UI-Komponenten:**
| Komponente | Beschreibung |
|------------|--------------|
| `ModelRegistryTable` | Übersicht aller Modelle |
| `ModelStatusBadge` | Status-Anzeige mit Farbe |
| `ModelRiskIndicator` | EU AI Act Risiko-Kategorie |
| `ModelApprovalDialog` | Freigabe-Workflow |
| `DSFALinkButton` | Link zur DSFA-Dokumentation |

### E1.2 EU AI Act / DSFA Integration

**Risiko-Kategorien nach EU AI Act:**

| Kategorie | Beschreibung | Erlaubte Agenten |
|-----------|--------------|------------------|
| **Minimal** | Spam-Filter, Empfehlungen | Alle |
| **Limited** | Chatbots, Content-Generierung | Alle mit Kennzeichnung |
| **High** | HR-Entscheidungen, Scoring | Nur mit DSFA + Freigabe |
| **Unacceptable** | Social Scoring, Manipulation | BLOCKIERT |

**DSFA-Integration:**
```typescript
// src/lib/ai/compliance/dsfa-hooks.ts
interface DSFARequirement {
  use_case_id: string;
  risk_category: "minimal" | "limited" | "high" | "unacceptable";
  dsfa_required: boolean;
  dsfa_status: "pending" | "completed" | "approved";
  dsfa_document_url?: string;
  approved_by?: number;
  approved_at?: Date;
}

// Vor jeder High-Risk KI-Aktion prüfen
async function checkDSFACompliance(useCase: string): Promise<{
  allowed: boolean;
  reason?: string;
  dsfa_url?: string;
}>;
```

**Policy-Engine:**
```typescript
// src/lib/ai/compliance/policy-engine.ts
interface AIPolicy {
  id: string;
  name: string;
  description: string;
  
  // Welche Agenten dürfen bei welchem Risiko laufen?
  allowed_agents_by_risk: {
    minimal: string[];      // ['*'] = alle
    limited: string[];      // ['Agent-A', 'Agent-B']
    high: string[];         // ['Agent-A'] = nur Planner
    unacceptable: string[]; // [] = niemand
  };
  
  // Zusätzliche Bedingungen
  require_human_approval_for_high: boolean;
  require_dsfa_for_high: boolean;
  block_pii_processing: boolean;
}
```

**UI:**
```
/admin/ai/compliance                → Compliance-Übersicht
/admin/ai/compliance/models         → Model Registry
/admin/ai/compliance/dsfa           → DSFA-Übersicht
/admin/ai/compliance/policies       → Policy-Verwaltung
/admin/ai/compliance/eu-ai-act      → EU AI Act Status
```

---

## E2: BACKUP & RECOVERY (AI CENTER)

**Ziel:** Enterprise-Grade Datensicherung für alle AI-Konfigurationen

### E2.1 Was wird gesichert?

| Datentyp | Backup-Frequenz | Aufbewahrung |
|----------|-----------------|--------------|
| Agent-Konfigurationen | Täglich | 90 Tage |
| Workflows | Täglich | 90 Tage |
| Playbooks | Täglich | 90 Tage |
| AI-Einstellungen (Limits, Policies) | Täglich | 90 Tage |
| Model Registry | Täglich | 90 Tage |
| Audit-Logs | Täglich | 12 Monate (DSGVO/GoBD) |
| Kosten-Tracking | Täglich | 24 Monate |

### E2.2 Backup-Strategie

```typescript
// src/lib/ai/backup/backup-strategy.ts
interface AIBackupConfig {
  // Tägliches Backup
  daily: {
    time: "02:00",              // Uhrzeit
    retention_days: 7,          // Letzte 7 Tage
    include: ["agents", "workflows", "playbooks", "settings", "models"]
  };
  
  // Wöchentliches Backup
  weekly: {
    day: "sunday",
    retention_weeks: 4,         // Letzte 4 Wochen
    include: ["*"]
  };
  
  // Monatliches Backup
  monthly: {
    day: 1,
    retention_months: 12,       // Letzte 12 Monate
    include: ["*", "audit_logs"]
  };
  
  // Speicherort
  storage: {
    type: "local" | "s3" | "azure_blob";
    path: "/backups/ai-center";
    encryption: true;
  };
}
```

### E2.3 Recovery-Playbook

**AI Center Recovery Playbook:**

| Schritt | Aktion | Dauer |
|---------|--------|-------|
| 1 | Backup-Liste anzeigen | 1 min |
| 2 | Restore-Punkt auswählen | 2 min |
| 3 | Vorschau der Änderungen | 5 min |
| 4 | Bestätigung durch Admin | 1 min |
| 5 | Restore ausführen | 5-15 min |
| 6 | Validierung | 5 min |

**Restore-Punkte:**
- Letzte 7 Tage: Tägliche Snapshots
- Letzte 4 Wochen: Wöchentliche Snapshots
- Letzte 12 Monate: Monatliche Snapshots

**UI:**
```
/admin/ai/backup                    → Backup-Übersicht
/admin/ai/backup/restore            → Restore-Wizard
/admin/ai/backup/history            → Backup-Historie
```

**API:**
```
GET    /api/admin/ai/backup/list          → Backup-Liste
POST   /api/admin/ai/backup/create        → Manuelles Backup
GET    /api/admin/ai/backup/[id]/preview  → Restore-Vorschau
POST   /api/admin/ai/backup/[id]/restore  → Restore ausführen
```

---

## E3: MULTI-MANDANT / MULTI-PROJEKT (SaaS-Ready)

**Ziel:** Vollständige Mandantenfähigkeit für SaaS-Betrieb

### E3.1 Kontext-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     AI CENTER                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ Kontext:        │  │ Kontext:        │  │ Kontext:    │  │
│  │ Lopez IT Welt   │  │ Kunde A         │  │ Kunde B     │  │
│  │ (Intern)        │  │ (Projekt X)     │  │ (Projekt Y) │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────┤  │
│  │ - Eigene Limits │  │ - Eigene Limits │  │ - Eigene    │  │
│  │ - Eigene Agents │  │ - Eigene Agents │  │   Limits    │  │
│  │ - Eigene Flows  │  │ - Eigene Flows  │  │ - Eigene    │  │
│  │ - Eigene Audit  │  │ - Eigene Audit  │  │   Agents    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### E3.2 Datenmodell-Erweiterung

```sql
-- Tenant/Mandant-Tabelle
CREATE TABLE ai_tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,        -- 'lopez_internal', 'kunde_a'
  name VARCHAR(200) NOT NULL,
  type ENUM('internal', 'customer', 'project') NOT NULL,
  
  -- Verknüpfung
  customer_id INT,                         -- FK zu customers
  project_id INT,                          -- FK zu projects
  
  -- Status
  status ENUM('active', 'suspended', 'archived') DEFAULT 'active',
  
  -- Limits (überschreibt globale Limits)
  limits JSON,                             -- { daily_cost: 5.00, tasks_per_day: 50 }
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_type (type),
  INDEX idx_status (status)
);

-- Alle AI-Tabellen bekommen tenant_id
ALTER TABLE ai_agents ADD COLUMN tenant_id INT DEFAULT 1;
ALTER TABLE ai_workflows ADD COLUMN tenant_id INT DEFAULT 1;
ALTER TABLE ai_playbooks ADD COLUMN tenant_id INT DEFAULT 1;
ALTER TABLE ai_audit_events_extended ADD COLUMN tenant_id INT DEFAULT 1;
ALTER TABLE ai_cost_tracking ADD COLUMN tenant_id INT DEFAULT 1;
```

### E3.3 Getrennte Ressourcen pro Mandant

| Ressource | Trennung | Beschreibung |
|-----------|----------|--------------|
| **Limits** | Vollständig | Jeder Mandant hat eigene Kosten-/Task-Limits |
| **Workflows** | Vollständig | Workflows nur innerhalb des Mandanten sichtbar |
| **Playbooks** | Teilweise | Globale + mandantenspezifische Playbooks |
| **Audit-Trails** | Vollständig | Logs nur innerhalb des Mandanten sichtbar |
| **Agents** | Konfigurierbar | Globale Agents oder mandantenspezifisch |
| **Models** | Global | Model Registry ist global (Compliance) |

### E3.4 Kontext-Switching

**UI-Element:** Tenant-Selector in Header

```tsx
// src/components/admin/TenantSelector.tsx
interface TenantSelectorProps {
  currentTenant: Tenant;
  availableTenants: Tenant[];
  onSwitch: (tenantId: number) => void;
}
```

**API-Header:**
```
X-AI-Tenant-ID: 1              // oder
X-AI-Tenant-Code: kunde_a
```

**Deklaration:**
> „Alle AI-Funktionen sind mandantenfähig (Projekt/Kunde), inkl. separater Limits, Logs und Workflows."

---

## E4: TEST & SIMULATION (Dry-Run)

**Ziel:** Sichere Tests ohne Produktivsysteme zu beeinflussen

### E4.1 Dry-Run-Modus

**Konzept:**
- Workflows und Playbooks können im **Simulation-Modus** ausgeführt werden
- Keine echten API-Aufrufe, keine echten Code-Änderungen
- Vollständiges Logging der *hypothetischen* Aktionen
- Ideal für Tests vor Go-Live

**Implementierung:**
```typescript
// src/lib/ai/simulation/dry-run-engine.ts
interface DryRunConfig {
  mode: "simulation" | "production";
  log_all_actions: boolean;
  mock_ai_responses: boolean;
  notify_on_completion: boolean;
}

interface DryRunResult {
  workflow_id: string;
  simulated_at: Date;
  steps_executed: number;
  hypothetical_actions: HypotheticalAction[];
  would_create: { tasks: number; notifications: number; };
  would_cost_estimated: number;
  errors_detected: string[];
}

// Beispiel-Aufruf
const result = await dryRunWorkflow("SEC-Critical-Alert", {
  mode: "simulation",
  trigger_data: mockTriggerData
});
```

### E4.2 Test-Umgebungs-Indikator

**UI-Banner:**
```tsx
// src/components/admin/EnvironmentBanner.tsx
// Zeigt prominent an, wenn NICHT in Produktion

{isDevOrTest && (
  <div className="bg-yellow-500/20 border-yellow-500 ...">
    ⚠️ TESTUMGEBUNG – Diese Umgebung ist nicht produktiv.
  </div>
)}
```

**Umgebungsvariable:**
```env
AI_CENTER_ENV=development    # oder 'test', 'staging', 'production'
```

### E4.3 Simulations-UI

```
/admin/ai/simulation                → Simulations-Übersicht
/admin/ai/simulation/workflow/[id]  → Workflow-Simulation
/admin/ai/simulation/playbook/[id]  → Playbook-Simulation
/admin/ai/simulation/history        → Simulations-Historie
```

**Beispiel-Workflow:**
```
1. Benutzer wählt Workflow "SEC-01"
2. Klickt "Als Simulation ausführen"
3. System zeigt:
   - "Würde 3 Tasks erstellen"
   - "Würde 2 E-Mails senden"
   - "Geschätzte Kosten: 0,15 €"
4. Benutzer kann entscheiden: Abbrechen oder "Echt ausführen"
```

---

## E5: DOKUMENTATION & TRAINING (AEVO/IHK)

**Ziel:** Ausbildungstaugliche Dokumentation für Enterprise-Betrieb

### E5.1 Dokumentations-Struktur

```
docs/
├── AI-CENTER-ENTERPRISE-MASTERPLAN.md     ← Dieses Dokument
├── AI-CENTER-SPRINT-TRACKER.md            ← Sprint-Tracking
│
├── handbuch/
│   ├── ADMIN-GUIDE.md                     ← Für Administratoren
│   ├── OPERATOR-GUIDE.md                  ← Für Operatoren (Tagesgeschäft)
│   ├── VIEWER-GUIDE.md                    ← Für Nur-Lese-Benutzer
│   └── DEVELOPER-GUIDE.md                 ← Für Entwickler (API, Integration)
│
├── training/
│   ├── AEVO-MODUL-KI-GRUNDLAGEN.md        ← Ausbildungsmodul: KI-Basics
│   ├── AEVO-MODUL-AI-CENTER.md            ← Ausbildungsmodul: AI Center
│   ├── AEVO-MODUL-DSGVO-KI.md             ← Ausbildungsmodul: DSGVO & KI
│   └── PRUEFUNGSFRAGEN.md                 ← Übungsfragen für Azubis
│
├── compliance/
│   ├── DSGVO-KI-DOKUMENTATION.md          ← DSGVO-Nachweise
│   ├── EU-AI-ACT-COMPLIANCE.md            ← EU AI Act Status
│   └── DSFA-TEMPLATE.md                   ← DSFA-Vorlage
│
└── troubleshooting/
    ├── COMMON-ERRORS.md                   ← Häufige Fehler + Lösungen
    ├── PERFORMANCE-TUNING.md              ← Performance-Optimierung
    └── EMERGENCY-PROCEDURES.md            ← Notfall-Prozeduren
```

### E5.2 Handbuch-Inhalte

**Admin-Guide:**
- AI Center-Übersicht
- Agent-Verwaltung (registrieren, konfigurieren, deaktivieren)
- Workflow-Management
- Playbook-Verwaltung
- Backup & Recovery
- RBAC & Berechtigungen
- Kostenkontrolle
- Compliance-Einstellungen

**Operator-Guide:**
- Tägliche Aufgaben
- Monitoring-Dashboard lesen
- Tasks erstellen und verwalten
- Workflows auslösen
- Playbooks anwenden
- Fehler erkennen und eskalieren

**Viewer-Guide:**
- Dashboard verstehen
- Reports lesen
- Audit-Logs nachvollziehen

### E5.3 AEVO/IHK-Ausbildungsmodule

**Modul 1: KI-Grundlagen (2h)**
- Was ist KI/ML?
- Supervised vs. Unsupervised Learning
- Large Language Models (LLMs)
- Anwendungsbeispiele im Unternehmen

**Modul 2: AI Center Bedienung (4h)**
- AI Center-Übersicht
- Agents verstehen und verwalten
- Workflows erstellen
- Playbooks anwenden
- Praktische Übungen

**Modul 3: DSGVO & KI (2h)**
- DSGVO-Grundlagen für KI
- Consent-Management
- Risikobewertung
- EU AI Act Grundlagen
- Praxisbeispiele

**Deklaration:**
> „Zu allen AI Center-Funktionen wird ein Trainings-/Handbuch erstellt (Admin-Guide, Operator-Guide, Viewer-Guide). Die Dokumentation ist ausbildungstauglich nach AEVO/IHK-Standards."

---

## E6: ZUSAMMENFASSUNG ENTERPRISE-ERWEITERUNGEN

| Feature | Status | Sprint | Business Value |
|---------|--------|--------|----------------|
| **Model Registry** | GEPLANT | Sprint 3+ | EU AI Act Compliance |
| **DSFA-Integration** | GEPLANT | Sprint 3+ | Rechtssicherheit |
| **Backup & Recovery** | GEPLANT | Sprint 4 | Datensicherheit |
| **Multi-Mandant** | GEPLANT | Sprint 4+ | SaaS-Readiness |
| **Dry-Run-Modus** | GEPLANT | Sprint 3 | Risikominimierung |
| **Dokumentation** | LAUFEND | Alle | Ausbildung, Compliance |

**Enterprise-Reifegrad nach Umsetzung:**

| Kriterium | SAP | IBM | Siemens | Lopez IT Welt |
|-----------|-----|-----|---------|---------------|
| Multi-Mandant | ✅ | ✅ | ✅ | ✅ (geplant) |
| Backup/Recovery | ✅ | ✅ | ✅ | ✅ (geplant) |
| EU AI Act Ready | ✅ | ✅ | ✅ | ✅ (geplant) |
| DSGVO-Konform | ✅ | ✅ | ✅ | ✅ (produktiv) |
| Audit-Trail | ✅ | ✅ | ✅ | ✅ (produktiv) |
| Simulation/Test | ✅ | ✅ | ✅ | ✅ (geplant) |
| Dokumentation | ✅ | ✅ | ✅ | ✅ (in Arbeit) |

---

## UI-DESIGN-SYSTEM (Enterprise++)

### Farbschema (Dark Mode)
```css
:root {
  --bg-primary: #050509;
  --bg-secondary: #111217;
  --bg-tertiary: #272a33;
  --text-primary: #f4f4f4;
  --text-secondary: #b3b3b3;
  --accent-gold: #ffd700;
  --accent-orange: #ff8c00;
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  --border: #272a33;
}
```

### Komponenten-Hierarchie
```
AI Center (Page)
├── Header
│   ├── Logo + Titel
│   ├── Status-Banner
│   └── Actions (Refresh, Settings)
├── Stats-Grid
│   ├── KPI-Cards (4x)
│   └── Quick-Charts (2x)
├── Module-Grid
│   └── Module-Cards (6+)
├── Monitoring-Section
│   ├── System-Health
│   ├── Active-Tasks
│   └── Recent-Errors
└── Quick-Actions
    └── Action-Buttons
```

### Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## DATENBANK-SCHEMA (Gesamt)

### Neue Tabellen (Sprint 2-4)

```sql
-- =====================================================
-- SPRINT 2: Agent Management
-- =====================================================

CREATE TABLE ai_agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type ENUM('media', 'dev', 'doc', 'support', 'business', 'monitoring', 'admin', 'orchestrator') NOT NULL,
  description TEXT,
  dsgvo_scope JSON,
  risk_profile ENUM('low', 'medium', 'high') DEFAULT 'medium',
  enabled BOOLEAN DEFAULT TRUE,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_enabled (enabled)
);

CREATE TABLE ai_agent_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  metric_date DATE NOT NULL,
  tasks_total INT DEFAULT 0,
  tasks_success INT DEFAULT 0,
  tasks_failed INT DEFAULT 0,
  avg_duration_ms INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  cost_estimated DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_agent_date (agent_name, metric_date),
  INDEX idx_date (metric_date)
);

CREATE TABLE ai_agent_capabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  capability VARCHAR(100) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_agent (agent_name)
);

-- =====================================================
-- SPRINT 3: Workflows & Playbooks
-- =====================================================

CREATE TABLE ai_workflows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  trigger_type ENUM('risk_detected', 'task_completed', 'review_failed', 'cost_threshold', 'schedule') NOT NULL,
  trigger_config JSON,
  conditions JSON,
  actions JSON,
  enabled BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_trigger (trigger_type),
  INDEX idx_enabled (enabled)
);

CREATE TABLE ai_workflow_executions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  trigger_event JSON,
  status ENUM('started', 'completed', 'failed', 'skipped') NOT NULL,
  result JSON,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (workflow_id) REFERENCES ai_workflows(id),
  INDEX idx_workflow (workflow_id),
  INDEX idx_status (status)
);

CREATE TABLE ai_playbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category ENUM('security', 'performance', 'accessibility', 'refactoring', 'documentation') NOT NULL,
  description TEXT,
  steps JSON NOT NULL,
  estimated_effort VARCHAR(50),
  tags JSON,
  version VARCHAR(20) DEFAULT '1.0.0',
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

CREATE TABLE ai_playbook_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  playbook_id INT NOT NULL,
  task_id INT,
  applied_by INT,
  status ENUM('applied', 'in_progress', 'completed', 'failed') NOT NULL,
  notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (playbook_id) REFERENCES ai_playbooks(id),
  INDEX idx_playbook (playbook_id),
  INDEX idx_status (status)
);

-- =====================================================
-- SPRINT 4: Rate Limiting & Extended Audit
-- =====================================================

CREATE TABLE ai_rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  limit_type ENUM('requests', 'tasks', 'cost') NOT NULL,
  period ENUM('minute', 'hour', 'day', 'month') NOT NULL,
  current_value INT DEFAULT 0,
  max_value INT NOT NULL,
  reset_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_limit (user_id, limit_type, period),
  INDEX idx_reset (reset_at)
);

CREATE TABLE ai_audit_events_extended (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(50) NOT NULL UNIQUE,
  event_type VARCHAR(50) NOT NULL,
  event_category ENUM('task', 'agent', 'dsgvo', 'quality', 'cost', 'admin', 'workflow') NOT NULL,
  severity ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
  user_id INT,
  agent_name VARCHAR(100),
  task_id INT,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  action VARCHAR(100),
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_event_type (event_type),
  INDEX idx_category (event_category),
  INDEX idx_user (user_id),
  INDEX idx_agent (agent_name),
  INDEX idx_created (created_at),
  INDEX idx_severity (severity)
);

CREATE TABLE ai_cost_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  agent_name VARCHAR(100),
  endpoint VARCHAR(200),
  requests INT DEFAULT 0,
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  cost_input DECIMAL(10,6) DEFAULT 0,
  cost_output DECIMAL(10,6) DEFAULT 0,
  cost_total DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_date_agent_endpoint (date, agent_name, endpoint),
  INDEX idx_date (date)
);
```

---

## API-ÜBERSICHT (Gesamt)

### Sprint 2 APIs
```
# Agents
GET    /api/admin/ai/agents
GET    /api/admin/ai/agents/[name]
POST   /api/admin/ai/agents
PATCH  /api/admin/ai/agents/[name]
DELETE /api/admin/ai/agents/[name]
POST   /api/admin/ai/agents/[name]/toggle
GET    /api/admin/ai/agents/[name]/metrics

# Monitoring
GET    /api/admin/ai/monitoring/health
GET    /api/admin/ai/monitoring/tasks
GET    /api/admin/ai/monitoring/queue
GET    /api/admin/ai/monitoring/costs
GET    /api/admin/ai/monitoring/errors
SSE    /api/admin/ai/monitoring/stream

# Risk-to-Task
POST   /api/admin/ai/risk-to-task
```

### Sprint 3 APIs
```
# Workflows
GET    /api/admin/ai/workflows
GET    /api/admin/ai/workflows/[id]
POST   /api/admin/ai/workflows
PATCH  /api/admin/ai/workflows/[id]
DELETE /api/admin/ai/workflows/[id]
POST   /api/admin/ai/workflows/[id]/execute
GET    /api/admin/ai/workflows/[id]/history

# Playbooks
GET    /api/admin/ai/playbooks
GET    /api/admin/ai/playbooks/[id]
POST   /api/admin/ai/playbooks
PATCH  /api/admin/ai/playbooks/[id]
DELETE /api/admin/ai/playbooks/[id]
POST   /api/admin/ai/playbooks/[id]/apply

# Search
GET    /api/admin/ai/search
```

### Sprint 4 APIs
```
# Audit
GET    /api/admin/ai/audit
GET    /api/admin/ai/audit/[eventId]
GET    /api/admin/ai/audit/export
POST   /api/admin/ai/audit/export

# Rate Limits
GET    /api/admin/ai/limits
GET    /api/admin/ai/limits/status
PATCH  /api/admin/ai/limits
```

---

## TIMELINE-ÜBERSICHT

```
KW 49  ════════════════════════════════════════════════════
       ✅ Sprint 1 abgeschlossen (KI-Orchestrator Basis)
       ✅ Agent-A/B/C produktiv
       ✅ Projekt-Analyzer produktiv
       ✅ UOC produktiv

KW 50  ════════════════════════════════════════════════════
       🔵 Sprint 2 Start
       → Agent-Registry UI
       → Monitoring-Dashboard Basis
       → DB-Migrationen

KW 51  ════════════════════════════════════════════════════
       🔵 Sprint 2 Fortsetzung
       → Projekt-Analyzer Integration
       → Dev-Tasks Erweiterung
       → Kanban-Board

KW 52  ════════════════════════════════════════════════════
       🟠 Sprint 3 Start
       → Workflow-Engine
       → Standard-Workflows
       → Dry-Run/Simulation Basis

KW 1   ════════════════════════════════════════════════════
       🟠 Sprint 3 Fortsetzung
       → Playbook-System
       → Erweiterte Filter/Suche
       → Audit-Viewer
       → Model Registry (Basis)

KW 2   ════════════════════════════════════════════════════
       🔴 Sprint 4 (Hardening) Start
       → RBAC vollständig
       → Rate Limits
       → Logging-Erweiterung
       → Backup & Recovery

KW 3   ════════════════════════════════════════════════════
       🔴 Sprint 4 Abschluss
       → Test-Suite
       → Go-Live-Checklist
       → Multi-Mandant (Basis)
       → Dokumentation (Admin/Operator Guide)

KW 4   ════════════════════════════════════════════════════
       ✅ RELEASE v2.0.0 (AI Center Enterprise++)

KW 5-8 ════════════════════════════════════════════════════
       🟣 Sprint 5 (Enterprise+)
       → EU AI Act / DSFA Integration
       → Multi-Mandant (vollständig)
       → AEVO/IHK Trainingsmaterial
       → Performance-Optimierung

KW 9+  ════════════════════════════════════════════════════
       ✅ RELEASE v2.5.0 (Enterprise++ Complete)
       → Alle E1-E5 Features produktiv
       → SaaS-Ready
       → EU AI Act 2026 Compliant
```

---

## RISIKO-MANAGEMENT

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Zeitüberschreitung | Mittel | Hoch | Sprint-Buffer eingeplant |
| API-Kosten explodieren | Niedrig | Hoch | Kostenlimits ab Sprint 2 |
| DSGVO-Verstoß | Sehr niedrig | Kritisch | Decision Engine bereits produktiv |
| Performance-Probleme | Mittel | Mittel | Timeouts + Queue-Limits |
| Komplexität UI | Mittel | Mittel | Schrittweiser Ausbau |
| EU AI Act Nicht-Compliance | Niedrig | Kritisch | Model Registry + DSFA in Sprint 3+ |
| Datenverlust AI-Config | Niedrig | Hoch | Backup & Recovery in Sprint 4 |
| Multi-Mandant Datenleck | Sehr niedrig | Kritisch | Tenant-Isolation + Tests |
| Ausbildungsmaterial veraltet | Mittel | Niedrig | Versionierung + Review-Zyklen |

---

## MODUL-REIFEGRADMODELL (3-Phasen-System)

Jedes Modul durchläuft drei Phasen bis zur Produktionsfreigabe:

### Phase-Definition

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MODUL-REIFEGRAD-MODELL                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔵 PHASE 1        🟠 PHASE 2         🔴 PHASE 3        ✅ RELEASE  │
│  DEV-Fertig        Stabil             Hardening         Produktiv   │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  • UI vorhanden    • Fehlerhandling   • RBAC aktiv      • Go-Live   │
│  • API funktional  • Fehlermeldungen  • Rate-Limits     • Doku OK   │
│  • Logik korrekt   • Performance OK   • Audit/Logging   • Tests OK  │
│  • Nur DEV-DB      • Keine Blockaden  • Backup-fähig    • Freigabe  │
│  • Keine Zerstör.  • Täglich nutzbar  • Basis-Tests     │           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 1: DEV-Fertig (Funktional)

| Kriterium | Beschreibung |
|-----------|--------------|
| UI-Seite vorhanden | Seite unter `/admin/ai/...` erreichbar |
| API funktioniert | Endpoints antworten korrekt |
| Logik tut, was sie soll | Kernfunktion implementiert |
| Nur DEV-DB | Arbeitet mit `lopez_it_welt_dev` |
| Keine destruktiven Aktionen | Kein DROP, DELETE ohne Schutz |

**Resultat:** Im DEV-System nutzbar.

### Phase 2: Stabil (Intern reif)

| Kriterium | Beschreibung |
|-----------|--------------|
| Fehlerbehandlung | try/catch, graceful errors |
| Fehlermeldungen in UI | Benutzer sieht verständliche Meldungen |
| Performance OK | Keine 10s-Timeouts, keine Blockaden |
| Keine Endlos-Queues | Queue-Limits, Timeouts |
| Täglich nutzbar | Admin kann produktiv arbeiten |

**Resultat:** Du kannst selbst täglich damit arbeiten.

### Phase 3: Production-Hardening (Release-Gate)

| Kriterium | Beschreibung |
|-----------|--------------|
| RBAC/Rollen | Permissions definiert und aktiv |
| Rate-Limits/Timeouts | Abuse-Schutz implementiert |
| Logging & Audit | Wer hat was gestartet? Entscheidungen geloggt |
| Backup-fähig | Daten werden gesichert, Restore möglich |
| Basis-Tests | Mind. Happy-Path + Fehlerfall |
| Dokumentation | Abschnitt im Admin-/Operator-Guide |

**Resultat:** Produktionsreif – kann für Kunden laufen.

---

## PRODUCTION-READY CHECKLISTE (Pro Modul)

Diese Checkliste wird für jedes Modul vor Produktionsfreigabe durchlaufen:

```
┌─────────────────────────────────────────────────────────────────────┐
│           PRODUCTION READY – HAKENLISTE PRO MODUL                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [ ] 1. Funktion getestet (DEV)                                     │
│        → Alle Kernfunktionen funktionieren                          │
│                                                                      │
│  [ ] 2. Keine destruktiven Operationen                              │
│        → Kein DROP, kein ungeschütztes DELETE                       │
│        → Soft-Delete wo möglich                                     │
│                                                                      │
│  [ ] 3. Nur DEV-DB / DEV-KI-Keys                                    │
│        → Keine Produktion während Entwicklung                       │
│        → Umgebungsvariablen korrekt                                 │
│                                                                      │
│  [ ] 4. RBAC umgesetzt (Rollen/Permissions)                         │
│        → Permissions definiert                                      │
│        → Middleware aktiv                                           │
│        → Getestet mit verschiedenen Rollen                          │
│                                                                      │
│  [ ] 5. Rate-Limits & Timeouts definiert                            │
│        → Requests pro Minute begrenzt                               │
│        → Timeouts für alle async Operationen                        │
│        → Queue-Limits gesetzt                                       │
│                                                                      │
│  [ ] 6. Logging & Audit-Einträge vorhanden                          │
│        → Wichtige Aktionen geloggt                                  │
│        → Audit-Events in DB                                         │
│        → Nachvollziehbar wer/was/wann                               │
│                                                                      │
│  [ ] 7. Backup & Restore definiert und einmal getestet              │
│        → Modul-Daten in Backup-Strategie                            │
│        → Restore einmal durchgespielt                               │
│                                                                      │
│  [ ] 8. Mindestens 1-2 Tests (Happy Path + Fehlerfall)              │
│        → Grundfunktion getestet                                     │
│        → Fehlerfall getestet                                        │
│                                                                      │
│  [ ] 9. Kurz-Dokumentation im Handbuch (Admin/Operator)             │
│        → Was macht das Modul?                                       │
│        → Wie bedient man es?                                        │
│        → Was tun bei Fehlern?                                       │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Wenn ALLE ✅ → Modul darf "PRODUKTIONSFÄHIG" markiert werden       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## MODUL-STATUS-ÜBERSICHT

### AI Center Module – Aktueller Reifegrad

| Modul | Phase 1 | Phase 2 | Phase 3 | Status |
|-------|:-------:|:-------:|:-------:|--------|
| **KI-Orchestrator Core** | ✅ | ✅ | 🔄 | Fast produktiv |
| **Agent Registry (Backend)** | ✅ | ✅ | 🔄 | Fast produktiv |
| **DSGVO Decision Engine** | ✅ | ✅ | ✅ | ✅ PRODUKTIV |
| **Quality Gates** | ✅ | ✅ | 🔄 | Fast produktiv |
| **Agent-A (Planner)** | ✅ | ✅ | 🔄 | Fast produktiv |
| **Agent-B (Builder)** | ✅ | ✅ | 🔄 | Fast produktiv |
| **Agent-C (Reviewer)** | ✅ | ✅ | 🔄 | Fast produktiv |
| **Projekt-Analyzer** | ✅ | ✅ | 🔄 | Fast produktiv |
| **UOC Dashboard** | ✅ | ✅ | 🔄 | Fast produktiv |
| **AI Center UI (Basis)** | ✅ | 🔄 | ⬜ | In Arbeit |
| **Dev-Tasks UI** | ✅ | 🔄 | ⬜ | In Arbeit |
| **Agent-Registry UI** | ⬜ | ⬜ | ⬜ | Sprint 2 |
| **Monitoring-Dashboard** | ⬜ | ⬜ | ⬜ | Sprint 2 |
| **Kanban-Board** | ⬜ | ⬜ | ⬜ | Sprint 2 |
| **Workflow-Engine** | ⬜ | ⬜ | ⬜ | Sprint 3 |
| **Playbook-System** | ⬜ | ⬜ | ⬜ | Sprint 3 |
| **Model Registry** | ⬜ | ⬜ | ⬜ | Sprint 3+ |
| **Backup & Recovery** | ⬜ | ⬜ | ⬜ | Sprint 4 |
| **Multi-Mandant** | ⬜ | ⬜ | ⬜ | Sprint 4+ |

**Legende:**
- ✅ = Abgeschlossen
- 🔄 = In Arbeit / Fast fertig
- ⬜ = Noch nicht begonnen

### Detaillierte Modul-Checklisten

#### KI-Orchestrator Core

| # | Kriterium | Status | Notizen |
|---|-----------|--------|---------|
| 1 | Funktion getestet (DEV) | ✅ | Task-Dispatch funktioniert |
| 2 | Keine destruktiven Operationen | ✅ | Nur Read + Insert |
| 3 | Nur DEV-DB / DEV-KI-Keys | ✅ | lopez_it_welt_dev |
| 4 | RBAC umgesetzt | 🔄 | Basis vorhanden, Feintuning Sprint 4 |
| 5 | Rate-Limits & Timeouts | 🔄 | Timeouts da, Rate-Limits Sprint 4 |
| 6 | Logging & Audit | ✅ | OrchestratorAudit aktiv |
| 7 | Backup & Restore | 🔄 | Sprint 4 |
| 8 | Tests | 🔄 | Sprint 4 |
| 9 | Dokumentation | 🔄 | In Arbeit |

**Status:** 🟠 Phase 2+ (6/9 Kriterien erfüllt)

#### Agent-A/B/C (Dev-Orchestrator)

| # | Kriterium | Status | Notizen |
|---|-----------|--------|---------|
| 1 | Funktion getestet (DEV) | ✅ | Plan/Build/Review funktioniert |
| 2 | Keine destruktiven Operationen | ✅ | Nur Vorschläge, kein Auto-Apply |
| 3 | Nur DEV-DB / DEV-KI-Keys | ✅ | lopez_it_welt_dev |
| 4 | RBAC umgesetzt | 🔄 | Sprint 4 |
| 5 | Rate-Limits & Timeouts | 🔄 | Sprint 4 |
| 6 | Logging & Audit | ✅ | Task-Status wird geloggt |
| 7 | Backup & Restore | 🔄 | Sprint 4 |
| 8 | Tests | 🔄 | Sprint 4 |
| 9 | Dokumentation | 🔄 | In Arbeit |

**Status:** 🟠 Phase 2+ (5/9 Kriterien erfüllt)

#### DSGVO Decision Engine

| # | Kriterium | Status | Notizen |
|---|-----------|--------|---------|
| 1 | Funktion getestet (DEV) | ✅ | Consent-Prüfung funktioniert |
| 2 | Keine destruktiven Operationen | ✅ | Nur Read |
| 3 | Nur DEV-DB / DEV-KI-Keys | ✅ | lopez_it_welt_dev |
| 4 | RBAC umgesetzt | ✅ | Integriert |
| 5 | Rate-Limits & Timeouts | ✅ | Kein externes API |
| 6 | Logging & Audit | ✅ | Alle Entscheidungen geloggt |
| 7 | Backup & Restore | ✅ | Consent-Daten gesichert |
| 8 | Tests | ✅ | Basis-Tests vorhanden |
| 9 | Dokumentation | ✅ | DSGVO-Doku vorhanden |

**Status:** ✅ PRODUKTIONSFÄHIG (9/9 Kriterien erfüllt)

---

## ERFOLGSKRITERIEN

### Sprint 2
- [ ] Agent-Registry UI vollständig nutzbar
- [ ] Monitoring-Dashboard zeigt Echtzeitdaten
- [ ] Risk-to-Task-Workflow funktioniert
- [ ] Kanban-Board nutzbar

### Sprint 3
- [ ] Mind. 5 Workflows definiert
- [ ] Mind. 8 Playbooks verfügbar
- [ ] Globale Suche funktioniert
- [ ] Audit-Viewer vollständig
- [ ] Dry-Run-Modus für Workflows
- [ ] Model Registry (Basis)

### Sprint 4
- [ ] RBAC zu 100% implementiert
- [ ] Rate Limits aktiv
- [ ] Test-Coverage > 60%
- [ ] Go-Live-Checklist zu 100% grün
- [ ] Backup & Recovery funktionsfähig
- [ ] Multi-Mandant (Basis) aktivierbar
- [ ] Admin-Guide fertiggestellt
- [ ] Operator-Guide fertiggestellt

### Sprint 5 (Enterprise+)
- [ ] EU AI Act Risiko-Kategorisierung aktiv
- [ ] DSFA-Integration für High-Risk Use Cases
- [ ] Multi-Mandant vollständig produktiv
- [ ] Tenant-Switching in UI
- [ ] AEVO-Trainingsmaterial erstellt
- [ ] Viewer-Guide fertiggestellt

### Enterprise++ Complete (v2.5.0)
- [ ] Alle E1-E5 Features produktiv
- [ ] SaaS-Ready (Multi-Mandant + Billing-ready)
- [ ] EU AI Act 2026 Compliant
- [ ] Vollständige Dokumentation
- [ ] Ausbildungstauglich (AEVO/IHK)

---

## FREIGABE

| Rolle | Name | Datum | Status |
|-------|------|-------|--------|
| Projekt-Owner | Ramiro Lopez | 2024-12-05 | ✅ FREIGEGEBEN |
| Technische Leitung | - | - | AUSSTEHEND |
| DSGVO-Beauftragter | - | - | AUSSTEHEND |
| EU AI Act Compliance | - | - | AUSSTEHEND (2026) |

---

## ÄNDERUNGSHISTORIE

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0.0 | 2024-12-05 | Initiale Version | Ramiro Lopez |
| 1.1.0 | 2024-12-05 | Enterprise-Erweiterungen (E1-E5): Model Registry, EU AI Act, Backup, Multi-Mandant, Dry-Run, Dokumentation | Ramiro Lopez |

---

**Dokument-Ende**

*Lopez IT Welt | Enterprise++ | AI Center Masterplan v1.1.0*  
*Compliance: DSGVO, GoBD, EU AI Act (2026+)*  
*SaaS-Ready | Multi-Mandant | Ausbildungstauglich (AEVO/IHK)*

