import React from "react";

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: "section" | "div" | "article";
  bg?: "white" | "gray" | "darkblau" | "custom";
  className?: string;
}

const bgMap = {
  white: "bg-white",
  gray: "bg-hellgrau",
  darkblau: "bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau",
  custom: "",
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  as = "section",
  bg = "custom",
  className = "",
  ...props
}) => {
  const Component = as;
  return (
    <Component className={`py-20 md:py-28 ${bgMap[bg]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default SectionWrapper;
