# 📋 VALIDIERUNGSBERICHT: Office & Finance Management

**Datum:** 2025-11-01  
**Quelle:** docs/07-OFFICE-MANAGEMENT/office_management_core.md  
**Status:** ❌ **FAIL** - Abweichungen gefunden

---

## 📊 IST vs. SOLL Vergleich

| Prüfpunkt                                 | SOLL (Doku)        | IST (Code)                                                   | Status         |
| ----------------------------------------- | ------------------ | ------------------------------------------------------------ | -------------- |
| **1. Sidebar-Menü**                       |                    |                                                              |                |
| Hauptpunkt "Office & Finanzen"            | ✅ Erwartet        | ✅ Vorhanden                                                 | ✅ **PASS**    |
| Unterpunkt "CRM & Projekte"               | ✅ Erwartet        | ✅ `/admin/office/projects`                                  | ✅ **PASS**    |
| Unterpunkt "Aufträge & Aufgaben"          | ✅ Erwartet        | ✅ `/admin/office/orders`                                    | ✅ **PASS**    |
| Unterpunkt "Kalender"                     | ✅ Erwartet        | ✅ `/admin/office/calendar`                                  | ✅ **PASS**    |
| Unterpunkt "Rechnungen"                   | ✅ Erwartet        | ✅ `/admin/office/invoices`                                  | ✅ **PASS**    |
| Unterpunkt "E-Rechnung"                   | ✅ Erwartet        | ✅ `/admin/office/einvoice`                                  | ✅ **PASS**    |
| Unterpunkt "Reporting"                    | ✅ Erwartet        | ✅ `/admin/office/reporting`                                 | ✅ **PASS**    |
| Unterpunkt "Audit & Compliance"           | ✅ Erwartet        | ✅ `/admin/office/audit`                                     | ✅ **PASS**    |
| **2. API-Routen**                         |                    |                                                              |                |
| `/api/projects` GET, POST                 | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/projects/[id]` GET, PUT, DELETE     | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/orders` GET, POST                   | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/orders/[id]` GET, PUT, DELETE       | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/tasks` GET, POST                    | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/tasks/[id]` GET, PUT, DELETE        | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/appointments` GET, POST             | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/appointments/[id]` GET, PUT, DELETE | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/appointments/ical/export` GET       | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/invoices` GET, POST                 | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| `/api/invoices/[id]` GET, PUT, DELETE     | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/invoices/pdf` POST                  | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/invoices/status` PUT                | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/einvoice/inbox/upload` POST         | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/einvoice/outbox/create` POST        | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/einvoice/send` POST                 | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| `/api/audit` GET                          | ✅ Erwartet        | ✅ Implementiert                                             | ✅ **PASS**    |
| **3. Rollen & Rechte**                    |                    |                                                              |                |
| Rollen: ADMIN, OFFICE, TECH, VIEW         | ✅ Erwartet (Doku) | ⚠️ RBAC vorhanden, aber Rollen nicht als policies/roles.json | ⚠️ **WARNUNG** |
| policies/roles.json                       | ✅ Erwartet        | ❌ **FEHLT**                                                 | ❌ **FAIL**    |
| RBAC-Policy-Datei                         | ✅ Erwartet        | ⚠️ Rollen in Code/DB definiert                               | ⚠️ **WARNUNG** |
| **4. Compliance & Audit**                 |                    |                                                              |                |
| UTF-8 (utf8mb4_unicode_ci)                | ✅ Erwartet        | ✅ In Schema vorhanden                                       | ✅ **PASS**    |
| Audit-Trail aktiv                         | ✅ Erwartet        | ✅ `lopez_audit_logs` vorhanden                              | ✅ **PASS**    |
| GoBD-Hinweise in STATUS.md                | ✅ Erwartet        | ✅ Vorhanden                                                 | ✅ **PASS**    |
| DSGVO-Hinweise in STATUS.md               | ✅ Erwartet        | ✅ Vorhanden                                                 | ✅ **PASS**    |
| ISO27001-Hinweise in STATUS.md            | ✅ Erwartet        | ✅ Vorhanden                                                 | ✅ **PASS**    |

---

## ❌ FEHLER: Fehlende API-Routen

### 1. `/api/orders/[id]/route.ts` - FEHLT

**SOLL:** GET, PUT, DELETE für Einzelauftrag  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/orders/[id]/route.ts
export async function GET(...) { /* Einzelauftrag laden */ }
export async function PUT(...) { /* Auftrag aktualisieren */ }
export async function DELETE(...) { /* Auftrag löschen */ }
```

**Datei:** `src/app/api/orders/[id]/route.ts`  
**Zeile:** Datei existiert nicht

---

### 2. `/api/tasks/[id]/route.ts` - FEHLT

**SOLL:** GET, PUT, DELETE für Einzelaufgabe  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/tasks/[id]/route.ts
export async function GET(...) { /* Einzelaufgabe laden */ }
export async function PUT(...) { /* Aufgabe aktualisieren */ }
export async function DELETE(...) { /* Aufgabe löschen */ }
```

**Datei:** `src/app/api/tasks/[id]/route.ts`  
**Zeile:** Datei existiert nicht

---

### 3. `/api/appointments/[id]/route.ts` - FEHLT

