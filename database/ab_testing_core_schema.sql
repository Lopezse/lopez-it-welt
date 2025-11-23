-- =====================================================
-- A/B TESTING CORE - ENTERPRISE++ SCHEMA
-- Datum: 2025-10-31 14:48:50
-- Zweck: Vollständiges A/B-Testing-System nach Enterprise++ Standards
-- =====================================================

-- Haupttabelle: Experimente
CREATE TABLE IF NOT EXISTS ab_experiments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  goal VARCHAR(255),
  status ENUM('draft','running','paused','completed') DEFAULT 'draft',
  split_a TINYINT DEFAULT 50,
  auto_winner_days INT DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varianten-Tabelle
CREATE TABLE IF NOT EXISTS ab_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  experiment_id INT NOT NULL,
  variant_key CHAR(1) NOT NULL,  -- A, B, C ...
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE,
  UNIQUE KEY unique_experiment_variant (experiment_id, variant_key),
  INDEX idx_experiment (experiment_id),
  INDEX idx_variant (variant_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ereignisse (Log)
CREATE TABLE IF NOT EXISTS ab_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  experiment_id INT,
  variant_key CHAR(1),
  event_type ENUM('view','click','conversion') NOT NULL,
  user_hash VARCHAR(64),
  device_type VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_experiment (experiment_id),
  INDEX idx_variant (variant_key),
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user (user_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Globale Konfiguration
CREATE TABLE IF NOT EXISTS ab_config (
  id TINYINT PRIMARY KEY DEFAULT 1,
  ab_active TINYINT(1) DEFAULT 0,
  default_split TINYINT DEFAULT 50,
  auto_winner_enabled TINYINT(1) DEFAULT 0,
  auto_winner_threshold INT DEFAULT 1000,
  auto_winner_days INT DEFAULT 7,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initiale Konfiguration einfügen
INSERT INTO ab_config (id, ab_active, default_split, auto_winner_enabled, auto_winner_threshold, auto_winner_days)
VALUES (1, 0, 50, 0, 1000, 7)
ON DUPLICATE KEY UPDATE
  ab_active = 0,
  default_split = 50,
  auto_winner_enabled = 0,
  auto_winner_threshold = 1000,
  auto_winner_days = 7;

-- Beispiel-Experiment erstellen (optional)
-- Hero-Section A/B-Test
INSERT INTO ab_experiments (name, description, goal, status, split_a, start_date)
VALUES (
  'Hero-Section A/B-Test',
  'Testet verschiedene Hero-Texte für bessere Conversion',
  'Erhöhung der Click-Through-Rate um 10%',
  'draft',
  50,
  NULL
);

-- Beispiel-Varianten (nur wenn Experiment erstellt wurde)
-- Variante A (Standard)
INSERT INTO ab_variants (experiment_id, variant_key, title, subtitle, description, button_text, button_link)
SELECT 1, 'A', 'Lopez IT Welt', 'Professionelle IT-Lösungen', 
  'Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.',
  'Jetzt beraten lassen', '/kontakt'
WHERE EXISTS (SELECT 1 FROM ab_experiments WHERE id = 1);

-- Variante B (Alternative)
INSERT INTO ab_variants (experiment_id, variant_key, title, subtitle, description, button_text, button_link)
SELECT 1, 'B', 'Individuelle IT-Lösungen – persönlich, sicher und barrierefrei',
  'Moderne Software für KMU: zugänglich, zuverlässig und in Deutschland entwickelt.',
  'Wir bieten maßgeschneiderte IT-Lösungen mit Fokus auf Barrierefreiheit, Sicherheit und persönliche Betreuung.',
  'Kostenlose Beratung', '/kontakt'
WHERE EXISTS (SELECT 1 FROM ab_experiments WHERE id = 1);


