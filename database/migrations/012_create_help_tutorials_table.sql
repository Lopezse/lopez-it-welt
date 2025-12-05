/**
 * Migration 012: Help Tutorials Table
 *
 * Erstellt die Tabelle für Tutorials im Help-System
 *
 * Tabellen:
 * - help_tutorials: Tutorials mit Schritten
 * - help_tutorial_steps: Einzelne Schritte eines Tutorials
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- 1. HELP_TUTORIALS - Tutorials
-- =====================================================

CREATE TABLE IF NOT EXISTS help_tutorials (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT 'Titel des Tutorials',
  description TEXT DEFAULT NULL COMMENT 'Beschreibung',
  category VARCHAR(100) DEFAULT NULL COMMENT 'Kategorie (z.B. "getting-started", "roles", "dashboard")',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_order_index (order_index),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Help Tutorials';

-- =====================================================
-- 2. HELP_TUTORIAL_STEPS - Tutorial-Schritte
-- =====================================================

CREATE TABLE IF NOT EXISTS help_tutorial_steps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tutorial_id BIGINT NOT NULL COMMENT 'Zugehöriges Tutorial',
  title VARCHAR(255) NOT NULL COMMENT 'Titel des Schritts',
  description TEXT DEFAULT NULL COMMENT 'Beschreibung des Schritts',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (tutorial_id) REFERENCES help_tutorials(id) ON DELETE CASCADE,
  INDEX idx_tutorial_id (tutorial_id),
  INDEX idx_order_index (order_index),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Help Tutorial Steps';

-- =====================================================
-- 3. HELP_TUTORIAL_PROGRESS - Tutorial-Fortschritt (optional)
-- =====================================================

CREATE TABLE IF NOT EXISTS help_tutorial_progress (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL COMMENT 'Benutzer-ID',
  tutorial_id BIGINT NOT NULL COMMENT 'Tutorial-ID',
  step_id BIGINT DEFAULT NULL COMMENT 'Aktueller Schritt (optional)',
  completed BOOLEAN DEFAULT FALSE COMMENT 'Tutorial abgeschlossen',
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (tutorial_id) REFERENCES help_tutorials(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES help_tutorial_steps(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_tutorial (user_id, tutorial_id),
  INDEX idx_user_id (user_id),
  INDEX idx_tutorial_id (tutorial_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Help Tutorial Progress';

-- =====================================================
-- 4. INITIAL DATA - Standard-Tutorials einfügen
-- =====================================================

-- Tutorial 1: Erste Schritte
INSERT INTO help_tutorials (title, description, category, order_index) VALUES
('Erste Schritte im Admin-Bereich', 'Lernen Sie die Grundlagen des Admin-Bereichs kennen', 'getting-started', 1);

SET @tutorial1_id = LAST_INSERT_ID();

INSERT INTO help_tutorial_steps (tutorial_id, title, description, order_index) VALUES
(@tutorial1_id, 'Dashboard erkunden', 'Machen Sie sich mit dem Dashboard vertraut', 1),
(@tutorial1_id, 'Benutzer verwalten', 'Erstellen Sie Ihren ersten Benutzer', 2),
(@tutorial1_id, 'Rollen zuweisen', 'Weisen Sie Benutzern Rollen zu', 3);

-- Tutorial 2: Rollen und Berechtigungen
INSERT INTO help_tutorials (title, description, category, order_index) VALUES
('Rollen und Berechtigungen', 'Verstehen Sie das RBAC-System', 'roles', 2);

SET @tutorial2_id = LAST_INSERT_ID();

INSERT INTO help_tutorial_steps (tutorial_id, title, description, order_index) VALUES
(@tutorial2_id, 'Rolle erstellen', 'Erstellen Sie eine neue Rolle', 1),
(@tutorial2_id, 'Berechtigungen zuweisen', 'Weisen Sie Berechtigungen zu', 2);

-- Tutorial 3: Dashboard konfigurieren
INSERT INTO help_tutorials (title, description, category, order_index) VALUES
('Dashboard konfigurieren', 'Passen Sie Ihr Dashboard an', 'dashboard', 3);

SET @tutorial3_id = LAST_INSERT_ID();

INSERT INTO help_tutorial_steps (tutorial_id, title, description, order_index) VALUES
(@tutorial3_id, 'Widget hinzufügen', 'Fügen Sie ein Widget hinzu', 1),
(@tutorial3_id, 'Layout anpassen', 'Passen Sie das Layout an', 2);


