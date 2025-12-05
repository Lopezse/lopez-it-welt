/**
 * ChromaDB Integration Test Script - Enterprise++ Standard
 * 
 * Testet ChromaDB-Integration ohne Docker (prüft Verfügbarkeit)
 * 
 * @created 2025-11-29
 * @purpose Phase R1.6: ChromaDB Integrationstests
 */

// Import via require (TypeScript wird zur Laufzeit kompiliert)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ChromaDB-Factory importieren
const {
    createChromaClient,
    createChromaCollection,
    checkChromaHealth,
    isChromaAvailable,
    resetChromaInstances,
} = require('../src/lib/rag/config/chroma.ts');

// Embedding Service importieren
const { embeddingService } = require('../src/lib/rag/services/EmbeddingService.ts');

/**
 * Test 1: Health-Check
 */
async function testHealthCheck() {
    console.log('\n=== TEST 1: Health-Check ===');
    
    try {
        const health = await checkChromaHealth();
        console.log(`✅ Health-Check erfolgreich`);
        console.log(`   URL: ${health.url}`);
        console.log(`   Verfügbar: ${health.available ? '✅' : '❌'}`);
        console.log(`   Letzte Prüfung: ${health.lastCheck}`);
        
        if (health.error) {
            console.log(`   ⚠️ Fehler: ${health.error}`);
        }
        
        return {
            success: true,
            available: health.available,
            error: health.error,
        };
    } catch (error) {
        console.error(`❌ Health-Check fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 2: Client-Erstellung
 */
async function testClientCreation() {
    console.log('\n=== TEST 2: Client-Erstellung ===');
    
    try {
        resetChromaInstances();
        const client = await createChromaClient();
        
        if (client === null) {
            console.log(`⚠️ ChromaDB nicht verfügbar - Client ist null`);
            return {
                success: false,
                error: 'ChromaDB nicht verfügbar',
            };
        }
        
        console.log(`✅ Client erfolgreich erstellt`);
        return {
            success: true,
            client: client !== null,
        };
    } catch (error) {
        console.error(`❌ Client-Erstellung fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 3: Collection-Erstellung
 */
async function testCollectionCreation() {
    console.log('\n=== TEST 3: Collection-Erstellung ===');
    
    try {
        resetChromaInstances();
        const collection = await createChromaCollection({
            collectionName: 'test_integration_collection',
        });
        
        if (collection === null) {
            console.log(`⚠️ ChromaDB nicht verfügbar - Collection ist null`);
            return {
                success: false,
                error: 'ChromaDB nicht verfügbar',
            };
        }
        
        console.log(`✅ Collection erfolgreich erstellt`);
        return {
            success: true,
            collection: collection !== null,
        };
    } catch (error) {
        console.error(`❌ Collection-Erstellung fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Test 4: End-to-End (wenn ChromaDB verfügbar)
 */
async function testEndToEnd() {
    console.log('\n=== TEST 4: End-to-End Test ===');
    
    const available = await isChromaAvailable();
    
    if (!available) {
        console.log(`⚠️ ChromaDB nicht verfügbar - Skipping End-to-End Test`);
        console.log(`   Bitte starte ChromaDB mit: docker compose -f docker-compose.chromadb.yml up -d`);
        return {
            success: false,
            skipped: true,
            reason: 'ChromaDB nicht verfügbar',
        };
    }
    
    try {
        resetChromaInstances();
        
        // 1. Collection erstellen
        const collection = await createChromaCollection({
            collectionName: 'test_e2e_collection',
        });
        
        if (!collection) {
            throw new Error('Collection konnte nicht erstellt werden');
        }
        
        // 2. Test-Embedding generieren
        const testText = 'Dies ist ein Test-Dokument für ChromaDB Integration.';
        const embedding = await embeddingService.generateEmbedding(testText);
        console.log(`✅ Embedding generiert (${embedding.length} Dimensionen)`);
        
        // 3. Dokument hinzufügen
        await collection.add({
            ids: ['test-doc-integration-1'],
            embeddings: [embedding],
            documents: [testText],
            metadatas: [{ title: 'Integration Test', category: 'test' }],
        });
        console.log(`✅ Dokument zur Collection hinzugefügt`);
        
        // 4. Query-Embedding generieren
        const queryText = 'Test';
        const queryEmbedding = await embeddingService.generateEmbedding(queryText);
        
        // 5. Suche durchführen
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 1,
        });
        
        console.log(`✅ Suche erfolgreich`);
        console.log(`   Gefundene Dokumente: ${results.ids?.[0]?.length || 0}`);
        
        if (results.ids && results.ids[0] && results.ids[0].length > 0) {
            console.log(`   Erstes Ergebnis: ${results.ids[0][0]}`);
            console.log(`   Distanz: ${results.distances?.[0]?.[0] || 'N/A'}`);
        }
        
        return {
            success: true,
            documentsFound: results.ids?.[0]?.length || 0,
        };
    } catch (error) {
        console.error(`❌ End-to-End Test fehlgeschlagen: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Hauptfunktion
 */
async function runIntegrationTests() {
    console.log('='.repeat(60));
    console.log('CHROMADB INTEGRATIONSTESTS - Phase R1.6');
    console.log('='.repeat(60));
    
    const results = {
        healthCheck: await testHealthCheck(),
        clientCreation: await testClientCreation(),
        collectionCreation: await testCollectionCreation(),
        endToEnd: await testEndToEnd(),
    };
    
    // Zusammenfassung
    console.log('\n' + '='.repeat(60));
    console.log('ZUSAMMENFASSUNG');
    console.log('='.repeat(60));
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    const skippedCount = Object.values(results).filter(r => r.skipped).length;
    
    console.log(`Erfolgreiche Tests: ${successCount}/${totalCount}`);
    if (skippedCount > 0) {
        console.log(`Übersprungene Tests: ${skippedCount}`);
    }
    
    Object.entries(results).forEach(([name, result]) => {
        if (result.skipped) {
            console.log(`⏭️ ${name}: Übersprungen (${result.reason})`);
        } else {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${name}: ${result.success ? 'OK' : result.error || 'Fehler'}`);
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('Tests abgeschlossen');
    console.log('='.repeat(60));
    
    // ChromaDB-Status
    const available = await isChromaAvailable();
    if (!available) {
        console.log('\n⚠️ ChromaDB ist nicht verfügbar.');
        console.log('   Bitte starte ChromaDB mit:');
        console.log('   docker compose -f docker-compose.chromadb.yml up -d');
    } else {
        console.log('\n✅ ChromaDB ist verfügbar und funktioniert!');
    }
}

// Tests starten
runIntegrationTests().catch(console.error);



