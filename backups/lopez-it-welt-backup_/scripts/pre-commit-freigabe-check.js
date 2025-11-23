const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FREIGABEN_PATH = path.resolve(__dirname, '../freigaben.json');
const changedFiles = execSync('git diff --cached --name-only', {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const now = new Date();
console.log(
  `🛡️ Enterprise++ Regeln werden live überwacht – ${now.toLocaleString()}`
);

if (!fs.existsSync(FREIGABEN_PATH)) {
  console.error('❌ Freigaben-Datei fehlt!');
  process.exit(1);
}
const freigaben = JSON.parse(fs.readFileSync(FREIGABEN_PATH, 'utf8'));

let blockiert = false;
changedFiles.forEach(file => {
  if (freigaben[file] !== true) {
    console.error(`❌ Commit blockiert: Keine Freigabe für ${file}`);
    blockiert = true;
  }
});

if (blockiert) process.exit(1);
