// =====================================================
// AI CENTER - MIDDLEWARE & SECURITY
// =====================================================
// Enterprise++ Production-Hardening
// Auth, RBAC, Rate-Limiting, Audit
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type AIPermission = 
  | "ai.view"              // AI Center anzeigen
  | "ai.agents.view"       // Agenten anzeigen
  | "ai.agents.manage"     // Agenten verwalten
  | "ai.tasks.view"        // Dev-Tasks anzeigen
  | "ai.tasks.manage"      // Dev-Tasks verwalten
  | "ai.playbooks.view"    // Playbooks anzeigen
  | "ai.playbooks.execute" // Playbooks ausführen
  | "ai.workflows.view"    // Workflows anzeigen
  | "ai.workflows.manage"  // Workflows verwalten
  | "ai.monitoring.view"   // Monitoring anzeigen
  | "ai.settings.manage"   // AI-Einstellungen verwalten
  | "ai.admin";            // Vollzugriff

export interface AIRateLimitConfig {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  cost_limit_daily: number;    // € pro Tag
  cost_limit_monthly: number;  // € pro Monat
}

export interface AISecurityContext {
  user_id: number;
  username: string;
  role: string;
  permissions: AIPermission[];
  rate_limit: AIRateLimitConfig;
  is_admin: boolean;
}

// =====================================================
// DEFAULT KONFIGURATION
// =====================================================

export const DEFAULT_RATE_LIMITS: Record<string, AIRateLimitConfig> = {
  admin: {
    requests_per_minute: 100,
    requests_per_hour: 1000,
    requests_per_day: 10000,
    cost_limit_daily: 50,
    cost_limit_monthly: 500
  },
  operator: {
    requests_per_minute: 30,
    requests_per_hour: 300,
    requests_per_day: 3000,
    cost_limit_daily: 20,
    cost_limit_monthly: 200
  },
  viewer: {
    requests_per_minute: 10,
    requests_per_hour: 100,
    requests_per_day: 1000,
    cost_limit_daily: 0,
    cost_limit_monthly: 0
  },
  default: {
    requests_per_minute: 5,
    requests_per_hour: 50,
    requests_per_day: 500,
    cost_limit_daily: 0,
    cost_limit_monthly: 0
  }
};

export const ROLE_PERMISSIONS: Record<string, AIPermission[]> = {
  super_admin: ["ai.admin"],
  admin: [
    "ai.view", "ai.agents.view", "ai.agents.manage",
    "ai.tasks.view", "ai.tasks.manage",
    "ai.playbooks.view", "ai.playbooks.execute",
    "ai.workflows.view", "ai.workflows.manage",
    "ai.monitoring.view", "ai.settings.manage"
  ],
  operator: [
    "ai.view", "ai.agents.view",
    "ai.tasks.view", "ai.tasks.manage",
    "ai.playbooks.view", "ai.playbooks.execute",
    "ai.workflows.view",
    "ai.monitoring.view"
  ],
  viewer: [
    "ai.view", "ai.agents.view",
    "ai.tasks.view",
    "ai.playbooks.view",
    "ai.monitoring.view"
  ]
};

// =====================================================
// RATE LIMITER
// =====================================================

// In-Memory Rate Limit Store (für Production: Redis verwenden)
const rateLimitStore = new Map<string, { count: number; resetAt: number }[]>();

export class RateLimiter {
  
  /**
   * Prüft ob Request erlaubt ist
   */
  static async checkLimit(
    userId: number,
    endpoint: string,
    limits: AIRateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const minuteAgo = now - 60000;
    
    // Alte Einträge entfernen
    let entries = rateLimitStore.get(key) || [];
    entries = entries.filter(e => e.resetAt > now);
    
    // Anzahl in letzter Minute
    const recentCount = entries.filter(e => e.resetAt > minuteAgo).length;
    
    if (recentCount >= limits.requests_per_minute) {
      const oldestRecent = entries.find(e => e.resetAt > minuteAgo);
      return {
        allowed: false,
        remaining: 0,
        resetIn: oldestRecent ? Math.ceil((oldestRecent.resetAt - now) / 1000) : 60
      };
    }
    
    // Request hinzufügen
    entries.push({ count: 1, resetAt: now + 60000 });
    rateLimitStore.set(key, entries);
    
    return {
      allowed: true,
      remaining: limits.requests_per_minute - recentCount - 1,
      resetIn: 60
    };
  }
  
  /**
   * Prüft Kosten-Limit
   */
  static async checkCostLimit(
    userId: number,
    estimatedCost: number,
    limits: AIRateLimitConfig
  ): Promise<{ allowed: boolean; currentCost: number; limit: number }> {
    // In einer echten Implementierung: Kosten aus DB laden
    // Für jetzt: Immer erlauben (Demo-Modus)
    return {
      allowed: true,
      currentCost: 0,
      limit: limits.cost_limit_daily
    };
  }
}

