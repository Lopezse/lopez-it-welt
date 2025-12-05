/**
 * Orchestrator Alert Acknowledge API - Enterprise++ Standard P8-C
 * 
 * PATCH /api/orchestrator/alerts/[id]/ack - Alert bestätigen
 * 
 * RBAC: security.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

export async function PATCH(
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
            resource: "security",
            action: "manage"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.manage" },
                { status: 403 }
            );
        }

        await alertEngine.acknowledge(params.id, session.userId.toString());

        const alert = await alertEngine.getAlert(params.id);

        return NextResponse.json({
            success: true,
            data: {
                id: alert?.id,
                status: alert?.status,
                acknowledged_at: alert?.acknowledged_at,
                acknowledged_by: alert?.acknowledged_by,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Bestätigen des Alerts", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}





