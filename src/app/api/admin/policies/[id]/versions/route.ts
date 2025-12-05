/**
 * Policy Versions API - Enterprise++ Standard E.2.4
 * 
 * GET /api/admin/policies/[id]/versions - Versions-Historie
 * 
 * RBAC: policy.view
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = params.id;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Versions-Historie laden
    const [rows] = await connection.execute(
      `SELECT id, policy_id, version, content, created_at, created_by, change_summary
       FROM enterprise_policy_versions
       WHERE policy_id = ?
       ORDER BY version DESC`,
      [policyId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Policy-Versionen", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Versionen" },
      { status: 500 }
    );
  }
}



