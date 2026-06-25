'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Button from '../ui/Button';
import GradientCircle from '../ui/GradientCircle';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

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

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-end">
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image 
          src="/images/home.png" 
          alt="CY International Hero Background" 
          fill 
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }} 
          priority 
        />
      </motion.div>

      {/* Gradients */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(9,9,10,0.92)_0%,rgba(9,9,10,0.5)_60%,rgba(9,9,10,0.1)_100%)]" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(9,9,10,1)_0%,transparent_40%)]" />

      {/* Decorative Circles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <GradientCircle image="circle" size={600} className="-left-40 top-20 opacity-30" />
        <GradientCircle image="circle1" size={800} className="-right-60 bottom-0 opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-20 px-8 md:px-0 lg:px-0 mb-32 w-full max-w-7xl mx-auto">
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
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-gold"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ChevronDown size={24} className="opacity-80" />
      </motion.div>
    </section>
  );
}
