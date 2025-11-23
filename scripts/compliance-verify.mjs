/**
 * Compliance Verify Script
 * Hash-Verifikation für Rechnungen und Backups (GoBD-konform)
 * 
 * Verwendet bestehende SHA-256-Hashes aus:
 * - lopez_invoices.hash_sha256
 * - Backup-Dateien (.sha256)
 */

import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguration
const BACKUP_PATH = "D:\\Backups\\Lopez_IT_Welt\\Compliance";
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  charset: "utf8mb4",
};

/**
 * SHA-256-Hash einer Datei berechnen
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return createHash("sha256").update(content, "utf8").digest("hex");
  } catch (error) {
    console.error(`❌ Fehler beim Hash-Berechnen von ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Rechnungs-Hash aus Datenbankdaten berechnen
 */
function calculateInvoiceHashFromData(invoice) {
  const hashData = {
    invoice_date: invoice.issue_date || invoice.invoice_date || "",
    amount: invoice.gross_amount
      ? parseFloat(invoice.gross_amount).toFixed(2)
      : "0.00",
    recipient: invoice.customer_id || invoice.recipient || "",
    status: invoice.status || "draft",
  };

  const jsonString = JSON.stringify(hashData, Object.keys(hashData).sort());
  return createHash("sha256").update(jsonString, "utf8").digest("hex");
}

/**
 * Verifiziert Rechnungs-Hash in Datenbank
 */
async function verifyInvoiceHashes(connection) {
  console.log("🔍 Verifiziere Rechnungs-Hashes in Datenbank...\n");

  try {
    const [invoices] = await connection.execute(
      `SELECT id, invoice_number, issue_date, gross_amount, customer_id, status, hash_sha256 
       FROM lopez_invoices 
       WHERE hash_sha256 IS NOT NULL`,
    );

    if (!Array.isArray(invoices) || invoices.length === 0) {
      console.log("⚠️ Keine Rechnungen mit Hash gefunden");
      return { total: 0, verified: 0, failed: 0, errors: [] };
    }

    let verified = 0;
    let failed = 0;
    const errors = [];

    for (const invoice of invoices) {
      const calculatedHash = calculateInvoiceHashFromData(invoice);
      const storedHash = invoice.hash_sha256;

      if (calculatedHash === storedHash) {
        verified++;
      } else {
        failed++;
        errors.push({
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          stored_hash: storedHash?.substring(0, 16) + "...",
          calculated_hash: calculatedHash.substring(0, 16) + "...",
        });
        console.error(
          `❌ Hash-Verifikation fehlgeschlagen: ${invoice.invoice_number} (ID: ${invoice.id})`,
        );
      }
    }

    console.log(`✅ Verifiziert: ${verified}/${invoices.length}`);
    if (failed > 0) {
      console.log(`❌ Fehlgeschlagen: ${failed}/${invoices.length}`);
    }
    console.log();

    return { total: invoices.length, verified, failed, errors };
  } catch (error) {
    console.error("❌ Fehler bei Hash-Verifikation:", error.message);
    return { total: 0, verified: 0, failed: 0, errors: [error.message] };
  }
}

/**
 * Verifiziert Backup-Dateien
 */
