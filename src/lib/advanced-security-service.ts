// =====================================================
// ENTERPRISE++ ADVANCED SECURITY SERVICE (PHASE 2)
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Recovery Codes, Device Tracking, Login History,
//        Risk Detection, Account Lockout
// Standard: IBM/SAP/Siemens Security Level
// =====================================================

import { getConnection } from "./database";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// =====================================================
// INTERFACES
// =====================================================

export interface RecoveryCode {
  code: string;
  used: boolean;
  createdAt: Date;
  usedAt?: Date;
}

export interface UserDevice {
  id: number;
  userId: number;
  deviceFingerprint: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  userAgent: string;
  isTrusted: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

export interface LoginHistoryEntry {
  id: number;
  userId: number;
  ipAddress: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  status: "success" | "failed" | "blocked" | "locked";
  failureReason?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  createdAt: Date;
}

export interface SecurityEvent {
  id: number;
  userId?: number;
  eventType: string;
  ipAddress: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  details: any;
  resolved: boolean;
  createdAt: Date;
}

export interface RiskAssessment {
  level: "low" | "medium" | "high" | "critical";
  reasons: string[];
  shouldBlock: boolean;
  shouldWarn: boolean;
}

// =====================================================
// KONFIGURATION
// =====================================================

const CONFIG = {
  // Account-Lock nach X fehlgeschlagenen Logins
  MAX_FAILED_LOGINS: 3,
  
  // Lockout-Dauer in Minuten
  LOCKOUT_DURATION_MINUTES: 10,
  
  // Anzahl Recovery Codes
  RECOVERY_CODE_COUNT: 8,
  
  // Recovery Code Länge
  RECOVERY_CODE_LENGTH: 8,
  
  // Geo-IP Stub (echte Integration später)
  ENABLE_GEO_IP: false,
};

// =====================================================
// ADVANCED SECURITY SERVICE
// =====================================================

export class AdvancedSecurityService {
  
  // =====================================================
  // 1) RECOVERY CODES
  // =====================================================
  
  /**
   * Generiert neue Recovery Codes für einen Benutzer
   * WICHTIG: Codes werden nur einmal im Klartext zurückgegeben!
   */
  static async generateRecoveryCodes(userId: number): Promise<string[]> {
    const pool = await getConnection();
    
    // Alte Codes löschen
    await pool.execute(
      "DELETE FROM lopez_user_2fa_recovery_codes WHERE user_id = ?",
      [userId]
    );
    
    const codes: string[] = [];
    
    // 8 neue Codes generieren
    for (let i = 0; i < CONFIG.RECOVERY_CODE_COUNT; i++) {
      const code = this.generateRandomCode(CONFIG.RECOVERY_CODE_LENGTH);
      const codeHash = await bcrypt.hash(code, 10);
      
      await pool.execute(
        `INSERT INTO lopez_user_2fa_recovery_codes (user_id, code_hash, used, created_at)
         VALUES (?, ?, FALSE, NOW())`,
        [userId, codeHash]
      );
      
      codes.push(code);
    }
    
    console.log(`✅ ${CONFIG.RECOVERY_CODE_COUNT} Recovery Codes für User ${userId} generiert`);
    
    return codes;
  }
  
