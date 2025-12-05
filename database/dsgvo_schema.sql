-- =====================================================
-- DSGVO DATENBANK-SCHEMA - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-11-26 22:02:19
-- Zweck: DSGVO-konforme Datenbankstruktur für Consent-Management, Privacy-Center und Audit-Logs
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- Enterprise++ Standard: SAP/IBM/Siemens-Niveau
-- =====================================================

-- =====================================================
-- 1. DSGVO CONSENTS (Einwilligungen)
-- =====================================================

CREATE TABLE IF NOT EXISTS dsgvo_consents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    consent_type ENUM('necessary', 'functional', 'analytics', 'marketing', 'ki_processing', 'media_ki') NOT NULL,
    consent_version VARCHAR(10) NOT NULL DEFAULT 'v1',
    consent_status ENUM('granted', 'revoked', 'denied', 'pending') NOT NULL DEFAULT 'pending',
    consent_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_consent_type (consent_type),
    INDEX idx_consent_status (consent_status),
    INDEX idx_consent_version (consent_version),
    INDEX idx_created_at (created_at),
    INDEX idx_user_consent (user_id, consent_type, consent_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. DSGVO AUDIT EVENTS (Audit-Logs)
-- =====================================================

CREATE TABLE IF NOT EXISTS dsgvo_audit_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    event_type ENUM(
        'CONSENT_GIVEN',
        'CONSENT_REVOKED',
        'CONSENT_UPDATED',
        'CONSENT_DENIED',
        'DATA_ACCESS',
        'DATA_DELETION',
        'DATA_CORRECTION',
        'DATA_PORTABILITY',
        'PERSON_DETECTED',
        'DSGVO_APPROVED',
        'KI_ANALYSIS_STARTED',
        'KI_ANALYSIS_COMPLETED',
        'KI_ANALYSIS_ERROR',
        'EXPORT_DONE',
        'DELETE_REQUESTED',
        'DELETE_COMPLETED'
    ) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    data_category VARCHAR(50),
    legal_basis VARCHAR(100),
    consent_status BOOLEAN,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    result ENUM('success', 'failure') DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at),
    INDEX idx_result (result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. DSGVO PRIVACY REQUESTS (Betroffenenanfragen)
-- =====================================================

CREATE TABLE IF NOT EXISTS dsgvo_privacy_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    request_type ENUM('access', 'deletion', 'correction', 'portability', 'restriction', 'objection') NOT NULL,
    request_status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
    request_data JSON,
    response_data JSON,
    export_file_path VARCHAR(500),
    deletion_date TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_request_type (request_type),
    INDEX idx_request_status (request_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FERTIG: DSGVO DATENBANK-SCHEMA
-- =====================================================



