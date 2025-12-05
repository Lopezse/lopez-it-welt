// =====================================================
// KUNDEN REGISTRIERUNG API
// =====================================================
// POST /api/auth/register
// Enterprise++ Registrierung mit Rate-Limiting
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { CustomerEmailService } from "@/lib/customer/email-service";
import { getConnection } from "@/lib/database";

// =====================================================
// RATE LIMITING (In-Memory für DEV)
// =====================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || limit.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 }); // 1 Minute
    return true;
  }
  
  if (limit.count >= 5) { // Max 5 Registrierungen pro Minute pro IP
    return false;
  }
  
  limit.count++;
  return true;
}

// =====================================================
// POST - Registrierung
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Zu viele Anfragen. Bitte warten Sie eine Minute." },
        { status: 429 }
      );
    }

    // Body parsen
    const body = await request.json();
    
    const { 
      email, 
      password, 
      password_confirm,
      first_name, 
      last_name, 
      company_name,
      dsgvo_consent,
      marketing_consent 
    } = body;

    // -------------------------------------------------
    // VALIDIERUNG
    // -------------------------------------------------

    // Pflichtfelder
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // Passwort-Bestätigung
    if (password !== password_confirm) {
      return NextResponse.json(
        { success: false, error: "Passwörter stimmen nicht überein" },
        { status: 400 }
      );
    }

    // Passwort-Stärke
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Passwort muss mindestens 8 Zeichen haben" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Passwort muss mindestens einen Großbuchstaben enthalten" },
        { status: 400 }
      );
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Passwort muss mindestens eine Zahl enthalten" },
        { status: 400 }
      );
    }

    // DSGVO
    if (!dsgvo_consent) {
      return NextResponse.json(
        { success: false, error: "DSGVO-Einwilligung ist erforderlich" },
        { status: 400 }
      );
    }

    // -------------------------------------------------
    // REGISTRIERUNG
    // -------------------------------------------------

    const result = await CustomerAuthService.register({
      email,
      password,
      first_name,
      last_name,
      company_name,
      dsgvo_consent: true,
      marketing_consent: marketing_consent || false
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // -------------------------------------------------
    // VERIFIZIERUNGS-E-MAIL SENDEN
    // -------------------------------------------------

    if (result.verification_token) {
      await CustomerEmailService.sendVerificationEmail(
        email,
        result.verification_token,
        first_name || "Kunde"
      );
    }

    // -------------------------------------------------
    // AUDIT LOG (angepasst an lopez_audit_logs Struktur)
    // -------------------------------------------------

    try {
      const pool = await getConnection();
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (table_name, record_id, action, user_id, ip_address, new_values)
        VALUES ('lopez_customers', ?, 'INSERT', ?, ?, ?)
      `, [
        result.customer_id,
        result.customer_id,
        ip,
        JSON.stringify({ email, has_company: !!company_name, event: 'CUSTOMER_REGISTERED' })
      ]);
    } catch (auditError) {
      // Audit-Fehler nicht blockierend - nur loggen
      console.warn("Audit Log Warnung:", auditError);
    }

    // -------------------------------------------------
    // ERFOLG
    // -------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Registrierung erfolgreich! Bitte prüfen Sie Ihre E-Mails zur Verifizierung.",
      data: {
        customer_id: result.customer_id,
        email_sent: true,
        next_step: "verify_email"
      }
    });

  } catch (error) {
    console.error("❌ Register API Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
