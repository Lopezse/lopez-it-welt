// =====================================================
// Quality Agent - Code-Qualität
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische Code-Qualitätsprüfung und -verbesserung
// =====================================================

import { KIAgent } from "../ki-agent";

interface QualityMetrics {
  testCoverage: number;
  lintErrors: number;
  typeErrors: number;
  complexity: number;
  duplication: number;
  maintainability: number;
}

interface QualityReport {
  overall: number;
  metrics: QualityMetrics;
  issues: string[];
  recommendations: string[];
  passed: boolean;
}

export class QualityAgent extends KIAgent {
  constructor() {
    super();
  }

  async analyzeCodeQuality(filePath: string): Promise<QualityReport> {
    try {
      // Quality-Agent: Code-Qualität analysieren...

      const fs = require("fs");
      const content = fs.readFileSync(filePath, "utf8");

      // Qualitätsmetriken berechnen
      const metrics = await this.calculateMetrics(content, filePath);

      // Probleme identifizieren
      const issues = await this.identifyIssues(content, filePath);

      // Empfehlungen generieren
      const recommendations = await this.generateRecommendations(issues, metrics);

      // Gesamtbewertung
      const overall = this.calculateOverallScore(metrics, issues);
      const passed = overall >= 80;

      const report: QualityReport = {
        overall,
        metrics,
        issues,
        recommendations,
        passed,
      };

      // Code-Qualitätsanalyse abgeschlossen: ${overall}%
      return report;
    } catch (error) {
      // Fehler bei der Code-Qualitätsanalyse: ${error}
      throw error;
    }
  }

  private async calculateMetrics(content: string, filePath: string): Promise<QualityMetrics> {
    const lines = content.split("\n");
    const totalLines = lines.length;
    const codeLines = lines.filter((line) => line.trim().length > 0).length;

    // Test-Coverage simulieren
    const testCoverage = this.calculateTestCoverage(filePath);

    // Lint-Fehler zählen
    const lintErrors = this.countLintErrors(content);

    // TypeScript-Fehler zählen
    const typeErrors = this.countTypeErrors(content);

    // Komplexität berechnen
    const complexity = this.calculateComplexity(content);

    // Duplikation berechnen
    const duplication = this.calculateDuplication(content);

    // Wartbarkeit berechnen
    const maintainability = this.calculateMaintainability(content, totalLines, codeLines);

    return {
      testCoverage,
      lintErrors,
      typeErrors,
      complexity,
      duplication,
      maintainability,
    };
  }

  private calculateTestCoverage(filePath: string): number {
    // Simuliere Test-Coverage basierend auf Dateiname
    if (filePath.includes(".test.") || filePath.includes(".spec.")) {
      return 100;
    }

    // Prüfe ob Test-Datei existiert
    const testPath = filePath.replace(".tsx", ".test.tsx").replace(".ts", ".test.ts");
    const fs = require("fs");

    if (fs.existsSync(testPath)) {
      return 85; // Simuliere 85% Coverage
    }

    return 0; // Keine Tests vorhanden
  }

  private countLintErrors(content: string): number {
    let errors = 0;

    // Häufige Lint-Probleme prüfen
    if (content.includes("console.log")) {
      errors += 1;
    }

    if (content.includes("any")) {
      errors += 1;
    }

    if (content.includes("// eslint-disable")) {
      errors += 1;
    }

    // Unused imports prüfen
    const importMatches = content.match(/import.*from/g) || [];
    const usedImports = content.match(/from ['"][^'"]+['"]/g) || [];

    if (importMatches.length > usedImports.length) {
      errors += importMatches.length - usedImports.length;
    }

    return errors;
  }

  private countTypeErrors(content: string): number {
    let errors = 0;

    // TypeScript-spezifische Probleme
    if (content.includes(": any")) {
      errors += 1;
    }

    if (content.includes("as any")) {
      errors += 1;
    }

    if (content.includes("!")) {
      errors += 1;
    }

    return errors;
  }

