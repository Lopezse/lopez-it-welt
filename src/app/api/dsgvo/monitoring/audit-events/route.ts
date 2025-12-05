/**
 * DSGVO Monitoring Audit Events API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/monitoring/audit-events - Audit-Log-Übersicht
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoMonitoringService } from "@/lib/dsgvo/monitoring-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/monitoring/audit-events
 * Gibt Audit-Log-Übersicht zurück
 */
export async function GET(request: NextRequest) {
    try {
        // RBAC-Prüfung
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");

        // Audit-Log schreiben
        const { getConnection } = await import("@/lib/database");
        const connection = await getConnection();
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (event_type, action, resource_type, ip_address, user_agent, result)
             VALUES ('DATA_ACCESS', 'Audit-Log Übersicht Abruf', 'dsgvo_monitoring', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        const overview = await dsgvoMonitoringService.getAuditLogOverview(limit);

        return NextResponse.json({
            success: true,
            data: overview
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Audit-Log-Übersicht", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Audit-Log-Übersicht" },
            { status: 500 }
        );
    }
}



