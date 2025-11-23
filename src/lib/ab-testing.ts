/**
 * A/B Testing Library
 * Enterprise++ Standard für Varianten-Zuweisung und Event-Tracking
 */

export interface ABVariant {
  active: boolean;
  experiment_id?: number;
  experiment_name?: string;
  variant: {
    key: string;
    title: string;
    subtitle: string;
    description: string;
    button_text: string;
    button_link: string;
  };
  split_a?: number;
  device_type?: string;
}

export interface ABEvent {
  experiment_id: number;
  variant_key: string;
  event_type: "click" | "conversion";
  device_type?: string;
}

/**
 * Lädt die aktuelle A/B-Test Variante für den Nutzer
 */
export async function loadABVariant(): Promise<ABVariant | null> {
  try {
    const response = await fetch("/api/ab/variant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("⚠️ A/B-Testing nicht verfügbar, verwende Fallback");
      return null;
    }

    const data = await response.json();

    if (!data.active) {
      return null;
    }

    return data as ABVariant;
  } catch (error) {
    console.error("❌ Fehler beim Laden der A/B-Variante:", error);
    return null;
  }
}

/**
 * Trackt ein A/B-Test Event (Click oder Conversion)
 */
export async function trackABEvent(event: ABEvent): Promise<boolean> {
  try {
    const response = await fetch("/api/ab/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        experiment_id: event.experiment_id,
        variant_key: event.variant_key,
        event_type: event.event_type,
        device_type: event.device_type || detectDeviceType(),
      }),
    });

    if (!response.ok) {
      console.warn("⚠️ Event-Tracking fehlgeschlagen");
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Fehler beim Tracken des A/B-Events:", error);
    return false;
  }
}

/**
 * Erkennt den Device-Type (desktop, mobile, tablet)
 */
export function detectDeviceType(): string {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Generiert einen User-Hash (anonymisiert, DSGVO-konform)
 */
export function generateUserHash(): string {
  if (typeof window === "undefined") {
    return "unknown";
  }

  // Kombiniere verschiedene Browser-Informationen
  const userAgent = window.navigator.userAgent;
  const language = window.navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Einfacher Hash (in Produktion sollte crypto.subtle verwendet werden)
  const hashString = `${userAgent}-${language}-${timezone}`;
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16);
}
