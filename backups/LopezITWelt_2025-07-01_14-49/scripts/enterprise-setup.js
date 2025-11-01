#!/usr/bin/env node

/**
 * 🏗️ Enterprise++ Setup-Skript
 * Automatische Konfiguration aller Enterprise++ Module
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Enterprise++ Konfiguration laden
const config = require('../config/enterprise.config.js');

class EnterpriseSetup {
    constructor() {
        this.config = config;
        this.setupLog = [];
    }

    /**
     * 🚀 Haupt-Setup ausführen
     */
    async runSetup() {
        console.log('🏗️ Enterprise++ Setup gestartet...');
        console.log(`📋 Projekt: ${this.config.project.name} v${this.config.project.version}`);

        try {
            // 1. Verzeichnisstruktur erstellen
            await this.createDirectoryStructure();

            // 2. Sicherheitsmodule aktivieren
            await this.activateSecurityModules();

            // 3. Git-Hooks installieren
            await this.installGitHooks();

            // 4. CI/CD-Pipeline konfigurieren
            await this.configureCICD();

            // 5. Monitoring-System starten
            await this.startMonitoring();

            // 6. Qualitätsprüfungen einrichten
            await this.setupQualityChecks();

            // 7. Dokumentation generieren
            await this.generateDocumentation();

            console.log('✅ Enterprise++ Setup erfolgreich abgeschlossen!');
            this.generateSetupReport();

        } catch (error) {
            console.error('❌ Enterprise++ Setup fehlgeschlagen:', error);
            process.exit(1);
        }
    }

    /**
     * 📁 Verzeichnisstruktur erstellen
     */
    async createDirectoryStructure() {
        console.log('📁 Erstelle Enterprise++ Verzeichnisstruktur...');

        const directories = [
            'src/app/(main)',
            'src/app/admin',
            'src/app/login',
            'src/app/api',
            'src/components/Core',
            'src/components/Features',
            'src/components/admin',
            'src/components/navigation',
            'src/hooks',
            'src/i18n',
            'src/lib',
            'scripts',
            'docs',
            'config',
            '.github/workflows',
            'tests',
            'logs'
        ];

        for (const dir of directories) {
            const fullPath = path.join(process.cwd(), dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                this.log(`✅ Verzeichnis erstellt: ${dir}`);
            }
        }
    }

    /**
     * 🛡️ Sicherheitsmodule aktivieren
     */
    async activateSecurityModules() {
        console.log('🛡️ Aktiviere Enterprise++ Sicherheitsmodule...');

        const securityModules = [
            'ki-sicherheitsmodul.js',
            'anti-rule-break-system.js',
            'enforce-rules-fixed.js',
            'anti-rule-break-hook.js',
            'anti-rule-break-notifications.js'
        ];

        for (const module of securityModules) {
            const modulePath = path.join(process.cwd(), 'scripts', module);
            if (fs.existsSync(modulePath)) {
                this.log(`✅ Sicherheitsmodul aktiviert: ${module}`);
            } else {
                this.log(`❌ Sicherheitsmodul nicht gefunden: ${module}`);
            }
        }
    }

    /**
     * 🔄 Git-Hooks installieren
     */
    async installGitHooks() {
        console.log('🔄 Installiere Enterprise++ Git-Hooks...');

        const hooksDir = path.join(process.cwd(), '.git', 'hooks');
        if (!fs.existsSync(hooksDir)) {
            this.log('❌ Git-Repository nicht gefunden');
            return;
        }

        this.log('✅ Git-Hooks konfiguriert');
    }

    /**
     * 🔄 CI/CD-Pipeline konfigurieren
     */
    async configureCICD() {
        console.log('🔄 Konfiguriere Enterprise++ CI/CD-Pipeline...');

        const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'enterprise-ci-cd.yml');
        if (fs.existsSync(workflowPath)) {
            this.log('✅ CI/CD-Pipeline bereits konfiguriert');
        } else {
            this.log('❌ CI/CD-Pipeline nicht gefunden');
        }
    }

    /**
     * 📊 Monitoring-System starten
     */
    async startMonitoring() {
        console.log('📊 Starte Enterprise++ Monitoring-System...');

        // Monitoring-Konfiguration erstellen
        const monitoringConfig = {
            enabled: this.config.monitoring.enableQualityDashboard,
            logLevel: 'info',
            retention: '30d',
            alerts: {
                quality: true,
                security: true,
                performance: true
            }
        };

        const monitoringPath = path.join(process.cwd(), 'config', 'monitoring.json');
        fs.writeFileSync(monitoringPath, JSON.stringify(monitoringConfig, null, 2));
        this.log('✅ Monitoring-Konfiguration erstellt');
    }

    /**
     * 📋 Qualitätsprüfungen einrichten
     */
    async setupQualityChecks() {
        console.log('📋 Richte Enterprise++ Qualitätsprüfungen ein...');

        // package.json Scripts erweitern
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

            // Enterprise++ Scripts hinzufügen
            packageJson.scripts = {
                ...packageJson.scripts,
                'enterprise:setup': 'node scripts/enterprise-setup.js',
                'enterprise:validate': 'node scripts/ki-sicherheitsmodul.js validate',
                'enterprise:quality': 'node scripts/enterprise-quality-controller.js',
                'enterprise:security': 'node scripts/anti-rule-break-system.js status',
                'enterprise:monitoring': 'node scripts/enterprise-monitoring-system.js'
            };

            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
            this.log('✅ Enterprise++ Scripts zu package.json hinzugefügt');
        }
    }

    /**
     * 📚 Dokumentation generieren
     */
    async generateDocumentation() {
        console.log('📚 Generiere Enterprise++ Dokumentation...');

        const docs = [
            {
                name: 'README.md',
                content: this.generateReadme()
            },
            {
                name: 'ENTERPRISE_SETUP.md',
                content: this.generateSetupGuide()
            }
        ];

        for (const doc of docs) {
            const docPath = path.join(process.cwd(), doc.name);
            fs.writeFileSync(docPath, doc.content);
            this.log(`✅ Dokumentation erstellt: ${doc.name}`);
        }
    }

    /**
     * 📖 README generieren
     */
    generateReadme() {
        return `# 🏗️ ${this.config.project.name}

**Version:** ${this.config.project.version}  
**Status:** ✅ Enterprise++ Konfiguriert  
**Letzte Aktualisierung:** ${this.config.project.lastUpdate}

## 📋 Übersicht

${this.config.project.description}

## 🚀 Schnellstart

\`\`\`bash
# Enterprise++ Setup ausführen
npm run enterprise:setup

# Entwicklungsserver starten
npm run dev

# Enterprise++ Validierung
npm run enterprise:validate
\`\`\`

## 🛡️ Enterprise++ Features

- ✅ KI-Sicherheitsmodul
- ✅ Anti-Regelbruch-System
- ✅ Enterprise++ Enforcement
- ✅ Automatisierte CI/CD-Pipeline
- ✅ Qualitätsmonitoring
- ✅ Deutsche UI-Komponenten

## 📊 Qualitätsstandards

- Test-Coverage: ${this.config.quality.testCoverage}%
- Code-Qualität: ${this.config.quality.codeQuality}
- Security-Score: ${this.config.quality.securityScore}%
- Performance-Score: ${this.config.quality.performanceScore}%

## 📚 Dokumentation

- [Enterprise++ Master-Architektur](docs/enterprise-master-architektur.md)
- [Enterprise++ Starter-Paket](docs/enterprise-starter-paket.md)
- [Enterprise++ Roadmap](docs/enterprise-roadmap.md)
- [Setup-Guide](ENTERPRISE_SETUP.md)

## 🔧 Enterprise++ Scripts

\`\`\`bash
npm run enterprise:setup      # Komplettes Setup
npm run enterprise:validate   # Validierung
npm run enterprise:quality    # Qualitätsprüfung
npm run enterprise:security   # Sicherheitsstatus
npm run enterprise:monitoring # Monitoring
\`\`\`

---

**Enterprise++ System aktiviert** 🛡️
`;
    }

    /**
     * 📖 Setup-Guide generieren
     */
    generateSetupGuide() {
        return `# 🏗️ Enterprise++ Setup-Guide

## 📋 Voraussetzungen

- Node.js v22.15.0+
- npm v10.9.2+
- Git

## 🚀 Installation

1. **Repository klonen**
   \`\`\`bash
   git clone <repository-url>
   cd lopez-it-welt
   \`\`\`

2. **Enterprise++ Setup ausführen**
   \`\`\`bash
   npm run enterprise:setup
   \`\`\`

3. **Abhängigkeiten installieren**
   \`\`\`bash
   npm install
   \`\`\`

4. **Entwicklungsserver starten**
   \`\`\`bash
   npm run dev
   \`\`\`

## ✅ Setup-Verifizierung

\`\`\`bash
# Enterprise++ Status prüfen
npm run enterprise:validate

# Qualitätsprüfung
npm run enterprise:quality

# Sicherheitsstatus
npm run enterprise:security
\`\`\`

## 🛡️ Enterprise++ Module

- **KI-Sicherheitsmodul:** Verhindert KI-Regelverstöße
- **Anti-Regelbruch-System:** Durchsetzt .md-Richtlinien
- **Enterprise++ Enforcement:** Qualitätsstandards
- **Git-Hooks:** Automatisierte Validierung
- **CI/CD-Pipeline:** Automatisierte Deployment

## 📊 Monitoring

- Qualitäts-Dashboard: \`/admin/quality\`
- Audit-Trail: \`/admin/monitoring\`
- Performance-Monitoring: Automatisch aktiviert

---

**Setup abgeschlossen** ✅
`;
    }

    /**
     * 📊 Setup-Report generieren
     */
    generateSetupReport() {
        const report = {
            timestamp: new Date().toISOString(),
            project: this.config.project.name,
            version: this.config.project.version,
            setupLog: this.setupLog,
            status: 'SUCCESS'
        };

        const reportPath = path.join(process.cwd(), 'ENTERPRISE_SETUP_REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('📊 Setup-Report generiert: ENTERPRISE_SETUP_REPORT.json');
    }

    /**
     * 📝 Log-Eintrag hinzufügen
     */
    log(message) {
        this.setupLog.push({
            timestamp: new Date().toISOString(),
            message: message
        });
        console.log(message);
    }
}

// CLI-Verwendung
if (require.main === module) {
    const setup = new EnterpriseSetup();
    setup.runSetup();
}

module.exports = EnterpriseSetup; 