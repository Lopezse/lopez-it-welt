/**
 * Data Lineage Resource API - Enterprise++ Standard E.2.6
 * 
 * GET /api/admin/data-lineage/resource/[resourceType]/[resourceId] - Lineage für Ressource abrufen
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dataLineageTracker } from "@/lib/data-lineage/tracker";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceType: string; resourceId: string } }
) {
  try {
    const resourceType = params.resourceType;
    const resourceId = params.resourceId;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const result = await dataLineageTracker.getLineageForResource(resourceType, resourceId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Data Lineage für Ressource", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Lineage" },
      { status: 500 }
    );
  }
}



