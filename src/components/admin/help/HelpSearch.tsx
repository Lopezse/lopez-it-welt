"use client";

import { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface SearchResult {
  title: string;
  path: string;
  category: string;
  excerpt: string;
  relevance: number;
}

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await fetch(`/api/admin/help/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();

      if (result.success) {
        setResults(result.data.results || []);
      } else {
        setError(result.message || "Fehler bei der Suche");
      }
    } catch (err) {
      logger.error("Fehler bei der Hilfe-Suche", err);
      setError("Fehler bei der Suche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen Sie in der Dokumentation..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <FaSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <FaSearch className="h-4 w-4" />
          )}
          <span>Suchen</span>
        </button>
      </form>

      {error && <ErrorBanner message={error} />}

      {hasSearched && !loading && (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {results.length} Ergebnis{results.length !== 1 ? "se" : ""} gefunden
          </p>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer"
                  onClick={() => {
                    // Navigate to document
                    const pathParts = result.path.split("/");
                    const category = pathParts[pathParts.length - 2];
                    const file = pathParts[pathParts.length - 1].replace(".md", "");
                    window.location.href = `/admin/help?category=${category}&file=${file}`;
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {result.title}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {result.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {result.excerpt}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Relevanz: {result.relevance}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Keine Ergebnisse gefunden. Versuchen Sie es mit anderen Suchbegriffen.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


