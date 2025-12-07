"use client";

import { useEffect, useState } from "react";
import { 
  FaShieldAlt, FaUsers, FaExclamationTriangle, FaDesktop,
  FaHistory, FaLock, FaUnlock, FaSignOutAlt, FaCheckCircle,
  FaTimesCircle, FaGlobe, FaUserShield, FaKey
} from "react-icons/fa";

interface SecurityDashboardData {
  loginStats: {
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    blockedLogins: number;
    uniqueUsers: number;
    uniqueIPs: number;
    highRiskEvents: number;
  };
  securityStats: {
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    unresolvedEvents: number;
    eventsByType: Record<string, number>;
    topRiskIPs: Array<{ ip: string; count: number }>;
  };
  activeSessions: Array<{
    id: number;
    userId: number;
    username: string;
    email: string;
    ipAddress: string;
    userAgent: string;
    lastActivity: string;
    createdAt: string;
    expiresAt: string;
  }>;
  recentEvents: Array<{
    id: number;
    userId: number;
    eventType: string;
    ipAddress: string;
    riskLevel: string;
    details: any;
    resolved: boolean;
    createdAt: string;
  }>;
  lockedAccounts: Array<{
    id: number;
    user_id: number;
    username: string;
    reason: string;
    locked_at: string;
    locked_until: string;
  }>;
}

