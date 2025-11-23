// =====================================================
// Test-Skript für DSGVO-Compliance-System
// =====================================================
// Erstellt: 2025-07-02
// Zweck: Test des optimierten Compliance-Systems
// =====================================================

const {
  ComplianceScannerMySQL,
} = require('./src/lib/compliance-system-mysql.ts');

async function testComplianceSystem() {
  console.log('🚀 Starte DSGVO-Compliance-Test...');

  try {
    // Compliance-Scanner erstellen
    const scanner = new ComplianceScannerMySQL();

    // DSGVO-Compliance-Scan durchführen
    const result = await scanner.scanForCompliance('DSGVO-Test-Scan', 'DSGVO');

    console.log('✅ Compliance-Scan abgeschlossen!');
    console.log('📊 Ergebnisse:');
    console.log(JSON.stringify(result, null, 2));

    // DSGVO-Compliance-Bewertung anzeigen
    if (result.results.dsgvoCompliance) {
      const compliance = result.results.dsgvoCompliance;
      console.log('\n🎯 DSGVO-Compliance-Bewertung:');
      console.log(`📈 Gesamtscore: ${compliance.score}%`);
      console.log(
        `✅ Bestandene Checks: ${compliance.passedChecks}/${compliance.totalChecks}`
      );

      console.log('\n📋 Details:');
      Object.entries(compliance.details).forEach(([key, detail]) => {
        const status = detail.found ? '✅' : '❌';
        const score = detail.score || 0;
        console.log(
          `${status} ${key}: ${score}% ${detail.path ? `(${detail.path})` : ''}`
        );
      });

      console.log('\n💡 Empfehlungen:');
      compliance.recommendations.forEach(rec => {
        console.log(`  ${rec}`);
      });
    }
  } catch (error) {
    console.error('❌ Fehler beim Compliance-Test:', error);
  }
}

// Test ausführen
testComplianceSystem();
