/**
 * 'use client';
 * @description Auto-generated documentation
 */
"use client";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "Was macht Lopez IT Welt besonders?",
    answer:
      "Wir kombinieren moderne IT-Technologie mit einem besonderen Fokus auf Barrierefreiheit und persönliche Betreuung. Unsere Lösungen sind mehrsprachig, DSGVO-konform und für alle Nutzer zugänglich.",
    category: "Allgemein",
  },
  {
    question: "Welche Sprachen unterstützen Sie?",
    answer:
      "Wir bieten unsere Dienstleistungen in Deutsch, Englisch und Spanisch an. Alle unsere Websites und Systeme sind mehrsprachig konfiguriert.",
    category: "Service",
  },
  {
    question: 'Was bedeutet "barrierefreie" Webentwicklung?',
    answer:
      "Barrierefreie Webentwicklung bedeutet, dass unsere Websites für alle Menschen zugänglich sind - auch für Menschen mit Einschränkungen. Wir folgen den WCAG 2.1 AAA Standards.",
    category: "Technik",
  },
  {
    question: "Können Sie bei Behördenangelegenheiten helfen?",
    answer:
      "Ja, wir haben umfangreiche Erfahrung mit Jobcenter, Krankenkassen und anderen Behörden. Wir helfen bei Anträgen, Formularen und der digitalen Kommunikation.",
    category: "Service",
  },
  {
    question: "Wie schnell können Sie ein Projekt umsetzen?",
    answer:
      "Die Dauer hängt von der Komplexität ab. Eine einfache Website kann in 1-2 Wochen fertig sein, komplexere Projekte benötigen 4-8 Wochen. Wir besprechen das gerne persönlich.",
    category: "Projekte",
  },
  {
    question: "Bieten Sie auch Remote-Support an?",
    answer:
      "Ja, wir bieten sowohl Remote- als auch Vor-Ort-Support an. Für viele Probleme können wir schnell und effizient per Fernzugriff helfen.",
    category: "Support",
  },
  {
    question: "Was kostet eine Website?",
    answer:
      "Die Kosten hängen von Ihren Anforderungen ab. Wir erstellen Ihnen gerne ein individuelles Angebot. Unsere Preise sind transparent und fair.",
    category: "Preise",
  },
  {
    question: "Können Sie auch bestehende Websites optimieren?",
    answer:
      "Ja, wir können bestehende Websites barrierefrei machen, modernisieren oder erweitern. Wir analysieren gerne Ihre aktuelle Website und schlagen Verbesserungen vor.",
    category: "Technik",
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");

  const categories = ["Alle", ...Array.from(new Set(faqData.map((item) => item.category)))];

  const filteredFAQ =
    selectedCategory === "Alle"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-weiss mb-4">Häufig gestellte Fragen</h2>
          <p className="text-xl text-hellgrau">
            Antworten auf die wichtigsten Fragen zu unseren Dienstleistungen
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-akzentblau text-weiss shadow-lg"
                  : "bg-weiss/10 text-hellgrau hover:bg-weiss/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-weiss/10 rounded-xl border border-weiss/20 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-weiss/10 transition-colors"
              >
                <h3 className="text-lg font-semibold text-weiss pr-4">{item.question}</h3>
                <span className="text-akzentblau text-2xl transition-transform duration-300">
                  {openItems.includes(index) ? "−" : "+"}
                </span>
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-hellgrau leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
