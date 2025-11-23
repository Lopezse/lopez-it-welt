// =====================================================
// AUTH SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Authentifizierung und Session-Management
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

export interface LoginCredentials {
  username: string;
  password: string;
  twoFactorToken?: string;
}

export interface SessionData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionToken: string;
  expiresAt: Date;
}

export interface AuthResult {
  success: boolean;
  message: string;
  session?: SessionData;
  requires2FA?: boolean;
}

// =====================================================
// AUTH SERVICE CLASS
// =====================================================

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "lopez-it-welt-secret-key";
  private static readonly JWT_EXPIRES_IN = "24h";
  private static readonly SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 Stunden

  // =====================================================
  // LOGIN & AUTHENTIFIZIERUNG
  // =====================================================

  static async login(
    credentials: LoginCredentials,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResult> {
    try {
      // Development Mode: Authentication umgehen
      if (DevelopmentMode.shouldBypassAuth()) {
        console.log("🚀 Development Mode: Login umgangen");
        const mockUser = DevelopmentMode.createMockUser();

        return {
          success: true,
          user: mockUser,
          token: "dev-mode-token",
          message: "Development Mode: Login erfolgreich",
          isDevelopmentMode: true,
        };
      }

      // Benutzer laden (Username oder Email)
      let user = await RBACService.getUserByUsername(credentials.username);
      if (!user) {
        // Fallback: Versuche Email als Username
        user = await RBACService.getUserByEmail(credentials.username);
      }

      if (!user) {
        return {
          success: false,
          message: "Benutzername oder Passwort falsch",
        };
      }

      // Passwort prüfen
      const passwordValid = await bcrypt.compare(credentials.password, user.password_hash);
      if (!passwordValid) {
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

      // 2FA prüfen
      const requires2FA = await TwoFactorService.is2FAEnabled(user.id!);
      if (requires2FA) {
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
          return {
            success: false,
            message: "Zwei-Faktor-Token ungültig",
          };
        }
      }

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
      console.error("❌ Login fehlgeschlagen:", error);
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
  ): Promise<SessionData | null> {
    try {
      const connection = await getConnection();

      // Session-Token generieren
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + this.SESSION_EXPIRES_IN);

      // Session in Datenbank speichern
      await connection.execute(
        `
                INSERT INTO lopez_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `,
        [user.id, sessionToken, ipAddress, userAgent, expiresAt],
      );

      // Benutzer-Rollen laden
      const roles = await RBACService.getUserRoles(user.id!);
      const roleNames = roles.map((role) => role.name);

      // Berechtigungen sammeln
      const permissions: string[] = [];
      for (const role of roles) {
        const rolePermissions = await RBACService.getRolePermissions(role.id!);
        permissions.push(...rolePermissions.map((p) => `${p.resource}:${p.action}`));
      }

      return {
        userId: user.id!,
        username: user.username,
        email: user.email,
        roles: roleNames,
        permissions: [...new Set(permissions)], // Duplikate entfernen
        sessionToken,
        expiresAt,
      };
    } catch (error) {
      console.error("❌ Session-Erstellung fehlgeschlagen:", error);
      return null;
    }
  }

  static async validateSession(sessionToken: string): Promise<SessionData | null> {
    try {
      const connection = await getConnection();

      // Session aus Datenbank laden
      const [rows] = await connection.execute(
        `
                SELECT s.*, u.username, u.email, u.status
                FROM lopez_sessions s
                JOIN lopez_users u ON s.user_id = u.id
                WHERE s.session_token = ? AND s.expires_at > NOW()
            `,
        [sessionToken],
      );

      if ((rows as any[]).length === 0) {
        return null;
      }

      const session = (rows as any)[0];

      // Benutzer-Rollen laden
      const roles = await RBACService.getUserRoles(session.user_id);
      const roleNames = roles.map((role) => role.name);

      // Berechtigungen sammeln
      const permissions: string[] = [];
      for (const role of roles) {
        const rolePermissions = await RBACService.getRolePermissions(role.id!);
        permissions.push(...rolePermissions.map((p) => `${p.resource}:${p.action}`));
      }

      return {
        userId: session.user_id,
        username: session.username,
        email: session.email,
        roles: roleNames,
        permissions: [...new Set(permissions)],
        sessionToken,
        expiresAt: session.expires_at,
      };
    } catch (error) {
      console.error("❌ Session-Validierung fehlgeschlagen:", error);
      return null;
    }
  }

  static async logout(sessionToken: string): Promise<boolean> {
    try {
      const connection = await getConnection();

      // Session aus Datenbank entfernen
      await connection.execute("DELETE FROM lopez_sessions WHERE session_token = ?", [
        sessionToken,
      ]);

      console.log("✅ Session erfolgreich beendet");
      return true;
    } catch (error) {
      console.error("❌ Logout fehlgeschlagen:", error);
      return false;
    }
  }

  static async logoutAllSessions(userId: number): Promise<boolean> {
    try {
      const connection = await getConnection();

      // Alle Sessions des Benutzers entfernen
      await connection.execute("DELETE FROM lopez_sessions WHERE user_id = ?", [userId]);

      console.log(`✅ Alle Sessions für Benutzer ${userId} beendet`);
      return true;
    } catch (error) {
      console.error("❌ Logout aller Sessions fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // JWT-TOKEN
  // =====================================================

  static generateJWT(sessionData: SessionData): string {
    return jwt.sign(
      {
        userId: sessionData.userId,
        username: sessionData.username,
        email: sessionData.email,
        roles: sessionData.roles,
        permissions: sessionData.permissions,
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
  // PASSWORT-MANAGEMENT
  // =====================================================

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await RBACService.getUserById(userId);
      if (!user) {
        return false;
      }

      // Altes Passwort prüfen
      const oldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!oldPasswordValid) {
        return false;
      }

      // Neues Passwort hashen
      const newPasswordHash = await this.hashPassword(newPassword);

      // Passwort in Datenbank aktualisieren
      const connection = await getConnection();
      await connection.execute(
        "UPDATE lopez_users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
        [newPasswordHash, userId],
      );

      // Alle Sessions beenden (Sicherheit)
      await this.logoutAllSessions(userId);

      console.log(`✅ Passwort für Benutzer ${userId} geändert`);
      return true;
    } catch (error) {
      console.error("❌ Passwort-Änderung fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // HILFSFUNKTIONEN
  // =====================================================

  private static generateSessionToken(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static async updateLastLogin(userId: number): Promise<void> {
    try {
      const connection = await getConnection();
      await connection.execute("UPDATE lopez_users SET last_login = NOW() WHERE id = ?", [userId]);
    } catch (error) {
      console.error("❌ Last Login Update fehlgeschlagen:", error);
    }
  }

  // =====================================================
  // BERECHTIGUNGEN
  // =====================================================

  static async checkPermission(userId: number, resource: string, action: string): Promise<boolean> {
    try {
      const session = await this.validateSession(userId.toString());
      if (!session) {
        return false;
      }

      const permission = `${resource}:${action}`;
      return session.permissions.includes(permission);
    } catch (error) {
      console.error("❌ Berechtigungsprüfung fehlgeschlagen:", error);
      return false;
    }
  }
}
