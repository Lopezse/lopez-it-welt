// TEMPORÄRES RESTORE-SCRIPT - Kann nach Ausführung gelöscht werden
const mysql = require('mysql2/promise');

async function restore() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });
  
  console.log('=== SCHRITT 0: module_registry Tabelle anlegen ===');
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS module_registry (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      module_code VARCHAR(20) NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT NULL,
      priority VARCHAR(20) DEFAULT 'medium',
      priority_level ENUM('P0','P1','P2','P3') DEFAULT 'P2',
      maturity_level ENUM('M0','M1','M2','M3','M4','M5') DEFAULT 'M0',
      risk_level ENUM('critical','high','medium','low') DEFAULT 'medium',
      depends_on JSON NULL,
      go_live_required BOOLEAN DEFAULT FALSE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_module_code (module_code),
      KEY idx_category (category),
      KEY idx_priority_level (priority_level),
      KEY idx_risk_level (risk_level)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
  console.log('✅ module_registry Tabelle erstellt');

  console.log('');
  console.log('=== SCHRITT 1: module_progress Tabelle anlegen ===');
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS module_progress (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      module_id BIGINT UNSIGNED NOT NULL,
      ist_status ENUM('open','in_progress','done') NOT NULL DEFAULT 'open',
      progress_percent INT NOT NULL DEFAULT 0,
      comment TEXT NULL,
      responsible_agent ENUM('plan','build','run') NOT NULL DEFAULT 'plan',
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_module_progress (module_id),
      KEY idx_ist_status (ist_status),
      KEY idx_responsible_agent (responsible_agent)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
  console.log('✅ module_progress Tabelle erstellt');

  console.log('');
  console.log('=== SCHRITT 2: Module in module_registry einfügen ===');
  await conn.execute(`
    INSERT INTO module_registry
      (id, module_code, name, category, description, priority_level, maturity_level, risk_level, go_live_required)
    VALUES
      (1, 'ADM-01', 'Admin-Dashboard', 'Admin & Core Platform', 'Zentrales Admin-Dashboard mit Kacheln, Statusübersichten und Schnellzugriffen.', 'P0', 'M5', 'low', 1),
      (2, 'ADM-02', 'Benutzerverwaltung', 'Admin & Core Platform', 'Benutzer anlegen, bearbeiten, sperren, Passwortzurücksetzung.', 'P0', 'M5', 'low', 1),
      (3, 'ADM-03', 'Rollen & Rechte (RBAC/ABAC)', 'Admin & Core Platform', 'Rollen definieren, Rechte zuweisen, Policy-Logik für RBAC/ABAC.', 'P0', 'M5', 'low', 1),
      (4, 'ADM-04', '2FA & Session-Management', 'Admin & Core Platform', '2FA-Integration, Session-Übersicht, IP-Bindung, Session-Logout.', 'P0', 'M5', 'low', 1),
      (5, 'ADM-05', 'Audit-Logs', 'Admin & Core Platform', 'Protokollierung sicherheitsrelevanter Aktionen, einsehbar im Admin.', 'P0', 'M5', 'low', 1),
      (6, 'ADM-06', 'Dynamic Settings', 'Admin & Core Platform', 'Zentrales Settings-System (Firma, Domains, Limits, AI-Provider, Mail etc.).', 'P0', 'M5', 'low', 1),
      (7, 'ADM-07', 'Modul-Registry (SOLL/IST)', 'Admin & Core Platform', 'Verwaltung aller Module inkl. Kategorie, Status, Priorität und Agent-Zuordnung.', 'P0', 'M5', 'low', 1),
      (10, 'OPS-01', 'Netcup Debian 12 Grundsetup', 'Server, Sicherheit & Betrieb', 'Grundhärtung, Benutzer, SSH, Firewall, Basis-Security.', 'P1', 'M2', 'medium', 1),
      (11, 'OPS-02', 'Deployment-Pipeline', 'Server, Sicherheit & Betrieb', 'Automatisierter oder halbautomatischer Deploy von lokal nach Netcup (Staging/Prod).', 'P1', 'M1', 'medium', 1),
      (12, 'OPS-03', 'Monitoring & Health Checks', 'Server, Sicherheit & Betrieb', 'Basic-Monitoring für Erreichbarkeit und Fehlerstatus der Dienste.', 'P1', 'M1', 'medium', 1),
      (13, 'OPS-04', 'Backup & Restore', 'Server, Sicherheit & Betrieb', 'Strategie und Umsetzung inkl. Restore-Test.', 'P1', 'M1', 'medium', 1),
      (14, 'OPS-05', 'Logging & Fehler-Monitoring', 'Server, Sicherheit & Betrieb', 'Zentrales Error-Logging und Auswertung.', 'P1', 'M1', 'medium', 1)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      category = VALUES(category),
      description = VALUES(description),
      priority_level = VALUES(priority_level),
      maturity_level = VALUES(maturity_level),
      risk_level = VALUES(risk_level),
      go_live_required = VALUES(go_live_required)
  `);
  console.log('✅ 12 Module eingefügt (ADM-01 bis ADM-07 + OPS-01 bis OPS-05)');

  console.log('');
  console.log('=== SCHRITT 3: ADM-Module auf 100% setzen ===');
  await conn.execute(`
    INSERT INTO module_progress
      (module_id, ist_status, progress_percent, comment, responsible_agent)
    VALUES
      (1, 'done', 100, 'Restore 2025-12-03 – ADM-01 erneut als fertig markiert.', 'run'),
      (2, 'done', 100, 'Restore 2025-12-03 – ADM-02 erneut als fertig markiert.', 'run'),
      (3, 'done', 100, 'Restore 2025-12-03 – ADM-03 erneut als fertig markiert.', 'run'),
      (4, 'done', 100, 'Restore 2025-12-03 – ADM-04 erneut als fertig markiert.', 'run'),
      (5, 'done', 100, 'Restore 2025-12-03 – ADM-05 erneut als fertig markiert.', 'run'),
      (6, 'done', 100, 'Restore 2025-12-03 – ADM-06 erneut als fertig markiert.', 'run'),
      (7, 'done', 100, 'Restore 2025-12-03 – ADM-07 erneut als fertig markiert.', 'run')
    ON DUPLICATE KEY UPDATE
      ist_status = VALUES(ist_status),
      progress_percent = VALUES(progress_percent),
      comment = VALUES(comment),
      responsible_agent = VALUES(responsible_agent)
  `);
  console.log('✅ ADM-01 bis ADM-07 auf 100% gesetzt');

  console.log('');
  console.log('=== PRÜFUNG ===');
  const [regCount] = await conn.execute('SELECT COUNT(*) as count FROM module_registry');
  const [progCount] = await conn.execute('SELECT COUNT(*) as count FROM module_progress');
  console.log('module_registry:', regCount[0].count, 'Einträge');
  console.log('module_progress:', progCount[0].count, 'Einträge');

  await conn.end();
  console.log('');
  console.log('✅ WIEDERHERSTELLUNG ABGESCHLOSSEN');
}

restore().catch(e => console.error('❌ FEHLER:', e.message));

