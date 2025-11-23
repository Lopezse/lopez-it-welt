/**
 * @description Beispiel für die Verwendung der konsolidierten UI-Komponenten
 * Zeigt die einheitliche Verwendung aller Komponenten
 */
"use client";

import { Button, Card, FeatureList, Grid, SectionWrapper } from "@/components/ui";
import React from "react";

export const ConsolidatedComponentsExample: React.FC = () => {
  const features = [
    "Einheitliches Design-System",
    "Barrierefreie Komponenten",
    "Responsive Layout",
    "WCAG 2.1 AA/AAA konform",
    "TypeScript Support",
    "Performance optimiert",
  ];

  const services = [
    {
      id: 1,
      title: "Webentwicklung",
      description: "Moderne Webanwendungen mit React und Next.js",
      icon: "🌐",
      features: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "KI-Integration",
      description: "Intelligente Lösungen mit künstlicher Intelligenz",
      icon: "🤖",
      features: ["Machine Learning", "NLP", "Computer Vision", "API Integration"],
    },
    {
      id: 3,
      title: "Enterprise-Lösungen",
      description: "Skalierbare Lösungen für große Unternehmen",
      icon: "🏢",
      features: ["Microservices", "Cloud Native", "DevOps", "Security"],
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <SectionWrapper bg="darkblau">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-weiss mb-6">
            Konsolidierte UI-Komponenten
          </h1>
          <p className="text-xl text-weiss/80 max-w-3xl mx-auto mb-8">
            Einheitliche, barrierefreie und wiederverwendbare Komponenten nach dem
            IBM/SAP/SIEMENS-Prinzip
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" glow>
              Komponenten erkunden
            </Button>
            <Button variant="outline" size="lg">
              Dokumentation lesen
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper bg="white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dunkelgrau mb-6">Unsere Features</h2>
            <p className="text-xl text-dunkelgrau max-w-3xl mx-auto">
              Alle Komponenten sind einheitlich, barrierefrei und performant
            </p>
          </div>

          <Grid cols={2} gap="lg" variant="auto" items={features.length}>
            {features.map((feature, index) => (
              <Card key={index} variant="default" size="md" interactive>
                <div className="text-center">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-dunkelgrau mb-2">{feature}</h3>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      </SectionWrapper>

      {/* Services Section */}
      <SectionWrapper bg="darkblau">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-weiss mb-6">Unsere Services</h2>
            <p className="text-xl text-weiss/80 max-w-3xl mx-auto">
              Professionelle IT-Dienstleistungen mit modernen Technologien
            </p>
          </div>

          <Grid cols={3} gap="lg">
            {services.map((service) => (
              <Card key={service.id} variant="glass" size="lg" interactive>
                <div className="text-center h-full flex flex-col">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-xl font-bold text-akzentblau mb-4">{service.title}</h3>
                  <p className="text-weiss/80 mb-6 flex-grow">{service.description}</p>
                  <FeatureList
                    features={service.features}
                    variant="compact"
                    iconColor="text-akzentblau"
                    textSize="sm"
                  />
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper bg="white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card variant="premium" size="xl">
            <h2 className="text-3xl md:text-4xl font-bold text-dunkelgrau mb-6">
              Bereit für Ihr Projekt?
            </h2>
            <p className="text-lg text-dunkelgrau mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre Vision verwirklichen. Unsere konsolidierten Komponenten
              garantieren einheitliche, barrierefreie und performante Lösungen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" glow icon="🚀" iconPosition="left">
                Projekt starten
              </Button>
              <Button variant="outline" size="lg">
                Beratung anfordern
              </Button>
            </div>
          </Card>
        </div>
      </SectionWrapper>

      {/* Interactive Demo */}
      <SectionWrapper bg="darkblau">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-weiss mb-6">Interaktive Demo</h2>
            <p className="text-xl text-weiss/80 max-w-3xl mx-auto">
              Testen Sie die verschiedenen Komponenten-Varianten
            </p>
          </div>

          <Grid cols={2} gap="xl">
            {/* Button Variants */}
            <Card variant="elevated" size="lg">
              <h3 className="text-xl font-bold text-akzentblau mb-6">Button Varianten</h3>
              <div className="space-y-4">
                <Button variant="primary" size="md" fullWidth>
                  Primary Button
                </Button>
                <Button variant="secondary" size="md" fullWidth>
                  Secondary Button
                </Button>
                <Button variant="outline" size="md" fullWidth>
                  Outline Button
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  Ghost Button
                </Button>
                <Button variant="text" size="md" fullWidth>
                  Text Button
                </Button>
              </div>
            </Card>

            {/* Card Variants */}
            <Card variant="glass" size="lg">
              <h3 className="text-xl font-bold text-akzentblau mb-6">Card Varianten</h3>
              <div className="space-y-4">
                <Card variant="default" size="sm">
                  <p className="text-sm">Default Card</p>
                </Card>
                <Card variant="elevated" size="sm">
                  <p className="text-sm">Elevated Card</p>
                </Card>
                <Card variant="outlined" size="sm">
                  <p className="text-sm">Outlined Card</p>
                </Card>
                <Card variant="glass" size="sm">
                  <p className="text-sm">Glass Card</p>
                </Card>
                <Card variant="premium" size="sm">
                  <p className="text-sm">Premium Card</p>
                </Card>
              </div>
            </Card>
          </Grid>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ConsolidatedComponentsExample;
