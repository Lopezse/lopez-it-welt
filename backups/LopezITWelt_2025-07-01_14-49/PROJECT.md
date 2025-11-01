# 📋 Projektplan - Lopez IT Welt

## 🚀 Neueste Updates (2025-06-27)

### 🎯 **MYSQL-LERNSYSTEM ERFOLGREICH IMPLEMENTIERT**

- **Datum:** 2025-06-27
- **Status:** ✅ VOLLSTÄNDIG IMPLEMENTIERT - Datenbank-Schema erstellt
- **Zweck:** Zeiterfassung und Lernsystem für systematische Verbesserung

**Erstellte Komponenten:**

1. **`database/work_sessions_schema.sql`** - Vollständige MySQL-Datenbankstruktur
2. **`database/dashboard_queries.sql`** - 10 Kategorien von Dashboard-Abfragen
3. **Automatische Trigger** - Dauer-Berechnung, Statistiken
4. **Views** - Für einfache Abfragen und Analysen
5. **Beispiel-Daten** - Für Tests und Demonstration

**Lernsystem-Features:**

- **Zeiterfassung:** Start/Endzeit mit automatischer Dauer-Berechnung
- **Status-Tracking:** gut/schlecht/abgebrochen/pausiert
- **Kategorisierung:** Planung, Umsetzung, Debug, Dokumentation, etc.
- **Lernsystem:** Ursachenanalyse, Lektionen, nächste Schritte
- **Statistiken:** Erfolgsrate, Trend-Analysen, Kategorie-Verteilung
- **Warnungen:** Lange Sessions, häufige Probleme

**Datenbank-Tabellen:**

- **`work_sessions`** - Haupttabelle für Zeiterfassung
- **`work_tags`** - Tags für bessere Kategorisierung
- **`work_session_tags`** - Verknüpfung Sessions ↔ Tags
- **`work_statistics`** - Aggregierte Tagesstatistiken

**Dashboard-Abfragen (10 Kategorien):**

1. **Übersicht-Abfragen** - Letzte Sessions, heute gearbeitete Zeit
2. **Statistik-Abfragen** - Erfolgsrate, wöchentliche Übersicht
3. **Kategorie-Analysen** - Durchschnittliche Dauer, Zeitverteilung
4. **Lernsystem-Analysen** - Häufigste Ursachen, Lektionen-Trends
5. **Produktivitäts-Analysen** - Tagesproduktivität, stündliche Produktivität
6. **Prioritäts-Analysen** - Zeitverteilung nach Priorität
7. **Trend-Analysen** - Monatliche Trends, Entwicklung über Zeit
8. **Warnungen und Alarme** - Lange Sessions, häufige Probleme
9. **Export-Abfragen** - Vollständige Daten für Export
10. **Performance-Optimierung** - Sessions ohne Endzeit

**Nächste Schritte:**

- **API-Integration** - Next.js API-Endpoints erstellen
- **Dashboard-UI** - React-Komponenten für Visualisierung
- **Timer-Funktionalität** - Für aktive Sessions
- **Automatisierung** - Integration in bestehende Admin-Bereiche

### 🚨 **KRITISCHER WEBSITE-STATUS - SOFORTIGE AKTIONEN ERFORDERLICH**

- **Datum:** 2025-01-19
- **Status:** ❌ WEBSITE FUNKTIONIERT TEILWEISE MIT FEHLERN
- **Server:** ✅ Next.js 15.3.4 läuft auf Port 3002
- **Probleme:** Webpack-Cache, API-Fehler, Static Assets 404

**Identifizierte Probleme:**

1. **Webpack-Cache-Fehler** - Cache-Dateien können nicht umbenannt werden
2. **Module-Import-Fehler** - `Cannot find module './923.js'`
3. **API-Routen defekt** - `/api/admin/texts` 500 Error
4. **Static Assets 404** - CSS/JS Dateien nicht gefunden
5. **Fast Refresh Probleme** - Vollständige Neuladezyklen erforderlich

**Sofortige Aktionen:**

- Webpack-Cache bereinigen (`.next/cache` löschen)
- Static Assets reparieren
- API-Routen debuggen
- Module-Import prüfen

### 🎨 Lucide React Icons - Professionelle Icon-Integration

- **Lucide React** installiert und integriert
- **Accessibility-Icon** für Barrierefreiheit-Toggle (international verständlich)
- **Sun/Moon Icons** für Dark/Light Mode
- **Menu-Icon** für Mobile-Navigation
- **Ersetzt manuelle SVGs** durch professionelle Designer-Icons
- **Icon-Strategie** implementiert: Lucide für Navigation, Heroicons für Tailwind, Phosphor für Landingpages

### 🔧 i18n-System - Kritische Fehler behoben

- **createContext-Fehler** durch Entfernung alter react-i18next-Konfiguration behoben
- **I18nProvider** funktioniert jetzt korrekt
- **Datenschutz-Seite** zeigt Übersetzungen korrekt an
- **Sprachumschaltung** funktioniert in allen Komponenten
- **Cache-Probleme** gelöst

### 📊 Aktueller Projektstatus

- **Header-Komponente V1.1** - Vollständig implementiert mit professionellen Icons
- **i18n-System** - Funktioniert korrekt, alle Übersetzungen verfügbar
- **Barrierefreiheit** - WCAG 2.1 AA konform
- **DSGVO-Compliance** - Vollständig implementiert

---

## 🎯 Projektübersicht

## 🎯 Zweck

- Projektübersicht
- Status-Tracking
- Ressourcenplanung
- Qualitätssicherung

## 🚀 **STRATEGISCHE RICHTUNG - WORDPRESS-VERGLEICH & WEBSITE-BUILDER**

### ✅ **WORDPRESS vs. NEXT.JS - STRATEGISCHE ENTSCHEIDUNG**

**Datum:** 2025-01-19
**Status:** ✅ ENTSCHEIDUNG GETROFFEN - Next.js statt WordPress

