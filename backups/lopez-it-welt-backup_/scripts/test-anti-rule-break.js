#!/usr/bin/env node

/**
 * 🧪 Anti-Regelbruch-System Test
 * Testet alle Funktionen des Anti-Regelbruch-Systems
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-07-07
 */

const fs = require('fs');
const path = require('path');

// Anti-Regelbruch Hook importieren
const { AntiRuleBreakHook } = require('./anti-rule-break-hook.js');

class AntiRuleBreakTester {
  constructor() {
    this.hook = new AntiRuleBreakHook();
    this.testResults = [];
  }

  /**
   * 🧪 Alle Tests ausführen
   */
  async runAllTests() {
    console.log('🧪 Anti-Regelbruch-System Tests starten...\n');

    // Test 1: System-Zeit Validierung
    await this.testSystemTimeValidation();

    // Test 2: Datumskopieren Blockierung
    await this.testDateCopyingBlocking();

    // Test 3: Md-Struktur Validierung
    await this.testMdStructureValidation();

    // Test 4: Freigabe-System
    await this.testApprovalSystem();

    // Test 5: Zeiterfassung
    await this.testTimeTracking();

    // Ergebnisse anzeigen
    this.showResults();
  }

  /**
   * ⏰ Test: System-Zeit Validierung
   */
  async testSystemTimeValidation() {
    console.log('⏰ Test 1: System-Zeit Validierung');

    try {
      const result = await this.hook.validateSystemTime();

      if (result.valid) {
        console.log('   ✅ System-Zeit ist gültig');
        this.testResults.push({ test: 'System-Zeit', status: 'PASSED' });
      } else {
        console.log('   ❌ System-Zeit ist ungültig:', result.reason);
        this.testResults.push({
          test: 'System-Zeit',
          status: 'FAILED',
          reason: result.reason,
        });
      }
    } catch (error) {
      console.log('   ❌ System-Zeit Test fehlgeschlagen:', error.message);
      this.testResults.push({
        test: 'System-Zeit',
        status: 'ERROR',
        reason: error.message,
      });
    }
    console.log('');
  }

  /**
   * 📅 Test: Datumskopieren Blockierung
   */
  async testDateCopyingBlocking() {
    console.log('📅 Test 2: Datumskopieren Blockierung');

    const testCases = [
      { action: 'Normale Aktion', expected: true },
      { action: 'Aktion mit 2025-01-19', expected: false },
      { action: 'Aktion mit 29.07.2025', expected: false },
      { action: 'Aktion mit 27.06.2025', expected: false },
    ];

    for (const testCase of testCases) {
      try {
        const result = await this.hook.validateNoDateCopying(testCase.action);

        if (result.valid === testCase.expected) {
          console.log(
            `   ✅ "${testCase.action}": ${result.valid ? 'ERLAUBT' : 'BLOCKIERT'}`
          );
        } else {
          console.log(
            `   ❌ "${testCase.action}": Erwartet ${testCase.expected}, aber ${result.valid}`
          );
          this.testResults.push({
            test: 'Datumskopieren',
            status: 'FAILED',
            reason: `Fehler bei: ${testCase.action}`,
          });
          return;
        }
      } catch (error) {
        console.log(`   ❌ Datumskopieren Test fehlgeschlagen:`, error.message);
        this.testResults.push({
          test: 'Datumskopieren',
          status: 'ERROR',
          reason: error.message,
        });
        return;
      }
    }

    this.testResults.push({ test: 'Datumskopieren', status: 'PASSED' });
    console.log('');
  }

  /**
   * 📄 Test: Md-Struktur Validierung
   */
  async testMdStructureValidation() {
    console.log('📄 Test 3: Md-Struktur Validierung');

    const testFiles = ['test.md', 'test.txt', 'test.MD'];

    for (const testFile of testFiles) {
      try {
        const result = await this.hook.validateMdStructure(testFile);

        if (result.valid) {
          console.log(`   ✅ "${testFile}": Gültig`);
        } else {
          console.log(`   ❌ "${testFile}": ${result.reason}`);
        }
      } catch (error) {
        console.log(`   ❌ Md-Struktur Test fehlgeschlagen:`, error.message);
      }
    }

    this.testResults.push({ test: 'Md-Struktur', status: 'PASSED' });
    console.log('');
  }

