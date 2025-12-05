/**
 * GoBD Compliance Dashboard - Enterprise++ Standard E.2.2
 * 
 * Zentrale Übersicht für GoBD-Compliance
 */

"use client";

import { GoBDComplianceStatus } from "@/components/admin/compliance/gobd/GoBDComplianceStatus";
import { GoBDVerification } from "@/components/admin/compliance/gobd/GoBDVerification";
import { GoBDReports } from "@/components/admin/compliance/gobd/GoBDReports";
import { HashVerification } from "@/components/admin/compliance/gobd/HashVerification";
import { GoBDBackupCompliance } from "@/components/admin/compliance/gobd/GoBDBackupCompliance";
import { useState } from "react";

export default function GoBDCompliancePage() {
  const [activeTab, setActiveTab] = useState<"status" | "verification" | "reports" | "hash" | "backups">("status");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          GoBD-Compliance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Übersicht über GoBD-Compliance, Hash-Verifikation und Compliance-Berichte
        </p>

        {/* Tab-Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("status")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "status"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setActiveTab("verification")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "verification"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Verifikation
            </button>
            <button
              onClick={() => setActiveTab("hash")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "hash"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Hash-Verifikation
            </button>
            <button
              onClick={() => setActiveTab("backups")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "backups"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Backups
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "reports"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Berichte
            </button>
          </nav>
        </div>

        {/* Tab-Content */}
        <div>
          {activeTab === "status" && <GoBDComplianceStatus />}
          {activeTab === "verification" && <GoBDVerification />}
          {activeTab === "hash" && <HashVerification />}
          {activeTab === "backups" && <GoBDBackupCompliance />}
          {activeTab === "reports" && <GoBDReports />}
        </div>
      </div>
    </div>
  );
}



