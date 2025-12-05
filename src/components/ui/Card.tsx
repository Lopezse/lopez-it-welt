/**
 * 🃏 Enterprise++ Card Component
 *
 * Universelle Card-Komponente für das Design-System:
 * - Flexible Props für verschiedene Anwendungsfälle
 * - Konsistente Styling-Optionen
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

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "elevated" | "filled" | "glass" | "premium";
  size?: "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  bg?:
    | "white"
    | "gray"
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "purple"
    | "transparent"
    | "weiss10";
  border?: boolean;
  hoverable?: boolean;
  focusable?: boolean;
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  size = "md",
  padding = "md",
  radius = "lg",
  shadow = "sm",
  bg = "white",
  border = true,
  hoverable = false,
  focusable = false,
  interactive = false,
  className = "",
  ...props
}) => {
  const baseClasses = "block";

  const variantClasses = {
    default: "border",
    outlined: "bg-transparent border-2",
    elevated: "shadow-lg border-0",
    filled: "border",
    glass: "backdrop-blur-sm border",
    premium: "border",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  const bgClasses = {
    white: "",
    gray: "",
    blue: "",
    green: "",
    red: "",
    yellow: "",
    purple: "",
    transparent: "bg-transparent",
    weiss10: "",
  };

  const interactiveClasses = cn(
    hoverable && "hover:shadow-md hover:scale-[1.02] transition-all duration-200",
    focusable && "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    interactive && "cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200",
  );

  // Dark Theme Styles (Lopez Carbon Dark)
  const darkThemeStyles: React.CSSProperties = {
    backgroundColor: variant === "outlined" ? "transparent" : variant === "filled" ? "#1a1d24" : "#111217",
    borderColor: variant === "outlined" ? "#3a3d47" : "#272a33",
    color: "#f4f4f4",
  };

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    paddingClasses[padding],
    radiusClasses[radius],
    shadowClasses[shadow],
    bgClasses[bg],
    !border && "border-0",
    interactiveClasses,
    className,
  );

  return (
    <div 
      className={cardClasses} 
      style={darkThemeStyles}
      tabIndex={focusable ? 0 : undefined} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
