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
    resolution_notes TEXT,
    
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
    standard_name VARCHAR(100) NOT NULL,
    compliance_score DECIMAL(5,2) NOT NULL,
    total_requirements INT NOT NULL,
    met_requirements INT NOT NULL,
    pending_requirements INT NOT NULL,
    failed_requirements INT NOT NULL,
    last_audit_date TIMESTAMP NULL,
    next_audit_date TIMESTAMP NULL,
    audit_status ENUM('scheduled', 'in_progress', 'completed', 'overdue') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_standard_name (standard_name),
    INDEX idx_compliance_score (compliance_score),
    INDEX idx_audit_status (audit_status),
    INDEX idx_next_audit_date (next_audit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ALERT RULES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_alert_rules (
    id VARCHAR(50) PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    metric_type ENUM('cpu', 'memory', 'disk', 'network', 'error_rate', 'response_time', 'security', 'compliance') NOT NULL,
    threshold_value DECIMAL(10,2) NOT NULL,
    comparison_operator ENUM('>', '<', '>=', '<=', '=', '!=') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notification_channels JSON,
    cooldown_minutes INT DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_metric_type (metric_type),
    INDEX idx_is_active (is_active),
    INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_notifications (
    id VARCHAR(50) PRIMARY KEY,
    alert_id VARCHAR(50),
    notification_type ENUM('email', 'sms', 'slack', 'webhook') NOT NULL,
    recipient VARCHAR(200) NOT NULL,
    subject VARCHAR(300),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    failure_reason TEXT,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_alert_id (alert_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- System Metrics Sample Data
INSERT INTO lopez_system_metrics (id, timestamp, cpu_usage, memory_usage, disk_usage, network_usage, active_users, total_requests, error_rate, response_time, database_connections, cache_hit_rate) VALUES
('sys_001', NOW(), 45.2, 67.8, 23.1, 12.5, 15, 1250, 2.3, 145.67, 8, 89.2),
('sys_002', DATE_SUB(NOW(), INTERVAL 1 HOUR), 52.1, 71.3, 24.8, 15.2, 18, 1380, 1.8, 132.45, 9, 91.5),
('sys_003', DATE_SUB(NOW(), INTERVAL 2 HOUR), 38.7, 64.2, 22.9, 11.8, 12, 1120, 3.1, 158.23, 7, 87.8);

-- Security Alerts Sample Data
INSERT INTO lopez_security_alerts (id, alert_type, severity, title, description, user_id, ip_address, status) VALUES
('alert_001', 'failed_login', 'medium', 'Multiple Failed Login Attempts', 'User attempted to login 5 times with incorrect password', 'user_123', '192.168.1.100', 'open'),
('alert_002', 'suspicious_activity', 'high', 'Unusual Access Pattern', 'User accessed system from multiple locations within short time', 'user_456', '10.0.0.50', 'investigating'),
('alert_003', 'weak_password', 'low', 'Weak Password Detected', 'User has a password that does not meet security requirements', 'user_789', '172.16.0.25', 'resolved');

-- Compliance Metrics Sample Data
INSERT INTO lopez_compliance_metrics (id, standard_name, compliance_score, total_requirements, met_requirements, pending_requirements, failed_requirements, last_audit_date, next_audit_date, audit_status) VALUES
('comp_001', 'ISO 27001', 87.5, 100, 87, 10, 3, '2025-08-15 10:00:00', '2025-12-15 10:00:00', 'scheduled'),
('comp_002', 'DSGVO', 92.3, 50, 46, 3, 1, '2025-09-01 14:30:00', '2025-11-01 14:30:00', 'scheduled'),
('comp_003', 'ISO 9001', 95.0, 80, 76, 4, 0, '2025-07-20 09:15:00', '2025-10-20 09:15:00', 'scheduled');

-- Alert Rules Sample Data
INSERT INTO lopez_alert_rules (id, rule_name, description, metric_type, threshold_value, comparison_operator, severity, notification_channels) VALUES
('rule_001', 'High CPU Usage', 'Alert when CPU usage exceeds 80%', 'cpu', 80.0, '>', 'high', '["email", "slack"]'),
('rule_002', 'Low Memory', 'Alert when available memory drops below 20%', 'memory', 20.0, '<', 'critical', '["email", "sms", "slack"]'),
('rule_003', 'High Error Rate', 'Alert when error rate exceeds 5%', 'error_rate', 5.0, '>', 'medium', '["email", "slack"]');

-- Notifications Sample Data
INSERT INTO lopez_notifications (id, alert_id, notification_type, recipient, subject, message, status, sent_at) VALUES
('notif_001', 'alert_001', 'email', 'admin@lopez-it-welt.de', 'Security Alert: Failed Login Attempts', 'Multiple failed login attempts detected for user user_123', 'sent', NOW()),
('notif_002', 'alert_002', 'slack', '#security-alerts', 'High Severity Alert', 'Suspicious activity detected from user user_456', 'sent', NOW()),
('notif_003', 'alert_003', 'email', 'admin@lopez-it-welt.de', 'Password Security Alert', 'Weak password detected for user user_789', 'delivered', NOW());

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Enterprise++ Monitoring System erfolgreich erstellt!' as status;












