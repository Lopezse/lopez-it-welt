// =====================================================
// AUDIT SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Erweiterte Compliance-Protokollierung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { getConnection } from "./database";

// =====================================================
// INTERFACES
// =====================================================

export interface AuditLog {
  id?: number;
  table_name: string;
  record_id: number;
  action:
    | "INSERT"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "2FA_SETUP"
    | "2FA_VERIFY"
    | "PASSWORD_CHANGE"
    | "ROLE_ASSIGN"
    | "PERMISSION_GRANT";
  old_values?: any;
  new_values?: any;
  user_id: number;
  username?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  compliance_category:
    | "DATA_ACCESS"
    | "DATA_MODIFICATION"
    | "AUTHENTICATION"
    | "AUTHORIZATION"
    | "SYSTEM_CHANGE"
    | "SECURITY_EVENT";
  created_at?: string;
}

export interface AuditFilter {
  table_name?: string;
  action?: string;
  user_id?: number;
  risk_level?: string;
  compliance_category?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface AuditStats {
  total_logs: number;
  logs_by_action: Record<string, number>;
  logs_by_risk_level: Record<string, number>;
  logs_by_category: Record<string, number>;
  logs_by_user: Record<string, number>;
  recent_activity: AuditLog[];
}

// =====================================================
// AUDIT SERVICE CLASS
// =====================================================

export class AuditService {
  // =====================================================
  // AUDIT-LOGGING
  // =====================================================

  static async logAudit(auditData: Omit<AuditLog, "id" | "created_at">): Promise<boolean> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `
                INSERT INTO lopez_audit_logs 
                (table_name, record_id, action, old_values, new_values, user_id, username, ip_address, user_agent, session_id, risk_level, compliance_category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          auditData.table_name,
          auditData.record_id,
          auditData.action,
          auditData.old_values ? JSON.stringify(auditData.old_values) : null,
          auditData.new_values ? JSON.stringify(auditData.new_values) : null,
          auditData.user_id,
          auditData.username || null,
          auditData.ip_address || null,
          auditData.user_agent || null,
          auditData.session_id || null,
          auditData.risk_level,
          auditData.compliance_category,
        ],
      );

      return true;
    } catch (error) {
      console.error("❌ Audit-Logging fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // SPEZIFISCHE AUDIT-EVENTS
  // =====================================================

  static async logLogin(
    userId: number,
    username: string,
    ipAddress?: string,
    userAgent?: string,
    sessionId?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_users",
      record_id: userId,
      action: "LOGIN",
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionId,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
    });
  }

  static async logLogout(
    userId: number,
    username: string,
    ipAddress?: string,
    userAgent?: string,
    sessionId?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_users",
      record_id: userId,
      action: "LOGOUT",
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionId,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
    });
  }

  static async log2FASetup(
    userId: number,
    username: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_user_2fa",
      record_id: userId,
      action: "2FA_SETUP",
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: "MEDIUM",
      compliance_category: "SECURITY_EVENT",
    });
  }

  static async log2FAVerify(
    userId: number,
    username: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_user_2fa",
      record_id: userId,
      action: "2FA_VERIFY",
      new_values: { success },
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: success ? "LOW" : "HIGH",
      compliance_category: "AUTHENTICATION",
    });
  }

  static async logPasswordChange(
    userId: number,
    username: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_users",
      record_id: userId,
      action: "PASSWORD_CHANGE",
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: "MEDIUM",
      compliance_category: "SECURITY_EVENT",
    });
  }

  static async logRoleAssignment(
    userId: number,
    targetUserId: number,
    roleName: string,
    assignedBy: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: "lopez_user_roles",
      record_id: targetUserId,
      action: "ROLE_ASSIGN",
      new_values: { role_name: roleName, assigned_by: assignedBy },
      user_id: userId,
      username: assignedBy,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: "HIGH",
      compliance_category: "AUTHORIZATION",
    });
  }

  static async logDataAccess(
    userId: number,
    username: string,
    tableName: string,
    recordId: number,
    action: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: tableName,
      record_id: recordId,
      action: action as any,
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: "LOW",
      compliance_category: "DATA_ACCESS",
    });
  }

  static async logDataModification(
    userId: number,
    username: string,
    tableName: string,
    recordId: number,
    action: string,
    oldValues: any,
    newValues: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      table_name: tableName,
      record_id: recordId,
      action: action as any,
      old_values: oldValues,
      new_values: newValues,
      user_id: userId,
      username,
      ip_address: ipAddress,
      user_agent: userAgent,
      risk_level: "MEDIUM",
      compliance_category: "DATA_MODIFICATION",
    });
  }

  // =====================================================
  // AUDIT-ABFRAGEN
  // =====================================================

  static async getAuditLogs(
    filters: AuditFilter = {},
  ): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const connection = await getConnection();

      const {
        table_name,
        action,
        user_id,
        risk_level,
        compliance_category,
        date_from,
        date_to,
        page = 1,
        limit = 50,
      } = filters;

      const offset = (page - 1) * limit;

      // WHERE-Bedingungen aufbauen
      const whereConditions = [];
      const queryParams = [];

      if (table_name) {
        whereConditions.push("table_name = ?");
        queryParams.push(table_name);
      }

      if (action) {
        whereConditions.push("action = ?");
        queryParams.push(action);
      }

      if (user_id) {
        whereConditions.push("user_id = ?");
        queryParams.push(user_id);
      }

      if (risk_level) {
        whereConditions.push("risk_level = ?");
        queryParams.push(risk_level);
      }

      if (compliance_category) {
        whereConditions.push("compliance_category = ?");
        queryParams.push(compliance_category);
      }

      if (date_from) {
        whereConditions.push("created_at >= ?");
        queryParams.push(date_from);
      }

      if (date_to) {
        whereConditions.push("created_at <= ?");
        queryParams.push(date_to);
      }

      const whereClause =
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      // Gesamtanzahl ermitteln
      const countQuery = `SELECT COUNT(*) as total FROM lopez_audit_logs ${whereClause}`;
      const [countRows] = await connection.execute(countQuery, queryParams);
      const total = (countRows as any)[0].total;

      // Logs laden
      const logsQuery = `
                SELECT * FROM lopez_audit_logs 
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;

