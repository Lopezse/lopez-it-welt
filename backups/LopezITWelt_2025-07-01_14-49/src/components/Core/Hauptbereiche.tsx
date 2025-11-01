'use client';
import { useState } from 'react';
import { Card } from '../Features/Card';
import { useI18n } from '../Features/I18nProvider';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: '🖥️',
    title: 'IT-Support',
    description: 'Professioneller IT-Support vor Ort und remote',
    features: [
      'Remote & vor Ort Support',
      'Hilfe bei PC, Netzwerk, Software',
      'Individuelle Lösungen',
      'Schnelle Reaktionszeiten',
    ],
  },
  {
    icon: '🔧',
    title: 'PC-Bau & Einrichtung',
    description: 'Individuell zusammengestellte Systeme',
    features: [
      'Maßgeschneiderte Konfigurationen',
      'Qualitätskomponenten',
      'Barrierefreie Erklärung',
      'Umfassende Einrichtung',
    ],
  },
  {
    icon: '🌐',
    title: 'Webdesign & Automatisierung',
    description: 'Moderne, barrierefreie Webentwicklung',
    features: [
      'Barrierefreie Websites',
      'Mehrsprachige Lösungen',
      'KI-basierte Automatisierung',
      'DSGVO-konform',
    ],
  },
  {
    icon: '🤖',
    title: 'KI-Assistenz',
    description: 'Intelligente Automatisierung für Ihren Alltag',
    features: [
      'ChatGPT-Integration',
      'Bewerbungen & Texte',
      'Prozessautomatisierung',
      'Maßgeschneiderte Lösungen',
    ],
  },
  {
    icon: '📝',
    title: 'Formularservice',
    description: 'Professionelle Hilfe bei Ämtern und Anträgen',
    features: [
      'Behördenangelegenheiten',
      'Krankenkassen-Anträge',
      'Persönliche Beratung',
      'Erfahrung mit Ämtern',
    ],
  },
  {
    icon: '🛒',
    title: 'Webshop',
    description: 'Digitale Produkte zum sofortigen Download',
    features: [
      'Bewerbungsvorlagen',
      'Sicherheits-Tools',
      'Einmalzahlung',
      'Sofort-Download',
    ],
  },
];

export function Hauptbereiche() {
  const { t } = useI18n();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const leistungsbereiche = [
    {
      icon: '💼',
      titel: t('hauptbereiche.elemente.it_support.titel'),
      beschreibung: t('hauptbereiche.elemente.it_support.beschreibung'),
      details: t('hauptbereiche.elemente.it_support.details'),
      link: '/leistungen/it-support',
      farbe: 'hauptblau',
      gradient: 'from-hauptblau to-akzentblau',
    },
    {
      icon: '🖥️',
      titel: t('hauptbereiche.elemente.pc_bau.titel'),
      beschreibung: t('hauptbereiche.elemente.pc_bau.beschreibung'),
      details: t('hauptbereiche.elemente.pc_bau.details'),
      link: '/leistungen/pc-bau',
      farbe: 'akzentblau',
      gradient: 'from-akzentblau to-gruen',
    },
    {
      icon: '🌐',
      titel: t('hauptbereiche.elemente.webdesign.titel'),
      beschreibung: t('hauptbereiche.elemente.webdesign.beschreibung'),
      details: t('hauptbereiche.elemente.webdesign.details'),
      link: '/leistungen/webdesign',
      farbe: 'gelb',
      gradient: 'from-gelb to-orange',
    },
    {
      icon: '🤖',
      titel: t('hauptbereiche.elemente.ki_assistenz.titel'),
      beschreibung: t('hauptbereiche.elemente.ki_assistenz.beschreibung'),
      details: t('hauptbereiche.elemente.ki_assistenz.details'),
      link: '/leistungen/ki-assistenz',
      farbe: 'orange',
      gradient: 'from-orange to-rot',
    },
    {
      icon: '📝',
      titel: t('hauptbereiche.elemente.formularservice.titel'),
      beschreibung: t('hauptbereiche.elemente.formularservice.beschreibung'),
      details: t('hauptbereiche.elemente.formularservice.details'),
      link: '/leistungen/formularservice',
      farbe: 'gruen',
      gradient: 'from-gruen to-hauptblau',
    },
    {
      icon: '🛒',
      titel: t('hauptbereiche.elemente.webshop.titel'),
      beschreibung: t('hauptbereiche.elemente.webshop.beschreibung'),
      details: t('hauptbereiche.elemente.webshop.details'),
      link: '/webshop',
      farbe: 'rot',
      gradient: 'from-rot to-gelb',
    },
  ];

  return (
    <section className='py-16 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-weiss mb-4'>
            Unsere Kernleistungen
          </h2>
          <p className='text-xl text-hellgrau max-w-3xl mx-auto'>
            Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit,
            Mehrsprachigkeit und persönliche Betreuung
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <Card
              key={index}
              className='backdrop-blur-xl bg-weiss/10 border border-weiss/20 hover:bg-weiss/20 transition-all duration-300'
            >
              <div className='text-center'>
                <div className='text-5xl mb-4'>{service.icon}</div>
                <h3 className='text-xl font-bold text-weiss mb-3'>
                  {service.title}
                </h3>
                <p className='text-hellgrau mb-4'>{service.description}</p>
                <ul className='text-left space-y-2'>
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-hellgrau'
                    >
                      <span className='text-gruen mr-2'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className='text-center mt-12'>
          <p className='text-hellgrau mb-4'>
            Benötigen Sie eine individuelle Lösung?
          </p>
          <button className='px-8 py-3 bg-akzentblau text-weiss rounded-lg hover:bg-akzentblau/80 transition-colors font-semibold'>
            Beratung anfordern
          </button>
        </div>
      </div>
    </section>
  );
}
