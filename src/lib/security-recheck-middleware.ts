// =====================================================
// SECURITY RECHECK MIDDLEWARE - ENTERPRISE++
// =====================================================
// Erstellt: 2025-12-03
// Zweck: Backend-Prüfung für Recheck-Token bei kritischen APIs
// Standard: SAP/IBM/Siemens Security Level
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { validateRecheckToken, getRecheckTokenData } from "@/app/api/admin/security/recheck/route";

// =====================================================
// TYPES
// =====================================================

export interface RecheckValidationResult {
  valid: boolean;
  userId?: number;
  error?: string;
}

// =====================================================
// RECHECK REQUIRED RESPONSE
// =====================================================

export function securityRecheckRequiredResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: "SECURITY_RECHECK_REQUIRED",
      message: message || "Bitte bestätige dein Passwort, um diese Aktion auszuführen.",
    },
    { status: 403 }
  );
}

export function securityRecheckExpiredResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: "SECURITY_RECHECK_EXPIRED",
      message: "Deine Freigabe ist abgelaufen. Bitte erneut bestätigen.",
    },
    { status: 403 }
  );
}

// =====================================================
// VALIDATE RECHECK TOKEN (DIREKT)
// =====================================================

export function validateRecheckFromRequest(
  request: NextRequest
): RecheckValidationResult {
  // Token aus Header oder Query-Parameter holen
  const recheckToken =
    request.headers.get("x-security-recheck-token") ||
    request.nextUrl.searchParams.get("recheck_token");

  if (!recheckToken) {
    return {
      valid: false,
      error: "Recheck-Token fehlt",
    };
  }

  // Direkte Token-Validierung (ohne HTTP-Aufruf)
  const tokenData = getRecheckTokenData(recheckToken);
  
  if (!tokenData) {
    return {
      valid: false,
      error: "Token ungültig oder abgelaufen",
    };
  }

  return {
    valid: true,
    userId: tokenData.userId,
  };
}

// =====================================================
// MIDDLEWARE WRAPPER FOR API ROUTES
// =====================================================

type ApiHandler = (request: NextRequest, context?: any) => Promise<NextResponse>;

export function withSecurityRecheck(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const validation = await validateRecheckFromRequest(request);

    if (!validation.valid) {
      return securityRecheckRequiredResponse(validation.error);
    }

    // Handler ausführen
    return handler(request, context);
  };
}

// =====================================================
// HELPER: Check if request has valid recheck
// =====================================================

export async function hasValidRecheck(request: NextRequest): Promise<boolean> {
  const validation = await validateRecheckFromRequest(request);
  return validation.valid;
}

// =====================================================
// CLIENT-SIDE HELPER (für fetch calls)
// =====================================================

export function getRecheckHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  
  const token = sessionStorage.getItem("security_recheck_token");
  if (!token) return {};
  
  return {
    "x-security-recheck-token": token,
  };
}

