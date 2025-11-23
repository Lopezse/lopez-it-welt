#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class KIWorkflowBlocker {
  constructor() {
    this.freigabeDatei = path.join(__dirname, "../data/freigabe-status.json");
    this.aktiv = true;
    this.init();
  }

  init() {
    // Erstelle Freigabe-Datei falls nicht vorhanden
    if (!fs.existsSync(this.freigabeDatei)) {
      this.speichereStatus({
        aktiv: true,
        letztePruefung: new Date().toISOString(),
      });
    }

    // Prüfe alle 5 Sekunden auf Freigabe-Status
    setInterval(() => this.pruefeFreigabe(), 5000);
  }

  speichereStatus(status) {
    fs.writeFileSync(this.freigabeDatei, JSON.stringify(status, null, 2));
  }

  ladeStatus() {
    try {
      const data = fs.readFileSync(this.freigabeDatei, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return { aktiv: true, letztePruefung: new Date().toISOString() };
    }
  }

  pruefeFreigabe() {
    const status = this.ladeStatus();
    this.aktiv = status.aktiv;

    if (!this.aktiv) {
      console.log("🚫 KI-Workflow blockiert - Warte auf Freigabe...");
      process.exit(1);
    }
  }

  blockiereAktion(aktion, datei) {
    const status = this.ladeStatus();

    if (!status.aktiv) {
      throw new Error(`🚫 Aktion blockiert: ${aktion} auf ${datei} - Keine Freigabe vorhanden`);
    }

    console.log(`✅ Freigabe vorhanden für: ${aktion} auf ${datei}`);
    return true;
  }
}

// Exportiere für andere Skripte
if (typeof module !== "undefined" && module.exports) {
  module.exports = KIWorkflowBlocker;
}

// Starte Blocker wenn direkt ausgeführt
if (require.main === module) {
  const blocker = new KIWorkflowBlocker();
  console.log("🔒 KI-Workflow-Blocker aktiv");
}
