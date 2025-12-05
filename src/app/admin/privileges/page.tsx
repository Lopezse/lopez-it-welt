"use client";

import { useState } from "react";
import { FaShieldAlt, FaTable, FaHistory, FaExclamationTriangle } from "react-icons/fa";
import { PrivilegeManager } from "@/components/admin/privileges/PrivilegeManager";
import { PrivilegeMatrix } from "@/components/admin/privileges/PrivilegeMatrix";
import { PrivilegeAudit } from "@/components/admin/privileges/PrivilegeAudit";
import { PrivilegeConflictDetector } from "@/components/admin/privileges/PrivilegeConflictDetector";

export default function PrivilegesPage() {
  const [activeTab, setActiveTab] = useState<
    "manage" | "matrix" | "audit" | "conflicts"
  >("manage");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin-Privilegien
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Privilegien verwalten, zuweisen und überwachen
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
              onClick={() => setActiveTab("manage")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "manage"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaShieldAlt className="inline mr-2" />
              Verwaltung
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "matrix"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaTable className="inline mr-2" />
              Matrix
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "audit"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaHistory className="inline mr-2" />
              Audit
            </button>
            <button
              onClick={() => setActiveTab("conflicts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "conflicts"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaExclamationTriangle className="inline mr-2" />
              Konflikte
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "manage" && <PrivilegeManager />}
        {activeTab === "matrix" && <PrivilegeMatrix />}
        {activeTab === "audit" && <PrivilegeAudit />}
        {activeTab === "conflicts" && <PrivilegeConflictDetector />}
      </main>
    </div>
  );
}


