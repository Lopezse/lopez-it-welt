#!/usr/bin/env node

/**
 * Enterprise++ Time Tracking System
 * Automatische Zeiterfassung für Regelverstöße und Probleme
 *
 * Verwendung:
 * node scripts/enterprise-time-tracking.js start "Regelverstoß" "Kategorie" "Priorität" "Beschreibung"
 * node scripts/enterprise-time-tracking.js stop <session-id>
 * node scripts/enterprise-time-tracking.js pause <session-id>
 * node scripts/enterprise-time-tracking.js report
 */

const fs = require("fs");
const path = require("path");

// Konfiguration
const CONFIG = {
  dataFile: path.join(__dirname, "../data/time-tracking.json"),
  logFile: path.join(__dirname, "../logs/time-tracking.log"),
  categories: ["development", "bugfix", "rule_violation", "meeting", "documentation", "other"],
  priorities: ["low", "medium", "high", "critical"],
  statuses: ["active", "completed", "paused"],
};

// Hilfsfunktionen
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
    log("Daten erfolgreich gespeichert");
  } catch (error) {
    log(`Fehler beim Speichern der Daten: ${error.message}`, "ERROR");
  }
}

function validateCategory(category) {
  if (!CONFIG.categories.includes(category)) {
    throw new Error(`Ungültige Kategorie: ${category}. Erlaubt: ${CONFIG.categories.join(", ")}`);
  }
}

function validatePriority(priority) {
  if (!CONFIG.priorities.includes(priority)) {
    throw new Error(`Ungültige Priorität: ${priority}. Erlaubt: ${CONFIG.priorities.join(", ")}`);
  }
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minuten
}

