/**
 * Orchestrator Workflow Start API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/workflows/[id]/start - Workflow starten
 * 
 * RBAC: orchestrator.manage
 * 
 * P7-Approval-Prüfung: Vor dem Start wird geprüft, ob der Workflow/Use-Case
 * über P7 manuell freigegeben wurde und der Risk-Level nicht über der
 * freigegebenen Kategorie liegt.
 */

import { NextRequest, NextResponse } from "next/server";
import { workflowManager } from "@/lib/ki-orchestrator/level2";
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

        const workflowId = params.id;
        const body = await request.json();
        const payload = body.payload || {};

        // Workflow abrufen um Use-Case zu extrahieren
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT * FROM orchestrator_workflows WHERE id = ?`,
            [workflowId]
        );

        const workflows = Array.isArray(rows) ? rows : [];
        if (workflows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Workflow nicht gefunden" },
                { status: 404 }
            );
        }

        const workflow = workflows[0] as any;

        // Use-Case extrahieren (aus Payload, Steps oder Workflow-Name)
        let useCase: string | null = null;
        
        // 1. Explizites use_case Feld im Workflow (falls vorhanden)
        if (workflow.use_case && workflow.use_case !== 'unknown') {
            useCase = workflow.use_case;
        }

        // 2. Payload.use_case
        if (!useCase && payload.use_case && payload.use_case !== 'unknown') {
            useCase = payload.use_case as string;
        }

        // 3. Steps[0].use_case oder Steps[0].agent
        if (!useCase) {
            const steps = typeof workflow.steps === 'string' 
                ? JSON.parse(workflow.steps) 
                : workflow.steps;
            
            if (Array.isArray(steps) && steps.length > 0) {
                const firstStep = steps[0];
                if (firstStep.use_case && firstStep.use_case !== 'unknown') {
                    useCase = firstStep.use_case;
                } else if (firstStep.agent && firstStep.agent !== 'unknown') {
                    // Agent-Name zu Use-Case mappen
                    const agent = firstStep.agent.toLowerCase();
                    if (agent.includes('media')) useCase = 'media-ki';
                    else if (agent.includes('content')) useCase = 'content-agent';
                    else if (agent.includes('compliance')) useCase = 'compliance-agent';
                }
            }
        }

        // 4. Workflow-Name (Pattern-Matching)
        if (!useCase) {
            const workflowName = (workflow.name || '').toLowerCase();
            if (workflowName.includes('media')) useCase = 'media-ki';
            else if (workflowName.includes('content')) useCase = 'content-agent';
            else if (workflowName.includes('compliance')) useCase = 'compliance-agent';
        }

        // Use-Case-Validierung: "unknown" oder null nicht zulassen
        if (!useCase || useCase === 'unknown') {
            // Audit-Log: USE_CASE_UNKNOWN
            await auditManager.logEvent({
                event_type: "ORCH_USE_CASE_UNKNOWN",
                resource_type: "workflow",
                resource_id: workflowId,
                details: {
                    workflow_name: workflow.name,
                    reason: "Use-Case konnte nicht ermittelt werden"
                }
            });

            return NextResponse.json(
                { 
                    success: false, 
                    message: "Workflow kann nicht gestartet werden: Use-Case konnte nicht ermittelt werden. Bitte Use-Case explizit im Workflow oder Payload angeben.",
                    error_code: "USE_CASE_UNKNOWN",
                    workflow_id: workflowId
                },
                { status: 403 }
            );
        }

        // P7-Approval-Status prüfen
        const approvalStatus = await approvalManager.checkApprovalStatus(useCase);

        // Prüfe ob Approval-Status gültig ist
        if (!approvalStatus.can_execute || 
            approvalStatus.approval_status === 'rejected' || 
            approvalStatus.approval_status === 'expired' ||
            approvalStatus.approval_status === 'not_required') {
            
            // Audit-Log: WORKFLOW_START_BLOCKED
            await auditManager.logEvent({
                event_type: "ORCH_WORKFLOW_START_BLOCKED",
                resource_type: "workflow",
                resource_id: workflowId,
                details: {
                    use_case: useCase,
                    approval_status: approvalStatus.approval_status,
                    reason: approvalStatus.reason || "Keine gültige P7-Freigabe",
                    workflow_name: workflow.name
                }
            });

            return NextResponse.json(
                { 
                    success: false, 
                    message: `Workflow kann nicht gestartet werden: ${approvalStatus.reason || "Keine gültige P7-Freigabe für Use-Case " + useCase}`,
                    error_code: "APPROVAL_REQUIRED",
                    approval_status: approvalStatus.approval_status,
                    use_case: useCase
                },
                { status: 403 }
            );
        }

        // Workflow starten
        const executionId = await workflowManager.startWorkflow(workflowId, payload);

        return NextResponse.json({
            success: true,
            data: {
                workflow_id: workflowId,
                execution_id: executionId,
                status: "active",
                started_at: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Starten des Workflows", error);
        
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
                message: error instanceof Error ? error.message : "Fehler beim Starten des Workflows" 
            },
            { status: 500 }
        );
    }
}

