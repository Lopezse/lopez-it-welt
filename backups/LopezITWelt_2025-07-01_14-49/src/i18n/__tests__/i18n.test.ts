import i18n from '../config';

describe('i18n Konfiguration', () => {
  beforeEach(() => {
    // Reset i18n to default state before each test
    i18n.changeLanguage('de');
  });

  describe('Spracherkennung', () => {
    it('should default to German', () => {
      expect(i18n.language).toBe('de');
    });

    it('should change language to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');
    });

    it('should change language to Spanish', async () => {
      await i18n.changeLanguage('es');
      expect(i18n.language).toBe('es');
    });
  });

  describe('Übersetzungsschlüssel', () => {
    it('should translate kopfbereich logo to German', () => {
      expect(i18n.t('kopfbereich.logo')).toBe('Lopez IT Welt');
    });

    it('should translate kopfbereich logo to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.t('kopfbereich.logo')).toBe('Lopez IT Welt');
    });

    it('should translate kopfbereich logo to Spanish', async () => {
      await i18n.changeLanguage('es');
      expect(i18n.t('kopfbereich.logo')).toBe('Lopez IT Welt');
    });
  });

  describe('Navigation Übersetzungen', () => {
    const navigationKeys = [
      'startseite',
      'leistungen',
      'webshop',
      'preise',
      'ueber_uns',
      'kontakt',
    ];

    it('should translate all navigation items to German', () => {
      navigationKeys.forEach(key => {
        const translation = i18n.t(`kopfbereich.navigation.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should translate all navigation items to English', async () => {
      await i18n.changeLanguage('en');
      navigationKeys.forEach(key => {
        const translation = i18n.t(`kopfbereich.navigation.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should translate all navigation items to Spanish', async () => {
      await i18n.changeLanguage('es');
      navigationKeys.forEach(key => {
        const translation = i18n.t(`kopfbereich.navigation.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });
  });

  describe('Hero Section Übersetzungen', () => {
    it('should translate hero titel to German', () => {
      expect(i18n.t('hero.titel')).toBe(
        'Digitale Lösungen mit Verstand & Verantwortung'
      );
    });

    it('should translate hero titel to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.t('hero.titel')).toBe(
        'Digital Solutions with Intelligence & Care'
      );
    });

    it('should translate hero titel to Spanish', async () => {
      await i18n.changeLanguage('es');
      expect(i18n.t('hero.titel')).toBe(
        'Soluciones Digitales con Inteligencia y Cuidado'
      );
    });

    it('should translate hero untertitel to German', () => {
      expect(i18n.t('hero.untertitel')).toBe(
        'Barrierefrei. Persönlich. Automatisiert.'
      );
    });

    it('should translate hero untertitel to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.t('hero.untertitel')).toBe(
        'Accessible. Personal. Automated.'
      );
    });

    it('should translate hero untertitel to Spanish', async () => {
      await i18n.changeLanguage('es');
      expect(i18n.t('hero.untertitel')).toBe(
        'Accesible. Personal. Automatizado.'
      );
    });
  });

  describe('Hauptbereiche Section Übersetzungen', () => {
    const serviceKeys = [
      'it_support',
      'pc_bau',
      'webdesign',
      'ki_assistenz',
      'formularservice',
      'webshop',
    ];

    it('should translate all service titles to German', () => {
      serviceKeys.forEach(key => {
        const translation = i18n.t(`hauptbereiche.elemente.${key}.titel`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should translate all service descriptions to German', () => {
      serviceKeys.forEach(key => {
        const translation = i18n.t(
          `hauptbereiche.elemente.${key}.beschreibung`
        );
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should have symbols for all services', () => {
      serviceKeys.forEach(key => {
        const symbol = i18n.t(`hauptbereiche.elemente.${key}.symbol`);
        expect(symbol).toBeTruthy();
        expect(typeof symbol).toBe('string');
      });
    });
  });

  describe('Webshop Section Übersetzungen', () => {
    it('should translate webshop titel to German', () => {
      expect(i18n.t('webshop.titel')).toBe(
        'Unser Webshop – Digital. Einfach. Sofort.'
      );
    });

    it('should translate webshop titel to English', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.t('webshop.titel')).toBe(
        'Our Shop – Digital. Simple. Instant.'
      );
    });

    it('should translate webshop titel to Spanish', async () => {
      await i18n.changeLanguage('es');
      expect(i18n.t('webshop.titel')).toBe(
        'Nuestra Tienda – Digital. Simple. Instantáneo.'
      );
    });
  });

  describe('Vertrauen Section Übersetzungen', () => {
    const trustKeys = [
      'barrierefreiheit',
      'zweisprachig',
      'empathie',
      'menschenzentriert',
      'enterprise',
    ];

    it('should translate all trust points to German', () => {
      trustKeys.forEach(key => {
        const translation = i18n.t(`vertrauen.punkte.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should translate all trust points to English', async () => {
      await i18n.changeLanguage('en');
      trustKeys.forEach(key => {
        const translation = i18n.t(`vertrauen.punkte.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });

    it('should translate all trust points to Spanish', async () => {
      await i18n.changeLanguage('es');
      trustKeys.forEach(key => {
        const translation = i18n.t(`vertrauen.punkte.${key}`);
        expect(translation).toBeTruthy();
        expect(typeof translation).toBe('string');
      });
    });
  });

  describe('Kundenstimmen Übersetzungen', () => {
    it('should translate customer testimonials to German', () => {
      const kunde1 = i18n.t('kundenstimmen.elemente.kunde1.text');
      const kunde2 = i18n.t('kundenstimmen.elemente.kunde2.text');

      expect(kunde1).toBeTruthy();
      expect(kunde2).toBeTruthy();
      expect(typeof kunde1).toBe('string');
      expect(typeof kunde2).toBe('string');
    });

    it('should have author names and locations', () => {
      const autor1 = i18n.t('kundenstimmen.elemente.kunde1.autor');
      const ort1 = i18n.t('kundenstimmen.elemente.kunde1.ort');
      const autor2 = i18n.t('kundenstimmen.elemente.kunde2.autor');
      const ort2 = i18n.t('kundenstimmen.elemente.kunde2.ort');

      expect(autor1).toBe('Herr R.');
      expect(ort1).toBe('Hannover');
      expect(autor2).toBe('Frau M.');
      expect(ort2).toBe('Laatzen');
    });
  });

  describe('Fussbereich Übersetzungen', () => {
    it('should translate footer legal links to German', () => {
      const impressum = i18n.t('fussbereich.rechtlich.impressum');
      const datenschutz = i18n.t('fussbereich.rechtlich.datenschutz');
      const agb = i18n.t('fussbereich.rechtlich.agb');
      const barrierefreiheit = i18n.t('fussbereich.rechtlich.barrierefreiheit');

      expect(impressum).toBe('Impressum');
      expect(datenschutz).toBe('Datenschutz');
      expect(agb).toBe('AGB');
      expect(barrierefreiheit).toBe('Barrierefreiheit');
    });

    it('should translate copyright to German', () => {
      expect(i18n.t('fussbereich.copyright')).toBe('© 2025 Lopez IT Welt');
    });
  });

  describe('Fallback Verhalten', () => {
    it('should fallback to German for missing keys', () => {
      const missingKey = i18n.t('non.existent.key');
      expect(missingKey).toBe('non.existent.key');
    });

    it('should handle nested missing keys', () => {
      const missingNestedKey = i18n.t('kopfbereich.non.existent.key');
      expect(missingNestedKey).toBe('kopfbereich.non.existent.key');
    });
  });

  describe('Performance', () => {
    it('should load translations quickly', () => {
      const startTime = performance.now();
      i18n.t('kopfbereich.logo');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should be under 10ms
    });

    it('should handle multiple language switches efficiently', async () => {
      const startTime = performance.now();

      await i18n.changeLanguage('en');
      await i18n.changeLanguage('es');
      await i18n.changeLanguage('de');

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should be under 100ms
    });
  });
});
