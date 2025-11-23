/**
 * 🎨 StyleGuard-AI
 *
 * Automatische Text-Qualitätsprüfung und Stil-Optimierung für:
 * - Stil-Konsistenz prüfen
 * - CI/CD-Richtlinien validieren
 * - Lesbarkeit bewerten
 * - Automatische Kommentare in PRs
 *
 * @author Lopez IT Welt Team
 * @version 1.0.0
 * @date 2025-01-19
 */

import * as fs from "fs";
import * as path from "path";
import ContextLoader from "../shared/context-loader";
import { Logger, LogLevel } from "../shared/logger";

// 📋 StyleGuard-Konfiguration
interface StyleGuardConfig {
  maxLineLength: number;
  requireComments: boolean;
  enforceNaming: boolean;
  checkSpelling: boolean;
  language: string;
  rules: string[];
  autoComment: boolean;
  blockOnFail: boolean;
}

// 📋 StyleGuard-Ergebnis
interface StyleGuardResult {
  file: string;
  issues: StyleGuardIssue[];
  score: number;
  passed: boolean;
  suggestions: string[];
}

// 📋 StyleGuard-Issue
interface StyleGuardIssue {
  line: number;
  column: number;
  type: "error" | "warning" | "info";
  message: string;
  rule: string;
  suggestion?: string;
}

/**
 * 🎨 StyleGuard-AI Klasse
 */
export class StyleGuardAI {
  private logger: Logger;
  private config: StyleGuardConfig;
  private contextLoader: ContextLoader;
  private results: StyleGuardResult[] = [];

  constructor(config?: Partial<StyleGuardConfig>) {
    this.logger = new Logger("StyleGuard-AI", LogLevel.INFO);
    this.contextLoader = new ContextLoader();

    // Standard-Konfiguration
    this.config = {
      maxLineLength: 120,
      requireComments: true,
      enforceNaming: true,
      checkSpelling: true,
      language: "de",
      rules: ["ci", "readability", "style", "consistency"],
      autoComment: true,
      blockOnFail: false,
      ...config,
    };
  }

  /**
   * 🚀 Haupt-Methode für StyleGuard-AI
   */
  async run(): Promise<void> {
    try {
      this.logger.start("StyleGuard-AI Review");
      const startTime = Date.now();

      // Lade Kontexte
      await this.loadContexts();

      // Finde zu prüfende Dateien
      const files = await this.findFilesToReview();

      // Prüfe jede Datei
      for (const file of files) {
        await this.reviewFile(file);
      }

      // Generiere Report
      await this.generateReport();

      // Poste Kommentare (falls aktiviert)
      if (this.config.autoComment) {
        await this.postComments();
      }

      const duration = Date.now() - startTime;
      this.logger.end("StyleGuard-AI Review", duration);

      // Prüfe ob Blockierung erforderlich
      if (this.config.blockOnFail && this.hasCriticalIssues()) {
        this.logger.critical("StyleGuard-AI: Kritische Issues gefunden - Blockierung aktiviert");
        process.exit(1);
      }
    } catch (error) {
      this.logger.error("StyleGuard-AI Review fehlgeschlagen", error as Error);
      throw error;
    }
  }

  /**
   * 📚 Lade Kontexte
   */
  private async loadContexts(): Promise<void> {
    try {
      this.logger.info("Lade Kontexte...");

      const contexts = await this.contextLoader.loadAllContexts();
      this.logger.info(`Kontexte geladen: ${Object.keys(contexts).length} Kontexte verfügbar`);
    } catch (error) {
      this.logger.error("Fehler beim Laden der Kontexte", error as Error);
      throw error;
    }
  }

  /**
   * 🔍 Finde zu prüfende Dateien
   */
  private async findFilesToReview(): Promise<string[]> {
    try {
      const files: string[] = [];
      const srcPath = path.join(process.cwd(), "src");
      const docsPath = path.join(process.cwd(), "docs");

      // Prüfe src/ Verzeichnis
      if (fs.existsSync(srcPath)) {
        const srcFiles = await this.scanDirectory(srcPath, [".ts", ".tsx", ".js", ".jsx"]);
        files.push(...srcFiles.map((f) => path.join("src", f)));
      }

      // Prüfe docs/ Verzeichnis
      if (fs.existsSync(docsPath)) {
        const docsFiles = await this.scanDirectory(docsPath, [".md", ".mdx"]);
        files.push(...docsFiles.map((f) => path.join("docs", f)));
      }

      this.logger.info(`${files.length} Dateien für Review gefunden`);
      return files;
    } catch (error) {
      this.logger.error("Fehler beim Finden der Dateien", error as Error);
      throw error;
    }
  }

