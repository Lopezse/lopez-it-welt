#!/usr/bin/env node

/**
 * freigabe-check.js
 *
 * Prüft, ob für geänderte Dateien eine Freigabe in freigaben.json vorliegt.
 * Beendet mit Exit Code 1, wenn eine Datei ohne Freigabe geändert werden soll.
 *
 * Integration: Husky Pre-Commit Hook, Anti-Regelbruch-System
 *
 * Autor: Lopez IT Welt
 * Stand: 2025-07-07
 */

const fs = require('fs');
const path = require('path');

// 1. Pfad zur Freigabe-Datei
const FREIGABEN_PATH = path.resolve(__dirname, '../freigaben.json');

// 2. Geänderte Dateien ermitteln (per Git)
function getChangedFiles() {
  try {
    // Nur staged Dateien (bereit zum Commit)
    const stdout = require('child_process').execSync(
      'git diff --cached --name-only',
      { encoding: 'utf8' }
    );
    return stdout.split('\n').filter(Boolean);
  } catch (err) {
    console.error(
      '❌ Fehler beim Ermitteln der geänderten Dateien:',
      err.message
    );
    process.exit(1);
  }
}

// 3. Freigaben laden
function loadFreigaben() {
  if (!fs.existsSync(FREIGABEN_PATH)) {
    console.error('❌ freigaben.json nicht gefunden:', FREIGABEN_PATH);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(FREIGABEN_PATH, 'utf8'));
  } catch (err) {
    console.error('❌ Fehler beim Lesen von freigaben.json:', err.message);
    process.exit(1);
  }
}

// 4. Prüfung durchführen
function checkFreigaben(changedFiles, freigaben) {
  let blockiert = false;
  changedFiles.forEach(file => {
    if (freigaben.hasOwnProperty(file)) {
      if (!freigaben[file]) {
        console.error(
          `🚨 Änderung BLOCKIERT: Für ${file} liegt KEINE Freigabe vor!`
        );
        blockiert = true;
      } else {
        console.log(`✅ Freigabe für ${file} vorhanden.`);
      }
    }
  });
  if (blockiert) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// 5. Hauptlogik
function main() {
  const changedFiles = getChangedFiles();
  const freigaben = loadFreigaben();
  checkFreigaben(changedFiles, freigaben);
}

main();