export default function SecurityDashboard() {
  const [data, setData] = useState<SecurityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "events" | "devices">("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/security/dashboard", {
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Fehler beim Laden der Security-Daten");
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: number) => {
    if (!confirm("Session wirklich beenden?")) return;
    
    try {
      const response = await fetch("/api/admin/security/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetSessionId: sessionId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        loadData();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Fehler beim Beenden der Session");
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-500 bg-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/20";
      default: return "text-green-500 bg-green-500/20";
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "FAILED_LOGIN": return <FaTimesCircle className="text-red-500" />;
      case "ACCOUNT_LOCKED": return <FaLock className="text-red-500" />;
      case "ACCOUNT_UNLOCKED": return <FaUnlock className="text-green-500" />;
      case "NEW_DEVICE": return <FaDesktop className="text-blue-500" />;
      case "SESSION_TERMINATED": return <FaSignOutAlt className="text-yellow-500" />;
      case "RECOVERY_CODE_USED": return <FaKey className="text-purple-500" />;
      default: return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaShieldAlt className="animate-pulse h-12 w-12 mx-auto mb-4" style={{ color: "#ffd700" }} />
          <p style={{ color: "#b3b3b3" }}>Lade Security-Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#da1e28", color: "#fff" }}>
          <FaExclamationTriangle className="inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="h-8 w-8" style={{ color: "#ffd700" }} />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>
              Security Dashboard
            </h1>
            <p style={{ color: "#b3b3b3" }}>Enterprise++ Sicherheitsüberwachung</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}
        >
          Aktualisieren
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Sessions */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#b3b3b3" }}>Aktive Sessions</p>
              <p className="text-2xl font-bold" style={{ color: "#24a148" }}>
                {data?.activeSessions.length || 0}
              </p>
            </div>
            <FaUsers className="h-8 w-8" style={{ color: "#24a148" }} />
          </div>
        </div>

        {/* Failed Logins */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#b3b3b3" }}>Fehlgeschlagene Logins (7d)</p>
              <p className="text-2xl font-bold" style={{ color: "#da1e28" }}>
                {data?.loginStats.failedLogins || 0}
              </p>
            </div>
            <FaTimesCircle className="h-8 w-8" style={{ color: "#da1e28" }} />
          </div>
        </div>

        {/* High Risk Events */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#b3b3b3" }}>Kritische Events</p>
              <p className="text-2xl font-bold" style={{ color: "#ff832b" }}>
                {(data?.securityStats.criticalEvents || 0) + (data?.securityStats.highEvents || 0)}
              </p>
            </div>
            <FaExclamationTriangle className="h-8 w-8" style={{ color: "#ff832b" }} />
          </div>
        </div>

        {/* Locked Accounts */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#b3b3b3" }}>Gesperrte Accounts</p>
              <p className="text-2xl font-bold" style={{ color: "#8a3ffc" }}>
                {data?.lockedAccounts.length || 0}
              </p>
            </div>
            <FaLock className="h-8 w-8" style={{ color: "#8a3ffc" }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: "#272a33" }}>
        {[
          { id: "overview", label: "Übersicht", icon: FaShieldAlt },
          { id: "sessions", label: "Sessions", icon: FaUsers },
          { id: "events", label: "Events", icon: FaHistory },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#ffd700] text-[#ffd700]"
                : "border-transparent text-[#b3b3b3] hover:text-[#f4f4f4]"
            }`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Login Stats */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
                Login-Statistiken (7 Tage)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: "#b3b3b3" }}>Erfolgreiche Logins</span>
                  <span className="font-semibold" style={{ color: "#24a148" }}>
                    {data?.loginStats.successfulLogins || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#b3b3b3" }}>Fehlgeschlagene Logins</span>
                  <span className="font-semibold" style={{ color: "#da1e28" }}>
                    {data?.loginStats.failedLogins || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#b3b3b3" }}>Blockierte Logins</span>
                  <span className="font-semibold" style={{ color: "#ff832b" }}>
                    {data?.loginStats.blockedLogins || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#b3b3b3" }}>Eindeutige IPs</span>
                  <span className="font-semibold" style={{ color: "#f4f4f4" }}>
                    {data?.loginStats.uniqueIPs || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Risk IPs */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
                <FaGlobe className="inline mr-2" style={{ color: "#da1e28" }} />
                Top Risk-IPs
              </h3>
              {data?.securityStats.topRiskIPs && data.securityStats.topRiskIPs.length > 0 ? (
                <div className="space-y-2">
                  {data.securityStats.topRiskIPs.map((ip, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{ backgroundColor: "#1f2329" }}
                    >
                      <code style={{ color: "#f4f4f4" }}>{ip.ip}</code>
                      <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: "#da1e28", color: "#fff" }}>
                        {ip.count} Events
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#b3b3b3" }}>Keine verdächtigen IPs gefunden ✓</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Aktive Sessions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderColor: "#272a33" }} className="border-b">
                    <th className="text-left p-3" style={{ color: "#b3b3b3" }}>Benutzer</th>
                    <th className="text-left p-3" style={{ color: "#b3b3b3" }}>IP-Adresse</th>
                    <th className="text-left p-3" style={{ color: "#b3b3b3" }}>Letzte Aktivität</th>
                    <th className="text-left p-3" style={{ color: "#b3b3b3" }}>Läuft ab</th>
                    <th className="text-right p-3" style={{ color: "#b3b3b3" }}>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.activeSessions.map((session) => (
                    <tr key={session.id} className="border-b" style={{ borderColor: "#272a33" }}>
                      <td className="p-3">
                        <div>
                          <p style={{ color: "#f4f4f4" }}>{session.username}</p>
                          <p className="text-sm" style={{ color: "#b3b3b3" }}>{session.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <code style={{ color: "#8a3ffc" }}>{session.ipAddress}</code>
                      </td>
                      <td className="p-3" style={{ color: "#b3b3b3" }}>
                        {new Date(session.lastActivity).toLocaleString("de-DE")}
                      </td>
                      <td className="p-3" style={{ color: "#b3b3b3" }}>
                        {new Date(session.expiresAt).toLocaleString("de-DE")}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="px-3 py-1 rounded text-sm transition-colors"
                          style={{ backgroundColor: "#da1e28", color: "#fff" }}
                        >
                          <FaSignOutAlt className="inline mr-1" />
                          Beenden
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Letzte Security Events
            </h3>
            <div className="space-y-3">
              {data?.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg flex items-start gap-3"
                  style={{ backgroundColor: "#1f2329" }}
                >
                  <div className="mt-1">{getEventIcon(event.eventType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium" style={{ color: "#f4f4f4" }}>
                        {event.eventType.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getRiskLevelColor(event.riskLevel)}`}
                      >
                        {event.riskLevel.toUpperCase()}
                      </span>
                      {event.resolved && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-500">
                          <FaCheckCircle className="inline mr-1" />
                          Gelöst
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "#b3b3b3" }}>
                      IP: {event.ipAddress} • User ID: {event.userId || "System"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                      {new Date(event.createdAt).toLocaleString("de-DE")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}















