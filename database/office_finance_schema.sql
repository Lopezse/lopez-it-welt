-- =====================================================
-- ENTERPRISE++ OFFICE & FINANCE MANAGEMENT
-- LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-11-01
-- Zweck: Vollständiges Office & Finance Management System
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_it_welt;

-- =====================================================
-- 1. PROJEKTE (CRM)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  project_code VARCHAR(40) UNIQUE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status ENUM('open','in_progress','on_hold','done','cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  updated_by VARCHAR(36) NULL,
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id),
  INDEX idx_customer (customer_id),
  INDEX idx_status (status),
  INDEX idx_project_code (project_code),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. AUFTRÄGE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NULL,
  customer_id VARCHAR(36) NOT NULL,
  order_no VARCHAR(40) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('new','accepted','in_work','waiting','done','cancelled') DEFAULT 'new',
  sla_priority ENUM('low','normal','high','urgent') DEFAULT 'normal',
  created_by VARCHAR(36),
  assigned_to VARCHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id),
  INDEX idx_project (project_id),
  INDEX idx_customer (customer_id),
  INDEX idx_status (status),
  INDEX idx_order_no (order_no),
  INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. AUFGABEN (KANBAN)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NULL,
  project_id INT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NULL,
  priority ENUM('low','medium','high') DEFAULT 'medium',
  status ENUM('todo','doing','blocked','done') DEFAULT 'todo',
  assigned_to VARCHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  INDEX idx_order (order_id),
  INDEX idx_project (project_id),
  INDEX idx_status (status),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_due_date (due_date),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TERMINE (KALENDER)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NULL,
  order_id INT NULL,
  task_id INT NULL,
  employee_id VARCHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  date_start DATETIME NOT NULL,
  date_end DATETIME NOT NULL,
  location VARCHAR(255) NULL,
  notes TEXT,
  is_all_day TINYINT(1) DEFAULT 0,
  ical_uid VARCHAR(64) NULL,
  -- Enterprise++ Flags
  is_billable TINYINT(1) DEFAULT 0 COMMENT 'Termin ist abrechenbar (0=nein, 1=ja)',
  status ENUM('planned', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned' COMMENT 'Termin-Status',
  time_session_id INT NULL COMMENT 'FK zu work_sessions.id (verknüpfte Zeiterfassung)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (time_session_id) REFERENCES work_sessions(id) ON DELETE SET NULL,
  INDEX idx_project (project_id),
  INDEX idx_order (order_id),
  INDEX idx_task (task_id),
  INDEX idx_employee (employee_id),
  INDEX idx_date_start (date_start),
  INDEX idx_date_end (date_end),
  INDEX idx_ical_uid (ical_uid),
  INDEX idx_is_billable (is_billable),
  INDEX idx_status (status),
  INDEX idx_time_session (time_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. RECHNUNGEN (GOBD / §14 USTG)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  project_id INT NULL,
  order_id INT NULL,
  issue_date DATE NOT NULL,
  service_date DATE NOT NULL,
  payment_terms VARCHAR(100) DEFAULT 'Zahlbar innerhalb 14 Tage ohne Abzug',
  currency CHAR(3) DEFAULT 'EUR',
  net_amount DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 19.00,
  tax_amount DECIMAL(12,2) NOT NULL,
  gross_amount DECIMAL(12,2) NOT NULL,
  status ENUM('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
  hash_sha256 CHAR(64),
  pdf_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id),
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
  INDEX idx_customer (customer_id),
  INDEX idx_project (project_id),
  INDEX idx_order (order_id),
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_status (status),
  INDEX idx_issue_date (issue_date),
  INDEX idx_hash (hash_sha256)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. RECHNUNGSPOSITIONEN
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  pos INT NOT NULL,
  item_text VARCHAR(500) NOT NULL,
  qty DECIMAL(12,3) NOT NULL,
  unit VARCHAR(20) DEFAULT 'Stk',
  unit_price DECIMAL(12,2) NOT NULL,
  net_line DECIMAL(12,2) NOT NULL,
  
  FOREIGN KEY (invoice_id) REFERENCES lopez_invoices(id) ON DELETE CASCADE,
  INDEX idx_invoice (invoice_id),
  INDEX idx_pos (pos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. E-RECHNUNG EINGANG (Empfang)
-- =====================================================

CREATE TABLE IF NOT EXISTS einvoice_inbox (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sender VARCHAR(255),
  customer_id VARCHAR(36) NULL,
  format ENUM('XRECHNUNG','ZUGFERD') NOT NULL,
  xml_path VARCHAR(500) NOT NULL,
  pdf_path VARCHAR(500),
  total_net DECIMAL(12,2),
  total_tax DECIMAL(12,2),
  total_gross DECIMAL(12,2),
  currency CHAR(3),
  invoice_number VARCHAR(80),
  status ENUM('neu','geprueft','gebucht','abgelehnt') DEFAULT 'neu',
  validation_report TEXT,
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE SET NULL,
  INDEX idx_customer (customer_id),
  INDEX idx_status (status),
  INDEX idx_received_at (received_at),
  INDEX idx_invoice_number (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. E-RECHNUNG AUSGANG (Versand)
-- =====================================================

CREATE TABLE IF NOT EXISTS einvoice_outbox (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_id VARCHAR(36) NOT NULL,
  project_id INT NULL,
  invoice_number VARCHAR(50) UNIQUE,
  format ENUM('XRECHNUNG','ZUGFERD') NOT NULL,
  xml_path VARCHAR(500) NOT NULL,
  pdf_path VARCHAR(500),
  hash_sha256 CHAR(64),
  status ENUM('entwurf','versendet','zugestellt','storniert') DEFAULT 'entwurf',
  
  FOREIGN KEY (customer_id) REFERENCES lopez_customers(id),
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  INDEX idx_customer (customer_id),
  INDEX idx_project (project_id),
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_status (status),
  INDEX idx_hash (hash_sha256)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. AUDIT-LOGS (Office-spezifisch, falls nicht vorhanden)
-- =====================================================

-- Prüfe ob enterprise_audit_logs existiert, sonst lopez_audit_logs anlegen
CREATE TABLE IF NOT EXISTS lopez_audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  action VARCHAR(255),
  ref_table VARCHAR(100),
  ref_id BIGINT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,
  notes TEXT,
  
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_ref_table (ref_table),
  INDEX idx_ref_id (ref_id),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. ZEITERFASSUNG ERWEITERN (Projekt/Auftrag/Task-Zuordnung)
-- =====================================================

-- Prüfe ob Spalten bereits existieren, sonst hinzufügen
ALTER TABLE work_sessions 
ADD COLUMN IF NOT EXISTS project_id INT NULL AFTER id,
ADD COLUMN IF NOT EXISTS order_id INT NULL AFTER project_id,
ADD COLUMN IF NOT EXISTS task_id INT NULL AFTER order_id;

-- Foreign Keys hinzufügen (nur wenn Spalten neu erstellt wurden)
-- ALTER TABLE work_sessions 
-- ADD FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
-- ADD FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
-- ADD FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL;

-- =====================================================
-- FERTIG: OFFICE & FINANCE MANAGEMENT DATENBANK
-- =====================================================


-- ADD FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
-- ADD FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
-- ADD FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL;

-- =====================================================
-- FERTIG: OFFICE & FINANCE MANAGEMENT DATENBANK
-- =====================================================

