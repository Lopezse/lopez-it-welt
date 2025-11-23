"use client";
import React from "react";
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
    <section className="py-16 bg-weiss dark:bg-dunkelgrau">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dunkelgrau dark:text-weiss mb-4">
          {t("why_choose_us.titel")}
        </h2>
        <p className="text-center text-dunkelgrau dark:text-hellgrau mb-12 max-w-2xl mx-auto">
          {t("why_choose_us.untertitel")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vorteile.map((vorteil, index) => (
            <div
              key={index}
              className="bg-hellgrau dark:bg-dunkelgrau p-6 rounded-lg text-center hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{vorteil.icon}</div>
              <h3 className="text-xl font-semibold text-hauptblau dark:text-akzentblau mb-2">
                {vorteil.titel}
              </h3>
              <p className="text-dunkelgrau dark:text-hellgrau">{vorteil.beschreibung}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
