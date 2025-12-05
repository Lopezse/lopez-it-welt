"use client";

import { useState, useEffect } from "react";
import { FaBook, FaQuestionCircle, FaGraduationCap, FaSearch } from "react-icons/fa";
import { HelpViewer } from "@/components/admin/help/HelpViewer";
import { HelpSearch } from "@/components/admin/help/HelpSearch";
import { FAQ } from "@/components/admin/help/FAQ";
import { Tutorials } from "@/components/admin/help/Tutorials";
import { useSearchParams } from "next/navigation";

export default function HelpPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const file = searchParams.get("file");
  const [activeTab, setActiveTab] = useState<"search" | "docs" | "faq" | "tutorials">(
    category && file ? "docs" : "search",
  );
  const [showDocViewer, setShowDocViewer] = useState(!!(category && file));

  useEffect(() => {
    if (category && file) {
      setActiveTab("docs");
      setShowDocViewer(true);
    }
  }, [category, file]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hilfe & Dokumentation</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Dokumentation, Tutorials und häufig gestellte Fragen
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
              onClick={() => {
                setActiveTab("search");
                setShowDocViewer(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaSearch className="inline mr-2" />
              Suche
            </button>
            <button
              onClick={() => {
                setActiveTab("docs");
                setShowDocViewer(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "docs"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaBook className="inline mr-2" />
              Dokumentation
            </button>
            <button
              onClick={() => {
                setActiveTab("faq");
                setShowDocViewer(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "faq"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaQuestionCircle className="inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => {
                setActiveTab("tutorials");
                setShowDocViewer(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tutorials"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaGraduationCap className="inline mr-2" />
              Tutorials
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "search" && <HelpSearch />}
        {activeTab === "docs" && (
          <HelpViewer
            category={category || undefined}
            file={file || undefined}
            onBack={() => setShowDocViewer(false)}
          />
        )}
        {activeTab === "faq" && <FAQ />}
        {activeTab === "tutorials" && <Tutorials />}
      </main>
    </div>
  );
}


