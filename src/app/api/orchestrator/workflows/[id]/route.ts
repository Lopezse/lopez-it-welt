/**
 * Orchestrator Workflow Detail API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/workflows/[id] - Workflow-Detail abrufen
 * PUT /api/orchestrator/workflows/[id] - Workflow aktualisieren
 * DELETE /api/orchestrator/workflows/[id] - Workflow löschen
 * 
 * RBAC: orchestrator.view (GET), orchestrator.manage (PUT, DELETE)
 */

import { NextRequest, NextResponse } from "next/server";
import { workflowManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

/**
 * GET /api/orchestrator/workflows/[id]
 */
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

        const workflowId = params.id;
        const connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_workflows WHERE id = ?`,
            [workflowId]
        );

        const workflows = Array.isArray(rows) ? rows : [];
        if (workflows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Workflow nicht gefunden" },
                { status: 404 }
            );
        }

        const workflow = workflows[0] as any;

        // Aktuelle Execution finden
        const [execRows] = await connection.execute(
            `SELECT * FROM orchestrator_workflow_executions 
             WHERE workflow_id = ? AND status IN ('active', 'paused')
             ORDER BY started_at DESC LIMIT 1`,
            [workflowId]
        );

        const executions = Array.isArray(execRows) ? execRows : [];
        const currentExecution = executions.length > 0 ? executions[0] as any : null;

        return NextResponse.json({
            success: true,
            data: {
                id: workflow.id,
                name: workflow.name,
                description: workflow.description,
                steps: typeof workflow.steps === 'string' 
                    ? JSON.parse(workflow.steps) 
                    : workflow.steps,
                status: workflow.status,
                current_step: currentExecution?.current_step || null,
                approval_required: workflow.approval_required === 1 || workflow.approval_required === true,
                approval_status: workflow.approval_status,
                created_at: workflow.created_at,
                updated_at: workflow.updated_at
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Workflows", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Workflows" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/orchestrator/workflows/[id]
 */
export async function PUT(
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
            user_id: session.userId.toString(),
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
        const body = await request.json();
        const connection = await getConnection();

        // Workflow abrufen
        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_workflows WHERE id = ?`,
            [workflowId]
        );

        const workflows = Array.isArray(rows) ? rows : [];
        if (workflows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Workflow nicht gefunden" },
                { status: 404 }
            );
        }

        // Update-Felder zusammenstellen
        const updateFields: string[] = [];
        const updateValues: unknown[] = [];

        if (body.name !== undefined) {
            updateFields.push("name = ?");
            updateValues.push(body.name);
        }
        if (body.description !== undefined) {
            updateFields.push("description = ?");
            updateValues.push(body.description);
        }
        if (body.steps !== undefined) {
            updateFields.push("steps = ?");
            updateValues.push(JSON.stringify(body.steps));
        }
        if (body.status !== undefined) {
            updateFields.push("status = ?");
            updateValues.push(body.status);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { success: false, message: "Keine Felder zum Aktualisieren" },
                { status: 400 }
            );
        }

        updateFields.push("updated_at = NOW()");
        updateValues.push(workflowId);

        await connection.execute(
            `UPDATE orchestrator_workflows 
             SET ${updateFields.join(", ")}
             WHERE id = ?`,
            updateValues
        );

        return NextResponse.json({
            success: true,
            data: {
                id: workflowId,
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Aktualisieren des Workflows", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Aktualisieren des Workflows" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/orchestrator/workflows/[id]
 */
export async function DELETE(
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
            user_id: session.userId.toString(),
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

        // Workflow abrufen
        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_workflows WHERE id = ?`,
            [workflowId]
        );

        const workflows = Array.isArray(rows) ? rows : [];
        if (workflows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Workflow nicht gefunden" },
                { status: 404 }
            );
        }

        // Workflow löschen (CASCADE löscht auch Executions)
        await connection.execute(
            `DELETE FROM orchestrator_workflows WHERE id = ?`,
            [workflowId]
        );

        return NextResponse.json({
            success: true,
            data: {
                id: workflowId,
                deleted_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Löschen des Workflows", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Löschen des Workflows" },
            { status: 500 }
        );
    }
}






