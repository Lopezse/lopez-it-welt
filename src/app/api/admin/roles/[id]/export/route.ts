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
 * GET /api/admin/roles/[id]/export
 * 
 * Exportiert eine Rolle als JSON.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    const connection = await mysql.createConnection(dbConfig);

    // Rolle laden
    const [roles] = await connection.execute(
      `SELECT id, role_name, role_code, role_description, is_system_role, is_active, created_at, updated_at
       FROM lopez_core_roles 
       WHERE id = ?`,
      [roleId],
    );

    if ((roles as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 },
      );
    }

    const role = (roles as any[])[0];

    // Berechtigungen laden
    const [permissions] = await connection.execute(
      `SELECT p.permission_key, p.permission_name, p.description, p.category
       FROM lopez_core_role_permissions rp
       JOIN lopez_core_permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [roleId],
    );

    const roleData = {
      role_name: role.role_name,
      role_code: role.role_code,
      role_description: role.role_description,
      is_system_role: role.is_system_role,
      permissions: (permissions as any[]).map((p) => ({
        permission_key: p.permission_key,
        permission_name: p.permission_name,
        description: p.description,
        category: p.category,
      })),
      exported_at: new Date().toISOString(),
      version: "1.0",
    };

    await connection.end();

    if (format === "csv") {
      // CSV-Format
      const csvLines = [
        `Role Name,${roleData.role_name}`,
        `Role Code,${roleData.role_code}`,
        `Description,${roleData.role_description}`,
        `System Role,${roleData.is_system_role}`,
        "",
        "Permissions",
        "Permission Key,Permission Name,Category",
        ...roleData.permissions.map(
          (p) => `"${p.permission_key}","${p.permission_name}","${p.category}"`,
        ),
      ];

      return new NextResponse(csvLines.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="role_${roleData.role_code}_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON-Format (Standard)
    return NextResponse.json({
      success: true,
      data: roleData,
    });
  } catch (error) {
    logger.error("Fehler beim Exportieren der Rolle", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Exportieren der Rolle" },
      { status: 500 },
    );
  }
}



