// =====================================================
// PASSWORD MIGRATION SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Sichere Migration von bcrypt zu Argon2
// Status: ⏸️ VORBEREITET - NICHT AKTIVIERT
// =====================================================
// 
// AKTIVIERUNG NUR NACH EXPLIZITER FREIGABE!
// Setze ENABLE_PASSWORD_MIGRATION=true in .env
//
// =====================================================

import bcrypt from "bcryptjs";
import { Argon2Service } from "./argon2-service";
import { getConnection } from "./database";

// =====================================================
// KONFIGURATION
// =====================================================

/**
 * Migration ist standardmäßig DEAKTIVIERT
 * Nur aktivieren wenn ENABLE_PASSWORD_MIGRATION=true in .env
 */
const MIGRATION_ENABLED = process.env.ENABLE_PASSWORD_MIGRATION === "true";

/**
 * Debug-Modus für Logging (ohne tatsächliche Migration)
 */
const DEBUG_MODE = process.env.PASSWORD_MIGRATION_DEBUG === "true";

// =====================================================
// INTERFACES
// =====================================================

export interface MigrationResult {
  success: boolean;
  migrated: boolean;
  hashType: "bcrypt" | "argon2" | "unknown";
  message: string;
  debugInfo?: {
    userId: number;
    oldHashPrefix: string;
    newHashPrefix?: string;
    timestamp: string;
  };
}

export interface MigrationStatus {
  enabled: boolean;
  debugMode: boolean;
  envVar: string;
  recommendation: string;
}

// =====================================================
// PASSWORD MIGRATION SERVICE
// =====================================================

export class PasswordMigrationService {
  
  // =====================================================
  // STATUS & KONFIGURATION
  // =====================================================

  /**
   * Gibt den aktuellen Migrationsstatus zurück
   */
  static getStatus(): MigrationStatus {
    return {
      enabled: MIGRATION_ENABLED,
      debugMode: DEBUG_MODE,
      envVar: "ENABLE_PASSWORD_MIGRATION",
      recommendation: MIGRATION_ENABLED 
        ? "⚠️ Migration ist AKTIV - Passwörter werden bei Login migriert"
        : "✅ Migration ist DEAKTIVIERT - Keine Änderungen an Passwörtern",
    };
  }

  /**
   * Prüft ob Migration aktiviert ist
   */
  static isEnabled(): boolean {
    return MIGRATION_ENABLED;
  }

  /**
   * Prüft ob Debug-Modus aktiv ist
   */
  static isDebugMode(): boolean {
    return DEBUG_MODE;
  }

  // =====================================================
  // HASH-ERKENNUNG
  // =====================================================

  /**
   * Erkennt den Hash-Typ anhand des Formats
   * - bcrypt: Beginnt mit $2a$, $2b$ oder $2y$
   * - argon2: Beginnt mit $argon2
   */
  static detectHashType(hash: string): "bcrypt" | "argon2" | "unknown" {
    if (!hash) return "unknown";
    
    // bcrypt-Hashes beginnen mit $2a$, $2b$ oder $2y$
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      return "bcrypt";
    }
    
    // Argon2-Hashes beginnen mit $argon2
    if (hash.startsWith("$argon2")) {
      return "argon2";
    }
    
