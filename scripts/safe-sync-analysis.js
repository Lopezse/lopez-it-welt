/**
 * ENTERPRISE++ SAFE SYNC - PHASE 1: ANALYSE (READ ONLY)
 * =====================================================
 * KEINE Änderungen an der Datenbank!
 * Nur SELECT-Abfragen.
 * =====================================================
 */

const mysql = require('mysql2/promise');

async function runAnalysis() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=====================================================');
  console.log('ENTERPRISE++ SAFE SYNC - PHASE 1: ANALYSE');
  console.log('=====================================================');
  console.log('Modus: READ ONLY');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  const analysis = {
    dbModules: [],
    dbProgress: [],
    missingProgress: [],
    admStatus: [],
    statistics: {}
  };

  try {
    // 1. Alle Module aus module_registry laden
    console.log('=== 1. module_registry laden ===');
    const [registry] = await conn.execute(`
      SELECT 
        id, module_code, module_name, category, description,
        priority, priority_level, maturity_level, risk_level,
        depends_on, go_live_required, soll_status
      FROM module_registry
      ORDER BY module_code
    `);
    analysis.dbModules = registry;
    console.log(`  ✅ ${registry.length} Module in module_registry`);

    // 2. Alle Einträge aus module_progress laden
    console.log('');
    console.log('=== 2. module_progress laden ===');
    const [progress] = await conn.execute(`
      SELECT 
        mp.id, mp.module_id, mp.ist_status, mp.progress_percent,
        mp.comment, mp.responsible_agent, mp.updated_at,
        mr.module_code, mr.module_name
      FROM module_progress mp
      JOIN module_registry mr ON mp.module_id = mr.id
      ORDER BY mr.module_code
    `);
    analysis.dbProgress = progress;
    console.log(`  ✅ ${progress.length} Einträge in module_progress`);

    // 3. Module OHNE progress_percent finden
    console.log('');
    console.log('=== 3. Module ohne module_progress ===');
    const [missing] = await conn.execute(`
      SELECT mr.id, mr.module_code, mr.module_name
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mp.id IS NULL
      ORDER BY mr.module_code
    `);
    analysis.missingProgress = missing;
    
    if (missing.length > 0) {
      console.log(`  ⚠️ ${missing.length} Module ohne progress-Eintrag:`);
      for (const m of missing) {
        console.log(`     [${m.module_code}] ${m.module_name}`);
      }
    } else {
      console.log('  ✅ Alle Module haben einen progress-Eintrag');
    }

    // 4. ADM-Module Status prüfen
    console.log('');
    console.log('=== 4. ADM-Module Status ===');
    const [adm] = await conn.execute(`
      SELECT 
        mr.module_code, mr.module_name,
        mp.progress_percent, mp.ist_status, mp.responsible_agent
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
      ORDER BY mr.module_code
    `);
    analysis.admStatus = adm;
    
    let admAllOk = true;
    for (const a of adm) {
      const ok = a.progress_percent === 100 && a.ist_status === 'done';
      if (!ok) admAllOk = false;
      console.log(`  ${ok ? '✅' : '❌'} [${a.module_code}] ${a.progress_percent}% (${a.ist_status})`);
    }

    // 5. Felder-Analyse: Welche Felder fehlen?
    console.log('');
    console.log('=== 5. Fehlende Felder in module_registry ===');
    const [fieldsAnalysis] = await conn.execute(`
      SELECT 
        SUM(CASE WHEN priority_level IS NULL OR priority_level = '' THEN 1 ELSE 0 END) as missing_priority_level,
        SUM(CASE WHEN maturity_level IS NULL OR maturity_level = '' THEN 1 ELSE 0 END) as missing_maturity_level,
        SUM(CASE WHEN risk_level IS NULL OR risk_level = '' THEN 1 ELSE 0 END) as missing_risk_level,
        SUM(CASE WHEN depends_on IS NULL THEN 1 ELSE 0 END) as missing_depends_on,
        SUM(CASE WHEN go_live_required IS NULL THEN 1 ELSE 0 END) as missing_go_live_required,
        SUM(CASE WHEN category IS NULL OR category = '' THEN 1 ELSE 0 END) as missing_category
      FROM module_registry
    `);
    const fa = fieldsAnalysis[0];
    console.log(`  priority_level fehlt: ${fa.missing_priority_level}`);
    console.log(`  maturity_level fehlt: ${fa.missing_maturity_level}`);
    console.log(`  risk_level fehlt: ${fa.missing_risk_level}`);
    console.log(`  depends_on fehlt: ${fa.missing_depends_on}`);
    console.log(`  go_live_required fehlt: ${fa.missing_go_live_required}`);
    console.log(`  category fehlt: ${fa.missing_category}`);

    // 6. Statistiken berechnen
    console.log('');
    console.log('=== 6. Live-Statistiken (SELECT) ===');
    const [stats] = await conn.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN mp.ist_status = 'open' OR mp.ist_status IS NULL THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN mp.ist_status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN mp.ist_status = 'done' THEN 1 ELSE 0 END) as done_count,
        ROUND(AVG(COALESCE(mp.progress_percent, 0)), 0) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
    `);
    analysis.statistics = stats[0];
    
    console.log(`  Gesamt Module: ${stats[0].total}`);
    console.log(`  Offen (0%): ${stats[0].open_count}`);
    console.log(`  In Arbeit (1-99%): ${stats[0].in_progress_count}`);
    console.log(`  Fertig (100%): ${stats[0].done_count}`);
    console.log(`  Durchschnitt: ${stats[0].avg_progress}%`);

    // 7. Kategorien-Übersicht
    console.log('');
    console.log('=== 7. Kategorien-Übersicht ===');
    const [categories] = await conn.execute(`
      SELECT 
        category,
        COUNT(*) as module_count,
        ROUND(AVG(COALESCE(mp.progress_percent, 0)), 0) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      GROUP BY category
      ORDER BY category
    `);
    
    for (const cat of categories) {
      console.log(`  ${cat.category}: ${cat.module_count} Module, ${cat.avg_progress}%`);
    }

    // Zusammenfassung
    console.log('');
    console.log('=====================================================');
    console.log('ANALYSE ABGESCHLOSSEN');
    console.log('=====================================================');
    console.log('');
    console.log('AKTIONEN ERFORDERLICH:');
    
    if (analysis.missingProgress.length > 0) {
      console.log(`  → ${analysis.missingProgress.length} Module brauchen module_progress INSERT`);
    }
    if (!admAllOk) {
      console.log('  → ADM-Module Status korrigieren');
    }
    if (fa.missing_priority_level > 0 || fa.missing_maturity_level > 0 || fa.missing_risk_level > 0) {
      console.log('  → Fehlende Felder in module_registry ergänzen');
    }
    
    console.log('');
    console.log('KEINE DATEN WURDEN GEÄNDERT.');

    // JSON für weitere Verarbeitung
    return analysis;

  } finally {
    await conn.end();
  }
}

runAnalysis().then(analysis => {
  // Speichere Analyse für nächsten Schritt
  require('fs').writeFileSync(
    'scripts/sync-analysis-result.json', 
    JSON.stringify(analysis, null, 2)
  );
  console.log('');
  console.log('Analyse gespeichert in: scripts/sync-analysis-result.json');
}).catch(e => console.error('Fehler:', e.message));



