import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
// import { MySQLComplianceSystem } from "./compliance-system-mysql"; // TODO: Compliance-System implementieren

// DSGVO-Regel Interface
export interface DSGVORule {
  id: number;
  rule_name: string;
  rule_description: string;
  rule_category: string;
  rule_type: "REQUIRED" | "RECOMMENDED" | "OPTIONAL";
  rule_source: string;
  enforcement_level: "BLOCK" | "WARN" | "INFO";
}

// KI-Chat-Aktivität Interface
export interface KIChatActivity {
  id: string;
  agent_name: string;
  user_input: string;
  ai_response: string;
  timestamp: Date;
  compliance_status: "COMPLIANT" | "NON_COMPLIANT" | "WARNING" | "UNKNOWN";
  violations: DSGVOViolation[];
  scan_id?: number;
}

// DSGVO-Verstoß Interface
export interface DSGVOViolation {
  rule_id: number;
  rule_name: string;
  violation_type:
    | "DATA_COLLECTION"
    | "PRIVACY_NOTICE"
    | "CONSENT"
    | "DATA_RETENTION"
    | "USER_RIGHTS"
    | "SECURITY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  suggestion: string;
  detected_in: "USER_INPUT" | "AI_RESPONSE" | "BOTH";
}

interface ComplianceSystem {
  initialize(): Promise<void>;
  getDSGVORules(): Promise<DSGVORule[]>;
  close(): Promise<void>;
}

