import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center'>
        <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4'>
          <svg
            className='w-6 h-6 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33'
            />
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          404 - Seite nicht gefunden
        </h2>

        <p className='text-gray-600 mb-6'>
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>

        <div className='space-y-3'>
          <Link
            href='/'
            className='block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Zur Startseite
          </Link>

          <Link
            href='/admin'
            className='block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors'
          >
            Zum Admin-Bereich
          </Link>
        </div>
      </div>
    </div>
  );
}
