/**
 * DSGVO Monitoring KI-Usage API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/monitoring/ki-usage - KI-Verarbeitung-Übersicht
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoMonitoringService } from "@/lib/dsgvo/monitoring-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/monitoring/ki-usage
 * Gibt KI-Verarbeitung-Übersicht zurück
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

        // Audit-Log schreiben
        const { getConnection } = await import("@/lib/database");
        const connection = await getConnection();
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (event_type, action, resource_type, ip_address, user_agent, result)
             VALUES ('DATA_ACCESS', 'KI-Verarbeitung Übersicht Abruf', 'dsgvo_monitoring', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        const overview = await dsgvoMonitoringService.getKIProcessingOverview();

        return NextResponse.json({
            success: true,
            data: overview
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der KI-Verarbeitung-Übersicht", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der KI-Verarbeitung-Übersicht" },
            { status: 500 }
        );
    }
}



