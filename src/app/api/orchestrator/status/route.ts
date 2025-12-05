/**
 * Orchestrator Status API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/status - Gesamt-Status abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { automationEngine } from "@/lib/ki-orchestrator/level2";
import { triggerEngine } from "@/lib/ki-orchestrator/level2";
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

        // Trigger-Status
        const triggers = await triggerEngine.getTriggers({ enabled: true });
        const triggersActive = triggers.length;

        // Workflow-Status
        const workflows = await workflowManager.getWorkflows({ status: 'active' });
        const workflowsActive = workflows.length;

        // Queue-Status
        const [queueRows] = await connection.execute(
            `SELECT 
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as waiting,
                SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
             FROM orchestrator_tasks`
        );

        const queueStatus = Array.isArray(queueRows) && queueRows.length > 0 
            ? queueRows[0] as any
            : { waiting: 0, active: 0, completed: 0, failed: 0 };

        // Automation-Status
        const automationStatus = await automationEngine.getAutomationStatus();

        return NextResponse.json({
            success: true,
            data: {
                orchestrator_level: 2,
                automation_enabled: automationStatus.automation_enabled,
                triggers_active: triggersActive,
                workflows_active: workflowsActive,
                queue_status: {
                    waiting: queueStatus.waiting || 0,
                    active: queueStatus.active || 0,
                    completed: queueStatus.completed || 0,
                    failed: queueStatus.failed || 0
                },
                last_updated: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Status" },
            { status: 500 }
        );
    }
}






