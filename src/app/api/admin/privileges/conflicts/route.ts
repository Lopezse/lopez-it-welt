import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/privileges/conflicts
 * 
 * Erkennt Privilegien-Konflikte (z.B. widersprüchliche Berechtigungen).
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const conflicts: any[] = [];

    // Beispiel: Prüfe auf doppelte Zuweisungen
    const [duplicates] = await connection.execute(
      `SELECT role_id, permission_id, COUNT(*) as count
       FROM lopez_core_role_permissions
       GROUP BY role_id, permission_id
       HAVING count > 1`,
    );

    if ((duplicates as any[]).length > 0) {
      (duplicates as any[]).forEach((dup) => {
        conflicts.push({
          type: "duplicate_assignment",
          severity: "warning",
          message: `Privileg ${dup.permission_id} ist mehrfach der Rolle ${dup.role_id} zugewiesen`,
          role_id: dup.role_id,
          permission_id: dup.permission_id,
        });
      });
    }

    // Beispiel: Prüfe auf inaktive Rollen mit aktiven Privilegien
    const [inactiveRoles] = await connection.execute(
      `SELECT DISTINCT r.id, r.role_name
       FROM lopez_core_roles r
       JOIN lopez_core_role_permissions rp ON r.id = rp.role_id
       WHERE r.is_active = FALSE`,
    );

    if ((inactiveRoles as any[]).length > 0) {
      (inactiveRoles as any[]).forEach((role) => {
        conflicts.push({
          type: "inactive_role_with_permissions",
          severity: "info",
          message: `Inaktive Rolle "${role.role_name}" hat noch zugewiesene Privilegien`,
          role_id: role.id,
        });
      });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        conflicts: conflicts,
        count: conflicts.length,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Erkennen von Privilegien-Konflikten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erkennen von Konflikten" },
      { status: 500 },
    );
  }
}


