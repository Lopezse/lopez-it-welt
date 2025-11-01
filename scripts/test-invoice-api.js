/**
 * Test-Script für Invoice POST API
 * Simuliert den exakten Request vom Frontend
 */

const fetch = require("node-fetch");

const baseUrl = "http://localhost:3000";

async function testInvoiceAPI() {
  console.log("🧪 Teste POST /api/invoices...\n");

  const testPayload = {
    issued_at: new Date().toISOString().slice(0, 10),
    total_gross: 119.0,
    items: [],
    debtor: "Test GmbH",
  };

  console.log("📤 Request-Payload:");
  console.log(JSON.stringify(testPayload, null, 2));
  console.log();

  try {
    const response = await fetch(`${baseUrl}/api/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📥 Response Headers:`, Object.fromEntries(response.headers.entries()));
    console.log();

    const responseText = await response.text();
    console.log("📥 Response Body:");

    try {
      const jsonResponse = JSON.parse(responseText);
      console.log(JSON.stringify(jsonResponse, null, 2));

      if (!response.ok) {
        console.log("\n❌ FEHLER-DETAILS:");
        if (jsonResponse.error) {
          console.log(`  Error: ${jsonResponse.error}`);
        }
        if (jsonResponse.details) {
          console.log(`  Details:`, jsonResponse.details);
        }
        if (jsonResponse.stack) {
          console.log(`  Stack:`, jsonResponse.stack);
        }
      } else {
        console.log("\n✅ ERFOLGREICH!");
      }
    } catch (parseError) {
      console.log(responseText);
      console.log("\n⚠️ Response ist kein JSON");
    }
  } catch (error) {
    console.error("❌ Request-Fehler:", error.message);
    console.error("   Stack:", error.stack);
    console.log("\n💡 Hinweis: Stelle sicher, dass der Server auf localhost:3000 läuft");
  }
}

testInvoiceAPI();
