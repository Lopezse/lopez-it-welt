/**
 * Erweiterte AI Provider Tests - Enterprise++ Standard
 * 
 * Phase L0.4: Erweiterte Tests für Media-KI, DSGVO-Helfer, Code-Analyse, Performance
 * 
 * @created 2025-11-29
 * @purpose Phase L0.4: Erweiterte Tests
 */

// Import über Factory (empfohlener Weg)
import { createProvider, loadProviderConfig } from '../src/lib/ai/core/ai-provider-factory.ts';

// Test-Konfiguration
const TEST_CONFIG = {
    provider: process.env.AI_PROVIDER || 'llama', // 'llama', 'openai', 'mock'
    verbose: process.env.VERBOSE === 'true',
    performance: {
        iterations: 5, // Anzahl Wiederholungen für Performance-Tests
    },
};

/**
 * Hilfsfunktion: Zeit messen
 */
async function measureTime(fn) {
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    return {
        result,
        duration: end - start,
    };
}

/**
 * Test 1: Media-KI - Tagging
 */
async function testMediaKITagging(provider) {
    console.log('\n=== TEST 1: Media-KI Tagging ===');
    
    const prompt = `Analysiere dieses Bild und erstelle 5 relevante Tags:
Ein Screenshot zeigt ein Admin-Dashboard mit Statistiken, Grafiken, Navigation und einem blauen Hintergrund.
Antworte NUR mit den Tags, komma-separiert, keine zusätzlichen Erklärungen.`;

    try {
        const { result, duration } = await measureTime(() =>
            provider.requestText(prompt, {
                taskId: 'media-tagging',
                maxTokens: 100,
                temperature: 0.3,
            })
        );

        console.log(`✅ Tagging erfolgreich (${duration}ms)`);
        console.log(`   Antwort: ${result}`);
        
        // Validierung
        const tags = result.split(',').map(t => t.trim()).filter(t => t.length > 0);
        console.log(`   Tags gefunden: ${tags.length}`);
        
        return {
            success: true,
            duration,
            tags: tags.length,
            response: result,
        };
    } catch (error) {
        console.error(`❌ Tagging fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 2: Media-KI - JSON-Struktur
 */
async function testMediaKIJson(provider) {
    console.log('\n=== TEST 2: Media-KI JSON-Struktur ===');
    
    const prompt = `Beschreibe ein Bild von einem Admin-Dashboard und gib die Analyse als JSON zurück.`;
    const schema = {
        type: 'object',
        properties: {
            tags: {
                type: 'array',
                items: { type: 'string' },
            },
            description: { type: 'string' },
            category: { type: 'string' },
        },
        required: ['tags', 'description'],
    };

    try {
        const { result, duration } = await measureTime(() =>
            provider.requestJson(prompt, schema, {
                taskId: 'media-tagging-json',
                maxTokens: 200,
                temperature: 0.3,
            })
        );

        console.log(`✅ JSON-Analyse erfolgreich (${duration}ms)`);
        console.log(`   Ergebnis: ${JSON.stringify(result, null, 2)}`);
        
        // Validierung
        const isValid = result.tags && Array.isArray(result.tags) && result.description;
        console.log(`   Struktur gültig: ${isValid}`);
        
        return {
            success: true,
            duration,
            valid: isValid,
            result,
        };
    } catch (error) {
        console.error(`❌ JSON-Analyse fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 3: DSGVO-Helfer - Text-Analyse
 */
async function testDSGVOHelper(provider) {
    console.log('\n=== TEST 3: DSGVO-Helfer ===');
    
    const problematicText = `Wir speichern Ihre Daten für 5 Jahre und geben sie an Partner weiter. 
    Außerdem verwenden wir Cookies ohne Ihre Einwilligung.`;
    
    const prompt = `Analysiere diesen Text auf DSGVO-Probleme und gib konkrete Verbesserungsvorschläge:
    
"${problematicText}"

Antworte als strukturiertes JSON mit:
- hasProblems: boolean
- problems: string[] (Liste der gefundenen Probleme)
- suggestions: string[] (Konkrete Verbesserungsvorschläge)`;

    const schema = {
        type: 'object',
        properties: {
            hasProblems: { type: 'boolean' },
            problems: {
                type: 'array',
                items: { type: 'string' },
            },
            suggestions: {
                type: 'array',
                items: { type: 'string' },
            },
        },
        required: ['hasProblems', 'problems', 'suggestions'],
    };

    try {
        const { result, duration } = await measureTime(() =>
            provider.requestJson(prompt, schema, {
                taskId: 'dsgvo-helper',
                maxTokens: 500,
                temperature: 0.2,
            })
        );

        console.log(`✅ DSGVO-Analyse erfolgreich (${duration}ms)`);
        console.log(`   Probleme gefunden: ${result.hasProblems}`);
        console.log(`   Anzahl Probleme: ${result.problems?.length || 0}`);
        console.log(`   Anzahl Vorschläge: ${result.suggestions?.length || 0}`);
        
        if (result.problems && result.problems.length > 0) {
            console.log(`   Probleme:`);
            result.problems.forEach((p, i) => console.log(`     ${i + 1}. ${p}`));
        }
        
        return {
            success: true,
            duration,
            hasProblems: result.hasProblems,
            problemsCount: result.problems?.length || 0,
            suggestionsCount: result.suggestions?.length || 0,
            result,
        };
    } catch (error) {
        console.error(`❌ DSGVO-Analyse fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 4: Code-Analyse
 */
async function testCodeAnalysis(provider) {
    console.log('\n=== TEST 4: Code-Analyse ===');
    
    const codeSnippet = `
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}
`;
    
    const prompt = `Analysiere diesen JavaScript-Code und gib Feedback:
${codeSnippet}

Antworte als JSON mit:
- quality: number (0-10)
- issues: string[] (Gefundene Probleme)
- suggestions: string[] (Verbesserungsvorschläge)`;

    const schema = {
        type: 'object',
        properties: {
            quality: { type: 'number' },
            issues: {
                type: 'array',
                items: { type: 'string' },
            },
            suggestions: {
                type: 'array',
                items: { type: 'string' },
            },
        },
        required: ['quality', 'issues', 'suggestions'],
    };

    try {
        const { result, duration } = await measureTime(() =>
            provider.requestJson(prompt, schema, {
                taskId: 'code-analysis',
                maxTokens: 300,
                temperature: 0.2,
            })
        );

        console.log(`✅ Code-Analyse erfolgreich (${duration}ms)`);
        console.log(`   Qualität: ${result.quality}/10`);
        console.log(`   Probleme: ${result.issues?.length || 0}`);
        console.log(`   Vorschläge: ${result.suggestions?.length || 0}`);
        
        return {
            success: true,
            duration,
            quality: result.quality,
            issuesCount: result.issues?.length || 0,
            suggestionsCount: result.suggestions?.length || 0,
            result,
        };
    } catch (error) {
        console.error(`❌ Code-Analyse fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 5: Performance-Test
 */
async function testPerformance(provider) {
    console.log('\n=== TEST 5: Performance-Test ===');
    
    const prompt = 'Was ist die Hauptstadt von Deutschland?';
    const iterations = TEST_CONFIG.performance.iterations;
    const durations = [];

    console.log(`   Führe ${iterations} Requests durch...`);

    for (let i = 0; i < iterations; i++) {
        try {
            const { duration } = await measureTime(() =>
                provider.requestText(prompt, {
                    taskId: `performance-test-${i}`,
                    maxTokens: 50,
                })
            );
            durations.push(duration);
            if (TEST_CONFIG.verbose) {
                console.log(`   Request ${i + 1}: ${duration}ms`);
            }
        } catch (error) {
            console.error(`   Request ${i + 1} fehlgeschlagen: ${error.message}`);
        }
    }

    if (durations.length === 0) {
        return {
            success: false,
            error: 'Keine erfolgreichen Requests',
        };
    }

    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    console.log(`✅ Performance-Test abgeschlossen`);
    console.log(`   Durchschnitt: ${avg.toFixed(0)}ms`);
    console.log(`   Minimum: ${min}ms`);
    console.log(`   Maximum: ${max}ms`);
    console.log(`   Erfolgreiche Requests: ${durations.length}/${iterations}`);

    return {
        success: true,
        iterations: durations.length,
        avg,
        min,
        max,
    };
}

/**
 * Test 6: Kosten-Schätzung
 */
async function testCostEstimation(provider) {
    console.log('\n=== TEST 6: Kosten-Schätzung ===');
    
    const testCases = [
        { input: 100, output: 50, description: 'Kurzer Text' },
        { input: 1000, output: 500, description: 'Mittlerer Text' },
        { input: 5000, output: 2000, description: 'Langer Text' },
    ];

    console.log('   Kosten-Schätzungen:');
    testCases.forEach(({ input, output, description }) => {
        const cost = provider.estimateCost(input, output);
        console.log(`   ${description} (${input}→${output} Zeichen): $${cost.toFixed(6)}`);
    });

    return {
        success: true,
    };
}

/**
 * Hauptfunktion
 */
async function runExtendedTests() {
    console.log('='.repeat(60));
    console.log('ERWEITERTE AI PROVIDER TESTS - Phase L0.4');
    console.log('='.repeat(60));
    console.log(`Provider: ${TEST_CONFIG.provider}`);
    console.log(`Verbose: ${TEST_CONFIG.verbose}`);

    // Provider erstellen über Factory (empfohlener Weg)
    const config = loadProviderConfig();
    
    // Override für ENV-Variablen
    if (process.env.AI_PROVIDER) {
        config.type = process.env.AI_PROVIDER;
    }
    if (process.env.LLAMA_SERVER_URL) {
        config.serverUrl = process.env.LLAMA_SERVER_URL;
    }
    if (process.env.LLAMA_MODEL) {
        config.model = process.env.LLAMA_MODEL;
    }
    
    const provider = createProvider(config);

    // Verfügbarkeit prüfen
    console.log('\n=== Verfügbarkeitsprüfung ===');
    const available = await provider.isAvailable();
    console.log(`Provider verfügbar: ${available}`);

    if (!available) {
        console.error('❌ Provider ist nicht verfügbar. Bitte Konfiguration prüfen.');
        return;
    }

    console.log(`Provider: ${provider.name}`);
    console.log(`Version: ${provider.version}`);
    console.log(`Supports JSON: ${provider.supportsJson}`);

    // Tests durchführen
    const results = {
        mediaTagging: await testMediaKITagging(provider),
        mediaJson: await testMediaKIJson(provider),
        dsgvoHelper: await testDSGVOHelper(provider),
        codeAnalysis: await testCodeAnalysis(provider),
        performance: await testPerformance(provider),
        costEstimation: await testCostEstimation(provider),
    };

    // Zusammenfassung
    console.log('\n' + '='.repeat(60));
    console.log('ZUSAMMENFASSUNG');
    console.log('='.repeat(60));

    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;

    console.log(`Erfolgreiche Tests: ${successCount}/${totalCount}`);

    Object.entries(results).forEach(([name, result]) => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${name}: ${result.success ? 'OK' : result.error || 'Fehler'}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('Tests abgeschlossen');
    console.log('='.repeat(60));
}

// Tests starten
runExtendedTests().catch(console.error);

