/**
 * 🎨 StyleGuard-AI (JavaScript Version)
 *
 * Automatische Text-Qualitätsprüfung und Stil-Optimierung
 *
 * @author Lopez IT Welt Team
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

// 📋 StyleGuard-Konfiguration
const config = {
  maxLineLength: 120,
  requireComments: true,
  enforceNaming: true,
  checkSpelling: true,
  language: "de",
  rules: ["ci", "readability", "style", "consistency"],
  autoComment: true,
  blockOnFail: false,
};

// 📋 Logger
class Logger {
  constructor(agent) {
    this.agent = agent;
  }

  info(message) {
    console.log(`[${new Date().toISOString()}] ${this.agent}: ${message}`);
  }

  success(message) {
    console.log(`✅ [${new Date().toISOString()}] ${this.agent}: ${message}`);
  }

  warn(message) {
    console.log(`⚠️ [${new Date().toISOString()}] ${this.agent}: ${message}`);
  }

  error(message, error) {
    console.error(`❌ [${new Date().toISOString()}] ${this.agent}: ${message}`, error);
  }

  start(operation) {
    this.info(`🚀 Start: ${operation}`);
  }

  end(operation, duration) {
    this.info(`✅ End: ${operation} (${duration}ms)`);
  }
}

/**
 * 🎨 StyleGuard-AI Klasse
 */
class StyleGuardAI {
  constructor() {
    this.logger = new Logger("StyleGuard-AI");
    this.results = [];
  }

  /**
   * 🚀 Haupt-Methode für StyleGuard-AI
   */
  async run() {
    try {
      this.logger.start("StyleGuard-AI Review");
      const startTime = Date.now();

      // Finde zu prüfende Dateien
      const files = this.findFilesToReview();
      this.logger.info(`${files.length} Dateien für Review gefunden`);

      // Prüfe jede Datei
      for (const file of files) {
        await this.reviewFile(file);
      }

      // Generiere Report
      this.generateReport();

      const duration = Date.now() - startTime;
      this.logger.end("StyleGuard-AI Review", duration);

      this.logger.success("StyleGuard-AI Review erfolgreich abgeschlossen");
    } catch (error) {
      this.logger.error("StyleGuard-AI Review fehlgeschlagen", error);
      throw error;
    }
  }

  /**
   * 🔍 Finde zu prüfende Dateien
   */
  findFilesToReview() {
    const files = [];
    const scanExtensions = [".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"];

    // Prüfe src/ Verzeichnis
    const srcPath = path.join(process.cwd(), "..", "src");
    if (fs.existsSync(srcPath)) {
      const srcFiles = this.scanDirectory(srcPath, scanExtensions);
      files.push(...srcFiles.map((f) => path.join("src", f)));
    }

    // Prüfe docs/ Verzeichnis
    const docsPath = path.join(process.cwd(), "..", "docs");
    if (fs.existsSync(docsPath)) {
      const docsFiles = this.scanDirectory(docsPath, [".md", ".mdx"]);
      files.push(...docsFiles.map((f) => path.join("docs", f)));
    }

    return files;
  }

  /**
   * 📝 Prüfe eine einzelne Datei
   */
  async reviewFile(filePath) {
    try {
      this.logger.info(`Prüfe Datei: ${filePath}`);

      const fullPath = path.join(process.cwd(), "..", filePath);
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");

      const result = {
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
        if (line.length > config.maxLineLength) {
          result.issues.push({
            line: lineNumber,
            column: config.maxLineLength + 1,
            type: "warning",
            message: `Zeile ist zu lang (${line.length} Zeichen, max ${config.maxLineLength})`,
            rule: "line-length",
            suggestion: `Zeile auf ${config.maxLineLength} Zeichen kürzen`,
          });
          result.score -= 5;
        }

        // Prüfe Kommentare (für Code-Dateien)
        if (config.requireComments && this.isCodeFile(filePath)) {
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
        if (config.enforceNaming) {
          const namingIssues = this.checkNamingConventions(line, lineNumber);
          result.issues.push(...namingIssues);
          result.score -= namingIssues.length * 3;
        }
      }

      // Bestimme ob Datei bestanden hat
      result.passed = result.score >= 70;
      result.suggestions = this.generateSuggestions(result.issues);

      this.results.push(result);

      if (result.passed) {
        this.logger.success(`${filePath} bestanden (Score: ${result.score})`);
      } else {
        this.logger.warn(`${filePath} nicht bestanden (Score: ${result.score})`);
      }
    } catch (error) {
      this.logger.error(`Fehler beim Prüfen von ${filePath}`, error);
    }
  }

  /**
   * 📊 Generiere Report
   */
  generateReport() {
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
      const reportsDir = path.join(process.cwd(), "..", "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const reportPath = path.join(reportsDir, "styleguard-report.json");
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      this.logger.success(`StyleGuard-Report generiert: ${reportPath}`);
      this.logger.info(
        `Zusammenfassung: ${passedFiles}/${totalFiles} Dateien bestanden, ${totalIssues} Issues gefunden`,
      );
    } catch (error) {
      this.logger.error("Fehler beim Generieren des Reports", error);
    }
  }

  /**
   * 🔍 Hilfsmethoden
   */
  scanDirectory(dirPath, extensions) {
    const files = [];

    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          const subFiles = this.scanDirectory(fullPath, extensions);
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

  isCodeFile(filePath) {
    const codeExtensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".java", ".cpp", ".c"];
    const ext = path.extname(filePath);
    return codeExtensions.includes(ext);
  }

  needsComment(line, lines, lineIndex) {
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

  checkNamingConventions(line, lineNumber) {
    const issues = [];

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

    return issues;
  }

  generateSuggestions(issues) {
    const suggestions = [];
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
      }
    }

    return suggestions;
  }

  generateRecommendations() {
    const recommendations = [];
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

    return recommendations;
  }

  toCamelCase(str) {
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

module.exports = StyleGuardAI;
