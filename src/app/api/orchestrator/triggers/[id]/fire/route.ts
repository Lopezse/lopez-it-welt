/**
 * Orchestrator Trigger Fire API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/triggers/[id]/fire - Trigger manuell auslösen
 * 
 * RBAC: orchestrator.manage
 */

/**
 * Orchestrator Trigger Fire API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/triggers/[id]/fire - Trigger manuell auslösen
 * 
 * RBAC: orchestrator.manage
 * 
 * P7-Approval-Prüfung: Vor dem Auslösen wird geprüft, ob der zugehörige Use-Case
 * eine gültige P7-Freigabe hat.
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerEngine } from "@/lib/ki-orchestrator/level2";
import { approvalManager } from "@/lib/ki-orchestrator/level2";
import { auditManager } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

export async function POST(
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
            user_id: session.userId,
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
        const context = body.context || {};

        // Trigger abrufen um Use-Case zu extrahieren
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

        // Use-Case extrahieren (aus Context, Actions oder Trigger-Name)
        let useCase: string | null = null;
        
        // 1. Explizites use_case Feld im Trigger (falls vorhanden)
        if (trigger.use_case && trigger.use_case !== 'unknown') {
            useCase = trigger.use_case;
        }

        // 2. Context.use_case
        if (!useCase && context.use_case && context.use_case !== 'unknown') {
            useCase = context.use_case as string;
        }

        // 3. Actions[0].use_case oder Actions[0].agent
        if (!useCase) {
            const actions = typeof trigger.actions === 'string' 
                ? JSON.parse(trigger.actions) 
                : trigger.actions;
            
            if (Array.isArray(actions) && actions.length > 0) {
                const firstAction = actions[0];
                if (firstAction.use_case && firstAction.use_case !== 'unknown') {
                    useCase = firstAction.use_case;
                } else if (firstAction.agent && firstAction.agent !== 'unknown') {
                    // Agent-Name zu Use-Case mappen
                    const agent = firstAction.agent.toLowerCase();
                    if (agent.includes('media')) useCase = 'media-ki';
                    else if (agent.includes('content')) useCase = 'content-agent';
                    else if (agent.includes('compliance')) useCase = 'compliance-agent';
                }
            }
        }

        // 4. Trigger-Name (Pattern-Matching)
        if (!useCase) {
            const triggerName = (trigger.name || '').toLowerCase();
            if (triggerName.includes('media')) useCase = 'media-ki';
            else if (triggerName.includes('content')) useCase = 'content-agent';
            else if (triggerName.includes('compliance')) useCase = 'compliance-agent';
        }

        // Use-Case-Validierung: "unknown" oder null nicht zulassen
        if (!useCase || useCase === 'unknown') {
            // Audit-Log: USE_CASE_UNKNOWN
            await auditManager.logEvent({
                event_type: "ORCH_USE_CASE_UNKNOWN",
                resource_type: "trigger",
                resource_id: triggerId,
                details: {
                    trigger_name: trigger.name,
                    reason: "Use-Case konnte nicht ermittelt werden"
                }
            });

            return NextResponse.json(
                { 
                    success: false, 
                    message: "Trigger kann nicht ausgelöst werden: Use-Case konnte nicht ermittelt werden. Bitte Use-Case explizit im Trigger oder Context angeben.",
                    error_code: "USE_CASE_UNKNOWN",
                    trigger_id: triggerId
                },
                { status: 403 }
            );
        }

        // P7-Approval-Status prüfen
        const approvalStatus = await approvalManager.checkApprovalStatus(useCase);

        // Prüfe ob Approval-Status gültig ist
        if (!approvalStatus.can_execute || 
            approvalStatus.approval_status === 'rejected' || 
            approvalStatus.approval_status === 'expired') {
            
            // Audit-Log: FIRE_BLOCKED
            await auditManager.logEvent({
                event_type: "ORCH_TRIGGER_FIRE_BLOCKED",
                resource_type: "trigger",
                resource_id: triggerId,
                details: {
                    use_case: useCase,
                    approval_status: approvalStatus.approval_status,
                    reason: approvalStatus.reason || "Keine gültige P7-Freigabe",
                    trigger_name: trigger.name
                }
            });

            return NextResponse.json(
                { 
                    success: false, 
                    message: `Trigger kann nicht ausgelöst werden: ${approvalStatus.reason || "Keine gültige P7-Freigabe für Use-Case " + useCase}`,
                    error_code: "APPROVAL_REQUIRED",
                    approval_status: approvalStatus.approval_status,
                    use_case: useCase
                },
                { status: 403 }
            );
        }

        // Trigger auslösen
        await triggerEngine.fireTrigger(triggerId, context);

        return NextResponse.json({
            success: true,
            data: {
                trigger_id: triggerId,
                fired_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Auslösen des Triggers", error);
        
        // Prüfe ob es ein Approval-Fehler ist
        if (error instanceof Error && error.message.includes("Approval")) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: error.message,
                    error_code: "APPROVAL_REQUIRED"
                },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "Fehler beim Auslösen des Triggers" 
            },
            { status: 500 }
        );
    }
}

