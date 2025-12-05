/**
 * KPI Card Component - Enterprise++ Standard P9
 * 
 * KPI-Karte für Dashboard-Anzeige
 */

"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  trend?: "up" | "down" | "stable";
  trendValue?: number; // Prozent
  icon?: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "yellow" | "red";
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  color = "blue",
  onClick,
}: KPICardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  const valueColorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
  };

  const trendColorClasses = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    stable: "text-gray-600 dark:text-gray-400",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${colorClasses[color]} ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trendColorClasses[trend]}`}>
              {trend === "up" && <ArrowUp className="h-3 w-3" />}
              {trend === "down" && <ArrowDown className="h-3 w-3" />}
              {trend === "stable" && <Minus className="h-3 w-3" />}
              <span>
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {Math.abs(trendValue).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${valueColorClasses[color]} opacity-50`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  );
}




