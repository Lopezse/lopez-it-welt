#!/usr/bin/env node

/**
 * Generate Software Bill of Materials (SBOM)
 * SPDX 2.3 Format (JSON)
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function main() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const commit = sh("git rev-parse HEAD") || "unknown";
  const timestamp = new Date().toISOString();

  const sbom = {
    spdxVersion: "SPDX-2.3",
    dataLicense: "CC0-1.0",
    SPDXID: "SPDXRef-DOCUMENT",
    name: `Lopez-IT-Welt-${packageJson.version}`,
    documentNamespace: `https://lopez-it-welt.de/spdx/${commit}`,
    creationInfo: {
      created: timestamp,
      creators: ["Tool: Lopez IT Welt SBOM Generator", `Person: ${packageJson.author || "Unknown"}`],
      licenseListVersion: "3.23",
    },
    packages: Object.entries(packageJson.dependencies || {})
      .concat(Object.entries(packageJson.devDependencies || {}))
      .map(([name, version]) => ({
        SPDXID: `SPDXRef-Package-${name}`,
        name,
        versionInfo: version.replace(/[\^~]/g, ""),
        downloadLocation: `NOASSERTION`,
        filesAnalyzed: false,
        licenseConcluded: "NOASSERTION",
        licenseDeclared: "NOASSERTION",
        copyrightText: "NOASSERTION",
      })),
  };

  const outputPath = "sbom.json";
  fs.writeFileSync(outputPath, JSON.stringify(sbom, null, 2) + "\n", "utf8");

  // Backup nach D:\
  try {
    const backupDir = "D:/Backups/Lopez_IT_Welt/Compliance";
    fs.mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `sbom-${timestamp.replace(/[:T]/g, "-")}.json`);
    fs.copyFileSync(outputPath, backupPath);
    console.log(`✅ SBOM generiert: ${outputPath}`);
    console.log(`✅ SBOM archiviert: ${backupPath}`);
  } catch (err) {
    console.error("⚠️  Backup fehlgeschlagen:", err.message);
    console.log(`✅ SBOM generiert: ${outputPath}`);
  }
}

main();


/**
 * Generate Software Bill of Materials (SBOM)
 * SPDX 2.3 Format (JSON)
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function main() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const commit = sh("git rev-parse HEAD") || "unknown";
  const timestamp = new Date().toISOString();

  const sbom = {
    spdxVersion: "SPDX-2.3",
    dataLicense: "CC0-1.0",
    SPDXID: "SPDXRef-DOCUMENT",
    name: `Lopez-IT-Welt-${packageJson.version}`,
    documentNamespace: `https://lopez-it-welt.de/spdx/${commit}`,
    creationInfo: {
      created: timestamp,
      creators: ["Tool: Lopez IT Welt SBOM Generator", `Person: ${packageJson.author || "Unknown"}`],
      licenseListVersion: "3.23",
    },
    packages: Object.entries(packageJson.dependencies || {})
      .concat(Object.entries(packageJson.devDependencies || {}))
      .map(([name, version]) => ({
        SPDXID: `SPDXRef-Package-${name}`,
        name,
        versionInfo: version.replace(/[\^~]/g, ""),
        downloadLocation: `NOASSERTION`,
        filesAnalyzed: false,
        licenseConcluded: "NOASSERTION",
        licenseDeclared: "NOASSERTION",
        copyrightText: "NOASSERTION",
      })),
  };

  const outputPath = "sbom.json";
  fs.writeFileSync(outputPath, JSON.stringify(sbom, null, 2) + "\n", "utf8");

  // Backup nach D:\
  try {
    const backupDir = "D:/Backups/Lopez_IT_Welt/Compliance";
    fs.mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `sbom-${timestamp.replace(/[:T]/g, "-")}.json`);
    fs.copyFileSync(outputPath, backupPath);
    console.log(`✅ SBOM generiert: ${outputPath}`);
    console.log(`✅ SBOM archiviert: ${backupPath}`);
  } catch (err) {
    console.error("⚠️  Backup fehlgeschlagen:", err.message);
    console.log(`✅ SBOM generiert: ${outputPath}`);
  }
}

main();

