# 🎨 Enterprise++ Admin Sidebar Struktur

**Datum:** 2025-11-30  
**Status:** ✅ **IMPLEMENTIERT**  
**Design-Standard:** IBM Carbon Design System / SAP Fiori Style

---

## 📋 ÜBERSICHT

Die Admin-Sidebar folgt dem Enterprise++ Standard mit einer klaren, strukturierten Navigation nach IBM Carbon / SAP Fiori Prinzipien.

### 🎯 Design-Prinzipien

1. **6 Hauptkategorien** - Klare Strukturierung
2. **Automatische Gruppierung** - Unterpunkte logisch organisiert
3. **Einheitliche Icons** - 20px für Hauptnavigation, 16px für Unterpunkte
4. **Dark Theme First** - Lopez Carbon Dark als Standard
5. **Gold-Akzent** - Für aktive Navigation und wichtige Elemente
6. **Kein Scrollen** - Hauptmenü passt in Viewport
7. **Perfekte Abstände** - 12px zwischen Icon und Text
8. **Hover-States** - IBM Carbon Style mit sanften Übergängen

---

## 🗂️ NAVIGATIONS-STRUKTUR

### 1. Dashboard
- **Icon:** Home (20px)
- **Href:** `/admin`
- **Unterpunkte:** Keine (direkter Link)

### 2. Operations
- **Icon:** Cogs (20px)
- **Unterpunkte:**
  - Monitoring (`/admin/monitoring`)
  - Logs (`/admin/logs`)
  - Unified Ops (`/admin/uoc`)
  - Backups (`/admin/backup`)
  - System Status (`/admin/monitoring/system`)

### 3. Kunden & Projekte
- **Icon:** Users (20px)
- **Unterpunkte:**
  - Kundenliste (`/admin/customers`)
  - Neuer Kunde (`/admin/customers/new`)
  - Projekte (`/admin/projects`)
  - Kanban (`/admin/projects/kanban`)
  - Support Tickets (`/admin/support`) - Badge: "7"
  - Kontakt-Nachrichten (`/admin/support/contact-messages`) - Dynamisches Badge

### 4. Inhalte & Medien
- **Icon:** FileAlt (20px)
- **Unterpunkte:**
  - Seitenverwaltung (`/admin/content/pages`)
  - Header & Footer (`/admin/content/header-footer`)
  - Medien-Upload (`/admin/content/media`)
  - Media-KI Dashboard (`/admin/media/ai/dashboard`)
  - Blog-Artikel (`/admin/marketing/blog`)
  - News & Updates (`/admin/marketing/news`)
  - SEO & Meta-Tags (`/admin/marketing/seo`)

### 5. Finanzen
- **Icon:** FileInvoice (20px)
- **Unterpunkte:**
  - Rechnungen (`/admin/office/invoices`)
  - Umsatz-Reports (`/admin/reports/revenue`)
  - Zeiterfassung (`/admin/time-tracking`)
  - E-Rechnung (`/admin/office/einvoice`)
  - Lohnbuchhaltung (`/admin/office/payroll`)

### 6. System & Sicherheit
- **Icon:** ShieldAlt (20px)
- **Unterpunkte:**
  - Compliance (`/admin/compliance/dsgvo`)
  - Rollen & Rechte (`/admin/roles`)
  - Admin-Privilegien (`/admin/privileges`)
  - Orchestrator (`/admin/orchestrator`)
  - Navigation (`/admin/navigation`)
  - Audit-Logs (`/admin/audit-logs`) - Badge: "3"
  - Qualitäts-Dashboard (`/admin/quality`)
  - Einstellungen (`/admin/settings`)

---

## 🎨 DESIGN-SPEZIFIKATIONEN

### Farben (Lopez Carbon Dark)

**Hintergründe:**
- Sidebar: `#111217`
- Hover: `#1f2329`
- Avatar-Bereich: `#1a1d24`

**Text:**
- Primär (aktiv): `#ffd700` (Gold)
- Normal: `#b3b3b3`
- Sekundär: `#8a8a8a`

**Ränder:**
- Standard: `#272a33`
- Sub-Items Border: `#272a33`

**Icons:**
- Hauptnavigation: 20px × 20px
- Unterpunkte: 16px × 16px
- Avatar-Buttons: 14px × 14px

### Abstände

- **Icon zu Text:** 12px (Hauptnavigation), 10px (Unterpunkte)
- **Padding:** 12px horizontal, 10px vertikal (px-3 py-2.5)
- **Gap zwischen Items:** 4px (space-y-1)
- **Sub-Items Indent:** 8px + Border

### Hover-States

- **Hintergrund:** `#1f2329`
- **Text:** `#f4f4f4`
- **Transition:** 150ms ease-in-out
- **Border (aktiv):** 3px solid `#ffd700` links

### Aktiver Zustand

