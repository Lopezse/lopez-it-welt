-- =====================================================
-- DATA LINEAGE TABLES - ENTERPRISE++ STANDARD E.2.6
-- =====================================================
-- Erstellt: 29.11.2025
-- Zweck: Data Lineage-Tracking für Compliance & Nachvollziehbarkeit
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- Data Lineage Nodes
CREATE TABLE IF NOT EXISTS enterprise_data_lineage_nodes (
    id VARCHAR(255) PRIMARY KEY,
    type ENUM('source', 'transform', 'destination', 'process') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Lineage Edges
CREATE TABLE IF NOT EXISTS enterprise_data_lineage_edges (
    id VARCHAR(255) PRIMARY KEY,
    source_node_id VARCHAR(255) NOT NULL,
    target_node_id VARCHAR(255) NOT NULL,
    relationship_type ENUM('reads', 'writes', 'transforms', 'copies', 'deletes') NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_source (source_node_id),
    INDEX idx_target (target_node_id),
    INDEX idx_relationship (relationship_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (source_node_id) REFERENCES enterprise_data_lineage_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_node_id) REFERENCES enterprise_data_lineage_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Lineage Events
CREATE TABLE IF NOT EXISTS enterprise_data_lineage_events (
    id VARCHAR(255) PRIMARY KEY,
    node_id VARCHAR(255) NOT NULL,
    event_type ENUM('create', 'read', 'update', 'delete', 'transform') NOT NULL,
    user_id VARCHAR(255),
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_node (node_id),
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user (user_id),
    FOREIGN KEY (node_id) REFERENCES enterprise_data_lineage_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Lineage Exports
CREATE TABLE IF NOT EXISTS enterprise_data_lineage_exports (
    id VARCHAR(255) PRIMARY KEY,
    format ENUM('csv', 'pdf', 'json') NOT NULL,
    filters JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    
    INDEX idx_format (format),
    INDEX idx_created_at (created_at),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



