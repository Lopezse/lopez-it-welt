/**
 * 🔐 Enterprise++ Password Generator UI
 *
 * Generiert sichere Passwörter nach Enterprise-Standards:
 * - Secure Mode: Maximale Sicherheit
 * - Memorable Mode: Einprägsame Passwörter
 * - Numeric Mode: Nur Zahlen
 * - Alphanumeric Mode: Buchstaben und Zahlen
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-19
 */

"use client";

import {
  GeneratedPassword,
  PasswordGeneratorMode,
  PasswordGeneratorOptions,
  PasswordGenerator as PasswordGeneratorService,
} from "@/lib/password-generator";
import React, { useState } from "react";

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
  className?: string;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
  className = "",
}) => {
  const [mode, setMode] = useState<PasswordGeneratorMode>(PasswordGeneratorMode.SECURE);
  const [length, setLength] = useState(16);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [excludeSimilarChars, setExcludeSimilarChars] = useState(true);
  const [excludeAmbiguousChars, setExcludeAmbiguousChars] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState<GeneratedPassword | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePassword = async () => {
    setIsGenerating(true);

    try {
      const options: PasswordGeneratorOptions = {
        mode,
        length,
        includeSpecialChars,
        excludeSimilarChars,
        excludeAmbiguousChars,
        includeUppercase,
        includeLowercase,
        includeNumbers,
      };

      const result = PasswordGeneratorService.generate(options);
      setGeneratedPassword(result);

      if (onPasswordGenerated) {
        onPasswordGenerated(result.password);
      }
    } catch (error) {
      console.error("Fehler beim Generieren des Passworts:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword.password);
        // Hier könnte ein Toast-Notification hinzugefügt werden
        // Passwort in Zwischenablage kopiert
      } catch (error) {
        // Fehler beim Kopieren: ${error}
      }
    }
  };

  const getModeDescription = (mode: PasswordGeneratorMode): string => {
    const descriptions = {
      [PasswordGeneratorMode.SECURE]: "Maximale Sicherheit mit allen Zeichen-Typen",
      [PasswordGeneratorMode.MEMORABLE]: "Einprägsame Passwörter mit Wörtern",
      [PasswordGeneratorMode.NUMERIC]: "Nur Zahlen (PINs, Codes)",
      [PasswordGeneratorMode.ALPHANUMERIC]: "Buchstaben und Zahlen ohne Sonderzeichen",
    };
    return descriptions[mode];
  };

  return (
    <div className={`password-generator ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Passwort-Generator</h3>

        {/* Modus-Auswahl */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Generator-Modus:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as PasswordGeneratorMode)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={PasswordGeneratorMode.SECURE}>🔒 Secure Mode</option>
            <option value={PasswordGeneratorMode.MEMORABLE}>🧠 Memorable Mode</option>
            <option value={PasswordGeneratorMode.NUMERIC}>🔢 Numeric Mode</option>
            <option value={PasswordGeneratorMode.ALPHANUMERIC}>🔤 Alphanumeric Mode</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">{getModeDescription(mode)}</p>
        </div>

        {/* Länge */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passwort-Länge: {length} Zeichen
          </label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* Zeichen-Optionen */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Zeichen-Optionen:</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Großbuchstaben (A-Z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Kleinbuchstaben (a-z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Zahlen (0-9)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeSpecialChars}
                onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Sonderzeichen (!@#$)</span>
            </label>
          </div>
        </div>

        {/* Erweiterte Optionen */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Erweiterte Optionen:
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={excludeSimilarChars}
                onChange={(e) => setExcludeSimilarChars(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Ähnliche Zeichen ausschließen (il1Lo0O)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={excludeAmbiguousChars}
                onChange={(e) => setExcludeAmbiguousChars(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Mehrdeutige Zeichen ausschließen ({}[]())</span>
            </label>
          </div>
        </div>

        {/* Generator-Button */}
        <button
          onClick={generatePassword}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "🔄 Generiere..." : "🔐 Passwort generieren"}
        </button>

        {/* Generiertes Passwort */}
        {generatedPassword && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Generiertes Passwort:</h4>
              <button
                onClick={copyToClipboard}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                📋 Kopieren
              </button>
            </div>
            <div className="font-mono text-sm bg-white p-2 rounded border mb-2 break-all">
              {generatedPassword.password}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Stärke:</span> {generatedPassword.strength}%
              </div>
              <div>
                <span className="font-medium">Entropie:</span>{" "}
                {generatedPassword.entropy.toFixed(1)} Bits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
