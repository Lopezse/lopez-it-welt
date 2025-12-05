# Phase 1.0 – Kunden-Portal Architektur

## Enterprise++ Design Document

---

| Dokument-ID | LIW-PORTAL-ARCH-001 |
|-------------|---------------------|
| Version | 1.5.0 |
| Status | 🟢 **PHASE 1.1–1.5 FERTIG** |
| Erstellt | 05.12.2025 |
| Aktualisiert | 05.12.2025 |

---

## 1. Übersicht

### 1.1 Module

```
┌─────────────────────────────────────────────────────────────────┐
│                     KUNDEN-PORTAL                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Registrie-  │  │   Login     │  │ Onboarding  │              │
│  │    rung     │  │   + 2FA     │  │   Wizard    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              KUNDEN-DASHBOARD                            │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │Übersicht│ │Projekte │ │Rechnun- │ │ Support │        │    │
│  │  │         │ │         │ │  gen    │ │ Tickets │        │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                    │    │
│  │  │   AI    │ │ Profil  │ │Dokumente│                    │    │
│  │  │Services │ │Settings │ │         │                    │    │
│  │  └─────────┘ └─────────┘ └─────────┘                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              BILLING & PAYMENTS                          │    │
│  │  Rechnungserstellung │ PDF-Export │ Usage-Tracking       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Tech-Stack

| Komponente | Technologie |
|------------|-------------|
| Framework | Next.js 15 (App Router) |
| Auth | Argon2, JWT, 2FA (TOTP) |
| Database | MySQL/MariaDB |
| Styling | Tailwind CSS |
| PDF | @react-pdf/renderer |
| E-Mail | Nodemailer / Resend |

---

## 2. Verzeichnisstruktur

```
src/
├── app/
│   ├── (auth)/                    # Auth-Gruppe (kein Layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── 2fa/
│   │       └── page.tsx
│   │
│   ├── (customer)/                # Kunden-Portal (geschützt)
│   │   ├── layout.tsx             # Kunden-Layout mit Sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Übersicht
│   │   ├── projects/
│   │   │   ├── page.tsx           # Projekt-Liste
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Projekt-Detail
│   │   │   └── new/
│   │   │       └── page.tsx       # Neues Projekt
│   │   ├── invoices/
│   │   │   ├── page.tsx           # Rechnungs-Liste
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Rechnung-Detail + PDF
│   │   ├── tickets/
│   │   │   ├── page.tsx           # Ticket-Liste
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Ticket-Detail
│   │   │   └── new/
│   │   │       └── page.tsx       # Neues Ticket
│   │   ├── ai-services/
│   │   │   ├── page.tsx           # AI-Services Übersicht
│   │   │   ├── media-ai/
│   │   │   │   └── page.tsx       # Media AI
│   │   │   └── code-audit/
│   │   │       └── page.tsx       # Code-Audit
│   │   ├── documents/
│   │   │   └── page.tsx           # Dokumente
│   │   ├── profile/
│   │   │   └── page.tsx           # Profil & Settings
│   │   └── onboarding/
│   │       └── page.tsx           # Onboarding-Wizard
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/
│       │   │   └── route.ts
│       │   ├── login/
│       │   │   └── route.ts
│       │   ├── logout/
│       │   │   └── route.ts
│       │   ├── verify-email/
│       │   │   └── route.ts
│       │   ├── forgot-password/
│       │   │   └── route.ts
│       │   ├── reset-password/
│       │   │   └── route.ts
│       │   ├── 2fa/
│       │   │   ├── setup/
│       │   │   │   └── route.ts
│       │   │   └── verify/
│       │   │       └── route.ts
│       │   └── session/
│       │       └── route.ts
│       │
│       └── customer/
│           ├── dashboard/
│           │   └── route.ts
│           ├── projects/
│           │   ├── route.ts
│           │   └── [id]/
│           │       └── route.ts
│           ├── invoices/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── route.ts
│           │       └── pdf/
│           │           └── route.ts
│           ├── tickets/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── route.ts
│           │       └── messages/
│           │           └── route.ts
│           ├── ai-services/
│           │   └── route.ts
│           └── profile/
│               └── route.ts
│
├── lib/
│   ├── customer/
│   │   ├── auth-service.ts        # Registrierung, Login, 2FA
│   │   ├── customer-service.ts    # Kunden-CRUD
│   │   ├── project-service.ts     # Projekt-Verwaltung
│   │   ├── invoice-service.ts     # Rechnungen
│   │   ├── ticket-service.ts      # Support-Tickets
│   │   └── pdf-generator.ts       # PDF-Erstellung
│   │
│   └── auth/
│       ├── argon2.ts              # Passwort-Hashing
│       ├── jwt.ts                 # Token-Management
│       ├── 2fa.ts                 # TOTP 2FA
│       └── session.ts             # Session-Management
│
└── components/
    └── customer/
        ├── CustomerLayout.tsx     # Portal-Layout
        ├── CustomerSidebar.tsx    # Sidebar-Navigation
        ├── DashboardCards.tsx     # Dashboard-Karten
        ├── ProjectCard.tsx        # Projekt-Karte
        ├── InvoiceTable.tsx       # Rechnungs-Tabelle
        ├── TicketList.tsx         # Ticket-Liste
        └── OnboardingWizard.tsx   # Onboarding-Wizard
