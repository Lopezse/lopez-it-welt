# Pflichtenheft – Lopez IT Welt

## 1. Projektdaten

| Feld                      | Inhalt                              |
| ------------------------- | ----------------------------------- |
| **Firma**                 | Lopez IT Welt                       |
| **Projektleitung**        | Ramiro Lopez Rodriguez              |
| **Technische Umsetzung**  | Ramiro Lopez Mc Lean                |
| **Designverantwortung**   | Xenia Mc Lean                       |
| **Erstellungsdatum**      | 01.05.2025                          |
| **Letzte Aktualisierung** | 18.01.2025                          |
| **Dokumenttyp**           | Pflichtenheft                       |
| **Dateiname (MD/PDF)**    | Pflichtenheft_Lopez_IT_Welt.md/.pdf |

## 2. Zielsetzung

Die Webseite **Lopez IT Welt** wird als zentrales Schaufenster für das IT-Leistungsportfolio etabliert, um:

- **Lead-Generierung** über Kontaktformulare, Newsletter und Shop
- **Kundenbindung** durch personalisierte Dashboards und Support-Tools
- **Community-Aufbau** über Blog/News und Webinar-Angebote
- **Digitalisierung interner Prozesse** (Tickets, Dokumenten-Download)

## 3. Übersicht der Komponenten / Anforderungen

### 3.1 Kernfunktionen (Muss)

| Komponente          | Beschreibung                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Startseite**      | Hero-Banner, Quick-Links zu Services & News, Call-to-Action                                           |
| **Leistungsseiten** | Managed IT, Cloud, Security, Consulting – Detailinfos, Benefits, Referenzen                           |
| **News/Blog**       | CMS-Workflow (Erstellung → Review → Publikation), Kategorien, Tags, Autorenprofile                    |
| **Kontakt**         | Validiertes Formular (Captcha, DSGVO-Checkbox), E-Mail-Benachrichtigung, Google-Maps-Einbindung       |
| **Rechtliches**     | Cookie-Banner, Impressum, Datenschutz, AGB                                                            |
| **Newsletter**      | Opt-in/Double-Opt-in, Anbindung an Mailchimp (o. Ä.)                                                  |
| **Shop**            | Produktkatalog, Warenkorb & Checkout, Zahlungs-APIs (Stripe, PayPal, SEPA), SSL, E-Mails              |
| **Dashboard**       | Kundenkonto: Bestellübersicht, Adress-/Zahlungsdaten, Download-Center (Whitepaper, Lizenzen), Tickets |

### 3.2 Wichtige Zusatzfunktionen (Soll)

| Komponente                | Beschreibung                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| **Suche & Filter**        | Volltext-Suche über Content, Produkte, FAQs                       |
| **Download-Center**       | Whitepaper, Broschüren, Zertifikate                               |
| **FAQ / Knowledge-Base**  | Fragen & Antworten, Kategorie-Filter                              |
| **Mehrsprachigkeit**      | Deutsch / Englisch / Spanisch (Ausbau zu weiteren EU-Sprachen)    |
| **Social-Media**          | Sharing-Buttons, Feeds, Profil-Links                              |
| **Analytics & Reporting** | GA/Matomo, Conversion-Tracking, Umsatz-Dashboard im Admin-Bereich |

### 3.3 Optionale Features (Kann)

- **Multi-Tenant & Subaccounts** für B2B-Kunden
- **Live-Chat / Chatbot** (Zendesk, Intercom)
- **Webinar / Event-Planer** mit Kalender & Anmelde-Workflow
- **API-Schnittstellen** (CRM: HubSpot, Salesforce; ERP; Ticketsystem)
- **Abo-Modelle / Recurring Billing**
- **Omni-Channel & Marketplace-Integration**
- **Gamification & Empfehlungs-Engine**
- **KI-basierte Produktberatung**

## 4. Systemumgebung & Integration

- **Frontend**
  - React + Next.js (SSR/SSG Hybrid)
  - Tailwind CSS, Design System via Storybook
- **Backend / APIs**
  - Node.js (TypeScript) mit Express oder NestJS
  - GraphQL-Gateway und REST-Endpoints
- **Datenhaltung**
  - PostgreSQL (Primärdaten)
  - Redis (Cache, Sessions)
- **CMS**
  - Headless Strapi mit Rollen- & Rechteverwaltung, Freigabe-Workflow
- **CI/CD & Infrastruktur**
  - GitHub Actions → Tests, Security-Scans → Deploy (Kubernetes on AWS/EKS)
  - Terraform / Pulumi für Infrastruktur-as-Code
- **CDN & Edge**
  - AWS CloudFront für Assets, Cloudflare Workers für Edge-Logik
- **Dritt-Systeme**
  - CRM (HubSpot), E-Mail-Marketing (Mailchimp), Payment (Stripe), Ticketing (Zendesk)

