/**
 * Orchestrator Status Workflows API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/status/workflows - Workflow-Status abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { workflowManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
    try {
        // Authentifizierung
        const sessionToken =
            request.headers.get("authorization")?.replace("Bearer ", "") ||
            request.cookies.get("adm_session")?.value;

        if (!sessionToken) {
            return NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        const session = await AdminAuthService.validateSession(sessionToken);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Ungültige Session" },
                { status: 401 }
            );
        }

        // RBAC-Prüfung
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId.toString(),
            resource: "orchestrator",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.view" },
                { status: 403 }
            );
        }

        const connection = await getConnection();

        // Alle Workflows abrufen
        const allWorkflows = await workflowManager.getWorkflows({});
        const activeWorkflows = allWorkflows.filter(w => w.status === 'active');
        const pausedWorkflows = allWorkflows.filter(w => w.status === 'paused');
        const completedWorkflows = allWorkflows.filter(w => w.status === 'completed');

        // Workflow-Events heute zählen
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [startedRows] = await connection.execute(
            `SELECT COUNT(*) as count FROM orchestrator_events 
             WHERE event_type = 'ORCH_WORKFLOW_STARTED' 
             AND timestamp >= ?`,
            [today.toISOString()]
        );

        const [completedRows] = await connection.execute(
            `SELECT COUNT(*) as count FROM orchestrator_events 
             WHERE event_type = 'ORCH_WORKFLOW_COMPLETED' 
             AND timestamp >= ?`,
            [today.toISOString()]
        );

        const [failedRows] = await connection.execute(
            `SELECT COUNT(*) as count FROM orchestrator_events 
             WHERE event_type = 'ORCH_WORKFLOW_FAILED' 
             AND timestamp >= ?`,
            [today.toISOString()]
        );

        const workflowsStartedToday = Array.isArray(startedRows) && startedRows.length > 0
            ? (startedRows[0] as any).count
            : 0;

        const workflowsCompletedToday = Array.isArray(completedRows) && completedRows.length > 0
            ? (completedRows[0] as any).count
            : 0;

        const workflowsFailedToday = Array.isArray(failedRows) && failedRows.length > 0
            ? (failedRows[0] as any).count
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                total_workflows: allWorkflows.length,
                active_workflows: activeWorkflows.length,
                paused_workflows: pausedWorkflows.length,
                completed_workflows: completedWorkflows.length,
                workflows_started_today: workflowsStartedToday,
                workflows_completed_today: workflowsCompletedToday,
                workflows_failed_today: workflowsFailedToday
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Workflow-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Workflow-Status" },
            { status: 500 }
        );
    }
}






