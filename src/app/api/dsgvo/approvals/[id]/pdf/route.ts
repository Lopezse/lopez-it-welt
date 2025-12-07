/**
 * DSGVO Approval PDF Export - Enterprise++ Standard
 * 
 * GET /api/dsgvo/approvals/[id]/pdf - PDF-Export der Freigabe
 * 
 * RBAC: compliance.view
 * 
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

import { NextRequest, NextResponse } from "next/server";
import { approvalService } from "@/lib/dsgvo/approval-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { AdminAuthService } from "@/lib/admin-auth-service";
import jsPDF from "jspdf";

/**
 * GET /api/dsgvo/approvals/[id]/pdf
 * Generiert ein PDF der Freigabe
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

        const approvalId = params.id;
        const approval = await approvalService.getApproval(approvalId);

        if (!approval) {
            return NextResponse.json(
                { success: false, message: "Freigabe nicht gefunden" },
                { status: 404 }
            );
        }

        // PDF generieren
        const doc = new jsPDF("p", "mm", "a4");
        let yPos = 20;

        // Header
        doc.setFontSize(20);
        doc.text("P7-MANUAL-APPROVAL", 105, yPos, { align: "center" });
        yPos += 10;

        doc.setFontSize(16);
        doc.text("DSFA-Freigabedokument", 105, yPos, { align: "center" });
        yPos += 10;

        doc.setFontSize(12);
        doc.text("Lopez IT Welt – Enterprise++ KI-Governance", 105, yPos, { align: "center" });
        yPos += 15;

        // Use-Case Information
        doc.setFontSize(14);
        doc.text("Use-Case Information", 20, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.text(`Use-Case Name: ${approval.use_case_name}`, 20, yPos);
        yPos += 6;

        if (approval.use_case_id) {
            doc.text(`Use-Case ID: ${approval.use_case_id}`, 20, yPos);
            yPos += 6;
        }

        doc.text(`Risikokategorie: ${approval.risk_category.toUpperCase()}`, 20, yPos);
        yPos += 6;

        doc.text(`Risikowert: ${approval.risk_score}`, 20, yPos);
        yPos += 6;

        doc.text(`Status: ${approval.approval_status}`, 20, yPos);
        yPos += 10;

        // Entscheidungsmatrix
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.text("Entscheidungsmatrix", 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        const criteria = [
            "Maßnahmen erfüllt",
            "Risiko ≤ High",
            "DSFA dokumentiert",
            "DSGVO-Firewall aktiv",
            "QualityGate aktiv",
            "Audit-Log aktiv"
        ];

        criteria.forEach((criterion) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`☐ ${criterion}`, 25, yPos);
            yPos += 6;
        });

        yPos += 5;

        // Signaturfelder
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.text("Signaturfelder", 20, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.text("DSFA-Verantwortlicher:", 20, yPos);
        doc.text(approval.approved_by_dsfa ? "✓ Signiert" : "☐ Ausstehend", 100, yPos);
        yPos += 8;

        if (approval.risk_category === "high" || approval.risk_category === "critical") {
            doc.text("Datenschutzbeauftragter:", 20, yPos);
            doc.text(approval.approved_by_dsb ? "✓ Signiert" : "☐ Ausstehend (erforderlich)", 100, yPos);
            yPos += 8;
        }

        doc.text("Systemarchitekt:", 20, yPos);
        doc.text(approval.approved_by_architect ? "✓ Signiert" : "☐ Optional", 100, yPos);
        yPos += 10;

        // Begründung
        if (approval.approval_reason) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text("Begründung", 20, yPos);
            yPos += 8;

            doc.setFontSize(10);
            const reasonLines = doc.splitTextToSize(approval.approval_reason, 170);
            doc.text(reasonLines, 20, yPos);
            yPos += reasonLines.length * 5 + 5;
        }

        // Bedingungen
        if (approval.approval_conditions) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text("Bedingungen", 20, yPos);
            yPos += 8;

            doc.setFontSize(10);
            const conditionLines = doc.splitTextToSize(approval.approval_conditions, 170);
            doc.text(conditionLines, 20, yPos);
            yPos += conditionLines.length * 5 + 5;
        }

        // Audit-Hash
        if (approval.audit_hash) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text("Audit-Hash (SHA-256)", 20, yPos);
            yPos += 8;

            doc.setFontSize(9);
            doc.setFont("courier");
            const hashLines = doc.splitTextToSize(approval.audit_hash, 170);
            doc.text(hashLines, 20, yPos);
            doc.setFont("helvetica");
        }

        // Footer auf jeder Seite
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Seite ${i} von ${pageCount} - Generiert am ${new Date().toLocaleDateString("de-DE")}`,
                105,
                285,
                { align: "center" }
            );
        }

        // PDF als Buffer generieren
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="approval-${approvalId}.pdf"`,
                "Content-Length": pdfBuffer.length.toString()
            }
        });
    } catch (error) {
        logger.error("Fehler beim Generieren des PDFs", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Generieren des PDFs" },
            { status: 500 }
        );
    }
}






