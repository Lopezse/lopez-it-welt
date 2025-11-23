// =====================================================
// DATABASE INITIALIZATION API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Datenbank-Initialisierung für Entwicklung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuthService } from "@/lib/auth-service";
import { CustomerService } from "@/lib/customer-service";
import { initializeDatabase } from "@/lib/database";
import { RBACService } from "@/lib/rbac-system";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Datenbank initialisieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Datenbank-Initialisierung gestartet...

    // Datenbank-Tabellen erstellen
    await initializeDatabase();
    // Datenbank-Tabellen erstellt

    // Demo-Daten einfügen
    await insertDemoData();
    // Demo-Daten eingefügt

    // Standard-Rollen und Berechtigungen erstellen
    await createDefaultRolesAndPermissions();
    // Standard-Rollen und Berechtigungen erstellt

    // Admin-Benutzer erstellen
    await createAdminUser();
    // Admin-Benutzer erstellt

    return NextResponse.json({
      success: true,
      message: "Datenbank erfolgreich initialisiert",
      data: {
        tables: [
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
          "lopez_user_2fa_verifications",
        ],
        demo_customers: 4,
        roles: ["Super Admin", "Admin", "Manager", "User"],
        admin_user: "admin@lopez-it-welt.de",
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
      titel: null,
      vorname: "Anna",
      nachname: "Schmidt",
      firmenname: null,
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
      titel: null,
      vorname: null,
      nachname: null,
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

    // Berechtigungen erstellen
    const permissions = [
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

    // Berechtigungen zu Rollen zuweisen
    const superAdminRole = createdRoles.find((r) => r.name === "Super Admin");
    const adminRole = createdRoles.find((r) => r.name === "Admin");
    const managerRole = createdRoles.find((r) => r.name === "Manager");
    const userRole = createdRoles.find((r) => r.name === "User");

    if (superAdminRole) {
      // Super Admin: Alle Berechtigungen
      for (const permission of createdPermissions) {
        await RBACService.assignPermissionToRole(superAdminRole.id!, permission.id!, true);
      }
    }

    if (adminRole) {
      // Admin: Alle außer System-Admin
      const adminPermissions = createdPermissions.filter(
        (p) => p.resource !== "system" || p.action !== "admin",
      );
      for (const permission of adminPermissions) {
        await RBACService.assignPermissionToRole(adminRole.id!, permission.id!, true);
      }
    }

    if (managerRole) {
      // Manager: Kunden und Reports
      const managerPermissions = createdPermissions.filter(
        (p) => p.resource === "customers" || p.resource === "reports",
      );
      for (const permission of managerPermissions) {
        await RBACService.assignPermissionToRole(managerRole.id!, permission.id!, true);
      }
    }

    if (userRole) {
      // User: Nur Lesen
      const userPermissions = createdPermissions.filter((p) => p.action === "read");
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
  try {
    // Prüfen ob Admin bereits existiert
    const existingAdmin = await RBACService.getUserByEmail("admin@lopez-it-welt.de");
    if (existingAdmin) {
      // Admin-Benutzer bereits vorhanden
      return;
    }

    // Admin-Benutzer erstellen
    const adminUser = await RBACService.createUser({
      username: "admin",
      email: "admin@lopez-it-welt.de",
      password_hash: await AuthService.hashPassword("admin123"),
      first_name: "System",
      last_name: "Administrator",
      status: "active",
    });

    // Super Admin Rolle zuweisen
    const superAdminRole = await RBACService.getRoleById(1); // Erste Rolle = Super Admin
    if (superAdminRole && adminUser) {
      await RBACService.assignRoleToUser(adminUser.id!, superAdminRole.id!, adminUser.id!);
    }

    // Admin-Benutzer erstellt: admin@lopez-it-welt.de / admin123
  } catch (error) {
    // Fehler beim Erstellen des Admin-Benutzers: ${error}
    throw error;
  }
}
