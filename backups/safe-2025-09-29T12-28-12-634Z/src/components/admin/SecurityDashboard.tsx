"use client";

import { useEffect, useState } from "react";

interface SecurityThreat {
  id: number;
  type: "brute_force" | "ddos" | "sql_injection" | "xss" | "malware" | "phishing";
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  target: string;
  timestamp: string;
  status: "active" | "blocked" | "investigating" | "resolved";
  description: string;
  attempts: number;
}

interface SecurityStats {
  totalThreats: number;
  activeThreats: number;
  blockedThreats: number;
  criticalThreats: number;
  firewallBlocks: number;
  suspiciousIPs: number;
  last24h: number;
  systemHealth: "excellent" | "good" | "warning" | "critical";
}

export default function SecurityDashboard() {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock-Daten für das Security Dashboard
    const mockThreats: SecurityThreat[] = [
      {
        id: 1,
        type: "brute_force",
        severity: "high",
        source: "192.168.1.100",
        target: "/admin/login",
        timestamp: "2025-06-27 14:30:22",
        status: "blocked",
        description: "Mehrfache fehlgeschlagene Login-Versuche",
        attempts: 15,
      },
      {
        id: 2,
        type: "ddos",
        severity: "critical",
        source: "203.45.67.89",
        target: "Webserver",
        timestamp: "2025-06-27 13:45:10",
        status: "active",
        description: "DDoS-Angriff auf Port 80/443",
        attempts: 1250,
      },
      {
        id: 3,
        type: "sql_injection",
        severity: "medium",
        source: "91.234.56.78",
        target: "/api/users",
        timestamp: "2025-06-27 12:15:33",
        status: "blocked",
        description: "SQL-Injection-Versuch in Benutzerabfrage",
        attempts: 3,
      },
      {
        id: 4,
        type: "xss",
        severity: "low",
        source: "45.67.89.123",
        target: "/contact",
        timestamp: "2025-06-27 11:20:45",
        status: "resolved",
        description: "XSS-Payload in Kontaktformular",
        attempts: 1,
      },
      {
        id: 5,
        type: "phishing",
        severity: "medium",
        source: "phishing-domain.com",
        target: "E-Mail-System",
        timestamp: "2025-06-27 10:05:18",
        status: "investigating",
        description: "Verdächtige E-Mail mit Phishing-Link",
        attempts: 5,
      },
    ];

    const mockStats: SecurityStats = {
      totalThreats: 156,
      activeThreats: 2,
      blockedThreats: 142,
      criticalThreats: 1,
      firewallBlocks: 2347,
      suspiciousIPs: 89,
      last24h: 23,
      systemHealth: "good",
    };

    setThreats(mockThreats);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getThreatIcon = (type: string) => {
    switch (type) {
      case "brute_force":
        return "🔓";
      case "ddos":
        return "⚡";
      case "sql_injection":
        return "💉";
      case "xss":
        return "🎯";
      case "malware":
        return "🦠";
      case "phishing":
        return "🎣";
      default:
        return "⚠️";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-rot";
      case "high":
        return "text-orange";
      case "medium":
        return "text-gelb";
      case "low":
        return "text-gruen";
      default:
        return "text-hellgrau";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-rot";
      case "blocked":
        return "text-gruen";
      case "investigating":
        return "text-gelb";
      case "resolved":
        return "text-akzentblau";
      default:
        return "text-hellgrau";
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-hellgrau">Lade Sicherheitsdaten...</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-rot">Fehler beim Laden der Sicherheitsdaten</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-weiss">Sicherheits-Dashboard</h2>

      {/* Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Aktive Bedrohungen</h3>
          <p className="text-2xl font-bold text-rot">{stats.activeThreats}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Kritische Bedrohungen</h3>
          <p className="text-2xl font-bold text-orange">{stats.criticalThreats}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Firewall-Blocks</h3>
          <p className="text-2xl font-bold text-hauptblau">{stats.firewallBlocks}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Verdächtige IPs</h3>
          <p className="text-2xl font-bold text-gelb">{stats.suspiciousIPs}</p>
        </div>
      </div>

      {/* System-Gesundheit */}
      <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-weiss">System-Gesundheit</h3>
        <div className="flex items-center space-x-4">
          <div
            className={`w-4 h-4 rounded-full ${
              stats.systemHealth === "excellent"
                ? "bg-gruen"
                : stats.systemHealth === "good"
                  ? "bg-akzentblau"
                  : stats.systemHealth === "warning"
                    ? "bg-gelb"
                    : "bg-rot"
            } animate-pulse`}
          ></div>
          <span
            className={`text-lg font-medium ${
              stats.systemHealth === "excellent"
                ? "text-gruen"
                : stats.systemHealth === "good"
                  ? "text-akzentblau"
                  : stats.systemHealth === "warning"
                    ? "text-gelb"
                    : "text-rot"
            }`}
          >
            {stats.systemHealth === "excellent"
              ? "Ausgezeichnet"
              : stats.systemHealth === "good"
                ? "Gut"
                : stats.systemHealth === "warning"
                  ? "Warnung"
                  : "Kritisch"}
          </span>
        </div>
      </div>

      {/* Aktuelle Bedrohungen */}
      <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-weiss">Aktuelle Bedrohungen</h3>
        <div className="space-y-3">
          {threats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-4 backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 hover:bg-weiss/10 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getThreatIcon(threat.type)}</span>
                <div>
                  <p className="text-weiss font-medium">{threat.description}</p>
                  <p className="text-sm text-hellgrau">
                    Von: {threat.source} → {threat.target}
                  </p>
                  <p className="text-xs text-hellgrau">
                    {threat.timestamp} • {threat.attempts} Versuche
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}
                >
                  {threat.severity.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}
                >
                  {threat.status === "active"
                    ? "AKTIV"
                    : threat.status === "blocked"
                      ? "GEBLOCKT"
                      : threat.status === "investigating"
                        ? "UNTERSUCHUNG"
                        : "GELÖST"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schnellaktionen */}
      <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-weiss">Schnellaktionen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-rot to-orange text-weiss rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="font-medium">Firewall verstärken</p>
            </div>
          </button>
          <button className="p-4 bg-gradient-to-r from-hauptblau to-akzentblau text-weiss rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <p className="font-medium">Logs analysieren</p>
            </div>
          </button>
          <button className="p-4 bg-gradient-to-r from-gruen to-akzentblau text-weiss rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <p className="font-medium">System scannen</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
