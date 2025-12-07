/**
 * Orchestrator Approvals Status API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/approvals/status - Approval-Status für Use-Cases abrufen
 * 
 * RBAC: orchestrator.view
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalManager } from "@/lib/ki-orchestrator/level2";
import { approvalService } from "@/lib/dsgvo/approval-service";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
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
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für orchestrator.view" },
                { status: 403 }
            );
        }

        // Alle Approvals abrufen
        const approvals = await approvalService.listApprovals({});

        const useCases = approvals.map(approval => {
            const approvedBy: string[] = [];
            if (approval.approved_by_dsfa) approvedBy.push(approval.approved_by_dsfa);
            if (approval.approved_by_dsb) approvedBy.push(approval.approved_by_dsb);
            if (approval.approved_by_architect) approvedBy.push(approval.approved_by_architect);

            // Ablaufdatum berechnen (6 Monate)
            const approvalDate = approval.approval_date ? new Date(approval.approval_date) : null;
            const expiresAt = approvalDate 
                ? new Date(approvalDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
                : undefined;

            return {
                use_case: approval.use_case_id || approval.use_case_name,
                approval_status: approval.approval_status === 'approved' ? 'approved' : 
                                 approval.approval_status === 'pending' ? 'pending' :
                                 approval.approval_status === 'rejected' ? 'rejected' : 'not_required',
                approval_date: approval.approval_date?.toISOString(),
                approved_by: approvedBy,
                expires_at: expiresAt?.toISOString()
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                use_cases: useCases
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Approval-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Approval-Status" },
            { status: 500 }
        );
    }
}






