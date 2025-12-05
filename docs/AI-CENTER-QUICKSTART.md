# AI Center - Quick Start Guide

> Schnelleinstieg in das Enterprise++ AI Center

---

## 1. Initialisierung (einmalig)

Führe diese API-Calls aus, um alle Tabellen zu erstellen:

```bash
# Agent-Tabellen
curl http://localhost:3000/api/admin/ai/init-tables

# Workflow & Playbook Tabellen
curl http://localhost:3000/api/admin/ai/init-workflows

# Security & Settings Tabellen
curl http://localhost:3000/api/admin/ai/init-hardening

# Compliance & Multi-Tenant Tabellen
curl http://localhost:3000/api/admin/ai/init-compliance
```

---

## 2. System-Status prüfen

```bash
curl http://localhost:3000/api/admin/ai/status
```

Erwartetes Ergebnis: `"status": "operational", "production_ready": true`

---

## 3. Navigation

Das AI Center ist erreichbar unter:

| Modul | URL |
|-------|-----|
| Übersicht | `/admin/ai` |
| Agenten | `/admin/ai/agents` |
| Monitoring | `/admin/ai/monitoring` |
| Dev-Tasks | `/admin/ai/dev-tasks` |
| Kanban | `/admin/ai/kanban` |
| Projekt-Analyzer | `/admin/ai/project-analyzer` |
| Playbooks | `/admin/ai/playbooks` |
| Kosten | `/admin/ai/costs` |
| Einstellungen | `/admin/ai/settings` |
| Compliance | `/admin/ai/compliance` |

---

## 4. Erste Schritte

### a) Agenten prüfen

1. Öffne `/admin/ai/agents`
2. Alle 6 Standard-Agenten sollten aktiv sein
3. Bei Bedarf Agenten aktivieren/deaktivieren

### b) Projekt analysieren

1. Öffne `/admin/ai/project-analyzer`
2. Wähle ein Projekt-Preset (z.B. "Core")
3. Klicke "Analyse starten"
4. Risiken können direkt als Dev-Tasks angelegt werden

### c) Kosten-Limits setzen

1. Öffne `/admin/ai/settings`
2. Gehe zu "Kosten-Limits"
3. Setze Tages- und Monatslimit

---

## 5. Demo-Modus

Standardmäßig ist der Demo-Modus aktiv. Das bedeutet:

- Keine echten KI-API-Calls
- Simulierte Antworten
- Keine Kosten

Zum Deaktivieren:
1. Öffne `/admin/ai/settings`
2. "Demo-Modus" auf OFF setzen

---

## 6. Wichtige APIs

```bash
# Agenten auflisten
curl http://localhost:3000/api/admin/ai/agents

# Playbooks auflisten
curl http://localhost:3000/api/admin/ai/playbooks

# Kosten der letzten 30 Tage
curl http://localhost:3000/api/admin/ai/costs?days=30

# AI-Modelle (Compliance)
curl http://localhost:3000/api/admin/ai/models

# Alle Settings
curl http://localhost:3000/api/admin/ai/settings
```

---

## 7. Troubleshooting

| Problem | Lösung |
|---------|--------|
| "Nicht autorisiert" | Admin-Login erforderlich |
| Keine Agenten sichtbar | `/api/admin/ai/init-tables` ausführen |
| Keine Playbooks | `/api/admin/ai/init-workflows` ausführen |
| Settings leer | `/api/admin/ai/init-hardening` ausführen |

---

## 8. Support

Bei Fragen zur Dokumentation:
- `docs/AI-CENTER-HANDBUCH.md` - Vollständige Dokumentation
- `docs/AI-CENTER-ENTERPRISE-MASTERPLAN.md` - Architektur & Roadmap

---

*Lopez IT Welt - Enterprise++ AI Center*

