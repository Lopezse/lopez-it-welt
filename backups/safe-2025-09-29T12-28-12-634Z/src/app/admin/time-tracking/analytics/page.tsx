"use client";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { TimeSession } from "../../../../lib/time-tracking-types";

interface TimeStats {
  totalSessions: number;
  activeSessions: number;
  totalTime: number;
  todayTime: number;
  statusStats: {
    active: number;
    completed: number;
    interrupted: number;
  };
  categoryStats: { [key: string]: number };
  problemStats: { [key: string]: number };
  moduleStats: { [key: string]: number };
  ausloeserStats: { [key: string]: number };
  avgDuration: number;
  successRate: number;
}

interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  category: string;
  status: string;
  module: string;
}

export default function TimeTrackingAnalyticsPage() {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [stats, setStats] = useState<TimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    category: "",
    status: "",
    module: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, statsRes] = await Promise.all([
        fetch("/api/admin/time-tracking/sessions"),
        fetch("/api/admin/time-tracking/stats"),
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilteredSessions = () => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.start_time);
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);

      return (
        sessionDate >= fromDate &&
        sessionDate <= toDate &&
        (!filters.category || session.category === filters.category) &&
        (!filters.status || session.status === filters.status) &&
        (!filters.module || session.module === filters.module)
      );
    });
  };

  const getWeeklyData = () => {
    const filteredSessions = getFilteredSessions();
    const weekDays = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    const weeklyData = weekDays.map((day) => ({ day, time: 0, sessions: 0 }));

    filteredSessions.forEach((session) => {
      if (session.duration_minutes) {
        const dayOfWeek = new Date(session.start_time).getDay();
        weeklyData[dayOfWeek].time += session.duration_minutes;
        weeklyData[dayOfWeek].sessions += 1;
      }
    });

    return weeklyData;
  };

  const getCategoryData = () => {
    const filteredSessions = getFilteredSessions();
    const categoryData: { [key: string]: number } = {};

    filteredSessions.forEach((session) => {
      if (session.duration_minutes) {
        categoryData[session.category] =
          (categoryData[session.category] || 0) + session.duration_minutes;
      }
    });

    return Object.entries(categoryData)
      .map(([category, time]) => ({ category, time }))
      .sort((a, b) => b.time - a.time);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Analytics-Daten...</p>
        </div>
      </div>
    );
  }

  const filteredSessions = getFilteredSessions();
  const weeklyData = getWeeklyData();
  const categoryData = getCategoryData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Zeiterfassung Analytics</h1>
        <p className="text-gray-600">Detaillierte Analysen und Statistiken Ihrer Arbeitszeit</p>
      </div>

      {/* Filter */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Von</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bis</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle</option>
              <option value="development">Entwicklung</option>
              <option value="bugfix">Bugfix</option>
              <option value="planning">Planung</option>
              <option value="testing">Testing</option>
              <option value="documentation">Dokumentation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle</option>
              <option value="active">Aktiv</option>
              <option value="completed">Abgeschlossen</option>
              <option value="interrupted">Unterbrochen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modul</label>
            <select
              value={filters.module}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle</option>
              {Object.keys(stats?.moduleStats || {}).map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gefilterte Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gesamtzeit</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(
                  filteredSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ø Dauer</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSessions.length > 0
                  ? formatDuration(
                      Math.round(
                        filteredSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) /
                          filteredSessions.length,
                      ),
                    )
                  : "0h 0min"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Erfolgsrate</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSessions.length > 0
                  ? Math.round(
                      (filteredSessions.filter((s) => s.status === "completed").length /
                        filteredSessions.length) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Wöchentliche Verteilung</h3>
        <div className="space-y-3">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700">{day.day}</div>
              <div className="flex-1 ml-4">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        weeklyData.reduce((max, d) => Math.max(max, d.time), 0) > 0
                          ? (day.time / weeklyData.reduce((max, d) => Math.max(max, d.time), 0)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-600 w-20 text-right">
                {formatDuration(day.time)}
              </div>
              <div className="ml-2 text-sm text-gray-500 w-12 text-right">({day.sessions})</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Analysis */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Zeitverteilung nach Kategorien</h3>
        <div className="space-y-3">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                {item.category}
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        categoryData.reduce((max, d) => Math.max(max, d.time), 0) > 0
                          ? (item.time /
                              categoryData.reduce((max, d) => Math.max(max, d.time), 0)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-600 w-20 text-right">
                {formatDuration(item.time)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Sessions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detaillierte Sessions</h3>
        {filteredSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Keine Sessions im gewählten Zeitraum</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tätigkeit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dauer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions
                  .sort(
                    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
                  )
                  .map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.module}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.taetigkeit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(session.start_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.duration_minutes ? formatDuration(session.duration_minutes) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : session.status === "active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {session.status === "completed"
                            ? "Abgeschlossen"
                            : session.status === "active"
                              ? "Aktiv"
                              : "Unterbrochen"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {session.category}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
