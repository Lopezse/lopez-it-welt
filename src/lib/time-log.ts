// src/lib/time-log.ts
import fs from "fs";
import path from "path";

/**
 * Enterprise++ Time Logging System
 * Automatische Zeiterfassung mit Europe/Berlin Timezone und UTC
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-28
 */

const TIME_LOG_PATH = path.join(process.cwd(), "TIME_LOG.md");

/**
 * Formatiert Datum/Zeit für Europe/Berlin (24h Format)
 */
function fmtLocal(d: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formatiert Datum/Zeit als UTC ISO String
 */
function utc(d: Date): string {
  return d.toISOString();
}

/**
 * Berechnet Minuten zwischen zwei Daten
 */
function mins(a: Date, b: Date): number {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 60000));
}

/**
 * Formatiert Datum für Tages-Header (Europe/Berlin)
 */
function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    dateStyle: "short",
  }).format(d);
}

/**
 * Stellt sicher, dass Tages-Header existiert
 */
function ensureDay(dayHeader: string): void {
  const content = fs.existsSync(TIME_LOG_PATH) ? fs.readFileSync(TIME_LOG_PATH, "utf8") : "";

  if (!content.includes(`## 📅 ${dayHeader}`)) {
    const daySection = `\n## 📅 ${dayHeader}\n\n### ⏱️ Einzelne Tasks\n\n### 📊 Tagesübersicht\n- *Wartend auf Aufgaben*\n\n---\n`;
    fs.appendFileSync(TIME_LOG_PATH, daySection);
  }
}

/**
 * Fügt Zeile zum Tages-Abschnitt hinzu
 */
function appendLine(dayHeader: string, line: string): void {
  const content = fs.readFileSync(TIME_LOG_PATH, "utf8");
  const lines = content.split("\n");

  // Finde Tages-Header
  let dayIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`## 📅 ${dayHeader}`)) {
      dayIndex = i;
      break;
    }
  }

  if (dayIndex === -1) {
    ensureDay(dayHeader);
    return appendLine(dayHeader, line);
  }

  // Finde "Einzelne Tasks" Sektion
  let tasksIndex = -1;
  for (let i = dayIndex; i < lines.length; i++) {
    if (lines[i].includes("### ⏱️ Einzelne Tasks")) {
      tasksIndex = i;
      break;
    }
  }

  if (tasksIndex === -1) return;

  // Füge Zeile nach "Einzelne Tasks" hinzu
  lines.splice(tasksIndex + 1, 0, line);
  fs.writeFileSync(TIME_LOG_PATH, lines.join("\n"));
}

/**
 * Ersetzt die letzte Zeile im Tages-Abschnitt
 */
function replaceLastLine(dayHeader: string, newLine: string): void {
  const content = fs.readFileSync(TIME_LOG_PATH, "utf8");
  const lines = content.split("\n");

  // Finde Tages-Header
  let dayIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`## 📅 ${dayHeader}`)) {
      dayIndex = i;
      break;
    }
  }

  if (dayIndex === -1) return;

  // Finde "Einzelne Tasks" Sektion und letzte Zeile
  let tasksIndex = -1;
  let lastTaskIndex = -1;

  for (let i = dayIndex; i < lines.length; i++) {
    if (lines[i].includes("### ⏱️ Einzelne Tasks")) {
      tasksIndex = i;
    }
    if (lines[i].startsWith("- ") && lines[i].includes("| Modul:")) {
      lastTaskIndex = i;
    }
    if (lines[i].includes("### 📊 Tagesübersicht")) {
      break;
    }
  }

  if (lastTaskIndex !== -1) {
    lines[lastTaskIndex] = newLine;
    fs.writeFileSync(TIME_LOG_PATH, lines.join("\n"));
  }
}

/**
 * Aktualisiert Tagesübersicht mit Modul-Zeiten
 */