**Warum Next.js besser als WordPress:**
| Aspekt | WordPress | Next.js (Unser System) |
|--------|-----------|------------------------|
| **Technologie** | PHP (veraltet) | React + TypeScript (modern) |
| **Performance** | Langsam, Plugin-Abhängig | Schnell, optimiert |
| **Sicherheit** | Häufige Updates, Vulnerabilities | Enterprise++ Standards |
| **Shop-Integration** | WooCommerce (komplex) | Nahtlos integriert |
| **Benutzerfreundlichkeit** | Kompliziert, steile Lernkurve | Drag & Drop, intuitiv |
| **Skalierbarkeit** | Begrenzt | Cloud-ready, unbegrenzt |
| **Wartung** | Plugin-Updates, Kompatibilität | Automatisch, stabil |

### 🎯 **WEBSITE-BUILDER-KONZEPT - REVOLUTIONÄRE IDEE**

**Status:** ✅ KONZEPT DOKUMENTIERT - Potentiell Million-Dollar-Idee
**Dokument:** `docs/business-plan/website-builder-shop-concept.md`

**Kernidee:**

- **Drag & Drop Website-Builder** → Kunden erstellen Website selbst
- **Integrierter Shop** → E-Commerce direkt in Website
- **Moderne Technologie** → Next.js statt veraltete Systeme
- **Deutsche Qualität** → DSGVO, Support, Lokalisierung

**Geschäftsmodell:**

- **Basis-Paket:** €299 (Website-Builder)
- **Shop-Paket:** €599 (E-Commerce Integration)
- **Premium-Paket:** €999 (Analytics, SEO, Support)
- **Enterprise:** €2.999 (API, White-Label, Custom Development)

**Differenzierung:**

- **Gegenüber WordPress:** Moderne Technologie, bessere Performance
- **Gegenüber Wix/Shopify:** Einmalige Lizenz, Datenhoheit beim Kunden
- **Gegenüber anderen Buildern:** Vollständige Shop-Integration

## 🏗️ **MODULARE ARCHITEKTUR - BEREITS IMPLEMENTIERT**

### ✅ **WICHTIG: Architektur ist bereits modular!**

**NICHT neu entwickeln - nur erweitern!**

**Bestehende Module:**

- `src/components/Core/` - Header, Footer, Layout ✅
- `src/components/Features/` - Button, Card, FAQ ✅
- `src/components/navigation/` - Sprachumschalter ✅
- `src/components/auth/` - Login/Registrierung ✅

**Modulare Vorteile:**

- 🔧 **Flexibel erweiterbar** - Neue Module hinzufügen
- 🔄 **Wartungsfreundlich** - Einzelne Module austauschen
- 🚀 **Schneller Online** - Bestehende Module verwenden
- 🧠 **KI-gestützt** - Gezielte Modul-Entwicklung

**Entwicklungsrichtlinien:**

1. **Bestehende Module verwenden** - Nicht neu erfinden
2. **Nur Inhalte anpassen** - Design, Texte, Logo
3. **Neue Module hinzufügen** - Shop, Admin, etc.
4. **Modulare Struktur beibehalten** - Saubere Trennung

## 🎯 Zweck

- Projektübersicht
- Status-Tracking
- Ressourcenplanung
- Qualitätssicherung

## 📊 Projekt-Status

### 1. Aktueller Status

- **Phase:** UI-Foundation & Multilingual-System
- **Fortschritt:** 35%
- **Nächste Meilensteine:**
  - Startseiten-Struktur implementieren
  - i18n-System aufbauen
  - Header mit Sprachauswahl
  - Hero Section mit neuen Claims
- **Risiken:**
  - Compliance-Verstöße gegen Pflichtenheft
  - Fehlende Backend-Infrastruktur
  - Test-Coverage unter 80%

### 2. Ressourcen

- **Team:** Ramiro Lopez Mc Lean (Technik), Xenia Mc Lean (Design)
- **Budget:** In Planung
- **Tools:** Next.js 14, TailwindCSS, TypeScript, i18next
- **Infrastruktur:** Entwicklungsumgebung eingerichtet

### 3. Qualität

- **Code-Qualität:** ✅ Deutsche Tailwind-Konfiguration, barrierefreie Komponenten
- **Test-Coverage:** ❌ 0% (Ziel: ≥80%)
- **Performance:** ⚠️ Nicht getestet (Ziel: LCP < 2,5s)
- **Sicherheit:** ⚠️ Grundlegende Maßnahmen (Ziel: OWASP Top 10)

## 🔄 Projekt-Prozesse

1. **Planung**
2. **Entwicklung**
3. **Testing**
4. **Deployment**
5. **Monitoring**

## 🚨 **ZEITERFASSUNG - STRICHTE PFLICHT OHNE TOLERANZ**

### **📋 VERBINDLICHE ZEITERFASSUNGS-REGELN (AB SOFORT)**

**Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT - VERBINDLICH**

**🚨 KEINE AUSNAHMEN - STRICHTE PFLICHT:**

1. **Vor jeder Datumseingabe:** Aktuelles Datum prüfen (27.06.2025)
2. **Nicht aus bestehenden Dateien kopieren:** Immer aktuelles Datum verwenden
3. **Format standardisieren:** DD.MM.YYYY (27.06.2025) oder YYYY-MM-DD (2025-06-27)
4. **Doppelte Prüfung:** Nach jeder Datumseingabe validieren
5. **Keine automatischen Daten:** Niemals Daten aus bestehenden Dateien übernehmen

**📊 VERBINDLICHE WORKFLOW-REGELN:**

- **Planung → Entwicklung:** Session beenden, neue starten
- **Entwicklung → Debugging:** Session beenden, neue starten
- **Debugging → Dokumentation:** Session beenden, neue starten
- **Dokumentation → Testing:** Session beenden, neue starten
- **Jeder Modul-Wechsel:** Session beenden, neue starten
- **Jede Pause > 5 Minuten:** Session pausieren oder beenden

**🎯 ZWECKE:**

