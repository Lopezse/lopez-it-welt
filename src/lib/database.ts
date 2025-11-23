// =====================================================
// DATABASE CONNECTION - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: MySQL-Datenbankverbindung für Enterprise++ Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import mysql from "mysql2/promise";

// =====================================================
// DATENBANK-KONFIGURATION
// =====================================================

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// =====================================================
// CONNECTION POOL
// =====================================================

let pool: mysql.Pool | null = null;

let isInitialized = false;

export async function getConnection(): Promise<mysql.Pool> {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log("✅ MySQL Connection Pool erstellt");

      // Test-Verbindung
      const connection = await pool.getConnection();
      console.log("✅ MySQL Verbindung erfolgreich getestet");
      connection.release();
      
      // Automatische Initialisierung beim ersten Aufruf (nur einmal)
      if (!isInitialized) {
        try {
          console.log("🔧 Initialisiere Datenbank-Struktur...");
          await initializeDatabase();
          isInitialized = true;
          console.log("✅ Datenbank-Struktur erfolgreich initialisiert");
        } catch (initError) {
          console.error("⚠️ Datenbank-Initialisierung fehlgeschlagen (wird ignoriert):", initError);
          // Nicht werfen, da die Tabelle möglicherweise bereits existiert
        }
      }
    } catch (error) {
      console.error("❌ MySQL Verbindungsfehler:", error);
      throw error;
    }
  }
  return pool;
}

// =====================================================
// DATENBANK-INITIALISIERUNG
// =====================================================

export async function initializeDatabase(): Promise<void> {
  try {
    const connection = await getConnection();

    // =====================================================
    // KUNDEN-HAUPTTABELLE
    // =====================================================
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customers (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                kundennummer VARCHAR(20) UNIQUE NOT NULL,
                customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
                anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe',
                titel VARCHAR(50),
                vorname VARCHAR(100),
                nachname VARCHAR(100),
                firmenname VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                telefon VARCHAR(50),
                strasse VARCHAR(255),
                plz VARCHAR(20),
                ort VARCHAR(100),
                land VARCHAR(100) DEFAULT 'Deutschland',
                status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
                support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_kundennummer (kundennummer),
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_customer_type (customer_type),
                INDEX idx_support_level (support_level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // =====================================================
    // KUNDEN-NOTIZEN
    // =====================================================
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_notes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                note TEXT NOT NULL,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                INDEX idx_customer_id (customer_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // =====================================================
    // KUNDEN-TAGS
    // =====================================================
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_tags (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                tag_name VARCHAR(50) NOT NULL,
                tag_color VARCHAR(7) DEFAULT '#3B82F6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                UNIQUE KEY unique_customer_tag (customer_id, tag_name),
                INDEX idx_customer_id (customer_id),
                INDEX idx_tag_name (tag_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // =====================================================
    // AUDIT-LOGS
    // =====================================================
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_audit_logs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                table_name VARCHAR(50) NOT NULL,
                record_id BIGINT NOT NULL,
                action ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', '2FA_SETUP', '2FA_VERIFY', 'PASSWORD_CHANGE', 'ROLE_ASSIGN', 'PERMISSION_GRANT') NOT NULL,
                old_values JSON,
                new_values JSON,
                user_id BIGINT NOT NULL,
                username VARCHAR(100),
                ip_address VARCHAR(45),
                user_agent TEXT,
                session_id VARCHAR(255),
                risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
                compliance_category ENUM('DATA_ACCESS', 'DATA_MODIFICATION', 'AUTHENTICATION', 'AUTHORIZATION', 'SYSTEM_CHANGE', 'SECURITY_EVENT') DEFAULT 'DATA_ACCESS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_table_record (table_name, record_id),
                INDEX idx_user_id (user_id),
                INDEX idx_username (username),
                INDEX idx_action (action),
                INDEX idx_risk_level (risk_level),
                INDEX idx_compliance_category (compliance_category),
                INDEX idx_created_at (created_at),
                INDEX idx_session_id (session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // =====================================================
    // RBAC/ABAC SYSTEM
    // =====================================================

    // Benutzer-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_users (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                email_external VARCHAR(255),         -- lopezitwelt.de für externe Kommunikation
                email_internal VARCHAR(255),         -- lopez-team.de für interne Kommunikation
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                display_name VARCHAR(200),           -- "Ramiro Lopez Rodriguez - Admin"
                admin_alias VARCHAR(50),             -- "r.lopez", "r.mclean"
                domain_type ENUM('external', 'internal') DEFAULT 'internal',
                status ENUM('active', 'inactive', 'locked', 'pending') DEFAULT 'pending',
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_email_external (email_external),
                INDEX idx_email_internal (email_internal),
                INDEX idx_admin_alias (admin_alias),
                INDEX idx_domain_type (domain_type),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Rollen-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                level TINYINT NOT NULL DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name),
                INDEX idx_level (level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Berechtigungen-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                resource VARCHAR(100) NOT NULL,
                action VARCHAR(50) NOT NULL,
                conditions JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_resource_action (resource, action),
                INDEX idx_resource (resource),
                INDEX idx_action (action)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Benutzer-Rollen-Zuordnung
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                role_id BIGINT NOT NULL,
                assigned_by BIGINT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_by) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_role (user_id, role_id),
                INDEX idx_user_id (user_id),
                INDEX idx_role_id (role_id),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Rollen-Berechtigungen-Zuordnung
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_role_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                role_id BIGINT NOT NULL,
                permission_id BIGINT NOT NULL,
                granted BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES lopez_permissions(id) ON DELETE CASCADE,
                UNIQUE KEY unique_role_permission (role_id, permission_id),
                INDEX idx_role_id (role_id),
                INDEX idx_permission_id (permission_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Sessions-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_sessions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_session_token (session_token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // =====================================================
    // 2FA SYSTEM
    // =====================================================

    // 2FA-Secrets-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                secret VARCHAR(255) NOT NULL,
                backup_codes JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_2fa (user_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // 2FA-Verifikationen-Tabelle
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa_verifications (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                token VARCHAR(10) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    console.log("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert");
  } catch (error) {
    console.error("❌ Datenbank-Initialisierungsfehler:", error);
    throw error;
  }
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✅ MySQL Connection Pool geschlossen");
  }
}

// =====================================================
// KUNDENNUMMER-GENERATOR
// =====================================================

export async function generateKundennummer(): Promise<string> {
  try {
    const connection = await getConnection();
    
    // Datums- und Zeitbasiertes Format: YYYYMMDDHHMM-1 (nur ein Trennzeichen vor der Nummer)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const prefix = `${year}${month}${day}${hour}${minute}`;
    
    // Nächste Nummer für diese Stunde/Minute ermitteln
    const [rows] = await connection.execute(
      `SELECT MAX(CAST(SUBSTRING(kundennummer, 13) AS UNSIGNED)) as max_num 
       FROM lopez_customers 
       WHERE kundennummer LIKE ?`,
      [`${prefix}-%`],
    );

    const maxNum = (rows as any)[0]?.max_num || 0;
    const nextNum = maxNum + 1;

    // Format: YYYYMMDDHHMM-1 (z.B. 202511012210-1)
    return `${prefix}-${nextNum}`;
  } catch (error) {
    console.error("❌ Kundennummer-Generierung fehlgeschlagen:", error);
    // Fallback: Timestamp-basiert
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const prefix = `${year}${month}${day}${hour}${minute}`;
    return `${prefix}-${String(Date.now()).slice(-1)}`;
  }
}
