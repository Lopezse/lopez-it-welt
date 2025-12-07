// =====================================================
// 2FA VERIFY API
// =====================================================
// POST /api/auth/2fa/verify
// Verifiziert 2FA Code nach Login
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { TwoFactorService } from "@/lib/customer/two-factor-service";
import { getConnection } from "@/lib/database";

// =====================================================
// RATE LIMITING für 2FA
// =====================================================

const verifyAttempts = new Map<number, { count: number; blockedUntil: number }>();

function check2FALimit(customerId: number): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const attempt = verifyAttempts.get(customerId);
  
  if (attempt && attempt.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((attempt.blockedUntil - now) / 1000) };
  }
  
  if (!attempt || attempt.blockedUntil < now) {
    verifyAttempts.set(customerId, { count: 1, blockedUntil: 0 });
    return { allowed: true };
  }
  
  attempt.count++;
  
  // Nach 5 Fehlversuchen: 15 Minuten blockieren
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 15 * 60 * 1000;
    return { allowed: false, retryAfter: 900 };
  }
  
  return { allowed: true };
}

// =====================================================
// POST - 2FA verifizieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = request.headers.get("user-agent") || undefined;

    const body = await request.json();
    const { customer_id, code } = body;

    // Validierung
    if (!customer_id || !code) {
      return NextResponse.json(
        { success: false, error: "Customer-ID und Code sind erforderlich" },
        { status: 400 }
      );
    }

    // Rate Limiting
    const rateLimit = check2FALimit(customer_id);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Zu viele Versuche. Bitte warten Sie ${Math.ceil(rateLimit.retryAfter! / 60)} Minuten.`,
          retry_after: rateLimit.retryAfter
        },
        { status: 429 }
      );
    }

    // 2FA verifizieren
    const result = await TwoFactorService.verifyTwoFactor(
      customer_id,
      code,
      ip,
      userAgent
    );

    if (!result.success) {
      // Audit-Log für fehlgeschlagene 2FA
      try {
        const pool = await getConnection();
        await pool.execute(`
          INSERT INTO lopez_audit_logs 
            (table_name, record_id, action, user_id, ip_address, new_values)
          VALUES ('lopez_customers', ?, 'LOGIN', ?, ?, ?)
        `, [customer_id, customer_id, ip, JSON.stringify({ 
          event: '2FA_FAILED',
          reason: result.error
        })]);
      } catch {
        // Ignorieren
      }
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Rate Limit zurücksetzen
    verifyAttempts.delete(customer_id);

    // Audit-Log
    try {
      const pool = await getConnection();
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (table_name, record_id, action, user_id, ip_address, new_values)
        VALUES ('lopez_customers', ?, 'LOGIN', ?, ?, ?)
      `, [customer_id, customer_id, ip, JSON.stringify({ 
        event: '2FA_SUCCESS'
      })]);
    } catch {
      // Ignorieren
    }

    // Session-Cookie setzen
    const response = NextResponse.json({
      success: true,
      message: "2FA erfolgreich verifiziert",
      data: {
        redirect: "/portal"
      }
    });

    response.cookies.set("customer_session", result.session_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("❌ 2FA Verify Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}







