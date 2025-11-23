// =====================================================
// ENTERPRISE++ AUDIT-LOGGER - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Zentrales Audit-Logging für alle System-Events
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest } from "next/server";

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface AuditEvent {
  user_id?: string;
  session_id?: string;
  tenant_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_value?: any;
  new_value?: any;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  compliance_category?: "DSGVO" | "ISO27001" | "SOC2" | "HIPAA" | "SOX" | "SECURITY" | "ACCESS";
  ip_address?: string;
  user_agent?: string;
  request_method?: string;
  request_url?: string;
  response_status?: number;
  execution_time_ms?: number;
  correlation_id?: string;
}

export interface AuditLoggerConfig {
  enabled: boolean;
  logLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  includeUserAgent: boolean;
  includeIP: boolean;
  includeExecutionTime: boolean;
  batchSize: number;
  flushInterval: number;
}

// =====================================================
// AUDIT LOGGER CLASS
// =====================================================

export class AuditLogger {
  private static instance: AuditLogger;
  private config: AuditLoggerConfig;
  private eventQueue: AuditEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      enabled:
        process.env.NODE_ENV === "production" || process.env.AUDIT_LOGGING_ENABLED === "true",
      logLevel: "MEDIUM",
      includeUserAgent: true,
      includeIP: true,
      includeExecutionTime: true,
      batchSize: 10,
      flushInterval: 5000, // 5 Sekunden
    };

    this.startFlushTimer();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  // =====================================================
  // PUBLIC METHODS
  // =====================================================

  public log(event: AuditEvent): void {
    if (!this.config.enabled) {
      return;
    }

    // Event validieren
    if (!event.action || !event.resource_type) {
      console.warn("AuditLogger: Ungültiges Event - action und resource_type sind erforderlich");
      return;
    }

    // Event zur Queue hinzufügen
    this.eventQueue.push({
      ...event,
      severity: event.severity || this.getDefaultSeverity(event.action),
      compliance_category:
        event.compliance_category || this.getDefaultComplianceCategory(event.action),
      created_at: new Date().toISOString(),
    });

    // Batch-Processing
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  public logUserLogin(userId: string, sessionId: string, request: NextRequest): void {
    this.log({
      user_id: userId,
      session_id: sessionId,
      action: "USER_LOGIN",
      resource_type: "authentication",
      severity: "MEDIUM",
      compliance_category: "SECURITY",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logUserLogout(userId: string, sessionId: string, request: NextRequest): void {
    this.log({
      user_id: userId,
      session_id: sessionId,
      action: "USER_LOGOUT",
      resource_type: "authentication",
      severity: "LOW",
      compliance_category: "SECURITY",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logUserCreate(userId: string, newUser: any, request: NextRequest): void {
    this.log({
      user_id: userId,
      action: "USER_CREATE",
      resource_type: "lopez_core_users",
      resource_id: newUser.id,
      new_value: JSON.stringify(newUser),
      severity: "HIGH",
      compliance_category: "DSGVO",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logUserUpdate(userId: string, oldUser: any, newUser: any, request: NextRequest): void {
    this.log({
      user_id: userId,
      action: "USER_UPDATE",
      resource_type: "lopez_core_users",
      resource_id: newUser.id,
      old_value: JSON.stringify(oldUser),
      new_value: JSON.stringify(newUser),
      severity: "HIGH",
      compliance_category: "DSGVO",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logUserDelete(userId: string, deletedUser: any, request: NextRequest): void {
    this.log({
      user_id: userId,
      action: "USER_DELETE",
      resource_type: "lopez_core_users",
      resource_id: deletedUser.id,
      old_value: JSON.stringify(deletedUser),
      severity: "CRITICAL",
      compliance_category: "DSGVO",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logPermissionChange(
    userId: string,
    roleId: string,
    oldPermissions: any,
    newPermissions: any,
    request: NextRequest,
  ): void {
    this.log({
      user_id: userId,
      action: "PERMISSION_CHANGE",
      resource_type: "lopez_core_roles",
      resource_id: roleId,
      old_value: JSON.stringify(oldPermissions),
      new_value: JSON.stringify(newPermissions),
      severity: "CRITICAL",
      compliance_category: "SECURITY",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logDataAccess(
    userId: string,
    resourceType: string,
    resourceId: string,
    request: NextRequest,
  ): void {
    this.log({
      user_id: userId,
      action: "DATA_ACCESS",
      resource_type: resourceType,
      resource_id: resourceId,
      severity: "MEDIUM",
      compliance_category: "DSGVO",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logDataExport(
    userId: string,
    exportType: string,
    recordCount: number,
    request: NextRequest,
  ): void {
    this.log({
      user_id: userId,
      action: "DATA_EXPORT",
      resource_type: "audit_logs",
      new_value: JSON.stringify({
        export_type: exportType,
        record_count: recordCount,
      }),
      severity: "HIGH",
      compliance_category: "DSGVO",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  public logSecurityEvent(userId: string, event: string, details: any, request: NextRequest): void {
    this.log({
      user_id: userId,
      action: "SECURITY_EVENT",
      resource_type: "security",
      new_value: JSON.stringify({ event, details }),
      severity: "CRITICAL",
      compliance_category: "SECURITY",
      ip_address: this.getClientIP(request),
      user_agent: request.headers.get("user-agent") || "Unknown",
      request_method: request.method,
      request_url: request.url,
    });
  }

  // =====================================================
  // PRIVATE METHODS
  // =====================================================

  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Events an API senden
      const response = await fetch("/api/admin/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        console.error("AuditLogger: Fehler beim Senden der Events:", response.statusText);
        // Events zurück in Queue (mit Backoff)
        this.eventQueue.unshift(...events);
      } else {
        console.log(`AuditLogger: ${events.length} Events erfolgreich geloggt`);
      }
    } catch (error) {
      console.error("AuditLogger: Fehler beim Senden der Events:", error);
      // Events zurück in Queue
      this.eventQueue.unshift(...events);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private getDefaultSeverity(action: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    const severityMap: {
      [key: string]: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    } = {
      USER_LOGIN: "MEDIUM",
      USER_LOGOUT: "LOW",
      USER_CREATE: "HIGH",
      USER_UPDATE: "HIGH",
      USER_DELETE: "CRITICAL",
      PERMISSION_CHANGE: "CRITICAL",
      DATA_ACCESS: "MEDIUM",
      DATA_EXPORT: "HIGH",
      SECURITY_EVENT: "CRITICAL",
      SYSTEM_CONFIG: "HIGH",
    };

    return severityMap[action] || "MEDIUM";
  }

  private getDefaultComplianceCategory(
    action: string,
  ): "DSGVO" | "ISO27001" | "SOC2" | "HIPAA" | "SOX" | "SECURITY" | "ACCESS" {
    const categoryMap: {
      [key: string]: "DSGVO" | "ISO27001" | "SOC2" | "HIPAA" | "SOX" | "SECURITY" | "ACCESS";
    } = {
      USER_LOGIN: "SECURITY",
      USER_LOGOUT: "SECURITY",
      USER_CREATE: "DSGVO",
      USER_UPDATE: "DSGVO",
      USER_DELETE: "DSGVO",
      PERMISSION_CHANGE: "SECURITY",
      DATA_ACCESS: "DSGVO",
      DATA_EXPORT: "DSGVO",
      SECURITY_EVENT: "SECURITY",
      SYSTEM_CONFIG: "SECURITY",
    };

    return categoryMap[action] || "SECURITY";
  }

  private getClientIP(request: NextRequest): string {
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

  // =====================================================
  // CLEANUP
  // =====================================================

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Letzte Events senden
  }
}

// =====================================================
// CONVENIENCE FUNCTIONS
// =====================================================

export const auditLogger = AuditLogger.getInstance();

// Schnelle Hilfsfunktionen
export const logUserAction = (
  userId: string,
  action: string,
  resourceType: string,
  request: NextRequest,
) => {
  auditLogger.log({
    user_id: userId,
    action,
    resource_type: resourceType,
    ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
    user_agent: request.headers.get("user-agent") || "Unknown",
    request_method: request.method,
    request_url: request.url,
  });
};

export const logSecurityEvent = (
  userId: string,
  event: string,
  details: any,
  request: NextRequest,
) => {
  auditLogger.logSecurityEvent(userId, event, details, request);
};

export const logDataAccess = (
  userId: string,
  resourceType: string,
  resourceId: string,
  request: NextRequest,
) => {
  auditLogger.logDataAccess(userId, resourceType, resourceId, request);
};

// =====================================================
// MIDDLEWARE HELPER
// =====================================================

export function withAuditLogging(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const startTime = Date.now();

    try {
      const result = await handler(request, ...args);

      // Erfolgreiche Aktion loggen
      auditLogger.log({
        action: "API_CALL",
        resource_type: "api",
        request_method: request.method,
        request_url: request.url,
        execution_time_ms: Date.now() - startTime,
        response_status: 200,
      });

      return result;
    } catch (error) {
      // Fehler loggen
      auditLogger.log({
        action: "API_ERROR",
        resource_type: "api",
        request_method: request.method,
        request_url: request.url,
        execution_time_ms: Date.now() - startTime,
        response_status: 500,
        new_value: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      });

      throw error;
    }
  };
}
