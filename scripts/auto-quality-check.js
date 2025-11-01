#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoQualityCheck {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.projectRoot = process.cwd();
  }

  async runFullCheck() {
    console.log('🔍 AUTOMATISCHE QUALITÄTSKONTROLLE STARTET...\n');

    try {
      await this.checkCodeStandards();
      await this.checkLegalCompliance();
      await this.checkAccessibility();
      await this.checkPerformance();
      await this.checkSecurity();

      this.generateReport();
    } catch (error) {
      console.error('❌ Qualitätskontrolle fehlgeschlagen:', error.message);
      process.exit(1);
    }
  }

  async checkCodeStandards() {
    console.log('📝 Prüfe Code-Standards...');

    // 1. ESLint Check (nur src/ Ordner)
    try {
      execSync('npx eslint "src/**/*.{ts,tsx}" --max-warnings 0', {
        stdio: 'pipe',
      });
      console.log('  ✅ ESLint: Keine Fehler');
    } catch (error) {
      console.log('  ❌ ESLint: Fehler vorhanden');
      this.errors.push('ESLint-Fehler gefunden');
    }

    // 2. TypeScript Check
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('  ✅ TypeScript: Keine Fehler');
    } catch (error) {
      console.log('  ❌ TypeScript: Fehler vorhanden');
      this.errors.push('TypeScript-Fehler gefunden');
    }

    // 3. Prettier Check
    try {
      execSync('npx prettier --check "src/**/*.{ts,tsx,js,jsx}"', {
        stdio: 'pipe',
      });
      console.log('  ✅ Prettier: Formatierung korrekt');
    } catch (error) {
      console.log('  ❌ Prettier: Formatierungsfehler');
      this.errors.push('Prettier-Formatierungsfehler');
    }

    // 4. Import/Export-Struktur prüfen (nur src/ Ordner)
    console.log('  🔍 Prüfe Import/Export-Struktur...');
    this.checkImportExports();
  }

  checkImportExports() {
    const srcPath = path.join(this.projectRoot, 'src');
    if (!fs.existsSync(srcPath)) return;

    this.scanDirectory(srcPath);
  }

  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      // Ignoriere node_modules und andere nicht-relevante Ordner
      if (
        item === 'node_modules' ||
        item === '.next' ||
        item === 'out' ||
        item === 'build' ||
        item === 'dist'
      ) {
        continue;
      }

      if (stat.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.checkFileExports(fullPath);
      }
    }
  }

  checkFileExports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Prüfe auf default export
      if (
        content.includes('export default') ||
        content.includes('export const') ||
        content.includes('export function')
      ) {
        // Datei hat Exports - das ist gut
        return;
      }

      // Prüfe auf React-Komponenten ohne Export
      if (
        content.includes('React.FC') ||
        content.includes('function') ||
        (content.includes('const') &&
          content.includes('=') &&
          content.includes('('))
      ) {
        this.warnings.push(`${filePath}: Möglicherweise fehlender Export`);
      }
    } catch (error) {
      // Ignoriere Lesefehler
    }
  }

  async checkLegalCompliance() {
    console.log('⚖️  Prüfe rechtliche Compliance...');

    const requiredPages = [
      'src/app/datenschutz/page.tsx',
      'src/app/impressum/page.tsx',
      'src/app/cookie-einstellungen/page.tsx',
    ];

    for (const page of requiredPages) {
      if (fs.existsSync(path.join(this.projectRoot, page))) {
        console.log(`  ✅ ${page.split('/').pop()}: Vorhanden`);
      } else {
        console.log(`  ❌ ${page.split('/').pop()}: Fehlt`);
        this.errors.push(`${page} fehlt`);
      }
    }
  }

  async checkAccessibility() {
    console.log('♿ Prüfe Barrierefreiheit...');

    const srcPath = path.join(this.projectRoot, 'src');
    if (!fs.existsSync(srcPath)) return;

    let accessibilityIssues = 0;
    this.scanForAccessibility(srcPath, accessibilityIssues);

    if (accessibilityIssues > 0) {
      console.log(
        `  ⚠️  ${accessibilityIssues} Barrierefreiheits-Probleme gefunden`
      );
      this.warnings.push(
        `${accessibilityIssues} Barrierefreiheits-Probleme gefunden`
      );
    } else {
      console.log('  ✅ Barrierefreiheit geprüft');
    }
  }

  scanForAccessibility(dirPath, issues) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (
        item === 'node_modules' ||
        item === '.next' ||
        item === 'out' ||
        item === 'build' ||
        item === 'dist'
      ) {
        continue;
      }

      if (stat.isDirectory()) {
        this.scanForAccessibility(fullPath, issues);
      } else if (item.endsWith('.tsx')) {
        this.checkAccessibilityInFile(fullPath, issues);
      }
    }
  }

  checkAccessibilityInFile(filePath, issues) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Prüfe auf fehlende ARIA-Labels
      if (
        content.includes('<button') &&
        !content.includes('aria-label') &&
        !content.includes('aria-labelledby')
      ) {
        issues++;
      }

      if (content.includes('<img') && !content.includes('alt=')) {
        issues++;
      }
    } catch (error) {
      // Ignoriere Lesefehler
    }
  }

  async checkPerformance() {
    console.log('⚡ Prüfe Performance...');

    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('  ✅ Build erfolgreich');
    } catch (error) {
      console.log('  ❌ Build fehlgeschlagen');
      this.errors.push('Build fehlgeschlagen');
    }
  }

  async checkSecurity() {
    console.log('🔒 Prüfe Sicherheit...');

    try {
      const result = execSync('npm audit --audit-level moderate', {
        stdio: 'pipe',
      });
      console.log('  ✅ Keine kritischen Sicherheitslücken');
    } catch (error) {
      console.log('  ⚠️  Sicherheitslücken vorhanden');
      this.warnings.push('Sicherheitslücken gefunden');
    }
  }

  generateReport() {
    console.log('\n📊 QUALITÄTSBERICHT:');
    console.log('==================================================\n');

    if (this.errors.length > 0) {
      console.log('❌ KRITISCHE FEHLER:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNUNGEN:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log('');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ ALLE QUALITÄTSSTANDARDS EINGEHALTEN!');
    } else {
      console.log('🔧 EMPFOHLENE AKTIONEN:');
      if (this.errors.length > 0) {
        console.log('  1. Kritische Fehler sofort beheben');
      }
      if (this.warnings.length > 0) {
        console.log('  2. Warnings bei nächster Gelegenheit prüfen');
      }
      console.log('  3. Pre-Commit Hook aktivieren');
    }

    console.log('\n==================================================\n');
  }
}

// Script ausführen
const checker = new AutoQualityCheck();
checker.runFullCheck().catch(console.error);
