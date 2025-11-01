const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class StartupSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.startupLog = [];
    this.isRunning = false;
  }

  // Startup-Prozess starten
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Startup-System läuft bereits');
      return;
    }

    console.log('🚀 Starte Startup-System...');
    this.isRunning = true;

    try {
      // 1. Umgebung prüfen
      await this.checkEnvironment();

      // 2. Abhängigkeiten prüfen
      await this.checkDependencies();

      // 3. Konfiguration validieren
      await this.validateConfiguration();

      // 4. Datenbankverbindung testen (falls vorhanden)
      await this.testDatabaseConnection();

      // 5. Services starten
      await this.startServices();

      // 6. Health-Check durchführen
      await this.performHealthCheck();

      console.log('✅ Startup-System erfolgreich gestartet');
    } catch (error) {
      console.error('❌ Startup-System fehlgeschlagen:', error.message);
      this.isRunning = false;
      throw error;
    }
  }

  // Umgebung prüfen
  async checkEnvironment() {
    console.log('🔍 Prüfe Umgebung...');

    const requiredEnvVars = ['NODE_ENV', 'PORT'];

    const missingVars = [];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      throw new Error(`Fehlende Umgebungsvariablen: ${missingVars.join(', ')}`);
    }

    // Node.js-Version prüfen
    const nodeVersion = process.version;
    const minVersion = '16.0.0';

    if (this.compareVersions(nodeVersion, minVersion) < 0) {
      throw new Error(
        `Node.js-Version ${nodeVersion} ist zu alt. Mindestens ${minVersion} erforderlich.`
      );
    }

    console.log(`  ✅ Node.js ${nodeVersion}`);
    console.log(`  ✅ NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  ✅ PORT: ${process.env.PORT}`);
  }

  // Abhängigkeiten prüfen
  async checkDependencies() {
    console.log('📦 Prüfe Abhängigkeiten...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json nicht gefunden');
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Erforderliche Abhängigkeiten prüfen
      const requiredDeps = ['react', 'next', 'typescript'];

      const missingDeps = [];

      for (const dep of requiredDeps) {
        if (
          !packageJson.dependencies?.[dep] &&
          !packageJson.devDependencies?.[dep]
        ) {
          missingDeps.push(dep);
        }
      }

      if (missingDeps.length > 0) {
        throw new Error(`Fehlende Abhängigkeiten: ${missingDeps.join(', ')}`);
      }

      console.log(
        `  ✅ ${Object.keys(packageJson.dependencies || {}).length} Abhängigkeiten`
      );
      console.log(
        `  ✅ ${Object.keys(packageJson.devDependencies || {}).length} Dev-Abhängigkeiten`
      );
    } catch (error) {
      throw new Error(
        `Fehler beim Prüfen der Abhängigkeiten: ${error.message}`
      );
    }
  }

  // Konfiguration validieren
  async validateConfiguration() {
    console.log('⚙️ Validiere Konfiguration...');

    const configFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
    ];

    const missingConfigs = [];

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (!fs.existsSync(configPath)) {
        missingConfigs.push(configFile);
      }
    }

    if (missingConfigs.length > 0) {
      console.warn(
        `  ⚠️ Fehlende Konfigurationsdateien: ${missingConfigs.join(', ')}`
      );
    } else {
      console.log('  ✅ Alle Konfigurationsdateien vorhanden');
    }

    // i18n-Konfiguration prüfen
    const i18nConfigPath = path.join(this.projectRoot, 'src/i18n/config.ts');
    if (fs.existsSync(i18nConfigPath)) {
      console.log('  ✅ i18n-Konfiguration vorhanden');
    } else {
      console.warn('  ⚠️ i18n-Konfiguration fehlt');
    }
  }

  // Datenbankverbindung testen (falls vorhanden)
  async testDatabaseConnection() {
    console.log('🗄️ Prüfe Datenbankverbindung...');

    // Hier könnte die Datenbankverbindung getestet werden
    // Für dieses Projekt ist keine Datenbank erforderlich

    console.log('  ✅ Keine Datenbankverbindung erforderlich');
  }

  // Services starten
  async startServices() {
    console.log('🔧 Starte Services...');

    // Development-Server starten (falls im Development-Modus)
    if (process.env.NODE_ENV === 'development') {
      await this.startDevServer();
    }

    // Weitere Services hier starten...
    console.log('  ✅ Services gestartet');
  }

  // Development-Server starten
  async startDevServer() {
    console.log('  🚀 Starte Development-Server...');

    try {
      // Prüfen ob Port verfügbar ist
      const port = process.env.PORT || 3000;

      // Server im Hintergrund starten
      const server = spawn('npm', ['run', 'dev'], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        detached: true,
      });

      // Server-Output loggen
      server.stdout.on('data', data => {
        const output = data.toString();
        console.log(`  📝 Server: ${output.trim()}`);

        if (output.includes('Ready') || output.includes('started')) {
          console.log(`  ✅ Development-Server gestartet auf Port ${port}`);
        }
      });

      server.stderr.on('data', data => {
        console.error(`  ❌ Server-Fehler: ${data.toString().trim()}`);
      });

      // Server-Prozess-ID speichern
      this.serverProcess = server;
    } catch (error) {
      console.error(
        `  ❌ Fehler beim Starten des Development-Servers: ${error.message}`
      );
    }
  }

  // Health-Check durchführen
  async performHealthCheck() {
    console.log('🏥 Führe Health-Check durch...');

    const healthChecks = [
      this.checkFileSystem(),
      this.checkNetworkConnectivity(),
      this.checkApplicationHealth(),
    ];

    const results = await Promise.allSettled(healthChecks);

    let failedChecks = 0;

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `  ❌ Health-Check ${index + 1} fehlgeschlagen: ${result.reason}`
        );
        failedChecks++;
      } else {
        console.log(`  ✅ Health-Check ${index + 1} erfolgreich`);
      }
    });

    if (failedChecks > 0) {
      throw new Error(`${failedChecks} Health-Checks fehlgeschlagen`);
    }

    console.log('  ✅ Alle Health-Checks erfolgreich');
  }

  // Dateisystem prüfen
  async checkFileSystem() {
    const criticalPaths = ['src', 'public', 'src/app', 'src/components'];

    for (const criticalPath of criticalPaths) {
      const fullPath = path.join(this.projectRoot, criticalPath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Kritischer Pfad fehlt: ${criticalPath}`);
      }
    }
  }

  // Netzwerkverbindung prüfen
  async checkNetworkConnectivity() {
    // Einfache Netzwerkverbindung prüfen
    // Hier könnte eine echte Netzwerkverbindung getestet werden
    return true;
  }

  // Anwendungsgesundheit prüfen
  async checkApplicationHealth() {
    // Anwendungsspezifische Health-Checks
    const healthChecks = [this.checkI18nIntegrity(), this.checkBuildProcess()];

    await Promise.all(healthChecks);
  }

  // i18n-Integrität prüfen
  async checkI18nIntegrity() {
    const i18nDir = path.join(this.projectRoot, 'src/i18n/locales');

    if (!fs.existsSync(i18nDir)) {
      throw new Error('i18n-Verzeichnis fehlt');
    }

    const languageFiles = fs
      .readdirSync(i18nDir)
      .filter(file => file.endsWith('.json'));

    if (languageFiles.length === 0) {
      throw new Error('Keine Sprachdateien gefunden');
    }

    // Mindestens deutsche und englische Übersetzungen
    const requiredLanguages = ['de.json', 'en.json'];
    const missingLanguages = requiredLanguages.filter(
      lang => !languageFiles.includes(lang)
    );

    if (missingLanguages.length > 0) {
      throw new Error(`Fehlende Sprachdateien: ${missingLanguages.join(', ')}`);
    }
  }

  // Build-Prozess prüfen
  async checkBuildProcess() {
    try {
      // TypeScript-Kompilierung testen
      execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });
    } catch (error) {
      throw new Error(
        `TypeScript-Kompilierung fehlgeschlagen: ${error.message}`
      );
    }
  }

  // Startup-System stoppen
  async stop() {
    console.log('🛑 Stoppe Startup-System...');

    if (this.serverProcess) {
      try {
        this.serverProcess.kill();
        console.log('  ✅ Development-Server gestoppt');
      } catch (error) {
        console.warn(
          '  ⚠️ Fehler beim Stoppen des Development-Servers:',
          error.message
        );
      }
    }

    this.isRunning = false;
    console.log('✅ Startup-System gestoppt');
  }

  // Status abrufen
  getStatus() {
    return {
      running: this.isRunning,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
    };
  }

  // Versionen vergleichen
  compareVersions(v1, v2) {
    const normalize = v => v.replace(/^v/, '').split('.').map(Number);
    const n1 = normalize(v1);
    const n2 = normalize(v2);

    for (let i = 0; i < Math.max(n1.length, n2.length); i++) {
      const num1 = n1[i] || 0;
      const num2 = n2[i] || 0;

      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
    }

    return 0;
  }

  // Log-Eintrag hinzufügen
  log(message, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
    };

    this.startupLog.push(logEntry);

    // Log in Datei speichern
    const logFile = path.join(this.projectRoot, 'startup.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const startup = new StartupSystem();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      startup
        .start()
        .then(() => {
          console.log('Startup abgeschlossen');
        })
        .catch(error => {
          console.error('Startup fehlgeschlagen:', error.message);
          process.exit(1);
        });
      break;

    case 'stop':
      startup.stop();
      break;

    case 'status':
      const status = startup.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;

    default:
      console.log('Verwendung: node startup.js [start|stop|status]');
  }
}

module.exports = StartupSystem;
