/**
 * Migration 007: User Profile History Table
 *
 * Erstellt die Tabelle für Profil-Versionshistorie (E.4.2)
 *
 * Tabellen:
 * - user_profile_history: Historie der Profil-Änderungen
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- USER_PROFILE_HISTORY - Profil-Versionshistorie
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profile_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL COMMENT 'Benutzer-ID',
  username VARCHAR(50) NOT NULL COMMENT 'Benutzername zum Zeitpunkt der Änderung',
  email VARCHAR(255) NOT NULL COMMENT 'E-Mail zum Zeitpunkt der Änderung',
  first_name VARCHAR(100) DEFAULT NULL,
  last_name VARCHAR(100) DEFAULT NULL,
  display_name VARCHAR(200) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  postal_code VARCHAR(20) DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  status VARCHAR(50) NOT NULL COMMENT 'Status zum Zeitpunkt der Änderung',
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Zeitpunkt der Änderung',
  changed_by VARCHAR(100) NOT NULL COMMENT 'Wer hat die Änderung vorgenommen (User-ID oder "system")',

  INDEX idx_user_id (user_id),
  INDEX idx_changed_at (changed_at),
  INDEX idx_changed_by (changed_by),
  FOREIGN KEY (user_id) REFERENCES lopez_core_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User Profile History (E.4.2)';


