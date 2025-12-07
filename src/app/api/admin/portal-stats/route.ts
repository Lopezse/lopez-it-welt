// =====================================================
// ADMIN PORTAL STATISTICS API
// =====================================================
// GET /api/admin/portal-stats - Dashboard-Statistiken für Portal
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('portal.stats.view')
// 3. Audit-Logging: logAdminAction('PORTAL_STATS_VIEW', userId)
// -----------------------------------------------------

// GET - Portal-Statistiken für Admin-Dashboard
export async function GET(request: NextRequest) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, 1y

    const pool = await getConnection();

    // Zeitraum berechnen
    let daysAgo = 30;
    switch (period) {
      case "7d":
        daysAgo = 7;
        break;
      case "30d":
        daysAgo = 30;
        break;
      case "90d":
        daysAgo = 90;
        break;
      case "1y":
        daysAgo = 365;
        break;
    }

    // Kunden-Statistiken
    const [customerStats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 ELSE 0 END) as new_in_period,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN two_factor_enabled = 1 THEN 1 ELSE 0 END) as with_2fa,
        SUM(CASE WHEN onboarding_completed = 1 THEN 1 ELSE 0 END) as onboarded
      FROM lopez_customers
      WHERE status != 'deleted'
    `,
      [daysAgo]
    );

    // Rechnungs-Statistiken
    const [invoiceStats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue,
        COALESCE(SUM(gross_amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN status IN ('sent', 'overdue') THEN gross_amount ELSE 0 END), 0) as open_amount,
        COUNT(CASE WHEN invoice_date >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 END) as new_in_period
      FROM lopez_customer_invoices
    `,
      [daysAgo]
    );

    // Ticket-Statistiken
    const [ticketStats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'waiting_customer' THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status IN ('resolved', 'closed') THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 END) as new_in_period
      FROM lopez_customer_tickets
    `,
      [daysAgo]
    );

    // Projekt-Statistiken
    const [projectStats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 END) as new_in_period
      FROM lopez_customer_projects
    `,
      [daysAgo]
    );

    // AI-Usage Statistiken
    const [aiStats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total_requests,
        COALESCE(SUM(tokens_input + tokens_output), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as total_cost,
        COUNT(DISTINCT customer_id) as customers_using_ai
      FROM lopez_customer_ai_usage
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `,
      [daysAgo]
    );

    // Trend-Daten (Registrierungen pro Tag)
    const [registrationTrend] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM lopez_customers
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND status != 'deleted'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      [daysAgo]
    );

    // Revenue-Trend (bezahlte Rechnungen pro Tag)
    const [revenueTrend] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        DATE(paid_at) as date,
        COUNT(*) as count,
        SUM(gross_amount) as amount
      FROM lopez_customer_invoices
      WHERE paid_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND status = 'paid'
      GROUP BY DATE(paid_at)
      ORDER BY date ASC
    `,
      [daysAgo]
    );

    return NextResponse.json({
      success: true,
      period,
      data: {
        customers: customerStats[0] || {},
        invoices: invoiceStats[0] || {},
        tickets: ticketStats[0] || {},
        projects: projectStats[0] || {},
        ai_usage: aiStats[0] || {},
        trends: {
          registrations: registrationTrend,
          revenue: revenueTrend,
        },
      },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Admin Portal Stats GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Statistiken" },
      { status: 500 }
    );
  }
}







