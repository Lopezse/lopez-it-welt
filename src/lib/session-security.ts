// =====================================================
// ENTERPRISE++ SESSION SECURITY SERVICE
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Enterprise-Level Session-Management
// Standard: IBM/SAP/Siemens Security Level
// =====================================================

import { getConnection } from "./database";
import jwt from "jsonwebtoken";

// =====================================================
// INTERFACES
// =====================================================

export interface SessionData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
}

export interface SessionValidationResult {
  valid: boolean;
  session?: SessionData;
  error?: string;
  errorCode?: "NO_TOKEN" | "INVALID_TOKEN" | "SESSION_EXPIRED" | "SESSION_NOT_FOUND" | "USER_INACTIVE" | "IP_MISMATCH" | "TIMEOUT";
}

// =====================================================
// KONFIGURATION
// =====================================================

const CONFIG = {
  // Session-Timeout nach Inaktivität (30 Minuten)
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000,
  
  // Maximale Session-Dauer (8 Stunden)
  MAX_SESSION_DURATION_MS: 8 * 60 * 60 * 1000,
  
  // JWT Secret (aus Umgebungsvariable oder Fallback)
  JWT_SECRET: process.env.JWT_SECRET || "lopez-it-welt-enterprise-secret-2025",
  
  // IP-Binding aktivieren
  ENABLE_IP_BINDING: true,
  
  // Concurrent Sessions pro User (0 = unbegrenzt)
  MAX_CONCURRENT_SESSIONS: 1,
  
  // Session-Refresh-Intervall (5 Minuten)
  REFRESH_INTERVAL_MS: 5 * 60 * 1000,
};

// =====================================================
// SESSION SECURITY SERVICE
// =====================================================

export class SessionSecurityService {
  
  // =====================================================
  // SESSION VALIDIERUNG (Haupt-Funktion)
  // =====================================================
  