- **Nachvollziehbarkeit:** Jeder Task klar dokumentiert
- **DSGVO-Compliance:** Vollständige Arbeitszeit-Dokumentation
- **Prozessoptimierung:** Identifikation von Zeitfressern
- **Qualitätssicherung:** Messbare Verbesserungen
- **Audit-Sicherheit:** Lückenlose Dokumentation

**⚠️ KONSEQUENZEN BEI VERSTÖSSEN:**

- **Datenverlust:** Überlappende Sessions werden bereinigt
- **Statistik-Fehler:** Ungenaue Zeitauswertungen
- **Compliance-Risiko:** DSGVO-Verstöße möglich
- **Prozess-Chaos:** Unübersichtliche Arbeitszeiterfassung

**✅ KONTROLLMECHANISMEN:**

- **Automatische Erkennung:** System warnt bei überlappenden Sessions
- **KI-Monitoring:** Cursor überwacht Zeiterfassung-Konsistenz
- **Tägliche Prüfung:** Automatische Validierung der Session-Daten
- **Wöchentliche Reports:** Übersicht über Zeiterfassung-Qualität

**🔧 TECHNISCHE UMSETZUNG:**

- **API-Endpoints:** Vollständig implementiert
- **Frontend-Komponenten:** Timer, Session-Management, Analytics
- **Automatische Erkennung:** Verhindert doppelte Sessions
- **Daten-Persistierung:** JSON-basiert mit Backup-Funktionalität
- **KI-Integration:** Automatisches Logging und Tracking

## 🚨 **DATUMSVALIDIERUNG - STRICHTE PFLICHT OHNE TOLERANZ**

### **📋 VERBINDLICHE DATUMS-REGELN (AB SOFORT)**

**Status:** ✅ **AB SOFORT VERBINDLICH**

**🚨 KEINE AUSNAHMEN - STRICHTE PFLICHT:**

1. **Vor jeder Zeitangabe:** Aktuelle Uhrzeit prüfen (z.B. 14:30 Uhr)
2. **Nicht aus bestehenden Dateien kopieren:** Immer aktuelle Uhrzeit verwenden
3. **Format standardisieren:** HH:MM (24-Stunden-Format, z.B. 14:30)
4. **Zeitzone berücksichtigen:** Deutschland (UTC+1/UTC+2)
5. **Doppelte Prüfung:** Nach jeder Zeitangabe validieren

**📊 VERBINDLICHE DATUMS-WORKFLOW-REGELN:**

- **Vor jeder .md-Änderung:** Aktuelles Datum prüfen
- **Bei neuen Einträgen:** Immer aktuelles Datum verwenden
- **Bei Datumsänderungen:** Doppelte Validierung durchführen
- **Bei Copy-Paste:** Datum immer manuell korrigieren

**📊 VERBINDLICHE UHRZEIT-WORKFLOW-REGELN:**

- **Vor jeder .md-Änderung:** Aktuelle Uhrzeit prüfen
- **Bei neuen Einträgen:** Immer aktuelle Uhrzeit verwenden
- **Bei Zeitangaben:** Doppelte Validierung durchführen
- **Bei Copy-Paste:** Uhrzeit immer manuell korrigieren

**🎯 ZWECKE:**

- **Korrekte Dokumentation:** Immer aktuelle Daten verwenden
- **Nachvollziehbarkeit:** Klare zeitliche Zuordnung
- **Professionelle Qualität:** Keine veralteten Daten
- **Audit-Sicherheit:** Lückenlose zeitliche Dokumentation

**🎯 ZWECKE DER UHRZEITVALIDIERUNG:**

- **Präzise Zeitangaben:** Immer aktuelle Uhrzeit verwenden
- **Zeitliche Nachvollziehbarkeit:** Exakte Zeitstempel
- **Prozessoptimierung:** Genaue Zeitmessung
- **Audit-Sicherheit:** Lückenlose zeitliche Dokumentation

**⚠️ KONSEQUENZEN BEI VERSTÖSSEN:**

- **Dokumentationsfehler:** Falsche zeitliche Zuordnung
- **Verwirrung:** Unklare Projektchronologie
- **Qualitätsverlust:** Unprofessionelle Dokumentation
- **Audit-Risiko:** Falsche zeitliche Nachweise

**✅ KONTROLLMECHANISMEN:**

- **Datumsvalidierung:** Vor jeder Eingabe prüfen
- **Uhrzeitvalidierung:** Vor jeder Zeitangabe prüfen
- **Format-Kontrolle:** Standardisiertes Datums- und Zeitformat
- **Aktualitätsprüfung:** Immer aktuelle Daten verwenden
- **Doppelte Validierung:** Nach Eingabe erneut prüfen

## 📝 Projekt-Format

## Dokumentationspflicht

Alle technischen Änderungen, Architekturentscheidungen und Besonderheiten MÜSSEN in der Projektdokumentation mit Zeitstempel festgehalten werden. Die Aktualität der Dokumentation ist Pflicht für alle Beteiligten.

## 🎨 Designsystem, Farbpalette & Typografie

### Farbpalette (barrierefrei & CI-konform)

| Name       | Hex     | Verwendung                 | Beispiel-Komponente      | Kontrast-Check |
| ---------- | ------- | -------------------------- | ------------------------ | -------------- |
| hauptblau  | #0055A4 | Buttons, Links, Akzente    | Button, Link, Logo       | AA ✔️          |
| akzentblau | #00BFFF | Hover, CTA, Icons          | CTA-Button, Icon         | AA ✔️          |
| gelb       | #FFD700 | Warnung, Akzent, Icons     | Warnhinweis, Icon        | AA ✔️          |
| dunkelgrau | #1C1C1C | Text, Header, Footer       | Header, Footer, Text     | AAA ✔️         |
| hellgrau   | #F4F4F4 | Flächen, Inputs, Sektionen | Card, Input, Hintergrund | AA ✔️          |
| weiß       | #FFFFFF | Hintergrund, Text          | Body, Text, Card         | AAA ✔️         |
| grün       | #48BB78 | Erfolgsmeldungen           | Alert, Badge             | AA ✔️          |
| rot        | #F56565 | Fehlermeldungen            | Alert, Badge             | AA ✔️          |
| orange     | #ED8936 | Warnungen                  | Alert, Badge             | AA ✔️          |
| kontrast   | #000000 | Fokus, Outline             | Fokus, Outline           | AAA ✔️         |

