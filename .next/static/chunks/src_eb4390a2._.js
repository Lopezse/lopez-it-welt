(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/admin/LinkedInIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LinkedInIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
"use client";
;
;
function LinkedInIcon(param) {
    let { className = "" } = param;
    // Extrahiere Größe aus className (z.B. "h-4 w-4" -> 16px, "h-5 w-5" -> 20px)
    const getSize = ()=>{
        if (className.includes("h-4") || className.includes("w-4")) return 16;
        if (className.includes("h-5") || className.includes("w-5")) return 20;
        return 20; // Default
    };
    const size = getSize();
    // Entferne Größen-Klassen, da wir width/height direkt setzen
    const cleanedClassName = className.replace(/\b(h-\d+|w-\d+)\b/g, "").trim();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "inline-flex items-center justify-center ".concat(cleanedClassName),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/LinkedIn_icon.svg.webp",
            alt: "LinkedIn",
            width: size,
            height: size,
            className: "rounded"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/LinkedInIcon.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/LinkedInIcon.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = LinkedInIcon;
var _c;
__turbopack_context__.k.register(_c, "LinkedInIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminNavigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$LinkedInIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/LinkedInIcon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Icon-Map für dynamisches Laden
const iconMap = {
    FaHome: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaHome"],
    FaFileAlt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
    FaUsers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
    FaShieldAlt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"],
    FaCog: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCog"],
    FaBell: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBell"],
    FaProjectDiagram: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaProjectDiagram"],
    FaTools: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTools"],
    FaBook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBook"],
    FaChartLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartLine"],
    FaDatabase: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDatabase"],
    FaEnvelope: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEnvelope"],
    FaTicketAlt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTicketAlt"],
    FaListAlt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaListAlt"],
    FaHistory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaHistory"],
    FaStickyNote: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaStickyNote"],
    FaCheckSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckSquare"],
    FaCheckCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"],
    FaPlus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlus"],
    FaCalendarAlt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"],
    FaCogs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCogs"],
    FaFileInvoice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileInvoice"],
    FaClock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"],
    FaLayerGroup: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLayerGroup"],
    FaRobot: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaRobot"],
    LinkedInIcon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$LinkedInIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
// Enterprise++ Navigation Structure (IBM Carbon / SAP Fiori Style)
// 6 Hauptkategorien mit automatisch gruppierten Unterpunkten
// Jeder Eintrag hat eine requiredPermission für RBAC-Kontrolle
const enterpriseNavigation = [
    // 1. Dashboard
    {
        name: "Dashboard",
        href: "/admin",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaHome"],
        requiredPermission: "admin.dashboard.view",
        subItems: []
    },
    // 2. Operations
    {
        name: "Operations",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCogs"],
        requiredPermission: "admin.operations.view",
        subItems: [
            {
                name: "Monitoring",
                href: "/admin/monitoring",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartLine"],
                requiredPermission: "admin.operations.monitoring.view"
            },
            {
                name: "Logs",
                href: "/admin/logs",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
                requiredPermission: "admin.operations.logs.view"
            },
            {
                name: "Unified Ops",
                href: "/admin/uoc",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaProjectDiagram"],
                requiredPermission: "admin.operations.view"
            },
            {
                name: "Backups",
                href: "/admin/backup",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDatabase"],
                requiredPermission: "admin.operations.backups.view"
            },
            {
                name: "System Status",
                href: "/admin/monitoring/system",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExclamationTriangle"],
                requiredPermission: "admin.operations.monitoring.view"
            }
        ]
    },
    // 3. Kunden & Projekte
    {
        name: "Kunden & Projekte",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
        requiredPermission: "admin.customers.view",
        subItems: [
            {
                name: "Kundenliste",
                href: "/admin/customers",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
                requiredPermission: "admin.customers.view"
            },
            {
                name: "Neuer Kunde",
                href: "/admin/customers/new",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlus"],
                requiredPermission: "admin.customers.create"
            },
            {
                name: "Projekte",
                href: "/admin/office/projects",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaProjectDiagram"],
                requiredPermission: "admin.projects.view"
            },
            {
                name: "Neues Projekt",
                href: "/admin/office/projects/new",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlus"],
                requiredPermission: "admin.projects.create"
            },
            {
                name: "Support Tickets",
                href: "/admin/support",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTicketAlt"],
                badge: "7",
                badgeColor: "bg-red-500",
                requiredPermission: "admin.tickets.view"
            },
            {
                name: "Kontakt-Nachrichten",
                href: "/admin/support/contact-messages",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEnvelope"],
                dynamicBadge: true,
                badgeApiEndpoint: "/api/admin/contact-messages/stats",
                requiredPermission: "admin.tickets.view"
            }
        ]
    },
    // 4. Inhalte & Medien
    {
        name: "Inhalte & Medien",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
        requiredPermission: "admin.content.view",
        subItems: [
            {
                name: "Seitenverwaltung",
                href: "/admin/content/pages",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
                requiredPermission: "admin.content.view"
            },
            {
                name: "Header & Footer",
                href: "/admin/content/header-footer",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCog"],
                requiredPermission: "admin.content.edit"
            },
            {
                name: "Medien-Upload",
                href: "/admin/content/media",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDatabase"],
                requiredPermission: "admin.media.view"
            },
            {
                name: "Media-KI Dashboard",
                href: "/admin/media/ai/dashboard",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartLine"],
                requiredPermission: "admin.media.ai.view"
            },
            {
                name: "Blog-Artikel",
                href: "/admin/marketing/blog",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
                requiredPermission: "admin.marketing.view"
            },
            {
                name: "News & Updates",
                href: "/admin/marketing/news",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBell"],
                requiredPermission: "admin.marketing.view"
            },
            {
                name: "SEO & Meta-Tags",
                href: "/admin/marketing/seo",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartLine"],
                requiredPermission: "admin.marketing.edit"
            }
        ]
    },
    // 5. Finanzen
    {
        name: "Finanzen",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileInvoice"],
        requiredPermission: "admin.finance.view",
        subItems: [
            {
                name: "Rechnungen",
                href: "/admin/office/invoices",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileInvoice"],
                requiredPermission: "admin.finance.invoices.view"
            },
            {
                name: "Umsatz-Reports",
                href: "/admin/reports/revenue",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartLine"],
                requiredPermission: "admin.finance.reports.view"
            },
            {
                name: "Zeiterfassung",
                href: "/admin/time-tracking",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"],
                requiredPermission: "admin.finance.view"
            },
            {
                name: "E-Rechnung",
                href: "/admin/office/einvoice",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileCode"],
                requiredPermission: "admin.finance.invoices.view"
            },
            {
                name: "Lohnbuchhaltung",
                href: "/admin/office/payroll",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
                requiredPermission: "admin.finance.payroll.view"
            }
        ]
    },
    // 6. AI Center (Enterprise++ KI-Zentrale)
    {
        name: "AI Center",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBrain"],
        requiredPermission: "admin.ai.view",
        subItems: [
            {
                name: "Übersicht",
                href: "/admin/ai",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBrain"],
                requiredPermission: "admin.ai.view"
            },
            {
                name: "Projekt-Analyzer",
                href: "/admin/ai/project-analyzer",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"],
                requiredPermission: "admin.ai.view"
            },
            {
                name: "Entwicklungsaufträge",
                href: "/admin/ai/dev-tasks",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClipboardList"],
                requiredPermission: "admin.ai.view"
            },
            {
                name: "Executive Reports",
                href: "/admin/ai/reports",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"],
                requiredPermission: "admin.ai.reports.view"
            },
            {
                name: "Customer Insights",
                href: "/admin/customers",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
                requiredPermission: "admin.ai.customers.view"
            }
        ]
    },
    // 7. Agent-System (Enterprise++ PLAN • BUILD • RUN)
    {
        name: "Agent-System",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaRobot"],
        requiredPermission: "admin.system.agents.view",
        subItems: [
            {
                name: "Module & Fortschritt",
                href: "/admin/agent-system",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLayerGroup"],
                requiredPermission: "admin.system.agents.view"
            },
            {
                name: "Go-Live Check",
                href: "/admin/agent-system",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"],
                requiredPermission: "admin.system.agents.view"
            },
            {
                name: "Risiko-Analyse",
                href: "/admin/agent-system",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaExclamationTriangle"],
                requiredPermission: "admin.system.agents.view"
            }
        ]
    },
    // 7. System & Sicherheit
    {
        name: "System & Sicherheit",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"],
        requiredPermission: "admin.system.view",
        subItems: [
            {
                name: "Compliance",
                href: "/admin/compliance/dsgvo",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"],
                requiredPermission: "admin.system.compliance.view"
            },
            {
                name: "Rollen & Rechte",
                href: "/admin/roles",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"],
                requiredPermission: "admin.system.roles.view"
            },
            {
                name: "Admin-Privilegien",
                href: "/admin/privileges",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"],
                requiredPermission: "admin.system.privileges.view"
            },
            {
                name: "Orchestrator",
                href: "/admin/orchestrator",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCogs"],
                requiredPermission: "admin.system.orchestrator.view"
            },
            {
                name: "Navigation",
                href: "/admin/navigation",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaProjectDiagram"],
                requiredPermission: "admin.system.navigation.edit"
            },
            {
                name: "Audit-Logs",
                href: "/admin/audit-logs",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaHistory"],
                dynamicBadge: true,
                badgeApiEndpoint: "/api/admin/audit-logs/count",
                badgeColor: "bg-red-500",
                requiredPermission: "admin.system.audit.view"
            },
            {
                name: "Qualitäts-Dashboard",
                href: "/admin/quality",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckCircle"],
                requiredPermission: "admin.system.view"
            },
            {
                name: "Module Registry",
                href: "/admin/system/modules",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLayerGroup"],
                requiredPermission: "admin.system.modules.view"
            },
            {
                name: "Einstellungen",
                href: "/admin/settings",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCog"],
                requiredPermission: "admin.settings.view"
            }
        ]
    }
];
// Fallback-Navigation (wird verwendet, wenn API fehlschlägt)
const fallbackNavigation = enterpriseNavigation;
function AdminNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [expandedItems, setExpandedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isMobileOpen, setIsMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [navigation, setNavigation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(fallbackNavigation);
    const [loadingNavigation, setLoadingNavigation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contactStats, setContactStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        new_messages: 0,
        urgent: 0
    });
    const [dynamicBadges, setDynamicBadges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Enterprise++ RBAC State
    // WICHTIG: isSuperAdmin startet mit true für Entwicklung (alle Menüs sichtbar)
    const [userPermissions, setUserPermissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSuperAdmin, setIsSuperAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Default: true für Entwicklung
    const [permissionsLoaded, setPermissionsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Enterprise++ RBAC: Load user permissions
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const loadPermissions = {
                "AdminNavigation.useEffect.loadPermissions": async ()=>{
                    try {
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        const response = await fetch("/api/auth/permissions", {
                            headers: token ? {
                                Authorization: "Bearer ".concat(token)
                            } : {},
                            credentials: "include"
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success && data.data) {
                                setUserPermissions(data.data.permissions || []);
                                var _data_data_isSuperAdmin;
                                // Wenn API erfolgreich, verwende tatsächlichen isSuperAdmin-Wert
                                setIsSuperAdmin((_data_data_isSuperAdmin = data.data.isSuperAdmin) !== null && _data_data_isSuperAdmin !== void 0 ? _data_data_isSuperAdmin : true);
                            } else {
                                // API Fehler aber Response ok → Fallback
                                setIsSuperAdmin(true);
                            }
                        } else {
                            // Response nicht ok → Fallback für Entwicklung
                            console.warn("Permissions API nicht verfügbar, verwende Super Admin Fallback");
                            setIsSuperAdmin(true);
                        }
                    } catch (error) {
                        console.warn("Permissions konnten nicht geladen werden, verwende Super Admin Fallback");
                        // Fallback für Entwicklung: Super Admin (alle Menüs sichtbar)
                        setUserPermissions([]);
                        setIsSuperAdmin(true);
                    } finally{
                        setPermissionsLoaded(true);
                    }
                }
            }["AdminNavigation.useEffect.loadPermissions"];
            loadPermissions();
        }
    }["AdminNavigation.useEffect"], []);
    // Enterprise++ RBAC: Check if user has permission
    const hasPermission = (requiredPermission)=>{
        // Kein Permission erforderlich → immer sichtbar
        if (!requiredPermission) return true;
        // Super Admin → alles sichtbar
        if (isSuperAdmin) return true;
        // Permissions noch nicht geladen → sichtbar (wird nach Laden gefiltert)
        if (!permissionsLoaded) return true;
        // Prüfe ob Permission vorhanden
        return userPermissions.includes(requiredPermission);
    };
    // Enterprise++ RBAC: Filter navigation based on permissions
    const filterNavigationByPermissions = (navItems)=>{
        // Wenn Super Admin → alle Items anzeigen ohne Filterung
        if (isSuperAdmin) {
            return navItems;
        }
        return navItems.filter((item)=>hasPermission(item.requiredPermission)).map((item)=>{
            var _item_subItems;
            return {
                ...item,
                subItems: (_item_subItems = item.subItems) === null || _item_subItems === void 0 ? void 0 : _item_subItems.filter((subItem)=>hasPermission(subItem.requiredPermission))
            };
        }).filter((item)=>!item.subItems || item.subItems.length > 0 || item.href);
    };
    // Load navigation from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const loadNavigation = {
                "AdminNavigation.useEffect.loadNavigation": async ()=>{
                    try {
                        const response = await fetch("/api/admin/navigation", {
                            cache: "no-store"
                        });
                        if (!response.ok) {
                            console.warn("Navigation API fehlgeschlagen, verwende Fallback");
                            return;
                        }
                        const data = await response.json();
                        if (!data || !Array.isArray(data) || data.length === 0) {
                            console.warn("Navigation API gab leere Daten zurück, behalte Fallback");
                            return;
                        }
                        // Transform database data to NavItem format
                        const transformedNavigation = data.map({
                            "AdminNavigation.useEffect.loadNavigation.transformedNavigation": (item)=>{
                                const icon = iconMap[item.icon_name] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"];
                                const subItems = (item.subItems || []).map({
                                    "AdminNavigation.useEffect.loadNavigation.transformedNavigation.subItems": (subItem)=>{
                                        const subIcon = iconMap[subItem.icon_name] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"];
                                        return {
                                            id: subItem.id,
                                            name: subItem.name,
                                            href: subItem.href,
                                            icon: subIcon,
                                            badge: subItem.badge_text,
                                            badgeColor: subItem.badge_color,
                                            dynamicBadge: subItem.dynamic_badge,
                                            badgeApiEndpoint: subItem.badge_api_endpoint
                                        };
                                    }
                                }["AdminNavigation.useEffect.loadNavigation.transformedNavigation.subItems"]);
                                return {
                                    id: item.id,
                                    name: item.name,
                                    href: item.href,
                                    icon,
                                    description: item.description,
                                    badge: item.badge_text,
                                    badgeColor: item.badge_color,
                                    dynamicBadge: item.dynamic_badge,
                                    badgeApiEndpoint: item.badge_api_endpoint,
                                    subItems
                                };
                            }
                        }["AdminNavigation.useEffect.loadNavigation.transformedNavigation"]);
                        // Nur aktualisieren, wenn transformierte Navigation nicht leer ist
                        if (transformedNavigation.length > 0) {
                            setNavigation(transformedNavigation);
                        } else {
                            console.warn("Transformierte Navigation ist leer, behalte Fallback");
                        }
                    } catch (error) {
                        console.error("Fehler beim Laden der Navigation:", error);
                    }
                }
            }["AdminNavigation.useEffect.loadNavigation"];
            loadNavigation();
        }
    }["AdminNavigation.useEffect"], []);
    // Load user data for avatar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const loadUserData = {
                "AdminNavigation.useEffect.loadUserData": async ()=>{
                    try {
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        if (!token) {
                            // Fallback-Daten
                            setUserData({
                                name: "Ramiro Lopez Rodriguez",
                                role: "Owner – Lopez IT Welt",
                                initials: "RL"
                            });
                            return;
                        }
                        const response = await fetch("/api/auth/me", {
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            }
                        });
                        if (response.ok) {
                            var _data_data;
                            const data = await response.json();
                            if (data.success && ((_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.user)) {
                                var _data_data_roles;
                                const user = data.data.user;
                                const firstName = user.first_name || "Ramiro";
                                const lastName = user.last_name || "Lopez Rodriguez";
                                setUserData({
                                    name: "".concat(firstName, " ").concat(lastName),
                                    role: ((_data_data_roles = data.data.roles) === null || _data_data_roles === void 0 ? void 0 : _data_data_roles[0]) || "Owner – Lopez IT Welt",
                                    initials: "".concat(firstName.charAt(0)).concat(lastName.charAt(0))
                                });
                            } else {
                                setUserData({
                                    name: "Ramiro Lopez Rodriguez",
                                    role: "Owner – Lopez IT Welt",
                                    initials: "RL"
                                });
                            }
                        } else {
                            setUserData({
                                name: "Ramiro Lopez Rodriguez",
                                role: "Owner – Lopez IT Welt",
                                initials: "RL"
                            });
                        }
                    } catch (error) {
                        console.error("Fehler beim Laden der Benutzer-Daten:", error);
                        setUserData({
                            name: "Ramiro Lopez Rodriguez",
                            role: "Owner – Lopez IT Welt",
                            initials: "RL"
                        });
                    }
                }
            }["AdminNavigation.useEffect.loadUserData"];
            loadUserData();
        }
    }["AdminNavigation.useEffect"], []);
    // Load dynamic badges
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const loadDynamicBadges = {
                "AdminNavigation.useEffect.loadDynamicBadges": async ()=>{
                    const badgesToLoad = [];
                    navigation.forEach({
                        "AdminNavigation.useEffect.loadDynamicBadges": (item)=>{
                            var _item_subItems;
                            if (item.dynamicBadge && item.badgeApiEndpoint) {
                                badgesToLoad.push({
                                    key: "item-".concat(item.id || item.name),
                                    endpoint: item.badgeApiEndpoint
                                });
                            }
                            (_item_subItems = item.subItems) === null || _item_subItems === void 0 ? void 0 : _item_subItems.forEach({
                                "AdminNavigation.useEffect.loadDynamicBadges": (subItem)=>{
                                    if (subItem.dynamicBadge && subItem.badgeApiEndpoint) {
                                        badgesToLoad.push({
                                            key: "subitem-".concat(subItem.id || subItem.name),
                                            endpoint: subItem.badgeApiEndpoint
                                        });
                                    }
                                }
                            }["AdminNavigation.useEffect.loadDynamicBadges"]);
                        }
                    }["AdminNavigation.useEffect.loadDynamicBadges"]);
                    const badgePromises = badgesToLoad.map({
                        "AdminNavigation.useEffect.loadDynamicBadges.badgePromises": async (param)=>{
                            let { key, endpoint } = param;
                            try {
                                const response = await fetch(endpoint, {
                                    cache: "no-store"
                                });
                                if (response.ok) {
                                    var _data_count, _data_total;
                                    const data = await response.json();
                                    return {
                                        key,
                                        value: ((_data_count = data.count) === null || _data_count === void 0 ? void 0 : _data_count.toString()) || ((_data_total = data.total) === null || _data_total === void 0 ? void 0 : _data_total.toString()) || "0"
                                    };
                                }
                            } catch (error) {
                                console.error("Fehler beim Laden des Badges für ".concat(endpoint, ":"), error);
                            }
                            return {
                                key,
                                value: "0"
                            };
                        }
                    }["AdminNavigation.useEffect.loadDynamicBadges.badgePromises"]);
                    const results = await Promise.all(badgePromises);
                    const badgeMap = {};
                    results.forEach({
                        "AdminNavigation.useEffect.loadDynamicBadges": (param)=>{
                            let { key, value } = param;
                            badgeMap[key] = value;
                        }
                    }["AdminNavigation.useEffect.loadDynamicBadges"]);
                    setDynamicBadges(badgeMap);
                }
            }["AdminNavigation.useEffect.loadDynamicBadges"];
            if (!loadingNavigation) {
                loadDynamicBadges();
                const interval = setInterval(loadDynamicBadges, 30000);
                return ({
                    "AdminNavigation.useEffect": ()=>clearInterval(interval)
                })["AdminNavigation.useEffect"];
            }
        }
    }["AdminNavigation.useEffect"], [
        navigation,
        loadingNavigation
    ]);
    // Load sidebar state from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const savedState = localStorage.getItem("admin-sidebar-state");
            if (savedState) {
                const { expandedItems: savedExpanded, collapsed: savedCollapsed } = JSON.parse(savedState);
                setExpandedItems(new Set(savedExpanded));
                setSidebarCollapsed(savedCollapsed);
            }
        }
    }["AdminNavigation.useEffect"], []);
    // Save sidebar state to localStorage
    const saveSidebarState = (expanded, collapsed)=>{
        const state = {
            expandedItems: Array.from(expanded),
            collapsed
        };
        localStorage.setItem("admin-sidebar-state", JSON.stringify(state));
    };
    const toggleExpanded = (itemName)=>{
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemName)) {
            newExpanded.delete(itemName);
        } else {
            newExpanded.add(itemName);
        }
        setExpandedItems(newExpanded);
        saveSidebarState(newExpanded, sidebarCollapsed);
    };
    const toggleSidebar = ()=>{
        const newCollapsed = !sidebarCollapsed;
        setSidebarCollapsed(newCollapsed);
        saveSidebarState(expandedItems, newCollapsed);
    };
    // Load contact stats for badge updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminNavigation.useEffect": ()=>{
            const loadContactStats = {
                "AdminNavigation.useEffect.loadContactStats": async ()=>{
                    try {
                        const response = await fetch("/api/admin/contact-messages/stats", {
                            cache: "no-store"
                        });
                        if (!response.ok) {
                            setContactStats({
                                new_messages: 0,
                                urgent: 0
                            });
                            return;
                        }
                        const data = await response.json();
                        if (data.success) {
                            var _data_stats, _data_stats1;
                            setContactStats({
                                new_messages: ((_data_stats = data.stats) === null || _data_stats === void 0 ? void 0 : _data_stats.new_messages) || 0,
                                urgent: ((_data_stats1 = data.stats) === null || _data_stats1 === void 0 ? void 0 : _data_stats1.urgent) || 0
                            });
                        } else {
                            setContactStats({
                                new_messages: 0,
                                urgent: 0
                            });
                        }
                    } catch (error) {
                        console.error("Fehler beim Laden der Kontakt-Statistiken:", error);
                        setContactStats({
                            new_messages: 0,
                            urgent: 0
                        });
                    }
                }
            }["AdminNavigation.useEffect.loadContactStats"];
            loadContactStats();
            const interval = setInterval(loadContactStats, 30000);
            return ({
                "AdminNavigation.useEffect": ()=>clearInterval(interval)
            })["AdminNavigation.useEffect"];
        }
    }["AdminNavigation.useEffect"], []);
    const isItemActive = (item)=>{
        if (item.href && pathname === item.href) return true;
        if (item.subItems) {
            return item.subItems.some((subItem)=>pathname === subItem.href);
        }
        return false;
    };
    const isSubItemActive = (subItem)=>{
        return pathname === subItem.href;
    };
    const handleLogout = async ()=>{
        try {
            // Admin-Logout über API (Cookie wird automatisch mitgesendet)
            const response = await fetch("/api/auth/admin/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                console.warn("⚠️ Logout-API-Fehler, aber Logout wird fortgesetzt");
            }
            // Alle lokalen Storage-Daten löschen
            localStorage.removeItem("token");
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("adm_token");
            localStorage.removeItem("adm_session");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("sessionToken");
            sessionStorage.removeItem("adm_token");
            sessionStorage.removeItem("adm_session");
            // Zur Admin-Login-Seite weiterleiten
            router.push("/admin/login");
        } catch (error) {
            console.error("❌ Fehler beim Logout:", error);
            // Auch bei Fehler: Lokale Daten löschen und weiterleiten
            localStorage.clear();
            sessionStorage.clear();
            router.push("/admin/login");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden border-b px-4 py-3",
                style: {
                    backgroundColor: "#111217",
                    borderColor: "#272a33"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "#c99700"
                                        },
                                        children: "Lopez"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 605,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                            color: "#007bff",
                                            fontWeight: "700",
                                            display: "inline-block"
                                        },
                                        children: "IT Welt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 604,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 603,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsMobileOpen(!isMobileOpen),
                            className: "p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffd700]",
                            style: {
                                color: "#b3b3b3"
                            },
                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = "#1f2329",
                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = "transparent",
                            children: isMobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 628,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBars"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 628,
                                columnNumber: 63
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 621,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                    lineNumber: 602,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                lineNumber: 601,
                columnNumber: 7
            }, this),
            isMobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40",
                onClick: ()=>setIsMobileOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                lineNumber: 635,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "h-screen transition-all duration-300 flex flex-col ".concat(sidebarCollapsed ? "w-16" : "w-64", " ").concat(isMobileOpen ? "fixed inset-y-0 left-0 z-50" : "hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:z-40"),
                style: {
                    backgroundColor: "#111217",
                    borderRight: "1px solid #272a33"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 flex-shrink-0",
                        style: {
                            paddingBottom: "20px"
                        },
                        children: !sidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-base font-semibold truncate",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "#c99700"
                                        },
                                        children: "Lopez"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 652,
                                        columnNumber: 17
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                            color: "#007bff",
                                            fontWeight: "700",
                                            display: "inline-block"
                                        },
                                        children: "IT Welt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 653,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 651,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 650,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg font-semibold",
                                style: {
                                    color: "#c99700"
                                },
                                children: "L"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 670,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 669,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                        lineNumber: 648,
                        columnNumber: 9
                    }, this),
                    !sidebarCollapsed && userData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 flex-shrink-0 border-b",
                        style: {
                            borderColor: "#272a33",
                            paddingTop: "0"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center h-8 w-8 rounded-full font-medium flex-shrink-0",
                                        style: {
                                            backgroundColor: "#1c1f27",
                                            color: "#f4f4f4",
                                            fontSize: "12px"
                                        },
                                        children: userData.initials
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 679,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium truncate",
                                                style: {
                                                    color: "#f4f4f4"
                                                },
                                                children: userData.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                lineNumber: 690,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs truncate",
                                                style: {
                                                    color: "#8a8a8a"
                                                },
                                                children: userData.role
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                lineNumber: 693,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 689,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 678,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push("/admin/settings"),
                                        className: "flex-1 flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]",
                                        style: {
                                            backgroundColor: "transparent",
                                            border: "1px solid #272a33",
                                            color: "#b3b3b3"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.backgroundColor = "#1f2329";
                                            e.currentTarget.style.borderColor = "#3a3d47";
                                            e.currentTarget.style.color = "#f4f4f4";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.backgroundColor = "transparent";
                                            e.currentTarget.style.borderColor = "#272a33";
                                            e.currentTarget.style.color = "#b3b3b3";
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCog"], {
                                                className: "mr-2 flex-shrink-0",
                                                style: {
                                                    width: "16px",
                                                    height: "16px"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                lineNumber: 718,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Einstellungen"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                lineNumber: 719,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 699,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        className: "flex items-center justify-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#da1e28] focus:ring-offset-2 focus:ring-offset-[#111217]",
                                        style: {
                                            backgroundColor: "transparent",
                                            border: "1px solid #272a33",
                                            color: "#da1e28"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.backgroundColor = "#1f2329";
                                            e.currentTarget.style.borderColor = "#3a3d47";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.backgroundColor = "transparent";
                                            e.currentTarget.style.borderColor = "#272a33";
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSignOutAlt"], {
                                            className: "flex-shrink-0",
                                            style: {
                                                width: "16px",
                                                height: "16px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                            lineNumber: 738,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 721,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 698,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                        lineNumber: 677,
                        columnNumber: 11
                    }, this),
                    sidebarCollapsed && userData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 pb-2 flex-shrink-0 border-b",
                        style: {
                            borderColor: "#272a33"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-8 w-8 rounded-full font-medium mx-auto cursor-pointer",
                            style: {
                                backgroundColor: "#1c1f27",
                                color: "#f4f4f4",
                                fontSize: "12px"
                            },
                            onClick: ()=>setSidebarCollapsed(false),
                            children: userData.initials
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 747,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                        lineNumber: 746,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto overflow-x-hidden min-h-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1",
                                children: navigation && navigation.length > 0 ? filterNavigationByPermissions(navigation).map((item)=>{
                                    const isActive = isItemActive(item);
                                    const isExpanded = expandedItems.has(item.name);
                                    const hasSubItems = item.subItems && item.subItems.length > 0;
                                    const Icon = item.icon;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                item.href ? // Direct Link Item (z.B. Dashboard)
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: "group flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                                                    style: isActive ? {
                                                        backgroundColor: "#1f2329",
                                                        color: "#ffd700",
                                                        borderLeft: "3px solid #ffd700"
                                                    } : {
                                                        color: "#b3b3b3"
                                                    },
                                                    onMouseEnter: (e)=>{
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = "#1f2329";
                                                            e.currentTarget.style.color = "#f4f4f4";
                                                        }
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = "transparent";
                                                            e.currentTarget.style.color = "#b3b3b3";
                                                        }
                                                    },
                                                    onClick: ()=>setIsMobileOpen(false),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            className: "flex-shrink-0",
                                                            style: {
                                                                width: "20px",
                                                                height: "20px",
                                                                color: isActive ? "#ffd700" : "#8a8a8a",
                                                                marginRight: sidebarCollapsed ? "0" : "12px"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                            lineNumber: 802,
                                                            columnNumber: 29
                                                        }, this),
                                                        !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate flex-1",
                                                            children: item.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                            lineNumber: 812,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                    lineNumber: 778,
                                                    columnNumber: 27
                                                }, this) : // Accordion Item (mit Sub-Items)
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>toggleExpanded(item.name),
                                                    className: "group w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                                                    style: isActive ? {
                                                        backgroundColor: "#1f2329",
                                                        color: "#ffd700",
                                                        borderLeft: "3px solid #ffd700"
                                                    } : {
                                                        color: "#b3b3b3"
                                                    },
                                                    onMouseEnter: (e)=>{
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = "#1f2329";
                                                            e.currentTarget.style.color = "#f4f4f4";
                                                        }
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = "transparent";
                                                            e.currentTarget.style.color = "#b3b3b3";
                                                        }
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            className: "flex-shrink-0",
                                                            style: {
                                                                width: "20px",
                                                                height: "20px",
                                                                color: isActive ? "#ffd700" : "#8a8a8a",
                                                                marginRight: sidebarCollapsed ? "0" : "12px"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                            lineNumber: 840,
                                                            columnNumber: 29
                                                        }, this),
                                                        !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate flex-1 text-left",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                    lineNumber: 851,
                                                                    columnNumber: 33
                                                                }, this),
                                                                hasSubItems && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "#8a8a8a",
                                                                        marginLeft: "8px"
                                                                    },
                                                                    children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronDown"], {
                                                                        style: {
                                                                            width: "12px",
                                                                            height: "12px"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                        lineNumber: 855,
                                                                        columnNumber: 39
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                        style: {
                                                                            width: "12px",
                                                                            height: "12px"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                        lineNumber: 857,
                                                                        columnNumber: 39
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                    lineNumber: 853,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 27
                                                }, this),
                                                hasSubItems && isExpanded && !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "ml-2 space-y-0.5",
                                                    style: {
                                                        borderLeft: "1px solid #272a33",
                                                        paddingLeft: "8px"
                                                    },
                                                    children: item.subItems.map((subItem)=>{
                                                        const isSubActive = isSubItemActive(subItem);
                                                        const SubIcon = subItem.icon;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: subItem.href,
                                                                className: "group flex items-center px-3 py-2 rounded-md text-sm transition-all duration-150",
                                                                style: isSubActive ? {
                                                                    backgroundColor: "#1f2329",
                                                                    color: "#ffd700"
                                                                } : {
                                                                    color: "#b3b3b3"
                                                                },
                                                                onMouseEnter: (e)=>{
                                                                    if (!isSubActive) {
                                                                        e.currentTarget.style.backgroundColor = "#1f2329";
                                                                        e.currentTarget.style.color = "#f4f4f4";
                                                                    }
                                                                },
                                                                onMouseLeave: (e)=>{
                                                                    if (!isSubActive) {
                                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                                        e.currentTarget.style.color = "#b3b3b3";
                                                                    }
                                                                },
                                                                onClick: ()=>setIsMobileOpen(false),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubIcon, {
                                                                        className: "flex-shrink-0",
                                                                        style: {
                                                                            width: "16px",
                                                                            height: "16px",
                                                                            color: isSubActive ? "#ffd700" : "#8a8a8a",
                                                                            marginRight: "10px"
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                        lineNumber: 898,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate flex-1",
                                                                        children: subItem.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                        lineNumber: 907,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    (subItem.badge || subItem.dynamicBadge && dynamicBadges["subitem-".concat(subItem.id || subItem.name)]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white rounded-full ml-2 flex-shrink-0",
                                                                        style: {
                                                                            backgroundColor: subItem.badgeColor === "bg-red-500" ? "#da1e28" : "#272a33",
                                                                            minWidth: "18px"
                                                                        },
                                                                        children: subItem.dynamicBadge ? dynamicBadges["subitem-".concat(subItem.id || subItem.name)] || subItem.badge || "0" : subItem.badge
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                        lineNumber: 909,
                                                                        columnNumber: 39
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                                lineNumber: 875,
                                                                columnNumber: 35
                                                            }, this)
                                                        }, subItem.name, false, {
                                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                            lineNumber: 874,
                                                            columnNumber: 33
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                                    lineNumber: 868,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                            lineNumber: 775,
                                            columnNumber: 23
                                        }, this)
                                    }, item.name, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 773,
                                        columnNumber: 21
                                    }, this);
                                }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center text-sm py-4",
                                    style: {
                                        color: "#8a8a8a"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Navigation wird geladen..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                        lineNumber: 933,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                    lineNumber: 932,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                                lineNumber: 764,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                            lineNumber: 763,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                        lineNumber: 762,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminNavigation.tsx",
                lineNumber: 642,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AdminNavigation, "ef0NIpvklazB/DtA7W1Wswciwcc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminNavigation;
var _c;
__turbopack_context__.k.register(_c, "AdminNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/UserInfo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function UserInfo() {
    _s();
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showMenu, setShowMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Lade Benutzer-Daten
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserInfo.useEffect": ()=>{
            const loadUserData = {
                "UserInfo.useEffect.loadUserData": async ()=>{
                    try {
                        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                        if (!token) {
                            setLoading(false);
                            return;
                        }
                        const response = await fetch("/api/auth/me", {
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success) {
                                setUserData(data.data);
                            }
                        }
                    } catch (error) {
                        console.error("❌ Fehler beim Laden der Benutzer-Daten:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["UserInfo.useEffect.loadUserData"];
            loadUserData();
        }
    }["UserInfo.useEffect"], []);
    // Schließe Menü bei Klick außerhalb
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserInfo.useEffect": ()=>{
            const handleClickOutside = {
                "UserInfo.useEffect.handleClickOutside": (event)=>{
                    if (menuRef.current && !menuRef.current.contains(event.target)) {
                        setShowMenu(false);
                    }
                }
            }["UserInfo.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "UserInfo.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["UserInfo.useEffect"];
        }
    }["UserInfo.useEffect"], []);
    // Logout-Funktion
    const handleLogout = async ()=>{
        try {
            // Admin-Logout über API (Cookie wird automatisch mitgesendet)
            const response = await fetch("/api/auth/admin/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                console.warn("⚠️ Logout-API-Fehler, aber Logout wird fortgesetzt");
            }
            // Alle lokalen Storage-Daten löschen
            localStorage.removeItem("token");
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("adm_token");
            localStorage.removeItem("adm_session");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("sessionToken");
            sessionStorage.removeItem("adm_token");
            sessionStorage.removeItem("adm_session");
            // Zur Admin-Login-Seite weiterleiten
            router.push("/admin/login");
        } catch (error) {
            console.error("❌ Fehler beim Logout:", error);
            // Auch bei Fehler: Lokale Daten löschen und weiterleiten
            localStorage.clear();
            sessionStorage.clear();
            router.push("/admin/login");
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center space-x-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/UserInfo.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:block",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/UserInfo.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 w-16 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/UserInfo.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/UserInfo.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/UserInfo.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    if (!userData) {
        return null;
    }
    const displayName = "".concat(userData.user.first_name, " ").concat(userData.user.last_name);
    const roleName = userData.roles[0] || "Benutzer";
    const initials = "".concat(userData.user.first_name.charAt(0)).concat(userData.user.last_name.charAt(0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: menuRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowMenu(!showMenu),
                className: "flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white font-bold text-sm",
                            children: initials
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/UserInfo.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:block text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-medium text-gray-900",
                                children: displayName
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500",
                                children: roleName
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 text-gray-500 transition-transform ".concat(showMenu ? "transform rotate-180" : ""),
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/UserInfo.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/UserInfo.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            showMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-b border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white font-bold",
                                            children: initials
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/UserInfo.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-900 truncate",
                                                children: displayName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 truncate",
                                                children: userData.user.email
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-xs text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                className: "w-3 h-3 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "@",
                                                    userData.user.username
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-xs text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {
                                                className: "w-3 h-3 mr-2 ".concat(userData.twoFactor.enabled ? "text-green-500" : "text-gray-400")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "2FA: ",
                                                    userData.twoFactor.enabled ? "Aktiviert" : "Deaktiviert"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 182,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-xs text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"], {
                                                className: "w-3 h-3 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Rolle: ",
                                                    roleName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowMenu(false);
                                    router.push("/admin/profile");
                                },
                                className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, this),
                                    "Mein Konto"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowMenu(false);
                                    router.push("/admin/settings");
                                },
                                className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this),
                                    "Einstellungen"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-gray-100 my-1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSignOutAlt"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this),
                                    "Abmelden"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/UserInfo.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/UserInfo.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/UserInfo.tsx",
                lineNumber: 163,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/UserInfo.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(UserInfo, "e1ZjxH8CSlZEMsMuck3CW6Y78mk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UserInfo;
var _c;
__turbopack_context__.k.register(_c, "UserInfo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminNavigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$UserInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/UserInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function AdminLayout(param) {
    let { children, pageTitle } = param;
    _s();
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // =====================================================
    // ENTERPRISE++ AUTH CHECK
    // =====================================================
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Auth-Check Effect - Enterprise++ mit Server-Validierung
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminLayout.useEffect": ()=>{
            const checkAuth = {
                "AdminLayout.useEffect.checkAuth": async ()=>{
                    var _document_cookie_split_find, _document_cookie_split_find1;
                    // Login-Seite braucht keine Auth-Prüfung
                    if (pathname === "/admin/login" || pathname === "/admin/setup-2fa") {
                        setIsAuthenticated(true);
                        setIsLoading(false);
                        return;
                    }
                    // Token aus Cookie prüfen (Client-seitig)
                    const token = (_document_cookie_split_find = document.cookie.split("; ").find({
                        "AdminLayout.useEffect.checkAuth": (row)=>row.startsWith("adm_token=")
                    }["AdminLayout.useEffect.checkAuth"])) === null || _document_cookie_split_find === void 0 ? void 0 : _document_cookie_split_find.split("=")[1];
                    const sessionToken = (_document_cookie_split_find1 = document.cookie.split("; ").find({
                        "AdminLayout.useEffect.checkAuth": (row)=>row.startsWith("adm_session=")
                    }["AdminLayout.useEffect.checkAuth"])) === null || _document_cookie_split_find1 === void 0 ? void 0 : _document_cookie_split_find1.split("=")[1];
                    // Keine Cookies = direkt zum Login
                    if (!token && !sessionToken) {
                        console.log("🔒 Keine Auth-Tokens gefunden");
                        setIsAuthenticated(false);
                        setIsLoading(false);
                        return;
                    }
                    // Enterprise++ Server-Validierung (DB, Timeout, IP-Check)
                    try {
                        const response = await fetch("/api/auth/check-session", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        const data = await response.json();
                        if (response.ok && data.success) {
                            var _data_user;
                            console.log("✅ Enterprise++ Session gültig:", (_data_user = data.user) === null || _data_user === void 0 ? void 0 : _data_user.username);
                            setIsAuthenticated(true);
                        } else {
                            console.log("🔒 Session ungültig:", data.errorCode || data.message);
                            // Cookies löschen bei ungültiger Session
                            document.cookie = "adm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "adm_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            setIsAuthenticated(false);
                        }
                    } catch (error) {
                        console.error("❌ Session-Check fehlgeschlagen:", error);
                        setIsAuthenticated(false);
                    }
                    setIsLoading(false);
                }
            }["AdminLayout.useEffect.checkAuth"];
            checkAuth();
        }
    }["AdminLayout.useEffect"], [
        pathname
    ]);
    // Redirect zu Login wenn nicht authentifiziert
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminLayout.useEffect": ()=>{
            if (isLoading) return;
            if (!isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/setup-2fa") {
                const redirectUrl = encodeURIComponent(pathname || "/admin");
                router.push("/admin/login?redirect=".concat(redirectUrl));
            }
        }
    }["AdminLayout.useEffect"], [
        isAuthenticated,
        isLoading,
        pathname,
        router
    ]);
    // Client-seitige Zeit-Updates - MUSS vor bedingten returns sein!
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminLayout.useEffect": ()=>{
            const updateTime = {
                "AdminLayout.useEffect.updateTime": ()=>{
                    setCurrentTime(new Date().toLocaleString("de-DE"));
                }
            }["AdminLayout.useEffect.updateTime"];
            // Initial setzen
            updateTime();
            // Jede Sekunde aktualisieren
            const interval = setInterval(updateTime, 1000);
            return ({
                "AdminLayout.useEffect": ()=>clearInterval(interval)
            })["AdminLayout.useEffect"];
        }
    }["AdminLayout.useEffect"], []);
    // Seitentitel dynamisch ermitteln
    const getPageTitle = ()=>{
        if (pageTitle) return pageTitle;
        // Aus Pfad ableiten
        const path = pathname || "";
        if (path === "/admin" || path === "/admin/") return "Dashboard";
        const segments = path.split("/").filter(Boolean);
        if (segments.length >= 2) {
            const lastSegment = segments[segments.length - 1];
            return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
        }
        return "Admin";
    };
    // =====================================================
    // BEDINGTE RETURNS (nach allen Hooks!)
    // =====================================================
    // Loading-State anzeigen während Auth-Check
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                backgroundColor: "#050509"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSpinner"], {
                        className: "animate-spin h-8 w-8 mx-auto mb-4",
                        style: {
                            color: "#ffd700"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "#b3b3b3"
                        },
                        children: "Authentifizierung wird geprüft..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminLayout.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminLayout.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this);
    }
    // Nicht authentifiziert - Zugriff verweigert (während Redirect)
    if (!isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/setup-2fa") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                backgroundColor: "#050509"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-8 rounded-lg",
                style: {
                    backgroundColor: "#111217",
                    borderColor: "#272a33",
                    border: "1px solid"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLock"], {
                        className: "h-12 w-12 mx-auto mb-4",
                        style: {
                            color: "#da1e28"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold mb-2",
                        style: {
                            color: "#f4f4f4"
                        },
                        children: "Zugriff verweigert"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4",
                        style: {
                            color: "#b3b3b3"
                        },
                        children: "Sie müssen sich anmelden, um auf den Admin-Bereich zuzugreifen."
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        style: {
                            color: "#8a8a8a"
                        },
                        children: "Weiterleitung zum Login..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminLayout.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminLayout.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this);
    }
    // =====================================================
    // MAIN LAYOUT (authentifiziert)
    // =====================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen",
        style: {
            backgroundColor: "#050509"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/admin/AdminLayout.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col overflow-hidden lg:ml-64 transition-all duration-300",
                style: {
                    backgroundColor: "#050509"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b",
                        style: {
                            backgroundColor: "#111217",
                            borderColor: "#272a33"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-xl font-semibold",
                                            style: {
                                                color: "#f4f4f4"
                                            },
                                            children: getPageTitle()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 175,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "relative p-2 rounded-lg transition-colors",
                                            style: {
                                                color: "#b3b3b3"
                                            },
                                            onMouseEnter: (e)=>e.currentTarget.style.backgroundColor = "#1f2329",
                                            onMouseLeave: (e)=>e.currentTarget.style.backgroundColor = "transparent",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v6a4 4 0 004 4h6a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.83 1.17z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse",
                                                    style: {
                                                        backgroundColor: "#da1e28"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$UserInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 196,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "border-b px-6 py-3",
                        style: {
                            backgroundColor: "#111217",
                            borderColor: "#272a33"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-3 text-sm",
                            style: {
                                color: "#b3b3b3"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin",
                                    className: "transition-colors hover:text-[#ffd700]",
                                    style: {
                                        color: "#b3b3b3"
                                    },
                                    children: "Admin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M9 5l7 7-7 7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "#f4f4f4"
                                    },
                                    children: getPageTitle()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto",
                        style: {
                            backgroundColor: "#050509"
                        },
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "border-t px-6 py-4",
                        style: {
                            backgroundColor: "#111217",
                            borderColor: "#272a33"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-sm",
                            style: {
                                color: "#b3b3b3"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "© 2025 Lopez IT Welt"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 221,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "•"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Version 1.0.0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 223,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 rounded-full animate-pulse",
                                                            style: {
                                                                backgroundColor: "#24a148"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute -inset-1 rounded-full blur opacity-25 animate-pulse",
                                                            style: {
                                                                backgroundColor: "#24a148"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                            lineNumber: 229,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "System Online"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "•"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 233,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: currentTime || "Lade..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/AdminLayout.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminLayout.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminLayout.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminLayout.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/AdminLayout.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
_s(AdminLayout, "XMXl+Nm/XmrEI6N/HwdtmmP296Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminLayout;
var _c;
__turbopack_context__.k.register(_c, "AdminLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/admin/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Seiten die KEIN Admin-Layout brauchen (kein Sidebar)
const NO_LAYOUT_PAGES = [
    "/admin/login",
    "/admin/setup-2fa"
];
function Layout(param) {
    let { children } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Login und 2FA-Setup: Nur children rendern (kein AdminLayout)
    if (NO_LAYOUT_PAGES.some((page)=>pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(page))) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen",
            style: {
                backgroundColor: "#050509"
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/admin/layout.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this);
    }
    // Alle anderen Admin-Seiten: Mit AdminLayout (Sidebar etc.)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        style: {
            backgroundColor: "#050509"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/admin/layout.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/layout.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(Layout, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_eb4390a2._.js.map