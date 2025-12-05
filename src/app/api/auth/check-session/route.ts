// =====================================================
// SESSION CHECK API - LOPEZ IT WELT (ENTERPRISE++)
// =====================================================
// Prüft ob eine gültige Admin-Session existiert
// Mit vollständiger DB-Validierung, Timeout, IP-Binding
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { SessionSecurityService } from "@/lib/session-security";
import { AuditService } from "@/lib/audit-service";

export async function POST(request: NextRequest) {
  try {
    // Cookies aus Request lesen
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    
    // Client-Info extrahieren
    const clientIp = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    console.log("🔍 Enterprise++ Session-Check:", {
      hasSession: !!sessionToken,
      hasToken: !!jwtToken,
      clientIp: clientIp.substring(0, 20),
    });

    // Enterprise++ Session-Validierung (DB + Timeout + IP)
    const validation = await SessionSecurityService.validateSession(
      sessionToken,
      jwtToken,
      clientIp,
      userAgent
    );

    if (!validation.valid) {
      console.log(`🔒 Session ungültig: ${validation.errorCode} - ${validation.error}`);
      
      return NextResponse.json({
        success: false,
        message: validation.error || "Session ungültig",
        errorCode: validation.errorCode,
      }, { status: 401 });
    }

    // Session gültig - Audit-Log (nur bei wichtigen Routen, nicht bei jedem Check)
    const referer = request.headers.get("referer") || "";
    const isImportantRoute = referer.includes("/admin/settings") || 
                             referer.includes("/admin/users") ||
                             referer.includes("/admin/system");
    
    if (isImportantRoute && validation.session) {
      try {
        await AuditService.logAudit({
          table_name: "lopez_sessions",
          record_id: validation.session.userId,
          action: "SESSION_ACCESS",
          user_id: validation.session.userId,
          username: validation.session.username,
          ip_address: clientIp,
          user_agent: userAgent,
          session_id: sessionToken || "jwt",
          risk_level: "LOW",
          compliance_category: "ACCESS",
          new_values: JSON.stringify({
            route: referer,
            roles: validation.session.roles,
          }),
        });
      } catch (auditError) {
        // Audit-Fehler ignorieren
      }
    }
    
    console.log(`✅ Session gültig für: ${validation.session?.username}`);
    
    return NextResponse.json({
      success: true,
      message: "Session gültig",
      user: {
        id: validation.session?.userId,
        username: validation.session?.username,
        email: validation.session?.email,
        roles: validation.session?.roles,
      },
      session: {
        expiresAt: validation.session?.expiresAt,
        lastActivity: validation.session?.lastActivityAt,
      },
    });

  } catch (error) {
    console.error("❌ Session-Check Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Interner Fehler bei Session-Prüfung",
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

