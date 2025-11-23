import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// Datenbankverbindung
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Zone-Definitionen
export const ZONES = {
  ADMIN: "admin",
  SHOP: "shop",
} as const;

// Admin-Rollen (dürfen in Admin-Bereich)
const ADMIN_ROLES = ["super_admin", "admin", "editor", "support", "technician", "office"];

// Shop-Rollen (dürfen in Shop-Bereich)
const SHOP_ROLES = [
  "customer",
  "premium_customer",
  "super_admin", // Admins können auch in Shop
  "admin",
  "editor",
  "support",
  "technician",
  "office",
];

// JWT-Token verifizieren (vereinfacht für Demo)
function verifyToken(token: string): any {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    // Token-Ablauf prüfen
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

// Benutzer-Berechtigungen aus Datenbank laden
async function getUserPermissions(userId: string, roleId: number): Promise<string[]> {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Rollen-Berechtigungen
    const [rolePermissions] = await connection.execute(
      `
            SELECT p.permission_key
            FROM lopez_core_permissions p
            INNER JOIN lopez_core_role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ? AND p.is_active = TRUE
        `,
      [roleId],
    );

    // Direkte Benutzer-Berechtigungen
    const [userPermissions] = await connection.execute(
      `
            SELECT p.permission_key
            FROM lopez_core_permissions p
            INNER JOIN lopez_core_user_permissions up ON p.id = up.permission_id
            WHERE up.user_id = ? AND up.is_active = TRUE 
            AND (up.expires_at IS NULL OR up.expires_at > NOW())
        `,
      [userId],
    );

    await connection.end();

    const permissions = [
      ...(rolePermissions as any[]).map((p) => p.permission_key),
      ...(userPermissions as any[]).map((p) => p.permission_key),
    ];

    return [...new Set(permissions)]; // Duplikate entfernen
  } catch (error) {
    console.error("Fehler beim Laden der Berechtigungen:", error);
    return [];
  }
}

// Zone-Zugriff prüfen
function checkZoneAccess(userRole: string, zone: string): boolean {
  if (zone === ZONES.ADMIN) {
    return ADMIN_ROLES.includes(userRole);
  } else if (zone === ZONES.SHOP) {
    return SHOP_ROLES.includes(userRole);
  }
  return false;
}

// Berechtigung prüfen
function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

// RBAC-Middleware für API-Routen
export function withRBAC(zone: string, requiredPermission?: string) {
  return function (handler: Function) {
    return async function (request: NextRequest) {
      try {
        // Token aus Header extrahieren
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return NextResponse.json(
            { success: false, message: "Authentifizierung erforderlich" },
            { status: 401 },
          );
        }

        const token = authHeader.substring(7);
        const user = verifyToken(token);

        if (!user) {
          return NextResponse.json(
            { success: false, message: "Ungültiger oder abgelaufener Token" },
            { status: 401 },
          );
        }

        // Zone-Zugriff prüfen
        if (!checkZoneAccess(user.role, zone)) {
          return NextResponse.json(
            {
              success: false,
              message: "Zugriff auf diesen Bereich nicht erlaubt",
            },
            { status: 403 },
          );
        }

        // Spezifische Berechtigung prüfen (falls erforderlich)
        if (requiredPermission) {
          const userPermissions = await getUserPermissions(user.sub, user.role_id);

          if (!hasPermission(userPermissions, requiredPermission)) {
            return NextResponse.json(
              {
                success: false,
                message: "Keine Berechtigung für diese Aktion",
              },
              { status: 403 },
            );
          }
        }

        // User-Info an Request anhängen
        (request as any).user = user;

        return handler(request);
      } catch (error) {
        console.error("RBAC-Middleware Fehler:", error);
        return NextResponse.json(
          { success: false, message: "Authentifizierungsfehler" },
          { status: 500 },
        );
      }
    };
  };
}

// Admin-Bereich Middleware
export function withAdminAccess(requiredPermission?: string) {
  return withRBAC(ZONES.ADMIN, requiredPermission);
}

// Shop-Bereich Middleware
export function withShopAccess(requiredPermission?: string) {
  return withRBAC(ZONES.SHOP, requiredPermission);
}

// Berechtigungs-Checker für Frontend
export class PermissionChecker {
  static async checkPermission(
    userId: string,
    roleId: number,
    permission: string,
  ): Promise<boolean> {
    const permissions = await getUserPermissions(userId, roleId);
    return hasPermission(permissions, permission);
  }

  static async checkZoneAccess(userRole: string, zone: string): Promise<boolean> {
    return checkZoneAccess(userRole, zone);
  }

  static async getUserPermissions(userId: string, roleId: number): Promise<string[]> {
    return getUserPermissions(userId, roleId);
  }
}

// Utility-Funktionen
export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isShopRole(role: string): boolean {
  return SHOP_ROLES.includes(role);
}

export function canAccessAdmin(role: string): boolean {
  return isAdminRole(role);
}

export function canAccessShop(role: string): boolean {
  return isShopRole(role);
}

// Zone-spezifische Redirects
export function getRedirectUrl(userRole: string): string {
  if (canAccessAdmin(userRole)) {
    return "/admin";
  } else if (canAccessShop(userRole)) {
    return "/shop";
  } else {
    return "/login";
  }
}
