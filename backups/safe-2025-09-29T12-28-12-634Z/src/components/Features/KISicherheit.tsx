"use client";
import { Card, FeatureList, Grid, SectionWrapper } from "../ui";

export function KISicherheit() {
  const securityFeatures = [
    {
      icon: "🔒",
      title: "DSGVO-konform",
      description: "Alle unsere KI-Lösungen sind vollständig DSGVO-konform und schützen Ihre Daten",
      features: ["Datenverschlüsselung", "Anonymisierung", "Recht auf Löschung"],
    },
    {
      icon: "🛡️",
      title: "Sichere APIs",
      description:
        "Enterprise-Sicherheitsstandards für alle API-Verbindungen und Datenübertragungen",
      features: ["HTTPS-Verschlüsselung", "API-Key-Authentifizierung", "Rate Limiting"],
    },
    {
      icon: "🏠",
      title: "Lokale Verarbeitung",
      description: "Sensible Daten werden lokal verarbeitet und verlassen niemals Ihr System",
      features: ["On-Premise Lösungen", "Datenhoheit", "Offline-Funktionalität"],
    },
    {
      icon: "📋",
      title: "Audit-Trail",
      description:
        "Vollständige Protokollierung aller KI-Interaktionen für Compliance und Sicherheit",
      features: ["Aktivitätsprotokoll", "Benutzer-Tracking", "Compliance-Reports"],
    },
    {
      icon: "🤖",
      title: "KI-Ethik",
      description: "Ethische KI-Entwicklung mit Transparenz, Fairness und Verantwortlichkeit",
      features: ["Bias-Erkennung", "Erklärbare KI", "Menschliche Aufsicht"],
    },
    {
      icon: "💾",
      title: "Backup & Recovery",
      description: "Automatische Backups und Disaster Recovery für Ihre KI-Systeme",
      features: ["Tägliche Backups", "Verschlüsselte Speicherung", "Schnelle Wiederherstellung"],
    },
  ];

  const securityBadges = [
    "DSGVO-konform",
    "ISO 27001",
    "End-to-End Verschlüsselung",
    "Deutsche Server",
  ];

  return (
    <SectionWrapper bg="darkblau">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-weiss mb-6">
            KI-Sicherheit & Datenschutz
          </h2>
          <p className="text-xl text-weiss/80 max-w-3xl mx-auto">
            Sichere und DSGVO-konforme KI-Integration für Ihre Geschäftsprozesse
          </p>
        </div>
        {/* Features Grid */}
        <Grid cols={3} gapX="md" gapY="lg" className="mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} variant="default" size="lg" interactive>
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-akzentblau mb-4">{feature.title}</h3>
              <p className="text-weiss/80 mb-6 leading-relaxed">{feature.description}</p>
              <FeatureList
                features={feature.features}
                icon={<span className="text-akzentblau">✔️</span>}
                iconColor="text-akzentblau"
                textSize="md"
              />
            </Card>
          ))}
        </Grid>
        {/* Security Badges */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {securityBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20"
              >
                <span className="text-akzentblau">✓</span>
                <span className="text-weiss text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <div className="text-center">
          <p className="text-weiss/80 mb-6">
            Sichern Sie Ihre KI-Investitionen mit unseren Enterprise-Sicherheitsstandards
          </p>
          <button className="px-8 py-4 text-lg font-semibold bg-akzentblau text-white rounded-2xl shadow-xl hover:bg-akzentblau/80 transition-colors focus:outline-none focus:ring-4 focus:ring-weiss/80 focus:ring-offset-2 focus:ring-offset-akzentblau">
            Sicherheitsberatung anfordern
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default KISicherheit;
