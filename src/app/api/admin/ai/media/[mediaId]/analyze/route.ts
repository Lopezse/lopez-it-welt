// =====================================================
// ENTERPRISE++ AI MEDIA ANALYSIS API
// =====================================================
// POST /api/admin/ai/media/[mediaId]/analyze - Analysiert Media
// GET /api/admin/ai/media/[mediaId]/analyze - Lädt Analysen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AIProvider } from "@/lib/ai/ai-provider";

// GET - Vorhandene Analysen laden
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { mediaId } = await params;
    const id = parseInt(mediaId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Media-ID" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_media_ai_results 
       WHERE media_id = ? 
       ORDER BY created_at DESC`,
      [id]
    );
    
    return NextResponse.json({
      success: true,
      data: rows,
    });
    
  } catch (error) {
    console.error("AI Media GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Analysen" },
      { status: 500 }
    );
  }
}

// POST - Neue Analyse starten
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { mediaId } = await params;
    const id = parseInt(mediaId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Media-ID" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const analysisType = body.type || "summary";
    
    const userId = 1; // TODO: Aus Session
    
    // Demo-Analyse
    const prompt = `Analysiere dieses Dokument/Medium und erstelle eine ${analysisType}-Analyse.`;
    const systemPrompt = `Du bist ein Enterprise-Dokumenten-Analyst.
Analysiere Dokumente und erstelle strukturierte Analysen.
Prüfe auf DSGVO-relevante Inhalte und Personen.
Antworte auf Deutsch.`;
    
    const aiResponse = await AIProvider.generate({
      prompt,
      systemPrompt,
      userId,
      endpoint: `/api/admin/ai/media/${id}/analyze`,
    });
    
    if (!aiResponse.success) {
      return NextResponse.json(
        { success: false, error: aiResponse.error },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Analyse speichern
    const jsonResult = {
      analysis: aiResponse.content,
      analyzed_at: new Date().toISOString(),
      type: analysisType,
    };
    
    await pool.execute(
      `INSERT INTO lopez_media_ai_results 
       (media_id, result_type, json_result, has_persons, dsgvo_warning, 
        confidence_score, provider, model, tokens_used, cost_estimate, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        analysisType,
        JSON.stringify(jsonResult),
        false, // has_persons - würde in echter Analyse geprüft
        false, // dsgvo_warning - würde in echter Analyse geprüft
        0.85,
        aiResponse.provider,
        aiResponse.model,
        aiResponse.tokensUsed,
        aiResponse.costEstimate,
        userId,
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: "Media-Analyse erfolgreich abgeschlossen",
      data: {
        analysis: aiResponse.content,
        provider: aiResponse.provider,
        tokensUsed: aiResponse.tokensUsed,
      },
    });
    
  } catch (error) {
    console.error("AI Media POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Media-Analyse" },
      { status: 500 }
    );
  }
}









