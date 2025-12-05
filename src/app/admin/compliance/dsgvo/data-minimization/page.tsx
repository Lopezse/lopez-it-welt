/**
 * Data Minimization Status Page - Enterprise++ Standard E.2.1
 */

"use client";

import { DataMinimizationStatus } from "@/components/admin/compliance/dsgvo/DataMinimizationStatus";

export default function DataMinimizationStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data-Minimization-Status
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Überwachung der Data-Minimization-Compliance
        </p>
        <DataMinimizationStatus />
      </div>
    </div>
  );
}



