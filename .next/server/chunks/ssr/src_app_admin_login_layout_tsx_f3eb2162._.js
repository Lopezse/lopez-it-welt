module.exports = [
"[project]/src/app/admin/login/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// LOGIN LAYOUT - LOPEZ IT WELT
// =====================================================
// Zweck: Separates Layout für Login-Seite OHNE Sidebar
// Status: ✅ ENTERPRISE++ STANDARD
// =====================================================
__turbopack_context__.s([
    "default",
    ()=>LoginLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const metadata = {
    title: "Admin-Login - Lopez IT Welt",
    description: "Sicherer Login für den Administrationsbereich"
};
function LoginLayout({ children }) {
    // Login-Seite hat KEIN AdminLayout (keine Sidebar)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        style: {
            backgroundColor: "#050509"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/admin/login/layout.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_admin_login_layout_tsx_f3eb2162._.js.map