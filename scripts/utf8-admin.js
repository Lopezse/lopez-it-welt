#!/usr/bin/env node
/**
 * UTF-8 Admin-Skript für MySQL-Datenbank
 * Umgeht Windows PowerShell/Terminal UTF-8 Probleme
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-29
 */

const mysql = require("mysql2/promise");
const readline = require("readline");

// MySQL-Verbindungskonfiguration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
  supportBigNumbers: true,
  bigNumberStrings: true,
};

// Readline Interface für Benutzereingaben
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  encoding: "utf8",
});

/**
 * Hauptfunktion
 */
async function main() {
  console.log("🚀 UTF-8 Admin-Skript gestartet");
  console.log("=====================================");

  try {
    // Datenbankverbindung testen
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Datenbankverbindung erfolgreich");

    // UTF-8 explizit setzen
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    console.log("✅ UTF-8 Encoding aktiviert");

    // Menü anzeigen
    await showMenu(connection);

    await connection.end();
    console.log("✅ Verbindung geschlossen");
  } catch (error) {
    console.error("❌ Fehler:", error.message);
    process.exit(1);
  }
}

/**
 * Hauptmenü anzeigen
 */
async function showMenu(connection) {
  while (true) {
    console.log("\n📋 UTF-8 Admin-Menü:");
    console.log("1. Hero-Daten aktualisieren");
    console.log("2. Header-Daten aktualisieren");
    console.log("3. Footer-Daten aktualisieren");
    console.log("4. Alle Daten anzeigen");
    console.log("5. Test-Umlaute einfügen");
    console.log("0. Beenden");

    const choice = await askQuestion("\nWählen Sie eine Option (0-5): ");

    switch (choice) {
      case "1":
        await updateHeroData(connection);
        break;
      case "2":
        await updateHeaderData(connection);
        break;
      case "3":
        await updateFooterData(connection);
        break;
      case "4":
        await showAllData(connection);
        break;
      case "5":
        await insertTestData(connection);
        break;
      case "0":
        console.log("👋 Auf Wiedersehen!");
        return;
      default:
        console.log("❌ Ungültige Option");
    }
  }
}

/**
 * Hero-Daten aktualisieren
 */
async function updateHeroData(connection) {
  console.log("\n📝 Hero-Daten aktualisieren:");

  const title = await askQuestion("Titel: ");
  const subtitle = await askQuestion("Untertitel: ");
  const description = await askQuestion("Beschreibung: ");
  const buttonText = await askQuestion("Button-Text: ");
  const buttonLink = await askQuestion("Button-Link: ");

  try {
    await connection.execute(
      `UPDATE content_hero SET 
                title = ?, 
                subtitle = ?, 
                description = ?, 
                button_text = ?, 
                button_link = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = 1`,
      [title, subtitle, description, buttonText, buttonLink],
    );

    console.log("✅ Hero-Daten erfolgreich aktualisiert");

    // Aktualisierte Daten anzeigen
    const [rows] = await connection.execute("SELECT * FROM content_hero WHERE id = 1");
    console.log("📊 Aktualisierte Daten:");
    console.log(JSON.stringify(rows[0], null, 2));
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren:", error.message);
  }
}

/**
 * Header-Daten aktualisieren
 */
async function updateHeaderData(connection) {
  console.log("\n📝 Header-Daten aktualisieren:");

  const logoText = await askQuestion("Logo-Text: ");
  const navigationItems = await askQuestion("Navigation (JSON): ");

  try {
    await connection.execute(
      `UPDATE content_header SET 
                logo_text = ?, 
                navigation_items = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = 1`,
      [logoText, navigationItems],
    );

    console.log("✅ Header-Daten erfolgreich aktualisiert");
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren:", error.message);
  }
}

/**
 * Footer-Daten aktualisieren
 */
async function updateFooterData(connection) {
  console.log("\n📝 Footer-Daten aktualisieren:");

  const title = await askQuestion("Titel: ");
  const content = await askQuestion("Inhalt: ");

  try {
    await connection.execute(
      `UPDATE lopez_footer SET 
                title = ?, 
                content = ?
                WHERE id = 'b2d0d6f6-9c97-11f0-aa51-bcaec52625d4'`,
      [title, content],
    );

    console.log("✅ Footer-Daten erfolgreich aktualisiert");
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren:", error.message);
  }
}

/**
 * Alle Daten anzeigen
 */
async function showAllData(connection) {
  console.log("\n📊 Alle Daten anzeigen:");

  try {
    // Hero-Daten
    const [heroRows] = await connection.execute("SELECT * FROM content_hero WHERE id = 1");
    console.log("\n🎯 Hero-Daten:");
    console.log(JSON.stringify(heroRows[0], null, 2));

    // Header-Daten
    const [headerRows] = await connection.execute("SELECT * FROM content_header WHERE id = 1");
    console.log("\n📋 Header-Daten:");
    console.log(JSON.stringify(headerRows[0], null, 2));

    // Footer-Daten
    const [footerRows] = await connection.execute("SELECT * FROM lopez_footer LIMIT 3");
    console.log("\n🦶 Footer-Daten:");
    console.log(JSON.stringify(footerRows, null, 2));
  } catch (error) {
    console.error("❌ Fehler beim Anzeigen:", error.message);
  }
}

/**
 * Test-Umlaute einfügen
 */
async function insertTestData(connection) {
  console.log("\n🧪 Test-Umlaute einfügen:");

  try {
    // Test-Tabelle löschen und neu erstellen
    await connection.execute("DROP TABLE IF EXISTS test_utf8");
    await connection.execute(`
            CREATE TABLE test_utf8 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                txt VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            )
        `);

    // Test-Daten einfügen
    const testData = [
      "Lösungen Test",
      "maßgeschneiderte Software",
      "persönliche Betreuung",
      "für digitale Innovation",
      "ö, ä, ü, ß Test",
    ];

    for (const text of testData) {
      await connection.execute("INSERT INTO test_utf8 (txt) VALUES (?)", [text]);
      console.log(`✅ Eingefügt: ${text}`);
    }

    // Test-Daten anzeigen
    const [rows] = await connection.execute("SELECT * FROM test_utf8");
    console.log("\n📊 Test-Ergebnisse:");
    rows.forEach((row) => {
      console.log(`ID: ${row.id} | Text: ${row.txt}`);
    });
  } catch (error) {
    console.error("❌ Fehler beim Test:", error.message);
  }
}

/**
 * Benutzerfrage stellen
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Skript starten
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, updateHeroData, updateHeaderData, updateFooterData };