  /**
   * Verifiziert einen Recovery Code
   * Wenn gültig: Code wird als verwendet markiert
   */
  static async verifyRecoveryCode(userId: number, code: string): Promise<boolean> {
    const pool = await getConnection();
    
    // Alle ungenutzten Codes des Users laden
    const [rows] = await pool.execute(
      `SELECT id, code_hash FROM lopez_user_2fa_recovery_codes 
       WHERE user_id = ? AND used = FALSE`,
      [userId]
    );
    
    const codes = rows as any[];
    
    for (const storedCode of codes) {
      const isValid = await bcrypt.compare(code, storedCode.code_hash);
      
      if (isValid) {
        // Code als verwendet markieren
        await pool.execute(
          `UPDATE lopez_user_2fa_recovery_codes 
           SET used = TRUE, used_at = NOW() 
           WHERE id = ?`,
          [storedCode.id]
        );
        
        // Security Event loggen
        await this.logSecurityEvent(userId, "RECOVERY_CODE_USED", "medium", {
          codeId: storedCode.id,
          remainingCodes: codes.length - 1,
        });
        
        console.log(`✅ Recovery Code verwendet für User ${userId}`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Gibt die Anzahl der verbleibenden Recovery Codes zurück
   */
  static async getRemainingRecoveryCodeCount(userId: number): Promise<number> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_user_2fa_recovery_codes 
       WHERE user_id = ? AND used = FALSE`,
      [userId]
    );
    
    return (rows as any[])[0]?.count || 0;
  }
  
  // =====================================================
  // 2) DEVICE TRACKING
  // =====================================================
  
  /**
   * Registriert oder aktualisiert ein Gerät
   */
  static async trackDevice(
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<{ device: UserDevice; isNew: boolean }> {
    const pool = await getConnection();
    
    // Device Fingerprint erstellen
    const fingerprint = this.createDeviceFingerprint(userAgent, ipAddress);
    const { browser, os } = this.parseUserAgent(userAgent);
    const deviceName = `${browser} auf ${os}`;
    
    // Prüfen ob Gerät existiert
    const [existing] = await pool.execute(
      `SELECT * FROM lopez_user_devices 
       WHERE user_id = ? AND device_fingerprint = ?`,
      [userId, fingerprint]
    );
    
    const existingDevice = (existing as any[])[0];
    
    if (existingDevice) {
      // Gerät aktualisieren
      await pool.execute(
        `UPDATE lopez_user_devices 
         SET ip_address = ?, user_agent = ?, last_used_at = NOW() 
         WHERE id = ?`,
        [ipAddress, userAgent, existingDevice.id]
      );
      
      return {
        device: {
          ...existingDevice,
          ipAddress,
          lastUsedAt: new Date(),
        },
        isNew: false,
      };
    }
    
    // Neues Gerät registrieren
    const [result] = await pool.execute(
      `INSERT INTO lopez_user_devices 
       (user_id, device_fingerprint, device_name, browser, os, ip_address, user_agent, is_trusted)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [userId, fingerprint, deviceName, browser, os, ipAddress, userAgent]
    );
    
    const deviceId = (result as any).insertId;
    
    // Security Event für neues Gerät
    await this.logSecurityEvent(userId, "NEW_DEVICE", "medium", {
      deviceId,
      deviceName,
      browser,
      os,
      ipAddress,
    });
    
    console.log(`🆕 Neues Gerät registriert für User ${userId}: ${deviceName}`);
    
    const [newDevice] = await pool.execute(
      "SELECT * FROM lopez_user_devices WHERE id = ?",
      [deviceId]
    );
    
    return {
      device: (newDevice as any[])[0],
      isNew: true,
    };
  }
  
  /**
   * Gibt alle Geräte eines Benutzers zurück
   */
  static async getUserDevices(userId: number): Promise<UserDevice[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_user_devices 
       WHERE user_id = ? 
       ORDER BY last_used_at DESC`,
      [userId]
    );
    
    return rows as UserDevice[];
  }
  
  /**
   * Entfernt ein Gerät
   */
  static async removeDevice(userId: number, deviceId: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      "DELETE FROM lopez_user_devices WHERE id = ? AND user_id = ?",
      [deviceId, userId]
    );
    
    return (result as any).affectedRows > 0;
  }
  
  /**
   * Entfernt alle Geräte eines Benutzers
   */
  static async removeAllDevices(userId: number, exceptDeviceId?: number): Promise<number> {
    const pool = await getConnection();
    
    let query = "DELETE FROM lopez_user_devices WHERE user_id = ?";
    const params: any[] = [userId];
    
    if (exceptDeviceId) {
      query += " AND id != ?";
      params.push(exceptDeviceId);
    }
    
    const [result] = await pool.execute(query, params);
    
    return (result as any).affectedRows;
  }
  
  /**
   * Markiert ein Gerät als vertrauenswürdig
   */
  static async trustDevice(userId: number, deviceId: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `UPDATE lopez_user_devices SET is_trusted = TRUE WHERE id = ? AND user_id = ?`,
      [deviceId, userId]
    );
    
    return (result as any).affectedRows > 0;
  }
  
  // =====================================================
  // 3) LOGIN HISTORY
  // =====================================================
  
  /**
   * Loggt einen Login-Versuch
   */
  static async logLoginAttempt(
    userId: number,
    ipAddress: string,
    userAgent: string,
    status: "success" | "failed" | "blocked" | "locked",
    failureReason?: string,
    sessionToken?: string
  ): Promise<LoginHistoryEntry> {
    const pool = await getConnection();
    
    const { browser, os } = this.parseUserAgent(userAgent);
    const { country, city } = this.getGeoLocation(ipAddress);
    const riskLevel = await this.assessLoginRisk(userId, ipAddress, userAgent);
    
    const [result] = await pool.execute(
      `INSERT INTO lopez_login_history 
       (user_id, ip_address, user_agent, browser, os, country, city, status, failure_reason, risk_level, session_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, ipAddress, userAgent, browser, os, country, city, status, failureReason, riskLevel.level, sessionToken]
    );
    
    const entryId = (result as any).insertId;
    
    // Bei hohem Risiko Security Event erstellen
    if (riskLevel.level === "high" || riskLevel.level === "critical") {
      await this.logSecurityEvent(userId, "SUSPICIOUS_ACTIVITY", riskLevel.level, {
        loginHistoryId: entryId,
        reasons: riskLevel.reasons,
        ipAddress,
        browser,
        os,
      });
    }
    
    return {
      id: entryId,
      userId,
      ipAddress,
      browser,
      os,
      country,
      city,
      status,
      failureReason,
      riskLevel: riskLevel.level,
      createdAt: new Date(),
    };
  }
  
  /**
   * Gibt die Login-Historie eines Benutzers zurück
   */
  static async getLoginHistory(userId: number, limit: number = 50): Promise<LoginHistoryEntry[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_login_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    
    return rows as LoginHistoryEntry[];
  }
  
  /**
   * Gibt globale Login-Statistiken zurück
   */
  static async getLoginStats(days: number = 7): Promise<{
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    blockedLogins: number;
    uniqueUsers: number;
    uniqueIPs: number;
    highRiskEvents: number;
  }> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as totalLogins,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successfulLogins,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failedLogins,
        SUM(CASE WHEN status = 'blocked' OR status = 'locked' THEN 1 ELSE 0 END) as blockedLogins,
        COUNT(DISTINCT user_id) as uniqueUsers,
        COUNT(DISTINCT ip_address) as uniqueIPs,
        SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as highRiskEvents
       FROM lopez_login_history 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    
    const stats = (rows as any[])[0];
    
    return {
      totalLogins: stats.totalLogins || 0,
      successfulLogins: stats.successfulLogins || 0,
      failedLogins: stats.failedLogins || 0,
      blockedLogins: stats.blockedLogins || 0,
      uniqueUsers: stats.uniqueUsers || 0,
      uniqueIPs: stats.uniqueIPs || 0,
      highRiskEvents: stats.highRiskEvents || 0,
    };
  }
  
