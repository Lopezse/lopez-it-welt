// =====================================================
// E-MAIL VERIFIZIERUNG API
// =====================================================
// GET/POST /api/auth/verify-email
// Verifiziert E-Mail-Adresse mit Token
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { CustomerEmailService } from "@/lib/customer/email-service";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// GET - Token aus URL Parameter
// =====================================================

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token fehlt" },
      { status: 400 }
    );
  }
  
  return verifyToken(token);
}

// =====================================================
// POST - Token aus Body
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token fehlt" },
        { status: 400 }
      );
    }
    
    return verifyToken(token);
    
  } catch {
    return NextResponse.json(
      { success: false, error: "Ungültige Anfrage" },
      { status: 400 }
    );
  }
}

// =====================================================
// VERIFIZIERUNG LOGIK
// =====================================================

async function verifyToken(token: string) {
  try {
    const pool = await getConnection();
    
    // Token-Daten laden (für Willkommens-E-Mail)
    const [tokenData] = await pool.execute<RowDataPacket[]>(`
      SELECT t.customer_id, c.email, c.first_name
      FROM lopez_customer_email_tokens t
      JOIN lopez_customers c ON t.customer_id = c.id
      WHERE t.token = ? AND t.type = 'verify_email'
    `, [token]);
    
    // Verifizierung durchführen
    const result = await CustomerAuthService.verifyEmail(token);
    
    if (!result.success) {
      // Audit-Log für fehlgeschlagene Verifizierung
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (user_id, action, entity_type, details)
        VALUES (0, 'EMAIL_VERIFY_FAILED', 'customer', ?)
      `, [JSON.stringify({ token: token.substring(0, 8) + "...", error: result.error })]);
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    // Willkommens-E-Mail senden
    if (tokenData.length > 0) {
      const customer = tokenData[0];
      await CustomerEmailService.sendWelcomeEmail(
        customer.email,
        customer.first_name || "Kunde"
      );
      
      // Audit-Log
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'EMAIL_VERIFIED', 'customer', ?, ?)
      `, [
        customer.customer_id,
        customer.customer_id,
        JSON.stringify({ email: customer.email })
      ]);
    }
    
    return NextResponse.json({
      success: true,
      message: "E-Mail-Adresse erfolgreich verifiziert!",
      data: {
        verified: true,
        next_step: "login",
        redirect: "/login?verified=true"
      }
    });
    
  } catch (error) {
    console.error("❌ Verify Email Error:", error);
    return NextResponse.json(
      { success: false, error: "Verifizierung fehlgeschlagen" },
      { status: 500 }
    );
  }
}







