// =====================================================
// ADMIN LOGOUT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Admin-Logout
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Admin-Logout
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session-Token aus Cookie oder Body extrahieren
    const sessionToken = 
      request.cookies.get("adm_session")?.value ||
      (await request.json()).sessionToken;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Session-Token erforderlich" },
        { status: 400 },
      );
    }

    // Session validieren
    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, message: "Ungültige Session" }, { status: 401 });
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const route = request.nextUrl.pathname;

    // Automatische Zeiterfassung bei Admin-Logout beenden
    try {
      const { promises: fs } = await import("fs");
      const path = await import("path");
      
      const SESSIONS_FILE = path.join(process.cwd(), "data", "time-sessions.json");
      
      let sessions: any[] = [];
      try {
        const data = await fs.readFile(SESSIONS_FILE, "utf-8");
        sessions = JSON.parse(data);
      } catch {
        sessions = [];
      }
      
      const activeSessions = sessions.filter(
        (s: any) => s.user_id === session.userId && s.status === "active" && !s.end_time
      );
      
      if (activeSessions.length > 0) {
        const now = new Date().toISOString();
        let hasChanges = false;
        
        for (let i = 0; i < sessions.length; i++) {
          const sessionItem = sessions[i];
          if (sessionItem.user_id === session.userId && sessionItem.status === "active" && !sessionItem.end_time) {
            const startDate = new Date(sessionItem.start_time);
            const endDate = new Date(now);
            const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
            
            // Audit-Log für Zeiterfassung
            await AuditService.logAudit({
              table_name: "work_sessions",
              record_id: sessionItem.id,
              action: "UPDATE",
              old_values: JSON.stringify({
                status: "active",
                end_time: null,
              }),
              new_values: JSON.stringify({
                status: "completed",
                end_time: now,
                duration_minutes: durationMinutes,
                user_id: session.userId,
                username: session.username,
                realm: "ADMIN",
              }),
              user_id: session.userId,
              username: session.username,
              ip_address: ipAddress,
              user_agent: userAgent,
              session_id: sessionToken,
              risk_level: "LOW",
              compliance_category: "DATA_MODIFICATION",
            });
            
            sessions[i] = {
              ...sessionItem,
              end_time: now,
              duration_minutes: Math.max(0, durationMinutes),
              status: "completed",
              updated_at: now,
            };
            hasChanges = true;
          }
        }
        
        if (hasChanges) {
          const dir = path.dirname(SESSIONS_FILE);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
        }
      }
    } catch (timeTrackingError) {
      console.warn("⚠️ Automatische Zeiterfassung bei Admin-Logout fehlgeschlagen:", timeTrackingError);
    }

    // Logout durchführen
    const logoutSuccess = await AdminAuthService.logout(sessionToken);

    if (!logoutSuccess) {
      return NextResponse.json(
        { success: false, message: "Logout fehlgeschlagen" },
        { status: 500 },
      );
    }

    // Audit-Log erstellen
    await AuditService.logAudit({
      table_name: "lopez_users",
      record_id: session.userId,
      action: "LOGOUT",
      user_id: session.userId,
      username: session.username,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionToken,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
      new_values: JSON.stringify({
        realm: "ADMIN",
        route,
      }),
    });

    // Cookie löschen
    const response = NextResponse.json({
      success: true,
      message: "Logout erfolgreich",
    });

    response.cookies.delete("adm_session");
    response.cookies.delete("adm_token");

    return response;
  } catch (error) {
    console.error("❌ Admin Logout API Fehler:", error);
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
