/**
 * Benutzer erstellen: Ramiro Lopez Rodriguez & Ramiro Lopez Mc Lean
 * Erstellt: 2025-11-01
 * Zweck: Initiale Benutzer für Kalender & Zeiterfassung
 */

import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * Enterprise++ Username-Generierung (Lopez IT Welt Standard)
 * 
 * Regeln:
 * - Standard: f.lastname (erster Buchstabe Vorname + Nachname)
 * - Familienmitglieder: f.lastnamesr (Vater/älterer) oder f.lastnamejr (Sohn/jüngerer)
 * - Weitere Lopez (nicht Familie): fa.lastname (zwei Buchstaben Vorname + Nachname)
 * - Doppelnamen: Kurzform ohne Leerzeichen (z.B. r.lopezmclean)
 * - Rollenvarianten: .it, .pm, .fin (optional)
 */
function generateUsername(userData) {
  const { first_name, last_name, family_relation, role_variant } = userData;

  // Erster Buchstabe des Vornamens (lowercase)
  const firstInitial = first_name.charAt(0).toLowerCase();

  // Nachname normalisieren (nur erster Nachname, lowercase, Leerzeichen entfernen)
  // Bei "Lopez Rodriguez" → "lopez", bei "Lopez Mc Lean" → "lopez"
  const firstLastName = last_name.split(/\s+/)[0].toLowerCase();

  let username = "";

  // Spezialfall: "Lopez Mc Lean" → r.mclean
  if (last_name.toLowerCase().includes("mclean") || last_name.toLowerCase().includes("mc lean")) {
    username = "r.mclean";
  }
  // Familienmitglieder
  else if (family_relation === "father" || family_relation === "senior") {
    // Vater/älterer: f.lastnamesr (z.B. r.lopezsr)
    username = `${firstInitial}.${firstLastName}sr`;
  } else if (family_relation === "son" || family_relation === "junior") {
    // Sohn/jüngerer: f.lastnamejr (z.B. r.lopezjr, außer bei "Lopez Mc Lean" → r.mclean)
    username = `${firstInitial}.${firstLastName}jr`;
  }
  // Weitere Lopez (nicht Familie) - zwei Buchstaben Vorname
  else if (family_relation === "other") {
    const firstTwo = first_name.substring(0, 2).toLowerCase();
    username = `${firstTwo}.${firstLastName}`;
  }
  // Standard: f.lastname
  else {
    username = `${firstInitial}.${firstLastName}`;
  }

  // Rollenvarianten (optional: .it, .pm, .fin)
  if (role_variant) {
    username = `${username}.${role_variant}`;
  }

  return username;
}

/**
 * E-Mail-Adresse generieren (Enterprise++ Standard)
 * 
 * Regeln:
 * - <vollername>@lopez-it-welt.de
 * - Alias: <username>@lopez-it-welt.de
 */
function generateEmail(userData, username) {
  // Vollname normalisieren (lowercase, Leerzeichen durch Bindestriche)
  const fullName = `${userData.first_name} ${userData.last_name}`.toLowerCase().replace(/\s+/g, "-");
  return `${fullName}@lopez-it-welt.de`;
}

const users = [
  {
    first_name: "Ramiro",
    last_name: "Lopez Rodriguez",
    family_relation: "father", // Vater/älterer
    role_id: 1, // Owner/Admin
    status: "active",
    description: "Chef - Geschäftsführer und System-Administrator",
    original_username: "r.lopez", // Für Audit-Log
  },
  {
    first_name: "Ramiro",
    last_name: "Lopez Mc Lean",
    family_relation: "son", // Sohn/jüngerer
    role_id: 2, // CTO/Admin
    status: "active",
    description: "CTO - Chief Technology Officer (Sohn)",
    original_username: "r.mclean", // Für Audit-Log
  },
];

