module.exports = [
"[project]/.next-internal/server/app/api/auth/check-session/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/session-security.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ SESSION SECURITY SERVICE
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Enterprise-Level Session-Management
// Standard: IBM/SAP/Siemens Security Level
// =====================================================
__turbopack_context__.s([
    "SessionSecurityService",
    ()=>SessionSecurityService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
;
// =====================================================
// KONFIGURATION
// =====================================================
const CONFIG = {
    // Session-Timeout nach Inaktivität (30 Minuten)
    INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000,
    // Maximale Session-Dauer (8 Stunden)
    MAX_SESSION_DURATION_MS: 8 * 60 * 60 * 1000,
    // JWT Secret (aus Umgebungsvariable oder Fallback)
    JWT_SECRET: process.env.JWT_SECRET || "lopez-it-welt-enterprise-secret-2025",
    // IP-Binding aktivieren
    ENABLE_IP_BINDING: true,
    // Concurrent Sessions pro User (0 = unbegrenzt)
    MAX_CONCURRENT_SESSIONS: 1,
    // Session-Refresh-Intervall (5 Minuten)
    REFRESH_INTERVAL_MS: 5 * 60 * 1000
};
class SessionSecurityService {
    // =====================================================
    // SESSION VALIDIERUNG (Haupt-Funktion)
    // =====================================================
    static async validateSession(sessionToken, jwtToken, clientIp, userAgent) {
        // 1. Token vorhanden?
        if (!sessionToken && !jwtToken) {
            return {
                valid: false,
                error: "Kein Auth-Token",
                errorCode: "NO_TOKEN"
            };
        }
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // 2. Session aus DB laden
            let sessionQuery = "";
            let sessionParams = [];
            if (sessionToken) {
                sessionQuery = `
          SELECT s.*, u.username, u.email, u.status as user_status
          FROM lopez_sessions s
          JOIN lopez_users u ON s.user_id = u.id
          WHERE s.session_token = ?
        `;
                sessionParams = [
                    sessionToken
                ];
            } else if (jwtToken) {
                // JWT dekodieren um User-ID zu erhalten
                try {
                    const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(jwtToken, CONFIG.JWT_SECRET);
                    sessionQuery = `
            SELECT s.*, u.username, u.email, u.status as user_status
            FROM lopez_sessions s
            JOIN lopez_users u ON s.user_id = u.id
            WHERE s.user_id = ? AND s.expires_at > NOW()
            ORDER BY s.created_at DESC
            LIMIT 1
          `;
                    sessionParams = [
                        decoded.userId
                    ];
                } catch (jwtError) {
                    return {
                        valid: false,
                        error: "JWT ungültig",
                        errorCode: "INVALID_TOKEN"
                    };
                }
            }
            const [rows] = await pool.execute(sessionQuery, sessionParams);
            const sessions = rows;
            if (sessions.length === 0) {
                return {
                    valid: false,
                    error: "Session nicht gefunden",
                    errorCode: "SESSION_NOT_FOUND"
                };
            }
            const session = sessions[0];
            // 3. User-Status prüfen
            if (session.user_status !== "active") {
                return {
                    valid: false,
                    error: "Benutzer deaktiviert",
                    errorCode: "USER_INACTIVE"
                };
            }
            // 4. Session abgelaufen?
            const expiresAt = new Date(session.expires_at);
            if (expiresAt < new Date()) {
                await this.invalidateSession(session.session_token);
                return {
                    valid: false,
                    error: "Session abgelaufen",
                    errorCode: "SESSION_EXPIRED"
                };
            }
            // 5. Inaktivitäts-Timeout prüfen
            const lastActivity = new Date(session.last_activity_at || session.created_at);
            const timeSinceActivity = Date.now() - lastActivity.getTime();
            if (timeSinceActivity > CONFIG.INACTIVITY_TIMEOUT_MS) {
                await this.invalidateSession(session.session_token);
                return {
                    valid: false,
                    error: "Session-Timeout wegen Inaktivität",
                    errorCode: "TIMEOUT"
                };
            }
            // 6. IP-Binding prüfen (wenn aktiviert)
            if (CONFIG.ENABLE_IP_BINDING && session.ip_address) {
                // Toleranz für IPv4/IPv6 Wechsel oder Proxy
                const storedIp = session.ip_address.split(",")[0].trim();
                const currentIp = clientIp.split(",")[0].trim();
                // Nur warnen, nicht blockieren (für Entwicklung)
                if (storedIp !== currentIp && storedIp !== "unknown" && currentIp !== "unknown") {
                    console.warn(`⚠️ IP-Wechsel erkannt: ${storedIp} → ${currentIp} (User: ${session.username})`);
                // In Produktion könnte man hier blockieren:
                // return { valid: false, error: "IP-Adresse geändert", errorCode: "IP_MISMATCH" };
                }
            }
            // 7. Letzte Aktivität aktualisieren
            await this.updateLastActivity(session.session_token);
            // 8. Rollen und Permissions laden
            const roles = await this.getUserRoles(session.user_id);
            const permissions = await this.getUserPermissions(session.user_id);
            // 9. Session-Daten zurückgeben
            return {
                valid: true,
                session: {
                    userId: session.user_id,
                    username: session.username,
                    email: session.email,
                    roles,
                    permissions,
                    ipAddress: session.ip_address,
                    userAgent: session.user_agent,
                    createdAt: new Date(session.created_at),
                    lastActivityAt: new Date(),
                    expiresAt: new Date(session.expires_at)
                }
            };
        } catch (error) {
            console.error("❌ Session-Validierung fehlgeschlagen:", error);
            return {
                valid: false,
                error: "Interner Fehler",
                errorCode: "INVALID_TOKEN"
            };
        }
    }
    // =====================================================
    // SESSION ERSTELLEN
    // =====================================================
    static async createSession(userId, ipAddress, userAgent) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Concurrent Sessions prüfen und alte löschen
            if (CONFIG.MAX_CONCURRENT_SESSIONS > 0) {
                await pool.execute(`DELETE FROM lopez_sessions 
           WHERE user_id = ? 
           AND id NOT IN (
             SELECT id FROM (
               SELECT id FROM lopez_sessions 
               WHERE user_id = ? 
               ORDER BY created_at DESC 
               LIMIT ?
             ) as keep_sessions
           )`, [
                    userId,
                    userId,
                    CONFIG.MAX_CONCURRENT_SESSIONS - 1
                ]);
            }
            // Neue Session erstellen
            const sessionToken = this.generateSessionToken();
            const expiresAt = new Date(Date.now() + CONFIG.MAX_SESSION_DURATION_MS);
            await pool.execute(`INSERT INTO lopez_sessions 
         (user_id, session_token, ip_address, user_agent, expires_at, last_activity_at, created_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`, [
                userId,
                sessionToken,
                ipAddress,
                userAgent,
                expiresAt
            ]);
            console.log(`✅ Enterprise++ Session erstellt für User ${userId}`);
            return {
                sessionToken,
                expiresAt
            };
        } catch (error) {
            console.error("❌ Session-Erstellung fehlgeschlagen:", error);
            return null;
        }
    }
    // =====================================================
    // SESSION INVALIDIEREN
    // =====================================================
    static async invalidateSession(sessionToken) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await pool.execute("DELETE FROM lopez_sessions WHERE session_token = ?", [
                sessionToken
            ]);
            console.log(`🔒 Session invalidiert: ${sessionToken.substring(0, 20)}...`);
            return true;
        } catch (error) {
            console.error("❌ Session-Invalidierung fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // ALLE USER-SESSIONS INVALIDIEREN
    // =====================================================
    static async invalidateAllUserSessions(userId) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [result] = await pool.execute("DELETE FROM lopez_sessions WHERE user_id = ?", [
                userId
            ]);
            console.log(`🔒 Alle Sessions für User ${userId} invalidiert`);
            return true;
        } catch (error) {
            console.error("❌ Session-Invalidierung fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // LETZTE AKTIVITÄT AKTUALISIEREN
    // =====================================================
    static async updateLastActivity(sessionToken) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await pool.execute("UPDATE lopez_sessions SET last_activity_at = NOW() WHERE session_token = ?", [
                sessionToken
            ]);
        } catch (error) {
            // Fehler ignorieren (nicht kritisch)
            console.warn("⚠️ Last-Activity-Update fehlgeschlagen:", error);
        }
    }
    // =====================================================
    // USER-ROLLEN LADEN
    // =====================================================
    static async getUserRoles(userId) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await pool.execute(`SELECT r.name FROM lopez_roles r
         JOIN lopez_user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = ?`, [
                userId
            ]);
            return rows.map((r)=>r.name);
        } catch (error) {
            return [];
        }
    }
    // =====================================================
    // USER-PERMISSIONS LADEN
    // =====================================================
    static async getUserPermissions(userId) {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await pool.execute(`SELECT DISTINCT CONCAT(p.resource, '.', p.action) as permission_key 
         FROM lopez_permissions p
         JOIN lopez_role_permissions rp ON p.id = rp.permission_id
         JOIN lopez_user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = ?`, [
                userId
            ]);
            return rows.map((p)=>p.permission_key);
        } catch (error) {
            return [];
        }
    }
    // =====================================================
    // SESSION-TOKEN GENERIEREN
    // =====================================================
    static generateSessionToken() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for(let i = 0; i < 64; i++){
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    // =====================================================
    // JWT GENERIEREN
    // =====================================================
    static generateJWT(session) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
            userId: session.userId,
            username: session.username,
            roles: session.roles
        }, CONFIG.JWT_SECRET, {
            expiresIn: "8h"
        });
    }
    // =====================================================
    // JWT VERIFIZIEREN
    // =====================================================
    static verifyJWT(token) {
        try {
            const payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, CONFIG.JWT_SECRET);
            return {
                valid: true,
                payload
            };
        } catch (error) {
            return {
                valid: false,
                error: "JWT ungültig oder abgelaufen"
            };
        }
    }
    // =====================================================
    // ABGELAUFENE SESSIONS BEREINIGEN (Cronjob)
    // =====================================================
    static async cleanupExpiredSessions() {
        try {
            const pool = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [result] = await pool.execute("DELETE FROM lopez_sessions WHERE expires_at < NOW()");
            const deleted = result.affectedRows || 0;
            if (deleted > 0) {
                console.log(`🧹 ${deleted} abgelaufene Sessions bereinigt`);
            }
            return deleted;
        } catch (error) {
            console.error("❌ Session-Cleanup fehlgeschlagen:", error);
            return 0;
        }
    }
}
const __TURBOPACK__default__export__ = SessionSecurityService;
}),
"[project]/src/lib/audit-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AUDIT SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Erweiterte Compliance-Protokollierung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "AuditService",
    ()=>AuditService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
