/**
 * DSGVO Monitoring Status API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/monitoring/status - Gesamtdashboard-Status
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoMonitoringService } from "@/lib/dsgvo/monitoring-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/monitoring/status
 * Gibt den Gesamtstatus der DSGVO-Compliance zurück
 */
export async function GET(request: NextRequest) {
    try {
        // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
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
             VALUES ('DATA_ACCESS', 'DSGVO Status Abruf', 'dsgvo_monitoring', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        const status = await dsgvoMonitoringService.getDSGVOStatus();

        return NextResponse.json({
            success: true,
            data: status
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des DSGVO-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des DSGVO-Status" },
            { status: 500 }
        );
    }
}



