/**
 * Orchestrator Alert Escalate API - Enterprise++ Standard P8-C
 * 
 * POST /api/orchestrator/alerts/[id]/escalate - Alert eskaliert (Incident eröffnen)
 * 
 * RBAC: security.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

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
            resource: "security",
            action: "manage"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.manage" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const reason = body.reason || "Manuelle Eskalation";

        const incidentId = await alertEngine.escalate(params.id, String(session.userId), reason);

        const alert = await alertEngine.getAlert(params.id);

        return NextResponse.json({
            success: true,
            data: {
                alert_id: params.id,
                incident_id: incidentId,
                status: alert?.status,
                escalated_at: alert?.escalated_at,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Eskalieren des Alerts", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}





