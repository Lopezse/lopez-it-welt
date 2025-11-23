/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Barrierefreie CI-Farben (WCAG AA/AAA konform)
      colors: {
        // Primärfarben
        hauptblau: "#1e40af",
        akzentblau: "#3b82f6",
        dunkelgrau: "#1f2937",
        hellgrau: "#6b7280",

        // Sekundärfarben
        weiss: "#ffffff",
        gelb: "#fbbf24",
        orange: "#f97316",
        rot: "#ef4444",
        gruen: "#10b981",

        // Erweiterte Farben
        "hauptblau-light": "#3b82f6",
        "hauptblau-dark": "#1e3a8a",
        "akzentblau-light": "#60a5fa",
        "akzentblau-dark": "#2563eb",

        // Neutrale Farben - Barrierefrei
        dunkelgrau: "#1f2937", // Sehr dunkel für Text
        mittelgrau: "#4b5563", // Mittel für Sekundärtext
        hellgrau: "#9ca3af", // Hell für Tertiärtext
        sehrhellgrau: "#f3f4f6", // Sehr hell für Hintergründe

        // Akzentfarben - Barrierefrei
        weiss: "#ffffff",
        schwarz: "#000000",
        gelb: "#fbbf24", // Warnung
        orange: "#ea580c", // Orange (dunkler für Kontrast)
        rot: "#dc2626", // Fehler (dunkler)
        gruen: "#059669", // Erfolg (dunkler)

        // Barrierefreie Textfarben
        "text-primary": "#1f2937", // Haupttext (Kontrast 15:1)
        "text-secondary": "#4b5563", // Sekundärtext (Kontrast 7:1)
        "text-tertiary": "#6b7280", // Tertiärtext (Kontrast 4.5:1)
        "text-inverse": "#ffffff", // Text auf dunklem Hintergrund

        // Barrierefreie Hintergrundfarben
        "bg-primary": "#ffffff", // Haupthintergrund
        "bg-secondary": "#f9fafb", // Sekundärhintergrund
        "bg-tertiary": "#f3f4f6", // Tertiärhintergrund
        "bg-dark": "#1f2937", // Dunkler Hintergrund

        // Barrierefreie Linkfarben
        "link-primary": "#1d4ed8", // Hauptlinks
        "link-hover": "#1e40af", // Hover-Zustand
        "link-visited": "#7c3aed", // Besuchte Links
      },

      // Typografie - Barrierefrei
      fontSize: {
        "text-klein": ["0.875rem", { lineHeight: "1.5rem" }], // 14px
        "text-mittel": ["1rem", { lineHeight: "1.75rem" }], // 16px
        "text-gross": ["1.125rem", { lineHeight: "2rem" }], // 18px
        "ueberschrift-klein": ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        "ueberschrift-mittel": ["1.5rem", { lineHeight: "2rem" }], // 24px
        "ueberschrift-gross": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "ueberschrift-xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
        "ueberschrift-2xl": ["3rem", { lineHeight: "3.5rem" }], // 48px
      },

      // Abstände
      spacing: {
        "abstand-klein": "0.5rem",
        "abstand-mittel": "1rem",
        "abstand-gross": "1.5rem",
        "abstand-xl": "2rem",
        "abstand-2xl": "3rem",
      },

      // Border Radius
      borderRadius: {
        "abgerundet-klein": "0.25rem",
        "abgerundet-mittel": "0.5rem",
        "abgerundet-gross": "0.75rem",
        "abgerundet-xl": "1rem",
        "abgerundet-2xl": "1.5rem",
      },

      // Schatten - Barrierefrei
      boxShadow: {
        klein: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        mittel: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        gross: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        hauptblau: "0 4px 14px 0 rgba(30, 64, 175, 0.25)",
        akzentblau: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
        focus: "0 0 0 3px rgba(59, 130, 246, 0.5)", // Focus-Ring
      },

      // Übergänge
      transitionDuration: {
        "uebergang-schnell": "150ms",
        "uebergang-normal": "300ms",
        "uebergang-langsam": "500ms",
      },

      // Skalierung
      scale: {
        98: "0.98",
        102: "1.02",
        105: "1.05",
        112: "1.12",
      },

      // Animationen - Barrierefrei (reduzierte Bewegung)
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "bounce-gentle": "bounce-gentle 2s infinite",
      },

      // Backdrop Blur
      backdropBlur: {
        xs: "2px",
      },

      // Z-Index
      zIndex: {
        modal: "1000",
        overlay: "999",
        dropdown: "100",
        sticky: "10",
      },
    },
  },
  plugins: [
    // Barrierefreiheit-Plugin
    function ({ addUtilities, addComponents }) {
      const accessibilityUtilities = {
        // Hoher Kontrast
        ".high-contrast": {
          "--tw-text-opacity": "1",
          color: "rgb(0 0 0)",
          "background-color": "rgb(255 255 255)",
        },
        // Reduzierte Bewegung
        ".reduced-motion": {
          "animation-duration": "0.01ms !important",
          "animation-iteration-count": "1 !important",
          "transition-duration": "0.01ms !important",
        },
        // Focus-Styles
        ".focus-visible": {
          outline: "2px solid rgb(59 130 246)",
          "outline-offset": "2px",
        },
        // Barrierefreie Links
        ".link-accessible": {
          color: "#1d4ed8",
          "text-decoration": "underline",
          "text-underline-offset": "2px",
          "&:hover": {
            color: "#1e40af",
            "text-decoration-thickness": "3px",
          },
          "&:focus": {
            outline: "2px solid rgb(59 130 246)",
            "outline-offset": "2px",
          },
        },
        // Barrierefreie Buttons
        ".btn-accessible": {
          "background-color": "#1d4ed8",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          "border-radius": "0.375rem",
          "font-weight": "600",
          "text-decoration": "none",
          display: "inline-block",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            "background-color": "#1e40af",
            transform: "translateY(-1px)",
          },
          "&:focus": {
            outline: "2px solid rgb(59 130 246)",
            "outline-offset": "2px",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        // Barrierefreie Karten
        ".card-accessible": {
          "background-color": "#ffffff",
          border: "1px solid #e5e7eb",
          "border-radius": "0.5rem",
          padding: "1.5rem",
          "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          "&:focus-within": {
            outline: "2px solid rgb(59 130 246)",
            "outline-offset": "2px",
          },
        },
      };

      addUtilities(accessibilityUtilities);
    },
  ],
};
