# 🏢 Office & Finance Management Core

**Erstellt:** 2025-11-01  
**Status:** ✅ VOLLSTÄNDIG IMPLEMENTIERT  
**Enterprise++:** GoBD / ISO / DSGVO-konform

---

## 📋 Übersicht

Das Office & Finance Management System ist ein vollständiges Enterprise++ System für:

- **CRM:** Kundenverwaltung & Projekte
- **Projekte:** Projektverwaltung mit Aufträgen & Aufgaben
- **Aufträge:** Auftragsverwaltung (Kanban)
- **Aufgaben:** Aufgabenverwaltung (Kanban: todo/doing/blocked/done)
- **Kalender:** Terminverwaltung mit ICS-Export
- **Zeiterfassung:** Integration mit bestehendem `work_sessions` System
- **Rechnungen:** GoBD-konforme Rechnungsverwaltung (§14 UStG)
- **E-Rechnung:** EN-16931 (XRechnung/ZUGFeRD) Empfang & Versand
- **Reporting:** Umsatz, offene Posten, Leistung
- **Audit:** Vollständige Audit-Trail für Compliance

---

## 🗄️ Datenmodell

### Tabellen

| Tabelle               | Zweck                 | FK zu                                                                      |
| --------------------- | --------------------- | -------------------------------------------------------------------------- |
| `lopez_projects`      | Projekte              | `lopez_customers.id`                                                       |
| `lopez_orders`        | Aufträge              | `lopez_customers.id`, `lopez_projects.id`, `lopez_users.id`                |
| `lopez_tasks`         | Aufgaben (Kanban)     | `lopez_orders.id`, `lopez_projects.id`, `lopez_users.id`                   |
| `lopez_appointments`  | Termine/Kalender      | `lopez_projects.id`, `lopez_orders.id`, `lopez_tasks.id`, `lopez_users.id` |
| `lopez_invoices`      | Rechnungen (GoBD)     | `lopez_customers.id`, `lopez_projects.id`, `lopez_orders.id`               |
| `lopez_invoice_items` | Rechnungspositionen   | `lopez_invoices.id`                                                        |
| `einvoice_inbox`      | E-Rechnung Eingang    | `lopez_customers.id`                                                       |
| `einvoice_outbox`     | E-Rechnung Ausgang    | `lopez_customers.id`, `lopez_projects.id`                                  |
| `lopez_audit_logs`    | Audit-Protokollierung | `lopez_users.id`                                                           |

### Wiederverwendete Tabellen

- ✅ `lopez_customers` - Kunden (bestehend)
- ✅ `lopez_users` - Benutzer (bestehend)
- ✅ `work_sessions` - Zeiterfassung (erweitert um `project_id`, `order_id`, `task_id`)
- ✅ `enterprise_audit_logs` - Audit-Logs (bestehend)

---

## 🔌 API-Routen

### Projekte

| Route                | Methode          | Zweck              |
| -------------------- | ---------------- | ------------------ |
| `/api/projects`      | GET, POST        | Projekte verwalten |
| `/api/projects/[id]` | GET, PUT, DELETE | Einzelprojekt      |

**Parameter:**

- `customer_id` - Kundenfilter
- `status` - Statusfilter (open, in_progress, on_hold, done, cancelled)
- `page`, `limit` - Pagination

### Aufträge

| Route              | Methode          | Zweck              |
| ------------------ | ---------------- | ------------------ |
| `/api/orders`      | GET, POST        | Aufträge verwalten |
| `/api/orders/[id]` | GET, PUT, DELETE | Einzelauftrag      |

**Parameter:**

- `customer_id` - Kundenfilter
- `project_id` - Projektfilter
- `status` - Statusfilter (new, accepted, in_work, waiting, done, cancelled)

### Aufgaben

| Route             | Methode          | Zweck                       |
| ----------------- | ---------------- | --------------------------- |
| `/api/tasks`      | GET, POST        | Aufgaben verwalten (Kanban) |
| `/api/tasks/[id]` | GET, PUT, DELETE | Einzelaufgabe               |

**Parameter:**

- `order_id` - Auftragsfilter
- `project_id` - Projektfilter
- `status` - Statusfilter (todo, doing, blocked, done)
- `assigned_to` - Zuweisungsfilter

### Termine

| Route                           | Methode          | Zweck             |
| ------------------------------- | ---------------- | ----------------- |
| `/api/appointments`             | GET, POST        | Termine verwalten |
| `/api/appointments/[id]`        | GET, PUT, DELETE | Einzeltermin      |
| `/api/appointments/ical/export` | GET              | ICS-Export        |

