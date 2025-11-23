-- =====================================================
-- USER PERMISSIONS SYSTEM - Lopez IT Welt Enterprise++
-- =====================================================
-- Erweitert das vorhandene RBAC-System um Feinrechte
-- Datum: 2025-01-19
-- Status: IMPLEMENTATION

-- =====================================================
-- 1. BERECHTIGUNGEN-TABELLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_core_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_key VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM(
        'user_management',
        'content_management', 
        'system_administration',
        'shop_management',
        'monitoring',
        'support',
        'analytics',
        'security'
    ) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    is_system_permission BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (permission_key),
    INDEX idx_category (category),
    INDEX idx_resource (resource),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 2. ROLLEN-BERECHTIGUNGEN-VERKNÜPFUNG
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_core_role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(36) NOT NULL,
    
    FOREIGN KEY (role_id) REFERENCES lopez_core_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES lopez_core_permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    
    INDEX idx_role (role_id),
    INDEX idx_permission (permission_id)
);

-- =====================================================
-- 3. BENUTZER-BERECHTIGUNGEN (ÜBERROLLEN HINAUS)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_core_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES lopez_core_users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES lopez_core_permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (user_id, permission_id),
    
    INDEX idx_user (user_id),
    INDEX idx_permission (permission_id),
    INDEX idx_active (is_active),
    INDEX idx_expires (expires_at)
);

-- =====================================================
-- 4. ZONE-DEFINITIONEN (ADMIN vs SHOP)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_core_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone_name VARCHAR(50) UNIQUE NOT NULL,
    zone_description TEXT,
    requires_2fa BOOLEAN DEFAULT FALSE,
    allowed_roles JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (zone_name),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 5. STANDARD-BERECHTIGUNGEN EINFÜGEN
-- =====================================================

INSERT INTO lopez_core_permissions (permission_key, permission_name, description, category, resource, action, is_system_permission) VALUES

-- USER MANAGEMENT
('users.view', 'Benutzer anzeigen', 'Benutzer-Liste und Details anzeigen', 'user_management', 'users', 'read', TRUE),
('users.create', 'Benutzer erstellen', 'Neue Benutzer anlegen', 'user_management', 'users', 'create', TRUE),
('users.update', 'Benutzer bearbeiten', 'Benutzerdaten ändern', 'user_management', 'users', 'update', TRUE),
('users.delete', 'Benutzer löschen', 'Benutzer permanent entfernen', 'user_management', 'users', 'delete', TRUE),
('users.manage_roles', 'Rollen verwalten', 'Benutzer-Rollen zuweisen', 'user_management', 'users', 'admin', TRUE),
('users.manage_status', 'Status verwalten', 'Benutzer aktivieren/deaktivieren', 'user_management', 'users', 'update', TRUE),

-- ROLES MANAGEMENT
('roles.view', 'Rollen anzeigen', 'Rollen-Liste und Details anzeigen', 'user_management', 'roles', 'read', TRUE),
('roles.create', 'Rollen erstellen', 'Neue Rollen anlegen', 'user_management', 'roles', 'create', TRUE),
('roles.update', 'Rollen bearbeiten', 'Rollen-Definitionen ändern', 'user_management', 'roles', 'update', TRUE),
('roles.delete', 'Rollen löschen', 'Rollen permanent entfernen', 'user_management', 'roles', 'delete', TRUE),
('roles.manage_permissions', 'Berechtigungen verwalten', 'Rollen-Berechtigungen zuweisen', 'user_management', 'roles', 'admin', TRUE),

-- CONTENT MANAGEMENT
('content.view', 'Inhalte anzeigen', 'Content-Liste und Details anzeigen', 'content_management', 'content', 'read', TRUE),
('content.create', 'Inhalte erstellen', 'Neue Inhalte anlegen', 'content_management', 'content', 'create', TRUE),
('content.update', 'Inhalte bearbeiten', 'Content-Daten ändern', 'content_management', 'content', 'update', TRUE),
('content.delete', 'Inhalte löschen', 'Content permanent entfernen', 'content_management', 'content', 'delete', TRUE),
('content.publish', 'Inhalte veröffentlichen', 'Content live schalten', 'content_management', 'content', 'publish', TRUE),

-- SYSTEM ADMINISTRATION
('system.view', 'System anzeigen', 'System-Status und -Informationen anzeigen', 'system_administration', 'system', 'read', TRUE),
('system.configure', 'System konfigurieren', 'System-Einstellungen ändern', 'system_administration', 'system', 'admin', TRUE),
('system.monitor', 'System überwachen', 'System-Performance einsehen', 'system_administration', 'system', 'read', TRUE),
('system.backup', 'Backups verwalten', 'Backups erstellen und wiederherstellen', 'system_administration', 'system', 'admin', TRUE),
('system.logs', 'Logs anzeigen', 'System-Logs einsehen', 'system_administration', 'system', 'read', TRUE),

