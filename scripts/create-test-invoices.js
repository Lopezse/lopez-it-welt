/**
 * Testrechnungen anlegen - Rechnungen v1.0
 * 
 * Erstellt 3 Testrechnungen für die Prüfung des Rechnungsmoduls v1.0
 */

const mysql = require("mysql2/promise");

// Konfiguration (aus .env oder Standard)
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  charset: "utf8mb4",
};

async function createTestInvoices() {
  let connection = null;

  try {
    console.log("🔌 Verbinde mit Datenbank...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Datenbankverbindung erfolgreich");

    // 1. Prüfe ob Kunden vorhanden sind
    console.log("👥 Prüfe vorhandene Kunden...");
    const [customers] = await connection.execute(
      "SELECT id, company_name, vorname, nachname FROM lopez_customers LIMIT 3"
    );

    if (!Array.isArray(customers) || customers.length === 0) {
      console.error("❌ Keine Kunden gefunden. Bitte zuerst Kunden anlegen.");
      return;
    }

    console.log(`✅ ${customers.length} Kunde(n) gefunden`);

    // 2. Testrechnungen anlegen
    const testInvoices = [
      {
        customer: customers[0],
        description: "Testrechnung 1 - Intern (Testkunde A)",
        grossAmount: 119.00,
        issueDate: "2025-11-26",
        serviceDate: "2025-11-01",
      },
      {
        customer: customers[1] || customers[0],
        description: "Testrechnung 2 - Testkunde B",
        grossAmount: 238.00,
        issueDate: "2025-11-26",
        serviceDate: "2025-11-15",
      },
      {
        customer: customers[2] || customers[0],
        description: "Testrechnung 3 - Testkunde C",
        grossAmount: 357.00,
        issueDate: "2025-11-26",
        serviceDate: "2025-11-20",
      },
    ];

    console.log("📝 Erstelle Testrechnungen...");

    for (const testInvoice of testInvoices) {
      // Rechnungsnummer generieren
      const dateStr = testInvoice.issueDate.replace(/-/g, "");
      const [maxRows] = await connection.execute(
        `SELECT MAX(CAST(SUBSTRING(invoice_number, 10) AS UNSIGNED)) as max_num 
         FROM lopez_invoices 
         WHERE invoice_number LIKE ?`,
        [`${dateStr}-%`]
      );

      const maxNum = Array.isArray(maxRows) && maxRows.length > 0 && maxRows[0].max_num ? maxRows[0].max_num : 0;
      const nextNum = maxNum + 1;
      const invoiceNumber = `${dateStr}-${String(nextNum).padStart(3, "0")}`;

      // Werte berechnen
      const netAmount = testInvoice.grossAmount / 1.19;
      const taxAmount = netAmount * 0.19;
      const grossAmount = netAmount + taxAmount;

      // Hash berechnen (vereinfacht)
      const crypto = require("crypto");
      const hashData = JSON.stringify({
        invoice_date: testInvoice.issueDate,
        amount: grossAmount.toFixed(2),
        recipient: testInvoice.customer.id,
        status: "draft",
      });
      const hashSha256 = crypto.createHash("sha256").update(hashData).digest("hex");

      // Rechnung einfügen
      const [result] = await connection.execute(
        `INSERT INTO lopez_invoices 
         (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, hash_sha256, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, 'system')`,
        [
          invoiceNumber,
          testInvoice.customer.id,
          testInvoice.issueDate,
          testInvoice.serviceDate,
          netAmount,
          19.0,
          taxAmount,
          grossAmount,
          hashSha256,
        ]
      );

      const invoiceId = result.insertId;
      console.log(`✅ Rechnung erstellt: ${invoiceNumber} (ID: ${invoiceId})`);

      // Position einfügen
      await connection.execute(
        `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
         VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
        [invoiceId, testInvoice.description, netAmount, netAmount]
      );

      console.log(`   └─ Position eingefügt für ${invoiceNumber}`);
    }

    console.log("\n✅ Alle Testrechnungen erfolgreich angelegt!");
    console.log("\n📋 Zusammenfassung:");
    console.log("   - Testrechnung 1: Intern (Testkunde A)");
    console.log("   - Testrechnung 2: Testkunde B");
    console.log("   - Testrechnung 3: Testkunde C");
    console.log("\n💡 Nächste Schritte:");
    console.log("   1. PDF-Generierung testen: POST /api/invoices/pdf");
    console.log("   2. PDF-Inhalt prüfen (alle Pflichtangaben vorhanden?)");
    console.log("   3. Dokumentation aktualisieren (Testdaten-Status)");

  } catch (error) {
    console.error("❌ Fehler beim Anlegen der Testrechnungen:", error);
    if (error.message) {
      console.error("   Fehlermeldung:", error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n🔌 Datenbankverbindung geschlossen");
    }
  }
}

// Script ausführen
createTestInvoices()
  .then(() => {
    console.log("\n✅ Script erfolgreich abgeschlossen");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script fehlgeschlagen:", error);
    process.exit(1);
  });



