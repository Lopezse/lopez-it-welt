// =====================================================
// DEBUG-ROUTE: QR-Code für 2FA anzeigen
// =====================================================
// ⚠️ NUR FÜR ENTWICKLUNG! Wird in Production blockiert.
// Nach erfolgreicher 2FA-Implementierung entfernen!
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  // =====================================================
  // PRODUCTION-SCHUTZ: Route nur in Development verfügbar
  // =====================================================
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { 
        success: false, 
        message: "Debug-Route ist in Production nicht verfügbar",
        hint: "Verwenden Sie /admin/settings/security/2fa für 2FA-Setup"
      },
      { status: 403 }
    );
  }

  try {
    const pool = await getConnection();
    
    // Speziell nach r.lopezsr suchen
    const [rlopezsr] = await pool.execute(
      `SELECT id, username, email FROM lopez_users WHERE username = ?`,
      ["r.lopezsr"]
    );
    
    const superAdmin = (rlopezsr as any[])[0];
    
    if (!superAdmin) {
      return new NextResponse("Benutzer nicht gefunden", { status: 404 });
    }
    
    // 2FA-Eintrag prüfen - nur neues Secret wenn noch keines existiert!
    const [twoFaRows] = await pool.execute(
      `SELECT * FROM lopez_user_2fa WHERE user_id = ?`,
      [superAdmin.id]
    );
    const twoFaEntry = (twoFaRows as any[])[0];
    
    let secretBase32: string;
    let backupCodes: string[];
    let isNewSecret = false;
    
    if (twoFaEntry && twoFaEntry.secret) {
      // Bestehendes Secret verwenden - NICHT überschreiben!
      secretBase32 = twoFaEntry.secret;
      backupCodes = JSON.parse(twoFaEntry.backup_codes || '[]');
    } else {
      // Nur wenn noch kein Secret existiert: Neues generieren
      isNewSecret = true;
      const secret = speakeasy.generateSecret({
        name: `Lopez IT Welt:${superAdmin.username}`,
        issuer: "Lopez IT Welt",
        length: 20,
      });
      secretBase32 = secret.base32;
      
      // Backup-Codes generieren
      backupCodes = Array.from({ length: 4 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      
      // In DB speichern
      if (twoFaEntry) {
        await pool.execute(
          `UPDATE lopez_user_2fa SET 
            secret = ?, 
            backup_codes = ?,
            updated_at = NOW()
          WHERE user_id = ?`,
          [secretBase32, JSON.stringify(backupCodes), superAdmin.id]
        );
      } else {
        await pool.execute(
          `INSERT INTO lopez_user_2fa (user_id, secret, backup_codes)
           VALUES (?, ?, ?)`,
          [superAdmin.id, secretBase32, JSON.stringify(backupCodes)]
        );
      }
    }
    
    // QR-Code als Data URL generieren
    const otpAuthUrl = `otpauth://totp/Lopez%20IT%20Welt:${superAdmin.username}?secret=${secretBase32}&issuer=Lopez%20IT%20Welt&algorithm=SHA1&digits=6&period=30`;
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    
    // HTML-Seite mit QR-Code zurückgeben
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2FA Setup - Lopez IT Welt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #f4f4f4;
    }
    .container {
      background: #111217;
      border: 1px solid #272a33;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    h1 {
      color: #ffd700;
      margin-bottom: 10px;
      font-size: 1.8rem;
    }
    .subtitle {
      color: #b3b3b3;
      margin-bottom: 30px;
    }
    .qr-container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      display: inline-block;
      margin: 20px 0;
      position: relative;
    }
    .qr-container img {
      display: block;
    }
    .qr-logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: #007bff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    }
    .instructions {
      text-align: left;
      background: #1a1a2e;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .instructions h3 {
      color: #ffd700;
      margin-bottom: 15px;
    }
    .instructions ol {
      padding-left: 20px;
    }
    .instructions li {
      margin: 10px 0;
      color: #b3b3b3;
    }
    .secret-box {
      background: #0a0a0f;
      border: 1px solid #272a33;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-family: monospace;
      font-size: 0.9rem;
      word-break: break-all;
      color: #24a148;
    }
    .backup-codes {
      background: #1a1a2e;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }
    .backup-codes h3 {
      color: #da1e28;
      margin-bottom: 15px;
    }
    .codes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .code {
      background: #0a0a0f;
      border: 1px solid #272a33;
      padding: 10px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 1.1rem;
      color: #ffd700;
    }
    .login-info {
      margin-top: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #1a472a 0%, #0a2a1a 100%);
      border: 1px solid #24a148;
      border-radius: 8px;
    }
    .login-info h3 {
      color: #24a148;
      margin-bottom: 15px;
    }
    .login-info p {
      margin: 5px 0;
      color: #b3b3b3;
    }
    .login-info strong {
      color: #f4f4f4;
    }
    .logo-download {
      margin-top: 30px;
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
    }
    .logo-download h3 {
      color: #ffd700;
      margin-bottom: 15px;
    }
    .logo-download p {
      color: #b3b3b3;
      font-size: 0.9rem;
      margin-bottom: 15px;
    }
    .logo-preview {
      background: #272a33;
      border-radius: 16px;
      padding: 20px;
      display: inline-block;
      margin: 15px 0;
    }
    .download-btn {
      display: block;
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      color: #000;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      margin: 10px 0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    }
    .download-btn-alt {
      background: linear-gradient(135deg, #24a148 0%, #198038 100%);
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔐 2FA Setup</h1>
    <p class="subtitle">Lopez IT Welt - Enterprise++</p>
    
    <div class="qr-container">
      <img src="${qrCodeDataUrl}" alt="2FA QR Code" width="300" height="300">
      <div class="qr-logo">LW</div>
    </div>
    
    <div class="instructions">
      <h3>📱 Anleitung für Aegis:</h3>
      <ol>
        <li>Öffne <strong>Aegis Authenticator</strong></li>
        <li>Tippe auf <strong>+</strong> (Hinzufügen)</li>
        <li>Wähle <strong>"QR-Code scannen"</strong></li>
        <li>Scanne diesen QR-Code</li>
        <li>Fertig! Der 6-stellige Code erscheint in Aegis</li>
      </ol>
    </div>
    
    <div class="secret-box">
      <strong>Manuelles Secret (falls QR nicht funktioniert):</strong><br><br>
      ${secretBase32}
      ${isNewSecret ? '<br><br><span style="color: #ffd700;">⚠️ NEUES Secret generiert - bitte in Aegis scannen!</span>' : '<br><br><span style="color: #24a148;">✅ Bestehendes Secret - keine Änderung nötig</span>'}
    </div>
    
    <div class="backup-codes">
      <h3>⚠️ Backup-Codes (sicher aufbewahren!)</h3>
      <div class="codes-grid">
        ${backupCodes.map(code => `<div class="code">${code}</div>`).join('')}
      </div>
    </div>
    
    <div class="login-info">
      <h3>✅ Login-Daten</h3>
      <p><strong>Benutzername:</strong> r.lopezsr</p>
      <p><strong>Passwort:</strong> Lopez2024!Super</p>
      <p><strong>2FA-Code:</strong> Aus Aegis (6 Ziffern)</p>
    </div>
    
    <div class="logo-download">
      <h3>📱 Logo für Aegis App</h3>
      <p>Lange auf den Eintrag in Aegis tippen → Icon ändern → dieses Bild wählen:</p>
      <div class="logo-preview">
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#007bff"/>
          <text x="60" y="78" font-family="Montserrat, Arial, sans-serif" font-size="48" font-weight="700" fill="#ffffff" text-anchor="middle">LW</text>
        </svg>
      </div>
      <a href="/logo-lw-mark.svg" download="lopez-it-welt-logo.svg" class="download-btn">
        ⬇️ Logo herunterladen (SVG)
      </a>
    </div>
  </div>
</body>
</html>
    `;
    
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
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

