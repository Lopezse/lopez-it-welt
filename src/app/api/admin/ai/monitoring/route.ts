// =====================================================
// AI CENTER - MONITORING DASHBOARD API
// =====================================================
// GET /api/admin/ai/monitoring
// Haupt-Monitoring-Übersicht mit allen wichtigen Metriken
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

interface MonitoringDashboard {
  // System-Status
  system_status: "operational" | "degraded" | "down";
  
  // Agenten
  agents: {
    total: number;
    active: number;
    inactive: number;
  };
  
  // Tasks (heute)
  tasks_today: {
    total: number;
    completed: number;
    failed: number;
    in_progress: number;
    pending: number;
  };
  
  // Kosten
  costs: {
    today: number;
    week: number;
    month: number;
    limit_daily: number;
    limit_monthly: number;
  };
  
  // Performance
  performance: {
    avg_task_duration_ms: number;
    tasks_per_hour: number;
    success_rate: number;
  };
  
  // Letzte Aktivitäten
  recent_activity: {
    last_task_at: string | null;
    last_error_at: string | null;
    errors_today: number;
  };
  
  // Timestamp
  timestamp: string;
}

// =====================================================
// GET - Monitoring Dashboard
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    
    // 1. Agenten-Status
    let agents = { total: 0, active: 0, inactive: 0 };
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(enabled = 1) as active,
          SUM(enabled = 0) as inactive
        FROM ai_agents
      `);
      if (rows[0]) {
        agents = {
          total: Number(rows[0].total) || 0,
          active: Number(rows[0].active) || 0,
          inactive: Number(rows[0].inactive) || 0
        };
      }
    } catch (e) {
      console.log("Agents query skipped:", e);
    }
    
    // 2. Tasks heute
    let tasks_today = { total: 0, completed: 0, failed: 0, in_progress: 0, pending: 0 };
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(status = 'done') as completed,
          SUM(status = 'failed') as failed,
          SUM(status IN ('planning', 'coding', 'review')) as in_progress,
          SUM(status = 'open') as pending
        FROM dev_tasks
        WHERE DATE(created_at) = CURDATE()
      `);
      if (rows[0]) {
        tasks_today = {
          total: Number(rows[0].total) || 0,
          completed: Number(rows[0].completed) || 0,
          failed: Number(rows[0].failed) || 0,
          in_progress: Number(rows[0].in_progress) || 0,
          pending: Number(rows[0].pending) || 0
        };
      }
    } catch (e) {
      console.log("Tasks query skipped:", e);
    }
    
    // 3. Kosten
    let costs = { today: 0, week: 0, month: 0, limit_daily: 10, limit_monthly: 100 };
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          SUM(CASE WHEN date = CURDATE() THEN cost_total ELSE 0 END) as today,
          SUM(CASE WHEN date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN cost_total ELSE 0 END) as week,
          SUM(CASE WHEN MONTH(date) = MONTH(CURDATE()) THEN cost_total ELSE 0 END) as month
        FROM ai_cost_tracking
      `);
      if (rows[0]) {
        costs = {
          today: Number(rows[0].today) || 0,
          week: Number(rows[0].week) || 0,
          month: Number(rows[0].month) || 0,
          limit_daily: 10,
          limit_monthly: 100
        };
      }
    } catch (e) {
      // Kosten-Tabelle existiert möglicherweise nicht
      console.log("Costs query skipped:", e);
    }
    
    // 4. Performance (aus Agent-Metriken)
    let performance = { avg_task_duration_ms: 0, tasks_per_hour: 0, success_rate: 100 };
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          AVG(avg_duration_ms) as avg_duration,
          SUM(tasks_total) as total_tasks,
          SUM(tasks_success) as success_tasks
        FROM ai_agent_metrics
        WHERE metric_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);
      if (rows[0]) {
        const totalTasks = Number(rows[0].total_tasks) || 0;
        const successTasks = Number(rows[0].success_tasks) || 0;
        performance = {
          avg_task_duration_ms: Math.round(Number(rows[0].avg_duration) || 0),
          tasks_per_hour: Math.round(totalTasks / (7 * 24)), // Durchschnitt über 7 Tage
          success_rate: totalTasks > 0 ? Math.round((successTasks / totalTasks) * 100) : 100
        };
      }
    } catch (e) {
      console.log("Performance query skipped:", e);
    }
    
    // 5. Letzte Aktivitäten
    let recent_activity = { last_task_at: null as string | null, last_error_at: null as string | null, errors_today: 0 };
    try {
      // Letzter Task
      const [taskRows] = await pool.execute<RowDataPacket[]>(`
        SELECT created_at FROM dev_tasks ORDER BY created_at DESC LIMIT 1
      `);
      if (taskRows[0]) {
        recent_activity.last_task_at = taskRows[0].created_at;
      }
      
      // Fehler heute (aus Audit-Log)
      const [errorRows] = await pool.execute<RowDataPacket[]>(`
        SELECT COUNT(*) as count, MAX(timestamp) as last_error
        FROM lopez_audit_logs
        WHERE action LIKE '%FAILED%' OR action LIKE '%ERROR%'
        AND DATE(timestamp) = CURDATE()
      `);
      if (errorRows[0]) {
        recent_activity.errors_today = Number(errorRows[0].count) || 0;
        recent_activity.last_error_at = errorRows[0].last_error || null;
      }
    } catch (e) {
      console.log("Activity query skipped:", e);
    }
    
    // System-Status bestimmen
    let system_status: "operational" | "degraded" | "down" = "operational";
    if (agents.active === 0 && agents.total > 0) {
      system_status = "degraded";
    }
    if (recent_activity.errors_today > 10) {
      system_status = "degraded";
    }
    
    const dashboard: MonitoringDashboard = {
      system_status,
      agents,
      tasks_today,
      costs,
      performance,
      recent_activity,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: dashboard
    });
    
  } catch (error) {
    console.error("❌ Monitoring Dashboard Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler beim Laden des Dashboards"
      },
      { status: 500 }
    );
  }
}







