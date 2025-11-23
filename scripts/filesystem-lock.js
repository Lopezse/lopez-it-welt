const fs = require("fs");
const fileToProtect = process.argv[2];
const lockFile = `${fileToProtect}.lock`;

function lock() {
  fs.writeFileSync(lockFile, "LOCKED");
  console.log(`🔒 ${fileToProtect} ist jetzt gesperrt.`);
}

function isLocked() {
  return fs.existsSync(lockFile);
}

function unlock() {
  if (isLocked()) {
    fs.unlinkSync(lockFile);
    console.log(`🔓 ${fileToProtect} ist jetzt entsperrt.`);
  }
}

const action = process.argv[3];
if (action === "lock") lock();
else if (action === "unlock") unlock();
else if (action === "check") {
  if (isLocked()) {
    console.error(`❌ Zugriff auf ${fileToProtect} blockiert (LOCKED)!`);
    process.exit(1);
  }
}
