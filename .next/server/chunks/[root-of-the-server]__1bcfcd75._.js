module.exports = [
"[project]/.next-internal/server/app/api/admin/agent-system/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DATABASE CONNECTION - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: MySQL-Datenbankverbindung für Enterprise++ Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "closeConnection",
    ()=>closeConnection,
    "generateKundennummer",
    ()=>generateKundennummer,
    "getConnection",
    ()=>getConnection,
    "initializeDatabase",
    ()=>initializeDatabase,
    "isResultSetHeader",
    ()=>isResultSetHeader,
    "isRowDataPacketArray",
    ()=>isRowDataPacketArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
function isRowDataPacketArray(result) {
    return Array.isArray(result) && result.length > 0 && typeof result[0] === "object" && "constructor" in result[0];
}
function isResultSetHeader(result) {
    return !Array.isArray(result) && typeof result === "object" && result !== null && ("insertId" in result || "affectedRows" in result);
}
// =====================================================
// DATENBANK-KONFIGURATION
// =====================================================
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lopez_it_welt",
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
    queueLimit: 0,
    multipleStatements: false,
    // XAMPP-spezifische Einstellungen
    charset: "utf8mb4",
    timezone: "+00:00"
};
// =====================================================
// CONNECTION POOL
// =====================================================
let pool = null;
let isInitialized = false;
async function getConnection() {
    if (!pool) {
        try {
            // XAMPP: Zuerst ohne Datenbank verbinden, um Datenbank zu erstellen falls nötig
            const tempConfig = {
                ...dbConfig
            };
            delete tempConfig.database;
            const tempPool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(tempConfig);
            const tempConnection = await tempPool.getConnection();
            // Datenbank erstellen falls nicht vorhanden (XAMPP)
            await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            tempConnection.release();
            await tempPool.end();
            // Jetzt mit Datenbank verbinden
            pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
                ...dbConfig,
                charset: "utf8mb4",
                supportBigNumbers: true,
                bigNumberStrings: true
            });
            console.log("✅ MySQL Connection Pool erstellt (XAMPP)");
            // Test-Verbindung
            const connection = await pool.getConnection();
            await connection.execute("SET NAMES utf8mb4");
            console.log("✅ MySQL Verbindung erfolgreich getestet");
            connection.release();
        // KEINE automatische Initialisierung hier - wird manuell über /api/admin/init-database aufgerufen
        } catch (error) {
            console.error("❌ MySQL Verbindungsfehler:", error);
            throw error;
        }
    }
    return pool;
}
async function initializeDatabase() {
    // =====================================================
    // 🛡️ ENTERPRISE++ SICHERHEITSPRÜFUNG
    // =====================================================
    const currentDbName = process.env.DB_NAME || dbConfig.database || "lopez_it_welt";
    const prodDbName = process.env.DB_NAME_PROD || "lopez_it_welt";
    // HARDCODED STOP: Niemals PROD-Datenbank löschen!
    if (currentDbName === prodDbName) {
        console.error("🛑 =====================================================");
        console.error("🛑 ENTERPRISE++ SICHERHEITSSTOPP!");
        console.error("🛑 =====================================================");
        console.error(`❌ DB_NAME (${currentDbName}) ist gleich DB_NAME_PROD (${prodDbName})`);
        console.error("❌ initializeDatabase() darf NICHT auf PROD ausgeführt werden!");
        console.error("");
        console.error("📋 LÖSUNG:");
        console.error("   1. Erstelle eine DEV-Datenbank: lopez_it_welt_dev");
        console.error("   2. Setze in .env: DB_NAME=lopez_it_welt_dev");
        console.error("   3. Dann erneut versuchen.");
        console.error("🛑 =====================================================");
        throw new Error("SICHERHEITSSTOPP: initializeDatabase() wurde blockiert. " + `Datenbank "${currentDbName}" ist als PROD markiert. ` + "Bitte DB_NAME auf eine _dev Datenbank setzen.");
    }
    // Warnung wenn nicht _dev
    if (!currentDbName.endsWith("_dev")) {
        console.warn("⚠️ =====================================================");
        console.warn("⚠️ WARNUNG: Datenbank endet nicht mit '_dev'");
        console.warn("⚠️ =====================================================");
        console.warn(`   Aktuelle DB: ${currentDbName}`);
        console.warn(`   Empfohlen: lopez_it_welt_dev`);
        console.warn("");
        console.warn("   Diese Warnung erscheint, weil die Datenbank");
        console.warn("   nicht dem Enterprise++ DEV-Standard entspricht.");
        console.warn("⚠️ =====================================================");
    }
    console.log(`🔧 initializeDatabase() startet auf: ${currentDbName}`);
    // Pool direkt verwenden (ohne getConnection() um zirkuläre Abhängigkeit zu vermeiden)
    if (!pool) {
        // Zuerst ohne Datenbank verbinden, um Datenbank zu erstellen falls nötig
        const tempConfig = {
            ...dbConfig
        };
        delete tempConfig.database;
        const tempPool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(tempConfig);
        const tempConnection = await tempPool.getConnection();
        // Datenbank erstellen falls nicht vorhanden (XAMPP)
        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        tempConnection.release();
        await tempPool.end();
        // Jetzt mit Datenbank verbinden
        pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
            ...dbConfig,
            charset: "utf8mb4",
            supportBigNumbers: true,
            bigNumberStrings: true
        });
        console.log("✅ MySQL Connection Pool erstellt (XAMPP-kompatibel)");
    }
    // Connection aus Pool holen
    const connection = await pool.getConnection();
    try {
        // UTF-8 explizit setzen für XAMPP
        await connection.execute("SET NAMES utf8mb4");
        // Foreign Key Checks deaktivieren für DROP/CREATE Operationen
        await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
        await connection.execute("SET CHARACTER SET utf8mb4");
        // =====================================================
        // 🛡️ ENTERPRISE++ TABELLEN-SCHUTZ
        // =====================================================
        // HINWEIS: Automatische Tabellenlöschung wurde DEAKTIVIERT!
        // 
        // Grund: Schutz vor versehentlichem Datenverlust
        // Datum: 2025-12-04
        // 
        // Falls ein Reset wirklich nötig ist:
        // 1. Backup erstellen: node scripts/backup-db-local.js
        // 2. In phpMyAdmin manuell Tabellen löschen
        // 3. Dann init-database aufrufen
        // =====================================================
        console.log("🛡️ =====================================================");
        console.log("🛡️ ENTERPRISE++ TABELLEN-SCHUTZ AKTIV");
        console.log("🛡️ =====================================================");
        console.log("ℹ️  Automatische Tabellenlöschung ist DEAKTIVIERT.");
        console.log("ℹ️  Tabellen werden nur erstellt wenn sie nicht existieren.");
        console.log("ℹ️  Für einen Reset bitte manuell in phpMyAdmin vorgehen.");
        console.log("🛡️ =====================================================");
        // Zähle existierende Tabellen (nur zur Info)
        const [existingTables] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
        const tableCount = existingTables[0]?.count || 0;
        console.log(`📊 Existierende Tabellen: ${tableCount}`);
        // =====================================================
        // KUNDEN-HAUPTTABELLE - NEUERSTELLUNG
        // =====================================================
        console.log("📦 Erstelle lopez_customers Tabelle...");
        await connection.execute(`
      CREATE TABLE lopez_customers (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        kundennummer VARCHAR(20) UNIQUE NOT NULL,
        customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
        anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe',
        titel VARCHAR(50),
        vorname VARCHAR(100),
        nachname VARCHAR(100),
        firmenname VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        telefon VARCHAR(50),
        strasse VARCHAR(255),
        plz VARCHAR(20),
        ort VARCHAR(100),
        land VARCHAR(100) DEFAULT 'Deutschland',
        status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
        support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kundennummer (kundennummer),
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_customer_type (customer_type),
        INDEX idx_support_level (support_level)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_customers erstellt");
        // Tabelle wurde neu erstellt - alte Logik überspringen
        let needsRecreate = false;
        // Die alte Schema-Validierung wird übersprungen da Tabelle frisch erstellt wurde
        // =====================================================
        // HINWEIS: Alte Validierungslogik wurde entfernt
        // =====================================================
        try {
            const [tables] = await connection.execute("SHOW TABLES LIKE 'lopez_customers'");
            if (tables.length > 0) {
                // Enterprise++: VOLLSTÄNDIGE Schema-Validierung
                // Prüfe ALLE kritischen Spalten, nicht nur kundennummer
                const requiredColumns = [
                    'id',
                    'kundennummer',
                    'customer_type',
                    'anrede',
                    'vorname',
                    'nachname',
                    'firmenname',
                    'email',
                    'telefon',
                    'strasse',
                    'plz',
                    'ort',
                    'land',
                    'status',
                    'support_level',
                    'notes',
                    'created_at',
                    'updated_at'
                ];
                const [allColumns] = await connection.execute("SHOW COLUMNS FROM lopez_customers");
                const existingColumns = allColumns.map((col)=>col.Field);
                const missingColumns = requiredColumns.filter((col)=>!existingColumns.includes(col));
                if (missingColumns.length > 0) {
                    console.log(`🔄 Enterprise++ Schema-Migration: Fehlende Spalten gefunden: ${missingColumns.join(', ')}`);
                    // Versuche fehlende Spalten hinzuzufügen
                    let migrationSuccess = true;
                    for (const column of missingColumns){
                        try {
                            if (column === 'kundennummer') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN kundennummer VARCHAR(20) UNIQUE NOT NULL AFTER id
                `);
                                try {
                                    await connection.execute(`
                    CREATE INDEX idx_kundennummer ON lopez_customers(kundennummer)
                  `);
                                } catch (idxError) {
                                    if (!idxError.message.includes("Duplicate key name")) {
                                        console.warn("⚠️ Index-Erstellung fehlgeschlagen:", idxError.message);
                                    }
                                }
                            } else if (column === 'firmenname') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN firmenname VARCHAR(255) NULL AFTER nachname
                `);
                            } else if (column === 'id') {
                                // id kann nicht hinzugefügt werden - muss neu erstellt werden
                                migrationSuccess = false;
                                break;
                            } else if (column === 'customer_type') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL AFTER kundennummer
                `);
                            } else if (column === 'anrede') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe' AFTER customer_type
                `);
                            } else if (column === 'titel') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN titel VARCHAR(50) NULL AFTER anrede
                `);
                            } else if (column === 'vorname') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN vorname VARCHAR(100) NULL AFTER titel
                `);
                            } else if (column === 'nachname') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN nachname VARCHAR(100) NULL AFTER vorname
                `);
                            } else if (column === 'email') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL AFTER firmenname
                `);
                            } else if (column === 'telefon') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN telefon VARCHAR(50) NULL AFTER email
                `);
                            } else if (column === 'strasse') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN strasse VARCHAR(255) NULL AFTER telefon
                `);
                            } else if (column === 'plz') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN plz VARCHAR(20) NULL AFTER strasse
                `);
                            } else if (column === 'ort') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN ort VARCHAR(100) NULL AFTER plz
                `);
                            } else if (column === 'land') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN land VARCHAR(100) DEFAULT 'Deutschland' AFTER ort
                `);
                            } else if (column === 'status') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv' AFTER land
                `);
                            } else if (column === 'support_level') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard' AFTER status
                `);
                            } else if (column === 'notes') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN notes TEXT NULL AFTER support_level
                `);
                            } else if (column === 'created_at') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER notes
                `);
                            } else if (column === 'updated_at') {
                                await connection.execute(`
                  ALTER TABLE lopez_customers 
                  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at
                `);
                            } else {
                                // Unbekannte Spalte - Fallback zu Neuerstellung
                                console.warn(`⚠️ Unbekannte Spalte ${column} - Tabelle muss neu erstellt werden`);
                                migrationSuccess = false;
                                break;
                            }
                        } catch (alterError) {
                            console.warn(`⚠️ Fehler beim Hinzufügen von ${column}:`, alterError.message);
                            migrationSuccess = false;
                        }
                    }
                    if (!migrationSuccess) {
                        console.log("🔄 Migration fehlgeschlagen - Tabelle wird neu erstellt...");
                        needsRecreate = true;
                    } else {
                        console.log("✅ Fehlende Spalten erfolgreich hinzugefügt");
                        needsRecreate = false;
                    }
                } else {
                    // Alle Spalten vorhanden - prüfe noch id Typ
                    const [idColumns] = await connection.execute("SHOW COLUMNS FROM lopez_customers WHERE Field = 'id'");
                    if (idColumns.length > 0 && !idColumns[0].Type.includes('bigint')) {
                        console.log("🔄 Enterprise++ Schema-Reparatur: id ist nicht BIGINT - Tabellen werden komplett neu erstellt...");
                        needsRecreate = true;
                    } else {
                        needsRecreate = false; // Schema ist korrekt
                    }
                }
                if (needsRecreate) {
                    // Enterprise++: NUKLEARE OPTION - Alle Tabellen ZWINGEND löschen
                    console.log("🗑️ Enterprise++ Schema-Reparatur: Lösche ALLE Tabellen...");
                    // Abhängige Tabellen zuerst löschen (Foreign Key Constraints)
                    try {
                        await connection.execute("DROP TABLE IF EXISTS lopez_customer_notes");
                    } catch (e) {
                        console.warn("⚠️ Fehler beim Löschen von lopez_customer_notes:", e);
                    }
                    try {
                        await connection.execute("DROP TABLE IF EXISTS lopez_customer_tags");
                    } catch (e) {
                        console.warn("⚠️ Fehler beim Löschen von lopez_customer_tags:", e);
                    }
                    // Haupttabelle ZWINGEND löschen - MEHRMALS versuchen
                    let dropAttempts = 0;
                    let tableDropped = false;
                    while(dropAttempts < 3 && !tableDropped){
                        try {
                            await connection.execute("DROP TABLE IF EXISTS lopez_customers");
                            // Verifikation
                            const [verifyTables] = await connection.execute("SHOW TABLES LIKE 'lopez_customers'");
                            if (verifyTables.length === 0) {
                                tableDropped = true;
                                console.log(`✅ Tabelle lopez_customers erfolgreich gelöscht (Versuch ${dropAttempts + 1})`);
                            } else {
                                dropAttempts++;
                                console.log(`⚠️ Tabelle existiert noch - Versuch ${dropAttempts + 1}/3...`);
                                if (dropAttempts < 3) {
                                    // Kurz warten
                                    await new Promise((resolve)=>setTimeout(resolve, 100));
                                    // FORCE DROP ohne IF EXISTS
                                    try {
                                        await connection.execute("DROP TABLE lopez_customers");
                                    } catch (forceError) {
                                        console.warn("⚠️ FORCE DROP fehlgeschlagen:", forceError);
                                    }
                                }
                            }
                        } catch (dropError) {
                            dropAttempts++;
                            console.warn(`⚠️ DROP TABLE Versuch ${dropAttempts} fehlgeschlagen:`, dropError.message);
                            if (dropAttempts < 3) {
                                await new Promise((resolve)=>setTimeout(resolve, 100));
                            }
                        }
                    }
                    if (!tableDropped) {
                        throw new Error("Tabelle lopez_customers konnte nach 3 Versuchen nicht gelöscht werden");
                    }
                    console.log("✅ Alle Tabellen gelöscht - Neuerstellung startet...");
                }
            }
        } catch (error) {
            // Enterprise++: Fehler nicht ignorieren, sondern loggen
            console.error("❌ Schema-Prüfung fehlgeschlagen:", error);
            // Bei Fehler: Sicherheitshalber neu erstellen
            needsRecreate = true;
            try {
                console.log("🗑️ Fehlerbehandlung: Lösche alle Tabellen...");
                await connection.execute("DROP TABLE IF EXISTS lopez_customer_notes");
                await connection.execute("DROP TABLE IF EXISTS lopez_customer_tags");
                await connection.execute("DROP TABLE IF EXISTS lopez_customers");
                // Verifikation
                const [verifyTables] = await connection.execute("SHOW TABLES LIKE 'lopez_customers'");
                if (verifyTables.length > 0) {
                    await connection.execute("DROP TABLE lopez_customers");
                }
            } catch (dropError) {
                console.warn("⚠️ Fehler beim Löschen der Tabellen:", dropError);
            }
        }
        // Enterprise++: Tabelle erstellen
        // Wenn needsRecreate=true: OHNE IF NOT EXISTS (Tabelle wurde gelöscht)
        // Wenn needsRecreate=false: MIT IF NOT EXISTS (Tabelle existiert korrekt oder wurde migriert)
        if (needsRecreate) {
            // Finale Verifikation: Tabelle wirklich gelöscht?
            const [finalCheck] = await connection.execute("SHOW TABLES LIKE 'lopez_customers'");
            if (finalCheck.length > 0) {
                // Tabelle existiert noch - FORCE DROP
                console.log("⚠️ Finale Prüfung: Tabelle existiert noch - FORCE DROP...");
                try {
                    await connection.execute("DROP TABLE lopez_customers");
                    // Nochmal prüfen
                    const [finalCheck2] = await connection.execute("SHOW TABLES LIKE 'lopez_customers'");
                    if (finalCheck2.length > 0) {
                        throw new Error("Tabelle lopez_customers konnte nicht gelöscht werden");
                    }
                    console.log("✅ Tabelle erfolgreich gelöscht");
                } catch (forceError) {
                    console.error("❌ FORCE DROP fehlgeschlagen:", forceError.message);
                    throw new Error(`Tabelle lopez_customers konnte nicht gelöscht werden: ${forceError.message}`);
                }
            }
            await connection.execute(`
            CREATE TABLE lopez_customers (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                kundennummer VARCHAR(20) UNIQUE NOT NULL,
                customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
                anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe',
                titel VARCHAR(50),
                vorname VARCHAR(100),
                nachname VARCHAR(100),
                firmenname VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                telefon VARCHAR(50),
                strasse VARCHAR(255),
                plz VARCHAR(20),
                ort VARCHAR(100),
                land VARCHAR(100) DEFAULT 'Deutschland',
                status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
                support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_kundennummer (kundennummer),
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_customer_type (customer_type),
                INDEX idx_support_level (support_level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
            console.log("✅ Tabelle lopez_customers neu erstellt mit kundennummer");
        } else {
            await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customers (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                kundennummer VARCHAR(20) UNIQUE NOT NULL,
                customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
                anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe',
                titel VARCHAR(50),
                vorname VARCHAR(100),
                nachname VARCHAR(100),
                firmenname VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                telefon VARCHAR(50),
                strasse VARCHAR(255),
                plz VARCHAR(20),
                ort VARCHAR(100),
                land VARCHAR(100) DEFAULT 'Deutschland',
                status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
                support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_kundennummer (kundennummer),
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_customer_type (customer_type),
                INDEX idx_support_level (support_level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        }
        // =====================================================
        // KUNDEN-NOTIZEN
        // =====================================================
        // Enterprise++: Tabelle neu erstellen (wurde ggf. gelöscht)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_notes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                note TEXT NOT NULL,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_customer_id (customer_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Foreign Key separat hinzufügen (falls nicht vorhanden)
        try {
            await connection.execute(`
        ALTER TABLE lopez_customer_notes 
        ADD CONSTRAINT fk_customer_notes_customer_id 
        FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
      `);
        } catch (error) {
            // Foreign Key existiert bereits oder kann nicht erstellt werden - ignorieren
            if (!error.message.includes("Duplicate key name") && !error.message.includes("already exists")) {
                console.warn("Foreign Key für lopez_customer_notes konnte nicht erstellt werden:", error.message);
            }
        }
        // =====================================================
        // KUNDEN-TAGS
        // =====================================================
        // Enterprise++: Tabelle neu erstellen (wurde ggf. gelöscht)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_tags (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                tag_name VARCHAR(50) NOT NULL,
                tag_color VARCHAR(7) DEFAULT '#3B82F6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_customer_tag (customer_id, tag_name),
                INDEX idx_customer_id (customer_id),
                INDEX idx_tag_name (tag_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Foreign Key separat hinzufügen (falls nicht vorhanden)
        try {
            await connection.execute(`
        ALTER TABLE lopez_customer_tags 
        ADD CONSTRAINT fk_customer_tags_customer_id 
        FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE
      `);
        } catch (error) {
            // Foreign Key existiert bereits oder kann nicht erstellt werden - ignorieren
            if (!error.message.includes("Duplicate key name") && !error.message.includes("already exists")) {
                console.warn("Foreign Key für lopez_customer_tags konnte nicht erstellt werden:", error.message);
            }
        }
        // =====================================================
        // AUDIT-LOGS
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_audit_logs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                table_name VARCHAR(50) NOT NULL,
                record_id BIGINT NOT NULL,
                action ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', '2FA_SETUP', '2FA_VERIFY', 'PASSWORD_CHANGE', 'ROLE_ASSIGN', 'PERMISSION_GRANT') NOT NULL,
                old_values JSON,
                new_values JSON,
                user_id BIGINT NOT NULL,
                username VARCHAR(100),
                ip_address VARCHAR(45),
                user_agent TEXT,
                session_id VARCHAR(255),
                risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
                compliance_category ENUM('DATA_ACCESS', 'DATA_MODIFICATION', 'AUTHENTICATION', 'AUTHORIZATION', 'SYSTEM_CHANGE', 'SECURITY_EVENT') DEFAULT 'DATA_ACCESS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_table_record (table_name, record_id),
                INDEX idx_user_id (user_id),
                INDEX idx_username (username),
                INDEX idx_action (action),
                INDEX idx_risk_level (risk_level),
                INDEX idx_compliance_category (compliance_category),
                INDEX idx_created_at (created_at),
                INDEX idx_session_id (session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // RBAC/ABAC SYSTEM
        // =====================================================
        // Benutzer-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_users (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                email_external VARCHAR(255),         -- lopezitwelt.de für externe Kommunikation
                email_internal VARCHAR(255),         -- lopez-team.de für interne Kommunikation
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                display_name VARCHAR(200),           -- "Ramiro Lopez Rodriguez - Admin"
                admin_alias VARCHAR(50),             -- "r.lopez", "r.mclean"
                domain_type ENUM('external', 'internal') DEFAULT 'internal',
                status ENUM('active', 'inactive', 'locked', 'pending') DEFAULT 'pending',
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_email_external (email_external),
                INDEX idx_email_internal (email_internal),
                INDEX idx_admin_alias (admin_alias),
                INDEX idx_domain_type (domain_type),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Rollen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                level TINYINT NOT NULL DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name),
                INDEX idx_level (level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Berechtigungen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                resource VARCHAR(100) NOT NULL,
                action VARCHAR(50) NOT NULL,
                conditions JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_resource_action (resource, action),
                INDEX idx_resource (resource),
                INDEX idx_action (action)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Benutzer-Rollen-Zuordnung
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                role_id BIGINT NOT NULL,
                assigned_by BIGINT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_by) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_role (user_id, role_id),
                INDEX idx_user_id (user_id),
                INDEX idx_role_id (role_id),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Rollen-Berechtigungen-Zuordnung
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_role_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                role_id BIGINT NOT NULL,
                permission_id BIGINT NOT NULL,
                granted BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES lopez_permissions(id) ON DELETE CASCADE,
                UNIQUE KEY unique_role_permission (role_id, permission_id),
                INDEX idx_role_id (role_id),
                INDEX idx_permission_id (permission_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Sessions-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_sessions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 HOUR)),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_session_token (session_token),
                INDEX idx_expires_at (expires_at),
                INDEX idx_last_activity (last_activity_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // 2FA SYSTEM
        // =====================================================
        // 2FA-Secrets-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                secret VARCHAR(255) NOT NULL,
                backup_codes JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_2fa (user_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // 2FA-Verifikationen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa_verifications (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                token VARCHAR(10) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_at TIMESTAMP NOT NULL DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // ENTERPRISE++ SECURITY PHASE 2 TABELLEN
        // =====================================================
        // 2FA Recovery Codes (8 Einmal-Codes pro User)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_user_2fa_recovery_codes (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_used (used)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Device Tracking (Geräteverwaltung)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_user_devices (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            device_fingerprint VARCHAR(64) NOT NULL,
            device_name VARCHAR(255),
            browser VARCHAR(100),
            os VARCHAR(100),
            ip_address VARCHAR(45),
            user_agent TEXT,
            is_trusted BOOLEAN DEFAULT FALSE,
            last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_device (user_id, device_fingerprint),
            INDEX idx_user_id (user_id),
            INDEX idx_last_used (last_used_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Login History (mit Geo-IP und Risk-Level)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_login_history (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            user_agent TEXT,
            device_id BIGINT NULL,
            browser VARCHAR(100),
            os VARCHAR(100),
            country VARCHAR(100) DEFAULT 'Unknown',
            city VARCHAR(100) DEFAULT 'Unknown',
            status ENUM('success', 'failed', 'blocked', 'locked') NOT NULL,
            failure_reason VARCHAR(255) NULL,
            risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
            session_token VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_status (status),
            INDEX idx_risk_level (risk_level),
            INDEX idx_created_at (created_at),
            INDEX idx_ip_address (ip_address)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Security Events (Risk Detection)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_security_events (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NULL,
            event_type ENUM(
                'FAILED_LOGIN', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED',
                'NEW_DEVICE', 'UNTRUSTED_DEVICE', 'IP_CHANGE',
                'SESSION_TERMINATED', 'RECOVERY_CODE_USED',
                'SUSPICIOUS_ACTIVITY', 'BRUTE_FORCE_ATTEMPT'
            ) NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            device_id BIGINT NULL,
            risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
            details JSON,
            resolved BOOLEAN DEFAULT FALSE,
            resolved_at TIMESTAMP NULL,
            resolved_by BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id),
            INDEX idx_event_type (event_type),
            INDEX idx_risk_level (risk_level),
            INDEX idx_resolved (resolved),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Account Lockouts (Sperren)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_account_lockouts (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            reason ENUM('failed_logins', 'suspicious_activity', 'admin_action', 'risk_detected') NOT NULL,
            locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            locked_until TIMESTAMP NULL,
            failed_attempts INT DEFAULT 0,
            unlocked_at TIMESTAMP NULL,
            unlocked_by BIGINT NULL,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_locked_until (locked_until)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Enterprise++ Security Phase 2 Tabellen erstellt");
        // =====================================================
        // ENTERPRISE++ PHASE 3: PROJEKTE & RECHNUNGEN
        // =====================================================
        // Projekte-Tabelle
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_projects (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            project_code VARCHAR(50) UNIQUE,
            project_name VARCHAR(255) NOT NULL,
            description TEXT,
            customer_id BIGINT NOT NULL,
            status ENUM('planned', 'open', 'in_progress', 'on_hold', 'done', 'cancelled') DEFAULT 'planned',
            priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
            start_date DATE NULL,
            end_date DATE NULL,
            budget_amount DECIMAL(15, 2) NULL,
            budget_currency VARCHAR(3) DEFAULT 'EUR',
            assigned_user_id BIGINT NULL,
            created_by BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
            INDEX idx_customer_id (customer_id),
            INDEX idx_status (status),
            INDEX idx_assigned_user (assigned_user_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_projects erstellt");
        // Projekt-Aufgaben-Tabelle
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_project_tasks (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            project_id BIGINT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status ENUM('todo', 'in_progress', 'review', 'done', 'cancelled') DEFAULT 'todo',
            priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
            due_date DATE NULL,
            estimated_hours DECIMAL(8, 2) NULL,
            actual_hours DECIMAL(8, 2) NULL,
            assigned_user_id BIGINT NULL,
            created_by BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE CASCADE,
            INDEX idx_project_id (project_id),
            INDEX idx_status (status),
            INDEX idx_assigned_user (assigned_user_id),
            INDEX idx_due_date (due_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_project_tasks erstellt");
        // Rechnungen-Tabelle
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_invoices (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            invoice_number VARCHAR(50) UNIQUE NOT NULL,
            customer_id BIGINT NOT NULL,
            project_id BIGINT NULL,
            status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled', 'storno') DEFAULT 'draft',
            issue_date DATE NOT NULL,
            due_date DATE NOT NULL,
            payment_date DATE NULL,
            net_amount DECIMAL(15, 2) DEFAULT 0.00,
            tax_amount DECIMAL(15, 2) DEFAULT 0.00,
            gross_amount DECIMAL(15, 2) DEFAULT 0.00,
            tax_rate DECIMAL(5, 2) DEFAULT 19.00,
            currency VARCHAR(3) DEFAULT 'EUR',
            notes TEXT,
            payment_terms VARCHAR(255) DEFAULT 'Zahlbar innerhalb von 14 Tagen',
            created_by BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE RESTRICT,
            FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
            INDEX idx_customer_id (customer_id),
            INDEX idx_project_id (project_id),
            INDEX idx_status (status),
            INDEX idx_issue_date (issue_date),
            INDEX idx_due_date (due_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_invoices erstellt");
        // Rechnungspositionen-Tabelle
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_invoice_items (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            invoice_id BIGINT NOT NULL,
            position_number INT NOT NULL,
            description VARCHAR(500) NOT NULL,
            quantity DECIMAL(10, 3) DEFAULT 1.000,
            unit VARCHAR(20) DEFAULT 'Stück',
            unit_price DECIMAL(15, 2) NOT NULL,
            tax_rate DECIMAL(5, 2) DEFAULT 19.00,
            net_amount DECIMAL(15, 2) NOT NULL,
            tax_amount DECIMAL(15, 2) NOT NULL,
            gross_amount DECIMAL(15, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES lopez_invoices(id) ON DELETE CASCADE,
            INDEX idx_invoice_id (invoice_id),
            INDEX idx_position (position_number)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_invoice_items erstellt");
        console.log("✅ Enterprise++ Phase 3 Tabellen erstellt (Projekte & Rechnungen)");
        // =====================================================
        // ENTERPRISE++ PHASE 4: AI & AUTOMATION
        // =====================================================
        // AI Customer Insights
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_ai_customer_insights (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            customer_id BIGINT NOT NULL,
            insight_type ENUM('summary', 'risk', 'potential', 'tone', 'recommendation') NOT NULL,
            content TEXT NOT NULL,
            confidence_score DECIMAL(3, 2) DEFAULT 0.00,
            provider VARCHAR(50) DEFAULT 'openai',
            model VARCHAR(100) DEFAULT 'gpt-4',
            tokens_used INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            created_by_user_id BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
            INDEX idx_customer_id (customer_id),
            INDEX idx_insight_type (insight_type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_ai_customer_insights erstellt");
        // AI Project Insights
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_ai_project_insights (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            project_id BIGINT NOT NULL,
            insight_type ENUM('summary', 'risks', 'delays', 'recommendations', 'next_steps') NOT NULL,
            content TEXT NOT NULL,
            confidence_score DECIMAL(3, 2) DEFAULT 0.00,
            provider VARCHAR(50) DEFAULT 'openai',
            model VARCHAR(100) DEFAULT 'gpt-4',
            tokens_used INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            created_by_user_id BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE CASCADE,
            INDEX idx_project_id (project_id),
            INDEX idx_insight_type (insight_type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_ai_project_insights erstellt");
        // AI Invoice Insights
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_ai_invoice_insights (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            invoice_id BIGINT NOT NULL,
            insight_type ENUM('summary', 'check', 'errors', 'suggestions', 'payment_risk') NOT NULL,
            content TEXT NOT NULL,
            severity ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
            provider VARCHAR(50) DEFAULT 'openai',
            model VARCHAR(100) DEFAULT 'gpt-4',
            tokens_used INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            created_by_user_id BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES lopez_invoices(id) ON DELETE CASCADE,
            INDEX idx_invoice_id (invoice_id),
            INDEX idx_insight_type (insight_type),
            INDEX idx_severity (severity),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_ai_invoice_insights erstellt");
        // AI Media Results
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_media_ai_results (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            media_id BIGINT NOT NULL,
            result_type ENUM('summary', 'ocr', 'persons', 'content_classification', 'dsgvo_check', 'tags') NOT NULL,
            json_result JSON NOT NULL,
            has_persons BOOLEAN DEFAULT FALSE,
            dsgvo_warning BOOLEAN DEFAULT FALSE,
            confidence_score DECIMAL(3, 2) DEFAULT 0.00,
            provider VARCHAR(50) DEFAULT 'openai',
            model VARCHAR(100) DEFAULT 'gpt-4-vision',
            tokens_used INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            created_by_user_id BIGINT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_media_id (media_id),
            INDEX idx_result_type (result_type),
            INDEX idx_has_persons (has_persons),
            INDEX idx_dsgvo_warning (dsgvo_warning),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_media_ai_results erstellt");
        // AI Reports (Executive Summaries)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_ai_reports (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            report_type ENUM('weekly', 'monthly', 'quarterly', 'customer', 'project', 'security', 'financial') NOT NULL,
            title VARCHAR(255) NOT NULL,
            content LONGTEXT NOT NULL,
            summary TEXT,
            period_start DATE NULL,
            period_end DATE NULL,
            data_snapshot JSON,
            provider VARCHAR(50) DEFAULT 'openai',
            model VARCHAR(100) DEFAULT 'gpt-4',
            tokens_used INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            created_by_user_id BIGINT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_report_type (report_type),
            INDEX idx_generated_at (generated_at),
            INDEX idx_period (period_start, period_end)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_ai_reports erstellt");
        // AI Usage Tracking (Kosten-Überwachung)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_ai_usage (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NULL,
            endpoint VARCHAR(255) NOT NULL,
            provider VARCHAR(50) NOT NULL,
            model VARCHAR(100) NOT NULL,
            tokens_input INT DEFAULT 0,
            tokens_output INT DEFAULT 0,
            tokens_total INT DEFAULT 0,
            cost_estimate DECIMAL(10, 6) DEFAULT 0.000000,
            response_time_ms INT DEFAULT 0,
            success BOOLEAN DEFAULT TRUE,
            error_message TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id),
            INDEX idx_provider (provider),
            INDEX idx_endpoint (endpoint),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_ai_usage erstellt");
        console.log("✅ Enterprise++ Phase 4 Tabellen erstellt (AI & Automation)");
        // =====================================================
        // DSGVO TABELLEN
        // =====================================================
        // DSGVO Consents
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS dsgvo_consents (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            consent_type ENUM('necessary', 'functional', 'analytics', 'marketing', 'ki_processing', 'media_ki') NOT NULL,
            consent_version VARCHAR(10) NOT NULL DEFAULT 'v1',
            consent_status ENUM('granted', 'revoked', 'denied', 'pending') NOT NULL DEFAULT 'pending',
            consent_data JSON,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            revoked_at TIMESTAMP NULL,
            
            INDEX idx_user_id (user_id),
            INDEX idx_consent_type (consent_type),
            INDEX idx_consent_status (consent_status),
            INDEX idx_consent_version (consent_version),
            INDEX idx_created_at (created_at),
            INDEX idx_user_consent (user_id, consent_type, consent_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // DSGVO Audit Events
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS dsgvo_audit_events (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(36),
            event_type VARCHAR(100) NOT NULL,
            action VARCHAR(255) NOT NULL,
            resource_type VARCHAR(50),
            resource_id VARCHAR(36),
            data_category VARCHAR(50),
            legal_basis VARCHAR(100),
            consent_status BOOLEAN,
            ip_address VARCHAR(45),
            user_agent TEXT,
            details JSON,
            result ENUM('success', 'failure', 'pending') DEFAULT 'success',
            error_message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            INDEX idx_user_id (user_id),
            INDEX idx_event_type (event_type),
            INDEX idx_action (action),
            INDEX idx_resource (resource_type, resource_id),
            INDEX idx_created_at (created_at),
            INDEX idx_result (result)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // DSGVO Privacy Requests
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS dsgvo_privacy_requests (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            request_type ENUM('access', 'deletion', 'correction', 'portability', 'restriction', 'objection') NOT NULL,
            request_status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
            request_data JSON,
            response_data JSON,
            export_file_path VARCHAR(500),
            deletion_date TIMESTAMP NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL,
            
            INDEX idx_user_id (user_id),
            INDEX idx_request_type (request_type),
            INDEX idx_request_status (request_status),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // DSGVO Approvals (P7-MANUAL-APPROVAL)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS dsgvo_approvals (
            id VARCHAR(36) PRIMARY KEY,
            use_case_id VARCHAR(100),
            use_case_name VARCHAR(255) NOT NULL,
            risk_category ENUM('low', 'medium', 'high', 'critical') NOT NULL,
            risk_score INT,
            approval_status ENUM('pending', 'approved', 'rejected', 'needs_improvement') DEFAULT 'pending',
            approved_by_dsfa VARCHAR(36),
            approved_by_dsb VARCHAR(36) NULL,
            approved_by_architect VARCHAR(36) NULL,
            approval_date DATETIME NULL,
            approval_reason TEXT,
            approval_conditions TEXT,
            measures_package VARCHAR(255),
            audit_hash VARCHAR(64),
            review_date DATE NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_use_case_id (use_case_id),
            INDEX idx_risk_category (risk_category),
            INDEX idx_approval_status (approval_status),
            INDEX idx_approved_by_dsfa (approved_by_dsfa),
            INDEX idx_created_at (created_at),
            INDEX idx_review_date (review_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Triggers (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_triggers (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type ENUM('event-based', 'time-based', 'data-based', 'condition-based') NOT NULL,
            event_type VARCHAR(100),
            conditions JSON,
            actions JSON NOT NULL,
            enabled BOOLEAN DEFAULT TRUE,
            approval_required BOOLEAN DEFAULT FALSE,
            approval_status ENUM('not_required', 'pending', 'approved', 'rejected', 'expired', 'locked') DEFAULT 'not_required',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by VARCHAR(255),
            INDEX idx_type (type),
            INDEX idx_enabled (enabled),
            INDEX idx_approval_status (approval_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Workflows (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_workflows (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            steps JSON NOT NULL,
            status ENUM('draft', 'active', 'paused', 'completed', 'failed', 'cancelled', 'archived') DEFAULT 'draft',
            approval_required BOOLEAN DEFAULT FALSE,
            approval_status ENUM('not_required', 'pending', 'approved', 'rejected', 'expired', 'locked') DEFAULT 'not_required',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by VARCHAR(255),
            INDEX idx_status (status),
            INDEX idx_approval_status (approval_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Workflow Executions (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_workflow_executions (
            id VARCHAR(255) PRIMARY KEY,
            workflow_id VARCHAR(255) NOT NULL,
            execution_id VARCHAR(255) NOT NULL UNIQUE,
            status ENUM('pending', 'active', 'paused', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
            current_step VARCHAR(255),
            payload JSON,
            result JSON,
            error TEXT,
            started_at TIMESTAMP NULL,
            completed_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_workflow_id (workflow_id),
            INDEX idx_execution_id (execution_id),
            INDEX idx_status (status),
            INDEX idx_started_at (started_at),
            FOREIGN KEY (workflow_id) REFERENCES orchestrator_workflows(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Events (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_events (
            id VARCHAR(255) PRIMARY KEY,
            event_type VARCHAR(100) NOT NULL,
            resource_type VARCHAR(100),
            resource_id VARCHAR(255),
            details JSON,
            audit_hash VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_event_type (event_type),
            INDEX idx_resource (resource_type, resource_id),
            INDEX idx_timestamp (timestamp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Automation Status (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_automation_status (
            id VARCHAR(255) PRIMARY KEY,
            use_case VARCHAR(100) NOT NULL UNIQUE,
            automation_enabled BOOLEAN DEFAULT FALSE,
            triggers_count INT DEFAULT 0,
            workflows_count INT DEFAULT 0,
            last_trigger_fired_at TIMESTAMP NULL,
            last_workflow_started_at TIMESTAMP NULL,
            enabled_at TIMESTAMP NULL,
            disabled_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_use_case (use_case),
            INDEX idx_automation_enabled (automation_enabled)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Approval Requests (P8)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_approval_requests (
            id VARCHAR(255) PRIMARY KEY,
            use_case VARCHAR(100) NOT NULL,
            request_type ENUM('initial', 're_approval') DEFAULT 'initial',
            reason TEXT,
            change_type VARCHAR(100),
            status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
            requested_by VARCHAR(255),
            approved_by VARCHAR(255),
            approved_at TIMESTAMP NULL,
            expires_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_use_case (use_case),
            INDEX idx_status (status),
            INDEX idx_requested_by (requested_by)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Alerts (P8-C)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_alerts (
            id VARCHAR(255) PRIMARY KEY,
            alert_rule_id VARCHAR(50) NOT NULL,
            category VARCHAR(50) NOT NULL,
            severity ENUM('info', 'warning', 'critical') NOT NULL,
            status ENUM('open', 'acknowledged', 'escalated', 'closed', 'ignored') NOT NULL DEFAULT 'open',
            title VARCHAR(255) NOT NULL,
            description TEXT,
            payload JSON,
            event_type VARCHAR(100),
            resource_type VARCHAR(100),
            resource_id VARCHAR(255),
            triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            acknowledged_at TIMESTAMP NULL,
            acknowledged_by VARCHAR(255) NULL,
            escalated_at TIMESTAMP NULL,
            escalated_by VARCHAR(255) NULL,
            closed_at TIMESTAMP NULL,
            closed_by VARCHAR(255) NULL,
            incident_id VARCHAR(255) NULL,
            audit_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_alert_rule_id (alert_rule_id),
            INDEX idx_category (category),
            INDEX idx_severity (severity),
            INDEX idx_status (status),
            INDEX idx_triggered_at (triggered_at),
            INDEX idx_incident_id (incident_id),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Incidents (P8-C)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_incidents (
            id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            severity ENUM('info', 'warning', 'critical') NOT NULL,
            status ENUM('open', 'investigating', 'resolved', 'closed') NOT NULL DEFAULT 'open',
            assigned_to VARCHAR(255) NULL,
            sla_minutes INT NOT NULL,
            sla_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            sla_warning_at TIMESTAMP NULL,
            sla_breached_at TIMESTAMP NULL,
            opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            opened_by VARCHAR(255) NOT NULL,
            resolved_at TIMESTAMP NULL,
            resolved_by VARCHAR(255) NULL,
            closed_at TIMESTAMP NULL,
            closed_by VARCHAR(255) NULL,
            escalation_level INT NOT NULL DEFAULT 1,
            root_cause TEXT,
            resolution TEXT,
            post_mortem TEXT,
            audit_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_severity (severity),
            INDEX idx_status (status),
            INDEX idx_assigned_to (assigned_to),
            INDEX idx_opened_at (opened_at),
            INDEX idx_sla_started_at (sla_started_at),
            INDEX idx_escalation_level (escalation_level),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Foreign Key für orchestrator_alerts.incident_id hinzufügen (nach Erstellung von orchestrator_incidents)
        try {
            await connection.execute(`
        ALTER TABLE orchestrator_alerts 
        ADD CONSTRAINT fk_alerts_incident_id 
        FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE SET NULL
      `);
        } catch (error) {
            // Foreign Key existiert bereits oder kann nicht erstellt werden - ignorieren
            if (!error.message.includes("Duplicate key name") && !error.message.includes("already exists")) {
                console.warn("Foreign Key für orchestrator_alerts.incident_id konnte nicht erstellt werden:", error.message);
            }
        }
        // Orchestrator Level 2 - Incident Events (P8-C)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_incident_events (
            id VARCHAR(255) PRIMARY KEY,
            incident_id VARCHAR(255) NOT NULL,
            event_type VARCHAR(100) NOT NULL,
            event_data JSON,
            performed_by VARCHAR(255) NOT NULL,
            performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            audit_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_incident_id (incident_id),
            INDEX idx_event_type (event_type),
            INDEX idx_performed_at (performed_at),
            INDEX idx_created_at (created_at),
            FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Telemetry & Monitoring (P8-D)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_metrics (
            id VARCHAR(255) PRIMARY KEY,
            metric_id VARCHAR(50) NOT NULL,
            metric_name VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            value DECIMAL(20,6) NOT NULL,
            unit VARCHAR(50) NOT NULL,
            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            tags JSON,
            metadata JSON,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_metric_id (metric_id),
            INDEX idx_category (category),
            INDEX idx_timestamp (timestamp),
            INDEX idx_created_at (created_at),
            INDEX idx_metric_timestamp (metric_id, timestamp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_metrics_rollup (
            id VARCHAR(255) PRIMARY KEY,
            metric_id VARCHAR(50) NOT NULL,
            metric_name VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            rollup_interval ENUM('1min', '5min', '1hour', '1day') NOT NULL,
            value_min DECIMAL(20,6) NOT NULL,
            value_max DECIMAL(20,6) NOT NULL,
            value_avg DECIMAL(20,6) NOT NULL,
            value_sum DECIMAL(20,6) NOT NULL,
            value_count INT NOT NULL,
            unit VARCHAR(50) NOT NULL,
            timestamp_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            timestamp_end TIMESTAMP NULL,
            tags JSON,
            metadata JSON,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_metric_id (metric_id),
            INDEX idx_category (category),
            INDEX idx_rollup_interval (rollup_interval),
            INDEX idx_timestamp_start (timestamp_start),
            INDEX idx_timestamp_end (timestamp_end),
            INDEX idx_metric_rollup_timestamp (metric_id, rollup_interval, timestamp_start),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_metrics_events (
            id VARCHAR(255) PRIMARY KEY,
            metric_id VARCHAR(50) NOT NULL,
            metric_name VARCHAR(255) NOT NULL,
            event_type VARCHAR(100) NOT NULL,
            event_severity ENUM('info', 'warning', 'critical') NOT NULL,
            value DECIMAL(20,6) NOT NULL,
            threshold DECIMAL(20,6) NOT NULL,
            message TEXT,
            metadata JSON,
            triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL,
            alert_id VARCHAR(255) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_metric_id (metric_id),
            INDEX idx_event_type (event_type),
            INDEX idx_event_severity (event_severity),
            INDEX idx_triggered_at (triggered_at),
            INDEX idx_resolved_at (resolved_at),
            INDEX idx_alert_id (alert_id),
            INDEX idx_created_at (created_at),
            FOREIGN KEY (alert_id) REFERENCES orchestrator_alerts(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_metrics_health (
            id VARCHAR(255) PRIMARY KEY,
            component VARCHAR(100) NOT NULL,
            health_status ENUM('healthy', 'degraded', 'unhealthy', 'critical') NOT NULL,
            health_score DECIMAL(5,2) NOT NULL,
            metrics_summary JSON,
            issues JSON,
            checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_component (component),
            INDEX idx_health_status (health_status),
            INDEX idx_checked_at (checked_at),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // Orchestrator Level 2 - Log Processing & Analytics (P8-E)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_logs (
            id VARCHAR(255) PRIMARY KEY,
            log_rule_id VARCHAR(50) NOT NULL,
            log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
            category VARCHAR(50) NOT NULL,
            severity ENUM('info', 'warning', 'critical') NOT NULL,
            message TEXT NOT NULL,
            context JSON,
            metadata JSON,
            correlation_id VARCHAR(255),
            user_id VARCHAR(255),
            session_id VARCHAR(255),
            ip_address VARCHAR(45),
            user_agent TEXT,
            request_id VARCHAR(255),
            resource_type VARCHAR(100),
            resource_id VARCHAR(255),
            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_log_rule_id (log_rule_id),
            INDEX idx_log_level (log_level),
            INDEX idx_category (category),
            INDEX idx_severity (severity),
            INDEX idx_timestamp (timestamp),
            INDEX idx_correlation_id (correlation_id),
            INDEX idx_user_id (user_id),
            INDEX idx_session_id (session_id),
            INDEX idx_request_id (request_id),
            INDEX idx_resource_type (resource_type),
            INDEX idx_resource_id (resource_id),
            INDEX idx_created_at (created_at),
            FULLTEXT INDEX idx_message_fulltext (message)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_logs_indexed (
            id VARCHAR(255) PRIMARY KEY,
            log_id VARCHAR(255) NOT NULL,
            log_rule_id VARCHAR(50) NOT NULL,
            log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
            category VARCHAR(50) NOT NULL,
            severity ENUM('info', 'warning', 'critical') NOT NULL,
            message TEXT NOT NULL,
            message_normalized TEXT,
            tags JSON,
            extracted_fields JSON,
            search_vector TEXT,
            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_log_id (log_id),
            INDEX idx_log_rule_id (log_rule_id),
            INDEX idx_log_level (log_level),
            INDEX idx_category (category),
            INDEX idx_severity (severity),
            INDEX idx_timestamp (timestamp),
            INDEX idx_created_at (created_at),
            FULLTEXT INDEX idx_message_fulltext (message),
            FULLTEXT INDEX idx_search_vector_fulltext (search_vector),
            FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_logs_archive (
            id VARCHAR(255) PRIMARY KEY,
            log_id VARCHAR(255) NOT NULL,
            log_rule_id VARCHAR(50) NOT NULL,
            log_level ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
            category VARCHAR(50) NOT NULL,
            severity ENUM('info', 'warning', 'critical') NOT NULL,
            message TEXT NOT NULL,
            context JSON,
            metadata JSON,
            compressed_data LONGBLOB,
            compression_ratio DECIMAL(5,2),
            archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            original_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_log_id (log_id),
            INDEX idx_log_rule_id (log_rule_id),
            INDEX idx_category (category),
            INDEX idx_severity (severity),
            INDEX idx_archived_at (archived_at),
            INDEX idx_original_timestamp (original_timestamp),
            INDEX idx_created_at (created_at),
            FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_logs_analytics (
            id VARCHAR(255) PRIMARY KEY,
            analysis_type ENUM('trend', 'pattern', 'anomaly', 'correlation') NOT NULL,
            analysis_period ENUM('hour', 'day', 'week', 'month') NOT NULL,
            category VARCHAR(50),
            result JSON NOT NULL,
            confidence DECIMAL(5,2),
            timestamp_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            timestamp_end TIMESTAMP NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_analysis_type (analysis_type),
            INDEX idx_analysis_period (analysis_period),
            INDEX idx_category (category),
            INDEX idx_timestamp_start (timestamp_start),
            INDEX idx_timestamp_end (timestamp_end),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS orchestrator_logs_events (
            id VARCHAR(255) PRIMARY KEY,
            log_id VARCHAR(255) NOT NULL,
            event_type VARCHAR(100) NOT NULL,
            event_severity ENUM('info', 'warning', 'critical') NOT NULL,
            event_data JSON,
            alert_id VARCHAR(255) NULL,
            incident_id VARCHAR(255) NULL,
            triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_log_id (log_id),
            INDEX idx_event_type (event_type),
            INDEX idx_event_severity (event_severity),
            INDEX idx_triggered_at (triggered_at),
            INDEX idx_resolved_at (resolved_at),
            INDEX idx_alert_id (alert_id),
            INDEX idx_incident_id (incident_id),
            INDEX idx_created_at (created_at),
            FOREIGN KEY (log_id) REFERENCES orchestrator_logs(id) ON DELETE CASCADE,
            FOREIGN KEY (alert_id) REFERENCES orchestrator_alerts(id) ON DELETE SET NULL,
            FOREIGN KEY (incident_id) REFERENCES orchestrator_incidents(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        // =====================================================
        // ENTERPRISE++ DYNAMIC SETTINGS SYSTEM
        // =====================================================
        console.log("📦 Erstelle Enterprise++ Settings-Tabellen...");
        // Settings-Gruppen (z.B. system_security, branding, ai)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_settings_groups (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            \`key\` VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            section VARCHAR(50) NOT NULL DEFAULT 'system',
            sort_order INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_key (\`key\`),
            INDEX idx_section (section),
            INDEX idx_is_active (is_active),
            INDEX idx_sort_order (sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_settings_groups erstellt");
        // Settings-Items (einzelne Einstellungen innerhalb einer Gruppe)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_settings_items (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            group_id BIGINT NOT NULL,
            \`key\` VARCHAR(100) NOT NULL,
            label VARCHAR(255) NOT NULL,
            description TEXT,
            type ENUM('string', 'number', 'boolean', 'select', 'json', 'password') NOT NULL DEFAULT 'string',
            default_value TEXT,
            options_json JSON,
            is_sensitive BOOLEAN DEFAULT FALSE,
            is_ai_related BOOLEAN DEFAULT FALSE,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uk_group_key (group_id, \`key\`),
            INDEX idx_group_id (group_id),
            INDEX idx_key (\`key\`),
            INDEX idx_type (type),
            INDEX idx_is_sensitive (is_sensitive),
            INDEX idx_is_ai_related (is_ai_related),
            INDEX idx_sort_order (sort_order),
            FOREIGN KEY (group_id) REFERENCES lopez_settings_groups(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_settings_items erstellt");
        // Settings-Werte (aktuelle Werte der Einstellungen)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_settings_values (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            item_id BIGINT NOT NULL,
            scope VARCHAR(100) NOT NULL DEFAULT 'global',
            value TEXT,
            updated_by_user_id BIGINT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uk_item_scope (item_id, scope),
            INDEX idx_item_id (item_id),
            INDEX idx_scope (scope),
            INDEX idx_updated_by_user_id (updated_by_user_id),
            FOREIGN KEY (item_id) REFERENCES lopez_settings_items(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_settings_values erstellt");
        // AI-Prompts für KI-Steuerung
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_settings_ai_prompts (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            context VARCHAR(100) UNIQUE NOT NULL,
            ai_description TEXT,
            ai_admin_prompt TEXT,
            ai_user_prompt TEXT,
            ai_tags JSON,
            is_enabled BOOLEAN DEFAULT TRUE,
            updated_by_user_id BIGINT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_context (context),
            INDEX idx_is_enabled (is_enabled)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_settings_ai_prompts erstellt");
        // =====================================================
        // SEED: PASSWORT-POLICY EINSTELLUNGEN
        // =====================================================
        console.log("📦 Erstelle Passwort-Policy Seed-Daten...");
        // Gruppe: System & Sicherheit → Passwort-Policy
        await connection.execute(`
        INSERT IGNORE INTO lopez_settings_groups (\`key\`, name, description, section, sort_order, is_active)
        VALUES ('password_policy', 'Passwort-Policy', 'Enterprise++ Passwort-Regeln und Sicherheitseinstellungen', 'security', 1, TRUE)
    `);
        // Items für Passwort-Policy
        const passwordPolicyItems = [
            {
                key: 'min_length',
                label: 'Mindestlänge (Zeichen)',
                description: 'Enterprise++ Standard: 12 Zeichen',
                type: 'number',
                default_value: '12',
                sort_order: 1
            },
            {
                key: 'max_length',
                label: 'Maximale Länge (Zeichen)',
                description: 'Empfohlen: 128 Zeichen',
                type: 'number',
                default_value: '128',
                sort_order: 2
            },
            {
                key: 'require_uppercase',
                label: 'Großbuchstaben (A-Z) erforderlich',
                description: 'Mindestens ein Großbuchstabe',
                type: 'boolean',
                default_value: 'true',
                sort_order: 3
            },
            {
                key: 'require_lowercase',
                label: 'Kleinbuchstaben (a-z) erforderlich',
                description: 'Mindestens ein Kleinbuchstabe',
                type: 'boolean',
                default_value: 'true',
                sort_order: 4
            },
            {
                key: 'require_numbers',
                label: 'Zahlen (0-9) erforderlich',
                description: 'Mindestens eine Zahl',
                type: 'boolean',
                default_value: 'true',
                sort_order: 5
            },
            {
                key: 'require_special_chars',
                label: 'Sonderzeichen (!@#$%^&*) erforderlich',
                description: 'Mindestens ein Sonderzeichen',
                type: 'boolean',
                default_value: 'true',
                sort_order: 6
            },
            {
                key: 'expiration_days',
                label: 'Passwort-Ablauf (Tage)',
                description: '0 = Kein Ablauf',
                type: 'number',
                default_value: '180',
                sort_order: 7
            },
            {
                key: 'prevent_reuse',
                label: 'Verbot alter Passwörter (Historie)',
                description: 'Verhindert Wiederverwendung der letzten 5 Passwörter',
                type: 'boolean',
                default_value: 'true',
                sort_order: 8
            },
            {
                key: 'max_failed_attempts',
                label: 'Maximale Fehlversuche',
                description: 'Brute-Force-Schutz',
                type: 'number',
                default_value: '5',
                sort_order: 9
            },
            {
                key: 'lockout_duration',
                label: 'Sperrdauer (Minuten)',
                description: 'Dauer der Kontosperre nach Fehlversuchen',
                type: 'number',
                default_value: '15',
                sort_order: 10
            }
        ];
        for (const item of passwordPolicyItems){
            await connection.execute(`
            INSERT IGNORE INTO lopez_settings_items (group_id, \`key\`, label, description, type, default_value, sort_order)
            SELECT id, ?, ?, ?, ?, ?, ?
            FROM lopez_settings_groups WHERE \`key\` = 'password_policy'
        `, [
                item.key,
                item.label,
                item.description,
                item.type,
                item.default_value,
                item.sort_order
            ]);
        }
        console.log("✅ Passwort-Policy Seed-Daten erstellt");
        // =====================================================
        // ENTERPRISE++ SECURITY PHASE 2 TABELLEN
        // =====================================================
        console.log("📦 Erstelle Security Phase 2 Tabellen...");
        // 2FA Recovery Codes
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_user_2fa_recovery_codes (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_used (used)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_user_2fa_recovery_codes erstellt");
        // Device Tracking
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_user_devices (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            device_fingerprint VARCHAR(255) NOT NULL,
            device_name VARCHAR(255),
            device_type VARCHAR(50),
            browser VARCHAR(100),
            os VARCHAR(100),
            ip_address VARCHAR(45),
            user_agent TEXT,
            is_trusted BOOLEAN DEFAULT FALSE,
            last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_device (user_id, device_fingerprint),
            INDEX idx_user_id (user_id),
            INDEX idx_device_fingerprint (device_fingerprint),
            INDEX idx_last_used (last_used_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_user_devices erstellt");
        // Login History
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_login_history (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            device_id BIGINT,
            location_country VARCHAR(100),
            location_city VARCHAR(100),
            location_coordinates VARCHAR(50),
            status ENUM('success', 'failed', 'blocked', 'locked') NOT NULL,
            failure_reason VARCHAR(255),
            risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
            risk_factors JSON,
            session_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            FOREIGN KEY (device_id) REFERENCES lopez_user_devices(id) ON DELETE SET NULL,
            INDEX idx_user_id (user_id),
            INDEX idx_status (status),
            INDEX idx_risk_level (risk_level),
            INDEX idx_created_at (created_at),
            INDEX idx_ip_address (ip_address)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_login_history erstellt");
        // Security Events (für Risk Detection)
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_security_events (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT,
            event_type VARCHAR(100) NOT NULL,
            severity ENUM('info', 'low', 'medium', 'high', 'critical') DEFAULT 'info',
            ip_address VARCHAR(45),
            user_agent TEXT,
            device_id BIGINT,
            details JSON,
            resolved BOOLEAN DEFAULT FALSE,
            resolved_at TIMESTAMP NULL,
            resolved_by BIGINT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            FOREIGN KEY (device_id) REFERENCES lopez_user_devices(id) ON DELETE SET NULL,
            FOREIGN KEY (resolved_by) REFERENCES lopez_users(id) ON DELETE SET NULL,
            INDEX idx_user_id (user_id),
            INDEX idx_event_type (event_type),
            INDEX idx_severity (severity),
            INDEX idx_resolved (resolved),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_security_events erstellt");
        // Account Lockouts
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS lopez_account_lockouts (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT NOT NULL,
            reason VARCHAR(255) NOT NULL,
            failed_attempts INT DEFAULT 0,
            locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            unlocks_at TIMESTAMP NOT NULL,
            unlocked_at TIMESTAMP NULL,
            unlocked_by BIGINT,
            ip_address VARCHAR(45),
            FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
            FOREIGN KEY (unlocked_by) REFERENCES lopez_users(id) ON DELETE SET NULL,
            INDEX idx_user_id (user_id),
            INDEX idx_unlocks_at (unlocks_at),
            INDEX idx_locked_at (locked_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log("✅ Tabelle lopez_account_lockouts erstellt");
        console.log("✅ Enterprise++ Security Phase 2 Tabellen erstellt");
        console.log("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert");
    } catch (error) {
        console.error("❌ Datenbank-Initialisierungsfehler:", error);
        // Foreign Key Checks wieder aktivieren auch bei Fehler
        try {
            await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
        } catch (e) {
        // Ignorieren
        }
        throw error;
    } finally{
        // Foreign Key Checks wieder aktivieren
        try {
            await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
        } catch (e) {
        // Ignorieren
        }
        // Connection immer freigeben
        connection.release();
    }
}
async function closeConnection() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log("✅ MySQL Connection Pool geschlossen");
    }
}
async function generateKundennummer() {
    const pool = await getConnection();
    const connection = await pool.getConnection();
    try {
        // Format: KD-YYYYMMDD-XXXXX (z.B. KD-20251201-00001)
        // Mit Auto-Increment pro Tag für bessere Lesbarkeit
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const datePrefix = `KD-${year}${month}${day}`;
        // Nächste Nummer für diesen Tag ermitteln (mit FOR UPDATE für Race-Condition-Schutz)
        const [rows] = await connection.execute(`SELECT MAX(CAST(SUBSTRING(kundennummer, 13) AS UNSIGNED)) as max_num 
       FROM lopez_customers 
       WHERE kundennummer LIKE ?
       FOR UPDATE`, [
            `${datePrefix}-%`
        ]);
        const maxNum = rows[0]?.max_num || 0;
        const nextNum = maxNum + 1;
        // Format: KD-YYYYMMDD-XXXXX (z.B. KD-20251201-00001)
        return `${datePrefix}-${String(nextNum).padStart(5, "0")}`;
    } catch (error) {
        console.error("❌ Kundennummer-Generierung fehlgeschlagen:", error);
        // Fallback: Timestamp + Zufallszahl für garantierte Eindeutigkeit
        const now = new Date();
        const timestamp = now.getTime();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        return `KD-${timestamp}-${random}`;
    } finally{
        // Connection immer freigeben
        connection.release();
    }
}
}),
"[project]/src/lib/agent-system.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ AGENT-SYSTEM – PLAN • BUILD • RUN
// =====================================================
// Erstellt: 2025-12-02
// Aktualisiert: 2025-12-02
// Zweck: IBM / SAP / Siemens Standard – Prozessbasierte Modulsteuerung
// Status: ✅ ENTERPRISE++ IMPLEMENTIERT
// =====================================================
// 
// Agent-System nach Enterprise-Standard:
// - Agent-Plan: Analyse, Anforderungen, Roadmap, SOLL-Definition
// - Agent-Build: Umsetzung, Entwicklung, IST-Erfassung, Module bauen
// - Agent-Run: Qualitätssicherung, Tests, Betrieb, Freigaben
// =====================================================
__turbopack_context__.s([
    "AgentSystemService",
    ()=>AgentSystemService,
    "IST_PROGRESS_VALUES",
    ()=>IST_PROGRESS_VALUES,
    "MODULE_RISK_CONFIG",
    ()=>MODULE_RISK_CONFIG,
    "SOLL_MODULE_LIST",
    ()=>SOLL_MODULE_LIST,
    "agentLogger",
    ()=>agentLogger,
    "ensureModuleProgressDefaults",
    ()=>ensureModuleProgressDefaults,
    "normalizeDependsOn",
    ()=>normalizeDependsOn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
function normalizeDependsOn(dependsOnRaw) {
    if (dependsOnRaw === null || dependsOnRaw === undefined || dependsOnRaw === "") {
        return [];
    }
    if (Array.isArray(dependsOnRaw)) {
        return dependsOnRaw.filter((d)=>typeof d === "string");
    }
    if (typeof dependsOnRaw === "string") {
        try {
            const parsed = JSON.parse(dependsOnRaw);
            if (Array.isArray(parsed)) {
                return parsed.filter((d)=>typeof d === "string");
            }
        } catch  {
        // Ungültiges JSON -> leeres Array
        }
    }
    return [];
}
function ensureModuleProgressDefaults(registryRow, progressRow) {
    const hasProgressEntry = progressRow !== undefined && progressRow !== null;
    return {
        id: registryRow.id,
        module_name: registryRow.module_name || "Unknown",
        category: registryRow.category || "Uncategorized",
        priority: registryRow.priority || "medium",
        soll_status: registryRow.soll_status || "planned",
        priority_level: registryRow.priority_level || "P2",
        maturity_level: hasProgressEntry ? registryRow.maturity_level || "M0" : "M0",
        risk_level: hasProgressEntry ? registryRow.risk_level || "medium" : "medium",
        depends_on: normalizeDependsOn(registryRow.depends_on),
        go_live_required: Boolean(registryRow.go_live_required),
        progress_percent: hasProgressEntry ? progressRow?.progress_percent ?? 0 : 0,
        ist_status: hasProgressEntry ? progressRow?.ist_status ?? "open" : "open",
        responsible_agent: hasProgressEntry ? progressRow?.responsible_agent ?? "plan" : "plan",
        comment: hasProgressEntry ? progressRow?.comment ?? "" : "",
        has_progress_entry: hasProgressEntry
    };
}
const agentLogger = {
    debug: (message, data)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.log(`[AGENT-DEBUG] ${message}`, data || "");
        }
    },
    info: (message, data)=>{
        console.log(`[AGENT-INFO] ${message}`, data || "");
    },
    warn: (message, data)=>{
        console.warn(`[AGENT-WARN] ${message}`, data || "");
    },
    error: (message, error, data)=>{
        console.error(`[AGENT-ERROR] ${message}`, error instanceof Error ? error.message : error, data || "");
    }
};
const SOLL_MODULE_LIST = [
    // =====================================================
    // 1. Admin & Core Platform (ADM-01 bis ADM-07)
    // =====================================================
    {
        category: "Admin & Core Platform",
        module_name: "ADM-01 Admin-Dashboard",
        description: "Zentrales Admin-Dashboard mit Kacheln, Statusübersichten und Schnellzugriffen.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-02 Benutzerverwaltung",
        description: "Benutzer anlegen, bearbeiten, sperren, Passwortrücksetzung.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-03 Rollen & Rechte (RBAC/ABAC)",
        description: "Rollen definieren, Rechte zuweisen, Policy-Logik für RBAC/ABAC.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-04 2FA & Session-Management",
        description: "2FA-Integration (z. B. Aegis), Session-Übersicht, IP-Bindung, Session-Logout.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-05 Audit-Logs",
        description: "Protokollierung sicherheitsrelevanter Aktionen, einsehbar im Admin.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-06 Dynamic Settings",
        description: "Zentrales Settings-System (Firma, Domains, Limits, AI-Provider, Mail, etc.).",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Admin & Core Platform",
        module_name: "ADM-07 Modul-Registry (SOLL/IST)",
        description: "Verwaltung aller Module inkl. Kategorie, Status, Priorität und Agent-Zuordnung.",
        priority: "high",
        soll_status: "required"
    },
    // =====================================================
    // 2. Kunden & Projekte (KP-01 bis KP-05)
    // =====================================================
    {
        category: "Kunden & Projekte",
        module_name: "KP-01 Kundenliste",
        description: "Übersicht aller Kunden mit Filter- und Suchfunktionen.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Kunden & Projekte",
        module_name: "KP-02 Kundenstammdaten",
        description: "Verwaltung von Firmendaten, Ansprechpartnern, Adressen und Kontaktdaten.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Kunden & Projekte",
        module_name: "KP-03 Projekte pro Kunde",
        description: "Zuordnung und Verwaltung von Projekten je Kunde inkl. Status.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Kunden & Projekte",
        module_name: "KP-04 Projekt-Fortschritts-Tracking",
        description: "Projektfortschritt, Deadlines und Status (Ampel) je Projekt.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Kunden & Projekte",
        module_name: "KP-05 Projekt-Notizen & Dateien",
        description: "Interne Notizen und verknüpfte Dateien je Projekt.",
        priority: "medium",
        soll_status: "planned"
    },
    // =====================================================
    // 3. Support & Kommunikation (SUP-01 bis SUP-04)
    // =====================================================
    {
        category: "Support & Kommunikation",
        module_name: "SUP-01 Support-Tickets",
        description: "Ticket-System mit Status, Priorität, Zuweisung und Historie.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Support & Kommunikation",
        module_name: "SUP-02 Kontakt-Nachrichten",
        description: "Eingehende Kontaktformular-Anfragen von der Website im Admin anzeigen.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Support & Kommunikation",
        module_name: "SUP-03 E-Mail-Templates",
        description: "Verwaltung von Standard-E-Mail-Texten für Bestätigungen und Benachrichtigungen.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Support & Kommunikation",
        module_name: "SUP-04 Benachrichtigungssystem (Admin)",
        description: "Badges, Hinweise und interne Benachrichtigungen im Admin-Dashboard.",
        priority: "medium",
        soll_status: "planned"
    },
    // =====================================================
    // 4. Inhalte & Medien (MED-01 bis MED-05)
    // =====================================================
    {
        category: "Inhalte & Medien",
        module_name: "MED-01 Medienbibliothek",
        description: "Übersicht aller hochgeladenen Medien inkl. Filter und Suche.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Inhalte & Medien",
        module_name: "MED-02 Sicherer Dateispeicher",
        description: "ID-basierte Dateistruktur, keine Klartext-Dateinamen, kein Directory Listing.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Inhalte & Medien",
        module_name: "MED-03 Media-KI Analyse",
        description: "Automatische KI-Analyse von Medien, inkl. Tags und DSGVO-Flags.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Inhalte & Medien",
        module_name: "MED-04 Meta-Daten-Verwaltung",
        description: "Verwaltung von meta.json + DB-Feldern (Titel, Beschreibung, KI-Ergebnis).",
        priority: "medium",
        soll_status: "required"
    },
    {
        category: "Inhalte & Medien",
        module_name: "MED-05 Medien-Zuordnung",
        description: "Verknüpfung von Medien mit Projekten, Kunden, Beiträgen usw.",
        priority: "medium",
        soll_status: "planned"
    },
    // =====================================================
    // 5. AI Center (AI-01 bis AI-05)
    // =====================================================
    {
        category: "AI Center",
        module_name: "AI-01 Customer Insights",
        description: "Auswertung von Kundenhistorien (Tickets, Projekte, Rechnungen) mit KI.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "AI Center",
        module_name: "AI-02 Project Analyzer",
        description: "Analyse von Projektstatus und Risiken basierend auf SOLL/IST und Texten.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "AI Center",
        module_name: "AI-03 Invoice Assistant",
        description: "KI-Unterstützung zur Prüfung von Rechnungen und Positionen.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "AI Center",
        module_name: "AI-04 Executive Reports",
        description: "KI-generierte Management-Reports (Woche, Monat, Risiko, Auslastung).",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "AI Center",
        module_name: "AI-05 AI Cost & Provider Control",
        description: "Kostenkontrolle, Provider-Auswahl und Limits für KI-Provider.",
        priority: "high",
        soll_status: "required"
    },
    // =====================================================
    // 6. Finanzen & Rechnungen (FIN-01 bis FIN-05)
    // =====================================================
    {
        category: "Finanzen & Rechnungen",
        module_name: "FIN-01 Rechnungsmodul Basis",
        description: "Rechnungen anlegen, speichern, PDF-Erzeugung.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Finanzen & Rechnungen",
        module_name: "FIN-02 Produkt- und Dienstleistungskatalog",
        description: "Verwaltung von Leistungen, Produkten, Preisen und Stundensätzen.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Finanzen & Rechnungen",
        module_name: "FIN-03 Angebotsverwaltung",
        description: "Angebote erstellen, versionieren und in Rechnungen umwandeln.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Finanzen & Rechnungen",
        module_name: "FIN-04 Zahlungstracking",
        description: "Offen, teilweise bezahlt, bezahlt, überfällig – inkl. Übersicht.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Finanzen & Rechnungen",
        module_name: "FIN-05 Export (CSV/PDF)",
        description: "Export von Rechnungs- und Finanzdaten (CSV/PDF) für Steuer/Buchhaltung.",
        priority: "medium",
        soll_status: "planned"
    },
    // =====================================================
    // 7. Öffentliche Website (WEB-01 bis WEB-05)
    // =====================================================
    {
        category: "Öffentliche Website",
        module_name: "WEB-01 Landingpage Lopez IT Welt",
        description: "Startseite mit USP, Kernleistungen und Call-to-Action.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Öffentliche Website",
        module_name: "WEB-02 Leistungsseiten",
        description: "Detailseiten für Leistungen wie Webentwicklung, KI, Systemintegration, Hardware.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Öffentliche Website",
        module_name: "WEB-03 Referenzen & Projekte",
        description: "Optional: Case-Studies und Referenzen, später erweiterbar.",
        priority: "low",
        soll_status: "planned"
    },
    {
        category: "Öffentliche Website",
        module_name: "WEB-04 Kontaktseite mit Formular",
        description: "Kontaktformular mit DSGVO-Hinweis und Anbindung an SUP-02.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Öffentliche Website",
        module_name: "WEB-05 Rechtliche Seiten",
        description: "Impressum, Datenschutzerklärung, Cookie-/Hinweisbanner.",
        priority: "high",
        soll_status: "required"
    },
    // =====================================================
    // 8. Kundenportal & Shop (PORT-01 bis PORT-03, SHOP-01 bis SHOP-04)
    // =====================================================
    {
        category: "Kundenportal & Shop",
        module_name: "PORT-01 Kunden-Login & Registrierung",
        description: "Registrierung und Login für Kunden inkl. E-Mail-Bestätigung.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "PORT-02 Kundenprofil",
        description: "Verwaltung von Unternehmensdaten, Ansprechpartnern und Adressen im Portal.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "PORT-03 Kunden-Dashboard",
        description: "Übersicht über Projekte, Rechnungen, Tickets und Angebote im Portal.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "SHOP-01 Produktverwaltung (Shop)",
        description: "Verwaltung der Shop-Produkte, Preise und Kategorien.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "SHOP-02 Warenkorb & Bestellprozess",
        description: "Auswahl von Produkten, Warenkorb, Checkout-Prozess.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "SHOP-03 Bestellhistorie & Status",
        description: "Übersicht vergangener Bestellungen inkl. Status.",
        priority: "low",
        soll_status: "planned"
    },
    {
        category: "Kundenportal & Shop",
        module_name: "SHOP-04 Zahlungsarten (Phase 2)",
        description: "Integration von Zahlungsarten (Rechnung, SEPA, Stripe/PayPal) in späterer Phase.",
        priority: "low",
        soll_status: "planned"
    },
    // =====================================================
    // 9. Server, Sicherheit & Betrieb (OPS-01 bis OPS-05)
    // =====================================================
    {
        category: "Server, Sicherheit & Betrieb",
        module_name: "OPS-01 Netcup Debian 12 Grundsetup",
        description: "Grundhärtung, Benutzer, SSH, Firewall, Basis-Security.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Server, Sicherheit & Betrieb",
        module_name: "OPS-02 Deployment-Pipeline",
        description: "Automatisierter oder halbautomatischer Deploy von lokal nach Netcup (Staging/Prod).",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Server, Sicherheit & Betrieb",
        module_name: "OPS-03 Monitoring & Health Checks",
        description: "Basic-Monitoring für Erreichbarkeit und Fehlerstatus der Dienste.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Server, Sicherheit & Betrieb",
        module_name: "OPS-04 Backup & Restore",
        description: "Strategie und Umsetzung für DB- und Dateibackups inkl. Restore-Test.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Server, Sicherheit & Betrieb",
        module_name: "OPS-05 Logging & Fehler-Monitoring",
        description: "Zentrales Error-Logging und Auswertung (z. B. später Sentry o. ä.).",
        priority: "medium",
        soll_status: "planned"
    },
    // =====================================================
    // 10. Dokumentation & Compliance (DOC-01 bis DOC-05)
    // =====================================================
    {
        category: "Dokumentation & Compliance",
        module_name: "DOC-01 System-Dokumentation",
        description: "Technische Architektur, Komponenten, Schnittstellen, Datenmodell.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Dokumentation & Compliance",
        module_name: "DOC-02 Admin-Handbuch",
        description: "Anleitung für Admins zur Nutzung von Kunden-, Projekt- und Rechnungsmodul.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Dokumentation & Compliance",
        module_name: "DOC-03 Betriebsdokumentation",
        description: "Deploy-Anleitung, Backup-Konzept, Notfallplan, Server-Doku.",
        priority: "medium",
        soll_status: "planned"
    },
    {
        category: "Dokumentation & Compliance",
        module_name: "DOC-04 DSGVO-Dokumentation",
        description: "Verarbeitungsverzeichnis, Datenflüsse, TOMs, Auftragsverarbeitung.",
        priority: "high",
        soll_status: "required"
    },
    {
        category: "Dokumentation & Compliance",
        module_name: "DOC-05 Changelog & STATUS",
        description: "Pflege von docs/STATUS.md, docs/CHANGELOG.md inkl. Sync zur DB.",
        priority: "medium",
        soll_status: "required"
    }
];
const MODULE_RISK_CONFIG = {
    // ===== P0 - KRITISCH (Go-Live-blockierend) =====
    "ADM-02 Benutzerverwaltung": {
        priority_level: "P0",
        depends_on: [],
        go_live_required: true
    },
    "ADM-03 Rollen & Rechte (RBAC/ABAC)": {
        priority_level: "P0",
        depends_on: [
            "ADM-02 Benutzerverwaltung"
        ],
        go_live_required: true
    },
    "ADM-04 2FA & Session-Management": {
        priority_level: "P0",
        depends_on: [
            "ADM-02 Benutzerverwaltung",
            "ADM-03 Rollen & Rechte (RBAC/ABAC)"
        ],
        go_live_required: true
    },
    "ADM-05 Audit-Logs": {
        priority_level: "P0",
        depends_on: [
            "ADM-02 Benutzerverwaltung"
        ],
        go_live_required: true
    },
    "ADM-07 Modul-Registry (SOLL/IST)": {
        priority_level: "P0",
        depends_on: [],
        go_live_required: true
    },
    "OPS-01 Netcup Debian 12 Grundsetup": {
        priority_level: "P0",
        depends_on: [],
        go_live_required: true
    },
    "OPS-04 Backup & Restore": {
        priority_level: "P0",
        depends_on: [
            "OPS-01 Netcup Debian 12 Grundsetup"
        ],
        go_live_required: true
    },
    "DOC-04 DSGVO-Dokumentation": {
        priority_level: "P0",
        depends_on: [],
        go_live_required: true
    },
    "WEB-05 Rechtliche Seiten": {
        priority_level: "P0",
        depends_on: [
            "WEB-01 Landingpage Lopez IT Welt"
        ],
        go_live_required: true
    },
    "FIN-01 Rechnungsmodul Basis": {
        priority_level: "P0",
        depends_on: [
            "KP-01 Kundenliste"
        ],
        go_live_required: true
    },
    // ===== P1 - WICHTIG (Go-Live Kernfunktion) =====
    "ADM-01 Admin-Dashboard": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "ADM-06 Dynamic Settings": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "KP-01 Kundenliste": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "KP-02 Kundenstammdaten": {
        priority_level: "P1",
        depends_on: [
            "KP-01 Kundenliste"
        ],
        go_live_required: true
    },
    "KP-03 Projekte pro Kunde": {
        priority_level: "P1",
        depends_on: [
            "KP-01 Kundenliste"
        ],
        go_live_required: true
    },
    "KP-04 Projekt-Fortschritts-Tracking": {
        priority_level: "P1",
        depends_on: [
            "KP-03 Projekte pro Kunde"
        ],
        go_live_required: true
    },
    "MED-01 Medienbibliothek": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "MED-02 Sicherer Dateispeicher": {
        priority_level: "P1",
        depends_on: [
            "MED-01 Medienbibliothek"
        ],
        go_live_required: true
    },
    "MED-03 Media-KI Analyse": {
        priority_level: "P1",
        depends_on: [
            "MED-01 Medienbibliothek",
            "MED-02 Sicherer Dateispeicher"
        ],
        go_live_required: true
    },
    "MED-04 Meta-Daten-Verwaltung": {
        priority_level: "P1",
        depends_on: [
            "MED-01 Medienbibliothek"
        ],
        go_live_required: true
    },
    "AI-02 Project Analyzer": {
        priority_level: "P1",
        depends_on: [
            "ADM-07 Modul-Registry (SOLL/IST)",
            "KP-03 Projekte pro Kunde"
        ],
        go_live_required: true
    },
    "AI-05 AI Cost & Provider Control": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "WEB-01 Landingpage Lopez IT Welt": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "WEB-04 Kontaktseite mit Formular": {
        priority_level: "P1",
        depends_on: [
            "WEB-01 Landingpage Lopez IT Welt",
            "SUP-02 Kontakt-Nachrichten"
        ],
        go_live_required: true
    },
    "PORT-01 Kunden-Login & Registrierung": {
        priority_level: "P1",
        depends_on: [
            "ADM-02 Benutzerverwaltung"
        ],
        go_live_required: true
    },
    "OPS-02 Deployment-Pipeline": {
        priority_level: "P1",
        depends_on: [
            "OPS-01 Netcup Debian 12 Grundsetup"
        ],
        go_live_required: true
    },
    "OPS-03 Monitoring & Health Checks": {
        priority_level: "P1",
        depends_on: [
            "OPS-01 Netcup Debian 12 Grundsetup"
        ],
        go_live_required: true
    },
    "OPS-05 Logging & Fehler-Monitoring": {
        priority_level: "P1",
        depends_on: [
            "OPS-01 Netcup Debian 12 Grundsetup"
        ],
        go_live_required: true
    },
    "DOC-01 System-Dokumentation": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "DOC-03 Betriebsdokumentation": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "DOC-05 Changelog & STATUS": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    "SUP-02 Kontakt-Nachrichten": {
        priority_level: "P1",
        depends_on: [],
        go_live_required: true
    },
    // ===== P2 - NICE-TO-HAVE (kurzfristig nach Go-Live) =====
    "SUP-01 Support-Tickets": {
        priority_level: "P2",
        depends_on: [
            "KP-01 Kundenliste"
        ],
        go_live_required: false
    },
    "SUP-03 E-Mail-Templates": {
        priority_level: "P2",
        depends_on: [],
        go_live_required: false
    },
    "SUP-04 Benachrichtigungssystem (Admin)": {
        priority_level: "P2",
        depends_on: [],
        go_live_required: false
    },
    "KP-05 Projekt-Notizen & Dateien": {
        priority_level: "P2",
        depends_on: [
            "KP-03 Projekte pro Kunde"
        ],
        go_live_required: false
    },
    "AI-01 Customer Insights": {
        priority_level: "P2",
        depends_on: [
            "KP-01 Kundenliste"
        ],
        go_live_required: false
    },
    "AI-03 Invoice Assistant": {
        priority_level: "P2",
        depends_on: [
            "FIN-01 Rechnungsmodul Basis"
        ],
        go_live_required: false
    },
    "AI-04 Executive Reports": {
        priority_level: "P2",
        depends_on: [],
        go_live_required: false
    },
    "FIN-02 Produkt- und Dienstleistungskatalog": {
        priority_level: "P2",
        depends_on: [],
        go_live_required: false
    },
    "FIN-03 Angebotsverwaltung": {
        priority_level: "P2",
        depends_on: [
            "FIN-02 Produkt- und Dienstleistungskatalog"
        ],
        go_live_required: false
    },
    "FIN-04 Zahlungstracking": {
        priority_level: "P2",
        depends_on: [
            "FIN-01 Rechnungsmodul Basis"
        ],
        go_live_required: false
    },
    "FIN-05 Export (CSV/PDF)": {
        priority_level: "P2",
        depends_on: [
            "FIN-01 Rechnungsmodul Basis"
        ],
        go_live_required: false
    },
    "WEB-02 Leistungsseiten": {
        priority_level: "P2",
        depends_on: [
            "WEB-01 Landingpage Lopez IT Welt"
        ],
        go_live_required: false
    },
    "PORT-02 Kundenprofil": {
        priority_level: "P2",
        depends_on: [
            "PORT-01 Kunden-Login & Registrierung"
        ],
        go_live_required: false
    },
    "PORT-03 Kunden-Dashboard": {
        priority_level: "P2",
        depends_on: [
            "PORT-01 Kunden-Login & Registrierung"
        ],
        go_live_required: false
    },
    "SHOP-01 Produktverwaltung (Shop)": {
        priority_level: "P2",
        depends_on: [
            "FIN-02 Produkt- und Dienstleistungskatalog"
        ],
        go_live_required: false
    },
    "SHOP-02 Warenkorb & Bestellprozess": {
        priority_level: "P2",
        depends_on: [
            "SHOP-01 Produktverwaltung (Shop)"
        ],
        go_live_required: false
    },
    "SHOP-03 Bestellhistorie & Status": {
        priority_level: "P2",
        depends_on: [
            "SHOP-02 Warenkorb & Bestellprozess"
        ],
        go_live_required: false
    },
    "MED-05 Medien-Zuordnung": {
        priority_level: "P2",
        depends_on: [
            "MED-01 Medienbibliothek"
        ],
        go_live_required: false
    },
    "DOC-02 Admin-Handbuch": {
        priority_level: "P2",
        depends_on: [],
        go_live_required: false
    },
    // ===== P3 - SPÄTERE OPTIMIERUNGEN =====
    "WEB-03 Referenzen & Projekte": {
        priority_level: "P3",
        depends_on: [
            "WEB-01 Landingpage Lopez IT Welt"
        ],
        go_live_required: false
    },
    "SHOP-04 Zahlungsarten (Phase 2)": {
        priority_level: "P3",
        depends_on: [
            "SHOP-02 Warenkorb & Bestellprozess"
        ],
        go_live_required: false
    }
};
const IST_PROGRESS_VALUES = {
    // Admin & Core Platform
    "ADM-01 Admin-Dashboard": 80,
    "ADM-02 Benutzerverwaltung": 60,
    "ADM-03 Rollen & Rechte (RBAC/ABAC)": 70,
    "ADM-04 2FA & Session-Management": 90,
    "ADM-05 Audit-Logs": 80,
    "ADM-06 Dynamic Settings": 50,
    "ADM-07 Modul-Registry (SOLL/IST)": 100,
    // Inhalte & Medien
    "MED-01 Medienbibliothek": 70,
    "MED-02 Sicherer Dateispeicher": 90,
    "MED-03 Media-KI Analyse": 85,
    "MED-04 Meta-Daten-Verwaltung": 70,
    "MED-05 Medien-Zuordnung": 0,
    // AI Center
    "AI-01 Customer Insights": 0,
    "AI-02 Project Analyzer": 30,
    "AI-03 Invoice Assistant": 0,
    "AI-04 Executive Reports": 10,
    "AI-05 AI Cost & Provider Control": 60,
    // Kunden & Projekte
    "KP-01 Kundenliste": 80,
    "KP-02 Kundenstammdaten": 70,
    "KP-03 Projekte pro Kunde": 80,
    "KP-04 Projekt-Fortschritts-Tracking": 30,
    "KP-05 Projekt-Notizen & Dateien": 0,
    // Support & Kommunikation
    "SUP-01 Support-Tickets": 30,
    "SUP-02 Kontakt-Nachrichten": 90,
    "SUP-03 E-Mail-Templates": 0,
    "SUP-04 Benachrichtigungssystem (Admin)": 20,
    // Finanzen & Rechnungen
    "FIN-01 Rechnungsmodul Basis": 85,
    "FIN-02 Produkt- und Dienstleistungskatalog": 0,
    "FIN-03 Angebotsverwaltung": 0,
    "FIN-04 Zahlungstracking": 0,
    "FIN-05 Export (CSV/PDF)": 0,
    // Öffentliche Website
    "WEB-01 Landingpage Lopez IT Welt": 0,
    "WEB-02 Leistungsseiten": 0,
    "WEB-03 Referenzen & Projekte": 0,
    "WEB-04 Kontaktseite mit Formular": 0,
    "WEB-05 Rechtliche Seiten": 0,
    // Kundenportal & Shop
    "PORT-01 Kunden-Login & Registrierung": 0,
    "PORT-02 Kundenprofil": 0,
    "PORT-03 Kunden-Dashboard": 0,
    "SHOP-01 Produktverwaltung (Shop)": 0,
    "SHOP-02 Warenkorb & Bestellprozess": 0,
    "SHOP-03 Bestellhistorie & Status": 0,
    "SHOP-04 Zahlungsarten (Phase 2)": 0,
    // Server, Sicherheit & Betrieb
    "OPS-01 Netcup Debian 12 Grundsetup": 0,
    "OPS-02 Deployment-Pipeline": 0,
    "OPS-03 Monitoring & Health Checks": 0,
    "OPS-04 Backup & Restore": 0,
    "OPS-05 Logging & Fehler-Monitoring": 0,
    // Dokumentation & Compliance
    "DOC-01 System-Dokumentation": 0,
    "DOC-02 Admin-Handbuch": 0,
    "DOC-03 Betriebsdokumentation": 0,
    "DOC-04 DSGVO-Dokumentation": 0,
    "DOC-05 Changelog & STATUS": 0
};
class AgentSystemService {
    /**
   * Initialisiert alle Agent-System Tabellen
   */ static async initializeTables() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const tablesCreated = [];
        // =====================================================
        // TABLE 1: module_registry (SOLL-Zustand)
        // =====================================================
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS module_registry (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        module_name VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        soll_status ENUM('open', 'planned', 'required') DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_module_name (module_name),
        INDEX idx_category (category),
        INDEX idx_priority (priority),
        INDEX idx_soll_status (soll_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        tablesCreated.push("module_registry");
        console.log("✅ Tabelle module_registry erstellt");
        // =====================================================
        // TABLE 2: module_progress (IST-Zustand)
        // =====================================================
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS module_progress (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        module_id BIGINT NOT NULL,
        ist_status ENUM('open', 'in_progress', 'done') DEFAULT 'open',
        progress_percent INT UNSIGNED DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
        comment TEXT,
        responsible_agent ENUM('plan', 'build', 'run') DEFAULT 'plan',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES module_registry(id) ON DELETE CASCADE,
        UNIQUE KEY uk_module_progress (module_id),
        INDEX idx_ist_status (ist_status),
        INDEX idx_responsible_agent (responsible_agent)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        tablesCreated.push("module_progress");
        console.log("✅ Tabelle module_progress erstellt (PLAN/BUILD/RUN)");
        // =====================================================
        // TABLE 3: agent_tasks (Aufgaben)
        // =====================================================
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS agent_tasks (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_agent ENUM('plan', 'build', 'run') NOT NULL,
        status ENUM('open', 'in_progress', 'done') DEFAULT 'open',
        related_module_id BIGINT NULL,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (related_module_id) REFERENCES module_registry(id) ON DELETE SET NULL,
        INDEX idx_assigned_agent (assigned_agent),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_related_module (related_module_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        tablesCreated.push("agent_tasks");
        console.log("✅ Tabelle agent_tasks erstellt");
        // =====================================================
        // SOLL-Module UPSERT (Insert oder Update)
        // Enterprise++: module_code aus module_name parsen
        // Format: "ADM-01 Admin-Dashboard" → code="ADM-01", name="Admin-Dashboard"
        // =====================================================
        let modulesInserted = 0;
        let modulesUpdated = 0;
        for (const module of SOLL_MODULE_LIST){
            try {
                // Enterprise++: module_code und module_name aus dem kombinierten Namen parsen
                const fullName = module.module_name;
                const spaceIndex = fullName.indexOf(" ");
                const moduleCode = spaceIndex > 0 ? fullName.substring(0, spaceIndex) : fullName;
                const moduleName = spaceIndex > 0 ? fullName.substring(spaceIndex + 1) : fullName;
                // Prüfe ob Modul bereits existiert (per module_code für Eindeutigkeit)
                const [existing] = await pool.execute("SELECT id FROM module_registry WHERE module_code = ?", [
                    moduleCode
                ]);
                if (existing.length === 0) {
                    // NEU: Modul einfügen mit module_code
                    const [result] = await pool.execute(`INSERT INTO module_registry 
             (module_code, module_name, category, description, priority, soll_status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`, [
                        moduleCode,
                        moduleName,
                        module.category,
                        module.description,
                        module.priority,
                        module.soll_status
                    ]);
                    const moduleId = result.insertId;
                    // IST-Zustand initial anlegen (open, 0%) - Start bei PLAN
                    await pool.execute(`INSERT INTO module_progress 
             (module_id, ist_status, progress_percent, comment, responsible_agent)
             VALUES (?, 'open', 0, 'Noch nicht gestartet', 'plan')
             ON DUPLICATE KEY UPDATE updated_at = NOW()`, [
                        moduleId
                    ]);
                    modulesInserted++;
                    console.log(`✅ NEU: [${moduleCode}] "${moduleName}"`);
                } else {
                    // UPDATE: Nur SOLL-Daten aktualisieren (module_name, category, description, priority, soll_status)
                    // NICHT: IST-Status, Fortschritt, Agent-Zuordnung
                    await pool.execute(`UPDATE module_registry 
             SET module_name = ?, category = ?, description = ?, priority = ?, soll_status = ?, updated_at = NOW()
             WHERE module_code = ?`, [
                        moduleName,
                        module.category,
                        module.description,
                        module.priority,
                        module.soll_status,
                        moduleCode
                    ]);
                    modulesUpdated++;
                    console.log(`🔄 UPDATE: [${moduleCode}] "${moduleName}"`);
                }
            } catch (error) {
                console.warn(`⚠️ Modul "${module.module_name}" Fehler:`, error);
            }
        }
        console.log(`📋 SOLL-Module: ${modulesInserted} neu, ${modulesUpdated} aktualisiert`);
        // =====================================================
        // MIGRATION: agent_a/b/c → plan/build/run
        // =====================================================
        let migrated = 0;
        try {
            // Prüfe ob alte ENUM-Werte existieren
            const [oldProgress] = await pool.execute("SELECT COUNT(*) as count FROM module_progress WHERE responsible_agent IN ('agent_a', 'agent_b', 'agent_c')");
            const oldProgressCount = oldProgress[0]?.count || 0;
            if (oldProgressCount > 0) {
                // Migration durchführen
                await pool.execute("UPDATE module_progress SET responsible_agent = 'plan' WHERE responsible_agent = 'agent_a'");
                await pool.execute("UPDATE module_progress SET responsible_agent = 'build' WHERE responsible_agent = 'agent_b'");
                await pool.execute("UPDATE module_progress SET responsible_agent = 'run' WHERE responsible_agent = 'agent_c'");
                migrated += oldProgressCount;
                console.log(`✅ ${oldProgressCount} module_progress Einträge migriert`);
            }
            const [oldTasks] = await pool.execute("SELECT COUNT(*) as count FROM agent_tasks WHERE assigned_agent IN ('agent_a', 'agent_b', 'agent_c')");
            const oldTasksCount = oldTasks[0]?.count || 0;
            if (oldTasksCount > 0) {
                await pool.execute("UPDATE agent_tasks SET assigned_agent = 'plan' WHERE assigned_agent = 'agent_a'");
                await pool.execute("UPDATE agent_tasks SET assigned_agent = 'build' WHERE assigned_agent = 'agent_b'");
                await pool.execute("UPDATE agent_tasks SET assigned_agent = 'run' WHERE assigned_agent = 'agent_c'");
                migrated += oldTasksCount;
                console.log(`✅ ${oldTasksCount} agent_tasks Einträge migriert`);
            }
        } catch (migrationError) {
            console.log("ℹ️ Keine Migration nötig (neue Struktur bereits aktiv)");
        }
        const totalModules = modulesInserted + modulesUpdated;
        console.log(`✅ Enterprise++ Module Registry seeding completed: ${totalModules} modules upserted.`);
        console.log(`   → ${modulesInserted} neu eingefügt, ${modulesUpdated} aktualisiert, ${migrated} Agent-Zuordnungen migriert`);
        return {
            tablesCreated,
            modulesInserted,
            modulesUpdated,
            migrated,
            totalModules
        };
    }
    /**
   * Setzt die realen IST-Fortschritte für alle Module (UPSERT)
   * Enterprise++: Sucht per module_code (extrahiert aus dem Key)
   */ static async seedModuleProgress() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        let updated = 0;
        let inserted = 0;
        let skipped = 0;
        for (const [moduleName, progress] of Object.entries(IST_PROGRESS_VALUES)){
            try {
                // Enterprise++: module_code aus dem Key extrahieren (Format: "ADM-01 Admin-Dashboard")
                const spaceIndex = moduleName.indexOf(" ");
                const moduleCode = spaceIndex > 0 ? moduleName.substring(0, spaceIndex) : moduleName;
                // Finde die module_id per module_code
                const [moduleRows] = await pool.execute("SELECT id FROM module_registry WHERE module_code = ?", [
                    moduleCode
                ]);
                if (moduleRows.length === 0) {
                    console.warn(`⚠️ Modul nicht gefunden: [${moduleCode}] "${moduleName}"`);
                    skipped++;
                    continue;
                }
                const moduleId = moduleRows[0].id;
                // Prüfe ob module_progress Eintrag existiert
                const [progressRows] = await pool.execute("SELECT id FROM module_progress WHERE module_id = ?", [
                    moduleId
                ]);
                // Bestimme ist_status basierend auf progress
                let istStatus = "open";
                if (progress >= 100) {
                    istStatus = "done";
                } else if (progress > 0) {
                    istStatus = "in_progress";
                }
                // Bestimme Agent basierend auf Fortschritt (PLAN → BUILD → RUN)
                let agent = "plan";
                if (progress >= 80) {
                    agent = "run"; // QA/Betrieb Phase
                } else if (progress >= 30) {
                    agent = "build"; // Entwicklung Phase
                }
                if (progressRows.length === 0) {
                    // INSERT neuen Eintrag
                    await pool.execute(`INSERT INTO module_progress 
             (module_id, ist_status, progress_percent, comment, responsible_agent, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW())`, [
                        moduleId,
                        istStatus,
                        progress,
                        progress === 0 ? "Noch nicht gestartet" : `IST-Stand: ${progress}%`,
                        agent
                    ]);
                    inserted++;
                    console.log(`📥 INSERT: "${moduleName}" → ${progress}% (${agent})`);
                } else {
                    // UPDATE existierenden Eintrag
                    await pool.execute(`UPDATE module_progress 
             SET ist_status = ?, progress_percent = ?, 
                 comment = ?, responsible_agent = ?, updated_at = NOW()
             WHERE module_id = ?`, [
                        istStatus,
                        progress,
                        progress === 0 ? "Noch nicht gestartet" : `IST-Stand: ${progress}%`,
                        agent,
                        moduleId
                    ]);
                    updated++;
                    console.log(`🔄 UPDATE: "${moduleName}" → ${progress}% (${agent})`);
                }
            } catch (error) {
                console.error(`❌ Fehler bei "${moduleName}":`, error);
                skipped++;
            }
        }
        console.log(`✅ IST-Fortschritte gesetzt: ${updated} aktualisiert, ${inserted} neu, ${skipped} übersprungen`);
        return {
            updated,
            inserted,
            skipped
        };
    }
    /**
   * Erweitert module_registry um Enterprise++ Risiko-Felder
   */ static async extendModuleRegistrySchema() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        try {
            // Prüfe ob Spalten bereits existieren
            const [columns] = await pool.execute("SHOW COLUMNS FROM module_registry LIKE 'priority_level'");
            if (columns.length === 0) {
                // Spalten hinzufügen
                await pool.execute(`
          ALTER TABLE module_registry 
          ADD COLUMN priority_level ENUM('P0','P1','P2','P3') DEFAULT 'P2' AFTER priority,
          ADD COLUMN maturity_level ENUM('M0','M1','M2','M3','M4','M5') DEFAULT 'M0' AFTER priority_level,
          ADD COLUMN risk_level ENUM('critical','high','medium','low') DEFAULT 'medium' AFTER maturity_level,
          ADD COLUMN depends_on JSON NULL AFTER risk_level,
          ADD COLUMN go_live_required BOOLEAN DEFAULT FALSE AFTER depends_on
        `);
                console.log("✅ module_registry erweitert (priority_level, maturity_level, risk_level, depends_on, go_live_required)");
            } else {
                console.log("ℹ️ module_registry bereits erweitert");
            }
            return true;
        } catch (error) {
            console.error("❌ Fehler beim Erweitern von module_registry:", error);
            return false;
        }
    }
    /**
   * Berechnet Maturity Level aus Progress Percent
   */ static calculateMaturityLevel(progressPercent) {
        if (progressPercent === 0) return "M0";
        if (progressPercent <= 10) return "M1";
        if (progressPercent <= 30) return "M2";
        if (progressPercent <= 60) return "M3";
        if (progressPercent <= 90) return "M4";
        return "M5";
    }
    /**
   * Berechnet Risk Level aus Priority + Maturity
   */ static calculateRiskLevel(priorityLevel, maturityLevel) {
        const maturityValue = parseInt(maturityLevel.substring(1)); // M0 -> 0, M5 -> 5
        const priorityValue = parseInt(priorityLevel.substring(1)); // P0 -> 0, P3 -> 3
        // Critical: P0 und M0-M2
        if (priorityValue === 0 && maturityValue <= 2) return "critical";
        // High: (P0 und M3) oder (P1 und M0-M2)
        if (priorityValue === 0 && maturityValue === 3 || priorityValue === 1 && maturityValue <= 2) return "high";
        // Medium: (P1 und M3-M4) oder (P2 und M1-M3)
        if (priorityValue === 1 && maturityValue >= 3 && maturityValue <= 4 || priorityValue === 2 && maturityValue >= 1 && maturityValue <= 3) return "medium";
        // Low: M5 oder (P2/P3 und M4-M5)
        return "low";
    }
    /**
   * Setzt Prioritäten, Reifegrade und Risiken für alle Module
   * ENTERPRISE++: Fehlertolerant - einzelne Update-Fehler werden geloggt, nicht geworfen
   */ static async seedRiskData() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const warnings = [];
        // Schema erweitern falls nötig (fehlertolerant)
        try {
            await this.extendModuleRegistrySchema();
        } catch (schemaError) {
            agentLogger.warn("Schema-Erweiterung in seedRiskData fehlgeschlagen", {
                error: schemaError
            });
            warnings.push("Schema konnte nicht erweitert werden, verwende bestehende Struktur.");
        }
        let updated = 0;
        let failed = 0;
        let criticalCount = 0;
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;
        // Hole alle Module mit Fortschritt
        let modules = [];
        try {
            const [rows] = await pool.execute(`
        SELECT 
          mr.id, mr.module_name,
          COALESCE(mp.progress_percent, 0) as progress_percent
        FROM module_registry mr
        LEFT JOIN module_progress mp ON mr.id = mp.module_id
      `);
            modules = rows;
        } catch (fetchError) {
            agentLogger.error("Fehler beim Abrufen der Module fuer Risiko-Seed", fetchError);
            return {
                updated: 0,
                failed: 0,
                criticalCount: 0,
                highCount: 0,
                mediumCount: 0,
                lowCount: 0,
                warnings: [
                    "Module konnten nicht geladen werden."
                ]
            };
        }
        for (const mod of modules){
            const moduleName = mod.module_name;
            const progressPercent = mod.progress_percent || 0;
            // Risiko-Konfiguration holen oder Default
            const config = MODULE_RISK_CONFIG[moduleName] || {
                priority_level: "P2",
                depends_on: [],
                go_live_required: false
            };
            // Maturity berechnen
            let maturityLevel = this.calculateMaturityLevel(progressPercent);
            // Spezialfaelle
            if (moduleName === "ADM-07 Modul-Registry (SOLL/IST)" && progressPercent >= 90) {
                maturityLevel = "M5";
            }
            if (moduleName === "FIN-01 Rechnungsmodul Basis" && progressPercent >= 80) {
                maturityLevel = "M4";
            }
            // Risk berechnen
            const riskLevel = this.calculateRiskLevel(config.priority_level, maturityLevel);
            // Zaehler aktualisieren (auch bei fehlgeschlagenem Update, da Berechnung korrekt ist)
            switch(riskLevel){
                case "critical":
                    criticalCount++;
                    break;
                case "high":
                    highCount++;
                    break;
                case "medium":
                    mediumCount++;
                    break;
                case "low":
                    lowCount++;
                    break;
            }
            // Update durchfuehren (fehlertolerant)
            try {
                await pool.execute(`UPDATE module_registry SET
            priority_level = ?,
            maturity_level = ?,
            risk_level = ?,
            depends_on = ?,
            go_live_required = ?
          WHERE id = ?`, [
                    config.priority_level,
                    maturityLevel,
                    riskLevel,
                    config.depends_on ? JSON.stringify(config.depends_on) : null,
                    config.go_live_required,
                    mod.id
                ]);
                updated++;
            } catch (updateError) {
                failed++;
                agentLogger.warn(`Fehler beim Aktualisieren von Modul ${moduleName}`, {
                    moduleId: mod.id,
                    error: updateError
                });
            }
        }
        if (failed > 0) {
            warnings.push(`${failed} Module konnten nicht aktualisiert werden.`);
        }
        agentLogger.info(`Risiko-Seed abgeschlossen: ${updated}/${modules.length} Module aktualisiert`, {
            critical: criticalCount,
            high: highCount,
            medium: mediumCount,
            low: lowCount,
            failed
        });
        return {
            updated,
            failed,
            criticalCount,
            highCount,
            mediumCount,
            lowCount,
            warnings
        };
    }
    /**
   * Go-Live-Readiness-Check
   * ENTERPRISE++: Fehlertolerant bei fehlenden module_progress Eintraegen
   */ static async evaluateGoLiveReadiness() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const warnings = [];
        let modulesWithoutProgress = 0;
        // Hole alle Go-Live-Required Module (LEFT JOIN fuer Fehlertoleranz)
        const [modules] = await pool.execute(`
      SELECT 
        mr.id, mr.module_name, mr.category, 
        COALESCE(mr.priority_level, 'P2') as priority_level, 
        COALESCE(mr.maturity_level, 'M0') as maturity_level, 
        COALESCE(mr.risk_level, 'medium') as risk_level,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        CASE WHEN mp.id IS NOT NULL THEN 1 ELSE 0 END as has_progress_entry
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.go_live_required = TRUE OR mr.go_live_required = 1
      ORDER BY mr.priority_level, mr.category, mr.module_name
    `);
        const moduleList = modules;
        const requiredTotal = moduleList.length;
        agentLogger.debug(`Go-Live-Check: ${requiredTotal} erforderliche Module gefunden`);
        const blockingModules = [];
        const stats = {
            P0_total: 0,
            P0_ready: 0,
            P0_blocking: 0,
            P1_total: 0,
            P1_ready: 0,
            P1_blocking: 0
        };
        const categoryReadiness = {};
        for (const mod of moduleList){
            // Sichere Defaults fuer NULL-Werte
            const maturityLevel = mod.maturity_level || "M0";
            const priorityLevel = mod.priority_level || "P2";
            const riskLevel = mod.risk_level || "medium";
            const progressPercent = mod.progress_percent ?? 0;
            const hasProgressEntry = Boolean(mod.has_progress_entry);
            const category = mod.category || "Uncategorized";
            // Tracke Module ohne progress-Eintrag
            if (!hasProgressEntry) {
                modulesWithoutProgress++;
            }
            const maturityValue = parseInt(maturityLevel.substring(1));
            const isBlocking = maturityValue <= 2 || riskLevel === "critical";
            // Stats nach Priority
            if (priorityLevel === "P0") {
                stats.P0_total++;
                if (isBlocking) stats.P0_blocking++;
                else stats.P0_ready++;
            } else if (priorityLevel === "P1") {
                stats.P1_total++;
                if (isBlocking) stats.P1_blocking++;
                else stats.P1_ready++;
            }
            // Stats nach Kategorie
            if (!categoryReadiness[category]) {
                categoryReadiness[category] = {
                    total: 0,
                    ready: 0,
                    blocking: 0
                };
            }
            categoryReadiness[category].total++;
            if (isBlocking) {
                categoryReadiness[category].blocking++;
                blockingModules.push({
                    module_name: mod.module_name,
                    priority_level: priorityLevel,
                    maturity_level: maturityLevel,
                    risk_level: riskLevel,
                    progress_percent: progressPercent,
                    has_progress_entry: hasProgressEntry
                });
            } else {
                categoryReadiness[category].ready++;
            }
        }
        // Warnung wenn Module ohne progress-Eintrag existieren
        if (modulesWithoutProgress > 0) {
            warnings.push(`${modulesWithoutProgress} Module haben keinen Fortschrittseintrag und wurden als open/M0 gewertet.`);
            agentLogger.debug(`Go-Live-Check: ${modulesWithoutProgress} Module ohne progress-Eintrag`);
        }
        const goLiveReady = blockingModules.length === 0;
        // Summary generieren
        let summary = "";
        if (goLiveReady) {
            summary = `✅ GO-LIVE BEREIT! Alle ${requiredTotal} erforderlichen Module haben mindestens Reifegrad M3.`;
        } else {
            const criticalBlockers = blockingModules.filter((m)=>m.risk_level === "critical").length;
            summary = `⛔ GO-LIVE NICHT BEREIT. ${blockingModules.length} von ${requiredTotal} Modulen blockieren.`;
            if (criticalBlockers > 0) {
                summary += ` Davon ${criticalBlockers} KRITISCH.`;
            }
            if (stats.P0_blocking > 0) {
                summary += ` ${stats.P0_blocking} P0-Module nicht bereit.`;
            }
        }
        agentLogger.debug(`Go-Live-Check abgeschlossen: ${goLiveReady ? "BEREIT" : "BLOCKIERT"}`, {
            required: requiredTotal,
            blocking: blockingModules.length,
            warnings: warnings.length
        });
        return {
            go_live_ready: goLiveReady,
            required_modules_total: requiredTotal,
            blocking_modules: blockingModules.slice(0, 20),
            blocking_count: blockingModules.length,
            summary,
            stats,
            category_readiness: categoryReadiness,
            warnings
        };
    }
    /**
   * Holt Risiko-Statistiken fuer Dashboard
   * ENTERPRISE++: Fehlertolerant bei DB-Problemen
   */ static async getRiskStatistics() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Gesamt und nach Risiko
        const [riskStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_count,
        SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_count,
        SUM(CASE WHEN priority_level = 'P0' THEN 1 ELSE 0 END) as p0_count,
        SUM(CASE WHEN priority_level = 'P1' THEN 1 ELSE 0 END) as p1_count,
        SUM(CASE WHEN priority_level = 'P2' THEN 1 ELSE 0 END) as p2_count,
        SUM(CASE WHEN priority_level = 'P3' THEN 1 ELSE 0 END) as p3_count,
        SUM(CASE WHEN go_live_required = TRUE THEN 1 ELSE 0 END) as go_live_required,
        SUM(CASE WHEN go_live_required = TRUE AND maturity_level IN ('M3','M4','M5') AND risk_level != 'critical' THEN 1 ELSE 0 END) as go_live_ready
      FROM module_registry
    `);
        const stats = riskStats[0];
        // Nach Kategorie
        const [categoryStats] = await pool.execute(`
      SELECT 
        category,
        COUNT(*) as total,
        AVG(CAST(SUBSTRING(maturity_level, 2) AS UNSIGNED)) as avg_maturity,
        MAX(CASE risk_level 
          WHEN 'critical' THEN 4 
          WHEN 'high' THEN 3 
          WHEN 'medium' THEN 2 
          ELSE 1 
        END) as max_risk_value,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count
      FROM module_registry
      GROUP BY category
    `);
        const byCategory = {};
        for (const cat of categoryStats){
            const maxRiskMap = {
                4: "critical",
                3: "high",
                2: "medium",
                1: "low"
            };
            byCategory[cat.category] = {
                total: cat.total,
                avgMaturity: Math.round(cat.avg_maturity * 10) / 10,
                maxRisk: maxRiskMap[cat.max_risk_value] || "medium",
                criticalCount: cat.critical_count
            };
        }
        return {
            total: stats.total || 0,
            byRisk: {
                critical: stats.critical_count || 0,
                high: stats.high_count || 0,
                medium: stats.medium_count || 0,
                low: stats.low_count || 0
            },
            byPriority: {
                P0: stats.p0_count || 0,
                P1: stats.p1_count || 0,
                P2: stats.p2_count || 0,
                P3: stats.p3_count || 0
            },
            byCategory,
            goLiveRequired: stats.go_live_required || 0,
            goLiveReady: stats.go_live_ready || 0
        };
    }
    /**
   * Enterprise++ Projektanalyse: Berechnet Gesamtfortschritt aus allen Modulen
   */ static async analyzeProjectProgress(projectName = "Lopez IT Welt – Enterprise++ Operations System 2025") {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // =====================================================
        // 1. Hole alle Module mit Fortschritt
        // =====================================================
        const [modules] = await pool.execute(`
      SELECT 
        mr.id,
        mr.category,
        mr.module_name,
        mr.priority,
        mr.soll_status,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY mr.category, mr.module_name
    `);
        const moduleList = modules;
        const totalModules = moduleList.length;
        if (totalModules === 0) {
            return {
                project: projectName,
                projectId: null,
                overall_progress: 0,
                categories: {},
                doneCount: 0,
                inProgressCount: 0,
                openCount: 0,
                highRiskCount: 0,
                totalModules: 0,
                statusText: "Keine Module vorhanden."
            };
        }
        // =====================================================
        // 2. Berechne Statistiken
        // =====================================================
        let totalProgress = 0;
        let doneCount = 0;
        let inProgressCount = 0;
        let openCount = 0;
        let highRiskCount = 0;
        const categoryProgress = {};
        for (const mod of moduleList){
            const progress = mod.progress_percent || 0;
            totalProgress += progress;
            // Zähler
            if (progress === 100) {
                doneCount++;
            } else if (progress > 0) {
                inProgressCount++;
            } else {
                openCount++;
            }
            // High-Risk: priority = high UND progress < 30
            if (mod.priority === "high" && progress < 30) {
                highRiskCount++;
            }
            // Kategorie-Fortschritt
            if (!categoryProgress[mod.category]) {
                categoryProgress[mod.category] = {
                    total: 0,
                    count: 0
                };
            }
            categoryProgress[mod.category].total += progress;
            categoryProgress[mod.category].count++;
        }
        // Durchschnitte berechnen
        const overallProgress = Math.round(totalProgress / totalModules);
        const categories = {};
        for (const [cat, data] of Object.entries(categoryProgress)){
            categories[cat] = Math.round(data.total / data.count);
        }
        // =====================================================
        // 3. Status-Text generieren
        // =====================================================
        const highProgress = Object.entries(categories).filter(([_, val])=>val >= 60).map(([cat])=>cat);
        const midProgress = Object.entries(categories).filter(([_, val])=>val >= 20 && val < 60).map(([cat])=>cat);
        const lowProgress = Object.entries(categories).filter(([_, val])=>val < 20).map(([cat])=>cat);
        let statusText = "";
        if (highProgress.length > 0) {
            statusText += `${highProgress.join(", ")} ${highProgress.length === 1 ? "ist" : "sind"} weit fortgeschritten. `;
        }
        if (midProgress.length > 0) {
            statusText += `${midProgress.join(", ")} ${midProgress.length === 1 ? "ist" : "sind"} teilweise umgesetzt. `;
        }
        if (lowProgress.length > 0) {
            statusText += `${lowProgress.join(", ")} ${lowProgress.length === 1 ? "befindet" : "befinden"} sich noch in der Planungs- bzw. Startphase.`;
        }
        statusText = statusText.trim() || `Gesamtfortschritt: ${overallProgress}%`;
        // =====================================================
        // 4. Projekt in lopez_projects aktualisieren
        // =====================================================
        let projectId = null;
        try {
            const [projectRows] = await pool.execute("SELECT id FROM lopez_projects WHERE project_name = ?", [
                projectName
            ]);
            if (projectRows.length > 0) {
                projectId = projectRows[0].id;
                await pool.execute(`UPDATE lopez_projects 
           SET progress_percent = ?, 
               progress_status_text = ?,
               last_progress_update = NOW(),
               updated_at = NOW()
           WHERE id = ?`, [
                    overallProgress,
                    statusText,
                    projectId
                ]);
                console.log(`✅ Projekt "${projectName}" aktualisiert: ${overallProgress}%`);
            } else {
                console.warn(`⚠️ Projekt "${projectName}" nicht gefunden in lopez_projects`);
            }
        } catch (error) {
            console.error("❌ Fehler beim Aktualisieren des Projekts:", error);
        }
        // =====================================================
        // 5. Snapshot in project_analysis speichern
        // =====================================================
        let snapshotId;
        try {
            // Tabelle erstellen falls nicht vorhanden
            await pool.execute(`
        CREATE TABLE IF NOT EXISTS project_analysis (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          project_id BIGINT,
          project_name VARCHAR(255),
          overall_progress INT DEFAULT 0,
          category_admin INT DEFAULT 0,
          category_customers INT DEFAULT 0,
          category_support INT DEFAULT 0,
          category_media INT DEFAULT 0,
          category_ai INT DEFAULT 0,
          category_finance INT DEFAULT 0,
          category_website INT DEFAULT 0,
          category_portal_shop INT DEFAULT 0,
          category_ops INT DEFAULT 0,
          category_docs INT DEFAULT 0,
          done_count INT DEFAULT 0,
          in_progress_count INT DEFAULT 0,
          open_count INT DEFAULT 0,
          high_risk_count INT DEFAULT 0,
          total_modules INT DEFAULT 0,
          status_text TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_project_id (project_id),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            // Snapshot einfügen
            const [result] = await pool.execute(`INSERT INTO project_analysis 
         (project_id, project_name, overall_progress, 
          category_admin, category_customers, category_support, category_media,
          category_ai, category_finance, category_website, category_portal_shop,
          category_ops, category_docs,
          done_count, in_progress_count, open_count, high_risk_count, total_modules,
          status_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                projectId,
                projectName,
                overallProgress,
                categories["Admin & Core Platform"] || 0,
                categories["Kunden & Projekte"] || 0,
                categories["Support & Kommunikation"] || 0,
                categories["Inhalte & Medien"] || 0,
                categories["AI Center"] || 0,
                categories["Finanzen & Rechnungen"] || 0,
                categories["Öffentliche Website"] || 0,
                categories["Kundenportal & Shop"] || 0,
                categories["Server, Sicherheit & Betrieb"] || 0,
                categories["Dokumentation & Compliance"] || 0,
                doneCount,
                inProgressCount,
                openCount,
                highRiskCount,
                totalModules,
                statusText
            ]);
            snapshotId = result.insertId;
            console.log(`📸 Analyse-Snapshot #${snapshotId} gespeichert`);
        } catch (error) {
            console.error("❌ Fehler beim Speichern des Snapshots:", error);
        }
        return {
            project: projectName,
            projectId,
            overall_progress: overallProgress,
            categories,
            doneCount,
            inProgressCount,
            openCount,
            highRiskCount,
            totalModules,
            statusText,
            snapshotId
        };
    }
    /**
   * Holt die letzten Analyse-Snapshots
   */ static async getAnalysisHistory(limit = 10) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        try {
            const [rows] = await pool.execute(`SELECT * FROM project_analysis ORDER BY created_at DESC LIMIT ?`, [
                limit
            ]);
            return rows;
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der Analyse-Historie:", error);
            return [];
        }
    }
    // =====================================================
    // HYBRID AUTO-COMPLETE SYSTEM (Enterprise++)
    // =====================================================
    /**
   * Prüft ob ein einzelnes Modul auto-complete-fähig ist
   */ static async checkAutoCompleteEligibility(moduleId) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Hole Modul-Daten
        const [moduleRows] = await pool.execute(`
      SELECT 
        mr.id, mr.module_name, mr.priority_level, mr.maturity_level, 
        mr.risk_level, mr.depends_on, mr.go_live_required,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.id = ?
    `, [
            moduleId
        ]);
        if (moduleRows.length === 0) {
            return {
                eligible: false,
                requires_approval: false,
                blocked: true,
                block_reasons: [
                    "Modul nicht gefunden"
                ],
                module_name: "Unknown",
                priority_level: "P2",
                maturity_level: "M0",
                risk_level: "medium",
                progress_percent: 0,
                open_tasks: 0,
                unmet_dependencies: []
            };
        }
        const mod = moduleRows[0];
        const blockReasons = [];
        const unmetDependencies = [];
        // Bereits fertig?
        if (mod.progress_percent >= 100 || mod.ist_status === "done") {
            return {
                eligible: false,
                requires_approval: false,
                blocked: true,
                block_reasons: [
                    "Modul bereits abgeschlossen"
                ],
                module_name: mod.module_name,
                priority_level: mod.priority_level || "P2",
                maturity_level: mod.maturity_level || "M0",
                risk_level: mod.risk_level || "medium",
                progress_percent: mod.progress_percent,
                open_tasks: 0,
                unmet_dependencies: []
            };
        }
        // 1. Prüfe offene Tasks
        const [taskRows] = await pool.execute(`
      SELECT COUNT(*) as open_count 
      FROM agent_tasks 
      WHERE related_module_id = ? AND status != 'done'
    `, [
            moduleId
        ]);
        const openTasks = taskRows[0].open_count || 0;
        if (openTasks > 0) {
            blockReasons.push(`${openTasks} offene Tasks`);
        }
        // 2. Prüfe Risiko
        if (mod.risk_level === "critical") {
            blockReasons.push("Kritisches Risiko");
        }
        // 3. Prüfe Maturity
        const maturityValue = parseInt((mod.maturity_level || "M0").substring(1));
        if (maturityValue < 3) {
            blockReasons.push(`Maturity ${mod.maturity_level} < M3`);
        }
        // 4. Prüfe Abhängigkeiten (mit normalizeDependsOn für Fehlertoleranz)
        const dependencies = normalizeDependsOn(mod.depends_on);
        if (dependencies.length > 0) {
            for (const depName of dependencies){
                try {
                    const [depRows] = await pool.execute(`
            SELECT mr.module_name, COALESCE(mp.progress_percent, 0) as progress_percent
            FROM module_registry mr
            LEFT JOIN module_progress mp ON mr.id = mp.module_id
            WHERE mr.module_name = ?
          `, [
                        depName
                    ]);
                    if (depRows.length > 0) {
                        const dep = depRows[0];
                        if (dep.progress_percent < 100) {
                            unmetDependencies.push(depName);
                        }
                    } else {
                        // Abhängigkeit existiert nicht in DB - als unerfüllt werten
                        agentLogger.debug(`Abhängigkeit nicht gefunden: ${depName}`, {
                            moduleId
                        });
                        unmetDependencies.push(`${depName} (nicht gefunden)`);
                    }
                } catch (depError) {
                    // Bei DB-Fehler: Abhängigkeit als unbekannt loggen, nicht als blockierend
                    agentLogger.warn(`Fehler beim Prüfen der Abhängigkeit: ${depName}`, {
                        moduleId,
                        error: depError
                    });
                }
            }
            if (unmetDependencies.length > 0) {
                blockReasons.push(`${unmetDependencies.length} Abhängigkeiten nicht erfüllt`);
            }
        }
        // Entscheidung
        const isBlocked = blockReasons.length > 0;
        const priorityLevel = mod.priority_level || "P2";
        const requiresApproval = !isBlocked && [
            "P0",
            "P1"
        ].includes(priorityLevel);
        const eligible = !isBlocked;
        return {
            eligible,
            requires_approval: requiresApproval,
            blocked: isBlocked,
            block_reasons: blockReasons,
            module_name: mod.module_name,
            priority_level: priorityLevel,
            maturity_level: mod.maturity_level || "M0",
            risk_level: mod.risk_level || "medium",
            progress_percent: mod.progress_percent,
            open_tasks: openTasks,
            unmet_dependencies: unmetDependencies
        };
    }
    /**
   * Schließt ein Modul automatisch ab
   */ static async autoCompleteModule(moduleId, force = false) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Erst Eligibility prüfen
        const eligibility = await this.checkAutoCompleteEligibility(moduleId);
        // Enterprise++ Regel: force=true überschreibt ALLE Blockierungen (manuelle Freigabe)
        if (!force) {
            // Ohne force: Blockierung beachten
            if (eligibility.blocked) {
                return {
                    success: false,
                    message: `Modul blockiert: ${eligibility.block_reasons.join(", ")}`,
                    module_name: eligibility.module_name
                };
            }
            // Ohne force: P0/P1 brauchen Freigabe
            if (eligibility.requires_approval) {
                return {
                    success: false,
                    message: `Modul ${eligibility.module_name} (${eligibility.priority_level}) benötigt manuelle Freigabe`,
                    module_name: eligibility.module_name
                };
            }
        }
        // Mit force=true: ALLES wird überschrieben (Enterprise++ Manual Override)
        // Auto-Complete durchführen
        try {
            // 1. module_progress aktualisieren
            const [existingProgress] = await pool.execute("SELECT id FROM module_progress WHERE module_id = ?", [
                moduleId
            ]);
            if (existingProgress.length === 0) {
                await pool.execute(`
          INSERT INTO module_progress (module_id, ist_status, progress_percent, comment, responsible_agent)
          VALUES (?, 'done', 100, 'Auto-Complete (Enterprise++)', 'run')
        `, [
                    moduleId
                ]);
            } else {
                await pool.execute(`
          UPDATE module_progress 
          SET ist_status = 'done', 
              progress_percent = 100, 
              comment = 'Auto-Complete (Enterprise++)',
              responsible_agent = 'run',
              updated_at = NOW()
          WHERE module_id = ?
        `, [
                    moduleId
                ]);
            }
            // 2. module_registry aktualisieren (Maturity + Risk)
            await pool.execute(`
        UPDATE module_registry 
        SET maturity_level = 'M5', 
            risk_level = 'low',
            updated_at = NOW()
        WHERE id = ?
      `, [
                moduleId
            ]);
            // 3. Log in project_analysis (falls Tabelle existiert)
            const logMessage = force ? `✅ ${eligibility.module_name} MANUELL fertiggestellt (Enterprise++ Override, ${eligibility.priority_level})` : `✅ ${eligibility.module_name} automatisch abgeschlossen (${eligibility.priority_level})`;
            try {
                await pool.execute(`
          INSERT INTO project_analysis 
          (project_name, overall_progress, status_text, created_at)
          VALUES (?, 0, ?, NOW())
        `, [
                    force ? "Manual-Complete Log" : "Auto-Complete Log",
                    logMessage
                ]);
            } catch (logError) {
                console.warn("Log-Eintrag konnte nicht erstellt werden:", logError);
            }
            console.log(`✅ ${force ? "Manual" : "Auto"}-Complete: ${eligibility.module_name} → 100%, M5, low`);
            return {
                success: true,
                message: `Modul "${eligibility.module_name}" erfolgreich abgeschlossen`,
                module_name: eligibility.module_name
            };
        } catch (error) {
            console.error("❌ Auto-Complete Fehler:", error);
            return {
                success: false,
                message: "Fehler beim Abschließen des Moduls",
                module_name: eligibility.module_name
            };
        }
    }
    /**
   * Holt alle Module mit Auto-Complete-Status (für Dashboard)
   */ static async getModulesEligibleForAutoComplete() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Hole alle Module
        const [modules] = await pool.execute(`
      SELECT mr.id, mr.module_name, mr.priority_level,
             COALESCE(mp.progress_percent, 0) as progress_percent,
             COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY mr.priority_level, mr.category, mr.module_name
    `);
        const auto = [];
        const requiresApproval = [];
        const blocked = [];
        const alreadyDone = [];
        for (const mod of modules){
            // Bereits fertig?
            if (mod.progress_percent >= 100 || mod.ist_status === "done") {
                alreadyDone.push({
                    id: mod.id,
                    module_name: mod.module_name,
                    priority_level: mod.priority_level || "P2"
                });
                continue;
            }
            const eligibility = await this.checkAutoCompleteEligibility(mod.id);
            if (eligibility.blocked) {
                blocked.push({
                    id: mod.id,
                    module_name: mod.module_name,
                    priority_level: eligibility.priority_level,
                    progress_percent: eligibility.progress_percent,
                    block_reasons: eligibility.block_reasons
                });
            } else if (eligibility.requires_approval) {
                requiresApproval.push({
                    id: mod.id,
                    module_name: mod.module_name,
                    priority_level: eligibility.priority_level,
                    progress_percent: eligibility.progress_percent
                });
            } else {
                auto.push({
                    id: mod.id,
                    module_name: mod.module_name,
                    priority_level: eligibility.priority_level,
                    progress_percent: eligibility.progress_percent
                });
            }
        }
        return {
            auto,
            requires_approval: requiresApproval,
            blocked,
            already_done: alreadyDone,
            summary: {
                total: modules.length,
                auto_count: auto.length,
                approval_count: requiresApproval.length,
                blocked_count: blocked.length,
                done_count: alreadyDone.length
            }
        };
    }
    /**
   * Batch Auto-Complete für alle P2/P3 Module
   */ static async batchAutoComplete() {
        const eligible = await this.getModulesEligibleForAutoComplete();
        const completed = [];
        const failed = [];
        const skipped = [];
        for (const mod of eligible.auto){
            const result = await this.autoCompleteModule(mod.id, false);
            if (result.success) {
                completed.push(mod.module_name);
            } else {
                failed.push(mod.module_name);
            }
        }
        // P0/P1 werden übersprungen (brauchen manuelle Freigabe)
        for (const mod of eligible.requires_approval){
            skipped.push(mod.module_name);
        }
        console.log(`✅ Batch Auto-Complete: ${completed.length} abgeschlossen, ${failed.length} fehlgeschlagen, ${skipped.length} übersprungen (P0/P1)`);
        return {
            completed,
            failed,
            skipped
        };
    }
    /**
   * Holt alle SOLL-Module mit IST-Fortschritt
   */ static async getModulesWithProgress() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`
      SELECT 
        mr.*,
        COALESCE(mp.ist_status, 'open') as ist_status,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.responsible_agent, 'agent_a') as responsible_agent,
        COALESCE(mp.comment, '') as comment
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY 
        FIELD(mr.priority, 'high', 'medium', 'low'),
        mr.category,
        mr.module_name
    `);
        return rows;
    }
    /**
   * Aktualisiert den IST-Fortschritt eines Moduls
   */ static async updateModuleProgress(moduleId, updates) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const updateFields = [];
        const updateValues = [];
        if (updates.ist_status !== undefined) {
            updateFields.push("ist_status = ?");
            updateValues.push(updates.ist_status);
        }
        if (updates.progress_percent !== undefined) {
            updateFields.push("progress_percent = ?");
            updateValues.push(Math.min(100, Math.max(0, updates.progress_percent)));
        }
        if (updates.comment !== undefined) {
            updateFields.push("comment = ?");
            updateValues.push(updates.comment);
        }
        if (updates.responsible_agent !== undefined) {
            updateFields.push("responsible_agent = ?");
            updateValues.push(updates.responsible_agent);
        }
        if (updateFields.length === 0) return false;
        updateValues.push(moduleId);
        const [result] = await pool.execute(`UPDATE module_progress SET ${updateFields.join(", ")} WHERE module_id = ?`, updateValues);
        return result.affectedRows > 0;
    }
    /**
   * Holt alle Tasks für einen Agent
   */ static async getAgentTasks(agent) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        let query = `
      SELECT at.*, mr.module_name as related_module_name
      FROM agent_tasks at
      LEFT JOIN module_registry mr ON at.related_module_id = mr.id
    `;
        const params = [];
        if (agent) {
            query += " WHERE at.assigned_agent = ?";
            params.push(agent);
        }
        query += " ORDER BY FIELD(at.priority, 'high', 'medium', 'low'), at.status, at.created_at DESC";
        const [rows] = await pool.execute(query, params);
        return rows;
    }
    /**
   * Erstellt eine neue Task
   */ static async createTask(task) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`INSERT INTO agent_tasks 
       (title, description, assigned_agent, status, related_module_id, priority)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            task.title,
            task.description,
            task.assigned_agent,
            task.status || "open",
            task.related_module_id || null,
            task.priority || "medium"
        ]);
        return result.insertId;
    }
    /**
   * Aktualisiert eine Task
   */ static async updateTask(taskId, updates) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const updateFields = [];
        const updateValues = [];
        if (updates.title !== undefined) {
            updateFields.push("title = ?");
            updateValues.push(updates.title);
        }
        if (updates.description !== undefined) {
            updateFields.push("description = ?");
            updateValues.push(updates.description);
        }
        if (updates.assigned_agent !== undefined) {
            updateFields.push("assigned_agent = ?");
            updateValues.push(updates.assigned_agent);
        }
        if (updates.status !== undefined) {
            updateFields.push("status = ?");
            updateValues.push(updates.status);
        }
        if (updates.priority !== undefined) {
            updateFields.push("priority = ?");
            updateValues.push(updates.priority);
        }
        if (updateFields.length === 0) return false;
        updateValues.push(taskId);
        const [result] = await pool.execute(`UPDATE agent_tasks SET ${updateFields.join(", ")} WHERE id = ?`, updateValues);
        return result.affectedRows > 0;
    }
    /**
   * Berechnet Statistiken für das Agent-System
   */ static async getStatistics() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Module-Statistiken
        const [moduleStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN mp.ist_status = 'open' THEN 1 ELSE 0 END) as status_open,
        SUM(CASE WHEN mp.ist_status = 'in_progress' THEN 1 ELSE 0 END) as status_in_progress,
        SUM(CASE WHEN mp.ist_status = 'done' THEN 1 ELSE 0 END) as status_done,
        SUM(CASE WHEN mr.priority = 'high' THEN 1 ELSE 0 END) as priority_high,
        SUM(CASE WHEN mr.priority = 'medium' THEN 1 ELSE 0 END) as priority_medium,
        SUM(CASE WHEN mr.priority = 'low' THEN 1 ELSE 0 END) as priority_low,
        AVG(COALESCE(mp.progress_percent, 0)) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
    `);
        const stats = moduleStats[0];
        // Task-Statistiken nach Agent
        const [taskStats] = await pool.execute(`
      SELECT 
        assigned_agent,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done_count
      FROM agent_tasks
      GROUP BY assigned_agent
    `);
        const tasksByAgent = {
            plan: {
                total: 0,
                open: 0,
                done: 0
            },
            build: {
                total: 0,
                open: 0,
                done: 0
            },
            run: {
                total: 0,
                open: 0,
                done: 0
            }
        };
        for (const row of taskStats){
            tasksByAgent[row.assigned_agent] = {
                total: row.total,
                open: row.open_count,
                done: row.done_count
            };
        }
        // Task-Statistiken nach Status
        const [taskStatusStats] = await pool.execute(`
      SELECT status, COUNT(*) as count
      FROM agent_tasks
      GROUP BY status
    `);
        const tasksByStatus = {
            open: 0,
            in_progress: 0,
            done: 0
        };
        for (const row of taskStatusStats){
            tasksByStatus[row.status] = row.count;
        }
        return {
            totalModules: stats.total || 0,
            modulesByStatus: {
                open: stats.status_open || 0,
                in_progress: stats.status_in_progress || 0,
                done: stats.status_done || 0
            },
            modulesByPriority: {
                high: stats.priority_high || 0,
                medium: stats.priority_medium || 0,
                low: stats.priority_low || 0
            },
            overallProgress: Math.round(stats.avg_progress || 0),
            tasksByAgent,
            tasksByStatus
        };
    }
}
}),
"[project]/src/app/api/admin/agent-system/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ AGENT-SYSTEM API
// =====================================================
// GET: Module, Tasks, Statistiken abrufen
// POST: Tabellen initialisieren, Tasks erstellen
// PATCH: Module/Tasks aktualisieren
//
// REFACTORED: 2025-12-03
// - Fehlertoleranz bei DB-Problemen
// - Keine 500er bei Datenluecken
// - Konsistente JSON-Responses
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agent-system.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const warnings = [];
    try {
        const searchParams = request.nextUrl.searchParams;
        const view = searchParams.get("view"); // "modules" | "tasks" | "statistics"
        const agent = searchParams.get("agent");
        // Statistiken abrufen
        if (view === "statistics") {
            try {
                const statistics = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].getStatistics();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: statistics
                });
            } catch (statsError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].warn("Statistiken konnten nicht geladen werden", {
                    error: statsError
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: {
                        totalModules: 0,
                        modulesByStatus: {
                            open: 0,
                            in_progress: 0,
                            done: 0
                        },
                        modulesByPriority: {
                            high: 0,
                            medium: 0,
                            low: 0
                        },
                        overallProgress: 0,
                        tasksByAgent: {
                            plan: {
                                total: 0,
                                open: 0,
                                done: 0
                            },
                            build: {
                                total: 0,
                                open: 0,
                                done: 0
                            },
                            run: {
                                total: 0,
                                open: 0,
                                done: 0
                            }
                        },
                        tasksByStatus: {
                            open: 0,
                            in_progress: 0,
                            done: 0
                        }
                    },
                    warnings: [
                        "Statistiken konnten nicht geladen werden."
                    ]
                });
            }
        }
        // Tasks abrufen
        if (view === "tasks") {
            try {
                const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].getAgentTasks(agent || undefined);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: tasks,
                    count: tasks.length
                });
            } catch (tasksError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].warn("Tasks konnten nicht geladen werden", {
                    error: tasksError
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: [],
                    count: 0,
                    warnings: [
                        "Tasks konnten nicht geladen werden."
                    ]
                });
            }
        }
        // Module mit Fortschritt (Standard)
        try {
            const modules = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].getModulesWithProgress();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: modules,
                count: modules.length
            });
        } catch (modulesError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].warn("Module konnten nicht geladen werden", {
                error: modulesError
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: [],
                count: 0,
                warnings: [
                    "Module konnten nicht geladen werden. Bitte 'SOLL+IST'-Button nutzen um die Datenbank zu initialisieren."
                ]
            });
        }
    } catch (error) {
        // Nur echte, unerwartete Fehler
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Unerwarteter Fehler im Agent-System GET", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Unexpected server error in agent-system",
            details: {
                message: error instanceof Error ? error.message : String(error)
            }
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Ungueltiger Request-Body (kein gueltiges JSON)"
            }, {
                status: 400
            });
        }
        const action = body.action;
        // Tabellen initialisieren + SOLL-Module seeden
        if (action === "init") {
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].initializeTables();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Agent-System Tabellen initialisiert",
                    data: result
                });
            } catch (initError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Tabellen-Initialisierung fehlgeschlagen", initError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Initialisierung teilweise fehlgeschlagen",
                    data: {
                        initialized: false
                    },
                    warnings: [
                        "Tabellen konnten nicht vollstaendig initialisiert werden."
                    ]
                });
            }
        }
        // IST-Fortschritte seeden
        if (action === "seed-progress") {
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].seedModuleProgress();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "IST-Fortschritte gesetzt",
                    data: result
                });
            } catch (seedError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("IST-Seeding fehlgeschlagen", seedError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "IST-Fortschritte konnten nicht gesetzt werden",
                    data: {
                        seeded: false
                    },
                    warnings: [
                        "Fortschritte konnten nicht gesetzt werden."
                    ]
                });
            }
        }
        // Komplett-Init: Tabellen + SOLL + IST
        if (action === "full-init") {
            const warnings = [];
            let initResult = null;
            let progressResult = null;
            try {
                initResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].initializeTables();
            } catch (initError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Tabellen-Init in full-init fehlgeschlagen", initError);
                warnings.push("Tabellen-Initialisierung fehlgeschlagen.");
            }
            try {
                progressResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].seedModuleProgress();
            } catch (progressError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Progress-Seed in full-init fehlgeschlagen", progressError);
                warnings.push("Fortschritts-Seeding fehlgeschlagen.");
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: warnings.length > 0 ? "Initialisierung teilweise abgeschlossen" : "Vollstaendige Initialisierung abgeschlossen",
                data: {
                    tables: initResult,
                    progress: progressResult
                },
                warnings: warnings.length > 0 ? warnings : undefined
            });
        }
        // Neue Task erstellen
        if (action === "create-task") {
            try {
                const taskId = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].createTask({
                    title: String(body.title || "Neue Task"),
                    description: String(body.description || ""),
                    assigned_agent: body.assigned_agent || "plan",
                    status: body.status || "open",
                    related_module_id: body.related_module_id ? Number(body.related_module_id) : null,
                    priority: body.priority || "medium"
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Task erstellt",
                    data: {
                        taskId
                    }
                });
            } catch (taskError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Task-Erstellung fehlgeschlagen", taskError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Task konnte nicht erstellt werden",
                    data: {
                        taskId: null
                    },
                    warnings: [
                        "Task-Erstellung fehlgeschlagen."
                    ]
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Ungueltige Aktion"
        }, {
            status: 400
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Unerwarteter Fehler im Agent-System POST", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Unexpected server error in agent-system",
            details: {
                message: error instanceof Error ? error.message : String(error)
            }
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Ungueltiger Request-Body (kein gueltiges JSON)"
            }, {
                status: 400
            });
        }
        const target = body.target; // "module" | "task"
        // Modul-Fortschritt aktualisieren
        if (target === "module") {
            try {
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].updateModuleProgress(Number(body.module_id), {
                    ist_status: body.ist_status,
                    progress_percent: body.progress_percent ? Number(body.progress_percent) : undefined,
                    comment: body.comment ? String(body.comment) : undefined,
                    responsible_agent: body.responsible_agent
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: success ? "Modul aktualisiert" : "Modul nicht gefunden",
                    data: {
                        updated: success
                    }
                });
            } catch (updateError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Modul-Update fehlgeschlagen", updateError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Modul konnte nicht aktualisiert werden",
                    data: {
                        updated: false
                    },
                    warnings: [
                        "Modul-Update fehlgeschlagen."
                    ]
                });
            }
        }
        // Task aktualisieren
        if (target === "task") {
            try {
                const success = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentSystemService"].updateTask(Number(body.task_id), {
                    title: body.title ? String(body.title) : undefined,
                    description: body.description ? String(body.description) : undefined,
                    assigned_agent: body.assigned_agent,
                    status: body.status,
                    priority: body.priority
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: success ? "Task aktualisiert" : "Task nicht gefunden",
                    data: {
                        updated: success
                    }
                });
            } catch (updateError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Task-Update fehlgeschlagen", updateError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "Task konnte nicht aktualisiert werden",
                    data: {
                        updated: false
                    },
                    warnings: [
                        "Task-Update fehlgeschlagen."
                    ]
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Ungueltiges Ziel (target: 'module' oder 'task')"
        }, {
            status: 400
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentLogger"].error("Unerwarteter Fehler im Agent-System PATCH", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Unexpected server error in agent-system",
            details: {
                message: error instanceof Error ? error.message : String(error)
            }
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1bcfcd75._.js.map