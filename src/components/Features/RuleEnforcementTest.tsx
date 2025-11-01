'use client';
import React from 'react';
import { useRuleEnforcementHook } from '../../hooks/useRuleEnforcement';

export default function RuleEnforcementTest() {
  const { isBlocked, violationCount, lastViolation, checkRules } =
    useRuleEnforcementHook();
  const [testResult, setTestResult] = React.useState<string>('');

  const testBlockingSystem = async () => {
    setTestResult('Teste Blockierungssystem...');

    // Test 1: Normale Aktion (sollte durchgehen)
    const action1 = 'edit_file STATUS.md';
    const result1 = checkRules(action1);
    setTestResult(
      prev =>
        prev +
        `\n✅ Test 1: ${action1} - ${result1 ? 'ERFOLGREICH' : 'BLOCKIERT'}`
    );

    // Test 2: Verbotene Aktion (sollte blockiert werden)
    const action2 = 'edit_file src/app/layout.tsx';
    const result2 = checkRules(action2);
    setTestResult(
      prev =>
        prev +
        `\n❌ Test 2: ${action2} - ${result2 ? 'ERFOLGREICH' : 'BLOCKIERT'}`
    );

    // Test 3: Neue .md Datei (sollte blockiert werden)
    const action3 = 'create new .md file';
    const result3 = checkRules(action3);
    setTestResult(
      prev =>
        prev +
        `\n❌ Test 3: ${action3} - ${result3 ? 'ERFOLGREICH' : 'BLOCKIERT'}`
    );

    // Test 4: Automatische Änderung (sollte blockiert werden)
    const action4 = 'automatic code change';
    const result4 = checkRules(action4);
    setTestResult(
      prev =>
        prev +
        `\n❌ Test 4: ${action4} - ${result4 ? 'ERFOLGREICH' : 'BLOCKIERT'}`
    );

    // Status anzeigen
    const status = { isBlocked, violationCount, lastViolation };
    setTestResult(
      prev => prev + `\n\n📊 STATUS:\n${JSON.stringify(status, null, 2)}`
    );
  };

  const testApprovalSystem = async () => {
    setTestResult('Teste Freigabe-System...');

    try {
      const action = 'edit_file protected_file.tsx';
      setTestResult(prev => prev + `\n🚨 Fordere Freigabe an für: ${action}`);

      const approved = await checkRules(action);
      setTestResult(
        prev =>
          prev +
          `\n${approved ? '✅' : '❌'} Freigabe: ${approved ? 'ERTEILT' : 'VERWEIGERT'}`
      );
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Fehler: ${error}`);
    }
  };

  const showCurrentStatus = () => {
    const status = { isBlocked, violationCount, lastViolation };
    setTestResult(`📊 AKTUELLER STATUS:\n${JSON.stringify(status, null, 2)}`);
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        🛡️ Rule Enforcement System Test
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <button
          onClick={testBlockingSystem}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        >
          🔍 Blockierung testen
        </button>

        <button
          onClick={testApprovalSystem}
          className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
        >
          ✅ Freigabe testen
        </button>

        <button
          onClick={showCurrentStatus}
          className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
        >
          📊 Status anzeigen
        </button>
      </div>

      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Test-Ergebnisse:
        </h3>
        <pre className='text-sm text-gray-700 whitespace-pre-wrap font-mono'>
          {testResult || 'Klicken Sie auf einen Test-Button...'}
        </pre>
      </div>

      <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
          ℹ️ Anleitung:
        </h3>
        <ul className='text-sm text-yellow-700 space-y-1'>
          <li>
            • <strong>Blockierung testen:</strong> Prüft verschiedene Aktionen
            gegen die Regeln
          </li>
          <li>
            • <strong>Freigabe testen:</strong> Simuliert eine Aktion, die
            Freigabe benötigt
          </li>
          <li>
            • <strong>Status anzeigen:</strong> Zeigt den aktuellen
            Blockierungsstatus
          </li>
          <li>
            • Bei Blockierung erscheint ein Overlay - Sie müssen explizit
            freigeben
          </li>
        </ul>
      </div>
    </div>
  );
}
