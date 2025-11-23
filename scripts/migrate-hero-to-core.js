/**
 * MIGRATION: Hero A/B-Testing → Experimentation Core
 * Datum: 2025-10-31 15:30:00
 * Zweck: Hero-Varianten aus content_hero in ab_experiments/ab_variants migrieren
 */

const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function migrateHeroToCore() {
  let connection;
  const log = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    results: {},
  };

  try {
    console.log("🔄 Starte Hero → Experimentation Core Migration...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // 1. Prüfe content_hero
    console.log("1️⃣ Prüfe content_hero...");
    const [heroRows] = await connection.execute("SELECT * FROM content_hero ORDER BY id");
    const heroEntries = Array.isArray(heroRows) ? heroRows : [];

    console.log(`   Gefunden: ${heroEntries.length} Einträge in content_hero`);
    heroEntries.forEach((entry, idx) => {
      console.log(`   - ID ${entry.id}: ${entry.title || entry.subtitle || "N/A"}`);
    });

    // 2. Prüfe ob "Hero-Section" Experiment bereits existiert
    console.log('\n2️⃣ Prüfe ob Experiment "Hero-Section" existiert...');
    const [expRows] = await connection.execute("SELECT * FROM ab_experiments WHERE name = ?", [
      "Hero-Section",
    ]);

    let experimentId;
    if (Array.isArray(expRows) && expRows.length > 0) {
      experimentId = expRows[0].id;
      console.log(`   ✅ Experiment existiert bereits (ID: ${experimentId})`);
      log.steps.push(`Experiment existiert bereits (ID: ${experimentId})`);
    } else {
      // 3. Erstelle "Hero-Section" Experiment
      console.log('\n3️⃣ Erstelle "Hero-Section" Experiment...');
      const [result] = await connection.execute(
        `INSERT INTO ab_experiments 
                 (name, description, goal, status, split_a) 
                 VALUES (?, ?, ?, ?, ?)`,
        [
          "Hero-Section",
          "A/B-Test für Startseiten-Hero",
          "Mehr Kontakt-Klicks",
          "draft", // Startet als draft, wird später manuell gestartet
          50,
        ],
      );
      experimentId = result.insertId;
      console.log(`   ✅ Experiment erstellt (ID: ${experimentId})`);
      log.steps.push(`Experiment erstellt (ID: ${experimentId})`);
    }

    // 4. Prüfe ob Varianten bereits existieren
    console.log("\n4️⃣ Prüfe ob Varianten bereits existieren...");
    const [variantRows] = await connection.execute(
      "SELECT * FROM ab_variants WHERE experiment_id = ?",
      [experimentId],
    );

    if (Array.isArray(variantRows) && variantRows.length > 0) {
      console.log(`   ✅ Varianten existieren bereits (${variantRows.length} Varianten)`);
      log.steps.push(`Varianten existieren bereits (${variantRows.length})`);

      // Zeige vorhandene Varianten
      variantRows.forEach((v) => {
        console.log(`     - Variante ${v.variant_key}: ${v.title || v.subtitle || "N/A"}`);
      });
    } else {
      // 5. Migriere Hero-Daten als Varianten
      console.log("\n5️⃣ Migriere Hero-Daten als Varianten...");

      // Standard-Hero (ID 1) als Variante A
      if (heroEntries.length > 0) {
        const heroA = heroEntries[0];
        await connection.execute(
          `INSERT INTO ab_variants 
                     (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            experimentId,
            "A",
            heroA.title || "Lopez IT Welt",
            heroA.subtitle || "Professionelle IT-Lösungen",
            heroA.description ||
              "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
            heroA.button_text || "Jetzt beraten lassen",
            heroA.button_link || "/kontakt",
          ],
        );
        console.log(`   ✅ Variante A erstellt: "${heroA.title || heroA.subtitle || "N/A"}"`);
        log.steps.push(`Variante A erstellt: ${heroA.title || heroA.subtitle}`);
      }

      // Falls weitere Hero-Einträge existieren, nutze als Variante B
      if (heroEntries.length > 1) {
        const heroB = heroEntries[1];
        await connection.execute(
          `INSERT INTO ab_variants 
                     (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            experimentId,
            "B",
            heroB.title || "Individuelle IT-Lösungen – persönlich, sicher und barrierefrei",
            heroB.subtitle ||
              "Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.",
            heroB.description ||
              "Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.",
            heroB.button_text || "Kostenlose Beratung",
            heroB.button_link || "/kontakt",
          ],
        );
        console.log(`   ✅ Variante B erstellt: "${heroB.title || heroB.subtitle || "N/A"}"`);
        log.steps.push(`Variante B erstellt: ${heroB.title || heroB.subtitle}`);
      } else {
        // Erstelle Standard-Variante B falls nur eine Hero-Variante existiert
        await connection.execute(
          `INSERT INTO ab_variants 
                     (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            experimentId,
            "B",
            "Individuelle IT-Lösungen – persönlich, sicher und barrierefrei",
            "Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.",
            "Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.",
            "Kostenlose Beratung",
            "/kontakt",
          ],
        );
        console.log(`   ✅ Variante B erstellt (Standard-Text)`);
        log.steps.push(`Variante B erstellt (Standard)`);
      }
    }

    // 6. Stelle sicher, dass ab_config.ab_active=0 (startet manuell im Admin)
    console.log("\n6️⃣ Setze ab_config.ab_active=0 (manuelle Aktivierung)...");
    await connection.execute(
      "UPDATE ab_config SET ab_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
    );
    console.log("   ✅ ab_config.ab_active = 0");
    log.steps.push("ab_config.ab_active = 0 gesetzt");

    // 7. Finale Prüfung
    console.log("\n🔍 Finale Prüfung...");
    const [finalExp] = await connection.execute("SELECT * FROM ab_experiments WHERE id = ?", [
      experimentId,
    ]);
    const [finalVariants] = await connection.execute(
      "SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key",
      [experimentId],
    );
    const [finalConfig] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");

    log.results.experiment = finalExp[0];
    log.results.variants = finalVariants;
    log.results.config = finalConfig[0];

    console.log(`   ✅ Experiment: "${finalExp[0].name}" (Status: ${finalExp[0].status})`);
    console.log(
      `   ✅ Varianten: ${finalVariants.length} (${finalVariants.map((v) => v.variant_key).join(", ")})`,
    );
    console.log(`   ✅ Config: ab_active = ${finalConfig[0].ab_active}`);

    await connection.end();

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRATION ABGESCHLOSSEN");
    console.log("=".repeat(60));
    console.log(`Zeitstempel: ${log.timestamp}`);
    console.log(`Experiment-ID: ${experimentId}`);
    console.log(`Varianten: ${finalVariants.length}`);
    console.log(`ab_active: ${finalConfig[0].ab_active}`);

    return log;
  } catch (error) {
    console.error("\n❌ FEHLER bei Migration:", error);
    log.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    throw error;
  }
}

if (require.main === module) {
  migrateHeroToCore()
    .then(() => {
      console.log("\n✅ Migration erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Migration fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { migrateHeroToCore };
