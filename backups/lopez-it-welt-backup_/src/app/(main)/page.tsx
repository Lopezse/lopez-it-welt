import { Hauptbereiche } from '@/components/Core/Hauptbereiche';
import { Hero } from '@/components/Core/Hero';
import { FAQ } from '@/components/Features/FAQ';
import { KISicherheit } from '@/components/Features/KISicherheit';
import { Testimonials } from '@/components/Features/Testimonials';
import { WhyChooseUs } from '@/components/Features/WhyChooseUs';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <Hero />
      <Hauptbereiche />
      <WhyChooseUs />
      <KISicherheit />
      <Testimonials />
      <FAQ />
    </div>
  );
}
