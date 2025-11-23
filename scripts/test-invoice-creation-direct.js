/**
 * Direkter Test der Invoice-Erstellung mit Datenbankverbindung
 * Umgeht Next.js komplett
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

async function testInvoiceCreation() {
  let connection = null;

  try {
    console.log("🔌 Verbinde mit Datenbank...");
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung erfolgreich");

    // Prüfe ob Tabellen existieren
    console.log("\n📋 Prüfe Tabellen...");
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'lopez_%'"
    );
    console.log("✅ Gefundene Tabellen:", tables.map(t => Object.values(t)[0]));

    // Prüfe ob Kunden existieren
    console.log("\n👥 Prüfe Kunden...");
    const [customers] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
    if (Array.isArray(customers) && customers.length > 0) {
      const customerId = String(customers[0].id);
      console.log("✅ Kunde gefunden:", customerId);

      // Test-Rechnung erstellen
      console.log("\n📝 Erstelle Test-Rechnung...");
      const year = new Date().getFullYear();
      const invoiceNumber = `${year}-0001`;
      
      const netAmount = 100.0;
      const taxAmount = netAmount * 0.19;
      const grossAmount = netAmount + taxAmount;

      const [result] = await connection.execute(
        `INSERT INTO lopez_invoices 
         (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'system')`,
        [
          invoiceNumber,
          customerId,
          new Date().toISOString().slice(0, 10),
          new Date().toISOString().slice(0, 10),
          netAmount,
          19.0,
          taxAmount,
          grossAmount,
        ],
      );

      const invoiceId = result.insertId;
      console.log("✅ Rechnung erstellt:", invoiceId, invoiceNumber);

      // Position einfügen
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, "Test-Position", netAmount, netAmount],
        );
        console.log("✅ Position eingefügt");
      } catch (e) {
        console.error("⚠️ Fehler beim Einfügen der Position:", e.message);
      }

      // Test-Rechnung wieder löschen
      console.log("\n🗑️ Lösche Test-Rechnung...");
      await connection.execute("DELETE FROM lopez_invoice_items WHERE invoice_id = ?", [invoiceId]);
      await connection.execute("DELETE FROM lopez_invoices WHERE id = ?", [invoiceId]);
      console.log("✅ Test-Rechnung gelöscht");

      console.log("\n✅ ALLE TESTS ERFOLGREICH!");
    } else {
      console.error("❌ Keine Kunden in der Datenbank gefunden");
    }
  } catch (error) {
    console.error("❌ Fehler:", error.message);
    console.error("❌ Code:", error.code);
    console.error("❌ Stack:", error.stack);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("\n🔌 Datenbankverbindung geschlossen");
      } catch (e) {
        console.error("Fehler beim Schließen:", e.message);
      }
    }
  }
}

testInvoiceCreation();


 * Direkter Test der Invoice-Erstellung mit Datenbankverbindung
 * Umgeht Next.js komplett
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

async function testInvoiceCreation() {
  let connection = null;

  try {
    console.log("🔌 Verbinde mit Datenbank...");
    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung erfolgreich");

    // Prüfe ob Tabellen existieren
    console.log("\n📋 Prüfe Tabellen...");
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'lopez_%'"
    );
    console.log("✅ Gefundene Tabellen:", tables.map(t => Object.values(t)[0]));

    // Prüfe ob Kunden existieren
    console.log("\n👥 Prüfe Kunden...");
    const [customers] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
    if (Array.isArray(customers) && customers.length > 0) {
      const customerId = String(customers[0].id);
      console.log("✅ Kunde gefunden:", customerId);

      // Test-Rechnung erstellen
      console.log("\n📝 Erstelle Test-Rechnung...");
      const year = new Date().getFullYear();
      const invoiceNumber = `${year}-0001`;
      
      const netAmount = 100.0;
      const taxAmount = netAmount * 0.19;
      const grossAmount = netAmount + taxAmount;

      const [result] = await connection.execute(
        `INSERT INTO lopez_invoices 
         (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'system')`,
        [
          invoiceNumber,
          customerId,
          new Date().toISOString().slice(0, 10),
          new Date().toISOString().slice(0, 10),
          netAmount,
          19.0,
          taxAmount,
          grossAmount,
        ],
      );

      const invoiceId = result.insertId;
      console.log("✅ Rechnung erstellt:", invoiceId, invoiceNumber);

      // Position einfügen
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, "Test-Position", netAmount, netAmount],
        );
        console.log("✅ Position eingefügt");
      } catch (e) {
        console.error("⚠️ Fehler beim Einfügen der Position:", e.message);
      }

      // Test-Rechnung wieder löschen
      console.log("\n🗑️ Lösche Test-Rechnung...");
      await connection.execute("DELETE FROM lopez_invoice_items WHERE invoice_id = ?", [invoiceId]);
      await connection.execute("DELETE FROM lopez_invoices WHERE id = ?", [invoiceId]);
      console.log("✅ Test-Rechnung gelöscht");

      console.log("\n✅ ALLE TESTS ERFOLGREICH!");
    } else {
      console.error("❌ Keine Kunden in der Datenbank gefunden");
    }
  } catch (error) {
    console.error("❌ Fehler:", error.message);
    console.error("❌ Code:", error.code);
    console.error("❌ Stack:", error.stack);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("\n🔌 Datenbankverbindung geschlossen");
      } catch (e) {
        console.error("Fehler beim Schließen:", e.message);
      }
    }
  }
}

testInvoiceCreation();



















