# Shadow-Mode Workflow

## Enterprise++ 4-Layer Development Model

---

| Dokument-ID | LIW-SHADOW-001 |
|-------------|----------------|
| Version | 1.0.0 |
| Status | 🔵 **AKTIV** |
| Erstellt | 05.12.2025 |

---

## 1. Das 4-Layer Modell

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE++ WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: ORCHESTRATOR (AI Center)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • Task erstellen                                        │    │
│  │  • Priorität setzen                                      │    │
│  │  • Projekt zuweisen                                      │    │
│  │  • Workflow starten                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Layer 2: PLANNER (Agent-A)                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • Task analysieren                                      │    │
│  │  • Schritte planen                                       │    │
│  │  • Abhängigkeiten erkennen                               │    │
│  │  • Zeitschätzung                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Layer 3: BUILDER (Agent-B) ⚠️ SHADOW MODE                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • Code-Vorschlag generieren                             │    │
│  │  • KEINE Dateien ändern                                  │    │
│  │  • Vorschlag in DB speichern                             │    │
│  │  • Zur Prüfung markieren                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Layer 4: REVIEWER (Agent-C + Cursor)                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Agent-C:                                                │    │
│  │  • Qualitätsprüfung                                      │    │
│  │  • Best Practices                                        │    │
│  │  • Code-Stil                                             │    │
│  │                                                          │    │
│  │  Cursor (Senior Review):                                 │    │
│  │  • Sicherheits-Analyse                                   │    │
│  │  • SQL-Injection Check                                   │    │
│  │  • TypeScript-Fehler                                     │    │
│  │  • Architektur-Prüfung                                   │    │
│  │  • Performance-Analyse                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  Layer 5: MENSCH (Finale Freigabe)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ✅ ÜBERNEHMEN                                           │    │
│  │  ❌ ABLEHNEN                                             │    │
│  │  ✏️  ANPASSEN                                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Shadow-Mode Regeln

### ⚠️ KRITISCH: Was Agent-B NICHT tun darf

```
❌ Dateien direkt ändern
❌ Dateien erstellen
❌ Dateien löschen
❌ Git-Commits
❌ Datenbank-Änderungen
❌ Deployments
```

### ✅ Was Agent-B tun DARF

```
✅ Code-Vorschläge generieren
✅ Vorschläge in DB speichern
✅ Dokumentation erstellen
✅ Analysen durchführen
✅ Empfehlungen geben
```

---

## 3. Workflow-Ablauf

### Schritt 1: Task im AI Center erstellen

```
UI: /admin/ai/dev-tasks → "Neuer Task"

Eingabe:
- Titel: "[PHASE-1.1] Registrierung implementieren"
- Beschreibung: Detaillierte Anforderungen
- Typ: feature
- Priorität: high
- Projekt: PHASE-1-PORTAL
```

### Schritt 2: Agent-A plant

```
Automatisch oder manuell:
→ Task analysieren
→ Schritte definieren
→ Abhängigkeiten erkennen

Ergebnis: Task hat jetzt "steps" mit konkreten Aufgaben
```

### Schritt 3: Agent-B generiert Code (Shadow Mode)

```
Agent-B erhält:
- Task-Beschreibung
- Geplante Schritte
- Projekt-Kontext

Agent-B liefert:
- Code-Vorschlag (als Text/JSON)
- KEINE Dateiänderungen
- Vorschlag wird in DB gespeichert
```

### Schritt 4: Review-Phase

```
Agent-C prüft:
- Code-Qualität
- Best Practices
- Vollständigkeit

Cursor prüft:
- Sicherheit
- TypeScript
- SQL-Risiken
- Architektur
```

### Schritt 5: Mensch entscheidet

```
Options:
✅ "Übernehmen" → Code wird implementiert
❌ "Ablehnen" → Zurück zu Agent-B
✏️ "Anpassen" → Manuelle Änderungen
```

---

## 4. Datenbank-Schema für Shadow-Mode

```sql
-- Code-Vorschläge von Agent-B
CREATE TABLE IF NOT EXISTS lopez_code_proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  step_id INT,
  
  -- Vorschlag
  file_path VARCHAR(500) NOT NULL,
  action ENUM('create', 'modify', 'delete') NOT NULL,
  original_content LONGTEXT,
  proposed_content LONGTEXT NOT NULL,
  
  -- Metadaten
  agent_version VARCHAR(20),
  model_used VARCHAR(50),
  tokens_used INT,
  
  -- Review-Status
  status ENUM('pending', 'approved', 'rejected', 'modified') DEFAULT 'pending',
  
  -- Agent-C Review
  agent_c_review JSON,
  agent_c_score INT,
  
  -- Cursor Review
  cursor_review JSON,
  cursor_approved BOOLEAN,
  
  -- Finale Entscheidung
  human_decision ENUM('pending', 'approved', 'rejected', 'modified'),
  human_notes TEXT,
  decided_by VARCHAR(100),
  decided_at TIMESTAMP NULL,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_task (task_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. Cursor Senior-Review Prompt

Wenn ein Code-Vorschlag von Agent-B kommt, verwende diesen Prompt:

```markdown
## 🔍 CURSOR SENIOR CODE REVIEW

