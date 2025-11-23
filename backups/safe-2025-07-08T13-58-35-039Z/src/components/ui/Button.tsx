/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  glow?: boolean;
}

const buttonVariants = {
  primary: `
    bg-hauptblau text-weiss border border-hauptblau
    hover:bg-hauptblau/90 hover:border-hauptblau/90
    focus:ring-4 focus:ring-hauptblau/30 focus:outline-none
    active:bg-hauptblau/80 active:scale-95
    shadow-mittel hover:shadow-gross
    transition-all duration-uebergang-normal
  `,
  secondary: `
    bg-akzentblau text-weiss border border-akzentblau
    hover:bg-akzentblau/90 hover:border-akzentblau/90
    focus:ring-4 focus:ring-akzentblau/30 focus:outline-none
    active:bg-akzentblau/80 active:scale-95
    shadow-mittel hover:shadow-gross
    transition-all duration-uebergang-normal
  `,
  outline: `
    bg-transparent text-hauptblau border-2 border-hauptblau
    hover:bg-hauptblau hover:text-weiss
    focus:ring-4 focus:ring-hauptblau/30 focus:outline-none
    active:bg-hauptblau/90 active:scale-95
    transition-all duration-uebergang-normal
  `,
  ghost: `
    bg-transparent text-dunkelgrau border border-transparent
    hover:bg-dunkelgrau/10 hover:border-dunkelgrau/20
    focus:ring-4 focus:ring-dunkelgrau/20 focus:outline-none
    active:bg-dunkelgrau/20 active:scale-95
    transition-all duration-uebergang-normal
  `,
};

const buttonSizes = {
  sm: "px-3 py-2 text-sm font-medium rounded-lg",
  md: "px-4 py-2 text-base font-medium rounded-lg",
  lg: "px-6 py-3 text-lg font-semibold rounded-xl",
  xl: "px-8 py-4 text-xl font-bold rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      glow = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transform transition-all duration-uebergang-normal",
          "hover:scale-105 active:scale-95",
          glow && "shadow-lg hover:shadow-xl hover:shadow-hauptblau/25",
          fullWidth && "w-full",
          buttonVariants[variant],
          buttonSizes[size],
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {!loading && icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
