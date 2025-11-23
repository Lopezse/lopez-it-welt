import { mkdir, writeFile } from "fs/promises";
import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

// MySQL-Verbindung konfigurieren
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
};

// POST - Bild hochladen
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const category = (formData.get("category") as string) || "content";
    const altText = (formData.get("alt_text") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Keine Datei gefunden" }, { status: 400 });
    }

    // Datei-Validierung
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Nicht unterstützter Dateityp" }, { status: 400 });
    }

    // Datei-Größe prüfen (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Datei zu groß (max 5MB)" }, { status: 400 });
    }

    // Eindeutigen Dateinamen generieren
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload-Verzeichnis erstellen
    const uploadDir = join(process.cwd(), "public", "uploads", "images");
    await mkdir(uploadDir, { recursive: true });

    // Datei speichern
    const filePath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Datenbank-Eintrag erstellen
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      `INSERT INTO content_images (filename, original_name, file_path, alt_text, category, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [filename, file.name, `/uploads/images/${filename}`, altText, category, true],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Bild erfolgreich hochgeladen",
      image: {
        id: (result as { insertId: number }).insertId,
        filename,
        original_name: file.name,
        file_path: `/uploads/images/${filename}`,
        alt_text: altText,
        category,
      },
    });
  } catch {
    // Image Upload Error
    return NextResponse.json({ error: "Upload fehlgeschlagen" }, { status: 500 });
  }
}
