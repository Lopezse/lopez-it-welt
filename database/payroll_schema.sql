-- =====================================================
-- PAYROLL LAYER - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-11-01
-- Zweck: Interne Abrechnung von Stunden- und Gehaltsdaten
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_it_welt;

-- =====================================================
-- 1. PAYROLL PERIODS (Abrechnungsperioden)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_start DATE NOT NULL COMMENT 'Startdatum der Abrechnungsperiode',
  period_end DATE NOT NULL COMMENT 'Enddatum der Abrechnungsperiode',
  period_type ENUM('monthly', 'weekly', 'biweekly', 'custom') DEFAULT 'monthly' COMMENT 'Art der Periode',
  status ENUM('draft', 'in_progress', 'finalized', 'paid', 'cancelled') DEFAULT 'draft' COMMENT 'Status der Periode',
  total_hours DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Gesamtstunden',
  total_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Gesamtbetrag',
  notes TEXT NULL COMMENT 'Notizen zur Periode',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  INDEX idx_period_start (period_start),
  INDEX idx_period_end (period_end),
  INDEX idx_status (status),
  UNIQUE KEY unique_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. PAYROLL ENTRIES (Abrechnungseinträge)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_id INT NOT NULL COMMENT 'FK zu lopez_payroll_periods.id',
  user_id INT NOT NULL COMMENT 'FK zu lopez_users.id',
  session_id INT NULL COMMENT 'FK zu work_sessions.id',
  project_id INT NULL COMMENT 'FK zu lopez_projects.id',
  order_id INT NULL COMMENT 'FK zu lopez_orders.id',
  task_id INT NULL COMMENT 'FK zu lopez_tasks.id',
  
  -- Zeitdaten
  work_date DATE NOT NULL COMMENT 'Arbeitsdatum',
  hours_worked DECIMAL(10,2) NOT NULL COMMENT 'Gearbeitete Stunden',
  hourly_rate DECIMAL(10,2) NOT NULL COMMENT 'Stundensatz',
  amount DECIMAL(12,2) NOT NULL COMMENT 'Betrag (Stunden * Stundensatz)',
  
  -- Kategorisierung
  category ENUM('planung', 'umsetzung', 'debug', 'dokumentation', 'testing', 'optimierung', 'meeting', 'sonstiges') DEFAULT 'umsetzung' COMMENT 'Kategorie',
  description TEXT NULL COMMENT 'Beschreibung der Arbeit',
  
  -- Status
  approved TINYINT(1) DEFAULT 0 COMMENT 'Freigegeben (0=nein, 1=ja)',
  invoiced TINYINT(1) DEFAULT 0 COMMENT 'Bereits abgerechnet (0=nein, 1=ja)',
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (period_id) REFERENCES lopez_payroll_periods(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES work_sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL,
  
  INDEX idx_period_id (period_id),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_work_date (work_date),
  INDEX idx_approved (approved),
  INDEX idx_invoiced (invoiced)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PAYROLL SUMMARY (Zusammenfassung)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_id INT NOT NULL COMMENT 'FK zu lopez_payroll_periods.id',
  user_id INT NOT NULL COMMENT 'FK zu lopez_users.id',
  
  -- Zusammenfassung
  total_hours DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Gesamtstunden',
  total_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Gesamtbetrag',
  hours_by_category JSON NULL COMMENT 'Stunden nach Kategorie (JSON)',
  
  -- Status
  status ENUM('draft', 'approved', 'paid', 'cancelled') DEFAULT 'draft' COMMENT 'Status',
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (period_id) REFERENCES lopez_payroll_periods(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
  
  INDEX idx_period_id (period_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_period_user (period_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. VIEWS
-- =====================================================

-- View: Abrechenbare Stunden (approved & !invoiced)
CREATE OR REPLACE VIEW v_payroll_billable AS
SELECT 
  pe.*,
  ws.taetigkeit,
  ws.start_time,
  ws.end_time,
  p.project_name,
  o.order_number,
  t.task_title,
  u.name as user_name
FROM lopez_payroll_entries pe
LEFT JOIN work_sessions ws ON pe.session_id = ws.id
LEFT JOIN lopez_projects p ON pe.project_id = p.id
LEFT JOIN lopez_orders o ON pe.order_id = o.id
LEFT JOIN lopez_tasks t ON pe.task_id = t.id
LEFT JOIN lopez_users u ON pe.user_id = u.id
WHERE pe.approved = 1 
  AND pe.invoiced = 0
ORDER BY pe.work_date DESC;

-- View: Zusammenfassung nach Periode
CREATE OR REPLACE VIEW v_payroll_period_summary AS
SELECT 
  pp.*,
  COUNT(DISTINCT pe.user_id) as user_count,
  COUNT(pe.id) as entry_count,
  SUM(pe.hours_worked) as total_hours,
  SUM(pe.amount) as total_amount
FROM lopez_payroll_periods pp
LEFT JOIN lopez_payroll_entries pe ON pp.id = pe.period_id
GROUP BY pp.id
ORDER BY pp.period_start DESC;

-- =====================================================
-- 5. TRIGGERS (Automatische Berechnungen)
-- =====================================================

-- Trigger: Aktualisiere Periode-Summe bei neuen Einträgen
DELIMITER //
CREATE TRIGGER trg_payroll_entry_insert
AFTER INSERT ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  )
  WHERE id = NEW.period_id;
END //
DELIMITER ;

-- Trigger: Aktualisiere Periode-Summe bei Updates
DELIMITER //
CREATE TRIGGER trg_payroll_entry_update
AFTER UPDATE ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  )
  WHERE id = NEW.period_id;
END //
DELIMITER ;

-- Trigger: Aktualisiere Periode-Summe bei Löschung
DELIMITER //
CREATE TRIGGER trg_payroll_entry_delete
AFTER DELETE ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = OLD.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = OLD.period_id
  )
  WHERE id = OLD.period_id;
END //
DELIMITER ;


-- PAYROLL LAYER - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-11-01
-- Zweck: Interne Abrechnung von Stunden- und Gehaltsdaten
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_it_welt;

-- =====================================================
-- 1. PAYROLL PERIODS (Abrechnungsperioden)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_start DATE NOT NULL COMMENT 'Startdatum der Abrechnungsperiode',
  period_end DATE NOT NULL COMMENT 'Enddatum der Abrechnungsperiode',
  period_type ENUM('monthly', 'weekly', 'biweekly', 'custom') DEFAULT 'monthly' COMMENT 'Art der Periode',
  status ENUM('draft', 'in_progress', 'finalized', 'paid', 'cancelled') DEFAULT 'draft' COMMENT 'Status der Periode',
  total_hours DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Gesamtstunden',
  total_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Gesamtbetrag',
  notes TEXT NULL COMMENT 'Notizen zur Periode',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  INDEX idx_period_start (period_start),
  INDEX idx_period_end (period_end),
  INDEX idx_status (status),
  UNIQUE KEY unique_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. PAYROLL ENTRIES (Abrechnungseinträge)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_id INT NOT NULL COMMENT 'FK zu lopez_payroll_periods.id',
  user_id INT NOT NULL COMMENT 'FK zu lopez_users.id',
  session_id INT NULL COMMENT 'FK zu work_sessions.id',
  project_id INT NULL COMMENT 'FK zu lopez_projects.id',
  order_id INT NULL COMMENT 'FK zu lopez_orders.id',
  task_id INT NULL COMMENT 'FK zu lopez_tasks.id',
  
  -- Zeitdaten
  work_date DATE NOT NULL COMMENT 'Arbeitsdatum',
  hours_worked DECIMAL(10,2) NOT NULL COMMENT 'Gearbeitete Stunden',
  hourly_rate DECIMAL(10,2) NOT NULL COMMENT 'Stundensatz',
  amount DECIMAL(12,2) NOT NULL COMMENT 'Betrag (Stunden * Stundensatz)',
  
  -- Kategorisierung
  category ENUM('planung', 'umsetzung', 'debug', 'dokumentation', 'testing', 'optimierung', 'meeting', 'sonstiges') DEFAULT 'umsetzung' COMMENT 'Kategorie',
  description TEXT NULL COMMENT 'Beschreibung der Arbeit',
  
  -- Status
  approved TINYINT(1) DEFAULT 0 COMMENT 'Freigegeben (0=nein, 1=ja)',
  invoiced TINYINT(1) DEFAULT 0 COMMENT 'Bereits abgerechnet (0=nein, 1=ja)',
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  
  FOREIGN KEY (period_id) REFERENCES lopez_payroll_periods(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES work_sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES lopez_projects(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES lopez_orders(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES lopez_tasks(id) ON DELETE SET NULL,
  
  INDEX idx_period_id (period_id),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_work_date (work_date),
  INDEX idx_approved (approved),
  INDEX idx_invoiced (invoiced)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PAYROLL SUMMARY (Zusammenfassung)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_payroll_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period_id INT NOT NULL COMMENT 'FK zu lopez_payroll_periods.id',
  user_id INT NOT NULL COMMENT 'FK zu lopez_users.id',
  
  -- Zusammenfassung
  total_hours DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Gesamtstunden',
  total_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Gesamtbetrag',
  hours_by_category JSON NULL COMMENT 'Stunden nach Kategorie (JSON)',
  
  -- Status
  status ENUM('draft', 'approved', 'paid', 'cancelled') DEFAULT 'draft' COMMENT 'Status',
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (period_id) REFERENCES lopez_payroll_periods(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
  
  INDEX idx_period_id (period_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_period_user (period_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. VIEWS
-- =====================================================

-- View: Abrechenbare Stunden (approved & !invoiced)
CREATE OR REPLACE VIEW v_payroll_billable AS
SELECT 
  pe.*,
  ws.taetigkeit,
  ws.start_time,
  ws.end_time,
  p.project_name,
  o.order_number,
  t.task_title,
  u.name as user_name
FROM lopez_payroll_entries pe
LEFT JOIN work_sessions ws ON pe.session_id = ws.id
LEFT JOIN lopez_projects p ON pe.project_id = p.id
LEFT JOIN lopez_orders o ON pe.order_id = o.id
LEFT JOIN lopez_tasks t ON pe.task_id = t.id
LEFT JOIN lopez_users u ON pe.user_id = u.id
WHERE pe.approved = 1 
  AND pe.invoiced = 0
ORDER BY pe.work_date DESC;

-- View: Zusammenfassung nach Periode
CREATE OR REPLACE VIEW v_payroll_period_summary AS
SELECT 
  pp.*,
  COUNT(DISTINCT pe.user_id) as user_count,
  COUNT(pe.id) as entry_count,
  SUM(pe.hours_worked) as total_hours,
  SUM(pe.amount) as total_amount
FROM lopez_payroll_periods pp
LEFT JOIN lopez_payroll_entries pe ON pp.id = pe.period_id
GROUP BY pp.id
ORDER BY pp.period_start DESC;

-- =====================================================
-- 5. TRIGGERS (Automatische Berechnungen)
-- =====================================================

-- Trigger: Aktualisiere Periode-Summe bei neuen Einträgen
DELIMITER //
CREATE TRIGGER trg_payroll_entry_insert
AFTER INSERT ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  )
  WHERE id = NEW.period_id;
END //
DELIMITER ;

-- Trigger: Aktualisiere Periode-Summe bei Updates
DELIMITER //
CREATE TRIGGER trg_payroll_entry_update
AFTER UPDATE ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = NEW.period_id
  )
  WHERE id = NEW.period_id;
END //
DELIMITER ;

-- Trigger: Aktualisiere Periode-Summe bei Löschung
DELIMITER //
CREATE TRIGGER trg_payroll_entry_delete
AFTER DELETE ON lopez_payroll_entries
FOR EACH ROW
BEGIN
  UPDATE lopez_payroll_periods
  SET total_hours = (
    SELECT COALESCE(SUM(hours_worked), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = OLD.period_id
  ),
  total_amount = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM lopez_payroll_entries 
    WHERE period_id = OLD.period_id
  )
  WHERE id = OLD.period_id;
END //
DELIMITER ;



















