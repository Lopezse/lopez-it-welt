/**
 * ENTERPRISE++ SAFE SYSTEM SYNCHRONISATION - ANALYSE PHASE
 * =====================================================
 * Modus: READ ONLY
 * KEINE Schreiboperationen in dieser Phase!
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
  console.log('ENTERPRISE++ SYNC - ANALYSE PHASE (READ ONLY)');
  console.log('=====================================================');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  const report = {
    dbModules: [],
    dbProgress: [],
    missingProgress: [],
    incompleteFields: [],
    admStatus: [],
    statistics: {}
  };

  try {
    // 1. Alle Module aus module_registry laden
    console.log('=== 1. module_registry analysieren ===');
    const [modules] = await conn.execute(`
      SELECT 
        id, module_code, module_name, category, description,
        priority, priority_level, maturity_level, risk_level,
        depends_on, go_live_required, soll_status
      FROM module_registry
      ORDER BY module_code
    `);
    report.dbModules = modules;
    console.log(`  Gefunden: ${modules.length} Module`);

    // Felder-Analyse
    let missingPriorityLevel = 0;
    let missingMaturityLevel = 0;
    let missingRiskLevel = 0;
    let missingDependsOn = 0;
    let missingGoLiveRequired = 0;

    for (const mod of modules) {
      const incomplete = [];
      if (!mod.priority_level) { missingPriorityLevel++; incomplete.push('priority_level'); }
      if (!mod.maturity_level) { missingMaturityLevel++; incomplete.push('maturity_level'); }
      if (!mod.risk_level) { missingRiskLevel++; incomplete.push('risk_level'); }
      if (mod.depends_on === null) { missingDependsOn++; incomplete.push('depends_on'); }
      if (mod.go_live_required === null) { missingGoLiveRequired++; incomplete.push('go_live_required'); }
      
      if (incomplete.length > 0) {
        report.incompleteFields.push({
          code: mod.module_code,
          name: mod.module_name,
          missing: incomplete
        });
      }
    }

    console.log(`  Fehlende priority_level: ${missingPriorityLevel}`);
    console.log(`  Fehlende maturity_level: ${missingMaturityLevel}`);
    console.log(`  Fehlende risk_level: ${missingRiskLevel}`);
    console.log(`  Fehlende depends_on: ${missingDependsOn}`);
    console.log(`  Fehlende go_live_required: ${missingGoLiveRequired}`);
    console.log('');

    // 2. Alle Fortschritte aus module_progress laden
    console.log('=== 2. module_progress analysieren ===');
    const [progress] = await conn.execute(`
      SELECT 
        mp.id, mp.module_id, mp.ist_status, mp.progress_percent,
        mp.comment, mp.responsible_agent,
        mr.module_code, mr.module_name
      FROM module_progress mp
      JOIN module_registry mr ON mp.module_id = mr.id
      ORDER BY mr.module_code
    `);
    report.dbProgress = progress;
    console.log(`  Gefunden: ${progress.length} Fortschritts-Einträge`);

    // 3. Module ohne Fortschritt finden
    console.log('');
    console.log('=== 3. Module ohne module_progress ===');
    const [missingProgress] = await conn.execute(`
      SELECT mr.id, mr.module_code, mr.module_name
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mp.id IS NULL
      ORDER BY mr.module_code
    `);
    report.missingProgress = missingProgress;
    
    if (missingProgress.length > 0) {
      console.log(`  ⚠️ ${missingProgress.length} Module OHNE Fortschritt:`);
      for (const m of missingProgress) {
        console.log(`     [${m.module_code}] ${m.module_name}`);
      }
    } else {
      console.log(`  ✅ Alle Module haben Fortschritts-Einträge`);
    }
    console.log('');

    // 4. ADM-Module Status prüfen
    console.log('=== 4. ADM-Module Status (DÜRFEN NICHT GEÄNDERT WERDEN) ===');
    const [admModules] = await conn.execute(`
      SELECT 
        mr.module_code, mr.module_name,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status,
        mp.responsible_agent
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
      ORDER BY mr.module_code
    `);

    let admAllOk = true;
    for (const adm of admModules) {
      const ok = adm.progress_percent === 100 && adm.ist_status === 'done';
      if (!ok) admAllOk = false;
      report.admStatus.push({
        code: adm.module_code,
        name: adm.module_name,
        progress: adm.progress_percent,
        status: adm.ist_status,
        agent: adm.responsible_agent,
        ok: ok
      });
      console.log(`  ${ok ? '✅' : '❌'} [${adm.module_code}] ${adm.progress_percent}% (${adm.ist_status})`);
    }
    console.log('');

    // 5. Statistiken berechnen
    console.log('=== 5. Live-Statistiken (aktuelle Berechnung) ===');
    const [stats] = await conn.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) = 0 THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) > 0 AND COALESCE(mp.progress_percent, 0) < 100 THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) = 100 THEN 1 ELSE 0 END) as done_count,
        AVG(COALESCE(mp.progress_percent, 0)) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
    `);

    report.statistics = {
      total: stats[0].total,
      open: stats[0].open_count,
      inProgress: stats[0].in_progress_count,
      done: stats[0].done_count,
      avgProgress: Math.round(stats[0].avg_progress || 0)
    };

    console.log(`  Gesamt: ${report.statistics.total} Module`);
    console.log(`  Offen (0%): ${report.statistics.open}`);
    console.log(`  In Arbeit (1-99%): ${report.statistics.inProgress}`);
    console.log(`  Fertig (100%): ${report.statistics.done}`);
    console.log(`  Durchschnitt: ${report.statistics.avgProgress}%`);
    console.log('');

    // 6. Zusammenfassung
    console.log('=====================================================');
    console.log('ANALYSE-ERGEBNIS');
    console.log('=====================================================');
    console.log('');
    console.log('| Bereich | Status | Aktion erforderlich |');
    console.log('|---------|--------|---------------------|');
    console.log(`| Module in DB | ${modules.length} | - |`);
    console.log(`| Fortschritte | ${progress.length} | ${missingProgress.length > 0 ? 'INSERT für ' + missingProgress.length : 'Keine'} |`);
    console.log(`| Unvollständige Felder | ${report.incompleteFields.length} | ${report.incompleteFields.length > 0 ? 'UPDATE möglich' : 'Keine'} |`);
    console.log(`| ADM-Module | ${admAllOk ? 'OK' : 'PRÜFEN'} | NICHT ÄNDERN |`);
    console.log('');

    // JSON-Report für nächste Phase
    console.log('=== ANALYSE ABGESCHLOSSEN ===');
    console.log('Ergebnis wird für Phase 2 gespeichert...');
    
    // Report als JSON ausgeben für weitere Verarbeitung
    return report;

  } finally {
    await conn.end();
  }
}

runAnalysis().then(report => {
  // Report als JSON speichern
  const fs = require('fs');
  fs.writeFileSync('scripts/sync-analysis-result.json', JSON.stringify(report, null, 2));
  console.log('');
  console.log('✅ Analyse-Report gespeichert: scripts/sync-analysis-result.json');
}).catch(e => {
  console.error('❌ FEHLER:', e.message);
});