// =====================================================
// AUDIT LOGGER
// =====================================================

export class AIAuditLogger {
  
  /**
   * Loggt ein AI-Event
   */
  static async log(event: {
    user_id: number;
    action: string;
    entity_type: string;
    entity_id?: number | string;
    details?: Record<string, any>;
    ip_address?: string;
    success?: boolean;
  }): Promise<void> {
    try {
      const pool = await getConnection();
      
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        event.user_id,
        event.action,
        event.entity_type,
        event.entity_id || 0,
        JSON.stringify({
          ...event.details,
          success: event.success !== false,
          timestamp: new Date().toISOString()
        }),
        event.ip_address || null
      ]);
    } catch (error) {
      console.error("AI Audit Log Error:", error);
      // Audit-Fehler sollten nicht die Hauptoperation blockieren
    }
  }
  
  /**
   * Loggt API-Zugriff
   */
  static async logAPIAccess(
    userId: number,
    endpoint: string,
    method: string,
    statusCode: number,
    durationMs: number,
    ip?: string
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: `AI_API_${method}`,
      entity_type: "api_access",
      details: {
        endpoint,
        method,
        status_code: statusCode,
        duration_ms: durationMs
      },
      ip_address: ip,
      success: statusCode < 400
    });
  }
  
  /**
   * Loggt Sicherheitsereignis
   */
  static async logSecurityEvent(
    userId: number,
    event: string,
    details: Record<string, any>,
    ip?: string
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action: `AI_SECURITY_${event}`,
      entity_type: "security",
      details,
      ip_address: ip,
      success: false
    });
  }
}

// =====================================================
// PERMISSION CHECKER
// =====================================================

export class PermissionChecker {
  
  /**
   * Prüft ob User eine bestimmte Permission hat
   */
  static hasPermission(context: AISecurityContext, permission: AIPermission): boolean {
    // Admin hat immer alle Rechte
    if (context.permissions.includes("ai.admin")) {
      return true;
    }
    
    return context.permissions.includes(permission);
  }
  
  /**
   * Prüft mehrere Permissions (mindestens eine muss vorhanden sein)
   */
  static hasAnyPermission(context: AISecurityContext, permissions: AIPermission[]): boolean {
    return permissions.some(p => this.hasPermission(context, p));
  }
  
  /**
   * Prüft alle Permissions (alle müssen vorhanden sein)
   */
  static hasAllPermissions(context: AISecurityContext, permissions: AIPermission[]): boolean {
    return permissions.every(p => this.hasPermission(context, p));
  }
  
  /**
   * Wirft Fehler wenn Permission fehlt
   */
  static requirePermission(context: AISecurityContext, permission: AIPermission): void {
    if (!this.hasPermission(context, permission)) {
      throw new Error(`Fehlende Berechtigung: ${permission}`);
    }
  }
}

// =====================================================
// SESSION HELPER
// =====================================================

export async function getSessionFromRequest(request: NextRequest): Promise<AISecurityContext | null> {
  try {
    // Session-Token aus Cookie oder Header
    const sessionToken = request.cookies.get("auth-token")?.value 
      || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!sessionToken) {
      return null;
    }
    
    const pool = await getConnection();
    
    // Session laden
    const [sessions] = await pool.execute<RowDataPacket[]>(`
      SELECT s.*, u.username, u.email, r.name as role_name
      FROM lopez_sessions s
      JOIN lopez_users u ON s.user_id = u.id
      LEFT JOIN lopez_roles r ON u.role_id = r.id
      WHERE s.token = ? AND s.expires_at > NOW()
    `, [sessionToken]);
    
    if (sessions.length === 0) {
      return null;
    }
    
    const session = sessions[0];
    const roleName = session.role_name?.toLowerCase() || "viewer";
    
    // Permissions für Rolle laden
    const permissions = ROLE_PERMISSIONS[roleName] || ROLE_PERMISSIONS.viewer;
    const rateLimit = DEFAULT_RATE_LIMITS[roleName] || DEFAULT_RATE_LIMITS.default;
    
    return {
      user_id: session.user_id,
      username: session.username,
      role: roleName,
      permissions: permissions as AIPermission[],
      rate_limit: rateLimit,
      is_admin: roleName === "super_admin" || roleName === "admin"
    };
  } catch (error) {
    console.error("Session Error:", error);
    return null;
  }
}

// =====================================================
// AI API MIDDLEWARE
// =====================================================

export interface AIMiddlewareOptions {
  requiredPermission?: AIPermission;
  requiredPermissions?: AIPermission[];
  requireAll?: boolean;  // Bei requiredPermissions: alle oder nur eine?
  skipRateLimit?: boolean;
  skipAudit?: boolean;
  allowAnonymous?: boolean;  // Für öffentliche Endpunkte (z.B. Health-Check)
}

