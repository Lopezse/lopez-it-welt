#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PreCommitHook {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async run() {
    console.log('🔍 Pre-Commit Qualitätskontrolle...\n');

    try {
      await this.checkCodeQuality();
      await this.checkStandards();
      await this.checkDocumentation();

      if (this.errors.length > 0) {
        console.log('\n❌ COMMIT BLOCKIERT - Fehler gefunden:');
        this.errors.forEach(error => console.log(`  - ${error}`));
        process.exit(1);
      }

      if (this.warnings.length > 0) {
        console.log('\n⚠️  WARNUNGEN:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
      }

      console.log('\n✅ Pre-Commit Prüfung erfolgreich!');
    } catch (error) {
      console.error('❌ Pre-Commit Fehler:', error);
      process.exit(1);
    }
  }

  async checkCodeQuality() {
    console.log('📝 Prüfe Code-Qualität...');

    try {
      // TypeScript-Kompilierung
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('  ✅ TypeScript: OK');
    } catch (error) {
      this.errors.push('TypeScript-Kompilierungsfehler');
    }

    try {
      // ESLint
      execSync('npx eslint src --ext .ts,.tsx --max-warnings 0', {
        stdio: 'pipe',
      });
      console.log('  ✅ ESLint: OK');
    } catch (error) {
      this.errors.push('ESLint-Fehler gefunden');
    }

    // Layout-Struktur prüfen
    const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
    if (
      layoutContent.includes("'use client'") &&
      layoutContent.includes('export const metadata')
    ) {
      this.errors.push(
        'Layout-Struktur-Fehler: metadata export in Client-Komponente'
      );
    } else {
      console.log('  ✅ Layout-Struktur: OK');
    }

    // I18n-Provider prüfen
    const i18nContent = fs.readFileSync(
      'src/components/Features/I18nProvider.tsx',
      'utf8'
    );
    if (i18nContent.includes('../i18n/config')) {
      this.errors.push('I18n-Konfiguration-Fehler: Fehlende config.ts Datei');
    } else {
      console.log('  ✅ I18n-Provider: OK');
    }
  }

  async checkStandards() {
    console.log('🎯 Prüfe Entwicklungsstandards...');

    // Icon-Standards prüfen
    const tsxFiles = this.getTSXFiles();
    let iconViolations = 0;

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Prüfe auf verbotene Icon-Bibliotheken
      if (content.includes('@heroicons') && !content.includes('lucide-react')) {
        iconViolations++;
        this.warnings.push(`${file}: Gemischte Icon-Bibliotheken gefunden`);
      }
    }

    if (iconViolations === 0) {
      console.log('  ✅ Icon-Standards: OK');
    }

    // CSS-Klassen-Standards prüfen
    const cssContent = fs.readFileSync('src/styles/globals.css', 'utf8');
    if (cssContent.includes('hauptblau') && cssContent.includes('dunkelgrau')) {
      console.log('  ✅ CSS-Klassen-Standards: OK');
    } else {
      this.warnings.push(
        'Deutsche CSS-Klassen nicht vollständig implementiert'
      );
    }
  }

  async checkDocumentation() {
    console.log('📚 Prüfe Dokumentation...');

    const requiredFiles = [
      'START.md',
      'QualityController.md',
      'STATUS.md',
      'docs/development-guidelines.md',
    ];

    let missingFiles = 0;
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        missingFiles++;
        this.errors.push(`Pflichtdatei fehlt: ${file}`);
      }
    }

    if (missingFiles === 0) {
      console.log('  ✅ Dokumentation: OK');
    }
  }

  getTSXFiles() {
    const tsxFiles = [];

    const walkDir = dir => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.tsx')) {
          tsxFiles.push(filePath);
        }
      }
    };

    walkDir('src');
    return tsxFiles;
  }
}

// Ausführung
if (require.main === module) {
  const hook = new PreCommitHook();
  hook.run().catch(console.error);
}

module.exports = PreCommitHook;
