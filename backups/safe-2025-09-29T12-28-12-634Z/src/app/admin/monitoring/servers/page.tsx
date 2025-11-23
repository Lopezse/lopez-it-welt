"use client";

import { useEffect, useState } from "react";

interface ServerStatus {
  name: string;
  type: "web" | "database" | "mail" | "file" | "cache";
  status: "online" | "offline" | "warning";
  uptime: string;
  cpu: number;
  ram: number;
  disk: number;
  responseTime: number;
  lastCheck: string;
  ip: string;
  port: number;
}

export default function ServerStatusPage() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Mock-Daten für Server-Status
    const mockServers: ServerStatus[] = [
      {
        name: "Web-Server (Apache)",
        type: "web",
        status: "online",
        uptime: "15 Tage, 7 Stunden",
        cpu: 45,
        ram: 62,
        disk: 78,
        responseTime: 120,
        lastCheck: "vor 30 Sekunden",
        ip: "192.168.1.100",
        port: 80,
      },
      {
        name: "Datenbank (MySQL)",
        type: "database",
        status: "online",
        uptime: "12 Tage, 3 Stunden",
        cpu: 38,
        ram: 45,
        disk: 65,
        responseTime: 85,
        lastCheck: "vor 30 Sekunden",
        ip: "192.168.1.101",
        port: 3306,
      },
      {
        name: "Mail-Server (Postfix)",
        type: "mail",
        status: "online",
        uptime: "8 Tage, 12 Stunden",
        cpu: 22,
        ram: 28,
        disk: 45,
        responseTime: 95,
        lastCheck: "vor 30 Sekunden",
        ip: "192.168.1.102",
        port: 25,
      },
      {
        name: "File-Server (NFS)",
        type: "file",
        status: "warning",
        uptime: "3 Tage, 18 Stunden",
        cpu: 78,
        ram: 85,
        disk: 92,
        responseTime: 250,
        lastCheck: "vor 30 Sekunden",
        ip: "192.168.1.103",
        port: 2049,
      },
      {
        name: "Cache-Server (Redis)",
        type: "cache",
        status: "online",
        uptime: "20 Tage, 5 Stunden",
        cpu: 15,
        ram: 35,
        disk: 25,
        responseTime: 45,
        lastCheck: "vor 30 Sekunden",
        ip: "192.168.1.104",
        port: 6379,
      },
    ];

    setServers(mockServers);
    setLoading(false);
  }, []);

  // Client-seitige Zeit-Updates
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("de-DE"));
    };

    // Initial setzen
    updateTime();

    // Jede Sekunde aktualisieren
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-gruen";
      case "warning":
        return "text-gelb";
      case "offline":
        return "text-rot";
      default:
        return "text-hellgrau";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "online":
        return "bg-gruen/20 border-gruen/30";
      case "warning":
        return "bg-gelb/20 border-gelb/30";
      case "offline":
        return "bg-rot/20 border-rot/30";
      default:
        return "bg-hellgrau/20 border-hellgrau/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "web":
        return "🌐";
      case "database":
        return "🗄️";
      case "mail":
        return "📧";
      case "file":
        return "📁";
      case "cache":
        return "⚡";
      default:
        return "🖥️";
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
                Server-Status Übersicht
              </h1>
              <p className="text-hellgrau text-lg">
                Detaillierte Informationen über alle Server-Komponenten
              </p>
            </div>
            <div className="text-right">
              <div className="backdrop-blur-sm bg-weiss/10 rounded-xl p-4 border border-weiss/20">
                <p className="text-sm text-hellgrau mb-1">Letzte Aktualisierung</p>
                <p className="text-xl font-semibold text-weiss">{currentTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Server-Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105"
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(server.type)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-weiss">{server.name}</h3>
                    <p className="text-sm text-hellgrau">
                      {server.ip}:{server.port}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(server.status)} ${getStatusColor(server.status)}`}
                >
                  {server.status === "online"
                    ? "Online"
                    : server.status === "warning"
                      ? "Warnung"
                      : "Offline"}
                </div>
              </div>

              {/* Server Details */}
              <div className="space-y-4">
                {/* Uptime */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-hellgrau">Uptime:</span>
                  <span className="text-sm text-weiss font-medium">{server.uptime}</span>
                </div>

                {/* Response Time */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-hellgrau">Antwortzeit:</span>
                  <span
                    className={`text-sm font-medium ${server.responseTime < 100 ? "text-gruen" : server.responseTime < 200 ? "text-gelb" : "text-rot"}`}
                  >
                    {server.responseTime}ms
                  </span>
                </div>

                {/* Performance Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-hellgrau mb-1">
                      <span>CPU</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="w-full bg-weiss/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          server.cpu > 80
                            ? "bg-gradient-to-r from-rot to-orange"
                            : server.cpu > 60
                              ? "bg-gradient-to-r from-gelb to-orange"
                              : "bg-gradient-to-r from-gruen to-akzentblau"
                        }`}
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-hellgrau mb-1">
                      <span>RAM</span>
                      <span>{server.ram}%</span>
                    </div>
                    <div className="w-full bg-weiss/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          server.ram > 80
                            ? "bg-gradient-to-r from-rot to-orange"
                            : server.ram > 60
                              ? "bg-gradient-to-r from-gelb to-orange"
                              : "bg-gradient-to-r from-gruen to-akzentblau"
                        }`}
                        style={{ width: `${server.ram}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-hellgrau mb-1">
                      <span>Festplatte</span>
                      <span>{server.disk}%</span>
                    </div>
                    <div className="w-full bg-weiss/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          server.disk > 90
                            ? "bg-gradient-to-r from-rot to-orange"
                            : server.disk > 80
                              ? "bg-gradient-to-r from-gelb to-orange"
                              : "bg-gradient-to-r from-gruen to-akzentblau"
                        }`}
                        style={{ width: `${server.disk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Last Check */}
                <div className="pt-2 border-t border-weiss/10">
                  <p className="text-xs text-hellgrau text-center">
                    Letzte Prüfung: {server.lastCheck}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Overview */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-weiss mb-6">System-Übersicht</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 backdrop-blur-sm bg-gruen/10 rounded-xl border border-gruen/20">
              <div className="text-3xl font-bold text-gruen">
                {servers.filter((s) => s.status === "online").length}
              </div>
              <div className="text-sm text-hellgrau">Online</div>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-gelb/10 rounded-xl border border-gelb/20">
              <div className="text-3xl font-bold text-gelb">
                {servers.filter((s) => s.status === "warning").length}
              </div>
              <div className="text-sm text-hellgrau">Warnungen</div>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-rot/10 rounded-xl border border-rot/20">
              <div className="text-3xl font-bold text-rot">
                {servers.filter((s) => s.status === "offline").length}
              </div>
              <div className="text-sm text-hellgrau">Offline</div>
            </div>
            <div className="text-center p-4 backdrop-blur-sm bg-akzentblau/10 rounded-xl border border-akzentblau/20">
              <div className="text-3xl font-bold text-akzentblau">{servers.length}</div>
              <div className="text-sm text-hellgrau">Gesamt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
