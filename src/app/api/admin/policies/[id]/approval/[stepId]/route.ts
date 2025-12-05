/**
 * Policy Approval Step API - Enterprise++ Standard E.2.4
 * 
 * POST /api/admin/policies/[id]/approval/[stepId] - Freigabe-Schritt bearbeiten
 * 
 * RBAC: policy.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const policyId = params.id;
    const stepId = params.stepId;
    const body = await request.json();
    const { approved, comments } = body;

    if (approved === undefined) {
      return NextResponse.json(
        { success: false, error: "approved ist erforderlich" },
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

    // Schritt aktualisieren
    await connection.execute(
      `UPDATE enterprise_policy_approval_steps
       SET status = ?, comments = ?, approved_at = NOW()
       WHERE id = ?`,
      [approved ? "approved" : "rejected", comments || null, stepId]
    );

    // Workflow-Status aktualisieren
    if (approved) {
      // Nächster Schritt oder Workflow abschließen
      const [workflowRows] = await connection.execute(
        "SELECT id, current_step FROM enterprise_policy_approvals WHERE policy_id = ? ORDER BY created_at DESC LIMIT 1",
        [policyId]
      );
      const workflow = Array.isArray(workflowRows) && workflowRows.length > 0 ? workflowRows[0] : null;

      if (workflow) {
        const [stepRows] = await connection.execute(
          "SELECT COUNT(*) as total FROM enterprise_policy_approval_steps WHERE approval_id = ?",
          [(workflow as any).id]
        );
        const totalSteps = Array.isArray(stepRows) && stepRows.length > 0 ? (stepRows[0] as any).total : 0;

        if ((workflow as any).current_step < totalSteps) {
          // Nächster Schritt
          await connection.execute(
            "UPDATE enterprise_policy_approvals SET current_step = current_step + 1 WHERE id = ?",
            [(workflow as any).id]
          );
        } else {
          // Workflow abschließen
          await connection.execute(
            "UPDATE enterprise_policy_approvals SET status = 'approved', completed_at = NOW() WHERE id = ?",
            [(workflow as any).id]
          );
          // Policy aktivieren
          await connection.execute(
            "UPDATE enterprise_policies SET status = 'active' WHERE id = ?",
            [policyId]
          );
        }
      }
    } else {
      // Workflow ablehnen
      await connection.execute(
        "UPDATE enterprise_policy_approvals SET status = 'rejected', completed_at = NOW() WHERE policy_id = ?",
        [policyId]
      );
    }

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('POLICY_APPROVAL', 'enterprise_policies', ?, ?)`,
      [policyId, `Freigabe-Schritt ${approved ? "freigegeben" : "abgelehnt"}: ${comments || ""}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: approved ? "Schritt freigegeben" : "Schritt abgelehnt",
    });
  } catch (error) {
    logger.error("Fehler bei der Policy-Freigabe", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Freigabe" },
      { status: 500 }
    );
  }
}



