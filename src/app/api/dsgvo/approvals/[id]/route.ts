/**
 * DSGVO Approval Detail API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/approvals/[id] - Freigabe-Detail abrufen
 * PUT /api/dsgvo/approvals/[id] - Freigabe aktualisieren
 * 
 * RBAC: compliance.view (GET), compliance.manage (PUT)
 * 
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalService, ApprovalData } from "@/lib/dsgvo/approval-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { getConnection } from "@/lib/database";

/**
 * GET /api/dsgvo/approvals/[id]
 * Ruft eine Freigabe-Detail ab
 */
export async function GET(
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

        // RBAC-Prüfung: compliance.view
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId.toString(),
            resource: "compliance",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für compliance.view" },
                { status: 403 }
            );
        }

        const approvalId = params.id;
        const approval = await approvalService.getApproval(approvalId);

        if (!approval) {
            return NextResponse.json(
                { success: false, message: "Freigabe nicht gefunden" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: approval
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Freigabe", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Freigabe" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/dsgvo/approvals/[id]
 * Aktualisiert eine Freigabe
 */
export async function PUT(
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

        // RBAC-Prüfung: compliance.manage
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId.toString(),
            resource: "compliance",
            action: "manage"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für compliance.manage" },
                { status: 403 }
            );
        }

        const approvalId = params.id;
        const body = await request.json();

        // Gemäß Review: approval_status darf nicht über PUT geändert werden
        if (body.approval_status !== undefined) {
            return NextResponse.json(
                { success: false, message: "approval_status kann nicht über PUT geändert werden. Verwenden Sie /approve oder /reject Endpunkte." },
                { status: 400 }
            );
        }

        // Bestehende Freigabe abrufen
        const existingApproval = await approvalService.getApproval(approvalId);
        if (!existingApproval) {
            return NextResponse.json(
                { success: false, message: "Freigabe nicht gefunden" },
                { status: 404 }
            );
        }

        // Risk-Score-Validierung wenn risk_category oder risk_score geändert wird
        if (body.risk_category !== undefined || body.risk_score !== undefined) {
            const riskCategory = body.risk_category || existingApproval.risk_category;
            const riskScore = body.risk_score !== undefined ? body.risk_score : existingApproval.risk_score;
            const validation = approvalService.validateRiskScore(riskCategory, riskScore);
            if (!validation.valid) {
                return NextResponse.json(
                    { success: false, message: validation.error || "Ungültiger Risk-Score" },
                    { status: 400 }
                );
            }
        }

        // Update-Felder
        const connection = await getConnection();
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (body.use_case_name !== undefined) {
            updateFields.push("use_case_name = ?");
            updateValues.push(body.use_case_name);
        }
        if (body.risk_category !== undefined) {
            updateFields.push("risk_category = ?");
            updateValues.push(body.risk_category);
        }
        if (body.risk_score !== undefined) {
            updateFields.push("risk_score = ?");
            updateValues.push(body.risk_score);
        }
        if (body.approval_reason !== undefined) {
            updateFields.push("approval_reason = ?");
            updateValues.push(body.approval_reason);
        }
        if (body.approval_conditions !== undefined) {
            updateFields.push("approval_conditions = ?");
            updateValues.push(body.approval_conditions);
        }
        if (body.measures_package !== undefined) {
            updateFields.push("measures_package = ?");
            updateValues.push(body.measures_package);
        }
        if (body.review_date !== undefined) {
            updateFields.push("review_date = ?");
            updateValues.push(body.review_date);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { success: false, message: "Keine Felder zum Aktualisieren" },
                { status: 400 }
            );
        }

        updateFields.push("updated_at = ?");
        updateValues.push(new Date());
        updateValues.push(approvalId);

        // Update durchführen
        await connection.execute(
            `UPDATE dsgvo_approvals SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues
        );

        // Audit-Hash neu generieren (vollständig)
        const updatedApproval = await approvalService.getApproval(approvalId);
        if (updatedApproval) {
            const newHash = approvalService.generateFullApprovalHash(updatedApproval);

            await connection.execute(
                `UPDATE dsgvo_approvals SET audit_hash = ? WHERE id = ?`,
                [newHash, approvalId]
            );

            updatedApproval.audit_hash = newHash;
        }

        // IP-Adresse und User-Agent extrahieren
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        // Audit-Log
        const { dsgvoAuditLogger } = await import("@/lib/dsgvo/audit-logger");
        await dsgvoAuditLogger.logApprovalUpdated(
            session.userId.toString(),
            approvalId,
            updatedApproval?.use_case_name || existingApproval.use_case_name,
            body,
            ipAddress,
            userAgent
        );

        return NextResponse.json({
            success: true,
            data: updatedApproval
        });
    } catch (error) {
        logger.error("Fehler beim Aktualisieren der Freigabe", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Aktualisieren der Freigabe" },
            { status: 500 }
        );
    }
}

