// =====================================================
// ADMIN INVOICE DETAIL API
// =====================================================
// GET /api/admin/invoices/[id] - Details
// PATCH /api/admin/invoices/[id] - Update / Status-Wechsel
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { InvoiceService, InvoiceStatus } from "@/lib/customer/invoice-service";

// GET - Rechnungsdetails
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id, 10);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige ID" },
        { status: 400 }
      );
    }

    const invoice = await InvoiceService.getById(invoiceId);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error("❌ Admin Invoice GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler" },
      { status: 500 }
    );
  }
}

// PATCH - Update oder Status-Wechsel
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id, 10);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // TODO: Admin-User-ID aus Session holen (Phase 1.6)
    const adminUserId = 1; // Placeholder

    // Status-Wechsel?
    if (body.status) {
      const validStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: "Ungültiger Status" },
          { status: 400 }
        );
      }

      const result = await InvoiceService.changeStatus(invoiceId, body.status, adminUserId);
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      const invoice = await InvoiceService.getById(invoiceId);
      return NextResponse.json({
        success: true,
        message: `Status geändert zu '${body.status}'`,
        data: invoice
      });
    }

    // Normale Aktualisierung
    const result = await InvoiceService.update(invoiceId, body, adminUserId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const invoice = await InvoiceService.getById(invoiceId);
    return NextResponse.json({
      success: true,
      message: "Rechnung aktualisiert",
      data: invoice
    });

  } catch (error) {
    console.error("❌ Admin Invoice PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler" },
      { status: 500 }
    );
  }
}

