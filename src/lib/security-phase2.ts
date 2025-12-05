// =====================================================
// ENTERPRISE++ SECURITY PHASE 2 SERVICE
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Advanced Security - Recovery Codes, Device Tracking,
//        Login History, Risk Detection
// Standard: IBM/SAP/Siemens Security Level
// =====================================================

import { getConnection } from "./database";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// =====================================================
// INTERFACES
// =====================================================

export interface RecoveryCode {
  id: number;
  code: string; // Nur beim Erstellen im Klartext
  used: boolean;
  createdAt: Date;
  usedAt?: Date;
}

export interface UserDevice {
  id: number;
  userId: number;
  deviceFingerprint: string;
  deviceName: string;
  deviceType: string;
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
  userAgent: string;
  deviceId?: number;
  locationCountry?: string;
  locationCity?: string;
  status: "success" | "failed" | "blocked" | "locked";
  failureReason?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors?: string[];
  createdAt: Date;
}

export interface SecurityEvent {
  id: number;
  userId?: number;
  eventType: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  ipAddress?: string;
  details?: Record<string, any>;
  resolved: boolean;
  createdAt: Date;
}

export interface RiskAssessment {
  level: "low" | "medium" | "high" | "critical";
  factors: string[];
  score: number;
  action: "allow" | "warn" | "block" | "lock";
}

// =====================================================
// KONFIGURATION
// =====================================================

const CONFIG = {
  // Recovery Codes
  RECOVERY_CODE_COUNT: 8,
  RECOVERY_CODE_LENGTH: 8,
  
  // Account Lockout
  MAX_FAILED_ATTEMPTS: 3,
  LOCKOUT_DURATION_MINUTES: 10,
  
  // Risk Detection
  RISK_THRESHOLD_HIGH: 70,
  RISK_THRESHOLD_CRITICAL: 90,
  
  // Device Trust
  NEW_DEVICE_RISK_SCORE: 30,
  UNKNOWN_LOCATION_RISK_SCORE: 40,
  FAILED_LOGIN_RISK_SCORE: 20,
};

// =====================================================
// RECOVERY CODES SERVICE
// =====================================================

export class RecoveryCodesService {
  
  /**
   * Generiert neue Recovery Codes für einen Benutzer
   * WICHTIG: Codes werden nur EINMAL im Klartext zurückgegeben!
   */
  static async generateRecoveryCodes(userId: number): Promise<string[]> {
    const pool = await getConnection();
    
    // Alte Codes löschen
    await pool.execute(
      "DELETE FROM lopez_user_2fa_recovery_codes WHERE user_id = ?",
      [userId]
    );
    
    const plainCodes: string[] = [];
    
    // 8 neue Codes generieren
    for (let i = 0; i < CONFIG.RECOVERY_CODE_COUNT; i++) {
      const code = this.generateCode();
      plainCodes.push(code);
      
      // Hash speichern
      const codeHash = await bcrypt.hash(code, 10);
      await pool.execute(
        `INSERT INTO lopez_user_2fa_recovery_codes (user_id, code_hash, used, created_at)
         VALUES (?, ?, FALSE, NOW())`,
        [userId, codeHash]
      );
    }
    
    console.log(`✅ ${CONFIG.RECOVERY_CODE_COUNT} Recovery Codes für User ${userId} generiert`);
    
    // WICHTIG: Diese Codes NUR JETZT zurückgeben, danach nie wieder im Klartext!
    return plainCodes;
  }
  
