/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className='bg-white shadow-sm'>
      <nav className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='text-2xl font-bold text-primary'>
            Lopez IT Welt
          </Link>

          <div className='hidden md:flex space-x-6'>
            <Link href='/services' className='text-gray-600 hover:text-primary'>
              Services
            </Link>
            <Link href='/blog' className='text-gray-600 hover:text-primary'>
              Blog
            </Link>
            <Link href='/shop' className='text-gray-600 hover:text-primary'>
              Shop
            </Link>
            <Link href='/contact' className='text-gray-600 hover:text-primary'>
              Kontakt
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <Link href='/login' className='text-gray-600 hover:text-primary'>
              Login
            </Link>
            <Link
              href='/register'
              className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90'
            >
              Registrieren
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
