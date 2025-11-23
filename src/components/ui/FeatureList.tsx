import React from "react";

export interface FeatureListProps extends React.HTMLAttributes<HTMLUListElement> {
  features: string[];
  icon?: React.ReactNode;
  iconColor?: string;
  textSize?: "sm" | "md" | "lg";
  className?: string;
}

const textSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  icon = <span>✔️</span>,
  iconColor = "text-akzentblau",
  textSize = "md",
  className = "",
  ...props
}) => {
  return (
    <ul className={`space-y-2 ${textSizeMap[textSize]} ${className}`} {...props}>
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center">
          <span className={`mr-2 ${iconColor}`}>{icon}</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
