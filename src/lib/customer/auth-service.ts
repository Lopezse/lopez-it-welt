// =====================================================
// KUNDEN AUTH SERVICE
// =====================================================
// Enterprise++ Authentifizierung
// Argon2id, Token-Generierung, Session-Management
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import * as argon2 from "argon2";
import crypto from "crypto";

// =====================================================
// TYPEN
// =====================================================

export interface RegisterInput {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  dsgvo_consent: boolean;
  marketing_consent?: boolean;
}

export interface RegisterResult {
  success: boolean;
  customer_id?: number;
  verification_token?: string;
  error?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  customer_id?: number;
  session_token?: string;
  requires_2fa?: boolean;
  error?: string;
}

// =====================================================
// ARGON2 KONFIGURATION (Enterprise++ Security)
// =====================================================

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,    // 64 MB
  timeCost: 3,          // 3 Iterationen
  parallelism: 4,       // 4 parallele Threads
  hashLength: 32        // 256-bit Hash
};

// =====================================================
// AUTH SERVICE
// =====================================================

export class CustomerAuthService {

  // -------------------------------------------------
  // PASSWORT HASHING
  // -------------------------------------------------

  /**
   * Hasht ein Passwort mit Argon2id
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, ARGON2_OPTIONS);
  }

  /**
   * Verifiziert ein Passwort gegen einen Hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  // -------------------------------------------------
  // TOKEN GENERIERUNG
  // -------------------------------------------------

  /**
   * Generiert einen sicheren Zufalls-Token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Generiert einen Session-Token
   */
  static generateSessionToken(): string {
    return this.generateToken(64);
  }

  /**
   * Generiert einen E-Mail-Verifizierungs-Token
   */
  static generateVerificationToken(): string {
    return this.generateToken(32);
  }

  // -------------------------------------------------
  // REGISTRIERUNG
  // -------------------------------------------------

  /**
   * Registriert einen neuen Kunden
   */
  static async register(input: RegisterInput): Promise<RegisterResult> {
    const pool = await getConnection();

    // Validierung
    if (!input.email || !input.password) {
      return { success: false, error: "E-Mail und Passwort sind erforderlich" };
    }

    if (!input.dsgvo_consent) {
      return { success: false, error: "DSGVO-Einwilligung ist erforderlich" };
    }

    // E-Mail-Format prüfen
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return { success: false, error: "Ungültige E-Mail-Adresse" };
    }

    // Passwort-Stärke prüfen (min. 8 Zeichen, 1 Zahl, 1 Großbuchstabe)
    if (input.password.length < 8) {
      return { success: false, error: "Passwort muss mindestens 8 Zeichen haben" };
    }

    try {
      // Prüfen ob E-Mail bereits existiert
      const [existing] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM lopez_customers WHERE email = ?",
        [input.email.toLowerCase()]
      );

      if (existing.length > 0) {
        return { success: false, error: "E-Mail-Adresse bereits registriert" };
      }

      // Passwort hashen
      const passwordHash = await this.hashPassword(input.password);

