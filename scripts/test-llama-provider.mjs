/**
 * LLaMA Provider Test Script
 * 
 * Testet den LLaMA-Provider mit lokalem Ollama
 */

import { createLLaMAProvider } from "../src/lib/ai/providers/llama-provider.ts";

async function testLLaMAProvider() {
    console.log("🧪 Teste LLaMA-Provider...\n");

    const provider = createLLaMAProvider({
        serverUrl: "http://localhost:11434",
        model: "llama3.2:1b",
    });

    console.log(`Provider: ${provider.name}`);
    console.log(`Version: ${provider.version}`);
    console.log(`Supports JSON: ${provider.supportsJson}\n`);

    // Test 1: Verfügbarkeit
    console.log("1️⃣ Prüfe Verfügbarkeit...");
    const available = await provider.isAvailable();
    console.log(`   Verfügbar: ${available ? "✅" : "❌"}\n`);

    if (!available) {
        console.log("⚠️ Ollama läuft nicht. Bitte starte Ollama und versuche es erneut.");
        return;
    }

    // Test 2: Text-Request
    console.log("2️⃣ Teste requestText()...");
    try {
        const textResponse = await provider.requestText("Hallo, wie geht es dir?", {
            taskId: "test-request-text",
        });
        console.log(`   ✅ Antwort erhalten (${textResponse.length} Zeichen)`);
        console.log(`   Antwort: ${textResponse.substring(0, 100)}...\n`);
    } catch (error) {
        console.log(`   ❌ Fehler: ${error.message}\n`);
    }

    // Test 3: JSON-Request
    console.log("3️⃣ Teste requestJson()...");
    try {
        const schema = {
            type: "object",
            properties: {
                tags: { type: "array", items: { type: "string" } },
            },
        };

        const jsonResponse = await provider.requestJson(
            "Erstelle 3 Tags für ein Admin-Dashboard. Antworte nur mit JSON: {\"tags\": [\"tag1\", \"tag2\", \"tag3\"]}",
            schema,
            {
                taskId: "test-request-json",
            }
        );

        console.log(`   ✅ JSON erhalten:`, jsonResponse);
        console.log(`   Tags: ${jsonResponse.tags?.join(", ")}\n`);
    } catch (error) {
        console.log(`   ❌ Fehler: ${error.message}\n`);
    }

    // Test 4: Kosten-Schätzung
    console.log("4️⃣ Teste estimateCost()...");
    const cost = provider.estimateCost(100, 50);
    console.log(`   Kosten: ${cost} € (lokal = kostenlos)\n`);

    console.log("✅ Alle Tests abgeschlossen!");
}

testLLaMAProvider().catch(console.error);

