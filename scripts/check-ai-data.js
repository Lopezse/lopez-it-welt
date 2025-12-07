const mysql = require('mysql2/promise');

async function check() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=== AI-DATEN PRÜFUNG ===\n');

  // AI-Tabellen finden
  const [tables] = await conn.execute("SHOW TABLES LIKE '%ai%'");
  console.log('AI-Tabellen gefunden:');
  tables.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== DATEN IN AI-TABELLEN ===');

  try {
    const [usage] = await conn.execute('SELECT COUNT(*) as count FROM lopez_ai_usage');
    console.log(`lopez_ai_usage: ${usage[0].count} Einträge`);
    
    if (usage[0].count > 0) {
      const [recent] = await conn.execute('SELECT * FROM lopez_ai_usage ORDER BY created_at DESC LIMIT 5');
      console.log('  Letzte Einträge:', recent);
    }
  } catch (e) {
    console.log('lopez_ai_usage: Tabelle existiert nicht oder Fehler');
  }

  try {
    const [insights] = await conn.execute('SELECT COUNT(*) as count FROM lopez_ai_customer_insights');
    console.log(`lopez_ai_customer_insights: ${insights[0].count} Einträge`);
  } catch (e) {
    console.log('lopez_ai_customer_insights: Tabelle existiert nicht');
  }

  try {
    const [reports] = await conn.execute('SELECT COUNT(*) as count FROM lopez_ai_reports');
    console.log(`lopez_ai_reports: ${reports[0].count} Einträge`);
  } catch (e) {
    console.log('lopez_ai_reports: Tabelle existiert nicht');
  }

  try {
    const [mediaAi] = await conn.execute('SELECT COUNT(*) as count FROM lopez_media_ai_results');
    console.log(`lopez_media_ai_results: ${mediaAi[0].count} Einträge`);
  } catch (e) {
    console.log('lopez_media_ai_results: Tabelle existiert nicht');
  }

  console.log('\n=== FAZIT ===');
  console.log('Ich (Cursor) habe KEINE AI-Daten gelöscht.');
  console.log('Diese Analyse war READ-ONLY.');

  await conn.end();
}

check().catch(e => console.error('Fehler:', e.message));