/**
 * Erstellt eine geschützte API-Handler-Funktion
 */
export function withAIMiddleware<T>(
  handler: (request: NextRequest, context: AISecurityContext) => Promise<NextResponse<T>>,
  options: AIMiddlewareOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const endpoint = request.nextUrl.pathname;
    const method = request.method;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    try {
      // 1. Session/Auth prüfen
      const securityContext = await getSessionFromRequest(request);
      
      if (!securityContext && !options.allowAnonymous) {
        await AIAuditLogger.logSecurityEvent(0, "UNAUTHORIZED", {
          endpoint,
          method,
          reason: "Keine gültige Session"
        }, ip);
        
        return NextResponse.json(
          { success: false, error: "Nicht autorisiert" },
          { status: 401 }
        );
      }
      
      // Für anonyme Requests einen Minimal-Context erstellen
      const context: AISecurityContext = securityContext || {
        user_id: 0,
        username: "anonymous",
        role: "anonymous",
        permissions: [],
        rate_limit: DEFAULT_RATE_LIMITS.default,
        is_admin: false
      };
      
      // 2. Permissions prüfen
      if (options.requiredPermission && !PermissionChecker.hasPermission(context, options.requiredPermission)) {
        await AIAuditLogger.logSecurityEvent(context.user_id, "FORBIDDEN", {
          endpoint,
          method,
          required: options.requiredPermission,
          user_permissions: context.permissions
        }, ip);
        
        return NextResponse.json(
          { success: false, error: "Keine Berechtigung" },
          { status: 403 }
        );
      }
      
      if (options.requiredPermissions) {
        const hasPermission = options.requireAll
          ? PermissionChecker.hasAllPermissions(context, options.requiredPermissions)
          : PermissionChecker.hasAnyPermission(context, options.requiredPermissions);
        
        if (!hasPermission) {
          await AIAuditLogger.logSecurityEvent(context.user_id, "FORBIDDEN", {
            endpoint,
            method,
            required: options.requiredPermissions,
            require_all: options.requireAll
          }, ip);
          
          return NextResponse.json(
            { success: false, error: "Keine Berechtigung" },
            { status: 403 }
          );
        }
      }
      
      // 3. Rate-Limit prüfen
      if (!options.skipRateLimit) {
        const rateLimitResult = await RateLimiter.checkLimit(
          context.user_id,
          endpoint,
          context.rate_limit
        );
        
        if (!rateLimitResult.allowed) {
          await AIAuditLogger.logSecurityEvent(context.user_id, "RATE_LIMITED", {
            endpoint,
            method,
            reset_in: rateLimitResult.resetIn
          }, ip);
          
          return NextResponse.json(
            { 
              success: false, 
              error: "Zu viele Anfragen",
              retry_after: rateLimitResult.resetIn
            },
            { 
              status: 429,
              headers: {
                "Retry-After": String(rateLimitResult.resetIn),
                "X-RateLimit-Remaining": String(rateLimitResult.remaining)
              }
            }
          );
        }
      }
      
      // 4. Handler ausführen
      const response = await handler(request, context);
      
      // 5. Audit-Log
      if (!options.skipAudit) {
        const durationMs = Date.now() - startTime;
        await AIAuditLogger.logAPIAccess(
          context.user_id,
          endpoint,
          method,
          response.status,
          durationMs,
          ip
        );
      }
      
      return response;
      
    } catch (error) {
      const durationMs = Date.now() - startTime;
      
      console.error("AI Middleware Error:", error);
      
      // Fehler loggen
      await AIAuditLogger.log({
        user_id: 0,
        action: "AI_API_ERROR",
        entity_type: "error",
        details: {
          endpoint,
          method,
          error: error instanceof Error ? error.message : "Unknown error",
          duration_ms: durationMs
        },
        ip_address: ip,
        success: false
      });
      
      return NextResponse.json(
        { success: false, error: "Interner Serverfehler" },
        { status: 500 }
      );
    }
  };
}

// =====================================================
// TIMEOUT HELPER
// =====================================================

/**
 * Führt eine Operation mit Timeout aus
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = "Operation timed out"
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  
  return Promise.race([operation, timeoutPromise]);
}

/**
 * Standard-Timeouts für verschiedene Operationen
 */
export const AI_TIMEOUTS = {
  quick: 5000,      // 5s - Einfache DB-Abfragen
  normal: 30000,    // 30s - Standard API-Calls
  long: 120000,     // 2min - KI-Analysen
  extended: 300000  // 5min - Große Analysen
};

export default {
  RateLimiter,
  AIAuditLogger,
  PermissionChecker,
  getSessionFromRequest,
  withAIMiddleware,
  withTimeout,
  AI_TIMEOUTS,
  DEFAULT_RATE_LIMITS,
  ROLE_PERMISSIONS
};

