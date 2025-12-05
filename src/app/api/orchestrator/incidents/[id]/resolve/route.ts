/**
 * Orchestrator Incident Resolve API - Enterprise++ Standard P8-C
 * 
 * POST /api/orchestrator/incidents/[id]/resolve - Incident auflösen
 * 
 * RBAC: security.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { incidentManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { ResolutionData } from "@/lib/ki-orchestrator/level2/types";

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

        const body = await request.json();

        // Validierung
        if (!body.resolution) {
            return NextResponse.json(
                { success: false, message: "resolution ist erforderlich" },
                { status: 400 }
            );
        }

        const resolutionData: ResolutionData = {
            resolution: body.resolution,
            root_cause: body.root_cause,
            verification: body.verification || false,
        };

        await incidentManager.resolve(params.id, resolutionData, session.userId.toString());

        const incident = await incidentManager.getIncident(params.id);

        return NextResponse.json({
            success: true,
            data: {
                id: params.id,
                status: incident?.status,
                resolved_at: incident?.resolved_at,
                resolved_by: incident?.resolved_by,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Auflösen des Incidents", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}