```

---

## 3. Datenbank-Schema

### 3.1 Kunden-Tabellen

```sql
-- =====================================================
-- KUNDEN (CUSTOMERS)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Basis-Daten
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profil
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  
  -- Firma (B2B)
  company_name VARCHAR(200),
  company_vat_id VARCHAR(50),
  
  -- Adresse
  street VARCHAR(200),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'DE',
  
  -- Status
  status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,
  
  -- 2FA
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(100),
  
  -- DSGVO
  dsgvo_consent BOOLEAN DEFAULT FALSE,
  dsgvo_consent_at TIMESTAMP NULL,
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INT DEFAULT 0,
  
  -- Tenant/Mandant (für AI Center Integration)
  tenant_id INT,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- KUNDEN-SESSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  
  token VARCHAR(255) NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address VARCHAR(50),
  
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_customer (customer_id),
  INDEX idx_token (token),
  INDEX idx_expires (expires_at),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- KUNDEN-PROJEKTE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  
  -- Projekt-Daten
  name VARCHAR(200) NOT NULL,
  description TEXT,
  code VARCHAR(50) NOT NULL,
  
  -- Status
  status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
  
  -- Typ
  type ENUM('website', 'webapp', 'api', 'consulting', 'other') DEFAULT 'other',
  
  -- Settings
  settings JSON,
  
  -- AI-Features aktiviert
  ai_media_enabled BOOLEAN DEFAULT FALSE,
  ai_code_audit_enabled BOOLEAN DEFAULT FALSE,
  ai_analyzer_enabled BOOLEAN DEFAULT FALSE,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY idx_customer_code (customer_id, code),
  INDEX idx_customer (customer_id),
  INDEX idx_status (status),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- KUNDEN-RECHNUNGEN
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  project_id INT,
  
  -- Rechnungs-Nummer
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Beträge
  net_amount DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  tax_amount DECIMAL(10,2) NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  
  -- Daten
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  
  -- Status
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  paid_at TIMESTAMP NULL,
  
  -- Positionen (JSON)
  line_items JSON NOT NULL,
  
  -- PDF
  pdf_path VARCHAR(500),
  pdf_generated_at TIMESTAMP NULL,
  
  -- Notizen
  notes TEXT,
  internal_notes TEXT,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_customer (customer_id),
  INDEX idx_project (project_id),
  INDEX idx_status (status),
  INDEX idx_invoice_date (invoice_date),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES lopez_customer_projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUPPORT-TICKETS
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  project_id INT,
  
  -- Ticket-Nummer
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  
  -- Inhalt
  subject VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  
  -- Klassifizierung
  category ENUM('technical', 'billing', 'general', 'feature_request', 'bug_report') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  
  -- Status
  status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
  
  -- Zuweisung
  assigned_to INT,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  closed_at TIMESTAMP NULL,
  
  INDEX idx_customer (customer_id),
  INDEX idx_project (project_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES lopez_customer_projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TICKET-NACHRICHTEN
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_ticket_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  
  -- Absender
  sender_type ENUM('customer', 'admin', 'system') NOT NULL,
  sender_id INT,
  
  -- Nachricht
  message TEXT NOT NULL,
  
  -- Anhänge
  attachments JSON,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_ticket (ticket_id),
  
  FOREIGN KEY (ticket_id) REFERENCES lopez_customer_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- EMAIL-VERIFIZIERUNG
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_email_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  
  token VARCHAR(255) NOT NULL UNIQUE,
  type ENUM('verify_email', 'reset_password') NOT NULL,
  
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_token (token),
  INDEX idx_customer (customer_id),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AI-USAGE TRACKING (PRO KUNDE)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_ai_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  project_id INT,
  
  -- Service
  service ENUM('media_ai', 'code_audit', 'project_analyzer', 'other') NOT NULL,
  
  -- Usage
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0,
  
  -- Details
  details JSON,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_customer (customer_id),
  INDEX idx_project (project_id),
  INDEX idx_service (service),
  INDEX idx_created (created_at),
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.2 Tabellen-Übersicht

| Tabelle | Zweck |
|---------|-------|
| `lopez_customers` | Kundenstammdaten |
| `lopez_customer_sessions` | Login-Sessions |
| `lopez_customer_projects` | Projekte pro Kunde |
| `lopez_customer_invoices` | Rechnungen |
| `lopez_customer_tickets` | Support-Tickets |
| `lopez_customer_ticket_messages` | Ticket-Nachrichten |
| `lopez_customer_email_tokens` | E-Mail-Verifizierung |
| `lopez_customer_ai_usage` | AI-Nutzung pro Kunde |

---

## 4. API-Design

### 4.1 Auth-APIs

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| POST | /api/auth/register | Registrierung |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/verify-email | E-Mail verifizieren |
| POST | /api/auth/forgot-password | Passwort vergessen |
| POST | /api/auth/reset-password | Passwort zurücksetzen |
| POST | /api/auth/2fa/setup | 2FA einrichten |
| POST | /api/auth/2fa/verify | 2FA verifizieren |
| GET | /api/auth/session | Session prüfen |

### 4.2 Customer-APIs

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /api/customer/dashboard | Dashboard-Daten |
| GET | /api/customer/profile | Profil laden |
| PATCH | /api/customer/profile | Profil aktualisieren |
| GET | /api/customer/projects | Projekte listen |
| POST | /api/customer/projects | Projekt erstellen |
| GET | /api/customer/projects/:id | Projekt-Details |
| PATCH | /api/customer/projects/:id | Projekt aktualisieren |
| GET | /api/customer/invoices | Rechnungen listen |
| GET | /api/customer/invoices/:id | Rechnung-Details |
| GET | /api/customer/invoices/:id/pdf | Rechnung als PDF |
| GET | /api/customer/tickets | Tickets listen |
| POST | /api/customer/tickets | Ticket erstellen |
| GET | /api/customer/tickets/:id | Ticket-Details |
| POST | /api/customer/tickets/:id/messages | Nachricht senden |
| GET | /api/customer/ai-services | AI-Services Übersicht |

---

## 5. Sicherheitsmodell

### 5.1 RBAC (Role-Based Access Control)

| Rolle | Beschreibung | Rechte |
|-------|--------------|--------|
| customer | Normaler Kunde | Eigene Daten, Projekte, Tickets |
| customer_admin | Firmen-Admin | + Team-Verwaltung |
| admin | Lopez IT Admin | Voller Zugriff |

### 5.2 Permissions

```typescript
// Kunden-Permissions
customer.profile.view
customer.profile.edit
customer.projects.view
customer.projects.create
customer.projects.edit
customer.invoices.view
customer.invoices.download
customer.tickets.view
customer.tickets.create
customer.ai.use
```

### 5.3 Sicherheits-Features

| Feature | Implementierung |
|---------|-----------------|
| Passwort-Hashing | Argon2id |
| Token | JWT (RS256) |
| 2FA | TOTP (RFC 6238) |
| Session | HTTP-Only Cookies |
| CSRF | Double Submit |
| Rate-Limiting | Pro IP + User |
| DSGVO | Consent + Löschung |

---

## 6. UI-Routing

### 6.1 Öffentliche Seiten

| Route | Beschreibung |
|-------|--------------|
| /login | Login-Seite |
| /register | Registrierung |
| /verify-email | E-Mail-Bestätigung |
| /forgot-password | Passwort vergessen |
| /reset-password | Passwort zurücksetzen |
| /2fa | 2FA-Eingabe |

### 6.2 Geschützte Seiten (Kunde)

| Route | Beschreibung |
|-------|--------------|
| /dashboard | Übersicht |
| /projects | Projekte |
| /projects/[id] | Projekt-Detail |
| /projects/new | Neues Projekt |
| /invoices | Rechnungen |
| /invoices/[id] | Rechnung-Detail |
| /tickets | Support-Tickets |
| /tickets/[id] | Ticket-Detail |
| /tickets/new | Neues Ticket |
| /ai-services | AI-Services |
| /documents | Dokumente |
| /profile | Profil & Settings |
| /onboarding | Onboarding-Wizard |

---

## 7. Datenfluss

### 7.1 Registrierung

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Register│ ──► │  API    │ ──► │   DB    │ ──► │  E-Mail │
│  Form   │     │ Create  │     │  Insert │     │  Send   │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                                               │
     ▼                                               ▼
┌─────────┐                                    ┌─────────┐
│ Success │ ◄───────────────────────────────── │ Verify  │
│  Page   │                                    │  Link   │
└─────────┘                                    └─────────┘
```

### 7.2 Login mit 2FA

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Login  │ ──► │ Verify  │ ──► │   2FA   │ ──► │ Session │
│  Form   │     │ Password│     │  Check  │     │ Create  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                     │
                                     ▼
                               ┌─────────┐
                               │Dashboard│
                               │ Redirect│
                               └─────────┘
```

---

## 8. Implementierungs-Status

| Phase | Inhalt | Status | Datum |
|-------|--------|--------|-------|
| 1.0 | Architektur (dieses Dokument) | ✅ FERTIG | 05.12.2025 |
| 1.1 | Registrierung | ✅ FERTIG | 05.12.2025 |
| 1.2 | Login + 2FA | ✅ FERTIG | 05.12.2025 |
| 1.3 | Onboarding (4-Schritte) | ✅ FERTIG | 05.12.2025 |
| 1.4 | Kundendashboard + Portal | ✅ FERTIG | 05.12.2025 |
| 1.5 | Billing + PDF-Rechnungen | ✅ FERTIG | 05.12.2025 |
| 1.6 | Admin-Portal (Kunden + Rechnungen) | 🔵 GEPLANT | - |

---

## 9. Implementierte Dateien

### 9.1 API-Routen

| Route | Datei | Status |
|-------|-------|--------|
| POST /api/auth/register | `src/app/api/auth/register/route.ts` | ✅ |
| POST /api/auth/login | `src/app/api/auth/login/route.ts` | ✅ |
| POST /api/auth/logout | `src/app/api/auth/logout/route.ts` | ✅ |
| GET /api/auth/me | `src/app/api/auth/me/route.ts` | ✅ |
| GET /api/auth/verify-email | `src/app/api/auth/verify-email/route.ts` | ✅ |
| POST /api/auth/2fa/setup | `src/app/api/auth/2fa/setup/route.ts` | ✅ |
| POST /api/auth/2fa/verify | `src/app/api/auth/2fa/verify/route.ts` | ✅ |
| GET/POST /api/auth/onboarding | `src/app/api/auth/onboarding/route.ts` | ✅ |
| GET /api/portal/stats | `src/app/api/portal/stats/route.ts` | ✅ |
| GET/POST /api/portal/projekte | `src/app/api/portal/projekte/route.ts` | ✅ |
| GET /api/portal/rechnungen | `src/app/api/portal/rechnungen/route.ts` | ✅ |
| GET /api/portal/rechnungen/[id]/download | `src/app/api/portal/rechnungen/[id]/download/route.ts` | ✅ |
| GET/POST /api/admin/invoices | `src/app/api/admin/invoices/route.ts` | ✅ |
| GET/PATCH /api/admin/invoices/[id] | `src/app/api/admin/invoices/[id]/route.ts` | ✅ |
| POST/GET /api/admin/invoices/[id]/pdf | `src/app/api/admin/invoices/[id]/pdf/route.ts` | ✅ |
| GET/POST /api/portal/support | `src/app/api/portal/support/route.ts` | ✅ |
| PATCH /api/portal/einstellungen | `src/app/api/portal/einstellungen/route.ts` | ✅ |

### 9.2 UI-Seiten

| Route | Datei | Status |
|-------|-------|--------|
| /kunde/login | `src/app/kunde/login/page.tsx` | ✅ |
| /kunde/register | `src/app/kunde/register/page.tsx` | ✅ |
| /kunde/verify-email | `src/app/kunde/verify-email/page.tsx` | ✅ |
| /kunde/2fa | `src/app/kunde/2fa/page.tsx` | ✅ |
| /kunde/onboarding | `src/app/kunde/onboarding/page.tsx` | ✅ |
| /portal | `src/app/portal/page.tsx` | ✅ |
| /portal/projekte | `src/app/portal/projekte/page.tsx` | ✅ |
| /portal/rechnungen | `src/app/portal/rechnungen/page.tsx` | ✅ |
| /portal/support | `src/app/portal/support/page.tsx` | ✅ |
| /portal/ai | `src/app/portal/ai/page.tsx` | ✅ |
| /portal/einstellungen | `src/app/portal/einstellungen/page.tsx` | ✅ |

### 9.3 Services

| Service | Datei | Status |
|---------|-------|--------|
| CustomerAuthService | `src/lib/customer/auth-service.ts` | ✅ |
| OnboardingService | `src/lib/customer/onboarding-service.ts` | ✅ |
| TwoFactorService | `src/lib/customer/two-factor-service.ts` | ✅ |
| EmailService | `src/lib/customer/email-service.ts` | ✅ |
| InvoiceService | `src/lib/customer/invoice-service.ts` | ✅ |
| InvoiceNumberGenerator | `src/lib/customer/invoice-number-generator.ts` | ✅ |
| InvoicePdf | `src/lib/customer/invoice-pdf.tsx` | ✅ |

---

## 10. Billing-System (Phase 1.5)

### 10.1 Features

| Feature | Status |
|---------|--------|
| Rechnungsnummer `LITW-YYYY-00001` | ✅ Thread-safe |
| Immutabilität (sent/paid) | ✅ Keine Inhaltsänderungen |
| Audit-Logging | ✅ Status-Wechsel protokolliert |
| PDF-Generierung | ✅ @react-pdf/renderer |
| Sichere Speicherung | ✅ `/storage/invoices/` |
| Geschützter Download | ✅ Session + Berechtigung |
| AI-Ready | ✅ Analytics-Methode |

### 10.2 Status-Flow

```
draft ──► sent ──► paid
  │         │
  │         ├──► overdue ──► paid
  │         │
  │         └──► cancelled
  │
  └──► cancelled
```

### 10.3 Speicherstruktur

```
/storage/invoices/
  └── {year}/
      └── {customer_id}/
          └── {invoice_id}-{hash}.pdf
```

---

**Ende Phase 1.5 – Billing**

*Lopez IT Welt – Enterprise++ Kunden-Portal*

*Aktualisiert: 05.12.2025*

