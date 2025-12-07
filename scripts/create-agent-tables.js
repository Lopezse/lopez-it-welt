/**
 * Erstellt die Tabellen für Agent-B und Agent-C
 * NUR SELECT/CREATE - KEINE destruktiven Befehle
 */
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt_dev'
  });

  console.log('=== Erstelle dev_code_changes ===');
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS dev_code_changes (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      task_id BIGINT UNSIGNED NOT NULL,
      step_id BIGINT UNSIGNED NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      code_type ENUM('new', 'modify', 'delete') NOT NULL DEFAULT 'new',
      code_before LONGTEXT NULL,
      code_after LONGTEXT NOT NULL,
      explanation TEXT NOT NULL,
      status ENUM('pending', 'approved', 'rejected', 'applied') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_task_id (task_id),
      KEY idx_step_id (step_id),
      KEY idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ dev_code_changes erstellt');

  console.log('=== Erstelle dev_reviews ===');
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS dev_reviews (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      task_id BIGINT UNSIGNED NOT NULL,
      change_id BIGINT UNSIGNED NOT NULL,
      review_status ENUM('pending', 'approved', 'rejected', 'needs_revision') NOT NULL DEFAULT 'pending',
      quality_score INT NOT NULL DEFAULT 0,
      feedback TEXT NOT NULL,
      issues_found JSON NULL,
      suggestions JSON NULL,
      reviewer_agent VARCHAR(50) NOT NULL DEFAULT 'Agent-C',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_task_id (task_id),
      KEY idx_change_id (change_id),
      KEY idx_review_status (review_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ dev_reviews erstellt');

  // Prüfen
  const [tables] = await conn.execute("SHOW TABLES LIKE 'dev_%'");
  console.log('\n=== dev_* Tabellen ===');
  tables.forEach(t => console.log('  ' + Object.values(t)[0]));

  await conn.end();
  console.log('\n✅ FERTIG!');
}

run().catch(e => console.error('Fehler:', e.message));









