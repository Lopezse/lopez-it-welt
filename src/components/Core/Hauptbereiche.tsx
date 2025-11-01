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

  return (
    <section className="py-16 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mt-12 mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Unsere Kernleistungen
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit,
            Mehrsprachigkeit und persönliche Betreuung
          </p>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`min-h-[250px] rounded-2xl shadow-xl bg-weiss/10 border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 p-6 lg:p-8 flex flex-col justify-between cursor-pointer ${hoveredIndex === index ? 'shadow-2xl scale-105' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={0}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <div className="text-center flex-1 flex flex-col justify-start">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-200 mb-4">{service.description}</p>
                <ul className="text-left space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-200"
                    >
                      <span className="text-gruen mr-2">✔️</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-200 mb-4">
            Benötigen Sie eine individuelle Lösung?
          </p>
          <button className="px-6 py-3 text-base font-semibold bg-akzentblau text-white rounded-2xl shadow-xl hover:bg-akzentblau/80 transition-colors">
            Beratung anfordern
          </button>
        </div>
      </div>
    </section>
  );
}
