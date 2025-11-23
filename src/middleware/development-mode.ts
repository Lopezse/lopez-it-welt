// =====================================================
// DEVELOPMENT MODE MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Development Mode Middleware für Next.js
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// MIDDLEWARE FUNCTION
// =====================================================

export function developmentModeMiddleware(request: NextRequest) {
  // Nur im Development Mode aktivieren
  if (!DevelopmentMode.isEnabled()) {
    return NextResponse.next();
  }

  // Development Mode Header hinzufügen
  const response = NextResponse.next();

  if (DevelopmentMode.shouldBypassAuth()) {
    response.headers.set("X-Development-Mode", "true");
    response.headers.set("X-Bypass-Auth", "true");

    // Development Mode: Middleware aktiv
    // Route: ${request.nextUrl.pathname}
  }

  return response;
}

// =====================================================
// API ROUTE MIDDLEWARE
// =====================================================

export function apiDevelopmentModeMiddleware(request: NextRequest) {
  // Nur für API-Routen
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Development Mode: Mock-Response für Auth-Routen
  if (DevelopmentMode.shouldBypassAuth()) {
    const pathname = request.nextUrl.pathname;

    // Login Route
    if (pathname === "/api/auth/login" && request.method === "POST") {
      const mockResponse = DevelopmentMode.createLoginResponse();
      return NextResponse.json(mockResponse);
    }

    // Logout Route
    if (pathname === "/api/auth/logout" && request.method === "POST") {
      const mockResponse = DevelopmentMode.createLogoutResponse();
      return NextResponse.json(mockResponse);
    }

    // Shop Login Route
    if (pathname === "/api/auth/shop-login" && request.method === "POST") {
      const mockResponse = DevelopmentMode.createLoginResponse();
      return NextResponse.json(mockResponse);
    }

    // Register Route - Mock Success
    if (pathname === "/api/auth/register" && request.method === "POST") {
      return NextResponse.json({
        success: true,
        message: "Development Mode: Registrierung umgangen",
        user: DevelopmentMode.createMockUser(),
        isDevelopmentMode: true,
      });
    }

    // Admin Routes - Mock-User hinzufügen
    if (pathname.startsWith("/api/admin/")) {
      const response = NextResponse.next();
      response.headers.set("X-Development-Mode", "true");
      response.headers.set("X-Mock-User", JSON.stringify(DevelopmentMode.createMockUser()));
      return response;
    }

    // Monitoring Routes - Mock-Daten
    if (pathname.startsWith("/api/monitoring/")) {
      const response = NextResponse.next();
      response.headers.set("X-Development-Mode", "true");
      response.headers.set("X-Mock-Data", "true");
      return response;
    }
  }

  return NextResponse.next();
}