// DSGVO Enforcement System
export class DSGVOEnforcementSystem {
  private complianceSystem: ComplianceSystem;
  private rules: DSGVORule[] = [];
  private mdRules: Map<string, string> = new Map();
  private projectRoot: string;
  private knownDSGVOPages: Set<string> = new Set();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    // TODO: Compliance-System implementieren
    // this.complianceSystem = createComplianceSystemMySQL();
    this.complianceSystem = {
      initialize: async () => {},
      getDSGVORules: async () => [],
      close: async () => {},
    };
    this.initializeKnownPages();
  }

  // Bekannte DSGVO-Seiten initialisieren
  private initializeKnownPages(): void {
    this.knownDSGVOPages.add("datenschutz");
    this.knownDSGVOPages.add("impressum");
    this.knownDSGVOPages.add("cookie-einstellungen");
    this.knownDSGVOPages.add("privacy");
    this.knownDSGVOPages.add("legal");
    this.knownDSGVOPages.add("terms");
  }

  // System initialisieren
  async initialize(): Promise<void> {
    console.log("🔒 Initialisiere DSGVO-Enforcement-System...");

    // Compliance-System initialisieren
    await this.complianceSystem.initialize();

    // DSGVO-Regeln laden
    await this.loadDSGVORules();

    // .md-Dateien nach DSGVO-Regeln scannen
    await this.loadMDRules();

    console.log("✅ DSGVO-Enforcement-System bereit");
  }

  // DSGVO-Regeln aus Datenbank laden
  private async loadDSGVORules(): Promise<void> {
    try {
      this.rules = await this.complianceSystem.getDSGVORules();
      console.log(`📋 ${this.rules.length} DSGVO-Regeln geladen`);
    } catch (error) {
      console.error("❌ Fehler beim Laden der DSGVO-Regeln:", error);
    }
  }

  // .md-Dateien nach DSGVO-Regeln scannen
  private async loadMDRules(): Promise<void> {
    try {
      const mdFiles = glob.sync("**/*.md", {
        cwd: this.projectRoot,
        ignore: ["**/node_modules/**", "**/.git/**"],
      });

      for (const mdFile of mdFiles) {
        const fullPath = path.join(this.projectRoot, mdFile);
        const content = fs.readFileSync(fullPath, "utf8");

        // DSGVO-relevante Inhalte extrahieren
        const dsgvoContent = this.extractDSGVOContent(content);
        if (dsgvoContent) {
          this.mdRules.set(mdFile, dsgvoContent);
        }
      }

      console.log(`📚 ${this.mdRules.size} .md-Dateien mit DSGVO-Inhalten gefunden`);
    } catch (error) {
      console.error("❌ Fehler beim Laden der .md-Regeln:", error);
    }
  }

  // DSGVO-Inhalte aus .md-Dateien extrahieren
  private extractDSGVOContent(content: string): string | null {
    const dsgvoKeywords = [
      "dsgvo",
      "gdpr",
      "datenschutz",
      "privacy",
      "cookie",
      "consent",
      "einwilligung",
      "datenspeicherung",
      "betroffenenrechte",
      "auskunft",
      "löschung",
      "berichtigung",
      "widerspruch",
      "datensicherheit",
      "verschlüsselung",
      "ssl",
      "https",
      "impressum",
      "kontakt",
    ];

    const lines = content.split("\n");
    const relevantLines: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (dsgvoKeywords.some((keyword) => lowerLine.includes(keyword))) {
        relevantLines.push(line.trim());
      }
    }

    return relevantLines.length > 0 ? relevantLines.join("\n") : null;
  }

  // KI-Chat-Aktivität auf DSGVO-Konformität prüfen
  async checkKIChatCompliance(
    agentName: string,
    userInput: string,
    aiResponse: string,
  ): Promise<{
    isCompliant: boolean;
    violations: DSGVOViolation[];
    suggestions: string[];
  }> {
    const violations: DSGVOViolation[] = [];
    const suggestions: string[] = [];

    // 1. Prüfe User-Input auf DSGVO-Verstöße
    const inputViolations = this.checkInputCompliance(userInput);
    violations.push(...inputViolations);

    // 2. Prüfe AI-Response auf DSGVO-Verstöße
    const responseViolations = this.checkResponseCompliance(aiResponse);
    violations.push(...responseViolations);

    // 3. Prüfe gegen .md-Regeln
    const mdViolations = this.checkMDRulesCompliance(userInput, aiResponse);
    violations.push(...mdViolations);

    // 4. Generiere Verbesserungsvorschläge
    suggestions.push(...this.generateComplianceSuggestions(violations));

    const isCompliant =
      violations.filter((v) => v.severity === "CRITICAL" || v.severity === "HIGH").length === 0;

    return { isCompliant, violations, suggestions };
  }

  // User-Input auf DSGVO-Konformität prüfen
  private checkInputCompliance(userInput: string): DSGVOViolation[] {
    const violations: DSGVOViolation[] = [];
    const input = userInput.toLowerCase();

    // Prüfe auf sensible Daten im Input
    const sensitiveDataPatterns = [
      { pattern: /\b\d{16}\b/, type: "CREDIT_CARD", rule: "Datensicherheit" },
      {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        type: "EMAIL",
        rule: "Datenschutz",
      },
      { pattern: /\b\d{11}\b/, type: "PERSONAL_ID", rule: "Datensicherheit" },
    ];

    for (const pattern of sensitiveDataPatterns) {
      if (pattern.pattern.test(input)) {
        violations.push({
          rule_id: 0,
          rule_name: pattern.rule,
          violation_type: "DATA_COLLECTION",
          severity: "HIGH",
          description: `Sensible Daten (${pattern.type}) im User-Input erkannt`,
          suggestion: "Sensible Daten sollten nicht in Chat-Inputs verwendet werden",
          detected_in: "USER_INPUT",
        });
      }
    }

    return violations;
  }

  // AI-Response auf DSGVO-Konformität prüfen
  private checkResponseCompliance(aiResponse: string): DSGVOViolation[] {
    const violations: DSGVOViolation[] = [];
    const response = aiResponse.toLowerCase();

    // Prüfe auf DSGVO-Verstöße in der AI-Antwort
    const dsgvoViolations = [
      {
        keyword: "personenbezogene daten",
        severity: "MEDIUM",
        description: "Personenbezogene Daten in AI-Antwort",
        suggestion: "Vermeiden Sie die Verarbeitung personenbezogener Daten ohne Rechtsgrundlage",
      },
      {
        keyword: "cookie ohne consent",
        severity: "HIGH",
        description: "Cookie-Verwendung ohne Einwilligung",
        suggestion: "Cookies nur mit expliziter Einwilligung verwenden",
      },
      {
        keyword: "tracking ohne hinweis",
        severity: "HIGH",
        description: "Tracking ohne Datenschutzhinweis",
        suggestion: "Tracking-Tools nur mit Datenschutzhinweis verwenden",
      },
    ];

    for (const violation of dsgvoViolations) {
      if (response.includes(violation.keyword)) {
        violations.push({
          rule_id: 0,
          rule_name: "DSGVO-Compliance",
          violation_type: "PRIVACY_NOTICE",
          severity: violation.severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          description: violation.description,
          suggestion: violation.suggestion,
          detected_in: "AI_RESPONSE",
        });
      }
    }

    return violations;
  }

  // Prüfe gegen .md-Regeln
  private checkMDRulesCompliance(userInput: string, aiResponse: string): DSGVOViolation[] {
    const violations: DSGVOViolation[] = [];

    for (const [mdFile, content] of this.mdRules) {
      const rules = this.parseMDRules(content);

      for (const rule of rules) {
        const violation = this.checkMDRule(rule, userInput, aiResponse, mdFile);
        if (violation) {
          violations.push(violation);
        }
      }
    }

    return violations;
  }

  // .md-Regeln parsen
  private parseMDRules(
    mdContent: string,
  ): Array<{ type: string; content: string; severity: string }> {
    const rules: Array<{ type: string; content: string; severity: string }> = [];
    const lines = mdContent.split("\n");

    for (const line of lines) {
      if (line.startsWith("## DSGVO-Regel:")) {
        const ruleMatch = line.match(/## DSGVO-Regel: (.+)/);
        if (ruleMatch) {
          rules.push({
            type: ruleMatch[1],
            content: line,
            severity: "MEDIUM",
          });
        }
      }
    }

    return rules;
  }

  // Einzelne .md-Regel prüfen
  private checkMDRule(
    rule: { type: string; content: string; severity: string },
    userInput: string,
    aiResponse: string,
    mdFile: string,
  ): DSGVOViolation | null {
    const combinedText = `${userInput} ${aiResponse}`.toLowerCase();
    const ruleContent = rule.content.toLowerCase();

    // Prüfe ob die Regel verletzt wird
    if (ruleContent.includes("cookie") && !combinedText.includes("consent")) {
      return {
        rule_id: 0,
        rule_name: rule.type,
        violation_type: "CONSENT",
        severity: rule.severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
        description: `Cookie-Regel aus ${mdFile} verletzt`,
        suggestion: "Cookie-Einwilligung implementieren",
        detected_in: "BOTH",
      };
    }

    return null;
  }

  // Verbesserungsvorschläge generieren
  private generateComplianceSuggestions(violations: DSGVOViolation[]): string[] {
    const suggestions: string[] = [];

    // Basierend auf Verstößen spezifische Vorschläge
    const violationTypes = violations.map((v) => v.violation_type);

    if (violationTypes.includes("CONSENT")) {
      suggestions.push("🔒 Cookie-Consent-Banner implementieren");
      suggestions.push("📋 Opt-in/Opt-out-Mechanismus für Cookies einrichten");
    }

    if (violationTypes.includes("PRIVACY_NOTICE")) {
      suggestions.push("📄 Datenschutzerklärung überprüfen und aktualisieren");
      suggestions.push("🔍 Datenschutzhinweise bei Formularen ergänzen");
    }

    if (violationTypes.includes("DATA_COLLECTION")) {
      suggestions.push("🛡️ Datenminimierung implementieren");
      suggestions.push("⚖️ Rechtsgrundlagen für Datenverarbeitung dokumentieren");
    }

    if (violationTypes.includes("USER_RIGHTS")) {
      suggestions.push("👤 Betroffenenrechte (Auskunft, Löschung) implementieren");
      suggestions.push("📧 Kontaktmöglichkeit für Datenschutzanfragen einrichten");
    }

    // Allgemeine DSGVO-Empfehlungen
    if (suggestions.length === 0) {
      suggestions.push("✅ DSGVO-Compliance ist gut - regelmäßige Überprüfung empfohlen");
    }

    return suggestions;
  }

  // Compliance-Bericht generieren
  async generateComplianceReport(agentName: string, activities: KIChatActivity[]): Promise<string> {
    let report = `# DSGVO-Compliance-Bericht für ${agentName}\n\n`;
    report += `**Generiert am:** ${new Date().toLocaleDateString("de-DE")}\n\n`;

    // Statistiken
    const totalActivities = activities.length;
    const compliantActivities = activities.filter(
      (a) => a.compliance_status === "COMPLIANT",
    ).length;
    const nonCompliantActivities = activities.filter(
      (a) => a.compliance_status === "NON_COMPLIANT",
    ).length;
    const warningActivities = activities.filter((a) => a.compliance_status === "WARNING").length;

    report += `## 📊 Übersicht\n\n`;
    report += `- **Gesamtaktivitäten:** ${totalActivities}\n`;
    report += `- **Konforme Aktivitäten:** ${compliantActivities}\n`;
    report += `- **Nicht-konforme Aktivitäten:** ${nonCompliantActivities}\n`;
    report += `- **Warnungen:** ${warningActivities}\n\n`;

    // Verstöße nach Schweregrad
    const allViolations = activities.flatMap((a) => a.violations);
    const criticalViolations = allViolations.filter((v) => v.severity === "CRITICAL");
    const highViolations = allViolations.filter((v) => v.severity === "HIGH");
    const mediumViolations = allViolations.filter((v) => v.severity === "MEDIUM");
    const lowViolations = allViolations.filter((v) => v.severity === "LOW");

    report += `## 🚨 Verstöße nach Schweregrad\n\n`;
    report += `- **Kritisch:** ${criticalViolations.length}\n`;
    report += `- **Hoch:** ${highViolations.length}\n`;
    report += `- **Mittel:** ${mediumViolations.length}\n`;
    report += `- **Niedrig:** ${lowViolations.length}\n\n`;

    // Empfehlungen
    report += `## 💡 Empfehlungen\n\n`;
    if (criticalViolations.length > 0) {
      report += `🚨 **Kritische Verstöße sofort beheben:**\n`;
      criticalViolations.forEach((v) => {
        report += `- ${v.description}\n`;
      });
      report += `\n`;
    }

    if (highViolations.length > 0) {
      report += `⚠️ **Hohe Verstöße priorisiert behandeln:**\n`;
      highViolations.forEach((v) => {
        report += `- ${v.description}\n`;
      });
      report += `\n`;
    }

    return report;
  }

  // System schließen
  async close(): Promise<void> {
    await this.complianceSystem.close();
  }
}

export const createDSGVOEnforcement = (projectRoot?: string) =>
  new DSGVOEnforcementSystem(projectRoot);
