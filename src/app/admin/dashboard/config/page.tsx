"use client";

import { DashboardConfig } from "@/components/admin/dashboard/DashboardConfig";
import { WidgetManager } from "@/components/admin/dashboard/WidgetManager";
import { useState } from "react";
import { FaCog, FaCubes } from "react-icons/fa";

export default function DashboardConfigPage() {
  const [activeTab, setActiveTab] = useState<"config" | "widgets">("config");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard-Konfiguration
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Widgets und Dashboard-Layouts verwalten
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("config")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "config"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaCog className="inline mr-2" />
              Dashboard-Konfiguration
            </button>
            <button
              onClick={() => setActiveTab("widgets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "widgets"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaCubes className="inline mr-2" />
              Widget-Verwaltung
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "config" && <DashboardConfig />}
        {activeTab === "widgets" && <WidgetManager />}
      </main>
    </div>
  );
}


