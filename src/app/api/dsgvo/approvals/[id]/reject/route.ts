/**
 * DSGVO Approval Reject API - Enterprise++ Standard
 * 
 * POST /api/dsgvo/approvals/[id]/reject - Freigabe ablehnen
 * 
 * RBAC: compliance.approve
 * 
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalService } from "@/lib/dsgvo/approval-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { AdminAuthService } from "@/lib/admin-auth-service";

/**
 * POST /api/dsgvo/approvals/[id]/reject
 * Lehnt eine Freigabe ab
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authentifizierung prüfen
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

        // RBAC-Prüfung: compliance.approve
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId.toString(),
            resource: "compliance",
            action: "approve"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für compliance.approve" },
                { status: 403 }
            );
        }

        const approvalId = params.id;
        const body = await request.json();

        // Validierung
        if (!body.reason) {
            return NextResponse.json(
                { success: false, message: "Begründung (reason) ist erforderlich" },
                { status: 400 }
            );
        }

        // IP-Adresse und User-Agent extrahieren
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        // Freigabe ablehnen
        const approval = await approvalService.rejectApproval(
            approvalId,
            session.userId.toString(),
            body.reason,
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            data: approval
        });
    } catch (error: any) {
        logger.error("Fehler beim Ablehnen der Freigabe", error);
        return NextResponse.json(
            { success: false, message: error.message || "Fehler beim Ablehnen der Freigabe" },
            { status: 500 }
        );
    }
}






