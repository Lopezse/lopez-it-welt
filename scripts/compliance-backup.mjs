/**
 * Compliance Backup Script
 * Tägliche Backups der Rechnungen und Audit-Logs (GoBD-konform)
 * 
 * Pfad: D:\Backups\Lopez_IT_Welt\Compliance\
 * Format: YYYY-MM-DD_invoices_backup.sql + YYYY-MM-DD_invoices_backup.sql.sha256
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
 * Backup-Verzeichnis erstellen
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
    console.log(`✅ Backup-Verzeichnis erstellt: ${BACKUP_PATH}`);
  }
}

/**
 * SHA-256-Hash einer Datei berechnen
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return createHash("sha256").update(content).digest("hex");
  } catch (error) {
    console.error(`❌ Fehler beim Hash-Berechnen von ${filePath}:`, error.message);
    return null;
  }
}

/**
 * SQL-Backup erstellen
 */
async function createSQLBackup(connection, tableName, outputPath) {
  try {
    // Alle Zeilen aus Tabelle lesen
    const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
    
    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`⚠️ Tabelle ${tableName} ist leer`);
      return false;
    }

    // SQL-Statements generieren
    let sql = `-- Backup von ${tableName}\n`;
    sql += `-- Erstellt: ${new Date().toISOString()}\n`;
    sql += `-- Anzahl Zeilen: ${rows.length}\n\n`;
    sql += `SET NAMES utf8mb4;\n`;
    sql += `SET CHARACTER SET utf8mb4;\n\n`;

    // DELETE + INSERT Statements
    sql += `DELETE FROM ${tableName};\n\n`;
    
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "NULL";
        }
        if (typeof value === "string") {
          return `'${value.replace(/'/g, "''")}'`;
        }
        if (typeof value === "object") {
          return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        }
        return value;
      });
      
      sql += `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});\n`;
    }

    // SQL-Datei schreiben
    fs.writeFileSync(outputPath, sql, "utf8");
    
    console.log(`✅ Backup erstellt: ${outputPath} (${rows.length} Zeilen)`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Backup von ${tableName}:`, error.message);
    return false;
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log("🔒 Compliance Backup gestartet...\n");

  // Backup-Verzeichnis erstellen
  ensureBackupDir();

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

  // Datum für Dateinamen
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    // 1. Rechnungen backup
    const invoicesBackupPath = path.join(BACKUP_PATH, `${dateStr}_invoices_backup.sql`);
    const invoicesBackupSuccess = await createSQLBackup(
      connection,
      "lopez_invoices",
      invoicesBackupPath,
    );

    // 2. Rechnungspositionen backup
    const itemsBackupPath = path.join(BACKUP_PATH, `${dateStr}_invoice_items_backup.sql`);
    const itemsBackupSuccess = await createSQLBackup(
      connection,
      "lopez_invoice_items",
      itemsBackupPath,
    );

    // 3. Audit-Logs backup
    const auditBackupPath = path.join(BACKUP_PATH, `${dateStr}_audit_logs_backup.sql`);
    const auditBackupSuccess = await createSQLBackup(
      connection,
      "lopez_audit_logs",
      auditBackupPath,
    );

    // 4. Hash-Dateien erstellen
    if (invoicesBackupSuccess) {
      const invoicesHash = calculateFileHash(invoicesBackupPath);
      if (invoicesHash) {
        const hashPath = `${invoicesBackupPath}.sha256`;
        fs.writeFileSync(hashPath, invoicesHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    if (itemsBackupSuccess) {
      const itemsHash = calculateFileHash(itemsBackupPath);
      if (itemsHash) {
        const hashPath = `${itemsBackupPath}.sha256`;
        fs.writeFileSync(hashPath, itemsHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    if (auditBackupSuccess) {
      const auditHash = calculateFileHash(auditBackupPath);
      if (auditHash) {
        const hashPath = `${auditBackupPath}.sha256`;
        fs.writeFileSync(hashPath, auditHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    // 5. Zusammenfassung erstellen
    const summaryPath = path.join(BACKUP_PATH, `${dateStr}_backup_summary.json`);
    const summary = {
      date: dateStr,
      timestamp: new Date().toISOString(),
      backups: {
        invoices: invoicesBackupSuccess,
        invoice_items: itemsBackupSuccess,
        audit_logs: auditBackupSuccess,
      },
      path: BACKUP_PATH,
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`✅ Zusammenfassung erstellt: ${summaryPath}\n`);

    console.log("✅ Compliance Backup erfolgreich abgeschlossen!");
  } catch (error) {
    console.error("❌ Fehler beim Compliance Backup:", error);
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


 * Compliance Backup Script
 * Tägliche Backups der Rechnungen und Audit-Logs (GoBD-konform)
 * 
 * Pfad: D:\Backups\Lopez_IT_Welt\Compliance\
 * Format: YYYY-MM-DD_invoices_backup.sql + YYYY-MM-DD_invoices_backup.sql.sha256
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
 * Backup-Verzeichnis erstellen
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
    console.log(`✅ Backup-Verzeichnis erstellt: ${BACKUP_PATH}`);
  }
}

/**
 * SHA-256-Hash einer Datei berechnen
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return createHash("sha256").update(content).digest("hex");
  } catch (error) {
    console.error(`❌ Fehler beim Hash-Berechnen von ${filePath}:`, error.message);
    return null;
  }
}

/**
 * SQL-Backup erstellen
 */
async function createSQLBackup(connection, tableName, outputPath) {
  try {
    // Alle Zeilen aus Tabelle lesen
    const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
    
    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`⚠️ Tabelle ${tableName} ist leer`);
      return false;
    }

    // SQL-Statements generieren
    let sql = `-- Backup von ${tableName}\n`;
    sql += `-- Erstellt: ${new Date().toISOString()}\n`;
    sql += `-- Anzahl Zeilen: ${rows.length}\n\n`;
    sql += `SET NAMES utf8mb4;\n`;
    sql += `SET CHARACTER SET utf8mb4;\n\n`;

    // DELETE + INSERT Statements
    sql += `DELETE FROM ${tableName};\n\n`;
    
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "NULL";
        }
        if (typeof value === "string") {
          return `'${value.replace(/'/g, "''")}'`;
        }
        if (typeof value === "object") {
          return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        }
        return value;
      });
      
      sql += `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});\n`;
    }

    // SQL-Datei schreiben
    fs.writeFileSync(outputPath, sql, "utf8");
    
    console.log(`✅ Backup erstellt: ${outputPath} (${rows.length} Zeilen)`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Backup von ${tableName}:`, error.message);
    return false;
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log("🔒 Compliance Backup gestartet...\n");

  // Backup-Verzeichnis erstellen
  ensureBackupDir();

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

  // Datum für Dateinamen
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    // 1. Rechnungen backup
    const invoicesBackupPath = path.join(BACKUP_PATH, `${dateStr}_invoices_backup.sql`);
    const invoicesBackupSuccess = await createSQLBackup(
      connection,
      "lopez_invoices",
      invoicesBackupPath,
    );

    // 2. Rechnungspositionen backup
    const itemsBackupPath = path.join(BACKUP_PATH, `${dateStr}_invoice_items_backup.sql`);
    const itemsBackupSuccess = await createSQLBackup(
      connection,
      "lopez_invoice_items",
      itemsBackupPath,
    );

    // 3. Audit-Logs backup
    const auditBackupPath = path.join(BACKUP_PATH, `${dateStr}_audit_logs_backup.sql`);
    const auditBackupSuccess = await createSQLBackup(
      connection,
      "lopez_audit_logs",
      auditBackupPath,
    );

    // 4. Hash-Dateien erstellen
    if (invoicesBackupSuccess) {
      const invoicesHash = calculateFileHash(invoicesBackupPath);
      if (invoicesHash) {
        const hashPath = `${invoicesBackupPath}.sha256`;
        fs.writeFileSync(hashPath, invoicesHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    if (itemsBackupSuccess) {
      const itemsHash = calculateFileHash(itemsBackupPath);
      if (itemsHash) {
        const hashPath = `${itemsBackupPath}.sha256`;
        fs.writeFileSync(hashPath, itemsHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    if (auditBackupSuccess) {
      const auditHash = calculateFileHash(auditBackupPath);
      if (auditHash) {
        const hashPath = `${auditBackupPath}.sha256`;
        fs.writeFileSync(hashPath, auditHash, "utf8");
        console.log(`✅ Hash-Datei erstellt: ${hashPath}`);
      }
    }

    // 5. Zusammenfassung erstellen
    const summaryPath = path.join(BACKUP_PATH, `${dateStr}_backup_summary.json`);
    const summary = {
      date: dateStr,
      timestamp: new Date().toISOString(),
      backups: {
        invoices: invoicesBackupSuccess,
        invoice_items: itemsBackupSuccess,
        audit_logs: auditBackupSuccess,
      },
      path: BACKUP_PATH,
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`✅ Zusammenfassung erstellt: ${summaryPath}\n`);

    console.log("✅ Compliance Backup erfolgreich abgeschlossen!");
  } catch (error) {
    console.error("❌ Fehler beim Compliance Backup:", error);
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



