      const [logRows] = await connection.execute(logsQuery, [...queryParams, limit, offset]);

      return {
        logs: logRows as AuditLog[],
        total,
      };
    } catch (error) {
      console.error("❌ Audit-Logs-Abfrage fehlgeschlagen:", error);
      throw error;
    }
  }

  static async getAuditStats(dateFrom?: string, dateTo?: string): Promise<AuditStats> {
    try {
      const connection = await getConnection();

      const dateFilter = dateFrom && dateTo ? `WHERE created_at BETWEEN ? AND ?` : "";
      const dateParams = dateFrom && dateTo ? [dateFrom, dateTo] : [];

      // Gesamtanzahl
      const [totalRows] = await connection.execute(
        `SELECT COUNT(*) as total FROM lopez_audit_logs ${dateFilter}`,
        dateParams,
      );
      const total_logs = (totalRows as any)[0].total;

      // Nach Aktion
      const [actionRows] = await connection.execute(
        `SELECT action, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY action`,
        dateParams,
      );
      const logs_by_action = (actionRows as any[]).reduce((acc, row) => {
        acc[row.action] = row.count;
        return acc;
      }, {});

      // Nach Risiko-Level
      const [riskRows] = await connection.execute(
        `SELECT risk_level, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY risk_level`,
        dateParams,
      );
      const logs_by_risk_level = (riskRows as any[]).reduce((acc, row) => {
        acc[row.risk_level] = row.count;
        return acc;
      }, {});

      // Nach Kategorie
      const [categoryRows] = await connection.execute(
        `SELECT compliance_category, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY compliance_category`,
        dateParams,
      );
      const logs_by_category = (categoryRows as any[]).reduce((acc, row) => {
        acc[row.compliance_category] = row.count;
        return acc;
      }, {});

      // Nach Benutzer
      const [userRows] = await connection.execute(
        `SELECT username, COUNT(*) as count FROM lopez_audit_logs ${dateFilter} GROUP BY username ORDER BY count DESC LIMIT 10`,
        dateParams,
      );
      const logs_by_user = (userRows as any[]).reduce((acc, row) => {
        acc[row.username] = row.count;
        return acc;
      }, {});

      // Letzte Aktivitäten
      const [recentRows] = await connection.execute(
        `SELECT * FROM lopez_audit_logs ${dateFilter} ORDER BY created_at DESC LIMIT 10`,
        dateParams,
      );
      const recent_activity = recentRows as AuditLog[];

      return {
        total_logs,
        logs_by_action,
        logs_by_risk_level,
        logs_by_category,
        logs_by_user,
        recent_activity,
      };
    } catch (error) {
      console.error("❌ Audit-Statistiken fehlgeschlagen:", error);
      throw error;
    }
  }

  // =====================================================
  // COMPLIANCE-REPORTING
  // =====================================================

  static async generateComplianceReport(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const stats = await this.getAuditStats(dateFrom, dateTo);

      return {
        report_period: { from: dateFrom, to: dateTo },
        generated_at: new Date().toISOString(),
        summary: {
          total_events: stats.total_logs,
          high_risk_events: stats.logs_by_risk_level.HIGH || 0,
          critical_events: stats.logs_by_risk_level.CRITICAL || 0,
          security_events: stats.logs_by_category.SECURITY_EVENT || 0,
          data_modifications: stats.logs_by_category.DATA_MODIFICATION || 0,
        },
        details: stats,
      };
    } catch (error) {
      console.error("❌ Compliance-Report fehlgeschlagen:", error);
      throw error;
    }
  }
}
