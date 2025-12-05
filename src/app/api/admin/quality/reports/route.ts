import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { AdminAuthService } from "@/lib/admin-auth-service";

/**
 * GET /api/admin/quality/reports
 * 
 * Gibt alle Qualitäts-Berichte zurück.
 */
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const report_type = searchParams.get("report_type");
    const version = searchParams.get("version");

    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      // Prüfe ob Tabelle existiert
      const [tables] = await connection.execute<RowDataPacket[]>(
        "SHOW TABLES LIKE 'quality_reports'"
      );

      if (tables.length === 0) {
        // Tabelle existiert nicht - leere Daten zurückgeben
        return NextResponse.json({
          success: true,
          data: [],
        });
      }

      let query = `
        SELECT id, report_name, report_type, version, metrics_summary, status, generated_by, generated_at, published_at
        FROM quality_reports
        WHERE 1=1
      `;
      const params: any[] = [];

      if (report_type) {
        query += " AND report_type = ?";
        params.push(report_type);
      }

      if (version) {
        query += " AND version = ?";
        params.push(version);
      }

      query += " ORDER BY generated_at DESC";

      const [reports] = await connection.execute<RowDataPacket[]>(query, params);

      // Metrics summary von JSON-String parsen
      const parsedReports = (reports as any[]).map((report) => ({
        ...report,
        metrics_summary:
          typeof report.metrics_summary === "string"
            ? JSON.parse(report.metrics_summary)
            : report.metrics_summary,
      }));

      return NextResponse.json({
        success: true,
        data: parsedReports,
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Laden der Qualitäts-Berichte:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Fehler beim Laden der Berichte" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/quality/reports
 * 
 * Erstellt einen neuen Qualitäts-Bericht.
 */
export async function POST(request: NextRequest) {
  try {
    // Authentifizierung
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { report_name, report_type, version, metrics_summary } = body;

    if (!report_name || !report_type) {
      return NextResponse.json(
        { success: false, message: "Berichtsname und Typ sind erforderlich" },
        { status: 400 },
      );
    }

    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO quality_reports (report_name, report_type, version, metrics_summary, status, generated_by)
         VALUES (?, ?, ?, ?, 'generated', 'system')`,
        [report_name, report_type, version || null, JSON.stringify(metrics_summary || {})],
      );

      const reportId = (result as any).insertId;

      return NextResponse.json({
        success: true,
        message: "Bericht erfolgreich erstellt",
        data: { id: reportId },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Erstellen des Berichts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Fehler beim Erstellen des Berichts" },
      { status: 500 },
    );
  }
}


