"use client";

import { useEffect, useState } from "react";
import { FaGraduationCap, FaCheckCircle, FaCircle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  category: string;
  steps: Array<{
    title: string;
    description: string;
    completed: boolean;
  }>;
  completed: boolean;
}

export function Tutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/help/tutorials", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Tutorials");
      }

      const data = await response.json();
      setTutorials(data);
    } catch (err) {
      logger.error("Fehler beim Laden der Tutorials", err);
      setError("Fehler beim Laden der Tutorials");
      // Fallback auf leere Liste
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

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
            <FaGraduationCap className="mr-2" />
            Tutorials
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Interaktive Tutorials für neue Benutzer
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {selectedTutorial ? (
        // Tutorial-Details
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedTutorial.title}
            </h4>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Zurück
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedTutorial.description}
          </p>
          <div className="space-y-4">
            {selectedTutorial.steps.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  {step.completed ? (
                    <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                  ) : (
                    <FaCircle className="h-5 w-5 text-gray-400 mt-1" />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Schritt {index + 1}: {step.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Tutorial-Liste
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-600"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {tutorial.title}
                </h4>
                {tutorial.completed && (
                  <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {tutorial.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                <span>{tutorial.steps.length} Schritte</span>
                <span>•</span>
                <span>
                  {tutorial.steps.filter((s) => s.completed).length} abgeschlossen
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

