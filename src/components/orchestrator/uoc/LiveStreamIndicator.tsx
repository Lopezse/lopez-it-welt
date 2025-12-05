/**
 * Live Stream Indicator Component - Enterprise++ Standard P9
 * 
 * Zeigt Live-Stream-Status an
 */

"use client";

import { useEffect, useState } from "react";

interface LiveStreamIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
  className?: string;
}

export function LiveStreamIndicator({
  isConnected,
  lastUpdate,
  className = "",
}: LiveStreamIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
      if (seconds < 60) {
        setTimeAgo(`vor ${seconds} Sekunden`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`vor ${minutes} Minute${minutes !== 1 ? "n" : ""}`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`vor ${hours} Stunde${hours !== 1 ? "n" : ""}`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
      />
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {isConnected ? "Live" : "Getrennt"}
      </span>
      {lastUpdate && isConnected && (
        <span className="text-xs text-gray-500 dark:text-gray-500">{timeAgo}</span>
      )}
    </div>
  );
}




