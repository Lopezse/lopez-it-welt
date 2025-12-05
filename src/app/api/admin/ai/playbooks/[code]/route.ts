// =====================================================
// AI CENTER - PLAYBOOK DETAIL API
// =====================================================
// GET /api/admin/ai/playbooks/[code] - Playbook Details
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { PlaybookService } from "@/lib/ai-center/playbook-service";

// =====================================================
// GET - Playbook Details
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const playbook = await PlaybookService.getPlaybookByCode(code);
    
    if (!playbook) {
      return NextResponse.json(
        { success: false, error: `Playbook ${code} nicht gefunden` },
        { status: 404 }
      );
    }
    
    // Letzte Executions laden
    const executions = await PlaybookService.listExecutions(playbook.id, 10);
    
    return NextResponse.json({
      success: true,
      data: {
        playbook,
        recent_executions: executions
      }
    });
    
  } catch (error) {
    console.error("❌ Playbook Detail Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

