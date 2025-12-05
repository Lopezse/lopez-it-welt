"use client";

import { ChecklistManager } from "@/components/admin/release/ChecklistManager";

export default function ReleaseChecklistPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pre-Release Checklisten
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Checklisten für Releases verwalten
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChecklistManager />
      </main>
    </div>
  );
}
