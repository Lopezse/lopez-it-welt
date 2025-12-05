/**
 * Data Lineage Dashboard - Enterprise++ Standard E.2.6
 * 
 * Zentrale Übersicht für Data Lineage
 */

"use client";

import { useState } from "react";
import { DataLineageViewer } from "@/components/admin/data-lineage/DataLineageViewer";
import { DataLineageExport } from "@/components/admin/data-lineage/DataLineageExport";
import { DataLineageAnalytics } from "@/components/admin/data-lineage/DataLineageAnalytics";

export default function DataLineagePage() {
  const [activeTab, setActiveTab] = useState<"viewer" | "export" | "analytics">("viewer");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Lineage
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enterprise++ Data Lineage-Tracking für Compliance & Nachvollziehbarkeit
        </p>

        {/* Tab-Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("viewer")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "viewer"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "export"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "analytics"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab-Content */}
        {activeTab === "viewer" && <DataLineageViewer />}
        {activeTab === "export" && <DataLineageExport />}
        {activeTab === "analytics" && <DataLineageAnalytics />}
      </div>
    </div>
  );
}



