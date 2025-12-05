/**
 * Erweiterte AI Provider Tests - Enterprise++ Standard (Vereinfachte Version)
 * 
 * Phase L0.4: Erweiterte Tests für Media-KI, DSGVO-Helfer, Code-Analyse, Performance
 * 
 * Diese Version arbeitet direkt mit der Ollama API, ohne TypeScript-Imports
 * 
 * @created 2025-11-29
 * @purpose Phase L0.4: Erweiterte Tests
 */

// Konfiguration
const OLLAMA_URL = process.env.LLAMA_SERVER_URL || 'http://localhost:11434';
const MODEL = process.env.LLAMA_MODEL || 'llama3.2:1b';
const VERBOSE = process.env.VERBOSE === 'true';

/**
 * Hilfsfunktion: Ollama API aufrufen
 */
async function callOllama(prompt, options = {}) {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: options.temperature || 0.7,
                num_predict: options.maxTokens || 1000,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.response || '';
}

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
async function testMediaKITagging() {
    console.log('\n=== TEST 1: Media-KI Tagging ===');
    
    const prompt = `Analysiere dieses Bild und erstelle 5 relevante Tags:
Ein Screenshot zeigt ein Admin-Dashboard mit Statistiken, Grafiken, Navigation und einem blauen Hintergrund.
Antworte NUR mit den Tags, komma-separiert, keine zusätzlichen Erklärungen.`;

    try {
        const { result, duration } = await measureTime(() => callOllama(prompt, { maxTokens: 100, temperature: 0.3 }));

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
async function testMediaKIJson() {
    console.log('\n=== TEST 2: Media-KI JSON-Struktur ===');
    
    const prompt = `Beschreibe ein Bild von einem Admin-Dashboard und gib die Analyse als JSON zurück.
Antworte NUR mit gültigem JSON in diesem Format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Beschreibung des Bildes",
  "category": "dashboard"
}`;

    try {
        const { result, duration } = await measureTime(() => callOllama(prompt, { maxTokens: 200, temperature: 0.3 }));

        console.log(`✅ JSON-Analyse erfolgreich (${duration}ms)`);
        
        // Versuche JSON zu extrahieren
        let jsonStr = result.trim();
        
        // Entferne Code-Blöcke
        if (jsonStr.includes('```json')) {
            const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        } else if (jsonStr.includes('```')) {
            const match = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        }
        
        // Versuche JSON-Objekt zu finden (auch wenn Text davor/dahinter steht)
        // Suche nach der ersten öffnenden Klammer
        const firstBrace = jsonStr.indexOf('{');
        if (firstBrace >= 0) {
            // Finde die passende schließende Klammer
            let braceCount = 0;
            let endBrace = firstBrace;
            for (let i = firstBrace; i < jsonStr.length; i++) {
                if (jsonStr[i] === '{') braceCount++;
                if (jsonStr[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        endBrace = i;
                        break;
                    }
                }
            }
            jsonStr = jsonStr.substring(firstBrace, endBrace + 1);
        }
        
        const parsed = JSON.parse(jsonStr);
        console.log(`   Ergebnis: ${JSON.stringify(parsed, null, 2)}`);
        
        // Validierung
        const isValid = parsed.tags && Array.isArray(parsed.tags) && parsed.description;
        console.log(`   Struktur gültig: ${isValid}`);
        
        return {
            success: true,
            duration,
            valid: isValid,
            result: parsed,
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
async function testDSGVOHelper() {
    console.log('\n=== TEST 3: DSGVO-Helfer ===');
    
    const problematicText = `Wir speichern Ihre Daten für 5 Jahre und geben sie an Partner weiter. 
    Außerdem verwenden wir Cookies ohne Ihre Einwilligung.`;
    
    const prompt = `Analysiere diesen Text auf DSGVO-Probleme und gib konkrete Verbesserungsvorschläge:
    
"${problematicText}"

Antworte als strukturiertes JSON mit:
{
  "hasProblems": true/false,
  "problems": ["Problem 1", "Problem 2"],
  "suggestions": ["Vorschlag 1", "Vorschlag 2"]
}`;

    try {
        const { result, duration } = await measureTime(() => callOllama(prompt, { maxTokens: 500, temperature: 0.2 }));

        console.log(`✅ DSGVO-Analyse erfolgreich (${duration}ms)`);
        
        // Versuche JSON zu extrahieren
        let jsonStr = result.trim();
        
        // Entferne Code-Blöcke
        if (jsonStr.includes('```json')) {
            const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        } else if (jsonStr.includes('```')) {
            const match = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        }
        
        // Versuche JSON-Objekt zu finden (auch wenn Text davor steht)
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }
        
        const parsed = JSON.parse(jsonStr);
        console.log(`   Probleme gefunden: ${parsed.hasProblems}`);
        console.log(`   Anzahl Probleme: ${parsed.problems?.length || 0}`);
        console.log(`   Anzahl Vorschläge: ${parsed.suggestions?.length || 0}`);
        
        if (parsed.problems && parsed.problems.length > 0) {
            console.log(`   Probleme:`);
            parsed.problems.forEach((p, i) => console.log(`     ${i + 1}. ${p}`));
        }
        
        return {
            success: true,
            duration,
            hasProblems: parsed.hasProblems,
            problemsCount: parsed.problems?.length || 0,
            suggestionsCount: parsed.suggestions?.length || 0,
            result: parsed,
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
async function testCodeAnalysis() {
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
    
    const prompt = `Analysiere diesen JavaScript-Code und gib Feedback als JSON:
${codeSnippet}

Antworte als JSON:
{
  "quality": 7,
  "issues": ["Problem 1", "Problem 2"],
  "suggestions": ["Vorschlag 1", "Vorschlag 2"]
}`;

    try {
        const { result, duration } = await measureTime(() => callOllama(prompt, { maxTokens: 300, temperature: 0.2 }));

        console.log(`✅ Code-Analyse erfolgreich (${duration}ms)`);
        
        // Versuche JSON zu extrahieren
        let jsonStr = result.trim();
        
        // Entferne Code-Blöcke
        if (jsonStr.includes('```json')) {
            const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        } else if (jsonStr.includes('```')) {
            const match = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
            if (match) jsonStr = match[1].trim();
        }
        
        // Versuche JSON-Objekt zu finden (auch wenn Text davor steht)
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }
        
        const parsed = JSON.parse(jsonStr);
        console.log(`   Qualität: ${parsed.quality}/10`);
        console.log(`   Probleme: ${parsed.issues?.length || 0}`);
        console.log(`   Vorschläge: ${parsed.suggestions?.length || 0}`);
        
        return {
            success: true,
            duration,
            quality: parsed.quality,
            issuesCount: parsed.issues?.length || 0,
            suggestionsCount: parsed.suggestions?.length || 0,
            result: parsed,
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
async function testPerformance() {
    console.log('\n=== TEST 5: Performance-Test ===');
    
    const prompt = 'Was ist die Hauptstadt von Deutschland?';
    const iterations = 5;
    const durations = [];

    console.log(`   Führe ${iterations} Requests durch...`);

    for (let i = 0; i < iterations; i++) {
        try {
            const { duration } = await measureTime(() => callOllama(prompt, { maxTokens: 50 }));
            durations.push(duration);
            if (VERBOSE) {
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
 * Verfügbarkeitsprüfung
 */
async function checkAvailability() {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Hauptfunktion
 */
async function runExtendedTests() {
    console.log('='.repeat(60));
    console.log('ERWEITERTE AI PROVIDER TESTS - Phase L0.4');
    console.log('='.repeat(60));
    console.log(`Ollama URL: ${OLLAMA_URL}`);
    console.log(`Modell: ${MODEL}`);
    console.log(`Verbose: ${VERBOSE}`);

    // Verfügbarkeit prüfen
    console.log('\n=== Verfügbarkeitsprüfung ===');
    const available = await checkAvailability();
    console.log(`Ollama verfügbar: ${available ? '✅' : '❌'}`);

    if (!available) {
        console.error('❌ Ollama ist nicht verfügbar. Bitte starte Ollama und versuche es erneut.');
        return;
    }

    // Tests durchführen
    const results = {
        mediaTagging: await testMediaKITagging(),
        mediaJson: await testMediaKIJson(),
        dsgvoHelper: await testDSGVOHelper(),
        codeAnalysis: await testCodeAnalysis(),
        performance: await testPerformance(),
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

