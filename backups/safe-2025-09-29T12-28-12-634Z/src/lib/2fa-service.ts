// =====================================================
// 2FA SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Zwei-Faktor-Authentifizierung für Admin-Zugang
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import QRCode from "qrcode";
import speakeasy from "speakeasy";
import { getConnection } from "./database";

// =====================================================
// INTERFACES
// =====================================================

export interface TwoFactorSecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  userId: number;
  token: string;
  verified: boolean;
  expiresAt: Date;
}

// =====================================================
// 2FA SERVICE CLASS
// =====================================================

export class TwoFactorService {
  // =====================================================
  // 2FA-SETUP
  // =====================================================

  static async setup2FA(userId: number): Promise<TwoFactorSecret> {
    try {
      // Speakeasy Secret generieren
      const secret = speakeasy.generateSecret({
        name: `Lopez IT Welt (${userId})`,
        issuer: "Lopez IT Welt",
        length: 32,
      });

      // QR-Code generieren
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      // Backup-Codes generieren
      const backupCodes = this.generateBackupCodes();

      // Secret in Datenbank speichern
      await this.saveUserSecret(userId, secret.base32!, backupCodes);

      return {
        secret: secret.base32!,
        qrCodeUrl,
        backupCodes,
      };
    } catch (error) {
      console.error("❌ 2FA-Setup fehlgeschlagen:", error);
      throw error;
    }
  }

  // =====================================================
  // 2FA-VERIFIKATION
  // =====================================================

  static async verifyToken(userId: number, token: string): Promise<boolean> {
    try {
      // User Secret aus Datenbank laden
      const userSecret = await this.getUserSecret(userId);
      if (!userSecret) {
        return false;
      }

      // Token verifizieren
      const verified = speakeasy.totp.verify({
        secret: userSecret.secret,
        token: token,
        window: 2, // 2 Zeitfenster Toleranz
      });

      if (verified) {
        // Verifikation in Datenbank speichern
        await this.saveVerification(userId, token, true);
        return true;
      }

      // Backup-Code prüfen
      const backupVerified = await this.verifyBackupCode(userId, token);
      if (backupVerified) {
        await this.saveVerification(userId, token, true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ 2FA-Verifikation fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // BACKUP-CODES
  // =====================================================

  static async generateNewBackupCodes(userId: number): Promise<string[]> {
    try {
      const backupCodes = this.generateBackupCodes();
      await this.updateUserBackupCodes(userId, backupCodes);
      return backupCodes;
    } catch (error) {
      console.error("❌ Backup-Codes-Generierung fehlgeschlagen:", error);
      throw error;
    }
  }

  static async verifyBackupCode(userId: number, code: string): Promise<boolean> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT backup_codes FROM lopez_user_2fa WHERE user_id = ?",
        [userId],
      );

      if ((rows as any[]).length === 0) {
        return false;
      }

      const backupCodes = JSON.parse((rows as any)[0].backup_codes);
      const index = backupCodes.indexOf(code);

      if (index !== -1) {
        // Backup-Code entfernen (einmalig verwendbar)
        backupCodes.splice(index, 1);
        await this.updateUserBackupCodes(userId, backupCodes);
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Backup-Code-Verifikation fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // 2FA-STATUS
  // =====================================================

  static async is2FAEnabled(userId: number): Promise<boolean> {
    try {
      const userSecret = await this.getUserSecret(userId);
      return userSecret !== null;
    } catch (error) {
      console.error("❌ 2FA-Status-Prüfung fehlgeschlagen:", error);
      return false;
    }
  }

  static async disable2FA(userId: number): Promise<boolean> {
    try {
      const connection = await getConnection();
      await connection.execute("DELETE FROM lopez_user_2fa WHERE user_id = ?", [userId]);

      console.log(`✅ 2FA für Benutzer ${userId} deaktiviert`);
      return true;
    } catch (error) {
      console.error("❌ 2FA-Deaktivierung fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // HILFSFUNKTIONEN
  // =====================================================

  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateRandomCode(8));
    }
    return codes;
  }

  private static generateRandomCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static async saveUserSecret(
    userId: number,
    secret: string,
    backupCodes: string[],
  ): Promise<void> {
    try {
      const connection = await getConnection();
      await connection.execute(
        `
                INSERT INTO lopez_user_2fa (user_id, secret, backup_codes, created_at)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE
                secret = VALUES(secret),
                backup_codes = VALUES(backup_codes),
                updated_at = NOW()
            `,
        [userId, secret, JSON.stringify(backupCodes)],
      );
    } catch (error) {
      console.error("❌ User Secret speichern fehlgeschlagen:", error);
      throw error;
    }
  }

  private static async getUserSecret(
    userId: number,
  ): Promise<{ secret: string; backupCodes: string[] } | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT secret, backup_codes FROM lopez_user_2fa WHERE user_id = ?",
        [userId],
      );

      if ((rows as any[]).length === 0) {
        return null;
      }

      const row = (rows as any)[0];
      return {
        secret: row.secret,
        backupCodes: JSON.parse(row.backup_codes),
      };
    } catch (error) {
      console.error("❌ User Secret laden fehlgeschlagen:", error);
      return null;
    }
  }

  private static async updateUserBackupCodes(userId: number, backupCodes: string[]): Promise<void> {
    try {
      const connection = await getConnection();
      await connection.execute(
        "UPDATE lopez_user_2fa SET backup_codes = ?, updated_at = NOW() WHERE user_id = ?",
        [JSON.stringify(backupCodes), userId],
      );
    } catch (error) {
      console.error("❌ Backup-Codes aktualisieren fehlgeschlagen:", error);
      throw error;
    }
  }

  private static async saveVerification(
    userId: number,
    token: string,
    verified: boolean,
  ): Promise<void> {
    try {
      const connection = await getConnection();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Minuten

      await connection.execute(
        `
                INSERT INTO lopez_user_2fa_verifications (user_id, token, verified, expires_at, created_at)
                VALUES (?, ?, ?, ?, NOW())
            `,
        [userId, token, verified, expiresAt],
      );
    } catch (error) {
      console.error("❌ 2FA-Verifikation speichern fehlgeschlagen:", error);
    }
  }
}