-- SHOP MANAGEMENT
('shop.view', 'Shop anzeigen', 'Shop-Übersicht und -Daten anzeigen', 'shop_management', 'shop', 'read', TRUE),
('shop.manage_products', 'Produkte verwalten', 'Shop-Produkte verwalten', 'shop_management', 'products', 'admin', TRUE),
('shop.manage_orders', 'Bestellungen verwalten', 'Shop-Bestellungen verwalten', 'shop_management', 'orders', 'admin', TRUE),
('shop.manage_customers', 'Kunden verwalten', 'Shop-Kunden verwalten', 'shop_management', 'customers', 'admin', TRUE),
('shop.analytics', 'Shop-Analytics', 'Shop-Statistiken einsehen', 'shop_management', 'analytics', 'read', TRUE),

-- MONITORING
('monitoring.view', 'Monitoring anzeigen', 'Monitoring-Dashboard anzeigen', 'monitoring', 'monitoring', 'read', TRUE),
('monitoring.alerts', 'Alerts verwalten', 'Monitoring-Alerts konfigurieren', 'monitoring', 'alerts', 'admin', TRUE),
('monitoring.reports', 'Reports erstellen', 'Monitoring-Reports generieren', 'monitoring', 'reports', 'create', TRUE),

-- SUPPORT
('support.view', 'Support anzeigen', 'Support-Tickets anzeigen', 'support', 'tickets', 'read', TRUE),
('support.create', 'Tickets erstellen', 'Neue Support-Tickets anlegen', 'support', 'tickets', 'create', TRUE),
('support.update', 'Tickets bearbeiten', 'Support-Tickets bearbeiten', 'support', 'tickets', 'update', TRUE),
('support.close', 'Tickets schließen', 'Support-Tickets schließen', 'support', 'tickets', 'update', TRUE),

-- ANALYTICS
('analytics.view', 'Analytics anzeigen', 'Analytics-Dashboard anzeigen', 'analytics', 'analytics', 'read', TRUE),
('analytics.export', 'Daten exportieren', 'Analytics-Daten exportieren', 'analytics', 'analytics', 'export', TRUE),
('analytics.reports', 'Reports erstellen', 'Analytics-Reports generieren', 'analytics', 'reports', 'create', TRUE),

-- SECURITY
('security.view', 'Sicherheit anzeigen', 'Sicherheits-Dashboard anzeigen', 'security', 'security', 'read', TRUE),
('security.audit', 'Audit-Logs anzeigen', 'Sicherheits-Audit-Logs einsehen', 'security', 'audit', 'read', TRUE),
('security.manage_2fa', '2FA verwalten', 'Zwei-Faktor-Authentifizierung verwalten', 'security', '2fa', 'admin', TRUE);

-- =====================================================
-- 6. STANDARD-ROLLEN EINFÜGEN
-- =====================================================

INSERT INTO lopez_core_roles (role_name, role_code, role_description, permissions, is_system_role) VALUES

-- ADMIN ROLE
('Super Administrator', 'super_admin', 'Vollzugriff auf alle Systemfunktionen', JSON_ARRAY(
    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage_roles', 'users.manage_status',
    'roles.view', 'roles.create', 'roles.update', 'roles.delete', 'roles.manage_permissions',
    'content.view', 'content.create', 'content.update', 'content.delete', 'content.publish',
    'system.view', 'system.configure', 'system.monitor', 'system.backup', 'system.logs',
    'shop.view', 'shop.manage_products', 'shop.manage_orders', 'shop.manage_customers', 'shop.analytics',
    'monitoring.view', 'monitoring.alerts', 'monitoring.reports',
    'support.view', 'support.create', 'support.update', 'support.close',
    'analytics.view', 'analytics.export', 'analytics.reports',
    'security.view', 'security.audit', 'security.manage_2fa'
), TRUE),

-- EDITOR ROLE
('Editor', 'editor', 'Content Management und Redaktion', JSON_ARRAY(
    'content.view', 'content.create', 'content.update', 'content.publish',
    'shop.view', 'shop.manage_products',
    'analytics.view'
), TRUE),

-- SUPPORT ROLE
('Support Agent', 'support', 'Kunden-Support und Ticket-Management', JSON_ARRAY(
    'content.view',
    'users.view',
    'support.view', 'support.create', 'support.update', 'support.close',
    'shop.view', 'shop.manage_orders', 'shop.manage_customers',
    'system.logs'
), TRUE),

-- TECHNIKER ROLE
('Techniker', 'technician', 'Technische Wartung und Monitoring', JSON_ARRAY(
    'monitoring.view', 'monitoring.alerts', 'monitoring.reports',
    'system.view', 'system.monitor', 'system.logs',
    'support.view', 'support.update',
    'analytics.view'
), TRUE),

-- BÜRO ROLE
('Büro', 'office', 'Büro- und Verwaltungsaufgaben', JSON_ARRAY(
    'content.view',
    'shop.view', 'shop.manage_orders', 'shop.manage_customers',
    'analytics.view', 'analytics.export',
    'support.view'
), TRUE),

-- CUSTOMER ROLE
('Kunde', 'customer', 'Standard-Kundenrolle', JSON_ARRAY(
    'shop.view'
), TRUE),

