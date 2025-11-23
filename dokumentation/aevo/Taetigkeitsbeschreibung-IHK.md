# Tätigkeitsbeschreibung – Praxiserfahrungsnachweis IHK

**Projekt:** Lopez IT Welt Enterprise++  
**Zeitraum:** 2023–2025 (laufend)  
**Zweck:** Praxiserfahrungsnachweis für fachliche Eignung als Ausbilder im IT-Bereich

---

## Kurze Einordnung des Projekts

Lopez IT Welt ist eine Enterprise-IT-Plattform für Managed Services, Cloud-Lösungen und SaaS-Angebote. Das System basiert auf einem modernen Full-Stack-Ansatz mit Next.js 14/15 (React 18, TypeScript) im Frontend, Node.js im Backend und MySQL/MariaDB als Datenbank. Die Architektur folgt Enterprise++-Standards mit Multi-Tenant-Fähigkeit, rollenbasierter Zugriffskontrolle (RBAC), vollständiger Audit-Protokollierung und Compliance mit GoBD, DSGVO und ISO 27001. Das System umfasst ein Admin-Dashboard, ein Shop-System, Office- und Finance-Management, Zeiterfassung, Kundenverwaltung sowie umfassende Backup- und Monitoring-Systeme.

---

## Praktische Tätigkeiten nach Bereichen

### 1. Webentwicklung / Frontend

**Zeitraum:** Seit 2023 laufend, Schwerpunkt 2024–2025

Ich habe das Frontend der Plattform mit Next.js 14/15, React 18 und TypeScript entwickelt. Dabei habe ich:

- **Komponentenarchitektur** aufgebaut: Wiederverwendbare UI-Komponenten mit Tailwind CSS (Card, Dialog, Navigation, Formulare) erstellt und ein konsistentes Design-System implementiert.
- **Admin-Dashboard** entwickelt: Vollständiges Admin-Interface mit modularem Navigationssystem, Dashboard-Übersichten, Kundenverwaltung, Content-Management und Office- & Finance-Modulen.
- **Barrierefreiheit** umgesetzt: WCAG 2.1-konforme Implementierung mit Screen-Reader-Support, Tastaturnavigation und semantischem HTML.
- **Internationalisierung** implementiert: Mehrsprachigkeit (Deutsch, Englisch, Spanisch) mit i18n-Integration.
- **Responsive Design** realisiert: Mobile-first-Ansatz mit Tailwind CSS für alle Bildschirmgrößen.
- **A/B-Testing-System** integriert: Frontend-Integration für Experimente mit Varianten-Zuweisung und Event-Tracking.

**Verwendete Technologien:** Next.js 14/15, React 18, TypeScript, Tailwind CSS, Framer Motion, React Icons, Lucide React

---

### 2. Backend & Datenbanken

**Zeitraum:** Seit 2023 laufend, Schwerpunkt 2024–2025

Ich habe die Backend-Architektur und Datenbankstruktur konzipiert und umgesetzt:

- **Datenbankdesign** erstellt: Vollständiges relationales Datenbankschema mit über 30 Tabellen für ERP, Office-Management, Shop, Authentifizierung, Audit-Logs, Zeiterfassung und Compliance-Systeme. Alle Tabellen verwenden UTF-8 (utf8mb4_unicode_ci) für korrekte Umlaut-Darstellung.
- **API-Architektur** entwickelt: RESTful API mit Next.js API Routes für über 50 Endpoints (Projekte, Aufträge, Aufgaben, Rechnungen, Kunden, Zeiterfassung, A/B-Testing, E-Rechnung).
- **Datenbankmigrationen** durchgeführt: SQL-Schema-Dateien für alle Module erstellt, Migrationen geplant und umgesetzt, Idempotenz sichergestellt.
- **Performance-Optimierung** implementiert: Indizes auf kritischen Spalten, Foreign Keys für Datenintegrität, Query-Optimierung, Connection-Pooling mit MySQL2.
- **Datenintegrität** sichergestellt: Transaktionsmanagement, Foreign Key Constraints, ENUM-Typen für Status-Felder, Timestamps für Audit-Trails.

