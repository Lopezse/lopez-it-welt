// =====================================================
// KUNDEN-PORTAL - TABELLEN INITIALISIERUNG
// =====================================================
// GET/POST /api/customer/init-tables
// Erstellt alle Kunden-Portal Tabellen
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET & POST - Tabellen initialisieren
// =====================================================

export async function GET(request: NextRequest) {
  return await POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const pool = await getConnection();
    const results: Record<string, any> = {};
    
    console.log("🚀 Kunden-Portal - Safe Migration gestartet...");
    
    // -------------------------------------------------
    // 1. KUNDEN (CUSTOMERS)
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        
        email VARCHAR(200) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(50),
        
        company_name VARCHAR(200),
        company_vat_id VARCHAR(50),
        
        street VARCHAR(200),
        city VARCHAR(100),
        postal_code VARCHAR(20),
        country VARCHAR(50) DEFAULT 'DE',
        
        status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
        email_verified BOOLEAN DEFAULT FALSE,
        email_verified_at TIMESTAMP NULL,
        
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(100),
        
        dsgvo_consent BOOLEAN DEFAULT FALSE,
        dsgvo_consent_at TIMESTAMP NULL,
        marketing_consent BOOLEAN DEFAULT FALSE,
        
        onboarding_completed BOOLEAN DEFAULT FALSE,
        onboarding_step INT DEFAULT 0,
        
        tenant_id INT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP NULL,
        
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customers = "✅ Tabelle erstellt/existiert";
    
    // Fehlende Spalten hinzufügen (für bestehende Tabellen)
    const missingColumns = [
      { name: 'password_hash', definition: 'VARCHAR(255) NOT NULL DEFAULT ""', after: 'email' },
      { name: 'first_name', definition: 'VARCHAR(100)', after: 'password_hash' },
      { name: 'last_name', definition: 'VARCHAR(100)', after: 'first_name' },
      { name: 'phone', definition: 'VARCHAR(50)', after: 'last_name' },
      { name: 'company_name', definition: 'VARCHAR(200)', after: 'phone' },
      { name: 'company_vat_id', definition: 'VARCHAR(50)', after: 'company_name' },
      { name: 'street', definition: 'VARCHAR(200)', after: 'company_vat_id' },
      { name: 'city', definition: 'VARCHAR(100)', after: 'street' },
      { name: 'postal_code', definition: 'VARCHAR(20)', after: 'city' },
      { name: 'country', definition: "VARCHAR(50) DEFAULT 'DE'", after: 'postal_code' },
      { name: 'status', definition: "ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending'", after: 'country' },
      { name: 'email_verified', definition: 'BOOLEAN DEFAULT FALSE', after: 'status' },
      { name: 'email_verified_at', definition: 'TIMESTAMP NULL', after: 'email_verified' },
      { name: 'two_factor_enabled', definition: 'BOOLEAN DEFAULT FALSE', after: 'email_verified_at' },
      { name: 'two_factor_secret', definition: 'VARCHAR(100)', after: 'two_factor_enabled' },
      { name: 'two_factor_backup_codes', definition: 'JSON', after: 'two_factor_secret' },
      { name: 'dsgvo_consent', definition: 'BOOLEAN DEFAULT FALSE', after: 'two_factor_backup_codes' },
      { name: 'dsgvo_consent_at', definition: 'TIMESTAMP NULL', after: 'dsgvo_consent' },
      { name: 'marketing_consent', definition: 'BOOLEAN DEFAULT FALSE', after: 'dsgvo_consent_at' },
      // Onboarding-spezifische Spalten
      { name: 'salutation', definition: "ENUM('herr', 'frau', 'divers', 'firma') DEFAULT 'herr'", after: 'id' },
      { name: 'language', definition: "ENUM('de', 'en', 'es') DEFAULT 'de'", after: 'phone' },
      { name: 'agb_accepted', definition: 'BOOLEAN DEFAULT FALSE', after: 'marketing_consent' },
      { name: 'agb_accepted_at', definition: 'TIMESTAMP NULL', after: 'agb_accepted' },
      { name: 'datenschutz_accepted', definition: 'BOOLEAN DEFAULT FALSE', after: 'agb_accepted_at' },
      { name: 'datenschutz_accepted_at', definition: 'TIMESTAMP NULL', after: 'datenschutz_accepted' },
      { name: 'ai_processing_accepted', definition: 'BOOLEAN DEFAULT FALSE', after: 'datenschutz_accepted_at' },
      { name: 'service_interests', definition: 'JSON', after: 'ai_processing_accepted' },
      { name: 'referral_source', definition: 'VARCHAR(50)', after: 'service_interests' },
      { name: 'onboarding_completed', definition: 'BOOLEAN DEFAULT FALSE', after: 'referral_source' },
      { name: 'onboarding_step', definition: 'INT DEFAULT 0', after: 'onboarding_completed' },
      { name: 'onboarding_completed_at', definition: 'TIMESTAMP NULL', after: 'onboarding_step' },
      { name: 'tenant_id', definition: 'INT', after: 'onboarding_completed_at' },
      { name: 'last_login_at', definition: 'TIMESTAMP NULL', after: 'updated_at' },
    ];
    
    for (const col of missingColumns) {
      try {
        await pool.execute(`
          ALTER TABLE lopez_customers 
          ADD COLUMN ${col.name} ${col.definition}
        `);
        results[`lopez_customers_${col.name}`] = `✅ Spalte ${col.name} hinzugefügt`;
      } catch {
        // Spalte existiert bereits - ignorieren
      }
    }
    results.lopez_customers_columns = "✅ Alle Spalten geprüft";
    
    // -------------------------------------------------
    // 2. KUNDEN-SESSIONS
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        
        token VARCHAR(255) NOT NULL UNIQUE,
        user_agent TEXT,
        ip_address VARCHAR(50),
        
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_customer (customer_id),
        INDEX idx_token (token),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_sessions = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 3. KUNDEN-PROJEKTE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        
        name VARCHAR(200) NOT NULL,
        description TEXT,
        code VARCHAR(50) NOT NULL,
        
        status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
        type ENUM('website', 'webapp', 'api', 'consulting', 'other') DEFAULT 'other',
        
        settings JSON,
        
        ai_media_enabled BOOLEAN DEFAULT FALSE,
        ai_code_audit_enabled BOOLEAN DEFAULT FALSE,
        ai_analyzer_enabled BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY idx_customer_code (customer_id, code),
        INDEX idx_customer (customer_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_projects = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 4. KUNDEN-RECHNUNGEN
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        project_id INT,
        
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        
        net_amount DECIMAL(10,2) NOT NULL,
        tax_rate DECIMAL(5,2) DEFAULT 19.00,
        tax_amount DECIMAL(10,2) NOT NULL,
        gross_amount DECIMAL(10,2) NOT NULL,
        
        invoice_date DATE NOT NULL,
        due_date DATE NOT NULL,
        
        status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
        paid_at TIMESTAMP NULL,
        
        line_items JSON NOT NULL,
        
        pdf_path VARCHAR(500),
        pdf_generated_at TIMESTAMP NULL,
        
        notes TEXT,
        internal_notes TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_customer (customer_id),
        INDEX idx_project (project_id),
        INDEX idx_status (status),
        INDEX idx_invoice_date (invoice_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_invoices = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 5. SUPPORT-TICKETS
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        project_id INT,
        
        ticket_number VARCHAR(20) NOT NULL UNIQUE,
        
        subject VARCHAR(300) NOT NULL,
        description TEXT NOT NULL,
        
        category ENUM('technical', 'billing', 'general', 'feature_request', 'bug_report') DEFAULT 'general',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        
        status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
        
        assigned_to INT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL,
        closed_at TIMESTAMP NULL,
        
        INDEX idx_customer (customer_id),
        INDEX idx_project (project_id),
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_tickets = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 6. TICKET-NACHRICHTEN
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_ticket_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        
        sender_type ENUM('customer', 'admin', 'system') NOT NULL,
        sender_id INT,
        
        message TEXT NOT NULL,
        
        attachments JSON,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_ticket (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_ticket_messages = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 7. EMAIL-VERIFIZIERUNG
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_email_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        
        token VARCHAR(255) NOT NULL UNIQUE,
        type ENUM('verify_email', 'reset_password') NOT NULL,
        
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP NULL,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_token (token),
        INDEX idx_customer (customer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_email_tokens = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 8. AI-USAGE TRACKING (PRO KUNDE)
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_customer_ai_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        project_id INT,
        
        service ENUM('media_ai', 'code_audit', 'project_analyzer', 'other') NOT NULL,
        
        tokens_input INT DEFAULT 0,
        tokens_output INT DEFAULT 0,
        cost DECIMAL(10,4) DEFAULT 0,
        
        details JSON,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_customer (customer_id),
        INDEX idx_project (project_id),
        INDEX idx_service (service),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_customer_ai_usage = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // ZUSAMMENFASSUNG
    // -------------------------------------------------
    
    console.log("🎉 Kunden-Portal - Safe Migration abgeschlossen!");
    
    // Tabellen-Status prüfen
    const [tables] = await pool.execute<any[]>(`
      SELECT TABLE_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME LIKE 'lopez_customer%'
    `);
    
    const tableStatus: Record<string, number> = {};
    for (const table of tables) {
      tableStatus[table.TABLE_NAME] = table.TABLE_ROWS || 0;
    }
    
    return NextResponse.json({
      success: true,
      message: "✅ Kunden-Portal Tabellen erfolgreich initialisiert",
      results,
      tables: tableStatus,
      total_tables: Object.keys(tableStatus).length
    });
    
  } catch (error) {
    console.error("❌ Kunden-Portal Init Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

