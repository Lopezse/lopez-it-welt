-- =====================================================
-- ENTERPRISE++ USERS SYSTEM - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-09-20
-- Zweck: Enterprise++ Benutzer & Sicherheit System
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- =====================================================
-- ENTERPRISE++ USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_enterprise_users (
    -- UUID Primary Key (nicht erratbar, sicher)
    id VARCHAR(36) PRIMARY KEY,
    
    -- Benutzer-Identifikation
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_external VARCHAR(255),
    email_internal VARCHAR(255),
    
    -- Personendaten
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    
    -- Enterprise++ Sicherheit
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    pepper VARCHAR(64) NOT NULL,
    
    -- Owner/Admin Kennzeichnung
    is_owner BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_employee BOOLEAN DEFAULT FALSE,
    is_customer BOOLEAN DEFAULT FALSE,
    
    -- 2FA & Sicherheit
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    backup_codes JSON,
    
    -- Status & Berechtigung
    status ENUM('active', 'inactive', 'locked', 'pending', 'suspended') DEFAULT 'pending',
    role VARCHAR(50) DEFAULT 'user',
    permissions JSON,
    
    -- Domain-Strategie
    domain_type ENUM('external', 'internal') DEFAULT 'internal',
    
    -- Audit & Compliance
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indizes für Performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_email_external (email_external),
    INDEX idx_email_internal (email_internal),
    INDEX idx_is_owner (is_owner),
    INDEX idx_is_admin (is_admin),
    INDEX idx_is_employee (is_employee),
    INDEX idx_is_customer (is_customer),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_domain_type (domain_type),
    INDEX idx_last_login (last_login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASSWORD HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_password_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USER SESSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT LOGS TABLE (erweitert)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    session_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    compliance_category ENUM('security', 'privacy', 'financial', 'operational') DEFAULT 'operational',
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES lopez_user_sessions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_severity (severity),
    INDEX idx_compliance_category (compliance_category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- RATE LIMITING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_rate_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL, -- IP, User ID, etc.
    action VARCHAR(100) NOT NULL,
    attempts INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_identifier_action (identifier, action),
    INDEX idx_identifier (identifier),
    INDEX idx_action (action),
    INDEX idx_window_start (window_start),
    INDEX idx_blocked_until (blocked_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ENTERPRISE++ ROLES & PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_enterprise_roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_system_role (is_system_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lopez_enterprise_permissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource_type VARCHAR(50),
    action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_resource_type (resource_type),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lopez_user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    assigned_by VARCHAR(36),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES lopez_enterprise_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ENTERPRISE++ SYSTEM ROLES
-- =====================================================

INSERT INTO lopez_enterprise_roles (id, name, description, is_system_role, permissions) VALUES
('owner-role-uuid', 'Owner', 'System Owner - Vollzugriff', TRUE, '["*"]'),
('admin-role-uuid', 'Admin', 'Administrator - Vollzugriff', TRUE, '["admin.*", "user.*", "customer.*"]'),
('employee-role-uuid', 'Employee', 'Mitarbeiter - Begrenzter Zugriff', TRUE, '["customer.read", "customer.update"]'),
('customer-role-uuid', 'Customer', 'Kunde - Eigenes Profil', TRUE, '["profile.read", "profile.update"]');

-- =====================================================
-- ENTERPRISE++ SYSTEM PERMISSIONS
-- =====================================================

INSERT INTO lopez_enterprise_permissions (id, name, description, resource_type, action) VALUES
('perm-all-uuid', '*', 'Alle Berechtigungen', 'all', 'all'),
('perm-admin-all-uuid', 'admin.*', 'Alle Admin-Berechtigungen', 'admin', 'all'),
('perm-user-all-uuid', 'user.*', 'Alle Benutzer-Berechtigungen', 'user', 'all'),
('perm-customer-all-uuid', 'customer.*', 'Alle Kunden-Berechtigungen', 'customer', 'all'),
('perm-profile-read-uuid', 'profile.read', 'Profil lesen', 'profile', 'read'),
('perm-profile-update-uuid', 'profile.update', 'Profil aktualisieren', 'profile', 'update'),
('perm-customer-read-uuid', 'customer.read', 'Kunden lesen', 'customer', 'read'),
('perm-customer-update-uuid', 'customer.update', 'Kunden aktualisieren', 'customer', 'update');













