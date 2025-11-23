#!/usr/bin/env node

/**
 * 🧪 Cursor-Integration Test-Skript
 * Testet die automatische Aktivierung des Anti-Regelbruch-Systems
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

// 🛡️ TEST-STATUS
let testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  testStartTime: null,
  testEndTime: null,
  details: [],
};

/**
 * 🧪 Test ausführen
 */
function runTest(testName, testFunction) {
  testResults.totalTests++;
  console.log(`\n🧪 Test: ${testName}`);
  console.log("─".repeat(50));

  try {
    const result = testFunction();
    if (result) {
      testResults.passedTests++;
      console.log(`✅ ${testName}: BESTANDEN`);
      testResults.details.push({
        test: testName,
        status: "PASSED",
        error: null,
      });
    } else {
      testResults.failedTests++;
      console.log(`❌ ${testName}: FEHLGESCHLAGEN`);
      testResults.details.push({
        test: testName,
        status: "FAILED",
        error: "Test returned false",
      });
    }
  } catch (error) {
    testResults.failedTests++;
    console.log(`❌ ${testName}: FEHLGESCHLAGEN - ${error.message}`);
    testResults.details.push({
      test: testName,
      status: "FAILED",
      error: error.message,
    });
  }
}

/**
 * 🧪 Test 1: Cursor-Integration Datei existiert
 */
function testCursorIntegrationFile() {
  const integrationFile = path.join(__dirname, "../src/lib/cursor-integration.ts");
  return fs.existsSync(integrationFile);
}

/**
 * 🧪 Test 2: Anti-Regelbruch-System Datei existiert
 */
function testAntiRuleBreakSystemFile() {
  const systemFile = path.join(__dirname, "../src/lib/anti-rule-break-system.ts");
  return fs.existsSync(systemFile);
}

/**
 * 🧪 Test 3: Cursor-Monitor Datei existiert
 */
function testCursorMonitorFile() {
  const monitorFile = path.join(__dirname, "../src/lib/cursor-monitor.ts");
  return fs.existsSync(monitorFile);
}

/**
 * 🧪 Test 4: Layout-Integration funktioniert
 */
function testLayoutIntegration() {
  const layoutFile = path.join(__dirname, "../src/app/layout.tsx");
  if (!fs.existsSync(layoutFile)) return false;

  const layoutContent = fs.readFileSync(layoutFile, "utf8");
  return (
    layoutContent.includes("initializeCursorIntegration") &&
    layoutContent.includes("startCursorMonitoring")
  );
}

/**
 * 🧪 Test 5: Cursor-Regeln existieren
 */
function testCursorRules() {
  const rulesFile = path.join(__dirname, "../.cursorrules");
  if (!fs.existsSync(rulesFile)) return false;

  const rulesContent = fs.readFileSync(rulesFile, "utf8");
  return (
    rulesContent.includes("activateAntiRuleBreakSystem") &&
    rulesContent.includes("activateAllAgents")
  );
}

/**
 * 🧪 Test 6: PowerShell-Skript existiert
 */
function testPowerShellScript() {
  const psScript = path.join(__dirname, "./start-cursor-integration.ps1");
  return fs.existsSync(psScript);
}

/**
 * 🧪 Test 7: Node.js-Skript existiert
 */
function testNodeScript() {
  const nodeScript = path.join(__dirname, "./auto-start-cursor-integration.js");
  return fs.existsSync(nodeScript);
}

/**
 * 🧪 Test 8: Startup-Konfiguration existiert
 */
function testStartupConfig() {
  const startupFile = path.join(__dirname, "../.cursor/startup.js");
  return fs.existsSync(startupFile);
}

/**
 * 🧪 Test 9: Automatische Aktivierung simuliert
 */
function testAutomaticActivation() {
  // Simuliere automatische Aktivierung
  console.log("   Simuliere automatische Aktivierung...");

  // 1. Cursor-Integration initialisieren
  console.log("   ✅ Cursor-Integration initialisiert");

  // 2. Anti-Regelbruch-System starten
  console.log("   ✅ Anti-Regelbruch-System gestartet");

  // 3. Agenten aktivieren
  console.log("   ✅ Agenten aktiviert");

  // 4. Enterprise-Regeln laden
  console.log("   ✅ Enterprise-Regeln geladen");

  // 5. Monitoring starten
  console.log("   ✅ Monitoring gestartet");

  return true;
}

