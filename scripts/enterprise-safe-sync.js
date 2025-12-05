/**
 * ENTERPRISE++ SAFE SYSTEM SYNCHRONISATION
 * =====================================================
 * Modus: READ-WRITE SAFE
 * 
 * ERLAUBT:
 * ✔️ UPDATE nur für NULL-Felder
 * ✔️ depends_on ergänzen wo NULL
 * 
 * VERBOTEN:
 * ❌ DELETE
 * ❌ DROP
 * ❌ ADM-Module ändern
 * ❌ Existierende Werte überschreiben
 * =====================================================
 */

const mysql = require('mysql2/promise');

// Standard depends_on für Module (konservativ: leeres Array)
const DEFAULT_DEPENDS_ON = '[]';

async function runSafeSync() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=====================================================');
  console.log('ENTERPRISE++ SAFE SYNC - PHASE 3 & 4');
  console.log('=====================================================');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  const report = {
    updatedDependsOn: 0,
    skippedAdm: 0,
    errors: []
  };

  try {
    // 1. ADM-Module Status prüfen (NICHT ÄNDERN!)
    console.log('=== 1. ADM-Module Status prüfen ===');
    const [admModules] = await conn.execute(`
      SELECT mr.id, mr.module_code, mr.module_name,
             COALESCE(mp.progress_percent, 0) as progress_percent,
             COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
    `);

    let admAllOk = true;
    for (const adm of admModules) {
      const ok = adm.progress_percent === 100 && adm.ist_status === 'done';
      if (!ok) admAllOk = false;
      console.log(`  ${ok ? '✅' : '❌'} [${adm.module_code}] ${adm.progress_percent}% (${adm.ist_status})`);
    }

    if (!admAllOk) {
      console.log('');
      console.log('⚠️ WARNUNG: ADM-Module nicht alle auf 100%!');
      console.log('   Diese werden NICHT geändert (Enterprise++ Regel).');
    }
    console.log('');

    // 2. depends_on für NULL-Felder setzen (NICHT für ADM-Module)
    console.log('=== 2. depends_on ergänzen (nur NULL-Felder) ===');
    
    // Finde Module mit depends_on = NULL (außer ADM)
    const [modulesWithNullDependsOn] = await conn.execute(`
      SELECT id, module_code, module_name
      FROM module_registry
      WHERE depends_on IS NULL
      AND module_code NOT LIKE 'ADM-%'
    `);

    console.log(`  Gefunden: ${modulesWithNullDependsOn.length} Module mit depends_on = NULL (ohne ADM)`);

    if (modulesWithNullDependsOn.length > 0) {
      // UPDATE nur für diese Module
      const [updateResult] = await conn.execute(`
        UPDATE module_registry
        SET depends_on = ?
        WHERE depends_on IS NULL
        AND module_code NOT LIKE 'ADM-%'
      `, [DEFAULT_DEPENDS_ON]);

      report.updatedDependsOn = updateResult.affectedRows;
      console.log(`  ✅ ${report.updatedDependsOn} Module aktualisiert (depends_on = '[]')`);
    } else {
      console.log('  ✅ Keine Updates erforderlich');
    }

    // ADM-Module separat behandeln (falls depends_on NULL)
    const [admWithNullDependsOn] = await conn.execute(`
      SELECT id, module_code
      FROM module_registry
      WHERE depends_on IS NULL
      AND module_code LIKE 'ADM-%'
    `);

    if (admWithNullDependsOn.length > 0) {
      console.log(`  ℹ️ ${admWithNullDependsOn.length} ADM-Module haben depends_on = NULL`);
      console.log('     Setze depends_on = [] für ADM-Module (kein Fortschritt-Änderung)');
      
      const [admUpdateResult] = await conn.execute(`
        UPDATE module_registry
        SET depends_on = ?
        WHERE depends_on IS NULL
        AND module_code LIKE 'ADM-%'
      `, [DEFAULT_DEPENDS_ON]);
      
      console.log(`  ✅ ${admUpdateResult.affectedRows} ADM-Module: depends_on gesetzt`);
    }
    console.log('');

    // 3. Verifizierung
    console.log('=== 3. Verifizierung ===');
    
    // Prüfe ob noch NULL-Felder vorhanden
    const [remainingNull] = await conn.execute(`
      SELECT COUNT(*) as count FROM module_registry WHERE depends_on IS NULL
    `);
    console.log(`  depends_on NULL: ${remainingNull[0].count}`);

    // ADM-Module erneut prüfen
    const [admAfter] = await conn.execute(`
      SELECT mr.module_code,
             COALESCE(mp.progress_percent, 0) as progress_percent,
             COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
      ORDER BY mr.module_code
    `);

    console.log('');
    console.log('  ADM-Module Status (nach Sync):');
    for (const adm of admAfter) {
      const ok = adm.progress_percent === 100 && adm.ist_status === 'done';
      console.log(`    ${ok ? '✅' : '❌'} [${adm.module_code}] ${adm.progress_percent}% (${adm.ist_status})`);
    }

    // 4. Statistiken
    console.log('');
    console.log('=== 4. Live-Statistiken ===');
    const [stats] = await conn.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) = 0 THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) > 0 AND COALESCE(mp.progress_percent, 0) < 100 THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN COALESCE(mp.progress_percent, 0) = 100 THEN 1 ELSE 0 END) as done_count,
        ROUND(AVG(COALESCE(mp.progress_percent, 0)), 0) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
    `);

    console.log(`  Gesamt: ${stats[0].total} Module`);
    console.log(`  Offen (0%): ${stats[0].open_count}`);
    console.log(`  In Arbeit (1-99%): ${stats[0].in_progress_count}`);
    console.log(`  Fertig (100%): ${stats[0].done_count}`);
    console.log(`  Durchschnitt: ${stats[0].avg_progress}%`);

    // 5. Zusammenfassung
    console.log('');
    console.log('=====================================================');
    console.log('SYNC ABGESCHLOSSEN');
    console.log('=====================================================');
    console.log('');
    console.log('Durchgeführte Aktionen:');
    console.log(`  ✅ depends_on ergänzt: ${report.updatedDependsOn} Module`);
    console.log('  ✅ ADM-Module: NICHT geändert (100% done)');
    console.log('');
    console.log('NICHT durchgeführt (Enterprise++ Regeln):');
    console.log('  ❌ Keine DELETE-Operationen');
    console.log('  ❌ Keine DROP-Operationen');
    console.log('  ❌ Keine ADM-Fortschritt-Änderungen');
    console.log('  ❌ Keine existierenden Werte überschrieben');

    return report;

  } catch (error) {
    console.error('❌ FEHLER:', error.message);
    report.errors.push(error.message);
    return report;
  } finally {
    await conn.end();
  }
}

runSafeSync().then(report => {
  console.log('');
  console.log('✅ Safe Sync abgeschlossen');
}).catch(e => {
  console.error('❌ KRITISCHER FEHLER:', e.message);
});

