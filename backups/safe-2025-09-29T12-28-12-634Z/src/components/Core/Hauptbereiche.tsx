"use client";
import { useI18n } from "../Features/I18nProvider";
import { SectionWrapper } from "../ui";

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: "💻",
    title: "IT-Support & Beratung",
    description:
      "Professioneller IT-Support mit persönlicher Betreuung und schneller Problemlösung",
    features: [
      "24/7 Remote-Support",
      "Vor-Ort-Service",
      "Hardware-Reparaturen",
      "Software-Installation",
      "Netzwerk-Konfiguration",
      "Backup-Lösungen",
    ],
  },
  {
    icon: "🖥️",
    title: "PC-Bau & Einrichtung",
    description:
      "Individuelle PC-Systeme nach Ihren Anforderungen - Gaming, Office oder Workstation",
    features: [
      "Gaming-PCs",
      "Office-Systeme",
      "Workstations",
      "Server-Systeme",
      "Upgrades",
      "Wartung & Service",
    ],
  },
  {
    icon: "🌐",
    title: "Webdesign & Entwicklung",
    description: "Moderne, responsive Websites und Webanwendungen mit Fokus auf Barrierefreiheit",
    features: [
      "Responsive Design",
      "Barrierefreiheit",
      "SEO-Optimierung",
      "E-Commerce",
      "CMS-Integration",
      "Performance-Optimierung",
    ],
  },
  {
    icon: "🤖",
    title: "KI-Assistenz & Automatisierung",
    description: "Intelligente Lösungen für Ihre Geschäftsprozesse mit modernster KI-Technologie",
    features: [
      "Chatbot-Entwicklung",
      "Prozess-Automatisierung",
      "Datenanalyse",
      "KI-Integration",
      "API-Entwicklung",
      "Cloud-Lösungen",
    ],
  },
  {
    icon: "🔒",
    title: "Cybersecurity & Datenschutz",
    description: "Umfassender Schutz Ihrer IT-Infrastruktur und DSGVO-konforme Lösungen",
    features: [
      "Virenschutz",
      "Firewall-Konfiguration",
      "Backup-Strategien",
      "DSGVO-Compliance",
      "Sicherheits-Audits",
      "Schulungen",
    ],
  },
  {
    icon: "☁️",
    title: "Cloud-Lösungen & Migration",
    description: "Professionelle Cloud-Migration und -Verwaltung für moderne Arbeitsweisen",
    features: [
      "Cloud-Migration",
      "Microsoft 365",
      "Google Workspace",
      "Backup-Cloud",
      "Hybrid-Lösungen",
      "Support & Training",
    ],
  },
];

export function Hauptbereiche() {
  const { t } = useI18n();

  return (
    <SectionWrapper bg="darkblau" divider="wave">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 scroll-animate">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Unsere Kernleistungen
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up">
            Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit, Mehrsprachigkeit und
            persönliche Betreuung
          </p>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-weiss/10 border border-weiss/20 shadow-2xl rounded-2xl p-8 hover:bg-weiss/20 hover:shadow-inner hover:scale-[1.01] transition-all duration-300"
            >
              <div className="text-center flex-1 flex flex-col justify-start">
                <div className="text-5xl mb-4" aria-hidden="true">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-akzentblau mb-4">{service.title}</h3>
                <p className="text-gray-200 mb-4">{service.description}</p>
                <ul className="space-y-2 text-left">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-200">
                      <span className="text-akzentblau mr-2">✔️</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-200 mb-4">Benötigen Sie eine individuelle Lösung?</p>
          <button className="px-8 py-4 text-lg font-semibold bg-akzentblau text-white rounded-2xl shadow-xl hover:bg-akzentblau/80 transition-colors focus:outline-none focus:ring-4 focus:ring-weiss/80 focus:ring-offset-2 focus:ring-offset-akzentblau">
            Beratung anfordern
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
