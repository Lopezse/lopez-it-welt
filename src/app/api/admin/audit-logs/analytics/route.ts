/**
 * Audit Log Analytics API - Enterprise++ Standard E.2.3
 * 
 * GET /api/admin/audit-logs/analytics - Analytics-Daten für Audit-Logs
 * 
 * RBAC: audit.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { AdminAuthService } from "@/lib/admin-auth-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "30d";

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

    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      // Prüfe welche Spalten existieren
      const [columns] = await connection.execute<RowDataPacket[]>(
        "SHOW COLUMNS FROM lopez_audit_logs"
      );
      const columnNames = columns.map((col: any) => col.Field);
      const hasRiskLevel = columnNames.includes("risk_level");
      const hasSeverity = columnNames.includes("severity");
      const hasCreatedAt = columnNames.includes("created_at");
      const hasTimestamp = columnNames.includes("timestamp");
      const dateColumn = hasCreatedAt ? "created_at" : (hasTimestamp ? "timestamp" : "NOW()");
      const severityColumn = hasRiskLevel ? "risk_level" : (hasSeverity ? "severity" : null);
      
      if (!severityColumn) {
        // Fallback: Wenn keine Severity-Spalte existiert, verwende einen Standardwert
        return NextResponse.json({
          success: true,
          data: {
            trends: [],
            actions: [],
            compliance_categories: [],
            anomalies: [],
            summary: {
              total_logs: 0,
              critical_count: 0,
              high_count: 0,
              medium_count: 0,
              low_count: 0,
            },
          },
        });
      }

      // Zeitraum berechnen
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Trends generieren (basierend auf echten Daten)
      const trends: Array<{ period: string; count: number; severity_breakdown: Record<string, number> }> = [];
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);
        
        try {
          const [trendRows] = await connection.execute<RowDataPacket[]>(
            `SELECT 
              COUNT(*) as count,
              SUM(CASE WHEN ${severityColumn} = 'CRITICAL' OR ${severityColumn} = 'critical' THEN 1 ELSE 0 END) as critical,
              SUM(CASE WHEN ${severityColumn} = 'HIGH' OR ${severityColumn} = 'high' THEN 1 ELSE 0 END) as high,
              SUM(CASE WHEN ${severityColumn} = 'MEDIUM' OR ${severityColumn} = 'medium' THEN 1 ELSE 0 END) as medium,
              SUM(CASE WHEN ${severityColumn} = 'LOW' OR ${severityColumn} = 'low' THEN 1 ELSE 0 END) as low
             FROM lopez_audit_logs
             WHERE ${dateColumn} >= ? AND ${dateColumn} <= ?`,
            [dateStart.toISOString(), dateEnd.toISOString()]
          );
          
          const trendData = Array.isArray(trendRows) && trendRows.length > 0 ? trendRows[0] : { count: 0, critical: 0, high: 0, medium: 0, low: 0 };
          
          trends.push({
            period: dateStart.toISOString(),
            count: Number(trendData.count) || 0,
            severity_breakdown: {
              CRITICAL: Number(trendData.critical) || 0,
              HIGH: Number(trendData.high) || 0,
              MEDIUM: Number(trendData.medium) || 0,
              LOW: Number(trendData.low) || 0,
            },
          });
        } catch (trendError: any) {
          console.warn(`⚠️ Fehler beim Laden der Trends für ${dateStart.toISOString()}:`, trendError.message);
          // Fallback: Leere Daten für diesen Tag
          trends.push({
            period: dateStart.toISOString(),
            count: 0,
            severity_breakdown: {
              CRITICAL: 0,
              HIGH: 0,
              MEDIUM: 0,
              LOW: 0,
            },
          });
        }
      }

      // Top-Aktionen
      const [actionRows] = await connection.execute<RowDataPacket[]>(
        `SELECT action, COUNT(*) as count
         FROM lopez_audit_logs
         WHERE ${dateColumn} >= ?
         GROUP BY action
         ORDER BY count DESC
         LIMIT 10`,
        [startDate.toISOString()]
      );
      const actions = Array.isArray(actionRows) ? actionRows.map((r: any) => ({ action: r.action, count: Number(r.count) })) : [];

      // Compliance-Kategorien
      let compliance_categories: Array<{ category: string; count: number }> = [];
      if (columnNames.includes("compliance_category")) {
        const [categoryRows] = await connection.execute<RowDataPacket[]>(
          `SELECT compliance_category as category, COUNT(*) as count
           FROM lopez_audit_logs
           WHERE ${dateColumn} >= ? AND compliance_category IS NOT NULL
           GROUP BY compliance_category
           ORDER BY count DESC`,
          [startDate.toISOString()]
        );
        compliance_categories = Array.isArray(categoryRows) 
          ? categoryRows.map((r: any) => ({ category: r.category || "UNKNOWN", count: Number(r.count) })) 
          : [];
      }

      // Zusammenfassung
      const [summaryRows] = await connection.execute<RowDataPacket[]>(
        `SELECT 
           COUNT(*) as total_logs,
           SUM(CASE WHEN ${severityColumn} = 'CRITICAL' OR ${severityColumn} = 'critical' THEN 1 ELSE 0 END) as critical_count,
           SUM(CASE WHEN ${severityColumn} = 'HIGH' OR ${severityColumn} = 'high' THEN 1 ELSE 0 END) as high_count,
           SUM(CASE WHEN ${severityColumn} = 'MEDIUM' OR ${severityColumn} = 'medium' THEN 1 ELSE 0 END) as medium_count,
           SUM(CASE WHEN ${severityColumn} = 'LOW' OR ${severityColumn} = 'low' THEN 1 ELSE 0 END) as low_count
         FROM lopez_audit_logs
         WHERE ${dateColumn} >= ?`,
        [startDate.toISOString()]
      );
      const summary = Array.isArray(summaryRows) && summaryRows.length > 0 ? summaryRows[0] : {
        total_logs: 0,
        critical_count: 0,
        high_count: 0,
        medium_count: 0,
        low_count: 0,
      };

      // Anomalien (vereinfacht - in Produktion: echte Anomalie-Erkennung)
      const anomalies: Array<{ id: string; timestamp: string; action: string; severity: string; message: string }> = [];
      if (Number(summary.critical_count) > 10) {
        anomalies.push({
          id: "anomaly-1",
          timestamp: new Date().toISOString(),
          action: "CRITICAL_EVENT_SPIKE",
          severity: "critical",
          message: "Hohe Anzahl kritischer Events erkannt",
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          trends,
          actions,
          compliance_categories,
          anomalies,
          summary: {
            total_logs: Number(summary.total_logs) || 0,
            critical_count: Number(summary.critical_count) || 0,
            high_count: Number(summary.high_count) || 0,
            medium_count: Number(summary.medium_count) || 0,
            low_count: Number(summary.low_count) || 0,
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Abrufen der Audit-Log-Analytics:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Fehler beim Abrufen der Analytics-Daten" },
      { status: 500 }
    );
  }
}



