// =====================================================
// Test-Skript für KI-Agenten + Gedächtnis System
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Test des MySQL-only KI-Gedächtnis-Systems
// =====================================================

import {
  ComplianceAgent,
  DevelopmentAgent,
  KITask,
  QualityAgent,
} from '../lib/ki-agent';

// =====================================================
// Test-Funktionen
// =====================================================

async function testComplianceAgent() {
  console.log('\n🔒 Testing Compliance Agent...');

  const agent = new ComplianceAgent();
  await agent.initialize();

  const task: KITask = {
    id: 'test-compliance-001',
    description: 'Erstelle ein Kontaktformular für die Website',
    category: 'compliance',
    priority: 'hoch',
    context: 'DSGVO-konformes Formular mit Consent-Checkbox',
  };

  try {
    const result = await agent.executeTask(task);
    console.log('✅ Compliance Agent Test erfolgreich:');
    console.log('  - Success:', result.success);
    console.log('  - Compliance Score:', result.compliance_result.score);
    console.log('  - Rules Applied:', result.rules_applied.length);
    console.log('  - Execution Time:', result.execution_time + 'ms');
  } catch (error) {
    console.error('❌ Compliance Agent Test fehlgeschlagen:', error);
  } finally {
    await agent.shutdown();
  }
}

async function testQualityAgent() {
  console.log('\n🎯 Testing Quality Agent...');

  const agent = new QualityAgent();
  await agent.initialize();

  const task: KITask = {
    id: 'test-quality-001',
    description: 'Code-Review für neue Button-Komponente',
    category: 'quality',
    priority: 'mittel',
    context: 'TypeScript, React, Tailwind CSS',
  };

  try {
    const result = await agent.executeTask(task);
    console.log('✅ Quality Agent Test erfolgreich:');
    console.log('  - Success:', result.success);
    console.log(
      '  - Enterprise Compliant:',
      result.compliance_result.is_compliant
    );
    console.log('  - Rules Applied:', result.rules_applied.length);
    console.log('  - Execution Time:', result.execution_time + 'ms');
  } catch (error) {
    console.error('❌ Quality Agent Test fehlgeschlagen:', error);
  } finally {
    await agent.shutdown();
  }
}

async function testDevelopmentAgent() {
  console.log('\n💻 Testing Development Agent...');

  const agent = new DevelopmentAgent();
  await agent.initialize();

  const task: KITask = {
    id: 'test-development-001',
    description: 'Entwickle eine neue Admin-Dashboard-Komponente',
    category: 'development',
    priority: 'hoch',
    context: 'Next.js, TypeScript, Enterprise++ Standards',
  };

  try {
    const result = await agent.executeTask(task);
    console.log('✅ Development Agent Test erfolgreich:');
    console.log('  - Success:', result.success);
    console.log('  - Development Support:', result.result?.development_support);
    console.log('  - Security Checked:', result.result?.security_checked);
    console.log('  - Execution Time:', result.execution_time + 'ms');
  } catch (error) {
    console.error('❌ Development Agent Test fehlgeschlagen:', error);
  } finally {
    await agent.shutdown();
  }
}

async function testMemorySystem() {
  console.log('\n🧠 Testing Memory System...');

  const agent = new ComplianceAgent();
  await agent.initialize();

  try {
    // Statistiken abrufen
    const stats = await agent.getAgentStatistics();
    console.log('✅ Memory System Test erfolgreich:');
    console.log('  - Agent Name:', stats.agent_name);
    console.log('  - Total Rules:', stats.memory_stats.total_rules);
    console.log('  - Active Rules:', stats.memory_stats.active_rules);
    console.log('  - Total Sessions:', stats.memory_stats.total_sessions);
    console.log(
      '  - Compliance Rate:',
      stats.memory_stats.compliance_rate + '%'
    );
  } catch (error) {
    console.error('❌ Memory System Test fehlgeschlagen:', error);
  } finally {
    await agent.shutdown();
  }
}

// =====================================================
// Haupt-Test-Funktion
// =====================================================

async function runAllTests() {
  console.log('🚀 Starting KI-Agenten + Gedächtnis Tests...');
  console.log('==========================================');

  try {
    // 1. Memory System Test
    await testMemorySystem();

    // 2. Compliance Agent Test
    await testComplianceAgent();

    // 3. Quality Agent Test
    await testQualityAgent();

    // 4. Development Agent Test
    await testDevelopmentAgent();

    console.log('\n🎉 Alle Tests erfolgreich abgeschlossen!');
    console.log('✅ KI-Agenten + Gedächtnis System funktioniert');
  } catch (error) {
    console.error('\n❌ Test-Suite fehlgeschlagen:', error);
    process.exit(1);
  }
}

// =====================================================
// Ausführung
// =====================================================

if (require.main === module) {
  runAllTests().catch(console.error);
}

export {
  runAllTests,
  testComplianceAgent,
  testDevelopmentAgent,
  testMemorySystem,
  testQualityAgent,
};
