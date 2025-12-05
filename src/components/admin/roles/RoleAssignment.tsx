/**
 * Role Assignment Component - Enterprise++ Standard E.2.5
 * 
 * Rollen zuweisen, entfernen und Historie anzeigen
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { FaUser, FaShieldAlt, FaClock, FaTrash } from "react-icons/fa";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
  role_description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
}

interface RoleAssignment {
  id: number;
  user_id: number;
  role_id: number;
  role_name: string;
  assigned_by: number;
  assigned_by_name: string;
  assigned_at: string;
  expires_at?: string;
}

interface RoleAssignmentProps {
  userId: number;
  onAssignmentChange?: () => void;
}

export function RoleAssignment({ userId, onAssignmentChange }: RoleAssignmentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadUser(), loadRoles(), loadAssignments()]);
    } catch (err) {
      logger.error("Fehler beim Laden der Rollen-Zuweisungen", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Daten");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    const response = await fetch(`/api/admin/users/${userId}`);
    const result = await response.json();
    if (result.success) {
      setUser(result.data);
    }
  };

  const loadRoles = async () => {
    const response = await fetch("/api/admin/roles");
    const result = await response.json();
    if (result.success) {
      setRoles(result.data || []);
    }
  };

  const loadAssignments = async () => {
    const response = await fetch(`/api/admin/users/${userId}/roles`);
    const result = await response.json();
    if (result.success) {
      setAssignments(result.data || []);
    }
  };

  const assignRole = async () => {
    if (!selectedRoleId) {
      setError("Bitte wählen Sie eine Rolle aus");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: selectedRoleId,
          expires_at: expiresAt || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Rollen-Zuweisung");
      }

      setSelectedRoleId(null);
      setExpiresAt("");
      loadAssignments();
      if (onAssignmentChange) {
        onAssignmentChange();
      }
    } catch (err) {
      logger.error("Fehler bei der Rollen-Zuweisung", err);
      setError(err instanceof Error ? err.message : "Fehler bei der Rollen-Zuweisung");
    }
  };

  const removeRole = async (assignmentId: number) => {
    if (!confirm("Möchten Sie diese Rolle wirklich entfernen?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}/roles/${assignmentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Entfernen der Rolle");
      }

      loadAssignments();
      if (onAssignmentChange) {
        onAssignmentChange();
      }
    } catch (err) {
      logger.error("Fehler beim Entfernen der Rolle", err);
      setError(err instanceof Error ? err.message : "Fehler beim Entfernen der Rolle");
    }
  };

  if (loading && !user) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Daten...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Benutzer-Info */}
      {user && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaUser className="mr-3 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.full_name || user.username}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </Card>
      )}

      {/* Rolle zuweisen */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rolle zuweisen</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rolle
              </label>
              <select
                value={selectedRoleId || ""}
                onChange={(e) => setSelectedRoleId(parseInt(e.target.value) || null)}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Auswählen...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name} ({role.role_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ablaufdatum (optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={assignRole}
              disabled={!selectedRoleId}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Rolle zuweisen
            </button>
          </div>
        </div>
      </Card>

      {/* Zugewiesene Rollen */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Zugewiesene Rollen</h3>
          {assignments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Keine Rollen zugewiesen</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FaShieldAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{assignment.role_name}</span>
                    </div>
                    <button
                      onClick={() => removeRole(assignment.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Rolle entfernen"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      Zugewiesen: {format(new Date(assignment.assigned_at), "dd.MM.yyyy HH:mm", { locale: de })} von {assignment.assigned_by_name}
                    </div>
                    {assignment.expires_at && (
                      <div>
                        Läuft ab: {format(new Date(assignment.expires_at), "dd.MM.yyyy HH:mm", { locale: de })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}



