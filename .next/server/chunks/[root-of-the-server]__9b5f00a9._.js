module.exports = [
"[project]/.next-internal/server/app/api/ab/variant/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/ab/variant/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * GET /api/ab/variant
 * Ermittelt, welche Variante ein Nutzer sehen soll
 * Prüft: ab_active, split_a
 * Liefert zufällig oder gezielt Variante A/B zurück
 * Loggt Event in ab_events (type='view')
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
async function GET(request) {
    try {
        const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createConnection"])();
        // 1. Prüfe ob A/B-Testing aktiv ist
        const [configRows] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");
        if (!Array.isArray(configRows) || configRows.length === 0) {
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "A/B-Testing Konfiguration nicht gefunden"
            }, {
                status: 404
            });
        }
        const config = configRows[0];
        if (!config.ab_active) {
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                active: false,
                variant: null,
                message: "A/B-Testing ist deaktiviert"
            });
        }
        // 2. Finde aktives Experiment
        const [experimentRows] = await connection.execute(`SELECT * FROM ab_experiments 
       WHERE status = 'running' 
       AND (start_date IS NULL OR start_date <= NOW())
       AND (end_date IS NULL OR end_date >= NOW())
       ORDER BY created_at DESC 
       LIMIT 1`);
        if (!Array.isArray(experimentRows) || experimentRows.length === 0) {
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                active: false,
                variant: null,
                message: "Kein aktives Experiment gefunden"
            });
        }
        const experiment = experimentRows[0];
        // 3. Lade Varianten
        const [variantRows] = await connection.execute("SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key", [
            experiment.id
        ]);
        if (!Array.isArray(variantRows) || variantRows.length === 0) {
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Keine Varianten für dieses Experiment gefunden"
            }, {
                status: 404
            });
        }
        // 4. User-Hash generieren (anonymisiert, DSGVO-konform)
        const userAgent = request.headers.get("user-agent") || "";
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const userHash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(`${userAgent}-${ipAddress}`).digest("hex");
        // 5. Device-Type erkennen
        const deviceType = userAgent.includes("Mobile") ? "mobile" : userAgent.includes("Tablet") ? "tablet" : "desktop";
        // 6. Variante zuweisen (konsistent basierend auf User-Hash)
        const hashValue = parseInt(userHash.substring(0, 8), 16);
        const splitPercentage = experiment.split_a || config.default_split;
        const variantIndex = hashValue % 100 < splitPercentage ? 0 : 1;
        const selectedVariant = variantRows[variantIndex] || variantRows[0];
        // 7. Event loggen (view)
        await connection.execute(`INSERT INTO ab_events 
       (experiment_id, variant_key, event_type, user_hash, device_type) 
       VALUES (?, ?, 'view', ?, ?)`, [
            experiment.id,
            selectedVariant.variant_key,
            userHash,
            deviceType
        ]);
        // 8. Impression-Zähler erhöhen
        await connection.execute(`UPDATE ab_variants 
       SET impressions = impressions + 1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`, [
            selectedVariant.id
        ]);
        await connection.end();
        // 9. Variante zurückgeben
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            active: true,
            experiment_id: experiment.id,
            experiment_name: experiment.name,
            variant: {
                key: selectedVariant.variant_key,
                title: selectedVariant.title,
                subtitle: selectedVariant.subtitle,
                description: selectedVariant.description,
                button_text: selectedVariant.button_text,
                button_link: selectedVariant.button_link
            },
            split_a: experiment.split_a,
            device_type: deviceType
        }, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
    } catch (error) {
        console.error("❌ A/B Variant API Fehler:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Fehler beim Abrufen der Variante",
            details: error instanceof Error ? error.message : "Unbekannter Fehler"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9b5f00a9._.js.map