      // Eindeutige Kundennummer generieren
      const kundennummer = `K${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Kunde erstellen
      const [result] = await pool.execute<ResultSetHeader>(`
        INSERT INTO lopez_customers 
          (email, password_hash, first_name, last_name, company_name, 
           dsgvo_consent, dsgvo_consent_at, marketing_consent, status, kundennummer)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, 'pending', ?)
      `, [
        input.email.toLowerCase(),
        passwordHash,
        input.first_name || null,
        input.last_name || null,
        input.company_name || null,
        true,
        input.marketing_consent || false,
        kundennummer
      ]);

      const customerId = result.insertId;

      // Verifizierungs-Token erstellen
      const verificationToken = this.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Stunden

      await pool.execute(`
        INSERT INTO lopez_customer_email_tokens 
          (customer_id, token, type, expires_at)
        VALUES (?, ?, 'verify_email', ?)
      `, [customerId, verificationToken, expiresAt]);

      return {
        success: true,
        customer_id: customerId,
        verification_token: verificationToken
      };

    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: "Registrierung fehlgeschlagen" };
    }
  }

  // -------------------------------------------------
  // E-MAIL VERIFIZIERUNG
  // -------------------------------------------------

  /**
   * Verifiziert eine E-Mail-Adresse
   */
  static async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      // Token suchen
      const [tokens] = await pool.execute<RowDataPacket[]>(`
        SELECT t.*, c.email 
        FROM lopez_customer_email_tokens t
        JOIN lopez_customers c ON t.customer_id = c.id
        WHERE t.token = ? AND t.type = 'verify_email' AND t.used_at IS NULL
      `, [token]);

      if (tokens.length === 0) {
        return { success: false, error: "Ungültiger oder abgelaufener Token" };
      }

      const tokenData = tokens[0];

      // Ablauf prüfen
      if (new Date(tokenData.expires_at) < new Date()) {
        return { success: false, error: "Token ist abgelaufen" };
      }

      // Kunde aktivieren
      await pool.execute(`
        UPDATE lopez_customers 
        SET email_verified = TRUE, email_verified_at = NOW(), status = 'active'
        WHERE id = ?
      `, [tokenData.customer_id]);

      // Token als verwendet markieren
      await pool.execute(`
        UPDATE lopez_customer_email_tokens SET used_at = NOW() WHERE id = ?
      `, [tokenData.id]);

      return { success: true };

    } catch (error) {
      console.error("Email Verification Error:", error);
      return { success: false, error: "Verifizierung fehlgeschlagen" };
    }
  }

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------

  /**
   * Login eines Kunden
   */
  static async login(input: LoginInput, ip?: string, userAgent?: string): Promise<LoginResult> {
    const pool = await getConnection();

    try {
      // Kunde suchen
      const [customers] = await pool.execute<RowDataPacket[]>(`
        SELECT id, email, password_hash, status, email_verified, two_factor_enabled
        FROM lopez_customers WHERE email = ?
      `, [input.email.toLowerCase()]);

      if (customers.length === 0) {
        return { success: false, error: "Ungültige Anmeldedaten" };
      }

      const customer = customers[0];

      // Status prüfen
      if (customer.status === "suspended") {
        return { success: false, error: "Konto ist gesperrt" };
      }

      if (customer.status === "pending" || !customer.email_verified) {
        return { success: false, error: "E-Mail-Adresse nicht verifiziert" };
      }

      // Passwort prüfen
      const passwordValid = await this.verifyPassword(input.password, customer.password_hash);
      if (!passwordValid) {
        return { success: false, error: "Ungültige Anmeldedaten" };
      }

      // 2FA prüfen
      if (customer.two_factor_enabled) {
        return {
          success: true,
          customer_id: customer.id,
          requires_2fa: true
        };
      }

      // Session erstellen
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Tage

      await pool.execute(`
        INSERT INTO lopez_customer_sessions 
          (customer_id, token, user_agent, ip_address, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `, [customer.id, sessionToken, userAgent || null, ip || null, expiresAt]);

      // Last Login aktualisieren
      await pool.execute(`
        UPDATE lopez_customers SET last_login_at = NOW() WHERE id = ?
      `, [customer.id]);

      return {
        success: true,
        customer_id: customer.id,
        session_token: sessionToken
      };

    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: "Anmeldung fehlgeschlagen" };
    }
  }

  // -------------------------------------------------
  // SESSION MANAGEMENT
  // -------------------------------------------------

  /**
   * Validiert eine Session
   */
  static async validateSession(token: string): Promise<{ valid: boolean; customer_id?: number }> {
    const pool = await getConnection();

    try {
      const [sessions] = await pool.execute<RowDataPacket[]>(`
        SELECT s.customer_id, c.status
        FROM lopez_customer_sessions s
        JOIN lopez_customers c ON s.customer_id = c.id
        WHERE s.token = ? AND s.expires_at > NOW()
      `, [token]);

      if (sessions.length === 0) {
        return { valid: false };
      }

      if (sessions[0].status !== "active") {
        return { valid: false };
      }

      return { valid: true, customer_id: sessions[0].customer_id };

    } catch {
      return { valid: false };
    }
  }

  /**
   * Beendet eine Session (Logout)
   */
  static async logout(token: string): Promise<boolean> {
    const pool = await getConnection();

    try {
      await pool.execute(
        "DELETE FROM lopez_customer_sessions WHERE token = ?",
        [token]
      );
      return true;
    } catch {
      return false;
    }
  }
}

export default CustomerAuthService;