  /**
   * Verifiziert einen Recovery Code
   */
  static async verifyRecoveryCode(userId: number, code: string): Promise<boolean> {
    const pool = await getConnection();
    
    // Alle ungenutzten Codes laden
    const [rows] = await pool.execute(
      `SELECT id, code_hash FROM lopez_user_2fa_recovery_codes 
       WHERE user_id = ? AND used = FALSE`,
      [userId]
    );
    
    const codes = rows as any[];
    
    for (const storedCode of codes) {
      const isValid = await bcrypt.compare(code.toUpperCase(), storedCode.code_hash);
      
      if (isValid) {
        // Code als verwendet markieren
        await pool.execute(
          `UPDATE lopez_user_2fa_recovery_codes 
           SET used = TRUE, used_at = NOW() 
           WHERE id = ?`,
          [storedCode.id]
        );
        
        console.log(`✅ Recovery Code für User ${userId} verwendet`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Prüft wie viele Recovery Codes noch verfügbar sind
   */
  static async getRemainingCodesCount(userId: number): Promise<number> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_user_2fa_recovery_codes 
       WHERE user_id = ? AND used = FALSE`,
      [userId]
    );
    
    return (rows as any[])[0]?.count || 0;
  }
  
  private static generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Ohne I, O, 0, 1 (Verwechslungsgefahr)
    let code = "";
    for (let i = 0; i < CONFIG.RECOVERY_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

// =====================================================
// DEVICE TRACKING SERVICE
// =====================================================

export class DeviceTrackingService {
  
  /**
   * Registriert oder aktualisiert ein Gerät beim Login
   */
  static async registerDevice(
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<{ device: UserDevice; isNew: boolean }> {
    const pool = await getConnection();
    
    // Device-Fingerprint erstellen
    const fingerprint = this.createFingerprint(ipAddress, userAgent);
    const deviceInfo = this.parseUserAgent(userAgent);
    
    // Prüfen ob Gerät existiert
    const [existing] = await pool.execute(
      `SELECT * FROM lopez_user_devices 
       WHERE user_id = ? AND device_fingerprint = ?`,
      [userId, fingerprint]
    );
    
    const devices = existing as any[];
    
    if (devices.length > 0) {
      // Gerät aktualisieren
      await pool.execute(
        `UPDATE lopez_user_devices 
         SET ip_address = ?, user_agent = ?, last_used_at = NOW()
         WHERE id = ?`,
        [ipAddress, userAgent, devices[0].id]
      );
      
      return {
        device: this.mapDevice(devices[0]),
        isNew: false,
      };
    }
    
    // Neues Gerät registrieren
    const [result] = await pool.execute(
      `INSERT INTO lopez_user_devices 
       (user_id, device_fingerprint, device_name, device_type, browser, os, ip_address, user_agent, is_trusted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [
        userId,
        fingerprint,
        deviceInfo.deviceName,
        deviceInfo.deviceType,
        deviceInfo.browser,
        deviceInfo.os,
        ipAddress,
        userAgent,
      ]
    );
    
    const deviceId = (result as any).insertId;
    
    console.log(`🆕 Neues Gerät für User ${userId} registriert: ${deviceInfo.deviceName}`);
    
    // Security Event für neues Gerät
    await SecurityEventsService.logEvent({
      userId,
      eventType: "NEW_DEVICE_LOGIN",
      severity: "medium",
      ipAddress,
      details: {
        deviceId,
        deviceName: deviceInfo.deviceName,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      },
    });
    
    return {
      device: {
        id: deviceId,
        userId,
        deviceFingerprint: fingerprint,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress,
        userAgent,
        isTrusted: false,
        lastUsedAt: new Date(),
        createdAt: new Date(),
      },
      isNew: true,
    };
  }
  
  /**
   * Holt alle Geräte eines Benutzers
   */
  static async getUserDevices(userId: number): Promise<UserDevice[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_user_devices 
       WHERE user_id = ? 
       ORDER BY last_used_at DESC`,
      [userId]
    );
    
    return (rows as any[]).map(this.mapDevice);
  }
  
  /**
   * Entfernt ein Gerät (meldet es ab)
   */
  static async removeDevice(userId: number, deviceId: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `DELETE FROM lopez_user_devices WHERE id = ? AND user_id = ?`,
      [deviceId, userId]
    );
    
    return (result as any).affectedRows > 0;
  }
  
  /**
   * Entfernt alle Geräte eines Benutzers (außer aktuelles)
   */
  static async removeAllDevicesExcept(userId: number, currentDeviceFingerprint: string): Promise<number> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `DELETE FROM lopez_user_devices 
       WHERE user_id = ? AND device_fingerprint != ?`,
      [userId, currentDeviceFingerprint]
    );
    
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
  
  private static createFingerprint(ip: string, userAgent: string): string {
    // Kombination aus User-Agent Hash (ohne IP für mehr Stabilität)
    const data = userAgent.toLowerCase();
    return crypto.createHash("sha256").update(data).digest("hex").substring(0, 32);
  }
  
  private static parseUserAgent(userAgent: string): {
    deviceName: string;
    deviceType: string;
    browser: string;
    os: string;
  } {
    const ua = userAgent.toLowerCase();
    
    // OS erkennen
    let os = "Unknown OS";
    if (ua.includes("windows nt 10")) os = "Windows 10/11";
    else if (ua.includes("windows")) os = "Windows";
    else if (ua.includes("mac os x")) os = "macOS";
    else if (ua.includes("linux")) os = "Linux";
    else if (ua.includes("android")) os = "Android";
    else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
    
    // Browser erkennen
    let browser = "Unknown Browser";
    if (ua.includes("edg/")) browser = "Microsoft Edge";
    else if (ua.includes("chrome")) browser = "Google Chrome";
    else if (ua.includes("firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("safari")) browser = "Safari";
    else if (ua.includes("opera")) browser = "Opera";
    
    // Device Type
    let deviceType = "desktop";
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      deviceType = "mobile";
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      deviceType = "tablet";
    }
    
    return {
      deviceName: `${browser} auf ${os}`,
      deviceType,
      browser,
      os,
    };
  }
  
  private static mapDevice(row: any): UserDevice {
    return {
      id: row.id,
      userId: row.user_id,
      deviceFingerprint: row.device_fingerprint,
      deviceName: row.device_name,
      deviceType: row.device_type,
      browser: row.browser,
      os: row.os,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      isTrusted: row.is_trusted === 1,
      lastUsedAt: new Date(row.last_used_at),
      createdAt: new Date(row.created_at),
    };
  }
}

// =====================================================
// LOGIN HISTORY SERVICE
// =====================================================

export class LoginHistoryService {
  
  /**
   * Protokolliert einen Login-Versuch
   */
  static async logLogin(
    userId: number,
    ipAddress: string,
    userAgent: string,
    status: "success" | "failed" | "blocked" | "locked",
    options?: {
      failureReason?: string;
      deviceId?: number;
      sessionId?: string;
      riskLevel?: "low" | "medium" | "high" | "critical";
      riskFactors?: string[];
    }
  ): Promise<number> {
    const pool = await getConnection();
    
    // Geo-IP Stub (in Produktion: echten Geo-IP Service verwenden)
    const location = this.getGeoIPStub(ipAddress);
    
    const [result] = await pool.execute(
      `INSERT INTO lopez_login_history 
       (user_id, ip_address, user_agent, device_id, location_country, location_city, 
        status, failure_reason, risk_level, risk_factors, session_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        ipAddress,
        userAgent,
        options?.deviceId || null,
        location.country,
        location.city,
        status,
        options?.failureReason || null,
        options?.riskLevel || "low",
        options?.riskFactors ? JSON.stringify(options.riskFactors) : null,
        options?.sessionId || null,
      ]
    );
    
    return (result as any).insertId;
  }
  
  /**
   * Holt Login-Historie eines Benutzers
   */
  static async getUserLoginHistory(
    userId: number,
    limit: number = 50
  ): Promise<LoginHistoryEntry[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_login_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    
    return (rows as any[]).map(this.mapLoginHistory);
  }
  
  /**
   * Zählt fehlgeschlagene Logins in den letzten X Minuten
   */
  static async getRecentFailedAttempts(
    userId: number,
    minutes: number = 30
  ): Promise<number> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM lopez_login_history 
       WHERE user_id = ? 
       AND status = 'failed' 
       AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [userId, minutes]
    );
    
    return (rows as any[])[0]?.count || 0;
  }
  
