import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import fs from "fs";
import path from "path";

/**
 * GET /api/admin/help/docs/list
 * 
 * Gibt eine Liste aller verfügbaren Dokumentations-Dateien zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const docsPath = path.join(process.cwd(), "docs");
    const categories: Record<string, Array<{ name: string; title: string; path: string }>> = {};

    const scanDirectory = (dir: string, categoryName: string) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
          const fullPath = path.join(dir, file.name);

          if (file.isDirectory()) {
            scanDirectory(fullPath, categoryName);
          } else if (file.name.endsWith(".md")) {
            try {
              const content = fs.readFileSync(fullPath, "utf-8");
              const titleMatch = content.match(/^#\s+(.+)$/m);
              const title = titleMatch ? titleMatch[1] : file.name.replace(".md", "");

              if (!categories[categoryName]) {
                categories[categoryName] = [];
              }

              categories[categoryName].push({
                name: file.name.replace(".md", ""),
                title,
                path: fullPath.replace(process.cwd(), ""),
              });
            } catch (err) {
              // Datei kann nicht gelesen werden - ignorieren
            }
          }
        }
      } catch (err) {
        // Verzeichnis kann nicht gelesen werden - ignorieren
      }
    };

    // Alle Kategorien scannen
    try {
      const categoryDirs = fs.readdirSync(docsPath, { withFileTypes: true });
      for (const cat of categoryDirs) {
        if (cat.isDirectory()) {
          const catPath = path.join(docsPath, cat.name);
          scanDirectory(catPath, cat.name);
        }
      }
    } catch (err) {
      // docs-Verzeichnis existiert möglicherweise nicht
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Dokumentations-Liste", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Liste" },
      { status: 500 },
    );
  }
}


