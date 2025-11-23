/**
 * PUT /api/invoices/status
 * Status ändern (draft → sent → paid)
 * GoBD: Audit-Trail erforderlich
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  calculateInvoiceHash,
  createHashDataFromInvoice,
} from "@/lib/invoice-hash";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, status } = body;

    if (!invoice_id || !status) {
      return NextResponse.json(
        { success: false, error: "invoice_id und status sind erforderlich" },
        { status: 400 },
      );
    }

    const validStatuses = ["draft", "sent", "paid", "overdue", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Ungültiger Status. Erlaubt: ${validStatuses.join(", ")}` },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // Alten Status laden
    const [invoiceRows] = await connection.execute(
      "SELECT invoice_number, status, issue_date, gross_amount, customer_id FROM lopez_invoices WHERE id = ?",
      [invoice_id],
    );

    const invoice = Array.isArray(invoiceRows) && invoiceRows.length > 0 ? invoiceRows[0] : null;

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 },
      );
    }

    const oldStatus = (invoice as any).status;

    // Hash neu berechnen (Status hat sich geändert)
    const hashData = createHashDataFromInvoice({
      ...invoice,
      status: status, // Neuer Status
    });
    const newHash = calculateInvoiceHash(hashData);

    // Status ändern + Hash aktualisieren
    await connection.execute(
      `UPDATE lopez_invoices 
       SET status = ?, hash_sha256 = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, newHash, invoice_id],
    );

    // Audit-Log (GoBD: Alle Status-Änderungen protokollieren)
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('INVOICE_STATUS_CHANGE', 'lopez_invoices', ?, ?)`,
      [
        invoice_id,
        `Status geändert: ${oldStatus} → ${status} (Rechnung: ${(invoice as any).invoice_number})`,
      ],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          invoice_id,
          old_status: oldStatus,
          new_status: status,
          message: "Status erfolgreich geändert",
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Invoice Status API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Ändern des Status" },
      { status: 500 },
    );
  }
}

      },
    );
  } catch (error) {
    console.error("❌ Invoice Status API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Ändern des Status" },
      { status: 500 },
    );
  }
}
