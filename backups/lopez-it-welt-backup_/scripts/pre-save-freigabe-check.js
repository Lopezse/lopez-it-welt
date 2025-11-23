const fs = require('fs');
const path = require('path');

const FREIGABEN_PATH = path.resolve(__dirname, '../freigaben.json');
const file = process.argv[2];

function isFreigabe(file) {
  if (!fs.existsSync(FREIGABEN_PATH)) return false;
  const freigaben = JSON.parse(fs.readFileSync(FREIGABEN_PATH, 'utf8'));
  return !!freigaben[file];
}

if (!isFreigabe(file)) {
  console.error(
    `❌ Speichern von ${file} blockiert: Keine Freigabe vorhanden!`
  );
  process.exit(1);
}