  /**
   * Holt Login-Statistiken für Dashboard
   */
  static async getLoginStats(days: number = 7): Promise<{
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    blockedLogins: number;
    uniqueUsers: number;
    riskEvents: number;
  }> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'blocked' OR status = 'locked' THEN 1 ELSE 0 END) as blocked,
        COUNT(DISTINCT user_id) as unique_users,
        SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as risk_events
       FROM lopez_login_history 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    
    const stats = (rows as any[])[0];
    
    return {
      totalLogins: stats.total || 0,
      successfulLogins: stats.successful || 0,
      failedLogins: stats.failed || 0,
      blockedLogins: stats.blocked || 0,
      uniqueUsers: stats.unique_users || 0,
      riskEvents: stats.risk_events || 0,
    };
  }
  
  private static getGeoIPStub(ip: string): { country: string; city: string } {
    // Stub für Geo-IP (in Produktion: echten Service verwenden)
    if (ip === "127.0.0.1" || ip === "::1" || ip === "unknown") {
      return { country: "Local", city: "Localhost" };
    }
    
    // Simulierte Geo-IP basierend auf IP-Präfix
    if (ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return { country: "Deutschland", city: "Lokales Netzwerk" };
    }
    
    return { country: "Deutschland", city: "Unbekannt" };
  }
  
  private static mapLoginHistory(row: any): LoginHistoryEntry {
    return {
      id: row.id,
      userId: row.user_id,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      deviceId: row.device_id,
      locationCountry: row.location_country,
      locationCity: row.location_city,
      status: row.status,
      failureReason: row.failure_reason,
      riskLevel: row.risk_level,
      riskFactors: row.risk_factors ? JSON.parse(row.risk_factors) : [],
      createdAt: new Date(row.created_at),
    };
  }
}

