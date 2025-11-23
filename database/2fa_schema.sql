-- =====================================================
-- 2FA SCHEMA FÜR LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: Zwei-Faktor-Authentifizierung (Aegis-kompatibel)
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_erp;

-- 2FA-Tabelle für Benutzer erweitern
ALTER TABLE lopez_core_users 
ADD COLUMN IF NOT EXISTS two_fa_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_fa_secret VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS two_fa_backup_codes JSON NULL,
ADD COLUMN IF NOT EXISTS two_fa_setup_at TIMESTAMP NULL;

-- 2FA-Setup-Tabelle für temporäre QR-Codes
CREATE TABLE IF NOT EXISTS lopez_core_2fa_setup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    qr_code_url TEXT NOT NULL,
    backup_codes JSON NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_core_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_used (is_used)
);

-- 2FA-Log-Tabelle für Sicherheits-Audit
CREATE TABLE IF NOT EXISTS lopez_core_2fa_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action ENUM('setup', 'verify', 'backup_used', 'disabled') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_core_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_success (success),
    INDEX idx_created_at (created_at)
);

-- Standard-Rollen einfügen falls nicht vorhanden
INSERT IGNORE INTO lopez_core_roles (name, description, is_system_role) VALUES
('admin', 'System-Administrator mit Vollzugriff', TRUE),
('editor', 'Content-Editor mit Bearbeitungsrechten', TRUE),
('viewer', 'Nur-Lese-Zugriff für Betrachter', TRUE);

-- Test-Admin-Benutzer erstellen (Passwort: admin123)
INSERT IGNORE INTO lopez_core_users (email, password_hash, first_name, last_name, role_id, two_fa_enabled) VALUES
('admin@lopez-it-welt.de', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzKz2W', 'Lopez', 'Admin', 1, FALSE);

-- Schema erfolgreich erstellt
SELECT '2FA-Schema erfolgreich erstellt!' as status;

