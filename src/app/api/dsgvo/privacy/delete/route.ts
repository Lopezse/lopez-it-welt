/**
 * DSGVO Privacy Delete API - Enterprise++ Standard
 * 
 * POST /api/dsgvo/privacy/delete - Datenlöschung für Betroffenenanfrage (Art. 17 DSGVO)
 * 
 * WICHTIG: Pseudonymisierung statt Hard Delete (GoBD-konform)
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";

/**
 * POST /api/dsgvo/privacy/delete
 * Löscht alle personenbezogenen Daten eines Benutzers (Pseudonymisierung)
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

        // Privacy-Request erstellen
        await connection.execute(
            `INSERT INTO dsgvo_privacy_requests 
             (user_id, request_type, request_status, request_data, ip_address, user_agent)
             VALUES (?, 'deletion', 'processing', ?, ?, ?)`,
            [
                user_id,
                JSON.stringify({ deletion_type: "pseudonymization" }),
                ipAddress,
                userAgent
            ]
        );

        // Pseudonymisierung statt Hard Delete (GoBD-konform)
        // Benutzerdaten pseudonymisieren
        await connection.execute(
            `UPDATE lopez_enterprise_users 
             SET email = CONCAT('deleted_', id, '@deleted.local'),
                 username = CONCAT('deleted_', id),
                 first_name = 'Gelöscht',
                 last_name = 'Benutzer',
                 display_name = 'Gelöschter Benutzer',
                 password_hash = '',
                 salt = '',
                 pepper = '',
                 updated_at = NOW()
             WHERE id = ?`,
            [user_id]
        );

        // Consents löschen (können gelöscht werden)
        await connection.execute(
            `DELETE FROM dsgvo_consents WHERE user_id = ?`,
            [user_id]
        );

        // Privacy-Request aktualisieren
        await connection.execute(
            `UPDATE dsgvo_privacy_requests 
             SET request_status = 'completed', 
                 deletion_date = NOW(),
                 completed_at = NOW(),
                 updated_at = NOW()
             WHERE user_id = ? AND request_type = 'deletion' AND request_status = 'processing'`,
            [user_id]
        );

        // Audit-Log schreiben
        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (user_id, event_type, action, resource_type, data_category, ip_address, user_agent, result)
             VALUES (?, 'DELETE_COMPLETED', 'Data Deletion (Pseudonymization)', 'dsgvo_privacy_requests', 'personal_data', ?, ?, 'success')`,
            [user_id, ipAddress, userAgent]
        );

        logger.info(`Daten gelöscht (pseudonymisiert): ${user_id}`);

        return NextResponse.json({
            success: true,
            message: "Daten erfolgreich gelöscht (pseudonymisiert)"
        });
    } catch (error) {
        logger.error("Fehler beim Löschen der Daten", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Löschen der Daten" },
            { status: 500 }
        );
    }
}



