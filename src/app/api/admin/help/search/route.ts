import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import fs from "fs";
import path from "path";

/**
 * GET /api/admin/help/search
 * 
 * Sucht in der Dokumentation nach Begriffen.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Suchbegriff ist erforderlich" },
        { status: 400 },
      );
    }

    const docsPath = path.join(process.cwd(), "docs");
    const results: Array<{
      title: string;
      path: string;
      category: string;
      excerpt: string;
      relevance: number;
    }> = [];

    // Dokumentation durchsuchen
    const searchInDirectory = (dir: string, categoryName: string) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
          const fullPath = path.join(dir, file.name);

          if (file.isDirectory()) {
            searchInDirectory(fullPath, categoryName);
          } else if (file.name.endsWith(".md")) {
            try {
              const content = fs.readFileSync(fullPath, "utf-8");
              const lowerQuery = query.toLowerCase();
              const lowerContent = content.toLowerCase();

              if (lowerContent.includes(lowerQuery)) {
                // Titel extrahieren (erste # Zeile)
                const titleMatch = content.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : file.name.replace(".md", "");

                // Excerpt extrahieren (erste Zeile mit Query)
                const lines = content.split("\n");
                let excerpt = "";
                for (const line of lines) {
                  if (line.toLowerCase().includes(lowerQuery) && line.trim().length > 0) {
                    excerpt = line.trim().substring(0, 200);
                    break;
                  }
                }
                if (!excerpt) {
                  excerpt = content.substring(0, 200).replace(/\n/g, " ");
                }

                // Relevanz berechnen (Anzahl Vorkommen)
                const relevance = (lowerContent.match(new RegExp(lowerQuery, "g")) || []).length;

                results.push({
                  title,
                  path: fullPath.replace(process.cwd(), ""),
                  category: categoryName,
                  excerpt,
                  relevance,
                });
              }
            } catch (err) {
              // Datei kann nicht gelesen werden - ignorieren
            }
          }
        }
      } catch (err) {
        // Verzeichnis kann nicht gelesen werden - ignorieren
      }
    };

    // Kategorien durchsuchen
    if (category) {
      const categoryPath = path.join(docsPath, category);
      if (fs.existsSync(categoryPath)) {
        searchInDirectory(categoryPath, category);
      }
    } else {
      // Alle Kategorien durchsuchen
      try {
        const categories = fs.readdirSync(docsPath, { withFileTypes: true });
        for (const cat of categories) {
          if (cat.isDirectory()) {
            const catPath = path.join(docsPath, cat.name);
            searchInDirectory(catPath, cat.name);
          }
        }
      } catch (err) {
        // docs-Verzeichnis existiert möglicherweise nicht
      }
    }

    // Nach Relevanz sortieren
    results.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: results.slice(0, 50), // Maximal 50 Ergebnisse
        count: results.length,
      },
    });
  } catch (error) {
    logger.error("Fehler bei der Hilfe-Suche", error);
    return NextResponse.json(
      { success: false, message: "Fehler bei der Suche" },
      { status: 500 },
    );
  }
}