async function createUsers() {
  let connection = null;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Datenbankverbindung hergestellt");

    // Prüfe ob Tabelle existiert
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'lopez_core_users'
    `);

    if (tables.length === 0) {
      console.error("❌ Tabelle lopez_core_users existiert nicht!");
      console.log("ℹ️ Bitte erstelle die Tabelle zuerst mit dem Schema.");
      process.exit(1);
    }

    // Prüfe ob Rollen existieren
    const [roles] = await connection.execute(`
      SELECT id, role_name FROM lopez_core_roles ORDER BY id
    `);

    console.log(`📋 Gefundene Rollen: ${roles.length}`);

    if (roles.length === 0) {
      console.log("⚠️ Keine Rollen gefunden. Erstelle Standard-Rollen...");

      try {
        await connection.execute(`
          INSERT INTO lopez_core_roles (role_name, role_code, role_description, is_system_role, is_active, created_by)
          VALUES 
            ('Owner', 'owner', 'System Owner - Vollzugriff', TRUE, TRUE, 'system'),
            ('Admin', 'admin', 'Administrator - Vollzugriff', TRUE, TRUE, 'system'),
            ('Employee', 'employee', 'Mitarbeiter', TRUE, TRUE, 'system')
        `);

        console.log("✅ Standard-Rollen erstellt");

        // Rollen neu laden
        const [newRoles] = await connection.execute(`
          SELECT id, role_name FROM lopez_core_roles ORDER BY id
        `);
        console.log("📋 Neue Rollen:", newRoles.map(r => `${r.role_name} (ID: ${r.id})`));
      } catch (roleError) {
        console.error("❌ Fehler beim Erstellen der Rollen:", roleError.message);
        // Versuche fortzusetzen, falls Tabelle nicht existiert
      }
    } else {
      console.log("📋 Vorhandene Rollen:", roles.map(r => `${r.role_name} (ID: ${r.id})`));
    }

    // Erstelle Benutzer
    for (const userData of users) {
      // Username generieren (Enterprise++ Standard)
      const username = generateUsername(userData);
      const email = generateEmail(userData, username);
      const originalUsername = userData.original_username || username;

      console.log(`\n📝 Erstelle Benutzer:`);
      console.log(`   Original: ${originalUsername}`);
      console.log(`   Generiert: ${username}`);
      console.log(`   E-Mail: ${email}`);

      // Prüfe ob Benutzer bereits existiert
      const [existing] = await connection.execute(
        "SELECT id FROM lopez_core_users WHERE username = ? OR email = ?",
        [username, email],
      );

      if (existing.length > 0) {
        console.log(`⚠️ Benutzer ${username} existiert bereits`);
        continue;
      }

      // Passwort generieren (Standard: "LopezIT2025!")
      const password = process.env.DEFAULT_PASSWORD || "LopezIT2025!";
      const passwordHash = await bcrypt.hash(password, 12);

      // Prüfe ob Rolle existiert
      const [roleCheck] = await connection.execute(
        "SELECT id FROM lopez_core_roles WHERE id = ?",
        [userData.role_id],
      );

      if (roleCheck.length === 0) {
        console.warn(`⚠️ Rolle ID ${userData.role_id} existiert nicht. Verwende erste verfügbare Rolle.`);
        const [firstRole] = await connection.execute(
          "SELECT id FROM lopez_core_roles ORDER BY id LIMIT 1",
        );
        if (firstRole.length > 0) {
          userData.role_id = firstRole[0].id;
          console.log(`✅ Verwende Rolle ID ${userData.role_id}`);
        } else {
          console.error(`❌ Keine Rollen verfügbar für Benutzer ${userData.username}`);
          continue;
        }
      }

      // Benutzer-ID generieren
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Benutzer erstellen
      await connection.execute(
        `INSERT INTO lopez_core_users (
          id, username, email, password_hash, first_name, last_name,
          role_id, status, email_verified, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          username,
          email,
          passwordHash,
          userData.first_name,
          userData.last_name,
          userData.role_id,
          userData.status,
          true,
          "system",
        ],
      );

      // Audit-Log: Username-Erstellung loggen
      try {
        await connection.execute(
          `INSERT INTO lopez_audit_logs (
            table_name, record_id, action, new_values, user_id, username,
            compliance_category, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            "lopez_core_users",
            userId,
            "INSERT",
            JSON.stringify({
              original_username: originalUsername,
              final_username: username,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: email,
            }),
            0, // system user
            "system",
            "AUTHENTICATION",
          ],
        );
      } catch (auditError) {
        // Audit-Log optional - nicht kritisch
        console.warn(`⚠️ Audit-Log konnte nicht erstellt werden: ${auditError.message}`);
      }

      console.log(`✅ Benutzer erstellt: ${username} (${userData.first_name} ${userData.last_name}) - ${userData.description || ""}`);
      console.log(`   📧 E-Mail: ${email}`);
      console.log(`   📝 Original Username: ${originalUsername} → Final Username: ${username}`);
    }

    // Zeige alle Benutzer
    const [allUsers] = await connection.execute(`
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             r.role_name, u.status
      FROM lopez_core_users u
      LEFT JOIN lopez_core_roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);

    console.log("\n📋 Alle Benutzer:");
    console.table(allUsers);

    await connection.end();
    console.log("\n✅ Fertig!");
  } catch (error) {
    console.error("❌ Fehler:", error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createUsers();







