import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import IconListSection from '@/components/sections/IconListSection'
import AboutSection from '@/components/sections/AboutSection'
import SectorSection from '@/components/sections/SectorSection'
import TraditionSection from '@/components/sections/TraditionSection'
import BeautySection from '@/components/sections/BeautySection'
import InsightsSection from '@/components/sections/InsightsSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="bg-dark overflow-x-hidden selection:bg-gold/30 selection:text-gold-light">
      <Navbar />
      <HeroSection />
      <IconListSection />
      <AboutSection />
      <SectorSection />
      <TraditionSection />
      <BeautySection />
      <InsightsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
