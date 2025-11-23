module.exports = [
"[project]/.next-internal/server/app/api/admin/time-tracking/stats/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

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
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/admin/time-tracking/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Datei-Pfad für Sessions
const SESSIONS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "time-sessions.json");
// Sessions laden
async function loadSessions() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(SESSIONS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}
// Hilfsfunktion um Dauer zwischen zwei Zeiten zu berechnen
function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minuten
}
// Prüfen ob ein Datum heute ist
function isToday(dateString) {
    const today = new Date().toDateString();
    const date = new Date(dateString).toDateString();
    return today === date;
}
async function GET() {
    try {
        const sessions = await loadSessions();
        const now = new Date().toISOString();
        const today = new Date(now).toDateString();
        // Berechne Statistiken
        const totalSessions = sessions.length;
        const activeSessions = sessions.filter((s)=>s.status === "active").length;
        let totalTime = 0;
        let todayTime = 0;
        const statusStats = {
            active: 0,
            completed: 0,
            interrupted: 0
        };
        const categoryStats = {};
        const problemStats = {};
        const moduleStats = {};
        const ausloeserStats = {};
        sessions.forEach((session)=>{
            // Status-Statistiken
            statusStats[session.status]++;
            // Kategorie-Statistiken
            categoryStats[session.category] = (categoryStats[session.category] || 0) + 1;
            // Modul-Statistiken
            moduleStats[session.module] = (moduleStats[session.module] || 0) + 1;
            // Auslöser-Statistiken
            if (session.ausloeser) {
                ausloeserStats[session.ausloeser] = (ausloeserStats[session.ausloeser] || 0) + 1;
            }
            // Problem-Statistiken
            if (session.problem) {
                problemStats[session.problem] = (problemStats[session.problem] || 0) + 1;
            }
            // Zeit-Berechnungen
            if (session.end_time) {
                const duration = calculateDuration(session.start_time, session.end_time);
                totalTime += duration;
                // Heute gearbeitete Zeit
                if (isToday(session.start_time)) {
                    todayTime += duration;
                }
            }
        });
        // Durchschnittliche Dauer
        const completedSessions = sessions.filter((s)=>s.status === "completed" && s.duration_minutes);
        const avgDuration = completedSessions.length > 0 ? Math.round(completedSessions.reduce((sum, s)=>sum + (s.duration_minutes || 0), 0) / completedSessions.length) : 0;
        // Erfolgsrate
        const successRate = totalSessions > 0 ? Math.round(statusStats.completed / totalSessions * 100) : 0;
        const stats = {
            totalSessions,
            activeSessions,
            totalTime,
            todayTime,
            statusStats,
            categoryStats,
            problemStats,
            moduleStats,
            ausloeserStats,
            avgDuration,
            successRate
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(stats);
    } catch (error) {
        // Fehler beim Abrufen der Statistiken: ${error}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Fehler beim Abrufen der Statistiken"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__20f673d7._.js.map