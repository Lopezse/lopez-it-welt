/**
 * Policy Approval API - Enterprise++ Standard E.2.4
 * 
 * GET /api/admin/policies/[id]/approval - Freigabe-Workflow abrufen
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

    // Freigabe-Workflow laden
    const [workflowRows] = await connection.execute(
      `SELECT id, policy_id, status, current_step, created_at, completed_at
       FROM enterprise_policy_approvals
       WHERE policy_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [policyId]
    );

    const workflow = Array.isArray(workflowRows) && workflowRows.length > 0 ? workflowRows[0] : null;

    if (!workflow) {
      await connection.end();
      // Standard-Workflow erstellen (vereinfacht)
      return NextResponse.json({
        success: true,
        data: {
          id: `workflow-${policyId}`,
          policy_id: policyId,
          status: "pending",
          current_step: 1,
          steps: [
            {
              id: "step-1",
              step_number: 1,
              approver_role: "admin",
              approver_name: "System Administrator",
              status: "pending",
            },
          ],
          created_at: new Date().toISOString(),
        },
      });
    }

    // Workflow-Schritte laden
    const [stepRows] = await connection.execute(
      `SELECT id, step_number, approver_role, approver_name, status, comments, approved_at
       FROM enterprise_policy_approval_steps
       WHERE approval_id = ?
       ORDER BY step_number`,
      [(workflow as any).id]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        ...workflow,
        steps: Array.isArray(stepRows) ? stepRows : [],
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen des Policy-Freigabe-Workflows", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen des Freigabe-Workflows" },
      { status: 500 }
    );
  }
}



