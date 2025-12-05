/**
 * Orchestrator Approvals Request API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/approvals/request - Approval-Request erstellen (automatisch)
 * 
 * RBAC: orchestrator.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

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

        const body = await request.json();

        // Validierung
        if (!body.use_case || !body.reason) {
            return NextResponse.json(
                { success: false, message: "use_case und reason sind erforderlich" },
                { status: 400 }
            );
        }

        // Approval-Request erstellen
        const requestId = await approvalManager.createApprovalRequest({
            use_case: body.use_case,
            request_type: body.request_type || 're_approval',
            reason: body.reason,
            change_type: body.change_type || undefined,
            requested_by: session.userId.toString()
        });

        return NextResponse.json({
            success: true,
            data: {
                approval_request_id: requestId,
                use_case: body.use_case,
                status: "pending",
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Approval-Requests", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Erstellen des Approval-Requests" 
            },
            { status: 500 }
        );
    }
}






