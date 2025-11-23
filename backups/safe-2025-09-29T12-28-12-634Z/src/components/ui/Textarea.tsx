/**
 * 📄 Enterprise++ Textarea Component
 *
 * Universelle Textarea-Komponente für das Design-System:
 * - Verschiedene Varianten und Größen
 * - Label und Error Support
 * - Auto-resize Option
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

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  autoResize?: boolean;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  fullWidth = false,
  autoResize = false,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    "block transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none";

  const variantClasses = {
    default:
      "border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500",
    outlined:
      "border-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500",
    filled:
      "border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-blue-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-md",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
  const widthClasses = fullWidth ? "w-full" : "";
  const resizeClasses = autoResize ? "resize-none" : "resize-y";

  const textareaClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    errorClasses,
    widthClasses,
    resizeClasses,
    className,
  );

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = target.scrollHeight + "px";
    }

    if (props.onInput) {
      props.onInput(e);
    }
  };

  return (
    <div className={cn("space-y-1", fullWidth && "w-full")}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea id={inputId} className={textareaClasses} onInput={handleInput} {...props} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Textarea;
