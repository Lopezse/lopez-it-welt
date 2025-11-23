#!/usr/bin/env node

/**
 * Release Tag Script
 * Erstellt ein Git-Tag basierend auf dem aktuellen Datum
 */

import { execSync } from "node:child_process";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: "inherit", encoding: "utf8" }).trim();
  } catch (e) {
    console.error(`Fehler: ${e.message}`);
    process.exit(1);
  }
}

function main() {
  const today = new Date();
  const version = `v${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  console.log(`🏷️  Erstelle Release-Tag: ${version}`);

  sh(`git tag -a ${version} -m "Release ${version}"`);
  console.log(`✅ Tag ${version} erstellt`);

  console.log(`📤 Push Tag zum Remote? (git push --tags)`);
  console.log(`   Führe manuell aus: git push --tags`);
}

main();



/**
 * Release Tag Script
 * Erstellt ein Git-Tag basierend auf dem aktuellen Datum
 */

import { execSync } from "node:child_process";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: "inherit", encoding: "utf8" }).trim();
  } catch (e) {
    console.error(`Fehler: ${e.message}`);
    process.exit(1);
  }
}

function main() {
  const today = new Date();
  const version = `v${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  console.log(`🏷️  Erstelle Release-Tag: ${version}`);

  sh(`git tag -a ${version} -m "Release ${version}"`);
  console.log(`✅ Tag ${version} erstellt`);

  console.log(`📤 Push Tag zum Remote? (git push --tags)`);
  console.log(`   Führe manuell aus: git push --tags`);
}

main();



















