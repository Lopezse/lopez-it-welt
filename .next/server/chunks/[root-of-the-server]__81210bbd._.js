module.exports = [
"[project]/.next-internal/server/app/api/auth/permissions/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Enterprise++ Logger - SAP/IBM/Siemens Standard
 * 
 * Professionelles Logging-System mit verschiedenen Log-Levels
 * - Keine Secrets in Logs
 * - Strukturierte Logs für Monitoring
 * - Production-Safe (keine Debug-Logs in Production)
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "logger",
    ()=>logger
]);
class EnterpriseLogger {
    isDevelopment;
    isProduction;
    constructor(){
        this.isDevelopment = ("TURBOPACK compile-time value", "development") === "development";
        this.isProduction = ("TURBOPACK compile-time value", "development") === "production";
    }
    /**
     * Maskiert Secrets in Log-Kontexten
     */ maskSecrets(context) {
        const masked = {
            ...context
        };
        const secretKeys = [
            "password",
            "token",
            "secret",
            "key",
            "api_key",
            "apiKey",
            "authorization"
        ];
        for (const key of Object.keys(masked)){
            const lowerKey = key.toLowerCase();
            if (secretKeys.some((secret)=>lowerKey.includes(secret))) {
                masked[key] = "***MASKED***";
            }
        }
        return masked;
    }
    /**
     * Formatiert Log-Eintrag
     */ formatLog(level, message, context) {
        const timestamp = new Date().toISOString();
        const maskedContext = context ? this.maskSecrets(context) : undefined;
        const contextStr = maskedContext ? ` ${JSON.stringify(maskedContext)}` : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }
    /**
     * Debug-Log (nur in Development)
     */ debug(message, context) {
        if (this.isDevelopment) {
            console.debug(this.formatLog("debug", message, context));
        }
    }
    /**
     * Info-Log
     */ info(message, context) {
        console.log(this.formatLog("info", message, context));
    }
    /**
     * Warn-Log
     */ warn(message, context) {
        console.warn(this.formatLog("warn", message, context));
    }
    /**
     * Error-Log
     */ error(message, error, context) {
        const errorContext = {
            ...context,
            error: error instanceof Error ? {
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                name: error.name
            } : String(error)
        };
        console.error(this.formatLog("error", message, errorContext));
    }
    /**
     * Critical-Log (für kritische Fehler)
     */ critical(message, error, context) {
        const errorContext = {
            ...context,
            error: error instanceof Error ? {
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                name: error.name
            } : String(error)
        };
        console.error(this.formatLog("critical", message, errorContext));
        // In Production: Hier könnte zusätzlich ein Alert-System benachrichtigt werden
        // z.B. Sentry, PagerDuty, etc.
        if (this.isProduction) {
        // TODO: Alert-System integrieren (Sentry, etc.)
        }
    }
    /**
     * API-Request-Log
     */ request(method, path, statusCode, duration, context) {
        const logContext = {
            method,
            path,
            statusCode,
            ...duration !== undefined && {
                duration: `${duration}ms`
            },
            ...context
        };
        if (statusCode >= 500) {
            this.error(`API Request failed: ${method} ${path}`, undefined, logContext);
        } else if (statusCode >= 400) {
            this.warn(`API Request warning: ${method} ${path}`, logContext);
        } else {
            this.info(`API Request: ${method} ${path}`, logContext);
        }
    }
    /**
     * Database-Operation-Log
     */ database(operation, table, context) {
        const logContext = {
            operation,
            ...table && {
                table
            },
            ...context
        };
        this.info(`Database operation: ${operation}`, logContext);
    }
    /**
     * Security-Event-Log
     */ security(event, context) {
        const logContext = {
            event,
            ...context
        };
        this.warn(`Security event: ${event}`, logContext);
    }
}
const logger = new EnterpriseLogger();
const __TURBOPACK__default__export__ = logger;
}),
"[project]/src/lib/rbac-system.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// RBAC/ABAC SYSTEM - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Rollen- und berechtigungsbasiertes Zugriffskontrollsystem
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "RBACService",
    ()=>RBACService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-route] (ecmascript)");
