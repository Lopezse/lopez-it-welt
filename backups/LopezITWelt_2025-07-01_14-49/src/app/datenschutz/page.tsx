'use client';
import { useEffect } from 'react';
import { useI18n } from '../../components/Features/I18nProvider';

export default function Datenschutz() {
  const { t } = useI18n();

  useEffect(() => {
    // Debugging entfernt - keine console.log Statements mehr
  }, [t]);

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6'>{t('datenschutz.titel')}</h1>

      <div className='text-sm text-dunkelgrau mb-8'>
        <p>
          {t('datenschutz.stand')}: {t('datenschutz.datum')}
        </p>
        <p>
          {t('datenschutz.letzte_aktualisierung')}: {t('datenschutz.datum')}
        </p>
      </div>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.uebersicht.titel')}
        </h2>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.uebersicht.allgemein')}
        </h3>
        <p className='mb-4'>{t('datenschutz.uebersicht.allgemein_text')}</p>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.uebersicht.datenerfassung')}
        </h3>
        <p className='mb-4'>
          {t('datenschutz.uebersicht.datenerfassung_text')}
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.hosting.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.hosting.text')}</p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.allgemein.titel')}
        </h2>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.allgemein.datenschutz')}
        </h3>
        <p className='mb-4'>{t('datenschutz.allgemein.datenschutz_text')}</p>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.allgemein.verantwortlich')}
        </h3>
        <p className='mb-4'>{t('datenschutz.allgemein.verantwortlich_text')}</p>
        <div className='bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg mb-4'>
          <p className='font-semibold'>Ramiro Lopez Rodriguez</p>
          <p>Lopez IT Welt</p>
          <p>Alte Bahnhofstraße 13</p>
          <p>31515 Wunstorf</p>
          <p className='mt-2'>
            <strong>E-Mail:</strong> datenschutz@lopez-it-welt.de
          </p>
          <p>
            <strong>Telefon:</strong> +49 (0) 5031 7005576
          </p>
        </div>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.allgemein.speicherdauer')}
        </h3>
        <p className='mb-4'>{t('datenschutz.allgemein.speicherdauer_text')}</p>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.allgemein.rechte')}
        </h3>
        <p className='mb-4'>{t('datenschutz.allgemein.rechte_text')}</p>
        <ul className='list-disc ml-6 mb-4 space-y-2'>
          <li className='pl-2'>{t('datenschutz.allgemein.rechte.auskunft')}</li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.berichtigung')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.loeschung')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.einschraenkung')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.uebertragbarkeit')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.widerspruch')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.allgemein.rechte.beschwerde')}
          </li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.datenerfassung.titel')}
        </h2>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.datenerfassung.cookies')}
        </h3>
        <p className='mb-4'>{t('datenschutz.datenerfassung.cookies_text')}</p>
        <p className='mb-4'>
          {t('datenschutz.datenerfassung.cookies_einstellungen')}
        </p>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.datenerfassung.server_logs')}
        </h3>
        <p className='mb-4'>
          {t('datenschutz.datenerfassung.server_logs_text')}
        </p>
        <ul className='list-disc ml-6 mb-4 space-y-2'>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.browser')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.betriebssystem')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.referrer')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.hostname')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.uhrzeit')}
          </li>
          <li className='pl-2'>
            {t('datenschutz.datenerfassung.server_logs_liste.ip')}
          </li>
        </ul>
        <p className='mb-4'>
          {t('datenschutz.datenerfassung.server_logs_zusammenfuehrung')}
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.zahlungen.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.zahlungen.einleitung')}</p>

        <h4 className='text-lg font-semibold mb-2'>
          {t('datenschutz.zahlungen.paypal.titel')}
        </h4>
        <p className='mb-4'>
          {t('datenschutz.zahlungen.paypal.text')}
          <br />
          <strong>{t('datenschutz.zahlungen.rechtsgrundlage')}:</strong>{' '}
          {t('datenschutz.zahlungen.paypal.rechtsgrundlage')}
        </p>

        <h4 className='text-lg font-semibold mb-2'>
          {t('datenschutz.zahlungen.sofortueberweisung.titel')}
        </h4>
        <p className='mb-4'>
          {t('datenschutz.zahlungen.sofortueberweisung.text')}
          <br />
          <strong>{t('datenschutz.zahlungen.rechtsgrundlage')}:</strong>{' '}
          {t('datenschutz.zahlungen.sofortueberweisung.rechtsgrundlage')}
        </p>

        <h4 className='text-lg font-semibold mb-2'>
          {t('datenschutz.zahlungen.sepa.titel')}
        </h4>
        <p className='mb-4'>
          {t('datenschutz.zahlungen.sepa.text')}
          <br />
          <strong>{t('datenschutz.zahlungen.rechtsgrundlage')}:</strong>{' '}
          {t('datenschutz.zahlungen.sepa.rechtsgrundlage')}
        </p>

        <h4 className='text-lg font-semibold mb-2'>
          {t('datenschutz.zahlungen.sicherheit.titel')}
        </h4>
        <p className='mb-4'>{t('datenschutz.zahlungen.sicherheit.text')}</p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.kontaktformular.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.kontaktformular.text')}</p>
        <p className='mb-4'>
          <strong>{t('datenschutz.zahlungen.rechtsgrundlage')}:</strong>{' '}
          {t('datenschutz.kontaktformular.rechtsgrundlage')}
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.newsletter.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.newsletter.text')}</p>
        <p className='mb-4'>
          <strong>{t('datenschutz.zahlungen.rechtsgrundlage')}:</strong>{' '}
          {t('datenschutz.newsletter.rechtsgrundlage')}
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.plugins.titel')}
        </h2>

        <h3 className='text-xl font-semibold mb-2'>
          {t('datenschutz.plugins.google_fonts.titel')}
        </h3>
        <p className='mb-4'>{t('datenschutz.plugins.google_fonts.text')}</p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.sicherheit.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.sicherheit.text')}</p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.kontakt.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.kontakt.text')}</p>
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

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          {t('datenschutz.aenderungen.titel')}
        </h2>
        <p className='mb-4'>{t('datenschutz.aenderungen.text')}</p>
      </section>
    </div>
  );
}
