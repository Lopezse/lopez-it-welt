/**
 * Live Update Toast Container - Enterprise++ Standard P9
 * 
 * Toast-Container für mehrere LiveUpdateCards
 */

"use client";

import { useState, useEffect } from "react";
import { LiveUpdateCard } from "./LiveUpdateCard";
import type { Alert, Incident } from "@/lib/ki-orchestrator/level2/types";
import type { BaseMetric } from "@/lib/telemetry/types";
import type { Log } from "@/lib/ki-orchestrator/level2/logs/types";
import type { SystemHealth } from "@/lib/telemetry/types";

export interface LiveUpdateToast {
  id: string;
  type: "alert" | "metric" | "log" | "health" | "incident";
  data: Alert | BaseMetric | Log | SystemHealth | Incident;
  timestamp: Date;
}

export interface LiveUpdateToastContainerProps {
  maxToasts?: number; // Standard: 5
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  autoDismiss?: boolean;
  dismissAfter?: number; // Standard: 5000ms
  onToast?: (toast: LiveUpdateToast) => void;
}

export function LiveUpdateToastContainer({
  maxToasts = 5,
  position = "top-right",
  autoDismiss = true,
  dismissAfter = 5000,
  onToast,
}: LiveUpdateToastContainerProps) {
  const [toasts, setToasts] = useState<LiveUpdateToast[]>([]);

  // Add toast
  const addToast = (toast: LiveUpdateToast) => {
    setToasts((prev) => {
      const newToasts = [toast, ...prev].slice(0, maxToasts);
      return newToasts;
    });

    if (onToast) {
      onToast(toast);
    }

    // Auto-dismiss
    if (autoDismiss) {
      setTimeout(() => {
        removeToast(toast.id);
      }, dismissAfter);
    }
  };

  // Remove toast
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Expose addToast function via window (for external use)
  useEffect(() => {
    (window as any).__uocAddToast = addToast;
    return () => {
      delete (window as any).__uocAddToast;
    };
  }, []);

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 space-y-2 max-w-sm w-full pointer-events-none`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <LiveUpdateCard
            eventType={toast.type}
            data={toast.data}
            timestamp={toast.timestamp}
            onDismiss={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Helper function to add toast from anywhere
export function addUOCToast(toast: Omit<LiveUpdateToast, "id" | "timestamp">) {
  if (typeof window !== "undefined" && (window as any).__uocAddToast) {
    (window as any).__uocAddToast({
      ...toast,
      id: `toast-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    });
  }
}




