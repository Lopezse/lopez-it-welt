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
    <section className='relative min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gelb rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto'>
        {/* Badge */}
        <div className='inline-flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-weiss/20'>
          <span className='text-akzentblau text-lg'>🚀</span>
          <span className='text-sm font-medium text-weiss'>
            Enterprise++ Standards
          </span>
        </div>

        {/* Main Heading */}
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-weiss mb-8 leading-tight'>
          <span className='bg-gradient-to-r from-akzentblau via-gelb to-gruen bg-clip-text text-transparent'>
            Lopez IT Welt
          </span>
          <br />
          <span className='text-4xl md:text-5xl lg:text-6xl'>
            Barrierefreie IT-Lösungen
          </span>
        </h1>

        {/* Subtitle */}
        <p className='text-xl md:text-2xl text-hellgrau max-w-4xl mx-auto mb-12 leading-relaxed'>
          Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit,
          Mehrsprachigkeit und persönliche Betreuung in Wunstorf und der Region
          Hannover
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
          <button className='px-8 py-4 bg-akzentblau text-weiss rounded-lg hover:bg-akzentblau/80 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-lg'>
            Beratung anfordern
          </button>
          <button className='px-8 py-4 bg-transparent text-weiss border-2 border-weiss/30 rounded-lg hover:bg-weiss/10 transition-all duration-300 font-semibold text-lg transform hover:scale-105'>
            Leistungen entdecken
          </button>
        </div>

        {/* Features */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='text-center'>
            <div className='text-4xl mb-4'>♿</div>
            <h3 className='text-lg font-semibold text-weiss mb-2'>
              Barrierefrei
            </h3>
            <p className='text-hellgrau text-sm'>
              WCAG 2.1 AAA konform für alle Nutzer
            </p>
          </div>
          <div className='text-center'>
            <div className='text-4xl mb-4'>🌍</div>
            <h3 className='text-lg font-semibold text-weiss mb-2'>
              Mehrsprachig
            </h3>
            <p className='text-hellgrau text-sm'>
              Deutsch, Englisch & Spanisch
            </p>
          </div>
          <div className='text-center'>
            <div className='text-4xl mb-4'>🤖</div>
            <h3 className='text-lg font-semibold text-weiss mb-2'>
              KI-gestützt
            </h3>
            <p className='text-hellgrau text-sm'>Moderne Automatisierung</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-weiss/30 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-weiss/60 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </section>
  );
}
