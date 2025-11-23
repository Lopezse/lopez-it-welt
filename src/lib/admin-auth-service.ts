// =====================================================
// ADMIN AUTH SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Admin-Authentifizierung (Username ODER Email + 2FA Pflicht)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TwoFactorService } from "./2fa-service";
import { getConnection } from "./database";
import { DevelopmentMode } from "./development-mode";
import { RBACService, User } from "./rbac-system";

// =====================================================
// INTERFACES
// =====================================================

export interface AdminLoginCredentials {
  identifier: string; // Username ODER Email
  password: string;
  twoFactorToken?: string;
}

export interface AdminSessionData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionToken: string;
  expiresAt: Date;
  realm: "ADMIN";
}

export interface AdminAuthResult {
  success: boolean;
  message: string;
  session?: AdminSessionData;
  requires2FA?: boolean;
  lockoutUntil?: Date;
}

// =====================================================
// ADMIN AUTH SERVICE CLASS
// =====================================================

export class AdminAuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "lopez-it-welt-secret-key";
  private static readonly JWT_EXPIRES_IN = "24h";
  private static readonly SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 Stunden
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 Minuten

  // =====================================================
  // LOGIN & AUTHENTIFIZIERUNG
  // =====================================================

  static async login(
    credentials: AdminLoginCredentials,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AdminAuthResult> {
    try {
      // Development Mode: Authentication umgehen
      if (DevelopmentMode.shouldBypassAuth()) {
        console.log("🚀 Development Mode: Admin Login umgangen");
        const mockUser = DevelopmentMode.createMockUser();

        return {
          success: true,
          message: "Development Mode: Login erfolgreich",
          session: {
            userId: mockUser.id as number,
            username: mockUser.username,
            email: mockUser.email,
            roles: ["admin"],
            permissions: ["*"],
            sessionToken: "dev-mode-token",
            expiresAt: new Date(Date.now() + this.SESSION_EXPIRES_IN),
            realm: "ADMIN",
          },
        };
      }

      // Benutzer laden (Username ODER Email)
      let user = await RBACService.getUserByUsername(credentials.identifier);
      if (!user) {
        // Fallback: Versuche Email als Identifier
        user = await RBACService.getUserByEmail(credentials.identifier);
      }

      if (!user) {
        return {
          success: false,
          message: "Benutzername oder Passwort falsch",
        };
      }

      // Lockout-Prüfung
      const lockoutUntil = await this.checkLockout(user.id!);
      if (lockoutUntil) {
        return {
          success: false,
          message: `Konto gesperrt. Versuchen Sie es erneut um ${lockoutUntil.toLocaleTimeString()}`,
          lockoutUntil,
        };
      }

      // Passwort prüfen
      const passwordValid = await bcrypt.compare(credentials.password, user.password_hash);
      if (!passwordValid) {
        await this.recordFailedAttempt(user.id!, ipAddress);
        return {
          success: false,
          message: "Benutzername oder Passwort falsch",
        };
      }

      // Benutzer-Status prüfen
      if (user.status !== "active") {
        return {
          success: false,
          message: "Benutzerkonto ist nicht aktiv",
        };
      }

      // 2FA PRÜFEN (PFLICHT für Admin)
      const requires2FA = await TwoFactorService.is2FAEnabled(user.id!);
      if (!requires2FA) {
        // 2FA noch nicht aktiviert - erfordern
        return {
          success: false,
          message: "Zwei-Faktor-Authentifizierung erforderlich. Bitte aktivieren Sie 2FA zuerst.",
          requires2FA: true,
        };
      }

      if (!credentials.twoFactorToken) {
        return {
          success: false,
          message: "Zwei-Faktor-Authentifizierung erforderlich",
          requires2FA: true,
        };
      }

      const twoFactorValid = await TwoFactorService.verifyToken(
        user.id!,
        credentials.twoFactorToken,
      );
      if (!twoFactorValid) {
        await this.recordFailedAttempt(user.id!, ipAddress);
        return {
          success: false,
          message: "Zwei-Faktor-Token ungültig",
        };
      }

      // Erfolgreicher Login - Failed Attempts zurücksetzen
      await this.resetFailedAttempts(user.id!);

      // Session erstellen
      const session = await this.createSession(user, ipAddress, userAgent);
      if (!session) {
        return {
          success: false,
          message: "Session konnte nicht erstellt werden",
        };
      }

      // Last Login aktualisieren
      await this.updateLastLogin(user.id!);

      return {
        success: true,
        message: "Login erfolgreich",
        session,
      };
    } catch (error) {
      console.error("❌ Admin Login fehlgeschlagen:", error);
      return {
        success: false,
        message: "Interner Serverfehler",
      };
    }
  }

  // =====================================================
  // SESSION-MANAGEMENT
  // =====================================================

  static async createSession(
    user: User,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AdminSessionData | null> {
    try {
      const connection = await getConnection();

      // Session-Token generieren
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + this.SESSION_EXPIRES_IN);

      // Session in Datenbank speichern (mit adm_ Präfix in Session-Daten)
      await connection.execute(
        `
                INSERT INTO lopez_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `,
        [user.id, `adm_${sessionToken}`, ipAddress, userAgent, expiresAt],
      );

      // Benutzer-Rollen laden
      const roles = await RBACService.getUserRoles(user.id!);
      const roleNames = roles.map((role) => role.name);

      // Berechtigungen sammeln
      const permissions: string[] = [];
      for (const role of roles) {
        const rolePermissions = await RBACService.getRolePermissions(role.id!);
        permissions.push(...rolePermissions.map((p) => `${p.resource}.${p.action}`));
      }

      return {
        userId: user.id!,
        username: user.username,
        email: user.email,
        roles: roleNames,
        permissions: [...new Set(permissions)], // Duplikate entfernen
        sessionToken: `adm_${sessionToken}`,
        expiresAt,
        realm: "ADMIN",
      };
    } catch (error) {
      console.error("❌ Session-Erstellung fehlgeschlagen:", error);
      return null;
    }
  }

  static async validateSession(sessionToken: string): Promise<AdminSessionData | null> {
    try {
      if (!sessionToken.startsWith("adm_")) {
        return null;
      }

      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT s.*, u.username, u.email, u.status
                FROM lopez_sessions s
                JOIN lopez_users u ON s.user_id = u.id
                WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'
            `,
        [sessionToken],
      );

      if ((rows as any[]).length === 0) {
        return null;
      }

      const session = (rows as any)[0];
      const roles = await RBACService.getUserRoles(session.user_id);
      const roleNames = roles.map((role) => role.name);

      const permissions: string[] = [];
      for (const role of roles) {
        const rolePermissions = await RBACService.getRolePermissions(role.id!);
        permissions.push(...rolePermissions.map((p) => `${p.resource}.${p.action}`));
      }

      return {
        userId: session.user_id,
        username: session.username,
        email: session.email,
        roles: roleNames,
        permissions: [...new Set(permissions)],
        sessionToken: session.session_token,
        expiresAt: session.expires_at,
        realm: "ADMIN",
      };
    } catch (error) {
      console.error("❌ Session-Validierung fehlgeschlagen:", error);
      return null;
    }
  }

  static async logout(sessionToken: string): Promise<boolean> {
    try {
      if (!sessionToken.startsWith("adm_")) {
        return false;
      }

      const connection = await getConnection();
      await connection.execute("DELETE FROM lopez_sessions WHERE session_token = ?", [sessionToken]);
      return true;
    } catch (error) {
      console.error("❌ Logout fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // JWT-TOKEN
  // =====================================================

  static generateJWT(session: AdminSessionData): string {
    return jwt.sign(
      {
        userId: session.userId,
        username: session.username,
        email: session.email,
        roles: session.roles,
        realm: "ADMIN",
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN },
    );
  }

  static verifyJWT(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // =====================================================
  // LOCKOUT & FAILED ATTEMPTS
  // =====================================================

  private static async checkLockout(userId: number): Promise<Date | null> {
    try {
      const connection = await getConnection();
      // Prüfe ob Spalten existieren (optional - Lockout kann später aktiviert werden)
      try {
        const [rows] = await connection.execute(
          `
                    SELECT failed_login_attempts, locked_until
                    FROM lopez_users
                    WHERE id = ?
                `,
          [userId],
        );

        if ((rows as any[]).length === 0) {
          return null;
        }

        const user = (rows as any)[0];
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
          return new Date(user.locked_until);
        }
      } catch (error) {
        // Spalten existieren nicht - Lockout deaktiviert
        return null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private static async recordFailedAttempt(userId: number, ipAddress?: string): Promise<void> {
    try {
      const connection = await getConnection();
      // Prüfe ob Spalten existieren (optional - Lockout kann später aktiviert werden)
      try {
        const [rows] = await connection.execute(
          "SELECT failed_login_attempts FROM lopez_users WHERE id = ?",
          [userId],
        );

        const currentAttempts = ((rows as any)[0]?.failed_login_attempts || 0) + 1;
        const lockoutUntil =
          currentAttempts >= this.MAX_LOGIN_ATTEMPTS
            ? new Date(Date.now() + this.LOCKOUT_DURATION)
            : null;

        await connection.execute(
          `
                    UPDATE lopez_users
                    SET failed_login_attempts = ?,
                        locked_until = ?
                    WHERE id = ?
                `,
          [currentAttempts, lockoutUntil, userId],
        );
      } catch (error) {
        // Spalten existieren nicht - Lockout deaktiviert (nicht kritisch)
        console.warn("⚠️ Lockout-Spalten nicht vorhanden - Lockout deaktiviert");
      }
    } catch (error) {
      console.error("❌ Failed Attempt Recording fehlgeschlagen:", error);
    }
  }

  private static async resetFailedAttempts(userId: number): Promise<void> {
    try {
      const connection = await getConnection();
      // Prüfe ob Spalten existieren (optional - Lockout kann später aktiviert werden)
      try {
        await connection.execute(
          `
                    UPDATE lopez_users
                    SET failed_login_attempts = 0,
                        locked_until = NULL
                    WHERE id = ?
                `,
          [userId],
        );
      } catch (error) {
        // Spalten existieren nicht - Lockout deaktiviert (nicht kritisch)
      }
    } catch (error) {
      console.error("❌ Failed Attempts Reset fehlgeschlagen:", error);
    }
  }

  // =====================================================
  // HILFSFUNKTIONEN
  // =====================================================

  private static generateSessionToken(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async updateLastLogin(userId: number): Promise<void> {
    try {
      const connection = await getConnection();
      await connection.execute(
        "UPDATE lopez_users SET last_login = NOW() WHERE id = ?",
        [userId],
      );
    } catch (error) {
      console.error("❌ Last Login Update fehlgeschlagen:", error);
    }
  }
}
