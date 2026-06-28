'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import SectionHeading from '../ui/SectionHeading';
import InsightCard from '../cards/InsightCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const feedbacks = [
  { 
    name: "Römeka Nanayakkara Perera", 
    review: "Highly recommend. Love the products and good customer service. Best wishes for future success" 
  },
  { 
    name: "Araliya Mandakini", 
    review: "මුලින්ම කියන්නම ඕනි customer care එක නම් හරිම සුහදශීලී..ඉල්ලුව හැමදේම හරියටම,හරි වෙලාවටම එවලා තිබුනා.ඒකත් COD.අපිව විශ්වාස කරලා එවනවට බොහොම ස්තුති.හරිම පරිස්සමෙන් මං ඉල්ලුව සෙට් එකම එවලා තිබුනා ❤️🤝" 
  },
  { 
    name: "Udawalawe Tusker Safari Service", 
    review: "Hi, I bought 4 curry bowls, 1 rice bowl and 5 table mats for all the bowls. It was great. No any damages. Within one day, they delivered to us. And they were brought very carefully packed. Highly recommended these products. Thank you so much for great service and the products with reasonable price and superb quality. It was a family business I think. Really appreciate their service. I will definitely buy again. 😊 Thank you!" 
  },
  { 
    name: "Nilu Abeysinghe", 
    review: "⭐⭐⭐⭐⭐ Very good quality clay curry pot 👍 Strong, neat, and food tastes great. Highly recommended! 😊" 
  },
  { 
    name: "Shaku Uddeepani", 
    review: "very freindly team, gives exactly whats shown in the images. Quality is really good 😍😍. Delivered within 2 days to my location. Got a free gift as well. thank you C Y international team. keep up the good work. I'll surely order again and again 😍🤩" 
  },
  { 
    name: "Riznoon Mohamed", 
    review: "From my experience, CY customer service team is committed to providing prompt and attentive support. They offer fast delivery options to ensure orders arrive on time, along with high-quality, eco-friendly products. Additionally, they stand behind the quality of their items; if any products arrive damaged, they provide warranty replacements to guarantee customer satisfaction, which was a big plus for me. Highly recommended for a reliable and environmentally conscious shopping experience. 10/10." 
  }
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
              eyebrow="TESTIMONIALS"
              title={<>Customer <em>Feedback</em></>}
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
          <div className="flex gap-6 pb-10 items-stretch">
            {feedbacks.map((feedback, idx) => (
              <InsightCard 
                key={idx}
                name={feedback.name}
                review={feedback.review}
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
