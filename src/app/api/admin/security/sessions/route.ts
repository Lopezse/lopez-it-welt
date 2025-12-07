// =====================================================
// SESSION INSPECTOR API - LOPEZ IT WELT
// =====================================================
// Aktive Sessions verwalten
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { SessionSecurityService } from "@/lib/session-security";
import { AdvancedSecurityService } from "@/lib/advanced-security-service";
import { getConnection } from "@/lib/database";

// GET - Alle aktiven Sessions auflisten
export async function GET(request: NextRequest) {
  try {
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

    if (!validation.valid || !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const pool = await getConnection();
    
    const [sessions] = await pool.execute(
      `SELECT s.*, u.username, u.email, u.first_name, u.last_name
       FROM lopez_sessions s 
       JOIN lopez_users u ON s.user_id = u.id 
       WHERE s.expires_at > NOW() 
       ORDER BY s.last_activity_at DESC`
    );

    return NextResponse.json({
      success: true,
      data: {
        sessions: (sessions as any[]).map(s => ({
          id: s.id,
          sessionToken: s.session_token.substring(0, 20) + "...",
          userId: s.user_id,
          username: s.username,
          email: s.email,
          fullName: `${s.first_name || ""} ${s.last_name || ""}`.trim(),
          ipAddress: s.ip_address,
          userAgent: s.user_agent,
          lastActivity: s.last_activity_at,
          createdAt: s.created_at,
          expiresAt: s.expires_at,
          isCurrent: s.session_token === sessionToken,
        })),
        currentSessionToken: sessionToken?.substring(0, 20) + "...",
      },
    });
  } catch (error) {
    console.error("Session List Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}

// DELETE - Session beenden
export async function DELETE(request: NextRequest) {
  try {
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

    if (!validation.valid || !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const body = await request.json();
    const { targetSessionId, terminateAll, targetUserId } = body;

    const pool = await getConnection();

    if (terminateAll && targetUserId) {
      // Alle Sessions eines Users beenden (außer eigene)
      await pool.execute(
        `DELETE FROM lopez_sessions 
         WHERE user_id = ? AND session_token != ?`,
        [targetUserId, sessionToken]
      );

      // Security Event
      await AdvancedSecurityService.logSecurityEvent(
        targetUserId,
        "SESSION_TERMINATED",
        "medium",
        {
          terminatedBy: validation.session?.userId,
          reason: "Admin action - all sessions",
        }
      );

      return NextResponse.json({
        success: true,
        message: "Alle Sessions des Benutzers beendet",
      });
    }

    if (targetSessionId) {
      // Einzelne Session beenden
      const [sessionInfo] = await pool.execute(
        "SELECT user_id FROM lopez_sessions WHERE id = ?",
        [targetSessionId]
      );

      if ((sessionInfo as any[]).length === 0) {
        return NextResponse.json({ success: false, message: "Session nicht gefunden" }, { status: 404 });
      }

      const targetUserId = (sessionInfo as any[])[0].user_id;

      await pool.execute(
        "DELETE FROM lopez_sessions WHERE id = ?",
        [targetSessionId]
      );

      // Security Event
      await AdvancedSecurityService.logSecurityEvent(
        targetUserId,
        "SESSION_TERMINATED",
        "medium",
        {
          sessionId: targetSessionId,
          terminatedBy: validation.session?.userId,
          reason: "Admin action",
        }
      );

      return NextResponse.json({
        success: true,
        message: "Session beendet",
      });
    }

    return NextResponse.json({ success: false, message: "Keine Aktion angegeben" }, { status: 400 });
  } catch (error) {
    console.error("Session Delete Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}















