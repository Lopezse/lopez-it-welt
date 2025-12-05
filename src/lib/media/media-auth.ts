/**
 * Media Authentication Helper - Enterprise++ Standard
 * 
 * Wrapper für Admin-Authentifizierung in Media-Routes
 * - Session-Validierung
 * - RBAC/ABAC-Prüfung
 * - User-Info-Extraktion
 */

import { AdminAuthService, AdminSessionData } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { NextRequest, NextResponse } from "next/server";

export interface MediaAuthResult {
    success: boolean;
    session?: AdminSessionData;
    user?: any;
    error?: NextResponse;
}

/**
 * Validiert Admin-Session für Media-Routes
 * @returns MediaAuthResult mit Session-Info oder Error-Response
 */
export async function validateMediaAuth(request: NextRequest): Promise<MediaAuthResult> {
    try {
        // Session-Token aus Header oder Cookie extrahieren
        const sessionToken =
            request.headers.get("authorization")?.replace("Bearer ", "") ||
            request.cookies.get("adm_session")?.value;

        if (!sessionToken) {
            return {
                success: false,
                error: NextResponse.json(
                    { success: false, message: "Nicht authentifiziert" },
                    { status: 401 }
                ),
            };
        }

        // Session validieren
        const session = await AdminAuthService.validateSession(sessionToken);
        if (!session) {
            return {
                success: false,
                error: NextResponse.json(
                    { success: false, message: "Ungültige oder abgelaufene Session" },
                    { status: 401 }
                ),
            };
        }

        // Benutzer-Daten laden
        const user = await RBACService.getUserById(session.userId);
        if (!user) {
            return {
                success: false,
                error: NextResponse.json(
                    { success: false, message: "Benutzer nicht gefunden" },
                    { status: 404 }
                ),
            };
        }

        // Rollen und Berechtigungen laden
        const roles = await RBACService.getUserRoles(session.userId);

        // Berechtigungen aus Rollen sammeln
        const permissions: string[] = [];
        for (const role of roles) {
            const rolePermissions = await RBACService.getRolePermissions(role.id!);
            permissions.push(...rolePermissions.map((p) => `${p.resource}.${p.action}`));
        }

        // Session-Daten erweitern
        const extendedSession: AdminSessionData = {
            ...session,
            roles: roles.map((r) => r.name),
            permissions: [...new Set(permissions)], // Duplikate entfernen
        };

        return {
            success: true,
            session: extendedSession,
            user,
        };
    } catch (error) {
        console.error("❌ Media Auth Fehler:", error);
        return {
            success: false,
            error: NextResponse.json(
                { success: false, message: "Authentifizierungsfehler" },
                { status: 500 }
            ),
        };
    }
}

/**
 * Prüft ob User eine spezifische Permission hat
 */
export function hasMediaPermission(
    permissions: string[],
    requiredPermission: string
): boolean {
    // Admin hat alle Rechte
    if (permissions.includes("*") || permissions.includes("admin.*")) {
        return true;
    }

    // Spezifische Permission prüfen
    return permissions.includes(requiredPermission) || permissions.includes(`media.${requiredPermission}`);
}

/**
 * Media-spezifische Permissions
 */
export const MEDIA_PERMISSIONS = {
    UPLOAD: "media.upload",
    VIEW: "media.view",
    DELETE: "media.delete",
    MANAGE: "media.manage",
} as const;

