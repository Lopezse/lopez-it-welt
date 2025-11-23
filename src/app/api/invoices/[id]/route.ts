/**
 * GET /api/invoices/[id]
 * PUT /api/invoices/[id]
 * DELETE /api/invoices/[id]
 * Einzelrechnung verwalten (GoBD / §14 UStG)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    const connection = await createConnection();

    // Rechnung laden
    const [invoiceRows] = await connection.execute(
      `SELECT i.*, 
              c.company_name, c.vorname, c.nachname, c.email as customer_email,
              p.project_name, p.project_code
       FROM lopez_invoices i
       LEFT JOIN lopez_customers c ON i.customer_id = c.id
       LEFT JOIN lopez_projects p ON i.project_id = p.id
       WHERE i.id = ?`,
      [invoiceId],
    );

    const invoice = Array.isArray(invoiceRows) && invoiceRows.length > 0 ? invoiceRows[0] : null;

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 },
      );
    }

    // Positionen laden
    const [itemRows] = await connection.execute(
      "SELECT * FROM lopez_invoice_items WHERE invoice_id = ? ORDER BY pos",
      [invoiceId],
    );

    const items = Array.isArray(itemRows) ? itemRows : [];

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...invoice,
          items,
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Invoice API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Rechnung" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    const body = await request.json();
    const { issue_date, service_date, payment_terms, items, tax_rate } = body;

    const connection = await createConnection();

    // Summen neu berechnen
    let netAmount = 0;
    for (const item of items || []) {
      const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);
      netAmount += lineTotal;
    }
    const taxAmount = netAmount * ((tax_rate || 19.0) / 100);
    const grossAmount = netAmount + taxAmount;

    // Rechnung aktualisieren
    await connection.execute(
      `UPDATE lopez_invoices 
       SET issue_date = ?, service_date = ?, payment_terms = ?, tax_rate = ?, 
           net_amount = ?, tax_amount = ?, gross_amount = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        issue_date,
        service_date,
        payment_terms,
        tax_rate || 19.0,
        netAmount,
        taxAmount,
        grossAmount,
        invoiceId,
      ],
    );

    // Positionen löschen und neu einfügen
    await connection.execute("DELETE FROM lopez_invoice_items WHERE invoice_id = ?", [invoiceId]);

    if (items && Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);

        await connection.execute(
          `INSERT INTO lopez_invoice_items 
           (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            i + 1,
            item.item_text,
            item.qty,
            item.unit || "Stk",
            item.unit_price,
            lineTotal,
          ],
        );
      }
    }

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('INVOICE_UPDATE', 'lopez_invoices', ?, ?)`,
      [invoiceId, `Rechnung aktualisiert: ${invoiceId}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { message: "Rechnung erfolgreich aktualisiert" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Invoice API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren der Rechnung" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    const connection = await createConnection();

    // Audit-Log vor Löschung
    const [invoiceRows] = await connection.execute(
      "SELECT invoice_number FROM lopez_invoices WHERE id = ?",
      [invoiceId],
    );
    const invoice = Array.isArray(invoiceRows) && (invoiceRows[0] as any);

    // GoBD: Storno statt Löschung (Status setzen)
    await connection.execute(
      `UPDATE lopez_invoices 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = ?`,
      [invoiceId],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('INVOICE_CANCEL', 'lopez_invoices', ?, ?)`,
      [invoiceId, `Rechnung storniert: ${invoice?.invoice_number || invoiceId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { message: "Rechnung erfolgreich storniert" },
    });
  } catch (error) {
    console.error("❌ Invoice API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Stornieren der Rechnung" },
      { status: 500 },
    );
  }
}
