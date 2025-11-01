# 📋 Entwicklungsrichtlinien - Lopez IT Welt

## 🏗️ **MODULARE ARCHITEKTUR - PFLICHT**

### ✅ **WICHTIG: Architektur ist bereits modular implementiert!**

**NICHT neu entwickeln - nur erweitern!**

**Bestehende Module verwenden:**

- `src/components/Core/` - Header, Footer, Layout ✅
- `src/components/Features/` - Button, Card, FAQ ✅
- `src/components/navigation/` - Sprachumschalter ✅
- `src/components/auth/` - Login/Registrierung ✅

**Modulare Entwicklungsrichtlinien:**

1. **Bestehende Module verwenden** - Nicht neu erfinden
2. **Nur Inhalte anpassen** - Design, Texte, Logo
3. **Neue Module hinzufügen** - Shop, Admin, etc.
4. **Modulare Struktur beibehalten** - Saubere Trennung

**Verboten:**

- ❌ Komplette Neuentwicklung bestehender Module
- ❌ Architektur ändern
- ❌ Bestehende Module zerstören

**Modulare Vorteile:**

- 🔧 **Flexibel erweiterbar** - Neue Module hinzufügen
- 🔄 **Wartungsfreundlich** - Einzelne Module austauschen
- 🚀 **Schneller Online** - Bestehende Module verwenden
- 🧠 **KI-gestützt** - Gezielte Modul-Entwicklung

## 🎯 Icon-Strategie - PFLICHT (NICHT EMPFEHLUNG)

### ⚠️ **VERBINDLICHE RICHTLINIEN - MÜSSEN EINGEHALTEN WERDEN**

#### 1. **Lucide React** - PFLICHT für Hauptnavigation & Interface

- **MUSS verwendet werden** für:
  - Navigation Icons (Menu, Close, Arrow)
  - Interface Icons (Settings, User, Search)
  - Status Icons (Loading, Success, Error)
  - Accessibility Icons (Wheelchair, Eye, Volume)
- **Installation:** `npm install lucide-react`
- **Import:** `import { IconName } from 'lucide-react'`

#### 2. **Heroicons** - PFLICHT für Tailwind-Integration

- **MUSS verwendet werden** für:
  - Tailwind-spezifische Komponenten
  - Form-Elemente
  - Button-Icons
  - Tabellen-Icons
- **Installation:** `npm install @heroicons/react`
- **Import:** `import { IconName } from '@heroicons/react/24/outline'`

#### 3. **Phosphor** - PFLICHT für Landingpages & Call-to-Actions

- **MUSS verwendet werden** für:
  - Hero-Section Icons
  - Feature-Highlights
  - Große Call-to-Action Buttons
  - Marketing-Elemente
- **Installation:** `npm install @phosphor-icons/react`
- **Import:** `import { IconName } from '@phosphor-icons/react'`

### 🚫 **VERBOTENE PRAKTIKEN**

- ❌ **KEINE manuellen SVGs** in Komponenten
- ❌ **KEINE inline SVG-Pfade**
- ❌ **KEINE gemischten Icon-Bibliotheken** in derselben Komponente
- ❌ **KEINE unstrukturierten Icon-Imports**

### ✅ **PFLICHT-IMPLEMENTIERUNG**

```typescript
// ✅ KORREKT - Lucide für Navigation
import { Menu, X, Globe, Accessibility } from 'lucide-react';

// ✅ KORREKT - Heroicons für Tailwind
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';

// ✅ KORREKT - Phosphor für Landingpages
import { Rocket, Star, Trophy } from '@phosphor-icons/react';
```

### 📋 **QUALITÄTSSICHERUNG**

- **Code Review:** Alle Icon-Imports werden überprüft
- **Linting:** ESLint-Regeln für Icon-Konsistenz
- **Testing:** Icon-Rendering wird getestet
- **Documentation:** Icon-Verwendung wird dokumentiert

### 🔄 **WARTUNG**

- **Regelmäßige Updates** der Icon-Bibliotheken
- **Performance-Monitoring** für Icon-Bundle-Größe
- **Accessibility-Checks** für alle Icons
- **Cross-Browser-Testing** für Icon-Darstellung

---

## 🎨 Design-System - PFLICHT

### **Farbschema**

- **Primär:** `#2563eb` (Hauptblau)
- **Sekundär:** `#3b82f6` (Akzentblau)
- **Neutral:** `#6b7280` (Dunkelgrau)
- **Hintergrund:** `#f9fafb` (Hellgrau)

### **Typografie**

- **Heading:** Inter, sans-serif
- **Body:** Inter, sans-serif
- **Code:** JetBrains Mono, monospace

### **Spacing**

- **Basis:** 4px (0.25rem)
- **Container:** max-width: 1200px
- **Padding:** 1rem (16px)
- **Margin:** 1.5rem (24px)

---

## 🔧 Technische Standards - PFLICHT

### **React/Next.js**

- **TypeScript:** PFLICHT für alle Komponenten
- **Functional Components:** PFLICHT
- **Hooks:** PFLICHT für State Management
- **Error Boundaries:** PFLICHT für alle Seiten

### **Performance**

- **Lazy Loading:** PFLICHT für große Komponenten
- **Image Optimization:** PFLICHT für alle Bilder
- **Code Splitting:** PFLICHT für Routen
- **Bundle Analysis:** PFLICHT vor Deployment

### **Accessibility**

- **WCAG 2.1 AA:** PFLICHT
- **Keyboard Navigation:** PFLICHT
- **Screen Reader Support:** PFLICHT
- **Color Contrast:** PFLICHT (4.5:1 Minimum)

---

## 📝 Code-Qualität - PFLICHT

### **Naming Conventions**

- **Komponenten:** PascalCase (`Header.tsx`)
- **Hooks:** camelCase mit `use` Prefix (`useI18n`)
- **Dateien:** kebab-case für Seiten (`datenschutz/page.tsx`)
- **Variablen:** camelCase (`isDarkMode`)

### **File Structure**

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── Core/              # Hauptkomponenten
│   ├── Features/          # Feature-Komponenten
│   └── ui/                # UI-Komponenten
├── i18n/                  # Internationalisierung
├── lib/                   # Utilities
└── styles/                # Globale Styles
```

### **Testing**

- **Unit Tests:** PFLICHT für alle Komponenten
- **Integration Tests:** PFLICHT für kritische Flows
- **E2E Tests:** PFLICHT für Hauptfunktionen
- **Accessibility Tests:** PFLICHT für alle Seiten

---

## 🚀 Deployment - PFLICHT

### **Pre-Deployment Checks**

- [ ] Alle Tests bestanden
- [ ] Linting ohne Fehler
- [ ] Build erfolgreich
- [ ] Performance-Budget eingehalten
- [ ] Accessibility-Checks bestanden

### **Environment Variables**

- **Development:** `.env.local`
- **Staging:** `.env.staging`
- **Production:** `.env.production`

### **Monitoring**

- **Error Tracking:** Sentry
- **Performance:** Web Vitals
- **Analytics:** Google Analytics
- **Uptime:** Status Page

---

_Diese Richtlinien sind **VERBINDLICH** und müssen von allen Entwicklern eingehalten werden._
