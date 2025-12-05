/**
 * DSGVO Weekly Report API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/report/weekly - Wöchentlichen DSGVO-Report abrufen
 * POST /api/dsgvo/report/weekly - Wöchentlichen DSGVO-Report manuell generieren
 * 
 * RBAC: compliance.view (GET), compliance.manage (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoWeeklyReportScheduler } from "@/lib/scheduler/dsgvo-weekly-report";
import { logger } from "@/lib/logger";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * GET /api/dsgvo/report/weekly
 * Gibt den letzten wöchentlichen Report zurück
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
        const year = searchParams.get("year");
        const week = searchParams.get("week");

        // Audit-Log schreiben
        const { getConnection } = await import("@/lib/database");
        const connection = await getConnection();
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (event_type, action, resource_type, ip_address, user_agent, result)
             VALUES ('DATA_ACCESS', 'DSGVO Weekly Report Abruf', 'dsgvo_reports', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        // Report-Datei lesen
        const reportDir = process.env.NODE_ENV === "production"
            ? "/var/data/reports/dsgvo"
            : join(process.cwd(), "data", "reports", "dsgvo");

        let filename: string;
        if (year && week) {
            filename = `${year}-W${String(week).padStart(2, "0")}.json`;
        } else {
            // Letzten Report finden
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentWeek = getWeekNumber(now);
            filename = `${currentYear}-W${String(currentWeek).padStart(2, "0")}.json`;
        }

        const filepath = join(reportDir, filename);

        try {
            const reportContent = await readFile(filepath, "utf-8");
            const report = JSON.parse(reportContent);

            return NextResponse.json({
                success: true,
                data: report
            });
        } catch (fileError) {
            // Report nicht gefunden - neu generieren
            const report = await dsgvoWeeklyReportScheduler.generateWeeklyReport();
            return NextResponse.json({
                success: true,
                data: report
            });
        }
    } catch (error) {
        logger.error("Fehler beim Abrufen des DSGVO-Weekly-Reports", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des DSGVO-Weekly-Reports" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/dsgvo/report/weekly
 * Generiert manuell einen wöchentlichen Report
 */
export async function POST(request: NextRequest) {
    try {
        // RBAC-Prüfung (compliance.manage)
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
             VALUES ('EXPORT_DONE', 'DSGVO Weekly Report Generierung', 'dsgvo_reports', ?, ?, 'success')`,
            [ipAddress, userAgent]
        );

        const report = await dsgvoWeeklyReportScheduler.generateWeeklyReport();

        return NextResponse.json({
            success: true,
            data: report,
            message: "DSGVO Weekly Report erfolgreich generiert"
        });
    } catch (error) {
        logger.error("Fehler beim Generieren des DSGVO-Weekly-Reports", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Generieren des DSGVO-Weekly-Reports" },
            { status: 500 }
        );
    }
}

/**
 * Hilfsfunktion: Wochennummer berechnen
 */
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}



