-- =====================================================
-- ENTERPRISE++ MONITORING SYSTEM - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-09-20
-- Zweck: Enterprise++ Monitoring & Alerting System
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- =====================================================
-- SYSTEM METRICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_system_metrics (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    cpu_usage DECIMAL(5,2) NOT NULL,
    memory_usage DECIMAL(5,2) NOT NULL,
    disk_usage DECIMAL(5,2) NOT NULL,
    network_usage DECIMAL(5,2) NOT NULL,
    active_users INT NOT NULL,
    total_requests INT NOT NULL,
    error_rate DECIMAL(5,2) NOT NULL,
    response_time DECIMAL(10,2) NOT NULL,
    database_connections INT NOT NULL,
    cache_hit_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_cpu_usage (cpu_usage),
    INDEX idx_memory_usage (memory_usage),
    INDEX idx_error_rate (error_rate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECURITY ALERTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_security_alerts (
    id VARCHAR(50) PRIMARY KEY,
    alert_type ENUM('failed_login', 'suspicious_activity', 'weak_password', 'unauthorized_access', 'data_breach', 'system_compromise') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    user_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    status ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(36),
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE METRICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_metrics (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    iso27001_score INT NOT NULL,
    gdpr_score INT NOT NULL,
    iso9001_score INT NOT NULL,
    overall_compliance INT NOT NULL,
    audit_findings INT NOT NULL,
    policy_violations INT NOT NULL,
    training_completion DECIMAL(5,2) NOT NULL,
    incident_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_overall_compliance (overall_compliance)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SYSTEM HEALTH TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_system_health (
    id VARCHAR(50) PRIMARY KEY,
    status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    overall_score INT NOT NULL,
    database_status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    api_status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    frontend_status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    email_status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    backup_status ENUM('healthy', 'warning', 'critical', 'down') NOT NULL,
    last_check TIMESTAMP NOT NULL,
    uptime DECIMAL(5,2) NOT NULL,
    response_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_last_check (last_check),
    INDEX idx_overall_score (overall_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ALERT RULES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_alert_rules (
    id VARCHAR(50) PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    rule_type ENUM('metric_threshold', 'event_pattern', 'anomaly_detection', 'compliance_violation') NOT NULL,
    metric_name VARCHAR(100),
    threshold_value DECIMAL(10,2),
    comparison_operator ENUM('>', '<', '>=', '<=', '=', '!=') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notification_channels JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_rule_type (rule_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_notifications (
    id VARCHAR(50) PRIMARY KEY,
    alert_id VARCHAR(50) NOT NULL,
    notification_type ENUM('email', 'sms', 'slack', 'webhook', 'dashboard') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (alert_id) REFERENCES lopez_security_alerts(id) ON DELETE CASCADE,
    INDEX idx_alert_id (alert_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PERFORMANCE LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_performance_logs (
    id VARCHAR(50) PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time DECIMAL(10,2) NOT NULL,
    status_code INT NOT NULL,
    user_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_size INT,
    response_size INT,
    database_queries INT,
    cache_hits INT,
    cache_misses INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    INDEX idx_endpoint (endpoint),
    INDEX idx_response_time (response_time),
    INDEX idx_status_code (status_code),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BACKUP LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_backup_logs (
    id VARCHAR(50) PRIMARY KEY,
    backup_type ENUM('full', 'incremental', 'differential') NOT NULL,
    status ENUM('started', 'in_progress', 'completed', 'failed', 'cancelled') NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    duration_seconds INT,
    error_message TEXT,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_backup_type (backup_type),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DEFAULT ALERT RULES
-- =====================================================

INSERT INTO lopez_alert_rules (id, rule_name, rule_type, metric_name, threshold_value, comparison_operator, severity, notification_channels) VALUES
('rule_cpu_high', 'High CPU Usage', 'metric_threshold', 'cpu_usage', 80.0, '>', 'high', '["email", "dashboard"]'),
('rule_memory_high', 'High Memory Usage', 'metric_threshold', 'memory_usage', 85.0, '>', 'high', '["email", "dashboard"]'),
('rule_disk_high', 'High Disk Usage', 'metric_threshold', 'disk_usage', 90.0, '>', 'critical', '["email", "sms", "dashboard"]'),
('rule_error_rate_high', 'High Error Rate', 'metric_threshold', 'error_rate', 5.0, '>', 'high', '["email", "dashboard"]'),
('rule_response_time_slow', 'Slow Response Time', 'metric_threshold', 'response_time', 2000.0, '>', 'medium', '["email", "dashboard"]'),
('rule_failed_logins', 'Multiple Failed Logins', 'event_pattern', 'failed_login', 5.0, '>=', 'high', '["email", "sms", "dashboard"]'),
('rule_compliance_low', 'Low Compliance Score', 'metric_threshold', 'overall_compliance', 70.0, '<', 'critical', '["email", "sms", "dashboard"]'),
('rule_backup_failed', 'Backup Failed', 'event_pattern', 'backup_failed', 1.0, '>=', 'critical', '["email", "sms", "dashboard"]');

-- =====================================================
-- CLEANUP PROCEDURES
-- =====================================================

-- Alte Metriken löschen (älter als 30 Tage)
CREATE EVENT IF NOT EXISTS cleanup_old_metrics
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM lopez_system_metrics WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Alte Performance Logs löschen (älter als 7 Tage)
CREATE EVENT IF NOT EXISTS cleanup_old_performance_logs
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM lopez_performance_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Alte Backup Logs löschen (älter als 90 Tage)
CREATE EVENT IF NOT EXISTS cleanup_old_backup_logs
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM lopez_backup_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);













