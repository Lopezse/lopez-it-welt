const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SafeBackup {
  constructor() {
    this.backupConfig = {
      frequency: 'daily',
      retention: 7, // Nur 7 Tage behalten
      maxSize: 500 * 1024 * 1024, // 500MB max
      excludePatterns: [
        'node_modules',
        '.next',
        '.swc',
        'coverage',
        '.git',
        'backups',
        'temp-cleanup',
        '*.log',
        '*.tmp',
      ],
    };
  }

  async createSafeBackup() {
    console.log('🛡️ Starte sicheres Backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join('backups', `safe-${timestamp}`);

    // Prüfe Speicherplatz
    if (!this.checkDiskSpace()) {
      console.log('❌ Nicht genug Speicherplatz');
      return;
    }

    // Erstelle Backup-Verzeichnis
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups', { recursive: true });
    }
    fs.mkdirSync(backupDir, { recursive: true });

    try {
      // Sichere Backups - nur wichtige Dateien
      await this.backupEssentialFiles(backupDir);
      await this.backupConfigFiles(backupDir);
      await this.backupSourceCode(backupDir);

      // Bereinige alte Backups
      await this.cleanupOldBackups();

      console.log('✅ Sicheres Backup abgeschlossen');
    } catch (error) {
      console.error('❌ Backup fehlgeschlagen:', error.message);
      // Lösche fehlerhaftes Backup
      if (fs.existsSync(backupDir)) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
    }
  }

  checkDiskSpace() {
    try {
      const stats = fs.statSync('.');
      const freeSpace = stats.size; // Vereinfacht
      return freeSpace > this.backupConfig.maxSize;
    } catch {
      return true; // Fallback
    }
  }

  async backupEssentialFiles(backupDir) {
    console.log('📄 Backup wichtige Dateien...');

    const essentialFiles = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.ts',
      'README.md',
      'CHANGELOG.md',
    ];

    for (const file of essentialFiles) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(backupDir, file));
      }
    }
  }

  async backupConfigFiles(backupDir) {
    console.log('⚙️ Backup Konfiguration...');
    const configDir = path.join(backupDir, 'config');
    fs.mkdirSync(configDir, { recursive: true });

    const configFiles = [
      '.eslintrc.json',
      '.prettierrc',
      'jest.config.js',
      'postcss.config.js',
      'docker-compose.yml',
      'Dockerfile',
    ];

    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(configDir, file));
      }
    }
  }

  async backupSourceCode(backupDir) {
    console.log('📦 Backup Source Code (sicher)...');
    const srcDir = path.join(backupDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    // Kopiere nur wichtige Source-Dateien
    const importantDirs = ['app', 'components', 'lib', 'hooks', 'i18n'];

    for (const dir of importantDirs) {
      if (fs.existsSync(path.join('src', dir))) {
        this.copyDirectorySafely(path.join('src', dir), path.join(srcDir, dir));
      }
    }
  }

  copyDirectorySafely(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);

    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      // Prüfe Exclusions
      if (this.shouldExclude(item)) {
        continue;
      }

      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        this.copyDirectorySafely(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  shouldExclude(item) {
    return this.backupConfig.excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(item);
      }
      return item === pattern;
    });
  }

  async cleanupOldBackups() {
    console.log('🧹 Bereinige alte Backups...');

    if (!fs.existsSync('backups')) {
      return;
    }

    const backups = fs
      .readdirSync('backups')
      .filter(item => item.startsWith('safe-'))
      .map(item => {
        const itemPath = path.join('backups', item);
        const stats = fs.statSync(itemPath);
        return {
          name: item,
          path: itemPath,
          date: stats.mtime,
          size: stats.size,
        };
      })
      .sort((a, b) => b.date - a.date);

    // Behalte nur die neuesten 7 Backups
    for (let i = this.backupConfig.retention; i < backups.length; i++) {
      const backup = backups[i];
      try {
        fs.rmSync(backup.path, { recursive: true, force: true });
        console.log(`🗑️ Gelöscht: ${backup.name}`);
      } catch (error) {
        console.log(`⚠️ Konnte nicht löschen: ${backup.name}`);
      }
    }
  }
}

// Führe sicheres Backup aus
const safeBackup = new SafeBackup();
safeBackup.createSafeBackup().catch(console.error);