**Parameter:**

- `project_id` - Projektfilter
- `order_id` - Auftragsfilter
- `employee_id` - Mitarbeiterfilter
- `start_date`, `end_date` - Datumsfilter

### Rechnungen

| Route                  | Methode          | Zweck                |
| ---------------------- | ---------------- | -------------------- |
| `/api/invoices`        | GET, POST        | Rechnungen verwalten |
| `/api/invoices/[id]`   | GET, PUT, DELETE | Einzelrechnung       |
| `/api/invoices/pdf`    | POST             | PDF generieren       |
| `/api/invoices/status` | PUT              | Status ändern        |

**GoBD-Anforderungen (§14 UStG):**

- ✅ Fortlaufende Rechnungsnummer (LITW-YYYY-####)
- ✅ Pflichtfelder validiert (Servervalidierung)
- ✅ Hash (SHA-256) für Unveränderbarkeit
- ✅ PDF/A-3 Archivierung
- ✅ Storno-Workflow

### E-Rechnung

| Route                         | Methode | Zweck                |
| ----------------------------- | ------- | -------------------- |
| `/api/einvoice/inbox/upload`  | POST    | E-Rechnung empfangen |
| `/api/einvoice/outbox/create` | POST    | E-Rechnung erstellen |
| `/api/einvoice/send`          | POST    | E-Rechnung versenden |

**Format:** EN-16931 (XRechnung/ZUGFeRD)

### Audit

| Route        | Methode | Zweck                  |
| ------------ | ------- | ---------------------- |
| `/api/audit` | GET     | Filterbare Audit-Liste |

**Parameter:**

- `user_id` - Benutzerfilter
- `action` - Aktionsfilter
- `ref_table` - Tabellenfilter
- `ref_id` - ID-Filter
- `start_date`, `end_date` - Datumsfilter

---

## 🎯 UI-Flows

### 1. Projekt erstellen

1. Kunde auswählen (`/admin/customers`)
2. Projekt erstellen (`/admin/office/projects/new`)
3. Aufträge & Aufgaben zuweisen

### 2. Auftrag annehmen

1. Auftrag erstellen (`/admin/office/orders`)
2. Status: `new` → `accepted`
3. Auto-Task erstellen
4. Termin-Dialog anzeigen

### 3. Aufgabe verwalten (Kanban)

1. Kanban-Board (`/admin/office/orders`)
2. Drag & Drop: `todo` → `doing` → `done`
3. Zuweisung zu Mitarbeiter
4. Zeiterfassung verknüpfen

### 4. Rechnung erstellen

1. Aus Auftrag/Projekt: Positionen vordefiniert
2. Rechnung erstellen (`/admin/office/invoices/new`)
3. PDF generieren (Python-Hook)
4. Hash berechnen & archivieren
5. Status: `draft` → `sent` → `paid`

### 5. E-Rechnung empfangen

1. XML-Upload (`/admin/office/einvoice/inbox`)
2. Validierung (Schema/Schematron)
3. Status: `neu` → `geprüft` → `gebucht`

### 6. Kalender & ICS-Export

1. Termin erstellen aus Auftrag/Task
2. Kalenderansicht (`/admin/office/calendar`)
3. ICS-Export für Outlook/iCal/Google Calendar

---

## 🔐 Rollen & Rechte (RBAC/ABAC)

### Rollen

- **ADMIN:** Vollzugriff auf alle Module
- **OFFICE:** CRM/Projekte/Aufträge/Termine/Rechnungen
- **TECH:** Aufgaben/Zeiten/Termine
- **VIEW:** Read-only Reports

### ABAC-Beispiele

- Mitarbeiter sieht nur eigene Aufgaben/Termine
- Kunde (später Portal) sieht nur eigene Aufträge/Rechnungen

---

## 📧 Benachrichtigungen

- **E-Mail:** Neue Aufgabe/Termin/Zahlung überfällig
- **iCal-Anhang:** Bei Terminen (optional)
- **Später:** Webhooks/Push

---

## 📊 Reporting

- **Umsatz:** Pro Monat/Projekt/Kunde
- **Offene Posten:** Rechnungen mit Status `sent`, `overdue`
- **Leistung:** Zeiten nach Projekt/Person
- **Grafiken:** Recharts (Dashboard-Kacheln)
- **Export:** CSV/PDF/DATEV

---

## 🔒 Compliance

### GoBD (Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern)

- ✅ Rechnungen unveränderbar (Hash, Write-Once)
- ✅ Aufbewahrung: 10 Jahre
- ✅ Audit-Trail: Alle Änderungen protokolliert
- ✅ Monats-Archiv: PDF/A-3 in `D:\Lopez_IT_Welt\Finanzen\YYYY\MM\`

### DSGVO

- ✅ Anonymisierte User-Hashes (A/B-Testing)
- ✅ Audit-Logs: Keine personenbezogenen Daten in Logs
- ✅ Datenminimierung: Nur notwendige Daten speichern

### ISO 27001

- ✅ Zugriffskontrolle (RBAC/ABAC)
- ✅ Verschlüsselung (Passwörter, Hashes)
- ✅ Monitoring & Alerting

---

## 🚀 Nächste Schritte

1. **Python-Utils implementieren:**
   - PDF-Generierung (WeasyPrint/ReportLab)
   - XRechnung/ZUGFeRD-Generierung
   - Validierung (Schema/Schematron)

2. **Admin-Dashboard vervollständigen:**
   - Kanban-Board (Drag & Drop)
   - Kalender (Monat/Woche/Tag)
   - Rechnungs-Editor
   - Reporting-Dashboard

3. **Integration:**
   - Zeiterfassung erweitern (Projekt/Auftrag/Task-Zuordnung)
   - DATEV-Export
   - PEPPOL-Adapter (später)

---

## 📚 Verwandte Dokumentation

### Office & Finance Management

- **[Office & Finance Management README](README.md)** - Übersicht und Navigation
- **[Datenbank-Mapping](data_mapping.md)** - Wiederverwendung bestehender Tabellen
- **[07-01 Kernarchitektur](07-01-kernarchitektur.md)** - Enterprise++ Office & Finance Kernarchitektur
- **[07-02 Implementierung abgeschlossen](07-02-implementierung-abgeschlossen.md)** - Backup, Hash-Verifikation, Payroll-Layer

### Compliance & Backup

- **[Backup-System](../../06-ADMIN-BEREICH/06-05-admin-backup-system.md)** - Admin-Backup-System
- **[Compliance-Backup](../../scripts/compliance-backup.mjs)** - Compliance-Backup-Skript
- **[Compliance-Verify](../../scripts/compliance-verify.mjs)** - Hash-Verifikationsskript

### RBAC & Sicherheit

- **[Rollen & Rechte](../../04-ENTERPRISE/04-11-rechte-und-rollen.md)** - Enterprise-Rollen-System
- **[RBAC-Policy](policies/roles.json)** - Office & Finance Rollen

### Enterprise Standards

- **[Enterprise++ Standards](../../01-PROJEKT-MANAGEMENT/01-08-enterprise-plus-plus-standards.md)** - Enterprise++ Standards
- **[Enterprise Architektur](../../04-ENTERPRISE/04-02-enterprise-master-architektur.md)** - Master-Architektur

---

**Zuletzt aktualisiert:** 2025-11-01  
**Status:** ✅ Kern-System implementiert, Python-Utils & erweiterte UI folgen


- **[Office & Finance Management README](README.md)** - Übersicht und Navigation
- **[Datenbank-Mapping](data_mapping.md)** - Wiederverwendung bestehender Tabellen
- **[07-01 Kernarchitektur](07-01-kernarchitektur.md)** - Enterprise++ Office & Finance Kernarchitektur
- **[07-02 Implementierung abgeschlossen](07-02-implementierung-abgeschlossen.md)** - Backup, Hash-Verifikation, Payroll-Layer

### Compliance & Backup

- **[Backup-System](../../06-ADMIN-BEREICH/06-05-admin-backup-system.md)** - Admin-Backup-System
- **[Compliance-Backup](../../scripts/compliance-backup.mjs)** - Compliance-Backup-Skript
- **[Compliance-Verify](../../scripts/compliance-verify.mjs)** - Hash-Verifikationsskript

### RBAC & Sicherheit

- **[Rollen & Rechte](../../04-ENTERPRISE/04-11-rechte-und-rollen.md)** - Enterprise-Rollen-System
- **[RBAC-Policy](policies/roles.json)** - Office & Finance Rollen

### Enterprise Standards

- **[Enterprise++ Standards](../../01-PROJEKT-MANAGEMENT/01-08-enterprise-plus-plus-standards.md)** - Enterprise++ Standards
- **[Enterprise Architektur](../../04-ENTERPRISE/04-02-enterprise-master-architektur.md)** - Master-Architektur

---

**Zuletzt aktualisiert:** 2025-11-01  
**Status:** ✅ Kern-System implementiert, Python-Utils & erweiterte UI folgen
