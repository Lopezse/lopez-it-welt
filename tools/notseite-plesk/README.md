# Lopez IT Welt – Not-/Aufbau-Seite für Plesk-Webspace

**Version:** 1.0  
**Letzte Aktualisierung:** 2025-11-24  
**Status:** ✅ Produktionsbereit

## ⚠️ WICHTIG: Unabhängig vom Hauptprojekt

**Diese Dateien sind komplett unabhängig vom Next.js-Hauptprojekt.**  
Alle Änderungen in diesem Ordner (`tools/notseite-plesk/`) betreffen **NUR** die statische Not-/Aufbauseite und haben **KEINEN** Einfluss auf:

- Das Next.js-Hauptprojekt
- Das Admin-Dashboard
- Die Datenbank-Struktur
- API-Routen oder Backend-Logik
- Andere Projekt-Module

## Zweck

Diese statischen HTML-Dateien sind für den temporären Einsatz auf dem Plesk-Webspace gedacht, während der neue Server noch nicht bereit ist. Die Seite folgt Enterprise++ Standards und ist vollständig SEO-optimiert.

## Dateien

- `index.html` – Hauptseite mit Aufbau-Informationen (SEO-optimiert, Schema.org)
- `impressum.html` – Kompaktes Impressum (rechtssicher, vereinfacht)
- `datenschutz.html` – Datenschutzhinweis (DSGVO-konform, kein Tracking)
- `styles.css` – Enterprise++ CSS-Styling (SAP/IBM/Siemens-Stil)
- `logo-lw-mark.svg` – Enterprise-Logo (LW-Quadrat, für Favicon/Touch-Icon)
- `favicon.svg` – Browser-Favicon
- `README.md` – Diese Dokumentation

## Installation auf Plesk

1. Alle Dateien in den `httpdocs` Ordner des Plesk-Webspaces hochladen
2. Die Dateien sollten direkt unter der Domain erreichbar sein:
   - `https://lopez-it-welt.de/` (Hauptseite)
   - `https://lopez-it-welt.de/impressum.html`
   - `https://lopez-it-welt.de/datenschutz.html`

## Features (Enterprise++ Standard)

### ✅ SEO-Optimierung

- **Meta-Tags:** Vollständige Primary Meta Tags, Open Graph, Twitter Cards
- **Strukturierte Daten:** Schema.org Organization-Markup
- **Canonical URLs:** Für alle Seiten definiert
- **Semantic HTML:** Korrekte HTML5-Struktur
- **Alt-Texte:** Alle Bilder mit beschreibenden Alt-Texten

### ✅ Design & UX

- **Enterprise++ Stil:** SAP/IBM/Siemens-inspiriertes Design
- **Moderner Kontaktbereich:** Professionelle Link-Hover-Effekte
- **Responsive Design:** Optimiert für Desktop und Mobile
- **Konsistente Typografie:** Montserrat-Schriftart, klare Hierarchie

### ✅ Rechtssicherheit

- **Impressum:** Kompakt, rechtssicher, ohne überflüssige Standardtexte
- **Datenschutz:** Klarer Hinweis, keine Cookies, kein Tracking
- **DSGVO-konform:** Vollständig konform ohne Tracking-Tools

### ✅ Technische Details

- **Favicons:** Korrekte MIME-Types (`image/svg+xml` für SVG-Dateien)
- **Performance:** Keine externen Skripte, schnelle Ladezeiten
- **Barrierefreiheit:** Semantic HTML, Alt-Texte, klare Struktur

## Logo & Branding

- **`logo-lw-mark.svg`**: Enterprise-taugliches LW-Mark (nur Quadrat mit "LW")
  - Verwendet als Favicon und Apple Touch Icon
  - Sauberes Design ohne Glow-Effekte
  - CI-Farben: Blau-Gradient (#007BFF → #0056B3)
- **`favicon.svg`**: Browser-Favicon-Variante

## Kontaktinformationen

- **E-Mail:** info@lopez-it-welt.de
- **Telefon:** +49 (0) 5031 7005576
- **LinkedIn:** [Profil besuchen](https://www.linkedin.com/in/ramiro-lopez-rodriguez-b470a8204)
- **XING:** [Profil besuchen](https://www.xing.com/profile/Ramiro_LopezRodriguez2)

## Wichtige Informationen

- **Geplanter Start:** ab 01. Januar (ohne exaktes Datum)
- **Kernbotschaft:** Sicherheit, Qualität und Stabilität stehen im Vordergrund
- **Enterprise++ Standards:** Strukturierte Entwicklung nach bewährten Methoden

## Technische Hinweise

- **⚠️ Komplett unabhängig vom Next.js-Hauptprojekt** – alle Änderungen hier betreffen NUR diese Notseite
- **Keine Build-Schritte nötig** – reines HTML + CSS, direkt auf Plesk hochladbar
- **Kein Tracking** – keine Analytics, keine Cookies, DSGVO-konform
- **SEO-ready** – vollständig für Suchmaschinen optimiert
- **Löschbar ohne Konsequenzen** – kann nach Go-Live einfach entfernt werden, ohne das Hauptprojekt zu beeinflussen

## Nach dem Go-Live

Diese Dateien können nach dem Go-Live des neuen Servers einfach gelöscht werden, ohne dass andere Teile des Projekts beeinträchtigt werden.
