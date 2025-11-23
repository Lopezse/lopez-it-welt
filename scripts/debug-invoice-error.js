/**
 * Debug-Script für Invoice POST Fehler
 * Analysiert mögliche Ursachen für Internal Server Error
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

async function debugInvoiceError() {
  let connection = null;

  try {
    console.log("🔍 Starte Debug-Analyse für Invoice POST Fehler...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");

    // 1. Prüfe ob lopez_customers Tabelle existiert
    console.log("1️⃣ Prüfe ob lopez_customers Tabelle existiert...");
    try {
      const [tables] = await connection.execute(
        "SHOW TABLES LIKE 'lopez_customers'"
      );
      if (Array.isArray(tables) && tables.length > 0) {
        console.log("✅ Tabelle lopez_customers existiert\n");
      } else {
        console.log("❌ Tabelle lopez_customers existiert NICHT!\n");
        return;
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Tabelle:", error.message);
      return;
    }

    // 2. Prüfe Struktur von lopez_customers
    console.log("2️⃣ Prüfe Struktur von lopez_customers...");
    try {
      const [columns] = await connection.execute(
        "DESCRIBE lopez_customers"
      );
      console.log("Spalten in lopez_customers:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key ? `(${col.Key})` : ""}`
        );
      });
      console.log();
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Struktur:", error.message);
    }

    // 3. Prüfe ob Kunden vorhanden sind
    console.log("3️⃣ Prüfe ob Kunden vorhanden sind...");
    try {
      const [customers] = await connection.execute("SELECT COUNT(*) as count FROM lopez_customers");
      const count = Array.isArray(customers) && customers.length > 0 ? customers[0].count : 0;
      console.log(`📊 Anzahl Kunden: ${count}\n`);

      if (count > 0) {
        // Zeige ersten Kunden
        const [firstCustomer] = await connection.execute(
          "SELECT id, email, company_name, vorname, nachname, status FROM lopez_customers LIMIT 1"
        );
        if (Array.isArray(firstCustomer) && firstCustomer.length > 0) {
          console.log("Erster Kunde:");
          console.log(JSON.stringify(firstCustomer[0], null, 2));
          console.log();
        }
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Kunden:", error.message);
    }

    // 4. Prüfe ob lopez_invoices Tabelle existiert
    console.log("4️⃣ Prüfe ob lopez_invoices Tabelle existiert...");
    try {
      const [tables] = await connection.execute(
        "SHOW TABLES LIKE 'lopez_invoices'"
      );
      if (Array.isArray(tables) && tables.length > 0) {
        console.log("✅ Tabelle lopez_invoices existiert\n");
      } else {
        console.log("❌ Tabelle lopez_invoices existiert NICHT!\n");
        return;
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Tabelle:", error.message);
    }

    // 5. Prüfe Struktur von lopez_invoices
    console.log("5️⃣ Prüfe Struktur von lopez_invoices...");
    try {
      const [columns] = await connection.execute("DESCRIBE lopez_invoices");
      console.log("Spalten in lopez_invoices:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key ? `(${col.Key})` : ""}`
        );
      });
      console.log();
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Struktur:", error.message);
    }

    // 6. Test: Versuche eine Test-Rechnung zu erstellen
    console.log("6️⃣ Test: Versuche Test-Rechnung zu erstellen...");
    try {
      // Hole ersten Kunden
      const [customers] = await connection.execute(
        "SELECT id FROM lopez_customers LIMIT 1"
      );
      if (Array.isArray(customers) && customers.length > 0) {
        const customerId = String(customers[0].id);
        const year = new Date().getFullYear();
        const testInvoiceNumber = `${year}-0001`;

        console.log(`  Test mit customer_id: ${customerId}`);
        console.log(`  Test mit invoice_number: ${testInvoiceNumber}`);

        // Test INSERT
        const [result] = await connection.execute(
          `INSERT INTO lopez_invoices 
           (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
           VALUES (?, ?, CURDATE(), CURDATE(), 0, 19.0, 0, 0, 'draft', 'system')`,
          [testInvoiceNumber, customerId]
        );

        const insertId = result.insertId;
        console.log(`✅ Test-Rechnung erfolgreich erstellt (ID: ${insertId})`);

        // Lösche Test-Rechnung wieder
        await connection.execute("DELETE FROM lopez_invoices WHERE id = ?", [insertId]);
        console.log("✅ Test-Rechnung wieder gelöscht\n");
      } else {
        console.log("❌ Kein Kunde vorhanden für Test\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Test-INSERT:", error.message);
      console.error("   Error Code:", error.code);
      console.error("   SQL State:", error.sqlState);
      console.error();
    }

    // 7. Prüfe Foreign Key Constraints
    console.log("7️⃣ Prüfe Foreign Key Constraints...");
    try {
      const [fks] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          TABLE_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = 'lopez_it_welt'
          AND TABLE_NAME = 'lopez_invoices'
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      if (Array.isArray(fks) && fks.length > 0) {
        console.log("Foreign Keys für lopez_invoices:");
        fks.forEach((fk) => {
          console.log(
            `  - ${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
          );
        });
        console.log();
      } else {
        console.log("⚠️ Keine Foreign Keys gefunden\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Foreign Keys:", error.message);
    }

    console.log("✅ Debug-Analyse abgeschlossen");
  } catch (error) {
    console.error("❌ Fataler Fehler:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugInvoiceError();


 * Analysiert mögliche Ursachen für Internal Server Error
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

async function debugInvoiceError() {
  let connection = null;

  try {
    console.log("🔍 Starte Debug-Analyse für Invoice POST Fehler...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");

    // 1. Prüfe ob lopez_customers Tabelle existiert
    console.log("1️⃣ Prüfe ob lopez_customers Tabelle existiert...");
    try {
      const [tables] = await connection.execute(
        "SHOW TABLES LIKE 'lopez_customers'"
      );
      if (Array.isArray(tables) && tables.length > 0) {
        console.log("✅ Tabelle lopez_customers existiert\n");
      } else {
        console.log("❌ Tabelle lopez_customers existiert NICHT!\n");
        return;
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Tabelle:", error.message);
      return;
    }

    // 2. Prüfe Struktur von lopez_customers
    console.log("2️⃣ Prüfe Struktur von lopez_customers...");
    try {
      const [columns] = await connection.execute(
        "DESCRIBE lopez_customers"
      );
      console.log("Spalten in lopez_customers:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key ? `(${col.Key})` : ""}`
        );
      });
      console.log();
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Struktur:", error.message);
    }

    // 3. Prüfe ob Kunden vorhanden sind
    console.log("3️⃣ Prüfe ob Kunden vorhanden sind...");
    try {
      const [customers] = await connection.execute("SELECT COUNT(*) as count FROM lopez_customers");
      const count = Array.isArray(customers) && customers.length > 0 ? customers[0].count : 0;
      console.log(`📊 Anzahl Kunden: ${count}\n`);

      if (count > 0) {
        // Zeige ersten Kunden
        const [firstCustomer] = await connection.execute(
          "SELECT id, email, company_name, vorname, nachname, status FROM lopez_customers LIMIT 1"
        );
        if (Array.isArray(firstCustomer) && firstCustomer.length > 0) {
          console.log("Erster Kunde:");
          console.log(JSON.stringify(firstCustomer[0], null, 2));
          console.log();
        }
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Kunden:", error.message);
    }

    // 4. Prüfe ob lopez_invoices Tabelle existiert
    console.log("4️⃣ Prüfe ob lopez_invoices Tabelle existiert...");
    try {
      const [tables] = await connection.execute(
        "SHOW TABLES LIKE 'lopez_invoices'"
      );
      if (Array.isArray(tables) && tables.length > 0) {
        console.log("✅ Tabelle lopez_invoices existiert\n");
      } else {
        console.log("❌ Tabelle lopez_invoices existiert NICHT!\n");
        return;
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Tabelle:", error.message);
    }

    // 5. Prüfe Struktur von lopez_invoices
    console.log("5️⃣ Prüfe Struktur von lopez_invoices...");
    try {
      const [columns] = await connection.execute("DESCRIBE lopez_invoices");
      console.log("Spalten in lopez_invoices:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key ? `(${col.Key})` : ""}`
        );
      });
      console.log();
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Struktur:", error.message);
    }

    // 6. Test: Versuche eine Test-Rechnung zu erstellen
    console.log("6️⃣ Test: Versuche Test-Rechnung zu erstellen...");
    try {
      // Hole ersten Kunden
      const [customers] = await connection.execute(
        "SELECT id FROM lopez_customers LIMIT 1"
      );
      if (Array.isArray(customers) && customers.length > 0) {
        const customerId = String(customers[0].id);
        const year = new Date().getFullYear();
        const testInvoiceNumber = `${year}-0001`;

        console.log(`  Test mit customer_id: ${customerId}`);
        console.log(`  Test mit invoice_number: ${testInvoiceNumber}`);

        // Test INSERT
        const [result] = await connection.execute(
          `INSERT INTO lopez_invoices 
           (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
           VALUES (?, ?, CURDATE(), CURDATE(), 0, 19.0, 0, 0, 'draft', 'system')`,
          [testInvoiceNumber, customerId]
        );

        const insertId = result.insertId;
        console.log(`✅ Test-Rechnung erfolgreich erstellt (ID: ${insertId})`);

        // Lösche Test-Rechnung wieder
        await connection.execute("DELETE FROM lopez_invoices WHERE id = ?", [insertId]);
        console.log("✅ Test-Rechnung wieder gelöscht\n");
      } else {
        console.log("❌ Kein Kunde vorhanden für Test\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Test-INSERT:", error.message);
      console.error("   Error Code:", error.code);
      console.error("   SQL State:", error.sqlState);
      console.error();
    }

    // 7. Prüfe Foreign Key Constraints
    console.log("7️⃣ Prüfe Foreign Key Constraints...");
    try {
      const [fks] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          TABLE_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = 'lopez_it_welt'
          AND TABLE_NAME = 'lopez_invoices'
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      if (Array.isArray(fks) && fks.length > 0) {
        console.log("Foreign Keys für lopez_invoices:");
        fks.forEach((fk) => {
          console.log(
            `  - ${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
          );
        });
        console.log();
      } else {
        console.log("⚠️ Keine Foreign Keys gefunden\n");
      }
    } catch (error) {
      console.error("❌ Fehler beim Prüfen der Foreign Keys:", error.message);
    }

    console.log("✅ Debug-Analyse abgeschlossen");
  } catch (error) {
    console.error("❌ Fataler Fehler:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugInvoiceError();

