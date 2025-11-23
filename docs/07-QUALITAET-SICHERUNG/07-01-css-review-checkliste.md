# CSS-Review-Checkliste

## 📋 Übersicht

Diese Checkliste dient der einheitlichen Qualitätssicherung aller CSS-Styles und UI-Komponenten im Projekt.

**🎯 Ziel:** Mit den kleinen Verbesserungen wird es ein perfektes, professionelles Design-System.

## ✅ 1. Allgemeine Struktur

### Namenskonventionen

- [ ] Einheitliche Namenskonventionen verwendet (BEM, Tailwind-Utilities konsistent)
- [ ] Kein unnötiger oder ungenutzter CSS-Code vorhanden
- [ ] Styles sind modular (Komponenten-basiert) und nicht global überschreibend
- [ ] Kein `!important` ohne klaren Grund

### Code-Qualität

- [ ] Keine doppelten CSS-Dateien (`globals.css` nur in `src/app/`)
- [ ] Tailwind Purge korrekt konfiguriert
- [ ] Keine Inline-Styles für wiederkehrende Komponenten
- [ ] CSS-Kommentare für komplexe Styles vorhanden

## ✅ 2. Farben & Kontraste

### WCAG-Konformität

- [ ] Alle Farben sind in Variablen oder Tailwind-Config definiert
- [ ] Farbkontrast erfüllt WCAG AA / AAA (mind. 4.5:1 für Text, 3:1 für große Schrift)
- [ ] Keine zu ähnlichen Farbtöne ohne funktionellen Unterschied
- [ ] Fokus-Indikatoren gut sichtbar und CI-konform

### Farb-Definitionen

- [ ] Hauptfarben: `hauptblau`, `akzentblau`, `weiss`, `dunkelgrau`
- [ ] Kontrastfarben: `hellgrau`, `mittelgrau`, `dunkelgrau`
- [ ] Status-Farben: `success`, `warning`, `error`, `info`
- [ ] Dark Mode Farben definiert (nicht nur invertiert)

## ✅ 3. Typografie

### Schrift-System

- [ ] Einheitliche Schriftfamilie im gesamten Projekt (Inter)
- [ ] Überschriften-Hierarchie korrekt (h1-h6, ohne Sprünge)
- [ ] Einheitliche Schriftgrößen und -gewichte je Heading-Level
- [ ] Zeilenhöhe (line-height) ausreichend für gute Lesbarkeit

### Responsive Typografie

- [ ] Keine hartcodierten px-Werte, wenn Tailwind rem/em nutzt
- [ ] Schriftgrößen skalieren responsiv
- [ ] Mindestgröße 16px für Body-Text
- [ ] Font-Display: swap für externe Fonts

## ✅ 4. Spacing & Layout

### Einheitliche Abstände

- [ ] Einheitliche Abstände (Padding, Margin) gemäß Design-System
- [ ] Grid- und Flexlayouts konsistent genutzt
- [ ] Keine negativen Margins ohne klaren Zweck
- [ ] Responsive Breakpoints abgestimmt auf CI (sm, md, lg, xl, 2xl)

### Section-Struktur

- [ ] Section-Abstände einheitlich (z.B. `py-20`, `py-28`)
- [ ] Container-Breiten konsistent (`max-w-7xl`, `max-w-6xl`)
- [ ] Grid-Gaps einheitlich (`gap-6`, `gap-8`, `gap-12`)
- [ ] Mobile-First Ansatz befolgt

## ✅ 5. Buttons & Interaktionen

### Button-Design

- [ ] Buttons haben einheitliches Design (Radius, Shadow, Farbe)
- [ ] Hover-, Focus- und Active-States vorhanden und unterscheidbar
- [ ] Disabled-Styles klar erkennbar
- [ ] Kein doppelter Button-Style für gleiche Funktion

### Interaktivität

- [ ] Alle interaktiven Elemente sind per Tab erreichbar
- [ ] Fokus-Ringe sichtbar und CI-konform
- [ ] Hover-Effekte mit Animationen (transition)
- [ ] Loading-States für Buttons implementiert

## ✅ 6. Cards & Components

### Card-Konsistenz

