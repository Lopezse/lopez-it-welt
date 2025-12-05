import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import fs from "fs";
import path from "path";

/**
 * GET /api/admin/help/docs/[category]/[file]
 * 
 * Lädt eine spezifische Dokumentations-Datei.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; file: string } }
) {
  try {
    const { category, file } = params;
    const filePath = path.join(process.cwd(), "docs", category, `${file}.md`);

    // Sicherheitsprüfung: Nur Dateien im docs-Verzeichnis erlauben
    const normalizedPath = path.normalize(filePath);
    const docsPath = path.normalize(path.join(process.cwd(), "docs"));

    if (!normalizedPath.startsWith(docsPath)) {
      return NextResponse.json(
        { success: false, message: "Ungültiger Pfad" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Datei nicht gefunden" },
        { status: 404 },
      );
    }

    const content = fs.readFileSync(filePath, "utf-8");

    // Titel extrahieren (erste # Zeile)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : file;

    return NextResponse.json({
      success: true,
      data: {
        title,
        content,
        category,
        file,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Dokumentation", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Dokumentation" },
      { status: 500 },
    );
  }
}


