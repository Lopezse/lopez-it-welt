import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Deutsche Farben nach Pflichtenheft V1.2 - NUR diese 10 Farben sind erlaubt
      colors: {
        // Primärfarben (nur CI-konform und dokumentiert)
        hauptblau: '#0055A4', // Buttons, Links, Akzente
        akzentblau: '#00BFFF', // Hover, CTA, Icons
        gelb: '#FFD700', // Warnung, Akzent, Icons
        dunkelgrau: '#1C1C1C', // Text, Header, Footer
        hellgrau: '#F4F4F4', // Flächen, Inputs, Sektionen
        weiss: '#FFFFFF', // Hintergrund, Text
        gruen: '#48BB78', // Erfolgsmeldungen
        rot: '#F56565', // Fehlermeldungen
        orange: '#ED8936', // Warnungen
        kontrast: '#000000', // Fokus, Outline

        // Textfarben (nur dokumentierte)
        textfarbe: '#2d3748', // Haupttext
        texthell: '#4a5568', // Sekundärtext
        textweiss: '#ffffff', // Weißer Text

        // Hintergrundfarben (nur dokumentierte)
        hintergrund: '#f7fafc', // Haupthintergrund
        hintergrundweiss: '#ffffff', // Weißer Hintergrund
        hintergrundgrau: '#f1f5f9', // Grauer Hintergrund

        // Statusfarben (nur dokumentierte)
        info: '#4299E1', // Info
      },

      // Deutsche Schriftgrößen
      fontSize: {
        klein: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        basis: ['1rem', { lineHeight: '1.5rem' }], // 16px
        gross: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'ueberschrift-klein': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'ueberschrift-mittel': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'ueberschrift-gross': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'ueberschrift-xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        'ueberschrift-2xl': ['3rem', { lineHeight: '1' }], // 48px
      },

      // Deutsche Abstände
      spacing: {
        'abstand-klein': '0.25rem', // 4px
        'abstand-mittel': '0.5rem', // 8px
        'abstand-gross': '1rem', // 16px
        'abstand-xl': '1.5rem', // 24px
        'abstand-2xl': '2rem', // 32px
        'abstand-3xl': '3rem', // 48px
      },

      // Deutsche Schatten
      boxShadow: {
        klein: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        mittel:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        gross:
          '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      // Deutsche Rundungen
      borderRadius: {
        'abgerundet-klein': '0.25rem', // 4px
        'abgerundet-mittel': '0.375rem', // 6px
        'abgerundet-gross': '0.5rem', // 8px
        'abgerundet-xl': '0.75rem', // 12px
        'abgerundet-2xl': '1rem', // 16px
        'abgerundet-voll': '9999px', // Vollständig rund
      },

      // Deutsche Übergänge
      transitionDuration: {
        'uebergang-schnell': '150ms',
        'uebergang-normal': '300ms',
        'uebergang-langsam': '500ms',
      },

      // Deutsche Animationen
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-delay-1': 'fadeIn 0.8s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fadeIn 0.8s ease-out 0.4s forwards',
        'fade-in-delay-3': 'fadeIn 0.8s ease-out 0.6s forwards',
        'fade-in-delay-4': 'fadeIn 0.8s ease-out 0.8s forwards',
        'fade-in-delay-5': 'fadeIn 0.8s ease-out 1.0s forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      fontFamily: {
        sans: ['Inter', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
