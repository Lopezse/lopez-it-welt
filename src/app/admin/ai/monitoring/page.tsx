"use client";

// =====================================================
// AI CENTER - MONITORING DASHBOARD PAGE
// =====================================================
// /admin/ai/monitoring
// Enterprise++ Echtzeit-Überwachung
// =====================================================

import { useState, useEffect, useCallback } from "react";
import { 
  FaChartLine, 
  FaSyncAlt, 
  FaArrowLeft,
  FaServer,
  FaClock
} from "react-icons/fa";
import Link from "next/link";
import { SystemHealthCard } from "@/components/admin/ai/SystemHealthCard";
import { 
  AgentStatusCard,
  TasksTodayCard,
  CostsCard,
  PerformanceCard,
  RecentActivityCard,
  SystemStatusBadge
} from "@/components/admin/ai/MonitoringCards";

// =====================================================
// TYPEN
// =====================================================

interface ComponentHealth {
  name: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  latency_ms: number | null;
  last_check: string;
  details?: string;
}

interface HealthData {
  overall_status: "healthy" | "degraded" | "unhealthy";
  components: ComponentHealth[];
  uptime_seconds: number;
}

interface DashboardData {
  system_status: "operational" | "degraded" | "down";
  agents: { total: number; active: number; inactive: number };
  tasks_today: { total: number; completed: number; failed: number; in_progress: number; pending: number };
  costs: { today: number; week: number; month: number; limit_daily: number; limit_monthly: number };
  performance: { avg_task_duration_ms: number; tasks_per_hour: number; success_rate: number };
  recent_activity: { last_task_at: string | null; last_error_at: string | null; errors_today: number };
  timestamp: string;
}

// =====================================================
// KOMPONENTE
// =====================================================

