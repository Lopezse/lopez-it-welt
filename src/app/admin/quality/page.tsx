"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChartLine, FaFileAlt } from "react-icons/fa";
import { QualityMetrics } from "@/components/admin/quality/QualityMetrics";
import { QualityReports } from "@/components/admin/quality/QualityReports";

export default function QualityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"metrics" | "reports">("metrics");
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // WICHTIG: adm_session Cookie wird automatisch mit credentials: "include" gesendet
        const response = await fetch("/api/auth/admin/me", {
          credentials: "include",
        });

        if (!response.ok) {
          // Redirect mit return-Parameter, damit Benutzer nach Login zurückkommt
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/quality")}`);
          return;
        }

        const data = await response.json();
        if (data.success && data.data?.roles) {
          const roles = data.data.roles;
          if (roles.includes("Owner") || roles.includes("Admin") || roles.includes("admin") || roles.includes("Super Admin")) {
            setHasAccess(true);
          } else {
            router.push("/admin");
            return;
          }
        } else {
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/quality")}`);
          return;
        }
      } catch (error) {
        console.error("Fehler bei Zugriffsprüfung:", error);
        router.push(`/admin/login?redirect=${encodeURIComponent("/admin/quality")}`);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    // Render nothing or a minimal loader while checking access
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade Qualitäts-Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Qualitäts-Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Qualitäts-Metriken und Berichte
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("metrics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "metrics"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaChartLine className="inline mr-2" />
              Metriken
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaFileAlt className="inline mr-2" />
              Berichte
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "metrics" && <QualityMetrics />}
        {activeTab === "reports" && <QualityReports />}
      </main>
    </div>
  );
}
