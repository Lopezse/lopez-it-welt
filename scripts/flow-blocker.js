const fs = require("fs");
const path = require("path");

class FlowBlocker {
  constructor() {
    this.projectRoot = process.cwd();
    this.stepCounter = 0;
    this.maxStepsBeforeCheck = 5;
    this.lastStatusCheck = Date.now();
    this.requiredFiles = [
      "START.md",
      "PROJECT.md",
      "QualityController.md",
      "STATUS.md",
      "CursorGuide.md",
    ];
  }

  // 🚨 HAUPTFUNKTION: Prüfe alle 5 Schritte
  async checkFlow(action = "unknown") {
    this.stepCounter++;

    console.log(`🔍 FLOW CHECK: Schritt ${this.stepCounter}/${this.maxStepsBeforeCheck}`);

    // Prüfe alle 5 Schritte oder wenn 2 Stunden vergangen sind
    const timeSinceLastCheck = Date.now() - this.lastStatusCheck;
    const twoHours = 2 * 60 * 60 * 1000; // 2 Stunden in Millisekunden

    if (this.stepCounter >= this.maxStepsBeforeCheck || timeSinceLastCheck >= twoHours) {
      console.log("🚨 FLOW BLOCKER: Prüfung erforderlich...");

      const violations = await this.performFullCheck();

      if (violations.length > 0) {
        await this.blockFlow(violations, action);
        return false;
      }

      // Reset Counter und Update Zeitstempel
      this.stepCounter = 0;
      this.lastStatusCheck = Date.now();

      console.log("✅ FLOW CHECK: Alle Regeln eingehalten - Weiterarbeit erlaubt");
    }

    return true;
  }

  // Vollständige Prüfung durchführen
  async performFullCheck() {
    const violations = [];

    // 1. Prüfe Pflichtdateien
    const missingFiles = this.checkRequiredFiles();
    if (missingFiles.length > 0) {
      violations.push({
        type: "MISSING_REQUIRED_FILES",
        files: missingFiles,
        severity: "CRITICAL",
        message: "Pflichtdateien fehlen - Projekt nicht konform",
      });
    }

    // 2. Prüfe STATUS.md Aktualität
    const statusViolation = this.checkStatusUpdate();
    if (statusViolation) {
      violations.push(statusViolation);
    }

    // 3. Prüfe CursorGuide.md Compliance
    const guideViolations = this.checkCursorGuideCompliance();
    violations.push(...guideViolations);

    // 4. Prüfe QualityController.md Compliance
    const qualityViolations = this.checkQualityCompliance();
    violations.push(...qualityViolations);

    return violations;
  }

  // Prüfe Pflichtdateien
  checkRequiredFiles() {
    const missing = [];
    for (const file of this.requiredFiles) {
      if (!fs.existsSync(path.join(this.projectRoot, file))) {
        missing.push(file);
      }
    }
    return missing;
  }

  // Prüfe STATUS.md Aktualität
  checkStatusUpdate() {
    const statusPath = path.join(this.projectRoot, "STATUS.md");
    if (!fs.existsSync(statusPath)) {
      return {
        type: "STATUS_MD_MISSING",
        severity: "CRITICAL",
        message: "STATUS.md fehlt - muss sofort erstellt werden",
      };
    }

    const stats = fs.statSync(statusPath);
    const now = new Date();
    const lastModified = new Date(stats.mtime);
    const hoursSinceUpdate = (now - lastModified) / (1000 * 60 * 60);

    if (hoursSinceUpdate > 2) {
      // Max 2 Stunden ohne Update
      return {
        type: "STATUS_MD_OUTDATED",
        severity: "WARNING",
        message: `STATUS.md nicht aktualisiert seit ${Math.round(hoursSinceUpdate)} Stunden`,
        hoursSinceUpdate,
      };
    }

    return null;
  }

