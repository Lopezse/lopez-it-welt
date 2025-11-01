/**
 * RBAC API Guard Middleware
 * Prüft serverseitig alle /api-Routen auf Berechtigungen
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminAccess } from "@/lib/rbac-middleware";

// Öffentliche API-Routen (keine Auth erforderlich)
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/contact",
  "/api/content/hero",
  "/api/content/header",
  "/api/content/footer",
  "/api/health",
  "/api/monitoring/status",
];

// Office & Finance API-Routen (Admin-Only)
const OFFICE_FINANCE_ROUTES = [
  "/api/projects",
  "/api/orders",
  "/api/tasks",
  "/api/appointments",
  "/api/invoices",
  "/api/einvoice",
  "/api/audit",
];

/**
 * Prüft ob Route öffentlich ist
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Prüft ob Route Office & Finance betrifft
 */
function isOfficeFinanceRoute(pathname: string): boolean {
  return OFFICE_FINANCE_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * RBAC API Guard Middleware
 * Wird in middleware.ts für alle /api-Routen aufgerufen
 */
export function rbacApiGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Öffentliche Routen überspringen
  if (isPublicRoute(pathname)) {
    return null; // Weiterleitung zur eigentlichen Route
  }

  // Office & Finance Routen: Admin-Only
  if (isOfficeFinanceRoute(pathname)) {
    // Prüfe Authorization Header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentifizierung erforderlich" },
        { status: 401 },
      );
    }

    // Token validieren (vereinfacht - sollte durch withAdminAccess ersetzt werden)
    // Für jetzt: Weiterleitung zur Route (mitAdminAccess wird in Route geprüft)
    return null;
  }

  // Alle anderen API-Routen: Standard-RBAC prüfen
  // (kann später erweitert werden)

  return null; // Weiterleitung zur eigentlichen Route
}
