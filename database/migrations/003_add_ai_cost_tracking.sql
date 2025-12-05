-- =====================================================
-- MIGRATION: Kosten-Tracking für KI-Analysen
-- =====================================================
-- Erstellt: 2025-01-27
-- Zweck: Tracking von KI-API-Kosten für Budget-Kontrolle
-- MySQL 8.0+ kompatibel
-- Enterprise++ Standard
-- =====================================================

USE lopez_it_welt;

-- Kosten-Tracking-Tabelle
CREATE TABLE IF NOT EXISTS lopez_media_ai_costs (
    id VARCHAR(36) PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- "openai", "google", "mock"
    operation_type VARCHAR(50) NOT NULL, -- "analyze", "batch", "search", "similar"
    cost_usd DECIMAL(10,4) NOT NULL, -- Kosten in USD (4 Dezimalstellen für Cent-Genauigkeit)
    media_id VARCHAR(16) NULL, -- Optional: Verknüpfung zu Medium
    tokens_used INT NULL, -- Optional: Anzahl verwendeter Tokens
    images_processed INT DEFAULT 1, -- Anzahl verarbeiteter Bilder
    model_version VARCHAR(50) NULL, -- Optional: Modell-Version
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider),
    INDEX idx_operation (operation_type),
    INDEX idx_media (media_id),
    INDEX idx_created (created_at)
    -- Hinweis: DATE(created_at) kann nicht direkt indiziert werden
    -- Abfragen mit DATE(created_at) nutzen den idx_created Index
);

-- Kosten-Limits-Konfiguration (optional, kann auch in Config-Datei sein)
CREATE TABLE IF NOT EXISTS lopez_media_ai_limits (
    id VARCHAR(36) PRIMARY KEY,
    limit_type ENUM('daily', 'monthly', 'total') NOT NULL,
    limit_amount_usd DECIMAL(10,4) NOT NULL, -- Limit in USD
    current_amount_usd DECIMAL(10,4) DEFAULT 0.00, -- Aktueller Verbrauch
    period_start DATE NOT NULL, -- Start-Datum des Zeitraums
    period_end DATE NULL, -- End-Datum (NULL für laufende Periode)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (limit_type),
    INDEX idx_active (is_active),
    INDEX idx_period (period_start, period_end)
);

-- =====================================================
-- MIGRATION ABGESCHLOSSEN
-- =====================================================

