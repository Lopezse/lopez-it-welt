// =====================================================
// ENTERPRISE++ PROJECT ANALYSIS API
// =====================================================
// POST: Projektanalyse ausführen (mit Projekt-Auswahl)
// GET: Analyse-Historie abrufen oder spezifische Analyse laden
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Alle Analysen sind READ-ONLY
// - Es werden KEINE Dateien verändert
// - Nur Analyse und Reporting
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import {
  runProjectAnalysis,
  saveAnalysisToDatabase,
  getAnalysisHistory,
  getAnalysisById,
  ProjectAnalysisSummary,
  ProjectKey,
  PROJECT_PRESETS,
} from "@/lib/project-analysis/project-analyzer";

// TODO: RBAC einbauen – nur Admin darf Projektanalyse ausführen

// =====================================================
// TYPEN
// =====================================================

interface AnalyzeRequestBody {
  projectKey?: ProjectKey;
}

// =====================================================
// GET: Presets, Historie oder spezifische Analyse laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "10");
    const view = searchParams.get("view");

    // Presets abrufen
    if (view === "presets") {
      return NextResponse.json({
        success: true,
        data: PROJECT_PRESETS,
      });
    }

    // Wenn ID angegeben: Lade spezifische Analyse
    if (id) {
      const analysisId = parseInt(id);
      if (isNaN(analysisId)) {
        return NextResponse.json(
          { success: false, error: "Ungültige ID" },
          { status: 400 }
        );
      }

      const analysis = await getAnalysisById(analysisId);

      if (!analysis) {
        return NextResponse.json(
          { success: false, error: "Analyse nicht gefunden" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analysis,
      });
    }

    // Sonst: Lade Historie
    const history = await getAnalysisHistory(limit);

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error: any) {
    console.error("❌ [Project-Analyzer] History Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Fehler beim Abrufen der Historie",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST: Neue Projektanalyse starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Body lesen
    let body: AnalyzeRequestBody = {};
    try {
      body = await request.json();
    } catch {
      // Leerer Body ist OK, default wird verwendet
    }

    // ProjectKey validieren
    const projectKey: ProjectKey = body.projectKey || "core";
    const validKeys = PROJECT_PRESETS.map((p) => p.key);

    if (!validKeys.includes(projectKey)) {
      return NextResponse.json(
        {
          success: false,
          error: `Ungültiger projectKey. Erlaubt: ${validKeys.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const preset = PROJECT_PRESETS.find((p) => p.key === projectKey);
    console.log(`📊 [Project-Analyzer] Starte Analyse: "${preset?.name}" (${projectKey})`);

    // Führe die READ-ONLY Analyse durch
    const result: ProjectAnalysisSummary = await runProjectAnalysis(projectKey);

    const duration = Date.now() - startTime;
    console.log(`✅ [Project-Analyzer] Analyse abgeschlossen in ${duration}ms`);
    console.log(`   Projekt: ${result.projectName}`);
    console.log(`   Pfade: ${result.scannedPaths.join(", ")}`);
    console.log(`   Enterprise-Score: ${result.enterpriseScore}/10`);
    console.log(`   Risiken: ${result.risks.length} gefunden`);

    // Versuche in DB zu speichern (optional)
    let savedId = 0;
    try {
      savedId = await saveAnalysisToDatabase(result);
      if (savedId > 0) {
        console.log(`   Gespeichert mit ID: ${savedId}`);
      }
    } catch (dbError) {
      console.warn("   ⚠️ DB-Speicherung fehlgeschlagen (in-memory Analyse trotzdem verfügbar)");
    }

    // Zähle Risiken nach Severity
    const criticalCount = result.risks.filter((r) => r.severity === "critical").length;
    const highCount = result.risks.filter((r) => r.severity === "high").length;
    const mediumCount = result.risks.filter((r) => r.severity === "medium").length;
    const lowCount = result.risks.filter((r) => r.severity === "low").length;

    return NextResponse.json({
      success: true,
      message: `Projektanalyse für "${result.projectName}" abgeschlossen: Enterprise-Score ${result.enterpriseScore}/10`,
      data: {
        ...result,
        savedId,
        duration,
        riskCounts: {
          critical: criticalCount,
          high: highCount,
          medium: mediumCount,
          low: lowCount,
          total: result.risks.length,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ [Project-Analyzer] Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Fehler bei der Projektanalyse",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
