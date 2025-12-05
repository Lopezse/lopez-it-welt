// =====================================================
// ENTERPRISE++ PASSWORD CHANGE API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Passwort-Änderung für Admin-Benutzer (Siemens/IBM/SAP Level)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { Argon2Service } from "@/lib/argon2-service";
import { PasswordStrengthAnalyzer } from "@/lib/password-strength-analyzer";
import { AuditService } from "@/lib/audit-service";
import { executeQueryPoolWithResult, executeQueryPool } from "@/lib/db";
import { getConnection } from "@/lib/database";

// =====================================================
// PUT - Passwort ändern
// =====================================================

export async function PUT(request: NextRequest) {
  try {
    // Session-Token aus Header oder Cookie extrahieren
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Session validieren
    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    const userId = session.userId;
    const body = await request.json();
    const { current, new: newPassword } = body;

    // Validierung: Alle Felder erforderlich
    if (!current || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Aktuelles und neues Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // Enterprise++ Passwort-Stärke prüfen
    const strengthResult = PasswordStrengthAnalyzer.analyze(newPassword);
    if (!strengthResult.requirements.find(r => r.text.includes("12 Zeichen"))?.met) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Passwort muss mindestens 12 Zeichen lang sein",
          strength: strengthResult
        },
        { status: 400 }
      );
    }

    if (strengthResult.strength === "weak" || strengthResult.score < 51) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Passwort ist zu schwach. Bitte verwenden Sie Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.",
          strength: strengthResult
        },
        { status: 400 }
      );
    }

    // Aktuelles Passwort prüfen
    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      const [userRows] = await connection.execute(
        "SELECT password_hash, salt, email, username FROM lopez_users WHERE id = ?",
        [userId]
      );

      if ((userRows as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: "Benutzer nicht gefunden" },
          { status: 404 }
        );
      }

      const user = (userRows as any)[0];

      // Passwort-Verifizierung (Argon2 oder bcrypt)
      let isValid = false;
      
      if (user.salt) {
        // Argon2 mit Salt
        isValid = await Argon2Service.verifyPassword(current, user.password_hash, user.salt);
      } else {
        // bcrypt (Legacy)
        const bcrypt = require("bcryptjs");
        isValid = await bcrypt.compare(current, user.password_hash);
      }

      if (!isValid) {
        // Audit-Log für fehlgeschlagene Passwort-Änderung
        await AuditService.logAudit({
          table_name: "lopez_users",
          record_id: userId,
          action: "PASSWORD_CHANGE",
          user_id: userId,
          username: user.username,
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
          session_id: sessionToken,
          risk_level: "HIGH",
          compliance_category: "AUTHENTICATION",
          new_values: JSON.stringify({
            result: "failed",
            reason: "incorrect_current_password",
          }),
        }).catch(err => console.error("⚠️ Audit-Log fehlgeschlagen:", err));

        return NextResponse.json(
          { success: false, error: "Aktuelles Passwort ist falsch" },
          { status: 400 }
        );
      }

      // Neues Passwort darf nicht gleich dem alten sein
      if (current === newPassword) {
        return NextResponse.json(
          { success: false, error: "Das neue Passwort muss sich vom aktuellen Passwort unterscheiden" },
          { status: 400 }
        );
      }

      // Enterprise++: Neues Passwort mit Argon2 hashen
      const { hash: hashedPassword, salt } = await Argon2Service.hashPassword(newPassword);

      // Passwort in Datenbank aktualisieren
      await connection.execute(
        `UPDATE lopez_users 
         SET password_hash = ?, 
             salt = ?,
             password_changed_at = NOW(),
             updated_at = NOW() 
         WHERE id = ?`,
        [hashedPassword, salt, userId]
      );

      // Enterprise++: Audit-Log für erfolgreiche Passwort-Änderung
      await AuditService.logAudit({
        table_name: "lopez_users",
        record_id: userId,
        action: "PASSWORD_CHANGE",
        user_id: userId,
        username: user.username,
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        session_id: sessionToken,
        risk_level: "MEDIUM",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({
          result: "success",
          password_strength: strengthResult.strength,
          password_score: strengthResult.score,
        }),
      }).catch(err => console.error("⚠️ Audit-Log fehlgeschlagen:", err));

      return NextResponse.json({
        success: true,
        message: "Passwort erfolgreich geändert",
        data: {
          password_strength: strengthResult.strength,
          password_score: strengthResult.score,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Ändern des Passworts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Fehler beim Ändern des Passworts" },
      { status: 500 }
    );
  }
}
