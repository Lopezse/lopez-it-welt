/**
 * Warning Banner Simple Component - Enterprise++ Standard E.1.4
 * 
 * Einfache Warnung-Banner-Komponente
 */

"use client";

interface WarningBannerSimpleProps {
  message: string;
  className?: string;
}

export function WarningBannerSimple({ message, className = "" }: WarningBannerSimpleProps) {
  return (
    <div className={`rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4 ${className}`}>
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-sm text-yellow-800 dark:text-yellow-300">{message}</p>
      </div>
    </div>
  );
}
