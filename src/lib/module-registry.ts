// =====================================================
// ENTERPRISE++ MODULE REGISTRY SYSTEM
// =====================================================
// Erstellt: 2025-12-02
// Zweck: SAP Solution Manager / IBM Rational Style Module Tracking
// Status: ✅ ENTERPRISE++ IMPLEMENTIERT
// =====================================================
// 
// Wie bei SAP, IBM, Siemens:
// - Definiert SOLL-Zustand (geplante Module)
// - Trackt IST-Zustand (implementierte Module)
// - Zeigt Fortschritt & Lücken transparent
// =====================================================

import { getConnection } from "./database";

// =====================================================
// TYPEN & INTERFACES
// =====================================================

export type ModuleStatus = 
  | "planned"      // Geplant, noch nicht begonnen
  | "in_progress"  // In Entwicklung
  | "implemented"  // Implementiert, nicht getestet
  | "tested"       // Getestet
  | "deployed"     // Produktiv
  | "deprecated"   // Veraltet
  | "cancelled";   // Abgebrochen

export type ModuleCategory =
  | "core"         // Kern-System
  | "security"     // Sicherheit
  | "operations"   // Betrieb
  | "business"     // Business-Logik
  | "finance"      // Finanzen
  | "ai"           // KI & Automation
  | "compliance"   // Compliance
  | "integration"  // Integrationen
  | "ui"           // Benutzeroberfläche
  | "api";         // API-Endpoints

export type ModulePriority = "critical" | "high" | "medium" | "low";

export interface AdminModule {
  id: number;
  module_code: string;           // z.B. "SEC-001", "FIN-002"
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  priority: ModulePriority;
  
  // Pfade
  ui_path?: string;              // z.B. "/admin/security"
  api_path?: string;             // z.B. "/api/admin/security"
  
  // Fortschritt
  progress_percent: number;      // 0-100
  
  // Enterprise++ Metadata
  responsible_team?: string;
  target_date?: Date;
  completed_date?: Date;
  
  // Dependencies
  depends_on?: string[];         // Module Codes
  
  // Audit
  created_at: Date;
  updated_at: Date;
  created_by?: number;
}

