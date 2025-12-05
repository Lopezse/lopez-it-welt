# Admin-UI KI-Integration - Enterprise++ Konzept

**Erstellt:** 2025-01-27  
**Status:** 📋 Konzept (keine Implementierung)  
**Zweck:** Strukturiertes Konzept für KI-Integration im Admin-Dashboard

---

## 📋 Executive Summary

Dieses Dokument beschreibt die Integration der KI-gestützten Medienverwaltung (Media-AI mit OpenAI, Async-Processing, Kostenkontrolle, DSGVO-Flags) in das Admin-Dashboard. Es dient als **Pflichtenheft** für die spätere Umsetzung.

**Kernprinzipien:**
- ✅ Enterprise++ UX-Standard
- ✅ Barrierefreiheit (WCAG 2.1)
- ✅ Klare Statusanzeigen
- ✅ Human-in-the-Loop (keine automatische Freigabe)
- ✅ DSGVO-Compliance im UI
- ✅ RBAC/ABAC-Berechtigungen
- ✅ Revisionssichere Audit-Logs

---

## 📊 AI-Status-Enum (verbindliche Definition)

**AI-Status (ENUM):**

Das System verwendet einen verbindlichen Status-Enum für die KI-Analyse-Verarbeitung:

- **`pending`** = Analyse wartet auf Ausführung
- **`running`** = Analyse wird aktuell verarbeitet
- **`done`** = Analyse erfolgreich abgeschlossen
- **`error`** = Analyse fehlgeschlagen
- **`idle`** / **`null`** = Bisher keine Analyse durchgeführt (optional)

**Technische Umsetzung:**
- Datenbank: `ENUM('pending', 'running', 'done', 'error')` in `lopez_business_media.ai_status`
- TypeScript: `type AIStatus = 'pending' | 'running' | 'done' | 'error' | null`
- Default-Wert: `'pending'` (bei neuem Medium ohne Analyse)

---

## 1️⃣ IST-Analyse: Aktueller Admin-UI-Stand

### 1.1 Medienliste (`/admin/media`)

**Aktuelle Implementierung:**
- **Datei:** `src/app/admin/media/page.tsx`
- **Layout:** Tabelle mit Spalten
- **Angezeigte Daten:**
  - Media-ID (Hash)
  - Kategorie (Badge)
  - MIME-Type
  - Dateigröße
  - Erstellt-Datum
  - Aktion: "Ansehen" (Link zu `/api/admin/media/view`)

**Filter:**
- Kategorie-Filter (Dropdown: linkedin, gallery, document, other)
- Pagination (100 pro Seite)

**Fehlende KI-Informationen:**
- ❌ Kein AI-Status-Badge (pending/running/done/error)
- ❌ Keine DSGVO-Warnung (has_person)
- ❌ Keine KI-Tags-Anzeige
- ❌ Keine Quality-Score-Anzeige
- ❌ Keine Filter für "Nur ohne KI-Analyse" oder "Nur mit has_person"

### 1.2 Media-Detail-Ansicht

**Aktuelle Implementierung:**
- **API-Endpunkt:** `/api/admin/media/detail?id={mediaId}`
- **Gibt zurück:** Vollständiges `meta.json` (inkl. `ai` Objekt)
- **UI-Komponente:** ❌ **NICHT vorhanden** (nur API, keine Detail-Seite)

**Fehlende UI-Komponenten:**
- ❌ Keine Detail-Seite für einzelnes Medium
- ❌ Keine Anzeige von KI-Tags
- ❌ Keine Anzeige von KI-Beschreibung (description_ai)
- ❌ Keine Quality-Score-Anzeige
- ❌ Keine DSGVO-Warnung
- ❌ Keine Aktionen (Analyse starten, Freigabe, etc.)

### 1.3 API-Endpunkte (Backend vorhanden)

**Vorhandene Endpunkte:**
- ✅ `POST /api/admin/media/ai/analyze` - Einzelanalyse
- ✅ `POST /api/admin/media/ai/analyze-batch` - Batch-Analyse
- ✅ `POST /api/admin/media/ai/approve` - Freigabe
- ✅ `POST /api/admin/media/ai/search` - Semantische Suche
- ✅ `GET /api/admin/media/ai/similar?id={mediaId}` - Ähnliche Medien
- ✅ `GET /api/admin/media/detail?id={mediaId}` - Media-Details
- ✅ `GET /api/admin/media/list` - Medienliste

**Status:** ✅ Alle benötigten API-Endpunkte sind implementiert

---

## 2️⃣ Soll-Konzept: KI-Integration im Admin-UI

### 2.1 Medienliste (Übersicht) - Erweiterungen

#### 2.1.1 AI-Status-Badge

**Position:** Neue Spalte "KI-Status" (zwischen "Typ" und "Größe")

**Badge-Design:**
- **pending** (gelb): "⏳ KI-Analyse ausstehend"
- **running** (blau): "🔄 KI-Analyse läuft..."
- **done** (grün): "✅ KI-Analyse abgeschlossen"
- **error** (rot): "❌ KI-Analyse fehlgeschlagen"

