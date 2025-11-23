"use client";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { FaEye, FaSave, FaUndo } from "react-icons/fa";

interface HeaderData {
  logoText: string;
  navigation: Array<{
    label: string;
    href: string;
    isActive: boolean;
  }>;
  languages: string[];
  ctaButton: {
    text: string;
    href: string;
  };
}

interface FooterData {
  companyName: string;
  description: string;
  links: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  socialMedia: Array<{
    platform: string;
    href: string;
    icon: string;
  }>;
  copyright: string;
}

export default function HeaderFooterManagement() {
  const [headerData, setHeaderData] = useState<HeaderData>({
    logoText: "Lopez IT Welt",
    navigation: [
      { label: "Leistungen", href: "/leistungen", isActive: true },
      { label: "Projekte", href: "/projekte", isActive: true },
      { label: "Kontakt", href: "/kontakt", isActive: true },
    ],
    languages: ["DE", "EN", "ES"],
    ctaButton: {
      text: "Webshop",
      href: "/shop",
    },
  });

  const [footerData, setFooterData] = useState<FooterData>({
    companyName: "Lopez IT Welt",
    description: "Digitale Lösungen für alle. Barrierefrei, mehrsprachig und sicher.",
    links: [
      {
        title: "Unternehmen",
        items: [
          { label: "Über uns", href: "/about" },
          { label: "Team", href: "/team" },
          { label: "Karriere", href: "/career" },
        ],
      },
      {
        title: "Leistungen",
        items: [
          { label: "Webentwicklung", href: "/services/web" },
          { label: "App-Entwicklung", href: "/services/app" },
          { label: "Beratung", href: "/services/consulting" },
        ],
      },
      {
        title: "Rechtliches",
        items: [
          { label: "Impressum", href: "/imprint" },
          { label: "Datenschutz", href: "/privacy" },
          { label: "AGB", href: "/terms" },
        ],
      },
    ],
    socialMedia: [
      {
        platform: "LinkedIn",
        href: "https://linkedin.com/company/lopez-it-welt",
        icon: "FaLinkedin",
      },
      {
        platform: "Twitter",
        href: "https://twitter.com/lopezitwelt",
        icon: "FaTwitter",
      },
      {
        platform: "GitHub",
        href: "https://github.com/lopez-it-welt",
        icon: "FaGithub",
      },
    ],
    copyright: "© 2025 Lopez IT Welt. Alle Rechte vorbehalten.",
  });

  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [hasChanges, setHasChanges] = useState(false);

  const handleHeaderChange = (field: string, value: any) => {
    setHeaderData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleFooterChange = (field: string, value: any) => {
    setFooterData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Hier würde die API-Call stattfinden
    console.log("Saving data:", { headerData, footerData });
    setHasChanges(false);
    // Erfolgsmeldung anzeigen
  };

  const handleReset = () => {
    // Daten zurücksetzen
    setHasChanges(false);
    // Erfolgsmeldung anzeigen
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Header & Footer Verwaltung</h1>
          <p className="text-gray-600">Konfigurieren Sie Header und Footer Ihrer Website</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("header")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "header"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Header-Konfiguration
              </button>
              <button
                onClick={() => setActiveTab("footer")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "footer"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Footer-Konfiguration
              </button>
            </nav>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                hasChanges
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaSave className="mr-2" />
              Speichern
            </button>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FaUndo className="mr-2" />
              Zurücksetzen
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <FaEye className="mr-2" />
              Vorschau
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "header" ? (
          <div className="space-y-6">
            {/* Logo */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo-Text</label>
                  <input
                    type="text"
                    value={headerData.logoText}
                    onChange={(e) => handleHeaderChange("logoText", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-4">
                {headerData.navigation.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const newNav = [...headerData.navigation];
                        newNav[index].label = e.target.value;
                        handleHeaderChange("navigation", newNav);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Menüpunkt"
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => {
                        const newNav = [...headerData.navigation];
                        newNav[index].href = e.target.value;
                        handleHeaderChange("navigation", newNav);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="/pfad"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => {
                          const newNav = [...headerData.navigation];
                          newNav[index].isActive = e.target.checked;
                          handleHeaderChange("navigation", newNav);
                        }}
                        className="mr-2"
                      />
                      Aktiv
                    </label>
                  </div>
                ))}
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  + Neuen Menüpunkt hinzufügen
                </button>
              </div>
            </Card>

            {/* CTA Button */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call-to-Action Button</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button-Text
                  </label>
                  <input
                    type="text"
                    value={headerData.ctaButton.text}
                    onChange={(e) =>
                      handleHeaderChange("ctaButton", {
                        ...headerData.ctaButton,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="text"
                    value={headerData.ctaButton.href}
                    onChange={(e) =>
                      handleHeaderChange("ctaButton", {
                        ...headerData.ctaButton,
                        href: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprachen</h3>
              <div className="space-y-2">
                {headerData.languages.map((lang, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={lang}
                      onChange={(e) => {
                        const newLangs = [...headerData.languages];
                        newLangs[index] = e.target.value;
                        handleHeaderChange("languages", newLangs);
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  + Sprache hinzufügen
                </button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Unternehmensinformationen
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firmenname</label>
                  <input
                    type="text"
                    value={footerData.companyName}
                    onChange={(e) => handleFooterChange("companyName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    value={footerData.description}
                    onChange={(e) => handleFooterChange("description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>

            {/* Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer-Links</h3>
              <div className="space-y-6">
                {footerData.links.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newLinks = [...footerData.links];
                          newLinks[sectionIndex].title = e.target.value;
                          handleFooterChange("links", newLinks);
                        }}
                        className="text-lg font-medium px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const newLinks = [...footerData.links];
                              newLinks[sectionIndex].items[itemIndex].label = e.target.value;
                              handleFooterChange("links", newLinks);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Link-Text"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const newLinks = [...footerData.links];
                              newLinks[sectionIndex].items[itemIndex].href = e.target.value;
                              handleFooterChange("links", newLinks);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="/pfad"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        + Link hinzufügen
                      </button>
                    </div>
                  </div>
                ))}
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  + Link-Sektion hinzufügen
                </button>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
              <div className="space-y-4">
                {footerData.socialMedia.map((social, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={social.platform}
                      onChange={(e) => {
                        const newSocial = [...footerData.socialMedia];
                        newSocial[index].platform = e.target.value;
                        handleFooterChange("socialMedia", newSocial);
                      }}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Platform"
                    />
                    <input
                      type="text"
                      value={social.href}
                      onChange={(e) => {
                        const newSocial = [...footerData.socialMedia];
                        newSocial[index].href = e.target.value;
                        handleFooterChange("socialMedia", newSocial);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  + Social Media hinzufügen
                </button>
              </div>
            </Card>

            {/* Copyright */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Copyright</h3>
              <input
                type="text"
                value={footerData.copyright}
                onChange={(e) => handleFooterChange("copyright", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
