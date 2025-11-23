// =====================================================
// SHOP GUARD MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Schutz für /account/*, /shop/checkout/* Routen (erfordert shp_session)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";

/**
 * Prüft ob Request für /account/* oder /shop/checkout/* authentifiziert ist
 * @returns NextResponse mit 302 Redirect zu /account/login wenn nicht authentifiziert, sonst null
 */
export function shopGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Nur für /account/* und /shop/checkout/* Routen prüfen
  const protectedPaths = ["/account", "/shop/checkout"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return null;
  }

  // Öffentliche Shop-Routen (Login, Register)
  const publicRoutes = ["/account/login", "/account/register", "/shop/login"];

  if (publicRoutes.includes(pathname)) {
    return null;
  }

  // Session-Token aus Cookie extrahieren
  const sessionToken = request.cookies.get("shp_session")?.value;

  if (!sessionToken) {
    // Nicht authentifiziert - Redirect zu Shop-Login
    const loginUrl = new URL("/account/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session muss shp_ Präfix haben
  if (!sessionToken.startsWith("shp_")) {
    const loginUrl = new URL("/account/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null; // Authentifiziert
}

/**
 * Prüft ob API-Request für /api/shop/* authentifiziert ist
 * @returns NextResponse mit 401/403 wenn nicht authentifiziert, sonst null
 */
export function shopApiGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Nur für /api/shop/* Routen prüfen (nicht /api/auth/shop/* - die haben eigene Guards)
  if (!pathname.startsWith("/api/shop")) {
    return null;
  }

  // Öffentliche Shop-API-Routen
  const publicRoutes = ["/api/auth/shop/login", "/api/auth/shop/logout"];

  if (publicRoutes.includes(pathname)) {
    return null;
  }

  // Session-Token aus Cookie oder Header extrahieren
  const sessionToken =
    request.cookies.get("shp_session")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, message: "Nicht authentifiziert" },
      { status: 401 },
    );
  }

  // Session muss shp_ Präfix haben
  if (!sessionToken.startsWith("shp_")) {
    return NextResponse.json(
      { success: false, message: "Ungültige Session (Shop erforderlich)" },
      { status: 403 },
    );
  }

  return null; // Authentifiziert
}







