import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  centered?: boolean;
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
  lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
  xl: "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", padding = "md", children, centered = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
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
