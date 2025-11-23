# 📝 A/B-Testing Dashboard - UI-Texte Dokumentation

**Version:** 1.0.0  
**Datum:** 2025-01-20  
**Status:** ✅ AKTIV  
**Autor:** Lopez IT Welt Team

---

## 🎯 Zweck dieser Dokumentation

Diese Dokumentation dient als **Single Source of Truth (SSOT)** für alle UI-Texte des A/B-Testing Dashboards. Alle Texte sind hier zentral dokumentiert und müssen bei Änderungen aktualisiert werden.

---

## 📋 Header-Bereich

### Haupttitel

- **Text:** "A/B-Testing Dashboard"
- **Verwendung:** H1-Überschrift der Seite
- **Location:** `src/app/admin/ab-test/page.tsx:139`
- **Format:** `text-3xl font-bold text-gray-900`

### Untertitel

- **Text:** "Hero-Section A/B-Test verwalten und Statistiken einsehen"
- **Verwendung:** Beschreibungstext unter dem Titel
- **Location:** `src/app/admin/ab-test/page.tsx:142`
- **Format:** `text-gray-600`

---

## ⚙️ A/B-Test Konfiguration

### Sektions-Überschrift

- **Text:** "A/B-Test Konfiguration"
- **Verwendung:** H2-Überschrift des Konfigurationsbereichs
- **Location:** `src/app/admin/ab-test/page.tsx:149`
- **Format:** `text-xl font-semibold text-gray-900`

### Test-Aktivierung

#### Label

- **Text:** "A/B-Test aktivieren"
- **Verwendung:** Label für Test-Aktivierung
- **Location:** `src/app/admin/ab-test/page.tsx:158`
- **Format:** `text-sm font-medium text-gray-700`

#### Status-Text

- **Text (aktiv):** "Test läuft derzeit: Ja"
- **Text (inaktiv):** "Test läuft derzeit: Nein"
- **Verwendung:** Dynamischer Status-Text
- **Location:** `src/app/admin/ab-test/page.tsx:161`
- **Format:** `text-sm text-gray-500`

#### Button-Text (aktiv)

- **Text:** "Test stoppen"
- **Verwendung:** Button-Text wenn Test aktiv ist
- **Location:** `src/app/admin/ab-test/page.tsx:172`
- **Format:** `bg-red-600 text-white hover:bg-red-700`

#### Button-Text (inaktiv)

- **Text:** "Test starten"
- **Verwendung:** Button-Text wenn Test inaktiv ist
- **Location:** `src/app/admin/ab-test/page.tsx:172`
- **Format:** `bg-green-600 text-white hover:bg-green-700`

### Traffic Split

#### Label

- **Text:** "Traffic Split: {config.traffic_split}% für Variante A"
- **Verwendung:** Dynamisches Label mit aktuellem Wert
- **Location:** `src/app/admin/ab-test/page.tsx:179`
- **Format:** `text-sm font-medium text-gray-700`

#### Range-Labels

- **Text (Min):** "0% A"
- **Text (Max):** "100% A"
- **Verwendung:** Beschriftung der Range-Slider-Endpunkte
- **Location:** `src/app/admin/ab-test/page.tsx:192-193`
- **Format:** `text-xs text-gray-500`

### Auto-Activate Winner

#### Label

- **Text:** "Gewinner automatisch aktivieren"
- **Verwendung:** Label für Auto-Activate-Funktion
- **Location:** `src/app/admin/ab-test/page.tsx:201`
- **Format:** `text-sm font-medium text-gray-700`

#### Beschreibung

- **Text:** "Nach {config.auto_activate_threshold} Klicks oder {config.auto_activate_days} Tagen"
- **Verwendung:** Dynamische Beschreibung mit Schwellenwerten
- **Location:** `src/app/admin/ab-test/page.tsx:203-205`
- **Format:** `text-sm text-gray-500`

#### Button-Text (aktiviert)