### Schriftarten

| Name       | Beispiel        | Verwendung                        |
| ---------- | --------------- | --------------------------------- |
| Inter      | Inter ABCDEFG   | Standard für Fließtext, Buttons   |
| Open Sans  | Open Sans ABCDE | Alternative für Fließtext, Zitate |
| sans-serif | Systemschrift   | Fallback                          |

**Barrierefreiheit:**

- Alle Farben erfüllen mindestens AA-Kontrast (Text auf Hintergrund)
- Für wichtige UI-Elemente (Buttons, Links, Warnungen) wird maximaler Kontrast verwendet
- Schriftgrößen und -arten sind für Lesbarkeit und Klarheit optimiert
- Dark/Light Mode wird vollständig unterstützt

## 🏗️ Aktuelle Projektstruktur

### ✅ Implementiert (Stand: 18.01.2025)

#### Frontend-Foundation

- **Next.js 14** mit TypeScript
- **TailwindCSS** mit deutscher Konfiguration
- **Barrierefreie Komponenten** (Button, Header, Footer, Layout)
- **Deutsche Utility-Klassen** und Farbpalette
- **Responsive Design** mit Mobile-First Ansatz

#### Domain-Architektur

- **lopez-it-welt.de** - Öffentliche Website (Next.js Frontend)
- **lopez-team.de** - Admin-Bereich (PHP Backend + MySQL)
- **Status:** Domains beim Hoster, später auf Netcup Server migrieren
- **SSL-Zertifikate:** Für beide Domains erforderlich

#### Komponenten-Struktur

```
src/components/
├── Core/           # Hauptkomponenten
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
├── Features/       # Feature-Komponenten
│   ├── Button.tsx
│   ├── Card.tsx
│   └── MarkdownContent.tsx
├── navigation/     # Navigationskomponenten
│   └── Sprachumschalter.tsx
└── auth/          # Authentifizierungskomponenten
```

#### Dokumentation

- **Pflichtenheft V1.2** mit detaillierter Startseiten-Struktur
- **STATUS.md** mit Compliance-Überwachung
- **CHANGELOG.md** mit vollständiger Änderungshistorie
- **QualityController.md** mit Qualitätsstandards

### 🔄 In Entwicklung

#### Startseiten-Struktur (Neue Anforderungen)

1. **Header** mit Logo "Lopez IT Welt"
2. **Hero Section** mit Claims:
   - 🇩🇪 "Digitale Lösungen mit Verstand & Verantwortung"
   - 🇬🇧 "Digital Solutions with Intelligence & Care"
3. **Hauptbereiche** (6 Teaser mit Icons):
   - 💼 IT-Support
   - 🖥️ PC-Bau & Einrichtung
   - 🌐 Webdesign & Automatisierung
   - 🤖 KI-Assistenz
   - 📝 Formularservice
   - 🛒 Webshop / Digitale Produkte
4. **Webshop-Teaser** mit Download-Produkten
5. **Trust-Block** "Warum Lopez IT Welt?"
6. **Kundenstimmen**
7. **Sicherheit & Qualität**
8. **Kontakt & Beratung**
9. **Footer**

### ❌ Noch nicht implementiert

#### Kritische Pflichtenheft-Anforderungen

- **Shop-Funktionalität** (Produktkatalog, Warenkorb, Checkout)
- **Dashboard** für Kunden
- **News/Blog** mit CMS
- **Kontaktformular** mit DSGVO-Compliance
- **Newsletter** Integration
- **Backend-Infrastruktur** (Node.js, PostgreSQL, Redis)
- **Test-Coverage** ≥80%
- **Performance-Optimierung** (LCP < 2,5s)

#### Multilingual-System

- **i18n-System** mit i18next
- **Sprachdateien** (de.json, en.json, es.json)
- **Sprachauswahl** im Header
- **Automatische Spracherkennung**

## 🎯 Nächste Schritte

### Phase 1A: Multilingual & UI-Foundation (Höchste Priorität)

1. **i18n-System** implementieren
2. **Header** mit Sprachauswahl erweitern
3. **Hero Section** mit neuen Claims überarbeiten

### Phase 1B: Startseiten-Struktur (Hohe Priorität)

1. **Hauptbereiche-Teaser** implementieren
2. **Webshop-Teaser** erstellen
3. **Trust-Block** und Kundenstimmen
4. **Kontaktblock** erweitern

### Phase 2: Backend & Compliance (Kritisch)

1. **Kontaktformular** mit DSGVO-Compliance
2. **Backend-Infrastruktur** aufbauen
3. **Test-Coverage** auf ≥80% erhöhen

## 📋 Compliance-Status

### ✅ Erfüllt

- Deutsche Tailwind-Konfiguration
- Barrierefreie Komponenten (WCAG 2.1 AA)
- Responsive Design
- Dokumentation aktuell

### ⚠️ Teilweise erfüllt

- Dark/Light Mode (vorbereitet, nicht vollständig)
- Performance (nicht getestet)

### ❌ Nicht erfüllt

- Shop-Funktionalität
- Dashboard
- News/Blog
- Kontaktformular
- Newsletter
- Test-Coverage ≥80%
- Backend-Infrastruktur

# Lopez IT Welt - Projekt

## Projektübersicht

**Lopez IT Welt** ist eine barrierefreie, mehrsprachige Webanwendung für IT-Dienstleistungen in Wunstorf und der Region Hannover.

### Projektziele

- Barrierefreie IT-Dienstleistungen anbieten
- Mehrsprachige Unterstützung (DE/EN/ES)
- DSGVO-konforme Implementierung
- Enterprise-Standards für Code und Datenschutz
- Benutzerfreundliche, inklusive Benutzeroberfläche

### Technologie-Stack

- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** NestJS, REST/GraphQL
- **Datenbank:** PostgreSQL
- **Infrastruktur:** Docker, Kubernetes, Terraform
- **CI/CD:** GitHub Actions

