"use client";
import React from "react";
import { Card, Grid, SectionWrapper } from "../ui";
import { useI18n } from "./I18nProvider";

export const WhyChooseUs: React.FC = () => {
  const { t } = useI18n();

  const vorteile = [
    {
      icon: "🎯",
      titel: t("why_choose_us.elemente.service.titel"),
      beschreibung: t("why_choose_us.elemente.service.beschreibung"),
    },
    {
      icon: "🌍",
      titel: t("why_choose_us.elemente.mehrsprachig.titel"),
      beschreibung: t("why_choose_us.elemente.mehrsprachig.beschreibung"),
    },
    {
      icon: "⚡",
      titel: t("why_choose_us.elemente.schnell.titel"),
      beschreibung: t("why_choose_us.elemente.schnell.beschreibung"),
    },
    {
      icon: "💡",
      titel: t("why_choose_us.elemente.innovativ.titel"),
      beschreibung: t("why_choose_us.elemente.innovativ.beschreibung"),
    },
  ];

  return (
    <SectionWrapper bg="white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dunkelgrau mb-6">
            {t("why_choose_us.titel")}
          </h2>
          <p className="text-xl text-dunkelgrau max-w-3xl mx-auto">
            {t("why_choose_us.untertitel")}
          </p>
        </div>
        <Grid cols={4} gapX="md" gapY="lg">
          {vorteile.map((vorteil, index) => (
            <Card key={index} variant="default" size="lg" interactive>
              <div className="text-5xl mb-6">{vorteil.icon}</div>
              <h3 className="text-xl font-semibold text-akzentblau mb-4">{vorteil.titel}</h3>
              <p className="text-dunkelgrau leading-relaxed">{vorteil.beschreibung}</p>
            </Card>
          ))}
        </Grid>
      </div>
    </SectionWrapper>
  );
};

export default WhyChooseUs;