  // Prüfe CursorGuide.md Compliance
  checkCursorGuideCompliance() {
    const violations = [];
    const guidePath = path.join(this.projectRoot, "CursorGuide.md");

    if (!fs.existsSync(guidePath)) {
      violations.push({
        type: "CURSOR_GUIDE_MISSING",
        severity: "CRITICAL",
        message: "CursorGuide.md fehlt - KI-Regeln nicht definiert",
      });
      return violations;
    }

    const content = fs.readFileSync(guidePath, "utf8");

    // Prüfe ob alle wichtigen Regeln definiert sind
    const requiredRules = [
      "VERBINDLICHE REGELN",
      "PFLICHT-CHECKLISTE",
      "VERBOTENE AKTIONEN",
      "WORKFLOW-PROZESS",
      "STATUS-TRACKING",
    ];

    for (const rule of requiredRules) {
      if (!content.includes(rule)) {
        violations.push({
          type: "CURSOR_GUIDE_INCOMPLETE",
          rule,
          severity: "WARNING",
          message: `CursorGuide.md unvollständig: ${rule} fehlt`,
        });
      }
    }

    return violations;
  }

  // Prüfe QualityController.md Compliance
  checkQualityCompliance() {
    const violations = [];
    const qualityPath = path.join(this.projectRoot, "QualityController.md");

    if (!fs.existsSync(qualityPath)) {
      violations.push({
        type: "QUALITY_CONTROLLER_MISSING",
        severity: "CRITICAL",
        message: "QualityController.md fehlt - Qualitätsstandards nicht definiert",
      });
      return violations;
    }

    const content = fs.readFileSync(qualityPath, "utf8");

    // Prüfe ob strict mode aktiviert ist
    if (!content.includes('"strict": true')) {
      violations.push({
        type: "STRICT_MODE_DISABLED",
        severity: "WARNING",
        message: "Strict Mode nicht aktiviert in QualityController.md",
      });
    }

    return violations;
  }

  // Flow blockieren bei Verletzungen
  async blockFlow(violations, action) {
    console.log("🚨 FLOW BLOCKED: Regelverletzungen erkannt");
    console.log("");
    console.log("❌ ERKANNTE VERLETZUNGEN:");
    violations.forEach((v) => {
      console.log(`  - ${v.type}: ${v.message}`);
    });
    console.log("");
    console.log("🔧 ERFORDERLICHE AKTIONEN:");
    violations.forEach((v) => {
      console.log(`  - ${this.getRequiredAction(v)}`);
    });
    console.log("");
    console.log("📝 STATUS.md wird automatisch aktualisiert...");

    // STATUS.md Update erzwingen
    await this.forceStatusUpdate(violations, action);

    console.log("");
    console.log('⏸️ FLOW PAUSIERT - Bitte beheben Sie die Verletzungen und geben Sie "GO" ein');
    console.log("");
    console.log("💡 Tipps:");
    console.log("  - Prüfen Sie STATUS.md für Details");
    console.log("  - Führen Sie node scripts/enforce-rules.js auto-correct aus");
    console.log("  - Stellen Sie sicher, dass alle Pflichtdateien vorhanden sind");
    console.log("  - Aktualisieren Sie STATUS.md manuell wenn nötig");
  }

  // Erzwinge STATUS.md Update
  async forceStatusUpdate(violations, action) {
    const statusPath = path.join(this.projectRoot, "STATUS.md");
    const timestamp = new Date().toISOString();

    let statusContent = "";
    if (fs.existsSync(statusPath)) {
      statusContent = fs.readFileSync(statusPath, "utf8");
    }

    // Erstelle neuen Eintrag
    const updatedContent = `# 📊 Projektstatus & Qualitätskontrolle

## 🚨 FLOW BLOCKER - ${timestamp}

### ⚠️ **FLOW GESTOPPT - REGELVERLETZUNGEN**

**Aktion:** ${action}
**Zeitstempel:** ${timestamp}
**Status:** ❌ FLOW BLOCKED
**Schritt:** ${this.stepCounter}/${this.maxStepsBeforeCheck}

#### **Erkannte Verletzungen:**

${violations.map((v) => `- **${v.type}** (${v.severity}): ${v.message}`).join("\n")}

#### **Erforderte Aktionen:**

${violations.map((v) => this.getRequiredAction(v)).join("\n")}

#### **Flow-Status:**
- **Status:** ⏸️ PAUSIERT
- **Grund:** Regelverletzungen erkannt
- **Nächster Schritt:** Verletzungen beheben
- **Freigabe erforderlich:** "GO" vom Nutzer

#### **Automatische Korrekturen verfügbar:**
\`\`\`bash
node scripts/enforce-rules.js auto-correct
\`\`\`

---

${statusContent}`;

    // Schreibe aktualisierte STATUS.md
    fs.writeFileSync(statusPath, updatedContent);

    console.log("✅ STATUS.md aktualisiert");
  }

