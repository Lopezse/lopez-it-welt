// =====================================================
// AI CENTER - PLAYBOOK EXECUTE API
// =====================================================
// POST /api/admin/ai/playbooks/[code]/execute
// Führt ein Playbook aus
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { PlaybookService } from "@/lib/ai-center/playbook-service";

// =====================================================
// POST - Playbook ausführen
// =====================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    
    const execution = await PlaybookService.executePlaybook(
      code,
      body.context || {},
      {
        dry_run: body.dry_run || false,
        executed_by: body.executed_by || "api"
      }
    );
    
    return NextResponse.json({
      success: true,
      message: `Playbook ${code} ${body.dry_run ? "(Dry-Run) " : ""}ausgeführt`,
      data: execution
    });
    
  } catch (error) {
    console.error("❌ Playbook Execute Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

