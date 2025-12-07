"use client";

// =====================================================
// MONITORING CARDS - Enterprise++ UI Components
// =====================================================

import { 
  FaRobot,
  FaTasks,
  FaEuroSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaChartLine,
  FaBolt
} from "react-icons/fa";

// =====================================================
// AGENT STATUS CARD
// =====================================================

interface AgentStatusCardProps {
  total: number;
  active: number;
  inactive: number;
  isLoading?: boolean;
}

export function AgentStatusCard({ total, active, inactive, isLoading }: AgentStatusCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-[#272a33] rounded w-20 mb-2" />
        <div className="h-8 bg-[#272a33] rounded w-12 mb-1" />
        <div className="h-3 bg-[#272a33] rounded w-24" />
      </div>
    );
  }
  
  const healthPercent = total > 0 ? Math.round((active / total) * 100) : 100;
  
  return (
    <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-sm">Agenten</span>
        <FaRobot className="h-4 w-4 text-[#ffd700]" />
      </div>
      <div className="text-2xl font-bold text-[#f4f4f4]">{active}/{total}</div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1.5 bg-[#272a33] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${healthPercent >= 80 ? 'bg-green-400' : healthPercent >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <span className="text-xs text-[#b3b3b3]">{healthPercent}%</span>
      </div>
    </div>
  );
}

// =====================================================
// TASKS TODAY CARD
// =====================================================

interface TasksTodayCardProps {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  pending: number;
  isLoading?: boolean;
}

export function TasksTodayCard({ total, completed, failed, inProgress, pending, isLoading }: TasksTodayCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-[#272a33] rounded w-24 mb-2" />
        <div className="h-8 bg-[#272a33] rounded w-12 mb-1" />
        <div className="h-3 bg-[#272a33] rounded w-32" />
      </div>
    );
  }
  
  return (
    <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-sm">Tasks heute</span>
        <FaTasks className="h-4 w-4 text-blue-400" />
      </div>
      <div className="text-2xl font-bold text-[#f4f4f4]">{total}</div>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1 text-green-400">
          <FaCheckCircle className="h-3 w-3" /> {completed}
        </span>
        <span className="flex items-center gap-1 text-yellow-400">
          <FaSpinner className="h-3 w-3" /> {inProgress}
        </span>
        <span className="flex items-center gap-1 text-[#b3b3b3]">
          <FaClock className="h-3 w-3" /> {pending}
        </span>
        {failed > 0 && (
          <span className="flex items-center gap-1 text-red-400">
            <FaTimesCircle className="h-3 w-3" /> {failed}
          </span>
        )}
      </div>
    </div>
  );
}

// =====================================================
// COSTS CARD
// =====================================================

interface CostsCardProps {
  today: number;
  week: number;
  month: number;
  limitDaily: number;
  limitMonthly: number;
  isLoading?: boolean;
}

export function CostsCard({ today, week, month, limitDaily, limitMonthly, isLoading }: CostsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-[#272a33] rounded w-20 mb-2" />
        <div className="h-8 bg-[#272a33] rounded w-16 mb-1" />
        <div className="h-3 bg-[#272a33] rounded w-28" />
      </div>
    );
  }
  
  const dailyPercent = Math.min(100, Math.round((today / limitDaily) * 100));
  const isOverBudget = today > limitDaily * 0.8;
  
  return (
    <div className={`bg-[#111217] border rounded-xl p-4 ${isOverBudget ? 'border-yellow-400/50' : 'border-[#272a33]'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-sm">Kosten heute</span>
        <FaEuroSign className={`h-4 w-4 ${isOverBudget ? 'text-yellow-400' : 'text-green-400'}`} />
      </div>
      <div className="text-2xl font-bold text-[#f4f4f4]">{today.toFixed(2)} €</div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1.5 bg-[#272a33] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${dailyPercent >= 80 ? 'bg-red-400' : dailyPercent >= 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
        <span className="text-xs text-[#b3b3b3]">{limitDaily}€</span>
      </div>
      <div className="flex justify-between mt-2 text-xs text-[#b3b3b3]">
        <span>Woche: {week.toFixed(2)}€</span>
        <span>Monat: {month.toFixed(2)}€</span>
      </div>
    </div>
  );
}

// =====================================================
// PERFORMANCE CARD
// =====================================================

interface PerformanceCardProps {
  avgDurationMs: number;
  tasksPerHour: number;
  successRate: number;
  isLoading?: boolean;
}

export function PerformanceCard({ avgDurationMs, tasksPerHour, successRate, isLoading }: PerformanceCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-[#272a33] rounded w-24 mb-2" />
        <div className="h-8 bg-[#272a33] rounded w-16 mb-1" />
        <div className="h-3 bg-[#272a33] rounded w-20" />
      </div>
    );
  }
  
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms / 60000)}m`;
  };
  
  return (
    <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-sm">Performance</span>
        <FaBolt className="h-4 w-4 text-purple-400" />
      </div>
      <div className="text-2xl font-bold text-[#f4f4f4]">{successRate}%</div>
      <div className="text-xs text-green-400 mb-2">Erfolgsrate</div>
      <div className="flex justify-between text-xs text-[#b3b3b3]">
        <span>Ø {formatDuration(avgDurationMs)}</span>
        <span>{tasksPerHour} Tasks/h</span>
      </div>
    </div>
  );
}

// =====================================================
// RECENT ACTIVITY CARD
// =====================================================

interface RecentActivityCardProps {
  lastTaskAt: string | null;
  lastErrorAt: string | null;
  errorsToday: number;
  isLoading?: boolean;
}

export function RecentActivityCard({ lastTaskAt, lastErrorAt, errorsToday, isLoading }: RecentActivityCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-[#272a33] rounded w-28 mb-2" />
        <div className="h-8 bg-[#272a33] rounded w-20 mb-1" />
        <div className="h-3 bg-[#272a33] rounded w-32" />
      </div>
    );
  }
  
  const formatTimeAgo = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Gerade eben";
    if (diffMins < 60) return `Vor ${diffMins} Min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Vor ${diffHours} Std`;
    return `Vor ${Math.floor(diffHours / 24)} Tagen`;
  };
  
  return (
    <div className={`bg-[#111217] border rounded-xl p-4 ${errorsToday > 5 ? 'border-red-400/50' : 'border-[#272a33]'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#b3b3b3] text-sm">Aktivität</span>
        <FaChartLine className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#b3b3b3]">Letzter Task</span>
          <span className="text-xs text-[#f4f4f4]">{formatTimeAgo(lastTaskAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#b3b3b3]">Fehler heute</span>
          <span className={`text-xs font-medium ${errorsToday > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {errorsToday}
          </span>
        </div>
        {errorsToday > 0 && lastErrorAt && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#b3b3b3]">Letzter Fehler</span>
            <span className="text-xs text-red-400">{formatTimeAgo(lastErrorAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// SYSTEM STATUS BADGE
// =====================================================

interface SystemStatusBadgeProps {
  status: "operational" | "degraded" | "down";
}

export function SystemStatusBadge({ status }: SystemStatusBadgeProps) {
  const config = {
    operational: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30", label: "Operational", icon: FaCheckCircle },
    degraded: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", label: "Eingeschränkt", icon: FaExclamationTriangle },
    down: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", label: "Offline", icon: FaTimesCircle }
  }[status];
  
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${config.bg} border ${config.border} rounded-lg`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

export default {
  AgentStatusCard,
  TasksTodayCard,
  CostsCard,
  PerformanceCard,
  RecentActivityCard,
  SystemStatusBadge
};







