'use client';
import { Accessibility, Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CookieBanner } from '../Features/CookieBanner';
import { useI18n } from '../Features/I18nProvider';

export default function Header() {
  const { t, language, setLanguage } = useI18n();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [dsgvoZustimmung, setDsgvoZustimmung] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'loggedIn' | 'loggedOut'>(
    'loggedOut'
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // DSGVO-Zustimmung prüfen
  useEffect(() => {
    const zustimmung = localStorage.getItem('dsgvoZustimmung');
    setDsgvoZustimmung(zustimmung);
  }, []);

  // Dark Mode prüfen
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Barrierefreiheit-Modus prüfen
  useEffect(() => {
    const accessibilityMode =
      localStorage.getItem('accessibilityMode') === 'true';
    setIsAccessibilityMode(accessibilityMode);
    if (accessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    }
  }, []);

  // Auth-Status prüfen
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthStatus(token ? 'loggedIn' : 'loggedOut');
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
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAccessibilityToggle = () => {
    const newAccessibilityMode = !isAccessibilityMode;
    setIsAccessibilityMode(newAccessibilityMode);
    localStorage.setItem('accessibilityMode', newAccessibilityMode.toString());

    if (newAccessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  };

  const handleSpracheWechseln = (sprache: 'de' | 'en' | 'es') => {
    setLanguage(sprache);
    localStorage.setItem('lopez-it-welt-sprache', sprache);
  };

  const handleAbmelden = () => {
    localStorage.removeItem('authToken');
    setAuthStatus('loggedOut');
  };

  return (
    <>
      <header
        className='sticky top-0 z-50 bg-weiss dark:bg-dunkelgrau shadow-mittel border-b border-hellgrau dark:border-dunkelgrau'
        role='banner'
        aria-label='Hauptnavigation'
      >
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            {/* Logo */}
            <Link
              href='/'
              className='flex items-center space-x-2 text-hauptblau dark:text-akzentblau hover:text-akzentblau dark:hover:text-gelb transition-colors duration-300'
              aria-label='Zur Startseite'
            >
              <span className='text-xl md:text-2xl font-bold'>
                Lopez IT Welt
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className='hidden md:flex items-center space-x-8'
              role='navigation'
              aria-label='Hauptnavigation'
            >
              <Link
                href='/'
                className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              >
                {t('kopfbereich.navigation.startseite')}
              </Link>
              <Link
                href='/leistungen'
                className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              >
                {t('kopfbereich.navigation.leistungen')}
              </Link>
              <Link
                href='/projekte'
                className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              >
                Projekte
              </Link>
              <Link
                href='/ueber-uns'
                className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              >
                {t('kopfbereich.navigation.ueber_uns')}
              </Link>
              <Link
                href='/kontakt'
                className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              >
                {t('kopfbereich.navigation.kontakt')}
              </Link>
              <Link
                href='/webshop'
                className='bg-hauptblau hover:bg-akzentblau text-weiss px-4 py-2 rounded-lg font-semibold transition-colors duration-300'
                aria-label='Zum Webshop'
              >
                {t('kopfbereich.navigation.webshop')}
              </Link>
            </nav>

            {/* Desktop Controls */}
            <div className='hidden md:flex items-center space-x-4'>
              {/* Sprachauswahl - Drei Sprachen */}
              <div
                className='flex items-center space-x-2'
                role='group'
                aria-label='Sprachauswahl'
              >
                <button
                  onClick={() => handleSpracheWechseln('de')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                    language === 'de'
                      ? 'text-hauptblau dark:text-akzentblau'
                      : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                  }`}
                  aria-label='Deutsch auswählen'
                >
                  DE
                </button>
                <span className='text-dunkelgrau'>|</span>
                <button
                  onClick={() => handleSpracheWechseln('en')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                    language === 'en'
                      ? 'text-hauptblau dark:text-akzentblau'
                      : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                  }`}
                  aria-label='Englisch auswählen'
                >
                  EN
                </button>
                <span className='text-dunkelgrau'>|</span>
                <button
                  onClick={() => handleSpracheWechseln('es')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                    language === 'es'
                      ? 'text-hauptblau dark:text-akzentblau'
                      : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                  }`}
                  aria-label='Spanisch auswählen'
                >
                  ES
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={handleDarkModeToggle}
                className='p-2 text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                aria-label={
                  isDarkMode ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren'
                }
              >
                {isDarkMode ? (
                  <Sun className='w-5 h-5' />
                ) : (
                  <Moon className='w-5 h-5' />
                )}
              </button>

              {/* Barrierefreiheit Toggle */}
              <button
                onClick={handleAccessibilityToggle}
                className={`p-2 transition-colors duration-300 ${
                  isAccessibilityMode
                    ? 'text-hauptblau dark:text-akzentblau'
                    : 'text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau'
                }`}
                aria-label={
                  isAccessibilityMode
                    ? 'Barrierefreiheit deaktivieren'
                    : 'Barrierefreiheit aktivieren'
                }
              >
                <Accessibility className='w-5 h-5' />
              </button>

              {/* Auth-Bereich */}
              <div className='flex items-center space-x-2'>
                {authStatus === 'loggedIn' ? (
                  <>
                    <span className='text-sm text-dunkelgrau dark:text-weiss'>
                      {t('kopfbereich.auth.willkommen')}
                    </span>
                    <button
                      onClick={handleAbmelden}
                      className='text-sm text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    >
                      {t('kopfbereich.auth.abmelden')}
                    </button>
                  </>
                ) : (
                  <Link
                    href='/login'
                    className='text-sm text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                  >
                    {t('kopfbereich.auth.anmelden')}
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={buttonRef}
              onClick={handleMenuToggle}
              className='md:hidden p-2 text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
              aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className='md:hidden absolute top-full left-0 right-0 bg-weiss dark:bg-dunkelgrau border-b border-hellgrau dark:border-dunkelgrau shadow-mittel'
              role='navigation'
              aria-label='Mobile Navigation'
            >
              <div className='container mx-auto px-4 py-4'>
                <nav className='flex flex-col space-y-4'>
                  <Link
                    href='/'
                    className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('kopfbereich.navigation.startseite')}
                  </Link>
                  <Link
                    href='/leistungen'
                    className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('kopfbereich.navigation.leistungen')}
                  </Link>
                  <Link
                    href='/projekte'
                    className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Projekte
                  </Link>
                  <Link
                    href='/ueber-uns'
                    className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('kopfbereich.navigation.ueber_uns')}
                  </Link>
                  <Link
                    href='/kontakt'
                    className='text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('kopfbereich.navigation.kontakt')}
                  </Link>
                  <Link
                    href='/webshop'
                    className='bg-hauptblau hover:bg-akzentblau text-weiss px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-center'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('kopfbereich.navigation.webshop')}
                  </Link>
                </nav>

                {/* Mobile Controls */}
                <div className='mt-6 pt-4 border-t border-hellgrau dark:border-dunkelgrau'>
                  <div className='flex items-center justify-between'>
                    {/* Mobile Sprachauswahl */}
                    <div
                      className='flex items-center space-x-2'
                      role='group'
                      aria-label='Mobile Sprachauswahl'
                    >
                      <button
                        onClick={() => handleSpracheWechseln('de')}
                        className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                          language === 'de'
                            ? 'text-hauptblau dark:text-akzentblau'
                            : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                        }`}
                        aria-label='Deutsch auswählen'
                      >
                        DE
                      </button>
                      <span className='text-dunkelgrau'>|</span>
                      <button
                        onClick={() => handleSpracheWechseln('en')}
                        className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                          language === 'en'
                            ? 'text-hauptblau dark:text-akzentblau'
                            : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                        }`}
                        aria-label='Englisch auswählen'
                      >
                        EN
                      </button>
                      <span className='text-dunkelgrau'>|</span>
                      <button
                        onClick={() => handleSpracheWechseln('es')}
                        className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-300 ${
                          language === 'es'
                            ? 'text-hauptblau dark:text-akzentblau'
                            : 'text-dunkelgrau dark:text-dunkelgrau hover:text-hauptblau dark:hover:text-akzentblau'
                        }`}
                        aria-label='Spanisch auswählen'
                      >
                        ES
                      </button>
                    </div>

                    {/* Mobile Toggles */}
                    <div className='flex items-center space-x-2'>
                      {/* Dark Mode Toggle */}
                      <button
                        onClick={handleDarkModeToggle}
                        className='p-2 text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                        aria-label={
                          isDarkMode
                            ? 'Hellmodus aktivieren'
                            : 'Dunkelmodus aktivieren'
                        }
                      >
                        {isDarkMode ? (
                          <Sun className='w-5 h-5' />
                        ) : (
                          <Moon className='w-5 h-5' />
                        )}
                      </button>

                      {/* Barrierefreiheit Toggle */}
                      <button
                        onClick={handleAccessibilityToggle}
                        className={`p-2 transition-colors duration-300 ${
                          isAccessibilityMode
                            ? 'text-hauptblau dark:text-akzentblau'
                            : 'text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau'
                        }`}
                        aria-label={
                          isAccessibilityMode
                            ? 'Barrierefreiheit deaktivieren'
                            : 'Barrierefreiheit aktivieren'
                        }
                      >
                        <Accessibility className='w-5 h-5' />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Auth */}
                  <div className='mt-4 pt-4 border-t border-hellgrau dark:border-dunkelgrau'>
                    {authStatus === 'loggedIn' ? (
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-dunkelgrau dark:text-weiss'>
                          {t('kopfbereich.auth.willkommen')}
                        </span>
                        <button
                          onClick={handleAbmelden}
                          className='text-sm text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                        >
                          {t('kopfbereich.auth.abmelden')}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href='/login'
                        className='text-sm text-dunkelgrau dark:text-weiss hover:text-hauptblau dark:hover:text-akzentblau transition-colors duration-300'
                      >
                        {t('kopfbereich.auth.anmelden')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cookie Banner */}
      {dsgvoZustimmung === null && (
        <CookieBanner onZustimmung={() => setDsgvoZustimmung('accepted')} />
      )}
    </>
  );
}
