/**
 * Orchestrator Incident Detail API - Enterprise++ Standard P8-C
 * 
 * GET /api/orchestrator/incidents/[id] - Incident-Detail abrufen
 * 
 * RBAC: security.view
 */

import { NextRequest, NextResponse } from "next/server";
import { incidentManager } from "@/lib/ki-orchestrator/level2";
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
            user_id: session.userId.toString(),
            resource: "security",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.view" },
                { status: 403 }
            );
        }

        const incident = await incidentManager.getIncident(params.id);

        if (!incident) {
            return NextResponse.json(
                { success: false, message: "Incident nicht gefunden" },
                { status: 404 }
            );
        }

        // Get related alerts
        const connection = await getConnection();
        const [alertRows] = await connection.execute<{ id: string; title: string }[]>(
            `SELECT id, title FROM orchestrator_alerts WHERE incident_id = ?`,
            [params.id]
        );
        const alerts = Array.isArray(alertRows) ? alertRows : [];

        // Get incident events (timeline)
        const events = await incidentManager.getIncidentEvents(params.id);

        return NextResponse.json({
            success: true,
            data: {
                ...incident,
                alerts,
                events,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Incident-Details", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}





