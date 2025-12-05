/**
 * Policy Version Compare API - Enterprise++ Standard E.2.4
 * 
 * GET /api/admin/policies/[id]/versions/compare - Versionen vergleichen
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
    const { searchParams } = new URL(request.url);
    const version1Id = searchParams.get("version1");
    const version2Id = searchParams.get("version2");

    if (!version1Id || !version2Id) {
      return NextResponse.json(
        { success: false, error: "version1 und version2 sind erforderlich" },
        { status: 400 }
      );
    }

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Versionen laden
    const [version1Rows] = await connection.execute(
      "SELECT content FROM enterprise_policy_versions WHERE id = ?",
      [version1Id]
    );
    const [version2Rows] = await connection.execute(
      "SELECT content FROM enterprise_policy_versions WHERE id = ?",
      [version2Id]
    );

    const version1 = Array.isArray(version1Rows) && version1Rows.length > 0 ? version1Rows[0] : null;
    const version2 = Array.isArray(version2Rows) && version2Rows.length > 0 ? version2Rows[0] : null;

    if (!version1 || !version2) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Versionen nicht gefunden" },
        { status: 404 }
      );
    }

    // Vereinfachter Vergleich (in Produktion: echte Diff-Logik)
    const v1Content = JSON.parse((version1 as any).content);
    const v2Content = JSON.parse((version2 as any).content);

    const added: string[] = [];
    const removed: string[] = [];
    const changed: string[] = [];

    // Vergleich der Keys
    const v1Keys = Object.keys(v1Content);
    const v2Keys = Object.keys(v2Content);

    v2Keys.forEach((key) => {
      if (!v1Keys.includes(key)) {
        added.push(`Feld hinzugefügt: ${key}`);
      } else if (JSON.stringify(v1Content[key]) !== JSON.stringify(v2Content[key])) {
        changed.push(`Feld geändert: ${key}`);
      }
    });

    v1Keys.forEach((key) => {
      if (!v2Keys.includes(key)) {
        removed.push(`Feld entfernt: ${key}`);
      }
    });

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        added,
        removed,
        changed,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Vergleichen der Policy-Versionen", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Vergleichen" },
      { status: 500 }
    );
  }
}



