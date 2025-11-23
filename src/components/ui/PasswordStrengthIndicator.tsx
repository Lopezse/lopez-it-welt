/**
 * 🔒 Enterprise++ Password Strength Indicator
 *
 * 4-Stufen-System mit Farben und Echtzeit-Feedback:
 * - Schwach (0-25%) - Rot
 * - Mittel (26-50%) - Orange
 * - Stark (51-75%) - Gelb
 * - Sehr Stark (76-100%) - Grün
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-19
 */

"use client";

import { PasswordStrengthAnalyzer, PasswordStrengthResult } from "@/lib/password-strength-analyzer";
import React, { useEffect, useState } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  showSuggestions = true,
  className = "",
}) => {
  const [strengthResult, setStrengthResult] = useState<PasswordStrengthResult | null>(null);

  useEffect(() => {
    // PasswordStrengthIndicator: password changed: ${password}
    if (password) {
      const result = PasswordStrengthAnalyzer.analyze(password);
      // PasswordStrengthIndicator: analysis result: ${result}
      setStrengthResult(result);
    } else {
      // PasswordStrengthIndicator: no password, setting null
      setStrengthResult(null);
    }
  }, [password]);

  if (!strengthResult) {
    return (
      <div className={`password-strength-indicator ${className}`}>
        <div className="strength-bar-container">
          <div className="strength-bar">
            <div className="strength-fill bg-gray-300" style={{ width: "0%" }} />
          </div>
          <span className="strength-text text-gray-500">Passwort eingeben</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`password-strength-indicator ${className}`}>
      {/* Stärke-Balken */}
      <div className="strength-bar-container mb-3">
        <div className="strength-bar bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`strength-fill rounded-full h-2 transition-all duration-300 ${strengthResult.color}`}
            style={{ width: `${strengthResult.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className={`strength-text font-medium ${strengthResult.color}`}>
            {strengthResult.icon} {strengthResult.text}
          </span>
          <span className="strength-percentage text-sm text-gray-600">
            {strengthResult.percentage}%
          </span>
        </div>
      </div>

      {/* Anforderungen */}
      {showRequirements && strengthResult.requirements.length > 0 && (
        <div className="requirements-container mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Passwort-Anforderungen:</h4>
          <ul className="space-y-1">
            {strengthResult.requirements.map((req, index) => (
              <li key={index} className="flex items-center text-sm">
                <span className={`mr-2 ${req.met ? "text-green-500" : "text-red-500"}`}>
                  {req.met ? "✅" : "❌"}
                </span>
                <span className={req.met ? "text-green-700" : "text-red-700"}>{req.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Verbesserungsvorschläge */}
      {showSuggestions && strengthResult.suggestions.length > 0 && (
        <div className="suggestions-container">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Verbesserungsvorschläge:</h4>
          <ul className="space-y-1">
            {strengthResult.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start text-sm text-orange-600">
                <span className="mr-2 mt-0.5">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Entropie-Anzeige */}
      <div className="entropy-info mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Passwort-Länge:</span>
          <span className="font-mono">{password.length} Zeichen</span>
        </div>
        <div className="flex justify-between">
          <span>Eindeutige Zeichen:</span>
          <span className="font-mono">{new Set(password).size}</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