**SOLL:** GET, PUT, DELETE für Einzeltermin  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/appointments/[id]/route.ts
export async function GET(...) { /* Einzeltermin laden */ }
export async function PUT(...) { /* Termin aktualisieren */ }
export async function DELETE(...) { /* Termin löschen */ }
```

**Datei:** `src/app/api/appointments/[id]/route.ts`  
**Zeile:** Datei existiert nicht

---

### 4. `/api/appointments/ical/export/route.ts` - FEHLT

**SOLL:** GET für ICS-Export  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/appointments/ical/export/route.ts
export async function GET(request: NextRequest) {
  // ICS-Datei generieren und zurückgeben
  // Content-Type: text/calendar
}
```

**Datei:** `src/app/api/appointments/ical/export/route.ts`  
**Zeile:** Datei existiert nicht

---

### 5. `/api/invoices/[id]/route.ts` - FEHLT

**SOLL:** GET, PUT, DELETE für Einzelrechnung  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/invoices/[id]/route.ts
export async function GET(...) { /* Einzelrechnung laden */ }
export async function PUT(...) { /* Rechnung aktualisieren */ }
export async function DELETE(...) { /* Rechnung löschen */ }
```

**Datei:** `src/app/api/invoices/[id]/route.ts`  
**Zeile:** Datei existiert nicht

---

### 6. `/api/invoices/pdf/route.ts` - FEHLT

**SOLL:** POST für PDF-Generierung  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/invoices/pdf/route.ts
export async function POST(request: NextRequest) {
  // Python-Hook für PDF-Generierung
  // Hash berechnen
  // Archivieren
}
```

**Datei:** `src/app/api/invoices/pdf/route.ts`  
**Zeile:** Datei existiert nicht

---

### 7. `/api/invoices/status/route.ts` - FEHLT

**SOLL:** PUT für Status-Änderung  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/invoices/status/route.ts
export async function PUT(request: NextRequest) {
  // Status ändern: draft → sent → paid
  // Audit-Log
}
```

**Datei:** `src/app/api/invoices/status/route.ts`  
**Zeile:** Datei existiert nicht

---

### 8. `/api/einvoice/inbox/upload/route.ts` - FEHLT

**SOLL:** POST für E-Rechnung Empfang  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/einvoice/inbox/upload/route.ts
export async function POST(request: NextRequest) {
  // XML-Upload
  // Validierung (Schema/Schematron)
  // In einvoice_inbox speichern
}
```

**Datei:** `src/app/api/einvoice/inbox/upload/route.ts`  
**Zeile:** Datei existiert nicht

---

### 9. `/api/einvoice/outbox/create/route.ts` - FEHLT

**SOLL:** POST für E-Rechnung erstellen  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/einvoice/outbox/create/route.ts
export async function POST(request: NextRequest) {
  // XRechnung/ZUGFeRD generieren
  // In einvoice_outbox speichern
}
```

**Datei:** `src/app/api/einvoice/outbox/create/route.ts`  
**Zeile:** Datei existiert nicht

---

### 10. `/api/einvoice/send/route.ts` - FEHLT

**SOLL:** POST für E-Rechnung versenden  
**IST:** Nicht implementiert

**Fix:**

```typescript
// src/app/api/einvoice/send/route.ts
export async function POST(request: NextRequest) {
  // E-Mail versenden
  // Status: entwurf → versendet → zugestellt
  // Später: PEPPOL-Adapter
}
```

**Datei:** `src/app/api/einvoice/send/route.ts`  
**Zeile:** Datei existiert nicht

---

## ⚠️ WARNUNGEN

### 1. Rollen & Rechte

**Problem:** Rollen werden in Code/DB definiert, aber nicht als `policies/roles.json`

**SOLL (laut Doku):**

- ADMIN: Vollzugriff
- OFFICE: CRM/Projekte/Aufträge/Termine/Rechnungen
- TECH: Aufgaben/Zeiten/Termine
- VIEW: Read-only Reports

**IST:**

- Rollen in `src/lib/rbac-system.ts` und DB definiert
- Keine `policies/roles.json` vorhanden

**Empfehlung:**

- `policies/roles.json` erstellen mit Office-spezifischen Rollen
- Oder: Doku aktualisieren, dass Rollen in DB verwaltet werden

**Datei:** `policies/roles.json`  
**Zeile:** Datei existiert nicht

---

## ✅ POSITIVE BEFUNDE

1. ✅ **Sidebar-Menü:** Exakt wie in Doku spezifiziert
2. ✅ **Basis-API-Routen:** Alle Hauptlisten-Routen (GET, POST) vorhanden
3. ✅ **UTF-8:** Korrekt in Schema (`utf8mb4_unicode_ci`)
4. ✅ **Audit-Trail:** `lopez_audit_logs` vorhanden und verwendet
5. ✅ **Compliance-Hinweise:** GoBD/DSGVO/ISO27001 in STATUS.md vorhanden

---

## 📋 ZUSAMMENFASSUNG

| Kategorie      | Status               | Anzahl |
| -------------- | -------------------- | ------ |
| ✅ **PASS**    | Korrekt              | 17     |
| ⚠️ **WARNUNG** | Verbesserung möglich | 2      |
| ❌ **FAIL**    | Fehler/Auslassung    | 10     |

**Gesamtbewertung:** ❌ **FAIL**

**Kritische Fehler:** 10 fehlende API-Routen

**Empfohlene Maßnahmen:**

1. Alle fehlenden `[id]`-Routen implementieren (orders, tasks, appointments, invoices)
2. Spezielle Routen implementieren (ical/export, pdf, status, einvoice/\*)
3. `policies/roles.json` erstellen oder Doku aktualisieren

---

**Validierungszeitpunkt:** 2025-11-01  
**Nächste Prüfung:** Nach Implementierung der fehlenden Routen