export default function MonitoringPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // =====================================================
  // DATEN LADEN
  // =====================================================
  
  const loadData = useCallback(async () => {
    try {
      setError(null);
      
      // Parallel laden
      const [healthRes, dashboardRes] = await Promise.all([
        fetch("/api/admin/ai/monitoring/health"),
        fetch("/api/admin/ai/monitoring")
      ]);
      
      const healthJson = await healthRes.json();
      const dashboardJson = await dashboardRes.json();
      
      if (healthJson.success) {
        setHealthData(healthJson.data);
      }
      
      if (dashboardJson.success) {
        setDashboardData(dashboardJson.data);
      }
      
      setLastUpdate(new Date());
      
    } catch (err) {
      setError("Fehler beim Laden der Monitoring-Daten");
      console.error("Monitoring Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial laden
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-Refresh alle 30 Sekunden
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // =====================================================
  // RENDER
  // =====================================================
  
  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/ai"
              className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 text-[#b3b3b3]" />
            </Link>
            <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
              <FaChartLine className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Monitoring Dashboard
              </h1>
              <p className="text-[#b3b3b3]">
                AI Center Echtzeit-Überwachung
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Status Badge */}
            {dashboardData && (
              <SystemStatusBadge status={dashboardData.system_status} />
            )}
            
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                autoRefresh 
                  ? "bg-green-400/10 text-green-400 border border-green-400/30" 
                  : "bg-[#272a33] text-[#b3b3b3]"
              }`}
            >
              {autoRefresh ? "Auto-Refresh AN" : "Auto-Refresh AUS"}
            </button>
            
            {/* Manual Refresh */}
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Aktualisieren
            </button>
          </div>
        </div>
        
        {/* Last Update Info */}
        {lastUpdate && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[#b3b3b3]">
            <FaClock className="h-3 w-3" />
            Zuletzt aktualisiert: {lastUpdate.toLocaleTimeString()}
            {autoRefresh && <span className="text-green-400">(Auto-Refresh: 30s)</span>}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <AgentStatusCard
            total={dashboardData?.agents.total || 0}
            active={dashboardData?.agents.active || 0}
            inactive={dashboardData?.agents.inactive || 0}
            isLoading={loading}
          />
          
          <TasksTodayCard
            total={dashboardData?.tasks_today.total || 0}
            completed={dashboardData?.tasks_today.completed || 0}
            failed={dashboardData?.tasks_today.failed || 0}
            inProgress={dashboardData?.tasks_today.in_progress || 0}
            pending={dashboardData?.tasks_today.pending || 0}
            isLoading={loading}
          />
          
          <CostsCard
            today={dashboardData?.costs.today || 0}
            week={dashboardData?.costs.week || 0}
            month={dashboardData?.costs.month || 0}
            limitDaily={dashboardData?.costs.limit_daily || 10}
            limitMonthly={dashboardData?.costs.limit_monthly || 100}
            isLoading={loading}
          />
          
          <PerformanceCard
            avgDurationMs={dashboardData?.performance.avg_task_duration_ms || 0}
            tasksPerHour={dashboardData?.performance.tasks_per_hour || 0}
            successRate={dashboardData?.performance.success_rate || 100}
            isLoading={loading}
          />
          
          <RecentActivityCard
            lastTaskAt={dashboardData?.recent_activity.last_task_at || null}
            lastErrorAt={dashboardData?.recent_activity.last_error_at || null}
            errorsToday={dashboardData?.recent_activity.errors_today || 0}
            isLoading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health Card */}
          <SystemHealthCard
            overallStatus={healthData?.overall_status || "healthy"}
            components={healthData?.components || []}
            uptimeSeconds={healthData?.uptime_seconds || 0}
            isLoading={loading}
          />
          
          {/* Quick Links / Actions */}
          <div className="bg-[#111217] border border-[#272a33] rounded-xl p-6">
            <h3 className="font-semibold text-[#f4f4f4] mb-4 flex items-center gap-2">
              <FaServer className="h-4 w-4 text-[#ffd700]" />
              Schnellzugriff
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/admin/ai/agents"
                className="p-4 bg-[#0a0a0e] hover:bg-[#272a33] rounded-lg transition-colors text-center"
              >
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {dashboardData?.agents.total || 0}
                </div>
                <div className="text-xs text-[#b3b3b3]">Agenten verwalten</div>
              </Link>
              
              <Link 
                href="/admin/ai/dev-tasks"
                className="p-4 bg-[#0a0a0e] hover:bg-[#272a33] rounded-lg transition-colors text-center"
              >
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {dashboardData?.tasks_today.total || 0}
                </div>
                <div className="text-xs text-[#b3b3b3]">Tasks heute</div>
              </Link>
              
              <Link 
                href="/admin/ai/project-analyzer"
                className="p-4 bg-[#0a0a0e] hover:bg-[#272a33] rounded-lg transition-colors text-center"
              >
                <div className="text-2xl font-bold text-purple-400">
                  Analyzer
                </div>
                <div className="text-xs text-[#b3b3b3]">Projekt analysieren</div>
              </Link>
              
              <Link 
                href="/admin/ai/reports"
                className="p-4 bg-[#0a0a0e] hover:bg-[#272a33] rounded-lg transition-colors text-center"
              >
                <div className="text-2xl font-bold text-orange-400">
                  Reports
                </div>
                <div className="text-xs text-[#b3b3b3]">Executive Reports</div>
              </Link>
            </div>
            
            {/* API Status */}
            <div className="mt-4 p-3 bg-[#0a0a0e] rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#b3b3b3]">API Response Time</span>
                <span className="text-green-400">
                  {healthData?.components.find(c => c.name === "Database")?.latency_ms || "-"}ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-[#111217] border border-[#272a33] rounded-xl">
          <div className="flex items-start gap-3">
            <FaChartLine className="h-5 w-5 text-[#ffd700] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#f4f4f4]">Enterprise++ Monitoring</h4>
              <p className="text-sm text-[#b3b3b3] mt-1">
                Dieses Dashboard zeigt den Echtzeit-Status des AI Centers. 
                Auto-Refresh aktualisiert die Daten alle 30 Sekunden. 
                Bei kritischen Fehlern wird das System automatisch benachrichtigt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







