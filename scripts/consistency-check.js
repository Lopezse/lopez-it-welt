/**
 * ENTERPRISE++ KONSISTENZPRÜFUNG (READ ONLY)
 * =====================================================
 * Erstellt: 2025-12-04
 * Zweck: Vergleich Dokumentation ↔ Datenbank
 * KEINE Änderungen an der Datenbank!
 * =====================================================
 */

const mysql = require('mysql2/promise');

// SOLL-Module aus src/lib/agent-system.ts (53 Basis-Module)
const EXPECTED_MODULES = [
  // Admin & Core Platform (7)
  { code: "ADM-01", name: "Admin-Dashboard", expectedProgress: 100 },
  { code: "ADM-02", name: "Benutzerverwaltung", expectedProgress: 100 },
  { code: "ADM-03", name: "Rollen & Rechte (RBAC/ABAC)", expectedProgress: 100 },
  { code: "ADM-04", name: "2FA & Session-Management", expectedProgress: 100 },
  { code: "ADM-05", name: "Audit-Logs", expectedProgress: 100 },
  { code: "ADM-06", name: "Dynamic Settings", expectedProgress: 100 },
  { code: "ADM-07", name: "Modul-Registry (SOLL/IST)", expectedProgress: 100 },
  
  // Kunden & Projekte (5)
  { code: "KP-01", name: "Kundenliste", expectedProgress: 0 },
  { code: "KP-02", name: "Kundenstammdaten", expectedProgress: 0 },
  { code: "KP-03", name: "Projekte pro Kunde", expectedProgress: 0 },
  { code: "KP-04", name: "Projekt-Fortschritts-Tracking", expectedProgress: 0 },
  { code: "KP-05", name: "Projekt-Notizen & Dateien", expectedProgress: 0 },
  
  // Support & Kommunikation (4)
  { code: "SUP-01", name: "Support-Tickets", expectedProgress: 0 },
  { code: "SUP-02", name: "Kontakt-Nachrichten", expectedProgress: 0 },
  { code: "SUP-03", name: "E-Mail-Templates", expectedProgress: 0 },
  { code: "SUP-04", name: "Benachrichtigungssystem (Admin)", expectedProgress: 0 },
  
  // Inhalte & Medien (5)
  { code: "MED-01", name: "Medienbibliothek", expectedProgress: 0 },
  { code: "MED-02", name: "Sicherer Dateispeicher", expectedProgress: 0 },
  { code: "MED-03", name: "Media-KI Analyse", expectedProgress: 0 },
  { code: "MED-04", name: "DSGVO-Consent im Media-Upload", expectedProgress: 0 },
  { code: "MED-05", name: "Media-Tags & Kategorien", expectedProgress: 0 },
  
  // Finanzen & Abrechnung (5)
  { code: "FIN-01", name: "Rechnungsmodul Basis", expectedProgress: 0 },
  { code: "FIN-02", name: "Produkt- und Dienstleistungskatalog", expectedProgress: 0 },
  { code: "FIN-03", name: "Rechnungsübersicht", expectedProgress: 0 },
  { code: "FIN-04", name: "Steuer- & Währungsmanagement", expectedProgress: 0 },
  { code: "FIN-05", name: "Zeitabrechnung (Timetracking)", expectedProgress: 0 },
  
  // KI-Integration (5)
  { code: "AI-01", name: "Customer Insights", expectedProgress: 0 },
  { code: "AI-02", name: "Project Analyzer", expectedProgress: 0 },
  { code: "AI-03", name: "Invoice Assistant", expectedProgress: 0 },
  { code: "AI-04", name: "Executive Reports", expectedProgress: 0 },
  { code: "AI-05", name: "AI Cost & Provider Control", expectedProgress: 0 },
  
  // Website & Öffentlicher Bereich (5)
  { code: "WEB-01", name: "Öffentliche Website (Frontend)", expectedProgress: 0 },
  { code: "WEB-02", name: "Kundenportal Login", expectedProgress: 0 },
  { code: "WEB-03", name: "SEO & Meta-Konfiguration", expectedProgress: 0 },
  { code: "WEB-04", name: "Cookie-Consent (DSGVO)", expectedProgress: 0 },
  { code: "WEB-05", name: "Impressum & Datenschutz (dynamisch)", expectedProgress: 0 },
  
  // Sicherheit & Compliance (5)
  { code: "SEC-01", name: "DSGVO Consent Management", expectedProgress: 0 },
  { code: "SEC-02", name: "Datenexport (DSGVO Art.20)", expectedProgress: 0 },
  { code: "SEC-03", name: "Löschkonzept (DSGVO Art.17)", expectedProgress: 0 },
  { code: "SEC-04", name: "Security-Audit Dashboard", expectedProgress: 0 },
  { code: "SEC-05", name: "Penetration-Test Vorbereitung", expectedProgress: 0 },
  
  // Server & Betrieb (5)
  { code: "OPS-01", name: "Netcup Debian 12 Grundsetup", expectedProgress: 0 },
  { code: "OPS-02", name: "Deployment-Pipeline", expectedProgress: 0 },
  { code: "OPS-03", name: "Monitoring & Health Checks", expectedProgress: 0 },
  { code: "OPS-04", name: "Backup & Restore", expectedProgress: 0 },
  { code: "OPS-05", name: "Logging & Fehler-Monitoring", expectedProgress: 0 },
  
  // Dokumentation & Schulung (5)
  { code: "DOC-01", name: "System-Dokumentation", expectedProgress: 0 },
  { code: "DOC-02", name: "Admin-Handbuch", expectedProgress: 0 },
  { code: "DOC-03", name: "Betriebsdokumentation", expectedProgress: 0 },
  { code: "DOC-04", name: "DSGVO-Dokumentation", expectedProgress: 0 },
  { code: "DOC-05", name: "Changelog & STATUS", expectedProgress: 0 },
];

