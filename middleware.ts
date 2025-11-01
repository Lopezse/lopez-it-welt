// =====================================================
// NEXT.JS MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Next.js Middleware mit Development Mode
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import {
  apiDevelopmentModeMiddleware,
  developmentModeMiddleware,
} from "./src/middleware/development-mode";
import { rbacApiGuard } from "./src/middleware/rbac-api-guard";

// =====================================================
// MIDDLEWARE CONFIG
// =====================================================

export function middleware(request: NextRequest) {
  // API-Routen
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // RBAC Guard (serverseitige Berechtigungsprüfung)
    const rbacResult = rbacApiGuard(request);
    if (rbacResult) {
      return rbacResult; // Blockiert Anfrage (401/403)
    }

    // Development Mode Middleware
    return apiDevelopmentModeMiddleware(request);
  }

  // Alle anderen Routen
  return developmentModeMiddleware(request);
}

// =====================================================
// MIDDLEWARE CONFIG
// =====================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