- [ ] Card-Komponenten einheitlich (Shadow, Radius, Padding, Hover)
- [ ] FeatureLists konsistent (Icon, Font, Farbe)
- [ ] Keine Inline-Styles für wiederkehrende Komponenten
- [ ] Glassmorphism-Effekte einheitlich

### Komponenten-Struktur

- [ ] Alle Komponenten in `src/components/ui/` zentralisiert
- [ ] Props-Interfaces exportiert
- [ ] TypeScript-Support vollständig
- [ ] Barrierefreiheit implementiert

## ✅ 7. Barrierefreiheit (Accessibility)

### WCAG 2.1 AA/AAA

- [ ] Alle interaktiven Elemente sind per Tab erreichbar
- [ ] `aria-labels` oder `aria-hidden` korrekt gesetzt
- [ ] Keine Elemente ohne ausreichende Fokus-Anzeige
- [ ] Farbkontraste und Schriftgrößen mindestens 16px

### Screen Reader Support

- [ ] Semantische HTML-Struktur
- [ ] ARIA-Attribute korrekt gesetzt
- [ ] Keine rein farbbasierte Unterscheidung
- [ ] Alt-Texte für Bilder vorhanden

## ✅ 8. Performance & Best Practices

### CSS-Optimierung

- [ ] Kein ungenutztes CSS in der Production-Build
- [ ] Tailwind Purge / Content Paths korrekt definiert
- [ ] Externe Fonts mit `display=swap` eingebunden
- [ ] Keine Render-Blocking CSS- oder Font-Dateien

### Build-Optimierung

- [ ] CSS-Minifizierung aktiviert
- [ ] Critical CSS extrahiert
- [ ] Lazy Loading für nicht-kritische Styles
- [ ] Bundle-Size optimiert

## ✅ 9. Dark Mode

### Dark Mode Implementierung

- [ ] Dark Mode Farben definiert (nicht nur invertiert)
- [ ] Fokus-Ringe und Buttons im Dark Mode gut sichtbar
- [ ] Keine unlesbaren Texte im Dark Mode
- [ ] Smooth Transitions zwischen Light/Dark

### Dark Mode Farben

- [ ] Hintergrund: `bg-gray-900` / `bg-gray-800`
- [ ] Text: `text-gray-100` / `text-gray-200`
- [ ] Borders: `border-gray-700` / `border-gray-600`
- [ ] Cards: `bg-gray-800` / `bg-gray-700`

## ✅ 10. Testing & Final Review

### Visuelle Tests

- [ ] Visuelle Tests auf allen Breakpoints durchgeführt
- [ ] Browser-Tests in Edge, Chrome, Firefox, Safari (mindestens)
- [ ] Lighthouse Audit (Accessibility, Performance, Best Practices, SEO ≥ 90)
- [ ] Prüfung auf Barrierefreiheit (z.B. WebAIM, Axe DevTools)

### Qualitätssicherung

- [ ] Code-Review durchgeführt
- [ ] Linting-Fehler behoben
- [ ] TypeScript-Fehler behoben
- [ ] Performance-Tests bestanden

## 📊 Review-Status

### Checkliste ausfüllen:

- [ ] Alle Punkte durchgegangen
- [ ] Probleme dokumentiert
- [ ] Verbesserungen implementiert
- [ ] Final Review abgeschlossen

### Review-Datum: **\*\***\_\_\_**\*\***

### Reviewer: **\*\*\*\***\_**\*\*\*\***

### Status: ⚠️ In Bearbeitung / ✅ Abgeschlossen / ❌ Probleme gefunden

---

## 🔧 Automatisierte Checks

### Pre-commit Hooks

```bash
# CSS-Linting
npm run lint:css

# TypeScript-Check
npm run type-check

# Accessibility-Test
npm run test:a11y
```

### CI/CD Pipeline

```yaml
# CSS-Qualitäts-Checks
- name: CSS Quality Check
  run: |
    npm run lint:css
    npm run test:a11y
    npm run lighthouse:ci
```

---

## 📝 Notizen

### Gefundene Probleme:

-

### Implementierte Verbesserungen:

-

### Nächste Schritte:

- ***

_Letzte Aktualisierung: 2025-07-08_
