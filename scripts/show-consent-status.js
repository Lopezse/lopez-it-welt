#!/usr/bin/env node

/**
 * 🚨 Zustimmungs-Status anzeigen
 * Zeigt alle blockierten Aktionen und Zustimmungs-Status
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

console.log("🚨 ZUSTIMMUNGS-STATUS");
console.log("======================");

// Status-Dateien prüfen
const statusFile = path.join(__dirname, "../data/anti-rule-break-status.json");
const daemonStatusFile = path.join(__dirname, "../data/anti-rule-break-daemon-status.json");
const dashboardStatusFile = path.join(__dirname, "../data/anti-rule-break-dashboard-status.json");

let status = null;
let daemonStatus = null;
let dashboardStatus = null;

// Status laden
if (fs.existsSync(statusFile)) {
  status = JSON.parse(fs.readFileSync(statusFile, "utf8"));
}

if (fs.existsSync(daemonStatusFile)) {
  daemonStatus = JSON.parse(fs.readFileSync(daemonStatusFile, "utf8"));
}

if (fs.existsSync(dashboardStatusFile)) {
  dashboardStatus = JSON.parse(fs.readFileSync(dashboardStatusFile, "utf8"));
}

// Status anzeigen
console.log("\n🛡️ ANTI-REGELBRUCH-SYSTEM STATUS:");
console.log("==================================");

if (status) {
  console.log(`✅ System aktiv: ${status.antiRuleBreakActive}`);
  console.log(`✅ Agenten aktiv: ${status.agentsActive}`);
  console.log(`✅ Enterprise-Regeln: ${status.enterpriseRulesLoaded}`);
  console.log(`✅ Monitoring aktiv: ${status.monitoringActive}`);
  console.log(`✅ Cursor-Integration: ${status.cursorIntegrationActive}`);
  console.log(`⏰ Startup-Zeit: ${status.startupTime}`);
  console.log(`❌ Fehler: ${status.errorCount}`);
  console.log(`🚨 Verstöße: ${status.violationCount}`);

  // 🚨 NEUE STRENGE EINSTELLUNGEN
  if (status.strictConsentMode) {
    console.log("\n🚨 STRENGE ZUSTIMMUNG:");
    console.log("======================");
    console.log(`✅ Strenge Zustimmung: ${status.strictConsentMode}`);
    console.log(`✅ Explizite Zustimmung erforderlich: ${status.explicitConsentRequired}`);
    console.log(`✅ Benutzer-Bestätigung erforderlich: ${status.userConfirmationRequired}`);
    console.log(`✅ Unautorisierte Aktionen blockiert: ${status.blockUnauthorizedActions}`);
    console.log(`✅ Alle Aktionen geloggt: ${status.logAllActions}`);
    console.log(`📅 Letzte Aktualisierung: ${status.lastSaved}`);
  }
}

if (daemonStatus) {
  console.log("\n🔄 DAEMON STATUS:");
  console.log("=================");
  console.log(`✅ Daemon läuft: ${daemonStatus.daemonRunning}`);
  console.log(`✅ System aktiv: ${daemonStatus.antiRuleBreakActive}`);
  console.log(`✅ Agenten aktiv: ${daemonStatus.agentsActive}`);
  console.log(`✅ Monitoring aktiv: ${daemonStatus.monitoringActive}`);

  if (daemonStatus.strictConsentMode) {
    console.log(`🚨 Strenge Zustimmung: ${daemonStatus.strictConsentMode}`);
    console.log(`🚨 Explizite Zustimmung: ${daemonStatus.explicitConsentRequired}`);
    console.log(`🚨 Benutzer-Bestätigung: ${daemonStatus.userConfirmationRequired}`);
  }
}

if (dashboardStatus) {
  console.log("\n🌐 DASHBOARD STATUS:");
  console.log("====================");
  console.log(`✅ Dashboard aktiv: ${dashboardStatus.antiRuleBreakActive}`);
  console.log(`✅ System aktiv: ${dashboardStatus.antiRuleBreakActive}`);
  console.log(`✅ Agenten aktiv: ${dashboardStatus.agentsActive}`);

  if (dashboardStatus.strictConsentMode) {
    console.log(`🚨 Strenge Zustimmung: ${dashboardStatus.strictConsentMode}`);
    console.log(`🚨 Explizite Zustimmung: ${dashboardStatus.explicitConsentRequired}`);
    console.log(`🚨 Benutzer-Bestätigung: ${dashboardStatus.userConfirmationRequired}`);
  }
}

// 🚨 WARNUNGEN ANZEIGEN
console.log("\n🚨 WARNUNGEN:");
console.log("==============");
console.log("🚨 Alle Aktionen ohne explizite Zustimmung werden blockiert!");
console.log("🚨 Alle Aktionen werden geloggt und überwacht!");
console.log("🚨 Benutzer-Bestätigung ist erforderlich!");
console.log("🚨 Keine Aktionen ohne Zustimmung möglich!");

// 🛡️ EMPFEHLUNGEN
console.log("\n🛡️ EMPFEHLUNGEN:");
console.log("=================");
console.log("✅ Vor jeder Aktion explizite Zustimmung erteilen");
console.log("✅ Benutzer-Bestätigung für spezifische Aktionen");
console.log("✅ Alle Aktionen dokumentieren");
console.log("✅ Regelverstöße sofort melden");

console.log("\n🛡️ Anti-Regelbruch-System: Strenge Zustimmung AKTIV");
console.log("🚨 Keine Aktionen ohne explizite Zustimmung möglich");
