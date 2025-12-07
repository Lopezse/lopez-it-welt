// =====================================================
// PORTAL RECHNUNGEN API
// =====================================================
// GET /api/portal/rechnungen - Rechnungsliste
// =====================================================

import { NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    if (!session.valid || !session.customer_id) {
      return NextResponse.json({ success: false, error: "Ungültige Session" }, { status: 401 });
    }

    const pool = await getConnection();
    const [invoices] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        i.id, i.invoice_number, i.net_amount, i.tax_rate, i.tax_amount, 
        i.gross_amount, i.invoice_date, i.due_date, i.status, i.paid_at,
        i.pdf_path, i.line_items, i.notes,
        p.name as project_name
      FROM lopez_customer_invoices i
      LEFT JOIN lopez_customer_projects p ON i.project_id = p.id
      WHERE i.customer_id = ?
      ORDER BY i.invoice_date DESC
    `, [session.customer_id]);

    // Line items parsen
    const parsed = invoices.map(inv => ({
      ...inv,
      line_items: typeof inv.line_items === 'string' 
        ? JSON.parse(inv.line_items) 
        : (inv.line_items || [])
    }));

    return NextResponse.json({
      success: true,
      data: parsed,
      total: parsed.length
    });

  } catch (error) {
    console.error("❌ Rechnungen Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}







