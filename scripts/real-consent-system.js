#!/usr/bin/env node

/**
 * 🚨 ECHTES ZUSTIMMUNGSSYSTEM
 * Blockiert ALLE Aktionen ohne explizite Zustimmung
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

// 🚨 ZUSTIMMUNGS-STATUS
let consentStatus = {
  userConsentGiven: false,
  lastConsentTime: null,
  consentExpiresAt: null,
  blockedActions: [],
  totalBlocked: 0,
  systemActive: true,
};

// 🚨 ZUSTIMMUNGS-DATEI
const consentFile = path.join(__dirname, "../data/user-consent.json");

/**
 * 🚨 Zustimmung prüfen
 */
function checkConsent(action) {
  if (!consentStatus.userConsentGiven) {
    console.log("🚨 ZUSTIMMUNG ERFORDERLICH!");
    console.log("❌ Aktion blockiert:", action);
    console.log("📋 Bitte geben Sie explizite Zustimmung für diese Aktion.");
    console.log('💡 Verwenden Sie: "Ich stimme zu" oder "Zustimmung erteilt"');

    consentStatus.blockedActions.push({
      action: action,
      time: new Date().toISOString(),
      reason: "Keine Zustimmung",
    });
    consentStatus.totalBlocked++;

    saveConsentStatus();
    return false;
  }

  // Prüfen ob Zustimmung abgelaufen ist
  if (consentStatus.consentExpiresAt && new Date() > new Date(consentStatus.consentExpiresAt)) {
    console.log("🚨 ZUSTIMMUNG ABGELAUFEN!");
    console.log("❌ Aktion blockiert:", action);
    console.log("📋 Bitte geben Sie erneut Zustimmung.");

    consentStatus.userConsentGiven = false;
    consentStatus.blockedActions.push({
      action: action,
      time: new Date().toISOString(),
      reason: "Zustimmung abgelaufen",
    });
    consentStatus.totalBlocked++;

    saveConsentStatus();
    return false;
  }

  return true;
}

/**
 * 🚨 Zustimmung erteilen
 */
function giveConsent(duration = 30) {
  // 30 Minuten Standard
  consentStatus.userConsentGiven = true;
  consentStatus.lastConsentTime = new Date().toISOString();
  consentStatus.consentExpiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();

  console.log("✅ ZUSTIMMUNG ERTEILT!");
  console.log("⏰ Gültig bis:", consentStatus.consentExpiresAt);
  console.log("📋 Alle Aktionen sind jetzt erlaubt.");

  saveConsentStatus();
}

/**
 * 🚨 Zustimmung widerrufen
 */
function revokeConsent() {
  consentStatus.userConsentGiven = false;
  consentStatus.lastConsentTime = null;
  consentStatus.consentExpiresAt = null;

  console.log("🚨 ZUSTIMMUNG WIDERRUFEN!");
  console.log("❌ Alle Aktionen sind jetzt blockiert.");

  saveConsentStatus();
}

/**
 * 💾 Status speichern
 */
function saveConsentStatus() {
  fs.writeFileSync(consentFile, JSON.stringify(consentStatus, null, 2));
}

/**
 * 📋 Status laden
 */
function loadConsentStatus() {
  if (fs.existsSync(consentFile)) {
    consentStatus = JSON.parse(fs.readFileSync(consentFile, "utf8"));
  }
}

/**
 * 📊 Status anzeigen
 */
function showStatus() {
  console.log("🚨 ZUSTIMMUNGS-SYSTEM STATUS");
  console.log("============================");
  console.log("✅ System aktiv:", consentStatus.systemActive);
  console.log("✅ Zustimmung erteilt:", consentStatus.userConsentGiven);
  console.log("⏰ Letzte Zustimmung:", consentStatus.lastConsentTime || "Keine");
  console.log("⏰ Gültig bis:", consentStatus.consentExpiresAt || "Keine");
  console.log("🚨 Blockierte Aktionen:", consentStatus.totalBlocked);
  console.log("📋 Blockierte Aktionen:", consentStatus.blockedActions.length);
  console.log("============================");
}

// 🚀 SYSTEM STARTEN
console.log("🚨 ECHTES ZUSTIMMUNGSSYSTEM AKTIVIERT");
console.log("=====================================");
console.log("❌ ALLE AKTIONEN OHNE ZUSTIMMUNG WERDEN BLOCKIERT");
console.log("✅ Zustimmung erforderlich für jede Aktion");
console.log("⏰ Zustimmung läuft nach 30 Minuten ab");
console.log("=====================================");

loadConsentStatus();

// 🚨 GLOBALE FUNKTIONEN EXPORTIEREN
global.checkConsent = checkConsent;
global.giveConsent = giveConsent;
global.revokeConsent = revokeConsent;
global.showConsentStatus = showStatus;

// 📊 Status anzeigen
showStatus();

console.log("🚨 System bereit - Alle Aktionen erfordern Zustimmung!");