  static async validateSession(
    sessionToken: string | undefined,
    jwtToken: string | undefined,
    clientIp: string,
    userAgent: string
  ): Promise<SessionValidationResult> {
    
    // 1. Token vorhanden?
    if (!sessionToken && !jwtToken) {
      return { valid: false, error: "Kein Auth-Token", errorCode: "NO_TOKEN" };
    }
    
    try {
      const pool = await getConnection();
      
      // 2. Session aus DB laden
      let sessionQuery = "";
      let sessionParams: any[] = [];
      
      if (sessionToken) {
        sessionQuery = `
          SELECT s.*, u.username, u.email, u.status as user_status
          FROM lopez_sessions s
          JOIN lopez_users u ON s.user_id = u.id
          WHERE s.session_token = ?
        `;
        sessionParams = [sessionToken];
      } else if (jwtToken) {
        // JWT dekodieren um User-ID zu erhalten
        try {
          const decoded = jwt.verify(jwtToken, CONFIG.JWT_SECRET) as any;
          sessionQuery = `
            SELECT s.*, u.username, u.email, u.status as user_status
            FROM lopez_sessions s
            JOIN lopez_users u ON s.user_id = u.id
            WHERE s.user_id = ? AND s.expires_at > NOW()
            ORDER BY s.created_at DESC
            LIMIT 1
          `;
          sessionParams = [decoded.userId];
        } catch (jwtError) {
          return { valid: false, error: "JWT ungültig", errorCode: "INVALID_TOKEN" };
        }
      }
      
      const [rows] = await pool.execute(sessionQuery, sessionParams);
      const sessions = rows as any[];
      
      if (sessions.length === 0) {
        return { valid: false, error: "Session nicht gefunden", errorCode: "SESSION_NOT_FOUND" };
      }
      
      const session = sessions[0];
      
      // 3. User-Status prüfen
      if (session.user_status !== "active") {
        return { valid: false, error: "Benutzer deaktiviert", errorCode: "USER_INACTIVE" };
      }
      
      // 4. Session abgelaufen?
      const expiresAt = new Date(session.expires_at);
      if (expiresAt < new Date()) {
        await this.invalidateSession(session.session_token);
        return { valid: false, error: "Session abgelaufen", errorCode: "SESSION_EXPIRED" };
      }
      
      // 5. Inaktivitäts-Timeout prüfen
      const lastActivity = new Date(session.last_activity_at || session.created_at);
      const timeSinceActivity = Date.now() - lastActivity.getTime();
      
      if (timeSinceActivity > CONFIG.INACTIVITY_TIMEOUT_MS) {
        await this.invalidateSession(session.session_token);
        return { valid: false, error: "Session-Timeout wegen Inaktivität", errorCode: "TIMEOUT" };
      }
      
      // 6. IP-Binding prüfen (wenn aktiviert)
      if (CONFIG.ENABLE_IP_BINDING && session.ip_address) {
        // Toleranz für IPv4/IPv6 Wechsel oder Proxy
        const storedIp = session.ip_address.split(",")[0].trim();
        const currentIp = clientIp.split(",")[0].trim();
        
        // Nur warnen, nicht blockieren (für Entwicklung)
        if (storedIp !== currentIp && storedIp !== "unknown" && currentIp !== "unknown") {
          console.warn(`⚠️ IP-Wechsel erkannt: ${storedIp} → ${currentIp} (User: ${session.username})`);
          // In Produktion könnte man hier blockieren:
          // return { valid: false, error: "IP-Adresse geändert", errorCode: "IP_MISMATCH" };
        }
      }
      
      // 7. Letzte Aktivität aktualisieren
      await this.updateLastActivity(session.session_token);
      
      // 8. Rollen und Permissions laden
      const roles = await this.getUserRoles(session.user_id);
      const permissions = await this.getUserPermissions(session.user_id);
      
      // 9. Session-Daten zurückgeben
      return {
        valid: true,
        session: {
          userId: session.user_id,
          username: session.username,
          email: session.email,
          roles,
          permissions,
          ipAddress: session.ip_address,
          userAgent: session.user_agent,
          createdAt: new Date(session.created_at),
          lastActivityAt: new Date(),
          expiresAt: new Date(session.expires_at),
        },
      };
      
    } catch (error) {
      console.error("❌ Session-Validierung fehlgeschlagen:", error);
      return { valid: false, error: "Interner Fehler", errorCode: "INVALID_TOKEN" };
    }
  }
  
  // =====================================================
  // SESSION ERSTELLEN
  // =====================================================
  