// Erwartete ADM-Module auf 100% (laut STATUS.md)
const ADM_MODULES_100 = ["ADM-01", "ADM-02", "ADM-03", "ADM-04", "ADM-05", "ADM-06", "ADM-07"];

async function runConsistencyCheck() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=====================================================');
  console.log('ENTERPRISE++ KONSISTENZPRÜFUNG (READ ONLY)');
  console.log('=====================================================');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  const report = {
    missingInDb: [],
    extraInDb: [],
    progressMismatch: [],
    admStatus: [],
    summary: {}
  };

  try {
    // 1. Alle Module aus DB laden
    console.log('=== SCHRITT 1: Datenbank-Abfrage (SELECT) ===');
    const [dbModules] = await conn.execute(`
      SELECT 
        mr.id,
        mr.module_code,
        mr.module_name,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY mr.module_code
    `);

    console.log(`  Gefunden: ${dbModules.length} Module in DB`);
    console.log(`  Erwartet: ${EXPECTED_MODULES.length} Basis-Module`);
    console.log('');

    // 2. Vergleich: Erwartet → DB
    console.log('=== SCHRITT 2: Fehlende Module prüfen ===');
    const dbModuleMap = new Map();
    for (const mod of dbModules) {
      dbModuleMap.set(mod.module_code, mod);
    }

    for (const expected of EXPECTED_MODULES) {
      if (!dbModuleMap.has(expected.code)) {
        report.missingInDb.push({
          code: expected.code,
          name: expected.name,
          reason: 'Nicht in DB gefunden'
        });
        console.log(`  ❌ FEHLT: [${expected.code}] ${expected.name}`);
      }
    }

    if (report.missingInDb.length === 0) {
      console.log('  ✅ Alle erwarteten Module in DB vorhanden');
    }
    console.log('');

    // 3. Extra-Module in DB (nicht in EXPECTED_MODULES)
    console.log('=== SCHRITT 3: Extra-Module in DB ===');
    const expectedCodes = new Set(EXPECTED_MODULES.map(m => m.code));
    for (const dbMod of dbModules) {
      if (!expectedCodes.has(dbMod.module_code)) {
        report.extraInDb.push({
          code: dbMod.module_code,
          name: dbMod.module_name,
          progress: dbMod.progress_percent,
          status: dbMod.ist_status
        });
        console.log(`  ➕ EXTRA: [${dbMod.module_code}] ${dbMod.module_name} (${dbMod.progress_percent}%)`);
      }
    }

    if (report.extraInDb.length === 0) {
      console.log('  ✅ Keine Extra-Module gefunden');
    }
    console.log('');

    // 4. ADM-Module Status prüfen (laut STATUS.md: alle auf 100%)
    console.log('=== SCHRITT 4: ADM-Module Status (Erwartet: 100%) ===');
    for (const admCode of ADM_MODULES_100) {
      const dbMod = dbModuleMap.get(admCode);
      if (dbMod) {
        const ok = dbMod.progress_percent === 100 && dbMod.ist_status === 'done';
        report.admStatus.push({
          code: admCode,
          name: dbMod.module_name,
          progress: dbMod.progress_percent,
          status: dbMod.ist_status,
          ok: ok
        });
        console.log(`  ${ok ? '✅' : '❌'} [${admCode}] ${dbMod.module_name}: ${dbMod.progress_percent}% (${dbMod.ist_status})`);
        
        if (!ok) {
          report.progressMismatch.push({
            code: admCode,
            expected: '100% (done)',
            found: `${dbMod.progress_percent}% (${dbMod.ist_status})`,
            recommendation: 'Über UI/API auf 100% setzen'
          });
        }
      } else {
        console.log(`  ❌ [${admCode}] NICHT GEFUNDEN`);
      }
    }
    console.log('');

    // 5. Zusammenfassung
    console.log('=====================================================');
    console.log('PRÜFBERICHT - ZUSAMMENFASSUNG');
    console.log('=====================================================');
    console.log('');

    report.summary = {
      totalExpected: EXPECTED_MODULES.length,
      totalInDb: dbModules.length,
      missingCount: report.missingInDb.length,
      extraCount: report.extraInDb.length,
      admOkCount: report.admStatus.filter(a => a.ok).length,
      admTotalCount: ADM_MODULES_100.length,
      progressMismatchCount: report.progressMismatch.length
    };

    console.log('| Bereich | Erwartet | Gefunden | Status |');
    console.log('|---------|----------|----------|--------|');
    console.log(`| Basis-Module | ${report.summary.totalExpected} | ${report.summary.totalExpected - report.summary.missingCount} | ${report.summary.missingCount === 0 ? '✅ OK' : '❌ ' + report.summary.missingCount + ' fehlen'} |`);
    console.log(`| Extra-Module | 0 | ${report.summary.extraCount} | ${report.summary.extraCount > 0 ? 'ℹ️ ' + report.summary.extraCount + ' zusätzlich' : '✅ OK'} |`);
    console.log(`| ADM auf 100% | ${report.summary.admTotalCount} | ${report.summary.admOkCount} | ${report.summary.admOkCount === report.summary.admTotalCount ? '✅ OK' : '❌ ' + (report.summary.admTotalCount - report.summary.admOkCount) + ' nicht 100%'} |`);
    console.log(`| Gesamt in DB | - | ${report.summary.totalInDb} | ℹ️ Info |`);
    console.log('');

    // 6. Detaillierter Report
    if (report.missingInDb.length > 0) {
      console.log('--- FEHLENDE MODULE ---');
      for (const m of report.missingInDb) {
        console.log(`  [${m.code}] ${m.name}`);
        console.log(`    → Empfehlung: Über initializeTables() oder UI hinzufügen`);
      }
      console.log('');
    }

    if (report.extraInDb.length > 0) {
      console.log('--- EXTRA-MODULE (nicht in Basis-Liste) ---');
      for (const m of report.extraInDb) {
        console.log(`  [${m.code}] ${m.name} (${m.progress}%)`);
        console.log(`    → Info: Zusätzliches Modul, ggf. in Doku aufnehmen`);
      }
      console.log('');
    }

    if (report.progressMismatch.length > 0) {
      console.log('--- FORTSCHRITTS-ABWEICHUNGEN ---');
      for (const m of report.progressMismatch) {
        console.log(`  [${m.code}]`);
        console.log(`    Erwartet: ${m.expected}`);
        console.log(`    Gefunden: ${m.found}`);
        console.log(`    → ${m.recommendation}`);
      }
      console.log('');
    }

    // 7. Gesamtergebnis
    console.log('=====================================================');
    const allOk = report.missingInDb.length === 0 && 
                  report.progressMismatch.length === 0 &&
                  report.admStatus.every(a => a.ok);
    
    if (allOk) {
      console.log('✅ KONSISTENZPRÜFUNG BESTANDEN');
      console.log('   Alle Basis-Module vorhanden, ADM-Module auf 100%.');
    } else {
      console.log('⚠️ KONSISTENZPRÜFUNG: ABWEICHUNGEN GEFUNDEN');
      console.log('   Siehe Report oben für Details.');
    }
    console.log('=====================================================');
    console.log('');
    console.log('HINWEIS: Dies war eine READ-ONLY Prüfung.');
    console.log('Es wurden KEINE Daten verändert.');

  } catch (error) {
    console.error('❌ FEHLER:', error.message);
  } finally {
    await conn.end();
  }
}

runConsistencyCheck();



