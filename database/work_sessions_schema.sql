-- =====================================================
-- MySQL Datenbank-Schema für Lopez IT Welt Lernsystem
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: Zeiterfassung und Lernsystem für Arbeitsabläufe
-- =====================================================

-- Datenbank erstellen (falls nicht vorhanden)
CREATE DATABASE IF NOT EXISTS lopez_it_welt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Datenbank verwenden
USE lopez_it_welt;

-- =====================================================
-- Tabelle: work_sessions (Haupttabelle für Zeiterfassung)
-- =====================================================
CREATE TABLE IF NOT EXISTS work_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Grundlegende Informationen
    beschreibung TEXT NOT NULL COMMENT 'Was wurde gemacht - detaillierte Beschreibung',
    start_time DATETIME NOT NULL COMMENT 'Startzeit der Arbeit',
    end_time DATETIME NULL COMMENT 'Endzeit der Arbeit (NULL wenn noch aktiv)',
    dauer_min INT NULL COMMENT 'Dauer in Minuten (automatisch berechnet)',
    
    -- Status und Kategorisierung
    status ENUM('gut', 'schlecht', 'abgebrochen', 'pausiert') NOT NULL DEFAULT 'gut' COMMENT 'Wie lief die Arbeit?',
    kategorie ENUM('planung', 'umsetzung', 'debug', 'dokumentation', 'testing', 'optimierung', 'meeting', 'sonstiges') NOT NULL DEFAULT 'umsetzung' COMMENT 'Art der Arbeit',
    prioritaet ENUM('niedrig', 'mittel', 'hoch', 'kritisch') NOT NULL DEFAULT 'mittel' COMMENT 'Priorität der Aufgabe',
    
    -- Lernsystem-Felder
    bemerkung TEXT NULL COMMENT 'Was lief gut/schlecht? - Positive/Negative Aspekte',
    ursache TEXT NULL COMMENT 'Warum wurde es abgebrochen/verschoben? - Ursachenanalyse',
    lektion TEXT NULL COMMENT 'Was habe ich gelernt? - Erkenntnisse für die Zukunft',
    naechster_schritt TEXT NULL COMMENT 'Was mache ich beim nächsten Mal anders? - Konkrete Maßnahmen',
    
    -- Abrechnungs-Flags
    approved TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Freigegeben für Abrechnung (0=nein, 1=ja)',
    invoiced TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Bereits abgerechnet (0=nein, 1=ja)',
    
    -- Office & Finance Integration
    project_id INT NULL COMMENT 'FK zu lopez_projects.id',
    order_id INT NULL COMMENT 'FK zu lopez_orders.id',
    task_id INT NULL COMMENT 'FK zu lopez_tasks.id',
    
    -- Technische Felder
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Wann wurde der Eintrag erstellt',
    aktualisiert_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Wann wurde zuletzt aktualisiert',
    
    -- Foreign Keys
    FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL,
    
    -- Indizes für bessere Performance
    INDEX idx_status (status),
    INDEX idx_kategorie (kategorie),
    INDEX idx_start_time (start_time),
    INDEX idx_prioritaet (prioritaet),
    INDEX idx_erstellt_am (erstellt_am),
    INDEX idx_approved (approved),
    INDEX idx_invoiced (invoiced),
    INDEX idx_project_id (project_id),
    INDEX idx_order_id (order_id),
    INDEX idx_task_id (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Haupttabelle für Zeiterfassung und Lernsystem';

-- =====================================================
-- Tabelle: work_tags (Tags für bessere Kategorisierung)
-- =====================================================
CREATE TABLE IF NOT EXISTS work_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Name des Tags',
    farbe VARCHAR(7) NOT NULL DEFAULT '#3B82F6' COMMENT 'Hex-Farbe für Tag (z.B. #3B82F6)',
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tags für bessere Kategorisierung von Arbeiten';

-- =====================================================
-- Tabelle: work_session_tags (Verknüpfung Sessions <-> Tags)
-- =====================================================
CREATE TABLE IF NOT EXISTS work_session_tags (
    session_id INT NOT NULL,
    tag_id INT NOT NULL,
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (session_id, tag_id),
    FOREIGN KEY (session_id) REFERENCES work_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES work_tags(id) ON DELETE CASCADE,
    
    INDEX idx_session_id (session_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Verknüpfung zwischen Sessions und Tags';

-- =====================================================
-- Tabelle: work_statistics (Aggregierte Statistiken)
-- =====================================================
CREATE TABLE IF NOT EXISTS work_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    datum DATE NOT NULL COMMENT 'Datum der Statistik',
    
    -- Tagesstatistiken
    gesamt_minuten INT NOT NULL DEFAULT 0 COMMENT 'Gesamte Arbeitszeit in Minuten',
    anzahl_sessions INT NOT NULL DEFAULT 0 COMMENT 'Anzahl der Sessions',
    anzahl_gut INT NOT NULL DEFAULT 0 COMMENT 'Anzahl gut gelaufener Sessions',
    anzahl_schlecht INT NOT NULL DEFAULT 0 COMMENT 'Anzahl schlecht gelaufener Sessions',
    anzahl_abgebrochen INT NOT NULL DEFAULT 0 COMMENT 'Anzahl abgebrochener Sessions',
    
    -- Durchschnittswerte
    durchschnitt_dauer_min DECIMAL(5,2) NULL COMMENT 'Durchschnittliche Dauer pro Session',
    produktivitaet_prozent DECIMAL(5,2) NULL COMMENT 'Prozentsatz gut gelaufener Sessions',
    
    -- Kategorien
    planung_minuten INT NOT NULL DEFAULT 0,
    umsetzung_minuten INT NOT NULL DEFAULT 0,
    debug_minuten INT NOT NULL DEFAULT 0,
    dokumentation_minuten INT NOT NULL DEFAULT 0,
    testing_minuten INT NOT NULL DEFAULT 0,
    optimierung_minuten INT NOT NULL DEFAULT 0,
    meeting_minuten INT NOT NULL DEFAULT 0,
    sonstiges_minuten INT NOT NULL DEFAULT 0,
    
    -- Technische Felder
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_datum (datum),
    INDEX idx_datum (datum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tägliche aggregierte Statistiken';

-- =====================================================
-- Standard-Tags einfügen
-- =====================================================
INSERT IGNORE INTO work_tags (name, farbe) VALUES
('Next.js', '#000000'),
('React', '#61DAFB'),
('TypeScript', '#3178C6'),
('MySQL', '#4479A1'),
('API', '#FF6B6B'),
('UI/UX', '#4ECDC4'),
('Bugfix', '#FFE66D'),
('Performance', '#95E1D3'),
('Sicherheit', '#F38181'),
('Dokumentation', '#A8E6CF'),
('Testing', '#DCEDC8'),
('Deployment', '#FFD3B6'),
('Meeting', '#FFAAA5'),
('Planung', '#B8E6B8'),
('Optimierung', '#FFB7B2');

-- =====================================================
-- Trigger für automatische Dauer-Berechnung
-- =====================================================
DELIMITER //
CREATE TRIGGER IF NOT EXISTS calculate_duration_insert
BEFORE INSERT ON work_sessions
FOR EACH ROW
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        SET NEW.dauer_min = TIMESTAMPDIFF(MINUTE, NEW.start_time, NEW.end_time);
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS calculate_duration_update
BEFORE UPDATE ON work_sessions
FOR EACH ROW
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        SET NEW.dauer_min = TIMESTAMPDIFF(MINUTE, NEW.start_time, NEW.end_time);
    END IF;
END//
DELIMITER ;

-- =====================================================
-- Views für einfache Abfragen
-- =====================================================

-- View: Aktuelle Sessions (noch nicht beendet)
CREATE OR REPLACE VIEW v_aktuelle_sessions AS
SELECT 
    id,
    beschreibung,
    start_time,
    TIMESTAMPDIFF(MINUTE, start_time, NOW()) as laufzeit_min,
    kategorie,
    prioritaet,
    status
FROM work_sessions 
WHERE end_time IS NULL;

-- View: Tagesübersicht
CREATE OR REPLACE VIEW v_tagesuebersicht AS
SELECT 
    DATE(start_time) as datum,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    AVG(dauer_min) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    SUM(CASE WHEN status = 'abgebrochen' THEN 1 ELSE 0 END) as anzahl_abgebrochen
FROM work_sessions 
WHERE end_time IS NOT NULL
GROUP BY DATE(start_time)
ORDER BY datum DESC;

-- View: Kategorie-Statistiken
CREATE OR REPLACE VIEW v_kategorie_stats AS
SELECT 
    kategorie,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    AVG(dauer_min) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE end_time IS NOT NULL
GROUP BY kategorie
ORDER BY gesamt_minuten DESC;

-- View: Abrechenbare Zeiten (approved & !invoiced)
CREATE OR REPLACE VIEW v_billable_time AS
SELECT 
    ws.*,
    p.project_name,
    o.order_number,
    t.task_title,
    u.name as user_name
FROM work_sessions ws
LEFT JOIN lopez_projects p ON ws.project_id = p.id
LEFT JOIN lopez_orders o ON ws.order_id = o.id
LEFT JOIN lopez_tasks t ON ws.task_id = t.id
LEFT JOIN lopez_users u ON ws.user_id = u.id
WHERE ws.approved = 1 
  AND ws.invoiced = 0
  AND ws.status = 'completed'
  AND ws.end_time IS NOT NULL
ORDER BY ws.start_time DESC;

-- =====================================================
-- Beispiel-Daten für Tests
-- =====================================================

-- Beispiel-Sessions einfügen
INSERT INTO work_sessions (beschreibung, start_time, end_time, status, kategorie, prioritaet, bemerkung, ursache, lektion, naechster_schritt) VALUES
(
    'Next.js 15 Kompatibilitätsprobleme analysieren',
    '2025-01-19 09:00:00',
    '2025-01-19 10:30:00',
    'schlecht',
    'debug',
    'hoch',
    'Webpack-Cache-Fehler und Module-Import-Probleme identifiziert',
    'Next.js 15 hat breaking changes bei params.id - muss awaited werden',
    'Immer erst Tests mit neuer Version machen, bevor Migration',
    'Next.js 14 beibehalten bis alle Kompatibilitätsprobleme gelöst sind'
),
(
    'Zeiterfassung-System konzipieren',
    '2025-01-19 11:00:00',
    '2025-01-19 11:45:00',
    'gut',
    'planung',
    'mittel',
    'Klare Struktur für Lernsystem definiert - MySQL-Schema erstellt',
    NULL,
    'Strukturierte Planung spart später viel Zeit',
    'Schema implementieren und API-Endpoints erstellen'
),
(
    'MySQL-Datenbank-Schema erstellen',
    '2025-01-19 12:00:00',
    '2025-01-19 13:15:00',
    'gut',
    'umsetzung',
    'hoch',
    'Vollständiges Schema mit Triggers, Views und Beispiel-Daten erstellt',
    NULL,
    'Automatische Berechnungen mit Triggers sind sehr nützlich',
    'API-Integration implementieren'
);

-- =====================================================
-- Erfolgreich erstellt!
-- =====================================================
SELECT 'Datenbank-Schema erfolgreich erstellt!' as status; 
    '2025-01-19 10:30:00',
    'schlecht',
    'debug',
    'hoch',
    'Webpack-Cache-Fehler und Module-Import-Probleme identifiziert',
    'Next.js 15 hat breaking changes bei params.id - muss awaited werden',
    'Immer erst Tests mit neuer Version machen, bevor Migration',
    'Next.js 14 beibehalten bis alle Kompatibilitätsprobleme gelöst sind'
),
(
    'Zeiterfassung-System konzipieren',
    '2025-01-19 11:00:00',
    '2025-01-19 11:45:00',
    'gut',
    'planung',
    'mittel',
    'Klare Struktur für Lernsystem definiert - MySQL-Schema erstellt',
    NULL,
    'Strukturierte Planung spart später viel Zeit',
    'Schema implementieren und API-Endpoints erstellen'
),
(
    'MySQL-Datenbank-Schema erstellen',
    '2025-01-19 12:00:00',
    '2025-01-19 13:15:00',
    'gut',
    'umsetzung',
    'hoch',
    'Vollständiges Schema mit Triggers, Views und Beispiel-Daten erstellt',
    NULL,
    'Automatische Berechnungen mit Triggers sind sehr nützlich',
    'API-Integration implementieren'
);

-- =====================================================
-- Erfolgreich erstellt!
-- =====================================================
SELECT 'Datenbank-Schema erfolgreich erstellt!' as status; 