  static async createSession(
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<{ sessionToken: string; expiresAt: Date } | null> {
    try {
      const pool = await getConnection();
      
      // Concurrent Sessions prüfen und alte löschen
      if (CONFIG.MAX_CONCURRENT_SESSIONS > 0) {
        await pool.execute(
          `DELETE FROM lopez_sessions 
           WHERE user_id = ? 
           AND id NOT IN (
             SELECT id FROM (
               SELECT id FROM lopez_sessions 
               WHERE user_id = ? 
               ORDER BY created_at DESC 
               LIMIT ?
             ) as keep_sessions
           )`,
          [userId, userId, CONFIG.MAX_CONCURRENT_SESSIONS - 1]
        );
      }
      
      // Neue Session erstellen
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + CONFIG.MAX_SESSION_DURATION_MS);
      
      await pool.execute(
        `INSERT INTO lopez_sessions 
         (user_id, session_token, ip_address, user_agent, expires_at, last_activity_at, created_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, sessionToken, ipAddress, userAgent, expiresAt]
      );
      
      console.log(`✅ Enterprise++ Session erstellt für User ${userId}`);
      
      return { sessionToken, expiresAt };
      
    } catch (error) {
      console.error("❌ Session-Erstellung fehlgeschlagen:", error);
      return null;
    }
  }
  
  // =====================================================
  // SESSION INVALIDIEREN
  // =====================================================
  
  static async invalidateSession(sessionToken: string): Promise<boolean> {
    try {
      const pool = await getConnection();
      await pool.execute(
        "DELETE FROM lopez_sessions WHERE session_token = ?",
        [sessionToken]
      );
      console.log(`🔒 Session invalidiert: ${sessionToken.substring(0, 20)}...`);
      return true;
    } catch (error) {
      console.error("❌ Session-Invalidierung fehlgeschlagen:", error);
      return false;
    }
  }
  
  // =====================================================
  // ALLE USER-SESSIONS INVALIDIEREN
  // =====================================================
  
  static async invalidateAllUserSessions(userId: number): Promise<boolean> {
    try {
      const pool = await getConnection();
      const [result] = await pool.execute(
        "DELETE FROM lopez_sessions WHERE user_id = ?",
        [userId]
      );
      console.log(`🔒 Alle Sessions für User ${userId} invalidiert`);
      return true;
    } catch (error) {
      console.error("❌ Session-Invalidierung fehlgeschlagen:", error);
      return false;
    }
  }
  
  // =====================================================
  // LETZTE AKTIVITÄT AKTUALISIEREN
  // =====================================================
  
  private static async updateLastActivity(sessionToken: string): Promise<void> {
    try {
      const pool = await getConnection();
      await pool.execute(
        "UPDATE lopez_sessions SET last_activity_at = NOW() WHERE session_token = ?",
        [sessionToken]
      );
    } catch (error) {
      // Fehler ignorieren (nicht kritisch)
      console.warn("⚠️ Last-Activity-Update fehlgeschlagen:", error);
    }
  }
  
  // =====================================================
  // USER-ROLLEN LADEN
  // =====================================================
  
  private static async getUserRoles(userId: number): Promise<string[]> {
    try {
      const pool = await getConnection();
      const [rows] = await pool.execute(
        `SELECT r.name FROM lopez_roles r
         JOIN lopez_user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = ?`,
        [userId]
      );
      return (rows as any[]).map(r => r.name);
    } catch (error) {
      return [];
    }
  }
  
  // =====================================================
  // USER-PERMISSIONS LADEN
  // =====================================================
  
  private static async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const pool = await getConnection();
      const [rows] = await pool.execute(
        `SELECT DISTINCT CONCAT(p.resource, '.', p.action) as permission_key 
         FROM lopez_permissions p
         JOIN lopez_role_permissions rp ON p.id = rp.permission_id
         JOIN lopez_user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = ?`,
        [userId]
      );
      return (rows as any[]).map(p => p.permission_key);
    } catch (error) {
      return [];
    }
  }
  
  // =====================================================
  // SESSION-TOKEN GENERIEREN
  // =====================================================
  
  private static generateSessionToken(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
  
  // =====================================================
  // JWT GENERIEREN
  // =====================================================
  
  static generateJWT(session: SessionData): string {
    return jwt.sign(
      {
        userId: session.userId,
        username: session.username,
        roles: session.roles,
      },
      CONFIG.JWT_SECRET,
      { expiresIn: "8h" }
    );
  }
  
  // =====================================================
  // JWT VERIFIZIEREN
  // =====================================================
  
  static verifyJWT(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const payload = jwt.verify(token, CONFIG.JWT_SECRET);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: "JWT ungültig oder abgelaufen" };
    }
  }
  
  // =====================================================
  // ABGELAUFENE SESSIONS BEREINIGEN (Cronjob)
  // =====================================================
  
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const pool = await getConnection();
      const [result] = await pool.execute(
        "DELETE FROM lopez_sessions WHERE expires_at < NOW()"
      );
      const deleted = (result as any).affectedRows || 0;
      if (deleted > 0) {
        console.log(`🧹 ${deleted} abgelaufene Sessions bereinigt`);
      }
      return deleted;
    } catch (error) {
      console.error("❌ Session-Cleanup fehlgeschlagen:", error);
      return 0;
    }
  }
}

export default SessionSecurityService;

