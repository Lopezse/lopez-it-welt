-- =====================================================
-- MIGRATION: Provider Secret-Referenz-System
-- =====================================================
-- Erstellt: 2025-01-27
-- Zweck: Enterprise Secret-Handling - Nur Referenzen, keine Keys
-- MySQL 8.0+ kompatibel
-- Enterprise++ Standard
-- =====================================================
-- 
-- WICHTIG: Diese Tabelle speichert NUR Referenzen (z.B. "ENV:OPENAI_API_KEY"),
-- niemals die echten API-Keys!
-- 
-- Kernprinzip: "Secrets are never stored, only referenced"
-- =====================================================

USE lopez_it_welt;

-- Provider-Konfiguration (nur Referenzen, keine Keys)
CREATE TABLE IF NOT EXISTS lopez_media_ai_providers (
    id VARCHAR(36) PRIMARY KEY,
    provider_name VARCHAR(50) NOT NULL UNIQUE, -- "openai", "google", "mock"
    secret_ref VARCHAR(255) NOT NULL,         -- "ENV:OPENAI_API_KEY" (NUR Referenz!)
    model_version VARCHAR(50) NULL,           -- "gpt-4-vision-preview"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider_name),
    INDEX idx_active (is_active),
    
    -- Constraint: secret_ref muss gültiges Format haben
    -- ENV:VARIABLE_NAME oder MOCK
    CONSTRAINT chk_secret_ref_format CHECK (
        secret_ref = 'MOCK' OR secret_ref LIKE 'ENV:%'
    )
);

-- Beispiel-Einträge (nur Referenzen, keine Keys!)
INSERT INTO lopez_media_ai_providers (id, provider_name, secret_ref, model_version, is_active)
VALUES 
    (
        UUID(),
        'mock',
        'MOCK',  -- Mock benötigt keinen Key
        NULL,
        TRUE
    ),
    (
        UUID(),
        'openai',
        'ENV:OPENAI_API_KEY',  -- NUR Referenz, kein Key!
        'gpt-4-vision-preview',
        FALSE  -- Standard: inaktiv, bis Key gesetzt ist
    )
ON DUPLICATE KEY UPDATE
    secret_ref = VALUES(secret_ref),
    model_version = VALUES(model_version),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- HINWEIS: KEIN api_key Feld!
-- =====================================================
-- Diese Tabelle speichert NUR Referenzen wie "ENV:OPENAI_API_KEY"
-- Der echte Key wird zur Laufzeit aus process.env geladen
-- und niemals in der Datenbank gespeichert.
-- =====================================================

-- =====================================================
-- MIGRATION ABGESCHLOSSEN
-- =====================================================





