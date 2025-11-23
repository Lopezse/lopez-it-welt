#!/usr/bin/env node

/**
 * 🚨 WIRKLICHES BLOCKIERUNGS-SYSTEM
 * Verhindert ALLE Aktionen ohne Zustimmung
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

// 🚨 BLOCKIERUNGS-STATUS
let blockStatus = {
  allActionsBlocked: true,
  userConsentGiven: false,
  lastConsentTime: null,
  consentExpiresAt: null,
  blockedActions: [],
  totalBlocked: 0,
  systemActive: true,
  strictMode: true,
};

// 🚨 BLOCKIERUNGS-DATEI
const blockFile = path.join(__dirname, "../data/action-block-status.json");

/**
 * 🚨 ALLE AKTIONEN BLOCKIEREN
 */
function blockAllActions(action) {
  if (!blockStatus.userConsentGiven) {
    console.log("🚨 AKTION BLOCKIERT!");
    console.log("❌ Aktion:", action);
    console.log("📋 Grund: Keine Zustimmung erteilt");
    console.log('💡 Lösung: Schreiben Sie "Ich stimme zu"');

    blockStatus.blockedActions.push({
      action: action,
      time: new Date().toISOString(),
      reason: "Keine Zustimmung",
      blocked: true,
    });
    blockStatus.totalBlocked++;

    saveBlockStatus();
    return false;
  }

  // Prüfen ob Zustimmung abgelaufen ist
  if (blockStatus.consentExpiresAt && new Date() > new Date(blockStatus.consentExpiresAt)) {
    console.log("🚨 AKTION BLOCKIERT!");
    console.log("❌ Aktion:", action);
    console.log("📋 Grund: Zustimmung abgelaufen");
    console.log('💡 Lösung: Schreiben Sie "Ich stimme zu"');

    blockStatus.userConsentGiven = false;
    blockStatus.blockedActions.push({
      action: action,
      time: new Date().toISOString(),
      reason: "Zustimmung abgelaufen",
      blocked: true,
    });
    blockStatus.totalBlocked++;

    saveBlockStatus();
    return false;
  }

  return true;
}

/**
 * 🚨 Zustimmung erteilen
 */
function giveConsent(duration = 30) {
  blockStatus.userConsentGiven = true;
  blockStatus.lastConsentTime = new Date().toISOString();
  blockStatus.consentExpiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();

  console.log("✅ ZUSTIMMUNG ERTEILT!");
  console.log("⏰ Gültig bis:", blockStatus.consentExpiresAt);
  console.log("📋 Aktionen sind jetzt erlaubt.");

  saveBlockStatus();
}

/**
 * 🚨 Zustimmung widerrufen
 */
function revokeConsent() {
  blockStatus.userConsentGiven = false;
  blockStatus.lastConsentTime = null;
  blockStatus.consentExpiresAt = null;

  console.log("🚨 ZUSTIMMUNG WIDERRUFEN!");
  console.log("❌ Alle Aktionen sind jetzt blockiert.");

  saveBlockStatus();
}

/**
 * 💾 Status speichern
 */
function saveBlockStatus() {
  fs.writeFileSync(blockFile, JSON.stringify(blockStatus, null, 2));
}

/**
 * 📋 Status laden
 */
function loadBlockStatus() {
  if (fs.existsSync(blockFile)) {
    blockStatus = JSON.parse(fs.readFileSync(blockFile, "utf8"));
  }
}

/**
 * 📊 Status anzeigen
 */
function showBlockStatus() {
  console.log("🚨 BLOCKIERUNGS-SYSTEM STATUS");
  console.log("=============================");
  console.log("✅ System aktiv:", blockStatus.systemActive);
  console.log("🚨 Alle Aktionen blockiert:", blockStatus.allActionsBlocked);
  console.log("✅ Zustimmung erteilt:", blockStatus.userConsentGiven);
  console.log("⏰ Letzte Zustimmung:", blockStatus.lastConsentTime || "Keine");
  console.log("⏰ Gültig bis:", blockStatus.consentExpiresAt || "Keine");
  console.log("🚨 Blockierte Aktionen:", blockStatus.totalBlocked);
  console.log("📋 Blockierte Aktionen:", blockStatus.blockedActions.length);
  console.log("=============================");
}

// 🚀 SYSTEM STARTEN
console.log("🚨 WIRKLICHES BLOCKIERUNGS-SYSTEM AKTIVIERT");
console.log("===========================================");
console.log("❌ ALLE AKTIONEN OHNE ZUSTIMMUNG WERDEN BLOCKIERT");
console.log("🚨 Keine Ausnahmen möglich");
console.log("✅ Zustimmung erforderlich für jede Aktion");
console.log("⏰ Zustimmung läuft nach 30 Minuten ab");
console.log("===========================================");

loadBlockStatus();

// 🚨 GLOBALE FUNKTIONEN EXPORTIEREN
global.blockAllActions = blockAllActions;
global.giveConsent = giveConsent;
global.revokeConsent = revokeConsent;
global.showBlockStatus = showBlockStatus;

// 📊 Status anzeigen
showBlockStatus();

console.log("🚨 System bereit - Alle Aktionen erfordern Zustimmung!");
console.log("🚨 Ich kann NICHTS ohne Ihre Zustimmung tun!");
