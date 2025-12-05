// =====================================================
// AI CENTER - PLAYBOOKS API
// =====================================================
// GET /api/admin/ai/playbooks - Liste alle Playbooks
// POST /api/admin/ai/playbooks - Erstelle neues Playbook
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { PlaybookService, PlaybookCategory, PlaybookStatus } from "@/lib/ai-center/playbook-service";

// =====================================================
// GET - Alle Playbooks laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as PlaybookCategory | null;
    const status = searchParams.get("status") as PlaybookStatus | null;
    const search = searchParams.get("search");
    
    const playbooks = await PlaybookService.listPlaybooks({
      category: category || undefined,
      status: status || undefined,
      search: search || undefined
    });
    
    // Nach Kategorie gruppieren
    const byCategory: Record<string, typeof playbooks> = {};
    for (const pb of playbooks) {
      if (!byCategory[pb.category]) {
        byCategory[pb.category] = [];
      }
      byCategory[pb.category].push(pb);
    }
    
    // Summary berechnen
    const summary = {
      total: playbooks.length,
      by_category: {
        security: playbooks.filter(p => p.category === "security").length,
        accessibility: playbooks.filter(p => p.category === "accessibility").length,
        performance: playbooks.filter(p => p.category === "performance").length,
        quality: playbooks.filter(p => p.category === "quality").length,
        incident: playbooks.filter(p => p.category === "incident").length,
        other: playbooks.filter(p => !["security", "accessibility", "performance", "quality", "incident"].includes(p.category)).length
      },
      active: playbooks.filter(p => p.status === "active").length,
      total_runs: playbooks.reduce((sum, p) => sum + p.run_count, 0)
    };
    
    return NextResponse.json({
      success: true,
      data: {
        playbooks,
        by_category: byCategory,
        summary
      }
    });
    
  } catch (error) {
    console.error("❌ Playbooks List Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Neues Playbook erstellen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.code || !body.name || !body.category || !body.steps) {
      return NextResponse.json(
        { success: false, error: "code, name, category und steps sind erforderlich" },
        { status: 400 }
      );
    }
    
    const playbook = await PlaybookService.upsertPlaybook({
      code: body.code,
      name: body.name,
      description: body.description || "",
      category: body.category,
      status: body.status || "draft",
      version: body.version || "1.0",
      steps: body.steps,
      tags: body.tags || [],
      estimated_duration: body.estimated_duration || "1h",
      risk_level: body.risk_level || "medium",
      created_by: body.created_by || "user"
    });
    
    return NextResponse.json({
      success: true,
      message: `Playbook "${playbook.code}" erstellt`,
      data: playbook
    });
    
  } catch (error) {
    console.error("❌ Playbook Create Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

