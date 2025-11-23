// =====================================================
// LOGIN API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Benutzer-Authentifizierung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AuthService } from "@/lib/auth-service";
import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Benutzer-Login
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Development Mode: Authentication umgehen
    if (DevelopmentMode.shouldBypassAuth()) {
      // Development Mode: Login API umgangen
      const mockResponse = DevelopmentMode.createLoginResponse();
      return NextResponse.json(mockResponse);
    }

    const body = await request.json();
    const { username, password, twoFactorToken } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Benutzername und Passwort erforderlich" },
        { status: 400 },
      );
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Login-Versuch: ${username} von ${ipAddress}

    // Login durchführen
    const authResult = await AuthService.login(
      { username, password, twoFactorToken },
      ipAddress,
      userAgent,
    );

    if (!authResult.success) {
      // Login fehlgeschlagen: ${username} - ${authResult.message}
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
          requires2FA: authResult.requires2FA,
        },
        { status: 401 },
      );
    }

    // JWT-Token generieren
    const jwtToken = AuthService.generateJWT(authResult.session!);

    // Audit-Log erstellen
    await AuditService.logLogin(
      authResult.session!.userId,
      authResult.session!.username,
      ipAddress,
      userAgent,
      authResult.session!.sessionToken,
    );

    // Automatische Zeiterfassung nach Login starten
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
        // Datei existiert nicht - erstelle sie
        sessions = [];
      }
      
      // Prüfe ob bereits eine aktive Session existiert
      const activeSession = sessions.find(
        (s) => s.user_id === authResult.session!.userId && s.status === "active" && !s.end_time
      );
      
      if (!activeSession) {
        // Neue Session erstellen
        const now = new Date().toISOString();
        const maxId = sessions.length > 0 ? Math.max(...sessions.map((s: any) => s.id || 0)) : 0;
        
        const newSession = {
          id: maxId + 1,
          user_id: authResult.session!.userId,
          module: "Login-Session",
          taetigkeit: `System-Login: ${authResult.session!.username}`,
          ausloeser: "Automatische Zeiterfassung nach erfolgreichem Login",
          problem: false,
          category: "administration",
          priority: "high",
          project_id: null, // Keine Projekt-Zuordnung bei Login
          task_id: null,
          start_time: now,
          status: "active",
          created_at: now,
          updated_at: now,
        };
        
        sessions.push(newSession);
        
        // Verzeichnis erstellen falls nicht vorhanden
        const dir = path.dirname(SESSIONS_FILE);
        await fs.mkdir(dir, { recursive: true });
        
        // Sessions speichern
        await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
        
        // Audit-Log für Zeiterfassung
        await AuditService.logAudit({
          table_name: "work_sessions",
          record_id: newSession.id,
          action: "INSERT",
          new_values: JSON.stringify({
            user_id: authResult.session!.userId,
            username: authResult.session!.username,
            module: "Login-Session",
            taetigkeit: newSession.taetigkeit,
            status: "active",
          }),
          user_id: authResult.session!.userId,
          username: authResult.session!.username,
          ip_address: ipAddress,
          user_agent: userAgent,
          session_id: authResult.session!.sessionToken,
          risk_level: "LOW",
          compliance_category: "DATA_MODIFICATION", // Zeiterfassungs-Events
        });
      }
    } catch (timeTrackingError) {
      // Zeiterfassung ist optional - nicht kritisch
      console.warn("⚠️ Automatische Zeiterfassung nach Login fehlgeschlagen:", timeTrackingError);
    }

    // Login erfolgreich: ${username}

    return NextResponse.json({
      success: true,
      message: "Login erfolgreich",
      data: {
        user: {
          id: authResult.session!.userId,
          username: authResult.session!.username,
          email: authResult.session!.email,
          roles: authResult.session!.roles,
        },
        token: jwtToken,
        sessionToken: authResult.session!.sessionToken,
        expiresAt: authResult.session!.expiresAt,
      },
    });
  } catch (error) {
    // Login-API-Fehler: ${error}
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
