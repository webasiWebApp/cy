'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import GradientCircle from '../ui/GradientCircle';

const pillars = [
  { label: 'Industries', value: '4+' },
  { label: 'Happy Clients', value: '100+' },
  { label: 'Years of Craft', value: '5+' },
  { label: 'Artisans', value: '50+' },
];

/* ─── Premium SVG Icons ─────────────────────────────── */
const VisionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16" strokeLinecap="round" strokeLinejoin="round">
    {/* Telescope body */}
    <ellipse cx="32" cy="28" rx="18" ry="10" stroke="currentColor" strokeWidth="1.4" />
    {/* Lens ring */}
    <ellipse cx="32" cy="28" rx="8" ry="4.5" stroke="currentColor" strokeWidth="1.4" />
    {/* Centre dot */}
    <circle cx="32" cy="28" r="2" fill="currentColor" />
    {/* Top ray */}
    <line x1="32" y1="4" x2="32" y2="14" stroke="currentColor" strokeWidth="1.2" />
    {/* Diagonal rays */}
    <line x1="14" y1="10" x2="22" y2="19" stroke="currentColor" strokeWidth="1.2" />
    <line x1="50" y1="10" x2="42" y2="19" stroke="currentColor" strokeWidth="1.2" />
    {/* Side rays */}
    <line x1="4"  y1="28" x2="14" y2="28" stroke="currentColor" strokeWidth="1.2" />
    <line x1="50" y1="28" x2="60" y2="28" stroke="currentColor" strokeWidth="1.2" />
    {/* Base tripod */}
    <line x1="32" y1="38" x2="24" y2="56" stroke="currentColor" strokeWidth="1.4" />
    <line x1="32" y1="38" x2="32" y2="56" stroke="currentColor" strokeWidth="1.4" />
    <line x1="32" y1="38" x2="40" y2="56" stroke="currentColor" strokeWidth="1.4" />
    {/* Base foot */}
    <line x1="22" y1="56" x2="42" y2="56" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const MissionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16" strokeLinecap="round" strokeLinejoin="round">
    {/* Compass outer ring */}
    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="1.4" />
    {/* Inner ring */}
    <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
    {/* North needle — gold fill */}
    <polygon points="32,10 36,32 32,28 28,32" fill="currentColor" />
    {/* South needle — outline */}
    <polygon points="32,54 36,32 32,36 28,32" stroke="currentColor" strokeWidth="1.2" fill="none" />
    {/* Centre */}
    <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    {/* Cardinal tick marks */}
    <line x1="32" y1="6"  x2="32" y2="10" stroke="currentColor" strokeWidth="1.6" />
    <line x1="32" y1="54" x2="32" y2="58" stroke="currentColor" strokeWidth="1.6" />
    <line x1="6"  y1="32" x2="10" y2="32" stroke="currentColor" strokeWidth="1.6" />
    <line x1="54" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ─── Framer variants ───────────────────────────────── */
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } }
};

/* ─── Card data ─────────────────────────────────────── */
const cards = [
  {
    tag: 'VISION',
    title: 'A Global Enterprise.',
    subtitle: 'Inspired by Nature.',
    body: 'To become a diversified global enterprise inspired by nature, driven by innovation, and recognized for excellence, sustainability, and timeless craftsmanship.',
    icon: <VisionIcon />,
    gradient: 'radial-gradient(ellipse 80% 70% at 20% 30%, rgba(180,138,50,0.12), transparent 70%)',
  },
  {
    tag: 'MISSION',
    title: 'Creating Lasting Value.',
    subtitle: 'Across Every Industry.',
    body: 'To create value through premium products, sustainable agriculture, responsible business practices, and innovative ventures while maintaining excellence, authenticity, and long-term impact across every industry we enter.',
    icon: <MissionIcon />,
    gradient: 'radial-gradient(ellipse 80% 70% at 80% 70%, rgba(180,138,50,0.12), transparent 70%)',
  },
];

export default function VisionMissionSection() {
  return (
    <section className="relative py-32 px-8 md:px-16 lg:px-24 overflow-hidden border-t border-gold/10">

      {/* Decorative ambient glow */}
      <GradientCircle image="circle" size={700} className="absolute left-1/2 -top-52 -translate-x-1/2 opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <p className="font-roboto text-[10px] tracking-[0.5em] text-gold/60 uppercase mb-6">
            OUR FOUNDATION
          </p>
          <h2 className="font-italiana text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            What <em className="not-italic text-gold">Guides</em> Us
          </h2>
          <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </motion.div>

        {/* ── Vision + Mission Cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24"
        >
          {cards.map((card) => (
            <motion.div
              key={card.tag}
              variants={fadeUp}
              className="group relative overflow-hidden"
              style={{ minHeight: '480px' }}
            >
              {/* ── Outer border frame ── */}
              <div className="absolute inset-0 border border-gold/20 pointer-events-none z-10" />

              {/* ── Corner ornaments ── */}
              {/* top-left */}
              <div className="absolute top-0 left-0 w-16 h-px bg-gold/60 z-10" />
              <div className="absolute top-0 left-0 w-px h-16 bg-gold/60 z-10" />
              {/* top-right */}
              <div className="absolute top-0 right-0 w-16 h-px bg-gold/60 z-10" />
              <div className="absolute top-0 right-0 w-px h-16 bg-gold/60 z-10" />
              {/* bottom-left */}
              <div className="absolute bottom-0 left-0 w-16 h-px bg-gold/60 z-10" />
              <div className="absolute bottom-0 left-0 w-px h-16 bg-gold/60 z-10" />
              {/* bottom-right */}
              <div className="absolute bottom-0 right-0 w-16 h-px bg-gold/60 z-10" />
              <div className="absolute bottom-0 right-0 w-px h-16 bg-gold/60 z-10" />

              {/* ── Background ── */}
              <div className="absolute inset-0 bg-[rgba(255,255,255,0.025)]" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: card.gradient }}
              />

              {/* ── Subtle grid pattern ── */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(237,191,126,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(237,191,126,0.6) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />

              {/* ── Card content ── */}
              <div className="relative z-20 flex flex-col h-full p-12 lg:p-16">

                {/* Tag */}
                <span className="font-roboto text-[9px] tracking-[0.5em] text-gold/50 uppercase block mb-10">
                  — {card.tag}
                </span>

                {/* Icon */}
                <div className="text-gold/60 group-hover:text-gold transition-colors duration-500 mb-10">
                  {card.icon}
                </div>

                {/* Title block */}
                <div className="mb-8">
                  <h3 className="font-italiana text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-2">
                    {card.title}
                  </h3>
                  <h4 className="font-italiana text-4xl md:text-5xl lg:text-6xl text-gold leading-[1.1]">
                    {card.subtitle}
                  </h4>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-gold/30 mb-8" />

                {/* Body */}
                <p className="font-roboto font-light text-white/70 text-[15px] leading-8 max-w-md mt-auto">
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-4 border border-gold/15"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              variants={fadeUp}
              className={`flex flex-col items-center justify-center py-12 px-6 text-center
                ${i < pillars.length - 1 ? 'border-r border-gold/15' : ''}
                hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300 group`}
            >
              <span
                className="text-5xl md:text-6xl text-gold leading-none tracking-tight group-hover:scale-105 transition-transform duration-300"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
              >
                {p.value}
              </span>
              <span className="font-roboto text-[9px] tracking-[0.35em] text-white/35 uppercase mt-3">
                {p.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
