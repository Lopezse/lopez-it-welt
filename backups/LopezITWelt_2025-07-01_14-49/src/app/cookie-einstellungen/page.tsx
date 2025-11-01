'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '../../components/Features/I18nProvider';

export default function CookieEinstellungen() {
  const { t } = useI18n();
  const [cookieSettings, setCookieSettings] = useState({
    notwendig: true, // Immer aktiv
    funktional: false,
    analytik: false,
    marketing: false,
  });

  useEffect(() => {
    // Cookie-Einstellungen aus localStorage laden
    const savedSettings = localStorage.getItem('cookie-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setCookieSettings({ ...cookieSettings, ...parsed });
    }
  }, [cookieSettings]);

  const handleSettingChange = (setting: string, value: boolean) => {
    const newSettings = { ...cookieSettings, [setting]: value };
    setCookieSettings(newSettings);
    localStorage.setItem('cookie-settings', JSON.stringify(newSettings));
  };

  const handleSaveAll = () => {
    localStorage.setItem('cookie-settings', JSON.stringify(cookieSettings));
    localStorage.setItem('dsgvoZustimmung', 'true');
    // Hier könnte man eine Bestätigung anzeigen
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6'>{t('cookie.titel')}</h1>

      <div className='text-sm text-dunkelgrau mb-8'>
        <p>{t('cookie.stand')}: 18. Januar 2025</p>
        <p>{t('cookie.letzte_aktualisierung')}: 18. Januar 2025</p>
      </div>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('cookie.uebersicht')}
        </h2>
        <p className='mb-4'>{t('cookie.beschreibung')}</p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('cookie.einstellungen')}
        </h2>

        {/* Notwendige Cookies */}
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg mb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {t('cookie.notwendig.titel')}
              </h3>
              <p className='text-sm text-dunkelgrau'>
                {t('cookie.notwendig.beschreibung')}
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={cookieSettings.notwendig}
                disabled
                className='w-4 h-4 text-hauptblau bg-weiss border-dunkelgrau rounded focus:ring-hauptblau'
              />
              <span className='ml-2 text-sm text-dunkelgrau'>
                {t('cookie.immer_aktiv')}
              </span>
            </div>
          </div>
        </div>

        {/* Funktionale Cookies */}
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg mb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {t('cookie.funktional.titel')}
              </h3>
              <p className='text-sm text-dunkelgrau'>
                {t('cookie.funktional.beschreibung')}
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={cookieSettings.funktional}
                onChange={e =>
                  handleSettingChange('funktional', e.target.checked)
                }
                className='w-4 h-4 text-hauptblau bg-weiss border-dunkelgrau rounded focus:ring-hauptblau'
              />
            </div>
          </div>
        </div>

        {/* Analytik Cookies */}
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg mb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {t('cookie.analytik.titel')}
              </h3>
              <p className='text-sm text-dunkelgrau'>
                {t('cookie.analytik.beschreibung')}
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={cookieSettings.analytik}
                onChange={e =>
                  handleSettingChange('analytik', e.target.checked)
                }
                className='w-4 h-4 text-hauptblau bg-weiss border-dunkelgrau rounded focus:ring-hauptblau'
              />
            </div>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg mb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {t('cookie.marketing.titel')}
              </h3>
              <p className='text-sm text-dunkelgrau'>
                {t('cookie.marketing.beschreibung')}
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={cookieSettings.marketing}
                onChange={e =>
                  handleSettingChange('marketing', e.target.checked)
                }
                className='w-4 h-4 text-hauptblau bg-weiss border-dunkelgrau rounded focus:ring-hauptblau'
              />
            </div>
          </div>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>{t('cookie.buttons')}</h2>
        <div className='flex flex-wrap gap-4'>
          <button
            onClick={handleSaveAll}
            className='bg-hauptblau hover:bg-akzentblau text-weiss px-6 py-3 rounded-lg font-semibold transition-colors duration-300'
          >
            {t('cookie.alle_akzeptieren')}
          </button>
          <button
            onClick={() => {
              setCookieSettings({
                notwendig: true,
                funktional: false,
                analytik: false,
                marketing: false,
              });
              localStorage.setItem(
                'cookie-settings',
                JSON.stringify({
                  notwendig: true,
                  funktional: false,
                  analytik: false,
                  marketing: false,
                })
              );
              localStorage.setItem('dsgvoZustimmung', 'true');
            }}
            className='bg-dunkelgrau hover:bg-hellgrau text-weiss px-6 py-3 rounded-lg font-semibold transition-colors duration-300'
          >
            {t('cookie.nur_notwendige')}
          </button>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>{t('cookie.kontakt')}</h2>
        <p className='mb-4'>{t('cookie.kontakt_text')}</p>
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg'>
          <p className='font-semibold'>Lopez IT Welt</p>
          <p>Alte Bahnhofstraße 13</p>
          <p>31515 Wunstorf</p>
          <p className='mt-2'>
            <strong>E-Mail:</strong> datenschutz@lopez-it-welt.de
          </p>
          <p>
            <strong>Telefon:</strong> +49 (0) 5031 7005576
          </p>
        </div>
      </section>
    </div>
  );
}
