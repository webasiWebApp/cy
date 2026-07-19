'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import GradientCircle from '../ui/GradientCircle';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function AboutContentSection() {
  return (
    <section className="relative py-28 px-8 md:px-16 lg:px-24 overflow-hidden">

      {/* Decorative circles */}
      <GradientCircle image="circle1" size={500} className="absolute -right-32 top-0 opacity-15 pointer-events-none" />
      <GradientCircle image="circle" size={400} className="absolute -left-20 bottom-20 opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* LEFT – Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative order-2 lg:order-1"
        >
          <GradientCircle image="circle1" size={380} className="absolute -left-16 -bottom-16 opacity-25 pointer-events-none" />

          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] z-10">
            {/* Offset border frame */}
            <div className="absolute inset-0 border border-gold/20 translate-x-4 translate-y-4" />
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/images/about.png"
                alt="About CY International"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              {/* Gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Floating logo badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -bottom-6 -right-4 z-20 bg-[rgba(9,9,10,0.85)] backdrop-blur-sm border border-gold/20 p-4 flex items-center gap-3"
          >
            <Image src="/images/logo.png" alt="CY International" width={36} height={36} />
            <div>
              <p className="font-italiana text-gold text-sm tracking-wider leading-none">CY International</p>
              <p className="font-roboto text-[10px] text-white/90 tracking-widest uppercase mt-1">Est. Sri Lanka</p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT – Text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative z-10 order-1 lg:order-2"
        >
          {/* Gold line reveal */}
          <motion.div
            className="w-0 h-px bg-gold/40 mb-8"
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          <motion.div variants={fadeUp}>
            <SectionHeading
              eyebrow="ABOUT US"
              title={
                <>
                  Built on <em>Craftsmanship.</em>
                  <br className="hidden md:block" />
                  Driven by <em>Vision.</em>
                </>
              }
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 space-y-6 font-roboto font-light text-white/90 text-sm leading-7">
            <p>
              CY International Pvt Ltd is a diversified Sri Lankan company built on a foundation of
              craftsmanship, sustainability, and long-term vision. What began with handcrafted clay
              creations has evolved into a growing multi-industry enterprise expanding into
              agriculture, exports, and future innovative ventures.
            </p>
            <p>
              Driven by passion and purpose, we believe true value is created by combining natural
              resources, skilled craftsmanship, modern thinking, and responsible business practices.
              Every sector we enter reflects our commitment to quality, authenticity, and meaningful growth.
            </p>
            <p>
              From premium handcrafted clay products to sustainable agricultural initiatives, our
              journey is guided by innovation, resilience, and a vision to create lasting impact both
              locally and internationally.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
