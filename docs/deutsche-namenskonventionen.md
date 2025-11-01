# 🇩🇪 Deutsche Namenskonventionen - Lopez IT Welt

## 📋 **Übersicht**

Dieses Dokument definiert die deutschen Namenskonventionen für das Lopez IT Welt Projekt. Alle Komponenten, Interfaces, Funktionen und Variablen sollen deutsche Namen verwenden.

## 🎯 **Grundprinzipien**

### **1. Komponenten-Namen**
- **Englisch → Deutsch**
  - `Button` → `Schaltflaeche`
  - `Card` → `Karte`
  - `Alert` → `Alarm`
  - `Page` → `Seite`
  - `Layout` → `Anordnung`
  - `Header` → `Kopfzeile`
  - `Footer` → `Fusszeile`
  - `Sidebar` → `Seitenleiste`
  - `Navigation` → `Navigation`
  - `Provider` → `Anbieter`

### **2. Interface-Namen**
- **Englisch → Deutsch**
  - `Props` → `Eigenschaften`
  - `State` → `Zustand`
  - `Config` → `Konfiguration`
  - `Options` → `Optionen`
  - `Settings` → `Einstellungen`

### **3. Funktions-Namen**
- **Englisch → Deutsch**
  - `handleClick` → `klickBehandeln`
  - `onSubmit` → `beimAbsenden`
  - `onChange` → `beimAendern`
  - `onFocus` → `beimFokus`
  - `onBlur` → `beimVerlassen`
  - `useState` → `zustandVerwenden`
  - `useEffect` → `effektVerwenden`
  - `useCallback` → `callbackVerwenden`

### **4. Variablen-Namen**
- **Englisch → Deutsch**
  - `loading` → `ladezustand`
  - `error` → `fehler`
  - `success` → `erfolg`
  - `data` → `daten`
  - `user` → `benutzer`
  - `config` → `konfiguration`
  - `settings` → `einstellungen`
  - `options` → `optionen`

## 📁 **Datei-Struktur**

### **Komponenten-Verzeichnis**
```
src/components/
├── Features/
│   ├── Schaltflaeche.tsx          # Button
│   ├── Karte.tsx                  # Card
│   ├── AlarmSeite.tsx             # Alert Page
│   └── Benachrichtigung.tsx       # Notification
├── Core/
│   ├── HauptAnordnung.tsx         # Main Layout
│   ├── Kopfzeile.tsx              # Header
│   ├── Fusszeile.tsx              # Footer
│   └── Seitenleiste.tsx           # Sidebar
└── Admin/
    ├── AdminAnordnung.tsx         # Admin Layout
    ├── AdminNavigation.tsx        # Admin Navigation
    └── AdminDashboard.tsx         # Admin Dashboard
```

### **Seiten-Verzeichnis**
```
src/app/
├── admin/
│   ├── monitoring/
│   │   └── alarme/
│   │       └── seite.tsx          # Alerts Page
│   ├── benutzer/
│   │   └── seite.tsx              # Users Page
│   └── zeiterfassung/
│       └── seite.tsx              # Time Tracking Page
└── (haupt)/
    └── seite.tsx                  # Main Page
```

## 🔧 **Interface-Definitionen**

