// =====================================================
// SHOP AUTH SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Shop-Kunden-Authentifizierung (nur Email, 2FA optional)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TwoFactorService } from "./2fa-service";
import { getConnection } from "./database";

// =====================================================
// INTERFACES
// =====================================================

export interface ShopLoginCredentials {
  email: string; // Nur Email (kein Username)
  password: string;
  twoFactorToken?: string;
}

export interface ShopSessionData {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  sessionToken: string;
  expiresAt: Date;
  realm: "SHOP";
  twoFactorEnabled: boolean;
}

export interface ShopAuthResult {
  success: boolean;
  message: string;
  session?: ShopSessionData;
  requires2FA?: boolean;
}

// =====================================================
// SHOP AUTH SERVICE CLASS
// =====================================================

export class ShopAuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "lopez-it-welt-secret-key";
  private static readonly JWT_EXPIRES_IN = "24h";
  private static readonly SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 Stunden

  // =====================================================
  // LOGIN & AUTHENTIFIZIERUNG
  // =====================================================

  static async login(
    credentials: ShopLoginCredentials,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ShopAuthResult> {
    try {
      // Validierung: Email muss @ enthalten
      if (!credentials.email.includes("@")) {
        return {
          success: false,
          message: "Ungültige E-Mail-Adresse",
        };
      }

      // Shop-Kunde laden (aus lopez_customers Tabelle)
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT id, email, password_hash, vorname, nachname, status
                FROM lopez_customers
                WHERE email = ?
            `,
        [credentials.email],
      );

      if ((rows as any[]).length === 0) {
        return {
          success: false,
          message: "E-Mail oder Passwort falsch",
        };
      }

      const customer = (rows as any)[0];

      // Passwort prüfen
      if (!customer.password_hash) {
        // Passwort noch nicht gesetzt
        return {
          success: false,
          message: "Bitte setzen Sie zuerst ein Passwort",
        };
      }

      const passwordValid = await bcrypt.compare(credentials.password, customer.password_hash);
      if (!passwordValid) {
        return {
          success: false,
          message: "E-Mail oder Passwort falsch",
        };
      }

      // Status prüfen
      if (customer.status !== "aktiv") {
        return {
          success: false,
          message: "Konto ist nicht aktiv",
        };
      }

      // 2FA prüfen (optional für Shop)
      const twoFactorEnabled = await TwoFactorService.is2FAEnabled(customer.id);
      if (twoFactorEnabled) {
        if (!credentials.twoFactorToken) {
          return {
            success: false,
            message: "Zwei-Faktor-Authentifizierung erforderlich",
            requires2FA: true,
          };
        }

        const twoFactorValid = await TwoFactorService.verifyToken(
          customer.id,
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
      const session = await this.createSession(customer, ipAddress, userAgent, twoFactorEnabled);
      if (!session) {
        return {
          success: false,
          message: "Session konnte nicht erstellt werden",
        };
      }

      return {
        success: true,
        message: "Login erfolgreich",
        session,
      };
    } catch (error) {
      console.error("❌ Shop Login fehlgeschlagen:", error);
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
    customer: any,
    ipAddress?: string,
    userAgent?: string,
    twoFactorEnabled: boolean = false,
  ): Promise<ShopSessionData | null> {
    try {
      const connection = await getConnection();

      // Session-Token generieren
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + this.SESSION_EXPIRES_IN);

      // Session in Datenbank speichern (mit shp_ Präfix)
      // Shop-Sessions in separater Tabelle oder mit Präfix markieren
      await connection.execute(
        `
                INSERT INTO lopez_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `,
        [customer.id, `shp_${sessionToken}`, ipAddress, userAgent, expiresAt],
      );

      return {
        userId: customer.id,
        email: customer.email,
        firstName: customer.vorname || undefined,
        lastName: customer.nachname || undefined,
        sessionToken: `shp_${sessionToken}`,
        expiresAt,
        realm: "SHOP",
        twoFactorEnabled,
      };
    } catch (error) {
      console.error("❌ Shop Session-Erstellung fehlgeschlagen:", error);
      return null;
    }
  }

  static async validateSession(sessionToken: string): Promise<ShopSessionData | null> {
    try {
      if (!sessionToken.startsWith("shp_")) {
        return null;
      }

      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT s.*, c.email, c.vorname, c.nachname, c.status
                FROM lopez_sessions s
                JOIN lopez_customers c ON s.user_id = c.id
                WHERE s.session_token = ? AND s.expires_at > NOW() AND c.status = 'aktiv'
            `,
        [sessionToken],
      );

      if ((rows as any[]).length === 0) {
        return null;
      }

      const session = (rows as any)[0];
      const twoFactorEnabled = await TwoFactorService.is2FAEnabled(session.user_id);

      return {
        userId: session.user_id,
        email: session.email,
        firstName: session.vorname || undefined,
        lastName: session.nachname || undefined,
        sessionToken: session.session_token,
        expiresAt: session.expires_at,
        realm: "SHOP",
        twoFactorEnabled,
      };
    } catch (error) {
      console.error("❌ Shop Session-Validierung fehlgeschlagen:", error);
      return null;
    }
  }

  static async logout(sessionToken: string): Promise<boolean> {
    try {
      if (!sessionToken.startsWith("shp_")) {
        return false;
      }

      const connection = await getConnection();
      await connection.execute("DELETE FROM lopez_sessions WHERE session_token = ?", [sessionToken]);
      return true;
    } catch (error) {
      console.error("❌ Shop Logout fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // JWT-TOKEN
  // =====================================================

  static generateJWT(session: ShopSessionData): string {
    return jwt.sign(
      {
        userId: session.userId,
        email: session.email,
        realm: "SHOP",
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
  // HILFSFUNKTIONEN
  // =====================================================

  private static generateSessionToken(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}







