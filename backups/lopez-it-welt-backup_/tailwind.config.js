/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // CI-Farben
      colors: {
        // Primärfarben
        hauptblau: '#1e40af',
        akzentblau: '#3b82f6',
        dunkelgrau: '#1f2937',
        hellgrau: '#6b7280',

        // Sekundärfarben
        weiss: '#ffffff',
        gelb: '#fbbf24',
        orange: '#f97316',
        rot: '#ef4444',
        gruen: '#10b981',

        // Erweiterte Farben
        'hauptblau-light': '#3b82f6',
        'hauptblau-dark': '#1e3a8a',
        'akzentblau-light': '#60a5fa',
        'akzentblau-dark': '#2563eb',
      },

      // Typografie
      fontSize: {
        'text-klein': ['0.875rem', { lineHeight: '1.25rem' }],
        'text-mittel': ['1rem', { lineHeight: '1.5rem' }],
        'text-gross': ['1.125rem', { lineHeight: '1.75rem' }],
        'ueberschrift-klein': ['1.125rem', { lineHeight: '1.25rem' }],
        'ueberschrift-mittel': ['1.25rem', { lineHeight: '1.5rem' }],
        'ueberschrift-gross': ['1.5rem', { lineHeight: '2rem' }],
        'ueberschrift-xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'ueberschrift-2xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      // Abstände
      spacing: {
        'abstand-klein': '0.5rem',
        'abstand-mittel': '1rem',
        'abstand-gross': '1.5rem',
        'abstand-xl': '2rem',
        'abstand-2xl': '3rem',
      },

      // Border Radius
      borderRadius: {
        'abgerundet-klein': '0.25rem',
        'abgerundet-mittel': '0.5rem',
        'abgerundet-gross': '0.75rem',
        'abgerundet-xl': '1rem',
        'abgerundet-2xl': '1.5rem',
      },

      // Schatten
      boxShadow: {
        klein: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        mittel: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        gross: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        hauptblau: '0 4px 14px 0 rgba(30, 64, 175, 0.25)',
        akzentblau: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
      },

      // Übergänge
      transitionDuration: {
        'uebergang-schnell': '150ms',
        'uebergang-normal': '300ms',
        'uebergang-langsam': '500ms',
      },

      // Skalierung
      scale: {
        98: '0.98',
        102: '1.02',
        105: '1.05',
        112: '1.12',
      },

      // Animationen
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },

      // Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },

      // Z-Index
      zIndex: {
        modal: '1000',
        overlay: '999',
        dropdown: '100',
        sticky: '10',
      },
    },
  },
  plugins: [
    // Custom Plugin für Accessibility
    function ({ addUtilities }) {
      const newUtilities = {
        '.high-contrast': {
          '--tw-text-opacity': '1',
          color: 'rgb(0 0 0)',
          'background-color': 'rgb(255 255 255)',
        },
        '.reduced-motion': {
          'animation-duration': '0.01ms !important',
          'animation-iteration-count': '1 !important',
          'transition-duration': '0.01ms !important',
        },
        '.focus-visible': {
          outline: '2px solid rgb(59 130 246)',
          'outline-offset': '2px',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
