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
 * GET /api/admin/users/[id]/profile/export
 * 
 * Exportiert ein Benutzerprofil in verschiedenen Formaten.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    const connection = await mysql.createConnection(dbConfig);

    // Profil laden
    const [users] = await connection.execute(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.display_name,
        u.phone,
        u.address,
        u.city,
        u.postal_code,
        u.country,
        u.status,
        u.created_at,
        u.updated_at,
        r.role_name
       FROM lopez_core_users u
       LEFT JOIN lopez_core_roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId],
    );

    if ((users as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    const user = (users as any[])[0];
    const profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      display_name: user.display_name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postal_code: user.postal_code,
      country: user.country,
      role_name: user.role_name,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
      exported_at: new Date().toISOString(),
    };

    await connection.end();

    if (format === "csv") {
      // CSV-Format
      const csvLines = [
        `Profil-Export: ${profileData.username}`,
        `Exportiert am: ${new Date().toISOString()}`,
        "",
        "Feld,Wert",
        `ID,${profileData.id}`,
        `Benutzername,${profileData.username}`,
        `E-Mail,${profileData.email}`,
        `Vorname,${profileData.first_name || ""}`,
        `Nachname,${profileData.last_name || ""}`,
        `Anzeigename,${profileData.display_name || ""}`,
        `Telefon,${profileData.phone || ""}`,
        `Adresse,${profileData.address || ""}`,
        `Stadt,${profileData.city || ""}`,
        `Postleitzahl,${profileData.postal_code || ""}`,
        `Land,${profileData.country || ""}`,
        `Rolle,${profileData.role_name || ""}`,
        `Status,${profileData.status}`,
        `Erstellt am,${profileData.created_at}`,
        `Aktualisiert am,${profileData.updated_at}`,
      ];

      return new NextResponse(csvLines.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="profile_${profileData.username}_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    if (format === "pdf") {
      // PDF-Format (vereinfacht - in Produktion: PDF-Bibliothek verwenden)
      const pdfContent = `
Profil-Export: ${profileData.username}
Exportiert am: ${new Date().toISOString()}

Benutzername: ${profileData.username}
E-Mail: ${profileData.email}
Vorname: ${profileData.first_name || ""}
Nachname: ${profileData.last_name || ""}
Anzeigename: ${profileData.display_name || ""}
Telefon: ${profileData.phone || ""}
Adresse: ${profileData.address || ""}
Stadt: ${profileData.city || ""}
Postleitzahl: ${profileData.postal_code || ""}
Land: ${profileData.country || ""}
Rolle: ${profileData.role_name || ""}
Status: ${profileData.status}
Erstellt am: ${profileData.created_at}
Aktualisiert am: ${profileData.updated_at}
      `.trim();

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="profile_${profileData.username}_${new Date().toISOString().split("T")[0]}.pdf"`,
        },
      });
    }

    // JSON-Format (Standard)
    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    logger.error("Fehler beim Exportieren des Benutzerprofils", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Exportieren des Profils" },
      { status: 500 },
    );
  }
}


