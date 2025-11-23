module.exports = [
"[project]/.next-internal/server/app/api/admin/time-tracking/sessions/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/admin/time-tracking/sessions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
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
        // Datei existiert nicht oder ist leer
        return [];
    }
}
// Sessions speichern
async function saveSessions(sessions) {
    try {
        // Verzeichnis erstellen falls nicht vorhanden
        const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(SESSIONS_FILE);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(dir, {
            recursive: true
        });
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    } catch (error) {
    // Fehler beim Speichern der Sessions: ${error}
    }
}
// Korrekte aktuelle Zeit (Deutschland mit Sommerzeit)
function getCurrentTime() {
    const now = new Date();
    // Automatische Sommerzeit-Erkennung
    return now.toISOString();
}
// Alle offenen Sessions beenden
async function closeAllOpenSessions() {
    try {
        const sessions = await loadSessions();
        const now = new Date().toISOString();
        let hasChanges = false;
        for(let i = 0; i < sessions.length; i++){
            const session = sessions[i];
            if (session.status === "active" && !session.end_time) {
                const startDate = new Date(session.start_time);
                const endDate = new Date(now);
                const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
                sessions[i] = {
                    ...session,
                    end_time: now,
                    duration_minutes: Math.max(0, durationMinutes),
                    status: "completed",
                    updated_at: now
                };
                hasChanges = true;
            // Offene Session automatisch beendet: ${session.module} (${durationMinutes} Min)
            }
        }
        if (hasChanges) {
            await saveSessions(sessions);
        }
    } catch (error) {
    // Fehler beim Beenden offener Sessions: ${error}
    }
}
async function GET() {
    try {
        const sessions = await loadSessions();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(sessions);
    } catch (error) {
        // Fehler beim Abrufen der Sessions: ${error}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Fehler beim Abrufen der Sessions"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        // KEINE automatische Beendigung mehr - echte Zeiterfassung!
        // await closeAllOpenSessions(); // ENTFERNT
        const body = await request.json();
        const { user_id, module, taetigkeit, ausloeser, problem, category = "development", priority = "medium", project_id, task_id } = body;
        // Validierung: Pflichtfelder
        if (!user_id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "user_id ist ein Pflichtfeld"
            }, {
                status: 400
            });
        }
        if (!project_id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "project_id ist ein Pflichtfeld"
            }, {
                status: 400
            });
        }
        if (!task_id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "task_id ist ein Pflichtfeld"
            }, {
                status: 400
            });
        }
        if (!taetigkeit || taetigkeit.trim().length < 8) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "taetigkeit ist ein Pflichtfeld (mindestens 8 Zeichen)"
            }, {
                status: 400
            });
        }
        if (taetigkeit.length > 180) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "taetigkeit darf maximal 180 Zeichen lang sein"
            }, {
                status: 400
            });
        }
        // Validierung: Keine technischen Namen
        const technicalPatterns = [
            /\.tsx?$/i,
            /\.jsx?$/i,
            /component/i,
            /page-component/i,
            /route/i,
            /index\./i
        ];
        const hasTechnicalPattern = technicalPatterns.some((pattern)=>pattern.test(taetigkeit));
        if (hasTechnicalPattern) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "taetigkeit darf keine technischen Namen enthalten (z.B. .tsx, Component, Route). Verwende verständliche Beschreibungen."
            }, {
                status: 400
            });
        }
        const sessions = await loadSessions();
        // 🔒 WICHTIG: Prüfe ob bereits eine aktive Session für diesen Benutzer existiert
        const activeSession = sessions.find((s)=>s.user_id === user_id && s.status === "active" && !s.end_time);
        if (activeSession) {
            // Es existiert bereits eine aktive Session - diese zurückgeben
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Aktive Session existiert bereits",
                session: activeSession,
                id: activeSession.id
            }, {
                status: 200
            });
        }
        // Keine aktive Session vorhanden - neue Session erstellen
        const now = getCurrentTime();
        const maxId = sessions.length > 0 ? Math.max(...sessions.map((s)=>s.id)) : 0;
        const session = {
            id: maxId + 1,
            user_id,
            module: module || taetigkeit.substring(0, 50),
            taetigkeit,
            ausloeser,
            problem,
            category,
            priority,
            project_id,
            task_id,
            start_time: now,
            status: "active",
            created_at: now,
            updated_at: now
        };
        sessions.push(session);
        await saveSessions(sessions);
        // Neue Session erstellt: ${session.module} - ${session.taetigkeit} (${now})
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(session, {
            status: 201
        });
    } catch (error) {
        // Fehler beim Erstellen der Session: ${error}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Fehler beim Erstellen der Session"
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const sessions = await loadSessions();
        const sessionIndex = sessions.findIndex((s)=>s.id === id);
        if (sessionIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session nicht gefunden"
            }, {
                status: 404
            });
        }
        const now = getCurrentTime();
        const updatedSessionData = {
            ...sessions[sessionIndex],
            ...updateData,
            updated_at: now
        };
        sessions[sessionIndex] = updatedSessionData;
        await saveSessions(sessions);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedSessionData);
    } catch (error) {
        // Fehler beim Aktualisieren der Session: ${error}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Fehler beim Aktualisieren der Session"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3702c3b6._.js.map