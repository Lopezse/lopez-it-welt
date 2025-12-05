// =====================================================
// ENTERPRISE++ MODULE REGISTRY - SINGLE MODULE API
// =====================================================
// PATCH: Modul aktualisieren (Status, Fortschritt)
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { ModuleRegistryService, ModuleStatus } from "@/lib/module-registry";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ moduleCode: string }> }
) {
  try {
    const { moduleCode } = await params;
    const body = await request.json();

    const updates: {
      status?: ModuleStatus;
      progress_percent?: number;
      responsible_team?: string;
      target_date?: Date;
      completed_date?: Date;
    } = {};

    if (body.status) updates.status = body.status;
    if (body.progress_percent !== undefined) updates.progress_percent = body.progress_percent;
    if (body.responsible_team) updates.responsible_team = body.responsible_team;
    if (body.target_date) updates.target_date = new Date(body.target_date);
    if (body.completed_date) updates.completed_date = new Date(body.completed_date);

    const success = await ModuleRegistryService.updateModule(
      moduleCode,
      updates,
      body.userId,
      body.comment
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Modul nicht gefunden oder keine Änderungen" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Modul ${moduleCode} aktualisiert`,
    });
  } catch (error) {
    console.error("❌ Module Update Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Moduls" },
      { status: 500 }
    );
  }
}






