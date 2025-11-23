module.exports = [
"[project]/.next-internal/server/app/api/content/hero/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkUTF8Config",
    ()=>checkUTF8Config,
    "closePool",
    ()=>closePool,
    "createConnection",
    ()=>createConnection,
    "executeQuery",
    ()=>executeQuery,
    "executeQueryPool",
    ()=>executeQueryPool,
    "getConnectionPool",
    ()=>getConnectionPool,
    "testConnection",
    ()=>testConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
/**
 * Zentrale MySQL-Datenbankverbindung mit UTF-8 Konfiguration
 * Enterprise++ Standard für alle API-Routen
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-28
 */ // MySQL-Verbindungskonfiguration - MySQL2-kompatibel
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "lopez_it_welt",
    port: 3306,
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true,
    // MySQL2-spezifische Pool-Optionen
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
};
// Verbindungspool für bessere Performance
let pool = null;
function getConnectionPool() {
    if (!pool) {
        pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "lopez_it_welt",
            port: 3306,
            charset: "utf8mb4",
            supportBigNumbers: true,
            bigNumberStrings: true,
            // Pool-spezifische Konfiguration (nur gültige Optionen)
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}
async function createConnection() {
    try {
        const connection = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createConnection(dbConfig);
        // UTF-8 explizit setzen für maximale Kompatibilität
        await connection.execute("SET NAMES utf8mb4");
        await connection.execute("SET CHARACTER SET utf8mb4");
        await connection.execute("SET character_set_connection=utf8mb4");
        await connection.execute("SET character_set_results=utf8mb4");
        await connection.execute("SET character_set_client=utf8mb4");
        return connection;
    } catch (error) {
        console.error("❌ MySQL-Verbindung fehlgeschlagen:", error);
        throw new Error(`Datenbankverbindung fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
}
async function executeQuery(sql, params = []) {
    const connection = await createConnection();
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } finally{
        await connection.end();
    }
}
async function executeQueryPool(sql, params = []) {
    const pool = getConnectionPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
async function testConnection() {
    try {
        const connection = await createConnection();
        await connection.execute("SELECT 1");
        await connection.end();
        return true;
    } catch (error) {
        console.error("❌ Datenbankverbindung fehlgeschlagen:", error);
        return false;
    }
}
async function checkUTF8Config() {
    const connection = await createConnection();
    try {
        const [rows] = await connection.execute(`
      SELECT 
        @@character_set_database as database,
        @@character_set_server as server,
        @@character_set_connection as connection,
        @@character_set_results as results
    `);
        const result = rows[0];
        await connection.end();
        return {
            database: result.database,
            server: result.server,
            connection: result.connection,
            results: result.results
        };
    } catch (error) {
        await connection.end();
        throw error;
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
"[project]/src/app/api/content/hero/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])("SELECT * FROM content_hero WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1");
        if (Array.isArray(rows) && rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Keine Hero-Daten gefunden"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows[0], {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
    } catch (error) {
        console.error("❌ Hero API Fehler:", error);
        // 🚨 FALLBACK-DATEN FÜR HERO-SECTION
        const fallbackHeroData = {
            id: 1,
            title: "Professionelle IT-Lösungen",
            subtitle: "Lopez IT Welt",
            description: "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.",
            button_text: "Jetzt beraten lassen",
            button_link: "/kontakt",
            background_style: "gradient",
            background_value: "from-blue-900 to-blue-600",
            is_active: true,
            dataSource: "fallback",
            status: "fallback",
            fallbackReason: "Datenbank-Verbindung fehlgeschlagen",
            timestamp: new Date().toISOString(),
            warning: "⚠️ NOTFALL-MODUS: Hero-Daten aus Fallback-System geladen"
        };
        console.warn("🚨 Hero API: Notfall-Modus aktiviert - Mock-Daten geladen");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(fallbackHeroData, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createConnection"])();
        const { title, subtitle, description, button_text, button_link, background_style, background_value, is_active } = body;
        await connection.execute(`UPDATE content_hero SET 
       title = ?, 
       subtitle = ?, 
       description = ?, 
       button_text = ?, 
       button_link = ?, 
       background_style = ?, 
       background_value = ?, 
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`, [
            title,
            subtitle,
            description,
            button_text,
            button_link,
            background_style,
            background_value,
            is_active,
            body.id
        ]);
        await connection.end();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Hero-Daten aktualisiert"
        });
    } catch  {
        // Hero Update Error
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Update fehlgeschlagen"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createConnection"])();
        const { title, subtitle, description, button_text, button_link, background_style = "gradient", background_value, is_active = true } = body;
        const [result] = await connection.execute(`INSERT INTO content_hero (title, subtitle, description, button_text, button_link, background_style, background_value, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            title,
            subtitle,
            description,
            button_text,
            button_link,
            background_style,
            background_value,
            is_active
        ]);
        await connection.end();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Hero-Daten erstellt",
            id: result.insertId
        });
    } catch  {
        // Hero Create Error
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erstellung fehlgeschlagen"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d402fe01._.js.map