**Technische Umsetzung:**
- Badge-Farbe: Tailwind CSS (`bg-yellow-100 text-yellow-800`, etc.)
- Icon: Font Awesome oder React Icons
- Tooltip: Bei Hover zeigt `ai_error_message` (falls error) oder `ai_analyzed_at` (falls done)

**Datenquelle:**
- `meta.ai_status` (aus `meta.json` oder DB `lopez_business_media.ai_status`)

#### 2.1.2 DSGVO-Warnung (has_person)

**Position:** Icon/Badge in der "Aktionen"-Spalte oder als zusätzliche Spalte

**Design:**
- **Icon:** 👤 (Person-Icon)
- **Badge:** "DSGVO-Relevant" (orange/rot, wenn `has_person = true` UND `dsgvo_approved_by_admin = false`)
- **Tooltip:** "Person im Bild erkannt - Freigabe erforderlich"

**Logik:**
- Nur sichtbar, wenn `has_person = true`
- Warnung nur, wenn `dsgvo_approved_by_admin = false`
- Grün/Checkmark, wenn `dsgvo_approved_by_admin = true`

#### 2.1.3 KI-Tags-Vorschau

**Position:** Optional als zusätzliche Spalte oder als Tooltip

**Design:**
- Erste 3 Tags als Chips anzeigen (z.B. "laptop, dashboard, team")
- Bei mehr Tags: "+3 weitere" anzeigen
- Klick öffnet Detail-Ansicht

**Datenquelle:**
- `meta.ai.tags` (Array)

#### 2.1.4 Quality-Score-Anzeige

**Position:** Optional als Badge in der "Typ"-Spalte

**Design:**
- **Score 80-100:** 🟢 "Qualität: Hoch (85)"
- **Score 60-79:** 🟡 "Qualität: Mittel (70)"
- **Score 0-59:** 🔴 "Qualität: Niedrig (45)"
- Nur anzeigen, wenn `ai_status = 'done'` und `quality_score` vorhanden

**Datenquelle:**
- `meta.ai.quality_score` (0-100)

#### 2.1.5 Erweiterte Filter

**Neue Filter-Optionen:**

1. **KI-Status-Filter:**
   - "Alle"
   - "Ohne KI-Analyse" (`ai_status = 'pending'` oder `ai_status IS NULL`)
   - "KI-Analyse läuft" (`ai_status = 'running'`)
   - "KI-Analyse abgeschlossen" (`ai_status = 'done'`)
   - "KI-Analyse fehlgeschlagen" (`ai_status = 'error'`)

2. **DSGVO-Filter:**
   - "Alle"
   - "DSGVO-Relevant" (`has_person = true`)
   - "DSGVO-Freigegeben" (`has_person = true AND dsgvo_approved_by_admin = true`)
   - "DSGVO-Offen" (`has_person = true AND dsgvo_approved_by_admin = false`)

3. **Quality-Filter:**
   - "Alle"
   - "Hohe Qualität" (`quality_score >= 80`)
   - "Mittlere Qualität" (`quality_score >= 60 AND quality_score < 80`)
   - "Niedrige Qualität" (`quality_score < 60`)

4. **Tag-Filter (erweitert):**
   - Multi-Select für KI-Tags
   - Suchfeld für Tag-Namen

**Technische Umsetzung:**
- Filter als Dropdowns oder Checkbox-Gruppen
- Query-Parameter in URL (`?ai_status=done&has_person=true`)
- API-Endpunkt `/api/admin/media/list` erweitern um Filter-Parameter

#### 2.1.6 Bulk-Aktionen

**Neue Aktionen:**
- "KI-Analyse starten" (für ausgewählte Medien)
- "Erneut analysieren" (für Medien mit `ai_status = 'error'` oder `ai_status = 'done'`)
- "DSGVO-Freigabe" (für Medien mit `has_person = true`)

**Design:**
- Checkboxen pro Zeile
- Toolbar mit Bulk-Aktionen (oben über der Tabelle)
- Bestätigungs-Dialog bei Bulk-Aktionen

---

### 2.2 Media-Detail-Ansicht (NEU)

#### 2.2.1 Seitenstruktur

**Route:** `/admin/media/[id]` oder `/admin/media/detail?id={id}`

**Layout:**
- Header mit Media-ID und "Zurück"-Button
- Hauptbereich: 2-Spalten-Layout
  - Links: Bild-Preview (groß)
  - Rechts: Metadaten und KI-Informationen

#### 2.2.2 Bild-Preview (Links)

**Inhalt:**
- Großes Bild (max. 800px Breite)
- Thumbnail-Option (falls vorhanden)
- Download-Link
- Datei-Informationen (Größe, MIME-Type, SHA256)

#### 2.2.3 Metadaten-Panel (Rechts)

**Abschnitte:**

1. **Basis-Informationen:**
   - Media-ID (Hash)
   - Kategorie
   - Original-Dateiname
   - Erstellt-Datum
   - Letzte Änderung

2. **KI-Status-Panel:**
   - **Status-Badge:** (pending/running/done/error)
   - **Letzte Analyse:** `ai_analyzed_at` (formatiert)
   - **Fehlermeldung:** `ai_error_message` (nur bei error)
   - **Retry-Zähler:** `ai_retry_count` (nur bei error)

