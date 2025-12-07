// =====================================================
// RECOVERY CODES API - LOPEZ IT WELT
// =====================================================
// 2FA Wiederherstellungscodes verwalten
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AdvancedSecurityService } from "@/lib/advanced-security-service";
import { SessionSecurityService } from "@/lib/session-security";

// GET - Anzahl verbleibender Codes
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

    if (!validation.valid || !validation.session) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    const remainingCount = await AdvancedSecurityService.getRemainingRecoveryCodeCount(
      validation.session.userId
    );

    return NextResponse.json({
      success: true,
      data: {
        remainingCodes: remainingCount,
        totalCodes: 8,
        needsRegeneration: remainingCount <= 2,
      },
    });
  } catch (error) {
    console.error("Recovery Codes GET Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}

// POST - Neue Codes generieren
export async function POST(request: NextRequest) {
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

    if (!validation.valid || !validation.session) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Neue Codes generieren
    const codes = await AdvancedSecurityService.generateRecoveryCodes(
      validation.session.userId
    );

    // WICHTIG: Diese Codes werden nur EINMAL angezeigt!
    return NextResponse.json({
      success: true,
      message: "Neue Wiederherstellungscodes generiert. WICHTIG: Diese Codes werden nur einmal angezeigt!",
      data: {
        codes,
        warning: "Speichern Sie diese Codes sicher ab. Sie werden nicht erneut angezeigt.",
      },
    });
  } catch (error) {
    console.error("Recovery Codes POST Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}