## 💳 Zahlungsmethoden

### Definierte Zahlungsarten (2025-01-18)

#### 1. PayPal Checkout

- **Status:** ✅ DEFINITION ABGESCHLOSSEN
- **Implementierung:** 🔄 AUSSTEHEND
- **Features:** Sofortige Bestätigung, PayPal-Login, Vertrauensvoll, Käuferschutz
- **Vorteile:** Sehr beliebt, einfach zu nutzen, sofortige Bestätigung

#### 2. Sofortüberweisung

- **Status:** ✅ DEFINITION ABGESCHLOSSEN
- **Implementierung:** 🔄 AUSSTEHEND
- **Features:** Sofortige Banküberweisung, Online-Banking-Integration, Bankauswahl
- **Vorteile:** Sofortige Bestätigung für Shop, sicher durch Bank-Authentifizierung

#### 3. SEPA-Überweisung

- **Status:** ✅ DEFINITION ABGESCHLOSSEN
- **Implementierung:** 🔄 AUSSTEHEND
- **Features:** Klassische Banküberweisung, sofortige Guthabenprüfung, garantierte Ausführung
- **Vorteile:** Vertraute Methode, keine Nachverfolgung nötig, garantiert 1-2 Werktage

### Sicherheitsstandards

- **DSGVO-konform:** Alle Zahlungsdaten nach deutschen Richtlinien
- **SSL-Verschlüsselung:** Alle Transaktionen verschlüsselt
- **Zero-Trust Architektur:** Maximale Sicherheit
- **Automatische Prüfung:** Nur bei ausreichendem Guthaben

### Technische Integration

- **Stripe:** Unterstützt alle drei Methoden
- **PayPal Checkout:** Direkte Integration
- **Adyen/Mollie:** Alternative Zahlungsdienstleister

### Nächste Schritte

1. **Zahlungs-APIs integrieren** (Stripe, PayPal)
2. **Checkout-Prozess implementieren**
3. **Sicherheitsvalidierung** durchführen
4. **DSGVO-Compliance** für Zahlungsdaten sicherstellen

### Projektstruktur

```
lopez-it-welt/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React-Komponenten
│   │   ├── Core/           # Hauptkomponenten
│   │   ├── Features/       # Feature-Komponenten
│   │   └── navigation/     # Navigation
│   ├── i18n/               # Internationalisierung
│   │   └── locales/        # Sprachdateien
│   └── styles/             # Globale Styles
├── docs/                   # Dokumentation
├── scripts/                # Build- und Deploy-Scripts
└── tests/                  # Tests
```

### Compliance-Anforderungen

#### DSGVO

- Cookie-Banner mit Zustimmung/Ablehnung
- Datenschutzerklärung
- Transparente Datenverarbeitung
- Benutzerrechte (Löschung, Auskunft)

#### Barrierefreiheit (BITV 2.0 / WCAG 2.1 AA)

- Semantische HTML-Struktur
- ARIA-Labels und Rollen
- Keyboard-Navigation
- Kontrastreiche Farben
- Screen-Reader-Kompatibilität

#### Deutsche Compliance

- Alle technischen Namen auf Deutsch
- Deutsche UI-Texte
- Deutsche Dokumentation
- Deutsche Rechtsprechung

### Entwicklungsumgebung

**Entwicklungsserver**: `http://localhost:3000`  
**Build-Befehl**: `npm run build`  
**Test-Befehl**: `npm test`  
**Lint-Befehl**: `npm run lint`

### Deployment

- **Staging**: Automatisches Deployment bei Push
- **Production**: Manuelles Deployment nach Tests
- **Monitoring**: Performance und Error-Tracking
- **Backup**: Automatische Backups

### Kontakt & Support

**Lopez IT Welt**  
Ramiro Lopez Rodriguez  
Alte Bahnhofstraße 13  
31515 Wunstorf  
Deutschland

**Telefon**: +49 (0) 5031 7005576  
**WhatsApp**: +49 15251574657  
**E-Mail**: kontakt@lopez-it-welt.de

### Projektstatus

- ✅ **Grundstruktur** implementiert
- ✅ **i18n-System** funktional
- ✅ **Cookie-Banner** DSGVO-konform
- ✅ **Responsive Design** implementiert
- ✅ **Barrierefreiheit** umgesetzt
- 🔄 **Webshop-Funktionalität** in Entwicklung
- 🔄 **Backend-Integration** geplant

### Nächste Schritte

1. **Kontaktformular** implementieren
2. **Webshop-Funktionalität** entwickeln
3. **Backend-API** aufsetzen
4. **Datenbank-Integration** planen
5. **E-Mail-System** konfigurieren
6. **Performance-Optimierung** durchführen
7. **Security-Audit** durchführen

---

**Projektleitung**: Lopez IT Welt  
**Standort**: Alte Bahnhofstraße 13, 31515 Wunstorf  
**Version**: 1.0.0  
**Letzte Aktualisierung**: 18.06.2025

## 🛠️ **TECHNISCHE UMSETZUNG - HOSTING & SHOP PLATTFORM**

### 🖥️ **Was brauchst du technisch?**

| Bereich                 | Aufgabe                                               | Tool/Vorschlag                                                   |
| ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| 🧠 **KI-Entwicklung**   | Automatisierung, Inhalte, Code                        | Cursor, OpenAI, GitHub Copilot                                   |
| 🌐 **Webseiten**        | Hosting deiner Seite + Kundenseiten                   | Nginx / Apache + PHP / Node.js                                   |
| 🛒 **Shop**             | Produkte anbieten, Bezahlung, Domainkauf              | Shop-System (z. B. Medusa, WooCommerce, Shopware, eigene Lösung) |
| 🌍 **Domains**          | Domainverkauf + Verwaltung                            | Domain-Reseller + DNS-API                                        |
| 📂 **Webspace**         | Kunden-Webspace mit FTP + Mail                        | z. B. Plesk, Froxlor, CyberPanel                                 |
| 📬 **E-Mail**           | Eigene & Kunden-Mails sicher einrichten               | Postfix, Dovecot, Roundcube, Mailcow                             |
| 💾 **Datenbank**        | MySQL/MariaDB (über XAMPP oder direkt auf dem Server) | Lokale DB mit phpMyAdmin                                         |
| 🔐 **SSL & Sicherheit** | HTTPS + Schutz vor Angriffen                          | Let's Encrypt + Fail2Ban + Firewall                              |
| 💡 **Automatisierung**  | Backup, Updates, Kundenregistrierung etc.             | Bash, Crontab, GitHub Actions                                    |

