'use client';
import { useI18n } from '../Features/I18nProvider';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-dunkelgrau text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Unternehmen */}
          <div>
            <h3 className='text-xl font-bold mb-4 text-hauptblau'>
              Lopez IT Welt
            </h3>
            <p className='text-gray-300 mb-4'>
              Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und
              persönliche Betreuung.
            </p>
            <div className='flex space-x-4'>
              <a
                href='mailto:info@lopez-it-welt.de'
                className='text-hauptblau hover:text-akzent-orange transition-colors'
              >
                📧
              </a>
              <a
                href='tel:+49123456789'
                className='text-hauptblau hover:text-akzent-orange transition-colors'
              >
                📞
              </a>
            </div>
          </div>

          {/* Leistungen */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-hauptblau'>
              Leistungen
            </h3>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <a
                  href='#it-support'
                  className='hover:text-white transition-colors'
                >
                  IT-Support
                </a>
              </li>
              <li>
                <a
                  href='#pc-bau'
                  className='hover:text-white transition-colors'
                >
                  PC-Bau & Einrichtung
                </a>
              </li>
              <li>
                <a
                  href='#webdesign'
                  className='hover:text-white transition-colors'
                >
                  Webdesign
                </a>
              </li>
              <li>
                <a
                  href='#ki-assistenz'
                  className='hover:text-white transition-colors'
                >
                  KI-Assistenz
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-hauptblau'>
              Kontakt
            </h3>
            <div className='text-gray-300 space-y-2'>
              <p>Ramiro Lopez Rodriguez</p>
              <p>Alte Bahnhofstraße 13</p>
              <p>31515 Wunstorf</p>
              <p className='mt-2'>
                <a
                  href='mailto:info@lopez-it-welt.de'
                  className='hover:text-white transition-colors'
                >
                  info@lopez-it-welt.de
                </a>
              </p>
              <p>
                <a
                  href='tel:+49123456789'
                  className='hover:text-white transition-colors'
                >
                  +49 123 456789
                </a>
              </p>
            </div>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-hauptblau'>
              Rechtliches
            </h3>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <a
                  href='/impressum'
                  className='hover:text-white transition-colors'
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href='/datenschutz'
                  className='hover:text-white transition-colors'
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a
                  href='/cookie-einstellungen'
                  className='hover:text-white transition-colors'
                >
                  Cookie-Einstellungen
                </a>
              </li>
              <li>
                <a href='/agb' className='hover:text-white transition-colors'>
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-600 mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-300 text-sm'>
              © {currentYear} Lopez IT Welt. Alle Rechte vorbehalten.
            </p>
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <span className='text-gray-300 text-sm'>♿ Barrierefrei</span>
              <span className='text-gray-300 text-sm'>🌍 Mehrsprachig</span>
              <span className='text-gray-300 text-sm'>🤖 KI-gestützt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
