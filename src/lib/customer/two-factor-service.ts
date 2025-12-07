// =====================================================
// TWO-FACTOR AUTHENTICATION SERVICE
// =====================================================
// TOTP (Time-based One-Time Password)
// RFC 6238 kompatibel
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import crypto from "crypto";

// =====================================================
// KONFIGURATION
// =====================================================

const TOTP_CONFIG = {
  issuer: "Lopez IT Welt",
  algorithm: "SHA1",
  digits: 6,
  period: 30, // Sekunden
  window: 1   // Erlaubt ±1 Periode für Clock-Drift
};

// =====================================================
// TYPEN
// =====================================================

export interface TwoFactorSetupResult {
  success: boolean;
  secret?: string;
  qr_code_url?: string;
  backup_codes?: string[];
  error?: string;
}

export interface TwoFactorVerifyResult {
  success: boolean;
  session_token?: string;
  error?: string;
}

// =====================================================
// HELPER FUNKTIONEN
// =====================================================

/**
 * Generiert ein sicheres Base32 Secret
 */
function generateSecret(length: number = 20): string {
  const buffer = crypto.randomBytes(length);
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  
  for (let i = 0; i < buffer.length; i++) {
    secret += base32Chars[buffer[i] % 32];
  }
  
  return secret;
}

/**
 * Base32 Decode
 */
function base32Decode(encoded: string): Buffer {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits: number[] = [];
  
  for (const char of encoded.toUpperCase()) {
    const val = base32Chars.indexOf(char);
    if (val === -1) continue;
    bits.push(...[0, 1, 2, 3, 4].map(i => (val >> (4 - i)) & 1));
  }
  
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  }
  
  return Buffer.from(bytes);
}

/**
 * Generiert TOTP Code für einen Zeitpunkt
 */
function generateTOTP(secret: string, time: number = Date.now()): string {
  const counter = Math.floor(time / 1000 / TOTP_CONFIG.period);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  
  const key = base32Decode(secret);
  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuffer);
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0x0f;
  const binary = 
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  
  const otp = binary % Math.pow(10, TOTP_CONFIG.digits);
  return otp.toString().padStart(TOTP_CONFIG.digits, "0");
}

/**
 * Verifiziert TOTP Code mit Window für Clock-Drift
 */
