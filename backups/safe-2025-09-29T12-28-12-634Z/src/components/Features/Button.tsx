/**
 * @description Einheitliche Button-Komponente mit barrierefreien Features
 */
import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const buttonVariants = {
  primary: `
    bg-hauptblau text-white border border-hauptblau
    hover:bg-hauptblau/90 hover:border-hauptblau/90
    focus:ring-2 focus:ring-hauptblau/50 focus:outline-none
    active:bg-hauptblau/80 active:scale-95
    transition-all duration-200
  `,
  secondary: `
    bg-dunkelgrau text-white border border-dunkelgrau
    hover:bg-dunkelgrau/90 hover:border-dunkelgrau/90
    focus:ring-2 focus:ring-dunkelgrau/50 focus:outline-none
    active:bg-dunkelgrau/80 active:scale-95
    transition-all duration-200
  `,
  outline: `
    bg-transparent text-hauptblau border-2 border-hauptblau
    hover:bg-hauptblau hover:text-white
    focus:ring-2 focus:ring-hauptblau/50 focus:outline-none
    active:bg-hauptblau/90 active:scale-95
    transition-all duration-200
  `,
  ghost: `
    bg-transparent text-hauptblau border border-transparent
    hover:bg-hauptblau/10 hover:border-hauptblau/20
    focus:ring-2 focus:ring-hauptblau/50 focus:outline-none
    active:bg-hauptblau/20 active:scale-95
    transition-all duration-200
  `,
  danger: `
    bg-red-600 text-white border border-red-600
    hover:bg-red-700 hover:border-red-700
    focus:ring-2 focus:ring-red-500/50 focus:outline-none
    active:bg-red-800 active:scale-95
    transition-all duration-200
  `,
  success: `
    bg-green-600 text-white border border-green-600
    hover:bg-green-700 hover:border-green-700
    focus:ring-2 focus:ring-green-500/50 focus:outline-none
    active:bg-green-800 active:scale-95
    transition-all duration-200
  `,
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "disabled:transform-none disabled:scale-100",
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
