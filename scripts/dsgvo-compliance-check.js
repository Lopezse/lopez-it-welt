// =====================================================
// DSGVO Compliance Check Script
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische DSGVO-Compliance-Prüfung
// =====================================================

const fs = require('fs');
const path = require('path');

class DSGVOComplianceChecker {
    constructor() {
        this.violations = [];
        this.requiredElements = [
            'datenschutz',
            'impressum',
            'cookie-einstellungen',
            'consent',
            'gdpr'
        ];
    }

    async checkDSGVOCompliance() {
        console.log('📋 DSGVO-Compliance-Prüfung gestartet...');

        // 1. Pflicht-Seiten prüfen
        this.checkRequiredPages();

        // 2. Kontaktformulare prüfen
        this.checkContactForms();

        // 3. Cookie-Handling prüfen
        this.checkCookieHandling();

        // 4. Datenschutz-Links prüfen
        this.checkPrivacyLinks();

        // 5. Consent-Mechanismen prüfen
        this.checkConsentMechanisms();

        // Ergebnis ausgeben
        this.reportResults();

        // Bei Verstößen Exit-Code 1
        if (this.violations.length > 0) {
            process.exit(1);
        }

        console.log('✅ DSGVO-Compliance bestätigt!');
        process.exit(0);
    }

    checkRequiredPages() {
        console.log('📄 Pflicht-Seiten prüfen...');

        const requiredPages = [
            'src/app/datenschutz/page.tsx',
            'src/app/impressum/page.tsx',
            'src/app/cookie-einstellungen/page.tsx'
        ];

        requiredPages.forEach(page => {
            if (!fs.existsSync(page)) {
                this.violations.push(`❌ Pflicht-Seite fehlt: ${page}`);
            } else {
                console.log(`✅ ${page} vorhanden`);
            }
        });
    }

    checkContactForms() {
        console.log('📝 Kontaktformulare prüfen...');

        // Kontaktformulare in src/ suchen
        const contactForms = this.findContactForms();

        if (contactForms.length === 0) {
            this.violations.push('❌ Keine Kontaktformulare gefunden');
            return;
        }

        contactForms.forEach(form => {
            const content = fs.readFileSync(form, 'utf8');

            // DSGVO-konforme Elemente prüfen
            if (!content.includes('consent') && !content.includes('datenschutz')) {
                this.violations.push(`❌ DSGVO-Consent fehlt in ${form}`);
            } else {
                console.log(`✅ DSGVO-Consent in ${form} vorhanden`);
            }

            if (!content.includes('checkbox') && !content.includes('input type="checkbox"')) {
                this.violations.push(`❌ Consent-Checkbox fehlt in ${form}`);
            } else {
                console.log(`✅ Consent-Checkbox in ${form} vorhanden`);
            }
        });
    }

    checkCookieHandling() {
        console.log('🍪 Cookie-Handling prüfen...');

        // Cookie-Banner oder Cookie-Handling suchen
        const cookieFiles = this.findCookieFiles();

        if (cookieFiles.length === 0) {
            this.violations.push('❌ Kein Cookie-Handling gefunden');
            return;
        }

        cookieFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');

            if (!content.includes('cookie') && !content.includes('Cookie')) {
                this.violations.push(`❌ Cookie-Funktionalität fehlt in ${file}`);
            } else {
                console.log(`✅ Cookie-Handling in ${file} vorhanden`);
            }
        });
    }

    checkPrivacyLinks() {
        console.log('🔗 Datenschutz-Links prüfen...');

        // Footer und Navigation prüfen
        const navigationFiles = [
            'src/components/Core/Footer.tsx',
            'src/components/navigation/Navigation.tsx',
            'src/app/layout.tsx'
        ];

        navigationFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');

                if (!content.includes('datenschutz') && !content.includes('Datenschutz')) {
                    this.violations.push(`❌ Datenschutz-Link fehlt in ${file}`);
                } else {
                    console.log(`✅ Datenschutz-Link in ${file} vorhanden`);
                }

                if (!content.includes('impressum') && !content.includes('Impressum')) {
                    this.violations.push(`❌ Impressum-Link fehlt in ${file}`);
                } else {
                    console.log(`✅ Impressum-Link in ${file} vorhanden`);
                }
            }
        });
    }

    checkConsentMechanisms() {
        console.log('✅ Consent-Mechanismen prüfen...');

        // Consent-Mechanismen in src/ suchen
        const consentFiles = this.findConsentFiles();

        if (consentFiles.length === 0) {
            this.violations.push('❌ Keine Consent-Mechanismen gefunden');
            return;
        }

        consentFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');

            if (!content.includes('consent') && !content.includes('Consent')) {
                this.violations.push(`❌ Consent-Funktionalität fehlt in ${file}`);
            } else {
                console.log(`✅ Consent-Mechanismus in ${file} vorhanden`);
            }
        });
    }

    findContactForms() {
        const contactForms = [];
        const srcDir = 'src';

        if (fs.existsSync(srcDir)) {
            this.walkDir(srcDir, contactForms, ['contact', 'form', 'kontakt']);
        }

        return contactForms;
    }

    findCookieFiles() {
        const cookieFiles = [];
        const srcDir = 'src';

        if (fs.existsSync(srcDir)) {
            this.walkDir(srcDir, cookieFiles, ['cookie', 'Cookie']);
        }

        return cookieFiles;
    }

    findConsentFiles() {
        const consentFiles = [];
        const srcDir = 'src';

        if (fs.existsSync(srcDir)) {
            this.walkDir(srcDir, consentFiles, ['consent', 'Consent', 'gdpr']);
        }

        return consentFiles;
    }

    walkDir(dir, files, keywords) {
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                this.walkDir(fullPath, files, keywords);
            } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js')) {
                // Prüfe ob Datei Keywords enthält
                const content = fs.readFileSync(fullPath, 'utf8');
                const hasKeyword = keywords.some(keyword =>
                    content.toLowerCase().includes(keyword.toLowerCase())
                );

                if (hasKeyword) {
                    files.push(fullPath);
                }
            }
        });
    }

    reportResults() {
        console.log('\n📊 DSGVO-Compliance-Report:');
        console.log('==============================');

        if (this.violations.length === 0) {
            console.log('✅ Alle DSGVO-Anforderungen erfüllt!');
        } else {
            console.log(`❌ ${this.violations.length} DSGVO-Verstöße gefunden:`);
            this.violations.forEach(violation => {
                console.log(`  ${violation}`);
            });

            console.log('\n💡 DSGVO-Korrekturmaßnahmen:');
            console.log('  - Datenschutz-Seite erstellen');
            console.log('  - Impressum-Seite erstellen');
            console.log('  - Cookie-Einstellungen implementieren');
            console.log('  - Consent-Checkboxen in Formularen');
            console.log('  - Datenschutz-Links in Navigation');
        }
    }
}

// Script ausführen
const checker = new DSGVOComplianceChecker();
checker.checkDSGVOCompliance(); 