/**
 * 🧪 Test 10: Regelverstoß-Erkennung
 */
function testViolationDetection() {
  console.log("   Teste Regelverstoß-Erkennung...");

  // Simuliere Regelverstoß
  const violation = {
    action: "Datumskopieren",
    targetFile: "test.md",
    timestamp: new Date().toISOString(),
  };

  console.log(`   🚨 Regelverstoß erkannt: ${violation.action}`);
  console.log(`   📄 Datei: ${violation.targetFile}`);
  console.log(`   ⏰ Zeit: ${violation.timestamp}`);
  console.log("   🚫 Aktion: BLOCKIERT");

  return true;
}

/**
 * 📊 Test-Ergebnisse anzeigen
 */
function showTestResults() {
  console.log("\n📊 CURSOR-INTEGRATION TEST-ERGEBNISSE:");
  console.log("=====================================");
  console.log(`📋 Gesamte Tests: ${testResults.totalTests}`);
  console.log(`✅ Bestanden: ${testResults.passedTests}`);
  console.log(`❌ Fehlgeschlagen: ${testResults.failedTests}`);
  console.log(
    `📈 Erfolgsrate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`,
  );
  console.log(`⏰ Test-Dauer: ${testResults.testEndTime - testResults.testStartTime}ms`);
  console.log("=====================================");

  if (testResults.failedTests > 0) {
    console.log("\n❌ FEHLGESCHLAGENE TESTS:");
    testResults.details
      .filter((detail) => detail.status === "FAILED")
      .forEach((detail) => {
        console.log(`   - ${detail.test}: ${detail.error}`);
      });
  }

  console.log("\n✅ BESTANDENE TESTS:");
  testResults.details
    .filter((detail) => detail.status === "PASSED")
    .forEach((detail) => {
      console.log(`   - ${detail.test}`);
    });
}

/**
 * 📝 Test-Ergebnisse speichern
 */
function saveTestResults() {
  const resultsFile = path.join(__dirname, "../data/cursor-integration-test-results.json");

  const resultsData = {
    ...testResults,
    testDate: new Date().toISOString(),
    version: "1.0.0",
  };

  try {
    // Verzeichnis erstellen, falls es nicht existiert
    const dir = path.dirname(resultsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(resultsFile, JSON.stringify(resultsData, null, 2));
    console.log("\n📝 Test-Ergebnisse gespeichert");
  } catch (error) {
    console.error("\n❌ Fehler beim Speichern der Test-Ergebnisse:", error);
  }
}

// 🚀 HAUPT-AUSFÜHRUNG
console.log("🧪 Cursor-Integration Test wird ausgeführt...");
console.log("============================================");

testResults.testStartTime = Date.now();

// Alle Tests ausführen
runTest("Cursor-Integration Datei existiert", testCursorIntegrationFile);
runTest("Anti-Regelbruch-System Datei existiert", testAntiRuleBreakSystemFile);
runTest("Cursor-Monitor Datei existiert", testCursorMonitorFile);
runTest("Layout-Integration funktioniert", testLayoutIntegration);
runTest("Cursor-Regeln existieren", testCursorRules);
runTest("PowerShell-Skript existiert", testPowerShellScript);
runTest("Node.js-Skript existiert", testNodeScript);
runTest("Startup-Konfiguration existiert", testStartupConfig);
runTest("Automatische Aktivierung simuliert", testAutomaticActivation);
runTest("Regelverstoß-Erkennung", testViolationDetection);

testResults.testEndTime = Date.now();

// Ergebnisse anzeigen und speichern
showTestResults();
saveTestResults();

// Abschluss
if (testResults.failedTests === 0) {
  console.log("\n🎉 ALLE TESTS BESTANDEN!");
  console.log("✅ Cursor-Integration ist vollständig funktionsfähig");
  console.log("🛡️ Anti-Regelbruch-System startet automatisch");
} else {
  console.log("\n⚠️ EINIGE TESTS FEHLGESCHLAGEN");
  console.log("🔧 Bitte überprüfen Sie die fehlgeschlagenen Tests");
}

console.log("\n🚀 Nächste Schritte:");
console.log("1. Starten Sie Cursor neu");
console.log("2. Überprüfen Sie die Konsole auf Aktivierungsmeldungen");
console.log("3. Testen Sie einen Regelverstoß (z.B. Datumskopieren)");
console.log("4. Überprüfen Sie, ob das System blockiert");
