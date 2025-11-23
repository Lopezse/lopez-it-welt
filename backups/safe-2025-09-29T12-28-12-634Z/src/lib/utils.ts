/**
 * 🛠️ Enterprise++ Utility Functions
 *
 * Sammlung von nützlichen Utility-Funktionen:
 * - Class Name Utilities (cn)
 * - String Utilities
 * - Date Utilities
 * - Validation Utilities
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-20
 */

import { type ClassValue, clsx } from "clsx";

/**
 * Kombiniert class names mit clsx
 * @param inputs - Class values
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatiert einen String zu einem gültigen CSS-Klassen-Namen
 * @param str - Input string
 * @returns Formatted class name
 */
export function formatClassName(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .replace(/^-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generiert eine zufällige ID
 * @param prefix - Optional prefix
 * @returns Random ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in ms
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 * @param func - Function to throttle
 * @param limit - Limit time in ms
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Formatiert ein Datum
 * @param date - Date object or string
 * @param format - Format string
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "time" | "datetime" = "short",
): string {
  const d = new Date(date);

  switch (format) {
    case "short":
      return d.toLocaleDateString("de-DE");
    case "long":
      return d.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return d.toLocaleTimeString("de-DE");
    case "datetime":
      return d.toLocaleString("de-DE");
    default:
      return d.toLocaleDateString("de-DE");
  }
}

/**
 * Validiert eine E-Mail-Adresse
 * @param email - Email string
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validiert eine Telefonnummer
 * @param phone - Phone string
 * @returns True if valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Generiert eine zufällige Farbe
 * @returns Random color hex
 */
export function getRandomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Konvertiert Hex zu RGB
 * @param hex - Hex color
 * @returns RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Konvertiert RGB zu Hex
 * @param r - Red value
 * @param g - Green value
 * @param b - Blue value
 * @returns Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Kopiert Text in die Zwischenablage
 * @param text - Text to copy
 * @returns Promise<boolean>
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
    return false;
  }
}

/**
 * Speichert Daten im Local Storage
 * @param key - Storage key
 * @param value - Value to store
 * @returns Success boolean
 */
export function setLocalStorage(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Local storage set failed:", error);
    return false;
  }
}

/**
 * Lädt Daten aus dem Local Storage
 * @param key - Storage key
 * @param defaultValue - Default value if not found
 * @returns Stored value or default
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Local storage get failed:", error);
    return defaultValue;
  }
}

/**
 * Entfernt Daten aus dem Local Storage
 * @param key - Storage key
 * @returns Success boolean
 */
export function removeLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Local storage remove failed:", error);
    return false;
  }
}

/**
 * Generiert einen Slug aus einem String
 * @param str - Input string
 * @returns URL-safe slug
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates text to specified length
 * @param text - Input text
 * @param length - Max length
 * @param suffix - Suffix to add
 * @returns Truncated text
 */
export function truncateText(text: string, length: number, suffix: string = "..."): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * Capitalizes first letter of string
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts string to title case
 * @param str - Input string
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
