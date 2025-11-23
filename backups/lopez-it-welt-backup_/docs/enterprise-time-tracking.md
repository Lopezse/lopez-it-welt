# Enterprise++ Time Tracking System

**Lopez IT Welt - Arbeitszeiterfassung, Tagesziele & Abrechnung**

## 📋 Übersicht

Das **Enterprise++ Time Tracking System** ist ein vollautomatisches System zur Arbeitszeiterfassung, Tagesziel-Tracking und automatischen Rechnungserstellung für IT-Dienstleistungen.

### 🎯 Hauptfunktionen

- ✅ **Automatische Zeiterfassung** - Start/Stop von Arbeitssessions
- ✅ **Task-Management** - Einzelne Aufgaben mit Zeitaufwand
- ✅ **Tagesziele** - Setzen und Überprüfen von Tageszielen
- ✅ **Automatische Abrechnung** - €85/Stunde für IT-Dienstleistungen
- ✅ **Berichte** - Tages-, Wochen- und Monatsberichte
- ✅ **Rechnungserstellung** - Automatische PDF-Rechnungen

## 🚀 Schnellstart

### 1. CLI-System verwenden

```bash
# Time Tracking CLI starten
node scripts/enterprise-time-cli.js
```

**Verfügbare Befehle:**

- `1` - Session starten
- `2` - Session beenden
- `3` - Task hinzufügen
- `4` - Task abschließen
- `5` - Tagesbericht
- `6` - Status anzeigen
- `7` - Beenden

### 2. Admin-Interface verwenden

```
http://localhost:3000/admin/time-tracking
```

## 📊 Datenstruktur

### TimeSession

```json
{
  "id": "session_1705660800000_abc123",
  "date": "19.01.2025",
  "time": "09:00:00",
  "startTime": "2025-01-19T08:00:00.000Z",
  "endTime": "2025-01-19T16:30:00.000Z",
  "totalHours": 8.5,
  "status": "completed",
  "tasks": [
    {
      "id": "task_1705660800000_def456",
      "description": "Enterprise++ Standards implementieren",
      "category": "development",
      "startTime": "2025-01-19T08:00:00.000Z",
      "endTime": "2025-01-19T12:00:00.000Z",
      "status": "completed",
      "actualHours": 4.0
    }
  ]
}
```

### DailyGoals

```json
{
  "date": "19.01.2025",
  "goals": [
    {
      "id": "goal_1705660800000_ghi789",
      "description": "Enterprise++ Standards implementieren",
      "category": "development",
      "estimatedHours": 2.0,
      "status": "completed",
      "completed": true,
      "actualHours": 4.0
    }
  ],
  "totalEstimatedHours": 4.0,
  "totalActualHours": 4.0,
  "completionRate": 100.0
}
```

### BillingEntry

```json
{
  "sessionId": "session_1705660800000_abc123",
  "date": "19.01.2025",
  "totalHours": 8.5,
  "hourlyRate": 85,
  "totalAmount": 722.5,
  "status": "pending",
  "invoiceNumber": "LIW-20250119-001"
}
```

## 💰 Abrechnungssystem

### Stundensatz

- **Standard:** €85/Stunde für IT-Dienstleistungen
- **Premium:** €120/Stunde für Spezialprojekte
- **Enterprise:** €150/Stunde für Unternehmensberatung

### Automatische Berechnung

```javascript
// Beispiel-Berechnung
const hours = 8.5;
const hourlyRate = 85;
const subtotal = hours * hourlyRate; // €722.50
const tax = subtotal * 0.19; // €137.28 (19% MwSt)
const total = subtotal + tax; // €859.78
```

### Rechnungsnummern

- **Format:** `LIW-YYYYMMDD-XXX`
- **Beispiel:** `LIW-20250119-001`
- **Erklärung:** LIW (Lopez IT Welt) - Datum - Sequenznummer

## 📈 Berichtssystem

### Tagesbericht

```javascript
{
  "date": "19.01.2025",
  "sessions": 1,
  "totalHours": 8.5,
  "totalBilling": 722.50,
  "tasks": [
    {
      "description": "Enterprise++ Standards implementieren",
      "hours": 4.0,
      "amount": 340.00
    }
  ]
}
```

### Wochenbericht

```javascript
{
  "week": 3,
  "year": 2025,
  "totalHours": 42.5,
  "totalSessions": 5,
  "totalTasks": 15,
  "totalBilling": 3612.50,
  "dailyBreakdown": {
    "Monday": { "hours": 8.5, "sessions": 1 },
    "Tuesday": { "hours": 8.0, "sessions": 1 },
    // ...
  }
}
```

### Monatsbericht

```javascript
{
  "month": 1,
  "year": 2025,
  "totalHours": 170.0,
  "totalSessions": 20,
  "totalTasks": 60,
  "totalBilling": 14450.00,
  "averageHoursPerDay": 8.5,
  "completionRate": 95.5
}
```

## 🛠️ Technische Implementierung

### Dateien