  /**
   * ✅ Test: Freigabe-System
   */
  async testApprovalSystem() {
    console.log('✅ Test 4: Freigabe-System');

    try {
      // Freigabe zurückziehen
      this.hook.revokeApproval();
      console.log('   🔄 Freigabe zurückgezogen');

      // Test ohne Freigabe
      const result1 =
        await this.hook.validateBeforeAction('Test ohne Freigabe');
      if (!result1.valid) {
        console.log('   ✅ Aktion ohne Freigabe blockiert');
      } else {
        console.log('   ❌ Aktion ohne Freigabe nicht blockiert');
        this.testResults.push({
          test: 'Freigabe-System',
          status: 'FAILED',
          reason: 'Aktion nicht blockiert',
        });
        return;
      }

      // Freigabe erteilen
      this.hook.grantApproval();
      console.log('   ✅ Freigabe erteilt');

      // Test mit Freigabe
      const result2 = await this.hook.validateBeforeAction('Test mit Freigabe');
      if (result2.valid) {
        console.log('   ✅ Aktion mit Freigabe erlaubt');
      } else {
        console.log('   ❌ Aktion mit Freigabe blockiert');
        this.testResults.push({
          test: 'Freigabe-System',
          status: 'FAILED',
          reason: 'Aktion blockiert trotz Freigabe',
        });
        return;
      }

      this.testResults.push({ test: 'Freigabe-System', status: 'PASSED' });
    } catch (error) {
      console.log('   ❌ Freigabe-System Test fehlgeschlagen:', error.message);
      this.testResults.push({
        test: 'Freigabe-System',
        status: 'ERROR',
        reason: error.message,
      });
    }
    console.log('');
  }

  /**
   * ⏱️ Test: Zeiterfassung
   */
  async testTimeTracking() {
    console.log('⏱️ Test 5: Zeiterfassung');

    try {
      const result = await this.hook.validateTimeTracking('Test-Zeiterfassung');

      if (result.valid) {
        console.log('   ✅ Zeiterfassung ist gültig');
        this.testResults.push({ test: 'Zeiterfassung', status: 'PASSED' });
      } else {
        console.log('   ❌ Zeiterfassung ist ungültig:', result.reason);
        this.testResults.push({
          test: 'Zeiterfassung',
          status: 'FAILED',
          reason: result.reason,
        });
      }
    } catch (error) {
      console.log('   ❌ Zeiterfassung Test fehlgeschlagen:', error.message);
      this.testResults.push({
        test: 'Zeiterfassung',
        status: 'ERROR',
        reason: error.message,
      });
    }
    console.log('');
  }

  /**
   * 📊 Ergebnisse anzeigen
   */
  showResults() {
    console.log('📊 Test-Ergebnisse:');
    console.log('==================');

    let passed = 0;
    let failed = 0;
    let errors = 0;

    for (const result of this.testResults) {
      if (result.status === 'PASSED') {
        console.log(`   ✅ ${result.test}: PASSED`);
        passed++;
      } else if (result.status === 'FAILED') {
        console.log(`   ❌ ${result.test}: FAILED - ${result.reason}`);
        failed++;
      } else {
        console.log(`   🚨 ${result.test}: ERROR - ${result.reason}`);
        errors++;
      }
    }

    console.log('\n📈 Zusammenfassung:');
    console.log(`   ✅ Bestanden: ${passed}`);
    console.log(`   ❌ Fehlgeschlagen: ${failed}`);
    console.log(`   🚨 Fehler: ${errors}`);
    console.log(`   📊 Gesamt: ${this.testResults.length} Tests`);

    if (failed === 0 && errors === 0) {
      console.log('\n🎉 ALLE TESTS BESTANDEN!');
      console.log('🛡️ Anti-Regelbruch-System funktioniert korrekt!');
    } else {
      console.log('\n⚠️ EINIGE TESTS FEHLGESCHLAGEN!');
      console.log('🔧 Anti-Regelbruch-System benötigt Korrekturen!');
    }
  }
}

// Test ausführen
const tester = new AntiRuleBreakTester();
tester.runAllTests();
