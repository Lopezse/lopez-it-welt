"use client";
import { useI18n } from "../Features/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dunkelgrau text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Unternehmen */}
          <div>
            <div className="mb-6">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* LW Icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "64px",
                    width: "64px",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007BFF" />
                        <stop offset="100%" stopColor="#0056B3" />
                      </linearGradient>
                      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* LW Quadrat */}
                    <rect
                      x="10"
                      y="10"
                      width="80"
                      height="80"
                      rx="20"
                      ry="20"
                      fill="url(#blueGradient)"
                      filter="url(#neonGlow)"
                    />
                    <text
                      x="50"
                      y="60"
                      fontFamily="Montserrat, Arial, sans-serif"
                      fontSize="36"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="white"
                      textRendering="optimizeLegibility"
                    >
                      LW
                    </text>
                  </svg>
                </div>

                {/* Text Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Montserrat, Arial, sans-serif",
                      fontSize: "32px",
                      fontWeight: "600",
                      margin: 0,
                      padding: 0,
                      lineHeight: "1.1",
                    }}
                  >
                    <span style={{ color: "#FFD700" }}>Lopez</span>{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontWeight: "700",
                        color: "#007BFF",
                      }}
                    >
                      IT Welt
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Montserrat, Arial, sans-serif",
                      fontSize: "14px",
                      fontWeight: "300",
                      color: "#CCCCCC",
                      margin: 0,
                      padding: 0,
                      marginTop: "2px",
                      lineHeight: "1.0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Digitale Lösungen. Global. Sicher.
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.
            </p>
            <div className="flex space-x-4">{/* Icons entfernt, nur Text bleibt */}</div>
          </div>

          {/* Leistungen */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hauptblau">Leistungen</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#it-support" className="hover:text-white transition-colors">
                  IT-Support
                </a>
              </li>
              <li>
                <a href="#pc-bau" className="hover:text-white transition-colors">
                  PC-Bau & Einrichtung
                </a>
              </li>
              <li>
                <a href="#webdesign" className="hover:text-white transition-colors">
                  Webdesign
                </a>
              </li>
              <li>
                <a href="#ki-assistenz" className="hover:text-white transition-colors">
                  KI-Assistenz
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hauptblau">Kontakt</h3>
            <div className="text-gray-300 space-y-2">
              <p>Ramiro Lopez Rodriguez</p>
              <p>Alte Bahnhofstraße 13</p>
              <p>31515 Wunstorf</p>
              <p className="mt-2">
                <a
                  href="mailto:info@lopez-it-welt.de"
                  className="hover:text-white transition-colors"
                >
                  E-Mail: info@lopez-it-welt.de
                </a>
              </p>
              <p>
                <a href="tel:+4950317005576" className="hover:text-white transition-colors">
                  Telefon: +49 (0) 5031 7005576
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/4915251574657"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success-gruen hover:text-success-gruen/80 transition-colors"
                >
                  WhatsApp: +49 1525 1574657
                </a>
              </p>
            </div>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hauptblau">Rechtliches</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/cookie-einstellungen" className="hover:text-white transition-colors">
                  Cookie-Einstellungen
                </a>
              </li>
              <li>
                <a href="/agb" className="hover:text-white transition-colors">
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} Lopez IT Welt. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-300 text-sm">♿ Barrierefrei</span>
              <span className="text-gray-300 text-sm">🌍 Mehrsprachig</span>
              <span className="text-gray-300 text-sm">🤖 KI-gestützt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