### ⚙️ **Aufbau: Wie sieht ein professionelles Hosting aus?**

#### 🔧 **Basis-Setup auf deinem Server (Debian 12)**

| Ziel                           | Tool                                          |
| ------------------------------ | --------------------------------------------- |
| **Webserver**                  | Nginx oder Apache                             |
| **PHP-Unterstützung**          | PHP 8.3                                       |
| **Datenbank**                  | MariaDB oder MySQL                            |
| **E-Mail**                     | Postfix + Dovecot + Roundcube                 |
| **DNS-Verwaltung**             | PowerDNS oder extern (z. B. via Reseller API) |
| **Hosting-Panel (optional)**   | Plesk, CyberPanel, Froxlor                    |
| **KI-Integration**             | Cursor                                        |
| **CMS (für dich oder Kunden)** | WordPress, Strapi, Headless CMS               |
| **Shop**                       | Medusa.js, Shopware, WooCommerce oder eigener |

### 🧠 **Domain-Management Strategien**

#### 🔄 **Möglichkeit 1: Du verwaltest Domains selbst**

**Dazu brauchst du:**

- Vertrag mit einem Domain-Reseller (z. B. OpenProvider, ResellerCamp)
- API-Zugriff, um:
  - Domainverfügbarkeiten zu prüfen
  - Domain zu kaufen, verlängern, kündigen
- Eigene Nameserver (z. B. mit PowerDNS)
- DNS-Interface für dich oder Kunden

**Oder du nimmst Plesk** – dort kannst du Domains & DNS direkt steuern.

#### 🧪 **Möglichkeit 2: Du nutzt Netcup als Reseller**

- Netcup bietet Reseller-Verwaltung
- Du kannst Domains unter deinem Namen verkaufen
- Alles über Webinterface oder API steuerbar

### 🏗️ **Aufbau der Website (Enterprise++)**

Du nutzt **Next.js 14 + TailwindCSS + TypeScript** mit diesen Regeln:

| Bereich                 | Beschreibung                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| 🧱 **Komponenten**      | Header, Footer, dynamischer Inhalt (children)                     |
| 🔁 **Wiederverwendbar** | Wie in PHP: Header & Footer bleiben, nur Inhalt wird ausgetauscht |
| 🌙 **Dark Mode**        | Responsiv und barrierefrei                                        |
| 🧠 **KI-Inhalte**       | Cursor kann Texte generieren                                      |
| 🌐 **Mehrsprachig**     | Deutsch, Englisch, Spanisch                                       |
| 🔐 **Login & Shop**     | Eigener Adminbereich + User-Login + Warenkorb                     |
| 🛠️ **CMS/DB**           | Inhalte kommen aus Datenbank / CMS (kein JSON mehr)               |

### 🔁 **Automatisierung durch Cursor**

| Aufgabe                          | Automatisiert durch Cursor |
| -------------------------------- | -------------------------- |
| **Seitenstruktur erzeugen**      | ✅                         |
| **Texte einfügen**               | ✅                         |
| **Code-Generierung**             | ✅                         |
| **Komponenten einbauen**         | ✅                         |
| **Domains prüfen**               | (mit API-Schnittstelle)    |
| **Kundenverwaltung vorbereiten** | (teilweise, Rest du)       |
| **Server-Setup optimieren**      | ✅ (via Bash)              |

### 📦 **Backup & Wiederherstellung**

| Methode              | Ort                                                | Intervall         |
| -------------------- | -------------------------------------------------- | ----------------- |
| **Automatisch**      | Externe HDD oder Cloud (z. B. Hetzner Storage Box) | täglich           |
| **Manuell (ZIP)**    | Lokales Verzeichnis                                | bei jeder Version |
| **Datenbank-Backup** | .sql.gz automatisch über Cron                      | täglich           |

### 💰 **Kostenstruktur**

| Bereich                             | Einmalig     | Monatlich                |
| ----------------------------------- | ------------ | ------------------------ |
| **Netcup Root Server**              | 0 €          | ~14–30 € (je nach Tarif) |
| **Domain-API (z. B. OpenProvider)** | 0–50 € Start | Abhängig vom Volumen     |
| **SSL, Firewall etc.**              | 0 €          | –                        |
| **Plesk (optional)**                | 5–10 €       | –                        |
| **Backup-Speicher (extern)**        | 0–10 €       | –                        |

### ✅ **Fazit: So baust du professionell auf**

- ✅ **Server ist gemietet** ✔
- ✅ **Debian installieren** ✔
- ✅ **Cursor einrichten** ✔
- ✅ **Next.js Projekt starten** ✔
- ✅ **Shop & Login einbauen** 🔜
- ✅ **Domains einbinden (API oder Netcup-Reseller)** 🔜
- ✅ **Alles DSGVO-konform & barrierefrei machen** 🔜

### 🏗️ **Technische Architektur**

#### **Frontend-Stack:**

- **Next.js 14** mit App Router
- **TypeScript** für Type Safety
- **TailwindCSS** für Styling
- **i18next** für Mehrsprachigkeit
- **Zustand** für State Management

#### **Backend-Stack:**

- **Node.js** mit Express.js
- **MariaDB/MySQL** für Datenbank
- **Redis** für Caching
- **Postfix/Dovecot** für E-Mail
- **PowerDNS** für DNS-Management

#### **DevOps-Stack:**

- **Docker** für Containerisierung
- **GitHub Actions** für CI/CD
- **Nginx** als Reverse Proxy
- **Let's Encrypt** für SSL
- **Fail2Ban** für Sicherheit

