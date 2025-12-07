// =====================================================
// PASSWORD MIGRATION INTEGRATION - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Anleitung zur Integration in Login-Route
// Status: ⏸️ DOKUMENTATION - NICHT AKTIVIERT
// =====================================================
//
// Diese Datei zeigt, wie die Migration in die Login-Route
// integriert werden kann, OHNE die bestehende Logik zu ändern.
//
// AKTIVIERUNG NUR NACH EXPLIZITER FREIGABE!
//
// =====================================================

import { PasswordMigrationService, MigrationResult } from "./password-migration-service";

// =====================================================
// INTEGRATION IN AUTH-SERVICE (BEISPIEL)
// =====================================================
//
// Füge diesen Code in auth-service.ts > login() ein:
//
// VORHER (bestehend):
// ```typescript
// const passwordValid = await bcrypt.compare(credentials.password, user.password_hash);
// if (!passwordValid) {
//   return { success: false, message: "..." };
// }
// ```
//
// NACHHER (mit Migration):
// ```typescript
// // Option A: Migration aktiviert (ENABLE_PASSWORD_MIGRATION=true in .env)
// const migrationResult = await PasswordMigrationService.verifyAndMigrate(
//   user.id,
//   credentials.password,
//   user.password_hash
// );
// 
// if (!migrationResult.success) {
//   return { success: false, message: "..." };
// }
// 
// // Optional: Log wenn Migration durchgeführt
// if (migrationResult.migrated) {
//   console.log(`[Auth] User ${user.id} zu Argon2 migriert`);
// }
// ```
//
// =====================================================

// =====================================================
// INTEGRATION IN ADMIN-AUTH-SERVICE (BEISPIEL)
// =====================================================
//
// Füge diesen Code in admin-auth-service.ts > login() ein:
//
// VORHER (bestehend):
// ```typescript
// const passwordValid = await bcrypt.compare(password, user.password_hash);
// ```
//
// NACHHER (mit Migration):
// ```typescript
// const migrationResult = await PasswordMigrationService.verifyAndMigrate(
//   user.id,
//   password,
//   user.password_hash
// );
// const passwordValid = migrationResult.success;
// ```
//
// =====================================================

// =====================================================
// INTEGRATION IN SECURITY-RECHECK (BEISPIEL)
// =====================================================
//
// Füge diesen Code in security/recheck/route.ts ein:
//
// VORHER (bestehend):
// ```typescript
// const passwordValid = await bcrypt.compare(password, user.password_hash);
// ```
//
// NACHHER (mit Migration):
// ```typescript
// const migrationResult = await PasswordMigrationService.verifyAndMigrate(
//   session.userId,
//   password,
//   user.password_hash
// );
// const passwordValid = migrationResult.success;
// ```
//
// =====================================================

/**
 * Beispiel-Wrapper-Funktion für Login mit Migration
 * 
 * Diese Funktion kann als Drop-in Replacement für bcrypt.compare verwendet werden,
 * solange die Migration DEAKTIVIERT ist (ENABLE_PASSWORD_MIGRATION=false).
 * 
 * Bei deaktivierter Migration verhält sie sich exakt wie bcrypt.compare.
 */
export async function verifyPasswordWithMigration(
  userId: number,
  password: string,
  storedHash: string
): Promise<boolean> {
  const result = await PasswordMigrationService.verifyAndMigrate(
    userId,
    password,
    storedHash
  );
  return result.success;
}

/**
 * Detaillierte Verifizierung mit Rückgabe des Migrationsstatus
 */
export async function verifyPasswordDetailed(
  userId: number,
  password: string,
  storedHash: string
): Promise<MigrationResult> {
  return await PasswordMigrationService.verifyAndMigrate(
    userId,
    password,
    storedHash
  );
}

// =====================================================
// AKTIVIERUNGS-CHECKLISTE
// =====================================================
//
// Vor Aktivierung der Migration:
//
// □ 1. Backup der lopez_users Tabelle erstellen
// □ 2. In .env einfügen: ENABLE_PASSWORD_MIGRATION=true
// □ 3. Optional Debug: PASSWORD_MIGRATION_DEBUG=true
// □ 4. Server neu starten
// □ 5. Test-Login mit einem Benutzer durchführen
// □ 6. In DB prüfen ob password_hash mit $argon2 beginnt
// □ 7. Bei Erfolg: Weitere Benutzer migrieren lassen
//
// =====================================================

// =====================================================
// ROLLBACK-PLAN
// =====================================================
//
// Falls Probleme auftreten:
//
// 1. ENABLE_PASSWORD_MIGRATION=false in .env setzen
// 2. Server neu starten
// 3. Backup der lopez_users Tabelle wiederherstellen (falls nötig)
// 4. Alle Benutzer haben dann wieder bcrypt-Hashes
//
// WICHTIG: Benutzer, die bereits zu Argon2 migriert wurden,
// können sich nach einem Rollback NICHT mehr einloggen!
// Daher immer zuerst Backup erstellen!
//
// =====================================================

export default {
  verifyPasswordWithMigration,
  verifyPasswordDetailed,
};










