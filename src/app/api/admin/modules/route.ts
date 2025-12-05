// =====================================================
// ENTERPRISE++ MODULE REGISTRY API
// =====================================================
// GET: Module abrufen
// POST: Roadmap synchronisieren
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { ModuleRegistryService, ModuleCategory, ModuleStatus, ModulePriority } from "@/lib/module-registry";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") as ModuleCategory | null;
    const status = searchParams.get("status") as ModuleStatus | null;
    const priority = searchParams.get("priority") as ModulePriority | null;
    const view = searchParams.get("view"); // "statistics" oder "report"

    // Statistiken abrufen
    if (view === "statistics") {
      const statistics = await ModuleRegistryService.getStatistics();
      return NextResponse.json({
        success: true,
        data: statistics,
      });
    }

    // Vollständigen Report generieren
    if (view === "report") {
      const report = await ModuleRegistryService.generateReport();
      return NextResponse.json({
        success: true,
        data: report,
      });
    }

    // Module mit optionalem Filter
    const filter: {
      category?: ModuleCategory;
      status?: ModuleStatus;
      priority?: ModulePriority;
    } = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const modules = await ModuleRegistryService.getModules(
      Object.keys(filter).length > 0 ? filter : undefined
    );

    return NextResponse.json({
      success: true,
      data: modules,
      count: modules.length,
    });
  } catch (error) {
    console.error("❌ Module Registry GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Module" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    // Tabellen initialisieren
    if (action === "init") {
      await ModuleRegistryService.initializeTables();
      return NextResponse.json({
        success: true,
        message: "Module Registry Tabellen initialisiert",
      });
    }

    // Roadmap synchronisieren
    if (action === "sync") {
      await ModuleRegistryService.initializeTables(); // Sicherstellen dass Tabellen existieren
      const result = await ModuleRegistryService.syncRoadmap();
      return NextResponse.json({
        success: true,
        message: "Roadmap synchronisiert",
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, error: "Ungültige Aktion" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Module Registry POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Modul-Registry-Aktion" },
      { status: 500 }
    );
  }
}






