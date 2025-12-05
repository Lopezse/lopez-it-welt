/**
 * DSGVO Privacy Export API - Enterprise++ Standard
 * 
 * POST /api/dsgvo/privacy/export - Datenexport für Betroffenenanfrage (Art. 15 DSGVO)
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * POST /api/dsgvo/privacy/export
 * Exportiert alle personenbezogenen Daten eines Benutzers
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id } = body;

        if (!user_id) {
            return NextResponse.json(
                { success: false, message: "user_id erforderlich" },
                { status: 400 }
            );
        }

        const connection = await getConnection();
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        // Alle personenbezogenen Daten sammeln
        const exportData: Record<string, unknown> = {};

        // Benutzerdaten
        const [users] = await connection.execute(
            `SELECT id, username, email, first_name, last_name, display_name, created_at, updated_at
             FROM lopez_enterprise_users
             WHERE id = ?`,
            [user_id]
        );
        exportData.user = (users as any[])[0] || null;

        // Consents
        const [consents] = await connection.execute(
            `SELECT * FROM dsgvo_consents WHERE user_id = ?`,
            [user_id]
        );
        exportData.consents = consents;

        // Audit-Logs (nur DSGVO-relevante)
        const [auditLogs] = await connection.execute(
            `SELECT * FROM dsgvo_audit_events WHERE user_id = ? ORDER BY created_at DESC`,
            [user_id]
        );
        exportData.audit_logs = auditLogs;

        // Privacy-Requests
        const [privacyRequests] = await connection.execute(
            `SELECT * FROM dsgvo_privacy_requests WHERE user_id = ? ORDER BY created_at DESC`,
            [user_id]
        );
        exportData.privacy_requests = privacyRequests;

        // Export-Datei erstellen
        const exportDir = join(process.cwd(), "exports", "dsgvo");
        await mkdir(exportDir, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `dsgvo-export-${user_id}-${timestamp}.json`;
        const filepath = join(exportDir, filename);

        await writeFile(filepath, JSON.stringify(exportData, null, 2), "utf-8");

        // Privacy-Request speichern
        await connection.execute(
            `INSERT INTO dsgvo_privacy_requests 
             (user_id, request_type, request_status, request_data, export_file_path, ip_address, user_agent)
             VALUES (?, 'access', 'completed', ?, ?, ?, ?)`,
            [
                user_id,
                JSON.stringify({ export_type: "data_access" }),
                filepath,
                ipAddress,
                userAgent
            ]
        );

        // Audit-Log schreiben
        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (user_id, event_type, action, resource_type, data_category, ip_address, user_agent, result)
             VALUES (?, 'EXPORT_DONE', 'Data Export', 'dsgvo_privacy_requests', 'personal_data', ?, ?, 'success')`,
            [user_id, ipAddress, userAgent]
        );

        return NextResponse.json({
            success: true,
            data: {
                export_file: filename,
                export_path: filepath,
                export_data: exportData
            }
        });
    } catch (error) {
        logger.error("Fehler beim Exportieren der Daten", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Exportieren der Daten" },
            { status: 500 }
        );
    }
}



