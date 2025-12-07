# 🛡️ Enterprise++ Audit-Modus

> **Stand:** 2025-12-06  
> **Status:** AKTIV  
> **Niveau:** SAP / IBM / Siemens Enterprise-Standard

---

## 📋 Übersicht

Der **Audit-Modus** ist ein Enterprise++-Feature, das sicherstellt, dass alle Tasks nur als "Fertig" gelten, wenn sie das **Quality Gate** bestehen.

```
┌─────────────────────────────────────────────────────────────────┐
│               ENTERPRISE++ AUDIT-MODUS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ AUDIT-MODUS = TRUE (Default)                                │
│  ├─ Quality Gate: 70/100 Punkte erforderlich                    │
│  ├─ Score < 70 → Task wird auf "Offen" gesetzt                  │
│  ├─ Score ≥ 70 → Task bleibt "Fertig"                           │
│  └─ Alle Prüfungen werden in Audit-Logs gespeichert             │
│                                                                 │
│  ⚠️ AUDIT-MODUS = FALSE                                         │
│  └─ Keine automatische Qualitätsprüfung                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Quality Gate Berechnung

### Punkteverteilung

| Check | Punkte | Beschreibung |
|-------|--------|--------------|
| **Dateien existieren** | 40 | Alle im Plan genannten Dateien sind vorhanden |
| **Code-Changes vorhanden** | 30 | Es wurden Codeänderungen registriert |
| **Keine Fehler** | 30 | Keine TODO/Not-Implemented-Marker gefunden |
| **GESAMT** | **100** | Maximum |
| **Mindestanforderung** | **70** | Quality Gate Schwellenwert |

### Beispiele

#### ✅ AUDIT PASSED (85/100)
```
Dateien existieren:     ✅ 40/40 Punkte
Code-Changes:           ✅ 30/30 Punkte
Keine Fehler:           ⚠️ 15/30 Punkte (TODOs gefunden)
─────────────────────────────────────
GESAMT:                 85/100 → PASSED
```

#### 🔴 AUDIT FAILED (30/100)
```
Dateien existieren:     ❌ 0/40 Punkte (Dateien fehlen)
Code-Changes:           ❌ 0/30 Punkte (keine Änderungen)
Keine Fehler:           ✅ 30/30 Punkte
─────────────────────────────────────
GESAMT:                 30/100 → FAILED
```

---

## 🔧 API-Endpunkte

### Audit-Modus Status

```http
GET /api/admin/settings/audit-mode
```

**Response:**
```json
{
  "success": true,
  "data": {
    "auditMode": true,
    "description": "Enterprise++ Audit-Modus AKTIV",
    "qualityGate": { "minScore": 70, "maxScore": 100 }
  }
}
```

### Audit-Modus ändern

```http
POST /api/admin/settings/audit-mode
Content-Type: application/json

{ "enabled": true }
```

### Code-Check mit Audit

```http
POST /api/admin/ai-center/code-check
Content-Type: application/json

{ "taskId": 123 }
```

**Response (Audit-Mode aktiv):**
```json
{
  "success": true,
  "message": "🟢 AUDIT PASSED: Quality Gate bestanden (85/100)",
  "data": {
    "taskId": 123,
    "verified": true,
    "score": 85,
    "checks": { ... },
    "audit": {
      "mode": true,
      "status": "passed",
      "statusChanged": false,
      "newStatus": "done"
    }
  }
}
```

---

## 📦 Datenbank-Felder

### dev_tasks Tabelle

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `quality_score` | INT | 0-100 Punkte |
| `audit_status` | ENUM | 'pending', 'passed', 'failed' |

### lopez_settings Tabelle

| Key | Value | Beschreibung |
|-----|-------|--------------|
| `audit_mode` | 'true' / 'false' | Audit-Modus aktiv/inaktiv |

---

## 🖥️ UI-Elemente

### Header-Badge
Wenn Audit-Modus aktiv:
```
🟡 AUDIT-MODUS AKTIV
```

### Task-Badges

| Status | Badge | Farbe |
|--------|-------|-------|
| Passed | 🟢 85/100 | Grün |
| Failed | 🔴 30/100 | Rot |
| Pending | ⏳ --/100 | Grau |

### Buttons

| Task-Typ | Buttons |
|----------|---------|
| Feature, Bug, Refactor | "Code prüfen" |
| Security | "Recheck" + "Code prüfen" |

---

## 🔄 Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUDIT-MODUS WORKFLOW                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Task wird auf "Fertig" gesetzt                            │
│                    ↓                                          │
│  2. User klickt "Code prüfen"                                 │
│                    ↓                                          │
│  3. API berechnet Quality Score                               │
│                    ↓                                          │
│  4. Audit-Check (wenn auditMode = true)                       │
│         ├── Score ≥ 70 → PASSED                               │
│         │       └── Task bleibt "Fertig"                      │
│         │       └── Badge: 🟢                                 │
│         └── Score < 70 → FAILED                               │
│                 └── Task wird auf "Offen" gesetzt             │
│                 └── Badge: 🔴                                 │
│                                                               │
│  5. Audit-Log wird geschrieben                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📜 Audit-Logs

Alle Audit-Aktionen werden in `lopez_audit_logs` gespeichert:

| Action | Beschreibung |
|--------|--------------|
| `AUDIT_CHECK` | Code-Prüfung mit Audit-Modus |
| `CODE_CHECK` | Code-Prüfung ohne Audit-Modus |
| `AUDIT_MODE_CHANGED` | Audit-Modus aktiviert/deaktiviert |

---

## 📁 Unterstützte Pfad-Formate

Der Code-Check erkennt folgende Pfad-Formate in Task-Steps:

| Format | Beispiel | Wird zu |
|--------|----------|---------|
| `src/...` | `src/app/api/admin/users/route.ts` | Direkt verwendet |
| `/api/...` (ohne .ts) | `/api/admin/users` | `src/app/api/admin/users/route.ts` |
| `/api/...` (mit .ts) | `/api/admin/users/route.ts` | `src/app/api/admin/users/route.ts` |
| `api/...` (ohne Slash) | `api/admin/users/route.ts` | `src/app/api/admin/users/route.ts` |

### Empfehlung für neue Tasks

Für maximale Kompatibilität sollten Plan-Schritte echte Repo-Pfade verwenden:

```
✅ Empfohlen: src/app/api/admin/customers/route.ts
⚠️ Akzeptiert: /api/admin/customers/route.ts
⚠️ Akzeptiert: /api/admin/customers
```

---

## 🚀 Zukunftsregeln

### Geplante Erweiterungen

1. **TypeScript-Check Integration**
   - TSC-Fehler pro Datei: -10 Punkte
   - TSC erfolgreich: +20 Punkte

2. **Lint-Check Integration**
   - ESLint-Fehler: -5 Punkte pro Fehler
   - ESLint sauber: +10 Punkte

3. **Test-Coverage**
   - Coverage < 50%: -20 Punkte
   - Coverage ≥ 80%: +20 Punkte

4. **Security-Scan**
   - Kritische Findings: -30 Punkte
   - Keine Findings: +10 Punkte

---

## 📖 Enterprise++ Konformität

| Standard | Erfüllt | Beschreibung |
|----------|---------|--------------|
| SAP | ✅ | Quality Gates für Releases |
| IBM | ✅ | Audit-Trail für alle Änderungen |
| Siemens | ✅ | Dokumentierte Qualitätsstandards |
| DSGVO | ✅ | Vollständige Nachvollziehbarkeit |

---

**Erstellt:** 2025-12-06  
**Autor:** AI Center / Enterprise++ System  
**Version:** 1.0.0


