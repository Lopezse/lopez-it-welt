-- =====================================================
-- AI CENTER JOBS TABLE
-- Enterprise++ Agent Orchestration
-- Phase 1.8 - Autonomie
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_ai_center_jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT NOT NULL,
  phase VARCHAR(16) NOT NULL,
  agent ENUM('B', 'C') NOT NULL COMMENT 'B=Builder, C=Reviewer',
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  priority INT DEFAULT 0 COMMENT 'Higher = more urgent',
  
  -- Input
  input_files JSON NULL COMMENT 'Files to process',
  input_params JSON NULL COMMENT 'Additional parameters',
  
  -- Output
  output_result JSON NULL COMMENT 'Result data',
  output_logs TEXT NULL COMMENT 'Execution logs',
  error_message TEXT NULL,
  
  -- Safety
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  locked_at DATETIME NULL COMMENT 'Prevents concurrent execution',
  locked_by VARCHAR(64) NULL COMMENT 'Worker ID',
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys (optional - dev_tasks muss existieren)
  -- FOREIGN KEY (task_id) REFERENCES dev_tasks(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_status (status),
  INDEX idx_agent (agent),
  INDEX idx_phase (phase),
  INDEX idx_pending (status, priority, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='AI Center Job Queue - Enterprise++ Agent Orchestration';

