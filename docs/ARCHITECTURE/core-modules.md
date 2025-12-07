# 🛡️ CORE-01: Schutzliste für Kernmodule

> **Stand:** 2025-12-07  
> **Status:** AKTIV  
> **Niveau:** Enterprise++ (SAP/IBM/Siemens Standard)

---

## ⚠️ WICHTIG: Diese Module sind GESCHÜTZT

Die folgenden Module gehören zum **Kernsystem** von Lopez IT Welt und dürfen unter **KEINEN UMSTÄNDEN**:

- ❌ nach `_legacy/` verschoben werden
- ❌ aus `tsconfig.json` excluded werden
- ❌ gelöscht oder entfernt werden
- ❌ in "Cleanup"-Tasks versteckt werden

---

## 📋 Protection-List (Kernmodule)

```
src/lib/ki-orchestrator/**        # KI-Orchestrator (Herzstück)
src/app/api/orchestrator/**       # Orchestrator API-Routen
src/app/admin/uoc/**              # Unified Operations Center
src/components/orchestrator/**    # Orchestrator UI-Komponenten
src/lib/rag/**                    # RAG-System (Retrieval Augmented Generation)
src/lib/ai-center/**              # AI Center Services
src/lib/dev-orchestrator/**       # Dev-Orchestrator (Agent A/B/C)
src/lib/dsgvo/**                  # DSGVO-System
src/lib/media/**                  # Media-KI System
src/lib/telemetry/**              # Telemetrie & Monitoring
```

---

## 📜 Regeln

### 1. TypeScript-Fehler werden GEFIXT, nicht versteckt

```
❌ FALSCH: Modul nach _legacy verschieben
❌ FALSCH: Modul in tsconfig.json excluden
❌ FALSCH: Modul löschen

✅ RICHTIG: Typen sauber machen
✅ RICHTIG: Fehlende Interfaces ergänzen
✅ RICHTIG: any durch konkrete Typen ersetzen
```

### 2. Agent-/Dev-Task-Regeln

Wenn ein Task folgende Begriffe enthält:
- `legacy`
- `cleanup`
- `exclude`
- `move to _legacy`
- `entfernen`
- `verschieben`

**→ Kernmodule aus der Protection-List sind TABU.**

### 3. Wachstum, nicht Verkleinerung

```
Das Ziel ist WACHSEN, nicht VERKLEINERN.

Wir entfernen keine Bausteine, nur weil sie gerade nicht aktiv benutzt werden.
Wir verschieben keine Kernmodule in "legacy", nur um Fehler zu verstecken.

Diese Module sind Teil der zukünftigen Architektur:
- KI-Autonomie
- Enterprise++ Orchestrierung
- Intelligente Automatisierung
```

---

## 🔒 Was DARF in _legacy/?

Nur echte Altlasten:

- ✅ Alte Backup-Dateien
- ✅ Verwaiste Test-Dateien
- ✅ Doppelte UI-Prototypen (die nie fertig wurden)
- ✅ Skripte, die nie wieder gebraucht werden
- ✅ Dateien ohne jegliche Imports/Nutzung

**NIEMALS:**
- ❌ Kernmodule
- ❌ Module mit aktiven Imports
- ❌ Module, die Teil zukünftiger Phasen sind

---

## 📊 Audit-Trail

| Datum | Aktion | Ergebnis |
|-------|--------|----------|
| 2025-12-07 | Verschiebung ki-orchestrator nach _legacy | ❌ RÜCKGÄNGIG GEMACHT |
| 2025-12-07 | CORE-01 Schutzliste erstellt | ✅ AKTIV |

---

## 🎯 Verantwortung

Diese Regeln gelten für:
- Cursor AI
- Alle Dev-Tasks
- Manuelle Änderungen
- CI/CD Pipelines

**Bei Verstößen:** Task wird abgebrochen und Warnung ausgegeben.

---

**Erstellt:** 2025-12-07  
**Autor:** Enterprise++ System  
**Version:** 1.0.0


