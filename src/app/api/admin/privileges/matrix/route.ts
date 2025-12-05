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
 * GET /api/admin/privileges/matrix
 * 
 * Gibt die Privilegien-Matrix zurück (Welche Rolle hat welche Privilegien).
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Alle Rollen laden
    const [roles] = await connection.execute(
      `SELECT id, role_name, role_code FROM lopez_core_roles WHERE is_active = TRUE ORDER BY role_name`,
    );

    // Alle Privilegien laden
    const [permissions] = await connection.execute(
      `SELECT id, permission_key, permission_name, category, resource, action
       FROM lopez_core_permissions
       ORDER BY category, resource, action`,
    );

    // Zuweisungen laden
    const [assignments] = await connection.execute(
      `SELECT role_id, permission_id FROM lopez_core_role_permissions`,
    );

    await connection.end();

    // Matrix aufbauen
    const matrix: Record<string, Record<string, boolean>> = {};

    (roles as any[]).forEach((role) => {
      matrix[role.id] = {};
      (permissions as any[]).forEach((perm) => {
        const isAssigned = (assignments as any[]).some(
          (a) => a.role_id === role.id && a.permission_id === perm.id,
        );
        matrix[role.id][perm.id] = isAssigned;
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        roles: roles,
        permissions: permissions,
        matrix: matrix,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Privilegien-Matrix", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Privilegien-Matrix" },
      { status: 500 },
    );
  }
}