;
;
class RBACService {
    // =====================================================
    // BENUTZER-MANAGEMENT
    // =====================================================
    static async createUser(userData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [result] = await connection.execute(`
                INSERT INTO lopez_users (username, email, password_hash, first_name, last_name, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                userData.username,
                userData.email,
                userData.password_hash,
                userData.first_name,
                userData.last_name,
                userData.status
            ]);
            const insertId = result.insertId;
            const user = await this.getUserById(insertId);
            return user;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Erstellen des Benutzers", error);
            throw error;
        }
    }
    static async getUserById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_users WHERE id = ?", [
                id
            ]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden des Benutzers", error);
            throw error;
        }
    }
    static async getUserByUsername(username) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_users WHERE username = ?", [
                username
            ]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden des Benutzers", error);
            throw error;
        }
    }
    static async getUserByEmail(email) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_users WHERE email = ?", [
                email
            ]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        } catch (error) {
            const errorMsg = error.message || String(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden des Benutzers", {
                error: errorMsg,
                email
            });
            // Wenn Tabelle nicht existiert, geben wir einen spezifischen Fehler zurück
            if (errorMsg.includes("doesn't exist") || errorMsg.includes("Table") || errorMsg.includes("Unknown table")) {
                const newError = new Error(`Tabelle lopez_users existiert nicht: ${errorMsg}`);
                newError.code = "TABLE_NOT_FOUND";
                throw newError;
            }
            throw error;
        }
    }
    // =====================================================
    // ROLLEN-MANAGEMENT
    // =====================================================
    static async createRole(roleData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [result] = await connection.execute(`
                INSERT INTO lopez_roles (name, description, level)
                VALUES (?, ?, ?)
            `, [
                roleData.name,
                roleData.description,
                roleData.level
            ]);
            const insertId = result.insertId;
            const role = await this.getRoleById(insertId);
            return role;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Erstellen der Rolle", error);
            throw error;
        }
    }
    static async getRoleById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_roles WHERE id = ?", [
                id
            ]);
            const roles = rows;
            return roles.length > 0 ? roles[0] : null;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der Rolle", error);
            throw error;
        }
    }
    static async getAllRoles() {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_roles ORDER BY level ASC");
            return rows;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der Rollen", error);
            throw error;
        }
    }
    // =====================================================
    // BERECHTIGUNGS-MANAGEMENT
    // =====================================================
    static async createPermission(permissionData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [result] = await connection.execute(`
                INSERT INTO lopez_permissions (resource, action, conditions)
                VALUES (?, ?, ?)
            `, [
                permissionData.resource,
                permissionData.action,
                permissionData.conditions ? JSON.stringify(permissionData.conditions) : null
            ]);
            const insertId = result.insertId;
            const permission = await this.getPermissionById(insertId);
            return permission;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Erstellen der Berechtigung", error);
            throw error;
        }
    }
    static async getPermissionById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_permissions WHERE id = ?", [
                id
            ]);
            const permissions = rows;
            return permissions.length > 0 ? permissions[0] : null;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der Berechtigung", error);
            throw error;
        }
    }
    // =====================================================
    // ZUGRIFFSKONTROLLE
    // =====================================================
    static async checkPermission(context) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Benutzer-Rollen laden
            const [userRoles] = await connection.execute(`
                SELECT r.*, ur.expires_at
                FROM lopez_user_roles ur
                JOIN lopez_roles r ON ur.role_id = r.id
                WHERE ur.user_id = ? AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
            `, [
                context.user_id
            ]);
            if (userRoles.length === 0) {
                return false;
            }
            // Berechtigungen für jede Rolle prüfen
            for (const userRole of userRoles){
                const [permissions] = await connection.execute(`
                    SELECT p.*, rp.granted
                    FROM lopez_role_permissions rp
                    JOIN lopez_permissions p ON rp.permission_id = p.id
                    WHERE rp.role_id = ? AND p.resource = ? AND p.action = ?
                `, [
                    userRole.id,
                    context.resource,
                    context.action
                ]);
                for (const permission of permissions){
                    if (permission.granted) {
                        // ABAC-Bedingungen prüfen
                        if (permission.conditions) {
                            const conditions = JSON.parse(permission.conditions);
                            if (await this.evaluateABACConditions(conditions, context)) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei der Berechtigungsprüfung", error);
            return false;
        }
    }
    static async evaluateABACConditions(conditions, context) {
        try {
            // Einfache ABAC-Bedingungsauswertung
            // In Produktion: Vollständige ABAC-Engine implementieren
            for (const [key, value] of Object.entries(conditions)){
                if (context.attributes && context.attributes[key] !== value) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei der ABAC-Auswertung", error);
            return false;
        }
    }
    // =====================================================
    // ROLLEN-ZUWEISUNG
    // =====================================================
    static async assignRoleToUser(userId, roleId, assignedBy, expiresAt) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_user_roles (user_id, role_id, assigned_by, assigned_at, expires_at)
                VALUES (?, ?, ?, NOW(), ?)
            `, [
                userId,
                roleId,
                assignedBy,
                expiresAt || null
            ]);
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei der Rollen-Zuweisung", error);
            return false;
        }
    }
    static async removeRoleFromUser(userId, roleId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                DELETE FROM lopez_user_roles 
                WHERE user_id = ? AND role_id = ?
            `, [
                userId,
                roleId
            ]);
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei der Rollen-Entfernung", error);
            return false;
        }
    }
    // =====================================================
    // BERECHTIGUNGS-ZUWEISUNG
    // =====================================================
    static async assignPermissionToRole(roleId, permissionId, granted = true) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_role_permissions (role_id, permission_id, granted)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE granted = ?
            `, [
                roleId,
                permissionId,
                granted,
                granted
            ]);
            return true;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei der Berechtigungs-Zuweisung", error);
            return false;
        }
    }
    // =====================================================
    // BENUTZER-ROLLEN ABRUFEN
    // =====================================================
    static async getUserRoles(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT r.*
                FROM lopez_user_roles ur
                JOIN lopez_roles r ON ur.role_id = r.id
                WHERE ur.user_id = ? AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
            `, [
                userId
            ]);
            return rows;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der Benutzer-Rollen", error);
            throw error;
        }
    }
    // =====================================================
    // ROLLEN-BERECHTIGUNGEN ABRUFEN
    // =====================================================
    static async getRolePermissions(roleId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT p.*, rp.granted
                FROM lopez_role_permissions rp
                JOIN lopez_permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = ? AND rp.granted = true
            `, [
                roleId
            ]);
            return rows;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der Rollen-Berechtigungen", error);
            throw error;
        }
    }
    // =====================================================
    // ENTERPRISE++ PERMISSION HELPERS
    // =====================================================
    /**
   * Holt alle Permission-Keys eines Users als Array
   * Format: ["admin.dashboard.view", "admin.customers.view", ...]
   */ static async getUserPermissionKeys(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
          SELECT DISTINCT CONCAT(p.resource, '.', p.action) as permission_key
          FROM lopez_user_roles ur
          JOIN lopez_role_permissions rp ON ur.role_id = rp.role_id
          JOIN lopez_permissions p ON rp.permission_id = p.id
          WHERE ur.user_id = ? 
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
            AND rp.granted = true
          ORDER BY p.resource, p.action
        `, [
                userId
            ]);
            return rows.map((row)=>row.permission_key);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der User-Permission-Keys", error);
            return [];
        }
    }
    /**
   * Prüft ob User eine bestimmte Permission hat
   * @param userId User-ID
   * @param permissionKey Format: "admin.dashboard.view" oder "resource.action"
   */ static async hasPermission(userId, permissionKey) {
        try {
            const [resource, action] = this.parsePermissionKey(permissionKey);
            return await this.checkPermission({
                user_id: userId,
                resource,
                action
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler bei hasPermission", error);
            return false;
        }
    }
    /**
   * Prüft ob User mindestens eine der angegebenen Permissions hat
   */ static async hasAnyPermission(userId, permissionKeys) {
        for (const key of permissionKeys){
            if (await this.hasPermission(userId, key)) {
                return true;
            }
        }
        return false;
    }
    /**
   * Parst einen Permission-Key in resource und action
   * "admin.dashboard.view" → ["admin.dashboard", "view"]
   * "customers.read" → ["customers", "read"]
   */ static parsePermissionKey(key) {
        const parts = key.split(".");
        const action = parts.pop() || "view";
        const resource = parts.join(".");
        return [
            resource,
            action
        ];
    }
    /**
   * Holt die höchste Rolle eines Users (niedrigster Level = höchste Rechte)
   */ static async getUserHighestRole(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
          SELECT r.*
          FROM lopez_user_roles ur
          JOIN lopez_roles r ON ur.role_id = r.id
          WHERE ur.user_id = ? 
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
          ORDER BY r.level ASC
          LIMIT 1
        `, [
                userId
            ]);
            const roles = rows;
            return roles.length > 0 ? roles[0] : null;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Fehler beim Laden der höchsten User-Rolle", error);
            return null;
        }
    }
    /**
   * Prüft ob User Super Admin ist
   */ static async isSuperAdmin(userId) {
        const role = await this.getUserHighestRole(userId);
        return role?.name === "Super Admin" || role?.level === 1;
    }
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[project]/src/lib/2fa-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// 2FA SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Zwei-Faktor-Authentifizierung für Admin-Zugang
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "TwoFactorService",
    ()=>TwoFactorService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qrcode/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$speakeasy$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/speakeasy/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