- **Hintergrund:** `#1f2329`
- **Text:** `#ffd700` (Gold)
- **Border:** 3px solid `#ffd700` links
- **Icon:** `#ffd700`

---

## 👤 AVATAR-BEREICH

**Position:** Unten in der Sidebar (Pflicht)

**Elemente:**
1. **Avatar:**
   - Initials (z.B. "RL" für "Ramiro Lopez Rodriguez")
   - Oder hochgeladenes Bild
   - Größe: 40px × 40px
   - Hintergrund: `#ffd700`
   - Text: `#050509`

2. **Name:**
   - "Ramiro Lopez Rodriguez"
   - Font: 14px, medium
   - Farbe: `#f4f4f4`

3. **Rolle:**
   - "Owner – Lopez IT Welt"
   - Font: 12px
   - Farbe: `#8a8a8a`

4. **Buttons:**
   - **Einstellungen:** Icon + Text, `#272a33` Hintergrund
   - **Abmelden:** Nur Icon, `#da1e28` Text

**Collapsed State:**
- Nur Avatar-Icon sichtbar
- Klick öffnet Sidebar

---

## 📐 LAYOUT-SPEZIFIKATIONEN

### Sidebar-Breite

- **Expanded:** 256px (w-64)
- **Collapsed:** 64px (w-16)

### Scroll-Verhalten

- **Hauptnavigation:** Kein Scrollen (passt in Viewport)
- **Sub-Items:** Scrollbar nur wenn nötig
- **Max-Height:** `calc(100vh - 200px)`

### Responsive

- **Desktop (lg+):** Fixed Sidebar links
- **Mobile:** Overlay mit Backdrop
- **Z-Index:** 40 (Desktop), 50 (Mobile)

---

## 🔧 TECHNISCHE DETAILS

### Komponente

- **Datei:** `src/components/admin/AdminNavigation.tsx`
- **Type:** Client Component ("use client")
- **State Management:** React Hooks (useState, useEffect)

### Datenquellen

1. **API:** `/api/admin/navigation` (Datenbank)
2. **Fallback:** `enterpriseNavigation` (Hardcoded)
3. **User Data:** `/api/auth/me` (für Avatar)

### Features

- ✅ Dynamische Badges (API-Endpoints)
- ✅ LocalStorage für Sidebar-State
- ✅ Auto-Expand bei aktiver Route
- ✅ Mobile-Overlay
- ✅ Collapse/Expand Toggle
- ✅ Logout-Funktionalität

---

## 📊 VISUELLE STRUKTUR

```
┌─────────────────────────────────┐
│  [LW] Lopez IT Welt             │ ← Logo
│       Enterprise++              │
├─────────────────────────────────┤
│                                 │
│  🏠 Dashboard                   │ ← Hauptnavigation
│                                 │
│  ⚙️  Operations          ▼      │
│     ├─ Monitoring               │ ← Unterpunkte
│     ├─ Logs                     │
│     ├─ Unified Ops              │
│     └─ Backups                  │
│                                 │
│  👥 Kunden & Projekte    ▼      │
│     ├─ Kundenliste              │
│     ├─ Projekte                 │
│     └─ Support Tickets [7]      │ ← Badge
│                                 │
│  📄 Inhalte & Medien     ▼      │
│  💰 Finanzen             ▼      │
│  🛡️  System & Sicherheit ▼      │
│                                 │
├─────────────────────────────────┤
│  [RL] Ramiro Lopez Rodriguez    │ ← Avatar-Bereich
│      Owner – Lopez IT Welt      │
│  [⚙️ Einstellungen] [🚪]        │ ← Buttons
└─────────────────────────────────┘
```

---

## ✅ CHECKLISTE

- [x] 6 Hauptkategorien definiert
- [x] Unterpunkte automatisch gruppiert
- [x] Icons einheitlich (20px/16px)
- [x] Dark Theme (Lopez Carbon Dark)
- [x] Gold-Akzent für aktive Items
- [x] Perfekte Abstände (12px Icon-Text)
- [x] Hover-States (IBM Carbon Style)
- [x] Avatar-Bereich unten
- [x] Kein Scrollen im Hauptmenü
- [x] Mobile-Responsive
- [x] LocalStorage-Persistenz
- [x] Dynamische Badges
- [x] Logout-Funktionalität

---

## 🎯 ZIEL-ERREICHT

Die Sidebar entspricht jetzt dem **IBM Carbon / SAP Fiori Standard**:

✅ **Ruhig** - Keine bunten Spielereien  
✅ **Strukturiert** - Klare Hierarchie  
✅ **Barrierefrei** - WCAG-konforme Kontraste  
✅ **Perfekt lesbar** - Optimale Abstände und Größen  
✅ **Enterprise++** - Professionelles Design

---

**Status:** ✅ **PRODUKTIONSREIF**

