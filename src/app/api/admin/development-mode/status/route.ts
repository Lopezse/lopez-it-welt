// =====================================================
// DEVELOPMENT MODE STATUS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Development Mode Status API
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Development Mode Status prüfen
    const isEnabled = DevelopmentMode.isEnabled();
    const shouldBypassAuth = DevelopmentMode.shouldBypassAuth();

    // Chef-Benutzer prüfen
    const chefExists = await DevelopmentMode.checkChefUserExists();

    // Environment
    const environment = process.env.NODE_ENV || "production";

    // Verfügbare Features
    const features = [
      "Authentication Bypass",
      "Mock-User (Chef)",
      "Admin-Zugriff",
      "Monitoring-Daten",
      "API-Mock-Responses",
      "Development Dashboard",
    ];

    const status = {
      enabled: isEnabled,
      bypassAuth: shouldBypassAuth,
      chefUserExists: chefExists,
      environment,
      features,
      config: DevelopmentMode.getConfig(),
    };

    return NextResponse.json(status);
  } catch (error) {
    // Development Mode Status Fehler: ${error}
    return NextResponse.json(
      { error: "Fehler beim Laden des Development Mode Status" },
      { status: 500 },
    );
  }
}
