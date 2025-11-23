// i18n Konfiguration für Lopez IT Welt
// Diese Datei stellt die i18n-Konfiguration bereit

export const i18nConfig = {
  defaultLanguage: "de",
  supportedLanguages: ["de", "en", "es"],
  fallbackLanguage: "de",
  namespaces: ["common", "datenschutz", "impressum"],
  defaultNamespace: "common",
};

export const languageNames = {
  de: "Deutsch",
  en: "English",
  es: "Español",
};

export const languageFlags = {
  de: "/flag-de.svg",
  en: "/flag-gb.svg",
  es: "/flag-es.svg",
};

// Export für Kompatibilität mit bestehenden Imports
export default i18nConfig;
