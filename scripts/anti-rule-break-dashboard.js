#!/usr/bin/env node

/**
 * 🛡️ Anti-Regelbruch-System Dashboard
 * Sichtbares Dashboard im Browser
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

// 🛡️ ANTI-REGELBRUCH-SYSTEM STATUS
let systemStatus = {
  antiRuleBreakActive: false,
  agentsActive: false,
  enterpriseRulesLoaded: false,
  monitoringActive: false,
  cursorIntegrationActive: false,
  startupTime: null,
  errorCount: 0,
  violationCount: 0,
  startupComplete: false,
  daemonRunning: false,
};

// 🚨 REGELVERSTÖSSE TRACKING
let violations = [];

// 🔄 MONITORING INTERVAL
let monitoringInterval = null;

// 🌐 DASHBOARD SERVER
let dashboardServer = null;
const PORT = 3001;

/**
 * 🚀 Dashboard Server starten
 */
function startDashboardServer() {
  console.log("🌐 Anti-Regelbruch-System Dashboard wird gestartet...");
  console.log(`🌐 Dashboard verfügbar unter: http://localhost:${PORT}`);

  dashboardServer = http.createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateDashboardHTML());
    } else if (req.url === "/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ...systemStatus,
          violations: violations,
          lastUpdate: new Date().toISOString(),
        }),
      );
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  dashboardServer.listen(PORT, () => {
    console.log(`✅ Dashboard Server läuft auf Port ${PORT}`);
    console.log(`🌐 Öffnen Sie: http://localhost:${PORT}`);

    // Browser automatisch öffnen
    const { exec } = require("child_process");
    exec(`start http://localhost:${PORT}`, (error) => {
      if (error) {
        console.log("💡 Öffnen Sie manuell: http://localhost:${PORT}");
      }
    });
  });
}

/**
 * 📊 Dashboard HTML generieren
 */
