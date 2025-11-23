import React from "react";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gapX?: "sm" | "md" | "lg" | "xl";
  gapY?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const colMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};
const gapMap = {
  sm: "gap-x-4",
  md: "gap-x-8",
  lg: "gap-x-12",
  xl: "gap-x-16",
};
const gapYMap = {
  sm: "gap-y-6",
  md: "gap-y-12",
  lg: "gap-y-16",
  xl: "gap-y-20",
};

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gapX = "md",
  gapY = "md",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`grid ${colMap[cols]} ${gapMap[gapX]} ${gapYMap[gapY]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
