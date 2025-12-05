/**
 * Status Badge Component - Enterprise++ Standard
 * 
 * Badge für Status-Anzeige mit verschiedenen Varianten
 */

"use client";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, variant = "default", size = "md", className = "" }: StatusBadgeProps) {
  // Automatische Variant-Erkennung basierend auf Status
  let autoVariant = variant;
  if (variant === "default") {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved") || statusLower.includes("active") || statusLower.includes("success") || statusLower.includes("completed")) {
      autoVariant = "success";
    } else if (statusLower.includes("pending") || statusLower.includes("warning") || statusLower.includes("running")) {
      autoVariant = "warning";
    } else if (statusLower.includes("rejected") || statusLower.includes("failed") || statusLower.includes("error") || statusLower.includes("expired")) {
      autoVariant = "error";
    } else if (statusLower.includes("info") || statusLower.includes("info")) {
      autoVariant = "info";
    } else {
      autoVariant = "default";
    }
  }

  const variantClasses = {
    success: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
    warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    error: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    info: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
    default: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[autoVariant]} ${sizeClasses[size]} ${className}`}
    >
      {status}
    </span>
  );
}






