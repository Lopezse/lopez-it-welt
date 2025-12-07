/**
 * Orchestrator Alert Detail API - Enterprise++ Standard P8-C
 * 
 * GET /api/orchestrator/alerts/[id] - Alert-Detail abrufen
 * 
 * RBAC: security.view
 */

import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/ki-orchestrator/level2";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";

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

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            user_id: session.userId,
            resource: "security",
            action: "view"
        });

        if (!hasPermission) {
            return NextResponse.json(
                { success: false, message: "Keine Berechtigung für security.view" },
                { status: 403 }
            );
        }

        const alert = await alertEngine.getAlert(params.id);

        if (!alert) {
            return NextResponse.json(
                { success: false, message: "Alert nicht gefunden" },
                { status: 404 }
            );
        }

        // Sanitize payload before returning (DSGVO compliance)
        if (alert.payload && typeof alert.payload === "object") {
            alert.payload = sanitizePayload(alert.payload as Record<string, unknown>);
        }

        return NextResponse.json({
            success: true,
            data: alert,
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Alert-Details", error);
        return NextResponse.json(
            { success: false, message: "Interner Serverfehler" },
            { status: 500 }
        );
    }
}

