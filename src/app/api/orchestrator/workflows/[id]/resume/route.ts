/**
 * Orchestrator Workflow Resume API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/workflows/[id]/resume - Workflow fortsetzen
 * 
 * RBAC: orchestrator.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { workflowManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            user_id: session.userId,
            resource: "orchestrator",
            action: "manage"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.manage" },
                { status: 403 }
            );
        }

        const workflowId = params.id;
        const connection = await getConnection();

        // Pausierte Execution finden
        const [rows] = await connection.execute(
            `SELECT execution_id FROM orchestrator_workflow_executions 
             WHERE workflow_id = ? AND status = 'paused'
             ORDER BY started_at DESC LIMIT 1`,
            [workflowId]
        );

        const executions = Array.isArray(rows) ? rows : [];
        if (executions.length === 0) {
            return NextResponse.json(
                { success: false, message: "Keine pausierte Execution gefunden" },
                { status: 404 }
            );
        }

        const executionId = (executions[0] as any).execution_id;
        await workflowManager.resumeWorkflow(executionId);

        return NextResponse.json({
            success: true,
            data: {
                workflow_id: workflowId,
                execution_id: executionId,
                status: "active",
                resumed_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Fortsetzen des Workflows", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Fortsetzen des Workflows" 
            },
            { status: 500 }
        );
    }
}






