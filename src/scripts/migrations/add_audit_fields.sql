-- =====================================================
-- MIGRATION: Audit-Modus Felder für dev_tasks
-- Datum: 2025-12-06
-- =====================================================

-- Quality Score (0-100)
ALTER TABLE dev_tasks 
ADD COLUMN quality_score INT DEFAULT NULL;

-- Audit Status
ALTER TABLE dev_tasks 
ADD COLUMN audit_status ENUM('pending', 'passed', 'failed') DEFAULT 'pending';

-- Settings Tabelle für Audit-Mode (falls nicht existiert)
CREATE TABLE IF NOT EXISTS lopez_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'boolean', 'number', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit-Mode Setting einfügen
INSERT INTO lopez_settings (setting_key, setting_value, setting_type, description)
VALUES ('audit_mode', 'true', 'boolean', 'Enterprise++ Audit-Modus: Tasks benötigen Quality Gate >= 70')
ON DUPLICATE KEY UPDATE setting_value = 'true';