**Verwendete Technologien:** MySQL/MariaDB, MySQL2 (Node.js), Next.js API Routes, TypeScript, SQL

---

### 3. Authentifizierung & Sicherheit

**Zeitraum:** Seit 2024, kontinuierliche Weiterentwicklung

Ich habe ein mehrschichtiges Sicherheitssystem implementiert:

- **Passwort-Hashing** mit Argon2id: Enterprise-konforme Implementierung mit Salt, Pepper und konfigurierbaren Parametern (Memory Cost: 64 MB, Time Cost: 3, Parallelism: 4).
- **Zwei-Faktor-Authentifizierung (2FA)** implementiert: TOTP-basiertes System (Aegis-kompatibel, 30 Sekunden Intervalle, 6-stellige Codes) mit QR-Code-Generierung und Backup-Codes.
- **Rollenbasierte Zugriffskontrolle (RBAC)** entwickelt: Granulares Berechtigungssystem mit Rollen (Admin, CTO, Finance Manager, Project Lead, Support, User) und permissions-basierter Zugriffskontrolle auf API-Ebene.
- **Dual-Authentifizierung** realisiert: Separate Login-Systeme für Admin-Bereich (Username/E-Mail + 2FA-Pflicht) und Shop-Bereich (E-Mail, 2FA optional).
- **Session-Management** implementiert: JWT-basierte Sessions mit 24-Stunden-Gültigkeit, automatische Session-Validierung, Logout-Funktionalität.
- **Audit-Logging** eingerichtet: Vollständige Protokollierung aller Authentifizierungs-Events (Login, Logout, 2FA-Setup, 2FA-Verifikation) mit IP-Adresse, User-Agent und Timestamp.

**Verwendete Technologien:** Argon2, Speakeasy (TOTP), JSON Web Tokens (JWT), QRCode, Node.js Crypto

---

### 4. Admin-Dashboard & Shop

**Zeitraum:** Seit 2024, kontinuierliche Erweiterung

Ich habe umfassende Verwaltungs- und Shop-Funktionen entwickelt:

- **Admin-Dashboard** aufgebaut: Modulares Dashboard mit Navigation, Übersichtsseiten, KPI-Anzeigen und modularen Unterseiten für verschiedene Bereiche.
- **Kundenverwaltung** implementiert: Vollständiges CRM-System mit Kundenliste, Kunden-Erstellung, Import-Funktionen, Statistiken, Filterung und Suche.
- **Content-Management** entwickelt: Verwaltung von Seiten, Header/Footer, Hero-Section, Texten, Übersetzungen, Medien-Upload und Navigation.
- **Office & Finance Management** erstellt: Vollständiges System für Projekte, Aufträge, Aufgaben (Kanban), Termine/Kalender, Rechnungen (GoBD-konform), E-Rechnung (XRechnung/ZUGFeRD), Reporting und Audit/Compliance.
- **Zeiterfassung** implementiert: Automatische und manuelle Zeiterfassung mit Timer-Komponente, Session-Management, Abrechnungs-Flags, Projekt-/Auftrags-/Aufgaben-Verknüpfung, Analytics und Export-Funktionen.
- **A/B-Testing-Dashboard** entwickelt: Experiment-Verwaltung, Varianten-Konfiguration, Statistiken und globale Einstellungen.
- **Export-Funktionen** implementiert: PDF-Generierung (jsPDF), Excel-Export (ExcelJS), CSV-Export für verschiedene Datenbereiche.

**Verwendete Technologien:** Next.js, React, TypeScript, Tailwind CSS, jsPDF, ExcelJS, XLSX

---

### 5. Server & Systemintegration

**Zeitraum:** Seit 2024, Planung und Umsetzung

Ich habe die Server-Infrastruktur geplant und integriert:

