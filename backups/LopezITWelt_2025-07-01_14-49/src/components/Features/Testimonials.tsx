/**
 * 'use client';
 * @description Auto-generated documentation
 */
'use client';
import { useEffect, useState } from 'react';
import { useI18n } from './I18nProvider';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Schmidt',
    role: 'Geschäftsführerin',
    company: 'Schmidt & Partner GmbH',
    content:
      'Lopez IT Welt hat unsere Website komplett barrierefrei gemacht. Die Zusammenarbeit war professionell und die Ergebnisse übertreffen unsere Erwartungen. Besonders beeindruckt hat uns die mehrsprachige Umsetzung.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    id: 2,
    name: 'Hans Weber',
    role: 'Vereinsvorsitzender',
    company: 'Sportverein Wunstorf',
    content:
      'Als Verein mit begrenztem Budget waren wir skeptisch. Aber Lopez IT Welt hat uns eine erschwingliche Lösung geboten, die alle unsere Anforderungen erfüllt. Die persönliche Betreuung war hervorragend.',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    id: 3,
    name: 'Anna Müller',
    role: 'Selbstständige',
    company: 'Müller Beratung',
    content:
      'Die KI-Assistenz hat mir enorm geholfen, meine Arbeitsabläufe zu optimieren. Die Implementierung war unkompliziert und die Ergebnisse sind beeindruckend. Sehr empfehlenswert!',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    id: 4,
    name: 'Klaus Fischer',
    role: 'Inhaber',
    company: 'Fischer Elektronik',
    content:
      'Endlich jemand, der versteht, was wir brauchen! Die barrierefreie Website hat unsere Kundenreichweite erheblich erweitert. Die DSGVO-Konformität war uns besonders wichtig.',
    rating: 5,
    avatar: '👨‍🔧',
  },
  {
    id: 5,
    name: 'Petra Wagner',
    role: 'Büroleiterin',
    company: 'Wagner & Kollegen',
    content:
      'Der IT-Support ist schnell, kompetent und freundlich. Besonders die Remote-Hilfe hat uns viel Zeit gespart. Wir sind sehr zufrieden mit der Zusammenarbeit.',
    rating: 5,
    avatar: '👩‍⚖️',
  },
  {
    id: 6,
    name: 'Carlos Rodriguez',
    role: 'Restaurantbesitzer',
    company: 'El Español',
    content:
      'Als spanischsprachiger Unternehmer war es mir wichtig, eine mehrsprachige Lösung zu finden. Lopez IT Welt hat das perfekt umgesetzt. Meine Kunden sind begeistert!',
    rating: 5,
    avatar: '👨‍🍳',
  },
];

export function Testimonials() {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-gelb' : 'text-hellgrau'}>
        ★
      </span>
    ));
  };

  return (
    <section className='py-16 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-weiss mb-4'>
            Was unsere Kunden sagen
          </h2>
          <p className='text-xl text-hellgrau max-w-3xl mx-auto'>
            Echte Erfahrungsberichte von zufriedenen Kunden aus Wunstorf und der
            Region
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className='relative'>
          {/* Main Testimonial */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 md:p-12 text-center relative'>
            {/* Quote Icon */}
            <div className='absolute top-6 left-6 text-4xl text-akzentblau opacity-50'>
              "
            </div>
            <div className='absolute top-6 right-6 text-4xl text-akzentblau opacity-50'>
              "
            </div>

            {/* Content */}
            <div className='mb-8'>
              <p className='text-lg md:text-xl text-hellgrau leading-relaxed italic mb-6'>
                "{testimonials[currentIndex].content}"
              </p>
            </div>

            {/* Author */}
            <div className='flex flex-col items-center'>
              <div className='text-4xl mb-4'>
                {testimonials[currentIndex].avatar}
              </div>
              <h3 className='text-xl font-bold text-weiss mb-1'>
                {testimonials[currentIndex].name}
              </h3>
              <p className='text-hellgrau mb-2'>
                {testimonials[currentIndex].role} bei{' '}
                {testimonials[currentIndex].company}
              </p>
              <div className='flex space-x-1 mb-4'>
                {renderStars(testimonials[currentIndex].rating)}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-weiss/20 backdrop-blur-sm p-3 rounded-full hover:bg-weiss/30 transition-colors'
            aria-label='Vorheriges Testimonial'
          >
            <svg
              className='w-6 h-6 text-weiss'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-weiss/20 backdrop-blur-sm p-3 rounded-full hover:bg-weiss/30 transition-colors'
            aria-label='Nächstes Testimonial'
          >
            <svg
              className='w-6 h-6 text-weiss'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center mt-8 space-x-2'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-akzentblau' : 'bg-weiss/30'
              }`}
              aria-label={`Gehe zu Testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <div className='text-center mt-6'>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className='flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20 hover:bg-weiss/20 transition-colors'
          >
            <span className='text-weiss text-sm'>
              {isAutoPlaying ? 'Auto-Play pausieren' : 'Auto-Play starten'}
            </span>
            <span className='text-akzentblau'>
              {isAutoPlaying ? '⏸️' : '▶️'}
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
          <div className='text-center'>
            <div className='text-4xl font-bold text-akzentblau mb-2'>98%</div>
            <div className='text-hellgrau'>Kundenzufriedenheit</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-gelb mb-2'>50+</div>
            <div className='text-hellgrau'>Erfolgreiche Projekte</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-gruen mb-2'>24/7</div>
            <div className='text-hellgrau'>Support verfügbar</div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-12'>
          <p className='text-hellgrau mb-4'>
            Werden Sie Teil unserer Erfolgsgeschichten
          </p>
          <button className='px-8 py-3 bg-akzentblau text-weiss rounded-lg hover:bg-akzentblau/80 transition-colors font-semibold'>
            Projekt starten
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
