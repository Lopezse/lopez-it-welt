/**
 * ENTERPRISE++ AGENT-SYSTEM WIEDERHERSTELLUNG
 * =====================================================
 * Erstellt: 2025-12-04
 * Zweck: Alle 53 SOLL-Module + IST-Fortschritte wiederherstellen
 * Regeln:
 * - KEIN DELETE
 * - KEIN DROP
 * - KEIN TRUNCATE
 * - NUR INSERT...ON DUPLICATE KEY UPDATE
 * =====================================================
 */

const mysql = require('mysql2/promise');

// =====================================================
// ALLE 53 SOLL-MODULE (aus src/lib/agent-system.ts)
// =====================================================
const SOLL_MODULE_LIST = [
  // 1. Admin & Core Platform (ADM-01 bis ADM-07)
  { code: "ADM-01", name: "Admin-Dashboard", category: "Admin & Core Platform", description: "Zentrales Admin-Dashboard mit Kacheln, Statusübersichten und Schnellzugriffen.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-02", name: "Benutzerverwaltung", category: "Admin & Core Platform", description: "Benutzer anlegen, bearbeiten, sperren, Passwortrücksetzung.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-03", name: "Rollen & Rechte (RBAC/ABAC)", category: "Admin & Core Platform", description: "Rollen definieren, Rechte zuweisen, Policy-Logik für RBAC/ABAC.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-04", name: "2FA & Session-Management", category: "Admin & Core Platform", description: "2FA-Integration (z. B. Aegis), Session-Übersicht, IP-Bindung, Session-Logout.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-05", name: "Audit-Logs", category: "Admin & Core Platform", description: "Protokollierung sicherheitsrelevanter Aktionen, einsehbar im Admin.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-06", name: "Dynamic Settings", category: "Admin & Core Platform", description: "Zentrales Settings-System (Firma, Domains, Limits, AI-Provider, Mail, etc.).", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
  { code: "ADM-07", name: "Modul-Registry (SOLL/IST)", category: "Admin & Core Platform", description: "Verwaltung aller Module inkl. Kategorie, Status, Priorität und Agent-Zuordnung.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M5", risk_level: "low", go_live_required: 1 },

  // 2. Kunden & Projekte (KP-01 bis KP-05)
  { code: "KP-01", name: "Kundenliste", category: "Kunden & Projekte", description: "Übersicht aller Kunden mit Filter- und Suchfunktionen.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "medium", go_live_required: 1 },
  { code: "KP-02", name: "Kundenstammdaten", category: "Kunden & Projekte", description: "Verwaltung von Firmendaten, Ansprechpartnern, Adressen und Kontaktdaten.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "medium", go_live_required: 1 },
  { code: "KP-03", name: "Projekte pro Kunde", category: "Kunden & Projekte", description: "Zuordnung und Verwaltung von Projekten je Kunde inkl. Status.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "KP-04", name: "Projekt-Fortschritts-Tracking", category: "Kunden & Projekte", description: "Projektfortschritt, Deadlines und Status (Ampel) je Projekt.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "KP-05", name: "Projekt-Notizen & Dateien", category: "Kunden & Projekte", description: "Interne Notizen und verknüpfte Dateien je Projekt.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },

  // 3. Support & Kommunikation (SUP-01 bis SUP-04)
  { code: "SUP-01", name: "Support-Tickets", category: "Support & Kommunikation", description: "Ticket-System mit Status, Priorität, Zuweisung und Historie.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "SUP-02", name: "Kontakt-Nachrichten", category: "Support & Kommunikation", description: "Eingehende Kontaktformular-Anfragen von der Website im Admin anzeigen.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "low", go_live_required: 1 },
  { code: "SUP-03", name: "E-Mail-Templates", category: "Support & Kommunikation", description: "Verwaltung von Standard-E-Mail-Texten für Bestätigungen und Benachrichtigungen.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },
  { code: "SUP-04", name: "Benachrichtigungssystem (Admin)", category: "Support & Kommunikation", description: "Badges, Hinweise und interne Benachrichtigungen im Admin-Dashboard.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },

  // 4. Inhalte & Medien (MED-01 bis MED-05)
  { code: "MED-01", name: "Medienbibliothek", category: "Inhalte & Medien", description: "Übersicht aller hochgeladenen Medien inkl. Filter und Suche.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M3", risk_level: "medium", go_live_required: 1 },
  { code: "MED-02", name: "Sicherer Dateispeicher", category: "Inhalte & Medien", description: "ID-basierte Dateistruktur, keine Klartext-Dateinamen, kein Directory Listing.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "high", go_live_required: 1 },
  { code: "MED-03", name: "Media-KI Analyse", category: "Inhalte & Medien", description: "Automatische KI-Analyse von Medien, inkl. Tags und DSGVO-Flags.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "high", go_live_required: 0 },
  { code: "MED-04", name: "DSGVO-Consent im Media-Upload", category: "Inhalte & Medien", description: "Consent-Abfrage und Speicherung bei jedem Upload.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "critical", go_live_required: 1 },
  { code: "MED-05", name: "Media-Tags & Kategorien", category: "Inhalte & Medien", description: "Tag- und Kategorieverwaltung für Medien (manuell und automatisch).", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },

  // 5. Finanzen & Abrechnung (FIN-01 bis FIN-05)
  { code: "FIN-01", name: "Rechnungsmodul Basis", category: "Finanzen & Abrechnung", description: "Rechnungen erstellen, bearbeiten und als PDF exportieren.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "high", go_live_required: 1 },
  { code: "FIN-02", name: "Produkt- und Dienstleistungskatalog", category: "Finanzen & Abrechnung", description: "Stammdaten für Artikel, Stundensätze und Einheiten.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "FIN-03", name: "Rechnungsübersicht", category: "Finanzen & Abrechnung", description: "Liste aller Rechnungen mit Status (offen, bezahlt, storniert).", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "FIN-04", name: "Steuer- & Währungsmanagement", category: "Finanzen & Abrechnung", description: "MwSt-Sätze, Rabatte, Währungen konfigurierbar.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },
  { code: "FIN-05", name: "Zeitabrechnung (Timetracking)", category: "Finanzen & Abrechnung", description: "Erfasste Zeiten in Rechnung stellen, Stundensätze zuordnen.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },

  // 6. KI-Integration (AI-01 bis AI-05)
  { code: "AI-01", name: "Customer Insights", category: "KI-Integration", description: "KI-gestützte Kundenanalyse und -empfehlungen.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },
  { code: "AI-02", name: "Project Analyzer", category: "KI-Integration", description: "Automatische Projektanalyse und Fortschritts-Vorhersage.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },
  { code: "AI-03", name: "Invoice Assistant", category: "KI-Integration", description: "Automatische Rechnungserstellung aus Projektdaten.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },
  { code: "AI-04", name: "Executive Reports", category: "KI-Integration", description: "Automatisch generierte Management-Berichte.", priority: "low", soll_status: "open", priority_level: "P3", maturity_level: "M0", risk_level: "low", go_live_required: 0 },
  { code: "AI-05", name: "AI Cost & Provider Control", category: "KI-Integration", description: "Überwachung und Steuerung von KI-Kosten und Providern.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "high", go_live_required: 1 },

  // 7. Website & Öffentlicher Bereich (WEB-01 bis WEB-05)
  { code: "WEB-01", name: "Öffentliche Website (Frontend)", category: "Website & Öffentlicher Bereich", description: "Hauptseite mit Hero, Services, Referenzen und Kontakt.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "medium", go_live_required: 1 },
  { code: "WEB-02", name: "Kundenportal Login", category: "Website & Öffentlicher Bereich", description: "Separater Login für Kunden mit eigenem Dashboard.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "high", go_live_required: 0 },
  { code: "WEB-03", name: "SEO & Meta-Konfiguration", category: "Website & Öffentlicher Bereich", description: "Title, Description, OG-Tags und Canonical-URLs pflegbar.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },
  { code: "WEB-04", name: "Cookie-Consent (DSGVO)", category: "Website & Öffentlicher Bereich", description: "DSGVO-konforme Cookie-Einwilligung im Frontend.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "critical", go_live_required: 1 },
  { code: "WEB-05", name: "Impressum & Datenschutz (dynamisch)", category: "Website & Öffentlicher Bereich", description: "Dynamisch aus Settings geladene Rechtstexte.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "critical", go_live_required: 1 },

  // 8. Sicherheit & Compliance (SEC-01 bis SEC-05)
  { code: "SEC-01", name: "DSGVO Consent Management", category: "Sicherheit & Compliance", description: "Verwaltung aller Einwilligungen inkl. Zeitstempel.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "critical", go_live_required: 1 },
  { code: "SEC-02", name: "Datenexport (DSGVO Art.20)", category: "Sicherheit & Compliance", description: "Export aller personenbezogenen Daten eines Nutzers.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "critical", go_live_required: 1 },
  { code: "SEC-03", name: "Löschkonzept (DSGVO Art.17)", category: "Sicherheit & Compliance", description: "Datenlöschung nach Ablauf der Aufbewahrungsfrist.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "critical", go_live_required: 1 },
  { code: "SEC-04", name: "Security-Audit Dashboard", category: "Sicherheit & Compliance", description: "Übersicht über Sicherheitsstatus und offene Risiken.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "high", go_live_required: 1 },
  { code: "SEC-05", name: "Penetration-Test Vorbereitung", category: "Sicherheit & Compliance", description: "Dokumentation und Vorbereitung für externe Security-Audits.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "high", go_live_required: 0 },

  // 9. Server & Betrieb (OPS-01 bis OPS-05)
  { code: "OPS-01", name: "Netcup Debian 12 Grundsetup", category: "Server & Betrieb", description: "Grundhärtung, Benutzer, SSH, Firewall, Basis-Security.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M3", risk_level: "high", go_live_required: 1 },
  { code: "OPS-02", name: "Deployment-Pipeline", category: "Server & Betrieb", description: "Automatisierter oder halbautomatischer Deploy von lokal nach Netcup.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "high", go_live_required: 1 },
  { code: "OPS-03", name: "Monitoring & Health Checks", category: "Server & Betrieb", description: "Basic-Monitoring für Erreichbarkeit und Fehlerstatus der Dienste.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "medium", go_live_required: 1 },
  { code: "OPS-04", name: "Backup & Restore", category: "Server & Betrieb", description: "Strategie und Umsetzung inkl. Restore-Test.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "critical", go_live_required: 1 },
  { code: "OPS-05", name: "Logging & Fehler-Monitoring", category: "Server & Betrieb", description: "Zentrales Error-Logging und Auswertung.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "medium", go_live_required: 0 },

  // 10. Dokumentation & Schulung (DOC-01 bis DOC-05)
  { code: "DOC-01", name: "System-Dokumentation", category: "Dokumentation & Schulung", description: "Technische Dokumentation der Architektur und APIs.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "low", go_live_required: 1 },
  { code: "DOC-02", name: "Admin-Handbuch", category: "Dokumentation & Schulung", description: "Benutzerhandbuch für Administratoren.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M2", risk_level: "low", go_live_required: 1 },
  { code: "DOC-03", name: "Betriebsdokumentation", category: "Dokumentation & Schulung", description: "Dokumentation für den täglichen Betrieb.", priority: "medium", soll_status: "planned", priority_level: "P2", maturity_level: "M1", risk_level: "low", go_live_required: 0 },
  { code: "DOC-04", name: "DSGVO-Dokumentation", category: "Dokumentation & Schulung", description: "DSGVO-konforme Dokumentation und Verfahrensverzeichnis.", priority: "high", soll_status: "required", priority_level: "P0", maturity_level: "M2", risk_level: "critical", go_live_required: 1 },
  { code: "DOC-05", name: "Changelog & STATUS", category: "Dokumentation & Schulung", description: "Fortlaufende Änderungshistorie und Statusdokumentation.", priority: "high", soll_status: "required", priority_level: "P1", maturity_level: "M4", risk_level: "low", go_live_required: 1 },
];

// =====================================================
// IST-FORTSCHRITTE (ADM-01 bis ADM-07 = 100%)
// =====================================================
const IST_PROGRESS = {
  "ADM-01": 100, // Admin-Dashboard
  "ADM-02": 100, // Benutzerverwaltung
  "ADM-03": 100, // RBAC/ABAC
  "ADM-04": 100, // 2FA/Session
  "ADM-05": 100, // Audit-Logs
  "ADM-06": 100, // Dynamic Settings
  "ADM-07": 100, // Modul-Registry
  // Andere Module: Standardwert 0
};

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  console.log('=====================================================');
  console.log('ENTERPRISE++ AGENT-SYSTEM WIEDERHERSTELLUNG');
  console.log('=====================================================');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  try {
    // =====================================================
    // SCHRITT 1: module_registry befüllen (UPSERT)
    // =====================================================
    console.log('=== SCHRITT 1: module_registry UPSERT ===');
    let insertedModules = 0;
    let updatedModules = 0;

    for (const mod of SOLL_MODULE_LIST) {
      const [result] = await conn.execute(
        `INSERT INTO module_registry 
          (module_code, module_name, category, description, priority, soll_status, 
           priority_level, maturity_level, risk_level, go_live_required, depends_on, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', NOW(), NOW())
         ON DUPLICATE KEY UPDATE
           module_name = VALUES(module_name),
           category = VALUES(category),
           description = VALUES(description),
           priority = VALUES(priority),
           soll_status = VALUES(soll_status),
           priority_level = VALUES(priority_level),
           maturity_level = VALUES(maturity_level),
           risk_level = VALUES(risk_level),
           go_live_required = VALUES(go_live_required),
           updated_at = NOW()`,
        [
          mod.code, mod.name, mod.category, mod.description, mod.priority, mod.soll_status,
          mod.priority_level, mod.maturity_level, mod.risk_level, mod.go_live_required
        ]
      );
      
      if (result.affectedRows === 1) {
        insertedModules++;
        console.log(`  ✅ NEU: [${mod.code}] ${mod.name}`);
      } else if (result.affectedRows === 2) {
        updatedModules++;
        console.log(`  🔄 UPDATE: [${mod.code}] ${mod.name}`);
      }
    }

    console.log(`\n📊 module_registry: ${insertedModules} neu, ${updatedModules} aktualisiert`);

    // =====================================================
    // SCHRITT 2: module_progress befüllen (UPSERT)
    // =====================================================
    console.log('\n=== SCHRITT 2: module_progress UPSERT ===');
    let insertedProgress = 0;
    let updatedProgress = 0;

    // Hole alle Module mit IDs
    const [modules] = await conn.execute('SELECT id, module_code FROM module_registry');
    
    for (const mod of modules) {
      const progress = IST_PROGRESS[mod.module_code] || 0;
      const istStatus = progress >= 100 ? 'done' : (progress > 0 ? 'in_progress' : 'open');
      const agent = progress >= 80 ? 'run' : (progress >= 30 ? 'build' : 'plan');
      const comment = progress === 100 ? 'Enterprise++ vollständig implementiert' : 
                      progress > 0 ? `IST-Stand: ${progress}%` : 'Noch nicht gestartet';

      const [result] = await conn.execute(
        `INSERT INTO module_progress 
          (module_id, ist_status, progress_percent, comment, responsible_agent, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           ist_status = VALUES(ist_status),
           progress_percent = VALUES(progress_percent),
           comment = VALUES(comment),
           responsible_agent = VALUES(responsible_agent),
           updated_at = NOW()`,
        [mod.id, istStatus, progress, comment, agent]
      );

      if (result.affectedRows === 1) {
        insertedProgress++;
      } else if (result.affectedRows === 2) {
        updatedProgress++;
      }

      if (progress === 100) {
        console.log(`  ✅ [${mod.module_code}] → 100% (done)`);
      }
    }

    console.log(`\n📊 module_progress: ${insertedProgress} neu, ${updatedProgress} aktualisiert`);

    // =====================================================
    // SCHRITT 3: Ergebnis verifizieren
    // =====================================================
    console.log('\n=== SCHRITT 3: VERIFIZIERUNG ===');

    const [countRegistry] = await conn.execute('SELECT COUNT(*) as c FROM module_registry');
    const [countProgress] = await conn.execute('SELECT COUNT(*) as c FROM module_progress');
    const [countNullCode] = await conn.execute("SELECT COUNT(*) as c FROM module_registry WHERE module_code IS NULL OR module_code = ''");
    const [countDone] = await conn.execute("SELECT COUNT(*) as c FROM module_progress WHERE ist_status = 'done'");

    console.log(`  module_registry: ${countRegistry[0].c} Zeilen`);
    console.log(`  module_progress: ${countProgress[0].c} Zeilen`);
    console.log(`  NULL/leere module_codes: ${countNullCode[0].c}`);
    console.log(`  Module mit status=done: ${countDone[0].c}`);

    // ADM-Module Prüfung
    console.log('\n=== ADM-MODULE STATUS ===');
    const [admModules] = await conn.execute(`
      SELECT mr.module_code, mr.module_name, mp.progress_percent, mp.ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.module_code LIKE 'ADM-%'
      ORDER BY mr.module_code
    `);

    let allAdmOk = true;
    for (const adm of admModules) {
      const ok = adm.progress_percent === 100 && adm.ist_status === 'done';
      if (!ok) allAdmOk = false;
      console.log(`  ${ok ? '✅' : '❌'} [${adm.module_code}] ${adm.module_name}: ${adm.progress_percent}% (${adm.ist_status})`);
    }

    // =====================================================
    // ZUSAMMENFASSUNG
    // =====================================================
    console.log('\n=====================================================');
    console.log('ZUSAMMENFASSUNG');
    console.log('=====================================================');
    
    const success = 
      countRegistry[0].c >= 53 && 
      countProgress[0].c >= 53 && 
      countNullCode[0].c === 0 &&
      countDone[0].c >= 7 &&
      allAdmOk;

    if (success) {
      console.log('✅ WIEDERHERSTELLUNG ERFOLGREICH');
      console.log(`   - ${countRegistry[0].c} Module in module_registry`);
      console.log(`   - ${countProgress[0].c} Einträge in module_progress`);
      console.log(`   - ${countDone[0].c} Module mit 100% (done)`);
      console.log('   - ADM-01 bis ADM-07: alle auf 100%');
      console.log('   - Keine NULL/leeren module_codes');
    } else {
      console.log('⚠️ PRÜFUNG ERFORDERLICH');
      if (countRegistry[0].c < 53) console.log(`   - module_registry: nur ${countRegistry[0].c} statt 53`);
      if (countProgress[0].c < 53) console.log(`   - module_progress: nur ${countProgress[0].c} statt 53`);
      if (countNullCode[0].c > 0) console.log(`   - ${countNullCode[0].c} Einträge mit NULL/leerem module_code`);
      if (!allAdmOk) console.log('   - Nicht alle ADM-Module auf 100%');
    }

    console.log('\n=====================================================');
    console.log('ENTERPRISE++ REGELN EINGEHALTEN:');
    console.log('  ✅ Kein DELETE ausgeführt');
    console.log('  ✅ Kein DROP ausgeführt');
    console.log('  ✅ Kein TRUNCATE ausgeführt');
    console.log('  ✅ Nur INSERT...ON DUPLICATE KEY UPDATE verwendet');
    console.log('=====================================================');

  } catch (error) {
    console.error('\n❌ FEHLER:', error.message);
  } finally {
    await conn.end();
  }
}

run();









