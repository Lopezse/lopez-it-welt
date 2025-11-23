# 📊 A/B-Testing Dashboard - Admin-Dokumentation

**Version:** 1.0.0  
**Datum:** 2025-10-31 15:20:48  
**Status:** ✅ AKTIV  
**Autor:** Lopez IT Welt Team

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Zugriff](#zugriff)
3. [Funktionen](#funktionen)
4. [UI-Layout](#ui-layout)
5. [Workflow](#workflow)
6. [Rollout-Prozess](#rollout-prozess)

---

## 🎯 Übersicht

Das A/B-Testing Dashboard ist der zentrale Verwaltungsbereich für alle A/B-Tests und Experimente. Es ermöglicht die Verwaltung von Experimenten, die Analyse von Statistiken und die Konfiguration globaler Einstellungen.

**Zugriff:** `/admin/ab-experiments`

---

## 🔐 Zugriff

Das Dashboard ist im Admin-Bereich verfügbar:

1. **Navigation:** Content Management → A/B-Testing & Experimente
2. **Direkt-URL:** `http://localhost:3000/admin/ab-experiments`
3. **Rechte:** Benötigt Admin-Rechte

---

## ⚙️ Funktionen

### 1. Experiment-Verwaltung

- ✅ **Neues Experiment erstellen**
- ✅ **Experiment starten** (Status: draft → running)
- ✅ **Experiment pausieren** (Status: running → paused)
- ✅ **Experiment bearbeiten**
- ✅ **Experiment löschen** (optional)

### 2. Globale Einstellungen

- ✅ **A/B-Testing aktivieren/deaktivieren**
- ✅ **Standard Traffic-Split konfigurieren**
- ✅ **Auto-Winner aktivieren/deaktivieren**
- ✅ **Threshold-Werte anpassen**

### 3. Statistiken & Reports

- ✅ **Impressionen pro Variante**
- ✅ **Click-Through-Rate (CTR)**
- ✅ **Conversion-Rate**
- ✅ **Device-Type Statistiken**
- ✅ **Export als PDF/CSV** (geplant)

---

## 🎨 UI-Layout

### Hauptbereich

```
┌─────────────────────────────────────────────────┐
│  A/B-Testing & Experimente                     │
│  Verwalten Sie Ihre A/B-Tests und analysieren  │
│  Sie die Ergebnisse                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Globale Einstellungen                         │
├─────────────────────────────────────────────────┤
│  A/B-Testing aktiv: [✓ Aktiv]                  │
│  Standard Traffic Split: 50%                    │
│  Auto-Winner aktiviert: [✗ Nein]               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Experimente              [+ Neues Experiment]  │
├─────────────────────────────────────────────────┤
│  Hero-Section A/B-Test                          │
│  Status: [Läuft]                                │
│  Ziel: Erhöhung der Click-Through-Rate um 10%  │
│                                                  │
│  Variante A:                                    │
│  - Impressionen: 1000                           │
│  - CTR: 15.0%                                   │
│                                                  │
│  Variante B:                                    │
│  - Impressionen: 1000                           │
│  - CTR: 14.5%                                   │
│                                                  │
│  [Pause] [Details]                              │
└─────────────────────────────────────────────────┘

┌───────────────┬───────────────┬───────────────┐
│  Statistiken  │ Einstellungen  │ Legacy        │
│  Detaillierte │ Globale        │ Dashboard     │
│  Analyse      │ Konfiguration  │               │
└───────────────┴───────────────┴───────────────┘
```

### Status-Badges

- **Entwurf** (draft): Grau
- **Läuft** (running): Grün
- **Pausiert** (paused): Gelb
- **Abgeschlossen** (completed): Blau

### Buttons

- **▶ Starten** (draft → running): Grün
- **⏸ Pausieren** (running → paused): Gelb
- **✏ Bearbeiten**: Blau
- **🗑 Löschen** (optional): Rot

---

## 🔄 Workflow

### Neues Experiment erstellen

1. **Klick auf "Neues Experiment"**
2. **Formular ausfüllen:**
   - Name: z.B. "Hero-Section A/B-Test"
   - Beschreibung: z.B. "Testet verschiedene Hero-Texte"
   - Ziel: z.B. "Erhöhung der Click-Through-Rate um 10%"
   - Traffic-Split: z.B. 50% (50/50)
3. **Variante A definieren:**
   - Titel
   - Untertitel
   - Beschreibung
   - Button-Text
   - Button-Link
4. **Variante B definieren:**
   - Titel
   - Untertitel
   - Beschreibung
   - Button-Text
   - Button-Link
5. **Experiment speichern** (Status: draft)

### Experiment starten

1. **Experiment auswählen**
2. **Klick auf "Start"-Button**
3. **System aktiviert A/B-Testing automatisch**
4. **Status wechselt zu "running"**
5. **Traffic wird nach split_a aufgeteilt**

### Experiment analysieren

1. **Experiment auswählen**
2. **Klick auf "Details"**
3. **Statistiken anzeigen:**
   - Impressionen pro Variante
   - Click-Through-Rate (CTR)
   - Conversion-Rate
   - Device-Type Verteilung
4. **Signifikanz prüfen** (geplant)

### Experiment beenden

1. **Experiment auswählen**
2. **Klick auf "Pause"-Button**
3. **Status wechselt zu "paused"**
4. **Traffic-Stop**
5. **Ergebnisse analysieren**
6. **Gewinner auswählen** (manuell oder automatisch)

---

## 🚀 Rollout-Prozess

### Phase 1: Setup

1. **Datenbank-Schema erstellen:**

   ```bash
   node scripts/ab-testing-setup-direct.js
   ```

2. **Konfiguration prüfen:**

   ```bash
   curl http://localhost:3000/api/ab/config
   ```

3. **Beispiel-Experiment prüfen:**
   ```bash
   curl http://localhost:3000/api/ab/experiments
   ```

### Phase 2: Erster Test

1. **Beispiel-Experiment starten:**

   ```bash
   curl -X POST http://localhost:3000/api/ab/start \
     -H "Content-Type: application/json" \
     -d '{"experiment_id": 1}'
   ```

2. **Frontend testen:**
   - Homepage besuchen
   - Variante A oder B sollte angezeigt werden
   - Button klicken
   - Event sollte getrackt werden

3. **Statistiken prüfen:**
   ```bash
   curl http://localhost:3000/api/ab/stats?experiment_id=1
   ```

### Phase 3: Produktiv

1. **Neues Experiment erstellen** (über Admin-Dashboard)
2. **Varianten definieren**
3. **Experiment starten**
4. **Monitoring aktivieren**
5. **Ergebnisse analysieren**
6. **Gewinner auswählen**
7. **Experiment beenden**

---

## 📊 Beispiel-Bilder (Textplatzhalter)

### Übersichtsseite

```
┌────────────────────────────────────────────────────┐
│  A/B-Testing & Experimente                        │
│  Verwalten Sie Ihre A/B-Tests und analysieren     │
│  Sie die Ergebnisse                               │
└────────────────────────────────────────────────────┘

[Globale Einstellungen Bereich]

[Experimente Liste]

[Quick Links]
```

### Detailseite (geplant)

```
┌────────────────────────────────────────────────────┐
│  Hero-Section A/B-Test - Details                  │
│  Status: Läuft                                     │
└────────────────────────────────────────────────────┘

[Variante A Details]
[Variante B Details]
[Statistiken Diagramm]
[Export Optionen]
```

---

## 🔍 Troubleshooting

### Problem: Experiment startet nicht

**Lösung:**

1. Prüfe `ab_config.ab_active` (muss 1 sein)
2. Prüfe Experiment-Status (muss 'draft' sein)
3. Prüfe ob Varianten vorhanden sind
4. Prüfe API-Logs

### Problem: Keine Statistiken

**Lösung:**

1. Prüfe ob Events getrackt werden (`ab_events` Tabelle)
2. Prüfe API-Endpunkte
3. Prüfe Frontend-Integration

### Problem: Falsche Varianten-Zuweisung

**Lösung:**

1. Prüfe `split_a` Wert im Experiment
2. Prüfe User-Hash-Generierung
3. Prüfe Varianten-Zuweisungslogik

---

## 📝 Changelog

### Version 1.0.0 (2025-10-31)

- ✅ Initiale Implementierung
- ✅ Experiment-Verwaltung
- ✅ Globale Einstellungen
- ✅ Grundlegende Statistiken
- ✅ Admin-Dashboard Integration

---

_Generated by Enterprise++ Documentation Generator v1.0.0_  
_Next update: Nach Implementierung neuer Features_
