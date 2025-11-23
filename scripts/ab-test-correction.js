/**
 * KORREKTUR - A/B-TESTING & HERO CONTENT
 * Datum: 2025-10-31 14:24:09
 * Zweck: Platzhalter entfernen, Standard-Texte wiederherstellen
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

async function runCorrection() {
  let connection;
  const log = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    results: {},
  };

  try {
    console.log("🔧 Starte Korrektur...\n");

    // Verbindung herstellen
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // 1. Standard-Texte bei ID=1 korrekt setzen
    console.log("1️⃣ Setze Standard-Texte bei ID=1...");
    const [updateResult] = await connection.execute(`
            UPDATE content_hero
            SET
              title        = 'Lopez IT Welt',
              subtitle     = 'Professionelle IT-Lösungen',
              description  = 'Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.',
              button_text  = 'Jetzt beraten lassen',
              button_link  = '/kontakt',
              updated_at   = CURRENT_TIMESTAMP
            WHERE id = 1
        `);
    log.steps.push("Standard-Texte bei ID=1 gesetzt");
    log.results.update1 = {
      affectedRows: updateResult.affectedRows,
      changedRows: updateResult.changedRows,
    };
    console.log(
      `   ✅ Aktualisiert: ${updateResult.affectedRows} Zeilen (${updateResult.changedRows} geändert)`,
    );

    // 2. Platzhalter löschen
    console.log("\n2️⃣ Lösche Platzhalter (ID 2, 3)...");
    const [deleteResult] = await connection.execute(`
            DELETE FROM content_hero WHERE id IN (2, 3)
        `);
    log.steps.push("Platzhalter ID 2, 3 gelöscht");
    log.results.delete = {
      affectedRows: deleteResult.affectedRows,
    };
    console.log(`   ✅ Gelöscht: ${deleteResult.affectedRows} Zeilen`);

    // 3. Überprüfung: Zeige aktualisierte Einträge
    console.log("\n3️⃣ Überprüfung: Aktuelle Einträge...");
    const [verifyRows] = await connection.execute(`
            SELECT 
                id,
                title,
                subtitle,
                description,
                button_text,
                button_link,
                is_active,
                updated_at
            FROM content_hero
            ORDER BY id
        `);
    log.results.finalState = verifyRows;
    console.log(`   Gefunden: ${verifyRows.length} Einträge`);
    verifyRows.forEach((row) => {
      console.log(
        `   - ID ${row.id}: "${row.title}" → "${row.subtitle}" (aktiv: ${row.is_active})`,
      );
      console.log(`     Button: "${row.button_text}" → ${row.button_link}`);
    });

    // UTF-8 Validierung
    console.log("\n4️⃣ UTF-8 Validierung...");
    let hasUTF8Issues = false;
    verifyRows.forEach((row) => {
      if (
        row.title?.includes("?") ||
        row.subtitle?.includes("?") ||
        row.description?.includes("?") ||
        row.button_text?.includes("?")
      ) {
        hasUTF8Issues = true;
        console.log(`   ⚠️  UTF-8 Problem in ID ${row.id}: ${row.title}`);
      }
    });
    if (!hasUTF8Issues) {
      console.log("   ✅ Keine UTF-8 Probleme gefunden");
    }

    await connection.end();

    // Log speichern
    const logPath = path.join(__dirname, "ab-test-correction-log.json");
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");
    console.log(`\n✅ Korrektur-Log gespeichert: ${logPath}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ KORREKTUR ABGESCHLOSSEN");
    console.log("=".repeat(60));
    console.log(`Zeitstempel: ${log.timestamp}`);
    console.log(`Schritte: ${log.steps.length}`);
    console.log(`Verbleibende Einträge: ${verifyRows.length}`);
    console.log(`UTF-8 Probleme: ${hasUTF8Issues ? "Ja" : "Nein"}`);

    return log;
  } catch (error) {
    console.error("\n❌ FEHLER bei der Korrektur:", error);
    log.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    // Fehler auch speichern
    const logPath = path.join(__dirname, "ab-test-correction-log.json");
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");

    throw error;
  }
}

// Skript ausführen
if (require.main === module) {
  runCorrection()
    .then(() => {
      console.log("\n✅ Korrektur erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Korrektur fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { runCorrection };
