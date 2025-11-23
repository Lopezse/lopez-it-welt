"use client";
import { Accessibility, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CookieBanner } from "./Features/CookieBanner";
import { useI18n } from "./Features/I18nProvider";

// Types für CMS-Daten
interface HeaderData {
  id: number;
  logo_text: string;
  logo_icon: string;
  logo_styling: string;
  navigation_items: string;
  mobile_menu_text: string;
  language_options: string;
  control_elements: string;
  button_texts: string;
  aria_labels: string;
  language_switch: boolean;
  is_active: boolean;
}

interface NavigationItem {
  label: string;
  link: string;
  type: string;
  style?: string;
}

interface LanguageOption {
  code: string;
  label: string;
  active: boolean;
}

interface ControlElement {
  icon: string;
  text: string;
  aria_label: string;
  link?: string;
}

export default function Header() {
  const { t, language, setLanguage } = useI18n();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [dsgvoZustimmung, setDsgvoZustimmung] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"loggedIn" | "loggedOut">("loggedOut");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // CMS-Daten State
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [controlElements, setControlElements] = useState<Record<string, ControlElement>>({});
  const [buttonTexts, setButtonTexts] = useState<Record<string, string>>({});
  const [ariaLabels, setAriaLabels] = useState<Record<string, string>>({});
  const [logoStyling, setLogoStyling] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Header-Daten aus Datenbank laden
  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        setError(null); // Fehler zurücksetzen
        const response = await fetch("/api/content/header");
        if (response.ok) {
          const data = await response.json();
          console.log("Header-Daten geladen:", data);
          setHeaderData(data);

          // JSON-Daten parsen (Zeilenumbrüche entfernen)
          if (data.navigation_items) {
            const cleanJson = data.navigation_items.replace(/\r\n/g, "").replace(/\n/g, "");
            const navItems = JSON.parse(cleanJson);
            setNavigationItems(navItems);
          }

          if (data.language_options) {
            const cleanJson = data.language_options.replace(/\r\n/g, "").replace(/\n/g, "");
            const langOptions = JSON.parse(cleanJson);
            setLanguageOptions(langOptions);
          }

          if (data.control_elements) {
            const cleanJson = data.control_elements.replace(/\r\n/g, "").replace(/\n/g, "");
            const controls = JSON.parse(cleanJson);
            setControlElements(controls);
          }

          if (data.button_texts) {
            const cleanJson = data.button_texts.replace(/\r\n/g, "").replace(/\n/g, "");
            const buttons = JSON.parse(cleanJson);
            setButtonTexts(buttons);
          }

          if (data.aria_labels) {
            const cleanJson = data.aria_labels.replace(/\r\n/g, "").replace(/\n/g, "");
            const labels = JSON.parse(cleanJson);
            setAriaLabels(labels);
          }

          if (data.logo_styling) {
            try {
              const cleanJson = data.logo_styling.replace(/\r\n/g, "").replace(/\n/g, "");
              const styling = JSON.parse(cleanJson);
              console.log("Logo-Styling geladen:", styling);
              setLogoStyling(styling);
            } catch (error) {
              console.error("Logo-Styling Parse-Fehler:", error);
              // Fallback-Styling
              setLogoStyling({
                lopez_color: "#FFD700",
                it_welt_gradient: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                icon_size: "30px",
                text_size: "22px",
              });
            }
          }
        } else {
          const errorMsg = `API-Fehler: ${response.status} ${response.statusText}`;
          console.error(errorMsg);
          setError(errorMsg);
        }
      } catch (error) {
        const errorMsg = `Fehler beim Laden der Header-Daten: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`;
        console.error(errorMsg);
        setError(errorMsg);
        // KEINE FALLBACK-DATEN - Datenbank muss laufen!
        // Alle States zurücksetzen
        setHeaderData(null);
        setNavigationItems([]);
        setLanguageOptions([]);
        setControlElements({});
        setButtonTexts({});
        setAriaLabels({});
        setLogoStyling({});
      } finally {
        setLoading(false);
      }
    };

    loadHeaderData();
  }, []);

  // DSGVO-Zustimmung prüfen
  useEffect(() => {
    const zustimmung = localStorage.getItem("dsgvoZustimmung");
    setDsgvoZustimmung(zustimmung);
  }, []);

  // Dark Mode prüfen
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Barrierefreiheit-Modus prüfen
  useEffect(() => {
    const accessibilityMode = localStorage.getItem("accessibilityMode") === "true";
    setIsAccessibilityMode(accessibilityMode);
    if (accessibilityMode) {
      document.documentElement.classList.add("accessibility-mode");
    }
  }, []);

  // Auth-Status prüfen
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthStatus(token ? "loggedIn" : "loggedOut");
  }, []);

  // Event-Listener für Menü-Schließung
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleAccessibilityToggle = () => {
    const newAccessibilityMode = !isAccessibilityMode;
    setIsAccessibilityMode(newAccessibilityMode);
    localStorage.setItem("accessibilityMode", newAccessibilityMode.toString());

    if (newAccessibilityMode) {
      document.documentElement.classList.add("accessibility-mode");
    } else {
      document.documentElement.classList.remove("accessibility-mode");
    }
  };

  const handleSpracheWechseln = (sprache: "de" | "en" | "es") => {
    setLanguage(sprache);
    localStorage.setItem("lopez-it-welt-sprache", sprache);
    setIsLanguageDropdownOpen(false);
  };

  // Sprachoptionen definieren
  const sprachOptionen = [
    { code: "de", label: "DE", name: "Deutsch" },
    { code: "en", label: "EN", name: "English" },
    { code: "es", label: "ES", name: "Español" },
  ];

  const aktuelleSprache = sprachOptionen.find((opt) => opt.code === language) || sprachOptionen[0];

  const handleAbmelden = () => {
    localStorage.removeItem("authToken");
    setAuthStatus("loggedOut");
  };

  // Header immer rendern, aber leer bei DB-Fehler

  return (
    <>
      {/* Fehlermeldung anzeigen */}
      {error && (
        <div
          className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 shadow-sm mx-4 mt-4 rounded-r-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start space-x-4 p-4">
            {/* Icon mit Animation */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-red-800">Header-Daten nicht verfügbar</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-800">
                  Fehler
                </span>
              </div>
              <p className="text-sm text-red-700 mb-2">
                Die Header-Daten konnten nicht geladen werden. Bitte überprüfen Sie die
                Datenbankverbindung.
              </p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-red-100 text-red-900 px-2 py-1 rounded font-mono">
                  {error}
                </code>
                <button
                  onClick={() => window.location.reload()}
                  className="ml-3 px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors duration-200 text-xs font-medium"
                >
                  Seite neu laden
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors duration-200"
              aria-label="Fehlermeldung schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <header
        className="sticky top-0 z-50 bg-weiss dark:bg-dunkelgrau shadow-mittel border-b border-hellgrau dark:border-dunkelgrau"
        role="banner"
        aria-label="Hauptnavigation"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Links */}
            {headerData && (
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] focus-visible:outline-offset-2 rounded"
                  aria-label="Zur Startseite"
                >
                  {/* LW Icon */}
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-lg text-white font-bold shadow-lg"
                    style={{
                      background:
                        logoStyling.it_welt_gradient ||
                        "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
                    }}
                  >
                    {headerData?.logo_icon || "LW"}
                  </div>

                  {/* Text Content */}
                  <div
                    className="mr-6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      lineHeight: "1.2",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Montserrat, Arial, sans-serif",
                        fontSize: logoStyling.text_size || "22px",
                        fontWeight: "600",
                        margin: 0,
                        padding: 0,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      <span style={{ color: logoStyling.lopez_color || "#FFD700" }}>Lopez</span>{" "}
                      <span
                        style={{
                          background:
                            logoStyling.it_welt_gradient ||
                            "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: "700",
                          color: "#007BFF",
                        }}
                      >
                        {headerData?.logo_text?.split(" ").slice(1).join(" ") || "IT Welt"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Desktop Navigation - Mitte */}
            {headerData && (
              <nav
                className="hidden lg:flex items-center space-x-8 flex-1 justify-center"
                role="navigation"
                aria-label={ariaLabels.main_nav || "Hauptnavigation"}
              >
                {loading ? (
                  // Loading State für Navigation
                  <>
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </>
                ) : (
                  // Max. 3 normale Links (ohne CTA und ohne Startseite) oder Fallback
                  (navigationItems.length > 0
                    ? navigationItems
                        .filter((item) => item.type !== "button" && item.link !== "/")
                        .slice(0, 3)
                    : [
                        { label: "Leistungen", link: "/leistungen" },
                        { label: "Projekte", link: "/projekte" },
                        { label: "Kontakt", link: "/kontakt" },
                      ]
                  ).map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="text-[#111827] dark:text-white hover:text-[#0A58F4] dark:hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] focus-visible:outline-offset-2 rounded"
                    >
                      {item.label}
                    </Link>
                  ))
                )}
              </nav>
            )}

            {/* Desktop Controls - Rechts */}
            {headerData && (
              <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
                {/* CTA Webshop Button */}
                <Link
                  href="/shop"
                  className="bg-[#0A58F4] hover:bg-[#0A49CF] text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A58F4]"
                >
                  Webshop
                </Link>

                {/* Sprachauswahl Dropdown */}
                {headerData?.language_switch && (
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="px-3 py-2 rounded hover:bg-[#0A58F4] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] text-[#111827] dark:text-white transition-colors duration-300"
                      aria-haspopup="listbox"
                      aria-expanded={isLanguageDropdownOpen}
                      aria-label={`Sprache ändern, aktuell: ${aktuelleSprache.name}`}
                    >
                      {aktuelleSprache.label}
                    </button>

                    {isLanguageDropdownOpen && (
                      <ul
                        role="listbox"
                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        {sprachOptionen.map((option) => (
                          <li key={option.code}>
                            <button
                              role="option"
                              aria-selected={option.code === language}
                              aria-current={option.code === language ? "true" : "false"}
                              className={`w-full text-left px-4 py-3 hover:bg-[#0A58F4] hover:text-white transition-colors duration-300 ${
                                option.code === language
                                  ? "bg-[#0A58F4] text-white"
                                  : "text-[#111827] dark:text-white"
                              }`}
                              onClick={() =>
                                handleSpracheWechseln(option.code as "de" | "en" | "es")
                              }
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-sm opacity-75">{option.name}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Dark Mode Toggle */}
                <button
                  onClick={handleDarkModeToggle}
                  className="p-2 text-[#111827] dark:text-white hover:text-[#0A58F4] dark:hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                  aria-label={isDarkMode ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Barrierefreiheit Toggle */}
                <button
                  onClick={handleAccessibilityToggle}
                  className={`p-2 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded ${
                    isAccessibilityMode
                      ? "text-[#0A58F4]"
                      : "text-[#111827] dark:text-white hover:text-[#0A58F4]"
                  }`}
                  aria-label={
                    isAccessibilityMode
                      ? "Barrierefreiheit deaktivieren"
                      : "Barrierefreiheit aktivieren"
                  }
                >
                  <Accessibility className="w-5 h-5" />
                </button>

                {/* Auth-Bereich */}
                <div className="flex items-center">
                  {authStatus === "loggedIn" ? (
                    <button
                      onClick={handleAbmelden}
                      className="text-sm text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                    >
                      Abmelden
                    </button>
                  ) : (
                    <Link
                      href="/shop/login"
                      className="text-sm text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                    >
                      Anmelden
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              ref={buttonRef}
              onClick={handleMenuToggle}
              className="lg:hidden p-2 text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
              aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="lg:hidden fixed inset-0 z-50 bg-black/40"
              role="dialog"
              aria-modal="true"
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className="ml-auto h-full w-80 bg-white dark:bg-gray-900 p-6 flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111827] dark:text-white">Menü</span>
                  <button
                    aria-label="Menü schließen"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-[#111827] dark:text-white hover:text-[#0A58F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col gap-3" aria-label="Mobiles Menü">
                  {loading ? (
                    // Loading State für Mobile Navigation
                    <>
                      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </>
                  ) : (
                    // Max. 3 normale Links + CTA oder Fallback (ohne Startseite)
                    <>
                      {(navigationItems.length > 0
                        ? navigationItems
                            .filter((item) => item.type !== "button" && item.link !== "/")
                            .slice(0, 3)
                        : [
                            { label: "Leistungen", link: "/leistungen" },
                            { label: "Projekte", link: "/projekte" },
                            { label: "Kontakt", link: "/kontakt" },
                          ]
                      ).map((item, index) => (
                        <Link
                          key={index}
                          href={item.link}
                          className="text-[#111827] dark:text-white py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* CTA Webshop */}
                      <Link
                        href="/shop"
                        className="mt-2 bg-[#0A58F4] hover:bg-[#0A49CF] text-white text-center px-4 py-2 rounded-xl font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Webshop
                      </Link>
                    </>
                  )}

                  {/* Mobile Sprachauswahl */}
                  <div className="mt-4">
                    <div className="text-sm text-[#6B7280] mb-2">Sprache</div>
                    <div className="flex gap-2">
                      {sprachOptionen.map((option) => (
                        <button
                          key={option.code}
                          className={`px-3 py-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-[#0A58F4] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] transition-colors duration-300 ${
                            option.code === language
                              ? "bg-[#0A58F4] text-white border-[#0A58F4]"
                              : "text-[#111827] dark:text-white"
                          }`}
                          onClick={() => {
                            handleSpracheWechseln(option.code as "de" | "en" | "es");
                            setIsMenuOpen(false);
                          }}
                          aria-label={`${option.name} auswählen`}
                          aria-current={option.code === language ? "true" : "false"}
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-sm">{option.label}</span>
                            <span className="text-xs opacity-75">{option.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Toggles */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={handleDarkModeToggle}
                      className="p-2 text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                      aria-label={isDarkMode ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={handleAccessibilityToggle}
                      className={`p-2 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded ${
                        isAccessibilityMode
                          ? "text-[#0A58F4]"
                          : "text-[#111827] dark:text-white hover:text-[#0A58F4]"
                      }`}
                      aria-label={
                        isAccessibilityMode
                          ? "Barrierefreiheit deaktivieren"
                          : "Barrierefreiheit aktivieren"
                      }
                    >
                      <Accessibility className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile Auth */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {authStatus === "loggedIn" ? (
                      <button
                        onClick={() => {
                          handleAbmelden();
                          setIsMenuOpen(false);
                        }}
                        className="text-sm text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                      >
                        Abmelden
                      </button>
                    ) : (
                      <Link
                        href="/shop/login"
                        className="text-sm text-[#111827] dark:text-white hover:text-[#0A58F4] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A58F4] rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Anmelden
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cookie Banner */}
      {dsgvoZustimmung === null && (
        <CookieBanner onZustimmung={() => setDsgvoZustimmung("accepted")} />
      )}
    </>
  );
}
