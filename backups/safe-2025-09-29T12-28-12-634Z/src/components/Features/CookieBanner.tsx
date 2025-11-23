"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { Button } from "../ui/Button";

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
        <div className="bg-weiss dark:bg-dunkelgrau rounded-abgerundet-gross shadow-gross max-w-5xl w-full mx-4 p-12 animate-scale-in">
          <div className="space-y-8">
            {/* Logo oben */}
            <div className="flex justify-center mb-12">
              <Logo size="large" showTagline={true} />
            </div>

            {/* Titel */}
            <h3 className="text-ueberschrift-gross font-bold text-dunkelgrau dark:text-weiss text-center">
              Ihre Auswahl zu Cookies auf dieser Website
            </h3>

            {/* Beschreibung */}
            <p className="text-basis text-dunkelgrau dark:text-weiss leading-relaxed text-center">
              Diese Website verwendet Cookies und verwandte Technologien entsprechend der
              Beschreibung in unserer Cookie-Erklärung, u. A. zum fehlerfreien Betrieb, zur Analyse,
              für eine verbesserte Benutzerfreundlichkeit oder zu Werbezwecken. Sie können unserer
              Verwendung dieser Technologien zustimmen oder Ihre eigenen Präferenzen verwalten.
            </p>

            {/* Links */}
            <div className="text-center space-x-4">
              <Link
                href="/datenschutz"
                className="text-hauptblau dark:text-akzentblau underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-hauptblau focus:ring-offset-1 rounded-abgerundet-klein"
                aria-label="Datenschutzerklärung"
              >
                Datenschutzerklärung
              </Link>
              <span className="text-dunkelgrau dark:text-weiss">|</span>
              <Link
                href="/cookie-erklaerung"
                className="text-hauptblau dark:text-akzentblau underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-hauptblau focus:ring-offset-1 rounded-abgerundet-klein"
                aria-label="Cookie-Erklärung"
              >
                Cookie-Erklärung
              </Link>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleZustimmung(true)}
                className="flex-1 bg-hauptblau hover:bg-akzentblau text-weiss font-semibold"
              >
                Alle annehmen
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleZustimmung(false)}
                className="flex-1 bg-hauptblau hover:bg-akzentblau text-weiss font-semibold"
              >
                Alle verweigern
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleZustimmung(true)}
                className="flex-1 text-hauptblau dark:text-akzentblau border-hauptblau dark:border-akzentblau hover:bg-hauptblau hover:text-weiss"
              >
                Einstellungen verwalten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
