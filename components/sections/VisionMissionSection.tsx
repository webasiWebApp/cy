'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import GradientCircle from '../ui/GradientCircle';

const pillars = [
  { label: 'Industries', value: '4+' },
  { label: 'Countries Served', value: '10+' },
  { label: 'Years of Craft', value: '5+' },
  { label: 'Artisans', value: '50+' },
];

const cards = [
  {
    tag: 'VISION',
    title: 'A Global Enterprise.',
    subtitle: 'Inspired by Nature.',
    body: 'To become a diversified global enterprise inspired by nature, driven by innovation, and recognized for excellence, sustainability, and timeless craftsmanship.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <line x1="20" y1="2" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6.7" y1="6.7" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27.5" y1="27.5" x2="33.3" y2="33.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="33.3" y1="6.7" x2="27.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12.5" y1="27.5" x2="6.7" y2="33.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: 'MISSION',
    title: 'Creating Lasting Value.',
    subtitle: 'Across Every Industry.',
    body: 'To create value through premium products, sustainable agriculture, responsible business practices, and innovative ventures while maintaining excellence, authenticity, and long-term impact across every industry we enter.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 5 L35 32 L5 32 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="20" y1="15" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="27.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
];

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export default function VisionMissionSection() {
  return (
    <section className="relative py-28 px-8 md:px-16 lg:px-24 overflow-hidden border-t border-gold/10">

      {/* Decorative */}
      <GradientCircle image="circle" size={600} className="absolute left-1/2 -top-40 -translate-x-1/2 opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="font-roboto text-xs tracking-[0.4em] text-gold/70 uppercase mb-5">
            OUR FOUNDATION
          </p>
          <h2 className="font-italiana text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            What <em className="not-italic text-gold">Guides</em> Us
          </h2>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </motion.div>

        {/* Vision + Mission Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
        >
          {cards.map((card) => (
            <motion.div
              key={card.tag}
              variants={fadeUp}
              className="group relative overflow-hidden border border-gold/15 p-10 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-500"
            >
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-12 h-px bg-gold/50" />
              <div className="absolute top-0 left-0 w-px h-12 bg-gold/50" />
              <div className="absolute bottom-0 right-0 w-12 h-px bg-gold/50" />
              <div className="absolute bottom-0 right-0 w-px h-12 bg-gold/50" />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgba(180,138,50,0.07),transparent)]" />

              {/* Icon */}
              <div className="text-gold/70 mb-7 group-hover:text-gold transition-colors duration-300">
                {card.icon}
              </div>

              {/* Tag */}
              <span className="font-roboto text-[10px] tracking-[0.35em] text-gold/60 uppercase block mb-4">
                {card.tag}
              </span>

              {/* Title */}
              <h3 className="font-italiana text-3xl md:text-4xl text-white leading-tight mb-1">
                {card.title}
              </h3>
              <h4 className="font-italiana text-3xl md:text-4xl text-gold leading-tight mb-6">
                {card.subtitle}
              </h4>

              {/* Body */}
              <p className="font-roboto font-light text-white/90 text-sm leading-7">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gold/10"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              variants={fadeUp}
              className={`flex flex-col items-center justify-center py-10 px-6 text-center
                ${i < pillars.length - 1 ? 'border-r border-gold/10' : ''}
                hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300`}
            >
              <span className="font-italiana text-4xl md:text-5xl text-gold">{p.value}</span>
              <span className="font-roboto text-[10px] tracking-[0.3em] text-white/40 uppercase mt-2">{p.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