function verifyBackupFiles() {
  console.log("🔍 Verifiziere Backup-Dateien...\n");

  if (!fs.existsSync(BACKUP_PATH)) {
    console.log(`⚠️ Backup-Verzeichnis existiert nicht: ${BACKUP_PATH}`);
    return { total: 0, verified: 0, failed: 0, errors: [] };
  }

  const files = fs.readdirSync(BACKUP_PATH);
  const sqlFiles = files.filter((f) => f.endsWith("_backup.sql") && !f.endsWith(".sha256"));
  let verified = 0;
  let failed = 0;
  const errors = [];

  for (const sqlFile of sqlFiles) {
    const sqlPath = path.join(BACKUP_PATH, sqlFile);
    const hashPath = `${sqlPath}.sha256`;

    if (!fs.existsSync(hashPath)) {
      console.log(`⚠️ Hash-Datei fehlt: ${hashPath}`);
      failed++;
      errors.push({ file: sqlFile, error: "Hash-Datei fehlt" });
      continue;
    }

    const calculatedHash = calculateFileHash(sqlPath);
    const storedHash = fs.readFileSync(hashPath, "utf8").trim();

    if (calculatedHash === storedHash) {
      verified++;
      console.log(`✅ ${sqlFile}: Hash verifiziert`);
    } else {
      failed++;
      errors.push({
        file: sqlFile,
        stored_hash: storedHash.substring(0, 16) + "...",
        calculated_hash: calculatedHash?.substring(0, 16) + "...",
      });
      console.error(`❌ ${sqlFile}: Hash-Verifikation fehlgeschlagen`);
    }
  }

  console.log(`✅ Verifiziert: ${verified}/${sqlFiles.length}`);
  if (failed > 0) {
    console.log(`❌ Fehlgeschlagen: ${failed}/${sqlFiles.length}`);
  }
  console.log();

  return { total: sqlFiles.length, verified, failed, errors };
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log("🔒 Compliance Hash-Verifikation gestartet...\n");

  // Datenbankverbindung
  let connection = null;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    console.log("✅ Datenbankverbindung erfolgreich\n");
  } catch (error) {
    console.error("❌ Datenbankverbindung fehlgeschlagen:", error.message);
    process.exit(1);
  }

  try {
    // 1. Rechnungs-Hashes verifizieren
    const invoiceResult = await verifyInvoiceHashes(connection);

    // 2. Backup-Dateien verifizieren
    const backupResult = verifyBackupFiles();

    // 3. Zusammenfassung
    const summary = {
      timestamp: new Date().toISOString(),
      invoices: invoiceResult,
      backups: backupResult,
      status:
        invoiceResult.failed === 0 && backupResult.failed === 0
          ? "SUCCESS"
          : "FAILED",
    };

    // 4. Ergebnis ausgeben
    console.log("📊 Zusammenfassung:");
    console.log(`   Rechnungen: ${invoiceResult.verified}/${invoiceResult.total} verifiziert`);
    console.log(`   Backups: ${backupResult.verified}/${backupResult.total} verifiziert`);
    console.log(
      `   Status: ${summary.status === "SUCCESS" ? "✅ ERFOLGREICH" : "❌ FEHLER"}`,
    );

    // 5. Bericht speichern
    const reportPath = path.join(
      BACKUP_PATH,
      `${new Date().toISOString().slice(0, 10)}_verify_report.json`,
    );
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`\n✅ Bericht gespeichert: ${reportPath}\n`);

    if (summary.status === "FAILED") {
      console.error("❌ Hash-Verifikation fehlgeschlagen!");
      if (invoiceResult.errors.length > 0) {
        console.error("   Rechnungs-Fehler:", invoiceResult.errors);
      }
      if (backupResult.errors.length > 0) {
        console.error("   Backup-Fehler:", backupResult.errors);
      }
      process.exit(1);
    } else {
      console.log("✅ Compliance Hash-Verifikation erfolgreich abgeschlossen!");
    }
  } catch (error) {
    console.error("❌ Fehler bei Hash-Verifikation:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Skript ausführen
main().catch((error) => {
  console.error("❌ Unerwarteter Fehler:", error);
  process.exit(1);
});


 * Compliance Verify Script
 * Hash-Verifikation für Rechnungen und Backups (GoBD-konform)
 * 
 * Verwendet bestehende SHA-256-Hashes aus:
 * - lopez_invoices.hash_sha256
 * - Backup-Dateien (.sha256)
 */

import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguration
const BACKUP_PATH = "D:\\Backups\\Lopez_IT_Welt\\Compliance";
const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  charset: "utf8mb4",
};

/**
 * SHA-256-Hash einer Datei berechnen
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return createHash("sha256").update(content, "utf8").digest("hex");
  } catch (error) {
    console.error(`❌ Fehler beim Hash-Berechnen von ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Rechnungs-Hash aus Datenbankdaten berechnen
 */
function calculateInvoiceHashFromData(invoice) {
  const hashData = {
    invoice_date: invoice.issue_date || invoice.invoice_date || "",
    amount: invoice.gross_amount
      ? parseFloat(invoice.gross_amount).toFixed(2)
      : "0.00",
    recipient: invoice.customer_id || invoice.recipient || "",
    status: invoice.status || "draft",
  };

  const jsonString = JSON.stringify(hashData, Object.keys(hashData).sort());
  return createHash("sha256").update(jsonString, "utf8").digest("hex");
}

/**
 * Verifiziert Rechnungs-Hash in Datenbank
 */
async function verifyInvoiceHashes(connection) {
  console.log("🔍 Verifiziere Rechnungs-Hashes in Datenbank...\n");

  try {
    const [invoices] = await connection.execute(
      `SELECT id, invoice_number, issue_date, gross_amount, customer_id, status, hash_sha256 
       FROM lopez_invoices 
       WHERE hash_sha256 IS NOT NULL`,
    );

    if (!Array.isArray(invoices) || invoices.length === 0) {
      console.log("⚠️ Keine Rechnungen mit Hash gefunden");
      return { total: 0, verified: 0, failed: 0, errors: [] };
    }

    let verified = 0;
    let failed = 0;
    const errors = [];

    for (const invoice of invoices) {
      const calculatedHash = calculateInvoiceHashFromData(invoice);
      const storedHash = invoice.hash_sha256;

      if (calculatedHash === storedHash) {
        verified++;
      } else {
        failed++;
        errors.push({
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          stored_hash: storedHash?.substring(0, 16) + "...",
          calculated_hash: calculatedHash.substring(0, 16) + "...",
        });
        console.error(
          `❌ Hash-Verifikation fehlgeschlagen: ${invoice.invoice_number} (ID: ${invoice.id})`,
        );
      }
    }

    console.log(`✅ Verifiziert: ${verified}/${invoices.length}`);
    if (failed > 0) {
      console.log(`❌ Fehlgeschlagen: ${failed}/${invoices.length}`);
    }
    console.log();

    return { total: invoices.length, verified, failed, errors };
  } catch (error) {
    console.error("❌ Fehler bei Hash-Verifikation:", error.message);
    return { total: 0, verified: 0, failed: 0, errors: [error.message] };
  }
}

/**
 * Verifiziert Backup-Dateien
 */
function verifyBackupFiles() {
  console.log("🔍 Verifiziere Backup-Dateien...\n");

  if (!fs.existsSync(BACKUP_PATH)) {
    console.log(`⚠️ Backup-Verzeichnis existiert nicht: ${BACKUP_PATH}`);
    return { total: 0, verified: 0, failed: 0, errors: [] };
  }

  const files = fs.readdirSync(BACKUP_PATH);
  const sqlFiles = files.filter((f) => f.endsWith("_backup.sql") && !f.endsWith(".sha256"));
  let verified = 0;
  let failed = 0;
  const errors = [];

  for (const sqlFile of sqlFiles) {
    const sqlPath = path.join(BACKUP_PATH, sqlFile);
    const hashPath = `${sqlPath}.sha256`;

    if (!fs.existsSync(hashPath)) {
      console.log(`⚠️ Hash-Datei fehlt: ${hashPath}`);
      failed++;
      errors.push({ file: sqlFile, error: "Hash-Datei fehlt" });
      continue;
    }

    const calculatedHash = calculateFileHash(sqlPath);
    const storedHash = fs.readFileSync(hashPath, "utf8").trim();

    if (calculatedHash === storedHash) {
      verified++;
      console.log(`✅ ${sqlFile}: Hash verifiziert`);
    } else {
      failed++;
      errors.push({
        file: sqlFile,
        stored_hash: storedHash.substring(0, 16) + "...",
        calculated_hash: calculatedHash?.substring(0, 16) + "...",
      });
      console.error(`❌ ${sqlFile}: Hash-Verifikation fehlgeschlagen`);
    }
  }

  console.log(`✅ Verifiziert: ${verified}/${sqlFiles.length}`);
  if (failed > 0) {
    console.log(`❌ Fehlgeschlagen: ${failed}/${sqlFiles.length}`);
  }
  console.log();

  return { total: sqlFiles.length, verified, failed, errors };
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log("🔒 Compliance Hash-Verifikation gestartet...\n");

  // Datenbankverbindung
  let connection = null;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    console.log("✅ Datenbankverbindung erfolgreich\n");
  } catch (error) {
    console.error("❌ Datenbankverbindung fehlgeschlagen:", error.message);
    process.exit(1);
  }

  try {
    // 1. Rechnungs-Hashes verifizieren
    const invoiceResult = await verifyInvoiceHashes(connection);

    // 2. Backup-Dateien verifizieren
    const backupResult = verifyBackupFiles();

    // 3. Zusammenfassung
    const summary = {
      timestamp: new Date().toISOString(),
      invoices: invoiceResult,
      backups: backupResult,
      status:
        invoiceResult.failed === 0 && backupResult.failed === 0
          ? "SUCCESS"
          : "FAILED",
    };

    // 4. Ergebnis ausgeben
    console.log("📊 Zusammenfassung:");
    console.log(`   Rechnungen: ${invoiceResult.verified}/${invoiceResult.total} verifiziert`);
    console.log(`   Backups: ${backupResult.verified}/${backupResult.total} verifiziert`);
    console.log(
      `   Status: ${summary.status === "SUCCESS" ? "✅ ERFOLGREICH" : "❌ FEHLER"}`,
    );

    // 5. Bericht speichern
    const reportPath = path.join(
      BACKUP_PATH,
      `${new Date().toISOString().slice(0, 10)}_verify_report.json`,
    );
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`\n✅ Bericht gespeichert: ${reportPath}\n`);

    if (summary.status === "FAILED") {
      console.error("❌ Hash-Verifikation fehlgeschlagen!");
      if (invoiceResult.errors.length > 0) {
        console.error("   Rechnungs-Fehler:", invoiceResult.errors);
      }
      if (backupResult.errors.length > 0) {
        console.error("   Backup-Fehler:", backupResult.errors);
      }
      process.exit(1);
    } else {
      console.log("✅ Compliance Hash-Verifikation erfolgreich abgeschlossen!");
    }
  } catch (error) {
    console.error("❌ Fehler bei Hash-Verifikation:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Skript ausführen
main().catch((error) => {
  console.error("❌ Unerwarteter Fehler:", error);
  process.exit(1);
});



















