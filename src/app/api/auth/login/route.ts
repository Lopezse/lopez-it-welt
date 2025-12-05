// =====================================================
// KUNDEN LOGIN API
// =====================================================
// POST /api/auth/login
// Enterprise++ Login mit Rate-Limiting und 2FA Support
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";

// =====================================================
// RATE LIMITING
// =====================================================

const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

function checkLoginRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (attempt && attempt.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((attempt.blockedUntil - now) / 1000) };
  }
  
  if (!attempt || attempt.blockedUntil < now) {
    loginAttempts.set(identifier, { count: 1, blockedUntil: 0 });
    return { allowed: true };
  }
  
  attempt.count++;
  
  // Nach 5 Fehlversuchen: 5 Minuten blockieren
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 5 * 60 * 1000;
    return { allowed: false, retryAfter: 300 };
  }
  
  return { allowed: true };
}

function resetLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

// =====================================================
// POST - Login
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = request.headers.get("user-agent") || undefined;
    
    // Body parsen
    const body = await request.json();
    const { email, password } = body;

    // Validierung
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // Rate Limiting prüfen (per IP + Email Kombination)
    const rateLimitKey = `${ip}:${email.toLowerCase()}`;
    const rateLimit = checkLoginRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Zu viele Anmeldeversuche. Bitte warten Sie ${rateLimit.retryAfter} Sekunden.`,
          retry_after: rateLimit.retryAfter
        },
        { status: 429 }
      );
    }

    // Login durchführen
    const result = await CustomerAuthService.login(
      { email, password },
      ip,
      userAgent
    );

    if (!result.success) {
      // Audit-Log für fehlgeschlagenen Login
      try {
        const pool = await getConnection();
        await pool.execute(`
          INSERT INTO lopez_audit_logs 
            (table_name, record_id, action, user_id, ip_address, new_values)
          VALUES ('lopez_customers', 0, 'LOGIN', 0, ?, ?)
        `, [ip, JSON.stringify({ 
          email, 
          event: 'LOGIN_FAILED', 
          reason: result.error 
        })]);
      } catch {
        // Audit-Fehler ignorieren
      }
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Rate Limit zurücksetzen bei erfolgreichem Login
    resetLoginAttempts(rateLimitKey);

    // 2FA erforderlich?
    if (result.requires_2fa) {
      return NextResponse.json({
        success: true,
        requires_2fa: true,
        customer_id: result.customer_id,
        message: "Bitte geben Sie Ihren 2FA-Code ein"
      });
    }

    // Audit-Log für erfolgreichen Login
    try {
      const pool = await getConnection();
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (table_name, record_id, action, user_id, ip_address, new_values)
        VALUES ('lopez_customers', ?, 'LOGIN', ?, ?, ?)
      `, [
        result.customer_id, 
        result.customer_id, 
        ip, 
        JSON.stringify({ event: 'LOGIN_SUCCESS' })
      ]);
    } catch {
      // Audit-Fehler ignorieren
    }

    // Session-Cookie setzen
    const response = NextResponse.json({
      success: true,
      message: "Anmeldung erfolgreich",
      data: {
        customer_id: result.customer_id,
        redirect: "/portal"
      }
    });

    // HttpOnly Cookie für Session
    response.cookies.set("customer_session", result.session_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 Tage
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("❌ Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