;
;
class TwoFactorService {
    // =====================================================
    // 2FA-SETUP
    // =====================================================
    static async setup2FA(userId, email, username) {
        try {
            // Speakeasy Secret generieren (Aegis-kompatibel: TOTP, 30 Sek. Intervalle, 6-stellig)
            const secret = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$speakeasy$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generateSecret({
                name: email || username || `user_${userId}`,
                issuer: "Lopez IT Welt",
                length: 32
            });
            // otpauth URL für Aegis/Google Authenticator (TOTP, 30 Sekunden, 6-stellig)
            const otpauthUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$speakeasy$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].otpauthURL({
                secret: secret.base32,
                label: email || username || `user_${userId}`,
                issuer: "Lopez IT Welt",
                encoding: "base32",
                algorithm: "sha1",
                digits: 6,
                period: 30
            });
            // QR-Code generieren
            const qrCodeUrl = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].toDataURL(otpauthUrl);
            // Backup-Codes generieren
            const backupCodes = this.generateBackupCodes();
            // Secret in Datenbank speichern (noch nicht aktiviert, erst nach Verifikation)
            // Das Secret wird erst nach erfolgreicher Verifikation aktiviert
            return {
                secret: secret.base32,
                qrCodeUrl,
                backupCodes
            };
        } catch (error) {
            console.error("❌ 2FA-Setup fehlgeschlagen:", error);
            throw error;
        }
    }
    // =====================================================
    // 2FA-VERIFIKATION
    // =====================================================
    static async verifyToken(userId, token) {
        try {
            // User Secret aus Datenbank laden
            const userSecret = await this.getUserSecret(userId);
            if (!userSecret) {
                return false;
            }
            // Token verifizieren (WICHTIG: encoding: "base32" für Aegis!)
            // Window: 6 = ±3 Minuten Toleranz für Zeitdrift
            const verified = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$speakeasy$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].totp.verify({
                secret: userSecret.secret,
                encoding: "base32",
                token: token,
                window: 6
            });
            if (verified) {
                // Verifikation in Datenbank speichern
                await this.saveVerification(userId, token, true);
                return true;
            }
            // Backup-Code prüfen
            const backupVerified = await this.verifyBackupCode(userId, token);
            if (backupVerified) {
                await this.saveVerification(userId, token, true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("❌ 2FA-Verifikation fehlgeschlagen:", error);
            return false;
        }
    }
    /**
   * Verifiziert einen 2FA-Code mit einem gegebenen Secret (für Setup-Verifikation)
   */ static async verifyTokenWithSecret(secret, token) {
        try {
            const verified = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$speakeasy$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].totp.verify({
                secret: secret,
                encoding: "base32",
                token: token,
                window: 2
            });
            return verified === true;
        } catch (error) {
            console.error("❌ 2FA-Token-Verifikation mit Secret fehlgeschlagen:", error);
            return false;
        }
    }
    /**
   * Aktiviert 2FA für einen Benutzer (speichert Secret in DB)
   */ static async enable2FA(userId, secret, backupCodes) {
        try {
            const codes = backupCodes || this.generateBackupCodes();
            await this.saveUserSecret(userId, secret, codes);
            console.log(`✅ 2FA für Benutzer ${userId} aktiviert`);
            return true;
        } catch (error) {
            console.error("❌ 2FA-Aktivierung fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // BACKUP-CODES
    // =====================================================
    static async generateNewBackupCodes(userId) {
        try {
            const backupCodes = this.generateBackupCodes();
            await this.updateUserBackupCodes(userId, backupCodes);
            return backupCodes;
        } catch (error) {
            console.error("❌ Backup-Codes-Generierung fehlgeschlagen:", error);
            throw error;
        }
    }
    static async verifyBackupCode(userId, code) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT backup_codes FROM lopez_user_2fa WHERE user_id = ?", [
                userId
            ]);
            if (rows.length === 0) {
                return false;
            }
            const backupCodes = JSON.parse(rows[0].backup_codes);
            const index = backupCodes.indexOf(code);
            if (index !== -1) {
                // Backup-Code entfernen (einmalig verwendbar)
                backupCodes.splice(index, 1);
                await this.updateUserBackupCodes(userId, backupCodes);
                return true;
            }
            return false;
        } catch (error) {
            console.error("❌ Backup-Code-Verifikation fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // 2FA-STATUS
    // =====================================================
    static async is2FAEnabled(userId) {
        try {
            const userSecret = await this.getUserSecret(userId);
            return userSecret !== null;
        } catch (error) {
            console.error("❌ 2FA-Status-Prüfung fehlgeschlagen:", error);
            return false;
        }
    }
    static async disable2FA(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute("DELETE FROM lopez_user_2fa WHERE user_id = ?", [
                userId
            ]);
            console.log(`✅ 2FA für Benutzer ${userId} deaktiviert`);
            return true;
        } catch (error) {
            console.error("❌ 2FA-Deaktivierung fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // HILFSFUNKTIONEN
    // =====================================================
    static generateBackupCodes() {
        const codes = [];
        for(let i = 0; i < 10; i++){
            codes.push(this.generateRandomCode(8));
        }
        return codes;
    }
    static generateRandomCode(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for(let i = 0; i < length; i++){
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    static async saveUserSecret(userId, secret, backupCodes) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_user_2fa (user_id, secret, backup_codes, created_at)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE
                secret = VALUES(secret),
                backup_codes = VALUES(backup_codes),
                updated_at = NOW()
            `, [
                userId,
                secret,
                JSON.stringify(backupCodes)
            ]);
        } catch (error) {
            console.error("❌ User Secret speichern fehlgeschlagen:", error);
            throw error;
        }
    }
    static async getUserSecret(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT secret, backup_codes FROM lopez_user_2fa WHERE user_id = ?", [
                userId
            ]);
            if (rows.length === 0) {
                return null;
            }
            const row = rows[0];
            return {
                secret: row.secret,
                backupCodes: JSON.parse(row.backup_codes)
            };
        } catch (error) {
            console.error("❌ User Secret laden fehlgeschlagen:", error);
            return null;
        }
    }
    static async updateUserBackupCodes(userId, backupCodes) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute("UPDATE lopez_user_2fa SET backup_codes = ?, updated_at = NOW() WHERE user_id = ?", [
                JSON.stringify(backupCodes),
                userId
            ]);
        } catch (error) {
            console.error("❌ Backup-Codes aktualisieren fehlgeschlagen:", error);
            throw error;
        }
    }
    static async saveVerification(userId, token, verified) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Minuten
            await connection.execute(`
                INSERT INTO lopez_user_2fa_verifications (user_id, token, verified, expires_at, created_at)
                VALUES (?, ?, ?, ?, NOW())
            `, [
                userId,
                token,
                verified,
                expiresAt
            ]);
        } catch (error) {
            console.error("❌ 2FA-Verifikation speichern fehlgeschlagen:", error);
        }
    }
}
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/src/lib/email-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// EMAIL SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: E-Mail-Versand für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "EmailService",
    ()=>EmailService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
class EmailService {
    transporter;
    constructor(){
        this.transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
            host: process.env.SMTP_HOST || "localhost",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER || "",
                pass: process.env.SMTP_PASS || ""
            }
        });
    }
    // =====================================================
    // E-MAIL-VERSAND
    // =====================================================
    async sendEmail(emailData) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || "noreply@lopez-it-welt.de",
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log("✅ E-Mail erfolgreich versendet:", result.messageId);
            return true;
        } catch (error) {
            console.error("❌ E-Mail-Versand fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // KUNDEN-E-MAILS
    // =====================================================
    async sendCustomerWelcome(customer) {
        const subject = "Willkommen bei Lopez IT Welt";
        const html = this.getWelcomeHTML(customer);
        const text = this.getWelcomeText(customer);
        return await this.sendEmail({
            to: customer.email,
            subject,
            html,
            text
        });
    }
    async sendCustomerUpdate(customer, changes) {
        const subject = "Ihre Kundendaten wurden aktualisiert";
        const html = this.getUpdateHTML(customer, changes);
        const text = this.getUpdateText(customer, changes);
        return await this.sendEmail({
            to: customer.email,
            subject,
            html,
            text
        });
    }
    // =====================================================
    // ADMIN-E-MAILS
    // =====================================================
    async sendAdminNotification(subject, message, adminEmails) {
        const html = this.getAdminNotificationHTML(subject, message);
        const text = this.getAdminNotificationText(subject, message);
        return await this.sendEmail({
            to: adminEmails.join(", "),
            subject,
            html,
            text
        });
    }
    // =====================================================
    // KONTAKT-FORMULAR BENACHRICHTIGUNGEN
    // =====================================================
    async sendContactNotifications(messageData) {
        try {
            // E-Mail an Admin senden
            const adminEmails = [
                process.env.ADMIN_EMAIL || "admin@lopez-it-welt.de"
            ];
            const adminSubject = `Neue Kontaktanfrage: ${messageData.subject}`;
            const adminMessage = `
        Neue Kontaktanfrage erhalten:
        
        Name: ${messageData.name}
        E-Mail: ${messageData.email}
        ${messageData.phone ? `Telefon: ${messageData.phone}` : ""}
        ${messageData.company ? `Firma: ${messageData.company}` : ""}
        Priorität: ${messageData.priority}
        Betreff: ${messageData.subject}
        
        Nachricht:
        ${messageData.message}
        
        Erstellt: ${messageData.created_at}
      `;
            await this.sendAdminNotification(adminSubject, adminMessage, adminEmails);
            // Bestätigungs-E-Mail an Kunden senden
            const customerSubject = "Ihre Nachricht wurde erhalten";
            const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nachricht erhalten</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Ihre Nachricht wurde erhalten</h2>
            <p>Hallo ${messageData.name},</p>
            <p>vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
            <p><strong>Ihre Nachricht:</strong></p>
            <p style="background: #f8fafc; padding: 15px; border-left: 4px solid #1e40af;">
              ${messageData.message}
            </p>
            <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
          </div>
        </body>
        </html>
      `;
            const customerText = `
        Ihre Nachricht wurde erhalten
        
        Hallo ${messageData.name},
        
        vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
        
        Ihre Nachricht:
        ${messageData.message}
        
        Mit freundlichen Grüßen
        Ihr Lopez IT Welt Team
      `;
            await this.sendEmail({
                to: messageData.email,
                subject: customerSubject,
                html: customerHtml,
                text: customerText
            });
            return true;
        } catch (error) {
            console.error("❌ Fehler beim Senden der Kontakt-Benachrichtigungen:", error);
            return false;
        }
    }
    // =====================================================
    // E-MAIL-TEMPLATES
    // =====================================================
    getWelcomeHTML(customer) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Willkommen bei Lopez IT Welt</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Willkommen bei Lopez IT Welt</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>herzlich willkommen in unserem Kundenverwaltungssystem!</p>
                        <p><strong>Ihre Kundendaten:</strong></p>
                        <ul>
                            <li>Kundennummer: ${customer.kundennummer}</li>
                            <li>E-Mail: ${customer.email}</li>
                            <li>Support-Level: ${customer.support_level}</li>
                            <li>Status: ${customer.status}</li>
                        </ul>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getWelcomeText(customer) {
        return `
            Willkommen bei Lopez IT Welt
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            herzlich willkommen in unserem Kundenverwaltungssystem!
            
            Ihre Kundendaten:
            - Kundennummer: ${customer.kundennummer}
            - E-Mail: ${customer.email}
            - Support-Level: ${customer.support_level}
            - Status: ${customer.status}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    getUpdateHTML(customer, changes) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Kundendaten aktualisiert</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Kundendaten aktualisiert</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>Ihre Kundendaten wurden erfolgreich aktualisiert.</p>
                        <p><strong>Geänderte Felder:</strong> ${changes.join(", ")}</p>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getUpdateText(customer, changes) {
        return `
            Kundendaten aktualisiert
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            Ihre Kundendaten wurden erfolgreich aktualisiert.
            
            Geänderte Felder: ${changes.join(", ")}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    getAdminNotificationHTML(subject, message) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Admin-Benachrichtigung</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Admin-Benachrichtigung</h1>
                    </div>
                    <div class="content">
                        <h2>${subject}</h2>
                        <p>${message}</p>
                        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString("de-DE")}</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getAdminNotificationText(subject, message) {
        return `
            Admin-Benachrichtigung
            
            ${subject}
            
            ${message}
            
            Zeitstempel: ${new Date().toLocaleString("de-DE")}
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    // =====================================================
    // E-MAIL-VALIDIERUNG
    // =====================================================
    async validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // =====================================================
    // DOMAIN-STRATEGIE METHODS
    // =====================================================
    /**
   * Generiert E-Mail-Adresse basierend auf Domain-Strategie
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */ static generateEmailAddress(userData) {
        const { first_name, last_name, domain_type } = userData;
        // Gesetzliche Namenskonvention: Doppel-Nachname zusammenfügen
        const cleanFirstName = first_name.toLowerCase().replace(/[^a-zäöüß]/g, "");
        const cleanLastName = last_name.toLowerCase().replace(/[^a-zäöüß]/g, "").replace(/\s+/g, "");
        const domain = domain_type === "external" ? "lopezitwelt.de" : "lopez-team.de";
        return `${cleanFirstName}.${cleanLastName}@${domain}`;
    }
    /**
   * Generiert Display-Name für Benutzer
   */ static generateDisplayName(firstName, lastName, role) {
        const fullName = `${firstName} ${lastName}`;
        return role ? `${fullName} - ${role}` : fullName;
    }
    /**
   * Validiert E-Mail-Adresse basierend auf Domain-Strategie
   */ static validateEmailDomain(email, domainType) {
        const expectedDomain = domainType === "external" ? "lopezitwelt.de" : "lopez-team.de";
        return email.endsWith(`@${expectedDomain}`);
    }
    // =====================================================
    // E-MAIL-KONFIGURATION TESTEN
    // =====================================================
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ E-Mail-Verbindung erfolgreich getestet");
            return true;
        } catch (error) {
            console.error("❌ E-Mail-Verbindung fehlgeschlagen:", error);
            return false;
        }
    }
}
}),
"[project]/src/lib/domain-strategy.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DOMAIN STRATEGY - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Domain-Strategie Implementation (lopezitwelt.de / lopez-team.de)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "DomainStrategy",
    ()=>DomainStrategy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email-service.ts [app-route] (ecmascript)");
;
class DomainStrategy {
    // =====================================================
    // CHEF-BENUTZER ERSTELLEN
    // =====================================================
    /**
   * Erstellt Chef-Benutzer (ramiro.lopezrodriguez)
   */ static createChefUser() {
        return {
            first_name: "Ramiro",
            last_name: "Lopez Rodriguez",
            role: "Chef",
            domain_type: "external"
        };
    }
    /**
   * Erstellt Sohn-Benutzer (ramiro.lopezmclean)
   */ static createSohnUser() {
        return {
            first_name: "Ramiro",
            last_name: "Lopez Mc Lean",
            role: "CTO",
            domain_type: "external"
        };
    }
    // =====================================================
    // E-MAIL-GENERIERUNG
    // =====================================================
    /**
   * Generiert alle E-Mail-Adressen für einen Benutzer
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */ static generateUserEmails(user) {
        const externalEmail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailService"].generateEmailAddress({
            first_name: user.first_name,
            last_name: user.last_name,
            domain_type: "external"
        });
        const internalEmail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailService"].generateEmailAddress({
            first_name: user.first_name,
            last_name: user.last_name,
            domain_type: "internal"
        });
        const displayName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailService"].generateDisplayName(user.first_name, user.last_name, user.role);
        return {
            external: externalEmail,
            internal: internalEmail,
            display_name: displayName
        };
    }
    // =====================================================
    // VALIDIERUNG
    // =====================================================
    /**
   * Validiert Domain-Strategie E-Mail-Adressen
   */ static validateDomainStrategy(user) {
        const emails = this.generateUserEmails(user);
        const externalValid = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailService"].validateEmailDomain(emails.external, "external");
        const internalValid = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailService"].validateEmailDomain(emails.internal, "internal");
        return {
            external_valid: externalValid,
            internal_valid: internalValid,
            emails: {
                external: emails.external,
                internal: emails.internal
            }
        };
    }
    // =====================================================
    // DEMO-DATEN
    // =====================================================
    /**
   * Erstellt Demo-Benutzer für Domain-Strategie
   */ static createDemoUsers() {
        return [
            this.createChefUser(),
            this.createSohnUser(),
            {
                first_name: "Max",
                last_name: "Mustermann",
                role: "Support",
                domain_type: "internal"
            },
            {
                first_name: "Anna",
                last_name: "Schmidt",
                role: "Sales",
                domain_type: "internal"
            }
        ];
    }
    // =====================================================
    // SQL-INSERT GENERIERUNG
    // =====================================================
    /**
   * Generiert SQL-Insert für Chef-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezrodriguez
   */ static generateChefUserSQL() {
        const chef = this.createChefUser();
        const emails = this.generateUserEmails(chef);
        return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezrodriguez',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${chef.first_name}',
    '${chef.last_name}',
    '${emails.display_name}',
    '${chef.domain_type}',
    'active'
);`;
    }
    /**
   * Generiert SQL-Insert für Sohn-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezmclean
   */ static generateSohnUserSQL() {
        const sohn = this.createSohnUser();
        const emails = this.generateUserEmails(sohn);
        return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezmclean',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${sohn.first_name}',
    '${sohn.last_name}',
    '${emails.display_name}',
    '${sohn.domain_type}',
    'active'
);`;
    }
}
}),
"[externals]/argon2 [external] (argon2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("argon2", () => require("argon2"));

module.exports = mod;
}),
"[project]/src/lib/uuid-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// UUID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: UUID v4/v7 Generation für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
// Edge Runtime compatible UUID generation
__turbopack_context__.s([
    "UUIDService",
    ()=>UUIDService
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
class UUIDService {
    // =====================================================
    // UUID GENERATION
    // =====================================================
    /**
   * Generiert UUID v4 (Standard)
   * Nicht erratbar, sicher, weltweit Standard
   */ static generateV4() {
        // Edge Runtime compatible UUID v4 generation
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }
    /**
   * Generiert UUID v7 (Zeitstempel-basiert)
   * Sortierbar, zeitlich geordnet
   */ static generateV7() {
        // UUID v7 Implementation - Edge Runtime compatible
        const timestamp = Date.now();
        const random = new Uint8Array(10);
        crypto.getRandomValues(random);
        // Timestamp (48 bits)
        const timeHigh = timestamp >>> 16 & 0xffff;
        const timeLow = timestamp & 0xffff;
        // Random data (74 bits) - Konvertiere Uint8Array zu Buffer für readUInt16BE
        const randomBuffer = Buffer.from(random);
        const random1 = randomBuffer.readUInt16BE(0) & 0x0fff; // 12 bits
        const random2 = randomBuffer.readUInt16BE(2) & 0x3fff; // 14 bits
        const random3 = randomBuffer.readUInt16BE(4) & 0x3fff; // 14 bits
        const random4 = randomBuffer.readUInt16BE(6) & 0x3fff; // 14 bits
        const random5 = randomBuffer.readUInt16BE(8) & 0x3fff; // 14 bits
        // Version 7 (0111)
        const version = 0x7000;
        // Variant (10)
        const variant = 0x8000;
        // UUID v7 Format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
        const uuid = [
            timeHigh.toString(16).padStart(4, "0"),
            timeLow.toString(16).padStart(4, "0"),
            "-",
            (random1 | version).toString(16).padStart(4, "0"),
            "-",
            (random2 | variant).toString(16).padStart(4, "0"),
            "-",
            random3.toString(16).padStart(4, "0"),
            "-",
            random4.toString(16).padStart(4, "0"),
            random5.toString(16).padStart(4, "0")
        ].join("");
        return uuid;
    }
    /**
   * Generiert sichere UUID basierend auf Konfiguration
   */ static generate(config = {
        version: "v4",
        secure: true
    }) {
        if (config.version === "v7") {
            return this.generateV7();
        }
        return this.generateV4();
    }
    // =====================================================
    // VALIDATION
    // =====================================================
    /**
   * Validiert UUID Format
   */ static isValid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    /**
   * Validiert UUID v4
   */ static isV4(uuid) {
        if (!this.isValid(uuid)) return false;
        return uuid[14] === "4";
    }
    /**
   * Validiert UUID v7
   */ static isV7(uuid) {
        if (!this.isValid(uuid)) return false;
        return uuid[14] === "7";
    }
    // =====================================================
    // ENTERPRISE++ FEATURES
    // =====================================================
    /**
   * Generiert Owner UUID (spezielle Kennzeichnung)
   */ static generateOwnerUUID() {
        const uuid = this.generateV4();
        // Owner UUIDs haben spezielle Kennzeichnung
        return `owner_${uuid}`;
    }
    /**
   * Generiert Admin UUID
   */ static generateAdminUUID() {
        return this.generateV4();
    }
    /**
   * Generiert Customer UUID
   */ static generateCustomerUUID() {
        return this.generateV4();
    }
    /**
   * Generiert Session UUID
   */ static generateSessionUUID() {
        return this.generateV4();
    }
    // =====================================================
    // SECURITY FEATURES
    // =====================================================
    /**
   * Generiert sichere Random String
   */ static generateSecureRandom(length = 32) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(length).toString("hex");
    }
    /**
   * Generiert Salt für Passwort-Hashing
   */ static generateSalt() {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    }
    /**
   * Generiert Pepper für Passwort-Hashing
   */ static generatePepper() {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    }
}
}),
"[project]/src/lib/argon2-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ARGON2ID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Argon2id Passwort-Hashing für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "Argon2Service",
    ()=>Argon2Service
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/argon2 [external] (argon2, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/uuid-service.ts [app-route] (ecmascript)");
;
;
class Argon2Service {
    // =====================================================
    // KONFIGURATION
    // =====================================================
    /**
   * Enterprise++ Argon2id Konfiguration
   * DSGVO/ISO27001-konform
   */ static CONFIG = {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
        hashLength: 32
    };
    /**
   * Pepper für zusätzliche Sicherheit
   * Sollte in .env gespeichert werden
   */ static PEPPER = process.env.ARGON2_PEPPER || "default-pepper-change-in-production";
    // =====================================================
    // PASSWORD HASHING
    // =====================================================
    /**
   * Hasht Passwort mit Argon2id + Salt + Pepper
   */ static async hashPassword(password) {
        try {
            // Salt generieren
            const salt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UUIDService"].generateSalt();
            // Pepper hinzufügen
            const passwordWithPepper = password + this.PEPPER;
            // Argon2id Hash generieren
            const hash = await __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].hash(passwordWithPepper, {
                type: this.CONFIG.type,
                memoryCost: this.CONFIG.memoryCost,
                timeCost: this.CONFIG.timeCost,
                parallelism: this.CONFIG.parallelism,
                hashLength: this.CONFIG.hashLength,
                salt: Buffer.from(salt, "hex")
            });
            return {
                hash,
                salt,
                pepper: this.PEPPER,
                config: this.CONFIG
            };
        } catch (error) {
            console.error("Argon2 Hash Fehler:", error);
            throw new Error("Passwort-Hashing fehlgeschlagen");
        }
    }
    /**
   * Verifiziert Passwort gegen Hash
   */ static async verifyPassword(password, hash, salt) {
        try {
            // Pepper hinzufügen
            const passwordWithPepper = password + this.PEPPER;
            // Hash verifizieren
            return await __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["default"].verify(hash, passwordWithPepper);
        } catch (error) {
            console.error("Argon2 Verify Fehler:", error);
            return false;
        }
    }
    // =====================================================
    // PASSWORD STRENGTH
    // =====================================================
    /**
   * Prüft Passwort-Stärke (Enterprise++ Standard)
   */ static validatePasswordStrength(password) {
        const requirements = {
            minLength: password.length >= 12,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        const score = Object.values(requirements).filter(Boolean).length;
        let level;
        if (score < 3) level = "weak";
        else if (score < 4) level = "okay";
        else if (score < 5) level = "strong";
        else level = "very_strong";
        return {
            isValid: requirements.minLength && score >= 4,
            score,
            level,
            requirements
        };
    }
    // =====================================================
    // SECURITY FEATURES
    // =====================================================
    /**
   * Generiert sicheres temporäres Passwort
   */ static generateSecurePassword(length = 16) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for(let i = 0; i < length; i++){
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
    /**
   * Prüft ob Passwort in der Historie ist
   */ static async isPasswordInHistory(password, history) {
        for (const oldHash of history){
            if (await this.verifyPassword(password, oldHash, "")) {
                return true;
            }
        }
        return false;
    }
    // =====================================================
    // AUDIT & COMPLIANCE
    // =====================================================
    /**
   * Erstellt Audit-Log für Passwort-Änderung
   */ static createPasswordChangeAudit(userId, action) {
        return {
            user_id: userId,
            action: `password_${action}`,
            severity: "medium",
            compliance_category: "security",
            timestamp: new Date().toISOString(),
            details: {
                hashing_algorithm: "argon2id",
                memory_cost: this.CONFIG.memoryCost,
                time_cost: this.CONFIG.timeCost,
                parallelism: this.CONFIG.parallelism
            }
        };
    }
}
}),
"[project]/src/lib/enterprise-user-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ USER SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Benutzer-Management mit UUID & Argon2id
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "EnterpriseUserService",
    ()=>EnterpriseUserService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/argon2-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/uuid-service.ts [app-route] (ecmascript)");
;
;
;
class EnterpriseUserService {
    // =====================================================
    // USER CREATION
    // =====================================================
    /**
   * Erstellt neuen Enterprise++ Benutzer
   */ static async createUser(userData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // UUID generieren
            const userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UUIDService"].generateV4();
            // Passwort hashen
            const hashResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Argon2Service"].hashPassword(userData.password);
            // Display Name generieren
            const displayName = userData.display_name || `${userData.first_name} ${userData.last_name}${userData.role ? ` - ${userData.role}` : ""}`;
            // SQL Insert
            const [result] = await connection.execute(`
                INSERT INTO lopez_enterprise_users (
                    id, username, email, email_external, email_internal,
                    first_name, last_name, display_name, password_hash, salt, pepper,
                    is_owner, is_admin, is_employee, is_customer, role, permissions,
                    domain_type, status, password_changed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                userId,
                userData.username,
                userData.email,
                userData.email_external || null,
                userData.email_internal || null,
                userData.first_name,
                userData.last_name,
                displayName,
                hashResult.hash,
                hashResult.salt,
                hashResult.pepper,
                userData.is_owner || false,
                userData.is_admin || false,
                userData.is_employee || false,
                userData.is_customer || false,
                userData.role || "user",
                JSON.stringify(userData.permissions || []),
                userData.domain_type || "internal",
                "pending"
            ]);
            // Passwort-Historie speichern
            await this.addPasswordToHistory(userId, hashResult.hash, hashResult.salt);
            // Benutzer laden und zurückgeben
            const user = await this.getUserById(userId);
            if (!user) {
                throw new Error("Benutzer konnte nicht erstellt werden");
            }
            return user;
        } catch (error) {
            console.error("Enterprise User Creation Fehler:", error);
            throw new Error("Benutzer konnte nicht erstellt werden");
        }
    }
    /**
   * Erstellt Owner-Benutzer (Chef)
   */ static async createOwnerUser(userData) {
        const ownerData = {
            ...userData,
            is_owner: true,
            is_admin: true,
            role: "Owner",
            permissions: [
                "*"
            ],
            domain_type: "external"
        };
        return await this.createUser(ownerData);
    }
    /**
   * Erstellt Admin-Benutzer
   */ static async createAdminUser(userData) {
        const adminData = {
            ...userData,
            is_admin: true,
            role: "Admin",
            permissions: [
                "admin.*",
                "user.*",
                "customer.*"
            ],
            domain_type: "external"
        };
        return await this.createUser(adminData);
    }
    /**
   * Erstellt Employee-Benutzer
   */ static async createEmployeeUser(userData) {
        const employeeData = {
            ...userData,
            is_employee: true,
            role: "Employee",
            permissions: [
                "customer.read",
                "customer.update"
            ],
            domain_type: "internal"
        };
        return await this.createUser(employeeData);
    }
    /**
   * Erstellt Customer-Benutzer
   */ static async createCustomerUser(userData) {
        const customerData = {
            ...userData,
            is_customer: true,
            role: "Customer",
            permissions: [
                "profile.read",
                "profile.update"
            ],
            domain_type: "external"
        };
        return await this.createUser(customerData);
    }
    // =====================================================
    // USER RETRIEVAL
    // =====================================================
    /**
   * Lädt Benutzer nach ID
   */ static async getUserById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE id = ?
            `, [
                id
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by ID Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt Benutzer nach Username
   */ static async getUserByUsername(username) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE username = ?
            `, [
                username
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by Username Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt Chef-Benutzer (Development Mode)
   */ static async getChefUser() {
        return await this.getUserByUsername("ramiro.lopezrodriguez");
    }
    /**
   * Lädt alle Admin-Benutzer
   */ static async getAdminUsers() {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users 
                WHERE is_admin = true OR is_owner = true
                ORDER BY created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error("Get Admin Users Fehler:", error);
            return [];
        }
    }
    /**
   * Lädt Benutzer nach Email
   */ static async getUserByEmail(email) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE email = ? OR email_external = ? OR email_internal = ?
            `, [
                email,
                email,
                email
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by Email Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt alle Benutzer
   */ static async getAllUsers() {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users ORDER BY created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error("Get All Users Fehler:", error);
            return [];
        }
    }
    // =====================================================
    // USER UPDATES
    // =====================================================
    /**
   * Aktualisiert Benutzer
   */ static async updateUser(id, userData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Update-Felder dynamisch erstellen
            const updateFields = [];
            const values = [];
            if (userData.first_name) {
                updateFields.push("first_name = ?");
                values.push(userData.first_name);
            }
            if (userData.last_name) {
                updateFields.push("last_name = ?");
                values.push(userData.last_name);
            }
            if (userData.display_name) {
                updateFields.push("display_name = ?");
                values.push(userData.display_name);
            }
            if (userData.email) {
                updateFields.push("email = ?");
                values.push(userData.email);
            }
            if (userData.email_external) {
                updateFields.push("email_external = ?");
                values.push(userData.email_external);
            }
            if (userData.email_internal) {
                updateFields.push("email_internal = ?");
                values.push(userData.email_internal);
            }
            if (userData.status) {
                updateFields.push("status = ?");
                values.push(userData.status);
            }
            if (userData.role) {
                updateFields.push("role = ?");
                values.push(userData.role);
            }
            if (userData.permissions) {
                updateFields.push("permissions = ?");
                values.push(JSON.stringify(userData.permissions));
            }
            if (userData.domain_type) {
                updateFields.push("domain_type = ?");
                values.push(userData.domain_type);
            }
            if (updateFields.length === 0) {
                return false;
            }
            updateFields.push("updated_at = NOW()");
            values.push(id);
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET ${updateFields.join(", ")} 
                WHERE id = ?
            `, values);
            return true;
        } catch (error) {
            console.error("Update User Fehler:", error);
            return false;
        }
    }
    /**
   * Ändert Passwort
   */ static async changePassword(id, newPassword) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Passwort hashen
            const hashResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Argon2Service"].hashPassword(newPassword);
            // Passwort aktualisieren
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET password_hash = ?, salt = ?, pepper = ?, password_changed_at = NOW() 
                WHERE id = ?
            `, [
                hashResult.hash,
                hashResult.salt,
                hashResult.pepper,
                id
            ]);
            // Passwort-Historie speichern
            await this.addPasswordToHistory(id, hashResult.hash, hashResult.salt);
            return true;
        } catch (error) {
            console.error("Change Password Fehler:", error);
            return false;
        }
    }
    // =====================================================
    // PASSWORD HISTORY
    // =====================================================
    /**
   * Fügt Passwort zur Historie hinzu
   */ static async addPasswordToHistory(userId, passwordHash, salt) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_password_history (user_id, password_hash, salt) 
                VALUES (?, ?, ?)
            `, [
                userId,
                passwordHash,
                salt
            ]);
            // Alte Passwörter löschen (nur die letzten 5 behalten)
            await connection.execute(`
                DELETE FROM lopez_password_history 
                WHERE user_id = ? AND id NOT IN (
                    SELECT id FROM (
                        SELECT id FROM lopez_password_history 
                        WHERE user_id = ? 
                        ORDER BY created_at DESC 
                        LIMIT 5
                    ) AS recent_passwords
                )
            `, [
                userId,
                userId
            ]);
        } catch (error) {
            console.error("Add Password to History Fehler:", error);
        }
    }
    /**
   * Prüft ob Passwort in der Historie ist
   */ static async isPasswordInHistory(userId, password) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT password_hash, salt FROM lopez_password_history 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            `, [
                userId
            ]);
            const history = rows;
            for (const entry of history){
                if (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Argon2Service"].verifyPassword(password, entry.password_hash, entry.salt)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Check Password History Fehler:", error);
            return false;
        }
    }
    // =====================================================
    // AUTHENTICATION
    // =====================================================
    /**
   * Verifiziert Benutzer-Login
   */ static async verifyLogin(username, password) {
        try {
            // Benutzer laden
            let user = await this.getUserByUsername(username);
            if (!user) {
                user = await this.getUserByEmail(username);
            }
            if (!user) {
                return null;
            }
            // Passwort verifizieren
            const isValid = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Argon2Service"].verifyPassword(password, user.password_hash, user.salt);
            if (!isValid) {
                return null;
            }
            // Status prüfen
            if (user.status !== "active") {
                return null;
            }
            // Account gesperrt?
            if (user.locked_until && new Date(user.locked_until) > new Date()) {
                return null;
            }
            return user;
        } catch (error) {
            console.error("Verify Login Fehler:", error);
            return null;
        }
    }
    // =====================================================
    // SECURITY FEATURES
    // =====================================================
    /**
   * Sperrt Benutzer-Account
   */ static async lockUser(id, durationMinutes = 30) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const lockedUntil = new Date();
            lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET locked_until = ?, status = 'locked' 
                WHERE id = ?
            `, [
                lockedUntil,
                id
            ]);
            return true;
        } catch (error) {
            console.error("Lock User Fehler:", error);
            return false;
        }
    }
    /**
   * Entsperrt Benutzer-Account
   */ static async unlockUser(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET locked_until = NULL, failed_login_attempts = 0, status = 'active' 
                WHERE id = ?
            `, [
                id
            ]);
            return true;
        } catch (error) {
            console.error("Unlock User Fehler:", error);
            return false;
        }
    }
    /**
   * Erhöht fehlgeschlagene Login-Versuche
   */ static async incrementFailedLogins(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET failed_login_attempts = failed_login_attempts + 1 
                WHERE id = ?
            `, [
                id
            ]);
            // Nach 5 Versuchen sperren
            const [rows] = await connection.execute(`
                SELECT failed_login_attempts FROM lopez_enterprise_users WHERE id = ?
            `, [
                id
            ]);
            const user = rows[0];
            if (user && user.failed_login_attempts >= 5) {
                await this.lockUser(id, 30);
            }
        } catch (error) {
            console.error("Increment Failed Logins Fehler:", error);
        }
    }
}
}),
"[project]/src/lib/development-mode.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DEVELOPMENT MODE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Login optional für lokale Entwicklung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "DevelopmentMode",
    ()=>DevelopmentMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/domain-strategy.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/enterprise-user-service.ts [app-route] (ecmascript)");
