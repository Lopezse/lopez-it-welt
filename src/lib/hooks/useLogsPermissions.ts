/**
 * Logs Permissions Hook - Enterprise++ Standard P8-E
 * 
 * Hook zum Prüfen von Logs-Berechtigungen im UI
 * Speziell für Logs (logs.manage / logs.view)
 */

"use client";

import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export function useLogsPermissions() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await fetch("/api/auth/admin/me");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser({
            id: data.data.user?.id || data.data.session?.userId?.toString() || "",
            email: data.data.user?.email || data.data.session?.email || "",
            roles: data.data.roles || [],
            permissions: data.data.permissions || [],
          });
        } else {
          setError({ message: data.message || "Fehler beim Laden der Benutzerdaten", status: response.status });
        }
      } else {
        setError({ message: "Fehler beim Laden der Benutzerdaten", status: response.status });
      }
    } catch (err) {
      console.error("Fehler beim Laden der Benutzerdaten:", err);
      setError({ message: "Netzwerkfehler beim Laden der Benutzerdaten", status: 500 });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Prüfe direkte Permissions
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    // Prüfe Rollen
    if (user.roles) {
      // Admin-Rolle hat alle Rechte
      if (user.roles.includes("admin") || user.roles.includes("super_admin")) {
        return true;
      }

      // Logs Manager hat logs.manage
      if (permission === "logs.manage" && user.roles.includes("logs_manager")) {
        return true;
      }

      // Logs Viewer hat logs.view
      if (permission === "logs.view" && (user.roles.includes("logs_viewer") || user.roles.includes("logs_manager"))) {
        return true;
      }
    }

    return false;
  };

  const canManage = (): boolean => {
    return hasPermission("logs.manage");
  };

  const canView = (): boolean => {
    return hasPermission("logs.view") || canManage();
  };

  return {
    user,
    loading,
    error,
    hasPermission,
    canManage,
    canView,
    reload: loadUser,
  };
}





