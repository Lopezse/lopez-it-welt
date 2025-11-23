/**
 * KONSOLIDIERUNG: Hero-Section Experiment
 * Datum: 2025-10-31 15:45:00
 * Zweck: Doppelte Einträge entfernen, "Hero-Section" als Standard definieren
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

async function consolidateHeroExperiment() {
  let connection;
  const log = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    results: {},
  };

  try {
    console.log("🔄 Starte Konsolidierung: Hero-Section Experiment...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // 1. Prüfe alle Experimente
    console.log("1️⃣ Prüfe alle Experimente...");
    const [expRows] = await connection.execute(
      'SELECT * FROM ab_experiments WHERE name LIKE "%Hero%" ORDER BY id',
    );
    const experiments = Array.isArray(expRows) ? expRows : [];

    console.log(`   Gefunden: ${experiments.length} Hero-Experimente`);
    experiments.forEach((exp) => {
      console.log(`   - ID ${exp.id}: "${exp.name}" (Status: ${exp.status})`);
    });

    // 2. Finde Standard-Experiment "Hero-Section"
    let heroSectionExp = experiments.find((e) => e.name === "Hero-Section");
    let heroSectionABTest = experiments.find((e) => e.name === "Hero-Section A/B-Test");

    if (!heroSectionExp && heroSectionABTest) {
      // Wenn nur "Hero-Section A/B-Test" existiert, umbenennen
      console.log('\n2️⃣ Benenne "Hero-Section A/B-Test" zu "Hero-Section" um...');
      await connection.execute("UPDATE ab_experiments SET name = ? WHERE id = ?", [
        "Hero-Section",
        heroSectionABTest.id,
      ]);
      heroSectionExp = { ...heroSectionABTest, id: heroSectionABTest.id, name: "Hero-Section" };
      log.steps.push(`Experiment umbenannt: ${heroSectionABTest.id} → "Hero-Section"`);
    }

    if (!heroSectionExp) {
      // Erstelle "Hero-Section" Experiment falls es nicht existiert
      console.log('\n2️⃣ Erstelle "Hero-Section" Experiment...');
      const [result] = await connection.execute(
        `INSERT INTO ab_experiments 
                 (name, description, goal, status, split_a) 
                 VALUES (?, ?, ?, ?, ?)`,
        ["Hero-Section", "A/B-Test für Startseiten-Hero", "Mehr Kontakt-Klicks", "draft", 50],
      );
      heroSectionExp = { id: result.insertId, name: "Hero-Section" };
      log.steps.push(`Experiment erstellt: ${result.insertId} - "Hero-Section"`);
    }

    const heroSectionId = heroSectionExp.id;

    // 3. Lösche doppelte Experimente (außer "Hero-Section")
    console.log("\n3️⃣ Lösche doppelte Experimente...");
    const toDelete = experiments.filter((e) => e.id !== heroSectionId);
    for (const exp of toDelete) {
      console.log(`   - Lösche Experiment ID ${exp.id}: "${exp.name}"`);
      await connection.execute("DELETE FROM ab_experiments WHERE id = ?", [exp.id]);
      log.steps.push(`Experiment gelöscht: ${exp.id} - "${exp.name}"`);
    }

    // 4. Prüfe und aktualisiere Varianten für "Hero-Section"
    console.log('\n4️⃣ Prüfe Varianten für "Hero-Section"...');
    const [variantRows] = await connection.execute(
      "SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key",
      [heroSectionId],
    );
    const variants = Array.isArray(variantRows) ? variantRows : [];

    if (variants.length === 0) {
      // Varianten erstellen
      console.log("   Erstelle Varianten A und B...");

      // Variante A: Lopez IT Welt (Standard)
      await connection.execute(
        `INSERT INTO ab_variants 
                 (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          heroSectionId,
          "A",
          "Lopez IT Welt",
          "Professionelle IT-Lösungen",
          "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
          "Jetzt beraten lassen",
          "/kontakt",
        ],
      );
      console.log('   ✅ Variante A erstellt: "Lopez IT Welt"');

      // Variante B: Individuelle IT-Lösungen
      await connection.execute(
        `INSERT INTO ab_variants 
                 (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          heroSectionId,
          "B",
          "Individuelle IT-Lösungen – persönlich, sicher und barrierefrei",
          "Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.",
          "Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.",
          "Kostenlose Beratung",
          "/kontakt",
        ],
      );
      console.log('   ✅ Variante B erstellt: "Individuelle IT-Lösungen"');
      log.steps.push("Varianten A und B erstellt");
    } else {
      // Varianten aktualisieren
      console.log(`   Gefunden: ${variants.length} Varianten`);

      // Variante A aktualisieren
      const variantA = variants.find((v) => v.variant_key === "A");
      if (variantA) {
        await connection.execute(
          `UPDATE ab_variants 
                     SET title = ?, subtitle = ?, description = ?, button_text = ?, button_link = ?
                     WHERE id = ?`,
          [
            "Lopez IT Welt",
            "Professionelle IT-Lösungen",
            "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
            "Jetzt beraten lassen",
            "/kontakt",
            variantA.id,
          ],
        );
        console.log('   ✅ Variante A aktualisiert: "Lopez IT Welt"');
      }

      // Variante B aktualisieren
      const variantB = variants.find((v) => v.variant_key === "B");
      if (variantB) {
        await connection.execute(
          `UPDATE ab_variants 
                     SET title = ?, subtitle = ?, description = ?, button_text = ?, button_link = ?
                     WHERE id = ?`,
          [
            "Individuelle IT-Lösungen – persönlich, sicher und barrierefrei",
            "Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.",
            "Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.",
            "Kostenlose Beratung",
            "/kontakt",
            variantB.id,
          ],
        );
        console.log('   ✅ Variante B aktualisiert: "Individuelle IT-Lösungen"');
      }
      log.steps.push("Varianten A und B aktualisiert");
    }

    // 5. Finale Prüfung
    console.log("\n🔍 Finale Prüfung...");
    const [finalExp] = await connection.execute("SELECT * FROM ab_experiments WHERE name = ?", [
      "Hero-Section",
    ]);
    const [finalVariants] = await connection.execute(
      "SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key",
      [heroSectionId],
    );

    log.results.experiment = finalExp[0];
    log.results.variants = finalVariants;

    console.log(
      `   ✅ Experiment: "${finalExp[0].name}" (ID: ${finalExp[0].id}, Status: ${finalExp[0].status})`,
    );
    console.log(`   ✅ Varianten: ${finalVariants.length}`);
    finalVariants.forEach((v) => {
      console.log(`     - Variante ${v.variant_key}: "${v.title}"`);
    });

    // Prüfe ob noch andere Hero-Experimente existieren
    const [allHeroExps] = await connection.execute(
      'SELECT * FROM ab_experiments WHERE name LIKE "%Hero%"',
    );
    const remaining = Array.isArray(allHeroExps) ? allHeroExps : [];

    if (remaining.length > 1) {
      console.log(`\n   ⚠️  Noch ${remaining.length - 1} weitere Hero-Experimente gefunden`);
    }

    await connection.end();

    console.log("\n" + "=".repeat(60));
    console.log("✅ KONSOLIDIERUNG ABGESCHLOSSEN");
    console.log("=".repeat(60));
    console.log(`Zeitstempel: ${log.timestamp}`);
    console.log(`Standard-Experiment: "Hero-Section" (ID: ${heroSectionId})`);
    console.log(`Varianten: ${finalVariants.length} (A, B)`);

    return log;
  } catch (error) {
    console.error("\n❌ FEHLER bei Konsolidierung:", error);
    log.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    throw error;
  }
}

if (require.main === module) {
  consolidateHeroExperiment()
    .then(() => {
      console.log("\n✅ Konsolidierung erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Konsolidierung fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { consolidateHeroExperiment };
