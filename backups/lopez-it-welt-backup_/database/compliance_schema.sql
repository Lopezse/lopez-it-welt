-- Compliance System Database Schema
-- SQLite Version für einfache Installation

-- Tabelle für Compliance-Regeln
CREATE TABLE IF NOT EXISTS compliance_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_name TEXT NOT NULL,
    rule_description TEXT,
    rule_category TEXT NOT NULL, -- 'DSGVO', 'GDPR', 'CCPA', etc.
    rule_type TEXT NOT NULL, -- 'REQUIRED', 'RECOMMENDED', 'OPTIONAL'
    rule_source TEXT, -- Quelle der Regel (z.B. 'DSGVO Art. 13')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für Website-Scans
CREATE TABLE IF NOT EXISTS website_scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_name TEXT NOT NULL,
    website_url TEXT,
    scan_type TEXT NOT NULL, -- 'DSGVO', 'FULL_COMPLIANCE', 'CUSTOM'
    scan_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    scan_result TEXT, -- JSON mit Ergebnissen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_by TEXT DEFAULT 'system'
);

-- Tabelle für Scan-Ergebnisse
CREATE TABLE IF NOT EXISTS scan_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_id INTEGER,
    rule_id INTEGER,
    status TEXT NOT NULL, -- 'PASS', 'FAIL', 'WARNING', 'INFO'
    details TEXT, -- JSON mit Details
    file_path TEXT, -- Pfad zur geprüften Datei
    line_number INTEGER, -- Zeilennummer falls relevant
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES website_scans(id),
    FOREIGN KEY (rule_id) REFERENCES compliance_rules(id)
);

-- Tabelle für Compliance-Agenten
CREATE TABLE IF NOT EXISTS compliance_agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_name TEXT NOT NULL,
    agent_type TEXT NOT NULL, -- 'DSGVO_SCANNER', 'CODE_ANALYZER', 'CONTENT_CHECKER'
    agent_config TEXT, -- JSON Konfiguration
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für Agent-Aktivitäten
CREATE TABLE IF NOT EXISTS agent_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER,
    scan_id INTEGER,
    activity_type TEXT NOT NULL, -- 'STARTED', 'PROCESSING', 'COMPLETED', 'ERROR'
    activity_details TEXT, -- JSON mit Details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES compliance_agents(id),
    FOREIGN KEY (scan_id) REFERENCES website_scans(id)
);

-- Standard DSGVO-Regeln einfügen
INSERT OR IGNORE INTO compliance_rules (rule_name, rule_description, rule_category, rule_type, rule_source) VALUES
('Cookie-Consent', 'Website muss Cookie-Consent-Banner haben', 'DSGVO', 'REQUIRED', 'DSGVO Art. 7'),
('Datenschutzerklärung', 'Datenschutzerklärung muss vorhanden und erreichbar sein', 'DSGVO', 'REQUIRED', 'DSGVO Art. 13'),
('Impressum', 'Impressum muss vorhanden und vollständig sein', 'DSGVO', 'REQUIRED', 'TMG §5'),
('SSL-Verschlüsselung', 'Website muss HTTPS verwenden', 'DSGVO', 'REQUIRED', 'DSGVO Art. 32'),
('Kontaktformular-Datenschutz', 'Kontaktformular muss Datenschutzhinweise haben', 'DSGVO', 'REQUIRED', 'DSGVO Art. 13'),
('Tracking-Code-Dokumentation', 'Tracking-Codes müssen dokumentiert sein', 'DSGVO', 'RECOMMENDED', 'DSGVO Art. 13'),
('Opt-Out-Mechanismus', 'Opt-Out für Marketing-Cookies muss vorhanden sein', 'DSGVO', 'REQUIRED', 'DSGVO Art. 21');

-- Standard Compliance-Agenten einfügen
INSERT OR IGNORE INTO compliance_agents (agent_name, agent_type, agent_config) VALUES
('DSGVO-Scanner', 'DSGVO_SCANNER', '{"scan_files": [".md", ".html", ".tsx", ".jsx"], "rules": ["DSGVO"]}'),
('Code-Analyzer', 'CODE_ANALYZER', '{"languages": ["typescript", "javascript", "html"], "patterns": ["cookie", "tracking", "analytics"]}'),
('Content-Checker', 'CONTENT_CHECKER', '{"required_pages": ["datenschutz", "impressum", "cookie"], "keywords": ["datenschutz", "dsgvo", "cookie"]}'); 