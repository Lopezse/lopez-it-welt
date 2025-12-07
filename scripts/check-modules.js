/**
 * TEMPORÄRES SCRIPT: Prüfe Module in DB
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
    console.log('=== MODULE-PRÜFUNG ===');
    console.log('');

    // Gesamtzahl
    const [r1] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    console.log('module_registry Gesamt:', r1[0].c, 'Zeilen');
    console.log('');

    // Module mit ADM-Prefix (aus SOLL_MODULE_LIST)
    const [adm] = await conn.execute("SELECT module_name FROM module_registry WHERE module_name LIKE 'ADM-%' ORDER BY module_name");
    console.log('Module mit ADM-Prefix:', adm.length);
    adm.forEach(r => console.log('  -', r.module_name));
    console.log('');

    // Alle Module
    console.log('=== ALLE MODULE ===');
    const [all] = await conn.execute('SELECT id, module_name, category FROM module_registry ORDER BY id');
    all.forEach(r => console.log(r.id, '|', r.module_name));

    // module_progress
    console.log('');
    const [p1] = await conn.execute('SELECT COUNT(*) as c FROM module_progress');
    console.log('module_progress Gesamt:', p1[0].c, 'Zeilen');

  } finally {
    await conn.end();
  }
}

run().catch(e => console.error('Fehler:', e.message));