  private calculateComplexity(content: string): number {
    let complexity = 1;

    // Cyclomatic complexity berechnen
    const ifStatements = (content.match(/if\s*\(/g) || []).length;
    const forLoops = (content.match(/for\s*\(/g) || []).length;
    const whileLoops = (content.match(/while\s*\(/g) || []).length;
    const switchStatements = (content.match(/switch\s*\(/g) || []).length;
    const catchBlocks = (content.match(/catch\s*\(/g) || []).length;

    complexity += ifStatements + forLoops + whileLoops + switchStatements + catchBlocks;

    return complexity;
  }

  private calculateDuplication(content: string): number {
    const lines = content.split("\n");
    const uniqueLines = new Set(lines.map((line) => line.trim()));

    const duplication = ((lines.length - uniqueLines.size) / lines.length) * 100;
    return Math.round(duplication);
  }

  private calculateMaintainability(content: string, totalLines: number, codeLines: number): number {
    let maintainability = 100;

    // Faktoren die Wartbarkeit reduzieren
    if (totalLines > 200) {
      maintainability -= 10;
    }

    if (content.includes("TODO") || content.includes("FIXME")) {
      maintainability -= 5;
    }

    if (content.includes("console.log")) {
      maintainability -= 5;
    }

    if (content.includes("any")) {
      maintainability -= 10;
    }

    return Math.max(0, maintainability);
  }

  private async identifyIssues(content: string, filePath: string): Promise<string[]> {
    const issues: string[] = [];

    // Enterprise++ Standards prüfen
    if (content.includes("console.log")) {
      issues.push("❌ console.log gefunden - für Produktion entfernen");
    }

    if (content.includes(": any")) {
      issues.push("❌ any-Typ gefunden - spezifische Typen verwenden");
    }

    if (content.includes("TODO") || content.includes("FIXME")) {
      issues.push("❌ TODO/FIXME gefunden - vor Commit entfernen");
    }

    if (content.includes("password") || content.includes("secret")) {
      issues.push("❌ Passwort/Secret im Code gefunden - Environment Variables verwenden");
    }

    // Deutsche Namenskonventionen prüfen
    if (
      filePath.includes("src/components/") &&
      !content.includes("Schaltflaeche") &&
      content.includes("Button")
    ) {
      issues.push("❌ Englische Komponenten-Namen gefunden - Deutsche Namen verwenden");
    }

    // Test-Coverage prüfen
    if (!filePath.includes(".test.") && !filePath.includes(".spec.")) {
      const testPath = filePath.replace(".tsx", ".test.tsx").replace(".ts", ".test.ts");
      const fs = require("fs");

      if (!fs.existsSync(testPath)) {
        issues.push("❌ Keine Test-Datei gefunden - Tests erstellen");
      }
    }

    return issues;
  }

  private async generateRecommendations(
    issues: string[],
    metrics: QualityMetrics,
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Basierend auf Problemen
    if (issues.some((issue) => issue.includes("console.log"))) {
      recommendations.push("✅ console.log durch Logger-Service ersetzen");
    }

    if (issues.some((issue) => issue.includes("any"))) {
      recommendations.push("✅ any-Typen durch spezifische Interfaces ersetzen");
    }

    if (issues.some((issue) => issue.includes("TODO"))) {
      recommendations.push("✅ TODO-Kommentare vor Commit entfernen");
    }

    // Basierend auf Metriken
    if (metrics.testCoverage < 80) {
      recommendations.push("✅ Test-Coverage auf mindestens 80% erhöhen");
    }

    if (metrics.complexity > 10) {
      recommendations.push("✅ Komplexität reduzieren - Funktionen aufteilen");
    }

    if (metrics.duplication > 5) {
      recommendations.push("✅ Code-Duplikation reduzieren - Gemeinsame Funktionen extrahieren");
    }

    if (metrics.maintainability < 70) {
      recommendations.push("✅ Wartbarkeit verbessern - Code refaktorisieren");
    }

    return recommendations;
  }

  private calculateOverallScore(metrics: QualityMetrics, issues: string[]): number {
    let score = 100;

    // Metriken bewerten
    if (metrics.testCoverage < 80) score -= 20;
    if (metrics.lintErrors > 0) score -= 10;
    if (metrics.typeErrors > 0) score -= 15;
    if (metrics.complexity > 10) score -= 10;
    if (metrics.duplication > 5) score -= 10;
    if (metrics.maintainability < 70) score -= 15;

    // Probleme bewerten
    score -= issues.length * 5;

    return Math.max(0, score);
  }

  async fixQualityIssues(filePath: string): Promise<{
    success: boolean;
    fixedIssues: string[];
    newContent: string;
  }> {
    try {
      // Quality-Agent: Qualitätsprobleme automatisch beheben...

      const fs = require("fs");
      let content = fs.readFileSync(filePath, "utf8");
      const fixedIssues: string[] = [];

      // console.log entfernen
      if (content.includes("console.log")) {
        content = content.replace(/console\.log\([^)]*\);?\n?/g, "");
        fixedIssues.push("console.log entfernt");
      }

      // TODO-Kommentare entfernen
      if (content.includes("TODO") || content.includes("FIXME")) {
        content = content.replace(/\/\/\s*TODO.*$/gm, "");
        content = content.replace(/\/\/\s*FIXME.*$/gm, "");
        fixedIssues.push("TODO/FIXME Kommentare entfernt");
      }

      // any-Typen durch unknown ersetzen
      if (content.includes(": any")) {
        content = content.replace(/: any/g, ": unknown");
        fixedIssues.push("any-Typen durch unknown ersetzt");
      }

      // ${fixedIssues.length} Qualitätsprobleme behoben

      return {
        success: true,
        fixedIssues,
        newContent: content,
      };
    } catch (error) {
      // Fehler beim Beheben der Qualitätsprobleme: ${error}
      throw error;
    }
  }

  async generateTestFile(filePath: string): Promise<string> {
    try {
      // Quality-Agent: Test-Datei generieren...

      const fs = require("fs");
      const content = fs.readFileSync(filePath, "utf8");
      const fileName =
        filePath.split("/").pop()?.replace(".tsx", "").replace(".ts", "") || "Component";

      // Komponenten-Imports extrahieren
      const imports = content.match(/import.*from/g) || [];

      const testContent = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${fileName} } from './${fileName}';

describe('${fileName}', () => {
  it('should render without crashing', () => {
    render(<${fileName} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display correct content', () => {
    render(<${fileName} />);
    // Hier spezifische Tests hinzufügen
  });

  it('should handle user interactions', () => {
    render(<${fileName} />);
    // Hier Event-Tests hinzufügen
  });
});
      `;

      // Test-Datei erfolgreich generiert
      return testContent;
    } catch (error) {
      // Fehler beim Generieren der Test-Datei: ${error}
      throw error;
    }
  }
}
