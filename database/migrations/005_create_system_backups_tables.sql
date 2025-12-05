/**
 * Migration 005: System Backups Tables
 * 
 * Erstellt die Tabellen für Backup-Management (E.1.2)
 * 
 * Tabellen:
 * - system_backups: Backup-Metadaten
 * - system_restores: Wiederherstellungs-Status
 * 
 * Enterprise++ Standard - GoBD-konform
 */

-- =====================================================
-- 1. SYSTEM_BACKUPS - Backup-Metadaten
-- =====================================================

CREATE TABLE IF NOT EXISTS system_backups (
  id VARCHAR(36) PRIMARY KEY,
  timestamp DATETIME NOT NULL,
  type ENUM('full', 'incremental', 'differential') NOT NULL DEFAULT 'full',
  size BIGINT DEFAULT 0 COMMENT 'Größe in Bytes',
  status ENUM('success', 'error', 'running', 'corrupted') NOT NULL DEFAULT 'running',
  duration INT DEFAULT NULL COMMENT 'Dauer in Sekunden',
  files INT DEFAULT 0 COMMENT 'Anzahl der Dateien',
  location VARCHAR(500) NOT NULL COMMENT 'Pfad zur Backup-Datei',
  description TEXT DEFAULT NULL,
  created_by VARCHAR(36) NOT NULL COMMENT 'User-ID des Erstellers',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_timestamp (timestamp),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System-Backups (E.1.2)';

-- =====================================================
-- 2. SYSTEM_RESTORES - Wiederherstellungs-Status
-- =====================================================

CREATE TABLE IF NOT EXISTS system_restores (
  id VARCHAR(36) PRIMARY KEY,
  backup_id VARCHAR(36) NOT NULL,
  timestamp DATETIME NOT NULL,
  status ENUM('success', 'error', 'running', 'cancelled') NOT NULL DEFAULT 'running',
  duration INT DEFAULT NULL COMMENT 'Dauer in Sekunden',
  target_location VARCHAR(500) DEFAULT NULL COMMENT 'Ziel-Verzeichnis (optional)',
  error_message TEXT DEFAULT NULL,
  created_by VARCHAR(36) NOT NULL COMMENT 'User-ID des Erstellers',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (backup_id) REFERENCES system_backups(id) ON DELETE CASCADE,
  INDEX idx_backup_id (backup_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System-Wiederherstellungen (E.1.2)';

-- =====================================================
-- 3. AUDIT-LOGS ERWEITERN (falls noch nicht vorhanden)
-- =====================================================

-- Die lopez_audit_logs Tabelle sollte bereits existieren
-- Falls nicht, wird sie hier nicht erstellt (sollte in separater Migration sein)

-- =====================================================
-- 4. INITIAL DATA (optional)
-- =====================================================

-- Keine Initial-Daten erforderlich

-- =====================================================
-- ENDE DER MIGRATION
-- =====================================================
