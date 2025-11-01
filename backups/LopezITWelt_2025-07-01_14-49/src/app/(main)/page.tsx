'use client';
import { Hauptbereiche } from '../../components/Core/Hauptbereiche';
import { Hero } from '../../components/Core/Hero';
import { FAQ } from '../../components/Features/FAQ';
import { KISicherheit } from '../../components/Features/KISicherheit';
import { Testimonials } from '../../components/Features/Testimonials';
import { WhyChooseUs } from '../../components/Features/WhyChooseUs';

export const dynamic = 'force-dynamic';

export default function Startseite() {
  return (
    <>
      {/* Hero-Bereich */}
      <Hero />

      {/* Hauptbereiche */}
      <Hauptbereiche />

      {/* Warum uns wählen */}
      <WhyChooseUs />

      {/* KI-Sicherheit */}
      <KISicherheit />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA-Bereich */}
      <section className='bg-blue-600 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            Bereit für den nächsten Schritt?
          </h2>
          <p className='text-xl text-blue-100 mb-8'>
            Kontaktieren Sie uns und lassen Sie uns gemeinsam Ihre IT-Ziele
            erreichen.
          </p>
          <button className='px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold'>
            Kontakt aufnehmen
          </button>
        </div>
      </section>
    </>
  );
}
