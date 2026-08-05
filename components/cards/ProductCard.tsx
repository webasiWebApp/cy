'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Product {
  id?: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  whatsappMessage: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const WHATSAPP_NUMBER = '94786677891';

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  const safeIdx = Math.min(activeImageIdx, Math.max(0, imagesList.length - 1));
  const currentImage = imagesList[safeIdx] || product.image || '';

  // Auto hover slideshow
  useEffect(() => {
    if (isHovered && imagesList.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveImageIdx((prev) => (prev + 1) % imagesList.length);
      }, 1300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveImageIdx(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, imagesList.length]);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMessage)}`;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveImageIdx((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[rgba(255,255,255,0.02)] border border-gold/10 overflow-hidden
        hover:border-gold/30 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-dark-footer">
        <AnimatePresence mode="wait">
          <motion.div
            key={safeIdx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentImage.startsWith('http') ? currentImage : `/images/${currentImage}`}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-700 ease-in-out group-hover:scale-[1.05]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,9,10,0.7)] via-transparent to-transparent pointer-events-none z-10" />

        {/* Category badge */}
        <span className="absolute top-4 left-4 font-roboto text-[9px] tracking-[0.3em] uppercase text-gold/80 bg-[rgba(9,9,10,0.75)] backdrop-blur-sm border border-gold/20 px-3 py-1.5 z-20">
          {product.category}
        </span>

        {/* Interactive Hover Segments across image area */}
        {imagesList.length > 1 && (
          <div className="absolute inset-0 flex z-20 pointer-events-auto">
            {imagesList.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full cursor-pointer"
                onMouseEnter={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  setActiveImageIdx(i);
                }}
              />
            ))}
          </div>
        )}

        {/* Multi-Image Controls if > 1 image */}
        {imagesList.length > 1 && (
          <>
            {/* Prev / Next Buttons */}
            <button
              onClick={handlePrevImage}
              aria-label="Previous Image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dark/80 border border-gold/30 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-dark z-30"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next Image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-dark/80 border border-gold/30 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-dark z-30"
            >
              <ChevronRight size={14} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 bg-dark/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gold/15 pointer-events-none">
              {imagesList.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === safeIdx ? 'w-4 bg-gold' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Gold left-border reveal */}
        <div className="absolute left-0 bottom-0 w-[2px] h-full bg-gold scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-20 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-3">

        {/* Name */}
        <h3 className="font-poppins font-semibold text-lg text-white leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="font-roboto font-light text-white/50 text-xs leading-6 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
          <div>
            <p className="font-roboto text-[10px] tracking-[0.2em] text-white/35 uppercase mb-0.5">Price</p>
            <p className="font-poppins font-semibold text-xl text-gold leading-none">
              LKR {product.price.toLocaleString()}
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden border border-gold/40
              bg-transparent text-gold font-roboto text-[10px] tracking-[0.2em] uppercase px-4 py-2.5
              hover:text-dark hover:border-gold transition-colors duration-300
              before:absolute before:inset-0 before:bg-gold before:origin-left before:scale-x-0
              hover:before:scale-x-100 before:transition-transform before:duration-300 before:ease-in-out"
          >
            <MessageCircle size={13} className="relative z-10 shrink-0" />
            <span className="relative z-10">Inquire</span>
          </a>
        </div>
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-0 right-0 w-8 h-px bg-gold/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-px h-8 bg-gold/30 pointer-events-none" />
    </motion.article>
  );
}

