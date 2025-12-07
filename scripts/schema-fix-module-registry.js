/**
 * TEMPORÄRES SCRIPT: Schema-Fix für module_registry
 * Führt KEINE DROP/TRUNCATE aus - nur ALTER TABLE
 * Kann nach Ausführung gelöscht werden.
 */
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  try {
    console.log('=== SCHEMA-FIX module_registry ===');
    console.log('');

    // 1. name -> module_name
    console.log('1) ALTER TABLE: name -> module_name');
    await conn.execute('ALTER TABLE module_registry CHANGE name module_name VARCHAR(255) NOT NULL');
    console.log('   ✅ OK');

    // 2. soll_status hinzufügen
    console.log('2) ALTER TABLE: ADD soll_status');
    await conn.execute(`ALTER TABLE module_registry ADD COLUMN soll_status ENUM('open', 'planned', 'required') DEFAULT 'open' AFTER module_name`);
    console.log('   ✅ OK');

    // 3. Prüfen
    console.log('');
    console.log('=== SHOW COLUMNS (NACHHER) ===');
    const [cols] = await conn.execute('SHOW COLUMNS FROM module_registry');
    cols.forEach(c => console.log('  ', c.Field, '-', c.Type));

    // 4. Zeilenanzahl prüfen (keine Daten verloren)
    console.log('');
    console.log('=== ZEILENANZAHL (keine Daten verloren) ===');
    const [r1] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    console.log('  module_registry:', r1[0].c, 'Zeilen');

    console.log('');
    console.log('✅ SCHEMA-FIX ABGESCHLOSSEN');

  } catch (error) {
    console.error('❌ FEHLER:', error.message);
  } finally {
    await conn.end();
  }
}

run();









