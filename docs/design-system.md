# 🎨 Lopez IT Welt - Design System

## 📋 Übersicht

Das Design-System von Lopez IT Welt basiert auf den CI-Richtlinien und bietet einheitliche Komponenten für alle Anwendungen.

## 🎨 Farbpalette

### Primärfarben
- **Hauptblau**: `#1e40af` - Hauptfarbe für Buttons und Links
- **Akzentblau**: `#3b82f6` - Akzentfarbe für Hover-Effekte
- **Dunkelgrau**: `#1f2937` - Text und Hintergründe
- **Hellgrau**: `#6b7280` - Sekundärer Text

### Sekundärfarben
- **Weiß**: `#ffffff` - Hintergründe und Text auf dunklen Flächen
- **Gelb**: `#fbbf24` - Warnungen und Highlights
- **Orange**: `#f97316` - Call-to-Actions
- **Rot**: `#ef4444` - Fehler und wichtige Hinweise
- **Grün**: `#10b981` - Erfolg und Bestätigungen

## 📏 Typografie

### Überschriften
```css
.text-ueberschrift-klein: 1.125rem (18px)
.text-ueberschrift-mittel: 1.25rem (20px)
.text-ueberschrift-gross: 1.5rem (24px)
.text-ueberschrift-xl: 1.875rem (30px)
.text-ueberschrift-2xl: 2.25rem (36px)
```

### Text
```css
.text-text-klein: 0.875rem (14px)
.text-text-mittel: 1rem (16px)
.text-text-gross: 1.125rem (18px)
```

## 🔘 Komponenten

### Button
```tsx
import { Button } from '@/components/ui';

// Varianten
<Button variant="primary">Primär</Button>
<Button variant="secondary">Sekundär</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Größen
<Button size="sm">Klein</Button>
<Button size="md">Mittel</Button>
<Button size="lg">Groß</Button>
<Button size="xl">Extra Groß</Button>
```

### Card
```tsx
import { Card } from '@/components/ui';

// Varianten
<Card variant="default">Standard</Card>
<Card variant="elevated">Erhöht</Card>
<Card variant="outlined">Umrandet</Card>
<Card variant="glass">Glas-Effekt</Card>

// Padding
<Card padding="none">Kein Padding</Card>
<Card padding="sm">Kleines Padding</Card>
<Card padding="md">Mittleres Padding</Card>
<Card padding="lg">Großes Padding</Card>
<Card padding="xl">Extra großes Padding</Card>
```

### Heading
```tsx
import { Heading } from '@/components/ui';

// Levels
<Heading level={1}>H1 Überschrift</Heading>
<Heading level={2}>H2 Überschrift</Heading>
<Heading level={3}>H3 Überschrift</Heading>

// Varianten
<Heading variant="default">Standard</Heading>
<Heading variant="gradient">Gradient</Heading>
<Heading variant="accent">Akzent</Heading>
<Heading variant="muted">Gedämpft</Heading>

// Größen
<Heading size="xs">Sehr klein</Heading>
<Heading size="sm">Klein</Heading>
<Heading size="md">Mittel</Heading>
<Heading size="lg">Groß</Heading>
<Heading size="xl">Extra groß</Heading>
<Heading size="2xl">2XL</Heading>
<Heading size="3xl">3XL</Heading>
```

### Container
```tsx
import { Container } from '@/components/ui';

// Größen
<Container size="sm">Klein</Container>
<Container size="md">Mittel</Container>
<Container size="lg">Groß</Container>
<Container size="xl">Extra groß</Container>
<Container size="full">Vollbreite</Container>

// Padding
<Container padding="none">Kein Padding</Container>
<Container padding="sm">Kleines Padding</Container>
<Container padding="md">Mittleres Padding</Container>
<Container padding="lg">Großes Padding</Container>
<Container padding="xl">Extra großes Padding</Container>
```

## 🎭 Animationen

### Übergänge
```css
.duration-uebergang-schnell: 150ms
.duration-uebergang-normal: 300ms
.duration-uebergang-langsam: 500ms
```

### Hover-Effekte
```css
.hover:scale-102: 1.02x Skalierung
.hover:scale-98: 0.98x Skalierung
.hover:scale-112: 1.12x Skalierung
```

## 📐 Abstände

### Padding
```css
.p-3: 0.75rem (12px)
.p-4: 1rem (16px)
.p-6: 1.5rem (24px)
.p-8: 2rem (32px)
.p-12: 3rem (48px)
```

### Margin
```css
.m-3: 0.75rem (12px)
.m-4: 1rem (16px)
.m-6: 1.5rem (24px)
.m-8: 2rem (32px)
.m-12: 3rem (48px)
```

## 🎨 Schatten

```css
.shadow-klein: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
.shadow-mittel: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
.shadow-gross: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
.shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
.shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## 🔄 Verwendung

### Best Practices

1. **Konsistenz**: Verwende immer die vordefinierten Komponenten
2. **Barrierefreiheit**: Alle Komponenten sind ARIA-konform
3. **Responsive**: Alle Komponenten sind mobil-optimiert
4. **Performance**: Minimale Bundle-Größe durch Tree-Shaking

### Import-Beispiel
```tsx
import { Button, Card, Heading, Container } from '@/components/ui';

export function MyComponent() {
  return (
    <Container>
      <Heading level={1} variant="gradient" centered>
        Willkommen
      </Heading>
      <Card variant="glass" padding="lg">
        <p>Inhalt hier...</p>
        <Button variant="primary" size="lg">
          Aktion
        </Button>
      </Card>
    </Container>
  );
}
```

## 🔧 Anpassungen

### Neue Varianten hinzufügen
```tsx
// In der Komponente
const buttonVariants = {
  // ... bestehende Varianten
  custom: 'bg-custom-color text-custom-text',
};
```

### Neue Größen hinzufügen
```tsx
// In der Komponente
const buttonSizes = {
  // ... bestehende Größen
  '2xl': 'px-16 py-8 text-2xl',
};
```

## 📚 Weiterführende Links

- [Tailwind CSS Dokumentation](https://tailwindcss.com/docs)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Design System Best Practices](https://www.designsystems.com/) 