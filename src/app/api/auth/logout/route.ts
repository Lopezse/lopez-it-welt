// =====================================================
// LOGOUT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Benutzer-Logout
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AuthService } from "@/lib/auth-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Benutzer-Logout
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Session-Token erforderlich" },
        { status: 400 },
      );
    }

    // Session validieren
    const session = await AuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, message: "Ungültige Session" }, { status: 401 });
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Logout durchführen
    const logoutSuccess = await AuthService.logout(sessionToken);

    if (!logoutSuccess) {
      return NextResponse.json(
        { success: false, message: "Logout fehlgeschlagen" },
        { status: 500 },
      );
    }

    // Automatische Zeiterfassung bei Logout beenden
    try {
      const { promises: fs } = await import("fs");
      const path = await import("path");
      
      const SESSIONS_FILE = path.join(process.cwd(), "data", "time-sessions.json");
      
      // Sessions laden
      let sessions: any[] = [];
      try {
        const data = await fs.readFile(SESSIONS_FILE, "utf-8");
        sessions = JSON.parse(data);
      } catch {
        // Datei existiert nicht - nichts zu beenden
        sessions = [];
      }
      
      // Alle aktiven Sessions für diesen Benutzer beenden
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
            
            // Audit-Log für Zeiterfassung (vor dem Update)
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
              }),
              user_id: session.userId,
              username: session.username,
              ip_address: ipAddress,
              user_agent: userAgent,
              session_id: sessionToken,
              risk_level: "LOW",
              compliance_category: "DATA_MODIFICATION",
            });
            
            // Session beenden
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
          // Verzeichnis erstellen falls nicht vorhanden
          const dir = path.dirname(SESSIONS_FILE);
          await fs.mkdir(dir, { recursive: true });
          
          // Sessions speichern
          await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
        }
      }
    } catch (timeTrackingError) {
      // Zeiterfassung ist optional - nicht kritisch
      console.warn("⚠️ Automatische Zeiterfassung bei Logout fehlgeschlagen:", timeTrackingError);
    }

    // Audit-Log erstellen
    await AuditService.logLogout(
      session.userId,
      session.username,
      ipAddress,
      userAgent,
      sessionToken,
    );

    // Logout erfolgreich: ${session.username}

    return NextResponse.json({
      success: true,
      message: "Logout erfolgreich",
    });
  } catch (error) {
    // Logout-API-Fehler: ${error}
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
