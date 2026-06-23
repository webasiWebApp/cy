'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';

export default function CTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Create a noticeable parallax moving effect
  const y = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <section ref={containerRef} className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-dark">
      
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-[1.2]">
        <Image 
          src="/images/footer.png" 
          alt="CY International" 
          fill 
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }} 
          priority
        />
      </motion.div>

      {/* Gentle overlay to ensure text is readable but spotlight is preserved */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(9,9,10,0.9)_0%,transparent_40%,transparent_60%,rgba(9,9,10,0.9)_100%)]" />
      <div className="absolute inset-0 z-10 bg-dark/20" />

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-8 w-full -mt-20">
        <motion.h2 
          className="font-italiana font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-[1.2]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-gold">Elevate</span> Your <span className="text-gold">Space</span> <br />
          <span className="text-gold">with</span> Timeless <span className="text-gold">Craft</span>
        </motion.h2>

        <motion.p 
          className="text-white/80 text-xs md:text-sm max-w-2xl mx-auto mt-6 mb-8 tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Explore our collection of handcrafted clay products and sustainable agriculture solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Button 
            label="EXPLORE OUR WORLD →" 
            variant="primary" 
            className="px-8 py-3 text-xs tracking-[0.2em]"
          />
        </motion.div>
      </div>

    </section>
  );
}
