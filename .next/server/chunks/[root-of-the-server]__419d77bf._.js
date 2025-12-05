module.exports = [
"[project]/.next-internal/server/app/api/admin/dev-tasks/run-review/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/dev-tasks-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DEV-TASKS SERVICE – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Service für Dev-Tasks und Agent-A Integration
// Status: ✅ PHASE 1 – Planung
// =====================================================
// 
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// =====================================================
__turbopack_context__.s([
    "DevTasksService",
    ()=>DevTasksService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
class DevTasksService {
    // -------------------------------------------------
    // TASK CRUD
    // -------------------------------------------------
    /**
   * Erstellt einen neuen Dev-Task
   */ static async createTask(input) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`INSERT INTO dev_tasks 
        (title, description, type, status, priority, project_code, created_by) 
       VALUES (?, ?, ?, 'open', ?, ?, ?)`, [
            input.title,
            input.description,
            input.type,
            input.priority || "medium",
            input.project_code || "LOPEZ-IT-WELT",
            input.created_by || "system"
        ]);
        const taskId = result.insertId;
        const task = await this.getTaskById(taskId);
        if (!task) {
            throw new Error("Task wurde erstellt, konnte aber nicht geladen werden");
        }
        return task;
    }
    /**
   * Holt einen Task nach ID
   */ static async getTaskById(id) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`SELECT 
        t.*,
        (SELECT COUNT(*) FROM dev_task_steps WHERE task_id = t.id) as steps_count
       FROM dev_tasks t 
       WHERE t.id = ?`, [
            id
        ]);
        if (rows.length === 0) return null;
        return rows[0];
    }
    /**
   * Holt alle Tasks (mit Pagination)
   */ static async getTasks(options = {}) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const { limit = 20, offset = 0, status, type } = options;
        let whereClause = "1=1";
        const params = [];
        if (status) {
            whereClause += " AND t.status = ?";
            params.push(status);
        }
        if (type) {
            whereClause += " AND t.type = ?";
            params.push(type);
        }
        // Zähle Gesamtanzahl
        const [countResult] = await pool.execute(`SELECT COUNT(*) as total FROM dev_tasks t WHERE ${whereClause}`, params);
        const total = countResult[0].total;
        // Hole Tasks mit Steps-Count
        const [rows] = await pool.execute(`SELECT 
        t.*,
        (SELECT COUNT(*) FROM dev_task_steps WHERE task_id = t.id) as steps_count
       FROM dev_tasks t 
       WHERE ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`, [
            ...params,
            limit,
            offset
        ]);
        return {
            tasks: rows,
            total
        };
    }
    /**
   * Aktualisiert den Status eines Tasks
   */ static async updateTaskStatus(id, status) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        await pool.execute(`UPDATE dev_tasks SET status = ?, updated_at = NOW() WHERE id = ?`, [
            status,
            id
        ]);
    }
    // -------------------------------------------------
    // TASK STEPS CRUD
    // -------------------------------------------------
    /**
   * Erstellt einen Plan-Schritt
   */ static async createStep(input) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`INSERT INTO dev_task_steps 
        (task_id, step_number, title, details, estimated_effort, agent_notes) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
            input.task_id,
            input.step_number,
            input.title,
            input.details || null,
            input.estimated_effort || null,
            input.agent_notes || null
        ]);
        const stepId = result.insertId;
        const step = await this.getStepById(stepId);
        if (!step) {
            throw new Error("Step wurde erstellt, konnte aber nicht geladen werden");
        }
        return step;
    }
    /**
   * Holt einen Step nach ID
   */ static async getStepById(id) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`SELECT * FROM dev_task_steps WHERE id = ?`, [
            id
        ]);
        if (rows.length === 0) return null;
        return rows[0];
    }
    /**
   * Holt alle Steps für einen Task
   */ static async getStepsForTask(taskId) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`SELECT * FROM dev_task_steps WHERE task_id = ? ORDER BY step_number ASC`, [
            taskId
        ]);
        return rows;
    }
    /**
   * Speichert mehrere Steps für einen Task (Agent-A Output)
   */ static async saveStepsForTask(taskId, steps) {
        const createdSteps = [];
        for (const step of steps){
            const created = await this.createStep({
                task_id: taskId,
                ...step
            });
            createdSteps.push(created);
        }
        return createdSteps;
    }
    // -------------------------------------------------
    // STATISTIKEN
    // -------------------------------------------------
    /**
   * Holt Statistiken zu Dev-Tasks
   */ static async getStatistics() {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        // Gesamt und nach Status
        const [statusStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as status_open,
        SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as status_planning,
        SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as status_planned,
        SUM(CASE WHEN status = 'coding' THEN 1 ELSE 0 END) as status_coding,
        SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as status_review,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as status_done,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as status_cancelled
      FROM dev_tasks
    `);
        // Nach Typ
        const [typeStats] = await pool.execute(`
      SELECT 
        SUM(CASE WHEN type = 'bug' THEN 1 ELSE 0 END) as type_bug,
        SUM(CASE WHEN type = 'feature' THEN 1 ELSE 0 END) as type_feature,
        SUM(CASE WHEN type = 'refactor' THEN 1 ELSE 0 END) as type_refactor,
        SUM(CASE WHEN type = 'documentation' THEN 1 ELSE 0 END) as type_documentation,
        SUM(CASE WHEN type = 'security' THEN 1 ELSE 0 END) as type_security
      FROM dev_tasks
    `);
        // Steps zählen
        const [stepsCount] = await pool.execute(`
      SELECT COUNT(*) as total FROM dev_task_steps
    `);
        const stats = statusStats[0];
        const types = typeStats[0];
        return {
            total: stats.total || 0,
            byStatus: {
                open: stats.status_open || 0,
                planning: stats.status_planning || 0,
                planned: stats.status_planned || 0,
                coding: stats.status_coding || 0,
                review: stats.status_review || 0,
                done: stats.status_done || 0,
                cancelled: stats.status_cancelled || 0
            },
            byType: {
                bug: types.type_bug || 0,
                feature: types.type_feature || 0,
                refactor: types.type_refactor || 0,
                documentation: types.type_documentation || 0,
                security: types.type_security || 0
            },
            totalSteps: stepsCount[0].total || 0
        };
    }
}
const __TURBOPACK__default__export__ = DevTasksService;
}),
"[project]/src/lib/ai/providers/mock-ai-provider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mock AI Provider - Enterprise++ Standard
 * 
 * Mock-Implementierung des AiProvider-Interfaces für Tests und Entwicklung
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Mock-Provider für Tests
 * @status ✅ PRODUKTIONSREIF (Phase F.2.2)
 */ __turbopack_context__.s([
    "MockAiProvider",
    ()=>MockAiProvider,
    "createMockAiProvider",
    ()=>createMockAiProvider
]);
class MockAiProvider {
    name = "mock:test";
    version = "1.0.0";
    supportsJson = true;
    /**
     * Gibt eine Mock-Text-Response zurück
     * 
     * Format: "MOCK_RESPONSE: " + erste 80 Zeichen des Inputs
     */ async requestText(input, options) {
        // Simuliere kleine Verzögerung (wie echte API)
        await new Promise((resolve)=>setTimeout(resolve, 100));
        const prefix = "MOCK_RESPONSE: ";
        const truncatedInput = input.slice(0, 80);
        const response = `${prefix}${truncatedInput}${input.length > 80 ? "..." : ""}`;
        // Log für Tests
        if (options?.taskId) {
            console.log(`[MockAiProvider] Task: ${options.taskId}, Input: ${truncatedInput}...`);
        }
        return response;
    }
    /**
     * Gibt eine Mock-JSON-Response zurück
     * 
     * Versucht, ein statisches JSON zurückzugeben, das zum Schema passt.
     * Für einfache Schemas gibt es vordefinierte Mock-Daten.
     */ async requestJson(input, schema, options) {
        // Simuliere kleine Verzögerung (wie echte API)
        await new Promise((resolve)=>setTimeout(resolve, 150));
        // Versuche Schema zu analysieren und passende Mock-Daten zu generieren
        const mockData = this.generateMockJson(schema, input);
        // Log für Tests
        if (options?.taskId) {
            console.log(`[MockAiProvider] Task: ${options.taskId}, Schema: ${JSON.stringify(schema)}`);
        }
        return mockData;
    }
    /**
     * Generiert Mock-JSON basierend auf Schema
     */ generateMockJson(schema, input) {
        // Einfache Schema-Analyse für häufige Fälle
        if (typeof schema === "object" && schema !== null) {
            const schemaObj = schema;
            // Beispiel: Media-Tagging-Schema
            if (input.toLowerCase().includes("tag") || input.toLowerCase().includes("bild")) {
                return {
                    tags: [
                        "mock-tag-1",
                        "mock-tag-2",
                        "mock-tag-3"
                    ],
                    alt_text: {
                        description: "Mock-Bildbeschreibung für Barrierefreiheit",
                        confidence: 0.9
                    },
                    category: {
                        category: "other",
                        confidence: 0.8
                    }
                };
            }
            // Beispiel: DSGVO-Helfer-Schema
            if (input.toLowerCase().includes("dsgvo") || input.toLowerCase().includes("datenschutz")) {
                return {
                    hasProblems: true,
                    problems: [
                        "Mock-Problem: Fehlende Datenschutzerklärung"
                    ],
                    suggestions: [
                        "Mock-Vorschlag: Datenschutzerklärung hinzufügen"
                    ]
                };
            }
            // Generisches Schema: Versuche Properties zu extrahieren
            if (schemaObj.type === "object" && schemaObj.properties) {
                const properties = schemaObj.properties;
                const result = {};
                for (const [key, propSchema] of Object.entries(properties)){
                    const prop = propSchema;
                    if (prop.type === "string") {
                        result[key] = `mock-${key}`;
                    } else if (prop.type === "number") {
                        result[key] = 0;
                    } else if (prop.type === "boolean") {
                        result[key] = false;
                    } else if (prop.type === "array") {
                        result[key] = [];
                    } else if (prop.type === "object") {
                        result[key] = {};
                    }
                }
                return result;
            }
        }
        // Fallback: Einfaches Objekt
        return {
            result: "mock-result",
            input: input.slice(0, 50)
        };
    }
    /**
     * Mock ist immer verfügbar
     */ async isAvailable() {
        return true;
    }
    /**
     * Mock hat keine Kosten
     */ estimateCost(inputLength, estimatedOutputLength, options) {
        return 0; // Mock ist kostenlos
    }
}
function createMockAiProvider() {
    return new MockAiProvider();
}
}),
"[project]/src/lib/ai/core/ai-provider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Provider Core Interface - Enterprise++ Standard
 * 
 * Allgemeines AIProvider-Interface für alle KI-Aufgaben
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Allgemeine AI-Provider-Schicht
 * @status ✅ PRODUKTIONSREIF (Phase F.2.1)
 */ /**
 * Request-Kontext für DSGVO und Tracking
 */ __turbopack_context__.s([
    "ProviderError",
    ()=>ProviderError
]);
class ProviderError extends Error {
    provider;
    code;
    retryable;
    retryAfter;
    constructor(message, provider, code, retryable = false, retryAfter){
        super(message), this.provider = provider, this.code = code, this.retryable = retryable, this.retryAfter = retryAfter;
        this.name = "ProviderError";
    }
}
}),
"[project]/src/lib/ai/providers/llama-provider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LLaMA Provider - Enterprise++ Standard
 * 
 * Implementierung des AiProvider-Interfaces für Self-Hosted LLaMA (Ollama)
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.4: LLaMA-Provider für Self-Hosted KI
 * @status ✅ PRODUKTIONSREIF (Phase F.2.4)
 */ __turbopack_context__.s([
    "LLaMAProvider",
    ()=>LLaMAProvider,
    "createLLaMAProvider",
    ()=>createLLaMAProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/core/ai-provider.ts [app-route] (ecmascript)");
;
class LLaMAProvider {
    serverUrl;
    model;
    name;
    version = "1.0.0";
    supportsJson = false;
    constructor(config){
        this.serverUrl = config?.serverUrl || process.env.LLAMA_SERVER_URL || "http://localhost:11434";
        this.model = config?.model || process.env.LLAMA_MODEL || "llama3.2:1b";
        this.name = `llama:${this.model}`;
    }
    /**
     * Text-Request über Ollama API
     */ async requestText(input, options) {
        try {
            // System-Prompt hinzufügen, falls vorhanden
            const fullPrompt = options?.systemPrompt ? `${options.systemPrompt}\n\n${input}` : input;
            const response = await fetch(`${this.serverUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: fullPrompt,
                    stream: false,
                    options: {
                        temperature: options?.temperature ?? 0.7,
                        num_predict: options?.maxTokens ?? 1000
                    }
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`LLaMA API error (${response.status}): ${errorText}`);
            }
            const result = await response.json();
            return result.response || "";
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]) {
                throw error;
            }
            // Netzwerk-Fehler
            if (error instanceof Error) {
                if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`LLaMA server not reachable at ${this.serverUrl}. Is Ollama running?`, this.name, "API_ERROR", true);
                }
                if (error.message.includes("timeout")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("LLaMA request timeout", this.name, "TIMEOUT", true);
                }
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`LLaMA request failed: ${error instanceof Error ? error.message : "Unknown error"}`, this.name, "API_ERROR", true);
        }
    }
    /**
     * JSON-Request über Ollama API
     * 
     * LLaMA unterstützt keinen nativen JSON-Mode, daher:
     * 1. Prompt erweitern mit JSON-Anweisung
     * 2. JSON aus Text extrahieren
     */ async requestJson(input, schema, options) {
        // Erweitere Prompt mit JSON-Anweisung
        const jsonPrompt = `${input}

WICHTIG: Antworte NUR mit gültigem JSON, kein zusätzlicher Text!
Das JSON muss diesem Schema entsprechen: ${JSON.stringify(schema)}`;
        const text = await this.requestText(jsonPrompt, options);
        // Versuche JSON aus Response zu extrahieren
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("LLaMA response does not contain valid JSON", this.name, "API_ERROR", false);
        }
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`Failed to parse JSON from LLaMA response: ${error instanceof Error ? error.message : "Unknown error"}`, this.name, "API_ERROR", false);
        }
    }
    /**
     * Verfügbarkeitsprüfung
     * 
     * Prüft, ob Ollama-Server erreichbar ist
     */ async isAvailable() {
        try {
            const response = await fetch(`${this.serverUrl}/api/tags`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.ok;
        } catch  {
            return false;
        }
    }
    /**
     * Kosten-Schätzung
     * 
     * Self-Hosted: Keine API-Kosten, nur Server-Kosten
     * Für Einzelunternehmen: Sehr geringe Kosten pro Request
     */ estimateCost(inputLength, estimatedOutputLength, options) {
        // Self-Hosted: Keine API-Kosten
        // Kosten pro Request = Server-Kosten / erwartete Requests pro Monat
        // Beispiel: 300 €/Monat Server / 10.000 Requests = 0.03 € pro Request
        // Für Phase L0/L1 (lokal): 0 €
        const monthlyServerCost = parseFloat(process.env.LLAMA_MONTHLY_COST || "0");
        const expectedRequestsPerMonth = parseFloat(process.env.LLAMA_EXPECTED_REQUESTS || "1000");
        if (monthlyServerCost === 0 || expectedRequestsPerMonth === 0) {
            return 0; // Lokal = kostenlos
        }
        return monthlyServerCost / expectedRequestsPerMonth;
    }
}
function createLLaMAProvider(config) {
    return new LLaMAProvider(config);
}
}),
"[project]/src/lib/media/ai/secret-manager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Secret Manager - Enterprise++ Standard
 * 
 * Zentrale Klasse für Secret-Handling
 * Lädt Secrets zur Laufzeit, speichert sie niemals
 * 
 * @created 2025-01-27
 * @purpose Enterprise Secret-Handling
 */ /**
 * Secret-Referenz-Format
 * 
 * Unterstützte Formate:
 * - "ENV:VARIABLE_NAME" - Umgebungsvariable
 * - "MOCK" - Mock-Provider (kein Key nötig)
 * - Später erweiterbar: "VAULT:path/to/secret"
 */ __turbopack_context__.s([
    "SecretManager",
    ()=>SecretManager
]);
class SecretManager {
    /**
     * Lädt Secret basierend auf Referenz
     * 
     * @param secretRef Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
     * @returns Secret-Wert (zur Laufzeit geladen)
     * @throws Error wenn Secret nicht gefunden oder ungültiges Format
     */ static loadSecret(secretRef) {
        // Mock-Provider benötigt keinen Key
        if (secretRef === "MOCK") {
            return "";
        }
        // ENV: Format
        if (secretRef.startsWith("ENV:")) {
            const envVar = secretRef.replace("ENV:", "");
            const value = process.env[envVar];
            if (!value || value.trim().length === 0) {
                throw new Error(`Environment variable '${envVar}' not found or empty. ` + `Please set ${envVar} in your .env file.`);
            }
            return value;
        }
        // Unbekanntes Format
        throw new Error(`Unknown secret reference format: '${secretRef}'. ` + `Supported formats: 'ENV:VARIABLE_NAME' or 'MOCK'`);
    }
    /**
     * Prüft, ob Secret vorhanden ist (ohne es zu loggen)
     * 
     * @param secretRef Secret-Referenz
     * @returns true wenn Secret vorhanden, false sonst
     */ static hasSecret(secretRef) {
        try {
            const secret = this.loadSecret(secretRef);
            return secret.length > 0;
        } catch  {
            return false;
        }
    }
    /**
     * Maskiert Secret für Logs
     * 
     * @param secret Secret-Wert (wird maskiert)
     * @returns Maskierter Secret-Wert (z.B. "sk-***masked***")
     */ static maskSecret(secret) {
        if (!secret || secret.length === 0) {
            return "***empty***";
        }
        // OpenAI Key Format: sk-... (mindestens 20 Zeichen)
        if (secret.startsWith("sk-") && secret.length >= 20) {
            return `sk-***masked***`;
        }
        // Generische Maskierung: Erste 4 Zeichen + ***masked***
        if (secret.length > 8) {
            return `${secret.substring(0, 4)}***masked***`;
        }
        // Kurze Secrets: Vollständig maskieren
        return "***masked***";
    }
    /**
     * Validiert Secret-Referenz-Format
     * 
     * @param secretRef Secret-Referenz
     * @returns true wenn Format gültig, false sonst
     */ static isValidSecretRef(secretRef) {
        if (secretRef === "MOCK") {
            return true;
        }
        if (secretRef.startsWith("ENV:") && secretRef.length > 4) {
            const envVar = secretRef.replace("ENV:", "");
            // Prüfe, ob Variablenname gültig ist (alphanumerisch + _)
            return /^[A-Z_][A-Z0-9_]*$/i.test(envVar);
        }
        return false;
    }
    /**
     * Extrahiert Umgebungsvariablen-Namen aus Secret-Referenz
     * 
     * @param secretRef Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
     * @returns Umgebungsvariablen-Name (z.B. "OPENAI_API_KEY") oder null
     */ static extractEnvVarName(secretRef) {
        if (secretRef.startsWith("ENV:")) {
            return secretRef.replace("ENV:", "");
        }
        return null;
    }
}
}),
"[project]/src/lib/ai/providers/openai-provider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenAI Provider - Enterprise++ Standard
 * 
 * Allgemeine Implementierung des AiProvider-Interfaces für OpenAI
 * 
 * @created 2025-11-29
 * @purpose Phase F.2.3: Allgemeiner OpenAI-Provider
 * @status ✅ PRODUKTIONSREIF (Phase F.2.3)
 */ __turbopack_context__.s([
    "OpenAIProvider",
    ()=>OpenAIProvider,
    "createOpenAIProvider",
    ()=>createOpenAIProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/core/ai-provider.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$media$2f$ai$2f$secret$2d$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/media/ai/secret-manager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
;
;
class OpenAIProvider {
    client = null;
    model;
    name;
    version = "1.0.0";
    supportsJson = true;
    constructor(config){
        this.model = config?.model || process.env.OPENAI_MODEL || "gpt-4";
        // API-Key laden
        try {
            const apiKey = config?.apiKey || this.loadApiKey();
            if (!apiKey || apiKey.length === 0) {
                console.warn("⚠️ OpenAI API Key nicht gefunden. Provider wird nicht initialisiert.");
                return;
            }
            this.client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
                apiKey: apiKey
            });
            this.name = `openai:${this.model}`;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("❌ Fehler beim Initialisieren des OpenAI-Clients:", errorMessage);
        // Client bleibt null - isAvailable() wird false zurückgeben
        }
    }
    /**
     * Lädt API-Key über SecretManager
     */ loadApiKey() {
        try {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$media$2f$ai$2f$secret$2d$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SecretManager"].loadSecret("ENV:OPENAI_API_KEY");
        } catch (error) {
            return "";
        }
    }
    /**
     * Text-Request über OpenAI API
     */ async requestText(input, options) {
        if (!this.client) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI client not initialized. Please check API key and OpenAI SDK installation.", this.name, "API_ERROR", false);
        }
        try {
            const messages = [];
            // System-Prompt hinzufügen, falls vorhanden
            if (options?.systemPrompt) {
                messages.push({
                    role: "system",
                    content: options.systemPrompt
                });
            }
            // User-Prompt hinzufügen
            messages.push({
                role: "user",
                content: input
            });
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature ?? 0.7
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("No response from OpenAI", this.name, "API_ERROR", true);
            }
            return content;
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]) {
                throw error;
            }
            // OpenAI-spezifische Fehler
            if (error instanceof Error) {
                // Rate Limit
                if (error.message.includes("rate_limit") || error.message.includes("429")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI rate limit exceeded", this.name, "RATE_LIMIT", true, new Date(Date.now() + 60000) // Retry nach 1 Minute
                    );
                }
                // Auth Error
                if (error.message.includes("401") || error.message.includes("unauthorized")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI authentication failed", this.name, "AUTH_ERROR", false);
                }
                // Timeout
                if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI request timeout", this.name, "TIMEOUT", true);
                }
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`OpenAI request failed: ${error instanceof Error ? error.message : "Unknown error"}`, this.name, "API_ERROR", true);
        }
    }
    /**
     * JSON-Request über OpenAI API
     * 
     * Nutzt OpenAI's JSON-Mode für strukturierte Responses
     */ async requestJson(input, schema, options) {
        if (!this.client) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI client not initialized. Please check API key and OpenAI SDK installation.", this.name, "API_ERROR", false);
        }
        try {
            const messages = [];
            // System-Prompt hinzufügen, falls vorhanden
            if (options?.systemPrompt) {
                messages.push({
                    role: "system",
                    content: options.systemPrompt
                });
            }
            // User-Prompt mit Schema-Anweisung
            const jsonPrompt = `${input}

WICHTIG: Antworte NUR mit gültigem JSON, das diesem Schema entspricht:
${JSON.stringify(schema, null, 2)}`;
            messages.push({
                role: "user",
                content: jsonPrompt
            });
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                response_format: {
                    type: "json_object"
                },
                max_tokens: options?.maxTokens || 1000,
                temperature: options?.temperature ?? 0.7
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("No response from OpenAI", this.name, "API_ERROR", true);
            }
            try {
                return JSON.parse(content);
            } catch (parseError) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`Failed to parse JSON from OpenAI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`, this.name, "API_ERROR", false);
            }
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]) {
                throw error;
            }
            // Gleiche Fehlerbehandlung wie requestText
            if (error instanceof Error) {
                if (error.message.includes("rate_limit") || error.message.includes("429")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI rate limit exceeded", this.name, "RATE_LIMIT", true, new Date(Date.now() + 60000));
                }
                if (error.message.includes("401") || error.message.includes("unauthorized")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI authentication failed", this.name, "AUTH_ERROR", false);
                }
                if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"]("OpenAI request timeout", this.name, "TIMEOUT", true);
                }
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ProviderError"](`OpenAI JSON request failed: ${error instanceof Error ? error.message : "Unknown error"}`, this.name, "API_ERROR", true);
        }
    }
    /**
     * Verfügbarkeitsprüfung
     * 
     * Prüft, ob OpenAI-Client initialisiert ist und API-Key vorhanden
     */ async isAvailable() {
        if (!this.client) {
            return false; // Client nicht initialisiert
        }
        try {
            // Einfacher Health-Check: Prüfe ob API-Key vorhanden ist
            const apiKey = this.loadApiKey();
            return apiKey.length > 0;
        } catch  {
            return false;
        }
    }
    /**
     * Kosten-Schätzung
     * 
     * Basierend auf OpenAI Pricing (Stand: 2025-11-29)
     * - Input: $0.01 pro 1K Tokens (GPT-4)
     * - Output: $0.03 pro 1K Tokens (GPT-4)
     */ estimateCost(inputLength, estimatedOutputLength, options) {
        // Geschätzte Tokens (ca. 4 Zeichen pro Token)
        const inputTokens = Math.ceil(inputLength / 4);
        const outputTokens = Math.ceil(estimatedOutputLength / 4);
        // OpenAI Pricing (GPT-4)
        const inputCostPer1K = 0.01; // USD
        const outputCostPer1K = 0.03; // USD
        const inputCost = inputTokens / 1000 * inputCostPer1K;
        const outputCost = outputTokens / 1000 * outputCostPer1K;
        return inputCost + outputCost;
    }
}
function createOpenAIProvider(config) {
    return new OpenAIProvider(config);
}
}),
"[project]/src/lib/ai/core/ai-provider-factory.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Provider Factory - Enterprise++ Standard
 * 
 * Factory für Erstellung und Verwaltung von AI-Providern
 * 
 * @created 2025-11-29
 * @purpose Phase F.2: Provider-Factory
 * @status ✅ PRODUKTIONSREIF (Phase F.2.2)
 */ __turbopack_context__.s([
    "createProvider",
    ()=>createProvider,
    "getProvider",
    ()=>getProvider,
    "loadProviderConfig",
    ()=>loadProviderConfig,
    "setProvider",
    ()=>setProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$mock$2d$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/providers/mock-ai-provider.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$llama$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/providers/llama-provider.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$openai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/providers/openai-provider.ts [app-route] (ecmascript)");
;
;
;
function createProvider(config) {
    switch(config.type){
        case "mock":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$mock$2d$ai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMockAiProvider"])();
        case "openai":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$openai$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAIProvider"])({
                apiKey: config.apiKey,
                model: config.model
            });
        case "llama":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$providers$2f$llama$2d$provider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLLaMAProvider"])({
                serverUrl: config.serverUrl,
                model: config.model
            });
        case "mistral":
            // Wird später implementiert
            throw new Error("Mistral Provider wird später implementiert");
        default:
            throw new Error(`Unknown provider type: ${config.type}`);
    }
}
function loadProviderConfig() {
    const providerType = process.env.AI_PROVIDER || "mock";
    return {
        type: providerType,
        apiKey: process.env.OPENAI_API_KEY,
        serverUrl: process.env.LLAMA_SERVER_URL || "http://localhost:11434",
        model: process.env.AI_MODEL
    };
}
/**
 * Singleton-Instanz des Providers
 */ let providerInstance = null;
function getProvider() {
    if (!providerInstance) {
        const config = loadProviderConfig();
        providerInstance = createProvider(config);
    }
    return providerInstance;
}
function setProvider(provider) {
    providerInstance = provider;
}
}),
"[project]/src/lib/dev-orchestrator/agent-b-builder.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AGENT-B BUILDER – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Code-Generierung basierend auf Agent-A Plan
// Status: ✅ PHASE 2 – Build
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// - Erzeugt nur Code-VORSCHLÄGE, führt nichts aus
// =====================================================
__turbopack_context__.s([
    "AgentBBuilder",
    ()=>AgentBBuilder,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-tasks-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2d$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/core/ai-provider-factory.ts [app-route] (ecmascript)");
;
;
;
class AgentBBuilder {
    // -------------------------------------------------
    // PLAN LADEN
    // -------------------------------------------------
    /**
   * Lädt den Plan (Steps) für einen Task
   */ static async loadPlan(taskId) {
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].getTaskById(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} nicht gefunden`);
        }
        if (task.status !== "planned") {
            throw new Error(`Task ${taskId} hat Status '${task.status}', erwartet 'planned'`);
        }
        const steps = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].getStepsForTask(taskId);
        return {
            task,
            steps
        };
    }
    // -------------------------------------------------
    // CODE GENERIERUNG
    // -------------------------------------------------
    /**
   * Generiert Code für einen einzelnen Step
   * Mock-Modus wenn AI-Provider unsicher
   */ static async generateCodeForStep(step, taskContext) {
        try {
            const aiProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2d$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProvider"])();
            // Prüfe ob Mock-Modus
            if (!aiProvider || aiProvider.name === "mock") {
                return this.generateMockCode(step, taskContext);
            }
            // Echte AI-Generierung
            const prompt = this.buildCodePrompt(step, taskContext);
            const response = await aiProvider.chat([
                {
                    role: "system",
                    content: "Du bist Agent-B, ein Enterprise++ Code-Generator. Generiere sauberen, typisierten TypeScript-Code."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]);
            // Parse AI-Antwort
            return this.parseAICodeResponse(response, step);
        } catch (error) {
            console.warn(`[Agent-B] AI-Fehler, verwende Mock:`, error);
            return this.generateMockCode(step, taskContext);
        }
    }
    /**
   * Mock-Code-Generierung wenn AI nicht verfügbar
   */ static generateMockCode(step, taskContext) {
        const stepTitle = step.title.toLowerCase();
        // Intelligentes Mock basierend auf Step-Titel
        if (stepTitle.includes("backend") || stepTitle.includes("api")) {
            return {
                file_path: `src/app/api/admin/${this.slugify(taskContext.title)}/route.ts`,
                code_type: "new",
                code_before: null,
                code_after: `// =====================================================
// AUTO-GENERATED BY AGENT-B
// Task: ${taskContext.title}
// Step: ${step.title}
// =====================================================

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementierung für "${step.title}"
    // Details: ${step.details || "Keine Details"}
    
    return NextResponse.json({
      success: true,
      message: "API-Endpoint bereit",
      data: {}
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Interner Fehler" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validierung und Verarbeitung
    
    return NextResponse.json({
      success: true,
      message: "Erfolgreich verarbeitet"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Interner Fehler" },
      { status: 500 }
    );
  }
}
`,
                explanation: `Mock-API-Route für Step "${step.title}". Dies ist ein Vorschlag – bitte prüfen und anpassen.`
            };
        }
        if (stepTitle.includes("frontend") || stepTitle.includes("ui") || stepTitle.includes("komponente")) {
            return {
                file_path: `src/components/${this.pascalCase(taskContext.title)}.tsx`,
                code_type: "new",
                code_before: null,
                code_after: `// =====================================================
// AUTO-GENERATED BY AGENT-B
// Task: ${taskContext.title}
// Step: ${step.title}
// =====================================================

"use client";

import { useState, useEffect } from "react";

interface ${this.pascalCase(taskContext.title)}Props {
  // TODO: Props definieren
}

export default function ${this.pascalCase(taskContext.title)}({ }: ${this.pascalCase(taskContext.title)}Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Initialisierung für "${step.title}"
  }, []);

  if (loading) {
    return <div className="p-4">Laden...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      {/* TODO: UI für "${step.title}" */}
      <h2 className="text-xl font-bold">${taskContext.title}</h2>
      <p className="text-gray-500">${step.details || "Implementierung ausstehend"}</p>
    </div>
  );
}
`,
                explanation: `Mock-React-Komponente für Step "${step.title}". Dies ist ein Vorschlag – bitte prüfen und anpassen.`
            };
        }
        if (stepTitle.includes("test")) {
            return {
                file_path: `src/__tests__/${this.slugify(taskContext.title)}.test.ts`,
                code_type: "new",
                code_before: null,
                code_after: `// =====================================================
// AUTO-GENERATED BY AGENT-B
// Task: ${taskContext.title}
// Step: ${step.title}
// =====================================================

import { describe, it, expect } from "vitest";

describe("${taskContext.title}", () => {
  it("sollte korrekt initialisieren", () => {
    // TODO: Test-Setup
    expect(true).toBe(true);
  });

  it("sollte ${step.title}", () => {
    // TODO: Implementierung testen
    // Details: ${step.details || "Keine Details"}
    expect(true).toBe(true);
  });

  it("sollte Fehler korrekt behandeln", () => {
    // TODO: Error-Handling testen
    expect(true).toBe(true);
  });
});
`,
                explanation: `Mock-Test-Datei für Step "${step.title}". Dies ist ein Vorschlag – bitte prüfen und anpassen.`
            };
        }
        // Fallback: Generische Logik-Datei
        return {
            file_path: `src/lib/${this.slugify(taskContext.title)}.ts`,
            code_type: "new",
            code_before: null,
            code_after: `// =====================================================
// AUTO-GENERATED BY AGENT-B
// Task: ${taskContext.title}
// Step: ${step.title}
// =====================================================

/**
 * ${taskContext.description}
 */

export interface ${this.pascalCase(taskContext.title)}Config {
  // TODO: Konfiguration definieren
}

export class ${this.pascalCase(taskContext.title)}Service {
  
  /**
   * ${step.title}
   * ${step.details || ""}
   */
  static async execute(config: ${this.pascalCase(taskContext.title)}Config): Promise<void> {
    // TODO: Implementierung
    console.log("[${this.pascalCase(taskContext.title)}Service] Ausführung gestartet");
  }
}

export default ${this.pascalCase(taskContext.title)}Service;
`,
            explanation: `Mock-Service für Step "${step.title}". Dies ist ein Vorschlag – bitte prüfen und anpassen.`
        };
    }
    /**
   * Baut den Prompt für AI-Code-Generierung
   */ static buildCodePrompt(step, taskContext) {
        return `
Du bist Agent-B im Enterprise++ Dev-Orchestrator.

AUFGABE: Generiere Code für folgenden Schritt:

## Task
- Titel: ${taskContext.title}
- Beschreibung: ${taskContext.description}
- Typ: ${taskContext.type}

## Aktueller Schritt
- Nummer: ${step.step_number}
- Titel: ${step.title}
- Details: ${step.details || "Keine"}
- Geschätzter Aufwand: ${step.estimated_effort || "Nicht angegeben"}

## Anforderungen
- TypeScript/React (Next.js 14+ App Router)
- Enterprise++ Standards
- Vollständig typisiert
- Kommentiert
- DSGVO-konform falls relevant

Antworte im JSON-Format:
{
  "file_path": "src/...",
  "code_type": "new|modify|delete",
  "code_before": null,
  "code_after": "// vollständiger Code",
  "explanation": "Kurze Erklärung"
}
`;
    }
    /**
   * Parst die AI-Antwort
   */ static parseAICodeResponse(response, step) {
        try {
            // Versuche JSON zu parsen
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    file_path: parsed.file_path || `src/generated/step-${step.step_number}.ts`,
                    code_type: parsed.code_type || "new",
                    code_before: parsed.code_before || null,
                    code_after: parsed.code_after || "// Code konnte nicht generiert werden",
                    explanation: parsed.explanation || "AI-generierter Code"
                };
            }
        } catch (e) {
            console.warn("[Agent-B] Konnte AI-Antwort nicht parsen");
        }
        // Fallback
        return {
            file_path: `src/generated/step-${step.step_number}.ts`,
            code_type: "new",
            code_before: null,
            code_after: response,
            explanation: "AI-generierter Code (unstrukturiert)"
        };
    }
    // -------------------------------------------------
    // CODE SPEICHERN
    // -------------------------------------------------
    /**
   * Speichert einen Code-Change in der Datenbank
   */ static async saveCodeChange(taskId, stepId, change) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`INSERT INTO dev_code_changes 
        (task_id, step_id, file_path, code_type, code_before, code_after, explanation, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`, [
            taskId,
            stepId,
            change.file_path,
            change.code_type,
            change.code_before,
            change.code_after,
            change.explanation
        ]);
        const changeId = result.insertId;
        const [rows] = await pool.execute(`SELECT * FROM dev_code_changes WHERE id = ?`, [
            changeId
        ]);
        return rows[0];
    }
    /**
   * Lädt alle Code-Changes für einen Task
   */ static async getCodeChangesForTask(taskId) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`SELECT * FROM dev_code_changes WHERE task_id = ? ORDER BY id ASC`, [
            taskId
        ]);
        return rows;
    }
    // -------------------------------------------------
    // BUILD AUSFÜHREN
    // -------------------------------------------------
    /**
   * Führt den kompletten Build für einen Task aus
   */ static async runBuild(taskId) {
        const warnings = [];
        const changes = [];
        // 1. Plan laden
        const { task, steps } = await this.loadPlan(taskId);
        if (steps.length === 0) {
            throw new Error("Keine Plan-Schritte vorhanden");
        }
        // 2. Task-Status auf 'coding' setzen
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].updateTaskStatus(taskId, "coding");
        // 3. Für jeden Step Code generieren
        for (const step of steps){
            try {
                const codeResult = await this.generateCodeForStep(step, {
                    title: task.title,
                    description: task.description,
                    type: task.type
                });
                // Speichern
                const savedChange = await this.saveCodeChange(taskId, step.id, codeResult);
                changes.push(savedChange);
            } catch (error) {
                warnings.push(`Step ${step.step_number} (${step.title}): ${error}`);
            }
        }
        return {
            success: true,
            task_id: taskId,
            changes,
            summary: `${changes.length} Code-Änderungen für ${steps.length} Steps generiert`,
            warnings
        };
    }
    // -------------------------------------------------
    // HILFSFUNKTIONEN
    // -------------------------------------------------
    static slugify(text) {
        return text.toLowerCase().replace(/[äöüß]/g, (c)=>({
                ä: "ae",
                ö: "oe",
                ü: "ue",
                ß: "ss"
            })[c] || c).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    static pascalCase(text) {
        return text.replace(/[äöüß]/g, (c)=>({
                ä: "ae",
                ö: "oe",
                ü: "ue",
                ß: "ss"
            })[c] || c).replace(/[^a-zA-Z0-9]+/g, " ").split(" ").filter(Boolean).map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
    }
}
const __TURBOPACK__default__export__ = AgentBBuilder;
}),
"[project]/src/lib/dev-orchestrator/agent-c-reviewer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AGENT-C REVIEWER – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Code-Review und Quality-Gate
// Status: ✅ PHASE 3 – Review
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// - Führt nur READ-Operationen und Status-Updates durch
// =====================================================
__turbopack_context__.s([
    "AgentCReviewer",
    ()=>AgentCReviewer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-tasks-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$b$2d$builder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-orchestrator/agent-b-builder.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2d$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/core/ai-provider-factory.ts [app-route] (ecmascript)");
;
;
;
;
class AgentCReviewer {
    // Quality Gate Schwellenwerte
    static QUALITY_GATE = {
        MIN_SCORE: 70,
        MAX_CRITICAL_ISSUES: 0,
        MAX_WARNINGS: 5
    };
    // -------------------------------------------------
    // CODE-CHANGES LADEN
    // -------------------------------------------------
    /**
   * Lädt alle Code-Changes für einen Task
   */ static async loadCodeChanges(taskId) {
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].getTaskById(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} nicht gefunden`);
        }
        if (task.status !== "coding") {
            throw new Error(`Task ${taskId} hat Status '${task.status}', erwartet 'coding'`);
        }
        const changes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$b$2d$builder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentBBuilder"].getCodeChangesForTask(taskId);
        return {
            task,
            changes
        };
    }
    // -------------------------------------------------
    // CODE EVALUATION
    // -------------------------------------------------
    /**
   * Evaluiert einen einzelnen Code-Change
   */ static async evaluateCode(change, taskContext) {
        try {
            const aiProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$core$2f$ai$2d$provider$2d$factory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProvider"])();
            // Prüfe ob Mock-Modus
            if (!aiProvider || aiProvider.name === "mock") {
                return this.evaluateMock(change, taskContext);
            }
            // Echte AI-Evaluation
            const prompt = this.buildReviewPrompt(change, taskContext);
            const response = await aiProvider.chat([
                {
                    role: "system",
                    content: "Du bist Agent-C, ein Enterprise++ Code-Reviewer. Prüfe Code auf Qualität, Sicherheit und Best Practices."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]);
            return this.parseAIReviewResponse(response);
        } catch (error) {
            console.warn(`[Agent-C] AI-Fehler, verwende Mock:`, error);
            return this.evaluateMock(change, taskContext);
        }
    }
    /**
   * Mock-Evaluation wenn AI nicht verfügbar
   */ static evaluateMock(change, taskContext) {
        const code = change.code_after;
        const issues = [];
        const suggestions = [];
        let score = 100;
        // Einfache statische Prüfungen
        // 1. TypeScript-Typisierung prüfen
        if (code.includes(": any") || code.includes("as any")) {
            issues.push({
                severity: "warning",
                type: "typing",
                description: "Verwendung von 'any' Type gefunden. Strikte Typisierung empfohlen."
            });
            score -= 5;
            suggestions.push("Ersetze 'any' durch spezifische TypeScript-Typen");
        }
        // 2. Console.log prüfen
        if (code.includes("console.log") && !code.includes("// DEBUG")) {
            issues.push({
                severity: "info",
                type: "debugging",
                description: "console.log gefunden. Für Produktion entfernen oder durch Logger ersetzen."
            });
            score -= 2;
            suggestions.push("Verwende den Enterprise++ Logger statt console.log");
        }
        // 3. Error-Handling prüfen
        if (code.includes("catch") && !code.includes("catch (error)") && !code.includes("catch(error)")) {
            issues.push({
                severity: "warning",
                type: "error-handling",
                description: "Catch-Block ohne Error-Variable gefunden."
            });
            score -= 5;
        }
        // 4. SQL-Injection prüfen (vereinfacht)
        if (code.includes("${") && (code.includes("SELECT") || code.includes("INSERT") || code.includes("UPDATE"))) {
            issues.push({
                severity: "critical",
                type: "security",
                description: "Mögliche SQL-Injection Gefahr: Template Literals in SQL-Query."
            });
            score -= 25;
            suggestions.push("Verwende parametrisierte Queries statt String-Interpolation");
        }
        // 5. TODO-Comments zählen
        const todoCount = (code.match(/TODO/g) || []).length;
        if (todoCount > 3) {
            issues.push({
                severity: "info",
                type: "completeness",
                description: `${todoCount} TODO-Kommentare gefunden. Code ist möglicherweise unvollständig.`
            });
            score -= todoCount * 2;
        }
        // 6. Kommentierung prüfen
        if (!code.includes("/**") && code.length > 500) {
            issues.push({
                severity: "info",
                type: "documentation",
                description: "Keine JSDoc-Kommentare gefunden. Enterprise++ erfordert dokumentierte APIs."
            });
            score -= 5;
            suggestions.push("Füge JSDoc-Kommentare für öffentliche Funktionen hinzu");
        }
        // 7. Export prüfen
        if (!code.includes("export") && code.includes("function")) {
            issues.push({
                severity: "info",
                type: "structure",
                description: "Keine Exports gefunden. Module sollten explizit exportieren."
            });
            score -= 3;
        }
        // Score begrenzen
        score = Math.max(0, Math.min(100, score));
        // Review-Status bestimmen
        let reviewStatus = "approved";
        const criticalIssues = issues.filter((i)=>i.severity === "critical").length;
        const warnings = issues.filter((i)=>i.severity === "warning").length;
        if (criticalIssues > 0) {
            reviewStatus = "rejected";
        } else if (warnings > 3 || score < this.QUALITY_GATE.MIN_SCORE) {
            reviewStatus = "needs_revision";
        }
        // Standard-Suggestions hinzufügen
        if (suggestions.length === 0) {
            suggestions.push("Code entspricht den Enterprise++ Standards");
        }
        return {
            review_status: reviewStatus,
            quality_score: score,
            feedback: this.generateFeedback(issues, score, reviewStatus),
            issues_found: issues,
            suggestions
        };
    }
    /**
   * Generiert Feedback-Text
   */ static generateFeedback(issues, score, status) {
        const criticalCount = issues.filter((i)=>i.severity === "critical").length;
        const warningCount = issues.filter((i)=>i.severity === "warning").length;
        const infoCount = issues.filter((i)=>i.severity === "info").length;
        let feedback = `Quality Score: ${score}/100\n\n`;
        if (status === "approved") {
            feedback += "✅ Code Review BESTANDEN\n\n";
            feedback += "Der Code entspricht den Enterprise++ Standards.\n";
        } else if (status === "needs_revision") {
            feedback += "⚠️ Code Review: ÜBERARBEITUNG ERFORDERLICH\n\n";
            feedback += "Es wurden Probleme gefunden, die vor dem Merge behoben werden sollten.\n";
        } else {
            feedback += "❌ Code Review NICHT BESTANDEN\n\n";
            feedback += "Kritische Probleme gefunden. Code muss überarbeitet werden.\n";
        }
        feedback += `\nGefundene Issues:\n`;
        feedback += `- Kritisch: ${criticalCount}\n`;
        feedback += `- Warnungen: ${warningCount}\n`;
        feedback += `- Hinweise: ${infoCount}\n`;
        if (issues.length > 0) {
            feedback += `\nDetails:\n`;
            issues.forEach((issue, i)=>{
                const icon = issue.severity === "critical" ? "🔴" : issue.severity === "warning" ? "🟡" : "🔵";
                feedback += `${i + 1}. ${icon} [${issue.type}] ${issue.description}\n`;
            });
        }
        return feedback;
    }
    /**
   * Baut den Prompt für AI-Review
   */ static buildReviewPrompt(change, taskContext) {
        return `
Du bist Agent-C im Enterprise++ Dev-Orchestrator.

AUFGABE: Führe ein Code-Review durch.

## Task
- Titel: ${taskContext.title}
- Typ: ${taskContext.type}

## Code-Change
- Datei: ${change.file_path}
- Typ: ${change.code_type}
- Erklärung: ${change.explanation}

## Zu prüfender Code:
\`\`\`typescript
${change.code_after}
\`\`\`

## Prüfkriterien
1. TypeScript Best Practices
2. Sicherheit (SQL-Injection, XSS, etc.)
3. Error-Handling
4. Dokumentation
5. Enterprise++ Standards

Antworte im JSON-Format:
{
  "review_status": "approved|needs_revision|rejected",
  "quality_score": 0-100,
  "feedback": "Zusammenfassung",
  "issues_found": [{"severity": "critical|warning|info", "type": "...", "description": "..."}],
  "suggestions": ["..."]
}
`;
    }
    /**
   * Parst die AI-Review-Antwort
   */ static parseAIReviewResponse(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    review_status: parsed.review_status || "approved",
                    quality_score: parsed.quality_score || 80,
                    feedback: parsed.feedback || "AI-Review abgeschlossen",
                    issues_found: parsed.issues_found || [],
                    suggestions: parsed.suggestions || []
                };
            }
        } catch (e) {
            console.warn("[Agent-C] Konnte AI-Antwort nicht parsen");
        }
        // Fallback
        return {
            review_status: "approved",
            quality_score: 85,
            feedback: "AI-Review konnte nicht vollständig geparst werden. Standard-Bewertung angewendet.",
            issues_found: [],
            suggestions: [
                "Manuelle Prüfung empfohlen"
            ]
        };
    }
    // -------------------------------------------------
    // REVIEW SPEICHERN
    // -------------------------------------------------
    /**
   * Speichert ein Review in der Datenbank
   */ static async saveReview(taskId, changeId, review) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`INSERT INTO dev_reviews 
        (task_id, change_id, review_status, quality_score, feedback, issues_found, suggestions, reviewer_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Agent-C')`, [
            taskId,
            changeId,
            review.review_status,
            review.quality_score,
            review.feedback,
            JSON.stringify(review.issues_found),
            JSON.stringify(review.suggestions)
        ]);
        const reviewId = result.insertId;
        const [rows] = await pool.execute(`SELECT * FROM dev_reviews WHERE id = ?`, [
            reviewId
        ]);
        return rows[0];
    }
    /**
   * Lädt alle Reviews für einen Task
   */ static async getReviewsForTask(taskId) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`SELECT * FROM dev_reviews WHERE task_id = ? ORDER BY id ASC`, [
            taskId
        ]);
        return rows;
    }
    /**
   * Aktualisiert den Status eines Code-Changes basierend auf Review
   */ static async updateCodeChangeStatus(changeId, status) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        await pool.execute(`UPDATE dev_code_changes SET status = ?, updated_at = NOW() WHERE id = ?`, [
            status,
            changeId
        ]);
    }
    // -------------------------------------------------
    // REVIEW AUSFÜHREN
    // -------------------------------------------------
    /**
   * Führt den kompletten Review für einen Task aus
   */ static async runReview(taskId) {
        const reviews = [];
        let totalScore = 0;
        let hasRejected = false;
        let hasNeedsRevision = false;
        // 1. Code-Changes laden
        const { task, changes } = await this.loadCodeChanges(taskId);
        if (changes.length === 0) {
            throw new Error("Keine Code-Changes zum Review vorhanden");
        }
        // 2. Task-Status auf 'review' setzen
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].updateTaskStatus(taskId, "review");
        // 3. Jeden Change reviewen
        for (const change of changes){
            const reviewResult = await this.evaluateCode(change, {
                title: task.title,
                type: task.type
            });
            // Review speichern
            const savedReview = await this.saveReview(taskId, change.id, reviewResult);
            reviews.push(savedReview);
            // Code-Change Status aktualisieren
            await this.updateCodeChangeStatus(change.id, reviewResult.review_status);
            // Statistiken sammeln
            totalScore += reviewResult.quality_score;
            if (reviewResult.review_status === "rejected") hasRejected = true;
            if (reviewResult.review_status === "needs_revision") hasNeedsRevision = true;
        }
        // 4. Gesamt-Score berechnen
        const overallScore = Math.round(totalScore / changes.length);
        // 5. Gesamt-Status bestimmen
        let overallStatus = "approved";
        if (hasRejected) {
            overallStatus = "rejected";
        } else if (hasNeedsRevision || overallScore < this.QUALITY_GATE.MIN_SCORE) {
            overallStatus = "needs_revision";
        }
        // 6. Quality Gate prüfen
        const qualityGatePassed = overallStatus === "approved" && overallScore >= this.QUALITY_GATE.MIN_SCORE;
        // 7. Task-Status final setzen
        if (qualityGatePassed) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].updateTaskStatus(taskId, "done");
        }
        return {
            success: true,
            task_id: taskId,
            reviews,
            overall_status: overallStatus,
            overall_score: overallScore,
            summary: this.generateReviewSummary(reviews, overallScore, qualityGatePassed),
            quality_gate_passed: qualityGatePassed
        };
    }
    /**
   * Generiert Review-Zusammenfassung
   */ static generateReviewSummary(reviews, overallScore, passed) {
        const approved = reviews.filter((r)=>r.review_status === "approved").length;
        const needsRevision = reviews.filter((r)=>r.review_status === "needs_revision").length;
        const rejected = reviews.filter((r)=>r.review_status === "rejected").length;
        let summary = `Enterprise++ Quality Gate: ${passed ? "✅ BESTANDEN" : "❌ NICHT BESTANDEN"}\n\n`;
        summary += `Gesamt-Score: ${overallScore}/100\n`;
        summary += `Reviews: ${reviews.length} (${approved} ✅ | ${needsRevision} ⚠️ | ${rejected} ❌)\n\n`;
        if (passed) {
            summary += "Alle Code-Changes haben das Quality Gate bestanden. Task kann als abgeschlossen markiert werden.";
        } else {
            summary += "Einige Code-Changes erfordern Überarbeitung. Bitte die Feedback-Details prüfen.";
        }
        return summary;
    }
}
const __TURBOPACK__default__export__ = AgentCReviewer;
}),
"[project]/src/app/api/admin/dev-tasks/run-review/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AGENT-C REVIEW API – Enterprise++ Dev-Orchestrator
// =====================================================
// Route: /api/admin/dev-tasks/run-review
// Erstellt: 2025-12-04
// Zweck: Startet Agent-C Code-Review und Quality Gate
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$c$2d$reviewer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-orchestrator/agent-c-reviewer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$b$2d$builder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-orchestrator/agent-b-builder.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dev-tasks-service.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const taskId = searchParams.get("taskId");
        if (!taskId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "taskId Parameter fehlt"
            }, {
                status: 400
            });
        }
        const taskIdNum = parseInt(taskId, 10);
        if (isNaN(taskIdNum)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "taskId muss eine Zahl sein"
            }, {
                status: 400
            });
        }
        // Task laden
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].getTaskById(taskIdNum);
        if (!task) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Task ${taskId} nicht gefunden`
            }, {
                status: 404
            });
        }
        // Code-Changes laden
        let codeChanges = [];
        try {
            codeChanges = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$b$2d$builder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentBBuilder"].getCodeChangesForTask(taskIdNum);
        } catch (e) {
            console.warn("[Agent-C API] Code-Changes konnten nicht geladen werden:", e);
        }
        // Reviews laden
        let reviews = [];
        try {
            reviews = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$c$2d$reviewer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentCReviewer"].getReviewsForTask(taskIdNum);
        } catch (e) {
            console.warn("[Agent-C API] Reviews konnten nicht geladen werden:", e);
        }
        // Status prüfen
        const canRunReview = task.status === "coding" && codeChanges.length > 0;
        const reviewComplete = reviews.length > 0 && (task.status === "review" || task.status === "done");
        // Scores berechnen
        let overallScore = 0;
        if (reviews.length > 0) {
            overallScore = Math.round(reviews.reduce((sum, r)=>sum + (r.quality_score || 0), 0) / reviews.length);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                task: {
                    id: task.id,
                    title: task.title,
                    status: task.status,
                    type: task.type
                },
                code_changes: codeChanges.map((c)=>({
                        id: c.id,
                        file_path: c.file_path,
                        code_type: c.code_type,
                        status: c.status
                    })),
                reviews: reviews.map((r)=>({
                        id: r.id,
                        change_id: r.change_id,
                        review_status: r.review_status,
                        quality_score: r.quality_score,
                        feedback: r.feedback
                    })),
                review_status: {
                    can_run: canRunReview,
                    is_complete: reviewComplete,
                    reviews_count: reviews.length,
                    overall_score: overallScore,
                    quality_gate_passed: overallScore >= 70 && task.status === "done",
                    message: canRunReview ? "Task ist bereit für Agent-C Review" : reviewComplete ? `Review abgeschlossen: Score ${overallScore}/100` : `Task-Status ist '${task.status}', Review erfordert 'coding' mit Code-Changes`
                }
            }
        });
    } catch (error) {
        console.error("[Agent-C API] GET Fehler:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Interner Serverfehler"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { taskId, use_mock } = body;
        if (!taskId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "taskId fehlt im Request-Body"
            }, {
                status: 400
            });
        }
        const taskIdNum = parseInt(taskId, 10);
        if (isNaN(taskIdNum)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "taskId muss eine Zahl sein"
            }, {
                status: 400
            });
        }
        // Task prüfen
        const task = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$tasks$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevTasksService"].getTaskById(taskIdNum);
        if (!task) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Task ${taskId} nicht gefunden`
            }, {
                status: 404
            });
        }
        if (task.status !== "coding") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Task hat Status '${task.status}', Review erfordert 'coding'`,
                hint: "Führe zuerst Agent-B Build aus"
            }, {
                status: 400
            });
        }
        // Code-Changes prüfen
        const codeChanges = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$b$2d$builder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentBBuilder"].getCodeChangesForTask(taskIdNum);
        if (codeChanges.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Keine Code-Changes zum Review vorhanden",
                hint: "Führe zuerst Agent-B Build aus"
            }, {
                status: 400
            });
        }
        // Agent-C Review ausführen
        console.log(`[Agent-C API] Starte Review für Task ${taskIdNum}...`);
        const reviewResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dev$2d$orchestrator$2f$agent$2d$c$2d$reviewer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentCReviewer"].runReview(taskIdNum);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: reviewResult.quality_gate_passed ? `✅ Quality Gate BESTANDEN – Task abgeschlossen!` : `⚠️ Quality Gate nicht bestanden – Score: ${reviewResult.overall_score}/100`,
            data: {
                task_id: reviewResult.task_id,
                overall_status: reviewResult.overall_status,
                overall_score: reviewResult.overall_score,
                quality_gate_passed: reviewResult.quality_gate_passed,
                reviews: reviewResult.reviews.map((r)=>({
                        id: r.id,
                        change_id: r.change_id,
                        review_status: r.review_status,
                        quality_score: r.quality_score,
                        feedback: r.feedback
                    })),
                summary: reviewResult.summary
            }
        });
    } catch (error) {
        console.error("[Agent-C API] POST Fehler:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || "Interner Serverfehler",
            details: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__419d77bf._.js.map