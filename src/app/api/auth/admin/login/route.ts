// =====================================================
// ADMIN LOGIN API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Admin-Authentifizierung (Username ODER Email + 2FA Pflicht)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Admin-Login
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Development Mode: Authentication umgehen
    if (DevelopmentMode.shouldBypassAuth()) {
      const mockResponse = DevelopmentMode.createLoginResponse();
      return NextResponse.json(mockResponse);
    }

    const body = await request.json();
    const { identifier, password, twoFactorToken } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Benutzername/E-Mail und Passwort erforderlich" },
        { status: 400 },
      );
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const route = request.nextUrl.pathname;

    // Login durchführen
    let authResult;
    try {
      authResult = await AdminAuthService.login(
        { identifier, password, twoFactorToken },
        ipAddress,
        userAgent,
      );
    } catch (loginError: any) {
      console.error("❌ Login-Fehler in AdminAuthService:", loginError);
      return NextResponse.json(
        {
          success: false,
          message: process.env.NODE_ENV === "development" 
            ? `Login-Fehler: ${loginError.message || String(loginError)}`
            : "Interner Serverfehler",
          error: process.env.NODE_ENV === "development" ? {
            message: loginError.message || String(loginError),
            stack: loginError.stack,
          } : undefined,
        },
        { status: 500 },
      );
    }

    if (!authResult.success) {
      // In Development: Detaillierte Fehlermeldung
      const errorMessage = process.env.NODE_ENV === "development"
        ? `${authResult.message} (Identifier: ${identifier})`
        : authResult.message;

      // Audit-Log für fehlgeschlagenen Login (nur wenn nicht kritischer Fehler)
      try {
        await AuditService.logAudit({
          table_name: "lopez_users",
          record_id: 0,
          action: "LOGIN",
          user_id: 0,
          username: identifier,
          ip_address: ipAddress,
          user_agent: userAgent,
          session_id: undefined,
          risk_level: "MEDIUM",
          compliance_category: "AUTHENTICATION",
          new_values: JSON.stringify({
            realm: "ADMIN",
            result: "failed",
            reason: authResult.message,
            route,
          }),
        });
      } catch (auditError) {
        console.warn("⚠️ Audit-Log fehlgeschlagen:", auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          requires2FA: authResult.requires2FA,
          lockoutUntil: authResult.lockoutUntil,
          debug: process.env.NODE_ENV === "development" ? {
            identifier,
            hasPassword: !!password,
            passwordLength: password?.length || 0,
          } : undefined,
        },
        { status: 401 },
      );
    }

    // JWT-Token generieren
    const jwtToken = AdminAuthService.generateJWT(authResult.session!);

    // Cookie setzen (mit adm_ Präfix)
    const response = NextResponse.json({
      success: true,
      message: authResult.requires2FASetup 
        ? "Login erfolgreich. Bitte 2FA einrichten." 
        : "Login erfolgreich",
      requires2FASetup: authResult.requires2FASetup || false, // WICHTIG: Flag an Frontend weitergeben!
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

    // Cookie mit adm_ Präfix setzen (Enterprise++ Standard: 7 Tage)
    const sessionToken = authResult.session!.sessionToken;
    console.log("🍪 Setze Cookies:", {
      adm_session: `${sessionToken.substring(0, 20)}...`,
      adm_token: `${jwtToken.substring(0, 20)}...`,
    });

    response.cookies.set("adm_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 Tage (Enterprise++ Standard)
      path: "/",
    });

    response.cookies.set("adm_token", jwtToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 Tage (Enterprise++ Standard)
      path: "/",
    });

    console.log("✅ Cookies gesetzt, Response wird zurückgegeben");

    // Audit-Log für erfolgreichen Login
    await AuditService.logAudit({
      table_name: "lopez_users",
      record_id: authResult.session!.userId,
      action: "LOGIN",
      user_id: authResult.session!.userId,
      username: authResult.session!.username,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: authResult.session!.sessionToken,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
      new_values: JSON.stringify({
        realm: "ADMIN",
        result: "success",
        route,
      }),
    });

    // Automatische Zeiterfassung nach Admin-Login starten
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
      
      const activeSession = sessions.find(
        (s) => s.user_id === authResult.session!.userId && s.status === "active" && !s.end_time
      );
      
      if (!activeSession) {
        const now = new Date().toISOString();
        const maxId = sessions.length > 0 ? Math.max(...sessions.map((s: any) => s.id || 0)) : 0;
        
        const newSession = {
          id: maxId + 1,
          user_id: authResult.session!.userId,
          module: "Login-Session",
          taetigkeit: `System-Login: ${authResult.session!.username}`,
          ausloeser: "Automatische Zeiterfassung nach erfolgreichem Admin-Login",
          problem: false,
          category: "administration",
          priority: "high",
          project_id: null,
          task_id: null,
          start_time: now,
          status: "active",
          created_at: now,
          updated_at: now,
        };
        
        sessions.push(newSession);
        
        const dir = path.dirname(SESSIONS_FILE);
        await fs.mkdir(dir, { recursive: true });
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
            realm: "ADMIN",
          }),
          user_id: authResult.session!.userId,
          username: authResult.session!.username,
          ip_address: ipAddress,
          user_agent: userAgent,
          session_id: authResult.session!.sessionToken,
          risk_level: "LOW",
          compliance_category: "DATA_MODIFICATION",
        });
      }
    } catch (timeTrackingError) {
      console.warn("⚠️ Automatische Zeiterfassung nach Admin-Login fehlgeschlagen:", timeTrackingError);
    }

    return response;
  } catch (error) {
    console.error("❌ Admin Login API Fehler:", error);
    // Detaillierte Fehler-Logging für Debugging
    if (error instanceof Error) {
      console.error("Fehler-Details:", error.message);
      console.error("Stack:", error.stack);
    }
    
    // In Development: Detaillierte Fehlermeldung anzeigen
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error instanceof Error ? error.message : String(error))
      : "Interner Serverfehler";
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        } : undefined
      }, 
      { status: 500 }
    );
  }
}
