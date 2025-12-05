/**
 * GoBD Verify Invoice API - Enterprise++ Standard E.2.2
 * 
 * GET /api/compliance/gobd/verify-invoice/[id] - Rechnungs-Hash-Verifikation
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";
import { calculateInvoiceHash, createHashDataFromInvoice } from "@/lib/invoice-hash";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Rechnung laden
    const [invoiceRows] = await connection.execute(
      "SELECT id, invoice_number, issue_date, gross_amount, customer_id, status, hash_sha256 FROM lopez_invoices WHERE id = ?",
      [invoiceId]
    );

    const invoice = Array.isArray(invoiceRows) && invoiceRows.length > 0 ? invoiceRows[0] : null;

    if (!invoice) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const inv = invoice as any;

    // Hash berechnen
    const hashData = createHashDataFromInvoice({
      invoice_date: inv.issue_date,
      amount: inv.gross_amount?.toString() || "0.00",
      recipient: inv.customer_id?.toString() || "",
      status: inv.status || "draft",
    });
    const calculatedHash = calculateInvoiceHash(hashData);
    const storedHash = inv.hash_sha256 || "";

    const match = calculatedHash === storedHash;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('GOBD_HASH_VERIFY', 'lopez_invoices', ?, ?)`,
      [invoiceId, `Hash-Verifikation: ${match ? "erfolgreich" : "fehlgeschlagen"}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoiceId,
        calculated_hash: calculatedHash,
        stored_hash: storedHash,
        match,
        verified_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler bei der Rechnungs-Hash-Verifikation", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Hash-Verifikation" },
      { status: 500 }
    );
  }
}



