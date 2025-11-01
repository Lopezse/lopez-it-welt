'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('An error occurred:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
        <div className='flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4'>
          <svg
            className='w-6 h-6 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h2 className='text-xl font-semibold text-gray-900 text-center mb-2'>
          Ein Fehler ist aufgetreten
        </h2>

        <p className='text-gray-600 text-center mb-6'>
          Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es
          erneut.
        </p>

        <div className='space-y-3'>
          <button
            onClick={reset}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Erneut versuchen
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className='w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors'
          >
            Zur Startseite
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-4 p-3 bg-gray-100 rounded text-sm'>
            <summary className='cursor-pointer font-medium'>
              Fehlerdetails (Entwicklung)
            </summary>
            <pre className='mt-2 text-red-600 overflow-auto'>
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
