// =====================================================
// PORTAL STATS API
// =====================================================
// GET /api/portal/stats
// Dashboard-Statistiken für Kunden
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
    const customerId = session.customer_id;

    // Projekte Stats
    const [projectStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM lopez_customer_projects WHERE customer_id = ?
    `, [customerId]);

    // Rechnungen Stats
    const [invoiceStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('sent', 'overdue') THEN 1 ELSE 0 END) as unpaid,
        COALESCE(SUM(gross_amount), 0) as total_amount
      FROM lopez_customer_invoices WHERE customer_id = ?
    `, [customerId]);

    // Tickets Stats
    const [ticketStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('open', 'in_progress') THEN 1 ELSE 0 END) as open
      FROM lopez_customer_tickets WHERE customer_id = ?
    `, [customerId]);

    // AI Usage Stats (aktueller Monat)
    const [aiStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as this_month,
        COALESCE(SUM(tokens_input + tokens_output), 0) as tokens_used,
        COALESCE(SUM(cost), 0) as total_cost
      FROM lopez_customer_ai_usage 
      WHERE customer_id = ? 
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [customerId]);

    // Letzte Aktivitäten
    let recentActivity: RowDataPacket[] = [];
    try {
      const [activity] = await pool.execute<RowDataPacket[]>(`
        (SELECT 'project' as type, name as title, created_at FROM lopez_customer_projects WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3)
        UNION ALL
        (SELECT 'ticket' as type, subject as title, created_at FROM lopez_customer_tickets WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3)
        UNION ALL
        (SELECT 'invoice' as type, invoice_number as title, created_at FROM lopez_customer_invoices WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3)
        ORDER BY created_at DESC LIMIT 5
      `, [customerId, customerId, customerId]);
      recentActivity = activity;
    } catch {
      // Falls UNION nicht funktioniert, ignorieren
    }

    return NextResponse.json({
      success: true,
      data: {
        projects: {
          total: Number(projectStats[0]?.total || 0),
          active: Number(projectStats[0]?.active || 0)
        },
        invoices: {
          total: Number(invoiceStats[0]?.total || 0),
          unpaid: Number(invoiceStats[0]?.unpaid || 0),
          total_amount: Number(invoiceStats[0]?.total_amount || 0)
        },
        tickets: {
          total: Number(ticketStats[0]?.total || 0),
          open: Number(ticketStats[0]?.open || 0)
        },
        ai_usage: {
          this_month: Number(aiStats[0]?.this_month || 0),
          tokens_used: Number(aiStats[0]?.tokens_used || 0),
          total_cost: Number(aiStats[0]?.total_cost || 0)
        },
        recent_activity: recentActivity
      }
    });

  } catch (error) {
    console.error("❌ Portal Stats Error:", error);
    return NextResponse.json({ success: false, error: "Fehler beim Laden" }, { status: 500 });
  }
}

