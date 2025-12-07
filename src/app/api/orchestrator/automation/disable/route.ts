/**
 * Orchestrator Automation Disable API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/automation/disable - Automation deaktivieren
 * 
 * RBAC: orchestrator.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { automationEngine } from "@/lib/ki-orchestrator/level2";
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

        const body = await request.json();

        // Validierung
        if (!body.use_case) {
            return NextResponse.json(
                { success: false, message: "use_case ist erforderlich" },
                { status: 400 }
            );
        }

        // Automation deaktivieren
        await automationEngine.disableAutomation(body.use_case);

        return NextResponse.json({
            success: true,
            data: {
                use_case: body.use_case,
                automation_enabled: false,
                disabled_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Deaktivieren der Automation", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Deaktivieren der Automation" 
            },
            { status: 500 }
        );
    }
}