#### **Monitoring-Stack:**

- **Prometheus** für Metriken
- **Grafana** für Visualisierung
- **Sentry** für Error Tracking
- **Uptime Robot** für Uptime-Monitoring

### 🔄 **Deployment-Pipeline**

1. **Development** → Code-Entwicklung mit Cursor
2. **Testing** → Automatische Tests (Jest, Cypress)
3. **Staging** → Test-Umgebung auf Server
4. **Production** → Live-Deployment mit Zero-Downtime
5. **Monitoring** → Echtzeit-Überwachung aller Services

#### Qualitätssicherung & Automatisierung

- Alle Datenbank-Operationen (Testdaten, Migrationen, Strukturänderungen) werden als Skript/Task ausgeführt.
- Keine manuellen Änderungen in phpMyAdmin.
- Adminbereich/Backend bietet Funktionen für Testdaten-Handling.
- Jeder Task ist versioniert, dokumentiert und wird im STATUS.md protokolliert.
- Ziel: 100% Automatisierung und Nachvollziehbarkeit.

---

## 🖥️ **IT-DOKUMENTATION STRATEGIE - VOLLSTÄNDIGE IMPLEMENTIERUNG**

### 🎯 **ÜBERSICHT: ALLE BESPROCHENEN FEATURES**

**Datum:** 27.06.2025  
**Status:** 📋 **STRATEGIE DOKUMENTIERT**  
**Zweck:** Vollständige IT-Dokumentation für eigene Systeme und Kunden-Systeme  
**Geschäftsmodell:** IT-Dokumentation als Service + SaaS-Plattform

### 🏗️ **PHASEN-PLAN - SYSTEMATISCHE IMPLEMENTIERUNG**

#### **Phase 1: Grundlagen (Wochen 1-8) - KRITISCH**

**Hardware-Inventar:**
- [ ] Computer & Server - Workstations, Server, Spezifikationen
- [ ] Netzwerk-Geräte - Router, Switches, Access Points, Firewalls
- [ ] Peripherie - Drucker, Scanner, Monitore, Tastaturen
- [ ] Asset-Management - Seriennummern, Kaufdatum, Garantie, Standort

**Software-Inventar:**
- [ ] Betriebssysteme - Windows, Linux, macOS, Mobile OS
- [ ] Anwendungssoftware - Office, Browser, Antivirus, Fachsoftware
- [ ] Lizenz-Management - Lizenzschlüssel, Ablaufdaten, Kosten, Compliance

**Basis-Passwort-Manager:**
- [ ] Verschlüsselte Datenbank-Struktur (AES-256)
- [ ] Admin-Interface für Credentials
- [ ] 2FA für Passwort-Zugriff
- [ ] Audit-Trail für alle Zugriffe

**Netzwerk-Dokumentation:**
- [ ] Netzwerk-Topologie - IP-Adressen, Subnetze, VLANs, Routing
- [ ] Konfiguration - DHCP, DNS, Gateway, Proxy, VPN
- [ ] Sicherheit - Firewall-Regeln, WLAN-Passwörter, Verschlüsselung

#### **Phase 2: Erweiterte Features (Wochen 9-16) - HOCH**

**Monitoring & Reporting:**
- [ ] System-Monitoring - Performance, Verfügbarkeit, Netzwerk-Traffic
- [ ] Reports - Asset-Reports, Lizenz-Reports, Compliance-Reports, Kosten-Reports
- [ ] Alert-System - Bei Problemen automatisch benachrichtigen

**Cloud & Externe Dienste:**
- [ ] Cloud-Services - Microsoft 365, Google Workspace, AWS/Azure
- [ ] Externe Dienste - Domain-Management, SSL-Zertifikate, Hosting
- [ ] Integration APIs - Für automatische Synchronisation

**Organisation & Prozesse:**
- [ ] Organisationsstruktur - Abteilungen, Verantwortlichkeiten, Kontaktdaten
- [ ] Prozesse - Onboarding, Offboarding, Hardware-Austausch, Updates
- [ ] Dokumentation - Anleitungen, Troubleshooting, Best Practices

#### **Phase 3: Enterprise-Features (Wochen 17-24) - ENTERPRISE++**

**Automatisierung:**
- [ ] Automatische Erkennung - Neue Geräte finden
- [ ] Scheduled Scans - Regelmäßige Inventarisierung
- [ ] Workflow-Automatisierung - Prozesse automatisieren
- [ ] KI-gestützte Analyse - Intelligente Empfehlungen

**Integration:**
- [ ] Active Directory - Windows-Domäne
- [ ] LDAP - Verzeichnisdienste
- [ ] SNMP - Netzwerk-Monitoring
- [ ] API-Integration - Mit anderen Systemen

**Multi-Tenant System:**
- [ ] Kunden-spezifische Bereiche
- [ ] Isolierte Datenbank-Schemas
- [ ] Kunden-Portale mit eigener Dokumentation
- [ ] White-Label Optionen

#### **Phase 4: Compliance & Sicherheit (Wochen 25-32) - ENTERPRISE++**

**Compliance-Suite:**
- [ ] DSGVO-Compliance - Datenschutz-Grundverordnung
- [ ] ISO 27001 - Informationssicherheit
- [ ] SOX-Compliance - Sarbanes-Oxley (USA)
- [ ] HIPAA - Gesundheitswesen (USA)

**Advanced Security:**
- [ ] Zero-Trust-Architektur
- [ ] Hardware-Token Integration (YubiKey)
- [ ] Biometrische Authentifizierung
- [ ] Advanced Encryption Standards

### 🗄️ **DATENBANK-ARCHITEKTUR**

#### **Haupttabellen:**

