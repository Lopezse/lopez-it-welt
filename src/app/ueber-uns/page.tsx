'use client';

import Image from 'next/image';
import { useI18n } from '../../components/Features/I18nProvider';

const UeberUnsPage = () => {
  const { t } = useI18n();

  // Helper to ensure the list is treated as an array
  const erfahrungsListe = t(
    'ueber_uns.besonders_erfahrung_liste'
  ) as unknown as string[];

  return (
    <div className='bg-weiss dark:bg-dunkelgrau text-dunkelgrau dark:text-weiss'>
      {/* Hero Section */}
      <section className='relative py-20 md:py-32 bg-gradient-to-br from-hauptblau/10 to-akzentblau/10'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            {t('ueber_uns.titel')}
          </h1>
          <p className='text-lg md:text-xl max-w-3xl mx-auto text-dunkelgrau dark:text-hellgrau'>
            {t('ueber_uns.intro')}
          </p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row items-center gap-12'>
            <div className='md:w-1/2'>
              <div className='relative w-full h-96 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500'>
                <Image
                  src='/ramiro-lopez.png'
                  alt='Porträtfoto des Gründers, Ramiro Lopez Rodriguez'
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
            <div className='md:w-1/2'>
              <h2 className='text-3xl font-bold text-hauptblau dark:text-akzentblau mb-6'>
                {t('ueber_uns.gruender_titel')}
              </h2>
              <div className='space-y-4 text-lg leading-relaxed'>
                <p>{t('ueber_uns.gruender_text_1')}</p>
                <p>{t('ueber_uns.gruender_text_2')}</p>
                <p className='font-semibold'>
                  {t('ueber_uns.gruender_text_3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special Section */}
      <section className='bg-hellgrau dark:bg-dunkelgrau/50 py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              {t('ueber_uns.besonders_titel')}
            </h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            {/* Accessible by Experience */}
            <div className='bg-weiss dark:bg-dunkelgrau p-8 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>💡</div>
              <h3 className='text-xl font-bold mb-2'>
                {t('ueber_uns.besonders_erfahrung_titel')}
              </h3>
              <p className='text-dunkelgrau dark:text-hellgrau'>
                {t('ueber_uns.besonders_erfahrung_text')}
              </p>
              <ul className='mt-4 text-left space-y-2'>
                {Array.isArray(erfahrungsListe) &&
                  erfahrungsListe.map((item: string, index: number) => (
                    <li key={index} className='flex items-start'>
                      <span className='text-gruen mr-2 mt-1'>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Custom Solutions */}
            <div className='bg-weiss dark:bg-dunkelgrau p-8 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>🛠️</div>
              <h3 className='text-xl font-bold mb-2'>
                {t('ueber_uns.besonders_massgeschneidert_titel')}
              </h3>
              <p className='text-dunkelgrau dark:text-hellgrau'>
                {t('ueber_uns.besonders_massgeschneidert_text')}
              </p>
            </div>
            {/* Personal & Honest */}
            <div className='bg-weiss dark:bg-dunkelgrau p-8 rounded-lg shadow-md'>
              <div className='text-4xl mb-4'>🤝</div>
              <h3 className='text-xl font-bold mb-2'>
                {t('ueber_uns.besonders_ehrlich_titel')}
              </h3>
              <p className='text-dunkelgrau dark:text-hellgrau'>
                {t('ueber_uns.besonders_ehrlich_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Goal Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-hauptblau dark:text-akzentblau mb-6'>
              {t('ueber_uns.ziel_titel')}
            </h2>
            <p className='text-xl leading-relaxed'>
              {t('ueber_uns.ziel_text')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UeberUnsPage;