- **Lokale Entwicklungsumgebung** eingerichtet: XAMPP-basierte Entwicklungsumgebung mit MySQL/MariaDB, Konfiguration und Optimierung.
- **Server-Planung** durchgeführt: Umfassende Planung für Staging- und Produktions-Umgebungen (Netcup-Server, Debian 12), Docker-Konfiguration, Nginx-Setup, SSL-Zertifikate (Let's Encrypt).
- **Backup-System** entwickelt: Automatisiertes Backup-System mit mehreren Strategien:
  - Vollständige Projekt-Backups (Dateien + Datenbank)
  - Compliance-Backups (täglich für Rechnungen und Audit-Logs mit SHA-256-Hashes)
  - Incremental Backups
  - MySQL-Dumps mit UTF-8-Kodierung
  - Backup-Verifikation und Integritätsprüfung
- **Monitoring** geplant: Konzepte für Prometheus, Grafana, ELK-Stack (Elasticsearch, Logstash, Kibana) erstellt.
- **CI/CD-Pipeline** konzipiert: GitHub Actions Workflows für automatisiertes Testing, Security-Scans und Deployment geplant.

**Verwendete Technologien:** XAMPP, MySQL/MariaDB, Node.js, Shell-Skripte, Docker (geplant), Nginx (geplant)

---

### 6. Dokumentation & Prozesse

**Zeitraum:** Seit 2023 laufend, kontinuierliche Pflege

Ich habe umfassende technische Dokumentation erstellt und Prozesse etabliert:

- **Projekt-Dokumentation** erstellt: Strukturierte Dokumentation in Markdown mit über 100 Dokumentationsdateien, gegliedert nach Bereichen (Architektur, Entwicklung, Enterprise, Admin, Qualität, Business).
- **Status-Management** implementiert: STATUS.md als Single Source of Truth für Projektstatus, kontinuierliche Aktualisierung, Change-Log-System.
- **Migration-Planung** dokumentiert: MIGRATION_PLAN.md für Datenbank-Wiederherstellung, Schritt-für-Schritt-Anleitungen, Rollback-Strategien.
- **Backup-Konzepte** dokumentiert: Vollständige Dokumentation des Backup-Systems mit Strategien, RPO/RTO-Definitionen, Verifikationsprozessen.
- **Enterprise++-Workflow** etabliert: Verbindliche Arbeitsweise mit Freigabe-Gates, Read-only-Analyse vor Änderungen, vollständige Dokumentation nach jedem Schritt.
- **Compliance-Dokumentation** erstellt: GoBD-, DSGVO- und ISO-27001-konforme Dokumentation, Audit-Trail-Dokumentation, Hash-Verifikationsprozesse.
- **API-Dokumentation** erstellt: Vollständige API-Dokumentation für alle Endpoints mit Request/Response-Beispielen, Fehlerbehandlung und Authentifizierung.

**Verwendete Technologien:** Markdown, Git, Node.js-Skripte für Dokumentations-Generierung

---

## Zusammenfassung der technischen Kompetenzen

Durch die Arbeit an diesem Projekt habe ich umfassende praktische Erfahrung in folgenden Bereichen gesammelt:

- **Frontend-Entwicklung:** Next.js, React, TypeScript, Tailwind CSS, responsive Design, Barrierefreiheit
- **Backend-Entwicklung:** Node.js, RESTful APIs, Datenbankdesign, Performance-Optimierung
- **Sicherheit:** Argon2-Passwort-Hashing, 2FA (TOTP), RBAC, JWT-Sessions, Audit-Logging
- **Datenbanken:** MySQL/MariaDB, Schema-Design, Migrationen, Performance-Optimierung, UTF-8-Handling
- **DevOps:** Backup-Systeme, Server-Planung, Monitoring-Konzepte, CI/CD-Pipeline-Planung
- **Compliance:** GoBD, DSGVO, ISO 27001, Audit-Trails, Hash-Verifikation
- **Dokumentation:** Technische Dokumentation, Prozess-Dokumentation, API-Dokumentation

**Besondere Stärken:**
- Systematische Herangehensweise an komplexe Projekte
- Fokus auf Enterprise-Standards und Compliance
- Umfassende Dokumentation und Prozess-Etablierung
- Sicherheitsbewusstsein und Best Practices

---

**Erstellt:** 2025-01-19  
**Status:** Für IHK-Einreichung vorbereitet

