#!/usr/bin/env node

/**
 * 🧹 Cleanup große Dateien
 * Entfernt alte große Dateien für bessere Performance
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleanup große Dateien...');

const dataPath = 'data';
const largeFiles = [
  'agenten-gedaechtnis-alt.json',
  'agenten-gedaechtnis-backup-2025-07-07-09-39.json',
];

let cleaned = 0;

for (const file of largeFiles) {
  const filePath = path.join(dataPath, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Entfernt: ${file}`);
      cleaned++;
    } catch (error) {
      console.log(`❌ Fehler beim Entfernen: ${file}`);
    }
  }
}

console.log(`\n🎉 Cleanup abgeschlossen: ${cleaned} Dateien entfernt`);
console.log('🚀 System sollte jetzt schneller laufen!');