export interface ModuleFeature {
  id: number;
  module_id: number;
  feature_code: string;          // z.B. "SEC-001-F01"
  name: string;
  description: string;
  status: ModuleStatus;
  priority: ModulePriority;
  progress_percent: number;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// ENTERPRISE++ SOLL-ZUSTAND DEFINITION
// =====================================================
// Dies ist die vollständige Roadmap aller geplanten Module

export const ENTERPRISE_MODULE_ROADMAP: Omit<AdminModule, "id" | "created_at" | "updated_at">[] = [
  // ===== CORE SYSTEM =====
  {
    module_code: "CORE-001",
    name: "Dashboard",
    description: "Zentrales Admin-Dashboard mit KPIs und Widgets",
    category: "core",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin",
    api_path: "/api/admin/dashboard",
  },
  {
    module_code: "CORE-002",
    name: "Navigation System",
    description: "Dynamische Navigation mit RBAC-Integration",
    category: "core",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/navigation",
    api_path: "/api/admin/navigation",
  },
  {
    module_code: "CORE-003",
    name: "Einstellungen",
    description: "System- und Benutzereinstellungen",
    category: "core",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/settings",
    api_path: "/api/admin/settings",
  },

  // ===== SECURITY =====
  {
    module_code: "SEC-001",
    name: "Authentifizierung",
    description: "Login, Logout, Session-Management",
    category: "security",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/login",
    api_path: "/api/auth",
  },
  {
    module_code: "SEC-002",
    name: "2FA System",
    description: "Zwei-Faktor-Authentifizierung mit TOTP",
    category: "security",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/setup-2fa",
    api_path: "/api/admin/setup-2fa",
  },
  {
    module_code: "SEC-003",
    name: "Rollen & Rechte (RBAC)",
    description: "Role-Based Access Control System",
    category: "security",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/roles",
    api_path: "/api/admin/roles",
  },
  {
    module_code: "SEC-004",
    name: "Admin-Privilegien",
    description: "Erweiterte Privilegien-Verwaltung",
    category: "security",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/privileges",
    api_path: "/api/admin/privileges",
  },
  {
    module_code: "SEC-005",
    name: "Security Dashboard",
    description: "Sicherheits-Übersicht, Geräte, Sessions",
    category: "security",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/security",
    api_path: "/api/admin/security",
  },
  {
    module_code: "SEC-006",
    name: "Audit-Logs",
    description: "Vollständige Audit-Trail-Protokollierung",
    category: "security",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/audit-logs",
    api_path: "/api/admin/audit-logs",
  },

  // ===== OPERATIONS =====
  {
    module_code: "OPS-001",
    name: "System-Monitoring",
    description: "Server, DB, API, Queue Monitoring",
    category: "operations",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/monitoring",
    api_path: "/api/monitoring",
  },
  {
    module_code: "OPS-002",
    name: "Logs & Analytics",
    description: "Log-Verwaltung und Analyse",
    category: "operations",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/logs",
    api_path: "/api/logs",
  },
  {
    module_code: "OPS-003",
    name: "Backup-System",
    description: "Automatische Backups mit Restore-Funktion",
    category: "operations",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/backup",
    api_path: "/api/admin/backup",
  },
  {
    module_code: "OPS-004",
    name: "Unified Operations Center",
    description: "UOC mit Timeline, Correlation, Root-Cause",
    category: "operations",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/uoc",
    api_path: "/api/admin/uoc",
  },
  {
    module_code: "OPS-005",
    name: "Alerting & Incidents",
    description: "Alert-Management und Incident-Tracking",
    category: "operations",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/orchestrator/alerts",
    api_path: "/api/admin/orchestrator/alerts",
  },

  // ===== BUSINESS =====
  {
    module_code: "BUS-001",
    name: "Kundenverwaltung",
    description: "CRUD, Import, Export, Statistiken",
    category: "business",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/customers",
    api_path: "/api/admin/customers",
  },
  {
    module_code: "BUS-002",
    name: "Projektverwaltung",
    description: "Projekte, Tasks, Fortschritt, AI-Analyse",
    category: "business",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/office/projects",
    api_path: "/api/projects",
  },
  {
    module_code: "BUS-003",
    name: "Support-Tickets",
    description: "Ticket-System mit Status-Management",
    category: "business",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/support",
    api_path: "/api/admin/tickets",
  },
  {
    module_code: "BUS-004",
    name: "Kontakt-Nachrichten",
    description: "Kontaktformular-Verwaltung",
    category: "business",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/support/contact-messages",
    api_path: "/api/admin/contact-messages",
  },
  {
    module_code: "BUS-005",
    name: "Benutzerverwaltung",
    description: "Admin-Benutzer verwalten",
    category: "business",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/users",
    api_path: "/api/admin/users",
  },

  // ===== FINANCE =====
  {
    module_code: "FIN-001",
    name: "Rechnungsverwaltung",
    description: "Rechnungen erstellen, verwalten, AI-Prüfung",
    category: "finance",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/office/invoices",
    api_path: "/api/invoices",
  },
  {
    module_code: "FIN-002",
    name: "Zeiterfassung",
    description: "Sessions, Tasks, Analytics",
    category: "finance",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/time-tracking",
    api_path: "/api/admin/time-tracking",
  },
  {
    module_code: "FIN-003",
    name: "Umsatz-Reports",
    description: "Umsatz-Auswertungen und Charts",
    category: "finance",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/reports/revenue",
    api_path: "/api/admin/reports/revenue",
  },
  {
    module_code: "FIN-004",
    name: "E-Rechnung (XRechnung)",
    description: "ZUGFeRD/XRechnung Export",
    category: "finance",
    status: "planned",
    priority: "high",
    progress_percent: 0,
    ui_path: "/admin/office/einvoice",
    api_path: "/api/admin/einvoice",
  },
  {
    module_code: "FIN-005",
    name: "Lohnbuchhaltung",
    description: "Lohnabrechnung und Gehaltsübersicht",
    category: "finance",
    status: "planned",
    priority: "medium",
    progress_percent: 0,
    ui_path: "/admin/office/payroll",
    api_path: "/api/admin/payroll",
  },

  // ===== AI & AUTOMATION =====
  {
    module_code: "AI-001",
    name: "AI Center Dashboard",
    description: "Zentrale AI-Übersicht und Status",
    category: "ai",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/ai",
    api_path: "/api/admin/ai",
  },
  {
    module_code: "AI-002",
    name: "Customer Insights",
    description: "AI-gestützte Kundenanalyse",
    category: "ai",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/customers",
    api_path: "/api/admin/ai/customers",
  },
  {
    module_code: "AI-003",
    name: "Project Analyzer",
    description: "AI-Projektanalyse mit Risikobewertung",
    category: "ai",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/office/projects",
    api_path: "/api/admin/ai/projects",
  },
  {
    module_code: "AI-004",
    name: "Invoice Assistant",
    description: "AI-Rechnungsprüfung",
    category: "ai",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/office/invoices",
    api_path: "/api/admin/ai/invoices",
  },
  {
    module_code: "AI-005",
    name: "Executive Reports",
    description: "AI-generierte Management-Reports",
    category: "ai",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/ai/reports",
    api_path: "/api/admin/ai/reports",
  },
  {
    module_code: "AI-006",
    name: "Media AI",
    description: "Bild-/Dokumentenanalyse mit KI",
    category: "ai",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/media/ai/dashboard",
    api_path: "/api/admin/media/ai",
  },
  {
    module_code: "AI-007",
    name: "KI-Orchestrator",
    description: "Zentrale KI-Agenten-Steuerung",
    category: "ai",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/orchestrator",
    api_path: "/api/orchestrator",
  },

  // ===== COMPLIANCE =====
  {
    module_code: "COMP-001",
    name: "DSGVO-Center",
    description: "DSGVO-Compliance Dashboard",
    category: "compliance",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/compliance/dsgvo",
    api_path: "/api/admin/compliance/dsgvo",
  },
  {
    module_code: "COMP-002",
    name: "Consent-Management",
    description: "Einwilligungen verwalten",
    category: "compliance",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    ui_path: "/admin/compliance/dsgvo/consents",
    api_path: "/api/admin/compliance/consents",
  },
  {
    module_code: "COMP-003",
    name: "DSGVO AI-Monitoring",
    description: "KI-DSGVO-Prüfung",
    category: "compliance",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/compliance/dsgvo/ai-monitoring",
    api_path: "/api/admin/compliance/ai-monitoring",
  },
  {
    module_code: "COMP-004",
    name: "GoBD-Compliance",
    description: "GoBD-konforme Archivierung",
    category: "compliance",
    status: "in_progress",
    priority: "high",
    progress_percent: 50,
    ui_path: "/admin/compliance/gobd",
    api_path: "/api/admin/compliance/gobd",
  },
  {
    module_code: "COMP-005",
    name: "Datenschutz-Reports",
    description: "DSGVO-Reports und Exports",
    category: "compliance",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/compliance/dsgvo/reports",
    api_path: "/api/admin/compliance/reports",
  },

  // ===== CONTENT & MEDIA =====
  {
    module_code: "CMS-001",
    name: "Seitenverwaltung",
    description: "Seiten erstellen und bearbeiten",
    category: "ui",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/content/pages",
    api_path: "/api/admin/pages",
  },
  {
    module_code: "CMS-002",
    name: "Header & Footer",
    description: "Header/Footer-Konfiguration",
    category: "ui",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/content/header-footer",
    api_path: "/api/admin/content/header-footer",
  },
  {
    module_code: "CMS-003",
    name: "Medien-Upload",
    description: "Datei-Upload und Verwaltung",
    category: "ui",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/media",
    api_path: "/api/admin/media",
  },
  {
    module_code: "CMS-004",
    name: "Blog-System",
    description: "Blog-Artikel erstellen und verwalten",
    category: "ui",
    status: "planned",
    priority: "medium",
    progress_percent: 0,
    ui_path: "/admin/marketing/blog",
    api_path: "/api/admin/blog",
  },
  {
    module_code: "CMS-005",
    name: "News & Updates",
    description: "News-Verwaltung",
    category: "ui",
    status: "planned",
    priority: "low",
    progress_percent: 0,
    ui_path: "/admin/marketing/news",
    api_path: "/api/admin/news",
  },
  {
    module_code: "CMS-006",
    name: "SEO & Meta-Tags",
    description: "SEO-Optimierung und Meta-Tags",
    category: "ui",
    status: "planned",
    priority: "medium",
    progress_percent: 0,
    ui_path: "/admin/marketing/seo",
    api_path: "/api/admin/seo",
  },

  // ===== INTEGRATIONS =====
  {
    module_code: "INT-001",
    name: "LinkedIn Content Plan",
    description: "LinkedIn Marketing Integration",
    category: "integration",
    status: "deployed",
    priority: "low",
    progress_percent: 100,
    ui_path: "/admin/marketing/linkedin-content-plan",
    api_path: "/api/admin/marketing/linkedin-content-plan",
  },
  {
    module_code: "INT-002",
    name: "E-Mail-Integration",
    description: "E-Mail-Versand und Templates",
    category: "integration",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/settings/notifications",
    api_path: "/api/admin/settings/notifications",
  },
  {
    module_code: "INT-003",
    name: "Shop-System",
    description: "E-Commerce Funktionen",
    category: "integration",
    status: "in_progress",
    priority: "medium",
    progress_percent: 30,
    ui_path: "/admin/shop",
    api_path: "/api/shop",
  },
  {
    module_code: "INT-004",
    name: "Kalender-Integration",
    description: "Kalender und Termine",
    category: "integration",
    status: "in_progress",
    priority: "medium",
    progress_percent: 50,
    ui_path: "/admin/office/calendar",
    api_path: "/api/admin/calendar",
  },

  // ===== API =====
  {
    module_code: "API-001",
    name: "REST API Core",
    description: "Kern-API-Infrastruktur",
    category: "api",
    status: "deployed",
    priority: "critical",
    progress_percent: 100,
    api_path: "/api",
  },
  {
    module_code: "API-002",
    name: "API-Dokumentation",
    description: "Swagger/OpenAPI Docs",
    category: "api",
    status: "planned",
    priority: "medium",
    progress_percent: 0,
    ui_path: "/admin/docs",
    api_path: "/api/docs",
  },
  {
    module_code: "API-003",
    name: "API Rate Limiting",
    description: "Rate Limiting & Throttling",
    category: "api",
    status: "in_progress",
    priority: "high",
    progress_percent: 60,
    api_path: "/api",
  },

  // ===== QUALITY =====
  {
    module_code: "QA-001",
    name: "Qualitäts-Dashboard",
    description: "Code-Qualität und Metriken",
    category: "core",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/quality",
    api_path: "/api/admin/quality",
  },
  {
    module_code: "QA-002",
    name: "Release-Management",
    description: "Release-Checklisten und Approvals",
    category: "core",
    status: "deployed",
    priority: "high",
    progress_percent: 100,
    ui_path: "/admin/release/checklist",
    api_path: "/api/admin/release",
  },
  {
    module_code: "QA-003",
    name: "A/B Testing",
    description: "A/B-Test-Framework",
    category: "core",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/ab-test",
    api_path: "/api/admin/ab-test",
  },
  {
    module_code: "QA-004",
    name: "Data Lineage",
    description: "Datenherkunft und -fluss",
    category: "core",
    status: "deployed",
    priority: "medium",
    progress_percent: 100,
    ui_path: "/admin/data-lineage",
    api_path: "/api/admin/data-lineage",
  },
];

// =====================================================
// SERVICE KLASSE
// =====================================================

export class ModuleRegistryService {
  
