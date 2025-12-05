/**
 * Orchestrator Triggers API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/triggers - Liste aller Trigger
 * POST /api/orchestrator/triggers - Neuen Trigger erstellen
 * 
 * RBAC: orchestrator.view (GET), orchestrator.manage (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { TriggerDefinition } from "@/lib/ki-orchestrator/level2/types";

/**
 * GET /api/orchestrator/triggers
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
        const enabled = searchParams.get("enabled");
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const triggers = await triggerEngine.getTriggers({
            enabled: enabled ? enabled === "true" : undefined,
            type: type as any,
            limit,
            offset
        });

        return NextResponse.json({
            success: true,
            data: {
                triggers,
                total: triggers.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Trigger", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Trigger" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orchestrator/triggers
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

        const body: TriggerDefinition = await request.json();

        // Validierung
        if (!body.name || !body.type || !body.actions) {
            return NextResponse.json(
                { success: false, message: "Name, type und actions sind erforderlich" },
                { status: 400 }
            );
        }

        const triggerId = await triggerEngine.registerTrigger({
            ...body,
            created_by: session.userId.toString()
        });

        return NextResponse.json({
            success: true,
            data: {
                id: triggerId,
                name: body.name,
                status: "active",
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Triggers", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Erstellen des Triggers" 
            },
            { status: 500 }
        );
    }
}






