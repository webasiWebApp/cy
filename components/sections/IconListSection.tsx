'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import GradientCircle from '../ui/GradientCircle';

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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
};

export default function IconListSection() {
  return (
    <section className="relative bg-dark py-20 px-8 md:px-16 lg:px-24 border-t border-gold/10 overflow-hidden">
      
      {/* Decorative Circle */}
      <GradientCircle image="circle1" size={500} className="absolute left-1/2 -top-40 -translate-x-1/2 opacity-20" />

      <motion.div 
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="px-8 py-10 sm:border-r border-b sm:border-b-0 lg:border-b-0 border-gold/10 last:border-r-0 last:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
          >
            <div className="relative w-10 h-10 mb-5">
              <Image 
                src={`/images/${feature.icon}`} 
                alt={feature.title} 
                fill 
                style={{ objectFit: 'contain' }}
                /* CSS filter trick to convert black/white icon to gold tint */
                className="filter brightness-0 saturate-100 sepia-[100%] hue-rotate-[10deg] opacity-90"
              />
            </div>
            
            <h3 className="font-italiana text-xl text-white mb-3">
              {feature.title}
            </h3>
            
            <p className="font-roboto text-sm text-white/55 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
