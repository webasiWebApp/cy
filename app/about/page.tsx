import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import AboutPageHero from '@/components/sections/AboutPageHero';
import AboutContentSection from '@/components/sections/AboutContentSection';
import VisionMissionSection from '@/components/sections/VisionMissionSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'About Us | CY International',
  description:
    'CY International Pvt Ltd – a diversified Sri Lankan company built on craftsmanship, sustainability, and long-term vision. Discover our story, mission and values.',
};

export default function AboutPage() {
  return (
    <main className="bg-dark overflow-x-hidden selection:bg-gold/30 selection:text-gold-light">
      <Navbar />
      <AboutPageHero />
      <AboutContentSection />
      <VisionMissionSection />
      <CTASection />
      <Footer />
    </main>
  );
}
