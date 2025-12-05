import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Pfad zur Markdown-Datei relativ zum Projekt-Root
    const filePath = join(process.cwd(), "docs", "08-BUSINESS", "08-02-linkedin-marketing-content-plan.md");
    
    // Datei einlesen
    const content = await readFile(filePath, "utf-8");
    
    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Fehler beim Laden der Markdown-Datei:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Markdown-Datei konnte nicht geladen werden",
        content: "",
      },
      { status: 500 }
    );
  }
}








