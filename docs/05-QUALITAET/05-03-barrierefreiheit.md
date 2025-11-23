# Barrierefreiheit (Accessibility) - Lopez IT Welt

## Übersicht

Die Lopez IT Welt Website wurde für maximale Barrierefreiheit optimiert und erfüllt die WCAG 2.1 AA/AAA Standards.

## Implementierte Verbesserungen

### 1. Farbkontraste

**Hohe Kontraste für bessere Lesbarkeit:**

- Haupttext: `#1f2937` auf weißem Hintergrund (Kontrast 15:1)
- Sekundärtext: `#4b5563` (Kontrast 7:1)
- Links: `#1d4ed8` mit Unterstreichung
- Buttons: `#1d4ed8` auf weißem Hintergrund

### 2. Typografie

**Optimierte Schriftgrößen und Zeilenabstände:**

- Basis-Schriftgröße: 16px
- Zeilenabstand: 1.6 für bessere Lesbarkeit
- Überschriften: Hierarchische Größen (20px - 48px)
- Font-Family: Inter (optimiert für Bildschirm)

### 3. Fokus-Indikatoren

**Deutliche Fokus-Styles:**

- 2px blauer Outline mit 2px Offset
- Focus-Ring für alle interaktiven Elemente
- Hover-Effekte mit visueller Rückmeldung

### 4. Reduzierte Bewegung

**Respektiert `prefers-reduced-motion`:**

- Animationen werden bei Bedarf deaktiviert
- Sanfte Übergänge statt abrupte Bewegungen
- Keine störenden Animationen

### 5. Semantische HTML-Struktur

**Korrekte Verwendung von HTML5-Elementen:**

- `<main>`, `<section>`, `<article>`, `<nav>`
- ARIA-Labels und Rollen
- Korrekte Überschriften-Hierarchie

### 6. Barrierefreie Komponenten

**Neue Accessibility-Komponenten:**

- `AccessibleCard`: Karten mit hohen Kontrasten
- `AccessibleButton`: Buttons mit Fokus-Styles
- Barrierefreie Formulare und Tabellen

## CSS-Klassen für Barrierefreiheit

### Textfarben

```css
.text-primary    /* Haupttext - hoher Kontrast */
.text-secondary  /* Sekundärtext */
.text-tertiary   /* Tertiärtext */
.text-inverse    /* Text auf dunklem Hintergrund */
```

### Hintergrundfarben

```css
.bg-primary      /* Haupthintergrund */
.bg-secondary    /* Sekundärhintergrund */
.bg-tertiary     /* Tertiärhintergrund */
.bg-dark         /* Dunkler Hintergrund */
```

### Utility-Klassen

```css
.focus-visible   /* Fokus-Style */
.high-contrast   /* Hoher Kontrast Modus */
.reduced-motion  /* Reduzierte Bewegung */
```

## Testing

### Automatisierte Tests

- Lighthouse Accessibility Score
- axe-core Integration
- Color Contrast Checker

### Manuelle Tests

- Tastaturnavigation
- Screen Reader Tests
- Zoom-Tests (bis 200%)

## Compliance

### WCAG 2.1 Standards

- ✅ **Perceivable**: Hohe Kontraste, alternative Texte
- ✅ **Operable**: Tastaturnavigation, Fokus-Indikatoren
- ✅ **Understandable**: Klare Sprache, konsistente Navigation
- ✅ **Robust**: Semantisches HTML, ARIA-Support

### Deutsche Standards

- BITV 2.0 Compliance
- DIN EN 301 549 V3.2.1

## Nächste Schritte

1. **Screen Reader Tests** mit NVDA und JAWS
2. **Mobile Accessibility** Optimierung
3. **Voice Navigation** Support
4. **High Contrast Mode** Erweiterung

## Kontakt

Bei Fragen zur Barrierefreiheit: accessibility@lopez-it-welt.de
