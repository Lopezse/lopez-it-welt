// =====================================================
// AI CENTER - AI MODELS API
// =====================================================
// GET /api/admin/ai/models - Liste registrierte Modelle
// POST /api/admin/ai/models - Neues Modell registrieren
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AIModelRegistry } from "@/lib/ai-center/ai-model-registry";

// =====================================================
// GET - Alle Modelle laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const provider = searchParams.get("provider") as any;
    const risk_category = searchParams.get("risk_category") as any;
    
    const models = await AIModelRegistry.listModels({
      status: status || undefined,
      provider: provider || undefined,
      risk_category: risk_category || undefined
    });
    
    // Compliance-Warnungen
    const warnings = await AIModelRegistry.getComplianceWarnings();
    
    // Summary
    const summary = {
      total: models.length,
      by_status: {
        approved: models.filter(m => m.status === "approved").length,
        testing: models.filter(m => m.status === "testing").length,
        draft: models.filter(m => m.status === "draft").length,
        deprecated: models.filter(m => m.status === "deprecated").length,
        blocked: models.filter(m => m.status === "blocked").length
      },
      by_risk: {
        minimal: models.filter(m => m.risk_category === "minimal").length,
        limited: models.filter(m => m.risk_category === "limited").length,
        high: models.filter(m => m.risk_category === "high").length,
        unacceptable: models.filter(m => m.risk_category === "unacceptable").length
      },
      by_provider: {
        openai: models.filter(m => m.provider === "openai").length,
        anthropic: models.filter(m => m.provider === "anthropic").length,
        google: models.filter(m => m.provider === "google").length,
        local: models.filter(m => m.provider === "local").length
      },
      warnings_count: warnings.length
    };
    
    return NextResponse.json({
      success: true,
      data: {
        models,
        summary,
        warnings
      }
    });
    
  } catch (error) {
    console.error("❌ Models API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Neues Modell registrieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.code || !body.name || !body.provider || !body.risk_category) {
      return NextResponse.json(
        { success: false, error: "code, name, provider und risk_category sind erforderlich" },
        { status: 400 }
      );
    }
    
    const model = await AIModelRegistry.registerModel({
      code: body.code,
      name: body.name,
      provider: body.provider,
      version: body.version || "1.0",
      risk_category: body.risk_category,
      risk_justification: body.risk_justification || "",
      dsfa_required: body.dsfa_required || false,
      dsfa_document_url: body.dsfa_document_url,
      status: body.status || "draft",
      approved_by: body.approved_by,
      approval_notes: body.approval_notes,
      allowed_use_cases: body.allowed_use_cases || [],
      prohibited_use_cases: body.prohibited_use_cases || [],
      requires_human_oversight: body.requires_human_oversight !== false,
      max_autonomy_level: body.max_autonomy_level || 3,
      input_types: body.input_types || ["text"],
      output_types: body.output_types || ["text"],
      max_tokens: body.max_tokens || 4096,
      cost_per_1k_input: body.cost_per_1k_input || 0,
      cost_per_1k_output: body.cost_per_1k_output || 0,
      gdpr_compliant: body.gdpr_compliant !== false,
      data_processing_location: body.data_processing_location || "Unknown",
      data_retention_policy: body.data_retention_policy || "Standard",
      documentation_url: body.documentation_url
    });
    
    return NextResponse.json({
      success: true,
      message: `Modell "${model.code}" registriert`,
      data: model
    });
    
  } catch (error) {
    console.error("❌ Model Register Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