  // Erforderte Aktion für Verletzung
  getRequiredAction(violation) {
    switch (violation.type) {
      case "MISSING_REQUIRED_FILES":
        return "Alle Pflichtdateien müssen erstellt werden";
      case "STATUS_MD_MISSING":
        return "STATUS.md muss sofort erstellt werden";
      case "STATUS_MD_OUTDATED":
        return "STATUS.md muss aktualisiert werden";
      case "CURSOR_GUIDE_MISSING":
        return "CursorGuide.md muss erstellt werden";
      case "CURSOR_GUIDE_INCOMPLETE":
        return `CursorGuide.md vervollständigen: ${violation.rule}`;
      case "QUALITY_CONTROLLER_MISSING":
        return "QualityController.md muss erstellt werden";
      case "STRICT_MODE_DISABLED":
        return "Strict Mode muss aktiviert werden";
      default:
        return "Unbekannte Verletzung - manuelle Prüfung erforderlich";
    }
  }

  // Flow fortsetzen nach Korrektur
  async resumeFlow() {
    console.log("🔄 FLOW RESUME: Prüfe Korrekturen...");

    const violations = await this.performFullCheck();

    if (violations.length > 0) {
      console.log("❌ FLOW STILL BLOCKED: Verletzungen noch vorhanden");
      violations.forEach((v) => {
        console.log(`  - ${v.type}: ${v.message}`);
      });
      return false;
    }

    // Reset Counter und Update Zeitstempel
    this.stepCounter = 0;
    this.lastStatusCheck = Date.now();

    console.log("✅ FLOW RESUMED: Alle Verletzungen behoben");

    // STATUS.md Update für Flow-Resume
    await this.forceStatusUpdate(
      [
        {
          type: "FLOW_RESUMED",
          severity: "INFO",
          message: "Flow erfolgreich fortgesetzt nach Korrektur",
        },
      ],
      "flow-resume",
    );

    return true;
  }

  // Manuelle Prüfung
  async manualCheck() {
    console.log("🔍 MANUAL CHECK: Vollständige Prüfung...");

    const violations = await this.performFullCheck();

    if (violations.length > 0) {
      console.log("❌ VERLETZUNGEN ERKANNT:");
      violations.forEach((v) => {
        console.log(`  - ${v.type}: ${v.message}`);
      });
      return false;
    }

    console.log("✅ ALLE REGELN EINGEHALTEN");
    return true;
  }

  // Status anzeigen
  showStatus() {
    console.log("📊 FLOW BLOCKER STATUS:");
    console.log(`  - Schritt: ${this.stepCounter}/${this.maxStepsBeforeCheck}`);
    console.log(`  - Letzte Prüfung: ${new Date(this.lastStatusCheck).toLocaleString("de-DE")}`);
    console.log(`  - Nächste Prüfung: ${this.maxStepsBeforeCheck - this.stepCounter} Schritte`);

    const timeSinceLastCheck = Date.now() - this.lastStatusCheck;
    const twoHours = 2 * 60 * 60 * 1000;
    const timeUntilNextCheck = twoHours - timeSinceLastCheck;

    if (timeUntilNextCheck > 0) {
      const hours = Math.floor(timeUntilNextCheck / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNextCheck % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`  - Zeit bis nächste Prüfung: ${hours}h ${minutes}m`);
    } else {
      console.log(`  - Zeitbasierte Prüfung überfällig`);
    }
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const blocker = new FlowBlocker();

  const command = process.argv[2];

  switch (command) {
    case "check":
      blocker.checkFlow("manual");
      break;
    case "resume":
      blocker.resumeFlow();
      break;
    case "manual":
      blocker.manualCheck();
      break;
    case "status":
      blocker.showStatus();
      break;
    default:
      console.log("🚨 Flow Blocker System");
      console.log("");
      console.log("Verwendung:");
      console.log("  node flow-blocker.js check    - Prüfung durchführen");
      console.log("  node flow-blocker.js resume   - Flow fortsetzen");
      console.log("  node flow-blocker.js manual   - Manuelle Prüfung");
      console.log("  node flow-blocker.js status   - Status anzeigen");
  }
}

module.exports = FlowBlocker;
