/**
 * DSGVO Consent Check API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/consents/check - Prüft, ob Consent vorhanden und aktiv ist
 */

import { NextRequest, NextResponse } from "next/server";
import { consentService, type ConsentType } from "@/lib/dsgvo/consent-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/consents/check
 * Prüft, ob Consent vorhanden und aktiv ist
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("user_id");
        const consentType = searchParams.get("consent_type");

        if (!userId || !consentType) {
            return NextResponse.json(
                { success: false, message: "user_id und consent_type erforderlich" },
                { status: 400 }
            );
        }

        const hasConsent = await consentService.hasConsent(userId, consentType as ConsentType);

        return NextResponse.json({
            success: true,
            data: { has_consent: hasConsent }
        });
    } catch (error) {
        logger.error("Fehler beim Prüfen des Consents", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Prüfen des Consents" },
            { status: 500 }
        );
    }
}



