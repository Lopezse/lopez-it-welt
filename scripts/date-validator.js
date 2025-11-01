#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DateValidator {
    constructor() {
        this.errors = [];
        this.corrections = [];
        this.projectRoot = process.cwd();
        this.currentDate = new Date();
        this.currentDateString = this.currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        this.currentDateGerman = this.currentDate.toLocaleDateString('de-DE'); // DD.MM.YYYY
    }

    async validateAllDates() {
        console.log('🔍 DATUMSVALIDIERUNG STARTET...\n');
        console.log(`📅 Aktuelles Datum: ${this.currentDateGerman} (${this.currentDateString})\n`);

        try {
            // 1. Alle .md-Dateien prüfen
            await this.validateMarkdownFiles();

            // 2. Package.json prüfen
            await this.validatePackageJson();

            // 3. Konfigurationsdateien prüfen
            await this.validateConfigFiles();

            // 4. Bericht generieren
            this.generateReport();

            // 5. Bei Fehlern: Commit blockieren
            if (this.errors.length > 0) {
                console.error('\n❌ DATUMSFEHLER GEFUNDEN - COMMIT BLOCKIERT!');
                console.error('Bitte korrigieren Sie die Datumsfehler vor dem Commit.');
                process.exit(1);
            }

        } catch (error) {
            console.error('❌ Datumsvalidierung fehlgeschlagen:', error.message);
            process.exit(1);
        }
    }

    async validateMarkdownFiles() {
        console.log('📝 Prüfe .md-Dateien...');

        const mdFiles = [
            'README.md',
            'PROJECT.md',
            'STATUS.md',
            'planungs.md',
            'AUFTRAG_FUER_MORGEN.md',
            'QualityController.md'
        ];

        for (const file of mdFiles) {
            const filePath = path.join(this.projectRoot, file);
            if (fs.existsSync(filePath)) {
                await this.validateMarkdownFile(file, filePath);
            }
        }
    }

    async validateMarkdownFile(filename, filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const issues = [];

            // Prüfe auf falsche Datumsformate
            const wrongDatePatterns = [
                /27\.06\.2025/g,
                /2025-06-27/g,
                /2025\/06\/27/g
            ];

            wrongDatePatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    issues.push(`Falsches Datum gefunden: ${matches[0]}`);
                }
            });

            // Prüfe auf veraltete Datumsangaben (älter als 1 Tag)
            const dateMatches = content.match(/(\d{2}\.\d{2}\.\d{4})/g);
            if (dateMatches) {
                dateMatches.forEach(dateStr => {
                    const dateParts = dateStr.split('.');
                    const fileDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                    const daysDiff = Math.floor((this.currentDate - fileDate) / (1000 * 60 * 60 * 24));

                    if (daysDiff > 1) {
                        issues.push(`Veraltetes Datum: ${dateStr} (${daysDiff} Tage alt)`);
                    }
                });
            }

            if (issues.length > 0) {
                console.log(`  ❌ ${filename}: ${issues.length} Probleme`);
                issues.forEach(issue => {
                    console.log(`    - ${issue}`);
                    this.errors.push(`${filename}: ${issue}`);
                });
            } else {
                console.log(`  ✅ ${filename}: Datum korrekt`);
            }

        } catch (error) {
            console.log(`  ⚠️  ${filename}: Konnte nicht gelesen werden`);
        }
    }

    async validatePackageJson() {
        console.log('📦 Prüfe package.json...');

        const packagePath = path.join(this.projectRoot, 'package.json');
        if (!fs.existsSync(packagePath)) return;

        try {
            const content = fs.readFileSync(packagePath, 'utf8');
            const packageJson = JSON.parse(content);

            // Prüfe auf veraltete Versionen oder Datumsangaben
            if (packageJson.version && packageJson.version.includes('2025-06')) {
                this.errors.push('package.json: Veraltete Versionsangabe');
                console.log('  ❌ package.json: Veraltete Versionsangabe');
            } else {
                console.log('  ✅ package.json: Version korrekt');
            }

        } catch (error) {
            console.log('  ⚠️  package.json: Konnte nicht geprüft werden');
        }
    }

    async validateConfigFiles() {
        console.log('⚙️  Prüfe Konfigurationsdateien...');

        const configFiles = [
            'next.config.js',
            'tailwind.config.ts',
            'tsconfig.json',
            'jest.config.js'
        ];

        for (const file of configFiles) {
            const filePath = path.join(this.projectRoot, file);
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');

                    // Prüfe auf veraltete Kommentare oder Datumsangaben
                    if (content.includes('2025-06-27') || content.includes('27.06.2025')) {
                        this.errors.push(`${file}: Veraltete Datumsangabe`);
                        console.log(`  ❌ ${file}: Veraltete Datumsangabe`);
                    } else {
                        console.log(`  ✅ ${file}: Datum korrekt`);
                    }
                } catch (error) {
                    console.log(`  ⚠️  ${file}: Konnte nicht geprüft werden`);
                }
            }
        }
    }

    generateReport() {
        console.log('\n📊 DATUMSVALIDIERUNG BERICHT:');
        console.log('================================');

        if (this.errors.length === 0) {
            console.log('✅ Alle Daten sind korrekt!');
            console.log(`📅 Aktuelles Datum: ${this.currentDateGerman}`);
            console.log('🚀 Commit kann fortgesetzt werden.');
        } else {
            console.log(`❌ ${this.errors.length} Datumsfehler gefunden:`);
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
            console.log('\n🔧 KORREKTUR ERFORDERLICH:');
            console.log('   - Bitte korrigieren Sie alle Datumsfehler');
            console.log('   - Verwenden Sie das aktuelle Datum: ' + this.currentDateGerman);
            console.log('   - Führen Sie die Validierung erneut aus');
        }

        console.log('\n📋 VALIDIERUNGS-DETAILS:');
        console.log(`   - Geprüfte Dateien: ${this.getCheckedFilesCount()}`);
        console.log(`   - Aktuelles Datum: ${this.currentDateGerman}`);
        console.log(`   - Zeitstempel: ${this.currentDate.toISOString()}`);
    }

    getCheckedFilesCount() {
        const mdFiles = ['README.md', 'PROJECT.md', 'STATUS.md', 'planungs.md', 'AUFTRAG_FUER_MORGEN.md', 'QualityController.md'];
        const configFiles = ['package.json', 'next.config.js', 'tailwind.config.ts', 'tsconfig.json', 'jest.config.js'];

        let count = 0;
        mdFiles.forEach(file => {
            if (fs.existsSync(path.join(this.projectRoot, file))) count++;
        });
        configFiles.forEach(file => {
            if (fs.existsSync(path.join(this.projectRoot, file))) count++;
        });

        return count;
    }
}

// Hauptfunktion
async function main() {
    const validator = new DateValidator();
    await validator.validateAllDates();
}

// Ausführung
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Kritischer Fehler:', error.message);
        process.exit(1);
    });
}

module.exports = { DateValidator }; 