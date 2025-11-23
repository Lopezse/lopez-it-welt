#!/usr/bin/env node

/**
 * Enterprise Balanced Production Gate
 * Prüft Änderungen gegen policies/change-control.yml
 * Blockiert Push bei Verstößen gegen High-Risk-Regeln
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import yaml from "js-yaml";

const POLICY_PATH = "policies/change-control.yml";
const FREIGABEN_PATH = "freigaben.json";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim();
  } catch (e) {
    return "";
  }
}

function safeRead(file, def = {}) {
  try {
    const content = fs.readFileSync(file, "utf8");
    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      return yaml.load(content) || def;
    }
    return JSON.parse(content) || def;
  } catch {
    return def;
  }
}

function matchPattern(pattern, file) {
  // Einfache Glob-Pattern-Unterstützung
  const regex = new RegExp(
    "^" +
      pattern
        .replace(/\*\*/g, ".*")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, ".")
        .replace(/\./g, "\\.") +
      "$",
  );
  return regex.test(file);
}

function getChangedFiles() {
  // Für pre-push: vergleiche local branch mit remote
  const branch = sh("git rev-parse --abbrev-ref HEAD") || "main";
  const remoteBranch = `origin/${branch}`;
  try {
    sh(`git fetch origin ${branch}`);
    const diff = sh(`git diff --name-only HEAD ${remoteBranch}`);
    return diff.split("\n").filter(Boolean);
  } catch {
    // Falls kein remote branch, verwende staged files
    return sh("git diff --cached --name-only").split("\n").filter(Boolean);
  }
}

function assessRisk(file, policy) {
  for (const rule of policy.rules || []) {
    if (matchPattern(rule.scope, file)) {
      return rule;
    }
  }
  return null;
}

function checkBranchProtection(file, rule) {
  if (!rule.forbid_direct_main) return true;

  const branch = sh("git rev-parse --abbrev-ref HEAD") || "";
  if (branch === "main" || branch === "master") {
    return false;
  }
  return true;
}

function checkApprovals(file, rule, freigaben) {
  if (rule.required_approvals === 0) return true;

  // Prüfe ob Datei in freigaben.allow ist (für strict mode)
  if (freigaben.mode === "strict") {
    const allow = Array.isArray(freigaben.allow) ? freigaben.allow : [];
    // Bei required_approvals > 0 muss Datei explizit freigegeben sein
    return allow.includes(file);
  }

  // Legacy-Modus: Datei als Key
  return freigaben[file] === true;
}

function main() {
  const args = process.argv.slice(2);
  const reportOnly = args.includes("--report");

  console.log("🔒 Enterprise Balanced Production Gate");
  console.log("─".repeat(60));

  // Policy laden
  if (!fs.existsSync(POLICY_PATH)) {
    if (reportOnly) {
      console.log("⚠️  Keine Policy-Datei gefunden (policies/change-control.yml)");
      return 0;
    }
    console.error("❌ Policy-Datei fehlt:", POLICY_PATH);
    return 1;
  }

  const policy = safeRead(POLICY_PATH, { rules: [] });
  const freigaben = safeRead(FREIGABEN_PATH, { mode: "strict", allow: [] });

  // Changed files
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0 && !reportOnly) {
    console.log("✅ Keine Änderungen erkannt");
    return 0;
  }

  if (reportOnly) {
    console.log("\n📊 Enterprise Balanced Production Mode – Risk Matrix:\n");
    const risks = { HIGH: [], MEDIUM: [], LOW: [] };
    policy.rules.forEach((rule) => {
      risks[rule.risk] = risks[rule.risk] || [];
      risks[rule.risk].push(rule.scope);
    });

    console.log("HIGH   →", risks.HIGH.join(", ") || "keine");
    console.log("MEDIUM →", risks.MEDIUM.join(", ") || "keine");
    console.log("LOW    →", risks.LOW.join(", ") || "keine");
    console.log("\n✅ PASS – Enterprise Balanced Production Mode aktiv");
    return 0;
  }

  // Änderungen prüfen
  const violations = [];
  const warnings = [];

  for (const file of changedFiles) {
    const rule = assessRisk(file, policy);
    if (!rule) continue;

    // Branch-Protection prüfen
    if (!checkBranchProtection(file, rule)) {
      violations.push({
        file,
        rule,
        issue: `HIGH-Risk Datei '${file}' darf nicht direkt auf main/master gepusht werden`,
      });
      continue;
    }

    // Approvals prüfen
    if (rule.required_approvals > 0 && !checkApprovals(file, rule, freigaben)) {
      violations.push({
        file,
        rule,
        issue: `Datei '${file}' benötigt ${rule.required_approvals} Freigabe(n) (${rule.risk}-Risk)`,
      });
    }

    // Warnungen für Medium/Low
    if (rule.risk === "MEDIUM" && !checkApprovals(file, rule, freigaben)) {
      warnings.push({
        file,
        rule,
        issue: `MEDIUM-Risk: Freigabe empfohlen für '${file}'`,
      });
    }
  }

  // Ausgabe
  if (violations.length > 0) {
    console.error("\n❌ Richtlinienverletzungen gefunden:\n");
    violations.forEach((v) => {
      console.error(`  • ${v.issue}`);
      console.error(`    Scope: ${v.rule.scope} (${v.rule.risk})`);
    });
    return 1;
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  Warnungen:\n");
    warnings.forEach((w) => {
      console.log(`  • ${w.issue}`);
    });
  }

  console.log("\n✅ Alle Richtlinien eingehalten");
  return 0;
}

process.exit(main());
