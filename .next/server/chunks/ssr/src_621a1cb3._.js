module.exports = [
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 🛠️ Enterprise++ Utility Functions
 *
 * Sammlung von nützlichen Utility-Funktionen:
 * - Class Name Utilities (cn)
 * - String Utilities
 * - Date Utilities
 * - Validation Utilities
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-20
 */ __turbopack_context__.s([
    "capitalize",
    ()=>capitalize,
    "cn",
    ()=>cn,
    "copyToClipboard",
    ()=>copyToClipboard,
    "debounce",
    ()=>debounce,
    "formatClassName",
    ()=>formatClassName,
    "formatDate",
    ()=>formatDate,
    "generateId",
    ()=>generateId,
    "generateSlug",
    ()=>generateSlug,
    "getLocalStorage",
    ()=>getLocalStorage,
    "getRandomColor",
    ()=>getRandomColor,
    "hexToRgb",
    ()=>hexToRgb,
    "isValidEmail",
    ()=>isValidEmail,
    "isValidPhone",
    ()=>isValidPhone,
    "removeLocalStorage",
    ()=>removeLocalStorage,
    "rgbToHex",
    ()=>rgbToHex,
    "setLocalStorage",
    ()=>setLocalStorage,
    "throttle",
    ()=>throttle,
    "toTitleCase",
    ()=>toTitleCase,
    "truncateText",
    ()=>truncateText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs);
}
function formatClassName(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/^-/, "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function debounce(func, wait) {
    let timeout;
    return (...args)=>{
        clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
}
function throttle(func, limit) {
    let inThrottle;
    return (...args)=>{
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(()=>inThrottle = false, limit);
        }
    };
}
function formatDate(date, format = "short") {
    const d = new Date(date);
    switch(format){
        case "short":
            return d.toLocaleDateString("de-DE");
        case "long":
            return d.toLocaleDateString("de-DE", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        case "time":
            return d.toLocaleTimeString("de-DE");
        case "datetime":
            return d.toLocaleString("de-DE");
        default:
            return d.toLocaleDateString("de-DE");
    }
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
}
function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Copy to clipboard failed:", error);
        return false;
    }
}
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Local storage set failed:", error);
        return false;
    }
}
function getLocalStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error("Local storage get failed:", error);
        return defaultValue;
    }
}
function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Local storage remove failed:", error);
        return false;
    }
}
function generateSlug(str) {
    return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function truncateText(text, length, suffix = "...") {
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt)=>txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
}),
"[project]/src/components/ui/Card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 🃏 Enterprise++ Card Component
 *
 * Universelle Card-Komponente für das Design-System:
 * - Flexible Props für verschiedene Anwendungsfälle
 * - Konsistente Styling-Optionen
 * - Accessibility-konform
 * - Dark Mode Support
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-20
 */ __turbopack_context__.s([
    "Card",
    ()=>Card,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
const Card = ({ children, variant = "default", size = "md", padding = "md", radius = "lg", shadow = "sm", bg = "white", border = true, hoverable = false, focusable = false, interactive = false, className = "", ...props })=>{
    const baseClasses = "block";
    const variantClasses = {
        default: "bg-white border border-gray-200",
        outlined: "bg-transparent border-2 border-gray-300",
        elevated: "bg-white shadow-lg border-0",
        filled: "bg-gray-50 border border-gray-200",
        glass: "bg-white/80 backdrop-blur-sm border border-white/20",
        premium: "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
    };
    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
    };
    const paddingClasses = {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8"
    };
    const radiusClasses = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl"
    };
    const shadowClasses = {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl"
    };
    const bgClasses = {
        white: "bg-white",
        gray: "bg-gray-50",
        blue: "bg-blue-50",
        green: "bg-green-50",
        red: "bg-red-50",
        yellow: "bg-yellow-50",
        purple: "bg-purple-50",
        transparent: "bg-transparent",
        weiss10: "bg-white/10"
    };
    const interactiveClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(hoverable && "hover:shadow-md hover:scale-[1.02] transition-all duration-200", focusable && "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", interactive && "cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200");
    const cardClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(baseClasses, variantClasses[variant], sizeClasses[size], paddingClasses[padding], radiusClasses[radius], shadowClasses[shadow], bgClasses[bg], !border && "border-0", interactiveClasses, className);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cardClasses,
        tabIndex: focusable ? 0 : undefined,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Card;
}),
"[project]/src/components/ui/Dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "useDialog",
    ()=>useDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function useDialog() {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return {
        open,
        setOpen
    };
}
function Dialog({ open, onClose, children }) {
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-xl w-full max-w-lg p-4",
            onClick: (e)=>e.stopPropagation(),
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/Dialog.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Dialog.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/ki-action-tracker.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
class KIActionTracker {
    currentSession = null;
    sessionStartTime = null;
    lastActionTime = null;
    currentKISession = null;
    interactions = [];
    errors = [];
    // Trigger-Erkennung für Sprach-/Textbefehle
    triggerKeywords = [
        "mach",
        "erstelle",
        "baue",
        "entwickle",
        "implementiere",
        "programmiere",
        "login",
        "register",
        "dashboard",
        "admin",
        "shop",
        "api",
        "database",
        "fix",
        "repariere",
        "korrigiere",
        "debug",
        "optimize",
        "verbessere"
    ];
    endKeywords = [
        "danke",
        "fertig",
        "erledigt",
        "abgeschlossen",
        "done",
        "complete",
        "stopp",
        "ende",
        "beende",
        "stop",
        "finish"
    ];
    // Automatische Trigger-Erkennung
    detectTrigger(input) {
        const lowerInput = input.toLowerCase();
        return this.triggerKeywords.some((keyword)=>lowerInput.includes(keyword));
    }
    // Automatische Ende-Erkennung
    detectEnd(input) {
        const lowerInput = input.toLowerCase();
        return this.endKeywords.some((keyword)=>lowerInput.includes(keyword));
    }
    // Intelligente Session-Erstellung basierend auf Trigger
    startSessionFromTrigger(trigger, module) {
        const sessionId = `ki_${new Date().toISOString().split("T")[0]}-${module?.toUpperCase() || "TASK"}-${Math.random().toString(36).substr(2, 6)}`;
        // Modul aus Trigger extrahieren
        const extractedModule = this.extractModuleFromTrigger(trigger);
        const finalModule = module || extractedModule || "general";
        // Zusammenfassung aus Trigger generieren
        const summary = this.generateSummaryFromTrigger(trigger);
        this.currentKISession = {
            session_id: sessionId,
            modul: finalModule,
            start_time: new Date().toISOString(),
            triggered_by: `Sprach-/Textbefehl: ${trigger}`,
            summary: summary,
            tool_used: "Cursor + GPT-4 + Next.js + Tailwind",
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.sessionStartTime = new Date();
        this.lastActionTime = new Date();
        // In Time-Tracking eintragen
        this.createTimeTrackingSession(finalModule, summary, trigger);
    // console.log(`🤖 KI-Session gestartet: ${finalModule} - ${summary}`);
    // console.log(`📝 Trigger: "${trigger}"`);
    }
    // Standard startSession Methode für direkte Aufrufe
    startSession(module, taetigkeit, ausloeser) {
        const sessionId = `ki_${new Date().toISOString().split("T")[0]}-${module.toUpperCase()}-${Math.random().toString(36).substr(2, 6)}`;
        this.currentKISession = {
            session_id: sessionId,
            modul: module,
            start_time: new Date().toISOString(),
            triggered_by: ausloeser,
            summary: taetigkeit,
            tool_used: "Cursor + GPT-4 + Next.js + Tailwind",
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.sessionStartTime = new Date();
        this.lastActionTime = new Date();
        // In Time-Tracking eintragen
        this.createTimeTrackingSession(module, taetigkeit, ausloeser);
    // console.log('🤖 KI-Session gestartet:', module, taetigkeit);
    }
    // Modul aus Trigger extrahieren
    extractModuleFromTrigger(trigger) {
        const lowerTrigger = trigger.toLowerCase();
        if (lowerTrigger.includes("login")) return "login-page";
        if (lowerTrigger.includes("register")) return "register-page";
        if (lowerTrigger.includes("dashboard")) return "admin-dashboard";
        if (lowerTrigger.includes("admin")) return "admin-system";
        if (lowerTrigger.includes("shop")) return "e-commerce";
        if (lowerTrigger.includes("api")) return "api-development";
        if (lowerTrigger.includes("database")) return "database";
        if (lowerTrigger.includes("fix") || lowerTrigger.includes("repariere")) return "bugfix";
        if (lowerTrigger.includes("optimize") || lowerTrigger.includes("verbessere")) return "optimization";
        return "general-development";
    }
    // Zusammenfassung aus Trigger generieren
    generateSummaryFromTrigger(trigger) {
        const lowerTrigger = trigger.toLowerCase();
        if (lowerTrigger.includes("login")) return "Login-System erstellt mit E-Mail, Passwort, Validierung";
        if (lowerTrigger.includes("register")) return "Registrierung erstellt mit Benutzerdaten, E-Mail-Bestätigung";
        if (lowerTrigger.includes("dashboard")) return "Admin-Dashboard erstellt mit Statistiken und Verwaltung";
        if (lowerTrigger.includes("shop")) return "E-Commerce-System erstellt mit Produkten, Warenkorb, Checkout";
        if (lowerTrigger.includes("api")) return "API-Endpoints erstellt mit CRUD-Operationen";
        if (lowerTrigger.includes("database")) return "Datenbankstruktur erstellt mit Tabellen und Beziehungen";
        if (lowerTrigger.includes("fix")) return "Bugfix durchgeführt und Probleme behoben";
        if (lowerTrigger.includes("optimize")) return "Performance-Optimierung durchgeführt";
        return `Task ausgeführt: ${trigger}`;
    }
    // Automatisch Session beenden
    endSession(problem) {
        if (!this.currentKISession || !this.sessionStartTime) {
            // console.log(`❌ Keine aktive KI-Session zum Beenden`);
            return;
        }
        const endTime = new Date();
        const durationMs = endTime.getTime() - this.sessionStartTime.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));
        // KI-Session aktualisieren
        this.currentKISession.end_time = endTime.toISOString();
        this.currentKISession.duration_minutes = durationMinutes;
        this.currentKISession.status = "completed";
        this.currentKISession.updated_at = endTime.toISOString();
        // In JSON-Datei speichern
        this.saveSessionToDatabase(this.currentKISession);
        // Session in Time-Tracking beenden
        this.completeTimeTrackingSession(problem);
        // console.log(`✅ KI-Session beendet: ${this.currentKISession.modul} (${durationMinutes} Min)`);
        // console.log(`📊 Zusammenfassung: ${this.currentKISession.summary}`);
        this.currentKISession = null;
        this.sessionStartTime = null;
        this.lastActionTime = null;
    }
    // Automatisch Interaktion erfassen
    logInteraction(module, taetigkeit, ausloeser, problem) {
        // console.log(`📝 KI-Interaktion: ${module} - ${taetigkeit}`);
        const action = {
            id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            type: "interaction",
            module,
            taetigkeit,
            ausloeser,
            problem,
            timestamp: new Date().toISOString()
        };
        this.interactions.push(action);
    }
    // Automatisch Fehler erfassen
    logError(module, taetigkeit, ausloeser, error) {
        // console.log(`❌ KI-Fehler: ${module} - ${taetigkeit} - ${error}`);
        const action = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            type: "error",
            module,
            taetigkeit,
            ausloeser,
            problem: error,
            timestamp: new Date().toISOString()
        };
        this.errors.push(action);
        // Time-Tracking Session für Fehler erstellen
        this.createTimeTrackingSession(module, taetigkeit, ausloeser, error, "interrupted");
    }
    // Hilfsmethoden für Time-Tracking
    async createTimeTrackingSession(module, taetigkeit, ausloeser, problem, status = "active") {
        try {
            const response = await fetch("/api/admin/time-tracking/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: 1,
                    module,
                    taetigkeit,
                    ausloeser,
                    problem,
                    category: "ki_interaction",
                    priority: "high",
                    status
                })
            });
            if (response.ok) {
                const session = await response.json();
                console.log(`✅ KI-Time-Tracking Session erstellt: ${session.module}`);
                return session;
            }
        } catch (error) {
            console.error("❌ Fehler beim Erstellen der KI-Time-Tracking Session:", error);
        }
    }
    async completeTimeTrackingSession(problem) {
        try {
            // Aktive Sessions finden und beenden
            const response = await fetch("/api/admin/time-tracking/sessions");
            if (response.ok) {
                const sessions = await response.json();
                const activeSessions = sessions.filter((s)=>s.user_id === 1 && s.status === "active" && s.category === "ki_interaction");
                for (const session of activeSessions){
                    await fetch(`/api/admin/time-tracking/sessions/${session.id}/complete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: "completed",
                            problem
                        })
                    });
                }
            }
        } catch (error) {
            console.error("❌ Fehler beim Beenden der KI-Time-Tracking Sessions:", error);
        }
    }
    // KI-Session in JSON-Datei speichern
    async saveSessionToDatabase(session) {
        try {
            const response = await fetch("/api/admin/ki-sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(session)
            });
            if (response.ok) {
            // console.log('💾 KI-Session gespeichert:', session.session_id);
            }
        } catch (error) {
            console.error("Fehler beim Speichern der KI-Session:", error);
        }
    }
    // Aktuelle Session abrufen
    getCurrentSession() {
        return this.currentKISession;
    }
    // Alle Sessions abrufen
    async getAllSessions() {
        try {
            const response = await fetch("/api/admin/ki-sessions");
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der KI-Sessions:", error);
        }
        return [];
    }
    // Intelligente Trigger-Erkennung für aktuelle Aktionen
    detectAndStartSession(input) {
        if (this.detectTrigger(input)) {
            this.startSessionFromTrigger(input);
            return true;
        }
        return false;
    }
    // Intelligente Ende-Erkennung für aktuelle Aktionen
    detectAndEndSession(input) {
        if (this.detectEnd(input)) {
            this.endSession("Benutzer hat Session beendet");
            return true;
        }
        return false;
    }
    endCurrentSession() {
        if (!this.currentKISession) {
            // console.log('❌ Keine aktive KI-Session zum Beenden');
            return;
        }
        const endTime = new Date();
        const durationMs = endTime.getTime() - new Date(this.currentKISession.start_time).getTime();
        // const durationMinutes = Math.round(durationMs / (1000 * 60));
        // console.log(
        //   `✅ KI-Session beendet: ${this.currentKISession.modul} (${durationMs} ms)`
        // );
        this.currentKISession = null;
    }
}
// Singleton-Instanz exportieren
const kiTracker = new KIActionTracker();
const __TURBOPACK__default__export__ = kiTracker;
// Automatische Session-Beendigung beim Verlassen der Seite
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
"[project]/src/components/Features/Timer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Timer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function Timer({ sessionId, onSessionComplete, onStop, autoStart = false }) {
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [seconds, setSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isPaused, setIsPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pausedSeconds, setPausedSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (autoStart && sessionId) {
            startTimer();
        }
    }, [
        autoStart,
        sessionId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let interval;
        if (isRunning && !isPaused) {
            interval = setInterval(()=>{
                setSeconds((prev)=>prev + 1);
            }, 1000);
        }
        return ()=>clearInterval(interval);
    }, [
        isRunning,
        isPaused
    ]);
    const startTimer = ()=>{
        setIsRunning(true);
        setIsPaused(false);
    // console.log('⏱️ Timer gestartet');
    };
    const pauseTimer = ()=>{
        if (isRunning) {
            setIsPaused(true);
            setPausedSeconds(seconds);
        // console.log('⏸️ Timer pausiert');
        }
    };
    const resumeTimer = ()=>{
        if (isPaused) {
            setIsPaused(false);
        // console.log('▶️ Timer fortgesetzt');
        }
    };
    const stopTimer = ()=>{
        setIsRunning(false);
        setIsPaused(false);
        const totalSeconds = seconds;
        setSeconds(0);
        setPausedSeconds(0);
        // Zuerst onStop aufrufen (um Session zu beenden)
        if (onStop) {
            onStop();
        }
        // Dann onSessionComplete mit Dauer aufrufen
        if (onSessionComplete) {
            onSessionComplete(Math.round(totalSeconds / 60)); // Minuten
        }
    // console.log('⏹️ Timer gestoppt - Dauer:', formatTime(totalSeconds));
    };
    const formatTime = (totalSeconds)=>{
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    const getDisplayTime = ()=>{
        return formatTime(isPaused ? pausedSeconds : seconds);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-4xl font-mono font-bold text-gray-900 mb-4",
                    children: getDisplayTime()
                }, void 0, false, {
                    fileName: "[project]/src/components/Features/Timer.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center space-x-3",
                    children: [
                        !isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: startTimer,
                            className: "bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors",
                            children: "▶️ Start"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Features/Timer.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this) : isPaused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: resumeTimer,
                            className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors",
                            children: "▶️ Fortsetzen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Features/Timer.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: pauseTimer,
                            className: "bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors",
                            children: "⏸️ Pause"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Features/Timer.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, this),
                        isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: stopTimer,
                            className: "bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors",
                            children: "⏹️ Stop"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Features/Timer.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Features/Timer.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                isPaused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 text-sm text-gray-600",
                    children: [
                        "⏸️ Pausiert bei ",
                        formatTime(pausedSeconds)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Features/Timer.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this),
                isRunning && !isPaused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 text-sm text-green-600",
                    children: "⏱️ Läuft..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Features/Timer.tsx",
                    lineNumber: 133,
                    columnNumber: 36
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Features/Timer.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Features/Timer.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/admin/time-tracking/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TimeTrackingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ki-action-tracker.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Features$2f$Timer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Features/Timer.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function TimeTrackingPage() {
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        totalSessions: 0,
        activeSessions: 0,
        totalTime: 0,
        todayTime: 0,
        statusStats: {
            active: 0,
            completed: 0,
            interrupted: 0
        },
        categoryStats: {},
        problemStats: {},
        moduleStats: {},
        ausloeserStats: {},
        avgDuration: 0,
        successRate: 0
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("overview");
    const [billableEntries, setBillableEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [billableLoading, setBillableLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentSession, setCurrentSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddForm, setShowAddForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showProjectDialog, setShowProjectDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newProject, setNewProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        customer_id: "",
        project_name: "",
        project_code: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "open"
    });
    const [newSession, setNewSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        module: "",
        taetigkeit: "",
        category: "development",
        priority: "medium",
        project_id: undefined,
        order_id: undefined,
        task_id: undefined,
        problem: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Automatisch KI-Session starten
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].startSessionFromTrigger("Zeiterfassung-Bereich laden und Sessions verwalten", "Time-Tracking-Page-Component");
        const startAutomaticTracking = async ()=>{
            try {
                // Prüfen ob bereits eine aktive Session für diesen Benutzer existiert
                const response = await fetch("/api/admin/time-tracking/sessions");
                if (response.ok) {
                    const existingSessions = await response.json();
                    const activeSession = existingSessions.find((s)=>s.user_id === 1 && s.status === "active" && !s.end_time);
                    if (activeSession) {
                        // Verwende bestehende aktive Session (egal welches Modul)
                        setCurrentSession(activeSession);
                        return;
                    }
                }
            // NEUE AUTOMATISCHE SESSION DEAKTIVIERT
            // Stattdessen: Benutzer muss manuell eine Session starten
            // Dies verhindert automatische Duplikate
            // Automatische Session wird NICHT mehr erstellt
            // Der Benutzer muss bewusst eine Session starten über "+ Neue Session"
            } catch (error) {
                console.error("❌ Fehler beim Prüfen aktiver Sessions:", error);
            }
        };
        startAutomaticTracking();
        loadData();
        loadProjectsOrdersTasks();
        // Abrechenbare Zeiten beim Laden des Tabs laden
        const loadBillableEntries = async ()=>{
            if (activeTab === "billable") {
                setBillableLoading(true);
                try {
                    const response = await fetch("/api/time/entries?approved=true&invoiced=false");
                    if (response.ok) {
                        const data = await response.json();
                        setBillableEntries(data?.data?.items || []);
                    }
                } catch (error) {
                    console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
                } finally{
                    setBillableLoading(false);
                }
            }
        };
        // Lade abrechenbare Zeiten wenn Tab gewechselt wird
        if (activeTab === "billable") {
            loadBillableEntries();
        }
        // Heartbeat alle 20s, Auto-Pause bei Tab-Hidden
        let heartbeatInterval;
        const heartbeat = ()=>{
            if (!currentSession?.id) return;
            fetch(`/api/admin/time-tracking/sessions/${currentSession.id}/heartbeat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_ts: new Date().toISOString()
                })
            }).catch(()=>{});
        };
        heartbeatInterval = setInterval(heartbeat, 20000);
        const handleVisibilityChange = ()=>{
            if (document.hidden && currentSession) {
                // Auto-Pause bei Tab-Hidden
                handleSessionPause(currentSession.id);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        // Cleanup: Session beenden beim Verlassen der Seite
        return ()=>{
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (currentSession) {
                handleSessionComplete(currentSession.id, {});
            }
        };
    }, [
        currentSession
    ]);
    // Projekte, Aufträge und Aufgaben laden
    const loadProjectsOrdersTasks = async ()=>{
        try {
            const [projectsRes, ordersRes, tasksRes, customersRes] = await Promise.all([
                fetch("/api/projects").catch(()=>null),
                fetch("/api/orders").catch(()=>null),
                fetch("/api/tasks").catch(()=>null),
                fetch("/api/admin/customers").catch(()=>null)
            ]);
            if (projectsRes?.ok) {
                const data = await projectsRes.json();
                console.log("📦 Projekte geladen:", data);
                const loadedProjects = data?.data?.projects || data?.projects || [];
                setProjects(loadedProjects);
                // Automatisch Dialog öffnen, wenn keine Projekte vorhanden
                if (loadedProjects.length === 0 && !showProjectDialog) {
                    setShowProjectDialog(true);
                }
            } else {
                console.error("❌ Projekte konnten nicht geladen werden:", projectsRes?.status);
            }
            if (ordersRes?.ok) {
                const data = await ordersRes.json();
                setOrders(data?.data?.orders || data?.orders || []);
            }
            if (tasksRes?.ok) {
                const data = await tasksRes.json();
                console.log("📦 Aufgaben geladen:", data);
                setTasks(data?.data?.tasks || data?.tasks || []);
            } else {
                console.error("❌ Aufgaben konnten nicht geladen werden:", tasksRes?.status);
            }
            if (customersRes?.ok) {
                const data = await customersRes.json();
                const loadedCustomers = data?.data?.customers || data?.customers || [];
                setCustomers(loadedCustomers);
                // Ersten Kunden als Default setzen, wenn vorhanden
                if (loadedCustomers.length > 0 && !newProject.customer_id) {
                    setNewProject((prev)=>({
                            ...prev,
                            customer_id: loadedCustomers[0].id.toString()
                        }));
                }
            }
        } catch (error) {
            console.error("Fehler beim Laden von Projekten/Aufträgen/Aufgaben:", error);
        }
    };
    // Daten laden - als separate Funktion definiert
    const loadData = async ()=>{
        try {
            const [sessionsRes, statsRes] = await Promise.all([
                fetch("/api/admin/time-tracking/sessions"),
                fetch("/api/admin/time-tracking/stats")
            ]);
            if (sessionsRes.ok) {
                const sessionsData = await sessionsRes.json();
                setSessions(sessionsData);
                // KI-Interaktion loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", "Sessions erfolgreich geladen", "API-Call");
            } else {
                // Fehler loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Sessions laden fehlgeschlagen", "API-Call", `HTTP ${sessionsRes.status}`);
            }
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
                // KI-Interaktion loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", "Statistiken erfolgreich geladen", "API-Call");
            } else {
                // Fehler loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Statistiken laden fehlgeschlagen", "API-Call", `HTTP ${statsRes.status}`);
            }
        } catch (error) {
            console.error("Fehler beim Laden der Daten:", error);
            // Fehler loggen
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Daten laden fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
        } finally{
            setLoading(false);
        }
    };
    // Automatische Zeiterfassung für alle Aktionen
    const logAction = (action, details)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", action, "Benutzer-Aktion", details);
    };
    const handleSessionAction = async (sessionId, action, sessionData)=>{
    // Implementation for future feature
    };
    const handleSessionUpdate = async (sessionId, updateData)=>{
    // Implementation for future feature
    };
    const handleStartSession = async ()=>{
        try {
            // Validierung wird bereits im Button onClick gemacht
            // Prüfe zuerst, ob bereits eine aktive Session existiert
            if (currentSession && currentSession.status === "active" && !currentSession.end_time) {
                const currentProject = projects.find((p)=>p.id === currentSession.project_id);
                const currentTask = tasks.find((t)=>t.id === currentSession.task_id);
                const currentSessionDesc = currentProject && currentTask && currentSession.taetigkeit ? `Projekt: ${currentProject.project_name || currentProject.name} – Aufgabe: ${currentTask.task_title || currentTask.title} — ${currentSession.taetigkeit}` : currentSession.taetigkeit || currentSession.module;
                const confirmClose = confirm(`Sie haben bereits eine aktive Session: "${currentSessionDesc}". Möchten Sie diese zuerst beenden?`);
                if (confirmClose) {
                    await handleSessionComplete(currentSession.id, {});
                } else {
                    return; // Benutzer möchte nicht beenden - neue Session wird nicht erstellt
                }
            }
            const sessionData = {
                user_id: 1,
                taetigkeit: newSession.taetigkeit || "",
                category: newSession.category || "development",
                priority: newSession.priority || "medium",
                project_id: newSession.project_id,
                order_id: newSession.order_id,
                task_id: newSession.task_id,
                problem: newSession.problem || false,
                status: "active"
            };
            const response = await fetch("/api/admin/time-tracking/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            });
            if (response.ok) {
                const result = await response.json();
                // Prüfe ob eine bestehende Session zurückgegeben wurde (Status 200)
                if (result.message && result.message === "Aktive Session existiert bereits") {
                    const existingProject = projects.find((p)=>p.id === result.session.project_id);
                    const existingTask = tasks.find((t)=>t.id === result.session.task_id);
                    const existingDesc = existingProject && existingTask ? `${existingProject.project_name || existingProject.name} - ${existingTask.task_title || existingTask.title}: ${result.session.taetigkeit}` : result.session.taetigkeit || result.session.module;
                    alert(`⚠️ Es existiert bereits eine aktive Session: "${existingDesc}". Bitte beenden Sie diese zuerst.`);
                    setCurrentSession(result.session);
                    setShowAddForm(false);
                    await loadData();
                    return;
                }
                // Neue Session wurde erstellt (Status 201)
                const createdSession = result;
                setCurrentSession(createdSession);
                setShowAddForm(false);
                // Formular zurücksetzen
                setNewSession({
                    module: "",
                    taetigkeit: "",
                    category: "development",
                    priority: "medium",
                    project_id: undefined,
                    order_id: undefined,
                    task_id: undefined,
                    problem: false
                });
                // Daten neu laden
                await loadData();
                // Erfolg loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", `Session gestartet: ${sessionData.module}`, "User-Action");
            } else {
                const error = await response.json();
                setError(error.error || "Fehler beim Starten der Session");
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Session starten fehlgeschlagen", "API-Call", error.error);
            }
        } catch (error) {
            console.error("❌ Fehler beim Starten der Session:", error);
            setError(error instanceof Error ? error.message : "Fehler beim Starten der Session");
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Session starten fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
        }
    };
    const handleSessionComplete = async (sessionId, completionData)=>{
        try {
            const response = await fetch(`/api/admin/time-tracking/sessions/${sessionId}/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(completionData)
            });
            if (response.ok) {
                const updatedSession = await response.json();
                // Aktuelle Session aktualisieren
                if (currentSession?.id === sessionId) {
                    setCurrentSession(null);
                }
                // Sessions neu laden
                await loadData();
                // Erfolg loggen
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", `Session ${sessionId} erfolgreich beendet`, "User-Action");
                return updatedSession;
            } else {
                const error = await response.json();
                setError(error.error || "Fehler beim Beenden der Session");
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Session beenden fehlgeschlagen", "API-Call", error.error);
                throw new Error(error.error || "Fehler beim Beenden der Session");
            }
        } catch (error) {
            console.error("❌ Fehler beim Beenden der Session:", error);
            setError(error instanceof Error ? error.message : "Fehler beim Beenden der Session");
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Session beenden fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
        }
    };
    const calculateDuration = (startTime, endTime)=>{
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    };
    const formatDuration = (minutes)=>{
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    };
    const formatDateTime = (dateString)=>{
        return new Date(dateString).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    const getStatusBadge = (status)=>{
        const styles = {
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            interrupted: "bg-red-100 text-red-800"
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`,
            children: status === "active" ? "Aktiv" : status === "completed" ? "Abgeschlossen" : "Unterbrochen"
        }, void 0, false, {
            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
            lineNumber: 466,
            columnNumber: 7
        }, this);
    };
    const getPriorityBadge = (priority)=>{
        const styles = {
            low: "bg-gray-100 text-gray-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800"
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`,
            children: priority === "low" ? "Niedrig" : priority === "medium" ? "Mittel" : "Hoch"
        }, void 0, false, {
            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
            lineNumber: 481,
            columnNumber: 7
        }, this);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 493,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-gray-600",
                        children: "Lade Zeiterfassungsdaten..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 492,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
            lineNumber: 491,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-gray-900 mb-2",
                        children: "⏱️ Zeiterfassung & Projekt-Tracking"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Professionelle Zeitverfolgung für optimale Projektsteuerung"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 503,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex space-x-8",
                    children: [
                        {
                            id: "overview",
                            label: "Übersicht",
                            icon: "📊"
                        },
                        {
                            id: "sessions",
                            label: "Sessions",
                            icon: "⏱️"
                        },
                        {
                            id: "billable",
                            label: "Abrechenbar",
                            icon: "💰"
                        },
                        {
                            id: "analytics",
                            label: "Analytics",
                            icon: "📈"
                        }
                    ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: async ()=>{
                                setActiveTab(tab.id);
                                // Beim Wechsel zum "Abrechenbar" Tab, lade die abrechenbaren Zeiten
                                if (tab.id === "billable") {
                                    setBillableLoading(true);
                                    try {
                                        const response = await fetch("/api/time/entries?approved=true&invoiced=false");
                                        if (response.ok) {
                                            const data = await response.json();
                                            setBillableEntries(data?.data?.items || []);
                                        }
                                    } catch (error) {
                                        console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
                                    } finally{
                                        setBillableLoading(false);
                                    }
                                }
                            },
                            className: `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.icon
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 546,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.label
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 547,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, tab.id, true, {
                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                            lineNumber: 519,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                    lineNumber: 512,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            activeTab === "overview" && stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "⏱️ Live Timer"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 558,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Features$2f$Timer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sessionId: currentSession?.id,
                                onStop: ()=>{
                                    if (currentSession) {
                                        handleSessionComplete(currentSession.id, {});
                                    }
                                },
                                onSessionComplete: (duration)=>{
                                    // Wird nach onStop aufgerufen
                                    console.log(`✅ Session beendet - Dauer: ${duration} Minuten`);
                                },
                                autoStart: !!currentSession
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 557,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-blue-100 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "📊"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 579,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 578,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-600",
                                                    children: "Gesamt-Sessions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: stats.totalSessions
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 581,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 577,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 576,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-green-100 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "⏱️"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 590,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-600",
                                                    children: "Aktive Sessions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: stats.activeSessions
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 595,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 593,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 589,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-purple-100 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "⏰"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 603,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 602,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-600",
                                                    children: "Gesamtzeit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: formatDuration(stats.totalTime)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 605,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 601,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 600,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-orange-100 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "📅"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 616,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-600",
                                                    children: "Heute"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 620,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: formatDuration(stats.todayTime)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 615,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 614,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 575,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Status-Übersicht"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 631,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 bg-green-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Abgeschlossen"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-green-600",
                                                children: stats.statusStats.completed
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 bg-orange-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Aktiv"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 638,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-orange-600",
                                                children: stats.statusStats.active
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 639,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 637,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 bg-red-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Unterbrochen"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 642,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-red-600",
                                                children: stats.statusStats.interrupted
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 641,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 632,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 630,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Performance-Metriken"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 bg-blue-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Erfolgsrate"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 653,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-3xl font-bold text-blue-600",
                                                children: [
                                                    stats.successRate,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 652,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 bg-purple-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Ø Dauer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 657,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-3xl font-bold text-purple-600",
                                                children: formatDuration(stats.avgDuration)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 658,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 656,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 651,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 555,
                columnNumber: 9
            }, this),
            activeTab === "sessions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900",
                                children: "Zeiterfassungs-Sessions"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 672,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-3",
                                children: [
                                    stats && stats.activeSessions > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: async ()=>{
                                            if (confirm(`Möchten Sie wirklich alle ${stats.activeSessions} aktiven Sessions beenden?`)) {
                                                try {
                                                    setLoading(true);
                                                    const response = await fetch("/api/admin/time-tracking/sessions/close-all", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        }
                                                    });
                                                    if (response.ok) {
                                                        const result = await response.json();
                                                        alert(`✅ ${result.message || `${result.closedCount} Sessions erfolgreich beendet`}`);
                                                        // Aktuelle Session zurücksetzen
                                                        setCurrentSession(null);
                                                        // Daten neu laden
                                                        await loadData();
                                                        // Erfolg loggen
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logInteraction("Time-Tracking", `Alle ${result.closedCount} Sessions beendet`, "User-Action");
                                                    } else {
                                                        const error = await response.json();
                                                        setError(error.error || "Fehler beim Beenden aller Sessions");
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Alle Sessions beenden fehlgeschlagen", "API-Call", error.error);
                                                    }
                                                } catch (error) {
                                                    console.error("❌ Fehler beim Beenden aller Sessions:", error);
                                                    setError(error instanceof Error ? error.message : "Fehler beim Beenden aller Sessions");
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ki$2d$action$2d$tracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logError("Time-Tracking", "Alle Sessions beenden fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
                                                } finally{
                                                    setLoading(false);
                                                }
                                            }
                                        },
                                        className: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors",
                                        title: `${stats.activeSessions} offene Sessions beenden`,
                                        children: [
                                            "🔒 Alle beenden (",
                                            stats.activeSessions,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 675,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddForm(!showAddForm),
                                        className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors",
                                        children: showAddForm ? "Abbrechen" : "+ Neue Session"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 717,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 673,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 671,
                        columnNumber: 11
                    }, this),
                    showAddForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Neue Session erstellen"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 729,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: [
                                                    "Projekt ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 734,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 733,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newSession.project_id || "",
                                                onChange: (e)=>{
                                                    const projectId = e.target.value ? parseInt(e.target.value) : undefined;
                                                    setNewSession({
                                                        ...newSession,
                                                        project_id: projectId,
                                                        task_id: undefined
                                                    });
                                                },
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                required: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: projects.length === 0 ? "-- Bitte zuerst Projekt anlegen --" : "-- Projekt auswählen --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 21
                                                    }, this),
                                                    projects.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        disabled: true,
                                                        children: "Keine Projekte verfügbar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 755,
                                                        columnNumber: 23
                                                    }, this) : projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: project.id,
                                                            children: project.project_name || project.name || `Projekt ${project.id}`
                                                        }, project.id, false, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 760,
                                                            columnNumber: 25
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 19
                                            }, this),
                                            projects.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-yellow-800 mb-2",
                                                        children: "⚠️ Keine Projekte verfügbar. Bitte wähle ein Projekt aus oder lege ein neues an."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 768,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowProjectDialog(true),
                                                        className: "w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center",
                                                        children: "➕ Neues Projekt anlegen"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 771,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 767,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 732,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: [
                                                    "Aufgabe ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 783,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newSession.task_id || "",
                                                onChange: (e)=>{
                                                    const taskId = e.target.value ? parseInt(e.target.value) : undefined;
                                                    setNewSession({
                                                        ...newSession,
                                                        task_id: taskId
                                                    });
                                                },
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                required: true,
                                                disabled: !newSession.project_id,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: !newSession.project_id ? "-- Bitte zuerst Projekt auswählen --" : "-- Aufgabe auswählen --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 21
                                                    }, this),
                                                    tasks.filter((task)=>!newSession.project_id || task.project_id === newSession.project_id).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        disabled: true,
                                                        children: !newSession.project_id ? "-- Bitte zuerst Projekt auswählen --" : "Keine Aufgaben für dieses Projekt verfügbar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 25
                                                    }, this) : tasks.filter((task)=>!newSession.project_id || task.project_id === newSession.project_id).map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: task.id,
                                                            children: task.task_title || task.title || `Aufgabe ${task.id}`
                                                        }, task.id, false, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 816,
                                                            columnNumber: 29
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 786,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 782,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: [
                                                    "Tätigkeit ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-red-500",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 826,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newSession.taetigkeit,
                                                onChange: (e)=>{
                                                    setNewSession({
                                                        ...newSession,
                                                        taetigkeit: e.target.value
                                                    });
                                                },
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                placeholder: "z.B. API-Routen testen und validieren",
                                                minLength: 8,
                                                maxLength: 180,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 829,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-xs text-gray-500",
                                                children: "8-180 Zeichen, keine technischen Namen (keine .tsx, Component, etc.)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 844,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 825,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 730,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Kategorie"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 851,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newSession.category,
                                                onChange: (e)=>setNewSession({
                                                        ...newSession,
                                                        category: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "development",
                                                        children: "Entwicklung"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 862,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "bugfix",
                                                        children: "Bugfix"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 863,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "planning",
                                                        children: "Planung"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 864,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "testing",
                                                        children: "Testing"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 865,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "documentation",
                                                        children: "Dokumentation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 866,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 852,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 850,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Priorität"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 870,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newSession.priority,
                                                onChange: (e)=>setNewSession({
                                                        ...newSession,
                                                        priority: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "low",
                                                        children: "Niedrig"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "medium",
                                                        children: "Mittel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 882,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "high",
                                                        children: "Hoch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 883,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 871,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 869,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 849,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex justify-end space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddForm(false),
                                        className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50",
                                        children: "Abbrechen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 888,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            // Pflichtfelder-Validierung
                                            if (!newSession.project_id) {
                                                alert("❌ Bitte Projekt auswählen.");
                                                return;
                                            }
                                            if (!newSession.task_id) {
                                                alert("❌ Bitte Aufgabe auswählen.");
                                                return;
                                            }
                                            if (!newSession.taetigkeit || newSession.taetigkeit.trim().length < 8) {
                                                alert("❌ Bitte Tätigkeit angeben (mindestens 8 Zeichen).");
                                                return;
                                            }
                                            if (newSession.taetigkeit.length > 180) {
                                                alert("❌ Tätigkeit darf maximal 180 Zeichen lang sein.");
                                                return;
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
                                            const hasTechnicalPattern = technicalPatterns.some((pattern)=>pattern.test(newSession.taetigkeit));
                                            if (hasTechnicalPattern) {
                                                alert("❌ Tätigkeit enthält technische Namen. Bitte verwende verständliche Beschreibungen wie 'API-Routen testen' statt 'Component.tsx'.");
                                                return;
                                            }
                                            // Session starten
                                            handleStartSession();
                                        },
                                        disabled: !newSession.project_id || !newSession.task_id || !newSession.taetigkeit || newSession.taetigkeit.trim().length < 8 || newSession.taetigkeit.length > 180,
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: "Session starten"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 894,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 887,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 728,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Aktuelle Sessions"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 953,
                                columnNumber: 13
                            }, this),
                            sessions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-center py-8",
                                children: "Keine Sessions vorhanden"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 955,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: sessions.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((session)=>{
                                    // Projekt und Aufgabe aus sessions laden (falls verfügbar)
                                    const project = projects.find((p)=>p.id === session.project_id);
                                    const task = tasks.find((t)=>t.id === session.task_id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-gray-200 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            project && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-medium text-gray-500",
                                                                        children: "Projekt:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 974,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-semibold text-gray-900",
                                                                        children: project.project_name || project.name || `Projekt ${session.project_id}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 975,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 973,
                                                                columnNumber: 31
                                                            }, this),
                                                            task && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-medium text-gray-500",
                                                                        children: "Aufgabe:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 983,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-semibold text-gray-900",
                                                                        children: task.task_title || task.title || `Aufgabe ${session.task_id}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 984,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 982,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-medium text-gray-500",
                                                                        children: "Tätigkeit:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 991,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm text-gray-700",
                                                                        children: session.taetigkeit
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                        lineNumber: 992,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 990,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 970,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-2 ml-4",
                                                        children: [
                                                            getStatusBadge(session.status),
                                                            getPriorityBadge(session.priority)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 995,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 969,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Start:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 1003,
                                                                columnNumber: 27
                                                            }, this),
                                                            " ",
                                                            formatDateTime(session.start_time)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1002,
                                                        columnNumber: 25
                                                    }, this),
                                                    session.end_time && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Ende:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 1008,
                                                                columnNumber: 29
                                                            }, this),
                                                            " ",
                                                            formatDateTime(session.end_time)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1007,
                                                        columnNumber: 27
                                                    }, this),
                                                    session.duration_minutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Dauer:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                lineNumber: 1014,
                                                                columnNumber: 29
                                                            }, this),
                                                            " ",
                                                            formatDuration(session.duration_minutes)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1013,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1001,
                                                columnNumber: 23
                                            }, this),
                                            session.ausloeser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Auslöser:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 27
                                                    }, this),
                                                    " ",
                                                    session.ausloeser
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1021,
                                                columnNumber: 25
                                            }, this),
                                            session.problem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-red-600 mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Problem:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1028,
                                                        columnNumber: 27
                                                    }, this),
                                                    " ",
                                                    session.problem
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1027,
                                                columnNumber: 25
                                            }, this),
                                            session.status === "active" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSessionComplete(session.id, {}),
                                                    className: "px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700",
                                                    children: "Abschließen"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1034,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1033,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, session.id, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 968,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 957,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 952,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 669,
                columnNumber: 9
            }, this),
            activeTab === "billable" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900",
                                children: "💰 Abrechenbare Zeiten"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1055,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    setBillableLoading(true);
                                    try {
                                        const response = await fetch("/api/time/entries?approved=true&invoiced=false");
                                        if (response.ok) {
                                            const data = await response.json();
                                            setBillableEntries(data?.data?.items || []);
                                        } else {
                                            setError("Fehler beim Laden der abrechenbaren Zeiten");
                                        }
                                    } catch (error) {
                                        console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
                                        setError("Fehler beim Laden der abrechenbaren Zeiten");
                                    } finally{
                                        setBillableLoading(false);
                                    }
                                },
                                className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🔄"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1076,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Aktualisieren"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1077,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1056,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1054,
                        columnNumber: 11
                    }, this),
                    billableLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1083,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-gray-600",
                                children: "Lade abrechenbare Zeiten..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1084,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1082,
                        columnNumber: 13
                    }, this) : billableEntries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-center py-8",
                            children: "Keine abrechenbaren Zeiten gefunden. (Status: completed, approved=1, invoiced=0)"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                            lineNumber: 1088,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1087,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: [
                                            "Abrechenbare Zeiteinträge (",
                                            billableEntries.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1095,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: [
                                            "Gesamt: ",
                                            billableEntries.reduce((sum, e)=>sum + (e.duration_minutes || 0), 0),
                                            " Min (",
                                            Math.round(billableEntries.reduce((sum, e)=>sum + (e.duration_minutes || 0), 0) / 60 * 100) / 100,
                                            " Std)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1098,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1094,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: billableEntries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-gray-900 mb-2",
                                                            children: entry.project_name && entry.task_title && entry.taetigkeit ? `Projekt: ${entry.project_name} – Aufgabe: ${entry.task_title} — ${entry.taetigkeit}` : entry.taetigkeit || entry.module
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 1112,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 text-sm text-gray-600 space-y-1",
                                                            children: [
                                                                entry.project_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Projekt:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                            lineNumber: 1120,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " ",
                                                                        entry.project_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1119,
                                                                    columnNumber: 29
                                                                }, this),
                                                                entry.task_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Aufgabe:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                            lineNumber: 1125,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " ",
                                                                        entry.task_title
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1124,
                                                                    columnNumber: 29
                                                                }, this),
                                                                entry.taetigkeit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Tätigkeit:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                            lineNumber: 1130,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " ",
                                                                        entry.taetigkeit
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1129,
                                                                    columnNumber: 29
                                                                }, this),
                                                                entry.order_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Auftrag:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                            lineNumber: 1135,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " ",
                                                                        entry.order_number
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1134,
                                                                    columnNumber: 29
                                                                }, this),
                                                                entry.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Kategorie:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                            lineNumber: 1140,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " ",
                                                                        entry.category
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1139,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 1117,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1110,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-right ml-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-bold text-green-600",
                                                            children: formatDuration(entry.duration_minutes || 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 1146,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-600 mt-1",
                                                            children: formatDateTime(entry.start_time)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 1149,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 flex space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium",
                                                                    children: "✅ Freigegeben"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1153,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium",
                                                                    children: "💰 Offen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                                    lineNumber: 1156,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                            lineNumber: 1152,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1145,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 21
                                        }, this)
                                    }, entry.id, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1105,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1103,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1093,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 1053,
                columnNumber: 9
            }, this),
            activeTab === "analytics" && stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900",
                                children: "Detaillierte Analytics"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1174,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/admin/time-tracking/analytics",
                                className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "📊"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1179,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Vollständige Analytics öffnen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1180,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1175,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1173,
                        columnNumber: 11
                    }, this),
                    Object.keys(stats.moduleStats).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Zeitintensivste Module"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1187,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: Object.entries(stats.moduleStats).sort(([, a], [, b])=>b - a).slice(0, 5).map(([module, minutes])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center p-2 bg-blue-50 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-700",
                                                children: module
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1197,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-blue-600",
                                                children: formatDuration(minutes)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1198,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, module, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1193,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1188,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1186,
                        columnNumber: 13
                    }, this),
                    Object.keys(stats.problemStats).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Häufigste Probleme"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1208,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: Object.entries(stats.problemStats).sort(([, a], [, b])=>b - a).slice(0, 5).map(([problem, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center p-2 bg-red-50 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-700",
                                                children: problem
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1218,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-red-600",
                                                children: [
                                                    count,
                                                    "x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1219,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, problem, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1214,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1209,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1207,
                        columnNumber: 13
                    }, this),
                    Object.keys(stats.categoryStats).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Zeitverteilung nach Kategorien"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1229,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: Object.entries(stats.categoryStats).sort(([, a], [, b])=>b - a).map(([category, minutes])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center p-2 bg-purple-50 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-700 capitalize",
                                                children: category
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1238,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-purple-600",
                                                children: formatDuration(minutes)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1239,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, category, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1234,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1230,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1228,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6 bg-gradient-to-r from-blue-50 to-purple-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "🚀 Erweiterte Analytics verfügbar"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1250,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-white rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "📅"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1253,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium mt-1",
                                                children: "Tagesübersicht"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1254,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600",
                                                children: "Alle Sessions des Tages"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1255,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-white rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "📈"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium mt-1",
                                                children: "Wochenübersicht"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1259,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600",
                                                children: "Balkendiagramm pro Wochentag"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1260,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-white rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "🔍"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1263,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium mt-1",
                                                children: "Filterbar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1264,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600",
                                                children: "Nach Benutzer, Zeitraum, Projekt"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                lineNumber: 1265,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                        lineNumber: 1262,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1251,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/admin/time-tracking/analytics",
                                    className: "inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1273,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Vollständige Analytics öffnen"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1274,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1269,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                lineNumber: 1268,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                        lineNumber: 1249,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 1172,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: showProjectDialog,
                onClose: ()=>setShowProjectDialog(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: "➕ Neues Projekt anlegen"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                            lineNumber: 1284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-2",
                                            children: [
                                                "Kunde ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-500",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1289,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1288,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: newProject.customer_id,
                                            onChange: (e)=>setNewProject({
                                                    ...newProject,
                                                    customer_id: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            required: true,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Kunde auswählen --"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1299,
                                                    columnNumber: 17
                                                }, this),
                                                customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: customer.id,
                                                        children: customer.company_name || customer.name || `Kunde ${customer.id}`
                                                    }, customer.id, false, {
                                                        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                        lineNumber: 1301,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1291,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1287,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-2",
                                            children: [
                                                "Projektname ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-500",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1310,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1309,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newProject.project_name,
                                            onChange: (e)=>setNewProject({
                                                    ...newProject,
                                                    project_name: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            placeholder: "z.B. Lopez IT Welt",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1312,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1308,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-2",
                                            children: "Projektcode (optional)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1325,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newProject.project_code,
                                            onChange: (e)=>setNewProject({
                                                    ...newProject,
                                                    project_code: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            placeholder: "z.B. LITW-001"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1328,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1324,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-2",
                                            children: "Beschreibung (optional)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1340,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: newProject.description,
                                            onChange: (e)=>setNewProject({
                                                    ...newProject,
                                                    description: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            rows: 3,
                                            placeholder: "Beschreibung des Projekts"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1343,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1339,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                                    children: "Startdatum (optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1356,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: newProject.start_date,
                                                    onChange: (e)=>setNewProject({
                                                            ...newProject,
                                                            start_date: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1359,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1355,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                                    children: "Enddatum (optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1370,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: newProject.end_date,
                                                    onChange: (e)=>setNewProject({
                                                            ...newProject,
                                                            end_date: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                                    lineNumber: 1373,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                            lineNumber: 1369,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1354,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                            lineNumber: 1286,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 flex justify-end space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowProjectDialog(false),
                                    className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50",
                                    children: "Abbrechen"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1386,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: async ()=>{
                                        if (!newProject.customer_id || !newProject.project_name) {
                                            alert("❌ Bitte Kunde und Projektname angeben.");
                                            return;
                                        }
                                        try {
                                            const response = await fetch("/api/projects", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    customer_id: parseInt(newProject.customer_id),
                                                    project_name: newProject.project_name,
                                                    project_code: newProject.project_code || null,
                                                    description: newProject.description || null,
                                                    start_date: newProject.start_date || null,
                                                    end_date: newProject.end_date || null,
                                                    status: newProject.status,
                                                    created_by: 1
                                                })
                                            });
                                            if (response.ok) {
                                                const result = await response.json();
                                                // Projekte neu laden
                                                await loadProjectsOrdersTasks();
                                                // Dialog schließen
                                                setShowProjectDialog(false);
                                                // Projekt automatisch auswählen
                                                if (result.data?.id) {
                                                    setNewSession({
                                                        ...newSession,
                                                        project_id: result.data.id
                                                    });
                                                }
                                                // Formular zurücksetzen
                                                setNewProject({
                                                    customer_id: customers.length > 0 ? customers[0].id.toString() : "",
                                                    project_name: "",
                                                    project_code: "",
                                                    description: "",
                                                    start_date: "",
                                                    end_date: "",
                                                    status: "open"
                                                });
                                                alert("✅ Projekt erfolgreich erstellt und ausgewählt!");
                                            } else {
                                                const error = await response.json();
                                                alert(`❌ Fehler: ${error.error || "Projekt konnte nicht erstellt werden"}`);
                                            }
                                        } catch (error) {
                                            console.error("❌ Fehler beim Erstellen des Projekts:", error);
                                            alert("❌ Fehler beim Erstellen des Projekts.");
                                        }
                                    },
                                    disabled: !newProject.customer_id || !newProject.project_name,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Projekt anlegen"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                                    lineNumber: 1392,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                            lineNumber: 1385,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                    lineNumber: 1283,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/time-tracking/page.tsx",
                lineNumber: 1282,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/time-tracking/page.tsx",
        lineNumber: 501,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_621a1cb3._.js.map