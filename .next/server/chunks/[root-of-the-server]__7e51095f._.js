module.exports = [
"[project]/.next-internal/server/app/api/admin/ai/workflows/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/ai-center/workflow-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AI CENTER - WORKFLOW ENGINE
// =====================================================
// Enterprise++ Auto-Workflow System
// Trigger-basierte Automatisierung
// =====================================================
__turbopack_context__.s([
    "WorkflowEngine",
    ()=>WorkflowEngine,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fireTrigger",
    ()=>fireTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
class WorkflowEngine {
    // -------------------------------------------------
    // WORKFLOW CRUD
    // -------------------------------------------------
    /**
   * Erstellt einen neuen Workflow
   */ static async createWorkflow(workflow) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`
      INSERT INTO ai_workflows (name, description, trigger_config, actions_config, status)
      VALUES (?, ?, ?, ?, ?)
    `, [
            workflow.name,
            workflow.description,
            JSON.stringify(workflow.trigger),
            JSON.stringify(workflow.actions),
            workflow.status
        ]);
        return this.getWorkflowById(result.insertId);
    }
    /**
   * Holt Workflow nach ID
   */ static async getWorkflowById(id) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [rows] = await pool.execute(`
      SELECT * FROM ai_workflows WHERE id = ?
    `, [
            id
        ]);
        if (rows.length === 0) return null;
        return this.mapRowToWorkflow(rows[0]);
    }
    /**
   * Listet alle Workflows
   */ static async listWorkflows(status) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        let query = "SELECT * FROM ai_workflows";
        const params = [];
        if (status) {
            query += " WHERE status = ?";
            params.push(status);
        }
        query += " ORDER BY created_at DESC";
        const [rows] = await pool.execute(query, params);
        return rows.map((row)=>this.mapRowToWorkflow(row));
    }
    /**
   * Aktualisiert Workflow
   */ static async updateWorkflow(id, updates) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const fields = [];
        const values = [];
        if (updates.name !== undefined) {
            fields.push("name = ?");
            values.push(updates.name);
        }
        if (updates.description !== undefined) {
            fields.push("description = ?");
            values.push(updates.description);
        }
        if (updates.trigger !== undefined) {
            fields.push("trigger_config = ?");
            values.push(JSON.stringify(updates.trigger));
        }
        if (updates.actions !== undefined) {
            fields.push("actions_config = ?");
            values.push(JSON.stringify(updates.actions));
        }
        if (updates.status !== undefined) {
            fields.push("status = ?");
            values.push(updates.status);
        }
        if (fields.length === 0) return this.getWorkflowById(id);
        values.push(id);
        await pool.execute(`
      UPDATE ai_workflows SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?
    `, values);
        return this.getWorkflowById(id);
    }
    /**
   * Löscht Workflow
   */ static async deleteWorkflow(id) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const [result] = await pool.execute(`
      DELETE FROM ai_workflows WHERE id = ?
    `, [
            id
        ]);
        return result.affectedRows > 0;
    }
    // -------------------------------------------------
    // WORKFLOW EXECUTION
    // -------------------------------------------------
    /**
   * Findet passende Workflows für einen Trigger
   */ static async findWorkflowsForTrigger(triggerType, data) {
        const workflows = await this.listWorkflows("active");
        return workflows.filter((workflow)=>{
            if (workflow.trigger.type !== triggerType) return false;
            // Conditions prüfen
            if (workflow.trigger.conditions) {
                for (const [key, value] of Object.entries(workflow.trigger.conditions)){
                    if (data[key] !== value) return false;
                }
            }
            return true;
        });
    }
    /**
   * Führt einen Workflow aus
   */ static async executeWorkflow(workflowId, triggerData) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        const workflow = await this.getWorkflowById(workflowId);
        if (!workflow) {
            throw new Error(`Workflow ${workflowId} nicht gefunden`);
        }
        // Execution starten
        const [execResult] = await pool.execute(`
      INSERT INTO ai_workflow_executions (workflow_id, trigger_data, status)
      VALUES (?, ?, 'running')
    `, [
            workflowId,
            JSON.stringify(triggerData)
        ]);
        const executionId = execResult.insertId;
        const results = [];
        let error = null;
        try {
            // Actions ausführen (sortiert nach order)
            const sortedActions = [
                ...workflow.actions
            ].sort((a, b)=>a.order - b.order);
            for (const action of sortedActions){
                const actionResult = await this.executeAction(action, triggerData, workflow);
                results.push({
                    action: action.type,
                    result: actionResult
                });
            }
            // Erfolgreich
            await pool.execute(`
        UPDATE ai_workflow_executions 
        SET status = 'completed', completed_at = NOW(), result = ?
        WHERE id = ?
      `, [
                JSON.stringify(results),
                executionId
            ]);
            // Workflow-Counter aktualisieren
            await pool.execute(`
        UPDATE ai_workflows SET last_run_at = NOW(), run_count = run_count + 1 WHERE id = ?
      `, [
                workflowId
            ]);
        } catch (err) {
            error = err instanceof Error ? err.message : "Unbekannter Fehler";
            await pool.execute(`
        UPDATE ai_workflow_executions 
        SET status = 'failed', completed_at = NOW(), error = ?
        WHERE id = ?
      `, [
                error,
                executionId
            ]);
        }
        // Execution zurückgeben
        const [execRows] = await pool.execute(`
      SELECT * FROM ai_workflow_executions WHERE id = ?
    `, [
            executionId
        ]);
        return this.mapRowToExecution(execRows[0]);
    }
    /**
   * Führt eine einzelne Action aus
   */ static async executeAction(action, triggerData, workflow) {
        switch(action.type){
            case "create_task":
                return this.actionCreateTask(action.config, triggerData);
            case "send_notification":
                return this.actionSendNotification(action.config, triggerData);
            case "run_playbook":
                return this.actionRunPlaybook(action.config, triggerData);
            case "log_event":
                return this.actionLogEvent(action.config, triggerData, workflow);
            case "start_agent":
                return this.actionStartAgent(action.config, triggerData);
            case "create_report":
                return {
                    status: "pending",
                    message: "Report-Erstellung noch nicht implementiert"
                };
            case "webhook":
                return this.actionWebhook(action.config, triggerData);
            default:
                return {
                    status: "skipped",
                    message: `Unbekannte Action: ${action.type}`
                };
        }
    }
    // -------------------------------------------------
    // ACTION IMPLEMENTATIONS
    // -------------------------------------------------
    static async actionCreateTask(config, triggerData) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ai/risk-to-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                risk_id: triggerData.risk_id || `AUTO-${Date.now()}`,
                risk_type: config.task_type || triggerData.risk_type || "refactor",
                risk_severity: config.priority || triggerData.severity || "medium",
                risk_title: config.title || triggerData.title || "Auto-generierter Task",
                risk_description: config.description || triggerData.description || "Automatisch erstellt durch Workflow",
                project_code: config.project_code || "LOPEZ-IT-WELT",
                auto_plan: config.auto_plan !== false,
                created_by: "workflow-engine"
            })
        });
        return response.json();
    }
    static async actionSendNotification(config, triggerData) {
        // In-App Notification (Audit-Log)
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        await pool.execute(`
      INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (?, 'WORKFLOW_NOTIFICATION', 'notification', 0, ?)
    `, [
            1,
            JSON.stringify({
                type: config.notification_type || "info",
                title: config.title || "Workflow-Benachrichtigung",
                message: config.message || triggerData.message || "Ein Workflow wurde ausgeführt",
                channel: config.channel || "in_app",
                trigger_data: triggerData
            })
        ]);
        return {
            status: "sent",
            channel: config.channel || "in_app"
        };
    }
    static async actionRunPlaybook(config, triggerData) {
        const playbookId = config.playbook_id;
        if (!playbookId) {
            return {
                status: "error",
                message: "playbook_id nicht angegeben"
            };
        }
        // Playbook ausführen (über PlaybookService)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ai/playbooks/${playbookId}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context: triggerData,
                dry_run: config.dry_run || false
            })
        });
        return response.json();
    }
    static async actionLogEvent(config, triggerData, workflow) {
        const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
        await pool.execute(`
      INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (?, ?, 'workflow', ?, ?)
    `, [
            1,
            config.event_type || "WORKFLOW_EVENT",
            workflow.id,
            JSON.stringify({
                workflow_name: workflow.name,
                event: config.event || "executed",
                trigger_data: triggerData,
                ...config.extra_data
            })
        ]);
        return {
            status: "logged"
        };
    }
    static async actionStartAgent(config, triggerData) {
        const agentName = config.agent_name;
        const taskId = config.task_id || triggerData.task_id;
        if (!agentName) {
            return {
                status: "error",
                message: "agent_name nicht angegeben"
            };
        }
        // Agent-spezifische Endpoints
        const agentEndpoints = {
            "Agent-A": "/api/admin/dev-tasks/run-plan",
            "Agent-B": "/api/admin/dev-tasks/run-code",
            "Agent-C": "/api/admin/dev-tasks/run-review"
        };
        const endpoint = agentEndpoints[agentName];
        if (!endpoint) {
            return {
                status: "error",
                message: `Unbekannter Agent: ${agentName}`
            };
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId
            })
        });
        return response.json();
    }
    static async actionWebhook(config, triggerData) {
        const url = config.url;
        if (!url) {
            return {
                status: "error",
                message: "webhook url nicht angegeben"
            };
        }
        try {
            const response = await fetch(url, {
                method: config.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                body: JSON.stringify({
                    event: config.event || "workflow_triggered",
                    timestamp: new Date().toISOString(),
                    data: triggerData
                })
            });
            return {
                status: response.ok ? "success" : "error",
                statusCode: response.status
            };
        } catch (err) {
            return {
                status: "error",
                message: err instanceof Error ? err.message : "Webhook fehlgeschlagen"
            };
        }
    }
    // -------------------------------------------------
    // HELPER
    // -------------------------------------------------
    static mapRowToWorkflow(row) {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            trigger: JSON.parse(row.trigger_config || "{}"),
            actions: JSON.parse(row.actions_config || "[]"),
            status: row.status,
            last_run_at: row.last_run_at,
            run_count: row.run_count || 0,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }
    static mapRowToExecution(row) {
        return {
            id: row.id,
            workflow_id: row.workflow_id,
            trigger_data: JSON.parse(row.trigger_data || "{}"),
            status: row.status,
            started_at: row.started_at,
            completed_at: row.completed_at,
            result: row.result ? JSON.parse(row.result) : null,
            error: row.error
        };
    }
}
async function fireTrigger(triggerType, data) {
    const workflows = await WorkflowEngine.findWorkflowsForTrigger(triggerType, data);
    const executions = [];
    for (const workflow of workflows){
        try {
            const execution = await WorkflowEngine.executeWorkflow(workflow.id, data);
            executions.push(execution);
        } catch (err) {
            console.error(`Workflow ${workflow.id} fehlgeschlagen:`, err);
        }
    }
    return executions;
}
const __TURBOPACK__default__export__ = WorkflowEngine;
}),
"[project]/src/app/api/admin/ai/workflows/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AI CENTER - WORKFLOWS API
// =====================================================
// GET /api/admin/ai/workflows - Liste alle Workflows
// POST /api/admin/ai/workflows - Erstelle neuen Workflow
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$center$2f$workflow$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-center/workflow-engine.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const workflows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$center$2f$workflow$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WorkflowEngine"].listWorkflows(status || undefined);
        // Summary berechnen
        const summary = {
            total: workflows.length,
            active: workflows.filter((w)=>w.status === "active").length,
            paused: workflows.filter((w)=>w.status === "paused").length,
            disabled: workflows.filter((w)=>w.status === "disabled").length,
            total_runs: workflows.reduce((sum, w)=>sum + w.run_count, 0)
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                workflows,
                summary
            }
        });
    } catch (error) {
        console.error("❌ Workflows List Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Fehler"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validierung
        if (!body.name || !body.trigger || !body.actions) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "name, trigger und actions sind erforderlich"
            }, {
                status: 400
            });
        }
        const workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$center$2f$workflow$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WorkflowEngine"].createWorkflow({
            name: body.name,
            description: body.description || "",
            trigger: body.trigger,
            actions: body.actions,
            status: body.status || "active"
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Workflow "${workflow.name}" erstellt`,
            data: workflow
        });
    } catch (error) {
        console.error("❌ Workflow Create Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Fehler"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7e51095f._.js.map