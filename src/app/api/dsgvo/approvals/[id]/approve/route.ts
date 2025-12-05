/**
 * DSGVO Approval Approve API - Enterprise++ Standard
 * 
 * POST /api/dsgvo/approvals/[id]/approve - Freigabe erteilen
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
 * POST /api/dsgvo/approvals/[id]/approve
 * Erteilt eine Freigabe (mit Rollen-basierter Signatur)
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
        if (!body.role || !["dsfa", "dsb", "architect"].includes(body.role)) {
            return NextResponse.json(
                { success: false, message: "Ungültige Rolle. Erlaubt: dsfa, dsb, architect" },
                { status: 400 }
            );
        }

        if (!body.reason) {
            return NextResponse.json(
                { success: false, message: "Begründung (reason) ist erforderlich" },
                { status: 400 }
            );
        }

        // Gemäß Review: Rollenvalidierung - User-Rolle muss mit body.role übereinstimmen
        const userRoles = await RBACService.getUserRoles(session.userId);
        const roleNames = userRoles.map(r => r.name?.toLowerCase() || "");
        
        // Prüfe ob User die entsprechende Rolle hat
        const roleMapping: Record<string, string[]> = {
            "dsfa": ["dsfa", "dsfa-verantwortlicher", "dsfa verantwortlicher"],
            "dsb": ["dsb", "datenschutzbeauftragter", "datenschutz beauftragter"],
            "architect": ["architect", "systemarchitekt", "system architekt", "system-architekt"]
        };

        const allowedRoles = roleMapping[body.role] || [];
        const hasRole = roleNames.some(r => allowedRoles.includes(r)) || 
                       roleNames.some(r => r.includes(body.role));

        if (!hasRole) {
            return NextResponse.json(
                { success: false, message: `Sie haben nicht die erforderliche Rolle '${body.role}'. Ihre Rollen: ${roleNames.join(", ")}` },
                { status: 403 }
            );
        }

        // IP-Adresse und User-Agent extrahieren
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        // Freigabe erteilen
        const approval = await approvalService.approveApproval(
            approvalId,
            session.userId.toString(),
            body.role,
            body.reason,
            body.conditions,
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            data: approval
        });
    } catch (error: any) {
        logger.error("Fehler beim Erteilen der Freigabe", error);
        return NextResponse.json(
            { success: false, message: error.message || "Fehler beim Erteilen der Freigabe" },
            { status: 500 }
        );
    }
}