```sql
-- Hardware-Inventar
CREATE TABLE hardware_assets (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36),
  name VARCHAR(255),
  type ENUM('server', 'workstation', 'network_device', 'peripheral'),
  model VARCHAR(255),
  serial_number VARCHAR(255),
  purchase_date DATE,
  warranty_expiry DATE,
  location VARCHAR(500),
  specifications JSON,
  status ENUM('active', 'inactive', 'maintenance', 'retired'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Software-Inventar
CREATE TABLE software_assets (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36),
  name VARCHAR(255),
  version VARCHAR(100),
  license_key VARCHAR(500),
  license_expiry DATE,
  cost DECIMAL(10,2),
  vendor VARCHAR(255),
  installation_date DATE,
  status ENUM('active', 'expired', 'unlicensed'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Netzwerk-Dokumentation
CREATE TABLE network_devices (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36),
  name VARCHAR(255),
  type ENUM('router', 'switch', 'firewall', 'access_point'),
  ip_address VARCHAR(45),
  mac_address VARCHAR(17),
  model VARCHAR(255),
  firmware_version VARCHAR(100),
  configuration JSON,
  location VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Passwort-Management (VERSCHLÜSSELT!)
CREATE TABLE customer_credentials (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36),
  system_name VARCHAR(255),
  credential_type ENUM('admin', 'user', 'vpn', 'cloud', 'hosting'),
  username VARCHAR(255),
  password_encrypted TEXT, -- AES-256 VERSCHLÜSSELT!
  url VARCHAR(500),
  notes TEXT,
  last_used TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Zugriffs-Logs (für Audit)
CREATE TABLE access_logs (
  id VARCHAR(36) PRIMARY KEY,
  credential_id VARCHAR(36),
  user_id VARCHAR(36),
  access_type ENUM('login', 'password_change', 'access_denied'),
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN,
  created_at TIMESTAMP
);
```

### 🔐 **SICHERHEITS-ARCHITEKTUR**

#### **Enterprise++ Sicherheits-Standards:**

```typescript
interface SecurityStandards {
  encryption: {
    algorithm: 'AES-256-GCM';
    keyRotation: '90 days';
    keyStorage: 'Hardware Security Module';
  };
  authentication: {
    twoFactor: 'required';
    passwordPolicy: 'complex';
    sessionTimeout: '15 minutes';
    maxLoginAttempts: 3;
  };
  authorization: {
    roleBased: 'required';
    leastPrivilege: 'enforced';
    auditTrail: '100%';
  };
  compliance: {
    gdpr: 'full';
    iso27001: 'certified';
    sox: 'compliant';
  };
}
```

### 💼 **GESCHÄFTSMODELL**

#### **Service-Angebote:**

**1. IT-Dokumentation als Service:**
- **Einmalige Dokumentation:** €2.000 - €10.000 (je nach Größe)
- **Regelmäßige Wartung:** €200 - €1.000/Monat
- **Compliance-Audits:** €500 - €2.000/Audit

**2. SaaS-Plattform:**
- **Basic:** €50/Monat (bis 100 Assets)
- **Professional:** €150/Monat (bis 500 Assets)
- **Enterprise:** €500/Monat (unbegrenzt)

**3. Hybrid-Modell:**
- **Eigene Dokumentation** + Beratung
- **Schulungen** für Kunden-Mitarbeiter
- **Support** und Wartung

### 🎯 **ZIELGRUPPEN**

**Primäre Zielgruppen:**
- **Mittelständische Unternehmen** (50-500 Mitarbeiter)
- **IT-Dienstleister** (MSPs)
- **Compliance-pflichtige Branchen** (Banken, Versicherungen)
- **Öffentliche Verwaltung**

**Sekundäre Zielgruppen:**
- **Kleine Unternehmen** (10-50 Mitarbeiter)
- **Startups** mit IT-Infrastruktur
- **Bildungseinrichtungen**
- **Gesundheitswesen**

### 🚀 **TECHNISCHE IMPLEMENTIERUNG**

#### **Agent-Entwicklung:**
- **Python/Node.js Agent** für automatische Erfassung
- **WMI/SNMP Scanner** für Windows/Netzwerk-Geräte
- **API-Integration** mit bestehendem System
- **Scheduled Scans** für regelmäßige Updates

#### **Web-Interface:**
- **Erweiterung des Admin-Bereichs** in Next.js
- **Kunden-spezifische Dashboards**
- **Report-Generator** mit PDF/Excel Export
- **Mobile-optimierte** Benutzeroberfläche

#### **API-System:**
- **REST APIs** für alle Funktionen
- **GraphQL** für komplexe Abfragen
- **Webhook-System** für Integrationen
- **Rate Limiting** und Sicherheit

### 📊 **SUCCESS METRICS**

#### **Technische Metriken:**
- **System-Uptime:** 99.9%
- **Response Time:** < 200ms
- **Data Accuracy:** 99.5%
- **Security Incidents:** 0

#### **Business Metriken:**
- **Customer Acquisition:** 10 Kunden/Monat
- **Customer Retention:** 95%
- **Revenue Growth:** 20%/Monat
- **Market Penetration:** 5% in Zielmarkt

### ⚠️ **RISIKEN & MITIGATION**

#### **Technische Risiken:**
- **Datenverlust:** Automatische Backups, Redundanz
- **Sicherheitslücken:** Regelmäßige Audits, Penetration Tests
- **Performance-Probleme:** Monitoring, Auto-Scaling

#### **Business Risiken:**
- **Marktkonkurrenz:** Unique Value Proposition, Qualitätsvorsprung
- **Regulatorische Änderungen:** Compliance-Monitoring
- **Technologie-Wandel:** Agile Entwicklung, Continuous Learning

### 🎯 **NÄCHSTE SOFORTIGE SCHRITTE**

1. **Datenbank-Schema** für Hardware-Inventar erstellen
2. **Admin-Interface** für Asset-Management entwickeln
3. **Passwort-Manager** mit Verschlüsselung implementieren
4. **Agent-Prototyp** für automatische Erfassung entwickeln
5. **Kunden-Portal** mit Multi-Tenant-Architektur

---

**Projektleitung**: Lopez IT Welt  
**Standort**: Alte Bahnhofstraße 13, 31515 Wunstorf  
**Version**: 1.0.0  
**Letzte Aktualisierung**: 18.06.2025
