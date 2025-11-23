/**
 * 🏷️ Enterprise++ Label Component
 *
 * Universelle Label-Komponente für das Design-System:
 * - Verschiedene Varianten und Größen
 * - Required Indicator
 * - Accessibility-konform
 * - Dark Mode Support
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-20
 */

"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  variant?: "default" | "sm" | "lg" | "xl";
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  variant = "default",
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = "block font-medium transition-colors";

  const variantClasses = {
    default: "text-sm text-gray-700",
    sm: "text-xs text-gray-600",
    lg: "text-base text-gray-700",
    xl: "text-lg text-gray-800",
  };

  const stateClasses = {
    disabled: "text-gray-400 cursor-not-allowed",
    enabled: "text-gray-700",
  };

  const labelClasses = cn(
    baseClasses,
    variantClasses[variant],
    stateClasses[disabled ? "disabled" : "enabled"],
    className,
  );

  return (
    <label className={labelClasses} {...props}>
      {children}
      {required && (
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
};

export default Label;
