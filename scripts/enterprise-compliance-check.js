// =====================================================
// Enterprise++ Compliance Check Script
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische Enterprise++ Compliance-Prüfung
// =====================================================

const fs = require('fs');
const path = require('path');

class EnterpriseComplianceChecker {
    constructor() {
        this.violations = [];
        this.requiredFiles = [
            'STATUS.md',
            'CHANGELOG.md',
            'README.md',
            'QualityController.md'
        ];
    }

    async checkCompliance() {
        console.log('🏆 Enterprise++ Compliance-Prüfung gestartet...');

        // 1. Pflicht-Dateien prüfen
        this.checkRequiredFiles();

        // 2. Enterprise++ Standards prüfen
        this.checkEnterpriseStandards();

        // 3. Code-Qualität prüfen
        this.checkCodeQuality();

        // 4. Dokumentation prüfen
        this.checkDocumentation();

        // 5. Sicherheit prüfen
        this.checkSecurity();

        // Ergebnis ausgeben
        this.reportResults();

        // Bei Verstößen Exit-Code 1
        if (this.violations.length > 0) {
            process.exit(1);
        }

        console.log('✅ Enterprise++ Compliance bestätigt!');
        process.exit(0);
    }

    checkRequiredFiles() {
        console.log('📋 Pflicht-Dateien prüfen...');

        this.requiredFiles.forEach(file => {
            if (!fs.existsSync(file)) {
                this.violations.push(`❌ Pflicht-Datei fehlt: ${file}`);
            } else {
                console.log(`✅ ${file} vorhanden`);
            }
        });
    }

    checkEnterpriseStandards() {
        console.log('🏆 Enterprise++ Standards prüfen...');

        // STATUS.md muss aktuell sein
        if (fs.existsSync('STATUS.md')) {
            const statusContent = fs.readFileSync('STATUS.md', 'utf8');
            const lastUpdate = this.extractLastUpdate(statusContent);

            if (!lastUpdate || this.isDateOld(lastUpdate)) {
                this.violations.push('❌ STATUS.md ist nicht aktuell (älter als 7 Tage)');
            } else {
                console.log('✅ STATUS.md ist aktuell');
            }
        }

        // CHANGELOG.md muss bei Änderungen aktualisiert werden
        if (fs.existsSync('CHANGELOG.md')) {
            const changelogContent = fs.readFileSync('CHANGELOG.md', 'utf8');
            if (!changelogContent.includes('## [')) {
                this.violations.push('❌ CHANGELOG.md ist nicht formatiert');
            } else {
                console.log('✅ CHANGELOG.md ist formatiert');
            }
        }
    }

    checkCodeQuality() {
        console.log('🔍 Code-Qualität prüfen...');

        // TypeScript-Konfiguration prüfen
        if (fs.existsSync('tsconfig.json')) {
            const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
            if (!tsConfig.compilerOptions?.strict) {
                this.violations.push('❌ TypeScript Strict Mode nicht aktiviert');
            } else {
                console.log('✅ TypeScript Strict Mode aktiviert');
            }
        }

        // ESLint-Konfiguration prüfen
        if (fs.existsSync('.eslintrc.json')) {
            console.log('✅ ESLint konfiguriert');
        } else {
            this.violations.push('❌ ESLint nicht konfiguriert');
        }

        // Prettier-Konfiguration prüfen
        if (fs.existsSync('.prettierrc')) {
            console.log('✅ Prettier konfiguriert');
        } else {
            this.violations.push('❌ Prettier nicht konfiguriert');
        }
    }

    checkDocumentation() {
        console.log('📚 Dokumentation prüfen...');

        // README.md muss vorhanden und aktuell sein
        if (fs.existsSync('README.md')) {
            const readmeContent = fs.readFileSync('README.md', 'utf8');
            if (readmeContent.length < 100) {
                this.violations.push('❌ README.md ist zu kurz');
            } else {
                console.log('✅ README.md ist ausführlich');
            }
        }

        // docs/ Verzeichnis prüfen
        if (fs.existsSync('docs/')) {
            const docsFiles = fs.readdirSync('docs/');
            if (docsFiles.length < 5) {
                this.violations.push('❌ Unzureichende Dokumentation in docs/');
            } else {
                console.log('✅ Ausreichende Dokumentation vorhanden');
            }
        }
    }

    checkSecurity() {
        console.log('🔒 Sicherheit prüfen...');

        // .env.local nicht im Git
        if (fs.existsSync('.env.local')) {
            console.log('⚠️ .env.local vorhanden - prüfe .gitignore');
        }

        // Keine Passwörter im Code
        const sourceFiles = this.findSourceFiles();
        let passwordFound = false;

        sourceFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('password') || content.includes('secret') || content.includes('api_key')) {
                passwordFound = true;
                this.violations.push(`❌ Passwort/Secret in ${file} gefunden`);
            }
        });

        if (!passwordFound) {
            console.log('✅ Keine Passwörter/Secrets im Code gefunden');
        }
    }

    findSourceFiles() {
        const sourceFiles = [];
        const srcDir = 'src';

        if (fs.existsSync(srcDir)) {
            this.walkDir(srcDir, sourceFiles);
        }

        return sourceFiles;
    }

    walkDir(dir, files) {
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                this.walkDir(fullPath, files);
            } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js')) {
                files.push(fullPath);
            }
        });
    }

    extractLastUpdate(content) {
        const match = content.match(/Letzte Aktualisierung:\s*(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : null;
    }

    isDateOld(dateString) {
        const lastUpdate = new Date(dateString);
        const now = new Date();
        const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24);
        return daysDiff > 7;
    }

    reportResults() {
        console.log('\n📊 Enterprise++ Compliance-Report:');
        console.log('=====================================');

        if (this.violations.length === 0) {
            console.log('✅ Alle Enterprise++ Standards eingehalten!');
        } else {
            console.log(`❌ ${this.violations.length} Verstöße gefunden:`);
            this.violations.forEach(violation => {
                console.log(`  ${violation}`);
            });
        }
    }
}

// Script ausführen
const checker = new EnterpriseComplianceChecker();
checker.checkCompliance(); 