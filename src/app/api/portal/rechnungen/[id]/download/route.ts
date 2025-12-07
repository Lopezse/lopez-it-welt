// =====================================================
// RECHNUNG PDF DOWNLOAD (KUNDE)
// =====================================================
// GET /api/portal/rechnungen/[id]/download
// Geschützter Download - nur für berechtigte Kunden
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { InvoiceService } from "@/lib/customer/invoice-service";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id, 10);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Rechnungs-ID" },
        { status: 400 }
      );
    }

    // Session prüfen
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    // Berechtigungsprüfung
    const canAccess = await InvoiceService.canCustomerAccess(invoiceId, session.customer_id);
    if (!canAccess) {
      return NextResponse.json(
        { success: false, error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Rechnung laden
    const invoice = await InvoiceService.getById(invoiceId);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    // PDF-Pfad prüfen
    if (!invoice.pdf_path) {
      return NextResponse.json(
        { success: false, error: "PDF noch nicht generiert" },
        { status: 404 }
      );
    }

    // PDF-Datei lesen
    const storagePath = path.join(process.cwd(), 'storage', 'invoices', invoice.pdf_path);
    
    try {
      const pdfBuffer = await readFile(storagePath);

      // PDF als Download zurückgeben
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
          'Cache-Control': 'private, max-age=3600'
        }
      });

    } catch (fileError) {
      console.error("❌ PDF File Error:", fileError);
      return NextResponse.json(
        { success: false, error: "PDF-Datei nicht verfügbar" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("❌ Invoice Download Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}







