'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-black text-white py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>Lopez IT Welt</h3>
            <p className='text-gray-300'>
              Professionelle IT-Lösungen für Ihr Unternehmen
            </p>
          </div>
          <div>
            <h3 className='text-xl font-bold mb-4'>Kontakt</h3>
            <p className='text-gray-300'>Email: info@lopez-it-welt.de</p>
            <p className='text-gray-300'>Tel: +49 123 456789</p>
          </div>
          <div>
            <h3 className='text-xl font-bold mb-4'>Rechtliches</h3>
            <ul className='space-y-2'>
              <li>
                <a href='/impressum' className='text-gray-300 hover:text-white'>
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href='/datenschutz'
                  className='text-gray-300 hover:text-white'
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a
                  href='/cookie-einstellungen'
                  className='text-gray-300 hover:text-white'
                >
                  Cookie-Einstellungen
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
          <p className='text-gray-400'>
            © {currentYear} Lopez IT Welt. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
