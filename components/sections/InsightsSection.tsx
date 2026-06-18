'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import SectionHeading from '../ui/SectionHeading';
import InsightCard from '../cards/InsightCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const insights = [
  { 
    category: "CRAFTSMANSHIP", 
    title: "The Art of Clay: How Sri Lankan Tradition Shapes Our Work", 
    review: "Our clay products are designed to bring warmth and authenticity to your table. Each piece undergoes rigorous quality from clay selection and wheel-throwing, guided by generations of artisan knowledge.", 
    date: "Jan 2025" 
  },
  { 
    category: "CRAFTSMANSHIP", 
    title: "The Art of Clay: How Sri Lankan Tradition Shapes Our Work", 
    review: "Our clay products are designed to bring warmth and authenticity to your table. Each piece undergoes rigorous quality from clay selection and wheel-throwing, guided by generations of artisan knowledge.", 
    date: "Feb 2025" 
  },
  { 
    category: "AGRICULTURE", 
    title: "From Soil to Table: Our Sustainable Farming Journey", 
    review: "We believe sustainable agriculture isn't just a practice — it's a philosophy. From watermelon cultivation to soil preservation, every crop we grow tells a story of care.", 
    date: "Mar 2025" 
  },
  { 
    category: "EXPORT", 
    title: "Taking Sri Lanka to the World: Our Export Vision", 
    review: "Quality is our passport. Through rigorous compliance, trusted partnerships, and a commitment to Sri Lankan heritage, we bring our best to international markets.", 
    date: "Apr 2025" 
  },
  { 
    category: "CRAFTSMANSHIP", 
    title: "The Art of Clay: How Sri Lankan Tradition Shapes Our Work", 
    review: "Our clay products are designed to bring warmth and authenticity to your table. Each piece undergoes rigorous quality from clay selection and wheel-throwing, guided by generations of artisan knowledge.", 
    date: "May 2025" 
  },
];

export default function InsightsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-28 bg-dark overflow-hidden relative">
      
      {/* Header Container */}
      <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <SectionHeading 
              title={<>Insights & <em>Stories</em></>}
            />
          </motion.div>

          {/* Navigation Controls (Desktop) */}
          <div className="hidden md:flex gap-4">
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
      </div>

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
            {insights.map((insight, idx) => (
              <InsightCard 
                key={idx}
                category={insight.category}
                title={insight.title}
                review={insight.review}
                date={insight.date}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Navigation Controls (Mobile) */}
      <div className="flex md:hidden justify-center gap-4 mt-4">
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

    </section>
  );
}
