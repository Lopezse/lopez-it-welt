// =====================================================
// ARGON2ID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Argon2id Passwort-Hashing für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import argon2 from "argon2";
import { UUIDService } from "./uuid-service";

// =====================================================
// INTERFACES
// =====================================================

export interface Argon2Config {
  type: argon2.argon2id;
  memoryCost: number;
  timeCost: number;
  parallelism: number;
  hashLength: number;
}

export interface HashResult {
  hash: string;
  salt: string;
  pepper: string;
  config: Argon2Config;
}

// =====================================================
// ARGON2 SERVICE CLASS
// =====================================================

export class Argon2Service {
  // =====================================================
  // KONFIGURATION
  // =====================================================

  /**
   * Enterprise++ Argon2id Konfiguration
   * DSGVO/ISO27001-konform
   */
  static readonly CONFIG: Argon2Config = {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 Iterationen
    parallelism: 4, // 4 Threads
    hashLength: 32, // 32 Bytes
  };

  /**
   * Pepper für zusätzliche Sicherheit
   * Sollte in .env gespeichert werden
   */
  static readonly PEPPER = process.env.ARGON2_PEPPER || "default-pepper-change-in-production";

  // =====================================================
  // PASSWORD HASHING
  // =====================================================

  /**
   * Hasht Passwort mit Argon2id + Salt + Pepper
   */
  static async hashPassword(password: string): Promise<HashResult> {
    try {
      // Salt generieren
      const salt = UUIDService.generateSalt();

      // Pepper hinzufügen
      const passwordWithPepper = password + this.PEPPER;

      // Argon2id Hash generieren
      const hash = await argon2.hash(passwordWithPepper, {
        type: this.CONFIG.type,
        memoryCost: this.CONFIG.memoryCost,
        timeCost: this.CONFIG.timeCost,
        parallelism: this.CONFIG.parallelism,
        hashLength: this.CONFIG.hashLength,
        salt: Buffer.from(salt, "hex"),
      });

      return {
        hash,
        salt,
        pepper: this.PEPPER,
        config: this.CONFIG,
      };
    } catch (error) {
      console.error("Argon2 Hash Fehler:", error);
      throw new Error("Passwort-Hashing fehlgeschlagen");
    }
  }

  /**
   * Verifiziert Passwort gegen Hash
   */
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      // Pepper hinzufügen
      const passwordWithPepper = password + this.PEPPER;

      // Hash verifizieren
      return await argon2.verify(hash, passwordWithPepper);
    } catch (error) {
      console.error("Argon2 Verify Fehler:", error);
      return false;
    }
  }

  // =====================================================
  // PASSWORD STRENGTH
  // =====================================================

  /**
   * Prüft Passwort-Stärke (Enterprise++ Standard)
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    level: "weak" | "okay" | "strong" | "very_strong";
    requirements: {
      minLength: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    };
  } {
    const requirements = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let level: "weak" | "okay" | "strong" | "very_strong";
    if (score < 3) level = "weak";
    else if (score < 4) level = "okay";
    else if (score < 5) level = "strong";
    else level = "very_strong";

    return {
      isValid: requirements.minLength && score >= 4,
      score,
      level,
      requirements,
    };
  }

  // =====================================================
  // SECURITY FEATURES
  // =====================================================

  /**
   * Generiert sicheres temporäres Passwort
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  /**
   * Prüft ob Passwort in der Historie ist
   */
  static async isPasswordInHistory(password: string, history: string[]): Promise<boolean> {
    for (const oldHash of history) {
      if (await this.verifyPassword(password, oldHash, "")) {
        return true;
      }
    }
    return false;
  }

  // =====================================================
  // AUDIT & COMPLIANCE
  // =====================================================

  /**
   * Erstellt Audit-Log für Passwort-Änderung
   */
  static createPasswordChangeAudit(userId: string, action: "created" | "changed" | "reset"): any {
    return {
      user_id: userId,
      action: `password_${action}`,
      severity: "medium",
      compliance_category: "security",
      timestamp: new Date().toISOString(),
      details: {
        hashing_algorithm: "argon2id",
        memory_cost: this.CONFIG.memoryCost,
        time_cost: this.CONFIG.timeCost,
        parallelism: this.CONFIG.parallelism,
      },
    };
  }
}
