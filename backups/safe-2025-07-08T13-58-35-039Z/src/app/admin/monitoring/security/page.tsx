"use client";

import { useEffect, useState } from "react";

interface SecurityEvent {
  id: string;
  type: "attack" | "intrusion" | "malware" | "suspicious" | "firewall";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  source: string;
  target: string;
  timestamp: string;
  status: "active" | "resolved" | "investigating";
}

interface SecurityStats {
  totalAttacks: number;
  blockedAttacks: number;
  activeThreats: number;
  firewallRules: number;
  lastScan: string;
  vulnerabilities: number;
}

export default function SecurityOverviewPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalAttacks: 0,
    blockedAttacks: 0,
    activeThreats: 0,
    firewallRules: 0,
    lastScan: "",
    vulnerabilities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock-Daten für Security-Events
    const mockEvents: SecurityEvent[] = [
      {
        id: "1",
        type: "attack",
        severity: "high",
        description: "Brute-Force-Angriff auf SSH-Port",
        source: "185.220.101.45",
        target: "192.168.1.100:22",
        timestamp: "2025-01-27 14:32:15",
        status: "resolved",
      },
      {
        id: "2",
        type: "intrusion",
        severity: "critical",
        description: "Verdächtige SQL-Injection-Aktivität",
        source: "91.200.12.78",
        target: "192.168.1.100:80",
        timestamp: "2025-01-27 13:45:22",
        status: "investigating",
      },
      {
        id: "3",
        type: "malware",
        severity: "medium",
        description: "Malware-Signatur erkannt",
        source: "45.67.89.123",
        target: "192.168.1.102:25",
        timestamp: "2025-01-27 12:18:45",
        status: "resolved",
      },
      {
        id: "4",
        type: "firewall",
        severity: "low",
        description: "Firewall-Regel blockiert verdächtigen Traffic",
        source: "203.45.67.89",
        target: "192.168.1.100:443",
        timestamp: "2025-01-27 11:55:30",
        status: "active",
      },
      {
        id: "5",
        type: "suspicious",
        severity: "medium",
        description: "Ungewöhnliche Anzahl von Login-Versuchen",
        source: "78.90.123.45",
        target: "192.168.1.101:3306",
        timestamp: "2025-01-27 10:22:18",
        status: "investigating",
      },
    ];

    const mockStats: SecurityStats = {
      totalAttacks: 1247,
      blockedAttacks: 1198,
      activeThreats: 3,
      firewallRules: 156,
      lastScan: "2025-01-27 15:00:00",
      vulnerabilities: 7,
    };

    setEvents(mockEvents);
    setStats(mockStats);
    setLoading(false);
  }, []);

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

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rot/20 border-rot/30";
      case "high":
        return "bg-orange/20 border-orange/30";
      case "medium":
        return "bg-gelb/20 border-gelb/30";
      case "low":
        return "bg-gruen/20 border-gruen/30";
      default:
        return "bg-hellgrau/20 border-hellgrau/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attack":
        return "⚔️";
      case "intrusion":
        return "🚪";
      case "malware":
        return "🦠";
      case "suspicious":
        return "👁️";
      case "firewall":
        return "🛡️";
      default:
        return "⚠️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-rot";
      case "investigating":
        return "text-gelb";
      case "resolved":
        return "text-gruen";
      default:
        return "text-hellgrau";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-hauptblau border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute -inset-1 bg-hauptblau rounded-full blur opacity-25 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gelb rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-weiss to-hellgrau bg-clip-text text-transparent mb-2">
                Security-Übersicht
              </h1>
              <p className="text-hellgrau text-lg">Sicherheitsüberwachung und Bedrohungsanalyse</p>
            </div>
            <div className="text-right">
              <div className="backdrop-blur-sm bg-weiss/10 rounded-xl p-4 border border-weiss/20">
                <p className="text-sm text-hellgrau mb-1">Letzter Security-Scan</p>
                <p className="text-xl font-semibold text-weiss">{stats.lastScan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-weiss">Angriffe (24h)</h3>
              <span className="text-2xl">⚔️</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-hellgrau">Gesamt:</span>
                <span className="text-weiss font-bold">{stats.totalAttacks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hellgrau">Blockiert:</span>
                <span className="text-gruen font-bold">{stats.blockedAttacks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hellgrau">Erfolgsrate:</span>
                <span className="text-akzentblau font-bold">
                  {Math.round((stats.blockedAttacks / stats.totalAttacks) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-weiss">Aktive Bedrohungen</h3>
              <span className="text-2xl">🚨</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-hellgrau">Aktuell:</span>
                <span
                  className={`font-bold ${stats.activeThreats > 0 ? "text-rot" : "text-gruen"}`}
                >
                  {stats.activeThreats}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hellgrau">Vulnerabilities:</span>
                <span
                  className={`font-bold ${stats.vulnerabilities > 5 ? "text-rot" : stats.vulnerabilities > 2 ? "text-gelb" : "text-gruen"}`}
                >
                  {stats.vulnerabilities}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hellgrau">Firewall-Regeln:</span>
                <span className="text-akzentblau font-bold">{stats.firewallRules}</span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-weiss">Security-Score</h3>
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-gruen mb-2">85%</div>
                <div className="w-full bg-weiss/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gruen to-akzentblau h-3 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="text-center text-sm text-hellgrau">Gute Sicherheitslage</div>
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-weiss mb-6">Aktuelle Security-Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 p-4 hover:bg-weiss/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getTypeIcon(event.type)}</span>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-weiss">{event.description}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(event.severity)} ${getSeverityColor(event.severity)}`}
                        >
                          {event.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-hellgrau space-y-1">
                        <div>
                          Quelle: <span className="text-weiss">{event.source}</span>
                        </div>
                        <div>
                          Ziel: <span className="text-weiss">{event.target}</span>
                        </div>
                        <div>
                          Zeit: <span className="text-weiss">{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
                    >
                      {event.status === "active"
                        ? "Aktiv"
                        : event.status === "investigating"
                          ? "Untersuchung"
                          : "Gelöst"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-weiss mb-6">Security-Empfehlungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-sm bg-gelb/10 rounded-xl border border-gelb/20 p-4">
              <h3 className="text-lg font-bold text-gelb mb-2">⚠️ Kritische Vulnerabilities</h3>
              <p className="text-sm text-hellgrau mb-3">7 kritische Sicherheitslücken gefunden</p>
              <button className="bg-gelb text-dunkelgrau px-4 py-2 rounded-lg font-medium hover:bg-gelb/80 transition-colors">
                Jetzt patchen
              </button>
            </div>
            <div className="backdrop-blur-sm bg-akzentblau/10 rounded-xl border border-akzentblau/20 p-4">
              <h3 className="text-lg font-bold text-akzentblau mb-2">🛡️ Firewall-Optimierung</h3>
              <p className="text-sm text-hellgrau mb-3">156 aktive Firewall-Regeln</p>
              <button className="bg-akzentblau text-weiss px-4 py-2 rounded-lg font-medium hover:bg-akzentblau/80 transition-colors">
                Regeln überprüfen
              </button>
            </div>
            <div className="backdrop-blur-sm bg-gruen/10 rounded-xl border border-gruen/20 p-4">
              <h3 className="text-lg font-bold text-gruen mb-2">✅ Backup-Status</h3>
              <p className="text-sm text-hellgrau mb-3">Alle Backups erfolgreich</p>
              <button className="bg-gruen text-dunkelgrau px-4 py-2 rounded-lg font-medium hover:bg-gruen/80 transition-colors">
                Details anzeigen
              </button>
            </div>
            <div className="backdrop-blur-sm bg-orange/10 rounded-xl border border-orange/20 p-4">
              <h3 className="text-lg font-bold text-orange mb-2">🔍 Monitoring</h3>
              <p className="text-sm text-hellgrau mb-3">3 aktive Bedrohungen</p>
              <button className="bg-orange text-weiss px-4 py-2 rounded-lg font-medium hover:bg-orange/80 transition-colors">
                Untersuchen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
