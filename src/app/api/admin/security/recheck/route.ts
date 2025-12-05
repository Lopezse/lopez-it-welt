// =====================================================
// SECURITY RECHECK API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Passwort-Bestätigung vor sicherheitskritischen Aktionen
// Pfad: /api/admin/security/recheck
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// Recheck-Token Cache (in Production: Redis verwenden)
const recheckTokens = new Map<string, { userId: number; expiresAt: Date }>();

// Token-Cleanup alle 5 Minuten
setInterval(() => {
  const now = new Date();
  for (const [token, data] of recheckTokens.entries()) {
    if (data.expiresAt < now) {
      recheckTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

// =====================================================
// POST - Security-Recheck durchführen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session validieren
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password, twoFactorCode, action } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Passwort ist erforderlich" },
        { status: 400 }
      );
    }

    // Benutzer laden
    const connection = await getConnection();
    const [userRows] = await connection.execute(
      "SELECT id, password_hash FROM lopez_users WHERE id = ?",
      [session.userId]
    );

    if ((userRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const user = (userRows as any[])[0];

    // Passwort verifizieren (bcrypt - wie in AuthService.login verwendet)
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      // IP und User-Agent für Audit
      const ipAddress =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";

      // Fehlgeschlagenen Versuch loggen
      try {
        await AuditService.logAudit({
          table_name: "security_recheck",
          record_id: session.userId,
          action: "RECHECK_FAILED",
          user_id: session.userId,
          username: session.username,
          ip_address: ipAddress,
          user_agent: userAgent,
          session_id: sessionToken,
          risk_level: "HIGH",
          compliance_category: "AUTHENTICATION",
          new_values: JSON.stringify({ 
            reason: "invalid_password",
            intended_action: action || "unknown",
          }),
        });
      } catch (auditError) {
        console.error("Audit-Log Fehler:", auditError);
      }

      return NextResponse.json(
        { success: false, message: "Passwort ist falsch" },
        { status: 401 }
      );
    }

    // Falls 2FA aktiviert: Code prüfen
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    if (is2FAEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { 
            success: false, 
            message: "2FA-Code ist erforderlich",
            requires_2fa: true,
          },
          { status: 400 }
        );
      }

      const twoFactorValid = await TwoFactorService.verifyToken(session.userId, twoFactorCode);
      if (!twoFactorValid) {
        return NextResponse.json(
          { success: false, message: "2FA-Code ist ungültig" },
          { status: 401 }
        );
      }
    }

    // Recheck-Token generieren (gültig für 10 Minuten)
    const recheckToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Minuten

    recheckTokens.set(recheckToken, {
      userId: session.userId,
      expiresAt,
    });

    // IP und User-Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Erfolgreichen Recheck loggen
    try {
      await AuditService.logAudit({
        table_name: "security_recheck",
        record_id: session.userId,
        action: "RECHECK_SUCCESS",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "MEDIUM",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({ 
          intended_action: action || "unknown",
          valid_until: expiresAt.toISOString(),
          with_2fa: is2FAEnabled,
        }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: "Security-Recheck erfolgreich",
      data: {
        recheck_token: recheckToken,
        valid_until: expiresAt.toISOString(),
        expires_in_seconds: 600,
      },
    });
  } catch (error) {
    console.error("❌ Security-Recheck Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Security-Recheck" },
      { status: 500 }
    );
  }
}

// =====================================================
// GET - Recheck-Token validieren
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const recheckToken = request.nextUrl.searchParams.get("token");

    if (!recheckToken) {
      return NextResponse.json(
        { success: false, message: "Token ist erforderlich" },
        { status: 400 }
      );
    }

    const tokenData = recheckTokens.get(recheckToken);

    if (!tokenData) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: "Token nicht gefunden oder abgelaufen",
      });
    }

    if (tokenData.expiresAt < new Date()) {
      recheckTokens.delete(recheckToken);
      return NextResponse.json({
        success: false,
        valid: false,
        message: "Token abgelaufen",
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        userId: tokenData.userId,
        valid_until: tokenData.expiresAt.toISOString(),
        remaining_seconds: Math.floor((tokenData.expiresAt.getTime() - Date.now()) / 1000),
      },
    });
  } catch (error) {
    console.error("❌ Token-Validierung Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler bei der Token-Validierung" },
      { status: 500 }
    );
  }
}

// =====================================================
// Hilfsfunktion: Recheck-Token prüfen (für andere APIs)
// =====================================================

export function validateRecheckToken(token: string, userId?: number): boolean {
  const tokenData = recheckTokens.get(token);
  
  if (!tokenData) return false;
  if (tokenData.expiresAt < new Date()) {
    recheckTokens.delete(token);
    return false;
  }
  // Wenn userId angegeben, muss sie übereinstimmen
  if (userId !== undefined && tokenData.userId !== userId) return false;
  
  return true;
}

// Token-Daten abrufen
export function getRecheckTokenData(token: string): { userId: number; expiresAt: Date } | null {
  const tokenData = recheckTokens.get(token);
  if (!tokenData) return null;
  if (tokenData.expiresAt < new Date()) {
    recheckTokens.delete(token);
    return null;
  }
  return tokenData;
}

// Token nach Verwendung invalidieren
export function consumeRecheckToken(token: string): boolean {
  if (recheckTokens.has(token)) {
    recheckTokens.delete(token);
    return true;
  }
  return false;
}

// Token für Benutzer invalidieren (bei Logout/Passwortänderung)
export function invalidateUserRecheckTokens(userId: number): void {
  for (const [token, data] of recheckTokens.entries()) {
    if (data.userId === userId) {
      recheckTokens.delete(token);
    }
  }
}

