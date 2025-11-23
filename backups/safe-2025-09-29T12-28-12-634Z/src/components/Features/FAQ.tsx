/**
 * 'use client';
 * @description Auto-generated documentation
 */
"use client";
import { useState } from "react";
import { SectionWrapper } from "../ui";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "Welche IT-Services bieten Sie an?",
    answer:
      "Wir bieten umfassende IT-Dienstleistungen: IT-Support, PC-Bau, Webdesign, KI-Assistenz, Cybersecurity und Cloud-Lösungen. Alle Services sind barrierefrei und mehrsprachig verfügbar.",
    category: "services",
  },
  {
    question: "Wie schnell können Sie bei IT-Problemen helfen?",
    answer:
      "Bei kritischen Problemen sind wir innerhalb von 2-4 Stunden erreichbar. Für Remote-Support bieten wir sofortige Hilfe, für Vor-Ort-Service innerhalb von 24 Stunden.",
    category: "support",
  },
  {
    question: "Sind Ihre Webdesign-Lösungen barrierefrei?",
    answer:
      "Ja, alle unsere Websites erfüllen WCAG 2.1 AA/AAA Standards. Wir implementieren Screen Reader Support, Keyboard Navigation und hohe Kontraste für maximale Zugänglichkeit.",
    category: "webdesign",
  },
  {
    question: "Wie sicher sind Ihre KI-Lösungen?",
    answer:
      "Alle KI-Lösungen sind DSGVO-konform und verwenden deutsche Server. Wir implementieren End-to-End Verschlüsselung und bieten lokale Verarbeitung für sensible Daten.",
    category: "security",
  },
  {
    question: "Können Sie Gaming-PCs nach individuellen Wünschen bauen?",
    answer:
      "Ja, wir bauen maßgeschneiderte Gaming-PCs nach Ihren Anforderungen. Von Budget- bis High-End-Systemen mit Qualitätskomponenten und umfassender Einrichtung.",
    category: "hardware",
  },
  {
    question: "Bieten Sie Cloud-Migration an?",
    answer:
      "Ja, wir unterstützen Sie bei der Migration zu Microsoft 365, Google Workspace oder anderen Cloud-Lösungen. Inklusive Schulung und Support für Ihre Mitarbeiter.",
    category: "cloud",
  },
  {
    question: "Wie funktioniert der Remote-Support?",
    answer:
      "Über sichere Remote-Verbindungen können wir direkt auf Ihrem System arbeiten. Das spart Zeit und Kosten. Alle Verbindungen sind verschlüsselt und DSGVO-konform.",
    category: "support",
  },
  {
    question: "Welche Zahlungsarten akzeptieren Sie?",
    answer:
      "Wir akzeptieren Banküberweisung, PayPal und Kreditkarte. Für Unternehmen bieten wir auch Rechnung mit 30 Tagen Zahlungsziel an.",
    category: "payment",
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
    );
  };

  const categories = [
    "all",
    "services",
    "support",
    "webdesign",
    "security",
    "hardware",
    "cloud",
    "payment",
  ];

  const filteredFAQ =
    selectedCategory === null || selectedCategory === "all"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  return (
    <SectionWrapper bg="darkblau">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-weiss mb-6">
            Häufig gestellte Fragen
          </h2>
          <p className="text-xl text-weiss/80 max-w-3xl mx-auto">
            Antworten auf die wichtigsten Fragen zu unseren IT-Dienstleistungen
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-akzentblau text-white"
                  : "bg-weiss/10 text-weiss hover:bg-weiss/20"
              }`}
            >
              {category === "all"
                ? "Alle"
                : category === "services"
                  ? "Services"
                  : category === "support"
                    ? "Support"
                    : category === "webdesign"
                      ? "Webdesign"
                      : category === "security"
                        ? "Sicherheit"
                        : category === "hardware"
                          ? "Hardware"
                          : category === "cloud"
                            ? "Cloud"
                            : "Zahlung"}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {selectedCategory ? (
          <div className="space-y-2">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-weiss/10 border border-weiss/20 shadow-lg rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-weiss/20 transition-colors"
                >
                  <h3 className="text-base font-semibold text-weiss pr-2">{item.question}</h3>
                  <span className="text-akzentblau text-xl transition-transform duration-300">
                    {openItems.includes(index) ? "−" : "+"}
                  </span>
                </button>
                {openItems.includes(index) && (
                  <div className="px-4 pb-3">
                    <p className="text-weiss/80 leading-relaxed text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-weiss/60 py-8">Bitte wählen Sie eine Kategorie.</div>
        )}
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-weiss/80 mb-6">Haben Sie weitere Fragen?</p>
          <button className="px-8 py-4 text-lg font-semibold bg-akzentblau text-white rounded-2xl shadow-xl hover:bg-akzentblau/80 transition-colors focus:outline-none focus:ring-4 focus:ring-weiss/80 focus:ring-offset-2 focus:ring-offset-akzentblau">
            Kontakt aufnehmen
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default FAQ;