3. **KI-Tags-Panel:**
   - **Überschrift:** "KI-generierte Tags"
   - **Tags als Chips:** Alle Tags aus `meta.ai.tags`
   - **Freigabe-Status:** Badge "✅ Freigegeben" oder "⏳ Ausstehend"
   - **Aktion:** Button "Tags übernehmen" → setzt `tags_approved = true`

4. **KI-Beschreibung-Panel (Alt-Text-Vorschlag):**
   - **Überschrift:** "KI-Vorschlag für Alt-Text"
   - **Hinweis:** "Dieser Vorschlag wurde von der KI generiert und muss redaktionell geprüft werden."
   - **Text:** `meta.ai.description_ai` (als Textarea, editierbar)
   - **Freigabe-Status:** Badge "✅ Freigegeben" oder "⏳ Ausstehend"
   - **Aktionen:**
     - Button "Alt-Text-Vorschlag übernehmen" → setzt `alt_approved = true`
     - Button "Alt-Text bearbeiten" → öffnet Edit-Modus
     - Button "Als Alt-Text speichern" → speichert redigierten Text in `meta.alt`
   - **Wichtig:** `meta.ai.description_ai` ist der KI-Vorschlag. Die manuelle Übernahme in `meta.alt` erfolgt nach redaktioneller Prüfung durch den Admin.

5. **Quality-Score-Panel:**
   - **Score-Anzeige:** Große Zahl (0-100) mit Farb-Code
   - **Warnungen:** Liste aus `meta.ai.quality_warnings`
   - **Visualisierung:** Progress-Bar oder Kreis-Diagramm

6. **Kategorie-Vorschlag-Panel:**
   - **KI-Vorschlag:** `meta.ai.category_suggestion` (Badge)
   - **Aktuelle Kategorie:** Vergleich mit `meta.category`
   - **Aktion:** Button "Kategorie übernehmen" → setzt `category_approved = true` und aktualisiert `meta.category`

7. **DSGVO-Panel (wichtig!):**
   - **Warnung-Banner:** (nur wenn `has_person = true`)
     - **Farbe:** Rot/Orange
     - **Text:** "⚠️ Person im Bild erkannt - DSGVO-Freigabe erforderlich"
     - **Details:**
       - "Person erkannt: Ja"
       - "Freigabe-Status: [Freigegeben / Ausstehend]"
       - "Freigegeben von: [User-Name]" (falls `dsgvo_approved_by`)
       - "Freigegeben am: [Datum]" (falls `dsgvo_approved_at`)
   - **Aktion:** Button "DSGVO-Freigabe erteilen"
     - Öffnet Bestätigungs-Dialog
     - Setzt `dsgvo_approved_by_admin = true`
     - Setzt `dsgvo_approved_at = NOW()`
     - Setzt `dsgvo_approved_by = current_user_id`
     - Protokolliert in Audit-Log

8. **CI-Compliance-Panel (optional):**
   - **Logo erkannt:** Ja/Nein
   - **Farbabweichung:** Prozent (0-100)
   - **Warnungen:** Liste aus `meta.ai.ci_compliance.warnings`

9. **Ähnliche Medien:**
   - **Überschrift:** "Ähnliche Medien"
   - **Liste:** Ergebnisse von `/api/admin/media/ai/similar?id={mediaId}`
   - **Anzeige:** Thumbnails mit Media-ID
   - **Klick:** Öffnet Detail-Ansicht des ähnlichen Mediums

#### 2.2.4 Aktionen-Toolbar

**Buttons:**
1. **"KI-Analyse starten"**
   - Nur sichtbar, wenn `ai_status = 'pending'` oder `ai_status = 'error'`
   - Ruft `POST /api/admin/media/ai/analyze` auf
   - Zeigt Loading-Spinner während Analyse
   - Aktualisiert Status nach Abschluss

2. **"Erneut analysieren"**
   - Nur sichtbar, wenn `ai_status = 'done'` oder `ai_status = 'error'`
   - Setzt `ai_status = 'pending'`
   - Ruft `POST /api/admin/media/ai/analyze` auf

3. **"Alle KI-Vorschläge übernehmen"**
   - Setzt alle Freigabe-Flags (`tags_approved`, `alt_approved`, `category_approved`)
   - Öffnet Bestätigungs-Dialog

4. **"Ähnliche Medien suchen"**
   - Ruft `GET /api/admin/media/ai/similar?id={mediaId}` auf
   - Zeigt Ergebnisse in Modal oder Panel

5. **"Semantische Suche"**
   - Öffnet Such-Dialog
   - Ruft `POST /api/admin/media/ai/search` auf
   - Zeigt Ergebnisse

---

### 2.3 DSGVO-Workflow im UI

#### 2.3.0 DSGVO-Workflow-Definition (verbindlich)

**DSGVO-Workflow:**

Die Erkennung einer Person durch die KI führt **niemals** zur automatischen Freigabe. Die Freigabe erfolgt **ausschließlich manuell** durch eine berechtigte Person. Jede Freigabe ist **dokumentations- und auditpflichtig**. Medien mit Personen dürfen erst nach Freigabe im System genutzt werden.

