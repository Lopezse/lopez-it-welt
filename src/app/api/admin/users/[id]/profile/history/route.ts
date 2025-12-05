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
 * GET /api/admin/users/[id]/profile/history
 * 
 * Lädt die Versionshistorie eines Benutzerprofils.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Tabelle existiert
    const [tableCheck] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'user_profile_history'`,
    );

    let versions: any[] = [];

    if ((tableCheck as any[])[0]?.count > 0) {
      // Versionshistorie laden
      const [historyRows] = await connection.execute(
        `SELECT * FROM user_profile_history
         WHERE user_id = ?
         ORDER BY changed_at DESC
         LIMIT 50`,
        [userId],
      );
      versions = historyRows as any[];
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: versions || [],
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Profil-Versionshistorie", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Versionshistorie" },
      { status: 500 },
    );
  }
}