- **Text:** "Aktiviert"
- **Verwendung:** Button-Text wenn Auto-Activate aktiviert ist
- **Location:** `src/app/admin/ab-test/page.tsx:220`
- **Format:** `bg-blue-600 text-white hover:bg-blue-700`

#### Button-Text (deaktiviert)

- **Text:** "Deaktiviert"
- **Verwendung:** Button-Text wenn Auto-Activate deaktiviert ist
- **Location:** `src/app/admin/ab-test/page.tsx:220`
- **Format:** `bg-gray-300 text-gray-700 hover:bg-gray-400`

---

## 📊 Statistiken-Bereich

### Gesamtstatistiken

#### Sektions-Überschrift

- **Text:** "Gesamtstatistiken"
- **Verwendung:** H3-Überschrift des Statistiken-Bereichs
- **Location:** `src/app/admin/ab-test/page.tsx:232`
- **Format:** `text-lg font-semibold text-gray-900`

#### Statistik-Labels

- **Impressionen:** "Impressionen:"
- **Klicks:** "Klicks:"
- **Conversions:** "Conversions:"
- **CTR:** "CTR:"
- **Conversion Rate:** "Conversion Rate:"
- **Verwendung:** Labels für die Statistiken
- **Location:** `src/app/admin/ab-test/page.tsx:237-261`
- **Format:** `text-gray-600`

#### Keine Daten-Text

- **Text:** "Noch keine Daten verfügbar"
- **Verwendung:** Fallback-Text wenn keine Statistiken vorhanden
- **Location:** `src/app/admin/ab-test/page.tsx:268`
- **Format:** `text-gray-500`

### Hero-Varianten

#### Sektions-Überschrift

- **Text:** "Hero-Varianten"
- **Verwendung:** H3-Überschrift des Varianten-Bereichs
- **Location:** `src/app/admin/ab-test/page.tsx:275`
- **Format:** `text-lg font-semibold text-gray-900`

#### Varianten-Titel

- **Text:** "Variante {variant.id}"
- **Verwendung:** Dynamischer Titel für jede Variante
- **Location:** `src/app/admin/ab-test/page.tsx:281`
- **Format:** `font-medium text-gray-900`

#### Varianten-Inhalte (dynamisch aus Datenbank)

- **Title:** Aus `variant.title` (aus Datenbank)
- **Subtitle:** Aus `variant.subtitle` (aus Datenbank)
- **Button-Text:** Aus `variant.button_text` (aus Datenbank)
- **Verwendung:** Dynamische Inhalte aus Hero-Datenbank
- **Location:** `src/app/admin/ab-test/page.tsx:283-288`

**⚠️ WICHTIG:** Diese Texte kommen aus der Datenbank-Tabelle `content_hero` und müssen dort verwaltet werden!

### Detaillierte Statistiken

#### Sektions-Überschrift

- **Text:** "Detaillierte Statistiken"
- **Verwendung:** H3-Überschrift der detaillierten Statistiken
- **Location:** `src/app/admin/ab-test/page.tsx:299`
- **Format:** `text-lg font-semibold text-gray-900`

#### Tabellen-Header

- **Variante:** "Variante"
- **Device:** "Device"
- **Impressionen:** "Impressionen"
- **Klicks:** "Klicks"
- **Conversions:** "Conversions"
- **CTR:** "CTR"
- **Conversion Rate:** "Conversion Rate"
- **Verwendung:** Spalten-Header der Tabelle
- **Location:** `src/app/admin/ab-test/page.tsx:306-326`
- **Format:** `text-xs font-medium text-gray-500 uppercase tracking-wider`

#### Keine Daten-Text

- **Text:** "Noch keine detaillierten Statistiken verfügbar"
- **Verwendung:** Fallback-Text wenn keine detaillierten Statistiken vorhanden
- **Location:** `src/app/admin/ab-test/page.tsx:360`
- **Format:** `text-gray-500`

---

## 🔄 Action-Buttons

### Daten aktualisieren

