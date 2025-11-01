// =====================================================
// Test-Script für KI-Agenten
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Test der implementierten KI-Agenten
// =====================================================

const { ComplianceAgent } = require('../src/lib/agents/compliance-agent.ts');
const { TextManagementAgent } = require('../src/lib/agents/text-management-agent.ts');
const { QualityAgent } = require('../src/lib/agents/quality-agent.ts');

async function testKIAgents() {
    console.log('🤖 KI-Agenten Test gestartet...\n');

    try {
        // 1. Compliance-Agent testen
        console.log('🛡️ Teste Compliance-Agent...');
        const complianceAgent = new ComplianceAgent();

        const formData = {
            formName: 'KontaktFormular',
            fields: ['name', 'email', 'message'],
            purpose: 'Kontaktaufnahme und Support',
            dataRetention: '2 Jahre',
            legalBasis: 'Art. 6 Abs. 1 lit. b DSGVO'
        };

        const complianceResult = await complianceAgent.createDSGVOCompliantForm(formData);

        if (complianceResult.success) {
            console.log('✅ Compliance-Agent: DSGVO-konformes Formular erstellt');
            console.log(`📊 Compliance-Score: ${complianceResult.compliance.score}%`);
        } else {
            console.log('❌ Compliance-Agent: Formular-Erstellung fehlgeschlagen');
        }

        // 2. Text-Management-Agent testen
        console.log('\n📝 Teste Text-Management-Agent...');
        const textAgent = new TextManagementAgent();

        const texts = await textAgent.loadTextsFromDatabase();
        console.log(`✅ Text-Management-Agent: ${texts.length} Texte geladen`);

        const textComponent = await textAgent.createTextComponent(texts);
        console.log('✅ Text-Management-Agent: Text-Komponente erstellt');

        const textKeys = await textAgent.generateTextKeys('src/components/Core/Header.tsx');
        console.log(`✅ Text-Management-Agent: ${textKeys.length} Text-Keys extrahiert`);

        // 3. Quality-Agent testen
        console.log('\n🔍 Teste Quality-Agent...');
        const qualityAgent = new QualityAgent();

        const qualityReport = await qualityAgent.analyzeCodeQuality('src/components/Core/Header.tsx');

        if (qualityReport.passed) {
            console.log('✅ Quality-Agent: Code-Qualität bestätigt');
            console.log(`📊 Qualitäts-Score: ${qualityReport.overall}%`);
        } else {
            console.log('❌ Quality-Agent: Qualitätsprobleme gefunden');
            qualityReport.issues.forEach(issue => console.log(`  ${issue}`));
        }

        // 4. Agenten-Integration testen
        console.log('\n🔗 Teste Agenten-Integration...');

        // Compliance + Quality Integration
        const integratedResult = await testAgentIntegration(complianceAgent, qualityAgent);

        if (integratedResult.success) {
            console.log('✅ Agenten-Integration erfolgreich');
        } else {
            console.log('❌ Agenten-Integration fehlgeschlagen');
        }

        console.log('\n🎉 KI-Agenten Test abgeschlossen!');

    } catch (error) {
        console.error('❌ Fehler beim KI-Agenten Test:', error);
    }
}

async function testAgentIntegration(complianceAgent, qualityAgent) {
    try {
        // Simuliere integrierten Workflow
        const formData = {
            formName: 'TestFormular',
            fields: ['name', 'email'],
            purpose: 'Test-Zweck',
            dataRetention: '1 Jahr',
            legalBasis: 'Art. 6 Abs. 1 lit. a DSGVO'
        };

        // 1. Compliance-Agent erstellt Formular
        const complianceResult = await complianceAgent.createDSGVOCompliantForm(formData);

        if (!complianceResult.success) {
            return { success: false, error: 'Compliance-Agent fehlgeschlagen' };
        }

        // 2. Quality-Agent prüft generiertes Formular
        const qualityReport = await qualityAgent.analyzeCodeQuality('generated-form.tsx');

        if (!qualityReport.passed) {
            return { success: false, error: 'Quality-Agent: Qualitätsprobleme' };
        }

        return { success: true };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Test ausführen
testKIAgents(); 