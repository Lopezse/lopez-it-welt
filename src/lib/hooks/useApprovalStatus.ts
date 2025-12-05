/**
 * Approval Status Hook - Enterprise++ Standard
 * 
 * Hook zum Laden des P7-Approval-Status für einen Use-Case
 */

"use client";

import { useState, useEffect } from "react";

interface ApprovalStatus {
  use_case: string;
  approval_status: "approved" | "pending" | "rejected" | "expired" | "not_required" | "none";
  approval_date?: string;
  expires_at?: string;
  can_execute: boolean;
  reason?: string;
}

export function useApprovalStatus(useCase: string | null) {
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useCase && useCase !== "unknown") {
      loadStatus();
    } else {
      setStatus({
        use_case: useCase || "unknown",
        approval_status: "none",
        can_execute: false,
        reason: "Use-Case nicht gesetzt",
      });
      setLoading(false);
    }
  }, [useCase]);

  const loadStatus = async () => {
    if (!useCase || useCase === "unknown") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/approvals/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case: useCase }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStatus(data.data);
        } else {
          setStatus({
            use_case: useCase,
            approval_status: "none",
            can_execute: false,
            reason: data.message || "Status konnte nicht geladen werden",
          });
        }
      } else {
        // Fallback: Versuche Status-Endpoint
        try {
          const statusResponse = await fetch(`/api/orchestrator/approvals/status?use_case=${encodeURIComponent(useCase)}`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            if (statusData.success && statusData.data && Array.isArray(statusData.data) && statusData.data.length > 0) {
              const approval = statusData.data.find((a: any) => a.use_case === useCase) || statusData.data[0];
              setStatus({
                use_case: useCase,
                approval_status: approval.approval_status || "none",
                approval_date: approval.approval_date,
                expires_at: approval.expires_at,
                can_execute: approval.approval_status === "approved",
                reason: approval.reason,
              });
            } else {
              setStatus({
                use_case: useCase,
                approval_status: "none",
                can_execute: false,
                reason: "Keine Freigabe gefunden",
              });
            }
          } else {
            setStatus({
              use_case: useCase,
              approval_status: "none",
              can_execute: false,
              reason: "Status konnte nicht geladen werden",
            });
          }
        } catch {
          setStatus({
            use_case: useCase,
            approval_status: "none",
            can_execute: false,
            reason: "Status konnte nicht geladen werden",
          });
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden des Approval-Status:", err);
      setStatus({
        use_case: useCase,
        approval_status: "none",
        can_execute: false,
        reason: "Fehler beim Laden des Status",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    error,
    reload: loadStatus,
  };
}

