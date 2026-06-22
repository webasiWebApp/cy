'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';

// Animated Counter Component
function Counter({ end, suffix }: { end: number, suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000; // 2 seconds
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { 
        setCount(end); 
        clearInterval(timer); 
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const icons = [
  { img: 'bed1.png', label: 'Durable' },
  { img: 'bed2.png', label: 'Microwave Safe' },
  { img: 'bed3.png', label: 'Food Safe' },
  { img: 'bed4.png', label: 'Dishwasher Safe' },
];

const counters = [
  { end: 4, suffix: "+", label: "Industry Sectors Under One Vision" },
  { end: 12, suffix: "+", label: "Countries Reached Across the Globe" },
  { end: 500, suffix: "+", label: "Handcrafted Pieces Delivered Annually" },
  { end: 6, suffix: "+", label: "Years of Artisan Excellence" },
];

export default function BeautySection() {
  return (
    <section className="relative py-28 px-8 md:px-16 lg:px-24 overflow-hidden border-t border-gold/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        
        {/* LEFT - Text + Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Animated Gold Line Reveal */}
          <motion.div
            className="w-0 h-px bg-gold/40 mb-8"
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <SectionHeading 
            eyebrow="OUR NUMBERS"
            title={
              <>
                Beauty in <br />
                Every <em>Detail.</em>
              </>
            }
          />

          <p className="font-roboto font-light text-white/60 text-sm leading-7 mt-6">
            Our clay products are designed to bring warmth and authenticity to your table. Each piece undergoes rigorous quality checks — from clay selection and wheel-throwing to firing temperatures and final inspection — ensuring every product that leaves our studio meets our standards of quiet excellence.
          </p>

          {/* ICON TAGS */}
          <div className="flex flex-wrap gap-4 mt-8 mb-12">
            {icons.map((icon, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 bg-white/5 border border-gold/10 px-4 py-2"
              >
                <div className="relative w-[18px] h-[18px]">
                  <Image 
                    src={`/images/${icon.img}`} 
                    alt={icon.label} 
                    fill 
                    sizes="18px"
                    style={{ objectFit: 'contain' }}
                    className="filter brightness-0 saturate-100 sepia-[100%] hue-rotate-[10deg]"
                  />
                </div>
                <span className="font-roboto text-xs text-white/70 tracking-wider">
                  {icon.label}
                </span>
              </div>
            ))}
          </div>

          <Button label="EXPLORE OUR WORLD →" variant="outline" href="#sectors" />
        </motion.div>

        {/* RIGHT - Counter Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 gap-px bg-gold/10"
        >
          {counters.map((counter, idx) => (
            <div 
              key={idx} 
              className="bg-dark p-10 flex flex-col items-start justify-center aspect-square md:aspect-auto md:h-64"
            >
              <div className="font-italiana text-6xl md:text-7xl text-gold mb-4">
                <Counter end={counter.end} suffix={counter.suffix} />
              </div>
              <p className="font-roboto text-xs text-white/50 tracking-wider uppercase mt-2 max-w-[150px] leading-relaxed">
                {counter.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
