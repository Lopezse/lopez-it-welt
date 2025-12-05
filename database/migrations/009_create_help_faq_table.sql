/**
 * Migration 009: Help FAQ Table
 *
 * Erstellt die Tabelle für FAQ-Einträge (E.4.5)
 *
 * Tabellen:
 * - help_faq: FAQ-Einträge
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- HELP_FAQ - FAQ-Einträge
-- =====================================================

CREATE TABLE IF NOT EXISTS help_faq (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL COMMENT 'Frage',
  answer TEXT NOT NULL COMMENT 'Antwort',
  category VARCHAR(100) DEFAULT 'general' COMMENT 'Kategorie (z.B. roles, users, dashboard)',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_order_index (order_index),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Help FAQ (E.4.5)';