  // =====================================================
  // 4) RISK DETECTION
  // =====================================================
  
  /**
   * Bewertet das Risiko eines Login-Versuchs
   */
  static async assessLoginRisk(
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<RiskAssessment> {
    const pool = await getConnection();
    const reasons: string[] = [];
    let level: "low" | "medium" | "high" | "critical" = "low";
    
    // 1. Prüfen ob IP bekannt ist
    const [knownIPs] = await pool.execute(
      `SELECT DISTINCT ip_address FROM lopez_login_history 
       WHERE user_id = ? AND status = 'success' 
       ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );
    
    const knownIPList = (knownIPs as any[]).map(r => r.ip_address);
    
    if (knownIPList.length > 0 && !knownIPList.includes(ipAddress)) {
      reasons.push("Neue IP-Adresse");
      level = "medium";
    }
    
    // 2. Prüfen ob Gerät bekannt ist
    const fingerprint = this.createDeviceFingerprint(userAgent, ipAddress);
    const [knownDevice] = await pool.execute(
      `SELECT * FROM lopez_user_devices 
       WHERE user_id = ? AND device_fingerprint = ?`,
      [userId, fingerprint]
    );
    
    if ((knownDevice as any[]).length === 0) {
      reasons.push("Unbekanntes Gerät");
      if (level === "low") level = "medium";
    }
    
    // 3. Fehlgeschlagene Login-Versuche der letzten Stunde
    const [failedAttempts] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_login_history 
       WHERE user_id = ? AND status = 'failed' 
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [userId]
    );
    
    const failedCount = (failedAttempts as any[])[0]?.count || 0;
    
    if (failedCount >= 2) {
      reasons.push(`${failedCount} fehlgeschlagene Versuche in der letzten Stunde`);
      level = "high";
    }
    
    // 4. Geo-IP Check (Stub - später mit echtem Service)
    const { country } = this.getGeoLocation(ipAddress);
    const [lastCountry] = await pool.execute(
      `SELECT country FROM lopez_login_history 
       WHERE user_id = ? AND status = 'success' 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    
    const previousCountry = (lastCountry as any[])[0]?.country;
    
    if (previousCountry && previousCountry !== country && country !== "Unknown") {
      reasons.push(`Neues Land: ${country} (vorher: ${previousCountry})`);
      level = "high";
    }
    
    // 5. Brute-Force Erkennung (IP)
    const [ipAttempts] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_login_history 
       WHERE ip_address = ? AND status = 'failed' 
       AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)`,
      [ipAddress]
    );
    
    const ipFailedCount = (ipAttempts as any[])[0]?.count || 0;
    
    if (ipFailedCount >= 5) {
      reasons.push(`Brute-Force Verdacht: ${ipFailedCount} Versuche von dieser IP`);
      level = "critical";
      
      await this.logSecurityEvent(null, "BRUTE_FORCE_ATTEMPT", "critical", {
        ipAddress,
        attemptCount: ipFailedCount,
      });
    }
    
    return {
      level,
      reasons,
      shouldBlock: level === "critical",
      shouldWarn: level === "high" || level === "critical",
    };
  }
  
  // =====================================================
  // 5) ACCOUNT LOCKOUT
  // =====================================================
  
  /**
   * Prüft ob ein Account gesperrt ist
   */
  static async isAccountLocked(userId: number): Promise<{ locked: boolean; until?: Date; reason?: string }> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_account_lockouts 
       WHERE user_id = ? AND locked_until > NOW() AND unlocked_at IS NULL
       ORDER BY locked_at DESC LIMIT 1`,
      [userId]
    );
    
    const lockout = (rows as any[])[0];
    
    if (lockout) {
      return {
        locked: true,
        until: new Date(lockout.locked_until),
        reason: lockout.reason,
      };
    }
    
    return { locked: false };
  }
  