function verifyTOTP(secret: string, code: string): boolean {
  const now = Date.now();
  
  for (let i = -TOTP_CONFIG.window; i <= TOTP_CONFIG.window; i++) {
    const time = now + i * TOTP_CONFIG.period * 1000;
    if (generateTOTP(secret, time) === code) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generiert Backup-Codes
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  
  return codes;
}

/**
 * Generiert otpauth:// URL für QR-Code
 */
function generateOtpauthURL(email: string, secret: string): string {
  const params = new URLSearchParams({
    secret,
    issuer: TOTP_CONFIG.issuer,
    algorithm: TOTP_CONFIG.algorithm,
    digits: TOTP_CONFIG.digits.toString(),
    period: TOTP_CONFIG.period.toString()
  });
  
  return `otpauth://totp/${encodeURIComponent(TOTP_CONFIG.issuer)}:${encodeURIComponent(email)}?${params}`;
}

// =====================================================
// TWO FACTOR SERVICE
// =====================================================

export class TwoFactorService {

  /**
   * Initialisiert 2FA Setup für einen Kunden
   */
  static async setupTwoFactor(customerId: number): Promise<TwoFactorSetupResult> {
    const pool = await getConnection();

    try {
      // Kunde laden
      const [customers] = await pool.execute<RowDataPacket[]>(
        "SELECT email, two_factor_enabled FROM lopez_customers WHERE id = ?",
        [customerId]
      );

      if (customers.length === 0) {
        return { success: false, error: "Kunde nicht gefunden" };
      }

      const customer = customers[0];

      if (customer.two_factor_enabled) {
        return { success: false, error: "2FA ist bereits aktiviert" };
      }

      // Secret generieren
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();
      const qrCodeUrl = generateOtpauthURL(customer.email, secret);

      // Secret temporär speichern (noch nicht aktiviert)
      await pool.execute(`
        UPDATE lopez_customers 
        SET two_factor_secret = ?,
            two_factor_backup_codes = ?
        WHERE id = ?
      `, [secret, JSON.stringify(backupCodes), customerId]);

      return {
        success: true,
        secret,
        qr_code_url: qrCodeUrl,
        backup_codes: backupCodes
      };

    } catch (error) {
      console.error("2FA Setup Error:", error);
      return { success: false, error: "2FA-Setup fehlgeschlagen" };
    }
  }

  /**
   * Aktiviert 2FA nach Verifizierung des ersten Codes
   */
  static async enableTwoFactor(customerId: number, code: string): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      // Secret laden
      const [customers] = await pool.execute<RowDataPacket[]>(
        "SELECT two_factor_secret, two_factor_enabled FROM lopez_customers WHERE id = ?",
        [customerId]
      );

      if (customers.length === 0) {
        return { success: false, error: "Kunde nicht gefunden" };
      }

      const customer = customers[0];

      if (customer.two_factor_enabled) {
        return { success: false, error: "2FA ist bereits aktiviert" };
      }

      if (!customer.two_factor_secret) {
        return { success: false, error: "Bitte starten Sie das 2FA-Setup erneut" };
      }

      // Code verifizieren
      if (!verifyTOTP(customer.two_factor_secret, code)) {
        return { success: false, error: "Ungültiger Code" };
      }

      // 2FA aktivieren
      await pool.execute(`
        UPDATE lopez_customers 
        SET two_factor_enabled = TRUE
        WHERE id = ?
      `, [customerId]);

      return { success: true };

    } catch (error) {
      console.error("2FA Enable Error:", error);
      return { success: false, error: "2FA-Aktivierung fehlgeschlagen" };
    }
  }

  /**
   * Verifiziert 2FA Code beim Login
   */
  static async verifyTwoFactor(
    customerId: number, 
    code: string,
    ip?: string,
    userAgent?: string
  ): Promise<TwoFactorVerifyResult> {
    const pool = await getConnection();

    try {
      // Kunde laden
      const [customers] = await pool.execute<RowDataPacket[]>(`
        SELECT two_factor_secret, two_factor_enabled, two_factor_backup_codes
        FROM lopez_customers WHERE id = ?
      `, [customerId]);

      if (customers.length === 0) {
        return { success: false, error: "Kunde nicht gefunden" };
      }

      const customer = customers[0];

      if (!customer.two_factor_enabled) {
        return { success: false, error: "2FA ist nicht aktiviert" };
      }

      // TOTP Code prüfen
      let validCode = verifyTOTP(customer.two_factor_secret, code);

      // Backup-Code prüfen falls TOTP fehlschlägt
      if (!validCode && customer.two_factor_backup_codes) {
        const backupCodes: string[] = JSON.parse(customer.two_factor_backup_codes);
        const codeIndex = backupCodes.indexOf(code.toUpperCase());
        
        if (codeIndex !== -1) {
          validCode = true;
          // Backup-Code entfernen (einmalig)
          backupCodes.splice(codeIndex, 1);
          await pool.execute(`
            UPDATE lopez_customers SET two_factor_backup_codes = ? WHERE id = ?
          `, [JSON.stringify(backupCodes), customerId]);
        }
      }

      if (!validCode) {
        return { success: false, error: "Ungültiger Code" };
      }

      // Session erstellen
      const { CustomerAuthService } = await import("./auth-service");
      const sessionToken = CustomerAuthService.generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await pool.execute(`
        INSERT INTO lopez_customer_sessions 
          (customer_id, token, user_agent, ip_address, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `, [customerId, sessionToken, userAgent || null, ip || null, expiresAt]);

      // Last Login aktualisieren
      await pool.execute(`
        UPDATE lopez_customers SET last_login_at = NOW() WHERE id = ?
      `, [customerId]);

      return {
        success: true,
        session_token: sessionToken
      };

    } catch (error) {
      console.error("2FA Verify Error:", error);
      return { success: false, error: "2FA-Verifizierung fehlgeschlagen" };
    }
  }

  /**
   * Deaktiviert 2FA
   */
  static async disableTwoFactor(customerId: number, password: string): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      // Passwort verifizieren
      const [customers] = await pool.execute<RowDataPacket[]>(
        "SELECT password_hash FROM lopez_customers WHERE id = ?",
        [customerId]
      );

      if (customers.length === 0) {
        return { success: false, error: "Kunde nicht gefunden" };
      }

      const { CustomerAuthService } = await import("./auth-service");
      const passwordValid = await CustomerAuthService.verifyPassword(
        password, 
        customers[0].password_hash
      );

      if (!passwordValid) {
        return { success: false, error: "Ungültiges Passwort" };
      }

      // 2FA deaktivieren
      await pool.execute(`
        UPDATE lopez_customers 
        SET two_factor_enabled = FALSE,
            two_factor_secret = NULL,
            two_factor_backup_codes = NULL
        WHERE id = ?
      `, [customerId]);

      return { success: true };

    } catch (error) {
      console.error("2FA Disable Error:", error);
      return { success: false, error: "2FA-Deaktivierung fehlgeschlagen" };
    }
  }
}

export default TwoFactorService;







