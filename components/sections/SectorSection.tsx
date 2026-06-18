'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import SectionHeading from '../ui/SectionHeading';
import SectorCard from '../cards/SectorCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sectors = [
  {
    index: "01",
    image: "sector1.png",
    title: "Handcrafted Clay Products",
    description: "Premium handcrafted clay bottles, mugs, cookware and tableware — crafted by skilled artisans with passion and tradition."
  },
  {
    index: "02",
    image: "sector2.png",
    title: "Agriculture & Farming",
    description: "Sustainable agriculture practices focused on quality produce. Currently cultivating watermelon and expanding our farms."
  },
  {
    index: "03",
    image: "sector3.png",
    title: "Export & International Trade",
    description: "Delivering Sri Lankan products to the world with a commitment to quality, compliance and long-term partnerships."
  },
  {
    index: "04",
    image: "sector4.png",
    title: "Future Ventures",
    description: "Innovating and investing in future industries that create value, drive growth and build a better tomorrow."
  }
];

export default function SectorSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="sectors" className="py-28 bg-dark overflow-hidden relative">
      {/* Header */}
      <motion.div 
        className="text-center mb-16 px-8 md:px-16 lg:px-24 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <SectionHeading 
          eyebrow="WHAT WE DO"
          title={<>Our Business <em>Sectors</em></>}
          subtitle="CY International is a diversified company with a strong foundation in quality, sustainability and innovation across multiple industries."
          align="center"
        />
      </motion.div>

      {/* Carousel Container */}
      <motion.div 
        className="pl-8 md:pl-16 lg:pl-24"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.85, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 pb-10">
            {sectors.map((sector) => (
              <SectorCard 
                key={sector.index}
                index={sector.index}
                image={sector.image}
                title={sector.title}
                description={sector.description}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 mt-8">
        {/* Dots */}
        <div className="flex gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-gold w-8' 
                  : 'border border-gold/30 hover:border-gold/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={scrollPrev} 
            disabled={!prevBtnEnabled}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
              !prevBtnEnabled 
                ? 'border-gold/20 text-gold/20 cursor-not-allowed' 
                : 'border-gold/40 text-gold hover:bg-gold hover:text-dark-footer'
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollNext} 
            disabled={!nextBtnEnabled}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
              !nextBtnEnabled 
                ? 'border-gold/20 text-gold/20 cursor-not-allowed' 
                : 'border-gold/40 text-gold hover:bg-gold hover:text-dark-footer'
            }`}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