// Hauptfunktionen
function startSession(module, category, priority, description) {
  try {
    validateCategory(category);
    validatePriority(priority);

    const data = loadData();
    const sessionId = ++data.lastId;

    const session = {
      id: sessionId,
      user_id: 1, // Mock user ID
      module,
      description,
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

    log(`✅ Session gestartet: ID ${sessionId} - ${module} (${category}, ${priority})`);
    log(`📝 Beschreibung: ${description}`);

    return sessionId;
  } catch (error) {
    log(`❌ Fehler beim Starten der Session: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

function stopSession(sessionId) {
  try {
    const data = loadData();
    const sessionIndex = data.sessions.findIndex((s) => s.id === parseInt(sessionId));

    if (sessionIndex === -1) {
      throw new Error(`Session mit ID ${sessionId} nicht gefunden`);
    }

    const session = data.sessions[sessionIndex];

    if (session.status !== "active") {
      throw new Error(`Session ist nicht aktiv (Status: ${session.status})`);
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

    log(`✅ Session gestoppt: ID ${sessionId}`);
    log(`⏱️  Dauer: ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min`);
  } catch (error) {
    log(`❌ Fehler beim Stoppen der Session: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

function pauseSession(sessionId) {
  try {
    const data = loadData();
    const sessionIndex = data.sessions.findIndex((s) => s.id === parseInt(sessionId));

    if (sessionIndex === -1) {
      throw new Error(`Session mit ID ${sessionId} nicht gefunden`);
    }

    const session = data.sessions[sessionIndex];

    if (session.status !== "active") {
      throw new Error(`Session ist nicht aktiv (Status: ${session.status})`);
    }

    data.sessions[sessionIndex] = {
      ...session,
      status: "paused",
    };

    saveData(data);

    log(`⏸️  Session pausiert: ID ${sessionId}`);
  } catch (error) {
    log(`❌ Fehler beim Pausieren der Session: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

function generateReport() {
  try {
    const data = loadData();
    const sessions = data.sessions;

    if (sessions.length === 0) {
      log("📊 Keine Sessions vorhanden");
      return;
    }

    // Statistiken berechnen
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const categoryStats = {};
    const priorityStats = {};
    const statusStats = {};

    sessions.forEach((session) => {
      const duration = session.duration_minutes || 0;

      categoryStats[session.category] = (categoryStats[session.category] || 0) + duration;
      priorityStats[session.priority] = (priorityStats[session.priority] || 0) + duration;
      statusStats[session.status] = (statusStats[session.status] || 0) + 1;
    });

    // Report ausgeben
    log("📊 ZEITERFASSUNG-REPORT");
    log("=".repeat(50));
    log(`📈 Gesamtzeit: ${Math.floor(totalTime / 60)}h ${totalTime % 60}min`);
    log(`📋 Sessions: ${sessions.length}`);
    log("");

    log("🏷️  Nach Kategorien:");
    Object.entries(categoryStats).forEach(([category, minutes]) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      log(`   ${category}: ${hours}h ${mins}min`);
    });
    log("");

    log("⚡ Nach Prioritäten:");
    Object.entries(priorityStats).forEach(([priority, minutes]) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      log(`   ${priority}: ${hours}h ${mins}min`);
    });
    log("");

    log("📊 Nach Status:");
    Object.entries(statusStats).forEach(([status, count]) => {
      log(`   ${status}: ${count} Sessions`);
    });
    log("");

    // Aktive Sessions
    const activeSessions = sessions.filter((s) => s.status === "active");
    if (activeSessions.length > 0) {
      log("🟢 Aktive Sessions:");
      activeSessions.forEach((session) => {
        const startTime = new Date(session.start_time).toLocaleString("de-DE");
        log(`   ID ${session.id}: ${session.module} (seit ${startTime})`);
      });
      log("");
    }

    // Letzte 5 Sessions
    log("🕐 Letzte 5 Sessions:");
    const recentSessions = sessions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    recentSessions.forEach((session) => {
      const startTime = new Date(session.start_time).toLocaleString("de-DE");
      const duration = session.duration_minutes
        ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}min`
        : "läuft...";

      log(`   ${session.module} (${session.category}) - ${duration} - ${startTime}`);
    });
  } catch (error) {
    log(`❌ Fehler beim Generieren des Reports: ${error.message}`, "ERROR");
  }
}

function showHelp() {
  console.log(`
🕐 Enterprise++ Time Tracking System

Verwendung:
  node scripts/enterprise-time-tracking.js <command> [options]

Befehle:
  start <module> <category> <priority> <description>
    Startet eine neue Zeiterfassung-Session
    
  stop <session-id>
    Stoppt eine aktive Session
    
  pause <session-id>
    Pausiert eine aktive Session
    
  report
    Zeigt einen detaillierten Report aller Sessions
    
  help
    Zeigt diese Hilfe

Kategorien: ${CONFIG.categories.join(", ")}
Prioritäten: ${CONFIG.priorities.join(", ")}

Beispiele:
  node scripts/enterprise-time-tracking.js start "Adminbereich" "development" "high" "Implementierung der Benutzerverwaltung"
  node scripts/enterprise-time-tracking.js start "Regelverstoß" "rule_violation" "critical" "Korrektur von unerlaubten .md-Dateien"
  node scripts/enterprise-time-tracking.js stop 1
  node scripts/enterprise-time-tracking.js report
`);
}

// Hauptprogramm
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help") {
    showHelp();
    return;
  }

  log(`🚀 Enterprise++ Time Tracking - ${command.toUpperCase()}`);

  switch (command) {
    case "start":
      if (args.length < 5) {
        log("❌ Fehler: start benötigt module, category, priority und description", "ERROR");
        showHelp();
        process.exit(1);
      }
      startSession(args[1], args[2], args[3], args[4]);
      break;

    case "stop":
      if (args.length < 2) {
        log("❌ Fehler: stop benötigt session-id", "ERROR");
        showHelp();
        process.exit(1);
      }
      stopSession(args[1]);
      break;

    case "pause":
      if (args.length < 2) {
        log("❌ Fehler: pause benötigt session-id", "ERROR");
        showHelp();
        process.exit(1);
      }
      pauseSession(args[1]);
      break;

    case "report":
      generateReport();
      break;

    default:
      log(`❌ Unbekannter Befehl: ${command}`, "ERROR");
      showHelp();
      process.exit(1);
  }
}

// Programm ausführen
if (require.main === module) {
  main();
}

module.exports = {
  startSession,
  stopSession,
  pauseSession,
  generateReport,
  loadData,
  saveData,
};