- `scripts/enterprise-time-tracking.js` - Hauptsystem
- `scripts/enterprise-time-cli.js` - Kommandozeile
- `scripts/enterprise-invoice-generator.js` - Rechnungserstellung
- `src/app/admin/time-tracking/page.tsx` - Admin-Interface

### Datenbank-Tabellen (MySQL)

```sql
-- Sessions
CREATE TABLE time_sessions (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    total_hours DECIMAL(5,2),
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE time_tasks (
    id VARCHAR(50) PRIMARY KEY,
    session_id VARCHAR(50),
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'development',
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    actual_hours DECIMAL(5,2),
    status ENUM('in-progress', 'completed', 'paused') DEFAULT 'in-progress',
    FOREIGN KEY (session_id) REFERENCES time_sessions(id)
);

-- Daily Goals
CREATE TABLE daily_goals (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'development',
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing
CREATE TABLE billing_entries (
    id VARCHAR(50) PRIMARY KEY,
    session_id VARCHAR(50),
    invoice_number VARCHAR(50) UNIQUE,
    date DATE NOT NULL,
    total_hours DECIMAL(5,2) NOT NULL,
    hourly_rate DECIMAL(6,2) DEFAULT 85.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'invoiced', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES time_sessions(id)
);
```

## 📋 Workflow

### 1. Tagesstart

```bash
# 1. Tagesziele setzen
node scripts/enterprise-time-cli.js
# Option 5: Tagesziele setzen

# 2. Arbeitssession starten
# Option 1: Session starten
```

### 2. Während der Arbeit

```bash
# Tasks hinzufügen
# Option 3: Task hinzufügen

# Tasks abschließen
# Option 4: Task abschließen
```

### 3. Tagesende

```bash
# 1. Session beenden
# Option 2: Session beenden

# 2. Tagesbericht generieren
# Option 5: Tagesbericht

# 3. Tagesziele prüfen
# Automatisch beim Beenden der Session
```

### 4. Abrechnung

```bash
# Automatische Rechnungserstellung
node scripts/enterprise-invoice-generator.js
```

## 🔧 Konfiguration

### Stundensätze anpassen

```javascript
// In enterprise-time-tracking.js
const hourlyRates = {
  standard: 85, // Standard IT-Dienstleistungen
  premium: 120, // Spezialprojekte
  enterprise: 150, // Unternehmensberatung
};
```

### Kategorien anpassen

```javascript
// Verfügbare Task-Kategorien
const taskCategories = [
  'development', // Software-Entwicklung
  'documentation', // Dokumentation
  'meeting', // Meetings/Beratung
  'testing', // Testing/QA
  'deployment', // Deployment/DevOps
  'support', // Support/Wartung
];
```

## 📊 Qualitätskontrolle

### Automatische Prüfungen

- ✅ **Zeitvalidierung** - Unrealistische Zeiten werden markiert
- ✅ **Task-Komplettierung** - Unvollständige Tasks werden erkannt
- ✅ **Ziel-Erreichung** - Tagesziele werden automatisch geprüft
- ✅ **Abrechnungsgenauigkeit** - Berechnungen werden validiert

### Berichte

- 📈 **Tägliche Reports** - Automatisch beim Session-Ende
- 📊 **Wöchentliche Zusammenfassung** - Sonntags generiert
- 📋 **Monatliche Abrechnung** - Monatsende
- 🎯 **Ziel-Erfolgsanalyse** - Wöchentlich

## 🚨 Troubleshooting

### Häufige Probleme

**1. Session kann nicht gestartet werden**

```bash
# Prüfe ob bereits eine Session läuft
node scripts/enterprise-time-cli.js
# Option 6: Status anzeigen
```

**2. Task kann nicht abgeschlossen werden**

```bash
# Prüfe aktive Tasks
# Option 4: Task abschließen
# Wähle die richtige Task-Nummer
```

**3. Rechnung wird nicht generiert**

```bash
# Prüfe Billing-Einträge
cat enterprise-billing.json
```

### Logs prüfen

```bash
# Time Tracking Logs
cat enterprise-time-log.json

# Daily Goals Logs
cat enterprise-daily-goals.json

# Billing Logs
cat enterprise-billing.json
```

## 🔮 Zukünftige Erweiterungen

### Geplante Features

- 📱 **Mobile App** - iOS/Android App für Zeiterfassung
- 🔗 **API-Integration** - REST API für externe Systeme
- 📊 **Dashboard** - Echtzeit-Dashboard mit Grafiken
- 🤖 **KI-Integration** - Automatische Task-Kategorisierung
- 📧 **E-Mail-Benachrichtigungen** - Automatische Reports per E-Mail
- 💳 **Online-Zahlung** - Integration von Zahlungsanbietern

### Technische Verbesserungen

- 🗄️ **Datenbank-Migration** - Von JSON zu MySQL
- 🔐 **Authentifizierung** - Multi-User-Support
- 📱 **Responsive Design** - Mobile-optimierte Admin-Oberfläche
- 🚀 **Performance** - Caching und Optimierung
- 🔒 **Sicherheit** - Verschlüsselung und Backup

---

**Entwickelt für Lopez IT Welt**  
**Enterprise++ Standards**  
**Version 1.0** - Januar 2025
