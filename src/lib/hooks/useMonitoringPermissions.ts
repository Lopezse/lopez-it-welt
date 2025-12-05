/**
 * Monitoring Permissions Hook - Enterprise++ Standard P8-D
 * 
 * Hook zum Prüfen von Monitoring-Berechtigungen im UI
 * Speziell für Telemetrie & Monitoring (monitoring.manage / monitoring.view)
 */

"use client";

import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export function useMonitoringPermissions() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

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
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Benutzerdaten:", err);
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
      
      // Monitoring-Manager hat monitoring.manage
      if (permission === "monitoring.manage" && user.roles.includes("monitoring_manager")) {
        return true;
      }
      
      // Monitoring-Viewer hat monitoring.view
      if (permission === "monitoring.view" && (user.roles.includes("monitoring_viewer") || user.roles.includes("monitoring_manager"))) {
        return true;
      }
    }

    return false;
  };

  const canManage = (): boolean => {
    return hasPermission("monitoring.manage");
  };

  const canView = (): boolean => {
    return hasPermission("monitoring.view") || canManage();
  };

  return {
    user,
    loading,
    hasPermission,
    canManage,
    canView,
    reload: loadUser,
  };
}





