/**
 * System Permissions Hook - Enterprise++ Standard
 * 
 * Hook zum Prüfen von System-Berechtigungen im UI (Backups, System-Management)
 */

"use client";

import { useState, useEffect } from "react";
import { useAdminPermissions } from "./useAdminPermissions";

export function useSystemPermissions() {
  const { user, loading, hasPermission } = useAdminPermissions();

  const canView = (): boolean => {
    if (!user) return false;
    return hasPermission("system.view") || hasPermission("system.manage") || hasPermission("admin");
  };

  const canManage = (): boolean => {
    if (!user) return false;
    return hasPermission("system.manage") || hasPermission("admin");
  };

  return {
    user,
    loading,
    canView,
    canManage,
    hasPermission,
  };
}