## 5. Visuelle Anforderungen

| Aspekt           | Vorgabe                                                            |
| ---------------- | ------------------------------------------------------------------ |
| **Stil**         | Modern, Flat Design, minimalistischer Ansatz                       |
| **Farbwelt**     | Siehe Tabelle unten                                                |
| **Bildsprache**  | Hochwertige Fotos, technische Illustrationen                       |
| **Icons**        | SVG-Icons, Tailwind-kompatibel, Dark/Light Mode via `currentColor` |
| **Layouts**      | Responsive Grids, Mobile-First, Touch-Optimierungen                |
| **AR/AA**        | WCAG 2.1 AA Kontrast & Tastatur-Navigation                         |
| **Schriftarten** | Inter (Standard), Open Sans (Alternative), sans-serif (Fallback)   |

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

**Hinweis zur Barrierefreiheit:**

- Alle Farben erfüllen mindestens AA-Kontrast (Text auf Hintergrund)
- Für wichtige UI-Elemente (Buttons, Links, Warnungen) wird maximaler Kontrast verwendet
- Schriftgrößen und -arten sind für Lesbarkeit und Klarheit optimiert
- Dark/Light Mode wird vollständig unterstützt

## 6. Technische Anforderungen

- **Format & Struktur**
  - PDF/DIN A4 (Template), Markdown für interne Revision
  - Pfadstruktur: `/assets/images/{section}/{filename}`
- **Grafiken**
  - Vektorformate (SVG) bevorzugt, mind. 1920 × 1080 px für Rastergrafiken
- **Responsiveness**
  - Skalierbare SVGs, CSS Media Queries für Breakpoints
- **Sicherheit**
  - HTTPS, CSP, XSS/CSRF-Schutz, PCI-DSS bei Shop-Checkout
- **Performance**
  - LCP < 2,5 s, TTFB < 200 ms, Caching (Redis, CDN)

## 7. Qualitätsstandards

- **Code-Qualität**
  - Clean Code, Linting, TypeScript-Typisierung, Unit-/Integrationstests (≥ 80 % Coverage)
- **Security**
  - OWASP Top 10 abgedeckt, jährliche PenTests, WAF
- **Accessibility**
  - WCAG 2.1 AA, ARIA-Attribute, Screenreader-Tests
- **Testing**
  - End-to-End (Cypress), Performance (JMeter), Smoke-Tests nach Deployment
- **Dokumentation**
  - Architektur- und API-Specs, User Manuals, Release-Notes

## 8. Erweiterbarkeit & Skalierung

- **Architektur**
  - Microservices, modulare Micro-Frontends
- **Orchestrierung**
  - Kubernetes (Auto-Scaling, Health Checks)
- **Design System**
  - Komponentenbibliothek in Storybook, Versionierung
- **Feature-Flags**
  - LaunchDarkly o. Ä. für kontrollierte Rollouts
- **CI/CD**
  - Canary Deployments, Blue/Green Releases

## 9. Abnahmebedingungen

| Kriterium          | Bedingung                                                    |
| ------------------ | ------------------------------------------------------------ |
| **Design Review**  | Optische Abnahme gegen Template, CI/CD-Pipeline grün         |
| **Funktionstests** | Alle Links, Formulare, Checkout, API-Calls erfolgreich       |
| **Accessibility**  | WCAG 2.1 AA Compliance bestätigt                             |
| **Performance**    | PageSpeed Insights ≥ 90, Ladezeit < 2 s (Staging-Umgebung)   |
| **Dokumentation**  | Vollständige technische und Anwender-Dokumentation verfügbar |
| **Sicherheit**     | PenTest-Report ohne kritische Findings, CSP aktiviert        |

## 10. Änderungsvermerk

| Version | Datum      | Änderung                                   |
| ------- | ---------- | ------------------------------------------ |
| V1.2    | 18.01.2025 | Startseiten-Struktur detailliert definiert |
| V1.1    | 18.01.2025 | Detaillierte UI-Anforderungen hinzugefügt  |
| V1.0    | 01.05.2025 | Erstellung gemäß Firmenstandard            |

## 11. Detaillierte Seitenstruktur & UI-Anforderungen (V1.2)

### 11.1 Allgemeine Anforderungen

#### 🌍 Multilingual-Support

- **Sprachen:** Deutsch 🇩🇪, Englisch 🇬🇧, Spanisch 🇪🇸
- **Sprachauswahl-Logik:**
  - Automatische Erkennung via `navigator.language`
  - Manuelle Umschaltung möglich (Dropdown rechts oben)
- **i18n-Struktur:** `locales/de.json`, `en.json`, `es.json`

#### 🛠️ Technologie-Stack