    return "unknown";
  }

  // =====================================================
  // PASSWORT-VERIFIZIERUNG MIT MIGRATION
  // =====================================================

  /**
   * Verifiziert Passwort und migriert bei Bedarf zu Argon2
   * 
   * WICHTIG: Migration nur wenn ENABLE_PASSWORD_MIGRATION=true
   * 
   * @param userId - Benutzer-ID
   * @param password - Eingegebenes Passwort (Klartext)
   * @param storedHash - Gespeicherter Hash aus der Datenbank
   * @returns MigrationResult mit Erfolg/Fehler und Migrationsstatus
   */
  static async verifyAndMigrate(
    userId: number,
    password: string,
    storedHash: string
  ): Promise<MigrationResult> {
    const hashType = this.detectHashType(storedHash);
    const timestamp = new Date().toISOString();
    
    // Debug-Logging
    if (DEBUG_MODE) {
      console.log(`[PasswordMigration] DEBUG: User ${userId}, HashType: ${hashType}, Migration: ${MIGRATION_ENABLED ? "ENABLED" : "DISABLED"}`);
    }

    // =====================================================
    // SCHRITT 1: Passwort verifizieren
    // =====================================================
    
    let passwordValid = false;
    
    try {
      if (hashType === "bcrypt") {
        // bcrypt-Verifizierung
        passwordValid = await bcrypt.compare(password, storedHash);
        
        if (DEBUG_MODE) {
          console.log(`[PasswordMigration] DEBUG: bcrypt verification result: ${passwordValid}`);
        }
        
      } else if (hashType === "argon2") {
        // Argon2-Verifizierung (bereits migriert)
        passwordValid = await Argon2Service.verifyPassword(password, storedHash, "");
        
        if (DEBUG_MODE) {
          console.log(`[PasswordMigration] DEBUG: argon2 verification result: ${passwordValid}`);
        }
        
        // Bereits Argon2 - keine Migration nötig
        return {
          success: passwordValid,
          migrated: false,
          hashType: "argon2",
          message: passwordValid 
            ? "Passwort korrekt (bereits Argon2)"
            : "Passwort falsch",
          debugInfo: DEBUG_MODE ? {
            userId,
            oldHashPrefix: storedHash.substring(0, 20) + "...",
            timestamp,
          } : undefined,
        };
        
      } else {
        // Unbekannter Hash-Typ
        console.error(`[PasswordMigration] WARNUNG: Unbekannter Hash-Typ für User ${userId}`);
        return {
          success: false,
          migrated: false,
          hashType: "unknown",
          message: "Unbekannter Hash-Typ - Migration nicht möglich",
        };
      }
    } catch (error) {
      console.error(`[PasswordMigration] Fehler bei Passwort-Verifizierung:`, error);
      return {
        success: false,
        migrated: false,
        hashType,
        message: "Fehler bei Passwort-Verifizierung",
      };
    }

    // =====================================================
    // SCHRITT 2: Bei Erfolg + bcrypt → Migration zu Argon2
    // =====================================================
    
    if (passwordValid && hashType === "bcrypt") {
      
      // Migration nur wenn aktiviert
      if (!MIGRATION_ENABLED) {
        if (DEBUG_MODE) {
          console.log(`[PasswordMigration] DEBUG: Migration DEAKTIVIERT - würde User ${userId} migrieren`);
        }
        
        return {
          success: true,
          migrated: false,
          hashType: "bcrypt",
          message: "Passwort korrekt (bcrypt) - Migration deaktiviert",
          debugInfo: DEBUG_MODE ? {
            userId,
            oldHashPrefix: storedHash.substring(0, 20) + "...",
            timestamp,
          } : undefined,
        };
      }

      // =====================================================
      // MIGRATION DURCHFÜHREN (NUR WENN AKTIVIERT!)
      // =====================================================
      
      try {
        console.log(`[PasswordMigration] Starte Migration für User ${userId}...`);
        
        // Neuen Argon2-Hash erstellen
        const argon2Result = await Argon2Service.hashPassword(password);
        
        // In Datenbank speichern
        const connection = await getConnection();
        await connection.execute(
          `UPDATE lopez_users SET password_hash = ?, updated_at = NOW() WHERE id = ?`,
          [argon2Result.hash, userId]
        );
        
        console.log(`[PasswordMigration] ✅ User ${userId} erfolgreich zu Argon2 migriert`);
        
        // Audit-Log (falls vorhanden)
        try {
          await connection.execute(
            `INSERT INTO lopez_audit_logs (
              table_name, record_id, action, user_id, 
              new_values, created_at
            ) VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              "lopez_users",
              userId,
              "PASSWORD_MIGRATED",
              userId,
              JSON.stringify({
                from: "bcrypt",
                to: "argon2id",
                timestamp,
              }),
            ]
          );
        } catch (auditError) {
          // Audit-Fehler ignorieren, Migration war erfolgreich
          console.log(`[PasswordMigration] Audit-Log konnte nicht erstellt werden (nicht kritisch)`);
        }
        
        return {
          success: true,
          migrated: true,
          hashType: "argon2", // Jetzt Argon2!
          message: "Passwort korrekt - Migration zu Argon2 erfolgreich",
          debugInfo: DEBUG_MODE ? {
            userId,
            oldHashPrefix: storedHash.substring(0, 20) + "...",
            newHashPrefix: argon2Result.hash.substring(0, 20) + "...",
            timestamp,
          } : undefined,
        };
        
      } catch (migrationError) {
        console.error(`[PasswordMigration] Fehler bei Migration für User ${userId}:`, migrationError);
        
        // Passwort war trotzdem korrekt - Login erlauben, Migration später versuchen
        return {
          success: true,
          migrated: false,
          hashType: "bcrypt",
          message: "Passwort korrekt - Migration fehlgeschlagen (wird später erneut versucht)",
        };
      }
    }

    // =====================================================
    // Passwort falsch
    // =====================================================
    
    return {
      success: false,
      migrated: false,
      hashType,
      message: "Passwort falsch",
    };
  }

  // =====================================================
  // STATISTIKEN
  // =====================================================

  /**
   * Zählt Benutzer nach Hash-Typ (für Reporting)
   */
  static async getHashStatistics(): Promise<{
    total: number;
    bcrypt: number;
    argon2: number;
    unknown: number;
  }> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `SELECT password_hash FROM lopez_users WHERE password_hash IS NOT NULL`
      );
      
      const users = rows as { password_hash: string }[];
      
      let bcryptCount = 0;
      let argon2Count = 0;
      let unknownCount = 0;
      
      for (const user of users) {
        const hashType = this.detectHashType(user.password_hash);
        if (hashType === "bcrypt") bcryptCount++;
        else if (hashType === "argon2") argon2Count++;
        else unknownCount++;
      }
      
      return {
        total: users.length,
        bcrypt: bcryptCount,
        argon2: argon2Count,
        unknown: unknownCount,
      };
    } catch (error) {
      console.error("[PasswordMigration] Fehler bei Statistik-Abfrage:", error);
      return { total: 0, bcrypt: 0, argon2: 0, unknown: 0 };
    }
  }
}

// =====================================================
// EXPORT FÜR ANDERE SERVICES
// =====================================================

export default PasswordMigrationService;