### **Schaltflaeche (Button)**
```typescript
interface SchaltflaecheEigenschaften {
  variante?: 'haupt' | 'sekundaer' | 'neben' | 'akzent' | 'umriss' | 'text';
  groesse?: 'klein' | 'mittel' | 'gross';
  ladezustand?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'links' | 'rechts';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

### **Karte (Card)**
```typescript
interface KarteEigenschaften {
  variante?: 'standard' | 'elevated' | 'outlined';
  groesse?: 'klein' | 'mittel' | 'gross';
  klickbar?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### **Alarm (Alert)**
```typescript
interface AlarmEigenschaften {
  typ: 'system' | 'sicherheit' | 'leistung' | 'backup' | 'netzwerk';
  schweregrad: 'info' | 'warnung' | 'fehler' | 'kritisch';
  titel: string;
  beschreibung: string;
  zeitstempel: string;
  status: 'aktiv' | 'bestätigt' | 'gelöst';
  quelle: string;
  prioritaet: number;
}
```

## 🧪 **Test-Namenskonventionen**

### **Test-Dateien**
- **Englisch → Deutsch**
  - `Button.test.tsx` → `Schaltflaeche.test.tsx`
  - `Card.test.tsx` → `Karte.test.tsx`
  - `AlertsPage.test.tsx` → `AlarmSeite.test.tsx`

### **Test-Beschreibungen**
```typescript
describe('Schaltflaeche', () => {
  it('sollte korrekt gerendert werden', () => {
    // Test-Implementierung
  });

  it('sollte Benutzerinteraktionen verarbeiten', () => {
    // Test-Implementierung
  });

  it('sollte mit verschiedenen Varianten gerendert werden', () => {
    // Test-Implementierung
  });
});
```

## 📝 **CSS-Klassen**

### **Deutsche CSS-Klassen**
```css
/* Größen */
.groesse-klein { padding: 0.5rem; }
.groesse-mittel { padding: 1rem; }
.groesse-gross { padding: 1.5rem; }

/* Varianten */
.variante-haupt { background-color: var(--hauptfarbe); }
.variante-sekundaer { background-color: var(--sekundaerfarbe); }
.variante-neben { background-color: var(--nebenfarbe); }

/* Zustände */
.zustand-laden { opacity: 0.5; }
.zustand-deaktiviert { cursor: not-allowed; }
.zustand-aktiv { background-color: var(--aktivfarbe); }
```

## 🔄 **Migration-Plan**

### **Phase 1: Neue Komponenten**
- ✅ `Schaltflaeche.tsx` erstellt
- ✅ `Karte.tsx` erstellt
- ✅ `AlarmSeite.tsx` erstellt
- ✅ Deutsche Tests erstellt

### **Phase 2: Bestehende Komponenten umbenennen**
- [ ] `Button.tsx` → `Schaltflaeche.tsx`
- [ ] `Card.tsx` → `Karte.tsx`
- [ ] `AlertsPage.tsx` → `AlarmSeite.tsx`
- [ ] Alle Imports aktualisieren

### **Phase 3: Interface-Namen**
- [ ] `ButtonProps` → `SchaltflaecheEigenschaften`
- [ ] `CardProps` → `KarteEigenschaften`
- [ ] `AlertProps` → `AlarmEigenschaften`

### **Phase 4: Funktions-Namen**
- [ ] `handleClick` → `klickBehandeln`
- [ ] `onSubmit` → `beimAbsenden`
- [ ] `useState` → `zustandVerwenden`

## ✅ **Qualitätskontrolle**

### **Automatische Prüfung**
```bash
# Deutsche Namen prüfen
npm run check-german-names

# Konsistenz prüfen
npm run check-naming-consistency
```

### **Manuelle Checkliste**
- [ ] Alle Komponenten haben deutsche Namen
- [ ] Alle Interfaces haben deutsche Namen
- [ ] Alle Funktionen haben deutsche Namen
- [ ] Alle Variablen haben deutsche Namen
- [ ] Alle Tests haben deutsche Beschreibungen
- [ ] Dokumentation ist auf Deutsch

## 📚 **Referenzen**

### **Wörterbuch**
- **Component** → **Komponente**
- **Interface** → **Schnittstelle**
- **Function** → **Funktion**
- **Variable** → **Variable**
- **Property** → **Eigenschaft**
- **Method** → **Methode**
- **Event** → **Ereignis**
- **Handler** → **Behandler**
- **State** → **Zustand**
- **Props** → **Eigenschaften**

### **Häufige Begriffe**
- **Button** → **Schaltfläche**
- **Card** → **Karte**
- **Alert** → **Alarm**
- **Page** → **Seite**
- **Layout** → **Anordnung**
- **Header** → **Kopfzeile**
- **Footer** → **Fußzeile**
- **Sidebar** → **Seitenleiste**
- **Navigation** → **Navigation**
- **Provider** → **Anbieter**

---

**Letzte Aktualisierung:** 01.07.2025  
**Version:** 1.0  
**Autor:** Lopez IT Welt Team 