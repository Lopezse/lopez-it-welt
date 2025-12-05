/**
 * Orchestrator Events API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/events - Liste aller Events
 * POST /api/orchestrator/events - Event manuell erstellen (für Testing)
 * 
 * RBAC: orchestrator.view (GET), orchestrator.manage (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { auditManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { OrchestratorEvent } from "@/lib/ki-orchestrator/level2/types";

/**
 * GET /api/orchestrator/events
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

        // Filter aus Query-Parametern
        const { searchParams } = new URL(request.url);
        const eventType = searchParams.get("event_type");
        const startDate = searchParams.get("start_date");
        const endDate = searchParams.get("end_date");
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const events = await auditManager.getAuditLog({
            event_type: eventType || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            limit,
            offset
        });

        return NextResponse.json({
            success: true,
            data: {
                events,
                total: events.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Events", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Events" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orchestrator/events
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

        const body: OrchestratorEvent = await request.json();

        // Validierung
        if (!body.event_type) {
            return NextResponse.json(
                { success: false, message: "event_type ist erforderlich" },
                { status: 400 }
            );
        }

        // Event loggen
        await auditManager.logEvent(body);

        return NextResponse.json({
            success: true,
            data: {
                id: body.id,
                event_type: body.event_type,
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Events", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Erstellen des Events" 
            },
            { status: 500 }
        );
    }
}