// =====================================================
// RISK DETECTION SERVICE
// =====================================================

export class RiskDetectionService {
  
  /**
   * Bewertet das Risiko eines Login-Versuchs
   */
  static async assessLoginRisk(
    userId: number,
    ipAddress: string,
    userAgent: string,
    deviceId?: number
  ): Promise<RiskAssessment> {
    const factors: string[] = [];
    let score = 0;
    
    const pool = await getConnection();
    
    // 1. Fehlgeschlagene Login-Versuche prüfen
    const failedAttempts = await LoginHistoryService.getRecentFailedAttempts(userId, 30);
    if (failedAttempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
      factors.push(`${failedAttempts} fehlgeschlagene Logins in 30 Min`);
      score += CONFIG.FAILED_LOGIN_RISK_SCORE * failedAttempts;
    }
    
    // 2. Neues Gerät prüfen
    if (!deviceId) {
      const fingerprint = crypto.createHash("sha256").update(userAgent.toLowerCase()).digest("hex").substring(0, 32);
      const [existing] = await pool.execute(
        `SELECT id FROM lopez_user_devices WHERE user_id = ? AND device_fingerprint = ?`,
        [userId, fingerprint]
      );
      
      if ((existing as any[]).length === 0) {
        factors.push("Unbekanntes Gerät");
        score += CONFIG.NEW_DEVICE_RISK_SCORE;
      }
    }
    
    // 3. IP-Wechsel prüfen (letzte erfolgreiche Session)
    const [lastLogin] = await pool.execute(
      `SELECT ip_address FROM lopez_login_history 
       WHERE user_id = ? AND status = 'success' 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    
    if ((lastLogin as any[]).length > 0) {
      const lastIp = (lastLogin as any[])[0].ip_address;
      if (lastIp && lastIp !== ipAddress && lastIp !== "unknown") {
        factors.push(`IP-Wechsel: ${lastIp} → ${ipAddress}`);
        score += 15;
      }
    }
    
    // 4. Ungewöhnliche Uhrzeit prüfen (zwischen 2:00 und 5:00 Uhr)
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 5) {
      factors.push("Login zu ungewöhnlicher Uhrzeit");
      score += 10;
    }
    
    // Risk Level berechnen
    let level: "low" | "medium" | "high" | "critical" = "low";
    let action: "allow" | "warn" | "block" | "lock" = "allow";
    
    if (score >= CONFIG.RISK_THRESHOLD_CRITICAL) {
      level = "critical";
      action = "lock";
    } else if (score >= CONFIG.RISK_THRESHOLD_HIGH) {
      level = "high";
      action = "block";
    } else if (score >= 40) {
      level = "medium";
      action = "warn";
    }
    
    return { level, factors, score, action };
  }
  
  /**
   * Prüft ob Account gesperrt ist
   */
  static async isAccountLocked(userId: number): Promise<{
    locked: boolean;
    unlocksAt?: Date;
    reason?: string;
  }> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute(
      `SELECT * FROM lopez_account_lockouts 
       WHERE user_id = ? AND unlocks_at > NOW() AND unlocked_at IS NULL
       ORDER BY locked_at DESC LIMIT 1`,
      [userId]
    );
    
    const lockouts = rows as any[];
    
    if (lockouts.length > 0) {
      return {
        locked: true,
        unlocksAt: new Date(lockouts[0].unlocks_at),
        reason: lockouts[0].reason,
      };
    }
    
    return { locked: false };
  }
  
  /**
   * Sperrt einen Account
   */
  static async lockAccount(
    userId: number,
    reason: string,
    durationMinutes: number = CONFIG.LOCKOUT_DURATION_MINUTES,
    ipAddress?: string
  ): Promise<void> {
    const pool = await getConnection();
    
    // Fehlversuche zählen
    const failedAttempts = await LoginHistoryService.getRecentFailedAttempts(userId, 30);
    
    await pool.execute(
      `INSERT INTO lopez_account_lockouts 
       (user_id, reason, failed_attempts, locked_at, unlocks_at, ip_address)
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MINUTE), ?)`,
      [userId, reason, failedAttempts, durationMinutes, ipAddress || null]
    );
    
    // Security Event loggen
    await SecurityEventsService.logEvent({
      userId,
      eventType: "ACCOUNT_LOCKED",
      severity: "high",
      ipAddress,
      details: {
        reason,
        durationMinutes,
        failedAttempts,
      },
    });
    
    console.log(`🔒 Account ${userId} gesperrt für ${durationMinutes} Minuten: ${reason}`);
  }
  
  /**
   * Entsperrt einen Account manuell
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
      await SecurityEventsService.logEvent({
        userId,
        eventType: "ACCOUNT_UNLOCKED",
        severity: "info",
        details: { unlockedBy },
      });
      
      console.log(`🔓 Account ${userId} manuell entsperrt von User ${unlockedBy}`);
      return true;
    }
    
    return false;
  }
}

// =====================================================
// SECURITY EVENTS SERVICE
// =====================================================

export class SecurityEventsService {
  
  /**
   * Loggt ein Security Event
   */
  static async logEvent(event: {
    userId?: number;
    eventType: string;
    severity: "info" | "low" | "medium" | "high" | "critical";
    ipAddress?: string;
    userAgent?: string;
    deviceId?: number;
    details?: Record<string, any>;
  }): Promise<number> {
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `INSERT INTO lopez_security_events 
       (user_id, event_type, severity, ip_address, user_agent, device_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        event.userId || null,
        event.eventType,
        event.severity,
        event.ipAddress || null,
        event.userAgent || null,
        event.deviceId || null,
        event.details ? JSON.stringify(event.details) : null,
      ]
    );
    
    console.log(`🔔 Security Event: ${event.eventType} (${event.severity})`);
    
    return (result as any).insertId;
  }
  
  /**
   * Holt Security Events für Dashboard
   */
  static async getSecurityEvents(options?: {
    userId?: number;
    severity?: string;
    eventType?: string;
    limit?: number;
    onlyUnresolved?: boolean;
  }): Promise<SecurityEvent[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM lopez_security_events WHERE 1=1";
    const params: any[] = [];
    
    if (options?.userId) {
      query += " AND user_id = ?";
      params.push(options.userId);
    }
    
    if (options?.severity) {
      query += " AND severity = ?";
      params.push(options.severity);
    }
    
    if (options?.eventType) {
      query += " AND event_type = ?";
      params.push(options.eventType);
    }
    
    if (options?.onlyUnresolved) {
      query += " AND resolved = FALSE";
    }
    
    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(options?.limit || 100);
    
    const [rows] = await pool.execute(query, params);
    
    return (rows as any[]).map(row => ({
      id: row.id,
      userId: row.user_id,
      eventType: row.event_type,
      severity: row.severity,
      ipAddress: row.ip_address,
      details: row.details ? JSON.parse(row.details) : null,
      resolved: row.resolved === 1,
      createdAt: new Date(row.created_at),
    }));
  }
  
  /**
   * Markiert Event als gelöst
   */
  static async resolveEvent(eventId: number, resolvedBy: number): Promise<boolean> {
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
   * Holt Security-Statistiken für Dashboard
   */
  static async getSecurityStats(days: number = 7): Promise<{
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    unresolvedEvents: number;
    topEventTypes: { type: string; count: number }[];
  }> {
    const pool = await getConnection();
    
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical,
        SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high,
        SUM(CASE WHEN resolved = FALSE THEN 1 ELSE 0 END) as unresolved
       FROM lopez_security_events 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    
    const [topTypes] = await pool.execute(
      `SELECT event_type as type, COUNT(*) as count
       FROM lopez_security_events 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY event_type
       ORDER BY count DESC
       LIMIT 10`,
      [days]
    );
    
    const s = (stats as any[])[0];
    
    return {
      totalEvents: s.total || 0,
      criticalEvents: s.critical || 0,
      highEvents: s.high || 0,
      unresolvedEvents: s.unresolved || 0,
      topEventTypes: (topTypes as any[]).map(t => ({ type: t.type, count: t.count })),
    };
  }
}

export default {
  RecoveryCodesService,
  DeviceTrackingService,
  LoginHistoryService,
  RiskDetectionService,
  SecurityEventsService,
};

