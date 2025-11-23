import React from "react";
import { twMerge } from "tailwind-merge";

interface CardEigenschaften extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variante?: "standard" | "elevated" | "outlined";
  groesse?: "klein" | "mittel" | "gross";
  klickbar?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardEigenschaften>(
  (
    { className, variante = "standard", groesse = "mittel", klickbar = false, children, ...props },
    ref,
  ) => {
    const baseClasses = "hintergrund-weiss abgerundet-gross uebergang-alles";

    const variantClasses = {
      standard: "schatten-klein",
      elevated: "schatten-gross hover:schatten-xl",
      outlined: "rahmen rahmen-grau-200",
    };

    const sizeClasses = {
      klein: "padding-4",
      mittel: "padding-6",
      gross: "padding-8",
    };

    const interactiveClasses = klickbar
      ? "cursor-pointer hover:schatten-mittel active:schatten-klein"
      : "";

    const classes = twMerge(
      baseClasses,
      variantClasses[variante],
      sizeClasses[groesse],
      interactiveClasses,
      className,
    );

    return (
      <div
        ref={ref}
        className={classes}
        role={klickbar ? "button" : undefined}
        tabIndex={klickbar ? 0 : undefined}
        aria-label={klickbar ? "Klickbare Karte" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Card-Unterkomponenten
interface CardHeaderEigenschaften {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderEigenschaften> = ({ children, className }) => {
  return <div className={twMerge("margin-unten-4", className)}>{children}</div>;
};

interface CardContentEigenschaften {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentEigenschaften> = ({ children, className }) => {
  return <div className={twMerge("abstand-y-4", className)}>{children}</div>;
};

interface CardFooterEigenschaften {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterEigenschaften> = ({ children, className }) => {
  return (
    <div className={twMerge("margin-oben-4 padding-oben-4 rahmen-oben rahmen-grau-200", className)}>
      {children}
    </div>
  );
};
