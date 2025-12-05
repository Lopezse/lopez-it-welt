#!/usr/bin/env node

/**
 * =====================================================
 * 🛡️ ENTERPRISE++ LOCAL DATABASE BACKUP
 * =====================================================
 * 
 * ZWECK:
 * - Erstellt einen SQL-Dump der aktuellen Datenbank
 * - Speichert LOKAL unter backups/db/
 * - Ergänzung zum externen Backup-System (D:\Backups)
 * 
 * VERWENDUNG:
 * node scripts/backup-db-local.js
 * 
 * VORAUSSETZUNGEN:
 * - mysqldump muss verfügbar sein
 * - XAMPP: C:\xampp\mysql\bin\mysqldump.exe
 * 
 * HINWEIS:
 * Dieses Script LÖSCHT NICHTS, es liest nur und exportiert.
 * =====================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfiguration
const CONFIG = {
  // Mögliche Pfade zu mysqldump
  MYSQLDUMP_PATHS: [
    'C:\\xampp\\mysql\\bin\\mysqldump.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
    'mysqldump' // Falls im PATH
  ],
  
  // Backup-Verzeichnis (relativ zum Projekt)
  BACKUP_DIR: path.join(__dirname, '..', 'backups', 'db'),
  
  // Maximale Anzahl lokaler Backups (älteste werden gelöscht)
  MAX_BACKUPS: 10
};

/**
 * Lädt .env Datei
 */
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const env = {};
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    });
  }
  
  return env;
}

/**
 * Findet mysqldump
 */
function findMysqldump() {
  for (const dumpPath of CONFIG.MYSQLDUMP_PATHS) {
    if (dumpPath === 'mysqldump') {
      // Prüfe ob im PATH
      try {
        execSync('mysqldump --version', { stdio: 'ignore' });
        return 'mysqldump';
      } catch {
        continue;
      }
    } else if (fs.existsSync(dumpPath)) {
      return dumpPath;
    }
  }
  return null;
}

/**
 * Bereinigt alte Backups
 */
function cleanOldBackups() {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) return;
  
  const files = fs.readdirSync(CONFIG.BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: path.join(CONFIG.BACKUP_DIR, f),
      time: fs.statSync(path.join(CONFIG.BACKUP_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  // Lösche alte Backups über dem Limit
  if (files.length > CONFIG.MAX_BACKUPS) {
    const toDelete = files.slice(CONFIG.MAX_BACKUPS);
    toDelete.forEach(f => {
      fs.unlinkSync(f.path);
      console.log(`🗑️ Altes Backup gelöscht: ${f.name}`);
    });
  }
}

/**
 * Hauptfunktion
 */
async function createBackup() {
  console.log('=====================================================');
  console.log('🛡️ ENTERPRISE++ LOCAL DATABASE BACKUP');
  console.log('=====================================================');
  console.log('Modus: READ-ONLY (keine Änderungen an der Datenbank)');
  console.log('');
  
  // Umgebungsvariablen laden
  const env = loadEnv();
  
  const dbHost = env.DB_HOST || 'localhost';
  const dbPort = env.DB_PORT || '3306';
  const dbUser = env.DB_USER || 'root';
  const dbPassword = env.DB_PASSWORD || '';
  const dbName = env.DB_NAME || 'lopez_it_welt_dev';
  
  console.log(`📊 Datenbank: ${dbName}`);
  console.log(`📍 Host: ${dbHost}:${dbPort}`);
  console.log(`👤 User: ${dbUser}`);
  console.log('');
  
  // Sicherheitsprüfung
  if (dbName === 'lopez_it_welt' && !dbName.endsWith('_dev')) {
    console.log('⚠️ HINWEIS: Du sicherst die PROD-Datenbank.');
    console.log('   Das ist OK für Backups, aber sei vorsichtig!');
    console.log('');
  }
  
  // mysqldump finden
  const mysqldump = findMysqldump();
  if (!mysqldump) {
    console.error('❌ mysqldump nicht gefunden!');
    console.error('');
    console.error('Mögliche Lösungen:');
    console.error('1. XAMPP installieren (C:\\xampp\\mysql\\bin\\)');
    console.error('2. MySQL Server installieren');
    console.error('3. mysqldump zum PATH hinzufügen');
    process.exit(1);
  }
  
  console.log(`🔧 mysqldump: ${mysqldump}`);
  console.log('');
  
  // Backup-Verzeichnis erstellen
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    console.log(`📁 Backup-Verzeichnis erstellt: ${CONFIG.BACKUP_DIR}`);
  }
  
  // Dateiname generieren
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[T:]/g, '-')
    .replace(/\..+/, '');
  const fileName = `${dbName}_${timestamp}.sql`;
  const filePath = path.join(CONFIG.BACKUP_DIR, fileName);
  
  console.log(`📄 Backup-Datei: ${fileName}`);
  console.log('');
  
  try {
    console.log('⏳ Erstelle Backup...');
    
    // mysqldump Befehl
    const passwordArg = dbPassword ? `-p${dbPassword}` : '';
    const command = `"${mysqldump}" -h ${dbHost} -P ${dbPort} -u ${dbUser} ${passwordArg} --single-transaction --routines --triggers --add-drop-table ${dbName}`;
    
    const output = execSync(command, { 
      encoding: 'utf8',
      maxBuffer: 100 * 1024 * 1024, // 100 MB
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Header hinzufügen
    const header = `-- =====================================================
-- ENTERPRISE++ LOCAL DATABASE BACKUP
-- =====================================================
-- Datenbank: ${dbName}
-- Erstellt: ${now.toISOString()}
-- Host: ${dbHost}:${dbPort}
-- Script: scripts/backup-db-local.js
-- =====================================================

`;
    
    fs.writeFileSync(filePath, header + output);
    
    // Statistiken
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('');
    console.log('✅ BACKUP ERFOLGREICH!');
    console.log('');
    console.log(`📄 Datei: ${filePath}`);
    console.log(`📊 Größe: ${sizeMB} MB`);
    console.log('');
    
    // Alte Backups bereinigen
    cleanOldBackups();
    
    // Backup-Liste anzeigen
    const backups = fs.readdirSync(CONFIG.BACKUP_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort()
      .reverse();
    
    console.log(`📋 Vorhandene Backups (${backups.length}/${CONFIG.MAX_BACKUPS}):`);
    backups.forEach((b, i) => {
      const marker = i === 0 ? '→' : ' ';
      console.log(`   ${marker} ${b}`);
    });
    
    console.log('');
    console.log('=====================================================');
    console.log('💡 TIPP: Für externes Backup nutze:');
    console.log('   node scripts/backup-system.js');
    console.log('=====================================================');
    
  } catch (error) {
    console.error('');
    console.error('❌ BACKUP FEHLGESCHLAGEN!');
    console.error('');
    console.error(`Fehler: ${error.message}`);
    console.error('');
    console.error('Mögliche Ursachen:');
    console.error('- MySQL/XAMPP nicht gestartet');
    console.error('- Falsches Passwort in .env');
    console.error('- Datenbank existiert nicht');
    process.exit(1);
  }
}

// Script starten
createBackup();



