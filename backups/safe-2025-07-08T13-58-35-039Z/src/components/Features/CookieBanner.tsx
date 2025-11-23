"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";

interface CookieBannerEigenschaften {
  onZustimmung?: (zustimmung: boolean) => void;
}

export const CookieBanner: React.FC<CookieBannerEigenschaften> = ({ onZustimmung }) => {
  const [istSichtbar, setIsSichtbar] = useState(false);

  useEffect(() => {
    // Prüfen, ob bereits eine Cookie-Zustimmung vorhanden ist
    const zustimmung = localStorage.getItem("lopez-it-welt-dsgvo-zustimmung");
    if (zustimmung === null) {
      // Keine Zustimmung vorhanden - Banner anzeigen
      setIsSichtbar(true);
    }
  }, []);

  const handleZustimmung = (zustimmung: boolean) => {
    localStorage.setItem("lopez-it-welt-dsgvo-zustimmung", zustimmung.toString());
    localStorage.setItem("lopez-it-welt-dsgvo-datum", new Date().toISOString());

    if (zustimmung) {
      // Analytics-Cookies aktivieren
      localStorage.setItem("lopez-it-welt-analytics-aktiv", "true");
      localStorage.setItem("lopez-it-welt-marketing-aktiv", "true");
      localStorage.setItem("lopez-it-welt-shop-aktiv", "true");
    } else {
      // Analytics-Cookies deaktivieren
      localStorage.setItem("lopez-it-welt-analytics-aktiv", "false");
      localStorage.setItem("lopez-it-welt-marketing-aktiv", "false");
      localStorage.setItem("lopez-it-welt-shop-aktiv", "false");
    }

    setIsSichtbar(false);

    // Callback aufrufen, falls vorhanden
    if (onZustimmung) {
      onZustimmung(zustimmung);
    }
  };

  if (!istSichtbar) {
    return null;
  }

  return (
    <>
      {/* Overlay für Hintergrund */}
      <div className="fixed inset-0 bg-schwarz bg-opacity-50 z-50 animate-fade-in" />

      {/* Zentraler Cookie-Banner */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-weiss dark:bg-dunkelgrau rounded-abgerundet-gross shadow-gross max-w-md w-full mx-4 p-6 animate-scale-in">
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-hauptblau dark:bg-akzentblau rounded-abgerundet-voll flex items-center justify-center">
                <span className="text-2xl">🍪</span>
              </div>
            </div>

            {/* Titel */}
            <h3 className="text-ueberschrift-mittel font-bold text-dunkelgrau dark:text-weiss">
              Cookie-Einstellungen
            </h3>

            {/* Beschreibung */}
            <p className="text-basis text-dunkelgrau dark:text-weiss leading-relaxed">
              Diese Website verwendet Cookies, um Ihnen das beste Nutzererlebnis zu bieten. Durch
              die weitere Nutzung stimmen Sie der Verwendung zu.
            </p>

            {/* Datenschutz-Link */}
            <p className="text-klein text-dunkelgrau dark:text-weiss">
              <Link
                href="/datenschutz"
                className="underline hover:no-underline text-hauptblau dark:text-akzentblau focus:outline-none focus:ring-2 focus:ring-hauptblau focus:ring-offset-1 rounded-abgerundet-klein"
                aria-label="Mehr Informationen zum Datenschutz"
              >
                Mehr erfahren
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variante="umriss"
                groesse="mittel"
                onClick={() => handleZustimmung(false)}
                className="flex-1"
              >
                Ablehnen
              </Button>
              <Button
                variante="haupt"
                groesse="mittel"
                onClick={() => handleZustimmung(true)}
                className="flex-1"
              >
                Akzeptieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
