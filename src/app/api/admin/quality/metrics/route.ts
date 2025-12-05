import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { AdminAuthService } from "@/lib/admin-auth-service";

/**
 * GET /api/admin/quality/metrics
 * 
 * Gibt alle Qualitäts-Metriken zurück.
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
    const category = searchParams.get("category");
    const version = searchParams.get("version");
    const limit = parseInt(searchParams.get("limit") || "100");

    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      // Prüfe ob Tabelle existiert
      const [tables] = await connection.execute<RowDataPacket[]>(
        "SHOW TABLES LIKE 'quality_metrics'"
      );

      if (tables.length === 0) {
        // Tabelle existiert nicht - leere Daten zurückgeben
        return NextResponse.json({
          success: true,
          data: [],
        });
      }

      let query = `
        SELECT id, metric_name, metric_value, metric_unit, target_value, category, measured_at, version
        FROM quality_metrics
        WHERE 1=1
      `;
      const params: any[] = [];

      if (category) {
        query += " AND category = ?";
        params.push(category);
      }

      if (version) {
        query += " AND version = ?";
        params.push(version);
      }

      query += " ORDER BY measured_at DESC LIMIT ?";
      params.push(limit);

      const [metrics] = await connection.execute<RowDataPacket[]>(query, params);

      return NextResponse.json({
        success: true,
        data: metrics || [],
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Laden der Qualitäts-Metriken:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Fehler beim Laden der Metriken" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/quality/metrics
 * 
 * Erstellt eine neue Qualitäts-Metrik.
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
    const { metric_name, metric_value, metric_unit, target_value, category, version } = body;

    if (!metric_name || metric_value === undefined) {
      return NextResponse.json(
        { success: false, message: "Metrikname und Wert sind erforderlich" },
        { status: 400 },
      );
    }

    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `INSERT INTO quality_metrics (metric_name, metric_value, metric_unit, target_value, category, version)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          metric_name,
          metric_value,
          metric_unit || null,
          target_value || null,
          category || "general",
          version || null,
        ],
      );

      return NextResponse.json({
        success: true,
        message: "Metrik erfolgreich erstellt",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Erstellen der Metrik:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Fehler beim Erstellen der Metrik" },
      { status: 500 },
    );
  }
}