**Kernprinzipien:**
- ❌ Keine automatische Freigabe bei `has_person = true`
- ✅ Manuelle Freigabe durch berechtigten Admin erforderlich
- ✅ Vollständige Protokollierung (Audit-Log)
- ✅ Blockierung der Nutzung bis Freigabe erteilt

#### 2.3.1 Workflow-Übersicht

```
1. Medium wird hochgeladen
   ↓
2. KI-Analyse läuft (async)
   ↓
3. has_person = true erkannt
   ↓
4. UI zeigt DSGVO-Warnung (rot/orange Banner)
   ↓
5. Admin prüft Bild
   ↓
6. Admin klickt "DSGVO-Freigabe erteilen"
   ↓
7. Bestätigungs-Dialog erscheint
   ↓
8. Admin bestätigt
   ↓
9. System setzt dsgvo_approved_by_admin = true
   ↓
10. System protokolliert in Audit-Log
   ↓
11. Warnung verschwindet, Status wird grün
```

#### 2.3.2 DSGVO-Warnung-Design

**Position:** Oben in der Detail-Ansicht (nach Header, vor Metadaten)

**Banner-Design:**
- **Farbe:** Rot (`bg-red-50 border-red-200`) oder Orange (`bg-orange-50 border-orange-200`)
- **Icon:** ⚠️ (Warnung)
- **Überschrift:** "DSGVO-Freigabe erforderlich"
- **Text:** "Dieses Bild enthält eine erkannte Person. Bitte prüfen Sie das Bild und erteilen Sie die DSGVO-Freigabe, bevor Sie es veröffentlichen."
- **Button:** "DSGVO-Freigabe erteilen" (primär, rot/orange)

**Nach Freigabe:**
- Banner wird grün (`bg-green-50 border-green-200`)
- **Icon:** ✅ (Checkmark)
- **Text:** "DSGVO-Freigabe erteilt von [User-Name] am [Datum]"
- **Button:** "Freigabe widerrufen" (sekundär, optional)

#### 2.3.3 Bestätigungs-Dialog

**Design:**
- Modal-Dialog (zentriert)
- **Überschrift:** "DSGVO-Freigabe bestätigen"
- **Text:** "Möchten Sie die DSGVO-Freigabe für dieses Bild erteilen? Dies wird protokolliert und kann nicht rückgängig gemacht werden."
- **Bild-Preview:** Kleines Thumbnail
- **Buttons:**
  - "Abbrechen" (sekundär)
  - "Freigabe erteilen" (primär, rot)

**Nach Bestätigung:**
- API-Call: `POST /api/admin/media/ai/approve` mit `approveDSGVO: true`
- Erfolgs-Toast: "DSGVO-Freigabe erfolgreich erteilt"
- Seite aktualisiert sich automatisch

---

### 2.4 Kosten-/Monitoring-Sicht (Phase 5)

**Hinweis:** Das Monitoring-Modul (Kostenübersicht, Status-Dashboard, Fehler-Logs) ist Bestandteil von **Phase 5**. Es wird erst nach Abschluss der Kernintegration (Phase 1–4) umgesetzt.

#### 2.4.1 Admin-Dashboard-Widget

**Position:** Auf der Hauptseite `/admin` (Dashboard)

**Widget-Design:**
- **Überschrift:** "Media-AI Kosten & Status"
- **Inhalt:**
  - **Heutige Kosten:** `$X.XX` (aus `lopez_media_ai_costs`)
  - **Monatliche Kosten:** `$X.XX`
  - **Status-Übersicht:**
    - Pending: `X` Medien
    - Running: `X` Medien
    - Done: `X` Medien
    - Error: `X` Medien
  - **Limit-Warnung:** (nur wenn > 80% des Limits)
    - "⚠️ 85% des Tageslimits erreicht ($8.50 von $10.00)"

**Aktion:**
- Klick öffnet detaillierte Seite `/admin/media/ai/monitoring`

#### 2.4.2 Monitoring-Seite (`/admin/media/ai/monitoring`)

**Layout:**
- **Header:** "Media-AI Monitoring"
- **Tabs:**
  1. **Kosten-Übersicht:**
     - Tages-/Monats-/Gesamt-Kosten
     - Kosten-Trend (Grafik, optional)
     - Limit-Status (Progress-Bar)
  2. **Status-Übersicht:**
     - Tabelle mit Status-Zählern
     - Filter nach Zeitraum
  3. **Fehler-Log:**
     - Liste von Medien mit `ai_status = 'error'`
     - Fehlermeldungen
     - Retry-Button pro Eintrag

**Datenquellen:**
- `lopez_media_ai_costs` (Kosten)
- `lopez_media_ai_limits` (Limits)
- `lopez_business_media` (Status-Zähler)

---

## 3️⃣ UI/UX-Vorgaben (Enterprise++-Stil)

### 3.1 Design-System

