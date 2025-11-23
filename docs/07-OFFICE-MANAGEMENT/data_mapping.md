# 📋 Datenbank-Mapping: Office & Finance Management

**Erstellt:** 2025-10-31  
**Zweck:** Dokumentation der Wiederverwendung bestehender Tabellen und Mapping zu neuen Strukturen  
**Status:** ✅ VOLLSTÄNDIG DOKUMENTIERT

---

## 📋 Inhaltsverzeichnis

- [Prinzipien](#-prinzipien)
- [Bestehende Tabellen (Wiederverwendung)](#-bestehende-tabellen-wiederverwendung)
  - [1. Kundenverwaltung](#1-kundenverwaltung)
  - [2. Benutzer & Rollen](#2-benutzer--rollen)
  - [3. Zeiterfassung](#3-zeiterfassung)
  - [4. Audit-Logs](#4-audit-logs)
- [Neue Tabellen (Office & Finance)](#-neue-tabellen-office--finance)
  - [1. Projekte](#1-projekte)
  - [2. Aufträge](#2-aufträge)
  - [3. Aufgaben](#3-aufgaben)
  - [4. Termine](#4-termine)
  - [5. Rechnungen](#5-rechnungen)
  - [6. E-Rechnung](#6-e-rechnung)
- [Foreign Keys & Beziehungen](#-foreign-keys--beziehungen)
- [Migration & Mapping](#-migration--mapping)
- [Verwandte Dokumentation](#-verwandte-dokumentation)

---

## 🎯 Prinzipien

- ✅ **Keine Duplikate:** Bestehende Tabellen werden wiederverwendet
- ✅ **Ergänzung statt Neuschöpfung:** Nur fehlende Strukturen werden angelegt
- ✅ **Migration/Mapping:** Bestehende Daten werden in neue Strukturen übernommen

---

## 📊 Bestehende Tabellen (Wiederverwendung)

### 1. Kundenverwaltung

| Tabelle                    | Verwendungszweck                           | Status              |
| -------------------------- | ------------------------------------------ | ------------------- |
| `lopez_customers`          | Zentrale Kunden-Datenbank                  | ✅ Wiederverwendung |
| `lopez_customer_addresses` | Adressverwaltung                           | ✅ Wiederverwendung |
| `lopez_customer_contacts`  | Kontakthistorie                            | ✅ Wiederverwendung |
| `lopez_customer_documents` | Dokumente (Verträge, Angebote, Rechnungen) | ✅ Wiederverwendung |
| `lopez_customer_tags`      | Kategorisierung                            | ✅ Wiederverwendung |

**API-Routen:**

- ✅ `/api/admin/customers` - CRUD-Operationen
- ✅ `/api/admin/customers/[id]` - Einzelkunde
- ✅ `/api/admin/customers/search` - Suche & Filter

**Admin-Seiten:**

- ✅ `/admin/customers` - Kundenliste
- ✅ `/admin/customers/new` - Neuer Kunde
- ✅ `/admin/customers/[id]` - Kundendetails

---

### 2. Benutzer & Rollen

| Tabelle                            | Verwendungszweck    | Status              |
| ---------------------------------- | ------------------- | ------------------- |
| `lopez_users` / `lopez_core_users` | Benutzer-Management | ✅ Wiederverwendung |
| `lopez_roles`                      | Rollen-System       | ✅ Wiederverwendung |
| `lopez_permissions`                | Berechtigungen      | ✅ Wiederverwendung |

**Verwendung:**

- Mitarbeiter-Zuweisung in Projekten/Aufträgen/Aufgaben
- Zeiterfassung pro Mitarbeiter
- Audit-Logs mit User-ID

---

### 3. Zeiterfassung

| Tabelle               | Verwendungszweck             | Status              |
| --------------------- | ---------------------------- | ------------------- |
| `work_sessions`       | Zeiterfassung (Haupttabelle) | ✅ Wiederverwendung |
| `work_session_breaks` | Pausen                       | ✅ Wiederverwendung |

**Mapping zu Office-System:**

- `work_sessions.project_id` → `lopez_projects.id` (neu, FK)
- `work_sessions.order_id` → `lopez_orders.id` (neu, FK)
- `work_sessions.task_id` → `lopez_tasks.id` (neu, FK)

**API-Routen:**

- ✅ `/api/time-tracking` (vermutlich vorhanden)
- 🔄 Erweitern um Projekt/Auftrag/Task-Zuordnung

**Admin-Seiten:**

- ✅ `/admin/time-tracking` - Zeiterfassung (bestehend)
- 🔄 Erweitern um Projekt-/Auftrag-Filter

---

### 4. Audit & Compliance

| Tabelle                       | Verwendungszweck      | Status              |
| ----------------------------- | --------------------- | ------------------- |
| `enterprise_audit_logs`       | Audit-Protokollierung | ✅ Wiederverwendung |
| `enterprise_audit_categories` | Kategorien            | ✅ Wiederverwendung |
| `enterprise_audit_stats`      | Statistiken           | ✅ Wiederverwendung |

**Verwendung:**

- Alle Änderungen in Projekten/Aufträgen/Aufgaben/Rechnungen protokollieren
- Compliance-Reporting (GoBD, ISO, DSGVO)

**API-Routen:**

- 🔄 `/api/audit` - Filterbare Audit-Liste (neu)

**Admin-Seiten:**

- ✅ `/admin/audit-logs` - Audit-Logs (bestehend)
- 🔄 Erweitern um Office-Filter

---

### 5. Content-System

| Tabelle     | Verwendungszweck   | Status              |
| ----------- | ------------------ | ------------------- |
| `content_*` | Content-Management | ✅ Wiederverwendung |
| `ab_*`      | A/B-Testing        | ✅ Wiederverwendung |

**Keine Änderungen erforderlich** - wird nicht für Office & Finance verwendet.

---

## 🆕 Neue Tabellen (Nur Ergänzung)

### 1. Projekte

| Tabelle          | Zweck             | FK zu                |
| ---------------- | ----------------- | -------------------- |
| `lopez_projects` | Projektverwaltung | `lopez_customers.id` |

**Beziehung:**

- Ein Kunde → mehrere Projekte
- Ein Projekt → mehrere Aufträge
- Ein Projekt → mehrere Aufgaben
- Ein Projekt → mehrere Termine

---

### 2. Aufträge

| Tabelle        | Zweck              | FK zu                                                       |
| -------------- | ------------------ | ----------------------------------------------------------- |
| `lopez_orders` | Auftragsverwaltung | `lopez_customers.id`, `lopez_projects.id`, `lopez_users.id` |

**Beziehung:**

- Ein Auftrag → kann zu einem Projekt gehören
- Ein Auftrag → kann mehrere Aufgaben haben
- Ein Auftrag → kann eine Rechnung generieren

---

### 3. Aufgaben

| Tabelle       | Zweck                       | FK zu                                                    |
| ------------- | --------------------------- | -------------------------------------------------------- |
| `lopez_tasks` | Aufgabenverwaltung (Kanban) | `lopez_orders.id`, `lopez_projects.id`, `lopez_users.id` |

**Beziehung:**

- Eine Aufgabe → kann zu einem Auftrag gehören
- Eine Aufgabe → kann zu einem Projekt gehören
- Eine Aufgabe → kann zu einem Termin führen
- Eine Aufgabe → kann Zeiterfassung haben

---

### 4. Termine & Kalender

| Tabelle              | Zweck            | FK zu                                                                      |
| -------------------- | ---------------- | -------------------------------------------------------------------------- |
| `lopez_appointments` | Terminverwaltung | `lopez_projects.id`, `lopez_orders.id`, `lopez_tasks.id`, `lopez_users.id` |

**Beziehung:**

- Ein Termin → kann zu einem Projekt/Auftrag/Aufgabe gehören
- Ein Termin → kann mehreren Mitarbeitern zugewiesen werden (später)

---

### 5. Rechnungen

| Tabelle               | Zweck                      | FK zu                                                        |
| --------------------- | -------------------------- | ------------------------------------------------------------ |
| `lopez_invoices`      | Rechnungsverwaltung (GoBD) | `lopez_customers.id`, `lopez_projects.id`, `lopez_orders.id` |
| `lopez_invoice_items` | Rechnungspositionen        | `lopez_invoices.id`                                          |

**Beziehung:**

- Eine Rechnung → gehört zu einem Kunden
- Eine Rechnung → kann zu einem Projekt/Auftrag gehören
- Eine Rechnung → hat mehrere Positionen

---

### 6. E-Rechnung

| Tabelle           | Zweck             | FK zu                                     |
| ----------------- | ----------------- | ----------------------------------------- |
| `einvoice_inbox`  | Eingang (Empfang) | `lopez_customers.id`                      |
| `einvoice_outbox` | Ausgang (Versand) | `lopez_customers.id`, `lopez_projects.id` |

**Beziehung:**

- E-Rechnung Eingang → kann zu einem Kunden gehören
- E-Rechnung Ausgang → gehört zu einem Kunden/Projekt

---

## 🔄 Migration & Mapping

### Bestehende Daten → Neue Strukturen

**Zeiterfassung erweitern:**

```sql
-- Spalten hinzufügen (falls nicht vorhanden)
ALTER TABLE work_sessions
ADD COLUMN project_id INT NULL AFTER session_id,
ADD COLUMN order_id INT NULL AFTER project_id,
ADD COLUMN task_id INT NULL AFTER order_id,
ADD FOREIGN KEY (project_id) REFERENCES lopez_projects(id),
ADD FOREIGN KEY (order_id) REFERENCES lopez_orders(id),
ADD FOREIGN KEY (task_id) REFERENCES lopez_tasks(id);
```

**Rechnungen aus Dokumenten:**

- Bestehende Rechnungen in `lopez_customer_documents` (document_type='rechnung')
- → Bei Bedarf in `lopez_invoices` migrieren (optional)

---

## 📋 API-Routen Mapping

| Route                           | Methode          | Zweck                | Status       |
| ------------------------------- | ---------------- | -------------------- | ------------ |
| `/api/projects`                 | GET, POST        | Projekte verwalten   | 🆕 Neu       |
| `/api/projects/[id]`            | GET, PUT, DELETE | Einzelprojekt        | 🆕 Neu       |
| `/api/orders`                   | GET, POST        | Aufträge verwalten   | 🆕 Neu       |
| `/api/orders/[id]`              | GET, PUT, DELETE | Einzelauftrag        | 🆕 Neu       |
| `/api/tasks`                    | GET, POST        | Aufgaben verwalten   | 🆕 Neu       |
| `/api/tasks/[id]`               | GET, PUT, DELETE | Einzelaufgabe        | 🆕 Neu       |
| `/api/appointments`             | GET, POST        | Termine verwalten    | 🆕 Neu       |
| `/api/appointments/[id]`        | GET, PUT, DELETE | Einzeltermin         | 🆕 Neu       |
| `/api/appointments/ical/export` | GET              | ICS-Export           | 🆕 Neu       |
| `/api/invoices`                 | GET, POST        | Rechnungen verwalten | 🆕 Neu       |
| `/api/invoices/[id]`            | GET, PUT, DELETE | Einzelrechnung       | 🆕 Neu       |
| `/api/invoices/pdf`             | POST             | PDF generieren       | 🆕 Neu       |
| `/api/invoices/status`          | PUT              | Status ändern        | 🆕 Neu       |
| `/api/einvoice/inbox/upload`    | POST             | E-Rechnung empfangen | 🆕 Neu       |
| `/api/einvoice/outbox/create`   | POST             | E-Rechnung erstellen | 🆕 Neu       |
| `/api/einvoice/send`            | POST             | E-Rechnung versenden | 🆕 Neu       |
| `/api/audit`                    | GET              | Audit-Logs filtern   | 🔄 Erweitern |

**Bestehende Routen (wiederverwenden):**

- ✅ `/api/admin/customers` - Kunden
- ✅ `/api/time-tracking` - Zeiterfassung (erweitern)
- ✅ `/api/admin/audit-logs` - Audit-Logs (erweitern)

---

## 🎯 Admin-Dashboard Mapping

### Neuer Hauptpunkt: "Office & Finanzen"

**Unterseiten:**

1. **CRM & Projekte** (`/admin/office/projects`)
   - Projektliste mit Kunden-Filter
   - Projekt erstellen/bearbeiten
   - Projekt-Details mit Aufträgen/Aufgaben

2. **Aufträge & Aufgaben** (`/admin/office/orders`)
   - Auftragsliste (Kanban)
   - Auftrag erstellen/bearbeiten
   - Aufgaben-Kanban (todo/doing/blocked/done)

3. **Kalender** (`/admin/office/calendar`)
   - Monats-/Wochen-/Tagesansicht
   - Termin erstellen aus Auftrag/Task
   - ICS-Export

4. **Zeiterfassung** (`/admin/time-tracking`)
   - ✅ Bestehend - mit Projekt/Auftrag/Task-Filter erweitern

5. **Rechnungen** (`/admin/office/invoices`)
   - Rechnungsliste
   - Rechnung erstellen (aus Auftrag/Projekt)
   - PDF-Download
   - Status-Management

6. **E-Rechnung** (`/admin/office/einvoice`)
   - Eingang: Empfangene E-Rechnungen prüfen/validieren
   - Ausgang: E-Rechnungen erstellen/versenden

7. **Reporting** (`/admin/office/reporting`)
   - Umsatz pro Monat
   - Offene Posten
   - Leistung/Zeiten nach Projekt/Person

8. **Audit & Compliance** (`/admin/audit-logs`)
   - ✅ Bestehend - mit Office-Filter erweitern

---

## ✅ Checkliste: Duplikat-Vermeidung

- [x] `lopez_customers` - Wiederverwendung (kein Duplikat)
- [x] `lopez_users` - Wiederverwendung (kein Duplikat)
- [x] `work_sessions` - Wiederverwendung (nur erweitern)
- [x] `enterprise_audit_logs` - Wiederverwendung (kein Duplikat)
- [x] `lopez_projects` - Neu (existiert nicht)
- [x] `lopez_orders` - Neu (existiert nicht)
- [x] `lopez_tasks` - Neu (existiert nicht)
- [x] `lopez_appointments` - Neu (existiert nicht)
- [x] `lopez_invoices` - Neu (existiert nicht)
- [x] `einvoice_*` - Neu (existiert nicht)

---

## 📝 Notizen

**Bestehende Projekte:**

- Es existiert keine `projects`-Tabelle in der Hauptdatenbank
- Nur Dokumentation zeigt `projects` als Beispiel (nicht implementiert)

**Bestehende Aufträge:**

- `shop_orders` existiert für Shop-Bestellungen
- Office-Aufträge (`lopez_orders`) sind separat

**Bestehende Rechnungen:**

- Rechnungen sind aktuell nur in `lopez_customer_documents` (document_type='rechnung')
- GoBD-konforme Rechnungsverwaltung (`lopez_invoices`) fehlt

---

**Zuletzt aktualisiert:** 2025-10-31 16:05:00  
**Status:** ✅ Mapping abgeschlossen, bereit für Implementierung

---

## 📚 Verwandte Dokumentation

### Office & Finance Management

- **[Office & Finance Management README](README.md)** - Übersicht und Navigation
- **[Office & Finance Management Core](office_management_core.md)** - Vollständige technische Dokumentation
- **[07-01 Kernarchitektur](07-01-kernarchitektur.md)** - Enterprise++ Office & Finance Kernarchitektur
- **[07-02 Implementierung abgeschlossen](07-02-implementierung-abgeschlossen.md)** - Backup, Hash-Verifikation, Payroll-Layer

### Datenbank & Schema

- **[Office Finance Schema](../../database/office_finance_schema.sql)** - Vollständiges SQL-Schema
- **[Payroll Schema](../../database/payroll_schema.sql)** - Payroll-Datenbank-Schema
- **[Work Sessions Schema](../../database/work_sessions_schema.sql)** - Zeiterfassungs-Schema

### RBAC & Sicherheit

- **[Rollen & Rechte](../../04-ENTERPRISE/04-11-rechte-und-rollen.md)** - Enterprise-Rollen-System
- **[RBAC-Policy](policies/roles.json)** - Office & Finance Rollen

### Enterprise Standards

- **[Enterprise++ Standards](../../01-PROJEKT-MANAGEMENT/01-08-enterprise-plus-plus-standards.md)** - Enterprise++ Standards
- **[Enterprise Architektur](../../04-ENTERPRISE/04-02-enterprise-master-architektur.md)** - Master-Architektur


**Bestehende Projekte:**

- Es existiert keine `projects`-Tabelle in der Hauptdatenbank
- Nur Dokumentation zeigt `projects` als Beispiel (nicht implementiert)

**Bestehende Aufträge:**

- `shop_orders` existiert für Shop-Bestellungen
- Office-Aufträge (`lopez_orders`) sind separat

**Bestehende Rechnungen:**

- Rechnungen sind aktuell nur in `lopez_customer_documents` (document_type='rechnung')
- GoBD-konforme Rechnungsverwaltung (`lopez_invoices`) fehlt

---

**Zuletzt aktualisiert:** 2025-10-31 16:05:00  
**Status:** ✅ Mapping abgeschlossen, bereit für Implementierung

---

## 📚 Verwandte Dokumentation

### Office & Finance Management

- **[Office & Finance Management README](README.md)** - Übersicht und Navigation
- **[Office & Finance Management Core](office_management_core.md)** - Vollständige technische Dokumentation
- **[07-01 Kernarchitektur](07-01-kernarchitektur.md)** - Enterprise++ Office & Finance Kernarchitektur
- **[07-02 Implementierung abgeschlossen](07-02-implementierung-abgeschlossen.md)** - Backup, Hash-Verifikation, Payroll-Layer

### Datenbank & Schema

- **[Office Finance Schema](../../database/office_finance_schema.sql)** - Vollständiges SQL-Schema
- **[Payroll Schema](../../database/payroll_schema.sql)** - Payroll-Datenbank-Schema
- **[Work Sessions Schema](../../database/work_sessions_schema.sql)** - Zeiterfassungs-Schema

### RBAC & Sicherheit

- **[Rollen & Rechte](../../04-ENTERPRISE/04-11-rechte-und-rollen.md)** - Enterprise-Rollen-System
- **[RBAC-Policy](policies/roles.json)** - Office & Finance Rollen

### Enterprise Standards

- **[Enterprise++ Standards](../../01-PROJEKT-MANAGEMENT/01-08-enterprise-plus-plus-standards.md)** - Enterprise++ Standards
- **[Enterprise Architektur](../../04-ENTERPRISE/04-02-enterprise-master-architektur.md)** - Master-Architektur
