/**
 * Orchestrator Incidents API - Enterprise++ Standard P8-C
 * 
 * GET /api/orchestrator/incidents - Liste aller Incidents
 * POST /api/orchestrator/incidents - Neuen Incident erstellen
 * 
 * RBAC: security.view (GET), security.manage (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { incidentManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { IncidentData } from "@/lib/ki-orchestrator/level2/types";

/**
 * GET /api/orchestrator/incidents
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
            user_id: session.userId,
            resource: "security",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.view" },
                { status: 403 }
            );
        }

        // Filter aus Query-Parametern
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const severity = searchParams.get("severity");
        const assigned_to = searchParams.get("assigned_to");
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const result = await incidentManager.listIncidents({
            status: status || undefined,
            severity: severity || undefined,
            assigned_to: assigned_to || undefined,
            limit: Math.min(limit, 1000),
            offset,
        });

        return NextResponse.json({
            success: true,
            data: {
                incidents: result.incidents,
                total: result.total,
                limit,
                offset,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Incidents", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orchestrator/incidents
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

        // Validierung
        if (!body.title || !body.severity) {
            return NextResponse.json(
                { success: false, message: "title und severity sind erforderlich" },
                { status: 400 }
            );
        }

        const incidentData: IncidentData = {
            title: body.title,
            description: body.description,
            severity: body.severity,
            alert_ids: body.alert_ids,
            sla_minutes: body.sla_minutes,
        };

        const incidentId = await incidentManager.createIncident(incidentData, String(session.userId));

        const incident = await incidentManager.getIncident(incidentId);

        return NextResponse.json({
            success: true,
            data: {
                id: incidentId,
                status: incident?.status,
                sla_minutes: incident?.sla_minutes,
                sla_started_at: incident?.sla_started_at,
                opened_at: incident?.opened_at,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Incidents", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}





