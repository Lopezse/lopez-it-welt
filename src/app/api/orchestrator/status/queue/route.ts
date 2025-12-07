/**
 * Orchestrator Status Queue API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/status/queue - Queue-Status abrufen (erweitert)
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
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

        // Queue-Status nach Priorität
        const queues: Record<string, { waiting: number; active: number; completed: number }> = {
            critical: { waiting: 0, active: 0, completed: 0 },
            high: { waiting: 0, active: 0, completed: 0 },
            medium: { waiting: 0, active: 0, completed: 0 },
            low: { waiting: 0, active: 0, completed: 0 },
            background: { waiting: 0, active: 0, completed: 0 }
        };

        // Prüfe ob orchestrator_tasks Tabelle existiert
        try {
            const [rows] = await connection.execute(
                `SELECT 
                    priority,
                    SUM(CASE WHEN status = 'pending' OR status = 'queued' THEN 1 ELSE 0 END) as waiting,
                    SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                 FROM orchestrator_tasks
                 GROUP BY priority`
            );

            const queueData = Array.isArray(rows) ? rows : [];
            
            queueData.forEach((row: any) => {
                const priority = row.priority || 'medium';
                if (queues[priority]) {
                    queues[priority] = {
                        waiting: row.waiting || 0,
                        active: row.active || 0,
                        completed: row.completed || 0
                    };
                }
            });
        } catch (error) {
            // Tabelle existiert möglicherweise nicht, verwende Default-Werte
            logger.debug("orchestrator_tasks Tabelle nicht gefunden, verwende Default-Werte");
        }

        // Gesamt-Status
        const totalWaiting = Object.values(queues).reduce((sum, q) => sum + q.waiting, 0);
        const totalActive = Object.values(queues).reduce((sum, q) => sum + q.active, 0);
        const totalCompleted = Object.values(queues).reduce((sum, q) => sum + q.completed, 0);

        // Failed Tasks zählen
        let totalFailed = 0;
        try {
            const [failedRows] = await connection.execute(
                `SELECT COUNT(*) as count FROM orchestrator_tasks WHERE status = 'failed'`
            );
            totalFailed = Array.isArray(failedRows) && failedRows.length > 0
                ? (failedRows[0] as any).count
                : 0;
        } catch (error) {
            // Ignoriere Fehler
        }

        return NextResponse.json({
            success: true,
            data: {
                queue_enabled: true,
                queues,
                total_waiting: totalWaiting,
                total_active: totalActive,
                total_completed: totalCompleted,
                total_failed: totalFailed
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Queue-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Queue-Status" },
            { status: 500 }
        );
    }
}