  /**
   * Sperrt einen Account
   */
  static async lockAccount(
    userId: number,
    reason: "failed_logins" | "suspicious_activity" | "admin_action" | "risk_detected",
    durationMinutes: number = CONFIG.LOCKOUT_DURATION_MINUTES
  ): Promise<void> {
    const pool = await getConnection();
    
    const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
    
    await pool.execute(
      `INSERT INTO lopez_account_lockouts (user_id, reason, locked_until)
       VALUES (?, ?, ?)`,
      [userId, reason, lockedUntil]
    );
    
    // Security Event
    await this.logSecurityEvent(userId, "ACCOUNT_LOCKED", "high", {
      reason,
      lockedUntil: lockedUntil.toISOString(),
      durationMinutes,
    });
    
    console.log(`🔒 Account ${userId} gesperrt bis ${lockedUntil.toISOString()} (${reason})`);
  }
  
  /**
   * Entsperrt einen Account
   */
  static async unlockAccount(userId: number, unlockedBy: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `UPDATE lopez_account_lockouts 
       SET unlocked_at = NOW(), unlocked_by = ? 
       WHERE user_id = ? AND unlocked_at IS NULL`,
      [unlockedBy, userId]
    );
    
    if ((result as any).affectedRows > 0) {
      await this.logSecurityEvent(userId, "ACCOUNT_UNLOCKED", "medium", {
        unlockedBy,
      });
      
      console.log(`🔓 Account ${userId} entsperrt von User ${unlockedBy}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Prüft fehlgeschlagene Logins und sperrt bei Bedarf
   */
  static async checkAndLockIfNeeded(userId: number): Promise<boolean> {
    const pool = await getConnection();
    
    // Fehlgeschlagene Logins seit letztem erfolgreichen Login
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_login_history 
       WHERE user_id = ? AND status = 'failed' 
       AND created_at > COALESCE(
         (SELECT MAX(created_at) FROM lopez_login_history WHERE user_id = ? AND status = 'success'),
         DATE_SUB(NOW(), INTERVAL 1 DAY)
       )`,
      [userId, userId]
    );
    
    const failedCount = (rows as any[])[0]?.count || 0;
    
    if (failedCount >= CONFIG.MAX_FAILED_LOGINS) {
      await this.lockAccount(userId, "failed_logins");
      return true;
    }
    
    return false;
  }
  