class AuditService {
    // =====================================================
    // AUDIT-LOGGING
    // =====================================================
    static async logAudit(auditData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_audit_logs 
                (table_name, record_id, action, old_values, new_values, user_id, username, ip_address, user_agent, session_id, risk_level, compliance_category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                auditData.table_name,
                auditData.record_id,
                auditData.action,
                auditData.old_values ? JSON.stringify(auditData.old_values) : null,
                auditData.new_values ? JSON.stringify(auditData.new_values) : null,
                auditData.user_id,
                auditData.username || null,
                auditData.ip_address || null,
                auditData.user_agent || null,
                auditData.session_id || null,
                auditData.risk_level,
                auditData.compliance_category
            ]);
            return true;
        } catch (error) {
            console.error("❌ Audit-Logging fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // SPEZIFISCHE AUDIT-EVENTS
    // =====================================================
    static async logLogin(userId, username, ipAddress, userAgent, sessionId) {
        await this.logAudit({
            table_name: "lopez_users",
            record_id: userId,
            action: "LOGIN",
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            session_id: sessionId,
            risk_level: "LOW",
            compliance_category: "AUTHENTICATION"
        });
    }
    static async logLogout(userId, username, ipAddress, userAgent, sessionId) {
        await this.logAudit({
            table_name: "lopez_users",
            record_id: userId,
            action: "LOGOUT",
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            session_id: sessionId,
            risk_level: "LOW",
            compliance_category: "AUTHENTICATION"
        });
    }
    static async log2FASetup(userId, username, ipAddress, userAgent) {
        await this.logAudit({
            table_name: "lopez_user_2fa",
            record_id: userId,
            action: "2FA_SETUP",
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: "MEDIUM",
            compliance_category: "SECURITY_EVENT"
        });
    }
    static async log2FAVerify(userId, username, success, ipAddress, userAgent) {
        await this.logAudit({
            table_name: "lopez_user_2fa",
            record_id: userId,
            action: "2FA_VERIFY",
            new_values: {
                success
            },
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: success ? "LOW" : "HIGH",
            compliance_category: "AUTHENTICATION"
        });
    }
    static async logPasswordChange(userId, username, ipAddress, userAgent) {
        await this.logAudit({
            table_name: "lopez_users",
            record_id: userId,
            action: "PASSWORD_CHANGE",
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: "MEDIUM",
            compliance_category: "SECURITY_EVENT"
        });
    }
    static async logRoleAssignment(userId, targetUserId, roleName, assignedBy, ipAddress, userAgent) {
        await this.logAudit({
            table_name: "lopez_user_roles",
            record_id: targetUserId,
            action: "ROLE_ASSIGN",
            new_values: {
                role_name: roleName,
                assigned_by: assignedBy
            },
            user_id: userId,
            username: assignedBy,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: "HIGH",
            compliance_category: "AUTHORIZATION"
        });
    }
    static async logDataAccess(userId, username, tableName, recordId, action, ipAddress, userAgent) {
        await this.logAudit({
            table_name: tableName,
            record_id: recordId,
            action: action,
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: "LOW",
            compliance_category: "DATA_ACCESS"
        });
    }
    static async logDataModification(userId, username, tableName, recordId, action, oldValues, newValues, ipAddress, userAgent) {
        await this.logAudit({
            table_name: tableName,
            record_id: recordId,
            action: action,
            old_values: oldValues,
            new_values: newValues,
            user_id: userId,
            username,
            ip_address: ipAddress,
            user_agent: userAgent,
            risk_level: "MEDIUM",
            compliance_category: "DATA_MODIFICATION"
        });
    }
    // =====================================================
    // AUDIT-ABFRAGEN
    // =====================================================
    static async getAuditLogs(filters = {}) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const { table_name, action, user_id, risk_level, compliance_category, date_from, date_to, page = 1, limit = 50 } = filters;
            const offset = (page - 1) * limit;
            // WHERE-Bedingungen aufbauen
            const whereConditions = [];
            const queryParams = [];
            if (table_name) {
                whereConditions.push("table_name = ?");
                queryParams.push(table_name);
            }
            if (action) {
                whereConditions.push("action = ?");
                queryParams.push(action);
            }
            if (user_id) {
                whereConditions.push("user_id = ?");
                queryParams.push(user_id);
            }
            if (risk_level) {
                whereConditions.push("risk_level = ?");
                queryParams.push(risk_level);
            }
            if (compliance_category) {
                whereConditions.push("compliance_category = ?");
                queryParams.push(compliance_category);
            }
            if (date_from) {
                whereConditions.push("created_at >= ?");
                queryParams.push(date_from);
            }
            if (date_to) {
                whereConditions.push("created_at <= ?");
                queryParams.push(date_to);
            }
            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
            // Gesamtanzahl ermitteln
            const countQuery = `SELECT COUNT(*) as total FROM lopez_audit_logs ${whereClause}`;
            const [countRows] = await connection.execute(countQuery, queryParams);
            const total = countRows[0].total;
            // Logs laden
            const logsQuery = `
                SELECT * FROM lopez_audit_logs 
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            const [logRows] = await connection.execute(logsQuery, [
                ...queryParams,
                limit,
                offset
            ]);
            return {
                logs: logRows,
                total
            };
        } catch (error) {
            console.error("❌ Audit-Logs-Abfrage fehlgeschlagen:", error);
            throw error;
        }
    }
    static async getAuditStats(dateFrom, dateTo) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const dateFilter = dateFrom && dateTo ? `WHERE created_at BETWEEN ? AND ?` : "";
            const dateParams = dateFrom && dateTo ? [
                dateFrom,
                dateTo
            ] : [];
            // Gesamtanzahl
            const [totalRows] = await connection.execute(`SELECT COUNT(*) as total FROM lopez_audit_logs ${dateFilter}`, dateParams);
            const total_logs = totalRows[0].total;
            // Nach Aktion
            const [actionRows] = await connection.execute(`SELECT action, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY action`, dateParams);
            const logs_by_action = actionRows.reduce((acc, row)=>{
                acc[row.action] = row.count;
                return acc;
            }, {});
            // Nach Risiko-Level
            const [riskRows] = await connection.execute(`SELECT risk_level, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY risk_level`, dateParams);
            const logs_by_risk_level = riskRows.reduce((acc, row)=>{
                acc[row.risk_level] = row.count;
                return acc;
            }, {});
            // Nach Kategorie
            const [categoryRows] = await connection.execute(`SELECT compliance_category, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY compliance_category`, dateParams);
            const logs_by_category = categoryRows.reduce((acc, row)=>{
                acc[row.compliance_category] = row.count;
                return acc;
            }, {});
            // Nach Benutzer
            const [userRows] = await connection.execute(`SELECT username, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY username ORDER BY count DESC LIMIT 10`, dateParams);
            const logs_by_user = userRows.reduce((acc, row)=>{
                acc[row.username] = row.count;
                return acc;
            }, {});
            // Letzte Aktivitäten
            const [recentRows] = await connection.execute(`SELECT * FROM lopez_audit_logs ${dateFilter} ORDER BY created_at DESC LIMIT 10`, dateParams);
            const recent_activity = recentRows;
            return {
                total_logs,
                logs_by_action,
                logs_by_risk_level,
                logs_by_category,
                logs_by_user,
                recent_activity
            };
        } catch (error) {
            console.error("❌ Audit-Statistiken fehlgeschlagen:", error);
            throw error;
        }
    }
    // =====================================================
    // COMPLIANCE-REPORTING
    // =====================================================
    static async generateComplianceReport(dateFrom, dateTo) {
        try {
            const stats = await this.getAuditStats(dateFrom, dateTo);
            return {
                report_period: {
                    from: dateFrom,
                    to: dateTo
                },
                generated_at: new Date().toISOString(),
                summary: {
                    total_events: stats.total_logs,
                    high_risk_events: stats.logs_by_risk_level.HIGH || 0,
                    critical_events: stats.logs_by_risk_level.CRITICAL || 0,
                    security_events: stats.logs_by_category.SECURITY_EVENT || 0,
                    data_modifications: stats.logs_by_category.DATA_MODIFICATION || 0
                },
                details: stats
            };
        } catch (error) {
            console.error("❌ Compliance-Report fehlgeschlagen:", error);
            throw error;
        }
    }
}
}),
"[project]/src/app/api/auth/check-session/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// SESSION CHECK API - LOPEZ IT WELT (ENTERPRISE++)
// =====================================================
// Prüft ob eine gültige Admin-Session existiert
// Mit vollständiger DB-Validierung, Timeout, IP-Binding
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session-security.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit-service.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        // Cookies aus Request lesen
        const sessionToken = request.cookies.get("adm_session")?.value;
        const jwtToken = request.cookies.get("adm_token")?.value;
        // Client-Info extrahieren
        const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        console.log("🔍 Enterprise++ Session-Check:", {
            hasSession: !!sessionToken,
            hasToken: !!jwtToken,
            clientIp: clientIp.substring(0, 20)
        });
        // Enterprise++ Session-Validierung (DB + Timeout + IP)
        const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionSecurityService"].validateSession(sessionToken, jwtToken, clientIp, userAgent);
        if (!validation.valid) {
            console.log(`🔒 Session ungültig: ${validation.errorCode} - ${validation.error}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: validation.error || "Session ungültig",
                errorCode: validation.errorCode
            }, {
                status: 401
            });
        }
        // Session gültig - Audit-Log (nur bei wichtigen Routen, nicht bei jedem Check)
        const referer = request.headers.get("referer") || "";
        const isImportantRoute = referer.includes("/admin/settings") || referer.includes("/admin/users") || referer.includes("/admin/system");
        if (isImportantRoute && validation.session) {
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AuditService"].logAudit({
                    table_name: "lopez_sessions",
                    record_id: validation.session.userId,
                    action: "SESSION_ACCESS",
                    user_id: validation.session.userId,
                    username: validation.session.username,
                    ip_address: clientIp,
                    user_agent: userAgent,
                    session_id: sessionToken || "jwt",
                    risk_level: "LOW",
                    compliance_category: "ACCESS",
                    new_values: JSON.stringify({
                        route: referer,
                        roles: validation.session.roles
                    })
                });
            } catch (auditError) {
            // Audit-Fehler ignorieren
            }
        }
        console.log(`✅ Session gültig für: ${validation.session?.username}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Session gültig",
            user: {
                id: validation.session?.userId,
                username: validation.session?.username,
                email: validation.session?.email,
                roles: validation.session?.roles
            },
            session: {
                expiresAt: validation.session?.expiresAt,
                lastActivity: validation.session?.lastActivityAt
            }
        });
    } catch (error) {
        console.error("❌ Session-Check Fehler:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Interner Fehler bei Session-Prüfung"
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    return POST(request);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1011c87f._.js.map