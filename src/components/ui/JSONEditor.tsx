/**
 * JSON Editor Component - Enterprise++ Standard
 * 
 * Editor für JSON-Daten mit Validierung
 */

"use client";

import { useState, useEffect } from "react";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function JSONEditor({ value, onChange, error, placeholder = "{}", className = "" }: JSONEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    
    // Validierung
    if (newValue.trim() === "") {
      setIsValid(true);
      setValidationError(null);
      onChange(newValue);
      return;
    }

    try {
      JSON.parse(newValue);
      setIsValid(true);
      setValidationError(null);
      onChange(newValue);
    } catch (err) {
      setIsValid(false);
      setValidationError(err instanceof Error ? err.message : "Ungültiges JSON");
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(localValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalValue(formatted);
      onChange(formatted);
      setIsValid(true);
      setValidationError(null);
    } catch (err) {
      // Kann nicht formatiert werden
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          JSON-Editor
        </label>
        <button
          type="button"
          onClick={formatJSON}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Formatieren
        </button>
      </div>
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-h-[200px] p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
          !isValid || error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      />
      {(validationError || error) && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error || validationError}
        </p>
      )}
    </div>
  );
}






