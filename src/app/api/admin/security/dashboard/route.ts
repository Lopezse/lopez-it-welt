// =====================================================
// SECURITY DASHBOARD API - LOPEZ IT WELT
// =====================================================
// Enterprise++ Security Dashboard Daten
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AdvancedSecurityService } from "@/lib/advanced-security-service";
import { SessionSecurityService } from "@/lib/session-security";
import { getConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Session prüfen
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken,
      jwtToken,
      clientIp,
      userAgent
    );

    if (!validation.valid) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Nur Super Admin darf Security Dashboard sehen
    if (!validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    // Security-Statistiken laden
    const [loginStats, securityStats] = await Promise.all([
      AdvancedSecurityService.getLoginStats(7),
      AdvancedSecurityService.getSecurityStats(7),
    ]);

    // Aktive Sessions
    const pool = await getConnection();
    const [activeSessions] = await pool.execute(
      `SELECT s.*, u.username, u.email 
       FROM lopez_sessions s 
       JOIN lopez_users u ON s.user_id = u.id 
       WHERE s.expires_at > NOW() 
       ORDER BY s.last_activity_at DESC`
    );

    // Letzte Security Events
    const recentEvents = await AdvancedSecurityService.getSecurityEvents({
      limit: 20,
    });

    // Gesperrte Accounts
    const [lockedAccounts] = await pool.execute(
      `SELECT l.*, u.username, u.email 
       FROM lopez_account_lockouts l 
       JOIN lopez_users u ON l.user_id = u.id 
       WHERE l.locked_until > NOW() AND l.unlocked_at IS NULL`
    );

    return NextResponse.json({
      success: true,
      data: {
        loginStats,
        securityStats,
        activeSessions: (activeSessions as any[]).map(s => ({
          id: s.id,
          userId: s.user_id,
          username: s.username,
          email: s.email,
          ipAddress: s.ip_address,
          userAgent: s.user_agent,
          lastActivity: s.last_activity_at,
          createdAt: s.created_at,
          expiresAt: s.expires_at,
        })),
        recentEvents,
        lockedAccounts,
      },
    });
  } catch (error) {
    console.error("Security Dashboard Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Fehler beim Laden der Security-Daten",
    }, { status: 500 });
  }
}









