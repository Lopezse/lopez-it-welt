/**
 * Policy Version Restore API - Enterprise++ Standard E.2.4
 * 
 * POST /api/admin/policies/[id]/versions/[versionId]/restore - Version wiederherstellen
 * 
 * RBAC: policy.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const policyId = params.id;
    const versionId = params.versionId;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Version laden
    const [versionRows] = await connection.execute(
      "SELECT content, version FROM enterprise_policy_versions WHERE id = ? AND policy_id = ?",
      [versionId, policyId]
    );

    const version = Array.isArray(versionRows) && versionRows.length > 0 ? versionRows[0] : null;

    if (!version) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Version nicht gefunden" },
        { status: 404 }
      );
    }

    // Policy mit Version-Inhalt aktualisieren
    await connection.execute(
      `UPDATE enterprise_policies 
       SET content = ?, version = ?, updated_at = NOW()
       WHERE id = ?`,
      [(version as any).content, (version as any).version, policyId]
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('POLICY_VERSION_RESTORE', 'enterprise_policies', ?, ?)`,
      [policyId, `Version ${(version as any).version} wiederhergestellt`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Version erfolgreich wiederhergestellt",
    });
  } catch (error) {
    logger.error("Fehler bei der Policy-Version-Wiederherstellung", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Wiederherstellung" },
      { status: 500 }
    );
  }
}