  /**
   * Initialisiert die Module-Registry-Tabellen
   */
  static async initializeTables(): Promise<void> {
    const pool = await getConnection();

    // Haupttabelle für Module
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_admin_modules (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        module_code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category ENUM('core', 'security', 'operations', 'business', 'finance', 'ai', 'compliance', 'integration', 'ui', 'api') NOT NULL,
        status ENUM('planned', 'in_progress', 'implemented', 'tested', 'deployed', 'deprecated', 'cancelled') DEFAULT 'planned',
        priority ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
        ui_path VARCHAR(255),
        api_path VARCHAR(255),
        progress_percent TINYINT UNSIGNED DEFAULT 0,
        responsible_team VARCHAR(100),
        target_date DATE,
        completed_date DATE,
        depends_on JSON,
        created_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabelle für Feature-Details (granulare Features innerhalb eines Moduls)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_admin_module_features (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        module_id BIGINT NOT NULL,
        feature_code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('planned', 'in_progress', 'implemented', 'tested', 'deployed', 'deprecated', 'cancelled') DEFAULT 'planned',
        priority ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
        progress_percent TINYINT UNSIGNED DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES lopez_admin_modules(id) ON DELETE CASCADE,
        INDEX idx_module_id (module_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabelle für Modul-Historie (Änderungsverlauf)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_admin_module_history (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        module_id BIGINT NOT NULL,
        changed_by BIGINT,
        change_type ENUM('created', 'status_changed', 'progress_updated', 'metadata_changed') NOT NULL,
        old_value JSON,
        new_value JSON,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES lopez_admin_modules(id) ON DELETE CASCADE,
        INDEX idx_module_id (module_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ Module Registry Tabellen initialisiert");
  }

  /**
   * Synchronisiert die Roadmap mit der Datenbank
   */
  static async syncRoadmap(): Promise<{ created: number; updated: number; unchanged: number }> {
    const pool = await getConnection();
    let created = 0;
    let updated = 0;
    let unchanged = 0;

    for (const module of ENTERPRISE_MODULE_ROADMAP) {
      // Prüfe ob Modul existiert
      const [existing] = await pool.execute(
        "SELECT id, status, progress_percent FROM lopez_admin_modules WHERE module_code = ?",
        [module.module_code]
      );

      if ((existing as any[]).length === 0) {
        // Neu erstellen
        await pool.execute(
          `INSERT INTO lopez_admin_modules 
           (module_code, name, description, category, status, priority, ui_path, api_path, progress_percent, depends_on)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            module.module_code,
            module.name,
            module.description,
            module.category,
            module.status,
            module.priority,
            module.ui_path || null,
            module.api_path || null,
            module.progress_percent,
            module.depends_on ? JSON.stringify(module.depends_on) : null,
          ]
        );
        created++;
      } else {
        // Nur aktualisieren wenn sich etwas geändert hat
        const existingModule = (existing as any[])[0];
        if (
          existingModule.status !== module.status ||
          existingModule.progress_percent !== module.progress_percent
        ) {
          await pool.execute(
            `UPDATE lopez_admin_modules 
             SET status = ?, progress_percent = ?, updated_at = NOW()
             WHERE module_code = ?`,
            [module.status, module.progress_percent, module.module_code]
          );
          updated++;
        } else {
          unchanged++;
        }
      }
    }

    return { created, updated, unchanged };
  }

  /**
   * Holt alle Module mit optionalem Filter
   */
  static async getModules(filter?: {
    category?: ModuleCategory;
    status?: ModuleStatus;
    priority?: ModulePriority;
  }): Promise<AdminModule[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM lopez_admin_modules WHERE 1=1";
    const params: any[] = [];

    if (filter?.category) {
      query += " AND category = ?";
      params.push(filter.category);
    }
    if (filter?.status) {
      query += " AND status = ?";
      params.push(filter.status);
    }
    if (filter?.priority) {
      query += " AND priority = ?";
      params.push(filter.priority);
    }

    query += " ORDER BY category, priority DESC, name";

    const [rows] = await pool.execute(query, params);
    return rows as AdminModule[];
  }

  /**
   * Berechnet Gesamt-Statistiken
   */
  static async getStatistics(): Promise<{
    total: number;
    byStatus: Record<ModuleStatus, number>;
    byCategory: Record<ModuleCategory, number>;
    byPriority: Record<ModulePriority, number>;
    overallProgress: number;
    criticalMissing: AdminModule[];
  }> {
    const pool = await getConnection();

    // Gesamt
    const [totalResult] = await pool.execute("SELECT COUNT(*) as count FROM lopez_admin_modules");
    const total = (totalResult as any[])[0].count;

    // Nach Status
    const [statusResult] = await pool.execute(
      "SELECT status, COUNT(*) as count FROM lopez_admin_modules GROUP BY status"
    );
    const byStatus = {} as Record<ModuleStatus, number>;
    for (const row of statusResult as any[]) {
      byStatus[row.status as ModuleStatus] = row.count;
    }

    // Nach Kategorie
    const [categoryResult] = await pool.execute(
      "SELECT category, COUNT(*) as count FROM lopez_admin_modules GROUP BY category"
    );
    const byCategory = {} as Record<ModuleCategory, number>;
    for (const row of categoryResult as any[]) {
      byCategory[row.category as ModuleCategory] = row.count;
    }

    // Nach Priorität
    const [priorityResult] = await pool.execute(
      "SELECT priority, COUNT(*) as count FROM lopez_admin_modules GROUP BY priority"
    );
    const byPriority = {} as Record<ModulePriority, number>;
    for (const row of priorityResult as any[]) {
      byPriority[row.priority as ModulePriority] = row.count;
    }

    // Gesamt-Fortschritt (gewichtet nach Priorität)
    const [progressResult] = await pool.execute(`
      SELECT 
        SUM(CASE priority 
          WHEN 'critical' THEN progress_percent * 4
          WHEN 'high' THEN progress_percent * 3
          WHEN 'medium' THEN progress_percent * 2
          ELSE progress_percent 
        END) as weighted_progress,
        SUM(CASE priority 
          WHEN 'critical' THEN 100 * 4
          WHEN 'high' THEN 100 * 3
          WHEN 'medium' THEN 100 * 2
          ELSE 100 
        END) as max_progress
      FROM lopez_admin_modules
    `);
    const progressData = (progressResult as any[])[0];
    const overallProgress = progressData.max_progress > 0 
      ? Math.round((progressData.weighted_progress / progressData.max_progress) * 100)
      : 0;

    // Kritische fehlende Module
    const [criticalMissing] = await pool.execute(
      `SELECT * FROM lopez_admin_modules 
       WHERE priority = 'critical' AND status IN ('planned', 'in_progress')
       ORDER BY progress_percent ASC`
    );

    return {
      total,
      byStatus,
      byCategory,
      byPriority,
      overallProgress,
      criticalMissing: criticalMissing as AdminModule[],
    };
  }

  /**
   * Aktualisiert ein Modul
   */
  static async updateModule(
    moduleCode: string,
    updates: Partial<Pick<AdminModule, "status" | "progress_percent" | "responsible_team" | "target_date" | "completed_date">>,
    userId?: number,
    comment?: string
  ): Promise<boolean> {
    const pool = await getConnection();

    // Hole aktuellen Zustand für Historie
    const [currentResult] = await pool.execute(
      "SELECT * FROM lopez_admin_modules WHERE module_code = ?",
      [moduleCode]
    );
    const current = (currentResult as any[])[0];
    if (!current) return false;

    // Update durchführen
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(updates.status);
    }
    if (updates.progress_percent !== undefined) {
      updateFields.push("progress_percent = ?");
      updateValues.push(updates.progress_percent);
    }
    if (updates.responsible_team !== undefined) {
      updateFields.push("responsible_team = ?");
      updateValues.push(updates.responsible_team);
    }
    if (updates.target_date !== undefined) {
      updateFields.push("target_date = ?");
      updateValues.push(updates.target_date);
    }
    if (updates.completed_date !== undefined) {
      updateFields.push("completed_date = ?");
      updateValues.push(updates.completed_date);
    }

    if (updateFields.length === 0) return false;

    updateFields.push("updated_at = NOW()");
    updateValues.push(moduleCode);

    await pool.execute(
      `UPDATE lopez_admin_modules SET ${updateFields.join(", ")} WHERE module_code = ?`,
      updateValues
    );

    // Historie eintragen
    await pool.execute(
      `INSERT INTO lopez_admin_module_history 
       (module_id, changed_by, change_type, old_value, new_value, comment)
       VALUES (?, ?, 'metadata_changed', ?, ?, ?)`,
      [
        current.id,
        userId || null,
        JSON.stringify({ status: current.status, progress_percent: current.progress_percent }),
        JSON.stringify(updates),
        comment || null,
      ]
    );

    return true;
  }

  /**
   * Generiert einen Fortschritts-Report (wie SAP Solution Manager)
   */
  static async generateReport(): Promise<{
    summary: string;
    modules: AdminModule[];
    statistics: Awaited<ReturnType<typeof ModuleRegistryService.getStatistics>>;
    gaps: AdminModule[];
    recommendations: string[];
  }> {
    const modules = await this.getModules();
    const statistics = await this.getStatistics();
    
    // Lücken identifizieren
    const gaps = modules.filter(m => 
      m.status === "planned" || 
      (m.status === "in_progress" && m.progress_percent < 50)
    );

    // Empfehlungen generieren
    const recommendations: string[] = [];
    
    if (statistics.criticalMissing.length > 0) {
      recommendations.push(
        `⚠️ ${statistics.criticalMissing.length} kritische Module noch nicht vollständig implementiert`
      );
    }
    
    const plannedCount = statistics.byStatus["planned"] || 0;
    if (plannedCount > 5) {
      recommendations.push(
        `📋 ${plannedCount} Module noch in Planung - Priorisierung empfohlen`
      );
    }

    if (statistics.overallProgress < 80) {
      recommendations.push(
        `📈 Gesamtfortschritt bei ${statistics.overallProgress}% - Fokus auf kritische Module`
      );
    }

    const summary = `
Enterprise++ Module Registry Report
===================================
Gesamt-Module: ${statistics.total}
Gesamtfortschritt: ${statistics.overallProgress}%

Status-Übersicht:
- Deployed: ${statistics.byStatus["deployed"] || 0}
- In Entwicklung: ${statistics.byStatus["in_progress"] || 0}
- Geplant: ${statistics.byStatus["planned"] || 0}

Offene Lücken: ${gaps.length}
Kritische Lücken: ${statistics.criticalMissing.length}
    `.trim();

    return {
      summary,
      modules,
      statistics,
      gaps,
      recommendations,
    };
  }
}












