"use client";

import { useEffect, useState } from "react";
import { FaQuestionCircle, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/help/faq?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setFaqs(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der FAQs");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der FAQs", err);
      setError("Fehler beim Laden der FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, [selectedCategory, searchQuery]);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaQuestionCircle className="mr-2" />
            Häufig gestellte Fragen (FAQ)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Antworten auf häufig gestellte Fragen
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Suche und Filter */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FAQ durchsuchen..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Alle Kategorien --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ-Liste */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Keine FAQs gefunden. Versuchen Sie es mit anderen Suchbegriffen.
            </p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h4>
                  {faq.category && (
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {faq.category}
                    </span>
                  )}
                </div>
                {expandedItems.has(faq.id) ? (
                  <FaChevronUp className="h-5 w-5 text-gray-400 ml-4" />
                ) : (
                  <FaChevronDown className="h-5 w-5 text-gray-400 ml-4" />
                )}
              </button>
              {expandedItems.has(faq.id) && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


