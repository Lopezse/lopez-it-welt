// DEBUG-ROUTE: 2FA Secret generieren für ersten Login (NUR FÜR ENTWICKLUNG!)
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    
    // Speziell nach r.lopezsr suchen
    const [rlopezsr] = await pool.execute(
      `SELECT id, username, email FROM lopez_users WHERE username = ?`,
      ["r.lopezsr"]
    );
    
    const superAdmin = (rlopezsr as any[])[0];
    
    if (!superAdmin) {
      return NextResponse.json({
        success: false,
        message: "Benutzer r.lopezsr nicht gefunden!",
      });
    }
    
    // 2FA-Eintrag prüfen
    const [twoFaRows] = await pool.execute(
      `SELECT * FROM lopez_user_2fa WHERE user_id = ?`,
      [superAdmin.id]
    );
    const twoFaEntry = (twoFaRows as any[])[0];
    
    // Neues 2FA Secret generieren
    const secret = speakeasy.generateSecret({
      name: `Lopez IT Welt (${superAdmin.username})`,
      issuer: "Lopez IT Welt",
      length: 32,
    });
    
    // Backup-Codes generieren
    const backupCodes = Array.from({ length: 4 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    // 2FA in DB speichern oder aktualisieren
    if (twoFaEntry) {
      await pool.execute(
        `UPDATE lopez_user_2fa SET 
          secret = ?, 
          backup_codes = ?,
          updated_at = NOW()
        WHERE user_id = ?`,
        [secret.base32, JSON.stringify(backupCodes), superAdmin.id]
      );
    } else {
      await pool.execute(
        `INSERT INTO lopez_user_2fa (user_id, secret, backup_codes)
         VALUES (?, ?, ?)`,
        [superAdmin.id, secret.base32, JSON.stringify(backupCodes)]
      );
    }
    
    // OTP-Auth URL für Aegis
    const otpAuthUrl = secret.otpauth_url;
    
    return NextResponse.json({
      success: true,
      message: "✅ 2FA Secret generiert!",
      data: {
        username: superAdmin.username,
        instructions: [
          "1. Öffne Aegis Authenticator",
          "2. Tippe auf '+' → 'Manuell eingeben'",
          "3. Gib folgende Daten ein:",
        ],
        manual_entry: {
          name: `Lopez IT Welt (${superAdmin.username})`,
          secret: secret.base32,
          type: "TOTP",
          algorithm: "SHA1",
          digits: 6,
          period: 30,
        },
        otpauth_url: otpAuthUrl,
        backup_codes: backupCodes,
        note: "Nach Einrichtung in Aegis kannst du dich mit dem 6-stelligen Code einloggen!",
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Fehler",
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    }, { status: 500 });
  }
}

