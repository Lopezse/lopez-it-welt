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
 * GET /api/admin/reports/backups
 * 
 * Gibt Backup-Verlauf-Daten zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");

    const connection = await mysql.createConnection(dbConfig);

    // Backup-Verlauf laden
    let query = `
      SELECT 
        id,
        backup_type,
        status,
        file_size,
        created_at,
        completed_at,
        error_message
      FROM lopez_backups
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const [backupHistory] = await connection.execute(query, [limit]);

    // Backup-Statistik
    const [backupStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_backups,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_backups,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_backups,
        SUM(file_size) as total_size,
        MAX(created_at) as last_backup
       FROM lopez_backups`,
    );

    // Backup-Status nach Monat
    const [backupByMonth] = await connection.execute(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as backup_count,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count
       FROM lopez_backups
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`,
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        backup_history: backupHistory || [],
        backup_stats: (backupStats as any[])[0] || {},
        backup_by_month: backupByMonth || [],
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Backup-Daten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Backup-Daten" },
      { status: 500 },
    );
  }
}
