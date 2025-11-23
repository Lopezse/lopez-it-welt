import React from "react";

interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  onClick?: () => void;
  role?: string;
  "aria-label"?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  className = "",
  title,
  description,
  onClick,
  role = "article",
  "aria-label": ariaLabel,
}) => {
  return (
    <div
      className={`card-accessible bg-primary border border-gray-200 rounded-lg p-6 shadow-accessible hover:shadow-accessible-lg transition-all duration-200 ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>}
      {description && <p className="text-secondary mb-4 leading-relaxed">{description}</p>}
      {children}
    </div>
  );
};
