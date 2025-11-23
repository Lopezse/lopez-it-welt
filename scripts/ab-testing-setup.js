/**
 * A/B TESTING CORE - DATENBANK SETUP
 * Datum: 2025-10-31 15:20:48
 * Zweck: Datenbank-Schema erstellen und initialisieren
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

async function setupDatabase() {
  let connection;
  const log = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    results: {},
  };

  try {
    console.log("🔧 Starte A/B-Testing Datenbank-Setup...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // SQL-Datei lesen
    const sqlFile = path.join(__dirname, "..", "database", "ab_testing_core_schema.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    // SQL in einzelne Statements aufteilen
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📋 Führe ${statements.length} SQL-Statements aus...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() === "") continue;

      try {
        await connection.execute(statement);
        log.steps.push(`Statement ${i + 1} erfolgreich`);
        console.log(`   ✅ Statement ${i + 1}/${statements.length} erfolgreich`);
      } catch (error) {
        if (error.code === "ER_TABLE_EXISTS_ERROR" || error.code === "ER_DUP_ENTRY") {
          log.steps.push(`Statement ${i + 1} übersprungen (bereits vorhanden)`);
          console.log(`   ⚠️  Statement ${i + 1} übersprungen (bereits vorhanden)`);
        } else {
          throw error;
        }
      }
    }

    // Überprüfung: Tabellen prüfen
    console.log("\n🔍 Überprüfe erstellte Tabellen...");
    const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'lopez_it_welt' 
                AND TABLE_NAME LIKE 'ab_%'
            ORDER BY TABLE_NAME
        `);

    log.results.tables = tables.map((t) => t.TABLE_NAME);
    console.log(`   Gefunden: ${tables.length} Tabellen`);
    tables.forEach((table) => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    // Konfiguration prüfen
    console.log("\n🔍 Überprüfe Konfiguration...");
    const [config] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");
    if (config.length > 0) {
      log.results.config = config[0];
      console.log(`   ✅ Konfiguration vorhanden (ab_active: ${config[0].ab_active})`);
    }

    // Experimente prüfen
    console.log("\n🔍 Überprüfe Experimente...");
    const [experiments] = await connection.execute("SELECT * FROM ab_experiments");
    log.results.experiments = experiments.length;
    console.log(`   Gefunden: ${experiments.length} Experimente`);

    // Varianten prüfen
    console.log("\n🔍 Überprüfe Varianten...");
    const [variants] = await connection.execute("SELECT * FROM ab_variants");
    log.results.variants = variants.length;
    console.log(`   Gefunden: ${variants.length} Varianten`);

    await connection.end();

    // Log speichern
    const logPath = path.join(__dirname, "ab-testing-setup-log.json");
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");
    console.log(`\n✅ Setup-Log gespeichert: ${logPath}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATENBANK-SETUP ABGESCHLOSSEN");
    console.log("=".repeat(60));
    console.log(`Zeitstempel: ${log.timestamp}`);
    console.log(`Tabellen: ${tables.length}`);
    console.log(`Experimente: ${experiments.length}`);
    console.log(`Varianten: ${variants.length}`);

    return log;
  } catch (error) {
    console.error("\n❌ FEHLER beim Setup:", error);
    log.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    const logPath = path.join(__dirname, "ab-testing-setup-log.json");
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");

    throw error;
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("\n✅ Setup erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Setup fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
