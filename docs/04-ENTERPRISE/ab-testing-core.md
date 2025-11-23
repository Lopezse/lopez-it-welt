# 🧪 A/B Testing Core - Enterprise++ Dokumentation

**Version:** 1.0.0  
**Datum:** 2025-10-31 15:20:48  
**Status:** ✅ AKTIV  
**Autor:** Lopez IT Welt Team

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Technische Architektur](#technische-architektur)
3. [Datenbankstruktur](#datenbankstruktur)
4. [API-Routen](#api-routen)
5. [Frontend-Integration](#frontend-integration)
6. [DSGVO-Konformität](#dsgvo-konformität)
7. [Datenfluss](#datenfluss)
8. [Beispiel-Implementierung](#beispiel-implementierung)

---

## 🎯 Übersicht

Das A/B-Testing Core System ist ein vollständiges Enterprise++ Framework für A/B-Tests und Experimentation. Es ermöglicht die Durchführung von A/B-Tests auf verschiedenen Bereichen der Website (Hero-Section, Buttons, Texte, Preise, Layouts etc.) und bietet umfassende Analyse- und Reporting-Funktionen.

### Hauptmerkmale

- ✅ Vollständig UTF-8 (utf8mb4_unicode_ci)
- ✅ DSGVO-konform (anonymisierte User-Hashes)
- ✅ Modular und erweiterbar
- ✅ Skalierbar für beliebig viele Experimente
- ✅ Automatische Varianten-Zuweisung
- ✅ Event-Tracking (Views, Clicks, Conversions)
- ✅ Statistiken und Signifikanzberechnungen
- ✅ Admin-Dashboard Integration

---

## 🏗️ Technische Architektur

### System-Architektur

```
┌─────────────────┐
│   Frontend      │
│  (Next.js/React)│
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────┐
│   API Routes    │
│  (/api/ab/*)    │
└────────┬────────┘
         │
         │ MySQL Queries
         │
┌────────▼────────┐
│   Database      │
│  (MySQL/MariaDB)│
└─────────────────┘
```

### Komponenten

1. **Frontend-Library** (`src/lib/ab-testing.ts`)
   - Varianten-Loader
   - Event-Tracker
   - Device-Type Detection

2. **API-Routes** (`src/app/api/ab/*`)
   - Varianten-Zuweisung
   - Event-Logging
   - Statistiken
   - Experiment-Management

3. **Datenbank-Tabellen**
   - `ab_experiments` - Experimente
   - `ab_variants` - Varianten
   - `ab_events` - Event-Log
   - `ab_config` - Globale Konfiguration

4. **Admin-Dashboard** (`src/app/admin/ab-experiments`)
   - Experiment-Verwaltung
   - Statistiken & Reports
   - Einstellungen

---

## 💾 Datenbankstruktur

### ab_experiments

Haupttabelle für Experimente.

| Spalte           | Typ          | Beschreibung                      |
| ---------------- | ------------ | --------------------------------- |
| id               | INT          | Primärschlüssel                   |
| name             | VARCHAR(100) | Experiment-Name                   |
| description      | TEXT         | Beschreibung                      |
| goal             | VARCHAR(255) | Ziel des Experiments              |
| status           | ENUM         | draft, running, paused, completed |
| split_a          | TINYINT      | Traffic-Split für Variante A (%)  |
| auto_winner_days | INT          | Tage für Auto-Winner-Erkennung    |
| start_date       | DATETIME     | Startdatum                        |
| end_date         | DATETIME     | Enddatum                          |
| created_at       | TIMESTAMP    | Erstellungszeitpunkt              |
| updated_at       | TIMESTAMP    | Aktualisierungszeitpunkt          |

### ab_variants

Tabelle für Varianten (A, B, C, ...).

| Spalte        | Typ          | Beschreibung                       |
| ------------- | ------------ | ---------------------------------- |
| id            | INT          | Primärschlüssel                    |
| experiment_id | INT          | Foreign Key zu ab_experiments      |
| variant_key   | CHAR(1)      | Varianten-Schlüssel (A, B, C, ...) |
| title         | VARCHAR(255) | Titel                              |
| subtitle      | VARCHAR(255) | Untertitel                         |
| description   | TEXT         | Beschreibung                       |
| button_text   | VARCHAR(100) | Button-Text                        |
| button_link   | VARCHAR(255) | Button-Link                        |
| impressions   | INT          | Anzahl Impressionen                |
| clicks        | INT          | Anzahl Klicks                      |
| conversions   | INT          | Anzahl Conversions                 |
| created_at    | TIMESTAMP    | Erstellungszeitpunkt               |
| updated_at    | TIMESTAMP    | Aktualisierungszeitpunkt           |

### ab_events

Tabelle für Event-Logging (DSGVO-konform).

| Spalte        | Typ         | Beschreibung                          |
| ------------- | ----------- | ------------------------------------- |
| id            | BIGINT      | Primärschlüssel                       |
| experiment_id | INT         | Foreign Key zu ab_experiments         |
| variant_key   | CHAR(1)     | Varianten-Schlüssel                   |
| event_type    | ENUM        | view, click, conversion               |
| user_hash     | VARCHAR(64) | Anonymisierter User-Hash              |
| device_type   | VARCHAR(50) | Device-Type (desktop, mobile, tablet) |
| timestamp     | TIMESTAMP   | Zeitstempel                           |

### ab_config

Globale Konfiguration.

| Spalte                | Typ        | Beschreibung               |
| --------------------- | ---------- | -------------------------- |
| id                    | TINYINT    | Primärschlüssel (immer 1)  |
| ab_active             | TINYINT(1) | A/B-Testing aktiviert      |
| default_split         | TINYINT    | Standard Traffic-Split (%) |
| auto_winner_enabled   | TINYINT(1) | Auto-Winner aktiviert      |
| auto_winner_threshold | INT        | Threshold für Auto-Winner  |
| auto_winner_days      | INT        | Tage für Auto-Winner       |
| updated_at            | TIMESTAMP  | Aktualisierungszeitpunkt   |

---

## 🔌 API-Routen

### GET /api/ab/variant

Ermittelt, welche Variante ein Nutzer sehen soll.

**Response:**

```json
{
  "active": true,
  "experiment_id": 1,
  "experiment_name": "Hero-Section A/B-Test",
  "variant": {
    "key": "A",
    "title": "Lopez IT Welt",
    "subtitle": "Professionelle IT-Lösungen",
    "description": "Wir entwickeln maßgeschneiderte Software-Lösungen...",
    "button_text": "Jetzt beraten lassen",
    "button_link": "/kontakt"
  },
  "split_a": 50,
  "device_type": "desktop"
}
```

### POST /api/ab/event

Trackt ein Event (Click oder Conversion).

**Request:**

```json
{
  "experiment_id": 1,
  "variant_key": "A",
  "event_type": "click",
  "device_type": "desktop"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event click erfolgreich geloggt",
  "experiment_id": 1,
  "variant_key": "A",
  "event_type": "click",
  "device_type": "desktop"
}
```

### GET /api/ab/stats

Liefert Statistiken für Experimente.

**Query-Parameter:**

- `experiment_id` (optional): Filtert nach Experiment-ID

**Response:**

```json
{
  "stats": [
    {
      "id": 1,
      "experiment_id": 1,
      "variant_key": "A",
      "title": "Lopez IT Welt",
      "impressions": 1000,
      "clicks": 150,
      "conversions": 10,
      "ctr": 15.0,
      "conversion_rate": 6.67
    }
  ],
  "totals": {
    "total_impressions": 2000,
    "total_clicks": 300,
    "total_conversions": 20,
    "overall_ctr": 15.0,
    "overall_conversion_rate": 6.67
  },
  "count": 2
}
```

### POST /api/ab/start

Startet ein Experiment.

**Request:**

```json
{
  "experiment_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "A/B-Testing erfolgreich gestartet",
  "experiment_id": 1,
  "ab_active": true
}
```

### POST /api/ab/stop

Stoppt ein Experiment.

**Request:**

```json
{
  "experiment_id": 1,
  "status": "paused"
}
```

**Response:**

```json
{
  "success": true,
  "message": "A/B-Testing erfolgreich gestoppt (Status: paused)",
  "experiment_id": 1,
  "ab_active": false,
  "active_experiments": 0
}
```

### GET /api/ab/experiments

Liefert alle Experimente mit Varianten.

**Query-Parameter:**

- `status` (optional): Filtert nach Status (draft, running, paused, completed)

### POST /api/ab/experiments

Erstellt ein neues Experiment.

**Request:**

```json
{
  "name": "Hero-Section A/B-Test",
  "description": "Testet verschiedene Hero-Texte",
  "goal": "Erhöhung der Click-Through-Rate um 10%",
  "split_a": 50,
  "variants": [
    {
      "title": "Lopez IT Welt",
      "subtitle": "Professionelle IT-Lösungen",
      "description": "Wir entwickeln maßgeschneiderte Software-Lösungen...",
      "button_text": "Jetzt beraten lassen",
      "button_link": "/kontakt"
    },
    {
      "title": "Individuelle IT-Lösungen",
      "subtitle": "Persönlich, sicher und barrierefrei",
      "description": "Moderne Software für KMU...",
      "button_text": "Kostenlose Beratung",
      "button_link": "/kontakt"
    }
  ]
}
```

### GET /api/ab/config

Liefert die globale Konfiguration.

### PUT /api/ab/config

Aktualisiert die globale Konfiguration.

---

## 🎨 Frontend-Integration

### Hero-Komponente

Die Hero-Komponente (`src/components/Core/Hero.tsx`) wurde aktualisiert, um das neue A/B-Testing-System zu verwenden:

```typescript
import { loadABVariant, trackABEvent, detectDeviceType } from "@/lib/ab-testing";

// Variante laden
const abTestVariant = await loadABVariant();

if (abTestVariant && abTestVariant.active) {
  // A/B-Test Variante verwenden
  setHeroData({
    title: abTestVariant.variant.title,
    subtitle: abTestVariant.variant.subtitle,
    // ...
  });
}

// Click tracken
await trackABEvent({
  experiment_id: abVariant.experiment_id,
  variant_key: abVariant.variant.key,
  event_type: "click",
  device_type: detectDeviceType(),
});
```

### A/B-Testing Library

Die Library (`src/lib/ab-testing.ts`) bietet folgende Funktionen:

- `loadABVariant()` - Lädt die aktuelle Variante
- `trackABEvent()` - Trackt Events
- `detectDeviceType()` - Erkennt Device-Type
- `generateUserHash()` - Generiert anonymisierten User-Hash

---

## 🔒 DSGVO-Konformität

Das System ist vollständig DSGVO-konform:

1. **Anonymisierte User-Hashes**: Keine personenbezogenen Daten werden gespeichert
2. **User-Hash-Generierung**: Basierend auf User-Agent, IP-Adresse und Browser-Informationen
3. **Keine Cookies**: Keine Tracking-Cookies erforderlich
4. **Daten-Minimierung**: Nur notwendige Daten werden gespeichert

### User-Hash-Implementierung

```typescript
const userAgent = request.headers.get("user-agent") || "";
const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
const userHash = crypto.createHash("sha256").update(`${userAgent}-${ipAddress}`).digest("hex");
```

---

## 📊 Datenfluss

### Varianten-Zuweisung

```
1. User besucht Seite
   ↓
2. Frontend ruft GET /api/ab/variant auf
   ↓
3. API prüft ab_config.ab_active
   ↓
4. API findet aktives Experiment (status='running')
   ↓
5. API generiert User-Hash (anonymisiert)
   ↓
6. API weist Variante zu (basierend auf User-Hash und split_a)
   ↓
7. API loggt Event (type='view') in ab_events
   ↓
8. API erhöht impressions-Zähler in ab_variants
   ↓
9. API liefert Variante zurück
   ↓
10. Frontend rendert Variante
```

### Event-Tracking

```
1. User klickt auf Button
   ↓
2. Frontend ruft POST /api/ab/event auf
   ↓
3. API loggt Event (type='click') in ab_events
   ↓
4. API erhöht clicks-Zähler in ab_variants
   ↓
5. API bestätigt erfolgreiches Tracking
```

---

## 💡 Beispiel-Implementierung

### Neues Experiment erstellen

1. **Datenbank:**

```sql
INSERT INTO ab_experiments (name, description, goal, status, split_a)
VALUES (
  'Hero-Section A/B-Test',
  'Testet verschiedene Hero-Texte für bessere Conversion',
  'Erhöhung der Click-Through-Rate um 10%',
  'draft',
  50
);
```

2. **Varianten erstellen:**

```sql
INSERT INTO ab_variants (experiment_id, variant_key, title, subtitle, description, button_text, button_link)
VALUES
  (1, 'A', 'Lopez IT Welt', 'Professionelle IT-Lösungen', '...', 'Jetzt beraten lassen', '/kontakt'),
  (1, 'B', 'Individuelle IT-Lösungen', 'Persönlich, sicher und barrierefrei', '...', 'Kostenlose Beratung', '/kontakt');
```

3. **Experiment starten:**

```bash
curl -X POST http://localhost:3000/api/ab/start \
  -H "Content-Type: application/json" \
  -d '{"experiment_id": 1}'
```

4. **Statistiken abrufen:**

```bash
curl http://localhost:3000/api/ab/stats?experiment_id=1
```

---

## 🔍 Validierung

Nach der Implementierung wurden folgende Tests durchgeführt:

- ✅ Datenbank-Tabellen erstellt
- ✅ API-Routen funktionieren
- ✅ Frontend-Integration funktioniert
- ✅ Event-Tracking funktioniert
- ✅ UTF-8 Encoding korrekt
- ✅ DSGVO-Konformität gewährleistet

---

## 📝 Changelog

### Version 1.0.0 (2025-10-31)

- ✅ Initiale Implementierung
- ✅ Datenbank-Schema erstellt
- ✅ API-Routen implementiert
- ✅ Frontend-Integration
- ✅ Admin-Dashboard erstellt
- ✅ Dokumentation erstellt

---

_Generated by Enterprise++ Documentation Generator v1.0.0_  
_Next update: Nach Implementierung neuer Features_
