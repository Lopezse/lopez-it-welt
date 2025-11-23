// =====================================================
// CREATE CHEF USER API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Chef-Benutzer erstellen API
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Nur im Development Mode erlauben
    if (!DevelopmentMode.isEnabled()) {
      return NextResponse.json({ error: "Development Mode ist nicht aktiviert" }, { status: 403 });
    }

    // Chef-Benutzer erstellen
    const chef = await DevelopmentMode.createChefUser();

    if (!chef) {
      return NextResponse.json(
        { error: "Fehler beim Erstellen des Chef-Benutzers" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chef-Benutzer erfolgreich erstellt",
      user: {
        id: chef.id,
        username: chef.username,
        email: chef.email,
        display_name: chef.display_name,
        role: chef.role,
      },
    });
  } catch (error) {
    // Create Chef User Fehler: ${error}
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Chef-Benutzers" },
      { status: 500 },
    );
  }
}
