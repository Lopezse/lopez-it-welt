const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=== STATISTIK-PRÜFUNG (NUR SELECT) ===');
  console.log('');

  const [stats] = await conn.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN mp.ist_status = 'open' THEN 1 ELSE 0 END) as status_open,
      SUM(CASE WHEN mp.ist_status = 'in_progress' THEN 1 ELSE 0 END) as status_in_progress,
      SUM(CASE WHEN mp.ist_status = 'done' THEN 1 ELSE 0 END) as status_done,
      AVG(COALESCE(mp.progress_percent, 0)) as avg_progress
    FROM module_registry mr
    LEFT JOIN module_progress mp ON mr.id = mp.module_id
  `);

  console.log('totalModules:', stats[0].total);
  console.log('modulesByStatus.open:', stats[0].status_open);
  console.log('modulesByStatus.in_progress:', stats[0].status_in_progress);
  console.log('modulesByStatus.done:', stats[0].status_done);
  console.log('overallProgress:', Math.round(stats[0].avg_progress || 0) + '%');

  console.log('');
  console.log('=== ERWARTETE UI-ANZEIGE ===');
  console.log('Gesamtfortschritt:', Math.round(stats[0].avg_progress || 0) + '%');
  console.log('SOLL-Module:', stats[0].total);
  console.log('In Arbeit:', stats[0].status_in_progress);
  console.log('Fertig:', stats[0].status_done);

  await conn.end();
}

run().catch(e => console.error('Fehler:', e.message));









