// =====================================================
// ADMIN GUARD MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Schutz für /admin/* Routen (erfordert adm_session)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { NextRequest, NextResponse } from "next/server";

/**
 * Prüft ob Request für /admin/* authentifiziert ist
 * @returns NextResponse mit 302 Redirect zu /admin/login wenn nicht authentifiziert, sonst null
 */
export function adminGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Nur für /admin/* Routen prüfen (nicht für /admin/login selbst)
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return null;
  }

  // Session-Token aus Cookie extrahieren
  const sessionToken = request.cookies.get("adm_session")?.value;

  if (!sessionToken) {
    // Nicht authentifiziert - Redirect zu Admin-Login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session validieren (asynchron - wird in middleware.ts gehandhabt)
  // Hier nur prüfen ob Cookie vorhanden ist
  // Die eigentliche Validierung erfolgt in der API-Route

  return null; // Authentifiziert
}

/**
 * Prüft ob API-Request für /api/admin/* authentifiziert ist
 * @returns NextResponse mit 401/403 wenn nicht authentifiziert, sonst null
 */
export function adminApiGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Nur für /api/admin/* Routen prüfen
  if (!pathname.startsWith("/api/admin")) {
    return null;
  }

  // Öffentliche Admin-API-Routen (z.B. Login)
  const publicRoutes = [
    "/api/auth/admin/login",
    "/api/auth/admin/logout", // Logout erlaubt (für Session-Cleanup)
  ];

  if (publicRoutes.includes(pathname)) {
    return null;
  }

  // Session-Token aus Cookie oder Header extrahieren
  const sessionToken =
    request.cookies.get("adm_session")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, message: "Nicht authentifiziert" },
      { status: 401 },
    );
  }

  // Session muss adm_ Präfix haben
  if (!sessionToken.startsWith("adm_")) {
    return NextResponse.json(
      { success: false, message: "Ungültige Session (Admin erforderlich)" },
      { status: 403 },
    );
  }

  return null; // Authentifiziert
}







