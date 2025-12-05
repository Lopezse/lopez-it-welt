# 🛡️ ENTERPRISE++ DB-SCHUTZREGELN

> **VERBINDLICH für alle Cursor-Operationen auf Lopez IT Welt**
> **Erstellt:** 2025-12-04
> **Status:** AKTIV

---

## ❌ ABSOLUT VERBOTEN (ohne explizite Freigabe)

Die folgenden Operationen dürfen **NIEMALS** ohne ausdrückliche schriftliche Freigabe durch den Benutzer ausgeführt werden:

### SQL-Operationen
- `DROP DATABASE`
- `DROP TABLE`
- `TRUNCATE TABLE`
- `DELETE` ohne `WHERE`-Klausel
- `ALTER TABLE ... DROP COLUMN`

### Code-Operationen
- Aufruf von `initializeDatabase()` auf PROD
- Aufruf von `/api/admin/init-database` auf PROD
- Änderung von `.env` (löschen, überschreiben, umbenennen)
- Direktes Ausführen von SQL-Befehlen ohne Prüfung

---

## ✅ ERLAUBT

- `SELECT`-Abfragen (READ-ONLY)
- `INSERT` mit expliziten Werten
- `UPDATE` mit `WHERE`-Klausel
- `CREATE TABLE IF NOT EXISTS`
- `ALTER TABLE ... ADD COLUMN`

---

## 🔒 DATENBANK-TRENNUNG

### DEV-Datenbank (Cursor darf arbeiten)
```
DB_NAME=lopez_it_welt_dev
```

### PROD-Datenbank (NUR manuell durch Benutzer)
```
DB_NAME_PROD=lopez_it_welt
```

**Regel:** Cursor arbeitet **AUSSCHLIESSLICH** mit Datenbanken, die auf `_dev` enden.

---

## 🛑 SICHERHEITSPRÜFUNG VOR JEDER DB-OPERATION

Vor jeder Datenbank-Operation MUSS Cursor prüfen:

1. **Welche Datenbank ist aktiv?**
   - Wenn `lopez_it_welt` (ohne `_dev`): **STOPP**
   - Wenn `*_dev`: Fortfahren

2. **Ist die Operation destruktiv?**
   - DROP/TRUNCATE/DELETE: **STOPP und FRAGEN**
   - SELECT/INSERT/UPDATE: Fortfahren mit Vorsicht

3. **Bei Unsicherheit:**
   - **SOFORT STOPPEN**
   - Benutzer informieren
   - Auf explizite Freigabe warten

---

## 📋 BACKUP-REGEL

**VOR jeder strukturellen Änderung:**
1. Benutzer auffordern: `node scripts/backup-system.js`
2. Bestätigung abwarten
3. Erst dann fortfahren

---

## 🚨 NOTFALL-PROZEDUR

Wenn versehentlich destruktive Befehle ausgeführt wurden:

1. **SOFORT STOPPEN** – keine weiteren Befehle
2. **Benutzer informieren** – ehrlich und vollständig
3. **Backup prüfen** – `D:\Backups\mysql\` durchsuchen
4. **Recovery-Plan** – gemeinsam mit Benutzer erstellen

---

## 📝 ÄNDERUNGSHISTORIE

| Datum | Änderung | Grund |
|-------|----------|-------|
| 2025-12-04 | Erstellt | Datenverlust durch init-database verhindern |

---

**Diese Regeln sind VERBINDLICH und haben höchste Priorität.**



