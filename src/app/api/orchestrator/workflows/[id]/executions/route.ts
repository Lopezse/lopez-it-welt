/**
 * Orchestrator Workflow Executions API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/workflows/[id]/executions - Execution-Liste abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

export async function GET(
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
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.view" },
                { status: 403 }
            );
        }

        const workflowId = params.id;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_workflow_executions 
             WHERE workflow_id = ?
             ORDER BY started_at DESC
             LIMIT ? OFFSET ?`,
            [workflowId, limit, offset]
        );

        const executions = Array.isArray(rows) ? rows : [];

        return NextResponse.json({
            success: true,
            data: {
                executions: executions.map((exec: any) => ({
                    id: exec.id,
                    execution_id: exec.execution_id,
                    status: exec.status,
                    current_step: exec.current_step,
                    started_at: exec.started_at?.toISOString(),
                    completed_at: exec.completed_at?.toISOString(),
                    error: exec.error
                })),
                total: executions.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Executions", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Executions" },
            { status: 500 }
        );
    }
}






