'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '../Features/I18nProvider';

export function Hero() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className='relative min-h-screen bg-gradient-to-br from-gray-800 via-blue-600 to-gray-800 flex items-center justify-center overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000'></div>
        {/* Subtle pattern overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto'>
        {/* Main Heading */}
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight'>
          <span className='text-blue-400'>{t('hero.titel')}</span>
          <br />
          <span className='text-4xl md:text-5xl lg:text-6xl'>
            {t('hero.untertitel')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className='text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto mb-20 leading-relaxed font-medium'>
          {t('hero.beschreibung')}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </section>
  );
}
