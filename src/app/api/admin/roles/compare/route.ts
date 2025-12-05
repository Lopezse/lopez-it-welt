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
 * POST /api/admin/roles/compare
 * 
 * Vergleicht zwei Rollen und gibt die Unterschiede zurück.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role_id_1, role_id_2 } = body;

    if (!role_id_1 || !role_id_2) {
      return NextResponse.json(
        { success: false, message: "Beide Rollen-IDs sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Rollen laden
    const [roles1] = await connection.execute(
      `SELECT id, role_name, role_code, role_description 
       FROM lopez_core_roles 
       WHERE id = ?`,
      [role_id_1],
    );

    const [roles2] = await connection.execute(
      `SELECT id, role_name, role_code, role_description 
       FROM lopez_core_roles 
       WHERE id = ?`,
      [role_id_2],
    );

    if ((roles1 as any[]).length === 0 || (roles2 as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Eine oder beide Rollen nicht gefunden" },
        { status: 404 },
      );
    }

    const role1 = (roles1 as any[])[0];
    const role2 = (roles2 as any[])[0];

    // Berechtigungen laden
    const [permissions1] = await connection.execute(
      `SELECT p.permission_key, p.permission_name, p.category
       FROM lopez_core_role_permissions rp
       JOIN lopez_core_permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [role_id_1],
    );

    const [permissions2] = await connection.execute(
      `SELECT p.permission_key, p.permission_name, p.category
       FROM lopez_core_role_permissions rp
       JOIN lopez_core_permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [role_id_2],
    );

    const perms1 = (permissions1 as any[]).map((p) => p.permission_key);
    const perms2 = (permissions2 as any[]).map((p) => p.permission_key);

    // Unterschiede berechnen
    const onlyInRole1 = perms1.filter((key) => !perms2.includes(key));
    const onlyInRole2 = perms2.filter((key) => !perms1.includes(key));
    const inBoth = perms1.filter((key) => perms2.includes(key));

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        role1: {
          id: role1.id,
          role_name: role1.role_name,
          role_code: role1.role_code,
          permission_count: perms1.length,
        },
        role2: {
          id: role2.id,
          role_name: role2.role_name,
          role_code: role2.role_code,
          permission_count: perms2.length,
        },
        differences: {
          only_in_role1: onlyInRole1,
          only_in_role2: onlyInRole2,
          in_both: inBoth,
        },
        summary: {
          total_differences: onlyInRole1.length + onlyInRole2.length,
          common_permissions: inBoth.length,
        },
      },
    });
  } catch (error) {
    logger.error("Fehler beim Vergleichen der Rollen", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Vergleichen der Rollen" },
      { status: 500 },
    );
  }
}



