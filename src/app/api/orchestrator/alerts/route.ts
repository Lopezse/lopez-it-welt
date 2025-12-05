/**
 * Orchestrator Alerts API - Enterprise++ Standard P8-C
 * 
 * GET /api/orchestrator/alerts - Liste aller Alerts
 * POST /api/orchestrator/alerts - Neuen Alert erstellen (nur System)
 * 
 * RBAC: security.view (GET), system.* (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { AlertData, Alert } from "@/lib/ki-orchestrator/level2/types";

/**
 * Sanitizes payload to remove personal data (DSGVO compliance)
 */
function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const pdFields = ["user_id", "email", "phone", "name", "address", "ip_address", "session_id"];

    for (const [key, value] of Object.entries(payload)) {
        if (pdFields.includes(key.toLowerCase())) {
            // Pseudonymize instead of removing
            sanitized[key] = `[REDACTED]`;
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * GET /api/orchestrator/alerts
 */
export async function GET(request: NextRequest) {
    try {
        // Authentifizierung
        const sessionToken =
            request.headers.get("authorization")?.replace("Bearer ", "") ||
            request.cookies.get("adm_session")?.value;

        if (!sessionToken) {
            return NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        const session = await AdminAuthService.validateSession(sessionToken);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Ungültige Session" },
                { status: 401 }
            );
        }

        // RBAC-Prüfung
        const hasPermission = await RBACService.checkPermission({
            user_id: session.userId.toString(),
            resource: "security",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.view" },
                { status: 403 }
            );
        }

        // Filter aus Query-Parametern
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const severity = searchParams.get("severity");
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "100");
        const offset = parseInt(searchParams.get("offset") || "0");

        const result = await alertEngine.listAlerts({
            status: status || undefined,
            severity: severity || undefined,
            category: category || undefined,
            limit: Math.min(limit, 1000),
            offset,
        });

        // Sanitize payloads before returning (DSGVO compliance)
        const sanitizedAlerts = result.alerts.map((alert: Alert) => {
            if (alert.payload && typeof alert.payload === "object") {
                return {
                    ...alert,
                    payload: sanitizePayload(alert.payload as Record<string, unknown>),
                };
            }
            return alert;
        });

        return NextResponse.json({
            success: true,
            data: {
                alerts: sanitizedAlerts,
                total: result.total,
                limit,
                offset,
            },
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Alerts", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orchestrator/alerts
 * Nur für System-Interne Verwendung
 */
export async function POST(request: NextRequest) {
    try {
        // System-Interne Authentifizierung prüfen
        const systemToken = request.headers.get("x-system-token");
        if (systemToken !== process.env.SYSTEM_INTERNAL_TOKEN) {
            return NextResponse.json(
                { success: false, message: "Nur für System-Interne Verwendung" },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Validierung
        if (!body.alert_rule_id || !body.category || !body.severity || !body.title) {
            return NextResponse.json(
                { success: false, message: "alert_rule_id, category, severity und title sind erforderlich" },
                { status: 400 }
            );
        }

        const alertData: AlertData = {
            alert_rule_id: body.alert_rule_id,
            category: body.category,
            severity: body.severity,
            title: body.title,
            description: body.description,
            payload: body.payload,
            event_type: body.event_type,
            resource_type: body.resource_type,
            resource_id: body.resource_id,
        };

        const alertId = await alertEngine.createAlert(alertData);

        return NextResponse.json({
            success: true,
            data: {
                id: alertId,
                status: "open",
                triggered_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        logger.error("Fehler beim Erstellen des Alerts", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}

