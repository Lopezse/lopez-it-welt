/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>Lopez IT Welt</h3>
            <p className='text-gray-400'>
              Ihr Partner für digitale Transformation und IT-Lösungen.
            </p>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-4'>Services</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/services/managed-it'
                  className='text-gray-400 hover:text-white'
                >
                  Managed IT
                </Link>
              </li>
              <li>
                <Link
                  href='/services/cloud'
                  className='text-gray-400 hover:text-white'
                >
                  Cloud Consulting
                </Link>
              </li>
              <li>
                <Link
                  href='/services/security'
                  className='text-gray-400 hover:text-white'
                >
                  IT-Sicherheit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-4'>Rechtliches</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/privacy'
                  className='text-gray-400 hover:text-white'
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href='/imprint'
                  className='text-gray-400 hover:text-white'
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-gray-400 hover:text-white'>
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-4'>Kontakt</h4>
            <ul className='space-y-2'>
              <li className='text-gray-400'>Email: info@lopez-it-welt.de</li>
              <li className='text-gray-400'>Tel: +49 (0) 123 456789</li>
              <li className='text-gray-400'>
                Adresse: Musterstraße 123, 12345 Stadt
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>
            &copy; {new Date().getFullYear()} Lopez IT Welt. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};
