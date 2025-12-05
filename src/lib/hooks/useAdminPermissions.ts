/**
 * Admin Permissions Hook - Enterprise++ Standard
 * 
 * Hook zum Prüfen von Admin-Berechtigungen im UI
 */

"use client";

import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export function useAdminPermissions() {
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
      
      // Orchestrator-Manager hat orchestrator.manage
      if (permission === "orchestrator.manage" && user.roles.includes("orchestrator_manager")) {
        return true;
      }
      
      // Orchestrator-Viewer hat orchestrator.view
      if (permission === "orchestrator.view" && (user.roles.includes("orchestrator_viewer") || user.roles.includes("orchestrator_manager"))) {
        return true;
      }
    }

    return false;
  };

  const canManage = (): boolean => {
    return hasPermission("orchestrator.manage");
  };

  const canView = (): boolean => {
    return hasPermission("orchestrator.view") || canManage();
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

