'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import GradientCircle from '../ui/GradientCircle';

export default function TraditionSection() {
  return (
    <section className="relative py-28 px-8 md:px-16 lg:px-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        
        {/* LEFT - Text Column */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          {/* Animated Gold Line Reveal */}
          <motion.div
            className="w-0 h-px bg-gold/40 mb-8"
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <SectionHeading 
            eyebrow="OUR CRAFT"
            title={
              <>
                Rooted in Tradition. <br />
                <em>Made by Hands.</em>
              </>
            }
          />

          <p className="font-roboto font-light text-white/90 text-sm leading-7 max-w-lg mt-6 mb-10">
            Every piece we make carries the touch of tradition, and the soul of the artisan. From forming the clay to the final fire, our process is a celebration of attention and art heritage. A living testament to Sri Lanka&apos;s rich legacy.
          </p>

          {/* NUMBERED LIST */}
          <div className="space-y-8">
            {/* Item 1 */}
            <div className="flex gap-6">
              <span className="font-roboto text-xs text-gold/50 tracking-widest pt-1">01</span>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-gold/20 w-10" />
                  <h4 className="font-roboto font-medium text-white text-sm tracking-wider uppercase">
                    EARTH TO FORM
                  </h4>
                </div>
                <p className="font-roboto text-xs text-white/90 leading-relaxed pl-14">
                  Each vessel begins as raw natural clay, shaped entirely by hand with time-honored tradition.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-6">
              <span className="font-roboto text-xs text-gold/50 tracking-widest pt-1">02</span>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-gold/20 w-10" />
                  <h4 className="font-roboto font-medium text-white text-sm tracking-wider uppercase">
                    FIRE & RESILIENCE
                  </h4>
                </div>
                <p className="font-roboto text-xs text-white/90 leading-relaxed pl-14">
                  Kiln-fired at high temperatures to build strength, longevity, and a timeless earthy finish.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-6">
              <span className="font-roboto text-xs text-gold/50 tracking-widest pt-1">03</span>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-gold/20 w-10" />
                  <h4 className="font-roboto font-medium text-white text-sm tracking-wider uppercase">
                    FINISH & HERITAGE
                  </h4>
                </div>
                <p className="font-roboto text-xs text-white/90 leading-relaxed pl-14">
                  Finished with care, each piece reflects the cultural depth and artisanal pride of Sri Lankan craft.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Image Column */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative h-[600px] w-full"
        >
          {/* Decorative Circle */}
          <GradientCircle image="circle" size={500} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-20" />
          
          <div className="relative w-full h-full shadow-[inset_20px_0_40px_rgba(9,9,10,0.5)] z-10 overflow-hidden">
            <Image 
              src="/images/tradition.webp" 
              alt="Crafting Process" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }} 
            />
            {/* Inner shadow overlay for the left edge effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dark to-transparent" />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