**Farben:**
- **Primär:** Blau (`#007BFF`)
- **Erfolg:** Grün (`#28A745`)
- **Warnung:** Orange (`#FFC107`)
- **Fehler:** Rot (`#DC3545`)
- **Info:** Blau (`#17A2B8`)

**Badges:**
- Rounded (`rounded-full` oder `rounded-md`)
- Padding: `px-2.5 py-0.5`
- Font: `text-xs font-medium`

**Icons:**
- Font Awesome oder React Icons
- Größe: `text-sm` oder `text-base`
- Abstand: `mr-1` oder `ml-1`

### 3.2 Barrierefreiheit (WCAG 2.1)

**Anforderungen:**
- **Kontrast:** Mindestens 4.5:1 für Text
- **Icons:** Immer mit Text-Label (nicht nur Icon)
- **Keyboard-Navigation:** Alle Aktionen per Tastatur erreichbar
- **Screen-Reader:** ARIA-Labels für alle interaktiven Elemente
- **Focus-Indikatoren:** Sichtbare Focus-Ringe

**Beispiele:**
- Badge "✅ KI-Analyse abgeschlossen" (nicht nur ✅)
- Button "KI-Analyse starten" (nicht nur Icon)
- Tooltip mit vollständigem Text

### 3.3 Verständliche Texte

**Regeln:**
- Kein Entwickler-Englisch
- Klare, präzise Formulierungen
- Fehlermeldungen verständlich

**Beispiele:**
- ❌ "ai_status = 'error'"
- ✅ "KI-Analyse fehlgeschlagen"

- ❌ "has_person = true"
- ✅ "Person im Bild erkannt"

- ❌ "dsgvo_approved_by_admin = false"
- ✅ "DSGVO-Freigabe ausstehend"

### 3.4 Loading-States

**Anforderungen:**
- Loading-Spinner bei API-Calls
- Disabled-Buttons während Verarbeitung
- Toast-Notifications für Erfolg/Fehler

**Beispiele:**
- Button "KI-Analyse starten" → "KI-Analyse läuft..." (disabled)
- Toast: "KI-Analyse erfolgreich abgeschlossen" (grün)
- Toast: "KI-Analyse fehlgeschlagen: [Fehlermeldung]" (rot)

---

## 🔐 RBAC/ABAC-Berechtigungen

### 3.5 Berechtigungsmodell

**Berechtigungen:**

Alle KI-bezogenen Aktionen (Analyse starten, Erneut analysieren, DSGVO-Freigabe, Bulk-Aktionen) sind **ausschließlich** für Rollen mit dem Recht **`media.ai.manage`** verfügbar.

Lesezugriff auf KI-Daten wird über das Recht **`media.view`** geregelt.

Die Rechte werden **global durch RBAC/ABAC durchgesetzt**.

**Berechtigungsmatrix:**

| Aktion | Erforderliches Recht | Beschreibung |
|--------|---------------------|--------------|
| KI-Analyse starten | `media.ai.manage` | Einzel- oder Bulk-Analyse initiieren |
| Erneut analysieren | `media.ai.manage` | Fehlgeschlagene Analysen wiederholen |
| DSGVO-Freigabe erteilen | `media.ai.manage` | Manuelle Freigabe für Medien mit Personen |
| KI-Vorschläge freigeben | `media.ai.manage` | Tags, Alt-Text, Kategorie bestätigen |
| KI-Daten anzeigen | `media.view` | Lesezugriff auf alle KI-Informationen |
| Monitoring anzeigen | `media.view` | Kosten, Status, Fehler-Logs einsehen |

**Technische Umsetzung:**
- API-Endpunkte prüfen Berechtigungen vor Ausführung
- UI-Komponenten zeigen/verstecken Aktionen basierend auf Berechtigungen
- Fehlende Berechtigung führt zu 403-Response (Forbidden)

---

## 📝 Audit-Log-Standard

### 3.6 Revisionssichere Protokollierung

**Audit-Logging:**

Jede KI-relevante Aktion wird **revisionssicher** im zentralen Audit-Log gespeichert.

**Erfasste Daten:**
- `media_id` (VARCHAR) - ID des betroffenen Mediums
- `user_id` (VARCHAR) - ID des ausführenden Benutzers
- `action` (VARCHAR) - Aktionstyp (z.B. `ai.start`, `ai.retry`, `ai.approve_dsgvo`, `ai.bulk_start`)
- `timestamp` (TIMESTAMP) - ISO 8601 UTC-Zeitstempel
- `meta` (JSON, optional) - Zusätzliche Metadaten (z.B. Kosteninformationen, Fehlerdetails)

**Aktionstypen (Beispiele):**
- `ai.start` - KI-Analyse gestartet
- `ai.retry` - KI-Analyse erneut gestartet
- `ai.approve_dsgvo` - DSGVO-Freigabe erteilt
- `ai.approve_tags` - Tags freigegeben
- `ai.approve_alt` - Alt-Text freigegeben
- `ai.approve_category` - Kategorie freigegeben
- `ai.bulk_start` - Bulk-Analyse gestartet
- `ai.bulk_approve_dsgvo` - Bulk-DSGVO-Freigabe erteilt

