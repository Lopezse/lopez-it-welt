/**
 * Orchestrator Event Detail API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/events/[id] - Event-Detail abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
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
            resource: "orchestrator",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.view" },
                { status: 403 }
            );
        }

        const eventId = params.id;
        const connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_events WHERE id = ?`,
            [eventId]
        );

        const events = Array.isArray(rows) ? rows : [];
        if (events.length === 0) {
            return NextResponse.json(
                { success: false, message: "Event nicht gefunden" },
                { status: 404 }
            );
        }

        const event = events[0] as any;

        return NextResponse.json({
            success: true,
            data: {
                id: event.id,
                event_type: event.event_type,
                resource_type: event.resource_type,
                resource_id: event.resource_id,
                details: typeof event.details === 'string' 
                    ? JSON.parse(event.details) 
                    : event.details,
                audit_hash: event.audit_hash,
                timestamp: event.timestamp
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Events", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Events" },
            { status: 500 }
        );
    }
}