;
;
class DevelopmentMode {
    // =====================================================
    // KONFIGURATION
    // =====================================================
    /**
   * Prüft ob Development Mode aktiviert ist
   */ static isEnabled() {
        return ("TURBOPACK compile-time value", "development") === "development" && process.env.DEVELOPMENT_MODE === "true";
    }
    /**
   * Prüft ob Authentication umgangen werden soll
   */ static shouldBypassAuth() {
        return this.isEnabled() && process.env.BYPASS_AUTH === "true";
    }
    /**
   * Gibt Development Mode Konfiguration zurück
   */ static getConfig() {
        return {
            enabled: this.isEnabled(),
            bypassAuth: this.shouldBypassAuth(),
            defaultUser: {
                id: 1,
                username: "ramiro.lopezrodriguez",
                email: "ramiro.lopezrodriguez@lopezitwelt.de",
                first_name: "Ramiro",
                last_name: "Lopez Rodriguez",
                role: "Chef"
            }
        };
    }
    // =====================================================
    // AUTHENTICATION BYPASS
    // =====================================================
    /**
   * Erstellt Mock-User für Development Mode
   */ static createMockUser() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            id: "dev-chef-uuid-001",
            username: "ramiro.lopezrodriguez",
            email: "ramiro.lopezrodriguez@lopezitwelt.de",
            email_external: "ramiro.lopezrodriguez@lopezitwelt.de",
            email_internal: "ramiro.lopezrodriguez@lopez-team.de",
            first_name: "Ramiro",
            last_name: "Lopez Rodriguez",
            display_name: "Ramiro Lopez Rodriguez - Chef",
            domain_type: "external",
            status: "active",
            is_owner: true,
            is_admin: true,
            is_employee: true,
            is_customer: false,
            role: "Chef",
            roles: [
                "chef",
                "admin",
                "owner"
            ],
            permissions: [
                "*"
            ],
            two_factor_enabled: false,
            failed_login_attempts: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    /**
   * Prüft ob Route im Development Mode umgangen werden soll
   */ static shouldBypassRoute(route) {
        if (!this.shouldBypassAuth()) {
            return false;
        }
        // Routen die im Development Mode umgangen werden
        const bypassRoutes = [
            "/api/auth/login",
            "/api/auth/logout",
            "/api/admin/*"
        ];
        return bypassRoutes.some((pattern)=>{
            if (pattern.includes("*")) {
                return route.startsWith(pattern.replace("*", ""));
            }
            return route === pattern;
        });
    }
    // =====================================================
    // MIDDLEWARE
    // =====================================================
    /**
   * Development Mode Middleware
   */ static middleware(req, res, next) {
        if (this.shouldBypassAuth()) {
            // Mock-User in Request einfügen
            req.user = this.createMockUser();
            req.isDevelopmentMode = true;
        // Development Mode: Authentication umgangen
        // Mock-User: ${req.user.display_name}
        }
        next();
    }
    // =====================================================
    // API RESPONSES
    // =====================================================
    /**
   * Erstellt Development Mode Login Response
   */ static createLoginResponse() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            success: true,
            message: "Development Mode: Login umgangen",
            user: this.createMockUser(),
            token: "dev-mode-token",
            isDevelopmentMode: true
        };
    }
    /**
   * Erstellt Development Mode Logout Response
   */ static createLogoutResponse() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            success: true,
            message: "Development Mode: Logout umgangen",
            isDevelopmentMode: true
        };
    }
    // =====================================================
    // CHEF-BENUTZER MANAGEMENT
    // =====================================================
    /**
   * Erstellt Chef-Benutzer für Development Mode
   */ static async createChefUser() {
        if (!this.isEnabled()) {
            return null;
        }
        try {
            const chefData = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DomainStrategy"].createChefUser();
            const emails = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DomainStrategy"].generateUserEmails(chefData);
            const userData = {
                username: "ramiro.lopezrodriguez",
                email: emails.external,
                email_external: emails.external,
                email_internal: emails.internal,
                first_name: chefData.first_name,
                last_name: chefData.last_name,
                display_name: emails.display_name,
                password: "DevMode123!",
                is_owner: true,
                is_admin: true,
                is_employee: true,
                is_customer: false,
                role: "Chef",
                permissions: [
                    "*"
                ],
                domain_type: "external"
            };
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnterpriseUserService"].createUser(userData);
        } catch (error) {
            // Fehler beim Erstellen des Chef-Benutzers: ${error}
            return null;
        }
    }
    /**
   * Prüft ob Chef-Benutzer existiert
   */ static async checkChefUserExists() {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnterpriseUserService"].getUserByUsername("ramiro.lopezrodriguez");
            return user !== null;
        } catch  {
            return false;
        }
    }
    // =====================================================
    // ENVIRONMENT SETUP
    // =====================================================
    /**
   * Setup Development Mode Environment
   */ static async setupEnvironment() {
        if ("TURBOPACK compile-time truthy", 1) {
            // Development Mode verfügbar
            // Um zu aktivieren:
            //   DEVELOPMENT_MODE=true
            //   BYPASS_AUTH=true
            //
            // Beispiel .env.local:
            //   NODE_ENV=development
            //   DEVELOPMENT_MODE=true
            //   BYPASS_AUTH=true
            // Chef-Benutzer prüfen/erstellen
            if (this.isEnabled()) {
                const chefExists = await this.checkChefUserExists();
                if (!chefExists) {
                    // Chef-Benutzer wird erstellt...
                    const chef = await this.createChefUser();
                    if (chef) {
                    // Chef-Benutzer erfolgreich erstellt: ${chef.display_name}
                    } else {
                    // Fehler beim Erstellen des Chef-Benutzers
                    }
                } else {
                // Chef-Benutzer bereits vorhanden
                }
            }
        }
    }
}
}),
"[project]/src/lib/auth-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// AUTH SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Authentifizierung und Session-Management
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$2fa$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/2fa-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/development-mode.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac-system.ts [app-route] (ecmascript)");
;
;
;
;
;
;
class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET || "lopez-it-welt-secret-key";
    static JWT_EXPIRES_IN = "24h";
    static SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000;
    // =====================================================
    // LOGIN & AUTHENTIFIZIERUNG
    // =====================================================
    static async login(credentials, ipAddress, userAgent) {
        try {
            // Development Mode: Authentication umgehen
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevelopmentMode"].shouldBypassAuth()) {
                console.log("🚀 Development Mode: Login umgangen");
                const mockUser = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DevelopmentMode"].createMockUser();
                if (!mockUser) {
                    return {
                        success: false,
                        message: "Development Mode: Mock-User konnte nicht erstellt werden"
                    };
                }
                return {
                    success: true,
                    session: {
                        userId: mockUser.id || 1,
                        username: mockUser.username || "admin",
                        email: mockUser.email || "admin@lopez-it-welt.de",
                        roles: [
                            "admin"
                        ],
                        permissions: [
                            "*:*"
                        ],
                        sessionToken: "dev-mode-token",
                        expiresAt: new Date(Date.now() + 86400000)
                    },
                    message: "Development Mode: Login erfolgreich",
                    isDevelopmentMode: true
                };
            }
            // Benutzer laden (Username oder Email)
            let user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserByUsername(credentials.username);
            if (!user) {
                // Fallback: Versuche Email als Username
                user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserByEmail(credentials.username);
            }
            if (!user) {
                return {
                    success: false,
                    message: "Benutzername oder Passwort falsch"
                };
            }
            // Passwort prüfen
            const passwordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password_hash);
            if (!passwordValid) {
                return {
                    success: false,
                    message: "Benutzername oder Passwort falsch"
                };
            }
            // Benutzer-Status prüfen
            if (user.status !== "active") {
                return {
                    success: false,
                    message: "Benutzerkonto ist nicht aktiv"
                };
            }
            // 2FA prüfen
            const requires2FA = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$2fa$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TwoFactorService"].is2FAEnabled(user.id);
            if (requires2FA) {
                if (!credentials.twoFactorToken) {
                    return {
                        success: false,
                        message: "Zwei-Faktor-Authentifizierung erforderlich",
                        requires2FA: true
                    };
                }
                const twoFactorValid = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$2fa$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TwoFactorService"].verifyToken(user.id, credentials.twoFactorToken);
                if (!twoFactorValid) {
                    return {
                        success: false,
                        message: "Zwei-Faktor-Token ungültig"
                    };
                }
            }
            // Session erstellen
            const session = await this.createSession(user, ipAddress, userAgent);
            if (!session) {
                return {
                    success: false,
                    message: "Session konnte nicht erstellt werden"
                };
            }
            // Last Login aktualisieren
            await this.updateLastLogin(user.id);
            return {
                success: true,
                message: "Login erfolgreich",
                session
            };
        } catch (error) {
            console.error("❌ Login fehlgeschlagen:", error);
            return {
                success: false,
                message: "Interner Serverfehler"
            };
        }
    }
    // =====================================================
    // SESSION-MANAGEMENT
    // =====================================================
    static async createSession(user, ipAddress, userAgent) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Session-Token generieren
            const sessionToken = this.generateSessionToken();
            const expiresAt = new Date(Date.now() + this.SESSION_EXPIRES_IN);
            // Session in Datenbank speichern
            await connection.execute(`
                INSERT INTO lopez_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `, [
                user.id,
                sessionToken,
                ipAddress,
                userAgent,
                expiresAt
            ]);
            // Benutzer-Rollen laden
            const roles = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserRoles(user.id);
            const roleNames = roles.map((role)=>role.name);
            // Berechtigungen sammeln
            const permissions = [];
            for (const role of roles){
                const rolePermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getRolePermissions(role.id);
                permissions.push(...rolePermissions.map((p)=>`${p.resource}:${p.action}`));
            }
            return {
                userId: user.id,
                username: user.username,
                email: user.email,
                roles: roleNames,
                permissions: [
                    ...new Set(permissions)
                ],
                sessionToken,
                expiresAt
            };
        } catch (error) {
            console.error("❌ Session-Erstellung fehlgeschlagen:", error);
            return null;
        }
    }
    static async validateSession(sessionToken) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Session aus Datenbank laden
            const [rows] = await connection.execute(`
                SELECT s.*, u.username, u.email, u.status
                FROM lopez_sessions s
                JOIN lopez_users u ON s.user_id = u.id
                WHERE s.session_token = ? AND s.expires_at > NOW()
            `, [
                sessionToken
            ]);
            if (rows.length === 0) {
                return null;
            }
            const session = rows[0];
            // Benutzer-Rollen laden
            const roles = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserRoles(session.user_id);
            const roleNames = roles.map((role)=>role.name);
            // Berechtigungen sammeln
            const permissions = [];
            for (const role of roles){
                const rolePermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getRolePermissions(role.id);
                permissions.push(...rolePermissions.map((p)=>`${p.resource}:${p.action}`));
            }
            return {
                userId: session.user_id,
                username: session.username,
                email: session.email,
                roles: roleNames,
                permissions: [
                    ...new Set(permissions)
                ],
                sessionToken,
                expiresAt: session.expires_at
            };
        } catch (error) {
            console.error("❌ Session-Validierung fehlgeschlagen:", error);
            return null;
        }
    }
    static async logout(sessionToken) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Session aus Datenbank entfernen
            await connection.execute("DELETE FROM lopez_sessions WHERE session_token = ?", [
                sessionToken
            ]);
            console.log("✅ Session erfolgreich beendet");
            return true;
        } catch (error) {
            console.error("❌ Logout fehlgeschlagen:", error);
            return false;
        }
    }
    static async logoutAllSessions(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Alle Sessions des Benutzers entfernen
            await connection.execute("DELETE FROM lopez_sessions WHERE user_id = ?", [
                userId
            ]);
            console.log(`✅ Alle Sessions für Benutzer ${userId} beendet`);
            return true;
        } catch (error) {
            console.error("❌ Logout aller Sessions fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // JWT-TOKEN
    // =====================================================
    static generateJWT(sessionData) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
            userId: sessionData.userId,
            username: sessionData.username,
            email: sessionData.email,
            roles: sessionData.roles,
            permissions: sessionData.permissions
        }, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
    }
    static verifyJWT(token) {
        try {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
    // =====================================================
    // PASSWORT-MANAGEMENT
    // =====================================================
    static async hashPassword(password) {
        const saltRounds = 12;
        return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, saltRounds);
    }
    static async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserById(userId);
            if (!user) {
                return false;
            }
            // Altes Passwort prüfen
            const oldPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(oldPassword, user.password_hash);
            if (!oldPasswordValid) {
                return false;
            }
            // Neues Passwort hashen
            const newPasswordHash = await this.hashPassword(newPassword);
            // Passwort in Datenbank aktualisieren
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute("UPDATE lopez_users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [
                newPasswordHash,
                userId
            ]);
            // Alle Sessions beenden (Sicherheit)
            await this.logoutAllSessions(userId);
            console.log(`✅ Passwort für Benutzer ${userId} geändert`);
            return true;
        } catch (error) {
            console.error("❌ Passwort-Änderung fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // HILFSFUNKTIONEN
    // =====================================================
    static generateSessionToken() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for(let i = 0; i < 64; i++){
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    static async updateLastLogin(userId) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute("UPDATE lopez_users SET last_login = NOW() WHERE id = ?", [
                userId
            ]);
        } catch (error) {
            console.error("❌ Last Login Update fehlgeschlagen:", error);
        }
    }
    // =====================================================
    // BERECHTIGUNGEN
    // =====================================================
    static async checkPermission(userId, resource, action) {
        try {
            const session = await this.validateSession(userId.toString());
            if (!session) {
                return false;
            }
            const permission = `${resource}:${action}`;
            return session.permissions.includes(permission);
        } catch (error) {
            console.error("❌ Berechtigungsprüfung fehlgeschlagen:", error);
            return false;
        }
    }
}
}),
"[project]/src/app/api/auth/permissions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ USER PERMISSIONS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-12-01
// Zweck: Liefert die Permissions des aktuellen Users
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rbac-system.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-service.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        // User aus Token extrahieren
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "") || request.cookies.get("token")?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Nicht authentifiziert",
                data: {
                    permissions: [],
                    roles: [],
                    isAuthenticated: false
                }
            }, {
                status: 401
            });
        }
        // Token validieren und User laden
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AuthService"].validateSession(token);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Ungültige Session",
                data: {
                    permissions: [],
                    roles: [],
                    isAuthenticated: false
                }
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        // Permissions und Rollen laden
        const [permissionKeys, roles, highestRole, isSuperAdmin] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserPermissionKeys(userId),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserRoles(userId),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].getUserHighestRole(userId),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rbac$2d$system$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RBACService"].isSuperAdmin(userId)
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                userId,
                permissions: permissionKeys,
                roles: roles.map((r)=>({
                        id: r.id,
                        name: r.name,
                        level: r.level
                    })),
                highestRole: highestRole ? {
                    id: highestRole.id,
                    name: highestRole.name,
                    level: highestRole.level
                } : null,
                isSuperAdmin,
                isAuthenticated: true
            }
        });
    } catch (error) {
        console.error("❌ Fehler beim Laden der Permissions:", error);
        // Bei DB-Fehler: Fallback für Entwicklung
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                userId: 1,
                permissions: [
                    // Super Admin hat alles
                    "admin.dashboard.view",
                    "admin.operations.view",
                    "admin.operations.monitoring.view",
                    "admin.operations.logs.view",
                    "admin.operations.backups.view",
                    "admin.operations.backups.manage",
                    "admin.customers.view",
                    "admin.customers.create",
                    "admin.customers.edit",
                    "admin.customers.delete",
                    "admin.customers.export",
                    "admin.projects.view",
                    "admin.projects.create",
                    "admin.projects.edit",
                    "admin.projects.delete",
                    "admin.tickets.view",
                    "admin.tickets.manage",
                    "admin.content.view",
                    "admin.content.edit",
                    "admin.media.view",
                    "admin.media.upload",
                    "admin.media.ai.view",
                    "admin.marketing.view",
                    "admin.marketing.edit",
                    "admin.finance.view",
                    "admin.finance.invoices.view",
                    "admin.finance.invoices.create",
                    "admin.finance.invoices.edit",
                    "admin.finance.reports.view",
                    "admin.finance.payroll.view",
                    "admin.system.view",
                    "admin.system.compliance.view",
                    "admin.system.roles.view",
                    "admin.system.roles.edit",
                    "admin.system.privileges.view",
                    "admin.system.orchestrator.view",
                    "admin.system.audit.view",
                    "admin.system.navigation.edit",
                    "admin.settings.view",
                    "admin.settings.security.view",
                    "admin.settings.security.edit",
                    "admin.settings.system.view",
                    "admin.settings.system.edit",
                    "admin.settings.branding.view",
                    "admin.settings.branding.edit",
                    "admin.settings.ai.view",
                    "admin.settings.ai.edit",
                    "admin.settings.users.view",
                    "admin.settings.users.edit"
                ],
                roles: [
                    {
                        id: 1,
                        name: "Super Admin",
                        level: 1
                    }
                ],
                highestRole: {
                    id: 1,
                    name: "Super Admin",
                    level: 1
                },
                isSuperAdmin: true,
                isAuthenticated: true,
                _fallback: true
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__81210bbd._.js.map