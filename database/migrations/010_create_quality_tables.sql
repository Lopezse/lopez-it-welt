/**
 * Migration 010: Create Quality & Release Tables
 *
 * Erstellt die Tabellen für Quality Gates und Release-Management (E.5)
 *
 * Tabellen:
 * - release_checklists: Pre-Release Checklisten
 * - release_approvals: Versions-Freigaben
 * - quality_metrics: Qualitäts-Metriken
 * - quality_reports: Qualitäts-Berichte
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- 1. RELEASE_CHECKLISTS - Pre-Release Checklisten
-- =====================================================

CREATE TABLE IF NOT EXISTS release_checklists (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  checklist_name VARCHAR(255) NOT NULL COMMENT 'Name der Checkliste',
  version VARCHAR(50) NOT NULL COMMENT 'Version (z.B. "1.0.0")',
  items JSON NOT NULL COMMENT 'Checkliste-Items (JSON Array)',
  status ENUM('draft', 'in_progress', 'completed', 'approved') DEFAULT 'draft',
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  approved_by VARCHAR(36) DEFAULT NULL,
  approved_at TIMESTAMP NULL,

  INDEX idx_version (version),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Pre-Release Checklisten (E.5.1)';

-- =====================================================
-- 2. RELEASE_APPROVALS - Versions-Freigaben
-- =====================================================

CREATE TABLE IF NOT EXISTS release_approvals (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  version VARCHAR(50) NOT NULL COMMENT 'Version (z.B. "1.0.0")',
  checklist_id VARCHAR(36) DEFAULT NULL COMMENT 'Referenz zur release_checklists Tabelle',
  approval_status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  requested_by VARCHAR(36) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by VARCHAR(36) DEFAULT NULL,
  approved_at TIMESTAMP NULL,
  rejected_by VARCHAR(36) DEFAULT NULL,
  rejected_at TIMESTAMP NULL,
  rejection_reason TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,

  FOREIGN KEY (checklist_id) REFERENCES release_checklists(id) ON DELETE SET NULL,
  INDEX idx_version (version),
  INDEX idx_approval_status (approval_status),
  INDEX idx_requested_by (requested_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Versions-Freigaben (E.5.3)';

-- =====================================================
-- 3. QUALITY_METRICS - Qualitäts-Metriken
-- =====================================================

CREATE TABLE IF NOT EXISTS quality_metrics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  metric_name VARCHAR(100) NOT NULL COMMENT 'Name der Metrik (z.B. "test_coverage", "lint_errors")',
  metric_value DECIMAL(10, 2) NOT NULL COMMENT 'Wert der Metrik',
  metric_unit VARCHAR(50) DEFAULT NULL COMMENT 'Einheit (z.B. "%", "count")',
  target_value DECIMAL(10, 2) DEFAULT NULL COMMENT 'Zielwert',
  category VARCHAR(50) DEFAULT 'general' COMMENT 'Kategorie (z.B. "code", "test", "security")',
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version VARCHAR(50) DEFAULT NULL COMMENT 'Version, zu der die Metrik gehört',

  INDEX idx_metric_name (metric_name),
  INDEX idx_category (category),
  INDEX idx_measured_at (measured_at),
  INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Qualitäts-Metriken (E.5.2)';

-- =====================================================
-- 4. QUALITY_REPORTS - Qualitäts-Berichte
-- =====================================================

CREATE TABLE IF NOT EXISTS quality_reports (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  report_name VARCHAR(255) NOT NULL COMMENT 'Name des Berichts',
  report_type ENUM('daily', 'weekly', 'monthly', 'release', 'custom') DEFAULT 'custom',
  version VARCHAR(50) DEFAULT NULL COMMENT 'Version, zu der der Bericht gehört',
  metrics_summary JSON DEFAULT NULL COMMENT 'Zusammenfassung der Metriken (JSON)',
  status ENUM('draft', 'generated', 'published') DEFAULT 'draft',
  generated_by VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,

  INDEX idx_report_type (report_type),
  INDEX idx_version (version),
  INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Qualitäts-Berichte (E.5.2)';


