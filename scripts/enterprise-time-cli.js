#!/usr/bin/env node

/**
 * Enterprise++ Time Tracking CLI
 * Interaktive Kommandozeile für Zeiterfassung
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Konfiguration
const CONFIG = {
  dataFile: path.join(__dirname, "../data/time-tracking.json"),
  logFile: path.join(__dirname, "../logs/time-tracking.log"),
  categories: [
    { value: "development", label: "Entwicklung" },
    { value: "bugfix", label: "Bugfix" },
    { value: "rule_violation", label: "Regelverstoß" },
    { value: "meeting", label: "Meeting" },
    { value: "documentation", label: "Dokumentation" },
    { value: "other", label: "Sonstiges" },
  ],
  priorities: [
    { value: "low", label: "Niedrig" },
    { value: "medium", label: "Mittel" },
    { value: "high", label: "Hoch" },
    { value: "critical", label: "Kritisch" },
  ],
};

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  console.log(logMessage);

  // In Log-Datei schreiben
  const logDir = path.dirname(CONFIG.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFileSync(CONFIG.logFile, logMessage + "\n");
}

function loadData() {
  try {
    if (fs.existsSync(CONFIG.dataFile)) {
      const data = fs.readFileSync(CONFIG.dataFile, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    log(`Fehler beim Laden der Daten: ${error.message}`, "ERROR");
  }

  return {
    sessions: [],
    tasks: [],
    lastId: 0,
  };
}

function saveData(data) {
  try {
    const dataDir = path.dirname(CONFIG.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(CONFIG.dataFile, JSON.stringify(data, null, 2));
    log("✅ Daten erfolgreich gespeichert");
  } catch (error) {
    log(`❌ Fehler beim Speichern der Daten: ${error.message}`, "ERROR");
  }
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

// Hauptfunktionen
async function startNewSession() {
  console.log("\n🚀 Neue Session starten");
  console.log("=".repeat(40));

  const module = await question("📁 Modul/Bereich: ");
  if (!module.trim()) {
    console.log("❌ Modul ist erforderlich");
    return;
  }

  console.log("\n📂 Verfügbare Kategorien:");
  CONFIG.categories.forEach((cat, index) => {
    console.log(`   ${index + 1}. ${cat.label} (${cat.value})`);
  });

  const categoryChoice = await question("\n🎯 Kategorie (Nummer): ");
  const categoryIndex = parseInt(categoryChoice) - 1;

  if (categoryIndex < 0 || categoryIndex >= CONFIG.categories.length) {
    console.log("❌ Ungültige Kategorie");
    return;
  }

  const category = CONFIG.categories[categoryIndex].value;

  console.log("\n⚡ Verfügbare Prioritäten:");
  CONFIG.priorities.forEach((prio, index) => {
    console.log(`   ${index + 1}. ${prio.label} (${prio.value})`);
  });

  const priorityChoice = await question("\n🔥 Priorität (Nummer): ");
  const priorityIndex = parseInt(priorityChoice) - 1;

  if (priorityIndex < 0 || priorityIndex >= CONFIG.priorities.length) {
    console.log("❌ Ungültige Priorität");
    return;
  }

  const priority = CONFIG.priorities[priorityIndex].value;

  const description = await question("\n📝 Beschreibung: ");
  if (!description.trim()) {
    console.log("❌ Beschreibung ist erforderlich");
    return;
  }

  // Session erstellen
  const data = loadData();
  const sessionId = ++data.lastId;

  const session = {
    id: sessionId,
    user_id: 1,
    module: module.trim(),
    description: description.trim(),
    category,
    priority,
    start_time: new Date().toISOString(),
    end_time: null,
    duration_minutes: null,
    status: "active",
    created_at: new Date().toISOString(),
  };

  data.sessions.push(session);
  saveData(data);

  console.log("\n✅ Session erfolgreich gestartet!");
  console.log(`🆔 ID: ${sessionId}`);
  console.log(`📁 Modul: ${session.module}`);
  console.log(`🎯 Kategorie: ${CONFIG.categories.find((c) => c.value === category)?.label}`);
  console.log(`🔥 Priorität: ${CONFIG.priorities.find((p) => p.value === priority)?.label}`);
  console.log(`📝 Beschreibung: ${session.description}`);
  console.log(`⏰ Start: ${new Date(session.start_time).toLocaleString("de-DE")}`);
}

async function stopSession() {
  const data = loadData();
  const activeSessions = data.sessions.filter((s) => s.status === "active");

  if (activeSessions.length === 0) {
    console.log("\n❌ Keine aktiven Sessions vorhanden");
    return;
  }

  console.log("\n⏹️  Aktive Sessions:");
  console.log("=".repeat(40));

  activeSessions.forEach((session) => {
    const startTime = new Date(session.start_time).toLocaleString("de-DE");
    const duration = calculateDuration(session.start_time, new Date());
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    console.log(`🆔 ${session.id} | ${session.module}`);
    console.log(`   📝 ${session.description}`);
    console.log(`   ⏰ Start: ${startTime}`);
    console.log(`   ⏱️  Laufzeit: ${hours}h ${minutes}min`);
    console.log("");
  });

  const sessionId = await question("🆔 Session-ID zum Stoppen: ");
  const sessionIndex = data.sessions.findIndex((s) => s.id === parseInt(sessionId));

  if (sessionIndex === -1) {
    console.log("❌ Session nicht gefunden");
    return;
  }

  const session = data.sessions[sessionIndex];
  if (session.status !== "active") {
    console.log("❌ Session ist nicht aktiv");
    return;
  }

  const endTime = new Date();
  const durationMinutes = calculateDuration(session.start_time, endTime);

  data.sessions[sessionIndex] = {
    ...session,
    end_time: endTime.toISOString(),
    duration_minutes: durationMinutes,
    status: "completed",
  };

  saveData(data);

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  console.log("\n✅ Session erfolgreich gestoppt!");
  console.log(`🆔 ID: ${session.id}`);
  console.log(`📁 Modul: ${session.module}`);
  console.log(`⏱️  Gesamtdauer: ${hours}h ${minutes}min`);
}

async function pauseSession() {
  const data = loadData();
  const activeSessions = data.sessions.filter((s) => s.status === "active");

  if (activeSessions.length === 0) {
    console.log("\n❌ Keine aktiven Sessions vorhanden");
    return;
  }

  console.log("\n⏸️  Aktive Sessions:");
  console.log("=".repeat(40));

  activeSessions.forEach((session) => {
    const startTime = new Date(session.start_time).toLocaleString("de-DE");
    console.log(`🆔 ${session.id} | ${session.module} | ${startTime}`);
  });

  const sessionId = await question("\n🆔 Session-ID zum Pausieren: ");
  const sessionIndex = data.sessions.findIndex((s) => s.id === parseInt(sessionId));

  if (sessionIndex === -1) {
    console.log("❌ Session nicht gefunden");
    return;
  }

  const session = data.sessions[sessionIndex];
  if (session.status !== "active") {
    console.log("❌ Session ist nicht aktiv");
    return;
  }

  data.sessions[sessionIndex] = {
    ...session,
    status: "paused",
  };

  saveData(data);

  console.log("\n✅ Session erfolgreich pausiert!");
  console.log(`🆔 ID: ${session.id}`);
  console.log(`📁 Modul: ${session.module}`);
}

function showReport() {
  const data = loadData();
  const sessions = data.sessions;

  if (sessions.length === 0) {
    console.log("\n📊 Keine Sessions vorhanden");
    return;
  }

  console.log("\n📊 ZEITERFASSUNG-REPORT");
  console.log("=".repeat(50));

  // Gesamtstatistiken
  const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;

  console.log(`📈 Gesamtzeit: ${totalHours}h ${totalMinutes}min`);
  console.log(`📋 Sessions: ${sessions.length}`);
  console.log("");

  // Nach Kategorien
  const categoryStats = {};
  sessions.forEach((session) => {
    const duration = session.duration_minutes || 0;
    categoryStats[session.category] = (categoryStats[session.category] || 0) + duration;
  });

  console.log("🏷️  Nach Kategorien:");
  Object.entries(categoryStats).forEach(([category, minutes]) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const categoryLabel = CONFIG.categories.find((c) => c.value === category)?.label || category;
    console.log(`   ${categoryLabel}: ${hours}h ${mins}min`);
  });
  console.log("");

  // Nach Prioritäten
  const priorityStats = {};
  sessions.forEach((session) => {
    const duration = session.duration_minutes || 0;
    priorityStats[session.priority] = (priorityStats[session.priority] || 0) + duration;
  });

  console.log("⚡ Nach Prioritäten:");
  Object.entries(priorityStats).forEach(([priority, minutes]) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const priorityLabel = CONFIG.priorities.find((p) => p.value === priority)?.label || priority;
    console.log(`   ${priorityLabel}: ${hours}h ${mins}min`);
  });
  console.log("");

  // Aktive Sessions
  const activeSessions = sessions.filter((s) => s.status === "active");
  if (activeSessions.length > 0) {
    console.log("🟢 Aktive Sessions:");
    activeSessions.forEach((session) => {
      const startTime = new Date(session.start_time).toLocaleString("de-DE");
      const duration = calculateDuration(session.start_time, new Date());
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      console.log(`   🆔 ${session.id}: ${session.module}`);
      console.log(`      ⏰ Start: ${startTime} (${hours}h ${minutes}min)`);
    });
    console.log("");
  }

  // Letzte 5 Sessions
  console.log("🕐 Letzte 5 Sessions:");
  const recentSessions = sessions
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  recentSessions.forEach((session) => {
    const startTime = new Date(session.start_time).toLocaleString("de-DE");
    const duration = session.duration_minutes
      ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}min`
      : "läuft...";

    const categoryLabel =
      CONFIG.categories.find((c) => c.value === session.category)?.label || session.category;

    console.log(`   ${session.module} (${categoryLabel}) - ${duration} - ${startTime}`);
  });
}

async function showMainMenu() {
  while (true) {
    console.log("\n🕐 ENTERPRISE++ TIME TRACKING");
    console.log("=".repeat(40));
    console.log("1. 🚀 Neue Session starten");
    console.log("2. ⏹️  Session stoppen");
    console.log("3. ⏸️  Session pausieren");
    console.log("4. 📊 Report anzeigen");
    console.log("5. 🚪 Beenden");
    console.log("=".repeat(40));

    const choice = await question("🎯 Auswahl (1-5): ");

    switch (choice) {
      case "1":
        await startNewSession();
        break;
      case "2":
        await stopSession();
        break;
      case "3":
        await pauseSession();
        break;
      case "4":
        showReport();
        break;
      case "5":
        console.log("\n👋 Auf Wiedersehen!");
        rl.close();
        return;
      default:
        console.log("❌ Ungültige Auswahl");
    }

    await question("\n⏸️  Drücke Enter für Hauptmenü...");
  }
}

// Programm starten
function main() {
  console.log("🚀 Enterprise++ Time Tracking CLI");
  console.log("Version 1.0.0");
  console.log("Interaktive Zeiterfassung für Regelverstöße und Probleme");

  showMainMenu().catch((error) => {
    console.error("❌ Fehler:", error);
    rl.close();
  });
}

// Programm ausführen
if (require.main === module) {
  main();
}

module.exports = {
  startNewSession,
  stopSession,
  pauseSession,
  showReport,
  showMainMenu,
};
