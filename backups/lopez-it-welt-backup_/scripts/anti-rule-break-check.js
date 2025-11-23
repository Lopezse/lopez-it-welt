// =====================================================
// Anti-Rule-Break Check Script
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische Anti-Regelbruch-Prüfung
// =====================================================

const fs = require('fs');
const path = require('path');

class AntiRuleBreakChecker {
  constructor() {
    this.violations = [];
    this.rules = [
      {
        name: 'Datumskopieren-Verbot',
        pattern: /(2025-01-19|29\.07\.2025|27\.06\.2025)/g,
        message: '❌ Datumskopieren erkannt - System-Zeit verwenden!',
      },
      {
        name: 'Md-Struktur-Schutz',
        pattern: /^#\s*[^#]/gm,
        message: '❌ Md-Struktur verletzt - Nur ergänzen, nie überschreiben!',
      },
      {
        name: 'System-Zeit-Validierung',
        pattern: /(?:Datum|Zeit):\s*\d{4}-\d{2}-\d{2}/g,
        message: '❌ System-Zeit nicht validiert - Get-Date verwenden!',
      },
      {
        name: 'Freigabe-Erfordernis',
        pattern: /(?:ohne|keine)\s+(?:Freigabe|Genehmigung|Zustimmung)/gi,
        message:
          '❌ Aktion ohne Freigabe - Explizite Genehmigung erforderlich!',
      },
    ];
  }

  async checkRuleBreaks() {
    console.log('🛡️ Anti-Regelbruch-Prüfung gestartet...');

    // 1. Git-Staged-Dateien prüfen
    this.checkStagedFiles();

    // 2. Aktuelle Änderungen prüfen
    this.checkCurrentChanges();

    // 3. Regelverstöße melden
    this.reportViolations();

    // Bei Verstößen Exit-Code 1
    if (this.violations.length > 0) {
      process.exit(1);
    }

    console.log('✅ Keine Regelverstöße erkannt!');
    process.exit(0);
  }

  checkStagedFiles() {
    console.log('📋 Staged-Dateien prüfen...');

    try {
      // Git-Staged-Dateien abrufen
      const { execSync } = require('child_process');
      const stagedFiles = execSync('git diff --cached --name-only', {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(file => file.trim());

      stagedFiles.forEach(file => {
        if (fs.existsSync(file)) {
          this.checkFile(file, 'staged');
        }
      });
    } catch (error) {
      console.log('ℹ️ Keine staged-Dateien gefunden');
    }
  }

  checkCurrentChanges() {
    console.log('📝 Aktuelle Änderungen prüfen...');

    try {
      // Modifizierte Dateien abrufen
      const { execSync } = require('child_process');
      const modifiedFiles = execSync('git diff --name-only', {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(file => file.trim());

      modifiedFiles.forEach(file => {
        if (fs.existsSync(file)) {
          this.checkFile(file, 'modified');
        }
      });
    } catch (error) {
      console.log('ℹ️ Keine modifizierten Dateien gefunden');
    }
  }

  checkFile(filePath, type) {
    console.log(`🔍 Prüfe ${type} Datei: ${filePath}`);

    // Nur .md und .js/.ts Dateien prüfen
    if (
      !filePath.endsWith('.md') &&
      !filePath.endsWith('.js') &&
      !filePath.endsWith('.ts')
    ) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.checkContent(content, filePath);
    } catch (error) {
      console.log(`⚠️ Konnte ${filePath} nicht lesen: ${error.message}`);
    }
  }

  checkContent(content, filePath) {
    this.rules.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        this.violations.push({
          rule: rule.name,
          file: filePath,
          message: rule.message,
          matches: matches.length,
        });
      }
    });
  }

  reportViolations() {
    console.log('\n📊 Anti-Regelbruch-Report:');
    console.log('=============================');

    if (this.violations.length === 0) {
      console.log('✅ Keine Regelverstöße erkannt!');
      return;
    }

    console.log(`❌ ${this.violations.length} Regelverstöße gefunden:`);

    // Gruppiere nach Regel
    const violationsByRule = {};
    this.violations.forEach(violation => {
      if (!violationsByRule[violation.rule]) {
        violationsByRule[violation.rule] = [];
      }
      violationsByRule[violation.rule].push(violation);
    });

    Object.entries(violationsByRule).forEach(([rule, violations]) => {
      console.log(`\n🛡️ ${rule}:`);
      violations.forEach(violation => {
        console.log(`  ${violation.message}`);
        console.log(`  📁 Datei: ${violation.file}`);
        console.log(`  🔢 Verstöße: ${violation.matches}`);
      });
    });

    console.log('\n💡 Korrekturmaßnahmen:');
    console.log('  - System-Zeit mit Get-Date abrufen');
    console.log('  - Md-Dateien nur ergänzen, nie überschreiben');
    console.log('  - Explizite Freigabe für alle Aktionen einholen');
    console.log('  - Anti-Regelbruch-System befolgen');
  }
}

// Script ausführen
const checker = new AntiRuleBreakChecker();
checker.checkRuleBreaks();
