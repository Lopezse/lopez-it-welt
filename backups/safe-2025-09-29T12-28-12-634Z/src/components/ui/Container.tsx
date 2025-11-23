/**
 * @description Einheitliche Container-Komponente für konsistente Layouts
 * Standardisiert alle Container-Definitionen im Projekt
 */
import { cn } from "@/lib/utils";
import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  centered?: boolean;
  className?: string;
}

const containerSizes = {
  sm: "max-w-4xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

const containerPadding = {
  none: "",
  sm: "px-4",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-6 sm:px-8 lg:px-12",
  xl: "px-8 sm:px-12 lg:px-16",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = "xl", padding = "md", centered = true, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          containerSizes[size],
          containerPadding[padding],
          centered && "mx-auto",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";
