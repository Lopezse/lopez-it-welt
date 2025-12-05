/**
 * Orchestrator Workflows API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/workflows - Liste aller Workflows
 * POST /api/orchestrator/workflows - Neuen Workflow erstellen
 * 
 * RBAC: orchestrator.view (GET), orchestrator.manage (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { workflowManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { WorkflowDefinition } from "@/lib/ki-orchestrator/level2/types";

/**
 * GET /api/orchestrator/workflows
 */
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

        // Filter aus Query-Parametern
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const workflows = await workflowManager.getWorkflows({
            status: status as any,
            limit,
            offset
        });

        return NextResponse.json({
            success: true,
            data: {
                workflows,
                total: workflows.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Workflows", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Workflows" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orchestrator/workflows
 */
export async function POST(request: NextRequest) {
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

        const body: WorkflowDefinition = await request.json();

        // Validierung
        if (!body.name || !body.steps || body.steps.length === 0) {
            return NextResponse.json(
                { success: false, message: "Name und steps sind erforderlich" },
                { status: 400 }
            );
        }

        const workflowId = await workflowManager.createWorkflow({
            ...body,
            created_by: session.userId.toString()
        });

        return NextResponse.json({
            success: true,
            data: {
                id: workflowId,
                name: body.name,
                status: "draft",
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Workflows", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Erstellen des Workflows" 
            },
            { status: 500 }
        );
    }
}






