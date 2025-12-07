/**
 * DSGVO Approvals API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/approvals - Liste aller Freigaben
 * POST /api/dsgvo/approvals - Neue Freigabe erstellen
 * 
 * RBAC: compliance.view (GET), compliance.manage (POST)
 * 
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalService, ApprovalData } from "@/lib/dsgvo/approval-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { AdminAuthService } from "@/lib/admin-auth-service";

/**
 * GET /api/dsgvo/approvals
 * Listet alle Freigaben mit optionalen Filtern
 */
export async function GET(request: NextRequest) {
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

        // RBAC-Prüfung: compliance.view
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId,
            resource: "compliance",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für compliance.view" },
                { status: 403 }
            );
        }

        // Filter aus Query-Parametern
        const { searchParams } = new URL(request.url);
        const riskCategory = searchParams.get("risk_category") as any;
        const approvalStatus = searchParams.get("approval_status") as any;
        const useCaseId = searchParams.get("use_case_id");
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
        const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

        const filters = {
            risk_category: riskCategory,
            approval_status: approvalStatus,
            use_case_id: useCaseId || undefined,
            limit,
            offset
        };

        const approvals = await approvalService.listApprovals(filters);

        return NextResponse.json({
            success: true,
            data: approvals
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Freigaben", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Freigaben" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/dsgvo/approvals
 * Erstellt eine neue Freigabe
 */
export async function POST(request: NextRequest) {
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

        // RBAC-Prüfung: compliance.manage
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId,
            resource: "compliance",
            action: "manage"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für compliance.manage" },
                { status: 403 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const approvalData: ApprovalData = {
            use_case_id: body.use_case_id,
            use_case_name: body.use_case_name,
            risk_category: body.risk_category,
            risk_score: body.risk_score,
            approval_status: body.approval_status || "pending",
            approval_reason: body.approval_reason,
            approval_conditions: body.approval_conditions,
            measures_package: body.measures_package,
            review_date: body.review_date
        };

        // Validierung
        if (!approvalData.use_case_name || !approvalData.risk_category || approvalData.risk_score === undefined) {
            return NextResponse.json(
                { success: false, message: "Pflichtfelder fehlen: use_case_name, risk_category, risk_score" },
                { status: 400 }
            );
        }

        // Gemäß Review: Risk-Score-Validierung
        const riskValidation = approvalService.validateRiskScore(approvalData.risk_category, approvalData.risk_score);
        if (!riskValidation.valid) {
            return NextResponse.json(
                { success: false, message: riskValidation.error || "Ungültiger Risk-Score" },
                { status: 400 }
            );
        }

        // IP-Adresse und User-Agent extrahieren
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        // Freigabe erstellen
        const approval = await approvalService.createApproval(
            approvalData,
            session.userId.toString(),
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            data: approval
        }, { status: 201 });
    } catch (error) {
        logger.error("Fehler beim Erstellen der Freigabe", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Erstellen der Freigabe" },
            { status: 500 }
        );
    }
}