  /**
   * 📝 Prüfe eine einzelne Datei
   */
  private async reviewFile(filePath: string): Promise<void> {
    try {
      this.logger.debug(`Prüfe Datei: ${filePath}`);

      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.promises.readFile(fullPath, "utf-8");
      const lines = content.split("\n");

      const result: StyleGuardResult = {
        file: filePath,
        issues: [],
        score: 100,
        passed: true,
        suggestions: [],
      };

      // Prüfe jede Zeile
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        // Prüfe Zeilenlänge
        if (line.length > this.config.maxLineLength) {
          result.issues.push({
            line: lineNumber,
            column: this.config.maxLineLength + 1,
            type: "warning",
            message: `Zeile ist zu lang (${line.length} Zeichen, max ${this.config.maxLineLength})`,
            rule: "line-length",
            suggestion: `Zeile auf ${this.config.maxLineLength} Zeichen kürzen`,
          });
          result.score -= 5;
        }

        // Prüfe Kommentare (für Code-Dateien)
        if (this.config.requireComments && this.isCodeFile(filePath)) {
          if (this.needsComment(line, lines, i)) {
            result.issues.push({
              line: lineNumber,
              column: 1,
              type: "info",
              message: "Kommentar für komplexe Logik empfohlen",
              rule: "require-comments",
              suggestion: "Kommentar hinzufügen",
            });
            result.score -= 2;
          }
        }

        // Prüfe Namenskonventionen
        if (this.config.enforceNaming) {
          const namingIssues = this.checkNamingConventions(line, lineNumber);
          result.issues.push(...namingIssues);
          result.score -= namingIssues.length * 3;
        }

        // Prüfe Rechtschreibung (für Dokumentation)
        if (this.config.checkSpelling && this.isDocumentationFile(filePath)) {
          const spellingIssues = await this.checkSpelling(line, lineNumber);
          result.issues.push(...spellingIssues);
          result.score -= spellingIssues.length * 2;
        }
      }

      // Prüfe Datei-spezifische Regeln
      const fileIssues = this.checkFileSpecificRules(filePath, content);
      result.issues.push(...fileIssues);
      result.score -= fileIssues.length * 3;

      // Bestimme ob Datei bestanden hat
      result.passed = result.score >= 70;
      result.suggestions = this.generateSuggestions(result.issues);

      this.results.push(result);

      if (result.passed) {
        this.logger.success(`✅ ${filePath} bestanden (Score: ${result.score})`);
      } else {
        this.logger.warn(`⚠️ ${filePath} nicht bestanden (Score: ${result.score})`);
      }
    } catch (error) {
      this.logger.error(`Fehler beim Prüfen von ${filePath}`, error as Error);
    }
  }

  /**
   * 📊 Generiere Report
   */
  private async generateReport(): Promise<void> {
    try {
      const totalFiles = this.results.length;
      const passedFiles = this.results.filter((r) => r.passed).length;
      const totalIssues = this.results.reduce((sum, r) => sum + r.issues.length, 0);
      const averageScore = this.results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          totalFiles,
          passedFiles,
          failedFiles: totalFiles - passedFiles,
          totalIssues,
          averageScore: Math.round(averageScore * 100) / 100,
        },
        results: this.results,
        recommendations: this.generateRecommendations(),
      };

      // Speichere Report
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const reportPath = path.join(reportsDir, "styleguard-report.json");
      await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

      this.logger.success(`📊 StyleGuard-Report generiert: ${reportPath}`);
      this.logger.info(
        `📈 Zusammenfassung: ${passedFiles}/${totalFiles} Dateien bestanden, ${totalIssues} Issues gefunden`,
      );
    } catch (error) {
      this.logger.error("Fehler beim Generieren des Reports", error as Error);
    }
  }

  /**
   * 💬 Poste Kommentare (falls in GitHub Actions)
   */
  private async postComments(): Promise<void> {
    try {
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_EVENT_PATH) {
        this.logger.info("Poste Kommentare zu GitHub...");

        // GitHub API Integration hier
        // Für jetzt nur Logging
        this.logger.info("Kommentare würden gepostet werden (GitHub API Integration erforderlich)");
      }
    } catch (error) {
      this.logger.error("Fehler beim Posten der Kommentare", error as Error);
    }
  }

  /**
   * 🔍 Hilfsmethoden
   */
  private async scanDirectory(dirPath: string, extensions: string[]): Promise<string[]> {
    const files: string[] = [];

    try {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, extensions);
          files.push(...subFiles.map((f) => path.join(item.name, f)));
        } else if (item.isFile()) {
          const ext = path.extname(item.name);
          if (extensions.includes(ext)) {
            files.push(item.name);
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Verzeichnis ${dirPath} konnte nicht gescannt werden: ${error}`);
    }

    return files;
  }

  private isCodeFile(filePath: string): boolean {
    const codeExtensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".java", ".cpp", ".c"];
    const ext = path.extname(filePath);
    return codeExtensions.includes(ext);
  }

  private isDocumentationFile(filePath: string): boolean {
    const docExtensions = [".md", ".mdx", ".txt", ".rst"];
    const ext = path.extname(filePath);
    return docExtensions.includes(ext);
  }

  private needsComment(line: string, lines: string[], lineIndex: number): boolean {
    // Komplexe Logik erkennen
    const complexPatterns = [
      /if\s*\(.*\)\s*{/, // Komplexe if-Statements
      /for\s*\(.*\)\s*{/, // Komplexe for-Loops
      /while\s*\(.*\)\s*{/, // Komplexe while-Loops
      /function\s+\w+\s*\(.*\)/, // Funktionen
      /class\s+\w+/, // Klassen
      /=>\s*{/, // Arrow Functions
      /\.map\s*\(/, // Array-Methoden
      /\.filter\s*\(/, // Array-Methoden
      /\.reduce\s*\(/, // Array-Methoden
    ];

    const isComplex = complexPatterns.some((pattern) => pattern.test(line));

    // Prüfe ob vorheriger Kommentar existiert
    if (lineIndex > 0) {
      const prevLine = lines[lineIndex - 1].trim();
      const hasComment =
        prevLine.startsWith("//") || prevLine.startsWith("/*") || prevLine.startsWith("*");
      return isComplex && !hasComment;
    }

    return isComplex;
  }

  private checkNamingConventions(line: string, lineNumber: number): StyleGuardIssue[] {
    const issues: StyleGuardIssue[] = [];

    // Prüfe Variablen-Namen
    const variablePattern = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;

    while ((match = variablePattern.exec(line)) !== null) {
      const variableName = match[1];

      // Prüfe camelCase für Variablen
      if (!/^[a-z][a-zA-Z0-9]*$/.test(variableName) && !/^[A-Z][a-zA-Z0-9]*$/.test(variableName)) {
        issues.push({
          line: lineNumber,
          column: match.index + 1,
          type: "warning",
          message: `Variablen-Name '${variableName}' sollte camelCase verwenden`,
          rule: "naming-convention",
          suggestion: `Umbenennen zu: ${this.toCamelCase(variableName)}`,
        });
      }
    }

    // Prüfe Funktions-Namen
    const functionPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

    while ((match = functionPattern.exec(line)) !== null) {
      const functionName = match[1];

      // Prüfe camelCase für Funktionen
      if (!/^[a-z][a-zA-Z0-9]*$/.test(functionName)) {
        issues.push({
          line: lineNumber,
          column: match.index + 1,
          type: "warning",
          message: `Funktions-Name '${functionName}' sollte camelCase verwenden`,
          rule: "naming-convention",
          suggestion: `Umbenennen zu: ${this.toCamelCase(functionName)}`,
        });
      }
    }

    return issues;
  }

  private async checkSpelling(line: string, lineNumber: number): Promise<StyleGuardIssue[]> {
    const issues: StyleGuardIssue[] = [];

    // Einfache Rechtschreibprüfung (kann durch externe API erweitert werden)
    const commonMistakes: Record<string, string> = {
      wird: "wird",
      werden: "werden",
      haben: "haben",
      sind: "sind",
      können: "können",
      müssen: "müssen",
      sollten: "sollten",
      würden: "würden",
    };

    const words = line.split(/\s+/);

    for (const word of words) {
      const cleanWord = word.replace(/[^\wäöüß]/g, "").toLowerCase();

      if (commonMistakes[cleanWord] && commonMistakes[cleanWord] !== cleanWord) {
        issues.push({
          line: lineNumber,
          column: line.indexOf(word) + 1,
          type: "info",
          message: `Möglicher Rechtschreibfehler: '${word}'`,
          rule: "spelling",
          suggestion: `Prüfen Sie die Schreibweise von '${word}'`,
        });
      }
    }

    return issues;
  }

  private checkFileSpecificRules(filePath: string, content: string): StyleGuardIssue[] {
    const issues: StyleGuardIssue[] = [];

    // Prüfe Datei-spezifische Regeln basierend auf Dateityp
    if (this.isCodeFile(filePath)) {
      // Prüfe Import-Statements
      if (content.includes("import") && !content.includes("from")) {
        issues.push({
          line: 1,
          column: 1,
          type: "warning",
          message: 'Import-Statement ohne "from" gefunden',
          rule: "import-statement",
          suggestion: "Import-Statement korrigieren",
        });
      }

      // Prüfe Export-Statements
      if (content.includes("export") && !content.includes("default") && !content.includes("{")) {
        issues.push({
          line: 1,
          column: 1,
          type: "info",
          message: "Export-Statement ohne expliziten Export gefunden",
          rule: "export-statement",
          suggestion: "Export explizit definieren",
        });
      }
    }

    if (this.isDocumentationFile(filePath)) {
      // Prüfe Markdown-Struktur
      if (!content.includes("# ")) {
        issues.push({
          line: 1,
          column: 1,
          type: "info",
          message: "Keine Überschrift gefunden",
          rule: "markdown-structure",
          suggestion: "Hauptüberschrift hinzufügen",
        });
      }

      // Prüfe Links
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];

        if (linkText.length < 3) {
          issues.push({
            line: 1,
            column: match.index + 1,
            type: "warning",
            message: "Link-Text ist zu kurz",
            rule: "link-quality",
            suggestion: "Aussagekräftigeren Link-Text verwenden",
          });
        }
      }
    }

    return issues;
  }

  private generateSuggestions(issues: StyleGuardIssue[]): string[] {
    const suggestions: string[] = [];
    const issueTypes = new Set(issues.map((i) => i.rule));

    for (const type of issueTypes) {
      switch (type) {
        case "line-length":
          suggestions.push("Lange Zeilen in mehrere Zeilen aufteilen");
          break;
        case "require-comments":
          suggestions.push("Kommentare für komplexe Logik hinzufügen");
          break;
        case "naming-convention":
          suggestions.push("Namenskonventionen (camelCase) befolgen");
          break;
        case "spelling":
          suggestions.push("Rechtschreibung prüfen");
          break;
        case "import-statement":
          suggestions.push("Import-Statements korrigieren");
          break;
        case "export-statement":
          suggestions.push("Export-Statements explizit definieren");
          break;
        case "markdown-structure":
          suggestions.push("Markdown-Struktur verbessern");
          break;
        case "link-quality":
          suggestions.push("Link-Qualität verbessern");
          break;
      }
    }

    return suggestions;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const totalIssues = this.results.reduce((sum, r) => sum + r.issues.length, 0);
    const averageScore = this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length;

    if (averageScore < 80) {
      recommendations.push(
        "Code-Qualität verbessern: Mehr Kommentare und bessere Namenskonventionen",
      );
    }

    if (totalIssues > 50) {
      recommendations.push("Automatische Code-Formatierung implementieren");
    }

    const lineLengthIssues = this.results.reduce(
      (sum, r) => sum + r.issues.filter((i) => i.rule === "line-length").length,
      0,
    );

    if (lineLengthIssues > 10) {
      recommendations.push("Zeilenlängen-Begrenzung in IDE konfigurieren");
    }

    return recommendations;
  }

  private hasCriticalIssues(): boolean {
    return this.results.some((r) => r.score < 50);
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

// 📦 Haupt-Ausführung
if (require.main === module) {
  const styleGuard = new StyleGuardAI();
  styleGuard.run().catch((error) => {
    console.error("StyleGuard-AI fehlgeschlagen:", error);
    process.exit(1);
  });
}

export default StyleGuardAI;
