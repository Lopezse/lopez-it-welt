"use client";

import { useState, useEffect } from "react";
import { FaBuilding, FaUpload, FaPalette, FaFileAlt } from "react-icons/fa";

interface CompanyData {
  company_name: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_light_url?: string;
  logo_dark_url?: string;
  color_lopez: string;
  color_itwelt: string;
  color_itwelt_dark: string;
  impressum_text?: string;
  datenschutz_text?: string;
}

export default function CompanyBranding() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CompanyData | null>(null);
  const [logoLightFile, setLogoLightFile] = useState<File | null>(null);
  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/settings/company");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          if (result.data.logo_light_url) {
            setLogoLightPreview(result.data.logo_light_url);
          }
          if (result.data.logo_dark_url) {
            setLogoDarkPreview(result.data.logo_dark_url);
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Unternehmensdaten:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (type: "light" | "dark", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Datei ist zu groß. Maximal 1MB erlaubt.");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|jpg|png|svg)$/)) {
        alert("Nur JPG, PNG und SVG Dateien sind erlaubt.");
        return;
      }
      if (type === "light") {
        setLogoLightFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoLightPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setLogoDarkFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoDarkPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleLogoUpload = async (type: "light" | "dark") => {
    const file = type === "light" ? logoLightFile : logoDarkFile;
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/admin/settings/company/logo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (type === "light") {
            setData({ ...data!, logo_light_url: result.data.logo_url });
            setLogoLightFile(null);
          } else {
            setData({ ...data!, logo_dark_url: result.data.logo_url });
            setLogoDarkFile(null);
          }
          alert("Logo erfolgreich hochgeladen.");
        }
      } else {
        alert("Fehler beim Hochladen des Logos.");
      }
    } catch (error) {
      console.error("Fehler beim Hochladen des Logos:", error);
      alert("Fehler beim Hochladen des Logos.");
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.company_name,
          address: data.address,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          color_lopez: data.color_lopez,
          color_itwelt: data.color_itwelt,
          color_itwelt_dark: data.color_itwelt_dark,
          impressum_text: data.impressum_text,
          datenschutz_text: data.datenschutz_text,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Unternehmensdaten erfolgreich aktualisiert.");
        }
      } else {
        alert("Fehler beim Aktualisieren der Unternehmensdaten.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade Unternehmensdaten...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Firmeninformationen */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaBuilding className="mr-2" style={{ width: "18px", height: "18px" }} />
          Firmeninformationen
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Firmenname
            </label>
            <input
              type="text"
              value={data.company_name}
              onChange={(e) => setData({ ...data, company_name: e.target.value })}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Adresse
            </label>
            <textarea
              value={data.address || ""}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                Kontakt-E-Mail
              </label>
              <input
                type="email"
                value={data.contact_email || ""}
                onChange={(e) => setData({ ...data, contact_email: e.target.value })}
                className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                Kontakt-Telefon
              </label>
              <input
                type="tel"
                value={data.contact_phone || ""}
                onChange={(e) => setData({ ...data, contact_phone: e.target.value })}
                className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
          Logo-Upload
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Logo hell (Light Theme)
            </label>
            <div className="flex items-center space-x-4">
              {logoLightPreview && (
                <img
                  src={logoLightPreview}
                  alt="Logo Light"
                  className="h-20 w-20 object-contain rounded border"
                  style={{ borderColor: "#272a33" }}
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                  onChange={(e) => handleLogoChange("light", e)}
                  className="hidden"
                  id="logo-light-upload"
                />
                <label
                  htmlFor="logo-light-upload"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#272a33",
                    color: "#b3b3b3",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f2329";
                    e.currentTarget.style.borderColor = "#3a3d47";
                    e.currentTarget.style.color = "#f4f4f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#272a33";
                    e.currentTarget.style.color = "#b3b3b3";
                  }}
                >
                  <FaUpload className="mr-2" style={{ width: "14px", height: "14px" }} />
                  Auswählen
                </label>
                {logoLightFile && (
                  <button
                    onClick={() => handleLogoUpload("light")}
                    className="ml-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                    style={{
                      backgroundColor: "#007bff",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0056b3";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#007bff";
                    }}
                  >
                    Hochladen
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "#8a8a8a" }}>
              Empfohlen: 200x200px, PNG/SVG
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Logo dunkel (Dark Theme)
            </label>
            <div className="flex items-center space-x-4">
              {logoDarkPreview && (
                <img
                  src={logoDarkPreview}
                  alt="Logo Dark"
                  className="h-20 w-20 object-contain rounded border"
                  style={{ borderColor: "#272a33" }}
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                  onChange={(e) => handleLogoChange("dark", e)}
                  className="hidden"
                  id="logo-dark-upload"
                />
                <label
                  htmlFor="logo-dark-upload"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#272a33",
                    color: "#b3b3b3",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f2329";
                    e.currentTarget.style.borderColor = "#3a3d47";
                    e.currentTarget.style.color = "#f4f4f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#272a33";
                    e.currentTarget.style.color = "#b3b3b3";
                  }}
                >
                  <FaUpload className="mr-2" style={{ width: "14px", height: "14px" }} />
                  Auswählen
                </label>
                {logoDarkFile && (
                  <button
                    onClick={() => handleLogoUpload("dark")}
                    className="ml-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                    style={{
                      backgroundColor: "#007bff",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0056b3";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#007bff";
                    }}
                  >
                    Hochladen
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "#8a8a8a" }}>
              Empfohlen: 200x200px, PNG/SVG
            </p>
          </div>
        </div>
      </div>

      {/* Farben */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaPalette className="mr-2" style={{ width: "18px", height: "18px" }} />
          Markenfarben
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Lopez (Gold)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={data.color_lopez}
                onChange={(e) => setData({ ...data, color_lopez: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
                style={{ borderColor: "#272a33" }}
              />
              <input
                type="text"
                value={data.color_lopez}
                onChange={(e) => setData({ ...data, color_lopez: e.target.value })}
                className="flex-1 px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
            <div className="mt-2 p-3 rounded" style={{ backgroundColor: data.color_lopez }}>
              <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
                Vorschau: Lopez
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              IT Welt (Blau)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={data.color_itwelt}
                onChange={(e) => setData({ ...data, color_itwelt: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
                style={{ borderColor: "#272a33" }}
              />
              <input
                type="text"
                value={data.color_itwelt}
                onChange={(e) => setData({ ...data, color_itwelt: e.target.value })}
                className="flex-1 px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
            <div className="mt-2 p-3 rounded" style={{ backgroundColor: data.color_itwelt }}>
              <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
                Vorschau: IT Welt
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              IT Welt (Dunkel-Blau)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={data.color_itwelt_dark}
                onChange={(e) => setData({ ...data, color_itwelt_dark: e.target.value })}
                className="h-10 w-20 rounded border cursor-pointer"
                style={{ borderColor: "#272a33" }}
              />
              <input
                type="text"
                value={data.color_itwelt_dark}
                onChange={(e) => setData({ ...data, color_itwelt_dark: e.target.value })}
                className="flex-1 px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
            <div className="mt-2 p-3 rounded" style={{ backgroundColor: data.color_itwelt_dark }}>
              <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
                Vorschau: IT Welt Dark
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rechtstexte */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaFileAlt className="mr-2" style={{ width: "18px", height: "18px" }} />
          Rechtstexte
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Impressum
            </label>
            <textarea
              value={data.impressum_text || ""}
              onChange={(e) => setData({ ...data, impressum_text: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217] font-mono"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Datenschutz
            </label>
            <textarea
              value={data.datenschutz_text || ""}
              onChange={(e) => setData({ ...data, datenschutz_text: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217] font-mono"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t" style={{ borderColor: "#272a33" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = "#0056b3";
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = "#007bff";
            }
          }}
        >
          {saving ? "Speichern..." : "Änderungen speichern"}
        </button>
      </div>
    </div>
  );
}