  // =====================================================
  // 6) SECURITY EVENTS
  // =====================================================
  
  /**
   * Loggt ein Security Event
   */
  static async logSecurityEvent(
    userId: number | null,
    eventType: string,
    riskLevel: "low" | "medium" | "high" | "critical",
    details: any,
    ipAddress?: string,
    userAgent?: string,
    deviceId?: number
  ): Promise<number> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `INSERT INTO lopez_security_events 
       (user_id, event_type, risk_level, details, ip_address, user_agent, device_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, eventType, riskLevel, JSON.stringify(details), ipAddress, userAgent, deviceId]
    );
    
    return (result as any).insertId;
  }
  
  /**
   * Gibt Security Events zurück
   */
  static async getSecurityEvents(
    filters: {
      userId?: number;
      eventType?: string;
      riskLevel?: string;
      resolved?: boolean;
      limit?: number;
    } = {}
  ): Promise<SecurityEvent[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM lopez_security_events WHERE 1=1";
    const params: any[] = [];
    
    if (filters.userId) {
      query += " AND user_id = ?";
      params.push(filters.userId);
    }
    
    if (filters.eventType) {
      query += " AND event_type = ?";
      params.push(filters.eventType);
    }
    
    if (filters.riskLevel) {
      query += " AND risk_level = ?";
      params.push(filters.riskLevel);
    }
    
    if (filters.resolved !== undefined) {
      query += " AND resolved = ?";
      params.push(filters.resolved);
    }
    
    query += " ORDER BY created_at DESC";
    
    if (filters.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);
    }
    
    const [rows] = await pool.execute(query, params);
    
    return (rows as any[]).map(row => ({
      ...row,
      details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
    }));
  }
  
  /**
   * Markiert ein Security Event als gelöst
   */
  static async resolveSecurityEvent(eventId: number, resolvedBy: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `UPDATE lopez_security_events 
       SET resolved = TRUE, resolved_at = NOW(), resolved_by = ? 
       WHERE id = ?`,
      [resolvedBy, eventId]
    );
    
    return (result as any).affectedRows > 0;
  }
  
  /**
   * Gibt Security-Statistiken zurück
   */
  static async getSecurityStats(days: number = 7): Promise<{
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    unresolvedEvents: number;
    eventsByType: Record<string, number>;
    topRiskIPs: Array<{ ip: string; count: number }>;
  }> {
    const pool = await getConnection();
    
    // Gesamt-Statistiken
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as totalEvents,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as criticalEvents,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as highEvents,
        SUM(CASE WHEN resolved = FALSE THEN 1 ELSE 0 END) as unresolvedEvents
       FROM lopez_security_events 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    
    // Events nach Typ
    const [eventTypes] = await pool.execute(
      `SELECT event_type, COUNT(*) as count 
       FROM lopez_security_events 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY event_type`,
      [days]
    );
    
    // Top Risk IPs
    const [topIPs] = await pool.execute(
      `SELECT ip_address as ip, COUNT(*) as count 
       FROM lopez_security_events 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY) 
       AND ip_address IS NOT NULL
       AND risk_level IN ('high', 'critical')
       GROUP BY ip_address 
       ORDER BY count DESC 
       LIMIT 10`,
      [days]
    );
    
    const eventsByType: Record<string, number> = {};
    (eventTypes as any[]).forEach(row => {
      eventsByType[row.event_type] = row.count;
    });
    
    const statsRow = (stats as any[])[0];
    
    return {
      totalEvents: statsRow.totalEvents || 0,
      criticalEvents: statsRow.criticalEvents || 0,
      highEvents: statsRow.highEvents || 0,
      unresolvedEvents: statsRow.unresolvedEvents || 0,
      eventsByType,
      topRiskIPs: topIPs as Array<{ ip: string; count: number }>,
    };
  }
  
  // =====================================================
  // HILFSFUNKTIONEN
  // =====================================================
  
  private static generateRandomCode(length: number): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Keine verwirrenden Zeichen (0,O,1,I)
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  private static createDeviceFingerprint(userAgent: string, ipAddress: string): string {
    // Vereinfachter Fingerprint aus User-Agent
    const { browser, os } = this.parseUserAgent(userAgent);
    const data = `${browser}|${os}|${userAgent.length}`;
    return crypto.createHash("sha256").update(data).digest("hex").substring(0, 32);
  }
  
  private static parseUserAgent(userAgent: string): { browser: string; os: string } {
    let browser = "Unknown";
    let os = "Unknown";
    
    // Browser erkennen
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";
    
    // OS erkennen
    if (userAgent.includes("Windows NT 10")) os = "Windows 10/11";
    else if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS X")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iOS") || userAgent.includes("iPhone")) os = "iOS";
    
    return { browser, os };
  }
  
  private static getGeoLocation(ipAddress: string): { country: string; city: string } {
    // GEO-IP STUB - Später mit echtem Service (MaxMind, ipinfo.io, etc.)
    // Für Entwicklung: Dummy-Werte basierend auf IP-Range
    
    if (ipAddress.startsWith("192.168") || ipAddress.startsWith("10.") || ipAddress === "127.0.0.1") {
      return { country: "Local", city: "Development" };
    }
    
    if (ipAddress.startsWith("::1") || ipAddress === "unknown") {
      return { country: "Unknown", city: "Unknown" };
    }
    
    // Simulierte Geo-Daten für Demo
    const hash = ipAddress.split(".").reduce((a, b) => a + parseInt(b || "0"), 0);
    const countries = ["Germany", "Austria", "Switzerland", "USA", "UK"];
    const cities = ["Berlin", "Vienna", "Zurich", "New York", "London"];
    
    const index = hash % countries.length;
    
    return {
      country: countries[index],
      city: cities[index],
    };
  }
}

export default AdvancedSecurityService;









