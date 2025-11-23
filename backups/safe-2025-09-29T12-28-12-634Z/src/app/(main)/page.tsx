import { Hauptbereiche } from "@/components/Core/Hauptbereiche";
import { Hero } from "@/components/Core/Hero";
import { FAQ } from "@/components/Features/FAQ";
import { KISicherheit } from "@/components/Features/KISicherheit";
import { Testimonials } from "@/components/Features/Testimonials";
import { WhyChooseUs } from "@/components/Features/WhyChooseUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lopez IT Welt - Enterprise++ IT-Lösungen",
  description:
    "Professionelle IT-Dienstleistungen, Webentwicklung und Enterprise-Lösungen von Lopez IT Welt. Moderne Technologien, deutsche Qualität.",
  keywords: "IT-Dienstleistungen, Webentwicklung, Enterprise, Next.js, React, TypeScript",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Hauptbereiche />
      <WhyChooseUs />
      <KISicherheit />
      <Testimonials />
      <FAQ />
    </div>
  );
}
