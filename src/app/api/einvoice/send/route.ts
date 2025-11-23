/**
 * POST /api/einvoice/send
 * E-Rechnung versenden (E-Mail)
 * Status: entwurf → versendet → zugestellt
 * Später: PEPPOL-Adapter
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { einvoice_id, recipient_email } = body;

    if (!einvoice_id || !recipient_email) {
      return NextResponse.json(
        { success: false, error: "einvoice_id und recipient_email sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // E-Rechnung laden
    const [einvoiceRows] = await connection.execute(
      `SELECT e.*, c.email as customer_email
       FROM einvoice_outbox e
       LEFT JOIN lopez_customers c ON e.customer_id = c.id
       WHERE e.id = ?`,
      [einvoice_id],
    );

    const einvoice =
      Array.isArray(einvoiceRows) && einvoiceRows.length > 0 ? einvoiceRows[0] : null;

    if (!einvoice) {
      return NextResponse.json(
        { success: false, error: "E-Rechnung nicht gefunden" },
        { status: 404 },
      );
    }

    const currentStatus = (einvoice as any).status;

    if (currentStatus !== "entwurf" && currentStatus !== "versendet") {
      return NextResponse.json(
        {
          success: false,
          error: `E-Rechnung kann nicht versendet werden (Status: ${currentStatus})`,
        },
        { status: 400 },
      );
    }

    // TODO: E-Mail-Versand (Nodemailer)
    // Für jetzt: Status ändern
    const newStatus = "versendet";

    await connection.execute(
      `UPDATE einvoice_outbox 
       SET status = ?
       WHERE id = ?`,
      [newStatus, einvoice_id],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('EINVOICE_SEND', 'einvoice_outbox', ?, ?)`,
      [einvoice_id, `E-Rechnung versendet an: ${recipient_email}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          einvoice_id,
          recipient_email,
          status: newStatus,
          message: "E-Rechnung erfolgreich versendet",
          note: "Für vollständigen E-Mail-Versand muss Nodemailer-Integration implementiert werden. Später: PEPPOL-Adapter",
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ E-Rechnung Send API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Versenden der E-Rechnung" },
      { status: 500 },
    );
  }
}
