/**
 * 📋 Enterprise++ Select Component
 *
 * Universelle Select-Komponente für das Design-System:
 * - Verschiedene Varianten und Größen
 * - Label und Error Support
 * - Icon-Support
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

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
  id,
  options,
  ...props
}) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    "block transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-no-repeat bg-right";

  const variantClasses = {
    default:
      "border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500",
    outlined:
      "border-2 border-gray-300 bg-transparent text-gray-900 focus:border-blue-500 focus:ring-blue-500",
    filled: "border-0 bg-gray-100 text-gray-900 focus:bg-white focus:ring-blue-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md pr-8",
    md: "px-4 py-2 text-base rounded-md pr-10",
    lg: "px-6 py-3 text-lg rounded-lg pr-12",
  };

  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
  const widthClasses = fullWidth ? "w-full" : "";

  const selectClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    errorClasses,
    widthClasses,
    className,
  );

  return (
    <div className={cn("space-y-1", fullWidth && "w-full")}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select id={inputId} className={selectClasses} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  ),
);
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
  }
>(({ className, children, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    data-value={value}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

export default Select;
