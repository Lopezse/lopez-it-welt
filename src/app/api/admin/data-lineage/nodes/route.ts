/**
 * Data Lineage Nodes API - Enterprise++ Standard E.2.6
 * 
 * GET /api/admin/data-lineage/nodes - Nodes abrufen
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dataLineageTracker } from "@/lib/data-lineage/tracker";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const resource_type = searchParams.get("resource_type") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const result = await dataLineageTracker.getAllNodes({
      type,
      resource_type,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Data Lineage Nodes", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Nodes" },
      { status: 500 }
    );
  }
}



