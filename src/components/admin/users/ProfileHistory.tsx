"use client";

import { useEffect, useState } from "react";
import { FaHistory, FaClock, FaUser } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface ProfileVersion {
  id: number;
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  status: string;
  changed_at: string;
  changed_by: string;
}

interface ProfileHistoryProps {
  userId: number;
}

export function ProfileHistory({ userId }: ProfileHistoryProps) {
  const [versions, setVersions] = useState<ProfileVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}/profile/history`);
      const result = await response.json();

      if (result.success) {
        setVersions(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Versionshistorie");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Profil-Versionshistorie", err);
      setError("Fehler beim Laden der Versionshistorie");
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

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaHistory className="mr-2" />
        Versionshistorie
      </h2>

      {versions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Keine Versionshistorie vorhanden</p>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FaClock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Version {versions.length - index}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(version.changed_at).toLocaleString("de-DE")}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Benutzername:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {version.username}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">E-Mail:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{version.email}</span>
                </div>
                {version.display_name && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Anzeigename:</span>{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {version.display_name}
                    </span>
                  </div>
                )}
                {version.phone && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Telefon:</span>{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {version.phone}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {version.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Geändert von:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {version.changed_by}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


