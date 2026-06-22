'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Our Industries', href: '/#sectors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-[rgba(9,9,10,0.85)] backdrop-blur-[20px] border-b border-gold/10" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="flex justify-between items-center px-8 md:px-16 lg:px-24 py-5">
        {/* LEFT - Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/images/logo.png" 
            alt="CY International" 
            width={48} 
            height={48}
          />
          {/* Optional Text Next to Logo if needed:
          <span className="font-italiana text-gold text-sm tracking-widest hidden sm:block">
            CY INTERNATIONAL
          </span>
          */}
        </Link>

        {/* CENTER - Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={cn(
                "relative font-roboto text-sm tracking-wide transition-colors duration-300",
                activeItem === item.name ? "text-gold" : "text-white/80 hover:text-gold"
              )}
            >
              {item.name}
              {activeItem === item.name && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT - Button & Mobile Toggle */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <Button label="CONTACT →" variant="outline" href="#contact" />
          </div>
          
          <button 
            className="md:hidden text-gold p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-dark flex flex-col"
          >
            <div className="flex justify-between items-center px-8 py-5 border-b border-gold/10">
              <Image 
                src="/images/logo.png" 
                alt="CY International" 
                width={48} 
                height={48} 
              />
              <button 
                className="text-gold p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={28} />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col justify-center items-center gap-8">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "font-italiana text-3xl tracking-wider transition-colors duration-300",
                    activeItem === item.name ? "text-gold" : "text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-8">
                <Button label="CONTACT US →" variant="primary" onClick={() => setMobileMenuOpen(false)} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