-- PREMIUM CUSTOMER ROLE
('Premium Kunde', 'premium_customer', 'Erweiterte Kundenrolle', JSON_ARRAY(
    'shop.view', 'shop.analytics'
), TRUE);

-- =====================================================
-- 7. ZONEN EINFÜGEN
-- =====================================================

INSERT INTO lopez_core_zones (zone_name, zone_description, requires_2fa, allowed_roles) VALUES

-- ADMIN ZONE
('admin', 'Administrativer Bereich - Nur für interne Mitarbeiter', TRUE, JSON_ARRAY(
    'super_admin', 'admin', 'editor', 'support', 'technician', 'office'
)),

-- SHOP ZONE  
('shop', 'Kunden-Shop - Für alle registrierten Kunden', FALSE, JSON_ARRAY(
    'customer', 'premium_customer', 'super_admin', 'admin', 'editor', 'support', 'technician', 'office'
));

-- =====================================================
-- 8. ROLLEN-BERECHTIGUNGEN VERKNÜPFEN
-- =====================================================

-- Super Admin bekommt alle Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'super_admin';

-- Editor bekommt Content-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'editor'
AND p.permission_key IN (
    'content.view', 'content.create', 'content.update', 'content.publish',
    'shop.view', 'shop.manage_products',
    'analytics.view'
);

-- Support bekommt Support-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'support'
AND p.permission_key IN (
    'content.view', 'users.view', 'support.view', 'support.create', 
    'support.update', 'support.close', 'shop.view', 'shop.manage_orders', 
    'shop.manage_customers', 'system.logs'
);

-- Techniker bekommt Monitoring-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'technician'
AND p.permission_key IN (
    'monitoring.view', 'monitoring.alerts', 'monitoring.reports',
    'system.view', 'system.monitor', 'system.logs',
    'support.view', 'support.update', 'analytics.view'
);

-- Büro bekommt Büro-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'office'
AND p.permission_key IN (
    'content.view', 'shop.view', 'shop.manage_orders', 'shop.manage_customers',
    'analytics.view', 'analytics.export', 'support.view'
);

-- Kunde bekommt Shop-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'customer'
AND p.permission_key IN ('shop.view');

-- Premium Kunde bekommt erweiterte Shop-Berechtigungen
INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by)
SELECT 
    r.id as role_id,
    p.id as permission_id,
    'system' as granted_by
FROM lopez_core_roles r
CROSS JOIN lopez_core_permissions p
WHERE r.role_code = 'premium_customer'
AND p.permission_key IN ('shop.view', 'shop.analytics');

-- =====================================================
-- 9. INDEXES FÜR PERFORMANCE
-- =====================================================

-- Zusätzliche Indizes für bessere Performance
CREATE INDEX idx_permissions_category_resource ON lopez_core_permissions(category, resource);
CREATE INDEX idx_role_permissions_role ON lopez_core_role_permissions(role_id);
CREATE INDEX idx_user_permissions_user ON lopez_core_user_permissions(user_id);
CREATE INDEX idx_zones_name ON lopez_core_zones(zone_name);

-- =====================================================
-- 10. VIEWS FÜR EINFACHE ABFRAGEN
-- =====================================================

-- View: Benutzer mit Rollen und Berechtigungen
CREATE OR REPLACE VIEW v_user_permissions AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.status,
    r.role_name,
    r.role_code,
    z.zone_name,
    z.requires_2fa,
    GROUP_CONCAT(DISTINCT p.permission_key) as permissions
FROM lopez_core_users u
LEFT JOIN lopez_core_roles r ON u.role_id = r.id
LEFT JOIN lopez_core_role_permissions rp ON r.id = rp.role_id
LEFT JOIN lopez_core_permissions p ON rp.permission_id = p.id
LEFT JOIN lopez_core_zones z ON JSON_CONTAINS(z.allowed_roles, JSON_QUOTE(r.role_code))
WHERE u.status = 'active'
GROUP BY u.id, u.email, u.first_name, u.last_name, u.status, r.role_name, r.role_code, z.zone_name, z.requires_2fa;

-- View: Rollen mit Berechtigungen
CREATE OR REPLACE VIEW v_role_permissions AS
SELECT 
    r.id as role_id,
    r.role_name,
    r.role_code,
    r.role_description,
    GROUP_CONCAT(DISTINCT p.permission_key) as permissions,
    GROUP_CONCAT(DISTINCT p.permission_name) as permission_names
FROM lopez_core_roles r
LEFT JOIN lopez_core_role_permissions rp ON r.id = rp.role_id
LEFT JOIN lopez_core_permissions p ON rp.permission_id = p.id
WHERE r.is_active = TRUE
GROUP BY r.id, r.role_name, r.role_code, r.role_description;

-- =====================================================
-- ERFOLGREICH ABGESCHLOSSEN
-- =====================================================

-- Alle Tabellen und Daten wurden erfolgreich erstellt
-- Das RBAC-System ist jetzt vollständig implementiert
-- Nächster Schritt: API-Endpunkte erstellen



