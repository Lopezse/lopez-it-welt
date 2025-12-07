// =====================================================
// ENTERPRISE++ PROJECT PROGRESS FROM MD HELPER
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Liest Fortschritt aus STATUS.md und berechnet Prozent
// =====================================================

import fs from "fs/promises";
import path from "path";

export interface ProjectProgress {
  progressPercent: number;
  statusText: string;
  totalItems: number;
  doneItems: number;
  partialItems: number;
  source: string;
  lastModified: string;
}

/**
 * Enterprise++ Fortschritts-Analyse aus STATUS.md
 * 
 * Analysiert die STATUS.md Datei und berechnet den Fortschritt
 * basierend auf ✅ (erledigt), ⚠️ (teilweise) und ❌/⏳ (offen) Markierungen.
 */
export async function getProjectProgressFromMd(projectName: string): Promise<ProjectProgress> {
  const statusPath = path.join(process.cwd(), "docs", "STATUS.md");
  
  try {
    // Datei einlesen
    const content = await fs.readFile(statusPath, "utf-8");
    const stats = await fs.stat(statusPath);
    const lastModified = stats.mtime.toISOString();
    
    // Fortschritt analysieren
    const progress = analyzeProgress(content, projectName);
    
    return {
      ...progress,
      source: "docs/STATUS.md",
      lastModified,
    };
    
  } catch (error) {
    console.error("Fehler beim Lesen von STATUS.md:", error);
    
    // Fallback bei Fehler
    return {
      progressPercent: 0,
      statusText: "STATUS.md konnte nicht gelesen werden",
      totalItems: 0,
      doneItems: 0,
      partialItems: 0,
      source: "docs/STATUS.md",
      lastModified: new Date().toISOString(),
    };
  }
}

/**
 * Analysiert den Inhalt und zählt erledigte/offene Punkte
 */
function analyzeProgress(content: string, projectName: string): Omit<ProjectProgress, "source" | "lastModified"> {
  // Normalisiere Projektname für Suche
  const normalizedName = projectName.toLowerCase().trim();
  
  // Versuche projektspezifischen Abschnitt zu finden
  let relevantContent = content;
  
  // Suche nach Abschnitt mit Projektname
  const projectPatterns = [
    new RegExp(`## .*${escapeRegex(normalizedName)}.*`, "i"),
    new RegExp(`### .*${escapeRegex(normalizedName)}.*`, "i"),
    /## Fortschritt/i,
    /### Fortschritt/i,
    /## Status/i,
    /## KW \d+/i,
  ];
  
  for (const pattern of projectPatterns) {
    const match = content.match(pattern);
    if (match) {
      // Extrahiere Abschnitt ab dem Match bis zum nächsten ## Header
      const startIndex = match.index || 0;
      const nextHeaderMatch = content.substring(startIndex + match[0].length).match(/\n## /);
      const endIndex = nextHeaderMatch 
        ? startIndex + match[0].length + nextHeaderMatch.index! 
        : content.length;
      
      relevantContent = content.substring(startIndex, endIndex);
      break;
    }
  }
  
  // Zähle Checkboxen und Emojis
  const donePatterns = [
    /^[-*]\s*\[x\]/gmi,           // - [x] oder * [x]
    /^[-*]\s*✅/gm,                // - ✅
    /✅\s*\*\*/gm,                 // ✅ **Text**
    /\|\s*✅\s*\|/g,               // | ✅ |
  ];
  
  const partialPatterns = [
    /^[-*]\s*⚠️/gm,               // - ⚠️
    /^[-*]\s*🟡/gm,               // - 🟡
    /\|\s*⚠️\s*\|/g,              // | ⚠️ |
    /\|\s*🟡\s*\|/g,              // | 🟡 |
  ];
  
  const openPatterns = [
    /^[-*]\s*\[\s*\]/gmi,         // - [ ] oder * [ ]
    /^[-*]\s*❌/gm,                // - ❌
    /^[-*]\s*⏳/gm,                // - ⏳
    /\|\s*❌\s*\|/g,               // | ❌ |
    /\|\s*⏳\s*\|/g,               // | ⏳ |
  ];
  
  // Zähle Matches
  let doneItems = 0;
  let partialItems = 0;
  let openItems = 0;
  
  for (const pattern of donePatterns) {
    const matches = relevantContent.match(pattern);
    doneItems += matches?.length || 0;
  }
  
  for (const pattern of partialPatterns) {
    const matches = relevantContent.match(pattern);
    partialItems += matches?.length || 0;
  }
  
  for (const pattern of openPatterns) {
    const matches = relevantContent.match(pattern);
    openItems += matches?.length || 0;
  }
  
  // Berechne Total (wenn nichts gefunden, scan gesamtes Dokument)
  let totalItems = doneItems + partialItems + openItems;
  
  if (totalItems === 0) {
    // Fallback: Scan gesamten Content
    for (const pattern of donePatterns) {
      const matches = content.match(pattern);
      doneItems += matches?.length || 0;
    }
    
    for (const pattern of partialPatterns) {
      const matches = content.match(pattern);
      partialItems += matches?.length || 0;
    }
    
    for (const pattern of openPatterns) {
      const matches = content.match(pattern);
      openItems += matches?.length || 0;
    }
    
    totalItems = doneItems + partialItems + openItems;
  }
  
  // Berechne Prozent (partial = 0.5 Punkte)
  let progressPercent = 0;
  if (totalItems > 0) {
    const weightedDone = doneItems + (partialItems * 0.5);
    progressPercent = Math.round((weightedDone / totalItems) * 100);
  }
  
  // Generiere Status-Text
  const statusText = generateStatusText(doneItems, partialItems, openItems, totalItems, progressPercent);
  
  return {
    progressPercent,
    statusText,
    totalItems,
    doneItems,
    partialItems,
  };
}

/**
 * Generiert einen lesbaren Status-Text
 */
function generateStatusText(
  doneItems: number, 
  partialItems: number, 
  openItems: number,
  totalItems: number,
  progressPercent: number
): string {
  if (totalItems === 0) {
    return "Keine Fortschritts-Marker in STATUS.md gefunden";
  }
  
  const parts: string[] = [];
  
  parts.push(`${progressPercent}% Fortschritt`);
  
  if (doneItems > 0) {
    parts.push(`${doneItems} abgeschlossen`);
  }
  
  if (partialItems > 0) {
    parts.push(`${partialItems} in Arbeit`);
  }
  
  if (openItems > 0) {
    parts.push(`${openItems} offen`);
  }
  
  return `Fortschritt basierend auf STATUS.md: ${parts.join(", ")} (${totalItems} Punkte gesamt)`;
}

/**
 * Escape RegEx Sonderzeichen
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default getProjectProgressFromMd;















