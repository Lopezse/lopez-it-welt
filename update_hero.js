const mysql = require("mysql2/promise");

async function updateHero() {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    // Hero-Subtitle optimieren
    await conn.execute("UPDATE content_hero SET subtitle = ? WHERE is_active = TRUE", [
      "Barrierefrei. Mehrsprachig. Sicher.\nIT, die einfach funktioniert.",
    ]);

    console.log("✅ HERO-SUBTITLE OPTIMIERT!");

    // Prüfen
    const [hero] = await conn.execute("SELECT subtitle FROM content_hero WHERE is_active = TRUE");
    console.log("Neuer Untertitel:", hero[0].subtitle);

    await conn.end();
  } catch (err) {
    console.log("❌ DB Fehler:", err.message);
  }
}

updateHero();
