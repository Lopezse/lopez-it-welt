/**
 * Migration 010: Create Release Tables
 *
 * Erstellt die Tabellen für Release-Management (E.5)
 *
 * Tabellen:
 * - release_checklists: Pre-Release Checklisten
 * - release_approvals: Versions-Freigaben
 * - quality_metrics: Qualitäts-Metriken
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- 1. RELEASE_CHECKLISTS - Pre-Release Checklisten
-- =====================================================

CREATE TABLE IF NOT EXISTS release_checklists (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  version VARCHAR(50) NOT NULL COMMENT 'Versionsnummer (z.B. "1.0.0")',
  checklist_name VARCHAR(200) NOT NULL COMMENT 'Name der Checkliste',
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
COMMENT='Pre-Release Checklisten (E.5)';

-- =====================================================
-- 2. RELEASE_APPROVALS - Versions-Freigaben
-- =====================================================

CREATE TABLE IF NOT EXISTS release_approvals (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  version VARCHAR(50) NOT NULL COMMENT 'Versionsnummer',
  checklist_id VARCHAR(36) DEFAULT NULL COMMENT 'Referenz zur release_checklists Tabelle',
  approval_type ENUM('technical', 'business', 'security', 'compliance', 'final') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approver_id VARCHAR(36) NOT NULL COMMENT 'User-ID des Freigebers',
  comments TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  rejected_at TIMESTAMP NULL,

  FOREIGN KEY (checklist_id) REFERENCES release_checklists(id) ON DELETE SET NULL,
  INDEX idx_version (version),
  INDEX idx_status (status),
  INDEX idx_approver_id (approver_id),
  INDEX idx_approval_type (approval_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Versions-Freigaben (E.5)';

-- =====================================================
-- 3. QUALITY_METRICS - Qualitäts-Metriken
-- =====================================================

CREATE TABLE IF NOT EXISTS quality_metrics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  metric_type VARCHAR(100) NOT NULL COMMENT 'Typ der Metrik (z.B. test_coverage, lint_errors, type_errors)',
  metric_value DECIMAL(10, 2) NOT NULL COMMENT 'Wert der Metrik',
  metric_unit VARCHAR(50) DEFAULT NULL COMMENT 'Einheit (z.B. "percent", "count")',
  target_value DECIMAL(10, 2) DEFAULT NULL COMMENT 'Zielwert',
  status ENUM('pass', 'warning', 'fail') DEFAULT 'pass',
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version VARCHAR(50) DEFAULT NULL COMMENT 'Versionsnummer (optional)',
  metadata JSON DEFAULT NULL COMMENT 'Zusätzliche Metadaten',

  INDEX idx_metric_type (metric_type),
  INDEX idx_status (status),
  INDEX idx_measured_at (measured_at),
  INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Qualitäts-Metriken (E.5)';