**Technische Anforderungen:**
- Audit-Log ist **append-only** (keine Löschung/Änderung möglich)
- Zeitstempel sind **UTC** und **ISO 8601**-konform
- Metadaten sind **strukturiert** (JSON) für spätere Auswertung
- Zugriff auf Audit-Logs erfordert **separate Berechtigung** (`audit.view`)

---

## 4️⃣ Konkrete ToDo-Liste (für spätere Umsetzung)

### 4.1 Dateien/Komponenten

#### 4.1.1 Medienliste (`src/app/admin/media/page.tsx`)

**Anpassungen:**
- [ ] `MediaItem` Interface erweitern um AI-Felder:
  ```typescript
  interface MediaItem {
    // ... bestehende Felder
    ai_status?: 'pending' | 'running' | 'done' | 'error';
    ai_error_message?: string;
    ai_analyzed_at?: string;
    has_person?: boolean;
    dsgvo_approved_by_admin?: boolean;
    ai_tags?: string[];
    ai_quality_score?: number;
  }
  ```
- [ ] Neue Spalte "KI-Status" hinzufügen
- [ ] DSGVO-Warnung-Icon hinzufügen
- [ ] Erweiterte Filter-Komponente erstellen
- [ ] Bulk-Aktionen-Toolbar hinzufügen
- [ ] Checkboxen pro Zeile hinzufügen

**Neue Komponenten:**
- [ ] `AIStatusBadge.tsx` - Badge für AI-Status
- [ ] `DSGVOWarningBadge.tsx` - Badge für DSGVO-Warnung
- [ ] `MediaListFilters.tsx` - Erweiterte Filter-Komponente
- [ ] `BulkActionsToolbar.tsx` - Toolbar für Bulk-Aktionen

#### 4.1.2 Media-Detail-Ansicht (NEU)

**Neue Dateien:**
- [ ] `src/app/admin/media/[id]/page.tsx` - Detail-Seite (Dynamic Route)
- [ ] `src/components/admin/media/MediaDetailView.tsx` - Haupt-Komponente
- [ ] `src/components/admin/media/MediaPreview.tsx` - Bild-Preview
- [ ] `src/components/admin/media/AIStatusPanel.tsx` - KI-Status-Panel
- [ ] `src/components/admin/media/AITagsPanel.tsx` - Tags-Panel
- [ ] `src/components/admin/media/AIDescriptionPanel.tsx` - Beschreibung-Panel
- [ ] `src/components/admin/media/QualityScorePanel.tsx` - Quality-Panel
- [ ] `src/components/admin/media/CategorySuggestionPanel.tsx` - Kategorie-Panel
- [ ] `src/components/admin/media/DSGVOPanel.tsx` - DSGVO-Panel
- [ ] `src/components/admin/media/SimilarMediaPanel.tsx` - Ähnliche Medien
- [ ] `src/components/admin/media/MediaDetailActions.tsx` - Aktionen-Toolbar
- [ ] `src/components/admin/media/DSGVOApprovalDialog.tsx` - DSGVO-Bestätigungs-Dialog

#### 4.1.3 Monitoring (optional)

**Neue Dateien:**
- [ ] `src/app/admin/media/ai/monitoring/page.tsx` - Monitoring-Seite
- [ ] `src/components/admin/media/AICostWidget.tsx` - Kosten-Widget (für Dashboard)
- [ ] `src/components/admin/media/AIMonitoringTabs.tsx` - Tabs-Komponente
- [ ] `src/components/admin/media/AICostOverview.tsx` - Kosten-Übersicht
- [ ] `src/components/admin/media/AIStatusOverview.tsx` - Status-Übersicht
- [ ] `src/components/admin/media/AIErrorLog.tsx` - Fehler-Log

### 4.2 API-Integration

#### 4.2.1 API-Endpunkte erweitern

**`/api/admin/media/list` erweitern:**
- [ ] Filter-Parameter hinzufügen:
  - `ai_status` (pending/running/done/error)
  - `has_person` (true/false)
  - `dsgvo_approved` (true/false)
  - `quality_min` (number)
  - `tags` (comma-separated)
- [ ] AI-Felder in Response hinzufügen:
  ```typescript
  {
    // ... bestehende Felder
    ai_status: 'pending' | 'running' | 'done' | 'error',
    ai_error_message: string | null,
    ai_analyzed_at: string | null,
    has_person: boolean,
    dsgvo_approved_by_admin: boolean,
    ai_tags: string[] | null,
    ai_quality_score: number | null,
  }
  ```

**`/api/admin/media/detail` prüfen:**
- [ ] Sicherstellen, dass alle AI-Felder zurückgegeben werden
- [ ] `meta.ai` Objekt vollständig inkludieren

#### 4.2.2 API-Calls in Komponenten

**Medienliste:**
- [ ] `loadMedia()` erweitern um Filter-Parameter
- [ ] `handleBulkAnalyze()` - Bulk-Analyse
- [ ] `handleBulkRetry()` - Bulk-Retry
- [ ] `handleBulkDSGVOApprove()` - Bulk-DSGVO-Freigabe

