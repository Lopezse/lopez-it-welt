/**
 * Orchestrator Approvals Check API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/approvals/check - Approval-Status für Use-Case prüfen
 * 
 * RBAC: orchestrator.view
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
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.view" },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Validierung
        if (!body.use_case) {
            return NextResponse.json(
                { success: false, message: "use_case ist erforderlich" },
                { status: 400 }
            );
        }

        // Approval-Status prüfen
        const approvalStatus = await approvalManager.checkApprovalStatus(body.use_case);

        return NextResponse.json({
            success: true,
            data: approvalStatus
        });
    } catch (error) {
        logger.error("Fehler beim Prüfen des Approval-Status", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Prüfen des Approval-Status" 
            },
            { status: 500 }
        );
    }
}






