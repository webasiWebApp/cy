'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import Button from '../ui/Button';
import GradientCircle from '../ui/GradientCircle';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  type: 'video' | 'image';
  src: string;
  poster?: string;
  alt: string;
}

const slides: Slide[] = [
  { id: 0, type: 'video', src: '/Video/hero.mov', poster: '/images/hero/1.webp', alt: 'Crafting Nature Video' },
  { id: 1, type: 'image', src: '/images/hero/1.webp', alt: 'Handcrafted Clay Production 1' },
  { id: 2, type: 'image', src: '/images/hero/2.webp', alt: 'Handcrafted Clay Production 2' },
  { id: 3, type: 'image', src: '/images/hero/3.webp', alt: 'Handcrafted Clay Production 3' },
  { id: 4, type: 'image', src: '/images/hero/4.webp', alt: 'Handcrafted Clay Production 4' },
  { id: 5, type: 'image', src: '/images/hero/5.webp', alt: 'Handcrafted Clay Production 5' },
];

const SLIDE_DURATION = 6500; // 6.5 seconds

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [handleNext, currentIndex]);

  // Ensure video plays when active
  useEffect(() => {
    if (slides[currentIndex].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } 
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-end">
      {/* Background Carousel with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {currentSlide.type === 'video' ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={currentSlide.poster}
                className="w-full h-full object-cover pointer-events-none"
              >
                <source src={currentSlide.src} type="video/mp4" />
                <source src={currentSlide.src} type="video/quicktime" />
              </video>
            ) : (
              <motion.img
                src={currentSlide.src}
                alt={currentSlide.alt}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                className="w-full h-full object-cover pointer-events-none"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Gradients */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(9,9,10,0.92)_0%,rgba(9,9,10,0.5)_60%,rgba(9,9,10,0.1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(9,9,10,1)_0%,transparent_40%)] pointer-events-none" />

      {/* Decorative Circles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <GradientCircle image="circle" size={600} className="-left-40 top-20 opacity-30" />
        <GradientCircle image="circle1" size={800} className="-right-60 bottom-0 opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-20 px-8 md:px-0 lg:px-0 mb-32 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p variants={item} className="font-roboto text-xs tracking-[0.4em] text-gold/70 uppercase mb-4">
            PREMIUM HANDCRAFTED EXCELLENCE
          </motion.p>
          
          <motion.h1 variants={item} className="flex flex-col">
            <span className="font-italiana text-5xl md:text-7xl text-white leading-[1.1]">
              Crafting Nature.
            </span>
            <span className="font-italiana text-5xl md:text-7xl text-gold leading-[1.1]">
              Building the Future.
            </span>
          </motion.h1>
          
          <motion.p variants={item} className="font-roboto font-light text-white/90 text-base md:text-lg max-w-lg mt-6 leading-relaxed">
            Premium handcrafted clay products, sustainable agriculture, and future-focused
            ventures rooted in Sri Lankan craftsmanship and innovation.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-wrap gap-4 mt-10">
            <Button label="EXPLORE OUR WORLD →" variant="primary" href="#sectors" />
            <Button label="SEE MORE →" variant="outline" href="#about" />
          </motion.div>
        </motion.div>

        {/* Carousel Controls & Indicators */}
        <div className="flex flex-col items-start md:items-end gap-3 pb-2 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="p-2 rounded-full border border-white/20 bg-black/40 text-white/80 hover:text-gold hover:border-gold/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-roboto text-xs tracking-wider text-white/70 px-2 min-w-[50px] text-center">
              0{currentIndex + 1} / 0{slides.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="p-2 rounded-full border border-white/20 bg-black/40 text-white/80 hover:text-gold hover:border-gold/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-gold'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-gold pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ChevronDown size={24} className="opacity-80" />
      </motion.div>
    </section>
  );
}

