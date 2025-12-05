/**
 * Migration 008: Dashboard Tables
 *
 * Erstellt die Tabellen für Dashboard-Widgets und -Konfigurationen (E.4.3)
 *
 * Tabellen:
 * - dashboard_widgets: Verfügbare Widgets
 * - dashboard_configs: Dashboard-Konfigurationen pro Rolle
 * - dashboard_widget_assignments: Widget-Zuweisungen zu Dashboards
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- 1. DASHBOARD_WIDGETS - Verfügbare Widgets
-- =====================================================

CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'Widget-Name',
  type ENUM('kpi', 'chart', 'list', 'status', 'custom') NOT NULL COMMENT 'Widget-Typ',
  description TEXT DEFAULT NULL,
  config JSON DEFAULT NULL COMMENT 'Widget-Konfiguration im JSON-Format',
  is_system_widget BOOLEAN DEFAULT FALSE COMMENT 'System-Widget (kann nicht gelöscht werden)',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_type (type),
  INDEX idx_is_active (is_active),
  INDEX idx_is_system_widget (is_system_widget)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Dashboard Widgets (E.4.3)';

-- =====================================================
-- 2. DASHBOARD_CONFIGS - Dashboard-Konfigurationen pro Rolle
-- =====================================================

CREATE TABLE IF NOT EXISTS dashboard_configs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL COMMENT 'Rollen-ID',
  config_name VARCHAR(255) NOT NULL COMMENT 'Konfigurations-Name',
  layout JSON DEFAULT NULL COMMENT 'Layout-Konfiguration im JSON-Format',
  is_default BOOLEAN DEFAULT FALSE COMMENT 'Standard-Konfiguration für diese Rolle',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (role_id) REFERENCES lopez_core_roles(id) ON DELETE CASCADE,
  INDEX idx_role_id (role_id),
  INDEX idx_is_default (is_default),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Dashboard Configs (E.4.3)';

-- =====================================================
-- 3. DASHBOARD_WIDGET_ASSIGNMENTS - Widget-Zuweisungen zu Dashboards
-- =====================================================

CREATE TABLE IF NOT EXISTS dashboard_widget_assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dashboard_config_id BIGINT NOT NULL COMMENT 'Dashboard-Konfigurations-ID',
  widget_id BIGINT NOT NULL COMMENT 'Widget-ID',
  position_x INT DEFAULT 0 COMMENT 'X-Position im Grid',
  position_y INT DEFAULT 0 COMMENT 'Y-Position im Grid',
  width INT DEFAULT 1 COMMENT 'Breite im Grid',
  height INT DEFAULT 1 COMMENT 'Höhe im Grid',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (dashboard_config_id) REFERENCES dashboard_configs(id) ON DELETE CASCADE,
  FOREIGN KEY (widget_id) REFERENCES dashboard_widgets(id) ON DELETE CASCADE,
  INDEX idx_dashboard_config_id (dashboard_config_id),
  INDEX idx_widget_id (widget_id),
  INDEX idx_order_index (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Dashboard Widget Assignments (E.4.3)';


