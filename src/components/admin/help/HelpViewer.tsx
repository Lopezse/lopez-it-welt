"use client";

import { useEffect, useState } from "react";
import { FaBook, FaSearch, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import ReactMarkdown from "react-markdown";

// Markdown-Rendering-Funktion
function renderMarkdown(content: string): string {
  // Einfache Markdown-zu-HTML-Konvertierung für dangerouslySetInnerHTML
  // Für komplexere Fälle sollte ReactMarkdown direkt verwendet werden
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>');
}

interface DocFile {
  name: string;
  title: string;
  path: string;
}

interface DocCategory {
  [category: string]: DocFile[];
}

interface HelpViewerProps {
  category?: string;
  file?: string;
  onBack?: () => void;
}

export function HelpViewer({ category, file, onBack }: HelpViewerProps) {
  const [categories, setCategories] = useState<DocCategory>({});
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [selectedFile, setSelectedFile] = useState<string | undefined>(file);
  const [docContent, setDocContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocList();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedFile) {
      loadDocContent(selectedCategory, selectedFile);
    }
  }, [selectedCategory, selectedFile]);

  const loadDocList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/help/docs/list");
      const result = await response.json();

      if (result.success) {
        setCategories(result.data || {});
      } else {
        setError(result.message || "Fehler beim Laden der Dokumentation");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Dokumentations-Liste", err);
      setError("Fehler beim Laden der Dokumentation");
    } finally {
      setLoading(false);
    }
  };

  const loadDocContent = async (cat: string, file: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/help/docs/${cat}/${file}`);
      const result = await response.json();

      if (result.success) {
        setDocContent({
          title: result.data.title,
          content: result.data.content,
        });
      } else {
        setError(result.message || "Fehler beim Laden der Dokumentation");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Dokumentation", err);
      setError("Fehler beim Laden der Dokumentation");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !docContent) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Zurück</span>
        </button>
      )}

      {error && <ErrorBanner message={error} />}

      {docContent ? (
        // Dokumentation anzeigen
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {docContent.title}
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(docContent.content) }}
          />
        </div>
      ) : (
        // Kategorien und Dateien anzeigen
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(categories).map(([cat, files]) => (
            <div
              key={cat}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {cat}
              </h3>
              <ul className="space-y-2">
                {files.map((doc) => (
                  <li key={doc.name}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedFile(doc.name);
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline w-full text-left"
                    >
                      {doc.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

