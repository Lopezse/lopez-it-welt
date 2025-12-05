import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/reports/revenue
 * 
 * Gibt Umsatz-Daten für 2025 zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date") || "2025-01-01";
    const endDate = searchParams.get("end_date") || "2025-12-31";
    const groupBy = searchParams.get("group_by") || "month"; // month, week, day

    const connection = await mysql.createConnection(dbConfig);

    // Umsatz-Daten aus Rechnungen laden
    let query = `
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        SUM(gross_amount) as revenue,
        COUNT(*) as invoice_count,
        SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END) as paid_revenue,
        SUM(CASE WHEN status IN ('sent', 'draft') THEN gross_amount ELSE 0 END) as pending_revenue
      FROM lopez_invoices
      WHERE created_at >= ? AND created_at <= ?
      GROUP BY period
      ORDER BY period
    `;

    let dateFormat = "%Y-%m";
    if (groupBy === "week") {
      dateFormat = "%Y-%u";
    } else if (groupBy === "day") {
      dateFormat = "%Y-%m-%d";
    }

    const [revenueData] = await connection.execute(query, [dateFormat, startDate, endDate]);

    // Gesamt-Statistik
    const [totalStats] = await connection.execute(
      `SELECT 
        SUM(gross_amount) as total_revenue,
        COUNT(*) as total_invoices,
        SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status IN ('sent', 'draft') THEN gross_amount ELSE 0 END) as total_pending
       FROM lopez_invoices
       WHERE created_at >= ? AND created_at <= ?`,
      [startDate, endDate],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        revenue_data: revenueData || [],
        total_stats: (totalStats as any[])[0] || {},
        period: { start_date: startDate, end_date: endDate, group_by: groupBy },
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Umsatz-Daten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Umsatz-Daten" },
      { status: 500 },
    );
  }
}