- **Text:** "Daten aktualisieren"
- **Verwendung:** Button zum Neuladen der Daten
- **Location:** `src/app/admin/ab-test/page.tsx:371`
- **Format:** `bg-blue-600 text-white hover:bg-blue-700`

---

## ⏳ Loading-States

### Lade-Text

- **Text:** "Lade A/B-Test Daten..."
- **Verwendung:** Loading-Message während Daten geladen werden
- **Location:** `src/app/admin/ab-test/page.tsx:110`
- **Format:** `text-gray-600`

---

## ❌ Error-States

### Fehler-Titel

- **Text:** "❌ Fehler"
- **Verwendung:** Fehler-Überschrift bei API-Fehlern
- **Location:** `src/app/admin/ab-test/page.tsx:120`
- **Format:** `text-red-600 text-xl`

### Fehler beim Laden

- **Text:** "Fehler beim Laden der Daten: {error.message}"
- **Verwendung:** Dynamische Fehlermeldung
- **Location:** `src/app/admin/ab-test/page.tsx:78`
- **Format:** `text-gray-600`

### Fehler beim Aktualisieren

- **Text:** "Fehler beim Aktualisieren der Konfiguration"
- **Verwendung:** Fehlermeldung bei Update-Fehlern
- **Location:** `src/app/admin/ab-test/page.tsx:96`
- **Format:** `text-gray-600`

### Erneut versuchen

- **Text:** "Erneut versuchen"
- **Verwendung:** Button zum Retry bei Fehlern
- **Location:** `src/app/admin/ab-test/page.tsx:126`
- **Format:** `bg-blue-600 text-white hover:bg-blue-700`

---

## 📊 Hero-Varianten-Texte (aus Datenbank)

**⚠️ WICHTIG:** Diese Texte werden aus der Datenbank-Tabelle `content_hero` geladen und müssen dort verwaltet werden!

### Standard-Hero-Varianten (Fallback)

#### Variante 1 (Fallback)

- **Title:** "Professionelle IT-Lösungen"
- **Subtitle:** "Lopez IT Welt"
- **Description:** "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation."
- **Button-Text:** "Jetzt beraten lassen"
- **Button-Link:** "/kontakt"
- **Verwendung:** Fallback-Daten wenn Datenbank nicht verfügbar
- **Location:** `src/app/api/content/hero/route.ts:29-32`

**⚠️ UTF-8-PROBLEM:** Die Texte in der Datenbank enthalten aktuell falsch kodierte Umlaute:

- `L?sungen` → sollte sein: `Lösungen`
- `ma?geschneiderte` → sollte sein: `maßgeschneiderte`
- `pers?nliche` → sollte sein: `persönliche`

**🔧 LÖSUNG:** Siehe `STATUS.md` Abschnitt "UTF-8 Encoding-Problem" für Reparatur-Anleitung.

---

## 📋 Änderungsprotokoll

### Version 1.0.0 (2025-01-20)

- ✅ Initiale Dokumentation aller UI-Texte
- ✅ Hero-Varianten-Texte dokumentiert
- ✅ UTF-8-Problem identifiziert und dokumentiert

---

## 🔗 Verwandte Dokumentation

- [A/B-Testing und Analytics](../07-QUALITAET-SICHERUNG/07-07-ab-testing-und-analytics.md) - Technische Dokumentation
- [Admin-UI und Navigation](./06-10-admin-ui-und-navigation.md) - Admin-Interface-Übersicht
- [STATUS.md](../../STATUS.md) - Projektstatus (inkl. UTF-8-Problem)

---

**Nächste Schritte:**

- [ ] UTF-8-Problem in Datenbank beheben
- [ ] Hero-Varianten-Texte in Admin-Interface bearbeitbar machen
- [ ] i18n-Integration für mehrsprachige Texte

---

_Diese Dokumentation ist die Single Source of Truth für alle A/B-Testing Dashboard UI-Texte. Bei Änderungen muss diese Datei aktualisiert werden!_
