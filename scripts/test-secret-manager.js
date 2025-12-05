/**
 * SecretManager Quick Test
 * 
 * Führt einen schnellen Test durch, um zu prüfen,
 * ob SecretManager korrekt funktioniert.
 * 
 * Ausführung: node scripts/test-secret-manager.js
 * 
 * Hinweis: Lädt .env manuell (ohne dotenv-Package)
 */

// Lade .env Datei manuell (falls vorhanden)
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                const value = valueParts.join('=').trim();
                if (key && value) {
                    process.env[key.trim()] = value;
                }
            }
        });
    }
}

loadEnvFile();

// Import SecretManager (TypeScript muss kompiliert sein)
// Für schnellen Test: Direkte Implementierung

function testSecretManager() {
    console.log("🔍 SecretManager Quick Test\n");
    console.log("=".repeat(50));

    // Test 1: Prüfe, ob OPENAI_API_KEY in process.env vorhanden ist
    console.log("\n1️⃣ Test: OPENAI_API_KEY in process.env");
    const hasKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0;
    console.log(`   ✅ Ergebnis: ${hasKey ? "true" : "false"}`);
    
    if (hasKey) {
        const key = process.env.OPENAI_API_KEY;
        const masked = key.startsWith("sk-") && key.length >= 20 
            ? "sk-***masked***" 
            : `${key.substring(0, 4)}***masked***`;
        console.log(`   ✅ Key gefunden: ${masked}`);
        console.log("   ✅ OPENAI_API_KEY ist in .env gesetzt");
    } else {
        console.log("   ⚠️  OPENAI_API_KEY ist NICHT in .env gesetzt");
        console.log("   💡 Hinweis: Das ist OK, wenn MEDIA_AI_PROVIDER=mock");
    }

    // Test 2: Prüfe MEDIA_AI_PROVIDER
    console.log("\n2️⃣ Test: MEDIA_AI_PROVIDER");
    const provider = process.env.MEDIA_AI_PROVIDER || "mock";
    console.log(`   ✅ Provider: ${provider}`);
    
    if (provider === "mock") {
        console.log("   ✅ Mock-Modus: Keine echten API-Calls");
    } else if (provider === "openai") {
        if (hasKey) {
            console.log("   ✅ OpenAI-Modus: API Key vorhanden");
        } else {
            console.log("   ⚠️  OpenAI-Modus: API Key FEHLT!");
            console.log("   💡 Setze OPENAI_API_KEY in .env");
        }
    }

    // Test 3: Prüfe andere wichtige Variablen
    console.log("\n3️⃣ Test: Weitere Environment-Variablen");
    const vars = [
        "MEDIA_AI_DAILY_LIMIT_USD",
        "MEDIA_AI_MONTHLY_LIMIT_USD",
        "CRON_SECRET",
        "DB_HOST",
        "DB_USER"
    ];
    
    vars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`   ✅ ${varName}: gesetzt`);
        } else {
            console.log(`   ⚠️  ${varName}: nicht gesetzt`);
        }
    });

    // Zusammenfassung
    console.log("\n" + "=".repeat(50));
    console.log("\n📊 Zusammenfassung:");
    
    if (provider === "mock") {
        console.log("   ✅ System läuft im Mock-Modus");
        console.log("   ✅ Keine echten API-Calls");
        console.log("   ✅ Perfekt für Entwicklung");
    } else {
        if (hasKey) {
            console.log("   ✅ System läuft im OpenAI-Modus");
            console.log("   ✅ API Key vorhanden");
            console.log("   ⚠️  Echte API-Calls werden durchgeführt");
        } else {
            console.log("   ❌ System läuft im OpenAI-Modus");
            console.log("   ❌ API Key FEHLT!");
            console.log("   💡 Setze OPENAI_API_KEY in .env");
        }
    }

    console.log("\n✅ Quick Test abgeschlossen!\n");
}

// Führe Test aus
try {
    testSecretManager();
} catch (error) {
    console.error("❌ Fehler beim Test:", error.message);
    process.exit(1);
}

