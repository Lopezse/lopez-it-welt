/**
 * READ-ONLY ANALYSE - A/B-TESTING & HERO CONTENT
 * Datum: 2025-10-31 14:24:09
 * Zweck: Platzhalter finden, Zeichensatz prüfen
 * WICHTIG: NUR SELECT-Statements, KEINE Änderungen!
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// MySQL-Verbindungskonfiguration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function runAnalysis() {
  let connection;
  const results = {
    timestamp: new Date().toISOString(),
    database: "lopez_it_welt",
    connection: null,
    characterSets: {},
    collations: {},
    schemas: [],
    tables: [],
    contentHeroColumns: [],
    contentHeroData: [],
    placeholderEntries: [],
    abTestConfig: [],
    heroAbTests: [],
    heroTestStats: [],
    alternativeTables: [],
    errors: [],
  };

  try {
    console.log("🔍 Starte READ-ONLY Analyse...\n");

    // Verbindung herstellen
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // 1. CHARACTER SET VARIABLES prüfen
    console.log("1️⃣ Prüfe Character Set Variablen...");
    const [charVars] = await connection.execute("SHOW VARIABLES LIKE 'character_set_%'");
    charVars.forEach((row) => {
      results.characterSets[row.Variable_name] = row.Value;
    });
    console.log("   Character Sets:", results.characterSets);

    // 2. COLLATION VARIABLES prüfen
    console.log("\n2️⃣ Prüfe Collation Variablen...");
    const [collVars] = await connection.execute("SHOW VARIABLES LIKE 'collation_%'");
    collVars.forEach((row) => {
      results.collations[row.Variable_name] = row.Value;
    });
    console.log("   Collations:", results.collations);

    // 3. SCHEMA-Informationen prüfen
    console.log("\n3️⃣ Prüfe Schema-Informationen...");
    const [schemas] = await connection.execute(`
            SELECT 
                SCHEMA_NAME, 
                DEFAULT_CHARACTER_SET_NAME, 
                DEFAULT_COLLATION_NAME 
            FROM information_schema.SCHEMATA 
            WHERE SCHEMA_NAME IN ('lopez_it_welt', 'lopez_erp')
        `);
    results.schemas = schemas;
    schemas.forEach((schema) => {
      console.log(`   Schema: ${schema.SCHEMA_NAME}`);
      console.log(`   Charset: ${schema.DEFAULT_CHARACTER_SET_NAME}`);
      console.log(`   Collation: ${schema.DEFAULT_COLLATION_NAME}`);
    });

    // 4. TABELLEN-COLLATION prüfen
    console.log("\n4️⃣ Prüfe Tabellen in lopez_it_welt...");
    const [tables] = await connection.execute(`
            SELECT 
                TABLE_NAME, 
                TABLE_COLLATION,
                TABLE_TYPE
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'lopez_it_welt'
            ORDER BY TABLE_NAME
        `);
    results.tables = tables;
    console.log(`   Gefunden: ${tables.length} Tabellen`);
    tables.forEach((table) => {
      console.log(`   - ${table.TABLE_NAME} (${table.TABLE_COLLATION})`);
    });

    // 5. Prüfe ob content_hero existiert
    const contentHeroExists = tables.some((t) => t.TABLE_NAME === "content_hero");

    if (contentHeroExists) {
      // 5a. SPALTEN-Informationen für content_hero prüfen
      console.log("\n5️⃣ Prüfe Spalten in content_hero...");
      const [columns] = await connection.execute(`
                SELECT 
                    COLUMN_NAME,
                    CHARACTER_SET_NAME,
                    COLLATION_NAME,
                    DATA_TYPE,
                    CHARACTER_MAXIMUM_LENGTH
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = 'lopez_it_welt' 
                    AND TABLE_NAME = 'content_hero'
                ORDER BY ORDINAL_POSITION
            `);
      results.contentHeroColumns = columns;
      columns.forEach((col) => {
        console.log(
          `   ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.CHARACTER_SET_NAME || "N/A"}, ${col.COLLATION_NAME || "N/A"})`,
        );
      });

      // 5b. Platzhalter in content_hero suchen
      console.log("\n6️⃣ Suche Platzhalter in content_hero...");
      const [placeholderRows] = await connection.execute(`
                SELECT 
                    id,
                    title,
                    subtitle,
                    description,
                    button_text,
                    button_link,
                    is_active,
                    created_at,
                    updated_at
                FROM content_hero 
                WHERE 
                    title LIKE '%Lösungen Test%' 
                    OR title LIKE '%Test 1%'
                    OR title LIKE '%Test 2%'
                    OR title LIKE '%?%'
                    OR subtitle LIKE '%Lösungen Test%'
                    OR subtitle LIKE '%Test 1%'
                    OR subtitle LIKE '%Test 2%'
                    OR subtitle LIKE '%?%'
                    OR description LIKE '%Lösungen Test%'
                    OR description LIKE '%Test 1%'
                    OR description LIKE '%Test 2%'
                    OR description LIKE '%?%'
                    OR button_text LIKE '%Lösungen Test%'
                    OR button_text LIKE '%Test 1%'
                    OR button_text LIKE '%Test 2%'
                    OR button_text LIKE '%?%'
            `);
      results.placeholderEntries = placeholderRows;
      console.log(`   Gefunden: ${placeholderRows.length} Einträge mit Platzhaltern`);
      placeholderRows.forEach((row) => {
        console.log(`   - ID ${row.id}: "${row.title}" (aktiv: ${row.is_active})`);
      });

      // 5c. ALLE content_hero Einträge
      console.log("\n7️⃣ Alle content_hero Einträge...");
      const [allRows] = await connection.execute(`
                SELECT 
                    id,
                    title,
                    subtitle,
                    description,
                    button_text,
                    button_link,
                    is_active,
                    created_at,
                    updated_at
                FROM content_hero 
                ORDER BY id
            `);
      results.contentHeroData = allRows;
      console.log(`   Gesamt: ${allRows.length} Einträge`);
      allRows.forEach((row) => {
        console.log(
          `   - ID ${row.id}: "${row.title}" → "${row.subtitle}" (aktiv: ${row.is_active})`,
        );
      });
    } else {
      console.log("\n⚠️  Tabelle content_hero existiert nicht!");
      results.errors.push("Tabelle content_hero nicht gefunden");
    }

    // 8. A/B-Test Konfiguration prüfen
    console.log("\n8️⃣ Prüfe A/B-Test Konfiguration...");
    try {
      const [abConfig] = await connection.execute(`
                SELECT 
                    id,
                    test_name,
                    description,
                    is_active,
                    traffic_split,
                    auto_activate_winner,
                    auto_activate_threshold,
                    auto_activate_days,
                    variant_a_id,
                    variant_b_id,
                    created_at,
                    updated_at
                FROM ab_test_config
                ORDER BY id
            `);
      results.abTestConfig = abConfig;
      console.log(`   Gefunden: ${abConfig.length} Konfigurationen`);
      abConfig.forEach((config) => {
        console.log(
          `   - Test "${config.test_name}" (aktiv: ${config.is_active}, Traffic Split: ${config.traffic_split}%)`,
        );
      });
    } catch (err) {
      console.log("   ⚠️  Tabelle ab_test_config existiert nicht");
      results.errors.push("Tabelle ab_test_config nicht gefunden");
    }

    // 9. Hero A/B-Test Varianten prüfen
    console.log("\n9️⃣ Prüfe Hero A/B-Test Varianten...");
    try {
      const [variants] = await connection.execute(`
                SELECT 
                    id,
                    test_id,
                    variant_key,
                    variant_name,
                    weight,
                    is_active,
                    hero_content_id,
                    created_at,
                    updated_at
                FROM hero_ab_tests
                ORDER BY test_id, variant_key
            `);
      results.heroAbTests = variants;
      console.log(`   Gefunden: ${variants.length} Varianten`);
    } catch (err) {
      console.log("   ⚠️  Tabelle hero_ab_tests existiert nicht");
      results.errors.push("Tabelle hero_ab_tests nicht gefunden");
    }

    // 10. Alternative Tabellen prüfen
    console.log("\n🔟 Prüfe alternative Tabellen...");
    const [altTables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'lopez_it_welt' 
                AND (
                    TABLE_NAME LIKE '%text%' 
                    OR TABLE_NAME LIKE '%cms%' 
                    OR TABLE_NAME LIKE '%marketing%'
                    OR TABLE_NAME LIKE '%hero%'
                    OR TABLE_NAME LIKE '%content%'
                )
            ORDER BY TABLE_NAME
        `);
    results.alternativeTables = altTables;
    console.log(`   Gefunden: ${altTables.length} alternative Tabellen`);
    altTables.forEach((table) => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    // 11. A/B-Test Statistiken prüfen
    console.log("\n1️⃣1️⃣ Prüfe A/B-Test Statistiken...");
    try {
      const [stats] = await connection.execute(`
                SELECT 
                    hero_id,
                    variant_name,
                    device_type,
                    impressions,
                    clicks,
                    conversions,
                    ctr,
                    conversion_rate,
                    last_updated
                FROM hero_test_stats
                ORDER BY hero_id, variant_name, device_type
            `);
      results.heroTestStats = stats;
      console.log(`   Gefunden: ${stats.length} Statistik-Einträge`);
    } catch (err) {
      console.log("   ⚠️  Tabelle hero_test_stats existiert nicht");
      results.errors.push("Tabelle hero_test_stats nicht gefunden");
    }

    // Ergebnisse speichern
    const reportPath = path.join(__dirname, "ab-test-analysis-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf8");
    console.log(`\n✅ Analyse-Report gespeichert: ${reportPath}`);

    // Zusammenfassung ausgeben
    console.log("\n" + "=".repeat(60));
    console.log("📊 ZUSAMMENFASSUNG");
    console.log("=".repeat(60));
    console.log(`Datenbank: ${results.database}`);
    console.log(
      `Character Set Database: ${results.characterSets["character_set_database"] || "N/A"}`,
    );
    console.log(`Collation Database: ${results.collations["collation_database"] || "N/A"}`);
    console.log(`Tabellen gefunden: ${results.tables.length}`);
    console.log(`content_hero Einträge: ${results.contentHeroData.length}`);
    console.log(`Platzhalter gefunden: ${results.placeholderEntries.length}`);
    console.log(`A/B-Test Konfigurationen: ${results.abTestConfig.length}`);
    console.log(`Fehler: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\n⚠️  FEHLER:");
      results.errors.forEach((err) => console.log(`   - ${err}`));
    }

    await connection.end();
    return results;
  } catch (error) {
    console.error("\n❌ FEHLER bei der Analyse:", error);
    results.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    // Fehler auch speichern
    const reportPath = path.join(__dirname, "ab-test-analysis-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf8");

    throw error;
  }
}

// Skript ausführen
if (require.main === module) {
  runAnalysis()
    .then(() => {
      console.log("\n✅ Analyse abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Analyse fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { runAnalysis };
