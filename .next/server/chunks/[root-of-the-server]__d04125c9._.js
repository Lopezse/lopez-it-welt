module.exports = [
"[project]/.next-internal/server/app/api/admin/customers/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
    ()=>initializeDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
// =====================================================
// DATENBANK-KONFIGURATION
// =====================================================
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lopez_erp",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// =====================================================
// CONNECTION POOL
// =====================================================
let pool = null;
let isInitialized = false;
async function getConnection() {
    if (!pool) {
        try {
            pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
            console.log("✅ MySQL Connection Pool erstellt");
            // Test-Verbindung
            const connection = await pool.getConnection();
            console.log("✅ MySQL Verbindung erfolgreich getestet");
            connection.release();
            // Automatische Initialisierung beim ersten Aufruf (nur einmal)
            if (!isInitialized) {
                try {
                    console.log("🔧 Initialisiere Datenbank-Struktur...");
                    await initializeDatabase();
                    isInitialized = true;
                    console.log("✅ Datenbank-Struktur erfolgreich initialisiert");
                } catch (initError) {
                    console.error("⚠️ Datenbank-Initialisierung fehlgeschlagen (wird ignoriert):", initError);
                // Nicht werfen, da die Tabelle möglicherweise bereits existiert
                }
            }
        } catch (error) {
            console.error("❌ MySQL Verbindungsfehler:", error);
            throw error;
        }
    }
    return pool;
}
async function initializeDatabase() {
    try {
        const connection = await getConnection();
        // =====================================================
        // KUNDEN-HAUPTTABELLE
        // =====================================================
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
        // =====================================================
        // KUNDEN-NOTIZEN
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_notes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                note TEXT NOT NULL,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                INDEX idx_customer_id (customer_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // KUNDEN-TAGS
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_tags (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                tag_name VARCHAR(50) NOT NULL,
                tag_color VARCHAR(7) DEFAULT '#3B82F6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                UNIQUE KEY unique_customer_tag (customer_id, tag_name),
                INDEX idx_customer_id (customer_id),
                INDEX idx_tag_name (tag_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
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
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_session_token (session_token),
                INDEX idx_expires_at (expires_at)
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
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert");
    } catch (error) {
        console.error("❌ Datenbank-Initialisierungsfehler:", error);
        throw error;
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
    try {
        const connection = await getConnection();
        // Datums- und Zeitbasiertes Format: YYYYMMDDHHMM-1 (nur ein Trennzeichen vor der Nummer)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const prefix = `${year}${month}${day}${hour}${minute}`;
        // Nächste Nummer für diese Stunde/Minute ermitteln
        const [rows] = await connection.execute(`SELECT MAX(CAST(SUBSTRING(kundennummer, 13) AS UNSIGNED)) as max_num 
       FROM lopez_customers 
       WHERE kundennummer LIKE ?`, [
            `${prefix}-%`
        ]);
        const maxNum = rows[0]?.max_num || 0;
        const nextNum = maxNum + 1;
        // Format: YYYYMMDDHHMM-1 (z.B. 202511012210-1)
        return `${prefix}-${nextNum}`;
    } catch (error) {
        console.error("❌ Kundennummer-Generierung fehlgeschlagen:", error);
        // Fallback: Timestamp-basiert
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const prefix = `${year}${month}${day}${hour}${minute}`;
        return `${prefix}-${String(Date.now()).slice(-1)}`;
    }
}
}),
"[project]/src/lib/customer-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// CUSTOMER SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: CRUD-Operationen für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "CustomerService",
    ()=>CustomerService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
class CustomerService {
    // =====================================================
    // KUNDEN CRUD-OPERATIONEN
    // =====================================================
    static async createCustomer(customerData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const kundennummer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateKundennummer"])();
            const [result] = await connection.execute(`
                INSERT INTO lopez_customers (
                    kundennummer, customer_type, anrede, titel, vorname, nachname,
                    firmenname, email, telefon, strasse, plz, ort, land,
                    status, support_level, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                kundennummer,
                customerData.customer_type,
                customerData.anrede,
                customerData.titel || null,
                customerData.vorname,
                customerData.nachname,
                customerData.firmenname || null,
                customerData.email,
                customerData.telefon || null,
                customerData.strasse || null,
                customerData.plz || null,
                customerData.ort || null,
                customerData.land,
                customerData.status,
                customerData.support_level,
                customerData.notes || null
            ]);
            const insertId = result.insertId;
            const customer = await this.getCustomerById(insertId);
            // Audit-Log
            await this.logAudit("lopez_customers", insertId, "INSERT", null, customerData, "system");
            return customer;
        } catch (error) {
            console.error("❌ Fehler beim Erstellen des Kunden:", error);
            throw error;
        }
    }
    static async getCustomerById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_customers WHERE id = ?", [
                id
            ]);
            const customers = rows;
            return customers.length > 0 ? customers[0] : null;
        } catch (error) {
            console.error("❌ Fehler beim Laden des Kunden:", error);
            throw error;
        }
    }
    static async getCustomerByKundennummer(kundennummer) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute("SELECT * FROM lopez_customers WHERE kundennummer = ?", [
                kundennummer
            ]);
            const customers = rows;
            return customers.length > 0 ? customers[0] : null;
        } catch (error) {
            console.error("❌ Fehler beim Laden des Kunden:", error);
            throw error;
        }
    }
    static async updateCustomer(id, customerData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Alte Daten laden für Audit-Log
            const oldCustomer = await this.getCustomerById(id);
            if (!oldCustomer) return null;
            // Update durchführen
            const updateFields = [];
            const updateValues = [];
            Object.entries(customerData).forEach(([key, value])=>{
                if (key !== "id" && key !== "kundennummer" && key !== "created_at" && value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });
            if (updateFields.length === 0) return oldCustomer;
            updateValues.push(id);
            await connection.execute(`
                UPDATE lopez_customers 
                SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `, updateValues);
            const updatedCustomer = await this.getCustomerById(id);
            // Audit-Log
            await this.logAudit("lopez_customers", id, "UPDATE", oldCustomer, customerData, "system");
            return updatedCustomer;
        } catch (error) {
            console.error("❌ Fehler beim Aktualisieren des Kunden:", error);
            throw error;
        }
    }
    static async deleteCustomer(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Alte Daten laden für Audit-Log
            const oldCustomer = await this.getCustomerById(id);
            if (!oldCustomer) return false;
            await connection.execute("DELETE FROM lopez_customers WHERE id = ?", [
                id
            ]);
            // Audit-Log
            await this.logAudit("lopez_customers", id, "DELETE", oldCustomer, null, "system");
            return true;
        } catch (error) {
            console.error("❌ Fehler beim Löschen des Kunden:", error);
            throw error;
        }
    }
    // =====================================================
    // KUNDEN-SUCHE & FILTER
    // =====================================================
    static async searchCustomers(filters = {}) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            const { customer_type, status, support_level, land, search, page = 1, limit = 50, sort_by = "created_at", sort_order = "DESC" } = filters;
            const offset = (page - 1) * limit;
            // WHERE-Bedingungen aufbauen
            const whereConditions = [];
            const queryParams = [];
            if (customer_type) {
                whereConditions.push("customer_type = ?");
                queryParams.push(customer_type);
            }
            if (status) {
                whereConditions.push("status = ?");
                queryParams.push(status);
            }
            if (support_level) {
                whereConditions.push("support_level = ?");
                queryParams.push(support_level);
            }
            if (land) {
                whereConditions.push("land = ?");
                queryParams.push(land);
            }
            if (search) {
                whereConditions.push(`(
                    kundennummer LIKE ? OR 
                    vorname LIKE ? OR 
                    nachname LIKE ? OR 
                    firmenname LIKE ? OR 
                    email LIKE ? OR 
                    telefon LIKE ?
                )`);
                const searchTerm = `%${search}%`;
                queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }
            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
            // Gesamtanzahl ermitteln
            const countQuery = `SELECT COUNT(*) as total FROM lopez_customers ${whereClause}`;
            const [countRows] = await connection.execute(countQuery, queryParams);
            const total = countRows[0].total;
            // Kunden laden
            const customersQuery = `
                SELECT * FROM lopez_customers 
                ${whereClause}
                ORDER BY ${sort_by} ${sort_order}
                LIMIT ? OFFSET ?
            `;
            const [customerRows] = await connection.execute(customersQuery, [
                ...queryParams,
                limit,
                offset
            ]);
            return {
                customers: customerRows,
                total
            };
        } catch (error) {
            console.error("❌ Fehler bei der Kundensuche:", error);
            throw error;
        }
    }
    // =====================================================
    // FUZZY SEARCH
    // =====================================================
    static async fuzzySearch(query, limit = 10) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            // Fuzzy Search mit SOUNDEX und LIKE
            const searchQuery = `
                SELECT *, 
                CASE 
                    WHEN kundennummer LIKE ? THEN 100
                    WHEN vorname LIKE ? OR nachname LIKE ? OR firmenname LIKE ? THEN 80
                    WHEN email LIKE ? THEN 70
                    WHEN telefon LIKE ? THEN 60
                    ELSE 50
                END as relevance
                FROM lopez_customers 
                WHERE (
                    kundennummer LIKE ? OR 
                    vorname LIKE ? OR 
                    nachname LIKE ? OR 
                    firmenname LIKE ? OR 
                    email LIKE ? OR 
                    telefon LIKE ? OR
                    SOUNDEX(vorname) = SOUNDEX(?) OR
                    SOUNDEX(nachname) = SOUNDEX(?) OR
                    SOUNDEX(firmenname) = SOUNDEX(?)
                )
                ORDER BY relevance DESC, created_at DESC
                LIMIT ?
            `;
            const searchTerm = `%${query}%`;
            const exactTerm = query;
            const [rows] = await connection.execute(searchQuery, [
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                exactTerm,
                exactTerm,
                exactTerm,
                limit
            ]);
            return rows;
        } catch (error) {
            console.error("❌ Fehler bei der Fuzzy-Suche:", error);
            throw error;
        }
    }
    // =====================================================
    // AUDIT-LOGGING
    // =====================================================
    static async logAudit(tableName, recordId, action, oldValues, newValues, userId, ipAddress, userAgent) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_audit_logs 
                (table_name, record_id, action, old_values, new_values, user_id, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                tableName,
                recordId,
                action,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                userId,
                ipAddress || null,
                userAgent || null
            ]);
        } catch (error) {
            console.error("❌ Fehler beim Audit-Logging:", error);
        // Audit-Log-Fehler sollten nicht die Hauptoperation stoppen
        }
    }
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/admin/customers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// CUSTOMERS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Kundenverwaltung API (B2C & B2B)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/customer-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // Filter-Parameter
        const customerType = searchParams.get("customer_type");
        const status = searchParams.get("status");
        const supportLevel = searchParams.get("support_level");
        const land = searchParams.get("land");
        const search = searchParams.get("search");
        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        // Sortierung
        const sortBy = searchParams.get("sort_by") || "created_at";
        const sortOrder = searchParams.get("sort_order") || "DESC";
        // Echte Datenbank-Abfrage
        const filters = {
            customer_type: customerType || undefined,
            status: status || undefined,
            support_level: supportLevel || undefined,
            land: land || undefined,
            search: search || undefined,
            page,
            limit,
            sort_by: sortBy,
            sort_order: sortOrder
        };
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CustomerService"].searchCustomers(filters);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                customers: result.customers,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: Math.ceil(result.total / limit)
                },
                filters: {
                    customer_type: customerType,
                    status,
                    support_level: supportLevel,
                    land,
                    search
                }
            }
        });
    } catch (error) {
        console.error("❌ Customers API Fehler (GET):", error);
        console.error("❌ Error Stack:", error?.stack);
        console.error("❌ Error Details:", JSON.stringify(error, null, 2));
        // Prüfe ob es ein MySQL-Fehler ist
        const mysqlError = error?.code || error?.sqlMessage || error?.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: mysqlError || "Fehler beim Laden der Kunden",
            error: ("TURBOPACK compile-time truthy", 1) ? error?.message : "TURBOPACK unreachable",
            code: error?.code
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (jsonError) {
            console.error("❌ JSON Parse Fehler:", jsonError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Ungültiges JSON-Format im Request-Body"
            }, {
                status: 400
            });
        }
        const { customer_type, anrede, titel, vorname, nachname, company_name, ust_id, contact_person_anrede, contact_person_titel, contact_person_vorname, contact_person_nachname, email, email_secondary, phone_mobile, phone_business, phone_private, strasse, plz, stadt, land, land_iso, support_level, account_manager, status, notes } = requestBody;
        // Validierung
        if (!customer_type || !email || !vorname || !nachname) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Kundentyp, E-Mail, Vorname und Nachname sind erforderlich"
            }, {
                status: 400
            });
        }
        // Firmenname-Validierung
        if (customer_type !== "privat" && (!company_name || company_name.trim() === "")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Firmenname ist für Firmen, Behörden und Partner erforderlich"
            }, {
                status: 400
            });
        }
        // E-Mail-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Ungültige E-Mail-Adresse"
            }, {
                status: 400
            });
        }
        // Kunde erstellen - echte Datenbank-Operation
        try {
            const newCustomer = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CustomerService"].createCustomer({
                customer_type,
                anrede: anrede || "Keine Angabe",
                titel: titel || null,
                vorname,
                nachname,
                firmenname: company_name || null,
                email,
                telefon: phone_mobile || phone_business || phone_private || null,
                strasse: strasse || null,
                plz: plz || null,
                ort: stadt || null,
                land: land || "Deutschland",
                status: status || "aktiv",
                support_level: support_level || "Standard",
                notes: notes || null
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Kunde erfolgreich erstellt",
                data: {
                    customer_id: newCustomer.id,
                    kundennummer: newCustomer.kundennummer,
                    customer: newCustomer
                }
            });
        } catch (createError) {
            console.error("❌ Fehler beim Erstellen des Kunden (inner catch):", createError);
            console.error("❌ Error Stack:", createError?.stack);
            console.error("❌ Error Details:", JSON.stringify(createError, null, 2));
            // Prüfe ob es ein MySQL-Fehler ist
            const mysqlError = createError?.code || createError?.sqlMessage || createError?.message;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: mysqlError || "Fehler beim Erstellen des Kunden in der Datenbank",
                error: ("TURBOPACK compile-time truthy", 1) ? createError?.message : "TURBOPACK unreachable",
                code: createError?.code
            }, {
                status: 500
            });
        }
    } catch (error) {
        // Äußerer catch für unerwartete Fehler
        console.error("❌ Fehler beim Erstellen des Kunden (outer catch):", error);
        console.error("❌ Error Stack:", error?.stack);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error?.message || "Unerwarteter Fehler beim Erstellen des Kunden",
            error: ("TURBOPACK compile-time truthy", 1) ? error?.message : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
// =====================================================
// HILFSFUNKTIONEN
// =====================================================
async function getCustomers(filters) {
    // Demo-Daten (in Produktion: echte Datenbank-Abfrage)
    const demoCustomers = [
        {
            id: "customer_demo_1",
            customer_type: "privat",
            anrede: "Herr",
            titel: null,
            vorname: "Max",
            nachname: "Mustermann",
            company_name: null,
            ust_id: null,
            contact_person_anrede: null,
            contact_person_titel: null,
            contact_person_vorname: null,
            contact_person_nachname: null,
            email: "max.mustermann@email.de",
            email_secondary: null,
            phone_mobile: "+49 123 456789",
            phone_business: null,
            phone_private: null,
            strasse: "Musterstraße 123",
            plz: "30159",
            stadt: "Hannover",
            land: "Deutschland",
            land_iso: "DE",
            support_level: "Standard",
            account_manager: null,
            account_manager_name: null,
            account_manager_lastname: null,
            status: "aktiv",
            notes: null,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "customer_demo_2",
            customer_type: "firma",
            anrede: "Frau",
            titel: null,
            vorname: "Anna",
            nachname: "Schmidt",
            company_name: "Beispiel GmbH",
            ust_id: "DE123456789",
            contact_person_anrede: "Frau",
            contact_person_titel: null,
            contact_person_vorname: "Anna",
            contact_person_nachname: "Schmidt",
            email: "anna.schmidt@beispiel-gmbh.de",
            email_secondary: "info@beispiel-gmbh.de",
            phone_mobile: "+49 511 987654",
            phone_business: "+49 511 987654",
            phone_private: null,
            strasse: "Firmenstraße 456",
            plz: "30159",
            stadt: "Hannover",
            land: "Deutschland",
            land_iso: "DE",
            support_level: "Premium",
            account_manager: "admin_user",
            account_manager_name: "Lopez",
            account_manager_lastname: "Admin",
            status: "aktiv",
            notes: "Wichtiger Kunde mit Premium-Support",
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "customer_demo_3",
            customer_type: "behörde",
            anrede: "Herr",
            titel: "Dr.",
            vorname: "Müller",
            nachname: "Verwaltung",
            company_name: "Stadt Hannover",
            ust_id: null,
            contact_person_anrede: "Herr",
            contact_person_titel: "Dr.",
            contact_person_vorname: "Müller",
            contact_person_nachname: "Verwaltung",
            email: "verwaltung@stadt-hannover.de",
            email_secondary: null,
            phone_mobile: "+49 511 555123",
            phone_business: "+49 511 555123",
            phone_private: null,
            strasse: "Rathausplatz 1",
            plz: "30159",
            stadt: "Hannover",
            land: "Deutschland",
            land_iso: "DE",
            support_level: "SLA 24h",
            account_manager: "admin_user",
            account_manager_name: "Lopez",
            account_manager_lastname: "Admin",
            status: "aktiv",
            notes: "Öffentliche Einrichtung - besondere Compliance-Anforderungen",
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    // Filter anwenden
    let filteredCustomers = demoCustomers;
    if (filters.customerType) {
        filteredCustomers = filteredCustomers.filter((c)=>c.customer_type === filters.customerType);
    }
    if (filters.status) {
        filteredCustomers = filteredCustomers.filter((c)=>c.status === filters.status);
    }
    if (filters.supportLevel) {
        filteredCustomers = filteredCustomers.filter((c)=>c.support_level === filters.supportLevel);
    }
    if (filters.land) {
        filteredCustomers = filteredCustomers.filter((c)=>c.land === filters.land);
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter((c)=>c.vorname.toLowerCase().includes(searchLower) || c.nachname.toLowerCase().includes(searchLower) || c.email.toLowerCase().includes(searchLower) || c.company_name && c.company_name.toLowerCase().includes(searchLower) || c.stadt.toLowerCase().includes(searchLower));
    }
    // Sortierung
    filteredCustomers.sort((a, b)=>{
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        if (filters.sortOrder === "ASC") {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    // Pagination
    return filteredCustomers.slice(filters.offset, filters.offset + filters.limit);
}
async function getCustomersCount(filters) {
    // Demo: Einfache Zählung (in Produktion: COUNT-Query)
    return 3;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d04125c9._.js.map