Ich bin der Senior-Reviewer im Enterprise++ Shadow-Mode Workflow.

### Zu prüfender Code-Vorschlag:

**Datei:** {file_path}
**Aktion:** {action}
**Task:** {task_title}

```{language}
{proposed_content}
```

### Meine Review-Checkliste:

#### 1. Sicherheit
- [ ] SQL-Injection möglich?
- [ ] XSS möglich?
- [ ] CSRF-Schutz vorhanden?
- [ ] Sensitive Daten exponiert?
- [ ] Input-Validierung?

#### 2. TypeScript
- [ ] Typen korrekt?
- [ ] any vermieden?
- [ ] Interfaces sauber?
- [ ] Null-Checks?

#### 3. Architektur
- [ ] Passt zur Projektstruktur?
- [ ] DRY-Prinzip?
- [ ] Single Responsibility?
- [ ] Abhängigkeiten korrekt?

#### 4. Performance
- [ ] N+1 Queries?
- [ ] Unnötige Re-Renders?
- [ ] Memory Leaks?
- [ ] Große Bundles?

#### 5. Best Practices
- [ ] Error Handling?
- [ ] Logging?
- [ ] Dokumentation?
- [ ] Tests nötig?

### Mein Urteil:

**Status:** ✅ APPROVED / ⚠️ NEEDS CHANGES / ❌ REJECTED

**Begründung:**
{reasoning}

**Änderungsvorschläge:**
{suggestions}
```

---

## 6. Integration mit AI Center

### API-Endpunkt für Shadow-Mode

```
POST /api/admin/ai/shadow-mode/propose
{
  "task_id": 123,
  "step_id": 1,
  "file_path": "src/lib/customer/auth-service.ts",
  "action": "create",
  "proposed_content": "..."
}

Response:
{
  "proposal_id": 456,
  "status": "pending",
  "next_step": "cursor_review"
}
```

### Workflow-Trigger

```javascript
// Wenn Task Status = "planned" → Agent-B startet
workflow: {
  trigger: "task_status_changed",
  condition: { new_status: "planned" },
  action: "start_agent_b_shadow"
}
```

---

## 7. UI für Shadow-Mode

### Code-Review Seite

```
/admin/ai/code-reviews

┌─────────────────────────────────────────────────┐
│ 📋 Pending Code Reviews (3)                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ [PHASE-1.1] auth-service.ts                 │ │
│ │ Action: CREATE                              │ │
│ │ Agent-C: ✅ 85/100                          │ │
│ │ Cursor: ⏳ Pending                          │ │
│ │ [Review] [Approve] [Reject]                 │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ [PHASE-1.1] register-route.ts               │ │
│ │ Action: CREATE                              │ │
│ │ Agent-C: ✅ 92/100                          │ │
│ │ Cursor: ✅ Approved                         │ │
│ │ [Review] [Approve] [Reject]                 │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 8. Vorteile

| Aspekt | Vorteil |
|--------|---------|
| **Sicherheit** | Nichts wird automatisch geändert |
| **Qualität** | Doppeltes Review (Agent-C + Cursor) |
| **Kontrolle** | Mensch hat finale Entscheidung |
| **Transparenz** | Alle Vorschläge dokumentiert |
| **Rollback** | Original-Content gespeichert |
| **Audit** | Vollständiger Trail |

---

## 9. Workflow-Beispiel

### Task: "Registrierung implementieren"

```
1. AI Center: Task erstellt
   → Status: OPEN

2. Agent-A: Plant 5 Schritte
   → Status: PLANNED
   → Steps: 
     1. auth-service.ts erstellen
     2. register-route.ts erstellen
     3. register-page.tsx erstellen
     4. E-Mail-Verifizierung
     5. DSGVO-Consent

3. Agent-B: Generiert Code (Shadow Mode)
   → Vorschlag 1: auth-service.ts (CREATE)
   → Vorschlag 2: register-route.ts (CREATE)
   → Status: CODING

4. Agent-C: Prüft Vorschläge
   → Vorschlag 1: Score 88/100 ✅
   → Vorschlag 2: Score 75/100 ⚠️
   → Status: REVIEW

5. Cursor: Senior Review
   → Vorschlag 1: APPROVED ✅
   → Vorschlag 2: SQL-Risk gefunden ❌

6. Mensch: Entscheidet
   → Vorschlag 1: ÜBERNEHMEN ✅
   → Vorschlag 2: ZURÜCK AN AGENT-B

7. Code wird implementiert
   → Status: DONE
```

---

## 10. Aktivierung

### Shadow-Mode aktivieren

```javascript
// Settings: /api/admin/ai/settings
{
  "shadow_mode_enabled": true,
  "auto_apply_disabled": true,  // KRITISCH!
  "require_cursor_review": true,
  "require_human_approval": true
}
```

---

**Ende Shadow-Mode Workflow Dokumentation**

*Lopez IT Welt – Enterprise++ Development Model*

