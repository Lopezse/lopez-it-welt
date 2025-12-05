/**
 * Office Permissions Hook - Enterprise++ Standard
 * 
 * Hook zum Prüfen von Office/Finance-Berechtigungen im UI
 */

"use client";

import { useState, useEffect } from "react";
import { useAdminPermissions } from "./useAdminPermissions";

export function useOfficePermissions() {
  const { user, loading, hasPermission } = useAdminPermissions();

  const canView = (): boolean => {
    if (!user) return false;
    return hasPermission("office.view") || hasPermission("office.manage") || hasPermission("admin");
  };

  const canManage = (): boolean => {
    if (!user) return false;
    return hasPermission("office.manage") || hasPermission("admin");
  };

  return {
    user,
    loading,
    canView,
    canManage,
    hasPermission,
  };
}




