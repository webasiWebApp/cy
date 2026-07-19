'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import GradientCircle from '../ui/GradientCircle';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export default function AboutPageHero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-dark pt-28 pb-20 px-8">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home.png"
          alt="About CY International"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority
        />
      </div>

      {/* Dark overlays */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(9,9,10,0.85)_0%,rgba(9,9,10,0.55)_50%,rgba(9,9,10,0.95)_100%)]" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(9,9,10,0.4)_0%,transparent_40%,rgba(9,9,10,0.4)_100%)]" />

      {/* Decorative circles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <GradientCircle image="circle" size={600} className="-left-40 top-0 opacity-25" />
        <GradientCircle image="circle1" size={500} className="-right-40 bottom-0 opacity-20" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full"
      >
        {/* Logo */}
        <motion.div variants={item} className="mb-8">
          <Image
            src="/images/logo.png"
            alt="CY International Logo"
            width={72}
            height={72}
            style={{ width: 'auto', height: 'auto' }}
            className="w-16 h-16 md:w-[72px] md:h-[72px]"
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="font-roboto text-xs tracking-[0.4em] text-gold/70 uppercase mb-5"
        >
          WHO WE ARE
        </motion.p>

        {/* Main Heading */}
        <motion.h1 variants={item} className="flex flex-col items-center gap-1">
          <span className="font-italiana text-5xl md:text-7xl text-white leading-[1.1]">
            One Vision.
          </span>
          <span className="font-italiana text-5xl md:text-7xl text-gold leading-[1.1]">
            Endless Possibilities.
          </span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          variants={item}
          className="font-roboto font-light text-white/60 text-base md:text-lg max-w-2xl mt-7 leading-relaxed"
        >
          Crafting a future where heritage, sustainability, innovation, and global ambition
          grow together under one visionary brand.
        </motion.p>

        {/* Gold divider line */}
        <motion.div
          className="mt-10 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '160px', opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
        />
      </motion.div>
    </section>
  );
}
