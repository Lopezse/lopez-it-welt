// =====================================================
// AI CENTER - SETTINGS API
// =====================================================
// GET /api/admin/ai/settings - Alle Settings laden
// PATCH /api/admin/ai/settings - Settings aktualisieren
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AISettingsService, AICostTracker, DEFAULT_SETTINGS } from "@/lib/ai-center/settings-service";

// =====================================================
// GET - Alle Settings laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const settings = await AISettingsService.getSettings();
    const costStatus = await AICostTracker.checkCostLimit();
    
    return NextResponse.json({
      success: true,
      data: {
        settings,
        cost_status: costStatus,
        defaults: DEFAULT_SETTINGS
      }
    });
    
  } catch (error) {
    console.error("❌ Settings Get Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH - Settings aktualisieren
// =====================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.updates || typeof body.updates !== "object") {
      return NextResponse.json(
        { success: false, error: "updates Objekt erforderlich" },
        { status: 400 }
      );
    }
    
    // Validierung: Nur bekannte Keys erlauben
    const validKeys = Object.keys(DEFAULT_SETTINGS);
    const invalidKeys = Object.keys(body.updates).filter(k => !validKeys.includes(k));
    
    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { success: false, error: `Unbekannte Settings: ${invalidKeys.join(", ")}` },
        { status: 400 }
      );
    }
    
    await AISettingsService.updateSettings(body.updates);
    
    const updatedSettings = await AISettingsService.getSettings();
    
    return NextResponse.json({
      success: true,
      message: `${Object.keys(body.updates).length} Settings aktualisiert`,
      data: updatedSettings
    });
    
  } catch (error) {
    console.error("❌ Settings Update Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - Settings auf Defaults zurücksetzen
// =====================================================

export async function DELETE(request: NextRequest) {
  try {
    await AISettingsService.resetToDefaults();
    
    return NextResponse.json({
      success: true,
      message: "Settings auf Defaults zurückgesetzt",
      data: DEFAULT_SETTINGS
    });
    
  } catch (error) {
    console.error("❌ Settings Reset Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

