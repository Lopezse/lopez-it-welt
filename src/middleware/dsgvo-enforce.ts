/**
 * DSGVO Enforcement Middleware - Enterprise++ Standard
 * 
 * Wird vorgeschaltet vor jede KI-Route
 * Prüft Consent, Rollen und DSGVO-Grenzen
 * 
 * Verwendung:
 * - /api/media/ai/analyze
 * - /api/admin/media/ai/*
 * - /api/ai/*
 * - /api/orchestrator/*
 */

import { NextRequest, NextResponse } from "next/server";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import { logger } from "@/lib/logger";
import { getConnection } from "@/lib/database";

/**
 * Prüft Consent für KI-Verarbeitung
 */
export async function verifyConsent(
    request: NextRequest,
    userId: string,
    purpose: "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics"
): Promise<{ valid: boolean; reason?: string }> {
    try {
        const decision = await dsgvoDecisionEngine.getAIProcessingPermission({
            userId,
            purpose
        });

        if (!decision.allowed) {
            // Audit-Log schreiben
            await logDSGVOViolation(userId, "CONSENT_CHECK_FAILED", decision.reason, request);

            return {
                valid: false,
                reason: decision.reason
            };
        }

        return { valid: true };
    } catch (error) {
        logger.error("Fehler bei Consent-Prüfung", error);
        return {
            valid: false,
            reason: "Fehler bei Consent-Prüfung"
        };
    }
}

/**
 * Prüft Benutzerrolle (RBAC)
 */
export async function verifyUserRole(
    request: NextRequest,
    userId: string,
    requiredPermission: string
): Promise<{ valid: boolean; reason?: string }> {
    try {
        // In Produktion: echte RBAC-Prüfung
        // Hier: vereinfachte Prüfung
        const connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT permissions FROM admin_users WHERE id = ?`,
            [userId]
        );

        const userData = (rows as any[])[0];
        if (!userData) {
            return {
                valid: false,
                reason: "Benutzer nicht gefunden"
            };
        }

        const permissions = JSON.parse(userData.permissions || "[]");
        if (!permissions.includes(requiredPermission)) {
            await logDSGVOViolation(userId, "RBAC_CHECK_FAILED", `Fehlende Berechtigung: ${requiredPermission}`, request);
            return {
                valid: false,
                reason: `Fehlende Berechtigung: ${requiredPermission}`
            };
        }

        return { valid: true };
    } catch (error) {
        logger.error("Fehler bei RBAC-Prüfung", error);
        return {
            valid: false,
            reason: "Fehler bei RBAC-Prüfung"
        };
    }
}

/**
 * Prüft DSGVO-Grenzen (z.B. Personenerkennung)
 */
export async function verifyDSGVOBoundaries(
    request: NextRequest,
    userId: string,
    mediaId?: string
): Promise<{ valid: boolean; reason?: string }> {
    try {
        if (!mediaId) {
            return { valid: true };
        }

        const decision = await dsgvoDecisionEngine.getAIProcessingPermission({
            userId,
            purpose: "media_ki",
            mediaId
        });

        if (!decision.allowed) {
            await logDSGVOViolation(userId, "DSGVO_BOUNDARY_VIOLATION", decision.reason, request, mediaId);
            return {
                valid: false,
                reason: decision.reason
            };
        }

        return { valid: true };
    } catch (error) {
        logger.error("Fehler bei DSGVO-Grenzen-Prüfung", error);
        return {
            valid: false,
            reason: "Fehler bei DSGVO-Grenzen-Prüfung"
        };
    }
}

/**
 * Fügt DSGVO-Kontext zu Request hinzu
 */
export function attachDSGVOContext(
    request: NextRequest,
    userId: string,
    purpose: string,
    mediaId?: string
): NextRequest {
    // Füge DSGVO-Header hinzu
    const headers = new Headers(request.headers);
    headers.set("X-DSGVO-User-Id", userId);
    headers.set("X-DSGVO-Purpose", purpose);
    if (mediaId) {
        headers.set("X-DSGVO-Media-Id", mediaId);
    }

    return new NextRequest(request.url, {
        method: request.method,
        headers,
        body: request.body
    });
}

/**
 * Haupt-Middleware-Funktion für DSGVO-Enforcement
 */
export async function dsgvoEnforceMiddleware(
    request: NextRequest,
    userId: string,
    purpose: "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics",
    requiredPermission?: string,
    mediaId?: string
): Promise<NextResponse | null> {
    // 1. Consent-Prüfung
    const consentCheck = await verifyConsent(request, userId, purpose);
    if (!consentCheck.valid) {
        return NextResponse.json(
            {
                success: false,
                message: "DSGVO-Verletzung: Consent fehlt oder ungültig",
                reason: consentCheck.reason
            },
            { status: 403 }
        );
    }

    // 2. RBAC-Prüfung (wenn erforderlich)
    if (requiredPermission) {
        const roleCheck = await verifyUserRole(request, userId, requiredPermission);
        if (!roleCheck.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "DSGVO-Verletzung: Fehlende Berechtigung",
                    reason: roleCheck.reason
                },
                { status: 403 }
            );
        }
    }

    // 3. DSGVO-Grenzen-Prüfung
    const boundaryCheck = await verifyDSGVOBoundaries(request, userId, mediaId);
    if (!boundaryCheck.valid) {
        return NextResponse.json(
            {
                success: false,
                message: "DSGVO-Verletzung: Grenzen überschritten",
                reason: boundaryCheck.reason
            },
            { status: 403 }
        );
    }

    // 4. DSGVO-Kontext anhängen
    const enhancedRequest = attachDSGVOContext(request, userId, purpose, mediaId);

    // Middleware erfolgreich - Request kann weiterverarbeitet werden
    return null;
}

/**
 * Audit-Log für DSGVO-Verletzungen
 */
async function logDSGVOViolation(
    userId: string,
    eventType: string,
    reason: string,
    request: NextRequest,
    resourceId?: string
): Promise<void> {
    try {
        const connection = await getConnection();
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined;
        const userAgent = request.headers.get("user-agent") || undefined;

        await connection.execute(
            `INSERT INTO dsgvo_audit_events 
             (user_id, event_type, action, resource_type, resource_id, data_category, details, ip_address, user_agent, result)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                eventType,
                `DSGVO-Verletzung: ${reason}`,
                "ai_processing",
                resourceId || null,
                "dsgvo_violation",
                JSON.stringify({ reason, path: request.nextUrl.pathname }),
                ipAddress,
                userAgent,
                "failure"
            ]
        );
    } catch (error) {
        logger.error("Fehler beim Schreiben des DSGVO-Violation-Audit-Logs", error);
        // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
    }
}



