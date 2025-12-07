import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// POST /api/admin/settings/profile/avatar
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // RBAC: Nur Owner/Admin
    const userRoles = session.roles || [];
    if (!userRoles.includes("Owner") && !userRoles.includes("Admin")) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung" }, { status: 403 });
    }

    const userId = session.user.id;
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Keine Datei hochgeladen" }, { status: 400 });
    }

    // Validierung
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Datei ist zu groß. Maximal 2MB erlaubt." }, { status: 400 });
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return NextResponse.json({ success: false, error: "Nur JPG und PNG Dateien sind erlaubt." }, { status: 400 });
    }

    // Datei speichern
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `avatar-${userId}-${Date.now()}.${file.type.split("/")[1]}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");

    // Verzeichnis erstellen falls nicht vorhanden
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const avatarUrl = `/uploads/avatars/${fileName}`;

    // URL in Datenbank speichern
    await executeQueryPool(
      "UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [avatarUrl, userId]
    );

    return NextResponse.json({ success: true, data: { avatar_url: avatarUrl } });
  } catch (error: any) {
    console.error("Fehler beim Hochladen des Avatars:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Hochladen des Avatars" }, { status: 500 });
  }
}

