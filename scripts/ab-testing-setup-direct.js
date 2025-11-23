/**
 * A/B TESTING CORE - DATENBANK SETUP (Direkt)
 * Datum: 2025-10-31 15:20:48
 * Zweck: Datenbank-Schema direkt erstellen
 */

const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function setupDatabase() {
  let connection;
  const log = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    results: {},
  };

  try {
    console.log("🔧 Starte A/B-Testing Datenbank-Setup...\n");

    connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    console.log("✅ Datenbankverbindung hergestellt\n");

    // 1. Haupttabelle: Experimente
    console.log("1️⃣ Erstelle ab_experiments...");
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS ab_experiments (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              goal VARCHAR(255),
              status ENUM('draft','running','paused','completed') DEFAULT 'draft',
              split_a TINYINT DEFAULT 50,
              auto_winner_days INT DEFAULT 0,
              start_date DATETIME,
              end_date DATETIME,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              
              INDEX idx_status (status),
              INDEX idx_dates (start_date, end_date),
              INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    log.steps.push("ab_experiments erstellt");
    console.log("   ✅ ab_experiments erstellt");

    // 2. Varianten-Tabelle
    console.log("\n2️⃣ Erstelle ab_variants...");
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS ab_variants (
              id INT AUTO_INCREMENT PRIMARY KEY,
              experiment_id INT NOT NULL,
              variant_key CHAR(1) NOT NULL,
              title VARCHAR(255),
              subtitle VARCHAR(255),
              description TEXT,
              button_text VARCHAR(100),
              button_link VARCHAR(255),
              impressions INT DEFAULT 0,
              clicks INT DEFAULT 0,
              conversions INT DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              
              FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE,
              UNIQUE KEY unique_experiment_variant (experiment_id, variant_key),
              INDEX idx_experiment (experiment_id),
              INDEX idx_variant (variant_key)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    log.steps.push("ab_variants erstellt");
    console.log("   ✅ ab_variants erstellt");

    // 3. Ereignisse (Log)
    console.log("\n3️⃣ Erstelle ab_events...");
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS ab_events (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              experiment_id INT,
              variant_key CHAR(1),
              event_type ENUM('view','click','conversion') NOT NULL,
              user_hash VARCHAR(64),
              device_type VARCHAR(50),
              timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              
              INDEX idx_experiment (experiment_id),
              INDEX idx_variant (variant_key),
              INDEX idx_event_type (event_type),
              INDEX idx_timestamp (timestamp),
              INDEX idx_user (user_hash)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    log.steps.push("ab_events erstellt");
    console.log("   ✅ ab_events erstellt");

    // 4. Globale Konfiguration
    console.log("\n4️⃣ Erstelle ab_config...");
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS ab_config (
              id TINYINT PRIMARY KEY DEFAULT 1,
              ab_active TINYINT(1) DEFAULT 0,
              default_split TINYINT DEFAULT 50,
              auto_winner_enabled TINYINT(1) DEFAULT 0,
              auto_winner_threshold INT DEFAULT 1000,
              auto_winner_days INT DEFAULT 7,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    log.steps.push("ab_config erstellt");
    console.log("   ✅ ab_config erstellt");

    // 5. Initiale Konfiguration einfügen
    console.log("\n5️⃣ Initialisiere Konfiguration...");
    await connection.execute(`
            INSERT INTO ab_config (id, ab_active, default_split, auto_winner_enabled, auto_winner_threshold, auto_winner_days)
            VALUES (1, 0, 50, 0, 1000, 7)
            ON DUPLICATE KEY UPDATE
              ab_active = 0,
              default_split = 50,
              auto_winner_enabled = 0,
              auto_winner_threshold = 1000,
              auto_winner_days = 7
        `);
    log.steps.push("Konfiguration initialisiert");
    console.log("   ✅ Konfiguration initialisiert");

    // 6. Beispiel-Experiment erstellen
    console.log("\n6️⃣ Erstelle Beispiel-Experiment...");
    const [expResult] = await connection.execute(
      `
            INSERT INTO ab_experiments (name, description, goal, status, split_a, start_date)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = name
        `,
      [
        "Hero-Section A/B-Test",
        "Testet verschiedene Hero-Texte für bessere Conversion",
        "Erhöhung der Click-Through-Rate um 10%",
        "draft",
        50,
        null,
      ],
    );
    log.steps.push("Beispiel-Experiment erstellt");
    const experimentId = expResult.insertId || 1;
    console.log(`   ✅ Beispiel-Experiment erstellt (ID: ${experimentId})`);

    // 7. Beispiel-Varianten erstellen
    console.log("\n7️⃣ Erstelle Beispiel-Varianten...");

    // Variante A
    await connection.execute(
      `
            INSERT INTO ab_variants (experiment_id, variant_key, title, subtitle, description, button_text, button_link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = title
        `,
      [
        experimentId,
        "A",
        "Lopez IT Welt",
        "Professionelle IT-Lösungen",
        "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
        "Jetzt beraten lassen",
        "/kontakt",
      ],
    );
    console.log("   ✅ Variante A erstellt");

    // Variante B
    await connection.execute(
      `
            INSERT INTO ab_variants (experiment_id, variant_key, title, subtitle, description, button_text, button_link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = title
        `,
      [
        experimentId,
        "B",
        "Individuelle IT-Lösungen – persönlich, sicher und barrierefrei",
        "Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.",
        "Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.",
        "Kostenlose Beratung",
        "/kontakt",
      ],
    );
    console.log("   ✅ Variante B erstellt");
    log.steps.push("Beispiel-Varianten erstellt");

    // Überprüfung: Tabellen prüfen
    console.log("\n🔍 Überprüfe erstellte Tabellen...");
    const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'lopez_it_welt' 
                AND TABLE_NAME LIKE 'ab_%'
            ORDER BY TABLE_NAME
        `);

    log.results.tables = tables.map((t) => t.TABLE_NAME);
    console.log(`   Gefunden: ${tables.length} Tabellen`);
    tables.forEach((table) => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    // Konfiguration prüfen
    console.log("\n🔍 Überprüfe Konfiguration...");
    const [config] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");
    if (config.length > 0) {
      log.results.config = config[0];
      console.log(`   ✅ Konfiguration vorhanden (ab_active: ${config[0].ab_active})`);
    }

    // Experimente prüfen
    console.log("\n🔍 Überprüfe Experimente...");
    const [experiments] = await connection.execute("SELECT * FROM ab_experiments");
    log.results.experiments = experiments.length;
    console.log(`   Gefunden: ${experiments.length} Experimente`);
    experiments.forEach((exp) => {
      console.log(`   - "${exp.name}" (Status: ${exp.status})`);
    });

    // Varianten prüfen
    console.log("\n🔍 Überprüfe Varianten...");
    const [variants] = await connection.execute("SELECT * FROM ab_variants");
    log.results.variants = variants.length;
    console.log(`   Gefunden: ${variants.length} Varianten`);
    variants.forEach((variant) => {
      console.log(
        `   - Experiment ${variant.experiment_id}, Variante ${variant.variant_key}: "${variant.title}"`,
      );
    });

    await connection.end();

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATENBANK-SETUP ABGESCHLOSSEN");
    console.log("=".repeat(60));
    console.log(`Zeitstempel: ${log.timestamp}`);
    console.log(`Tabellen: ${tables.length}`);
    console.log(`Experimente: ${experiments.length}`);
    console.log(`Varianten: ${variants.length}`);

    return log;
  } catch (error) {
    console.error("\n❌ FEHLER beim Setup:", error);
    log.errors.push(error.message);

    if (connection) {
      await connection.end();
    }

    throw error;
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("\n✅ Setup erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Setup fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
