# AI Center Handbuch

> Enterprise++ AI Center - Vollständige Dokumentation  
> Version: 1.0.0  
> Stand: Dezember 2025

---

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Architektur](#architektur)
3. [Module](#module)
4. [API-Referenz](#api-referenz)
5. [Datenbank-Schema](#datenbank-schema)
6. [Konfiguration](#konfiguration)
7. [Sicherheit & Compliance](#sicherheit--compliance)
8. [Betrieb & Wartung](#betrieb--wartung)

---

## Übersicht

Das AI Center ist das zentrale Steuerungssystem für alle KI-Funktionen in Lopez IT Welt. Es bietet:

- **Agent-Orchestrierung**: Verwaltung und Steuerung von KI-Agenten
- **Workflow-Automatisierung**: Trigger-basierte Automatisierung
- **Playbook-System**: Wiederverwendbare Lösungstemplates
- **Kosten-Kontrolle**: Budget-Management und Tracking
- **Compliance**: EU AI Act und DSGVO Konformität
- **Multi-Tenant**: Mandantenfähige Architektur

### Status

| Kategorie | Status |
|-----------|--------|
| Production-Ready | ✅ Ja |
| EU AI Act | ✅ Konform |
| DSGVO | ✅ Konform |
| Multi-Tenant | ✅ Unterstützt |

---

## Architektur

### Komponenten-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                        AI CENTER                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Agents    │  │  Workflows  │  │  Playbooks  │          │
│  │  Registry   │  │   Engine    │  │   System    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Monitoring │  │    Costs    │  │  Compliance │          │
│  │  Dashboard  │  │   Tracker   │  │   Engine    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Security & Middleware                   │    │
│  │   RBAC │ Rate-Limits │ Audit │ DSGVO-Firewall       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Tech-Stack

| Komponente | Technologie |
|------------|-------------|
| Framework | Next.js 15 |
| Sprache | TypeScript |
| Datenbank | MySQL/MariaDB |
| Styling | Tailwind CSS |
| Icons | React Icons |

---

## Module

### 1. Agent Registry

**Pfad:** `/admin/ai/agents`

Verwaltet alle KI-Agenten im System.

#### Registrierte Agenten

| Agent | Typ | Funktion |
|-------|-----|----------|
| Agent-A | dev | Planungs-Agent (Tasks analysieren, Schritte planen) |
| Agent-B | dev | Builder-Agent (Code generieren) |
| Agent-C | dev | Review-Agent (Code prüfen, Feedback) |
| Media-AI | media | Medien-Analyse (OCR, DSGVO-Check) |
| Orchestrator | orchestrator | Zentrale KI-Steuerung |
| Project-Analyzer | monitoring | Code- und Architektur-Analyse |

#### Funktionen

- Agenten aktivieren/deaktivieren
- DSGVO-Scope konfigurieren
- Risk-Profile setzen
- Metriken einsehen

---

### 2. Monitoring Dashboard

**Pfad:** `/admin/ai/monitoring`

Echtzeit-Überwachung aller AI-Komponenten.

#### Health-Checks

| Komponente | Prüfung |
|------------|---------|
| Database | Verbindung, Latenz |
| Agent Registry | Aktive Agenten |
| Task Queue | Warteschlange |
| DSGVO Engine | KI-Firewall |
| AI Provider | API-Verfügbarkeit |

#### Features

- Auto-Refresh (30 Sekunden)
- KPI-Cards (Agenten, Tasks, Kosten, Performance)
- System-Status (Operational/Degraded/Down)
- Schnellzugriff-Links

---

### 3. Dev-Tasks & Kanban

**Pfad:** `/admin/ai/dev-tasks` | `/admin/ai/kanban`

Entwicklungsaufträge mit Agent-Integration.

#### Workflow

```
OPEN → PLANNING → PLANNED → CODING → REVIEW → DONE
       (Agent-A)            (Agent-B)  (Agent-C)
```

#### Funktionen

- Task erstellen (manuell oder via Risk-to-Task)
- Kanban-Board Ansicht
- Status-Tracking
- Agent-Integration

---

### 4. Projekt-Analyzer

**Pfad:** `/admin/ai/project-analyzer`

Enterprise++ Code-Analyse.

#### Analyse-Bereiche

- Architektur-Score
- Sicherheits-Score
- Code-Qualitäts-Score
- Barrierefreiheit-Score
- Performance-Score
- Dokumentations-Score

#### Risk-to-Task

Erkannte Risiken können direkt als Dev-Task angelegt werden.

---

### 5. Workflows

**Pfad:** `/admin/ai/workflows` (API)

Automatisierte Trigger-basierte Aktionen.

#### Trigger-Typen

| Trigger | Beschreibung |
|---------|--------------|
| risk_detected | Risiko erkannt |
| risk_critical | Kritisches Risiko |
| task_created | Task erstellt |
| task_completed | Task abgeschlossen |
| cost_threshold | Kostengrenze erreicht |
| scheduled | Zeitgesteuert |

#### Action-Typen

| Action | Beschreibung |
|--------|--------------|
| create_task | Dev-Task erstellen |
| send_notification | Benachrichtigung |
| run_playbook | Playbook ausführen |
| start_agent | Agent starten |
| log_event | Event loggen |
| webhook | Webhook aufrufen |

---

### 6. Playbooks

**Pfad:** `/admin/ai/playbooks`

Wiederverwendbare Lösungstemplates.

#### Standard-Playbooks

| Code | Name | Kategorie |
|------|------|-----------|
| SEC-01 | XSS-Schwachstelle beheben | Security |
| SEC-02 | SQL-Injection beheben | Security |
| SEC-03 | Authentifizierung härten | Security |
| A11Y-01 | Formular-Zugänglichkeit | Accessibility |
| A11Y-02 | Tastatur-Navigation | Accessibility |
| PERF-01 | Frontend-Performance | Performance |
| QUAL-01 | TypeScript-Strict | Quality |
| INC-01 | Security Incident Response | Incident |

#### Dry-Run Modus

Playbooks können im Simulations-Modus getestet werden.

---

### 7. Kosten-Dashboard

**Pfad:** `/admin/ai/costs`

Budget-Management und Tracking.

#### Features

- Tages-/Monats-Übersicht
- Limit-Anzeige mit Progress-Bar
- Chart: Kosten pro Tag
- Breakdown nach Provider
- Top-Endpoints

---

### 8. Einstellungen

**Pfad:** `/admin/ai/settings`

AI Center Konfiguration.

#### Kategorien

| Kategorie | Einstellungen |
|-----------|---------------|
| Allgemein | ai_center_enabled, demo_mode |
| Provider | default_provider, openai_enabled, etc. |
| Kosten | cost_limit_daily, cost_limit_monthly |
| Rate-Limits | rate_limit_per_minute, etc. |
| Timeouts | timeout_quick_ms, etc. |
| Agenten | agent_a_enabled, auto_planning |
| DSGVO | dsgvo_strict_mode, require_consent |

---

### 9. Compliance

**Pfad:** `/admin/ai/compliance`

EU AI Act und DSGVO Konformität.

#### AI Model Registry

Alle verwendeten AI-Modelle mit:

- EU AI Act Risiko-Kategorie
- DSGVO-Konformität
- DSFA-Status (Datenschutz-Folgenabschätzung)
- Erlaubte/Verbotene Use-Cases
- Human Oversight Anforderungen

#### Risiko-Kategorien (EU AI Act)

| Kategorie | Beschreibung |
|-----------|--------------|
| Minimal | Freiwillige Codes of Conduct |
| Limited | Transparenzpflichten |
| High | Strenge Anforderungen |
| Unacceptable | Verboten |

---

## API-Referenz

### Basis-URL

```
/api/admin/ai/
```

### Endpunkte

#### Agenten

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /agents | Alle Agenten listen |
| POST | /agents | Agent erstellen |
| GET | /agents/[name] | Agent-Details |
| PATCH | /agents/[name] | Agent aktualisieren |
| POST | /agents/[name]/toggle | Agent aktivieren/deaktivieren |

#### Monitoring

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /monitoring | Dashboard-Daten |
| GET | /monitoring/health | Health-Check |

#### Workflows

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /workflows | Alle Workflows |
| POST | /workflows | Workflow erstellen |

#### Playbooks

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /playbooks | Alle Playbooks |
| POST | /playbooks | Playbook erstellen |
| GET | /playbooks/[code] | Playbook-Details |
| POST | /playbooks/[code]/execute | Playbook ausführen |

#### Kosten

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /costs?days=30 | Kosten-Übersicht |

#### Settings

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /settings | Alle Einstellungen |
| PATCH | /settings | Einstellungen aktualisieren |
| DELETE | /settings | Auf Defaults zurücksetzen |

#### Compliance

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /models | Alle AI-Modelle |
| POST | /models | Modell registrieren |

#### System

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /status | System-Status |

### Initialisierungs-Endpunkte

| Pfad | Beschreibung |
|------|--------------|
| /init-tables | Agent-Tabellen |
| /init-workflows | Workflow-Tabellen |
| /init-hardening | Security-Tabellen |
| /init-compliance | Compliance-Tabellen |

---

## Datenbank-Schema

### Tabellen (16 AI-spezifisch)

#### Agenten

```sql
ai_agents              -- Agent-Definitionen
ai_agent_metrics       -- Agent-Metriken
ai_agent_capabilities  -- Agent-Fähigkeiten
```

#### Workflows & Playbooks

```sql
ai_workflows           -- Workflow-Definitionen
ai_workflow_executions -- Workflow-Ausführungen
ai_playbooks          -- Playbook-Templates
ai_playbook_executions -- Playbook-Ausführungen
```

#### Konfiguration & Tracking

```sql
ai_settings           -- Einstellungen
ai_cost_tracking      -- Kosten-Tracking
ai_rate_limits        -- Rate-Limits
ai_security_events    -- Security-Events
```

#### Multi-Tenant

```sql
ai_tenants           -- Mandanten
ai_tenant_projects   -- Projekte pro Mandant
```

#### Compliance

```sql
ai_model_registry    -- AI-Modell-Registry
ai_dsfa_assessments  -- DSFA-Bewertungen
```

---

## Konfiguration

### Umgebungsvariablen

```env
# AI Provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Datenbank
DATABASE_URL=mysql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Default-Einstellungen

| Einstellung | Default | Beschreibung |
|-------------|---------|--------------|
| demo_mode | true | Keine echten API-Calls |
| cost_limit_daily | 10€ | Tageslimit |
| cost_limit_monthly | 100€ | Monatslimit |
| rate_limit_per_minute | 30 | Max. Requests/Min |
| dsgvo_strict_mode | true | Strenge DSGVO-Prüfung |

---

## Sicherheit & Compliance

### RBAC (Role-Based Access Control)

#### Rollen

| Rolle | Berechtigungen |
|-------|----------------|
| super_admin | Vollzugriff (ai.admin) |
| admin | Alle AI-Funktionen |
| operator | Tasks, Playbooks, Monitoring |
| viewer | Nur Lesen |

#### Permissions

```typescript
ai.view              // AI Center anzeigen
ai.agents.view       // Agenten anzeigen
ai.agents.manage     // Agenten verwalten
ai.tasks.view        // Tasks anzeigen
ai.tasks.manage      // Tasks verwalten
ai.playbooks.view    // Playbooks anzeigen
ai.playbooks.execute // Playbooks ausführen
ai.workflows.view    // Workflows anzeigen
ai.workflows.manage  // Workflows verwalten
ai.monitoring.view   // Monitoring anzeigen
ai.settings.manage   // Einstellungen verwalten
ai.admin            // Vollzugriff
```

### Rate-Limiting

| Rolle | Requests/Min | Requests/Stunde | Requests/Tag |
|-------|--------------|-----------------|--------------|
| admin | 100 | 1000 | 10000 |
| operator | 30 | 300 | 3000 |
| viewer | 10 | 100 | 1000 |

### Audit-Logging

Alle API-Zugriffe werden protokolliert:

- Benutzer-ID
- Endpoint
- Methode
- Status-Code
- Dauer
- IP-Adresse
- Timestamp

### DSGVO

- Strict-Mode für KI-Verarbeitung
- Consent-Prüfung vor KI-Analyse
- Löschfristen (audit_retention_days)
- Datenminimierung

### EU AI Act

- Risiko-Klassifizierung aller Modelle
- DSFA bei Bedarf
- Human Oversight bei high-risk
- Transparenzpflichten

---

## Betrieb & Wartung

### Initialisierung

```bash
# 1. Datenbank-Tabellen erstellen
curl http://localhost:3000/api/admin/ai/init-tables
curl http://localhost:3000/api/admin/ai/init-workflows
curl http://localhost:3000/api/admin/ai/init-hardening
curl http://localhost:3000/api/admin/ai/init-compliance

# 2. System-Status prüfen
curl http://localhost:3000/api/admin/ai/status
```

### Health-Checks

```bash
# Alle Komponenten prüfen
curl http://localhost:3000/api/admin/ai/monitoring/health
```

### Backup-Strategie

Zu sichern:

- Alle `ai_*` Tabellen
- Agent-Konfigurationen
- Workflow-Definitionen
- Playbook-Templates
- Settings
- Audit-Logs (mind. 90 Tage)

### Monitoring

- Auto-Refresh Dashboard: `/admin/ai/monitoring`
- System-Status API: `/api/admin/ai/status`
- Health-Check: `/api/admin/ai/monitoring/health`

### Troubleshooting

| Problem | Lösung |
|---------|--------|
| Agent nicht verfügbar | Agent-Registry prüfen, Toggle aktivieren |
| Rate-Limit erreicht | Warten oder Limit erhöhen |
| Kosten-Limit erreicht | Limit erhöhen in Settings |
| DSGVO-Blockierung | Consent prüfen, DSGVO-Scope anpassen |

---

## Changelog

### Version 1.0.0 (Dezember 2025)

- ✅ Agent-Registry mit 6 Standard-Agenten
- ✅ Monitoring-Dashboard mit Health-Checks
- ✅ Dev-Tasks mit Kanban-Board
- ✅ Risk-to-Task Integration
- ✅ Workflow-Engine mit 7 Action-Types
- ✅ Playbook-System mit 8 Templates
- ✅ Kosten-Dashboard mit Charts
- ✅ Settings-UI mit 29 Einstellungen
- ✅ Multi-Tenant Architektur
- ✅ EU AI Act Compliance
- ✅ DSGVO Integration
- ✅ RBAC & Rate-Limiting
- ✅ Audit-Logging

---

*Lopez IT Welt - Enterprise++ AI Center*







