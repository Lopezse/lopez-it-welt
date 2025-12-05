/**
 * Orchestrator Trigger Detail API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/triggers/[id] - Trigger-Detail abrufen
 * PUT /api/orchestrator/triggers/[id] - Trigger aktualisieren
 * DELETE /api/orchestrator/triggers/[id] - Trigger löschen
 * 
 * RBAC: orchestrator.view (GET), orchestrator.manage (PUT, DELETE)
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerEngine } from "@/lib/ki-orchestrator/level2";
import { approvalManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

/**
 * GET /api/orchestrator/triggers/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const triggerId = params.id;
        const connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_triggers WHERE id = ?`,
            [triggerId]
        );

        const triggers = Array.isArray(rows) ? rows : [];
        if (triggers.length === 0) {
            return NextResponse.json(
                { success: false, message: "Trigger nicht gefunden" },
                { status: 404 }
            );
        }

        const trigger = triggers[0] as any;

        return NextResponse.json({
            success: true,
            data: {
                id: trigger.id,
                name: trigger.name,
                type: trigger.type,
                event_type: trigger.event_type,
                conditions: typeof trigger.conditions === 'string' 
                    ? JSON.parse(trigger.conditions) 
                    : trigger.conditions,
                actions: typeof trigger.actions === 'string' 
                    ? JSON.parse(trigger.actions) 
                    : trigger.actions,
                enabled: trigger.enabled === 1 || trigger.enabled === true,
                approval_required: trigger.approval_required === 1 || trigger.approval_required === true,
                approval_status: trigger.approval_status,
                created_at: trigger.created_at,
                updated_at: trigger.updated_at
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Triggers", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Triggers" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/orchestrator/triggers/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const triggerId = params.id;
        const body = await request.json();
        const connection = await getConnection();

        // Trigger abrufen
        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_triggers WHERE id = ?`,
            [triggerId]
        );

        const triggers = Array.isArray(rows) ? rows : [];
        if (triggers.length === 0) {
            return NextResponse.json(
                { success: false, message: "Trigger nicht gefunden" },
                { status: 404 }
            );
        }

        const trigger = triggers[0] as any;

        // Re-Approval prüfen (wenn approval_required)
        if (trigger.approval_required && trigger.approval_status === 'approved') {
            // Re-Approval erforderlich bei Änderungen
            await approvalManager.createApprovalRequest({
                use_case: `trigger-${triggerId}`,
                request_type: 're_approval',
                reason: "Trigger wurde geändert",
                change_type: 'trigger_update',
                requested_by: session.userId.toString()
            });

            // Approval-Status auf pending setzen
            await connection.execute(
                `UPDATE orchestrator_triggers 
                 SET approval_status = 'pending', updated_at = NOW()
                 WHERE id = ?`,
                [triggerId]
            );
        }

        // Update-Felder zusammenstellen
        const updateFields: string[] = [];
        const updateValues: unknown[] = [];

        if (body.name !== undefined) {
            updateFields.push("name = ?");
            updateValues.push(body.name);
        }
        if (body.enabled !== undefined) {
            updateFields.push("enabled = ?");
            updateValues.push(body.enabled);
        }
        if (body.conditions !== undefined) {
            updateFields.push("conditions = ?");
            updateValues.push(JSON.stringify(body.conditions));
        }
        if (body.actions !== undefined) {
            updateFields.push("actions = ?");
            updateValues.push(JSON.stringify(body.actions));
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { success: false, message: "Keine Felder zum Aktualisieren" },
                { status: 400 }
            );
        }

        updateFields.push("updated_at = NOW()");
        updateValues.push(triggerId);

        await connection.execute(
            `UPDATE orchestrator_triggers 
             SET ${updateFields.join(", ")}
             WHERE id = ?`,
            updateValues
        );

        return NextResponse.json({
            success: true,
            data: {
                id: triggerId,
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Aktualisieren des Triggers", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Aktualisieren des Triggers" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/orchestrator/triggers/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const triggerId = params.id;
        const connection = await getConnection();

        // Trigger abrufen
        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_triggers WHERE id = ?`,
            [triggerId]
        );

        const triggers = Array.isArray(rows) ? rows : [];
        if (triggers.length === 0) {
            return NextResponse.json(
                { success: false, message: "Trigger nicht gefunden" },
                { status: 404 }
            );
        }

        const trigger = triggers[0] as any;

        // Re-Approval prüfen (wenn Trigger aktiv war)
        if (trigger.enabled && trigger.approval_required) {
            await approvalManager.createApprovalRequest({
                use_case: `trigger-${triggerId}`,
                request_type: 're_approval',
                reason: "Trigger wurde gelöscht",
                change_type: 'trigger_deletion',
                requested_by: session.userId.toString()
            });
        }

        // Trigger löschen
        await connection.execute(
            `DELETE FROM orchestrator_triggers WHERE id = ?`,
            [triggerId]
        );

        return NextResponse.json({
            success: true,
            data: {
                id: triggerId,
                deleted_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Löschen des Triggers", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Löschen des Triggers" },
            { status: 500 }
        );
    }
}