**Detail-Ansicht:**
- [ ] `loadMediaDetail(mediaId)` - Media-Details laden
- [ ] `startAnalysis(mediaId)` - Analyse starten
- [ ] `retryAnalysis(mediaId)` - Erneut analysieren
- [ ] `approveTags(mediaId)` - Tags freigeben
- [ ] `approveAltText(mediaId, customText?)` - Alt-Text freigeben
- [ ] `approveCategory(mediaId)` - Kategorie freigeben
- [ ] `approveDSGVO(mediaId)` - DSGVO freigeben
- [ ] `loadSimilarMedia(mediaId)` - Ähnliche Medien laden
- [ ] `searchMedia(query)` - Semantische Suche

### 4.3 UI-Elemente

#### 4.3.1 Badges

- [ ] `AIStatusBadge` - pending/running/done/error
- [ ] `DSGVOWarningBadge` - DSGVO-Warnung
- [ ] `QualityScoreBadge` - Quality-Score mit Farbe
- [ ] `ApprovalStatusBadge` - Freigabe-Status (approved/pending)

#### 4.3.2 Panels

- [ ] `AIPanel` - Basis-Panel für alle KI-Informationen
- [ ] `TagsChipList` - Liste von Tags als Chips
- [ ] `QualityScoreDisplay` - Quality-Score-Visualisierung
- [ ] `DSGVOBanner` - DSGVO-Warnung-Banner

#### 4.3.3 Dialogs/Modals

- [ ] `DSGVOApprovalDialog` - DSGVO-Bestätigung
- [ ] `BulkActionConfirmDialog` - Bulk-Aktion-Bestätigung
- [ ] `AIAnalysisProgressModal` - Analyse-Fortschritt (optional)

#### 4.3.4 Forms

- [ ] `AltTextEditForm` - Alt-Text bearbeiten
- [ ] `CategorySelectForm` - Kategorie auswählen

### 4.4 Datenstrukturen

#### 4.4.1 TypeScript Interfaces

**Neue Interfaces:**
- [ ] `MediaItemWithAI` - Erweiterte MediaItem mit AI-Feldern
- [ ] `AIAnalysisResult` - Vollständiges Analyse-Ergebnis
- [ ] `DSGVOApprovalData` - DSGVO-Freigabe-Daten
- [ ] `BulkActionRequest` - Bulk-Aktion-Request

**Erweiterte Interfaces:**
- [ ] `MediaListResponse` erweitern um AI-Felder
- [ ] `MediaDetailResponse` erweitern um AI-Felder

### 4.5 Testing

#### 4.5.1 Unit-Tests

- [ ] `AIStatusBadge.test.tsx` - Badge-Komponente
- [ ] `DSGVOPanel.test.tsx` - DSGVO-Panel
- [ ] `MediaDetailView.test.tsx` - Detail-Ansicht

#### 4.5.2 Integration-Tests

- [ ] E2E-Test: Medienliste mit AI-Status
- [ ] E2E-Test: Detail-Ansicht mit KI-Informationen
- [ ] E2E-Test: DSGVO-Freigabe-Workflow
- [ ] E2E-Test: Bulk-Aktionen

### 4.6 Dokumentation

- [ ] README erweitern um Admin-UI-KI-Integration
- [ ] Screenshots/Demos für DSGVO-Workflow
- [ ] API-Dokumentation für erweiterte Filter

---

## 5️⃣ Implementierungsreihenfolge (Empfehlung)

### Phase 1: Basis-Integration (Medienliste)
1. MediaItem Interface erweitern
2. API-Endpunkt `/api/admin/media/list` erweitern
3. AI-Status-Badge in Medienliste
4. DSGVO-Warnung-Icon
5. Erweiterte Filter (AI-Status, DSGVO)

### Phase 2: Detail-Ansicht
1. Detail-Seite erstellen (`/admin/media/[id]`)
2. MediaPreview-Komponente
3. AI-Status-Panel
4. KI-Tags-Panel
5. KI-Beschreibung-Panel
6. Quality-Score-Panel

### Phase 3: DSGVO-Workflow
1. DSGVO-Panel
2. DSGVO-Banner
3. DSGVO-Bestätigungs-Dialog
4. API-Integration für Freigabe

### Phase 4: Aktionen & Bulk-Operations
1. Aktionen-Toolbar
2. "KI-Analyse starten" Button
3. "Erneut analysieren" Button
4. Bulk-Aktionen (Checkboxen, Toolbar)
5. Bulk-Analyse

### Phase 5: Erweiterte Features & Monitoring
1. Ähnliche Medien-Panel
2. Semantische Suche
3. **Monitoring-Seite** (Kostenübersicht, Status-Dashboard, Fehler-Logs)
4. **Kosten-Widget** (für Admin-Dashboard)

**Hinweis:** Phase 5 wird erst nach Abschluss der Kernintegration (Phase 1–4) umgesetzt.

---

## 6️⃣ Risiken & Herausforderungen

### 6.1 Performance

**Risiko:** Medienliste mit vielen Medien und AI-Feldern könnte langsam werden.

**Lösung:**
- Pagination beibehalten (100 pro Seite)
- Lazy-Loading für AI-Felder (optional)
- Indexes in DB für AI-Felder (bereits vorhanden)

