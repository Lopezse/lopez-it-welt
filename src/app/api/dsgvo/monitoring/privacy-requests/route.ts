/**
 * DSGVO Monitoring Privacy Requests API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/monitoring/privacy-requests - Privacy-Request-Statistiken
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoMonitoringService } from "@/lib/dsgvo/monitoring-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/monitoring/privacy-requests
 * Gibt Privacy-Request-Statistiken zurück
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
             VALUES ('DATA_ACCESS', 'Privacy-Request Statistiken Abruf', 'dsgvo_monitoring', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        const stats = await dsgvoMonitoringService.getPrivacyRequestStats();

        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Privacy-Request-Statistiken", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Privacy-Request-Statistiken" },
            { status: 500 }
        );
    }
}



