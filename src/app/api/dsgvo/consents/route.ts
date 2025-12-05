/**
 * DSGVO Consents API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/consents - Alle Consents abrufen
 * POST /api/dsgvo/consents - Consent speichern
 * PUT /api/dsgvo/consents - Consent aktualisieren
 * DELETE /api/dsgvo/consents - Consent widerrufen
 */

import { NextRequest, NextResponse } from "next/server";
import { consentService, type ConsentInput, type ConsentType, type ConsentStatus } from "@/lib/dsgvo/consent-service";
import { logger } from "@/lib/logger";

/**
 * GET /api/dsgvo/consents
 * Alle Consents eines Benutzers abrufen
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("user_id");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "user_id erforderlich" },
                { status: 400 }
            );
        }

        const consents = await consentService.getUserConsents(userId);

        return NextResponse.json({
            success: true,
            data: { consents }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Consents", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Consents" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/dsgvo/consents
 * Consent speichern
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, consent_type, consent_status, consent_data, consent_version } = body;

        if (!user_id || !consent_type || !consent_status) {
            return NextResponse.json(
                { success: false, message: "user_id, consent_type und consent_status erforderlich" },
                { status: 400 }
            );
        }

        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        const consentInput: ConsentInput = {
            user_id,
            consent_type: consent_type as ConsentType,
            consent_status: consent_status as ConsentStatus,
            consent_data,
            consent_version,
            ip_address: ipAddress,
            user_agent: userAgent
        };

        const consentId = await consentService.saveConsent(consentInput);

        return NextResponse.json({
            success: true,
            data: { consent_id: consentId }
        });
    } catch (error) {
        logger.error("Fehler beim Speichern des Consents", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Speichern des Consents" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/dsgvo/consents
 * Consent aktualisieren
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, consent_type, consent_status } = body;

        if (!user_id || !consent_type || !consent_status) {
            return NextResponse.json(
                { success: false, message: "user_id, consent_type und consent_status erforderlich" },
                { status: 400 }
            );
        }

        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await consentService.updateConsent(user_id, consent_type as ConsentType, consent_status as ConsentStatus, ipAddress, userAgent);

        return NextResponse.json({
            success: true,
            message: "Consent aktualisiert"
        });
    } catch (error) {
        logger.error("Fehler beim Aktualisieren des Consents", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Aktualisieren des Consents" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/dsgvo/consents
 * Consent widerrufen
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get("user_id");
        const consent_type = searchParams.get("consent_type");

        if (!user_id || !consent_type) {
            return NextResponse.json(
                { success: false, message: "user_id und consent_type erforderlich" },
                { status: 400 }
            );
        }

        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await consentService.revokeConsent(user_id, consent_type as ConsentType, ipAddress, userAgent);

        return NextResponse.json({
            success: true,
            message: "Consent widerrufen"
        });
    } catch (error) {
        logger.error("Fehler beim Widerrufen des Consents", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Widerrufen des Consents" },
            { status: 500 }
        );
    }
}



