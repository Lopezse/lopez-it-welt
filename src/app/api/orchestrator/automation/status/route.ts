/**
 * Orchestrator Automation Status API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/automation/status - Automation-Status abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { automationEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

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

        const { searchParams } = new URL(request.url);
        const useCase = searchParams.get("use_case") || undefined;

        const status = await automationEngine.getAutomationStatus(useCase);

        return NextResponse.json({
            success: true,
            data: status
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Automation-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Automation-Status" },
            { status: 500 }
        );
    }
}






