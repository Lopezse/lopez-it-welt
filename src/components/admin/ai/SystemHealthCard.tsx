"use client";

// =====================================================
// SYSTEM HEALTH CARD - Enterprise++ UI Component
// =====================================================

import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaDatabase,
  FaRobot,
  FaListAlt,
  FaShieldAlt,
  FaBrain,
  FaSpinner
} from "react-icons/fa";

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

interface SystemHealthCardProps {
  overallStatus: "healthy" | "degraded" | "unhealthy";
  components: ComponentHealth[];
  uptimeSeconds: number;
  isLoading?: boolean;
}

// =====================================================
// HELPER
// =====================================================

const STATUS_CONFIG = {
  healthy: { 
    icon: FaCheckCircle, 
    color: "text-green-400", 
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    label: "Operational"
  },
  degraded: { 
    icon: FaExclamationTriangle, 
    color: "text-yellow-400", 
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    label: "Eingeschränkt"
  },
  unhealthy: { 
    icon: FaTimesCircle, 
    color: "text-red-400", 
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    label: "Kritisch"
  },
  unknown: { 
    icon: FaExclamationTriangle, 
    color: "text-gray-400", 
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
    label: "Unbekannt"
  }
};

const COMPONENT_ICONS: Record<string, typeof FaDatabase> = {
  "Database": FaDatabase,
  "Agent Registry": FaRobot,
  "Task Queue": FaListAlt,
  "DSGVO Decision Engine": FaShieldAlt,
  "AI Provider": FaBrain
};

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// =====================================================
// KOMPONENTE
// =====================================================

export function SystemHealthCard({ 
  overallStatus, 
  components, 
  uptimeSeconds,
  isLoading = false 
}: SystemHealthCardProps) {
  const config = STATUS_CONFIG[overallStatus];
  const StatusIcon = config.icon;
  
  if (isLoading) {
    return (
      <div className="bg-[#111217] border border-[#272a33] rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-[#111217] border ${config.borderColor} rounded-xl p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${config.bgColor} rounded-lg`}>
            <StatusIcon className={`h-6 w-6 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-[#f4f4f4]">System Health</h3>
            <p className={`text-sm ${config.color}`}>{config.label}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#b3b3b3]">Uptime</div>
          <div className="text-sm font-medium text-[#f4f4f4]">
            {formatUptime(uptimeSeconds)}
          </div>
        </div>
      </div>
      
      {/* Komponenten-Status */}
      <div className="space-y-3">
        {components.map((component) => {
          const compConfig = STATUS_CONFIG[component.status];
          const CompStatusIcon = compConfig.icon;
          const ComponentIcon = COMPONENT_ICONS[component.name] || FaBrain;
          
          return (
            <div 
              key={component.name}
              className="flex items-center justify-between p-3 bg-[#0a0a0e] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <ComponentIcon className="h-4 w-4 text-[#b3b3b3]" />
                <div>
                  <div className="text-sm font-medium text-[#f4f4f4]">
                    {component.name}
                  </div>
                  {component.details && (
                    <div className="text-xs text-[#b3b3b3]">
                      {component.details}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {component.latency_ms !== null && (
                  <span className="text-xs text-[#b3b3b3]">
                    {component.latency_ms}ms
                  </span>
                )}
                <CompStatusIcon className={`h-4 w-4 ${compConfig.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SystemHealthCard;







