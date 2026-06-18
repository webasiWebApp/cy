'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';
import GradientCircle from '../ui/GradientCircle';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 px-8 md:px-16 lg:px-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        
        {/* LEFT - Image Column */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative order-2 lg:order-1"
        >
          {/* Decorative Circle */}
          <GradientCircle image="circle1" size={400} className="absolute -left-20 -bottom-20 opacity-25" />
          
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] z-10">
            {/* Offset border frame */}
            <div className="absolute inset-0 border border-gold/20 translate-x-4 translate-y-4" />
            <div className="relative w-full h-full overflow-hidden">
              <Image 
                src="/images/about.png" 
                alt="About CY International" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Text Column */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 order-1 lg:order-2"
        >
          {/* Animated Gold Line Reveal */}
          <motion.div
            className="w-0 h-px bg-gold/40 mb-8"
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <SectionHeading 
            eyebrow="WHO WE ARE"
            title={
              <>
                One Vision. Multiple <br className="hidden md:block" />
                <em>Industries.</em> Endless <br className="hidden md:block" />
                Possibilities
              </>
            }
          />

          {/* Decorative Logo Mark */}
          <div className="my-8">
            <Image 
              src="/images/logo.png" 
              alt="Logo Mark" 
              width={100} 
              height={100} 
              className="opacity-30 mix-blend-screen w-20 h-20 md:w-[100px] md:h-[100px]" 
            />
          </div>

          <div className="space-y-6 font-roboto font-light text-white/60 text-sm leading-7">
            <p>
              CY International Pvt Ltd is a diversified Sri Lankan company built on a foundation of craftsmanship, sustainability, and long-term vision. What began with handcrafted clay creations has evolved into a growing multi-industry enterprise expanding into agriculture, exports, and future innovative ventures.
            </p>
            <p>
              Driven by passion and purpose, we believe true value is created by combining natural resources, skilled craftsmanship, modern thinking, and responsible business practices. Every sector we enter reflects our commitment to quality, authenticity, and meaningful growth.
            </p>
            <p>
              From premium handcrafted clay products to sustainable agricultural initiatives, our journey is guided by innovation, resilience, and a vision to create lasting impact both locally and internationally.
            </p>
          </div>

          <div className="mt-10">
            <Button label="MORE ABOUT US →" variant="outline" />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
