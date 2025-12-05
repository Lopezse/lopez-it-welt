# 🛡️ DATABASE PROTECTION GUIDE

> **Enterprise++ Anleitung zur Datenbank-Absicherung**
> **Erstellt:** 2025-12-04
> **Status:** ZUR MANUELLEN UMSETZUNG

---

## 📋 ÜBERSICHT

Dieses Dokument beschreibt die Schutzmaßnahmen, um Datenverlust durch `init-database` zu verhindern.

---

## ✅ BEREITS UMGESETZT

| Datei | Status | Beschreibung |
|-------|--------|--------------|
| `.cursor/rules/db-protection.md` | ✅ Erstellt | Cursor-Regeln für DB-Schutz |
| `backups/db/` | ✅ Erstellt | Verzeichnis für lokale SQL-Dumps |
| `scripts/backup-db-local.js` | ✅ Erstellt | Lokales Backup-Script |

---

## ⚠️ MANUELL UMZUSETZEN

### 1. DEV-Datenbank anlegen (phpMyAdmin)

```sql
CREATE DATABASE lopez_it_welt_dev 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Dann: `lopez_it_welt` → Exportieren → `lopez_it_welt_dev` → Importieren

### 2. .env anpassen

```env
# VORHER:
DB_NAME=lopez_it_welt

# NACHHER:
DB_NAME=lopez_it_welt_dev
DB_NAME_PROD=lopez_it_welt
```

### 3. PROD-Schutz in database.ts einbauen

**Datei:** `src/lib/database.ts`

**Am Anfang der Funktion `initializeDatabase()` (nach Zeile 117) einfügen:**

```typescript
export async function initializeDatabase(): Promise<void> {
  // =====================================================
  // 🛡️ ENTERPRISE++ SICHERHEITSPRÜFUNG
  // =====================================================
  const dbName = process.env.DB_NAME || "lopez_it_welt";
  const prodDbName = process.env.DB_NAME_PROD || "lopez_it_welt";
  
  // HARDCODED STOP: Niemals PROD löschen!
  if (dbName === prodDbName) {
    console.error("🛑 ENTERPRISE++ SICHERHEITSSTOPP!");
    console.error(`❌ DB_NAME (${dbName}) ist gleich DB_NAME_PROD (${prodDbName})`);
    console.error("❌ Setze DB_NAME=lopez_it_welt_dev in .env");
    throw new Error(
      "SICHERHEITSSTOPP: initializeDatabase() darf nicht auf PROD ausgeführt werden. " +
      "Bitte DB_NAME auf eine _dev Datenbank setzen."
    );
  }
  
  if (!dbName.endsWith("_dev")) {
    console.error("🛑 ENTERPRISE++ SICHERHEITSSTOPP!");
    console.error(`❌ Datenbank "${dbName}" endet nicht mit "_dev"`);
    throw new Error(
      `SICHERHEITSSTOPP: Datenbank "${dbName}" ist keine DEV-Datenbank. ` +
      `Nur Datenbanken mit Suffix "_dev" dürfen initialisiert werden.`
    );
  }
  
  console.log(`✅ Sicherheitsprüfung bestanden: ${dbName} ist eine DEV-Datenbank`);
  
  // ... Rest der Funktion unverändert ...
```

**Den gefährlichen Block (Zeilen 153-175) ersetzen durch:**

```typescript
  // =====================================================
  // 🛡️ TABELLEN-LÖSCHUNG DEAKTIVIERT
  // =====================================================
  // HINWEIS: Automatische Tabellenlöschung wurde aus Sicherheitsgründen
  // deaktiviert. Tabellen werden nur erstellt wenn sie nicht existieren.
  //
  // Falls ein Reset wirklich nötig ist:
  // 1. Backup erstellen: node scripts/backup-db-local.js
  // 2. In phpMyAdmin manuell löschen
  // 3. Dann init-database aufrufen
  // =====================================================
  
  console.log("ℹ️ Automatische Tabellenlöschung ist DEAKTIVIERT.");
  console.log("ℹ️ Tabellen werden nur erstellt wenn sie nicht existieren.");
  console.log("ℹ️ Für einen Reset bitte manuell in phpMyAdmin vorgehen.");
```

---

## 📋 CHECKLISTE

- [ ] DEV-Datenbank in phpMyAdmin erstellt
- [ ] Daten von PROD nach DEV kopiert
- [ ] `.env` angepasst (`DB_NAME=lopez_it_welt_dev`)
- [ ] Sicherheitsprüfung in `database.ts` eingebaut
- [ ] Lösch-Code in `database.ts` deaktiviert
- [ ] Erstes Backup erstellt: `node scripts/backup-db-local.js`

---

## 🔧 BACKUP VERWENDEN

### Lokales Backup (im Projekt)
```bash
node scripts/backup-db-local.js
```
Speichert unter: `backups/db/`

### Externes Backup (D:\Backups)
```bash
node scripts/backup-system.js
```
Speichert unter: `D:\Backups\mysql\`

---

## 🚨 NOTFALL: Datenbank wiederherstellen

```bash
# In phpMyAdmin:
# 1. Datenbank auswählen
# 2. Importieren
# 3. SQL-Datei aus backups/db/ oder D:\Backups\mysql\ wählen
```

---

## 📝 ÄNDERUNGSHISTORIE

| Datum | Änderung |
|-------|----------|
| 2025-12-04 | Guide erstellt |




