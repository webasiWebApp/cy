'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import GradientCircle from '../ui/GradientCircle';

export default function CTASection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-110">
        <Image 
          src="/images/footer.png" 
          alt="CY International" 
          fill 
          style={{ objectFit: 'cover', objectPosition: 'center' }} 
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(9,9,10,0.8)_0%,rgba(9,9,10,0.4)_50%,rgba(9,9,10,0.9)_100%)]" />

      {/* Decorative Circles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <GradientCircle image="circle" size={500} className="-left-20 top-1/2 -translate-y-1/2 opacity-30" />
        <GradientCircle image="circle" size={500} className="-right-20 top-1/2 -translate-y-1/2 opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-3xl mx-auto px-8 w-full">
        <motion.h2 
          className="font-italiana text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Elevate <span className="text-gold">Your Space</span> <br />
          with <span className="text-gold">Timeless Craft</span>
        </motion.h2>

        <motion.p 
          className="font-roboto font-light text-white/60 text-base md:text-lg max-w-xl mx-auto mt-6 mb-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Explore our collection of handcrafted clay products and sustainable agriculture solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Button 
            label="EXPLORE OUR WORLD →" 
            variant="primary" 
            className="px-10 py-4"
          />
        </motion.div>
      </div>

    </section>
  );
}
