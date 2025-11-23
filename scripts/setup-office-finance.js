/**
 * Setup-Script für Office & Finance Management
 * Erstellt alle erforderlichen Tabellen inkl. lopez_customers
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function setupOfficeFinance() {
  let connection = null;

  try {
    console.log("🚀 Starte Setup für Office & Finance Management...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0"); // Temporär deaktivieren

    // 1. Erstelle lopez_customers Tabelle falls nicht vorhanden
    console.log("1️⃣ Prüfe/Erstelle lopez_customers Tabelle...");
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_customers (
          id VARCHAR(36) PRIMARY KEY,
          customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL DEFAULT 'privat',
          anrede ENUM('Herr', 'Frau', 'Divers', 'Mx', 'Keine Angabe') DEFAULT 'Keine Angabe',
          titel VARCHAR(50),
          vorname VARCHAR(100),
          nachname VARCHAR(100),
          company_name VARCHAR(150),
          email VARCHAR(150) NOT NULL UNIQUE,
          phone_mobile VARCHAR(50),
          strasse VARCHAR(150),
          plz VARCHAR(20),
          stadt VARCHAR(100),
          land VARCHAR(100) DEFAULT 'Deutschland',
          status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
          support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          created_by VARCHAR(36) DEFAULT 'system',
          INDEX idx_email (email),
          INDEX idx_status (status),
          INDEX idx_customer_type (customer_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log("✅ lopez_customers Tabelle erstellt/geprüft\n");
    } catch (error) {
      console.error("❌ Fehler beim Erstellen von lopez_customers:", error.message);
      throw error;
    }

    // 2. Erstelle System-Kunde falls nicht vorhanden
    console.log("2️⃣ Prüfe/Erstelle System-Kunde...");
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM lopez_customers WHERE id = 'system' LIMIT 1"
      );
      if (Array.isArray(existing) && existing.length === 0) {
        await connection.execute(`
          INSERT INTO lopez_customers 
          (id, customer_type, company_name, email, status, created_by)
          VALUES ('system', 'firma', 'System', 'system@lopez-it-welt.de', 'aktiv', 'system')
        `);
        console.log("✅ System-Kunde erstellt\n");
      } else {
        console.log("✅ System-Kunde existiert bereits\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Erstellen des System-Kunden:", error.message);
      // Nicht kritisch, weiter machen
    }

    // 3. Lade und führe office_finance_schema.sql aus
    console.log("3️⃣ Lade office_finance_schema.sql...");
    const schemaPath = path.join(__dirname, "..", "database", "office_finance_schema.sql");
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema-Datei nicht gefunden: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf8");
    
    // Entferne USE-Anweisung (wir sind bereits in der richtigen DB)
    const sqlStatements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.toUpperCase().startsWith("USE "));

    console.log(`✅ Schema geladen (${sqlStatements.length} Statements)\n`);

    // 4. Führe alle SQL-Statements aus
    console.log("4️⃣ Führe Office & Finance Schema aus...");
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (!statement) continue;

      try {
        await connection.execute(statement);
        successCount++;
      } catch (error) {
        // Ignoriere "Table already exists" Fehler
        if (!error.message.includes("already exists")) {
          console.error(`⚠️ Fehler bei Statement ${i + 1}:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      }
    }

    await connection.execute("SET FOREIGN_KEY_CHECKS = 1"); // Wieder aktivieren

    console.log(`✅ Schema ausgeführt: ${successCount} erfolgreich, ${errorCount} Fehler\n`);

    // 5. Validiere Tabellen
    console.log("5️⃣ Validiere erstellte Tabellen...");
    const requiredTables = [
      "lopez_customers",
      "lopez_projects",
      "lopez_orders",
      "lopez_tasks",
      "lopez_appointments",
      "lopez_invoices",
      "lopez_invoice_items",
      "lopez_audit_logs",
    ];

    for (const tableName of requiredTables) {
      try {
        const [tables] = await connection.execute(
          `SHOW TABLES LIKE '${tableName}'`
        );
        if (Array.isArray(tables) && tables.length > 0) {
          console.log(`  ✅ ${tableName}`);
        } else {
          console.log(`  ❌ ${tableName} fehlt!`);
        }
      } catch (error) {
        console.log(`  ⚠️ ${tableName} - Fehler beim Prüfen`);
      }
    }

    console.log("\n✅ Setup abgeschlossen!");
    console.log("\n📝 Nächste Schritte:");
    console.log("   - Prüfe die Konsole auf Fehler");
    console.log("   - Teste die API-Route /api/invoices");

  } catch (error) {
    console.error("\n❌ Fataler Fehler:", error.message);
    console.error(error.stack);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupOfficeFinance();


 * Setup-Script für Office & Finance Management
 * Erstellt alle erforderlichen Tabellen inkl. lopez_customers
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function setupOfficeFinance() {
  let connection = null;

  try {
    console.log("🚀 Starte Setup für Office & Finance Management...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0"); // Temporär deaktivieren

    // 1. Erstelle lopez_customers Tabelle falls nicht vorhanden
    console.log("1️⃣ Prüfe/Erstelle lopez_customers Tabelle...");
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_customers (
          id VARCHAR(36) PRIMARY KEY,
          customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL DEFAULT 'privat',
          anrede ENUM('Herr', 'Frau', 'Divers', 'Mx', 'Keine Angabe') DEFAULT 'Keine Angabe',
          titel VARCHAR(50),
          vorname VARCHAR(100),
          nachname VARCHAR(100),
          company_name VARCHAR(150),
          email VARCHAR(150) NOT NULL UNIQUE,
          phone_mobile VARCHAR(50),
          strasse VARCHAR(150),
          plz VARCHAR(20),
          stadt VARCHAR(100),
          land VARCHAR(100) DEFAULT 'Deutschland',
          status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
          support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          created_by VARCHAR(36) DEFAULT 'system',
          INDEX idx_email (email),
          INDEX idx_status (status),
          INDEX idx_customer_type (customer_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log("✅ lopez_customers Tabelle erstellt/geprüft\n");
    } catch (error) {
      console.error("❌ Fehler beim Erstellen von lopez_customers:", error.message);
      throw error;
    }

    // 2. Erstelle System-Kunde falls nicht vorhanden
    console.log("2️⃣ Prüfe/Erstelle System-Kunde...");
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM lopez_customers WHERE id = 'system' LIMIT 1"
      );
      if (Array.isArray(existing) && existing.length === 0) {
        await connection.execute(`
          INSERT INTO lopez_customers 
          (id, customer_type, company_name, email, status, created_by)
          VALUES ('system', 'firma', 'System', 'system@lopez-it-welt.de', 'aktiv', 'system')
        `);
        console.log("✅ System-Kunde erstellt\n");
      } else {
        console.log("✅ System-Kunde existiert bereits\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Erstellen des System-Kunden:", error.message);
      // Nicht kritisch, weiter machen
    }

    // 3. Lade und führe office_finance_schema.sql aus
    console.log("3️⃣ Lade office_finance_schema.sql...");
    const schemaPath = path.join(__dirname, "..", "database", "office_finance_schema.sql");
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema-Datei nicht gefunden: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf8");
    
    // Entferne USE-Anweisung (wir sind bereits in der richtigen DB)
    const sqlStatements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.toUpperCase().startsWith("USE "));

    console.log(`✅ Schema geladen (${sqlStatements.length} Statements)\n`);

    // 4. Führe alle SQL-Statements aus
    console.log("4️⃣ Führe Office & Finance Schema aus...");
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (!statement) continue;

      try {
        await connection.execute(statement);
        successCount++;
      } catch (error) {
        // Ignoriere "Table already exists" Fehler
        if (!error.message.includes("already exists")) {
          console.error(`⚠️ Fehler bei Statement ${i + 1}:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      }
    }

    await connection.execute("SET FOREIGN_KEY_CHECKS = 1"); // Wieder aktivieren

    console.log(`✅ Schema ausgeführt: ${successCount} erfolgreich, ${errorCount} Fehler\n`);

    // 5. Validiere Tabellen
    console.log("5️⃣ Validiere erstellte Tabellen...");
    const requiredTables = [
      "lopez_customers",
      "lopez_projects",
      "lopez_orders",
      "lopez_tasks",
      "lopez_appointments",
      "lopez_invoices",
      "lopez_invoice_items",
      "lopez_audit_logs",
    ];

    for (const tableName of requiredTables) {
      try {
        const [tables] = await connection.execute(
          `SHOW TABLES LIKE '${tableName}'`
        );
        if (Array.isArray(tables) && tables.length > 0) {
          console.log(`  ✅ ${tableName}`);
        } else {
          console.log(`  ❌ ${tableName} fehlt!`);
        }
      } catch (error) {
        console.log(`  ⚠️ ${tableName} - Fehler beim Prüfen`);
      }
    }

    console.log("\n✅ Setup abgeschlossen!");
    console.log("\n📝 Nächste Schritte:");
    console.log("   - Prüfe die Konsole auf Fehler");
    console.log("   - Teste die API-Route /api/invoices");

  } catch (error) {
    console.error("\n❌ Fataler Fehler:", error.message);
    console.error(error.stack);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupOfficeFinance();



















