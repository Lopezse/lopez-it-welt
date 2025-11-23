/**
 * Test-Script für Invoice POST API
 * Simuliert den Request und zeigt die genaue Fehlermeldung
 */

const http = require("http");

const testPayload = {
  debtor: "Test GmbH",
  issued_at: new Date().toISOString().slice(0, 10),
  total_gross: 119.0,
  items: [],
};

async function testInvoiceAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testPayload);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/invoices",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    console.log("🔍 Teste POST /api/invoices...");
    console.log("📤 Payload:", JSON.stringify(testPayload, null, 2));
    console.log();

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`📥 Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`📋 Headers:`, res.headers);
        console.log();

        let json = null;
        try {
          json = JSON.parse(data);
          console.log("📄 Response:", JSON.stringify(json, null, 2));
        } catch (e) {
          console.log("📄 Response (nicht JSON):", data);
        }

        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(json || data);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Request Error:", error.message);
      if (error.code === "ECONNREFUSED") {
        console.error("⚠️ Server läuft nicht auf localhost:3000");
        console.error("   Bitte starten Sie den Server mit: npm run dev");
      }
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testInvoiceAPI()
  .then(() => {
    console.log("\n✅ Test erfolgreich!");
  })
  .catch((error) => {
    console.error("\n❌ Test fehlgeschlagen:", error.message);
    process.exit(1);
  });

    req.write(postData);
    req.end();
  });
}

testInvoiceAPI()
  .then(() => {
    console.log("\n✅ Test erfolgreich!");
  })
  .catch((error) => {
    console.error("\n❌ Test fehlgeschlagen:", error.message);
    process.exit(1);
  });
