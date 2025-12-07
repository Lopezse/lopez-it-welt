# SQL Gefährliche Operationen - Enterprise++ Policy

> **Version:** 1.0  
> **Datum:** 2025-12-06  
> **Status:** ✅ Produktiv  
> **Security-Issue:** SEC-01

---

## 📋 Übersicht

Diese Policy definiert, welche SQL-Operationen im Application-Code **VERBOTEN** sind und unter welchen Bedingungen sie erlaubt sein können.

---

## 🚫 VERBOTENE SQL-Operationen im Application-Code

Die folgenden SQL-Befehle sind im Runtime-Code **STRIKT VERBOTEN**:

| Befehl | Risiko | Erlaubt in |
|--------|--------|------------|
| `DROP TABLE` | Datenverlust | Nur Migrationen/Dev-Skripte |
| `DROP DATABASE` | Kompletter Datenverlust | NIEMALS |
| `TRUNCATE TABLE` | Datenverlust | Nur Dev-Skripte |
| `DELETE FROM table` (ohne WHERE) | Datenverlust | NIEMALS |

### Begründung

Diese Befehle können **unwiderruflich Daten zerstören**:
- Kein Rollback möglich bei DROP/TRUNCATE
- Produktionsdaten können nicht wiederhergestellt werden
- Compliance-Verletzung (DSGVO, Audit-Trail)

---

## ✅ Erlaubte Verwendung

### 1. Migrationen

DROP TABLE ist in **kontrollierten Migrationen** erlaubt, wenn:

- ✅ Es sich um eine dedizierte Migrations-Datei handelt (`migrations/*.sql`)
- ✅ Ein Backup-Konzept existiert
- ✅ Die Migration dokumentiert ist
- ✅ Die Tabelle wirklich dauerhaft entfernt werden soll

```sql
-- migrations/2025-12-06-remove-legacy-table.sql
-- MIGRATION: Entfernt veraltete Tabelle xyz
-- BACKUP: Vor Ausführung Backup erstellen!
-- ROLLBACK: Nicht möglich - Daten gehen verloren

DROP TABLE IF EXISTS legacy_xyz;
```

### 2. Dev-/Test-Skripte

DROP TABLE ist in **Dev-Skripten** erlaubt, wenn:

- ✅ Das Skript unter `scripts/dev/` oder `tools/dev/` liegt
- ✅ Ein NODE_ENV-Check implementiert ist
- ✅ Das Skript manuell gestartet werden muss
- ✅ Klare DEV-ONLY Kommentare vorhanden sind

```typescript
// scripts/dev/reset-db.ts
// ⚠️ DEV-ONLY: Dieses Skript löscht alle Daten!

if (process.env.NODE_ENV === "production") {
  throw new Error("DROP TABLE ist in PRODUCTION verboten (SEC-01)");
}

// @dev-only: Nur in Development ausführen
await connection.execute("DROP TABLE IF EXISTS test_data");
```

---

## 🛡️ Schutzmaßnahmen

### 1. NODE_ENV-Check (PFLICHT)

Jedes Skript mit DROP TABLE MUSS prüfen:

```typescript
if (process.env.NODE_ENV === "production") {
  throw new Error("Diese Operation ist in Production verboten (SEC-01)");
}
```

### 2. @dev-only Marker

Alle gefährlichen Operationen MÜSSEN markiert sein:

```typescript
// @dev-only: DROP TABLE nur in Development erlaubt
await connection.execute("DROP TABLE IF EXISTS test_table");
```

### 3. Kein Auto-Start

Dev-Skripte dürfen **NIEMALS** automatisch starten:
- ❌ Nicht beim App-Start
- ❌ Nicht beim Build
- ❌ Nicht in CI/CD Pipeline für Production

---

## 📁 Verzeichnis-Struktur

```
src/
├── app/          ❌ KEIN DROP TABLE
├── lib/          ❌ KEIN DROP TABLE
├── components/   ❌ KEIN DROP TABLE
└── ...

scripts/
└── dev/          ✅ DROP TABLE mit Schutz erlaubt
    └── reset-db.ts

migrations/       ✅ DROP TABLE dokumentiert erlaubt
└── *.sql

tools/
└── dev/          ✅ DROP TABLE mit Schutz erlaubt
```

---

## 🔍 Security Scanner

Der AI Center Security Scanner (SEC-01) prüft auf:

1. **DROP TABLE** in `src/**` → FEHLER
2. **DROP DATABASE** überall → FEHLER
3. **TRUNCATE** in `src/**` → FEHLER
4. **DELETE ohne WHERE** → WARNUNG

### Ausnahmen für Scanner

Der Scanner ignoriert:
- Kommentare (`// DROP TABLE...`)
- Strings in UI (`"DROP TABLE Count: {x}"`)
- Dateien mit `@dev-only` Marker UND NODE_ENV-Check

---

## 📊 Betroffene Dateien (SEC-01 Fix)

Diese Dateien wurden im Rahmen von SEC-01 bereinigt:

| Datei | Problem | Lösung |
|-------|---------|--------|
| `src/lib/database.ts` | 9x DROP TABLE in Schema-Reparatur | Entfernt - Fehler werfen statt löschen |
| `src/app/api/admin/utf8-test/route.ts` | 1x DROP TABLE in Test-Route | NODE_ENV-Schutz hinzugefügt |

---

## ⚠️ Was tun bei Schema-Problemen?

Wenn das Datenbank-Schema nicht kompatibel ist:

1. **NICHT** die Tabellen automatisch löschen
2. **Fehler werfen** mit klarer Meldung
3. **Migration erstellen** für Schema-Änderung
4. **Migration manuell ausführen** nach Backup

```typescript
// ❌ FALSCH (Verboten)
if (schemaInvalid) {
  await connection.execute("DROP TABLE customers");
  await connection.execute("CREATE TABLE customers...");
}

// ✅ RICHTIG (Enterprise++)
if (schemaInvalid) {
  throw new Error(
    "SEC-01: Schema-Inkompatibilität erkannt. " +
    "Bitte Migration ausführen: pnpm db:migrate"
  );
}
```

---

## 📚 Referenzen

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [docs/SECURITY/sql-updates.md](./sql-updates.md) - SQL Update-Sicherheit
- Enterprise++ Security Standards

---

*Dokument erstellt: 2025-12-06 | Enterprise++ AI Center | SEC-01*



