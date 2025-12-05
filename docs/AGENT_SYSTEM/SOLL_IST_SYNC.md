# 🔄 ENTERPRISE++ SOLL/IST SYNCHRONISATION

**Stand:** 2025-12-04  
**Status:** ✅ SYNCHRONISIERT  
**Version:** 1.0

---

## 📋 Übersicht

Dieses Dokument beschreibt die Synchronisation zwischen:
- **SOLL-Daten:** Modul-Definitionen in `src/lib/agent-system.ts`
- **IST-Daten:** Datenbank-Tabellen `module_registry` und `module_progress`

---

## 📊 Aktueller Sync-Status

| Bereich | SOLL | IST | Status |
|---------|------|-----|--------|
| **Basis-Module** | 51 | 51 | ✅ Sync |
| **Extra-Module** | 7 | 7 | ✅ Dokumentiert |
| **ADM auf 100%** | 7 | 7 | ✅ Korrekt |
| **Progress-Einträge** | 58 | 58 | ✅ Vollständig |
| **Fehlende Felder** | 0 | 0 | ✅ Keine |

---

## 🗂️ Datenbank-Tabellen

### module_registry

Speichert alle SOLL-Module mit Metadaten.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | BIGINT | Primärschlüssel |
| module_code | VARCHAR(20) | Eindeutiger Code (z.B. "ADM-01") |
| module_name | VARCHAR(255) | Lesbare Bezeichnung |
| category | VARCHAR(100) | Kategorie |
| description | TEXT | Beschreibung |
| priority | VARCHAR(20) | Priorität (high/medium/low) |
| priority_level | ENUM | P0-P3 |
| maturity_level | ENUM | M0-M5 |
| risk_level | ENUM | critical/high/medium/low |
| depends_on | JSON | Abhängigkeiten |
| go_live_required | BOOLEAN | Go-Live-kritisch |
| soll_status | ENUM | open/planned/required |

### module_progress

Speichert den IST-Fortschritt je Modul.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | BIGINT | Primärschlüssel |
| module_id | BIGINT | FK zu module_registry |
| ist_status | ENUM | open/in_progress/done |
| progress_percent | INT | 0-100 |
| comment | TEXT | Kommentar |
| responsible_agent | ENUM | plan/build/run |
| updated_at | DATETIME | Letzte Änderung |

---

## 🔄 Sync-Prozess

### 1. SOLL → Registry

Die `SOLL_MODULE_LIST` in `src/lib/agent-system.ts` enthält alle Modul-Definitionen.

Bei `AgentSystemService.initializeTables()`:
- INSERT IGNORE für neue Module
- UPDATE für bestehende (nur SOLL-Felder)

### 2. IST → Progress

Die `IST_PROGRESS_VALUES` in `src/lib/agent-system.ts` enthält die Fortschrittswerte.

Bei `AgentSystemService.seedModuleProgress()`:
- INSERT für neue Einträge
- UPDATE für bestehende

### 3. Sync-Regeln

| Aktion | Erlaubt | Verboten |
|--------|---------|----------|
| INSERT neuer Module | ✅ | - |
| UPDATE SOLL-Felder | ✅ | - |
| UPDATE IST-Fortschritt | ✅ | - |
| DELETE Module | ❌ | Nie! |
| TRUNCATE Tabellen | ❌ | Nie! |
| DROP TABLE | ❌ | Nie! |

---

## 📈 Fortschritts-Berechnung

```
overallProgress = AVG(progress_percent) über alle Module
```

### Status-Zählung

- **Offen:** `ist_status = 'open'` ODER `progress_percent = 0`
- **In Arbeit:** `ist_status = 'in_progress'` ODER `1 <= progress_percent <= 99`
- **Fertig:** `ist_status = 'done'` UND `progress_percent = 100`

---

## 🔒 Enterprise++ Regeln

1. **Keine Datenlöschung:** Module werden nie gelöscht
2. **Audit-Trail:** Alle Änderungen werden protokolliert
3. **Konsistenz:** module_progress immer mit module_registry verknüpft
4. **ADM-Schutz:** ADM-Module dürfen nicht unter 100% gesetzt werden

---

**Letzte Synchronisation:** 2025-12-04
