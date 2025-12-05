/**
 * TEMPORÄRES SCRIPT: Fix UNSIGNED -> SIGNED für Foreign Key Kompatibilität
 * KEINE DROP/TRUNCATE - nur ALTER TABLE MODIFY
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
    console.log('=== SCHEMA-FIX: UNSIGNED -> SIGNED ===');
    console.log('');

    // VORHER: Zeilenanzahl prüfen
    const [r1] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    const [p1] = await conn.execute('SELECT COUNT(*) as c FROM module_progress');
    console.log('VORHER:');
    console.log('  module_registry:', r1[0].c, 'Zeilen');
    console.log('  module_progress:', p1[0].c, 'Zeilen');
    console.log('');

    // 1. module_registry.id auf SIGNED ändern
    console.log('1) ALTER module_registry.id: UNSIGNED -> SIGNED');
    await conn.execute('ALTER TABLE module_registry MODIFY id BIGINT NOT NULL AUTO_INCREMENT');
    console.log('   ✅ OK');

    // 2. module_progress.module_id auf SIGNED ändern
    console.log('2) ALTER module_progress.module_id: UNSIGNED -> SIGNED');
    await conn.execute('ALTER TABLE module_progress MODIFY module_id BIGINT NOT NULL');
    console.log('   ✅ OK');

    // NACHHER: Zeilenanzahl prüfen (keine Daten verloren)
    console.log('');
    const [r2] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    const [p2] = await conn.execute('SELECT COUNT(*) as c FROM module_progress');
    console.log('NACHHER:');
    console.log('  module_registry:', r2[0].c, 'Zeilen');
    console.log('  module_progress:', p2[0].c, 'Zeilen');

    // Verifizieren
    if (r1[0].c === r2[0].c && p1[0].c === p2[0].c) {
      console.log('');
      console.log('✅ KEINE DATEN VERLOREN');
    } else {
      console.log('');
      console.log('⚠️ WARNUNG: Zeilenanzahl hat sich geändert!');
    }

    // Schema prüfen
    console.log('');
    console.log('=== NEUES SCHEMA ===');
    const [cols1] = await conn.execute("SHOW COLUMNS FROM module_registry WHERE Field = 'id'");
    console.log('module_registry.id:', cols1[0].Type);
    const [cols2] = await conn.execute("SHOW COLUMNS FROM module_progress WHERE Field = 'module_id'");
    console.log('module_progress.module_id:', cols2[0].Type);

    console.log('');
    console.log('✅ SCHEMA-FIX ABGESCHLOSSEN');

  } catch (error) {
    console.error('❌ FEHLER:', error.message);
  } finally {
    await conn.end();
  }
}

run();



