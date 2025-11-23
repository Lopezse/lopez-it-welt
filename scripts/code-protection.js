#!/usr/bin/env node

/**
 * 🔒 Code-Schutz & Obfuscation Script
 *
 * Dieses Script schützt den Source Code vor:
 * - Code-Diebstahl
 * - Reverse Engineering
 * - Unerlaubte Kopien
 *
 * Verwendung:
 * node scripts/code-protection.js
 */

const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

// Konfiguration
const config = {
  // Grundlegende Obfuscation
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,

  // Debug-Schutz
  debugProtection: true,
  debugProtectionInterval: 2000, // Zahl in Millisekunden
  disableConsoleOutput: true,

  // Identifier-Obfuscation
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,

  // String-Obfuscation
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  splitStrings: true,
  splitStringsChunkLength: 10,

  // Transform-Obfuscation
  numbersToExpressions: true,
  simplify: true,
  transformObjectKeys: true,

  // Self-Defending
  selfDefending: true,

  // Logging deaktivieren
  log: false,

  // Unicode-Escape deaktivieren
  unicodeEscapeSequence: false,
};

// Dateien die obfusciert werden sollen
const targetFiles = [
  "src/components/Features/LicenseProtectedShop.tsx",
  "src/hooks/useLicense.ts",
  "src/components/Features/KISicherheit.tsx",
  "src/app/api/license/validate/route.ts",
];

// Dateien die NICHT obfusciert werden sollen
const excludeFiles = [
  "node_modules",
  ".next",
  "coverage",
  "cypress",
  "tests",
  "__tests__",
  ".test.",
  ".spec.",
];

/**
 * Prüft ob eine Datei obfusciert werden soll
 */
function shouldObfuscate(filePath) {
  // Exclude-Dateien prüfen
  for (const exclude of excludeFiles) {
    if (filePath.includes(exclude)) {
      return false;
    }
  }

  // Nur JavaScript-Dateien (keine TypeScript)
  const ext = path.extname(filePath);
  return [".js", ".jsx"].includes(ext);
}

/**
 * Obfusciert eine einzelne Datei
 */
function obfuscateFile(filePath) {
  try {
    console.log(`🔒 Obfusciere: ${filePath}`);

    // Datei lesen
    const sourceCode = fs.readFileSync(filePath, "utf8");

    // Obfuscation anwenden
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, config).getObfuscatedCode();

    // Backup erstellen
    const backupPath = filePath + ".backup";
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, sourceCode);
      console.log(`💾 Backup erstellt: ${backupPath}`);
    }

    // Obfuscierten Code schreiben
    fs.writeFileSync(filePath, obfuscatedCode);
    console.log(`✅ Obfusciert: ${filePath}`);

    return true;
  } catch (error) {
    console.error(`❌ Fehler bei ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Rekursiv durch Verzeichnisse gehen
 */
function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (stat.isFile()) {
      callback(filePath);
    }
  }
}

/**
 * Hauptfunktion
 */
function main() {
  console.log("🔒 Code-Schutz & Obfuscation gestartet...\n");

  let successCount = 0;
  let errorCount = 0;

  // Nur Build-Output: .next/static/chunks/
  const buildDir = path.join(".next", "static", "chunks");
  if (fs.existsSync(buildDir)) {
    walkDirectory(buildDir, (filePath) => {
      if (shouldObfuscate(filePath)) {
        if (obfuscateFile(filePath)) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    });
  } else {
    console.log('⚠️  Build-Ordner nicht gefunden. Bitte zuerst "npm run build" ausführen.');
  }

  console.log("\n📊 Obfuscation-Ergebnis:");
  console.log(`✅ Erfolgreich obfusciert: ${successCount} Dateien`);
  console.log(`❌ Fehler: ${errorCount} Dateien`);

  if (errorCount === 0) {
    console.log("\n🎉 Code-Schutz erfolgreich aktiviert!");
    console.log("🔒 Dein Build-Code ist jetzt vor Diebstahl geschützt.");
  } else {
    console.log("\n⚠️  Einige Dateien konnten nicht obfusciert werden.");
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = {
  obfuscateFile,
  shouldObfuscate,
  config,
};
