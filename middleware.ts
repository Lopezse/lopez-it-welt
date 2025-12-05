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
import { adminGuard, adminApiGuard } from "./src/middleware/admin-guard";
import { shopGuard, shopApiGuard } from "./src/middleware/shop-guard";
import { publicMediaGuard } from "./src/middleware/public-media-guard";

// =====================================================
// MIDDLEWARE CONFIG
// =====================================================

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public Media Guard (vor allen anderen Checks)
  // Blockiert direkten Zugriff auf alte Media-Pfade
  const mediaGuardResult = await publicMediaGuard(request);
  if (mediaGuardResult) {
    return mediaGuardResult; // Blockiert Anfrage (403)
  }

  // API-Routen
  if (pathname.startsWith("/api/")) {
    // Admin API Guard (vor RBAC)
    const adminApiResult = adminApiGuard(request);
    if (adminApiResult) {
      return adminApiResult; // Blockiert Anfrage (401/403)
    }

    // Shop API Guard
    const shopApiResult = shopApiGuard(request);
    if (shopApiResult) {
      return shopApiResult; // Blockiert Anfrage (401/403)
    }

    // RBAC Guard (nur für /api/admin/* - serverseitige Berechtigungsprüfung)
    if (pathname.startsWith("/api/admin")) {
      const rbacResult = rbacApiGuard(request);
      if (rbacResult) {
        return rbacResult; // Blockiert Anfrage (401/403)
      }
    }

    // Development Mode Middleware
    return apiDevelopmentModeMiddleware(request);
  }

  // Admin-Routen (/admin/*)
  const adminResult = adminGuard(request);
  if (adminResult) {
    return adminResult; // Redirect zu /admin/login
  }

  // Shop-Routen (/account/*, /shop/checkout/*)
  const shopResult = shopGuard(request);
  if (shopResult) {
    return shopResult; // Redirect zu /account/login
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
     * 
     * WICHTIG: /linkedin-posts und /uploads werden explizit erfasst,
     * auch wenn sie technisch unter public/ liegen könnten.
     * Die Middleware blockiert diese Pfade mit der gebrandeten 403-Seite.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/linkedin-posts/:path*",
    "/uploads/:path*",
  ],
};
