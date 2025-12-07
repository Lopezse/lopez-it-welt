# SQL Update-Sicherheit - Enterprise++ Standard

> **Version:** 1.0  
> **Datum:** 2025-12-06  
> **Status:** ✅ Produktiv

---

## 📋 Übersicht

Dieses Dokument beschreibt den Enterprise++ Standard für sichere dynamische SQL-Updates.

## 🛡️ Das Problem

Dynamische SQL-Queries mit Template-Literals können SQL-Injection-Schwachstellen verursachen:

```typescript
// ❌ UNSICHER - User-Input direkt im SQL-String
const column = req.body.sortBy;  // z.B. "name; DROP TABLE users; --"
await connection.execute(`SELECT * FROM users ORDER BY ${column}`);
```

## ✅ Die Lösung: ALLOWED_FIELDS Whitelist

### Grundprinzip

```typescript
// ✅ SICHER - Enterprise++ Pattern
const ALLOWED_FIELDS = ["name", "email", "status"] as const;

const updateFields: string[] = [];
const values: any[] = [];

for (const field of ALLOWED_FIELDS) {
  if (body[field] !== undefined) {
    updateFields.push(`${field} = ?`);
    values.push(body[field]);
  }
}

// @sql-safe: SET-Klausel aus ALLOWED_FIELDS Whitelist
await connection.execute(
  `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
  [...values, userId]
);
```

### Warum ist das sicher?

1. **Spaltennamen** kommen nur aus `ALLOWED_FIELDS` - einer statischen Konstante
2. **Werte** gehen über `?` Platzhalter - automatisch escaped
3. **Kein User-Input** gelangt direkt in den SQL-String

---

## 📐 Standard-Pattern

### 1. Einfaches Update

```typescript
const ALLOWED_FIELDS = ["first_name", "last_name", "email", "status"] as const;

const updates: string[] = [];
const values: any[] = [];

for (const field of ALLOWED_FIELDS) {
  if (body[field] !== undefined) {
    updates.push(`${field} = ?`);
    values.push(body[field]);
  }
}

if (updates.length === 0) {
  return NextResponse.json({ error: "Keine Felder" }, { status: 400 });
}

values.push(id);

// @sql-safe: SET-Klausel aus ALLOWED_FIELDS Whitelist
await connection.execute(
  `UPDATE table_name SET ${updates.join(", ")} WHERE id = ?`,
  values
);
```

### 2. Mit JSON-Feldern

```typescript
const ALLOWED_FIELDS = ["name", "config", "settings"] as const;
const JSON_FIELDS = ["config", "settings"] as const;

for (const field of ALLOWED_FIELDS) {
  if (body[field] !== undefined) {
    updates.push(`${field} = ?`);
    if ((JSON_FIELDS as readonly string[]).includes(field)) {
      values.push(JSON.stringify(body[field]));
    } else {
      values.push(body[field]);
    }
  }
}
```

### 3. Mit Boolean/Nullable-Feldern

```typescript
const ALLOWED_FIELDS = ["title", "is_active", "project_id"] as const;
const BOOLEAN_FIELDS = ["is_active"] as const;
const NULLABLE_FIELDS = ["project_id"] as const;

for (const field of ALLOWED_FIELDS) {
  if (body[field] !== undefined) {
    updates.push(`${field} = ?`);
    
    if ((BOOLEAN_FIELDS as readonly string[]).includes(field)) {
      values.push(body[field] ? 1 : 0);
    } else if ((NULLABLE_FIELDS as readonly string[]).includes(field)) {
      values.push(body[field] || null);
    } else {
      values.push(body[field]);
    }
  }
}
```

### 4. Dynamische IN-Klausel

```typescript
// roleIds kommt aus DB-Abfrage, nicht aus User-Input
const roleIds = dbResult.map(r => r.role_id);

// @sql-safe: Platzhalter werden dynamisch generiert, aber nur "?" Zeichen
const placeholders = roleIds.map(() => "?").join(",");
await connection.execute(
  `SELECT * FROM permissions WHERE role_id IN (${placeholders})`,
  roleIds
);
```

---

## 🔍 Security Scanner

Der AI Center Security Scanner prüft auf:

1. **Template-Literals in SQL**: `execute(` + `${`
2. **Ausnahmen** (werden nicht gemeldet):
   - `@sql-safe` Kommentar vorhanden
   - `ALLOWED_` Konstante + `.map()` oder `.filter()` verwendet
   - `escapeId()` oder `escape()` Funktionen verwendet

### @sql-safe Marker

Wenn ein Pattern technisch sicher ist, aber vom Scanner gefunden wird, füge einen Kommentar hinzu:

```typescript
// @sql-safe: Erklärung warum das sicher ist
await connection.execute(`...`);
```

---

## 📁 Refactored Dateien

Diese Dateien wurden auf das ALLOWED_FIELDS Pattern umgestellt:

| Datei | Status |
|-------|--------|
| `src/app/api/dsgvo/approvals/[id]/route.ts` | ✅ |
| `src/app/api/orchestrator/triggers/[id]/route.ts` | ✅ |
| `src/app/api/orchestrator/workflows/[id]/route.ts` | ✅ |
| `src/app/api/appointments/[id]/route.ts` | ✅ |
| `src/app/api/admin/users/[id]/route.ts` | ✅ |
| `src/app/api/admin/release/checklist/route.ts` | ✅ |
| `src/app/api/admin/release/approval/[id]/route.ts` | ✅ |
| `src/app/api/admin/privileges/route.ts` | ✅ |
| `src/app/api/customer/init-tables/route.ts` | ✅ |
| `src/app/api/admin/ai/risk-to-task/route.ts` | ✅ |

---

## ⚠️ Verboten

Diese Patterns sind **NIEMALS** erlaubt:

```typescript
// ❌ User-Input als Spaltenname
await connection.execute(`ORDER BY ${req.body.sortBy}`);

// ❌ User-Input als Tabellenname
await connection.execute(`SELECT * FROM ${req.body.table}`);

// ❌ User-Input direkt in WHERE
await connection.execute(`WHERE id = ${userId}`);

// ❌ Unvalidierte Arrays in IN-Klausel
await connection.execute(`WHERE id IN (${userIds.join(",")})`);
```

---

## 📚 Referenzen

- [OWASP SQL Injection Prevention](https://owasp.org/www-community/attacks/SQL_Injection)
- [mysql2 Prepared Statements](https://github.com/sidorares/node-mysql2#using-prepared-statements)
- Enterprise++ Security Standards

---

*Dokument erstellt: 2025-12-06 | Enterprise++ AI Center*

