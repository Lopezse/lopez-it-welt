// =====================================================
// ENTERPRISE++ AUDIT-LOGS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: IBM/SAP-Level Audit-Log Management
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// GET - Audit-Logs abrufen (mit Filter & Pagination)
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter-Parameter
    const userId = searchParams.get("user_id");
    const action = searchParams.get("action");
    const tenantId = searchParams.get("tenant_id");
    const severity = searchParams.get("severity");
    const complianceCategory = searchParams.get("compliance_category");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const search = searchParams.get("search");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Sortierung
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = searchParams.get("sort_order") || "DESC";

    // MySQL-Verbindung (Enterprise++: Echte Datenbank)
    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      const auditLogs = await getAuditLogs(connection, {
        userId,
        action,
        tenantId,
        severity,
        complianceCategory,
        startDate,
        endDate,
        search,
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      const totalCount = await getAuditLogsCount(connection, {
        userId,
        action,
        tenantId,
        severity,
        complianceCategory,
        startDate,
        endDate,
        search,
      });

      return NextResponse.json({
        success: true,
        data: {
          logs: auditLogs,
          pagination: {
            page,
            limit,
            total: totalCount,
            pages: Math.ceil(totalCount / limit),
          },
          filters: {
            user_id: userId,
            action,
            tenant_id: tenantId,
            severity,
            compliance_category: complianceCategory,
            start_date: startDate,
            end_date: endDate,
            search,
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Audit-Logs API Fehler:", error);
    return NextResponse.json(
      { success: false, message: `Fehler beim Laden der Audit-Logs: ${error.message || "Unbekannter Fehler"}` },
      { status: 500 },
    );
  }
}

// =====================================================
// POST - Audit-Event manuell loggen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      session_id,
      tenant_id,
      action,
      resource_type,
      resource_id,
      old_value,
      new_value,
      severity = "MEDIUM",
      compliance_category = "SECURITY",
      ip_address,
      user_agent,
      request_method,
      request_url,
      response_status,
      execution_time_ms,
      correlation_id,
    } = await request.json();

    // Validierung
    if (!action || !resource_type) {
      return NextResponse.json(
        {
          success: false,
          message: "Action und Resource-Type sind erforderlich",
        },
        { status: 400 },
      );
    }

    // Audit-Event loggen
    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      const auditId = await logAuditEvent(connection, {
        user_id,
        session_id,
        tenant_id,
        action,
        resource_type,
        resource_id,
        old_value,
        new_value,
        severity,
        compliance_category,
        ip_address: ip_address || getClientIP(request),
        user_agent: user_agent || request.headers.get("user-agent") || "Unknown",
        request_method: request_method || request.method,
        request_url: request_url || request.url,
        response_status,
        execution_time_ms,
        correlation_id,
      });

      return NextResponse.json({
        success: true,
        message: "Audit-Event erfolgreich geloggt",
        data: { audit_id: auditId },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Audit-Event Logging Fehler:", error);
    return NextResponse.json(
      { success: false, message: `Fehler beim Loggen des Audit-Events: ${error.message || "Unbekannter Fehler"}` },
      { status: 500 },
    );
  }
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

async function getAuditLogs(connection: any, filters: any): Promise<any[]> {
  try {
    // Prüfe welche Spalten existieren
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM lopez_audit_logs"
    );
    const columnNames = columns.map((col: any) => col.Field);
    const hasTableName = columnNames.includes("table_name");
    const hasResourceType = columnNames.includes("resource_type");
    
    // Verwende table_name falls vorhanden, sonst resource_type oder Fallback
    const resourceColumn = hasTableName ? "al.table_name" : (hasResourceType ? "al.resource_type" : "'unknown'");
    
    let query = `
      SELECT 
        al.id,
        ${hasTableName ? "al.table_name" : (hasResourceType ? "al.resource_type" : "'unknown'")} as resource_type,
        ${columnNames.includes("record_id") ? "al.record_id" : (columnNames.includes("resource_id") ? "al.resource_id" : "NULL")} as resource_id,
        al.action,
        ${columnNames.includes("old_values") ? "al.old_values" : "NULL as old_values"},
        ${columnNames.includes("new_values") ? "al.new_values" : "NULL as new_values"},
        al.user_id,
        ${columnNames.includes("username") ? "al.username" : "NULL as username"},
        u.first_name,
        u.last_name,
        u.email,
        ${columnNames.includes("session_id") ? "al.session_id" : "NULL as session_id"},
        ${columnNames.includes("ip_address") ? "al.ip_address" : "NULL as ip_address"},
        ${columnNames.includes("user_agent") ? "al.user_agent" : "NULL as user_agent"},
        ${columnNames.includes("risk_level") ? "al.risk_level" : (columnNames.includes("severity") ? "al.severity" : "'MEDIUM'")} as severity,
        ${columnNames.includes("compliance_category") ? "al.compliance_category" : "'DATA_ACCESS'"} as compliance_category,
        ${columnNames.includes("created_at") ? "al.created_at" : (columnNames.includes("timestamp") ? "al.timestamp" : "NOW()")} as created_at
      FROM lopez_audit_logs al
      LEFT JOIN lopez_users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (filters.userId) {
      query += " AND al.user_id = ?";
      params.push(parseInt(filters.userId));
    }
    
    if (filters.action) {
      query += " AND al.action LIKE ?";
      params.push(`%${filters.action}%`);
    }
    
    const hasRiskLevel = columnNames.includes("risk_level");
    const hasSeverity = columnNames.includes("severity");
    const hasCreatedAt = columnNames.includes("created_at");
    const hasTimestamp = columnNames.includes("timestamp");
    const dateColumn = hasCreatedAt ? "al.created_at" : (hasTimestamp ? "al.timestamp" : "NOW()");
    
    if (filters.severity) {
      if (hasRiskLevel) {
        query += " AND al.risk_level = ?";
      } else if (hasSeverity) {
        query += " AND al.severity = ?";
      }
      params.push(filters.severity.toUpperCase());
    }
    
    if (filters.complianceCategory) {
      if (columnNames.includes("compliance_category")) {
        query += " AND al.compliance_category = ?";
        params.push(filters.complianceCategory);
      }
    }
    
    if (filters.startDate) {
      query += ` AND ${dateColumn} >= ?`;
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ` AND ${dateColumn} <= ?`;
      params.push(filters.endDate);
    }
    
    if (filters.search) {
      const searchConditions = ["al.action LIKE ?"];
      if (columnNames.includes("username")) searchConditions.push("al.username LIKE ?");
      if (hasTableName) searchConditions.push("al.table_name LIKE ?");
      if (hasResourceType) searchConditions.push("al.resource_type LIKE ?");
      searchConditions.push("u.email LIKE ?", "u.first_name LIKE ?", "u.last_name LIKE ?");
      
      query += ` AND (${searchConditions.join(" OR ")})`;
      const searchTerm = `%${filters.search}%`;
      searchConditions.forEach(() => params.push(searchTerm));
    }

    // Sortierung
    const sortBy = filters.sortBy === "created_at" ? dateColumn : `al.${filters.sortBy}`;
    const sortOrder = filters.sortOrder || "DESC";
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Pagination
    query += " LIMIT ? OFFSET ?";
    params.push(filters.limit, filters.offset);

    const [rows] = await connection.execute(query, params);
    
    // Daten formatieren
    return rows.map((row: any) => ({
      id: row.id.toString(),
      user_id: row.user_id?.toString() || "",
      first_name: row.first_name || "",
      last_name: row.last_name || "",
      email: row.email || row.username || "",
      session_id: row.session_id || "",
      tenant_id: null, // Nicht in aktueller Tabelle
      action: row.action,
      resource_type: row.resource_type || row.table_name || "",
      resource_id: row.resource_id?.toString() || null,
      old_value: row.old_values ? JSON.stringify(row.old_values) : null,
      new_value: row.new_values ? JSON.stringify(row.new_values) : null,
      severity: row.severity || row.risk_level || "MEDIUM",
      compliance_category: row.compliance_category || "DATA_ACCESS",
      risk_score: 0, // Nicht in aktueller Tabelle
      ip_address: row.ip_address || "",
      user_agent: row.user_agent || "",
      request_method: null, // Nicht in aktueller Tabelle
      request_url: null, // Nicht in aktueller Tabelle
      response_status: null, // Nicht in aktueller Tabelle
      execution_time_ms: null, // Nicht in aktueller Tabelle
      geolocation: null, // Nicht in aktueller Tabelle
      device_fingerprint: null, // Nicht in aktueller Tabelle
      correlation_id: null, // Nicht in aktueller Tabelle
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error("❌ Fehler beim Laden der Audit-Logs:", error);
    throw error;
  }
}

async function getAuditLogsCount(connection: any, filters: any): Promise<number> {
  try {
    // Prüfe welche Spalten existieren
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM lopez_audit_logs"
    );
    const columnNames = columns.map((col: any) => col.Field);
    const hasTableName = columnNames.includes("table_name");
    const hasResourceType = columnNames.includes("resource_type");
    const hasRiskLevel = columnNames.includes("risk_level");
    const hasSeverity = columnNames.includes("severity");
    const hasCreatedAt = columnNames.includes("created_at");
    const hasTimestamp = columnNames.includes("timestamp");
    const dateColumn = hasCreatedAt ? "al.created_at" : (hasTimestamp ? "al.timestamp" : "NOW()");
    
    let query = `
      SELECT COUNT(*) as total
      FROM lopez_audit_logs al
      LEFT JOIN lopez_users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (filters.userId) {
      query += " AND al.user_id = ?";
      params.push(parseInt(filters.userId));
    }
    
    if (filters.action) {
      query += " AND al.action LIKE ?";
      params.push(`%${filters.action}%`);
    }
    
    if (filters.severity) {
      if (hasRiskLevel) {
        query += " AND al.risk_level = ?";
      } else if (hasSeverity) {
        query += " AND al.severity = ?";
      }
      params.push(filters.severity.toUpperCase());
    }
    
    if (filters.complianceCategory) {
      if (columnNames.includes("compliance_category")) {
        query += " AND al.compliance_category = ?";
        params.push(filters.complianceCategory);
      }
    }
    
    if (filters.startDate) {
      query += ` AND ${dateColumn} >= ?`;
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ` AND ${dateColumn} <= ?`;
      params.push(filters.endDate);
    }
    
    if (filters.search) {
      const searchConditions = ["al.action LIKE ?"];
      if (columnNames.includes("username")) searchConditions.push("al.username LIKE ?");
      if (hasTableName) searchConditions.push("al.table_name LIKE ?");
      if (hasResourceType) searchConditions.push("al.resource_type LIKE ?");
      searchConditions.push("u.email LIKE ?", "u.first_name LIKE ?", "u.last_name LIKE ?");
      
      query += ` AND (${searchConditions.join(" OR ")})`;
      const searchTerm = `%${filters.search}%`;
      searchConditions.forEach(() => params.push(searchTerm));
    }

    const [rows] = await connection.execute(query, params);
    return rows[0]?.total || 0;
  } catch (error) {
    console.error("❌ Fehler beim Zählen der Audit-Logs:", error);
    return 0;
  }
}

async function logAuditEvent(connection: any, eventData: any): Promise<number> {
  try {
    // Risk Level bestimmen basierend auf Severity
    const riskLevelMap: Record<string, string> = {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH",
      CRITICAL: "CRITICAL",
    };
    
    const riskLevel = riskLevelMap[eventData.severity?.toUpperCase() || "MEDIUM"] || "MEDIUM";
    
    // Compliance Category mappen
    const complianceCategoryMap: Record<string, string> = {
      DSGVO: "DATA_ACCESS",
      ISO27001: "SECURITY_EVENT",
      SOC2: "SYSTEM_CHANGE",
      HIPAA: "DATA_ACCESS",
      SOX: "DATA_MODIFICATION",
      SECURITY: "SECURITY_EVENT",
      ACCESS: "AUTHORIZATION",
    };
    
    const complianceCategory = complianceCategoryMap[eventData.compliance_category?.toUpperCase() || "SECURITY"] || "DATA_ACCESS";
    
    // JSON-Werte parsen falls nötig
    let oldValues = null;
    let newValues = null;
    
    try {
      if (eventData.old_value) {
        oldValues = typeof eventData.old_value === "string" ? JSON.parse(eventData.old_value) : eventData.old_value;
      }
      if (eventData.new_value) {
        newValues = typeof eventData.new_value === "string" ? JSON.parse(eventData.new_value) : eventData.new_value;
      }
    } catch (e) {
      // Falls JSON-Parsing fehlschlägt, als String speichern
      oldValues = eventData.old_value;
      newValues = eventData.new_value;
    }
    
    // Username aus user_id holen falls nicht vorhanden
    let username = eventData.username;
    if (!username && eventData.user_id) {
      try {
        const [userRows] = await connection.execute(
          "SELECT username FROM lopez_users WHERE id = ?",
          [eventData.user_id]
        );
        if (userRows.length > 0) {
          username = userRows[0].username;
        }
      } catch (e) {
        // Username nicht gefunden - ignorieren
      }
    }
    
    const [result] = await connection.execute(
      `INSERT INTO lopez_audit_logs (
        table_name, record_id, action, old_values, new_values,
        user_id, username, ip_address, user_agent, session_id,
        risk_level, compliance_category, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        eventData.resource_type || "unknown",
        eventData.resource_id ? parseInt(eventData.resource_id) : 0,
        eventData.action,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        eventData.user_id ? parseInt(eventData.user_id) : 0,
        username || null,
        eventData.ip_address || null,
        eventData.user_agent || null,
        eventData.session_id || null,
        riskLevel,
        complianceCategory,
      ]
    );
    
    const auditId = (result as any).insertId;
    console.log(`✅ Audit-Event geloggt: ${auditId}`);
    
    return auditId;
  } catch (error) {
    console.error("❌ Fehler beim Loggen des Audit-Events:", error);
    throw error;
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }

  return "127.0.0.1";
}