function generateDashboardHTML() {
  const status = systemStatus;
  const violationsList = violations
    .slice(-10)
    .map(
      (v) =>
        `<tr><td>${v.timestamp}</td><td>${v.filename}</td><td>${v.reason}</td><td>${v.blocked ? "🚫 BLOCKIERT" : "✅ ERLAUBT"}</td></tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛡️ Anti-Regelbruch-System Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .status-card.active {
            background: rgba(76, 175, 80, 0.3);
            border-color: #4CAF50;
        }
        .status-card.inactive {
            background: rgba(244, 67, 54, 0.3);
            border-color: #F44336;
        }
        .status-icon {
            font-size: 2em;
            margin-bottom: 10px;
        }
        .status-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .status-value {
            font-size: 1.2em;
        }
        .violations-section {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        th {
            background: rgba(255, 255, 255, 0.2);
            font-weight: bold;
        }
        .refresh-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
        }
        .refresh-btn:hover {
            background: #45a049;
        }
        .auto-refresh {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .timestamp {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Anti-Regelbruch-System Dashboard</h1>
        
        <div class="auto-refresh">
            <button class="refresh-btn" onclick="refreshStatus()">🔄 Status aktualisieren</button>
            <span id="lastUpdate"></span>
        </div>

        <div class="status-grid">
            <div class="status-card ${status.antiRuleBreakActive ? "active" : "inactive"}">
                <div class="status-icon">🛡️</div>
                <div class="status-title">Anti-Regelbruch-System</div>
                <div class="status-value">${status.antiRuleBreakActive ? "AKTIV" : "INAKTIV"}</div>
            </div>
            
            <div class="status-card ${status.agentsActive ? "active" : "inactive"}">
                <div class="status-icon">🤖</div>
                <div class="status-title">Agenten</div>
                <div class="status-value">${status.agentsActive ? "AKTIV" : "INAKTIV"}</div>
            </div>
            
            <div class="status-card ${status.enterpriseRulesLoaded ? "active" : "inactive"}">
                <div class="status-icon">📋</div>
                <div class="status-title">Enterprise-Regeln</div>
                <div class="status-value">${status.enterpriseRulesLoaded ? "GELADEN" : "NICHT GELADEN"}</div>
            </div>
            
            <div class="status-card ${status.monitoringActive ? "active" : "inactive"}">
                <div class="status-icon">📊</div>
                <div class="status-title">Monitoring</div>
                <div class="status-value">${status.monitoringActive ? "AKTIV" : "INAKTIV"}</div>
            </div>
            
            <div class="status-card ${status.cursorIntegrationActive ? "active" : "inactive"}">
                <div class="status-icon">🛡️</div>
                <div class="status-title">Cursor-Integration</div>
                <div class="status-value">${status.cursorIntegrationActive ? "AKTIV" : "INAKTIV"}</div>
            </div>
            
            <div class="status-card ${status.daemonRunning ? "active" : "inactive"}">
                <div class="status-icon">🔄</div>
                <div class="status-title">Daemon-Modus</div>
                <div class="status-value">${status.daemonRunning ? "AKTIV" : "INAKTIV"}</div>
            </div>
        </div>

        <div class="status-grid">
            <div class="status-card">
                <div class="status-icon">⏰</div>
                <div class="status-title">Startup-Zeit</div>
                <div class="status-value">${status.startupTime || "Nicht verfügbar"}</div>
            </div>
            
            <div class="status-card">
                <div class="status-icon">❌</div>
                <div class="status-title">Fehler</div>
                <div class="status-value">${status.errorCount}</div>
            </div>
            
            <div class="status-card">
                <div class="status-icon">🚨</div>
                <div class="status-title">Regelverstöße</div>
                <div class="status-value">${status.violationCount}</div>
            </div>
        </div>

        <div class="violations-section">
            <h2>🚨 Letzte Regelverstöße</h2>
            <table>
                <thead>
                    <tr>
                        <th>Zeitstempel</th>
                        <th>Datei</th>
                        <th>Grund</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="violationsTable">
                    ${violationsList || '<tr><td colspan="4">Keine Regelverstöße</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="timestamp">
            Letzte Aktualisierung: <span id="currentTime"></span>
        </div>
    </div>

    <script>
        function refreshStatus() {
            fetch('/status')
                .then(response => response.json())
                .then(data => {
                    updateDashboard(data);
                })
                .catch(error => {
                    console.error('Fehler beim Aktualisieren:', error);
                });
        }

        function updateDashboard(data) {
            // Status-Karten aktualisieren
            const cards = document.querySelectorAll('.status-card');
            cards[0].className = 'status-card ' + (data.antiRuleBreakActive ? 'active' : 'inactive');
            cards[1].className = 'status-card ' + (data.agentsActive ? 'active' : 'inactive');
            cards[2].className = 'status-card ' + (data.enterpriseRulesLoaded ? 'active' : 'inactive');
            cards[3].className = 'status-card ' + (data.monitoringActive ? 'active' : 'inactive');
            cards[4].className = 'status-card ' + (data.cursorIntegrationActive ? 'active' : 'inactive');
            cards[5].className = 'status-card ' + (data.daemonRunning ? 'active' : 'inactive');

            // Werte aktualisieren
            cards[0].querySelector('.status-value').textContent = data.antiRuleBreakActive ? 'AKTIV' : 'INAKTIV';
            cards[1].querySelector('.status-value').textContent = data.agentsActive ? 'AKTIV' : 'INAKTIV';
            cards[2].querySelector('.status-value').textContent = data.enterpriseRulesLoaded ? 'GELADEN' : 'NICHT GELADEN';
            cards[3].querySelector('.status-value').textContent = data.monitoringActive ? 'AKTIV' : 'INAKTIV';
            cards[4].querySelector('.status-value').textContent = data.cursorIntegrationActive ? 'AKTIV' : 'INAKTIV';
            cards[5].querySelector('.status-value').textContent = data.daemonRunning ? 'AKTIV' : 'INAKTIV';

            // Startup-Zeit aktualisieren
            cards[6].querySelector('.status-value').textContent = data.startupTime || 'Nicht verfügbar';
            cards[7].querySelector('.status-value').textContent = data.errorCount;
            cards[8].querySelector('.status-value').textContent = data.violationCount;

            // Regelverstöße aktualisieren
            const violationsTable = document.getElementById('violationsTable');
            if (data.violations && data.violations.length > 0) {
                const violationsList = data.violations.slice(-10).map(v => 
                    '<tr><td>' + v.timestamp + '</td><td>' + v.filename + '</td><td>' + v.reason + '</td><td>' + (v.blocked ? '🚫 BLOCKIERT' : '✅ ERLAUBT') + '</td></tr>'
                ).join('');
                violationsTable.innerHTML = violationsList;
            } else {
                violationsTable.innerHTML = '<tr><td colspan="4">Keine Regelverstöße</td></tr>';
            }

            // Zeitstempel aktualisieren
            document.getElementById('lastUpdate').textContent = 'Letzte Aktualisierung: ' + data.lastUpdate;
            document.getElementById('currentTime').textContent = new Date().toLocaleString('de-DE');
        }

        // Automatische Aktualisierung alle 5 Sekunden
        setInterval(refreshStatus, 5000);

        // Initial laden
        refreshStatus();
    </script>
</body>
</html>
    `;
}

/**
 * 📊 Status laden
 */
function loadStatus() {
  const daemonStatusFile = path.join(__dirname, "../data/anti-rule-break-daemon-status.json");
  const normalStatusFile = path.join(__dirname, "../data/anti-rule-break-status.json");

  if (fs.existsSync(daemonStatusFile)) {
    const statusData = JSON.parse(fs.readFileSync(daemonStatusFile, "utf8"));
    Object.assign(systemStatus, statusData);
    violations = statusData.violations || [];
  } else if (fs.existsSync(normalStatusFile)) {
    const statusData = JSON.parse(fs.readFileSync(normalStatusFile, "utf8"));
    Object.assign(systemStatus, statusData);
    violations = statusData.violations || [];
  }
}

/**
 * 🔄 Status aktualisieren
 */
function updateStatus() {
  loadStatus();
  console.log("📊 Dashboard Status aktualisiert:", new Date().toISOString());
}

// 🚀 Dashboard starten
if (require.main === module) {
  console.log("🛡️ Anti-Regelbruch-System Dashboard wird gestartet...");

  // Status laden
  loadStatus();

  // Dashboard Server starten
  startDashboardServer();

  // Status alle 5 Sekunden aktualisieren
  setInterval(updateStatus, 5000);

  console.log("✅ Dashboard ist bereit");
  console.log(`🌐 Öffnen Sie: http://localhost:${PORT}`);
}

module.exports = {
  startDashboardServer,
  generateDashboardHTML,
  loadStatus,
  updateStatus,
};
