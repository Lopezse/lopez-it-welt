/**
 * JSON Viewer Component - Enterprise++ Standard
 * 
 * Zeigt JSON-Daten formatiert an
 */

"use client";

import { useState } from "react";

interface JSONViewerProps {
  data: Record<string, unknown> | unknown[] | string;
  collapsed?: boolean;
  title?: string;
  className?: string;
}

export function JSONViewer({ data, collapsed = false, title, className = "" }: JSONViewerProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  let jsonString = "";
  try {
    if (typeof data === "string") {
      jsonString = JSON.stringify(JSON.parse(data), null, 2);
    } else {
      jsonString = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    jsonString = String(data);
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {title && (
        <div
          className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isCollapsed ? "▼" : "▲"}
          </span>
        </div>
      )}
      {!isCollapsed && (
        <pre className="p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
          {jsonString}
        </pre>
      )}
    </div>
  );
}






