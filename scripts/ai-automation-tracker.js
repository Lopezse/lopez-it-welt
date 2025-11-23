#!/usr/bin/env node

/**
 * 🤖 AI Automation Tracker
 * Automatische Zeiterfassung für KI-Interaktionen und Automatisierung
 */

const fs = require("fs");
const path = require("path");

// Konfiguration
const CONFIG = {
  dataFile: path.join(__dirname, "../data/ai-automation-tracking.json"),
  logFile: path.join(__dirname, "../logs/ai-automation.log"),
  aiCategories: {
    ai_interaction: { label: "🤖 KI-Interaktion", color: "purple" },
    automation: { label: "⚡ Automatisierung", color: "green" },
    ki_training: { label: "🧠 KI-Training", color: "blue" },
    rule_violation: { label: "🚨 Regelverstoß", color: "red" },
  },
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

// KI-spezifische Funktionen
function startAISession(module, description, category = "ai_interaction") {
  try {
    const data = loadData();
    const sessionId = ++data.lastId;

    const session = {
      id: sessionId,
      user_id: 1,
      module,
      description,
      category,
      priority: "high",
      start_time: new Date().toISOString(),
      end_time: null,
      duration_minutes: null,
      status: "active",
      created_at: new Date().toISOString(),
      ai_metadata: {
        model: "cursor-ai",
        interaction_type: category,
        timestamp: new Date().toISOString(),
      },
    };

    data.sessions.push(session);
    saveData(data);

    const categoryInfo = CONFIG.aiCategories[category];
    log(`🤖 KI-Session gestartet: ID ${sessionId} - ${module}`);
    log(`📝 Kategorie: ${categoryInfo.label}`);
    log(`📄 Beschreibung: ${description}`);

    return sessionId;
  } catch (error) {
    log(`❌ Fehler beim Starten der KI-Session: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

function startAutomationSession(module, description) {
  return startAISession(module, description, "automation");
}

function stopAISession(sessionId) {
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
      ai_metadata: {
        ...session.ai_metadata,
        end_timestamp: endTime.toISOString(),
        total_duration_minutes: durationMinutes,
      },
    };

    saveData(data);

    const categoryInfo = CONFIG.aiCategories[session.category];
    log(`✅ KI-Session gestoppt: ID ${sessionId}`);
    log(`📝 Kategorie: ${categoryInfo.label}`);
    log(`⏱️  Dauer: ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min`);
  } catch (error) {
    log(`❌ Fehler beim Stoppen der KI-Session: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

function generateAIReport() {
  try {
    const data = loadData();
    const sessions = data.sessions;

    if (sessions.length === 0) {
      log("📊 Keine KI-Sessions vorhanden");
      return;
    }

    console.log("\n🤖 KI & AUTOMATISIERUNG REPORT");
    console.log("=".repeat(60));

    // Gesamtstatistiken
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const totalHours = Math.floor(totalTime / 60);
    const totalMinutes = totalTime % 60;

    console.log(`📈 Gesamtzeit: ${totalHours}h ${totalMinutes}min`);
    console.log(`📋 Sessions: ${sessions.length}`);
    console.log("");

    // Nach KI-Kategorien
    const categoryStats = {};
    sessions.forEach((session) => {
      const duration = session.duration_minutes || 0;
      categoryStats[session.category] = (categoryStats[session.category] || 0) + duration;
    });

    console.log("🤖 Nach KI-Kategorien:");
    Object.entries(categoryStats).forEach(([category, minutes]) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const categoryInfo = CONFIG.aiCategories[category];
      console.log(`   ${categoryInfo.label}: ${hours}h ${mins}min`);
    });
    console.log("");

    // Aktive KI-Sessions
    const activeSessions = sessions.filter((s) => s.status === "active");
    if (activeSessions.length > 0) {
      console.log("🟢 Aktive KI-Sessions:");
      activeSessions.forEach((session) => {
        const startTime = new Date(session.start_time).toLocaleString("de-DE");
        const duration = calculateDuration(session.start_time, new Date());
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        const categoryInfo = CONFIG.aiCategories[session.category];

        console.log(`   🆔 ${session.id}: ${session.module}`);
        console.log(`      ${categoryInfo.label} - ${startTime} (${hours}h ${minutes}min)`);
      });
      console.log("");
    }

    // KI-Effizienz-Analyse
    console.log("📊 KI-Effizienz-Analyse:");
    const aiSessions = sessions.filter((s) => s.category === "ai_interaction");
    const automationSessions = sessions.filter((s) => s.category === "automation");

    const aiTime = aiSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const automationTime = automationSessions.reduce(
      (sum, s) => sum + (s.duration_minutes || 0),
      0,
    );

    console.log(
      `   🤖 KI-Interaktionen: ${aiSessions.length} Sessions, ${Math.floor(aiTime / 60)}h ${aiTime % 60}min`,
    );
    console.log(
      `   ⚡ Automatisierung: ${automationSessions.length} Sessions, ${Math.floor(automationTime / 60)}h ${automationTime % 60}min`,
    );

    if (aiTime > 0 && automationTime > 0) {
      const efficiencyRatio = ((automationTime / aiTime) * 100).toFixed(1);
      console.log(`   📈 Automatisierungs-Effizienz: ${efficiencyRatio}%`);
    }
    console.log("");

    // Letzte KI-Sessions
    console.log("🕐 Letzte 5 KI-Sessions:");
    const recentSessions = sessions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    recentSessions.forEach((session) => {
      const startTime = new Date(session.start_time).toLocaleString("de-DE");
      const duration = session.duration_minutes
        ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}min`
        : "läuft...";

      const categoryInfo = CONFIG.aiCategories[session.category];

      console.log(`   ${categoryInfo.label} ${session.module} - ${duration} - ${startTime}`);
    });
  } catch (error) {
    log(`❌ Fehler beim Generieren des KI-Reports: ${error.message}`, "ERROR");
  }
}

function showHelp() {
  console.log(`
🤖 AI Automation Tracker - KI & Automatisierung Zeiterfassung

Verwendung:
  node scripts/ai-automation-tracker.js <command> [options]

Befehle:
  start-ai <module> <description>
    Startet eine neue KI-Interaktions-Session
    
  start-auto <module> <description>
    Startet eine neue Automatisierungs-Session
    
  stop <session-id>
    Stoppt eine aktive KI-Session
    
  ai-report
    Zeigt einen detaillierten KI-Report
    
  help
    Zeigt diese Hilfe

KI-Kategorien:
  🤖 ai_interaction - KI-Interaktionen (Chat, Code-Review)
  ⚡ automation - Automatisierung (CI/CD, Scripts)
  🧠 ki_training - KI-Training und -Optimierung
  🚨 rule_violation - Regelverstöße und Korrekturen

Beispiele:
  node scripts/ai-automation-tracker.js start-ai "Cursor-Chat" "Code-Review und Bugfix"
  node scripts/ai-automation-tracker.js start-auto "CI-Pipeline" "Automatisierte Tests"
  node scripts/ai-automation-tracker.js stop 1
  node scripts/ai-automation-tracker.js ai-report
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

  log(`🤖 AI Automation Tracker - ${command.toUpperCase()}`);

  switch (command) {
    case "start-ai":
      if (args.length < 3) {
        log("❌ Fehler: start-ai benötigt module und description", "ERROR");
        showHelp();
        process.exit(1);
      }
      startAISession(args[1], args[2]);
      break;

    case "start-auto":
      if (args.length < 3) {
        log("❌ Fehler: start-auto benötigt module und description", "ERROR");
        showHelp();
        process.exit(1);
      }
      startAutomationSession(args[1], args[2]);
      break;

    case "stop":
      if (args.length < 2) {
        log("❌ Fehler: stop benötigt session-id", "ERROR");
        showHelp();
        process.exit(1);
      }
      stopAISession(args[1]);
      break;

    case "ai-report":
      generateAIReport();
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
  startAISession,
  startAutomationSession,
  stopAISession,
  generateAIReport,
  loadData,
  saveData,
};