### 6.2 Datenkonsistenz

**Risiko:** `meta.json` und DB `lopez_business_media` könnten unterschiedlich sein.

**Lösung:**
- API-Endpunkte lesen immer aus `meta.json` (Single Source of Truth)
- DB-Sync als Background-Job (optional)

### 6.3 DSGVO-Compliance

**Risiko:** Admin könnte versehentlich DSGVO-Freigabe erteilen.

**Lösung:**
- Bestätigungs-Dialog mit Warnung
- Audit-Log für alle Freigaben
- Keine automatische Freigabe

---

## 7️⃣ Erfolgs-Kriterien

### 7.1 Funktionale Anforderungen

- ✅ Admin sieht AI-Status in Medienliste
- ✅ Admin sieht DSGVO-Warnung bei `has_person = true`
- ✅ Admin kann KI-Analyse starten
- ✅ Admin kann KI-Vorschläge freigeben
- ✅ Admin kann DSGVO-Freigabe erteilen
- ✅ Alle Aktionen sind protokolliert

### 7.2 Nicht-funktionale Anforderungen

- ✅ Barrierefreiheit (WCAG 2.1)
- ✅ Verständliche Texte (kein Entwickler-Englisch)
- ✅ Klare Statusanzeigen
- ✅ Responsive Design (Mobile-freundlich)
- ✅ Performance (Ladezeit < 2s)

---

## 8️⃣ Anhang

### 8.1 Datenbank-Felder (Referenz)

**Tabelle: `lopez_business_media`**
- `ai_status` (ENUM: pending/running/done/error)
- `ai_error_message` (TEXT)
- `ai_retry_count` (INT)
- `ai_analyzed_at` (TIMESTAMP)
- `ai_tags` (JSON)
- `ai_description` (TEXT)
- `ai_quality_score` (DECIMAL)
- `ai_quality_warnings` (JSON)
- `ai_category_suggestion` (VARCHAR)
- `has_person` (BOOLEAN)
- `has_text_in_image` (BOOLEAN)
- `dsgvo_approved_by_admin` (BOOLEAN)
- `dsgvo_approved_at` (TIMESTAMP)
- `dsgvo_approved_by` (VARCHAR)

**Tabelle: `lopez_media_ai_costs`**
- `id`, `media_id`, `cost_usd`, `created_at`

**Tabelle: `lopez_media_ai_limits`**
- `id`, `daily_limit_usd`, `monthly_limit_usd`, `updated_at`

### 8.2 API-Endpunkte (Referenz)

**Vorhandene Endpunkte:**
- `POST /api/admin/media/ai/analyze`
- `POST /api/admin/media/ai/analyze-batch`
- `POST /api/admin/media/ai/approve`
- `POST /api/admin/media/ai/search`
- `GET /api/admin/media/ai/similar`
- `GET /api/admin/media/detail`
- `GET /api/admin/media/list`

### 8.3 meta.json Struktur (Referenz)

```json
{
  "id": "a7be3f4d9df55b21",
  "mime": "image/png",
  "category": "linkedin",
  "ai": {
    "tags": ["laptop", "dashboard"],
    "description_ai": "Ein Laptop auf einem Schreibtisch",
    "quality_score": 85,
    "quality_warnings": [],
    "category_suggestion": "screenshot",
    "has_person": false,
    "has_text_in_image": true,
    "similarity_hash": "abc123..."
  },
  "tags_approved": false,
  "alt_approved": false,
  "category_approved": false,
  "dsgvo_approved_by_admin": false
}
```

---

## 9️⃣ Glossar

**AI-Status:** Verarbeitungszustand der KI-Analyse. Mögliche Werte: `pending` (wartend), `running` (läuft), `done` (abgeschlossen), `error` (fehlgeschlagen), `idle`/`null` (noch nicht analysiert).

**description_ai:** KI-generierter Beschreibungstext, dient als Alt-Text-Vorschlag. Wird in `meta.ai.description_ai` gespeichert und muss redaktionell geprüft werden, bevor er in `meta.alt` übernommen wird.

**has_person:** KI-Erkennung einer oder mehrerer Personen im Bild. Boolean-Flag (`true`/`false`), ausgelöst durch Person-Detection-Service. Löst DSGVO-Workflow aus.

**dsgvo_approved_by_admin:** Manuelle Freigabe eines Mediums für DSGVO-konforme Nutzung. Boolean-Flag, gesetzt durch berechtigten Admin nach Prüfung. Erfordert Audit-Log-Eintrag.

**quality_score:** KI-basierte Qualitätsbewertung des Mediums. Numerischer Wert von 0–100. Wird durch Quality-Check-Service generiert und in `meta.ai.quality_score` gespeichert.

**category_suggestion:** KI-Vorschlag für Medienkategorie. String-Wert (z.B. "screenshot", "profilbild", "produktfoto", "illustration"). Wird in `meta.ai.category_suggestion` gespeichert und kann durch Admin bestätigt werden.

---

**Status:** ✅ **Konzept – finalisiert**  
**Nächster Schritt:** Abnahme des Konzepts, dann Implementierung

