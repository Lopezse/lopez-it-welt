-- =====================================================
-- ENTERPRISE++ CERTIFICATION SYSTEM - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-09-20
-- Zweck: Enterprise++ Zertifizierungs-Management (ISO 27001, DSGVO, etc.)
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- =====================================================
-- CERTIFICATION STANDARDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_certification_standards (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    version VARCHAR(20) NOT NULL,
    status ENUM('planned', 'in_progress', 'certified', 'expired', 'suspended') DEFAULT 'planned',
    certification_date DATE NULL,
    expiry_date DATE NULL,
    auditor VARCHAR(100),
    certificate_number VARCHAR(100),
    compliance_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_certification_date (certification_date),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CERTIFICATION REQUIREMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_certification_requirements (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    requirement VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('not_implemented', 'partially_implemented', 'fully_implemented', 'verified') DEFAULT 'not_implemented',
    evidence JSON,
    notes TEXT,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    INDEX idx_standard_id (standard_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE AUDITS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_audits (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    audit_date DATE NOT NULL,
    auditor VARCHAR(100) NOT NULL,
    overall_score INT NOT NULL,
    status ENUM('passed', 'failed', 'conditional_pass', 'pending') DEFAULT 'pending',
    recommendations JSON,
    next_audit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    INDEX idx_standard_id (standard_id),
    INDEX idx_audit_date (audit_date),
    INDEX idx_status (status),
    INDEX idx_next_audit_date (next_audit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT FINDINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_audit_findings (
    id VARCHAR(50) PRIMARY KEY,
    audit_id VARCHAR(50) NOT NULL,
    requirement_id VARCHAR(50) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    finding TEXT NOT NULL,
    evidence JSON,
    recommendation TEXT,
    status ENUM('open', 'in_progress', 'resolved', 'accepted_risk') DEFAULT 'open',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (audit_id) REFERENCES lopez_compliance_audits(id) ON DELETE CASCADE,
    FOREIGN KEY (requirement_id) REFERENCES lopez_certification_requirements(id) ON DELETE CASCADE,
    INDEX idx_audit_id (audit_id),
    INDEX idx_requirement_id (requirement_id),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE EVIDENCE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_evidence (
    id VARCHAR(50) PRIMARY KEY,
    requirement_id VARCHAR(50) NOT NULL,
    evidence_type ENUM('document', 'screenshot', 'log', 'test_result', 'interview', 'other') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    uploaded_by VARCHAR(36),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (requirement_id) REFERENCES lopez_certification_requirements(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    INDEX idx_requirement_id (requirement_id),
    INDEX idx_evidence_type (evidence_type),
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE POLICIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_policies (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    policy_name VARCHAR(200) NOT NULL,
    policy_type ENUM('security', 'privacy', 'data_protection', 'incident_response', 'business_continuity') NOT NULL,
    version VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('draft', 'review', 'approved', 'active', 'archived') DEFAULT 'draft',
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    effective_date DATE,
    review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    INDEX idx_standard_id (standard_id),
    INDEX idx_policy_type (policy_type),
    INDEX idx_status (status),
    INDEX idx_effective_date (effective_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE TRAINING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_training (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    training_name VARCHAR(200) NOT NULL,
    description TEXT,
    training_type ENUM('online', 'classroom', 'workshop', 'self_study') NOT NULL,
    duration_minutes INT,
    required_for ENUM('all_employees', 'managers', 'it_staff', 'specific_roles') NOT NULL,
    status ENUM('planned', 'active', 'completed', 'archived') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    INDEX idx_standard_id (standard_id),
    INDEX idx_training_type (training_type),
    INDEX idx_required_for (required_for),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TRAINING RECORDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_training_records (
    id VARCHAR(50) PRIMARY KEY,
    training_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    completed_at TIMESTAMP NULL,
    score INT,
    certificate_path VARCHAR(500),
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (training_id) REFERENCES lopez_compliance_training(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES lopez_enterprise_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_training_user (training_id, user_id),
    INDEX idx_training_id (training_id),
    INDEX idx_user_id (user_id),
    INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE INCIDENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_incidents (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    incident_type ENUM('data_breach', 'security_incident', 'policy_violation', 'audit_finding', 'other') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    status ENUM('reported', 'investigating', 'resolved', 'closed') DEFAULT 'reported',
    reported_by VARCHAR(36),
    assigned_to VARCHAR(36),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES lopez_enterprise_users(id) ON DELETE SET NULL,
    INDEX idx_standard_id (standard_id),
    INDEX idx_incident_type (incident_type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_reported_at (reported_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COMPLIANCE METRICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_compliance_metrics (
    id VARCHAR(50) PRIMARY KEY,
    standard_id VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_type ENUM('compliance_score', 'audit_findings', 'training_completion', 'incident_count', 'policy_approval') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    target_value DECIMAL(10,2),
    unit VARCHAR(20),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (standard_id) REFERENCES lopez_certification_standards(id) ON DELETE CASCADE,
    INDEX idx_standard_id (standard_id),
    INDEX idx_metric_type (metric_type),
    INDEX idx_measurement_date (measurement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;













