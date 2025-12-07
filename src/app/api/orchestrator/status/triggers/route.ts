/**
 * Orchestrator Status Triggers API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/status/triggers - Trigger-Status abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

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

        const connection = await getConnection();

        // Alle Trigger abrufen
        const allTriggers = await triggerEngine.getTriggers({});
        const activeTriggers = allTriggers.filter(t => t.enabled);
        const disabledTriggers = allTriggers.filter(t => !t.enabled);

        // Trigger-Firings heute zählen
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [firedRows] = await connection.execute(
            `SELECT COUNT(*) as count FROM orchestrator_events 
             WHERE event_type = 'ORCH_TRIGGER_FIRED' 
             AND timestamp >= ?`,
            [today.toISOString()]
        );

        const triggersFiredToday = Array.isArray(firedRows) && firedRows.length > 0
            ? (firedRows[0] as any).count
            : 0;

        // Trigger nach Typ gruppieren
        const triggersByType: Record<string, number> = {};
        allTriggers.forEach(trigger => {
            triggersByType[trigger.type] = (triggersByType[trigger.type] || 0) + 1;
        });

        return NextResponse.json({
            success: true,
            data: {
                total_triggers: allTriggers.length,
                active_triggers: activeTriggers.length,
                disabled_triggers: disabledTriggers.length,
                triggers_fired_today: triggersFiredToday,
                triggers_by_type: triggersByType
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Trigger-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Trigger-Status" },
            { status: 500 }
        );
    }
}