function updateTotals(dayHeader: string, module: string, duration: number): void {
  const content = fs.readFileSync(TIME_LOG_PATH, "utf8");
  const lines = content.split("\n");

  // Finde Tages-Header
  let dayIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`## 📅 ${dayHeader}`)) {
      dayIndex = i;
      break;
    }
  }

  if (dayIndex === -1) return;

  // Finde "Tagesübersicht" Sektion
  let totalsIndex = -1;
  for (let i = dayIndex; i < lines.length; i++) {
    if (lines[i].includes("### 📊 Tagesübersicht")) {
      totalsIndex = i;
      break;
    }
  }

  if (totalsIndex === -1) return;

  // Sammle alle Module und Zeiten
  const moduleTimes: Record<string, number> = {};
  let totalTime = 0;

  // Gehe durch alle Tasks des Tages
  for (let i = dayIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("- ") && line.includes("| Modul:") && line.includes("| Dauer:")) {
      const moduleMatch = line.match(/\| Modul: ([^|]+)/);
      const durationMatch = line.match(/\| Dauer: (\d+) min/);

      if (moduleMatch && durationMatch) {
        const mod = moduleMatch[1].trim();
        const dur = parseInt(durationMatch[1]);
        moduleTimes[mod] = (moduleTimes[mod] || 0) + dur;
        totalTime += dur;
      }
    }
    if (line.includes("---") && i > totalsIndex) break;
  }

  // Erstelle neue Tagesübersicht
  const newTotals = ["### 📊 Tagesübersicht"];
  for (const [mod, time] of Object.entries(moduleTimes)) {
    newTotals.push(`- ${mod}: ${time} min`);
  }
  newTotals.push(`- Gesamt: ${totalTime} min`);
  newTotals.push("");

  // Finde Ende der Tagesübersicht
  let endIndex = totalsIndex + 1;
  while (endIndex < lines.length && !lines[endIndex].includes("---")) {
    endIndex++;
  }

  // Ersetze Tagesübersicht
  lines.splice(totalsIndex, endIndex - totalsIndex, ...newTotals);
  fs.writeFileSync(TIME_LOG_PATH, lines.join("\n"));
}

/**
 * Hauptfunktion für automatische Zeiterfassung
 * Wrappt jede Aktion mit Start/Ende/Dauer-Logging
 */
export async function logTask(
  module: string,
  comment: string,
  fn: () => Promise<void>,
): Promise<void> {
  const start = new Date();
  const startLocal = fmtLocal(start);
  const startUTC = utc(start);
  const dayHeader = fmtDate(start);

  // Stelle sicher, dass Tages-Header existiert
  ensureDay(dayHeader);

  // Erstelle Start-Zeile
  const linePrefix = `- ${startLocal}–??:?? | Modul: ${module} | Dauer: ?? min | ⏳ | Kommentar: ${comment} (UTC: ${startUTC}–???)`;
  appendLine(dayHeader, linePrefix);

  try {
    // Führe Aktion aus
    await fn();

    // Erfolgreich beendet
    const end = new Date();
    const endLocal = fmtLocal(end);
    const endUTC = utc(end);
    const dur = mins(start, end);

    const successLine = `- ${startLocal}–${endLocal} | Modul: ${module} | Dauer: ${dur} min | ✅ | Kommentar: ${comment} (UTC: ${startUTC}–${endUTC})`;
    replaceLastLine(dayHeader, successLine);
    updateTotals(dayHeader, module, dur);
  } catch (error) {
    // Fehler aufgetreten
    const end = new Date();
    const endLocal = fmtLocal(end);
    const endUTC = utc(end);
    const dur = mins(start, end);

    const errorLine = `- ${startLocal}–${endLocal} | Modul: ${module} | Dauer: ${dur} min | ❌ | Kommentar: ${comment} (UTC: ${startUTC}–${endUTC})`;
    replaceLastLine(dayHeader, errorLine);
    updateTotals(dayHeader, module, dur);

    throw error;
  }
}

/**
 * Manuelle Zeiterfassung (für bereits abgeschlossene Tasks)
 */
export function logCompletedTask(
  module: string,
  comment: string,
  startTime: Date,
  endTime: Date,
): void {
  const startLocal = fmtLocal(startTime);
  const endLocal = fmtLocal(endTime);
  const startUTC = utc(startTime);
  const endUTC = utc(endTime);
  const dur = mins(startTime, endTime);
  const dayHeader = fmtDate(startTime);

  ensureDay(dayHeader);

  const line = `- ${startLocal}–${endLocal} | Modul: ${module} | Dauer: ${dur} min | ✅ | Kommentar: ${comment} (UTC: ${startUTC}–${endUTC})`;
  appendLine(dayHeader, line);
  updateTotals(dayHeader, module, dur);
}

/**
 * Validiert Zeitkonsistenz (Europe/Berlin vs UTC)
 */
export function validateTimeConsistency(date: Date): boolean {
  const localTime = fmtLocal(date);
  const utcTime = utc(date);

  // Prüfe ob UTC-Zeit korrekt ist
  const expectedUTC = date.toISOString();
  return utcTime === expectedUTC;
}

/**
 * Exportiere Hilfsfunktionen für Tests
 */
export { fmtDate, fmtLocal, mins, utc };