- **Frontend:** React (Next.js 14), TailwindCSS
- **Animationen:** Framer Motion
- **UI-Komponenten:** Headless UI
- **Internationalisierung:** i18next

#### 🔐 Zugangssystem

- **Login + Registrierung:** User + Admin für integrierten Shop
- **Verlinkung:** `/login` und `/register`
- **Auth-Status:** Sichtbar im Header

### 11.2 Startseiten-Struktur (Detailliert)

#### 1. Header (Kopfbereich)

- **Logo:** "Lopez IT Welt"
- **Navigation:** Startseite | Leistungen | Webshop | Preise | Über uns | Kontakt | DE / EN
- **CTA-Button:** "Jetzt beraten lassen" (fixiert bei Scroll)
- **Maximale Höhe:** 80px
- **Dark/Light Mode Toggle**
- **Auth-Status** (Login/Register oder User-Info)

#### 2. Hero Section – Einstieg mit starkem Claim

**🇩🇪 Deutsch:**

- **Hauptclaim:** "Digitale Lösungen mit Verstand & Verantwortung"
- **Untertitel:** "Barrierefrei. Persönlich. Automatisiert."
- **Beschreibung:** "Für Menschen & Unternehmen – auf Deutsch, Spanisch und Englisch."
- **Features:** "✅ Inklusive Formularservice, Webdesign, KI & Hardware"
- **CTA:** "Unsere Leistungen entdecken"

**🇬🇧 English:**

- **Hauptclaim:** "Digital Solutions with Intelligence & Care"
- **Untertitel:** "Accessible. Personal. Automated."
- **Beschreibung:** "For People & Enterprises – in German, Spanish, and English."
- **CTA:** "Explore our Services"

#### 3. Unsere Hauptbereiche (Teaser mit Icons)

| Bereich                        | Beschreibung                                                      |
| ------------------------------ | ----------------------------------------------------------------- |
| 💼 IT-Support                  | Remote & vor Ort – Hilfe bei PC, Netzwerk, Software               |
| 🖥️ PC-Bau & Einrichtung        | Individuell zusammengestellt, barrierefrei erklärt                |
| 🌐 Webdesign & Automatisierung | Barrierefrei, mehrsprachig, KI-basiert                            |
| 🤖 KI-Assistenz                | Bewerbungen, Texte, Automatisierungen                             |
| 📝 Formularservice             | Hilfe bei Ämtern, Krankenkassen, Anträgen                         |
| 🛒 Webshop / Digitale Produkte | Vorlagen, Tools, Bewerbungssets, Sicherheitslösungen zum Download |

#### 4. Unser Webshop – Digital. Einfach. Sofort.

- 📂 **Bewerbungsvorlagen** (PDF/Word, barrierefrei)
- 🔐 **Sicherheits-Tools** (z. B. Passwortmanager, Datenschutz-Checklisten)
- 🧠 **KI-Vorlagen** (z. B. ChatGPT-Prompts, Cursor-Vorlagen)
- 🌍 **Mehrsprachige Dokumente** (DE/ES)
- 💸 **Einmalzahlung, Sofort-Download, DSGVO-konform**
- **CTA:** "Zum Webshop"

#### 5. Warum Lopez IT Welt? (Trust-Block)

- ✅ Barrierefreiheit als Prinzip, nicht als Zusatz
- ✅ Zweisprachig: Deutsch & Spanisch
- ✅ Empathie & Erfahrung mit Jobcenter, Krankheit, Ämtern
- ✅ IT, die für Menschen gemacht ist
- ✅ Enterprise++ Standards bei Code, Datenschutz & Automatisierung

#### 6. Kundenstimmen / Empfehlungen

- "Endlich jemand, der meine Probleme versteht und echte Lösungen bietet." – Herr R., Hannover
- "Der Webshop ist super – ich konnte die Vorlage direkt fürs Arbeitsamt nutzen." – Frau M., Laatzen

#### 7. Sicherheit & Qualität

- DSGVO-konform
- Zero-Trust Architektur
- Automatische Updates & Backups
- Dokumentierte Prozesse & Protokolle
- Barrierefreies UX-Konzept (auch für Sehbehinderte)

#### 8. Kontakt & Beratung

**📧 Kontaktmöglichkeiten:**

- Kontaktformular (barrierefrei, mehrsprachig)
- 📞 Telefon (nach Vereinbarung)
- 📍 Vor-Ort-Termin möglich (Wunstorf / Region Hannover)

#### 9. Footer

- Impressum | Datenschutz | AGB | Barrierefreiheit
- Sprache: Deutsch / Englisch
- © 2025 Lopez IT Welt

#### 🔁 Optionaler Zusatzbereich:

**🧠 KI & Automatisierung für Unternehmen**
"Wir machen Ihre Prozesse intelligenter – mit ChatGPT, RPA & maßgeschneiderten Tools."

