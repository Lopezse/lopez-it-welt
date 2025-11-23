import React from "react";

interface AccessibleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
}) => {
  return (
    <button
      className={`btn-accessible bg-hauptblau text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-hauptblau-dark focus:outline-none focus:ring-2 focus:ring-hauptblau focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    >
      {children}
    </button>
  );
};
