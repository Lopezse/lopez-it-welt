import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonEigenschaften extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "haupt" | "sekundaer" | "neben" | "akzent" | "umriss" | "text";
  groesse?: "klein" | "mittel" | "gross";
  ladezustand?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "links" | "rechts";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonEigenschaften>(
  (
    {
      className,
      variante = "haupt",
      groesse = "mittel",
      ladezustand = false,
      icon,
      iconPosition = "links",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex elemente-zentriert inhalt-zentriert schrift-fett abgerundet-gross uebergang-farben fokus-umriss fokus-ring-hauptfarbe";

    const variantClasses = {
      haupt:
        "hintergrund-hauptfarbe text-textweiss hover:hintergrund-hauptfarbe/90 active:hintergrund-hauptfarbe/80",
      sekundaer:
        "hintergrund-akzentfarbe text-textfarbe hover:hintergrund-akzentfarbe/90 active:hintergrund-akzentfarbe/80",
      neben:
        "hintergrund-nebenfarbe text-textweiss hover:hintergrund-nebenfarbe/90 active:hintergrund-nebenfarbe/80",
      akzent:
        "hintergrund-akzentfarbe text-textfarbe hover:hintergrund-akzentfarbe/90 active:hintergrund-akzentfarbe/80",
      umriss:
        "rahmen rahmen-hauptfarbe text-hauptfarbe hover:hintergrund-hauptfarbe/10 active:hintergrund-hauptfarbe/20",
      text: "text-hauptfarbe hover:hintergrund-hauptfarbe/10 active:hintergrund-hauptfarbe/20",
    };

    const sizeClasses = {
      klein: "padding-x-3 padding-y-1 text-klein",
      mittel: "padding-x-4 padding-y-2 text-basis",
      gross: "padding-x-6 padding-y-3 text-gross",
    };

    const disabledClasses = "opacity-50 cursor-not-allowed";

    const classes = twMerge(
      baseClasses,
      variantClasses[variante],
      sizeClasses[groesse],
      (disabled || ladezustand) && disabledClasses,
      className,
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || ladezustand}
        aria-disabled={disabled || ladezustand}
        aria-busy={ladezustand}
        {...props}
      >
        {ladezustand && (
          <svg
            className="animate-spin -margin-links-1 margin-rechts-2 breite-4 hoehe-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

        {icon && iconPosition === "links" && !ladezustand && (
          <span className="margin-rechts-2" aria-hidden="true">
            {icon}
          </span>
        )}

        <span className={ladezustand ? "sr-only" : ""}>{children}</span>

        {icon && iconPosition === "rechts" && !ladezustand && (
          <span className="margin-links-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
