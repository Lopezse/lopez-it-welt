/**
 * TEMPORÄRES SCRIPT: Verifiziere Module nach Initialisierung
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
    console.log('=== VERIFIZIERUNG module_registry ===');
    console.log('');

    // 1. COUNT
    const [count1] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    console.log('1) Gesamtzahl module_registry:', count1[0].c);

    // 2. module_code, module_name Auszug
    console.log('');
    console.log('2) module_code, module_name (erste 20):');
    const [rows] = await conn.execute('SELECT module_code, module_name FROM module_registry ORDER BY module_code LIMIT 20');
    rows.forEach(r => console.log('   ', r.module_code, '|', r.module_name));
    console.log('   ... (mehr Einträge vorhanden)');

    // 3. NULL oder leere module_codes
    console.log('');
    const [nullCodes] = await conn.execute("SELECT COUNT(*) as c FROM module_registry WHERE module_code IS NULL OR module_code = ''");
    console.log('3) Datensätze mit NULL/leerem module_code:', nullCodes[0].c);

    // 4. module_progress
    console.log('');
    const [count2] = await conn.execute('SELECT COUNT(*) as c FROM module_progress');
    console.log('4) Gesamtzahl module_progress:', count2[0].c);

    // 5. ADM-Module Fortschritt
    console.log('');
    console.log('5) ADM-Module Fortschritt:');
    const [adm] = await conn.execute(`
      SELECT mr.module_code, mr.module_name, mp.progress_percent, mp.ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
      ORDER BY mr.module_code
    `);
    adm.forEach(r => console.log('   ', r.module_code, '|', r.module_name, '|', r.progress_percent + '%', '|', r.ist_status));

    // Zusammenfassung
    console.log('');
    console.log('=== ZUSAMMENFASSUNG ===');
    console.log('module_registry:', count1[0].c, 'Zeilen');
    console.log('module_progress:', count2[0].c, 'Zeilen');
    console.log('NULL/leere module_codes:', nullCodes[0].c);
    
    if (count1[0].c === 53 && nullCodes[0].c === 0) {
      console.log('');
      console.log('✅ ALLE 53 MODULE MIT GÜLTIGEN module_codes VORHANDEN');
    } else {
      console.log('');
      console.log('⚠️ PRÜFUNG ERFORDERLICH');
    }

  } finally {
    await conn.end();
  }
}

run().catch(e => console.error('Fehler:', e.message));



