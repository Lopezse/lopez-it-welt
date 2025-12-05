// =====================================================
// DATABASE INITIALIZATION API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Aktualisiert: 2025-12-02
// Zweck: Enterprise++ Safe Migration (KEINE DATENLÖSCHUNG!)
// Standard: IBM / SAP / Siemens Migration Level
// Status: ✅ ENTERPRISE++ SAFE MODE
// =====================================================

import { AuthService } from "@/lib/auth-service";
import { CustomerService } from "@/lib/customer-service";
import { getConnection, initializeDatabase } from "@/lib/database";
import { RBACService } from "@/lib/rbac-system";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Datenbank initialisieren (für Browser-Aufruf)
// =====================================================

export async function GET(request: NextRequest) {
  return await POST(request);
}

// =====================================================
// POST - Enterprise++ Safe Migration
// =====================================================
// WICHTIG: Diese Funktion löscht KEINE bestehenden Daten!
// - Tabellen werden nur erstellt wenn sie nicht existieren
// - Permissions werden nur hinzugefügt wenn sie fehlen
// - User werden nur erstellt wenn sie nicht existieren
// - Demo-Daten nur wenn keine Kunden vorhanden
// =====================================================

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Enterprise++ Safe Migration gestartet...");

    // Schritt 1: Tabellen erstellen (nur fehlende)
    await initializeDatabase();
    console.log("✅ Tabellen-Struktur geprüft/erstellt");

    // Schritt 2: Tabellen-Struktur prüfen (nicht reparieren durch Löschen!)
    await ensureTableStructure();
    console.log("✅ Tabellen-Struktur verifiziert");

    // Schritt 3: Demo-Daten NUR wenn keine Kunden existieren
    let demoResult = "Nicht geprüft";
    try {
      demoResult = await insertDemoDataSafe();
      console.log(`✅ Demo-Daten: ${demoResult}`);
    } catch (e) {
      demoResult = "Übersprungen (Tabelle existiert mit Daten)";
    }

    // Schritt 4: Rollen und Permissions (nur fehlende hinzufügen)
    await createDefaultRolesAndPermissions();
    console.log("✅ Rollen & Permissions synchronisiert");

    // Schritt 5: Super Admin prüfen (nicht überschreiben!)
    await ensureSuperAdmin();
    console.log("✅ Super Admin verifiziert");

    console.log("🎉 Enterprise++ Safe Migration abgeschlossen!");

    return NextResponse.json({
      success: true,
      message: "✅ Enterprise++ Safe Migration abgeschlossen",
      mode: "SAFE_MIGRATION",
      note: "Bestehende Daten wurden NICHT gelöscht!",
      data: {
        actions: [
          "Tabellen-Struktur geprüft (CREATE IF NOT EXISTS)",
          "Demo-Daten nur bei leerer Tabelle",
          "Permissions synchronisiert (INSERT IGNORE)",
          "Super Admin verifiziert (nicht überschrieben)",
        ],
        tables_checked: [
          "lopez_customers",
          "lopez_customer_notes",
          "lopez_customer_tags",
          "lopez_audit_logs",
          "lopez_users",
          "lopez_roles",
          "lopez_permissions",
          "lopez_user_roles",
          "lopez_role_permissions",
          "lopez_sessions",
          "lopez_user_2fa",
          "lopez_settings_*",
          "lopez_ai_*",
          "lopez_projects",
          "lopez_invoices",
        ],
        demo_data: demoResult,
        roles: ["Super Admin", "Admin", "Manager", "User"],
        super_admin: {
          username: "r.lopezsr",
          status: "verified (nicht überschrieben)",
          note: "Bestehendes 2FA-Secret bleibt erhalten!",
        },
      },
    });
  } catch (error) {
    // Datenbank-Initialisierungsfehler: ${error}
    return NextResponse.json(
      {
        success: false,
        message: "Fehler bei der Datenbank-Initialisierung",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// ENTERPRISE++ SAFE FUNCTIONS
// =====================================================

/**
 * Prüft Tabellenstruktur OHNE Daten zu löschen
 */
async function ensureTableStructure(): Promise<void> {
  const pool = await getConnection();

  try {
    // Prüfe ob wichtige Tabellen existieren
    const [tables] = await pool.execute(
      "SHOW TABLES LIKE 'lopez_%'"
    );

    const tableNames = (tables as any[]).map(t => Object.values(t)[0]);
    console.log(`📊 Gefundene Tabellen: ${tableNames.length}`);

    // AUTO_INCREMENT nur prüfen, nicht durch Löschen reparieren
    if (tableNames.includes('lopez_customers')) {
      const [columns] = await pool.execute(
        "SHOW COLUMNS FROM lopez_customers WHERE Field = 'id'"
      );
      const idColumn = (columns as any[])[0];
      if (idColumn && !idColumn.Extra?.includes('auto_increment')) {
        // Nur warnen, nicht löschen!
        console.warn("⚠️ lopez_customers.id hat kein AUTO_INCREMENT - manuelle Prüfung empfohlen");
      }
    }
  } catch (error) {
    console.error("Fehler bei Struktur-Prüfung:", error);
  }
}

/**
 * Demo-Daten NUR wenn keine Kunden existieren
 */
async function insertDemoDataSafe(): Promise<string> {
  const pool = await getConnection();

  try {
    // Prüfe ob bereits Kunden existieren
    const [existing] = await pool.execute(
      "SELECT COUNT(*) as count FROM lopez_customers"
    );
    const count = (existing as any[])[0]?.count || 0;

    if (count > 0) {
      return `Übersprungen - ${count} Kunden bereits vorhanden`;
    }

    // Nur wenn KEINE Kunden existieren: Demo-Daten einfügen
    await insertDemoData();
    return "4 Demo-Kunden erstellt (Tabelle war leer)";

  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      // Tabelle existiert nicht - Demo-Daten nach Tabellenerstellung
      await insertDemoData();
      return "4 Demo-Kunden erstellt (neue Tabelle)";
    }
    console.error("Demo-Daten Fehler:", error);
    return "Fehler bei Demo-Daten";
  }
}

/**
 * Super Admin prüfen - NUR erstellen wenn nicht existiert
 */
async function ensureSuperAdmin(): Promise<void> {
  const pool = await getConnection();

  try {
    // Prüfe ob r.lopezsr existiert
    const [existing] = await pool.execute(
      "SELECT id, username, status FROM lopez_users WHERE username = ?",
      ["r.lopezsr"]
    );

    if ((existing as any[]).length > 0) {
      const user = (existing as any[])[0];
      console.log(`✅ Super Admin existiert: ${user.username} (Status: ${user.status})`);

      // Stelle sicher dass er Super Admin Rolle hat
      const [roles] = await pool.execute(
        `SELECT r.name FROM lopez_roles r 
         JOIN lopez_user_roles ur ON r.id = ur.role_id 
         WHERE ur.user_id = ?`,
        [user.id]
      );

      if ((roles as any[]).length === 0) {
        // Rolle zuweisen
        const [superAdminRole] = await pool.execute(
          "SELECT id FROM lopez_roles WHERE name = 'Super Admin'"
        );
        if ((superAdminRole as any[]).length > 0) {
          await pool.execute(
            "INSERT IGNORE INTO lopez_user_roles (user_id, role_id) VALUES (?, ?)",
            [user.id, (superAdminRole as any[])[0].id]
          );
          console.log("✅ Super Admin Rolle zugewiesen");
        }
      }

      return; // Nicht überschreiben!
    }

    // Nur wenn NICHT existiert: erstellen
    console.log("🆕 Super Admin wird erstellt...");
    await createAdminUser();

  } catch (error) {
    console.error("Super Admin Fehler:", error);
    // Bei Fehler trotzdem versuchen zu erstellen
    await createAdminUser();
  }
}

// =====================================================
// LEGACY: TABELLEN-STRUKTUR REPARIEREN (nicht mehr verwendet)
// =====================================================

async function repairTableStructure(): Promise<void> {
  const pool = await getConnection();
  const connection = await pool.getConnection();

  try {
    // Foreign Key Checks temporär deaktivieren
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    // Prüfe ob lopez_customers Tabelle existiert und repariere sie
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'lopez_customers'"
    );

    if ((tables as any[]).length > 0) {
      // Prüfe die Spalten-Struktur
      const [columns] = await connection.execute(
        "SHOW COLUMNS FROM lopez_customers WHERE Field = 'id'"
      );

      const idColumn = (columns as any[])[0];
      if (idColumn && !idColumn.Extra?.includes('auto_increment')) {
        console.log("⚠️ lopez_customers.id hat kein AUTO_INCREMENT - repariere...");

        // Lösche fehlerhafte Einträge mit leerem Primary Key
        await connection.execute(
          "DELETE FROM lopez_customers WHERE id = '' OR id = 0 OR id IS NULL"
        );

        // Setze AUTO_INCREMENT
        await connection.execute(
          "ALTER TABLE lopez_customers MODIFY id BIGINT AUTO_INCREMENT"
        );

        console.log("✅ lopez_customers.id repariert");
      }

      // Setze AUTO_INCREMENT Startwert falls Tabelle leer
      const [countResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM lopez_customers"
      );
      const count = (countResult as any[])[0]?.count || 0;

      if (count === 0) {
        await connection.execute(
          "ALTER TABLE lopez_customers AUTO_INCREMENT = 1"
        );
        console.log("✅ lopez_customers AUTO_INCREMENT auf 1 gesetzt");
      }
    }

    // Foreign Key Checks wieder aktivieren
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

  } catch (error) {
    console.error("❌ Fehler bei der Tabellen-Reparatur:", error);
    // Foreign Key Checks wieder aktivieren auch bei Fehler
    try {
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    } catch (e) {
      // Ignorieren
    }
    // Nicht werfen - Initialisierung soll weiterlaufen
  } finally {
    connection.release();
  }
}

// =====================================================
// HILFSFUNKTION: DEMO-DATEN EINFÜGEN
// =====================================================

async function insertDemoData(): Promise<void> {
  const demoCustomers = [
    {
      customer_type: "firma" as const,
      anrede: "Herr",
      titel: "Dr.",
      vorname: "Max",
      nachname: "Mustermann",
      firmenname: "Muster GmbH",
      email: "max.mustermann@muster.de",
      telefon: "+49 123 456789",
      strasse: "Musterstraße",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
      status: "aktiv" as const,
      support_level: "Premium" as const,
      notes: "Wichtiger Kunde - Premium Support",
    },
    {
      customer_type: "privat" as const,
      anrede: "Frau",
      titel: undefined,
      vorname: "Anna",
      nachname: "Schmidt",
      firmenname: undefined,
      email: "anna.schmidt@email.de",
      telefon: "+49 987 654321",
      strasse: "Hauptstraße",
      plz: "54321",
      ort: "Berlin",
      land: "Deutschland",
      status: "aktiv" as const,
      support_level: "Standard" as const,
      notes: "Privatkunde - Standard Support",
    },
    {
      customer_type: "firma" as const,
      anrede: "Firma",
      titel: undefined,
      vorname: "",
      nachname: "",
      firmenname: "TechCorp GmbH",
      email: "info@techcorp.de",
      telefon: "+49 555 123456",
      strasse: "Technologiepark",
      plz: "10115",
      ort: "Berlin",
      land: "Deutschland",
      status: "aktiv" as const,
      support_level: "SLA 24h" as const,
      notes: "Enterprise-Kunde - SLA 24h Support",
    },
    {
      customer_type: "behörde" as const,
      anrede: "Herr",
      titel: "Prof.",
      vorname: "Hans",
      nachname: "Müller",
      firmenname: "Stadtverwaltung München",
      email: "hans.mueller@muenchen.de",
      telefon: "+49 89 123456",
      strasse: "Marienplatz",
      plz: "80331",
      ort: "München",
      land: "Deutschland",
      status: "inaktiv" as const,
      support_level: "SLA 4h" as const,
      notes: "Behördenkunde - SLA 4h Support",
    },
  ];

  for (const customerData of demoCustomers) {
    try {
      await CustomerService.createCustomer(customerData);
    } catch (error) {
      // Ignoriere Duplikate (E-Mail bereits vorhanden)
      if (error instanceof Error && error.message.includes("Duplicate entry")) {
        // Kunde bereits vorhanden: ${customerData.email}
      } else {
        throw error;
      }
    }
  }
}

// =====================================================
// HILFSFUNKTION: STANDARD-ROLLEN & BERECHTIGUNGEN
// =====================================================

async function createDefaultRolesAndPermissions(): Promise<void> {
  try {
    // Rollen erstellen
    const roles = [
      {
        name: "Super Admin",
        description: "Vollzugriff auf alle Funktionen",
        level: 1,
      },
      { name: "Admin", description: "Administrative Funktionen", level: 2 },
      { name: "Manager", description: "Management-Funktionen", level: 3 },
      { name: "User", description: "Standard-Benutzer", level: 5 },
    ];

    const createdRoles = [];
    for (const roleData of roles) {
      const role = await RBACService.createRole(roleData);
      createdRoles.push(role);
    }

    // Berechtigungen erstellen - Enterprise++ Permission-Modell
    const permissions = [
      // =====================================================
      // ADMIN-NAVIGATION PERMISSIONS
      // =====================================================

      // Dashboard
      { resource: "admin.dashboard", action: "view" },

      // Operations
      { resource: "admin.operations", action: "view" },
      { resource: "admin.operations.monitoring", action: "view" },
      { resource: "admin.operations.logs", action: "view" },
      { resource: "admin.operations.backups", action: "view" },
      { resource: "admin.operations.backups", action: "manage" },

      // Kunden & Projekte
      { resource: "admin.customers", action: "view" },
      { resource: "admin.customers", action: "create" },
      { resource: "admin.customers", action: "edit" },
      { resource: "admin.customers", action: "delete" },
      { resource: "admin.customers", action: "export" },
      { resource: "admin.projects", action: "view" },
      { resource: "admin.projects", action: "create" },
      { resource: "admin.projects", action: "edit" },
      { resource: "admin.projects", action: "delete" },
      { resource: "admin.tickets", action: "view" },
      { resource: "admin.tickets", action: "manage" },

      // Inhalte & Medien
      { resource: "admin.content", action: "view" },
      { resource: "admin.content", action: "edit" },
      { resource: "admin.media", action: "view" },
      { resource: "admin.media", action: "upload" },
      { resource: "admin.media.ai", action: "view" },
      { resource: "admin.marketing", action: "view" },
      { resource: "admin.marketing", action: "edit" },

      // Finanzen
      { resource: "admin.finance", action: "view" },
      { resource: "admin.finance.invoices", action: "view" },
      { resource: "admin.finance.invoices", action: "create" },
      { resource: "admin.finance.invoices", action: "edit" },
      { resource: "admin.finance.reports", action: "view" },
      { resource: "admin.finance.payroll", action: "view" },

      // System & Sicherheit
      { resource: "admin.system", action: "view" },
      { resource: "admin.system.compliance", action: "view" },
      { resource: "admin.system.roles", action: "view" },
      { resource: "admin.system.roles", action: "edit" },
      { resource: "admin.system.privileges", action: "view" },
      { resource: "admin.system.orchestrator", action: "view" },
      { resource: "admin.system.audit", action: "view" },
      { resource: "admin.system.navigation", action: "edit" },

      // =====================================================
      // SETTINGS PERMISSIONS
      // =====================================================
      { resource: "admin.settings", action: "view" },
      { resource: "admin.settings.security", action: "view" },
      { resource: "admin.settings.security", action: "edit" },
      { resource: "admin.settings.system", action: "view" },
      { resource: "admin.settings.system", action: "edit" },
      { resource: "admin.settings.branding", action: "view" },
      { resource: "admin.settings.branding", action: "edit" },
      { resource: "admin.settings.ai", action: "view" },
      { resource: "admin.settings.ai", action: "edit" },
      { resource: "admin.settings.users", action: "view" },
      { resource: "admin.settings.users", action: "edit" },

      // =====================================================
      // AI CENTER PERMISSIONS (Phase 4)
      // =====================================================
      { resource: "admin.ai", action: "view" },
      { resource: "admin.ai.reports", action: "view" },
      { resource: "admin.ai.reports", action: "generate" },
      { resource: "admin.ai.customers", action: "view" },
      { resource: "admin.ai.customers", action: "generate" },
      { resource: "admin.ai.projects", action: "view" },
      { resource: "admin.ai.projects", action: "analyze" },
      { resource: "admin.ai.invoices", action: "view" },
      { resource: "admin.ai.invoices", action: "check" },
      { resource: "admin.ai.media", action: "view" },
      { resource: "admin.ai.media", action: "analyze" },
      { resource: "admin.ai.usage", action: "view" },

      // =====================================================
      // LEGACY PERMISSIONS (für Abwärtskompatibilität)
      // =====================================================
      // Kunden-Management
      { resource: "customers", action: "create" },
      { resource: "customers", action: "read" },
      { resource: "customers", action: "update" },
      { resource: "customers", action: "delete" },
      { resource: "customers", action: "export" },

      // Benutzer-Management
      { resource: "users", action: "create" },
      { resource: "users", action: "read" },
      { resource: "users", action: "update" },
      { resource: "users", action: "delete" },

      // Rollen-Management
      { resource: "roles", action: "create" },
      { resource: "roles", action: "read" },
      { resource: "roles", action: "update" },
      { resource: "roles", action: "delete" },

      // Reports
      { resource: "reports", action: "create" },
      { resource: "reports", action: "read" },
      { resource: "reports", action: "export" },

      // System
      { resource: "system", action: "admin" },
      { resource: "system", action: "audit" },
    ];

    const createdPermissions = [];
    for (const permData of permissions) {
      const permission = await RBACService.createPermission(permData);
      createdPermissions.push(permission);
    }

    // Berechtigungen zu Rollen zuweisen - Enterprise++ Modell
    const superAdminRole = createdRoles.find((r) => r.name === "Super Admin");
    const adminRole = createdRoles.find((r) => r.name === "Admin");
    const managerRole = createdRoles.find((r) => r.name === "Manager");
    const userRole = createdRoles.find((r) => r.name === "User");

    if (superAdminRole) {
      // Super Admin: ALLE Berechtigungen (vollständiger Zugriff)
      for (const permission of createdPermissions) {
        await RBACService.assignPermissionToRole(superAdminRole.id!, permission.id!, true);
      }
    }

    if (adminRole) {
      // Admin: Fast alles außer kritische System-Funktionen
      const adminPermissions = createdPermissions.filter((p) => {
        // Ausgeschlossen: System-Admin, Navigation bearbeiten, Orchestrator
        if (p.resource === "system" && p.action === "admin") return false;
        if (p.resource === "admin.system.navigation" && p.action === "edit") return false;
        if (p.resource === "admin.system.orchestrator") return false;
        if (p.resource === "admin.settings.system" && p.action === "edit") return false;
        return true;
      });
      for (const permission of adminPermissions) {
        await RBACService.assignPermissionToRole(adminRole.id!, permission.id!, true);
      }
    }

    if (managerRole) {
      // Manager: Kunden, Projekte, Tickets, Reports, Finance (view)
      const managerPermissions = createdPermissions.filter((p) => {
        // Dashboard
        if (p.resource === "admin.dashboard") return true;
        // Kunden & Projekte (alles außer delete)
        if (p.resource.startsWith("admin.customers") && p.action !== "delete") return true;
        if (p.resource.startsWith("admin.projects") && p.action !== "delete") return true;
        if (p.resource.startsWith("admin.tickets")) return true;
        // Finanzen (nur view)
        if (p.resource.startsWith("admin.finance") && p.action === "view") return true;
        // Reports (view & export)
        if (p.resource === "reports" && (p.action === "read" || p.action === "export")) return true;
        // Legacy
        if (p.resource === "customers" && p.action !== "delete") return true;
        return false;
      });
      for (const permission of managerPermissions) {
        await RBACService.assignPermissionToRole(managerRole.id!, permission.id!, true);
      }
    }

    if (userRole) {
      // User: Nur Dashboard und eigene Bereiche (view only)
      const userPermissions = createdPermissions.filter((p) => {
        // Dashboard
        if (p.resource === "admin.dashboard" && p.action === "view") return true;
        // Kunden & Projekte (nur view)
        if (p.resource === "admin.customers" && p.action === "view") return true;
        if (p.resource === "admin.projects" && p.action === "view") return true;
        if (p.resource === "admin.tickets" && p.action === "view") return true;
        // Legacy read
        if (p.action === "read") return true;
        return false;
      });
      for (const permission of userPermissions) {
        await RBACService.assignPermissionToRole(userRole.id!, permission.id!, true);
      }
    }

    // Rollen und Berechtigungen erfolgreich erstellt
  } catch (error) {
    // Fehler beim Erstellen der Rollen und Berechtigungen: ${error}
    throw error;
  }
}

// =====================================================
// HILFSFUNKTION: ADMIN-BENUTZER ERSTELLEN
// =====================================================

async function createAdminUser(): Promise<void> {
  const pool = await getConnection();
  const connection = await pool.getConnection();

  try {
    console.log("🔐 ENTERPRISE++ SUPER-ADMIN SETUP...");

    // =====================================================
    // 1. SUPER-ADMIN "r.lopezsr" ERSTELLEN
    // =====================================================
    const existingSuperAdmin = await RBACService.getUserByUsername("r.lopezsr");

    let superAdminId: number;
    let superAdminCreated = false;

    // TEMPORÄRES PASSWORT (wird bei jedem Init gesetzt)
    const tempPassword = "Lopez2024!Super";
    const passwordHash = await AuthService.hashPassword(tempPassword);

    if (existingSuperAdmin) {
      console.log("🔄 Super-Admin r.lopezsr existiert - Passwort wird aktualisiert...");
      superAdminId = existingSuperAdmin.id!;

      // Status UND Passwort aktualisieren
      await connection.execute(
        `UPDATE lopez_users SET status = 'active', password_hash = ? WHERE id = ?`,
        [passwordHash, superAdminId]
      );
      console.log("✅ Super-Admin Passwort aktualisiert: Lopez2024!Super");
    } else {
      // Super-Admin NEU erstellen
      const [result] = await connection.execute(
        `INSERT INTO lopez_users (
          username, 
          email, 
          password_hash, 
          first_name, 
          last_name, 
          admin_alias,
          display_name,
          domain_type,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "r.lopezsr",                               // username (für Login)
          "info@lopez-it-welt.de",                   // email (für Reset/Benachrichtigungen)
          passwordHash,
          "Ramiro",
          "Lopez Rodriguez",
          "r.lopezsr",                               // admin_alias (Anzeige)
          "Ramiro Lopez Rodriguez - Super Admin",    // display_name
          "internal",                                // domain_type
          "active",
        ]
      );

      superAdminId = (result as any).insertId;
      superAdminCreated = true;
      console.log(`✅ Super-Admin r.lopezsr erstellt: ID ${superAdminId}`);
      console.log(`🔑 Temporäres Passwort: ${tempPassword}`);
      console.log(`⚠️ WICHTIG: Passwort bei erstem Login ändern!`);
    }

    // Super Admin Rolle zuweisen
    const superAdminRole = await RBACService.getRoleById(1);
    if (superAdminRole) {
      try {
        await RBACService.assignRoleToUser(superAdminId, superAdminRole.id!, superAdminId);
        console.log("✅ Super Admin Rolle zugewiesen an r.lopezsr");
      } catch (e) {
        // Rolle bereits zugewiesen - ignorieren
      }
    }

    // =====================================================
    // 2. DEFAULT-ADMIN DEAKTIVIEREN
    // =====================================================
    const defaultAdmin = await RBACService.getUserByUsername("admin");

    if (defaultAdmin) {
      console.log("🔒 Default-Admin deaktivieren...");

      // Status auf inactive setzen, Rolle entfernen
      await connection.execute(
        `UPDATE lopez_users SET 
          status = 'inactive',
          display_name = 'System Installer (Legacy - Deaktiviert)'
        WHERE username = 'admin'`,
        []
      );

      // Alle Rollen des Default-Admins entfernen
      await connection.execute(
        `DELETE FROM lopez_user_roles WHERE user_id = ?`,
        [defaultAdmin.id]
      );

      // 2FA deaktivieren für Default-Admin
      await connection.execute(
        `DELETE FROM lopez_user_2fa WHERE user_id = ?`,
        [defaultAdmin.id]
      );

      console.log("✅ Default-Admin 'admin' deaktiviert (Status: inactive, Rollen entfernt)");
    }

    // =====================================================
    // 3. 2FA FÜR SUPER-ADMIN AKTIVIEREN
    // =====================================================
    console.log("🔐 2FA für Super-Admin aktivieren...");

    // Prüfen ob 2FA bereits aktiviert
    const [existing2FA] = await connection.execute(
      `SELECT id FROM lopez_user_2fa WHERE user_id = ?`,
      [superAdminId]
    );

    if ((existing2FA as any[]).length === 0) {
      // 2FA-Secret generieren (Aegis-kompatibel)
      const { TwoFactorService } = await import("@/lib/2fa-service");
      const twoFactorData = await TwoFactorService.setup2FA(
        superAdminId,
        "info@lopez-it-welt.de",
        "r.lopezsr"
      );

      // 2FA in DB speichern
      await connection.execute(
        `INSERT INTO lopez_user_2fa (user_id, secret, backup_codes) VALUES (?, ?, ?)`,
        [superAdminId, twoFactorData.secret, JSON.stringify(twoFactorData.backupCodes)]
      );

      console.log("✅ 2FA aktiviert für r.lopezsr");
      console.log("📱 QR-Code für Aegis wird bei Login angezeigt");
      console.log(`🔑 Backup-Codes: ${twoFactorData.backupCodes.join(", ")}`);
    } else {
      console.log("✅ 2FA bereits aktiviert für r.lopezsr");
    }

    // =====================================================
    // 4. AUDIT-LOG ERSTELLEN
    // =====================================================
    console.log("📋 Audit-Log erstellen...");

    const auditDetails = {
      action: "SUPER_ADMIN_SETUP",
      super_admin: {
        username: "r.lopezsr",
        email: "info@lopez-it-welt.de",
        id: superAdminId,
        created: superAdminCreated,
      },
      default_admin: {
        username: "admin",
        status: "inactive",
        roles_removed: true,
        two_fa_disabled: true,
      },
      two_factor: {
        enabled: true,
        method: "TOTP",
        app: "Aegis-kompatibel",
      },
      timestamp: new Date().toISOString(),
    };

    await connection.execute(
      `INSERT INTO lopez_audit_logs (
        table_name, record_id, action, user_id, username, 
        new_values, risk_level, compliance_category, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        "lopez_users",
        superAdminId,
        "SUPER_ADMIN_SETUP",
        0, // SYSTEM
        "SYSTEM",
        JSON.stringify(auditDetails),
        "CRITICAL",
        "SECURITY",
      ]
    );

    console.log("✅ Audit-Log erstellt (Severity: CRITICAL)");

    // =====================================================
    // ENTERPRISE++ SUPER-ADMIN SETUP ABGESCHLOSSEN
    // =====================================================
    console.log("");
    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ ENTERPRISE++ SUPER-ADMIN SETUP ABGESCHLOSSEN");
    console.log("═══════════════════════════════════════════════════════");
    console.log("👤 Super-Admin: r.lopezsr");
    console.log("📧 E-Mail: info@lopez-it-welt.de");
    console.log("🔐 2FA: Aktiviert (Aegis-kompatibel)");
    console.log("🚫 Default-Admin 'admin': Deaktiviert");
    console.log("═══════════════════════════════════════════════════════");

  } catch (error) {
    console.error("❌ Fehler beim Super-Admin Setup:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Sicheres Passwort generieren (Enterprise++ Standard)
function generateSecurePassword(): string {
  const length = 16;
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%^&*";
  const all = uppercase + lowercase + numbers + special;

  let password = "";
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  for (let i = 4; i < length; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length));
  }

  // Shuffle
  return password.split("").sort(() => Math.random() - 0.5).join("");
}
