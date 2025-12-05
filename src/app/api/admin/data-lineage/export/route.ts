/**
 * Data Lineage Export API - Enterprise++ Standard E.2.6
 * 
 * GET /api/admin/data-lineage/export - Data Lineage exportieren
 * 
 * RBAC: compliance.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { dataLineageTracker } from "@/lib/data-lineage/tracker";
import { logger } from "@/lib/logger";
import { createConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") as "csv" | "pdf" | "json" | null;
    const type = searchParams.get("type") || undefined;
    const resource_type = searchParams.get("resource_type") || undefined;
    const date_from = searchParams.get("date_from") || undefined;
    const date_to = searchParams.get("date_to") || undefined;

    if (!format || !["csv", "pdf", "json"].includes(format)) {
      return NextResponse.json(
        { success: false, error: "Format muss csv, pdf oder json sein" },
        { status: 400 }
      );
    }

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Nodes abrufen
    const result = await dataLineageTracker.getAllNodes({
      type,
      resource_type,
    });

    // Export generieren (vereinfacht - in Produktion: echte Export-Generierung)
    const exportId = `export-${Date.now()}`;
    const downloadUrl = `/api/admin/data-lineage/exports/${exportId}/download?format=${format}`;

    // Export-Historie speichern
    const connection = await createConnection();
    await connection.execute(
      `INSERT INTO enterprise_data_lineage_exports 
       (id, format, filters, created_at, created_by)
       VALUES (?, ?, ?, NOW(), ?)`,
      [
        exportId,
        format,
        JSON.stringify({ type, resource_type, date_from, date_to }),
        1, // created_by: 1 = System (in Produktion: echte User-ID)
      ]
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DATA_LINEAGE_EXPORT', 'enterprise_data_lineage_exports', ?, ?)`,
      [exportId, `Data Lineage Export: ${format}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        export_id: exportId,
        download_url: downloadUrl,
        format,
        record_count: result.nodes.length,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Export der Data Lineage", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Export" },
      { status: 500 }
    );
  }
}



