'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const features = [
  {
    icon: 'icon1.png',
    title: '100% Handmade',
    description: 'Each piece uniquely crafted by skilled Sri Lankan artisans using generations-old techniques.'
  },
  {
    icon: 'icon2.png',
    title: 'Natural & Safe',
    description: 'Crafted with natural clay, entirely free from harmful chemicals or synthetic additives.'
  },
  {
    icon: 'icon3.png',
    title: 'Fired to Perfection',
    description: 'High-temperature kiln-fired for exceptional strength, thermal resilience, and durability.'
  },
  {
    icon: 'icon4.png',
    title: 'Worldwide Shipping',
    description: 'Carefully packed and reliably delivered to your door, wherever you are in the world.'
  }
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function IconListSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(to right, #0a0a0a 0%, #111008 50%, #0a0a0a 100%)' }}
    >
      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8922a]/40 to-transparent" />
      {/* Bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b8922a]/40 to-transparent" />

      <motion.div
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative flex items-start gap-5 px-8 py-9
              /* vertical dividers between items */
              lg:[&:not(:last-child)]:after:content-['']
              lg:[&:not(:last-child)]:after:absolute
              lg:[&:not(:last-child)]:after:right-0
              lg:[&:not(:last-child)]:after:top-[15%]
              lg:[&:not(:last-child)]:after:h-[70%]
              lg:[&:not(:last-child)]:after:w-px
              lg:[&:not(:last-child)]:after:bg-gradient-to-b
              lg:[&:not(:last-child)]:after:from-transparent
              lg:[&:not(:last-child)]:after:via-[#b8922a]/30
              lg:[&:not(:last-child)]:after:to-transparent
            "
          >
            {/* Icon */}
            <div
              className="relative shrink-0 w-12 h-12 mt-0.5 transition-transform duration-300 group-hover:scale-110"
            >
              <Image
                src={`/images/${feature.icon}`}
                alt={feature.title}
                fill
                sizes="48px"
                style={{ objectFit: 'contain' }}
                className="transition-opacity duration-300 opacity-90 group-hover:opacity-100"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <h3
                className="font-italiana tracking-widest uppercase text-sm font-semibold leading-snug"
                style={{ color: '#d4a84b', letterSpacing: '0.12em' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-xs leading-relaxed font-roboto max-w-[190px]"
                style={{ color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}
              >
                {feature.description}
              </p>
            </div>

            {/* Subtle hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(180,138,50,0.06), transparent)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
