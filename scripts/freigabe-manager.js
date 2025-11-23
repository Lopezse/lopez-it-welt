#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class FreigabeManager {
  constructor() {
    this.freigabeDatei = path.join(__dirname, "../data/freigabe-status.json");
  }

  freigabeAktivieren() {
    const status = {
      aktiv: true,
      letztePruefung: new Date().toISOString(),
      freigegebenSeit: new Date().toISOString(),
      freigegebenVon: "Benutzer",
    };

    fs.writeFileSync(this.freigabeDatei, JSON.stringify(status, null, 2));
    console.log("✅ Freigabe aktiviert - KI-Aktionen erlaubt");
  }

  freigabeDeaktivieren() {
    const status = {
      aktiv: false,
      letztePruefung: new Date().toISOString(),
      blockiertSeit: new Date().toISOString(),
      grund: "KI-Aktionen erfordern explizite Freigabe",
    };

    fs.writeFileSync(this.freigabeDatei, JSON.stringify(status, null, 2));
    console.log("🚫 Freigabe deaktiviert - KI-Aktionen blockiert");
  }

  statusAnzeigen() {
    try {
      const data = fs.readFileSync(this.freigabeDatei, "utf8");
      const status = JSON.parse(data);
      console.log("📊 Freigabe-Status:", status.aktiv ? "AKTIV" : "BLOCKIERT");
      console.log("Details:", status);
    } catch (error) {
      console.log("❌ Fehler beim Lesen des Status");
    }
  }
}

// CLI-Befehle
if (require.main === module) {
  const manager = new FreigabeManager();
  const command = process.argv[2];

  switch (command) {
    case "aktivieren":
      manager.freigabeAktivieren();
      break;
    case "deaktivieren":
      manager.freigabeDeaktivieren();
      break;
    case "status":
      manager.statusAnzeigen();
      break;
    default:
      console.log("Verwendung: node freigabe-manager.js [aktivieren|deaktivieren|status]");
  }
}

module.exports = FreigabeManager;
