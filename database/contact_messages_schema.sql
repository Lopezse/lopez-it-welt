-- =====================================================
-- Kontakt-Nachrichten Admin-Integration
-- =====================================================
-- Erstellt: 2025-09-15
-- Zweck: Kontaktformular-Nachrichten im Admin verwalten
-- =====================================================

-- Tabelle für Kontakt-Nachrichten
CREATE TABLE lopez_support_contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    company VARCHAR(255) NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('neu', 'in_bearbeitung', 'erledigt', 'archiviert') DEFAULT 'neu',
    priority ENUM('niedrig', 'normal', 'hoch', 'dringend') DEFAULT 'normal',
    assigned_to VARCHAR(36) NULL,
    response_message TEXT NULL,
    response_sent_at TIMESTAMP NULL,
    response_sent_by VARCHAR(36) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    referrer VARCHAR(500) NULL,
    is_spam BOOLEAN DEFAULT FALSE,
    spam_score DECIMAL(3,2) DEFAULT 0.00,
    tags JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36) DEFAULT 'system',
    
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_is_spam (is_spam)
);

-- Tabelle für Nachrichten-Anhänge (falls später benötigt)
CREATE TABLE lopez_support_contact_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES lopez_support_contact_messages(id) ON DELETE CASCADE,
    INDEX idx_message (message_id)
);

-- Tabelle für Nachrichten-Kommentare (interne Notizen)
CREATE TABLE lopez_support_contact_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    
    FOREIGN KEY (message_id) REFERENCES lopez_support_contact_messages(id) ON DELETE CASCADE,
    INDEX idx_message (message_id),
    INDEX idx_created_at (created_at)
);

-- View für Admin-Dashboard (Anzahl neuer Nachrichten)
CREATE VIEW v_contact_messages_stats AS
SELECT 
    COUNT(*) as total_messages,
    COUNT(CASE WHEN status = 'neu' THEN 1 END) as new_messages,
    COUNT(CASE WHEN status = 'in_bearbeitung' THEN 1 END) as in_progress_messages,
    COUNT(CASE WHEN status = 'erledigt' THEN 1 END) as completed_messages,
    COUNT(CASE WHEN is_spam = TRUE THEN 1 END) as spam_messages,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as messages_last_24h,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as messages_last_7d
FROM lopez_support_contact_messages;

-- View für Admin-Liste (optimiert für Performance)
CREATE VIEW v_contact_messages_admin AS
SELECT 
    id,
    name,
    email,
    subject,
    LEFT(message, 100) as message_preview,
    status,
    priority,
    assigned_to,
    response_sent_at,
    is_spam,
    created_at,
    updated_at
FROM lopez_support_contact_messages
WHERE is_spam = FALSE
ORDER BY created_at DESC;

-- Trigger für automatische Status-Updates
DELIMITER //
CREATE TRIGGER tr_contact_messages_status_update
BEFORE UPDATE ON lopez_support_contact_messages
FOR EACH ROW
BEGIN
    -- Wenn Status auf 'erledigt' gesetzt wird, setze updated_at
    IF NEW.status = 'erledigt' AND OLD.status != 'erledigt' THEN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    -- Wenn Response gesendet wird, setze response_sent_at
    IF NEW.response_message IS NOT NULL AND OLD.response_message IS NULL THEN
        SET NEW.response_sent_at = CURRENT_TIMESTAMP;
    END IF;
END//
DELIMITER ;

-- Beispiel-Daten für Testing (optional)
INSERT INTO lopez_support_contact_messages 
(name, email, subject, message, status, priority, created_by) VALUES
('Max Mustermann', 'max@example.com', 'Allgemeine Anfrage', 'Hallo, ich interessiere mich für Ihre IT-Dienstleistungen.', 'neu', 'normal', 'system'),
('Anna Schmidt', 'anna@firma.de', 'Projektanfrage', 'Wir benötigen Unterstützung bei unserem Webprojekt.', 'neu', 'hoch', 'system'),
('Peter Weber', 'peter@test.de', 'Support-Anfrage', 'Hilfe bei der Einrichtung unseres Systems.', 'in_bearbeitung', 'normal', 'system');