### 11.3 Implementierungs-Prioritäten

#### **Phase 1A: Multilingual & UI-Foundation (Höchste Priorität)**

1. **i18n-System** implementieren
2. **Header** erweitern
3. **Hero Section** überarbeiten

#### **Phase 1B: Leistungsseiten & Shop-Teaser (Hohe Priorität)**

1. **Leistungs-Teaser** (3-6 Karten)
2. **Shop-Teaser** implementieren
3. **Kontaktblock** erweitern

#### **Phase 2: Erweiterte Technologien (Mittlere Priorität)**

1. **Framer Motion** Integration
2. **Headless UI** Komponenten
3. **Dark/Light Mode** vollständig implementieren

#### **Phase 3: Backend & Auth (Hohe Priorität)**

1. **Zugangssystem** implementieren
2. **Backend-Infrastruktur** aufbauen

#### **Phase 4: Shop & Dashboard (Niedrige Priorität)**

1. **Vollständiger Shop**
2. **Kunden-Dashboard**

## 8.4 Tabellenstruktur & Constraints

### Tabelle: categories

| Feld       | Typ          | Besonderheit       |
| ---------- | ------------ | ------------------ |
| id         | INT          | PK, AUTO_INCREMENT |
| code       | VARCHAR(3)   | UNIQUE, NOT NULL   |
| short_code | VARCHAR(3)   | NOT NULL           |
| name       | VARCHAR(100) | NOT NULL           |

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  short_code VARCHAR(3) NOT NULL,
  name VARCHAR(100) NOT NULL
);
```

### Tabelle: services

| Feld        | Typ           | Besonderheit                  |
| ----------- | ------------- | ----------------------------- |
| id          | INT           | PK, AUTO_INCREMENT            |
| name        | VARCHAR(200)  | NOT NULL                      |
| category_id | INT           | FK → categories(id), NOT NULL |
| price       | DECIMAL(10,2) | NOT NULL                      |

```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
```

### Tabelle: sin_entries

| Feld       | Typ         | Besonderheit                |
| ---------- | ----------- | --------------------------- |
| id         | INT         | PK, AUTO_INCREMENT          |
| sin        | VARCHAR(12) | UNIQUE, NOT NULL            |
| service_id | INT         | FK → services(id), NOT NULL |
| created_at | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP   |

```sql
CREATE TABLE sin_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sin VARCHAR(12) UNIQUE NOT NULL,
  service_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);
```

#### Beziehungen & Constraints

- `services.category_id` → `categories.id` (ON DELETE RESTRICT)
- `sin_entries.service_id` → `services.id` (ON DELETE RESTRICT)
- `categories.code` und `sin_entries.sin` sind eindeutig (UNIQUE)
- Alle Tabellen haben einen Primärschlüssel (id)
- `created_at` wird automatisch gesetzt

---

_Diese Tabellenstruktur ist verbindlich für die Entwicklung und wird bei Änderungen versioniert dokumentiert._

---

_Dieses Pflichtenheft wird regelmäßig aktualisiert. Letzte Änderung: 2024-03-19_

## 12. MySQL-Datenbankstruktur für Adminbereich & Zeiterfassung (Stand: 25.06.2025)

**Hinweis:** Jede Änderung an der DB-Struktur wird hier dokumentiert und vor Migration freigegeben. Änderungen ohne .md-Doku sind verboten (Enterprise++ Regel). DSGVO, IT-Sicherheit und Nachvollziehbarkeit werden strikt eingehalten.

### 12.1 Zeiterfassung (Time Tracking)

```sql
CREATE TABLE time_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module VARCHAR(50) NOT NULL, -- z.B. 'Monitoring', 'Kunden', 'Shop', ...
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    description TEXT,
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE time_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    status ENUM('in-progress', 'completed', 'paused') DEFAULT 'in-progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES time_sessions(id)
);
```

### 12.2 Benutzer, Rollen & Rechte

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    twofa_secret VARCHAR(255), -- für Aegis/Google Authenticator
    role_id INT NOT NULL,
    status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- z.B. 'Superadmin', 'Admin', 'Techniker', ...
    description TEXT
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    module VARCHAR(50) NOT NULL, -- z.B. 'Monitoring', 'Kunden', ...
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### 12.3 Audit-Log & Aktivitäten

```sql
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 12.4 Kunden, Projekte, Shop, Support (Beispiel)

```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('firma', 'privat') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'completed', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE shop_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### 12.5 Änderungsverlauf

- **2025-06-25:** Initiale Struktur nach .md, Pflichtenheft und DSGVO angelegt (Cursor KI)
- **Jede weitere Änderung wird hier mit Zeitstempel und Begründung dokumentiert!**
